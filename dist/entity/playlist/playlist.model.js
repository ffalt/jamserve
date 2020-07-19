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
exports.PlaylistIndex = exports.PlaylistIndexGroup = exports.PlaylistIndexEntry = exports.PlaylistPage = exports.Playlist = void 0;
const base_model_1 = require("../base/base.model");
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const tag_model_1 = require("../tag/tag.model");
let Playlist = class Playlist extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField({ description: 'Owner User Id', isID: true }),
    __metadata("design:type", String)
], Playlist.prototype, "userID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Owner User Name', isID: true }),
    __metadata("design:type", String)
], Playlist.prototype, "userName", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Playlist is public?', example: false }),
    __metadata("design:type", Boolean)
], Playlist.prototype, "isPublic", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Comment', example: 'Awesome!' }),
    __metadata("design:type", String)
], Playlist.prototype, "comment", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Playlist Created Timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], Playlist.prototype, "created", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Playlist Changed Timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], Playlist.prototype, "changed", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Playlist duration', min: 0, example: 12345 }),
    __metadata("design:type", Number)
], Playlist.prototype, "duration", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Entries', min: 0, example: 5 }),
    __metadata("design:type", Number)
], Playlist.prototype, "entriesCount", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { description: 'List of Media Base IDs', isID: true }),
    __metadata("design:type", Array)
], Playlist.prototype, "entriesIDs", void 0);
__decorate([
    decorators_1.ObjField(() => [tag_model_1.MediaBase], { nullable: true, description: 'List of Media Base Entries' }),
    __metadata("design:type", Array)
], Playlist.prototype, "entries", void 0);
Playlist = __decorate([
    decorators_1.ResultType({ description: 'Playlist' })
], Playlist);
exports.Playlist = Playlist;
let PlaylistPage = class PlaylistPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Playlist, { description: 'List of Playlists' }),
    __metadata("design:type", Array)
], PlaylistPage.prototype, "items", void 0);
PlaylistPage = __decorate([
    decorators_1.ResultType({ description: 'Album Playlist' })
], PlaylistPage);
exports.PlaylistPage = PlaylistPage;
let PlaylistIndexEntry = class PlaylistIndexEntry {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], PlaylistIndexEntry.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'Awesome Playlist' }),
    __metadata("design:type", String)
], PlaylistIndexEntry.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Entry Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], PlaylistIndexEntry.prototype, "entryCount", void 0);
PlaylistIndexEntry = __decorate([
    decorators_1.ResultType({ description: 'Playlist Index Entry' })
], PlaylistIndexEntry);
exports.PlaylistIndexEntry = PlaylistIndexEntry;
let PlaylistIndexGroup = class PlaylistIndexGroup {
};
__decorate([
    decorators_1.ObjField({ description: 'Playlist Group Name', example: 'A' }),
    __metadata("design:type", String)
], PlaylistIndexGroup.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => [PlaylistIndexEntry]),
    __metadata("design:type", Array)
], PlaylistIndexGroup.prototype, "items", void 0);
PlaylistIndexGroup = __decorate([
    decorators_1.ResultType({ description: 'Playlist Index Group' })
], PlaylistIndexGroup);
exports.PlaylistIndexGroup = PlaylistIndexGroup;
let PlaylistIndex = class PlaylistIndex {
};
__decorate([
    decorators_1.ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], PlaylistIndex.prototype, "lastModified", void 0);
__decorate([
    decorators_1.ObjField(() => [PlaylistIndexGroup], { description: 'Playlist Index Groups' }),
    __metadata("design:type", Array)
], PlaylistIndex.prototype, "groups", void 0);
PlaylistIndex = __decorate([
    decorators_1.ResultType({ description: 'Playlist Index' })
], PlaylistIndex);
exports.PlaylistIndex = PlaylistIndex;
//# sourceMappingURL=playlist.model.js.map