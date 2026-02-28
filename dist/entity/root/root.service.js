var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject } from 'typescript-ioc';
import { FolderService } from '../folder/folder.service.js';
export class RootService {
    async getImage(orm, root, size, format) {
        const folders = await root.folders.getItems();
        const sorted = folders.sort((a, b) => a.level - b.level);
        const folder = sorted.at(0);
        if (folder) {
            return this.folderService.getImage(orm, folder, size, format);
        }
        return;
    }
}
__decorate([
    Inject,
    __metadata("design:type", FolderService)
], RootService.prototype, "folderService", void 0);
//# sourceMappingURL=root.service.js.map