import { MP3Analyzer } from 'jamp3';
import { parentPort } from 'node:worker_threads';
export async function analyzeMP3(filename) {
    const mp3ana = new MP3Analyzer();
    return mp3ana.read(filename, { id3v1: true, id3v2: true, mpeg: true, xing: true, ignoreXingOffOne: true });
}
if (parentPort && process.env.JAM_USE_TASKS) {
    const caller = parentPort;
    caller.on('message', (parameter) => {
        if (typeof parameter !== 'string') {
            throw new TypeError('param must be a string.');
        }
        void analyzeMP3(parameter)
            .then(result => {
            caller.postMessage(result);
        });
    });
}
//# sourceMappingURL=task-analyze-mp3.js.map