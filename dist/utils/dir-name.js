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
        return Promise.reject(new Error('Invalid Directory Name: contains invalid filesystem characters'));
    }
    const name = replaceFolderSystemChars(newName, '').trim();
    if (name.length === 0) {
        return Promise.reject(new Error('Invalid Directory Name: name cannot be empty'));
    }
    if (['.', '..'].includes(name)) {
        return Promise.reject(new Error('Invalid Directory Name: cannot use . or .. as directory name'));
    }
    const windowsReservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    if (windowsReservedNames.includes(name.toUpperCase())) {
        return Promise.reject(new Error(`Invalid Directory Name: "${name}" is a reserved Windows device name`));
    }
    if (name.endsWith(' ') || name.endsWith('.')) {
        return Promise.reject(new Error('Invalid Directory Name: cannot end with space or period'));
    }
    return name;
}
//# sourceMappingURL=dir-name.js.map