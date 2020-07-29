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
var Folder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderHealth = exports.FolderIndexQL = exports.FolderIndexGroupQL = exports.FolderPageQL = exports.FolderQL = exports.Folder = void 0;
const artwork_1 = require("../artwork/artwork");
const root_1 = require("../root/root");
const track_1 = require("../track/track");
const album_1 = require("../album/album");
const artist_1 = require("../artist/artist");
const series_1 = require("../series/series");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
const state_1 = require("../state/state");
const health_model_1 = require("../health/health.model");
let Folder = Folder_1 = class Folder extends base_1.Base {
    constructor() {
        super(...arguments);
        this.genres = [];
        this.parent = new orm_1.Reference(this);
        this.children = new orm_1.Collection(this);
        this.root = new orm_1.Reference(this);
        this.artworks = new orm_1.Collection(this);
        this.tracks = new orm_1.Collection(this);
        this.albums = new orm_1.Collection(this);
        this.artists = new orm_1.Collection(this);
        this.series = new orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Folder.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Folder.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Folder.prototype, "path", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    orm_1.Property(() => orm_1.ORM_TIMESTAMP),
    __metadata("design:type", Number)
], Folder.prototype, "statCreated", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    orm_1.Property(() => orm_1.ORM_TIMESTAMP),
    __metadata("design:type", Number)
], Folder.prototype, "statModified", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    orm_1.Property(() => orm_1.ORM_INT),
    __metadata("design:type", Number)
], Folder.prototype, "level", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "album", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "artist", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "artistSort", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Folder.prototype, "albumTrackCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Folder.prototype, "year", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "mbReleaseID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "mbReleaseGroupID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "mbAlbumType", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "mbArtistID", void 0);
__decorate([
    type_graphql_1.Field(() => enums_1.AlbumType, { nullable: true }),
    orm_1.Property(() => enums_1.AlbumType, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "albumType", void 0);
__decorate([
    type_graphql_1.Field(() => enums_1.FolderType),
    orm_1.Property(() => enums_1.FolderType),
    __metadata("design:type", String)
], Folder.prototype, "folderType", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    orm_1.Property(() => [String]),
    __metadata("design:type", Array)
], Folder.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => FolderQL, { nullable: true }),
    orm_1.ManyToOne(() => Folder_1, folder => folder.children, { nullable: true }),
    __metadata("design:type", orm_1.Reference)
], Folder.prototype, "parent", void 0);
__decorate([
    type_graphql_1.Field(() => [FolderQL]),
    orm_1.OneToMany(() => Folder_1, folder => folder.parent, { orderBy: { path: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Folder.prototype, "children", void 0);
__decorate([
    type_graphql_1.Field(() => root_1.RootQL),
    orm_1.ManyToOne(() => root_1.Root, root => root.folders),
    __metadata("design:type", orm_1.Reference)
], Folder.prototype, "root", void 0);
__decorate([
    type_graphql_1.Field(() => [artwork_1.ArtworkQL]),
    orm_1.OneToMany(() => artwork_1.Artwork, artwork => artwork.folder, { orderBy: { name: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Folder.prototype, "artworks", void 0);
__decorate([
    type_graphql_1.Field(() => [track_1.TrackQL]),
    orm_1.OneToMany(() => track_1.Track, track => track.folder, { orderBy: { tag: { disc: orm_1.QueryOrder.ASC, trackNr: orm_1.QueryOrder.ASC } } }),
    __metadata("design:type", orm_1.Collection)
], Folder.prototype, "tracks", void 0);
__decorate([
    type_graphql_1.Field(() => [album_1.AlbumQL]),
    orm_1.ManyToMany(() => album_1.Album, album => album.folders, { orderBy: { albumType: orm_1.QueryOrder.ASC, name: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Folder.prototype, "albums", void 0);
__decorate([
    type_graphql_1.Field(() => [artist_1.ArtistQL]),
    orm_1.ManyToMany(() => artist_1.Artist, artist => artist.folders, { orderBy: { nameSort: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Folder.prototype, "artists", void 0);
__decorate([
    type_graphql_1.Field(() => [series_1.SeriesQL]),
    orm_1.ManyToMany(() => series_1.Series, series => series.folders, { orderBy: { name: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Folder.prototype, "series", void 0);
Folder = Folder_1 = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], Folder);
exports.Folder = Folder;
let FolderQL = class FolderQL extends Folder {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "childrenCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "artworksCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "tracksCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "albumsCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "artistsCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "seriesCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "rootsCount", void 0);
__decorate([
    type_graphql_1.Field(() => state_1.StateQL),
    __metadata("design:type", state_1.State)
], FolderQL.prototype, "state", void 0);
FolderQL = __decorate([
    type_graphql_1.ObjectType()
], FolderQL);
exports.FolderQL = FolderQL;
let FolderPageQL = class FolderPageQL extends base_1.PaginatedResponse(Folder, FolderQL) {
};
FolderPageQL = __decorate([
    type_graphql_1.ObjectType()
], FolderPageQL);
exports.FolderPageQL = FolderPageQL;
let FolderIndexGroupQL = class FolderIndexGroupQL extends base_1.IndexGroup(Folder, FolderQL) {
};
FolderIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], FolderIndexGroupQL);
exports.FolderIndexGroupQL = FolderIndexGroupQL;
let FolderIndexQL = class FolderIndexQL extends base_1.Index(FolderIndexGroupQL) {
};
FolderIndexQL = __decorate([
    type_graphql_1.ObjectType()
], FolderIndexQL);
exports.FolderIndexQL = FolderIndexQL;
let FolderHealth = class FolderHealth {
};
__decorate([
    type_graphql_1.Field(() => Folder),
    __metadata("design:type", Folder)
], FolderHealth.prototype, "folder", void 0);
__decorate([
    type_graphql_1.Field(() => [health_model_1.FolderHealthHint]),
    __metadata("design:type", Array)
], FolderHealth.prototype, "health", void 0);
FolderHealth = __decorate([
    type_graphql_1.ObjectType()
], FolderHealth);
exports.FolderHealth = FolderHealth;
//# sourceMappingURL=folder.js.map