"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteAudio = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const jamp3_1 = require("jamp3");
const worker_threads_1 = require("worker_threads");
const fs_utils_1 = require("../../../utils/fs-utils");
const ffmpeg_rewrite_1 = require("../tools/ffmpeg-rewrite");
const enums_1 = require("../../../types/enums");
async function rewriteAudio(param) {
    const tempFile = `${param}.tmp`;
    const backupFile = `${param}.bak`;
    try {
        const suffix = fs_utils_1.fileSuffix(param);
        const id3v2 = new jamp3_1.ID3v2();
        let tag;
        if (suffix === enums_1.AudioFormatType.mp3) {
            tag = await id3v2.read(param);
        }
        await ffmpeg_rewrite_1.rewriteWriteFFmpeg(param, tempFile);
        const exits = await fs_extra_1.default.pathExists(backupFile);
        if (exits) {
            await fs_utils_1.fileDeleteIfExists(param);
        }
        else {
            await fs_extra_1.default.copy(param, backupFile);
        }
        if (tag) {
            await id3v2.write(tempFile, tag, 4, 0, { keepBackup: false, paddingSize: 10 });
        }
        await fs_extra_1.default.rename(tempFile, param);
    }
    catch (e) {
        await fs_utils_1.fileDeleteIfExists(tempFile);
        return Promise.reject(e);
    }
}
exports.rewriteAudio = rewriteAudio;
if (worker_threads_1.parentPort && process.env.JAM_USE_TASKS) {
    worker_threads_1.parentPort.on('message', async (param) => {
        if (typeof param !== 'string') {
            throw new Error('param must be a string.');
        }
        await rewriteAudio(param);
        if (worker_threads_1.parentPort) {
            worker_threads_1.parentPort.postMessage(undefined);
        }
    });
}
//# sourceMappingURL=task-rewrite-mp3.js.map