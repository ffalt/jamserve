"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirScanner = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
const fs_utils_1 = require("./fs-utils");
const queue_1 = require("./queue");
const filetype_1 = require("./filetype");
const log = logger_1.logger('IO.DirScanner');
class DirScanner {
    async scanDirR(dir, stat, level) {
        log.debug('Scanning:', dir);
        const result = {
            path: fs_utils_1.ensureTrailingPathSeparator(dir),
            level,
            ctime: stat.ctime,
            mtime: stat.mtime,
            directories: [],
            files: []
        };
        const folders = [];
        const list = await fs_extra_1.default.readdir(dir);
        for (const filename of list) {
            if (filename[0] !== '.') {
                const sub = path_1.default.join(dir, filename);
                const subStat = await fs_extra_1.default.stat(sub);
                if (subStat.isDirectory()) {
                    folders.push({ dir: sub, stat: subStat });
                }
                else {
                    const file = {
                        path: sub,
                        type: filetype_1.getFileType(sub),
                        ctime: subStat.ctime,
                        mtime: subStat.mtime,
                        size: subStat.size
                    };
                    result.files.push(file);
                }
            }
        }
        if (folders.length > 0) {
            await queue_1.processQueue(3, folders, async (folder) => {
                const sub = await this.scanDirR(folder.dir, folder.stat, level + 1);
                result.directories.push(sub);
            });
        }
        return result;
    }
    async scan(dir) {
        log.info('Scanning Directory', dir);
        const stat = await fs_extra_1.default.stat(dir);
        return this.scanDirR(dir, stat, 0);
    }
}
exports.DirScanner = DirScanner;
//# sourceMappingURL=scan-dir.js.map