import path from 'node:path';
import { containsFolderSystemChars, replaceFolderSystemChars } from './fs-utils.js';
export function splitDirectoryName(name) {
    const result = { title: path.basename(name).trim() };
    const parts = result.title.split(' ');
    const s = (parts.at(0) ?? '').replaceAll(/[^\w\s]/gi, '');
    if (s.length === 4) {
        const y = Number(s);
        if (!Number.isNaN(y)) {
            result.year = y;
            parts.shift();
            if (parts.at(0) === '-') {
                parts.shift();
            }
            result.title = parts.join(' ');
        }
    }
    return result;
}
export async function validateFolderName(newName) {
    if (containsFolderSystemChars(newName)) {
        return Promise.reject(new Error('Invalid Directory Name'));
    }
    const name = replaceFolderSystemChars(newName, '').trim();
    if (name.length === 0 || ['.', '..'].includes(name)) {
        return Promise.reject(new Error('Invalid Directory Name'));
    }
    return name;
}
//# sourceMappingURL=dir-name.js.map