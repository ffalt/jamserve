import fse from 'fs-extra';
import { ID3v2, IID3V2 } from 'jamp3';
import { parentPort } from 'worker_threads';
import { fileDeleteIfExists, fileSuffix } from '../../../utils/fs-utils.js';
import { rewriteWriteFFmpeg } from '../tools/ffmpeg-rewrite.js';
import { AudioFormatType } from '../../../types/enums.js';

export async function rewriteAudio(param: string): Promise<void> {
	const tempFile = `${param}.tmp`;
	const backupFile = `${param}.bak`;
	try {
		const suffix = fileSuffix(param);
		const id3v2 = new ID3v2();
		let tag: IID3V2.Tag | undefined;
		if (suffix === AudioFormatType.mp3) {
			tag = await id3v2.read(param);
		}
		await rewriteWriteFFmpeg(param, tempFile);
		const exits = await fse.pathExists(backupFile);
		if (exits) {
			await fileDeleteIfExists(param);
		} else {
			await fse.copy(param, backupFile);
		}
		if (tag) {
			await id3v2.write(tempFile, tag, 4, 0, { keepBackup: false, paddingSize: 10 });
		}
		await fse.rename(tempFile, param);
	} catch (e: any) {
		await fileDeleteIfExists(tempFile);
		return Promise.reject(e);
	}
}

if (parentPort && process.env.JAM_USE_TASKS) {
	parentPort.on('message', async (param: any) => {
		if (typeof param !== 'string') {
			throw new Error('param must be a string.');
		}
		await rewriteAudio(param);
		if (parentPort) {
			parentPort.postMessage(undefined);
		}
	});
}
