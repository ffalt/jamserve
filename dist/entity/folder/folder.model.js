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
exports.FolderHealth = exports.FolderIndex = exports.FolderIndexGroup = exports.FolderIndexEntry = exports.FolderPage = exports.Folder = exports.FolderBase = exports.FolderParent = exports.FolderTag = void 0;
const base_model_1 = require("../base/base.model");
const enums_1 = require("../../types/enums");
const track_model_1 = require("../track/track.model");
const metadata_model_1 = require("../metadata/metadata.model");
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const artwork_model_1 = require("../artwork/artwork.model");
const health_model_1 = require("../health/health.model");
let FolderTag = class FolderTag {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Album Name', example: 'California' }),
    __metadata("design:type", String)
], FolderTag.prototype, "album", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.AlbumType, { nullable: true, description: 'Album Type', example: enums_1.AlbumType.album }),
    __metadata("design:type", String)
], FolderTag.prototype, "albumType", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Artist Name', example: 'Mr. Bungle' }),
    __metadata("design:type", String)
], FolderTag.prototype, "artist", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Artist Sort Name', example: 'Mr. Bungle' }),
    __metadata("design:type", String)
], FolderTag.prototype, "artistSort", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'Genres', example: ['Rock'] }),
    __metadata("design:type", Array)
], FolderTag.prototype, "genres", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Year', example: 1999 }),
    __metadata("design:type", Number)
], FolderTag.prototype, "year", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Artist Id', example: example_consts_1.examples.mbArtistID }),
    __metadata("design:type", String)
], FolderTag.prototype, "mbArtistID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Release Id', example: example_consts_1.examples.mbReleaseID }),
    __metadata("design:type", String)
], FolderTag.prototype, "mbReleaseID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Release Group Id', example: example_consts_1.examples.mbReleaseGroupID }),
    __metadata("design:type", String)
], FolderTag.prototype, "mbReleaseGroupID", void 0);
FolderTag = __decorate([
    decorators_1.ResultType({ description: 'Folder Meta Information' })
], FolderTag);
exports.FolderTag = FolderTag;
let FolderParent = class FolderParent {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], FolderParent.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'Awesome' }),
    __metadata("design:type", String)
], FolderParent.prototype, "name", void 0);
FolderParent = __decorate([
    decorators_1.ResultType({ description: 'Folder Parent Information' })
], FolderParent);
exports.FolderParent = FolderParent;
let FolderBase = class FolderBase extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField(() => enums_1.FolderType, { description: 'Album Type', example: enums_1.FolderType.multialbum }),
    __metadata("design:type", String)
], FolderBase.prototype, "type", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Level in Root', example: 3 }),
    __metadata("design:type", Number)
], FolderBase.prototype, "level", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderBase.prototype, "parentID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 }),
    __metadata("design:type", Number)
], FolderBase.prototype, "trackCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Number of Folders', min: 0, example: 5 }),
    __metadata("design:type", Number)
], FolderBase.prototype, "folderCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Number of Artworks', min: 0, example: 5 }),
    __metadata("design:type", Number)
], FolderBase.prototype, "artworkCount", void 0);
__decorate([
    decorators_1.ObjField(() => FolderTag, { nullable: true, description: 'Folder Meta Information' }),
    __metadata("design:type", FolderTag)
], FolderBase.prototype, "tag", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true }),
    __metadata("design:type", Array)
], FolderBase.prototype, "trackIDs", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Folder Ids', isID: true }),
    __metadata("design:type", Array)
], FolderBase.prototype, "folderIDs", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Artwork Ids', isID: true }),
    __metadata("design:type", Array)
], FolderBase.prototype, "artworkIDs", void 0);
__decorate([
    decorators_1.ObjField(() => metadata_model_1.ExtendedInfo, { nullable: true, description: 'Metadata for the Folder (via External Service)' }),
    __metadata("design:type", metadata_model_1.ExtendedInfo)
], FolderBase.prototype, "info", void 0);
__decorate([
    decorators_1.ObjField(() => [FolderParent], { nullable: true, description: 'List of Parent Folders up to Root' }),
    __metadata("design:type", Array)
], FolderBase.prototype, "parents", void 0);
FolderBase = __decorate([
    decorators_1.ResultType({ description: 'Folder' })
], FolderBase);
exports.FolderBase = FolderBase;
let Folder = class Folder extends FolderBase {
};
__decorate([
    decorators_1.ObjField(() => [track_model_1.TrackBase], { nullable: true, description: 'List of Tracks' }),
    __metadata("design:type", Array)
], Folder.prototype, "tracks", void 0);
__decorate([
    decorators_1.ObjField(() => [FolderBase], { nullable: true, description: 'List of Folders' }),
    __metadata("design:type", Array)
], Folder.prototype, "folders", void 0);
__decorate([
    decorators_1.ObjField(() => [artwork_model_1.Artwork], { nullable: true, description: 'List of Artwork Images' }),
    __metadata("design:type", Array)
], Folder.prototype, "artworks", void 0);
__decorate([
    decorators_1.ObjField(() => [FolderBase], { nullable: true, description: 'List of similar Folders (via Exteernal Service)' }),
    __metadata("design:type", Array)
], Folder.prototype, "similar", void 0);
Folder = __decorate([
    decorators_1.ResultType({ description: 'Folder with tracks' })
], Folder);
exports.Folder = Folder;
let FolderPage = class FolderPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => [Folder], { description: 'List of Folders' }),
    __metadata("design:type", Array)
], FolderPage.prototype, "items", void 0);
FolderPage = __decorate([
    decorators_1.ResultType({ description: 'Folder Page' })
], FolderPage);
exports.FolderPage = FolderPage;
let FolderIndexEntry = class FolderIndexEntry {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], FolderIndexEntry.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'The Mars Volta' }),
    __metadata("design:type", String)
], FolderIndexEntry.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Track Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], FolderIndexEntry.prototype, "trackCount", void 0);
FolderIndexEntry = __decorate([
    decorators_1.ResultType({ description: 'Folder Index Entry' })
], FolderIndexEntry);
exports.FolderIndexEntry = FolderIndexEntry;
let FolderIndexGroup = class FolderIndexGroup {
};
__decorate([
    decorators_1.ObjField({ description: 'Folder Group Name', example: 'M' }),
    __metadata("design:type", String)
], FolderIndexGroup.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => [FolderIndexEntry]),
    __metadata("design:type", Array)
], FolderIndexGroup.prototype, "items", void 0);
FolderIndexGroup = __decorate([
    decorators_1.ResultType({ description: 'Folder Index Group' })
], FolderIndexGroup);
exports.FolderIndexGroup = FolderIndexGroup;
let FolderIndex = class FolderIndex {
};
__decorate([
    decorators_1.ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], FolderIndex.prototype, "lastModified", void 0);
__decorate([
    decorators_1.ObjField(() => [FolderIndexGroup], { description: 'Folder Index Groups' }),
    __metadata("design:type", Array)
], FolderIndex.prototype, "groups", void 0);
FolderIndex = __decorate([
    decorators_1.ResultType({ description: 'Folder Index' })
], FolderIndex);
exports.FolderIndex = FolderIndex;
let FolderHealth = class FolderHealth {
};
__decorate([
    decorators_1.ObjField(() => Folder, { description: 'Folder' }),
    __metadata("design:type", Folder)
], FolderHealth.prototype, "folder", void 0);
__decorate([
    decorators_1.ObjField(() => [health_model_1.FolderHealthHint], { description: 'List of Health Hints' }),
    __metadata("design:type", Array)
], FolderHealth.prototype, "health", void 0);
FolderHealth = __decorate([
    decorators_1.ResultType({ description: 'Folder Health' })
], FolderHealth);
exports.FolderHealth = FolderHealth;
//# sourceMappingURL=folder.model.js.map