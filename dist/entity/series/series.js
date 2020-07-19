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
exports.SeriesIndexQL = exports.SeriesIndexGroupQL = exports.SeriesPageQL = exports.SeriesQL = exports.Series = void 0;
const track_1 = require("../track/track");
const album_1 = require("../album/album");
const artist_1 = require("../artist/artist");
const root_1 = require("../root/root");
const folder_1 = require("../folder/folder");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const mikro_orm_1 = require("mikro-orm");
const base_1 = require("../base/base");
const orm_types_1 = require("../../modules/engine/services/orm.types");
const state_1 = require("../state/state");
let Series = class Series extends base_1.Base {
    constructor() {
        super(...arguments);
        this.tracks = new mikro_orm_1.Collection(this);
        this.albums = new mikro_orm_1.Collection(this);
        this.roots = new mikro_orm_1.Collection(this);
        this.folders = new mikro_orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Series.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.AlbumType]),
    mikro_orm_1.Property({ type: orm_types_1.OrmStringListType }),
    __metadata("design:type", Array)
], Series.prototype, "albumTypes", void 0);
__decorate([
    type_graphql_1.Field(() => artist_1.ArtistQL),
    mikro_orm_1.ManyToOne(() => artist_1.Artist),
    __metadata("design:type", artist_1.Artist)
], Series.prototype, "artist", void 0);
__decorate([
    type_graphql_1.Field(() => [track_1.TrackQL]),
    mikro_orm_1.OneToMany(() => track_1.Track, track => track.series, { orderBy: { tag: { seriesNr: mikro_orm_1.QueryOrder.ASC, disc: mikro_orm_1.QueryOrder.ASC, trackNr: mikro_orm_1.QueryOrder.ASC, title: mikro_orm_1.QueryOrder.ASC } } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Series.prototype, "tracks", void 0);
__decorate([
    type_graphql_1.Field(() => [album_1.AlbumQL]),
    mikro_orm_1.ManyToMany({ entity: () => album_1.Album, orderBy: { seriesNr: mikro_orm_1.QueryOrder.ASC, name: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Series.prototype, "albums", void 0);
__decorate([
    type_graphql_1.Field(() => [root_1.RootQL]),
    mikro_orm_1.ManyToMany(() => root_1.Root, root => root.series, { owner: true, orderBy: { name: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Series.prototype, "roots", void 0);
__decorate([
    type_graphql_1.Field(() => [folder_1.FolderQL]),
    mikro_orm_1.ManyToMany(() => folder_1.Folder, folder => folder.series, { owner: true, orderBy: { path: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Series.prototype, "folders", void 0);
Series = __decorate([
    type_graphql_1.ObjectType(),
    mikro_orm_1.Entity()
], Series);
exports.Series = Series;
let SeriesQL = class SeriesQL extends Series {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], SeriesQL.prototype, "rootsCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], SeriesQL.prototype, "foldersCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], SeriesQL.prototype, "tracksCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], SeriesQL.prototype, "albumsCount", void 0);
__decorate([
    type_graphql_1.Field(() => state_1.StateQL),
    __metadata("design:type", state_1.State)
], SeriesQL.prototype, "state", void 0);
SeriesQL = __decorate([
    type_graphql_1.ObjectType()
], SeriesQL);
exports.SeriesQL = SeriesQL;
let SeriesPageQL = class SeriesPageQL extends base_1.PaginatedResponse(Series, SeriesQL) {
};
SeriesPageQL = __decorate([
    type_graphql_1.ObjectType()
], SeriesPageQL);
exports.SeriesPageQL = SeriesPageQL;
let SeriesIndexGroupQL = class SeriesIndexGroupQL extends base_1.IndexGroup(Series, SeriesQL) {
};
SeriesIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], SeriesIndexGroupQL);
exports.SeriesIndexGroupQL = SeriesIndexGroupQL;
let SeriesIndexQL = class SeriesIndexQL extends base_1.Index(SeriesIndexGroupQL) {
};
SeriesIndexQL = __decorate([
    type_graphql_1.ObjectType()
], SeriesIndexQL);
exports.SeriesIndexQL = SeriesIndexQL;
//# sourceMappingURL=series.js.map