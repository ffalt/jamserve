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
exports.PlaylistEntryQL = exports.PlaylistEntry = void 0;
const track_1 = require("../track/track");
const episode_1 = require("../episode/episode");
const playlist_1 = require("../playlist/playlist");
const type_graphql_1 = require("type-graphql");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
let PlaylistEntry = class PlaylistEntry extends base_1.Base {
    constructor() {
        super(...arguments);
        this.playlist = new orm_1.Reference(this);
        this.track = new orm_1.Reference(this);
        this.episode = new orm_1.Reference(this);
    }
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    orm_1.Property(() => orm_1.ORM_INT),
    __metadata("design:type", Number)
], PlaylistEntry.prototype, "position", void 0);
__decorate([
    type_graphql_1.Field(() => playlist_1.PlaylistQL),
    orm_1.ManyToOne(() => playlist_1.Playlist, playlist => playlist.entries),
    __metadata("design:type", orm_1.Reference)
], PlaylistEntry.prototype, "playlist", void 0);
__decorate([
    type_graphql_1.Field(() => track_1.TrackQL),
    orm_1.ManyToOne(() => track_1.Track, track => track.playlistEntries),
    __metadata("design:type", orm_1.Reference)
], PlaylistEntry.prototype, "track", void 0);
__decorate([
    type_graphql_1.Field(() => episode_1.EpisodeQL),
    orm_1.ManyToOne(() => episode_1.Episode, episode => episode.playlistEntries),
    __metadata("design:type", orm_1.Reference)
], PlaylistEntry.prototype, "episode", void 0);
PlaylistEntry = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], PlaylistEntry);
exports.PlaylistEntry = PlaylistEntry;
let PlaylistEntryQL = class PlaylistEntryQL extends PlaylistEntry {
};
PlaylistEntryQL = __decorate([
    type_graphql_1.ObjectType()
], PlaylistEntryQL);
exports.PlaylistEntryQL = PlaylistEntryQL;
//# sourceMappingURL=playlist-entry.js.map