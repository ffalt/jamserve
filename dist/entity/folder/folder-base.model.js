var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ResultType } from '../../modules/rest';
import { Base } from '../base/base.model';
import { AlbumType, FolderType } from '../../types/enums';
import { GenreBase } from '../genre/genre.model';
import { ExtendedInfo } from '../metadata/metadata.model';
import { examples } from '../../modules/engine/rest/example.consts';
let FolderTag = class FolderTag {
};
__decorate([
    ObjField({ nullable: true, description: 'Album Name', example: 'California' }),
    __metadata("design:type", String)
], FolderTag.prototype, "album", void 0);
__decorate([
    ObjField(() => AlbumType, { nullable: true, description: 'Album Type', example: AlbumType.album }),
    __metadata("design:type", String)
], FolderTag.prototype, "albumType", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Artist Name', example: 'Mr. Bungle' }),
    __metadata("design:type", String)
], FolderTag.prototype, "artist", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Artist Sort Name', example: 'Mr. Bungle' }),
    __metadata("design:type", String)
], FolderTag.prototype, "artistSort", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'Genres', example: examples.genres }),
    __metadata("design:type", Array)
], FolderTag.prototype, "genres", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Year', example: 1999 }),
    __metadata("design:type", Number)
], FolderTag.prototype, "year", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID }),
    __metadata("design:type", String)
], FolderTag.prototype, "mbArtistID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Release Id', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], FolderTag.prototype, "mbReleaseID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Release Group Id', example: examples.mbReleaseGroupID }),
    __metadata("design:type", String)
], FolderTag.prototype, "mbReleaseGroupID", void 0);
FolderTag = __decorate([
    ResultType({ description: 'Folder Meta Information' })
], FolderTag);
export { FolderTag };
let FolderParent = class FolderParent {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], FolderParent.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'Name', example: 'Awesome' }),
    __metadata("design:type", String)
], FolderParent.prototype, "name", void 0);
FolderParent = __decorate([
    ResultType({ description: 'Folder Parent Information' })
], FolderParent);
export { FolderParent };
let FolderBase = class FolderBase extends Base {
};
__decorate([
    ObjField({ nullable: true, description: 'Title', example: 'Awesome' }),
    __metadata("design:type", String)
], FolderBase.prototype, "title", void 0);
__decorate([
    ObjField(() => FolderType, { description: 'Album Type', example: FolderType.multialbum }),
    __metadata("design:type", String)
], FolderBase.prototype, "type", void 0);
__decorate([
    ObjField({ description: 'Level in Root', example: 3 }),
    __metadata("design:type", Number)
], FolderBase.prototype, "level", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderBase.prototype, "parentID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 }),
    __metadata("design:type", Number)
], FolderBase.prototype, "trackCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Number of Folders', min: 0, example: 5 }),
    __metadata("design:type", Number)
], FolderBase.prototype, "folderCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Number of Artworks', min: 0, example: 5 }),
    __metadata("design:type", Number)
], FolderBase.prototype, "artworkCount", void 0);
__decorate([
    ObjField(() => [GenreBase], { nullable: true, description: 'Genres' }),
    __metadata("design:type", Array)
], FolderBase.prototype, "genres", void 0);
__decorate([
    ObjField(() => FolderTag, { nullable: true, description: 'Folder Meta Information' }),
    __metadata("design:type", FolderTag)
], FolderBase.prototype, "tag", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true }),
    __metadata("design:type", Array)
], FolderBase.prototype, "trackIDs", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'List of Folder Ids', isID: true }),
    __metadata("design:type", Array)
], FolderBase.prototype, "folderIDs", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'List of Artwork Ids', isID: true }),
    __metadata("design:type", Array)
], FolderBase.prototype, "artworkIDs", void 0);
__decorate([
    ObjField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Folder (via External Service)' }),
    __metadata("design:type", ExtendedInfo)
], FolderBase.prototype, "info", void 0);
__decorate([
    ObjField(() => [FolderParent], { nullable: true, description: 'List of Parent Folders up to Root' }),
    __metadata("design:type", Array)
], FolderBase.prototype, "parents", void 0);
FolderBase = __decorate([
    ResultType({ description: 'Folder' })
], FolderBase);
export { FolderBase };
//# sourceMappingURL=folder-base.model.js.map