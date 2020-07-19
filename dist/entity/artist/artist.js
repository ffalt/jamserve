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
exports.ArtistIndexQL = exports.ArtistIndexGroupQL = exports.ArtistPageQL = exports.ArtistQL = exports.Artist = void 0;
const track_1 = require("../track/track");
const album_1 = require("../album/album");
const root_1 = require("../root/root");
const folder_1 = require("../folder/folder");
const series_1 = require("../series/series");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const mikro_orm_1 = require("mikro-orm");
const base_1 = require("../base/base");
const orm_types_1 = require("../../modules/engine/services/orm.types");
const state_1 = require("../state/state");
let Artist = class Artist extends base_1.Base {
    constructor() {
        super(...arguments);
        this.albumTypes = [];
        this.genres = [];
        this.tracks = new mikro_orm_1.Collection(this);
        this.albumTracks = new mikro_orm_1.Collection(this);
        this.albums = new mikro_orm_1.Collection(this);
        this.roots = new mikro_orm_1.Collection(this);
        this.folders = new mikro_orm_1.Collection(this);
        this.series = new mikro_orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Artist.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Artist.prototype, "slug", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Artist.prototype, "nameSort", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Artist.prototype, "mbArtistID", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.AlbumType]),
    mikro_orm_1.Property({ type: orm_types_1.OrmStringListType }),
    __metadata("design:type", Array)
], Artist.prototype, "albumTypes", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    mikro_orm_1.Property({ type: orm_types_1.OrmStringListType }),
    __metadata("design:type", Array)
], Artist.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => [track_1.TrackQL]),
    mikro_orm_1.OneToMany(() => track_1.Track, track => track.artist, { orderBy: { album: { name: mikro_orm_1.QueryOrder.ASC }, tag: { disc: mikro_orm_1.QueryOrder.ASC, trackNr: mikro_orm_1.QueryOrder.ASC } } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Artist.prototype, "tracks", void 0);
__decorate([
    type_graphql_1.Field(() => [track_1.TrackQL]),
    mikro_orm_1.OneToMany(() => track_1.Track, track => track.albumArtist, { orderBy: { album: { name: mikro_orm_1.QueryOrder.ASC }, tag: { disc: mikro_orm_1.QueryOrder.ASC, trackNr: mikro_orm_1.QueryOrder.ASC } } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Artist.prototype, "albumTracks", void 0);
__decorate([
    type_graphql_1.Field(() => [album_1.AlbumQL]),
    mikro_orm_1.OneToMany(() => album_1.Album, album => album.artist, { orderBy: { albumType: mikro_orm_1.QueryOrder.ASC, year: mikro_orm_1.QueryOrder.DESC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Artist.prototype, "albums", void 0);
__decorate([
    type_graphql_1.Field(() => [root_1.RootQL]),
    mikro_orm_1.ManyToMany(() => root_1.Root, root => root.artists, { owner: true, orderBy: { name: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Artist.prototype, "roots", void 0);
__decorate([
    type_graphql_1.Field(() => [folder_1.FolderQL]),
    mikro_orm_1.ManyToMany(() => folder_1.Folder, folder => folder.artists, { owner: true, orderBy: { path: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Artist.prototype, "folders", void 0);
__decorate([
    type_graphql_1.Field(() => [series_1.SeriesQL]),
    mikro_orm_1.OneToMany(() => series_1.Series, series => series.artist, { orderBy: { name: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Artist.prototype, "series", void 0);
Artist = __decorate([
    type_graphql_1.ObjectType(),
    mikro_orm_1.Entity()
], Artist);
exports.Artist = Artist;
let ArtistQL = class ArtistQL extends Artist {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "tracksCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "albumsCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "rootsCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "foldersCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "seriesCount", void 0);
__decorate([
    type_graphql_1.Field(() => state_1.StateQL),
    __metadata("design:type", state_1.State)
], ArtistQL.prototype, "state", void 0);
ArtistQL = __decorate([
    type_graphql_1.ObjectType()
], ArtistQL);
exports.ArtistQL = ArtistQL;
let ArtistPageQL = class ArtistPageQL extends base_1.PaginatedResponse(Artist, ArtistQL) {
};
ArtistPageQL = __decorate([
    type_graphql_1.ObjectType()
], ArtistPageQL);
exports.ArtistPageQL = ArtistPageQL;
let ArtistIndexGroupQL = class ArtistIndexGroupQL extends base_1.IndexGroup(Artist, ArtistQL) {
};
ArtistIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], ArtistIndexGroupQL);
exports.ArtistIndexGroupQL = ArtistIndexGroupQL;
let ArtistIndexQL = class ArtistIndexQL extends base_1.Index(ArtistIndexGroupQL) {
};
ArtistIndexQL = __decorate([
    type_graphql_1.ObjectType()
], ArtistIndexQL);
exports.ArtistIndexQL = ArtistIndexQL;
//# sourceMappingURL=artist.js.map