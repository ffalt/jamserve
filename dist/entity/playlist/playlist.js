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
exports.PlaylistIndexQL = exports.PlaylistIndexGroupQL = exports.PlaylistPageQL = exports.PlaylistQL = exports.Playlist = void 0;
const user_1 = require("../user/user");
const playlist_entry_1 = require("../playlistentry/playlist-entry");
const type_graphql_1 = require("type-graphql");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
const state_1 = require("../state/state");
let Playlist = class Playlist extends base_1.Base {
    constructor() {
        super(...arguments);
        this.user = new orm_1.Reference(this);
        this.isPublic = false;
        this.duration = 0;
        this.entries = new orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Playlist.prototype, "name", void 0);
__decorate([
    orm_1.ManyToOne(() => user_1.User, user => user.playlists),
    __metadata("design:type", orm_1.Reference)
], Playlist.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "comment", void 0);
__decorate([
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "coverArt", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    orm_1.Property(() => Boolean),
    __metadata("design:type", Boolean)
], Playlist.prototype, "isPublic", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    orm_1.Property(() => orm_1.ORM_INT),
    __metadata("design:type", Number)
], Playlist.prototype, "duration", void 0);
__decorate([
    type_graphql_1.Field(() => [playlist_entry_1.PlaylistEntryQL]),
    orm_1.OneToMany(() => playlist_entry_1.PlaylistEntry, entry => entry.playlist, { orderBy: { position: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Playlist.prototype, "entries", void 0);
Playlist = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], Playlist);
exports.Playlist = Playlist;
let PlaylistQL = class PlaylistQL extends Playlist {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    __metadata("design:type", String)
], PlaylistQL.prototype, "userID", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], PlaylistQL.prototype, "userName", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PlaylistQL.prototype, "entriesCount", void 0);
__decorate([
    type_graphql_1.Field(() => state_1.StateQL),
    __metadata("design:type", state_1.State)
], PlaylistQL.prototype, "state", void 0);
PlaylistQL = __decorate([
    type_graphql_1.ObjectType()
], PlaylistQL);
exports.PlaylistQL = PlaylistQL;
let PlaylistPageQL = class PlaylistPageQL extends base_1.PaginatedResponse(Playlist, PlaylistQL) {
};
PlaylistPageQL = __decorate([
    type_graphql_1.ObjectType()
], PlaylistPageQL);
exports.PlaylistPageQL = PlaylistPageQL;
let PlaylistIndexGroupQL = class PlaylistIndexGroupQL extends base_1.IndexGroup(Playlist, PlaylistQL) {
};
PlaylistIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], PlaylistIndexGroupQL);
exports.PlaylistIndexGroupQL = PlaylistIndexGroupQL;
let PlaylistIndexQL = class PlaylistIndexQL extends base_1.Index(PlaylistIndexGroupQL) {
};
PlaylistIndexQL = __decorate([
    type_graphql_1.ObjectType()
], PlaylistIndexQL);
exports.PlaylistIndexQL = PlaylistIndexQL;
//# sourceMappingURL=playlist.js.map