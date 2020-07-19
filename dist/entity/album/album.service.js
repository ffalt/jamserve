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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const track_service_1 = require("../track/track.service");
const folder_service_1 = require("../folder/folder.service");
const orm_service_1 = require("../../modules/engine/services/orm.service");
let AlbumService = class AlbumService {
    async getAlbumFolder(album) {
        await this.orm.Album.populate(album, ['folders']);
        if (album.folders.length === 0) {
            return;
        }
        const folders = album.folders.getItems().sort((a, b) => b.level - a.level);
        return folders[0];
    }
    async getAlbumTrackImage(album, size, format) {
        await this.orm.Album.populate(album, ['tracks']);
        if (album.tracks.length > 0) {
            const tracks = album.tracks.getItems();
            return this.trackService.getImage(tracks[0], size, format);
        }
    }
    async getAlbumFolderImage(album, size, format) {
        const folder = await this.getAlbumFolder(album);
        if (folder) {
            return this.folderService.getImage(folder, size, format);
        }
    }
    async getImage(album, size, format) {
        let result;
        if (album.series) {
            result = await this.getAlbumTrackImage(album, size, format);
        }
        if (!result) {
            result = await this.getAlbumFolderImage(album, size, format);
        }
        if (!result) {
            result = await this.getAlbumTrackImage(album, size, format);
        }
        return result;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", track_service_1.TrackService)
], AlbumService.prototype, "trackService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", folder_service_1.FolderService)
], AlbumService.prototype, "folderService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], AlbumService.prototype, "orm", void 0);
AlbumService = __decorate([
    typescript_ioc_1.Singleton
], AlbumService);
exports.AlbumService = AlbumService;
//# sourceMappingURL=album.service.js.map