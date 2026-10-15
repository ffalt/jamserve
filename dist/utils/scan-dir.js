import fse from 'fs-extra';
import path from 'node:path';
import { logger } from './logger.js';
import { ensureTrailingPathSeparator } from './fs-utils.js';
import { processQueue } from './queue.js';
import { getFileType } from './filetype.js';
const log = logger('IO.DirScanner');
const MAX_RECURSION_DEPTH = 50;
const MAX_CONCURRENT_DIRS = 10;
export class DirScanner {
    static createDir(dir, stat, level) {
        return {
            path: ensureTrailingPathSeparator(dir),
            level,
            ctime: stat.ctime,
            mtime: stat.mtime,
            directories: [],
            files: []
        };
    }
    async readDir(node) {
        log.debug('Scanning:', node.path);
        if (node.level >= MAX_RECURSION_DEPTH) {
            log.warn(`Maximum recursion depth (${MAX_RECURSION_DEPTH}) reached at ${node.path}, stopping scan`);
            return [];
        }
        const subDirectories = [];
        const list = await fse.readdir(node.path);
        for (const filename of list) {
            if (filename.startsWith('.')) {
                continue;
            }
            const sub = path.join(node.path, filename);
            const subStat = await fse.stat(sub);
            if (subStat.isDirectory()) {
                const subDir = DirScanner.createDir(sub, subStat, node.level + 1);
                node.directories.push(subDir);
                subDirectories.push(subDir);
            }
            else {
                const file = {
                    path: sub,
                    type: getFileType(sub),
                    ctime: subStat.ctime,
                    mtime: subStat.mtime,
                    size: subStat.size
                };
                node.files.push(file);
            }
        }
        return subDirectories;
    }
    async scan(dir) {
        log.info('Scanning Directory', dir);
        const stat = await fse.stat(dir);
        const root = DirScanner.createDir(dir, stat, 0);
        let level = [root];
        while (level.length > 0) {
            const next = [];
            await processQueue(MAX_CONCURRENT_DIRS, level, async (node) => {
                next.push(...await this.readDir(node));
            });
            level = next;
        }
        return root;
    }
}
//# sourceMappingURL=scan-dir.js.map