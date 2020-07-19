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
exports.AlbumIndexQL = exports.AlbumIndexGroupQL = exports.AlbumPageQL = exports.AlbumQL = exports.Album = void 0;
const track_1 = require("../track/track");
const root_1 = require("../root/root");
const folder_1 = require("../folder/folder");
const series_1 = require("../series/series");
const artist_1 = require("../artist/artist");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_1 = require("../base/base");
const mikro_orm_1 = require("mikro-orm");
const orm_types_1 = require("../../modules/engine/services/orm.types");
const state_1 = require("../state/state");
let Album = class Album extends base_1.Base {
    constructor() {
        super(...arguments);
        this.albumType = enums_1.AlbumType.unknown;
        this.genres = [];
        this.tracks = new mikro_orm_1.Collection(this);
        this.roots = new mikro_orm_1.Collection(this);
        this.folders = new mikro_orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Album.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Album.prototype, "slug", void 0);
__decorate([
    type_graphql_1.Field(() => enums_1.AlbumType),
    mikro_orm_1.Enum(() => enums_1.AlbumType),
    __metadata("design:type", String)
], Album.prototype, "albumType", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Album.prototype, "seriesNr", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], Album.prototype, "year", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], Album.prototype, "duration", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Album.prototype, "mbArtistID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Album.prototype, "mbReleaseID", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    mikro_orm_1.Property({ type: orm_types_1.OrmStringListType }),
    __metadata("design:type", Array)
], Album.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => [track_1.TrackQL]),
    mikro_orm_1.OneToMany(() => track_1.Track, track => track.album, { orderBy: { tag: { disc: mikro_orm_1.QueryOrder.ASC, trackNr: mikro_orm_1.QueryOrder.ASC, title: mikro_orm_1.QueryOrder.ASC } } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Album.prototype, "tracks", void 0);
__decorate([
    type_graphql_1.Field(() => [root_1.RootQL]),
    mikro_orm_1.ManyToMany(() => root_1.Root, root => root.albums, { owner: true, orderBy: { name: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Album.prototype, "roots", void 0);
__decorate([
    type_graphql_1.Field(() => [folder_1.FolderQL]),
    mikro_orm_1.ManyToMany(() => folder_1.Folder, folder => folder.albums, { owner: true, orderBy: { path: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Album.prototype, "folders", void 0);
__decorate([
    type_graphql_1.Field(() => [series_1.SeriesQL], { nullable: true }),
    mikro_orm_1.ManyToOne(() => series_1.Series),
    __metadata("design:type", series_1.Series)
], Album.prototype, "series", void 0);
__decorate([
    type_graphql_1.Field(() => artist_1.ArtistQL),
    mikro_orm_1.ManyToOne(() => artist_1.Artist),
    __metadata("design:type", artist_1.Artist)
], Album.prototype, "artist", void 0);
Album = __decorate([
    type_graphql_1.ObjectType(),
    mikro_orm_1.Entity()
], Album);
exports.Album = Album;
let AlbumQL = class AlbumQL extends Album {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], AlbumQL.prototype, "tracksCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], AlbumQL.prototype, "rootsCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], AlbumQL.prototype, "foldersCount", void 0);
__decorate([
    type_graphql_1.Field(() => state_1.StateQL),
    __metadata("design:type", state_1.State)
], AlbumQL.prototype, "state", void 0);
AlbumQL = __decorate([
    type_graphql_1.ObjectType()
], AlbumQL);
exports.AlbumQL = AlbumQL;
let AlbumPageQL = class AlbumPageQL extends base_1.PaginatedResponse(Album, AlbumQL) {
};
AlbumPageQL = __decorate([
    type_graphql_1.ObjectType()
], AlbumPageQL);
exports.AlbumPageQL = AlbumPageQL;
let AlbumIndexGroupQL = class AlbumIndexGroupQL extends base_1.IndexGroup(Album, AlbumQL) {
};
AlbumIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], AlbumIndexGroupQL);
exports.AlbumIndexGroupQL = AlbumIndexGroupQL;
let AlbumIndexQL = class AlbumIndexQL extends base_1.Index(AlbumIndexGroupQL) {
};
AlbumIndexQL = __decorate([
    type_graphql_1.ObjectType()
], AlbumIndexQL);
exports.AlbumIndexQL = AlbumIndexQL;
//# sourceMappingURL=album.js.map