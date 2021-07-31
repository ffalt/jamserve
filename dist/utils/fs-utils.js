import fse from 'fs-extra';
import path from 'path';
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
export function fileExt(filename) {
    return path.extname(filename).toLowerCase();
}
export function basenameStripExt(filename) {
    return path.basename(filename, path.extname(filename));
}
export function replaceFileSystemChars(s, replace) {
    return s.toString()
        .replace(/:/g, ' - ')
        .replace(/[?/!\\"|*]/g, replace);
}
const FolderSystemCharsRegEx = /[<>:"/\\|?*\x00-\x1F]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;
export function containsFolderSystemChars(s) {
    return FolderSystemCharsRegEx.test(s);
}
export function replaceFolderSystemChars(s, replace) {
    return s.toString()
        .replace(/:/g, ' -')
        .replace(/[|*?/!\\<>"]/g, replace);
}
export function ensureTrailingPathSeparator(s) {
    if (s.length > 0 && s[s.length - 1] !== path.sep) {
        return s + path.sep;
    }
    return s;
}
export function removeTrailingPathSeparator(s) {
    if (s.length > 0 && s[s.length - 1] === path.sep) {
        return s.slice(0, s.length - 1);
    }
    return s;
}
//# sourceMappingURL=fs-utils.js.map