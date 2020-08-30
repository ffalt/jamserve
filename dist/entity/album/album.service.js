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
var AlbumService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const track_service_1 = require("../track/track.service");
const folder_service_1 = require("../folder/folder.service");
let AlbumService = AlbumService_1 = class AlbumService {
    static async getAlbumFolder(album) {
        const folders = await album.folders.getItems();
        if (folders.length > 0) {
            return folders.sort((a, b) => b.level - a.level)[0];
        }
    }
    async getAlbumTrackImage(orm, album, size, format) {
        const tracks = await album.tracks.getItems();
        if (tracks.length > 0) {
            return this.trackService.getImage(orm, tracks[0], size, format);
        }
    }
    async getAlbumFolderImage(orm, album, size, format) {
        const folder = await AlbumService_1.getAlbumFolder(album);
        if (folder) {
            return this.folderService.getImage(orm, folder, size, format);
        }
    }
    async getImage(orm, album, size, format) {
        let result;
        if (album.series) {
            result = await this.getAlbumTrackImage(orm, album, size, format);
        }
        if (!result) {
            result = await this.getAlbumFolderImage(orm, album, size, format);
        }
        if (!result) {
            result = await this.getAlbumTrackImage(orm, album, size, format);
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
AlbumService = AlbumService_1 = __decorate([
    typescript_ioc_1.InRequestScope
], AlbumService);
exports.AlbumService = AlbumService;
//# sourceMappingURL=album.service.js.map