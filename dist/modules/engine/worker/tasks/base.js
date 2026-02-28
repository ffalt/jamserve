var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { containsFolderSystemChars, fileExtension, replaceFolderSystemChars } from '../../../../utils/fs-utils.js';
import path from 'node:path';
import fse from 'fs-extra';
import { ImageModule } from '../../../image/image.module.js';
import { AudioModule } from '../../../audio/audio.module.js';
import { Inject } from 'typescript-ioc';
export class BaseWorker {
    async renameFile(dir, oldName, newName) {
        if (containsFolderSystemChars(newName)) {
            return Promise.reject(new Error('Invalid Name'));
        }
        const name = replaceFolderSystemChars(newName, '').trim();
        const extension = fileExtension(name);
        const basename = path.basename(name, extension);
        if (basename.length === 0) {
            return Promise.reject(new Error('Invalid Name'));
        }
        const extension2 = fileExtension(oldName);
        if (extension !== extension2) {
            return Promise.reject(new Error(`Changing File extension not supported "${extension2}"=>"${extension}"`));
        }
        const newPath = path.join(dir, name);
        const exists = await fse.pathExists(newPath);
        if (exists) {
            return Promise.reject(new Error('File name already used in Destination'));
        }
        try {
            await fse.rename(path.join(dir, oldName), newPath);
        }
        catch {
            return Promise.reject(new Error('File renaming failed'));
        }
        return name;
    }
    async moveToTrash(root, dir, name) {
        try {
            await fse.move(path.join(dir, name), path.join(root.path, '.trash', `${Date.now()}_${name}`));
        }
        catch {
            return Promise.reject(new Error('Moving to Trash failed'));
        }
    }
}
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], BaseWorker.prototype, "audioModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], BaseWorker.prototype, "imageModule", void 0);
//# sourceMappingURL=base.js.map