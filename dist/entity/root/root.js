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
exports.RootPageQL = exports.RootQL = exports.RootStatusQL = exports.Root = void 0;
const folder_1 = require("../folder/folder");
const track_1 = require("../track/track");
const album_1 = require("../album/album");
const artist_1 = require("../artist/artist");
const series_1 = require("../series/series");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
let Root = class Root extends base_1.Base {
    constructor() {
        super(...arguments);
        this.folders = new orm_1.Collection(this);
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
], Root.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Root.prototype, "path", void 0);
__decorate([
    type_graphql_1.Field(() => enums_1.RootScanStrategy),
    orm_1.Property(() => enums_1.RootScanStrategy),
    __metadata("design:type", String)
], Root.prototype, "strategy", void 0);
__decorate([
    type_graphql_1.Field(() => [folder_1.FolderQL]),
    orm_1.OneToMany(() => folder_1.Folder, folder => folder.root, { orderBy: { path: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Root.prototype, "folders", void 0);
__decorate([
    type_graphql_1.Field(() => [track_1.TrackQL]),
    orm_1.OneToMany(() => track_1.Track, track => track.root, { orderBy: { path: orm_1.QueryOrder.ASC, tag: { disc: orm_1.QueryOrder.ASC, trackNr: orm_1.QueryOrder.ASC } } }),
    __metadata("design:type", orm_1.Collection)
], Root.prototype, "tracks", void 0);
__decorate([
    type_graphql_1.Field(() => [album_1.AlbumQL]),
    orm_1.ManyToMany(() => album_1.Album, album => album.roots, { orderBy: { artist: { nameSort: orm_1.QueryOrder.ASC }, albumType: orm_1.QueryOrder.ASC, name: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Root.prototype, "albums", void 0);
__decorate([
    type_graphql_1.Field(() => [artist_1.ArtistQL]),
    orm_1.ManyToMany(() => artist_1.Artist, artist => artist.roots, { orderBy: { nameSort: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Root.prototype, "artists", void 0);
__decorate([
    type_graphql_1.Field(() => [series_1.SeriesQL]),
    orm_1.ManyToMany(() => series_1.Series, series => series.roots, { orderBy: { name: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Root.prototype, "series", void 0);
Root = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], Root);
exports.Root = Root;
let RootStatusQL = class RootStatusQL {
};
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], RootStatusQL.prototype, "lastScan", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    __metadata("design:type", Boolean)
], RootStatusQL.prototype, "scanning", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RootStatusQL.prototype, "error", void 0);
RootStatusQL = __decorate([
    type_graphql_1.ObjectType()
], RootStatusQL);
exports.RootStatusQL = RootStatusQL;
let RootQL = class RootQL extends Root {
};
__decorate([
    type_graphql_1.Field(() => RootStatusQL),
    __metadata("design:type", Object)
], RootQL.prototype, "status", void 0);
RootQL = __decorate([
    type_graphql_1.ObjectType()
], RootQL);
exports.RootQL = RootQL;
let RootPageQL = class RootPageQL extends base_1.PaginatedResponse(Root, RootQL) {
};
RootPageQL = __decorate([
    type_graphql_1.ObjectType()
], RootPageQL);
exports.RootPageQL = RootPageQL;
//# sourceMappingURL=root.js.map