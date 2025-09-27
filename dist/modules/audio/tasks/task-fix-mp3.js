import fse from 'fs-extra';
import { parentPort } from 'node:worker_threads';
import { mp3val } from '../tools/mp3val.js';
export async function fixMP3(filename) {
    const backupFile = `${filename}.bak`;
    const exits = await fse.pathExists(backupFile);
    if (!exits) {
        await fse.copy(filename, backupFile);
    }
    await mp3val(filename, true);
}
if (parentPort && process.env.JAM_USE_TASKS) {
    const caller = parentPort;
    caller.on('message', (parameter) => {
        if (typeof parameter !== 'string') {
            throw new TypeError('param must be a string.');
        }
        void fixMP3(parameter)
            .then(() => {
            caller.postMessage(undefined);
        });
    });
}
//# sourceMappingURL=task-fix-mp3.js.map