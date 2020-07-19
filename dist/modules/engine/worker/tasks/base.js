"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWorker = void 0;
const fs_utils_1 = require("../../../../utils/fs-utils");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
class BaseWorker {
    constructor(orm, imageModule, audioModule) {
        this.orm = orm;
        this.imageModule = imageModule;
        this.audioModule = audioModule;
    }
    async renameFile(dir, oldName, newName) {
        if (fs_utils_1.containsFolderSystemChars(newName)) {
            return Promise.reject(Error('Invalid Name'));
        }
        const name = fs_utils_1.replaceFolderSystemChars(newName, '').trim();
        const ext = fs_utils_1.fileExt(name);
        const basename = path_1.default.basename(name, ext);
        if (basename.length === 0) {
            return Promise.reject(Error('Invalid Name'));
        }
        const ext2 = fs_utils_1.fileExt(oldName);
        if (ext !== ext2) {
            return Promise.reject(Error(`Changing File extension not supported "${ext2}"=>"${ext}"`));
        }
        const newPath = path_1.default.join(dir, name);
        const exists = await fs_extra_1.default.pathExists(newPath);
        if (exists) {
            return Promise.reject(Error('File name already used in Destination'));
        }
        try {
            await fs_extra_1.default.rename(path_1.default.join(dir, oldName), newPath);
        }
        catch (e) {
            return Promise.reject(Error('File renaming failed'));
        }
        return name;
    }
    async moveToTrash(root, dir, name) {
        try {
            await fs_extra_1.default.move(path_1.default.join(dir, name), path_1.default.join(root.path, '.trash', `${Date.now()}_${name}`));
        }
        catch (e) {
            return Promise.reject(Error('Moving to Trash failed'));
        }
    }
}
exports.BaseWorker = BaseWorker;
//# sourceMappingURL=base.js.map