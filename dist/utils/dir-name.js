"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFolderName = exports.splitDirectoryName = void 0;
const path_1 = __importDefault(require("path"));
const fs_utils_1 = require("./fs-utils");
function splitDirectoryName(name) {
    const result = { title: path_1.default.basename(name).trim() };
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
exports.splitDirectoryName = splitDirectoryName;
async function validateFolderName(newName) {
    if (fs_utils_1.containsFolderSystemChars(newName)) {
        return Promise.reject(Error('Invalid Directory Name'));
    }
    const name = fs_utils_1.replaceFolderSystemChars(newName, '').trim();
    if (name.length === 0 || ['.', '..'].includes(name)) {
        return Promise.reject(Error('Invalid Directory Name'));
    }
    return name;
}
exports.validateFolderName = validateFolderName;
//# sourceMappingURL=dir-name.js.map