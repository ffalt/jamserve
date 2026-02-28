var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArtworkImageType, FolderType } from '../../types/enums.js';
import path from 'node:path';
import { Inject, InRequestScope } from 'typescript-ioc';
import { FolderRulesChecker } from '../health/folder.rule.js';
import { ImageModule } from '../../modules/image/image.module.js';
export async function getFolderDisplayArtwork(_orm, folder) {
    const search = folder.folderType === FolderType.artist ? ArtworkImageType.artist : ArtworkImageType.front;
    const items = await folder.artworks.getItems();
    return items.find(a => a.types.includes(search));
}
let FolderService = class FolderService {
    constructor() {
        this.checker = new FolderRulesChecker();
    }
    async collectFolderPath(folder) {
        const result = [];
        const collect = async (f) => {
            if (!f) {
                return;
            }
            result.unshift(f);
            await collect(await f.parent.get());
        };
        await collect(folder);
        return result;
    }
    async getImage(orm, folder, size, format) {
        const artwork = await getFolderDisplayArtwork(orm, folder);
        if (artwork) {
            return this.imageModule.get(artwork.id, path.join(artwork.path, artwork.name), size, format);
        }
        return;
    }
    async health(orm, list) {
        const folders = [...list].sort((a, b) => a.path.localeCompare(b.path));
        const result = [];
        for (const folder of folders) {
            const parents = await this.collectFolderPath(await folder.parent.get());
            const health = await this.checker.run(orm, folder, parents);
            if (health.length > 0) {
                result.push({ folder, health });
            }
        }
        return result;
    }
};
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], FolderService.prototype, "imageModule", void 0);
FolderService = __decorate([
    InRequestScope
], FolderService);
export { FolderService };
//# sourceMappingURL=folder.service.js.map