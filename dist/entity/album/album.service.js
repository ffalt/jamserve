var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AlbumService_1;
import { Inject, InRequestScope } from 'typescript-ioc';
import { TrackService } from '../track/track.service.js';
import { FolderService } from '../folder/folder.service.js';
let AlbumService = AlbumService_1 = class AlbumService {
    static async getAlbumFolder(album) {
        const folders = await album.folders.getItems();
        if (folders.length > 0) {
            return folders.sort((a, b) => b.level - a.level).at(0);
        }
        return;
    }
    async getAlbumTrackImage(orm, album, size, format) {
        const tracks = await album.tracks.getItems();
        const track = tracks.at(0);
        if (track) {
            return this.trackService.getImage(orm, track, size, format);
        }
        return;
    }
    async getAlbumFolderImage(orm, album, size, format) {
        const folder = await AlbumService_1.getAlbumFolder(album);
        if (folder) {
            return this.folderService.getImage(orm, folder, size, format);
        }
        return;
    }
    async getImage(orm, album, size, format) {
        let result;
        if (album.series.id()) {
            result = await this.getAlbumTrackImage(orm, album, size, format);
        }
        result ?? (result = await this.getAlbumFolderImage(orm, album, size, format));
        result ?? (result = await this.getAlbumTrackImage(orm, album, size, format));
        return result;
    }
};
__decorate([
    Inject,
    __metadata("design:type", TrackService)
], AlbumService.prototype, "trackService", void 0);
__decorate([
    Inject,
    __metadata("design:type", FolderService)
], AlbumService.prototype, "folderService", void 0);
AlbumService = AlbumService_1 = __decorate([
    InRequestScope
], AlbumService);
export { AlbumService };
//# sourceMappingURL=album.service.js.map