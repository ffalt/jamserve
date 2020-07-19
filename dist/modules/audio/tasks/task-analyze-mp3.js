"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMP3 = void 0;
const jamp3_1 = require("jamp3");
const worker_threads_1 = require("worker_threads");
async function analyzeMP3(filename) {
    const mp3ana = new jamp3_1.MP3Analyzer();
    return mp3ana.read(filename, { id3v1: true, id3v2: true, mpeg: true, xing: true, ignoreXingOffOne: true });
}
exports.analyzeMP3 = analyzeMP3;
if (worker_threads_1.parentPort && process.env.JAM_USE_TASKS) {
    worker_threads_1.parentPort.on('message', async (param) => {
        if (typeof param !== 'string') {
            throw new Error('param must be a string.');
        }
        const result = await analyzeMP3(param);
        if (worker_threads_1.parentPort) {
            worker_threads_1.parentPort.postMessage(result);
        }
    });
}
//# sourceMappingURL=task-analyze-mp3.js.map