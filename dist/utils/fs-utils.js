"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTrailingPathSeparator = exports.ensureTrailingPathSeparator = exports.replaceFolderSystemChars = exports.containsFolderSystemChars = exports.replaceFileSystemChars = exports.basenameStripExt = exports.fileExt = exports.fileSuffix = exports.pathDeleteIfExists = exports.fileDeleteIfExists = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function fileDeleteIfExists(pathName) {
    const exists = await fs_extra_1.default.pathExists(pathName);
    if (exists) {
        await fs_extra_1.default.unlink(pathName);
    }
}
exports.fileDeleteIfExists = fileDeleteIfExists;
async function pathDeleteIfExists(pathName) {
    const exists = await fs_extra_1.default.pathExists(pathName);
    if (exists) {
        await fs_extra_1.default.remove(pathName);
    }
}
exports.pathDeleteIfExists = pathDeleteIfExists;
function fileSuffix(filename) {
    return path_1.default.extname(filename).slice(1).toLowerCase();
}
exports.fileSuffix = fileSuffix;
function fileExt(filename) {
    return path_1.default.extname(filename).toLowerCase();
}
exports.fileExt = fileExt;
function basenameStripExt(filename) {
    return path_1.default.basename(filename, path_1.default.extname(filename));
}
exports.basenameStripExt = basenameStripExt;
function replaceFileSystemChars(s, replace) {
    return s.toString()
        .replace(/:/g, ' - ')
        .replace(/[?/!\\"|*]/g, replace);
}
exports.replaceFileSystemChars = replaceFileSystemChars;
const FolderSystemCharsRegEx = /[<>:"/\\|?*\x00-\x1F]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;
function containsFolderSystemChars(s) {
    return FolderSystemCharsRegEx.test(s);
}
exports.containsFolderSystemChars = containsFolderSystemChars;
function replaceFolderSystemChars(s, replace) {
    return s.toString()
        .replace(/:/g, ' -')
        .replace(/[|*?/!\\<>"]/g, replace);
}
exports.replaceFolderSystemChars = replaceFolderSystemChars;
function ensureTrailingPathSeparator(s) {
    if (s.length > 0 && s[s.length - 1] !== path_1.default.sep) {
        return s + path_1.default.sep;
    }
    return s;
}
exports.ensureTrailingPathSeparator = ensureTrailingPathSeparator;
function removeTrailingPathSeparator(s) {
    if (s.length > 0 && s[s.length - 1] === path_1.default.sep) {
        return s.slice(0, s.length - 1);
    }
    return s;
}
exports.removeTrailingPathSeparator = removeTrailingPathSeparator;
//# sourceMappingURL=fs-utils.js.map