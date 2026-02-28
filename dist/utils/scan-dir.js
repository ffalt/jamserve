import fse from 'fs-extra';
import path from 'node:path';
import { logger } from './logger.js';
import { ensureTrailingPathSeparator } from './fs-utils.js';
import { processQueue } from './queue.js';
import { getFileType } from './filetype.js';
const log = logger('IO.DirScanner');
const MAX_RECURSION_DEPTH = 50;
export class DirScanner {
    async scanDirR(dir, stat, level) {
        log.debug('Scanning:', dir);
        const result = {
            path: ensureTrailingPathSeparator(dir),
            level,
            ctime: stat.ctime,
            mtime: stat.mtime,
            directories: [],
            files: []
        };
        if (level >= MAX_RECURSION_DEPTH) {
            log.warn(`Maximum recursion depth (${MAX_RECURSION_DEPTH}) reached at ${dir}, stopping scan`);
            return result;
        }
        const folders = [];
        const list = await fse.readdir(dir);
        for (const filename of list) {
            if (!filename.startsWith('.')) {
                const sub = path.join(dir, filename);
                const subStat = await fse.stat(sub);
                if (subStat.isDirectory()) {
                    folders.push({ dir: sub, stat: subStat });
                }
                else {
                    const file = {
                        path: sub,
                        type: getFileType(sub),
                        ctime: subStat.ctime,
                        mtime: subStat.mtime,
                        size: subStat.size
                    };
                    result.files.push(file);
                }
            }
        }
        if (folders.length > 0) {
            await processQueue(3, folders, async (folder) => {
                const sub = await this.scanDirR(folder.dir, folder.stat, level + 1);
                result.directories.push(sub);
            });
        }
        return result;
    }
    async scan(dir) {
        log.info('Scanning Directory', dir);
        const stat = await fse.stat(dir);
        return this.scanDirR(dir, stat, 0);
    }
}
//# sourceMappingURL=scan-dir.js.map