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
import { MUSICBRAINZ_VARIOUS_ARTISTS_ID } from '../../types/consts';
import { FolderService } from '../folder/folder.service';
import { FolderType } from '../../types/enums';
let ArtistService = class ArtistService {
    canHaveArtistImage(artist) {
        return (artist.albumTypes.length > 0 && artist.mbArtistID !== MUSICBRAINZ_VARIOUS_ARTISTS_ID);
    }
    async getArtistFolder(orm, artist) {
        let p = await orm.Folder.findOneFilter({ artistIDs: [artist.id] });
        while (p) {
            if (p.folderType === FolderType.artist) {
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
    Inject,
    __metadata("design:type", FolderService)
], ArtistService.prototype, "folderService", void 0);
ArtistService = __decorate([
    InRequestScope
], ArtistService);
export { ArtistService };
//# sourceMappingURL=artist.service.js.map