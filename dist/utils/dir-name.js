import path from 'path';
import { containsFolderSystemChars, replaceFolderSystemChars } from './fs-utils.js';
export function splitDirectoryName(name) {
    const result = { title: path.basename(name).trim() };
    const parts = result.title.split(' ');
    const s = parts[0].replace(/[^\w\s]/gi, '');
    if (s.length === 4) {
        const y = Number(s);
        if (!isNaN(y)) {
            result.year = y;
            parts.shift();
            if (parts[0] === '-') {
                parts.shift();
            }
            result.title = parts.join(' ');
        }
    }
    return result;
}
export async function validateFolderName(newName) {
    if (containsFolderSystemChars(newName)) {
        return Promise.reject(Error('Invalid Directory Name'));
    }
    const name = replaceFolderSystemChars(newName, '').trim();
    if (name.length === 0 || ['.', '..'].includes(name)) {
        return Promise.reject(Error('Invalid Directory Name'));
    }
    return name;
}
//# sourceMappingURL=dir-name.js.map