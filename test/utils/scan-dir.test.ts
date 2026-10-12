import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import fse from 'fs-extra';
import path from 'node:path';
import { DirScanner, ScanDir } from '../../src/utils/scan-dir.js';
import { FileTyp } from '../../src/types/enums.js';

const testPath = path.resolve('local', '__tests__', 'scan-dir');

// three levels of three directories each: 27 directories on the deepest level,
// far more than the limit of directories read at the same time
async function buildTree(dir: string, level: number): Promise<void> {
	await fse.ensureDir(dir);
	await fse.writeFile(path.join(dir, `track-${level}.mp3`), 'audio');
	await fse.writeFile(path.join(dir, 'cover.png'), 'image');
	await fse.writeFile(path.join(dir, '.hidden'), 'hidden');
	if (level >= 3) {
		return;
	}
	for (let nr = 1; nr <= 3; nr++) {
		await buildTree(path.join(dir, `level${level + 1}-${nr}`), level + 1);
	}
}

function countDirectories(dir: ScanDir): number {
	return 1 + dir.directories.reduce((total, sub) => total + countDirectories(sub), 0);
}

function countFiles(dir: ScanDir, type: FileTyp): number {
	return dir.files.filter(file => file.type === type).length +
		dir.directories.reduce((total, sub) => total + countFiles(sub, type), 0);
}

describe('DirScanner', () => {
	beforeAll(async () => {
		await fse.remove(testPath);
		await buildTree(testPath, 0);
	});

	afterAll(async () => {
		await fse.remove(testPath);
	});

	test('finds all directories and files, hidden entries excluded', async () => {
		const result = await new DirScanner().scan(testPath);
		expect(countDirectories(result)).toBe(40); // 1 + 3 + 9 + 27
		expect(countFiles(result, FileTyp.audio)).toBe(40);
		expect(countFiles(result, FileTyp.image)).toBe(40);
		expect(countFiles(result, FileTyp.other)).toBe(0); // the hidden file is skipped
		expect(result.level).toBe(0);
		expect(result.directories.at(0)?.level).toBe(1);
	});

	test('reads a limited number of directories at the same time, whatever the depth', async () => {
		const original = fse.readdir.bind(fse);
		let inFlight = 0;
		let maxInFlight = 0;
		const spy = jest.spyOn(fse, 'readdir').mockImplementation((async (dir: string) => {
			inFlight++;
			maxInFlight = Math.max(maxInFlight, inFlight);
			await new Promise(resolve => setTimeout(resolve, 5));
			const list = await original(dir);
			inFlight--;
			return list;
		}) as never);

		await new DirScanner().scan(testPath);
		spy.mockRestore();

		expect(maxInFlight).toBeGreaterThan(1); // directories are read in parallel
		expect(maxInFlight).toBeLessThanOrEqual(10); // and the limit holds for the whole walk
	});
});
