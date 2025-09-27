import fse from 'fs-extra';
import { ID3v2 } from 'jamp3';
import { parentPort } from 'node:worker_threads';
import { fileDeleteIfExists, fileSuffix } from '../../../utils/fs-utils.js';
import { rewriteWriteFFmpeg } from '../tools/ffmpeg-rewrite.js';
import { AudioFormatType } from '../../../types/enums.js';
export async function rewriteAudio(filename) {
    const temporaryFile = `${filename}.tmp`;
    const backupFile = `${filename}.bak`;
    try {
        const suffix = fileSuffix(filename);
        const id3v2 = new ID3v2();
        let tag;
        if (suffix === AudioFormatType.mp3) {
            tag = await id3v2.read(filename);
        }
        await rewriteWriteFFmpeg(filename, temporaryFile);
        const exits = await fse.pathExists(backupFile);
        await (exits ? fileDeleteIfExists(filename) : fse.copy(filename, backupFile));
        if (tag) {
            await id3v2.write(temporaryFile, tag, 4, 0, { keepBackup: false, paddingSize: 10 });
        }
        await fse.rename(temporaryFile, filename);
    }
    catch (error) {
        await fileDeleteIfExists(temporaryFile);
        return Promise.reject(error);
    }
}
if (parentPort && process.env.JAM_USE_TASKS) {
    const caller = parentPort;
    caller.on('message', (parameters) => {
        if (typeof parameters !== 'string') {
            throw new TypeError('param must be a string.');
        }
        void rewriteAudio(parameters)
            .then(() => {
            caller.postMessage(undefined);
        });
    });
}
//# sourceMappingURL=task-rewrite-mp3.js.map