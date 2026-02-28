import fse from 'fs-extra';
import path from 'node:path';
export async function fileDeleteIfExists(pathName) {
    const exists = await fse.pathExists(pathName);
    if (exists) {
        await fse.unlink(pathName);
    }
}
export async function pathDeleteIfExists(pathName) {
    const exists = await fse.pathExists(pathName);
    if (exists) {
        await fse.remove(pathName);
    }
}
export function fileSuffix(filename) {
    return path.extname(filename).slice(1).toLowerCase();
}
export function fileExtension(filename) {
    return path.extname(filename).toLowerCase();
}
export function basenameStripExtension(filename) {
    return path.basename(filename, path.extname(filename));
}
export function replaceFileSystemChars(s, replace) {
    return s
        .replaceAll(':', ' - ')
        .replaceAll(/[?/!\\"|*]/g, replace);
}
const FolderSystemCharsRegEx = /[<>:"/\\|?*]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;
export function containsFolderSystemChars(s) {
    return FolderSystemCharsRegEx.test(s);
}
export function replaceFolderSystemChars(s, replace) {
    return s
        .replaceAll(':', ' -')
        .replaceAll(/[|*?/!\\<>"]/g, replace);
}
export function ensureTrailingPathSeparator(s) {
    if (!s.endsWith(path.sep)) {
        return s + path.sep;
    }
    return s;
}
export function removeTrailingPathSeparator(s) {
    if (s.endsWith(path.sep)) {
        return s.slice(0, -1);
    }
    return s;
}
//# sourceMappingURL=fs-utils.js.map