import fse from 'fs-extra';
import {parentPort} from 'worker_threads';
import {mp3val} from '../tools/mp3val';

export async function fixMP3(filename: string): Promise<void> {
	const backupFile = `${filename}.bak`;
	const exits = await fse.pathExists(backupFile);
	if (!exits) {
		await fse.copy(filename, backupFile);
	}
	await mp3val(filename, true);
}

if (parentPort && process.env.JAM_USE_TASKS) {
	parentPort.on('message', async (param: any) => {
		if (typeof param !== 'string') {
			throw new Error('param must be a string.');
		}
		await fixMP3(param);
		if (parentPort) {
			parentPort.postMessage(undefined);
		}
	});
}
