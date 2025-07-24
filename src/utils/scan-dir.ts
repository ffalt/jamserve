import fse from 'fs-extra';
import path from 'node:path';
import { logger } from './logger.js';
import { FileTyp } from '../types/enums.js';
import { ensureTrailingPathSeparator } from './fs-utils.js';
import { processQueue } from './queue.js';
import { getFileType } from './filetype.js';

const log = logger('IO.DirScanner');

export interface ScanDir {
	path: string;
	level: number;
	ctime: Date;
	mtime: Date;
	directories: Array<ScanDir>;
	files: Array<ScanFile>;
}

export interface ScanFile {
	path: string;
	type: FileTyp;
	ctime: Date;
	mtime: Date;
	size: number;
}

export class DirScanner {
	private async scanDirR(dir: string, stat: fse.Stats, level: number): Promise<ScanDir> {
		log.debug('Scanning:', dir);
		const result: ScanDir = {
			path: ensureTrailingPathSeparator(dir),
			level,
			ctime: stat.ctime,
			mtime: stat.mtime,
			directories: [],
			files: []
		};
		const folders: Array<{ dir: string; stat: fse.Stats }> = [];
		const list = await fse.readdir(dir);
		for (const filename of list) {
			if (!filename.startsWith('.')) {
				const sub = path.join(dir, filename);
				const subStat = await fse.stat(sub);
				if (subStat.isDirectory()) {
					folders.push({ dir: sub, stat: subStat });
				} else {
					const file: ScanFile = {
						path: sub,
						type: getFileType(sub),
						ctime: subStat.ctime,
						mtime: subStat.mtime,
						size: subStat.size
					};
					result.files.push(file);
				}
			}
		}
		if (folders.length > 0) {
			await processQueue<{ dir: string; stat: fse.Stats }>(3, folders, async folder => {
				const sub = await this.scanDirR(folder.dir, folder.stat, level + 1);
				result.directories.push(sub);
			});
		}
		return result;
	}

	public async scan(dir: string): Promise<ScanDir> {
		log.info('Scanning Directory', dir);
		const stat = await fse.stat(dir);
		return this.scanDirR(dir, stat, 0);
	}
}
