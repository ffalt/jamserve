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
exports.ArtistService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const consts_1 = require("../../types/consts");
const folder_service_1 = require("../folder/folder.service");
const enums_1 = require("../../types/enums");
let ArtistService = class ArtistService {
    canHaveArtistImage(artist) {
        return (artist.albumTypes.length > 0 && artist.mbArtistID !== consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID);
    }
    async getArtistFolder(orm, artist) {
        let p = await orm.Folder.findOneFilter({ artistIDs: [artist.id] });
        while (p) {
            if (p.folderType === enums_1.FolderType.artist) {
                return p;
            }
            p = await p.parent.get();
        }
        return;
    }
    async getImage(orm, artist, size, format) {
        if (this.canHaveArtistImage(artist)) {
            const folder = await this.getArtistFolder(orm, artist);
            if (folder) {
                return this.folderService.getImage(orm, folder, size, format);
            }
        }
        return;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", folder_service_1.FolderService)
], ArtistService.prototype, "folderService", void 0);
ArtistService = __decorate([
    typescript_ioc_1.InRequestScope
], ArtistService);
exports.ArtistService = ArtistService;
//# sourceMappingURL=artist.service.js.map