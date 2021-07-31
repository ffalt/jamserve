import { MP3 } from 'jamp3';
import { parentPort } from 'worker_threads';
export async function removeID3v1(filename) {
    const mp3 = new MP3();
    return mp3.removeTags(filename, { id3v1: true, id3v2: false, keepBackup: true });
}
if (parentPort && process.env.JAM_USE_TASKS) {
    parentPort.on('message', async (param) => {
        if (typeof param !== 'string') {
            throw new Error('param must be a string.');
        }
        const result = await removeID3v1(param);
        if (parentPort) {
            parentPort.postMessage(result);
        }
    });
}
//# sourceMappingURL=task-remove-id3v1.js.map