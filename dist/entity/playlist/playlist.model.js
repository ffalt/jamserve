var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Base, Page } from '../base/base.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { MediaBase } from '../tag/tag.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let PlaylistBase = class PlaylistBase extends Base {
};
__decorate([
    ObjectField({ description: 'Owner User Id', isID: true }),
    __metadata("design:type", String)
], PlaylistBase.prototype, "userID", void 0);
__decorate([
    ObjectField({ description: 'Owner User Name', isID: true }),
    __metadata("design:type", String)
], PlaylistBase.prototype, "userName", void 0);
__decorate([
    ObjectField({ description: 'Playlist is public?', example: false }),
    __metadata("design:type", Boolean)
], PlaylistBase.prototype, "isPublic", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Comment', example: 'Awesome!' }),
    __metadata("design:type", String)
], PlaylistBase.prototype, "comment", void 0);
__decorate([
    ObjectField({ description: 'Playlist Created Timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistBase.prototype, "created", void 0);
__decorate([
    ObjectField({ description: 'Playlist Changed Timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistBase.prototype, "changed", void 0);
__decorate([
    ObjectField({ description: 'Playlist duration', min: 0, example: 12345 }),
    __metadata("design:type", Number)
], PlaylistBase.prototype, "duration", void 0);
__decorate([
    ObjectField({ description: 'Number of Entries', min: 0, example: 5 }),
    __metadata("design:type", Number)
], PlaylistBase.prototype, "entriesCount", void 0);
__decorate([
    ObjectField(() => [String], { description: 'List of Media Base IDs', isID: true }),
    __metadata("design:type", Array)
], PlaylistBase.prototype, "entriesIDs", void 0);
PlaylistBase = __decorate([
    ResultType({ description: 'Playlist' })
], PlaylistBase);
export { PlaylistBase };
let Playlist = class Playlist extends PlaylistBase {
};
__decorate([
    ObjectField(() => [MediaBase], { nullable: true, description: 'List of Media Base Entries' }),
    __metadata("design:type", Array)
], Playlist.prototype, "entries", void 0);
Playlist = __decorate([
    ResultType({ description: 'Playlist' })
], Playlist);
export { Playlist };
let PlaylistPage = class PlaylistPage extends Page {
};
__decorate([
    ObjectField(() => Playlist, { description: 'List of Playlists' }),
    __metadata("design:type", Array)
], PlaylistPage.prototype, "items", void 0);
PlaylistPage = __decorate([
    ResultType({ description: 'Album Playlist' })
], PlaylistPage);
export { PlaylistPage };
let PlaylistIndexEntry = class PlaylistIndexEntry {
};
__decorate([
    ObjectField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], PlaylistIndexEntry.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'Name', example: 'Awesome Playlist' }),
    __metadata("design:type", String)
], PlaylistIndexEntry.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'Entry Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], PlaylistIndexEntry.prototype, "entryCount", void 0);
PlaylistIndexEntry = __decorate([
    ResultType({ description: 'Playlist Index Entry' })
], PlaylistIndexEntry);
export { PlaylistIndexEntry };
let PlaylistIndexGroup = class PlaylistIndexGroup {
};
__decorate([
    ObjectField({ description: 'Playlist Group Name', example: 'A' }),
    __metadata("design:type", String)
], PlaylistIndexGroup.prototype, "name", void 0);
__decorate([
    ObjectField(() => [PlaylistIndexEntry]),
    __metadata("design:type", Array)
], PlaylistIndexGroup.prototype, "items", void 0);
PlaylistIndexGroup = __decorate([
    ResultType({ description: 'Playlist Index Group' })
], PlaylistIndexGroup);
export { PlaylistIndexGroup };
let PlaylistIndex = class PlaylistIndex {
};
__decorate([
    ObjectField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], PlaylistIndex.prototype, "lastModified", void 0);
__decorate([
    ObjectField(() => [PlaylistIndexGroup], { description: 'Playlist Index Groups' }),
    __metadata("design:type", Array)
], PlaylistIndex.prototype, "groups", void 0);
PlaylistIndex = __decorate([
    ResultType({ description: 'Playlist Index' })
], PlaylistIndex);
export { PlaylistIndex };
//# sourceMappingURL=playlist.model.js.map