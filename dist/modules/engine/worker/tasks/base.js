"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWorker = void 0;
const fs_utils_1 = require("../../../../utils/fs-utils");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const image_module_1 = require("../../../image/image.module");
const audio_module_1 = require("../../../audio/audio.module");
const typescript_ioc_1 = require("typescript-ioc");
class BaseWorker {
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
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], BaseWorker.prototype, "audioModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], BaseWorker.prototype, "imageModule", void 0);
exports.BaseWorker = BaseWorker;
//# sourceMappingURL=base.js.map