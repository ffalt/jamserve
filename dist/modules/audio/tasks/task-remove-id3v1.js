"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeID3v1 = void 0;
const jamp3_1 = require("jamp3");
const worker_threads_1 = require("worker_threads");
async function removeID3v1(filename) {
    const mp3 = new jamp3_1.MP3();
    return mp3.removeTags(filename, { id3v1: true, id3v2: false, keepBackup: true });
}
exports.removeID3v1 = removeID3v1;
if (worker_threads_1.parentPort && process.env.JAM_USE_TASKS) {
    worker_threads_1.parentPort.on('message', async (param) => {
        if (typeof param !== 'string') {
            throw new Error('param must be a string.');
        }
        const result = await removeID3v1(param);
        if (worker_threads_1.parentPort) {
            worker_threads_1.parentPort.postMessage(result);
        }
    });
}
//# sourceMappingURL=task-remove-id3v1.js.map