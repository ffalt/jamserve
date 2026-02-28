import { MP3 } from 'jamp3';
import { parentPort } from 'node:worker_threads';
export async function removeID3v1(filename) {
    const mp3 = new MP3();
    return mp3.removeTags(filename, { id3v1: true, id3v2: false, keepBackup: true });
}
if (parentPort && process.env.JAM_USE_TASKS) {
    const caller = parentPort;
    caller.on('message', (parameter) => {
        if (typeof parameter !== 'string') {
            throw new TypeError('param must be a string.');
        }
        void removeID3v1(parameter)
            .then(result => {
            caller.postMessage(result);
        })
            .catch((error) => {
            caller.postMessage({ error: String(error) });
        });
    });
}
//# sourceMappingURL=task-remove-id3v1.js.map