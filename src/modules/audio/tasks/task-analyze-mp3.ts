import { IMP3Analyzer, MP3Analyzer } from 'jamp3';
import { parentPort } from 'worker_threads';

export async function analyzeMP3(filename: string): Promise<IMP3Analyzer.Report> {
	const mp3ana = new MP3Analyzer();
	return mp3ana.read(filename, { id3v1: true, id3v2: true, mpeg: true, xing: true, ignoreXingOffOne: true });
}

if (parentPort && process.env.JAM_USE_TASKS) {
	parentPort.on('message', async (param: any) => {
		if (typeof param !== 'string') {
			throw new Error('param must be a string.');
		}
		const result = await analyzeMP3(param);
		if (parentPort) {
			parentPort.postMessage(result);
		}
	});
}
