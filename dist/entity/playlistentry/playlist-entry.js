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
const mikro_orm_1 = require("mikro-orm");
let PlaylistEntry = class PlaylistEntry extends base_1.Base {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], PlaylistEntry.prototype, "position", void 0);
__decorate([
    type_graphql_1.Field(() => playlist_1.PlaylistQL),
    mikro_orm_1.ManyToOne(() => playlist_1.Playlist),
    __metadata("design:type", playlist_1.Playlist)
], PlaylistEntry.prototype, "playlist", void 0);
__decorate([
    type_graphql_1.Field(() => track_1.TrackQL),
    mikro_orm_1.OneToOne(() => track_1.Track),
    __metadata("design:type", track_1.Track)
], PlaylistEntry.prototype, "track", void 0);
__decorate([
    type_graphql_1.Field(() => episode_1.EpisodeQL),
    mikro_orm_1.OneToOne(() => episode_1.Episode),
    __metadata("design:type", episode_1.Episode)
], PlaylistEntry.prototype, "episode", void 0);
PlaylistEntry = __decorate([
    type_graphql_1.ObjectType(),
    mikro_orm_1.Entity()
], PlaylistEntry);
exports.PlaylistEntry = PlaylistEntry;
let PlaylistEntryQL = class PlaylistEntryQL extends PlaylistEntry {
};
PlaylistEntryQL = __decorate([
    type_graphql_1.ObjectType()
], PlaylistEntryQL);
exports.PlaylistEntryQL = PlaylistEntryQL;
//# sourceMappingURL=playlist-entry.js.map