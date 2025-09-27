var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject, InRequestScope } from 'typescript-ioc';
import { IoService } from '../../modules/engine/services/io.service.js';
import path from 'node:path';
import { ImageModule } from '../../modules/image/image.module.js';
let ArtworkService = class ArtworkService {
    async createByUrl(folder, url, types) {
        return this.ioService.artwork.download(folder.id, url, types, folder.root.idOrFail());
    }
    async createByFile(folder, filename, types) {
        return this.ioService.artwork.create(folder.id, filename, types, folder.root.idOrFail());
    }
    async upload(artwork, filename) {
        const folder = await artwork.folder.getOrFail();
        return this.ioService.artwork.replace(artwork.id, filename, folder.root.idOrFail());
    }
    async rename(artwork, newName) {
        const folder = await artwork.folder.getOrFail();
        return this.ioService.artwork.rename(artwork.id, newName, folder.root.idOrFail());
    }
    async remove(artwork) {
        const folder = await artwork.folder.getOrFail();
        return this.ioService.artwork.delete(artwork.id, folder.root.idOrFail());
    }
    async getImage(_orm, artwork, size, format) {
        return this.imageModule.get(artwork.id, path.join(artwork.path, artwork.name), size, format);
    }
};
__decorate([
    Inject,
    __metadata("design:type", IoService)
], ArtworkService.prototype, "ioService", void 0);
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], ArtworkService.prototype, "imageModule", void 0);
ArtworkService = __decorate([
    InRequestScope
], ArtworkService);
export { ArtworkService };
//# sourceMappingURL=artwork.service.js.map