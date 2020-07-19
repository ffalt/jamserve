"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixMP3 = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const worker_threads_1 = require("worker_threads");
const mp3val_1 = require("../tools/mp3val");
async function fixMP3(filename) {
    const backupFile = `${filename}.bak`;
    const exits = await fs_extra_1.default.pathExists(backupFile);
    if (!exits) {
        await fs_extra_1.default.copy(filename, backupFile);
    }
    await mp3val_1.mp3val(filename, true);
}
exports.fixMP3 = fixMP3;
if (worker_threads_1.parentPort && process.env.JAM_USE_TASKS) {
    worker_threads_1.parentPort.on('message', async (param) => {
        if (typeof param !== 'string') {
            throw new Error('param must be a string.');
        }
        await fixMP3(param);
        if (worker_threads_1.parentPort) {
            worker_threads_1.parentPort.postMessage(undefined);
        }
    });
}
//# sourceMappingURL=task-fix-mp3.js.map