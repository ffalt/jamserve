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
exports.GenreIndexQL = exports.GenreIndexGroupQL = exports.GenrePageQL = exports.GenreQL = exports.Genre = void 0;
const type_graphql_1 = require("type-graphql");
const base_1 = require("../base/base");
const decorators_1 = require("../../modules/orm/decorators");
const orm_1 = require("../../modules/orm");
const track_1 = require("../track/track");
const album_1 = require("../album/album");
const artist_1 = require("../artist/artist");
const folder_1 = require("../folder/folder");
let Genre = class Genre extends base_1.Base {
    constructor() {
        super(...arguments);
        this.tracks = new orm_1.Collection(this);
        this.albums = new orm_1.Collection(this);
        this.artists = new orm_1.Collection(this);
        this.folders = new orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    decorators_1.Property(() => String),
    __metadata("design:type", String)
], Genre.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [track_1.TrackQL]),
    decorators_1.ManyToMany(() => track_1.Track, track => track.genres, { owner: true }),
    __metadata("design:type", orm_1.Collection)
], Genre.prototype, "tracks", void 0);
__decorate([
    type_graphql_1.Field(() => [album_1.AlbumQL]),
    decorators_1.ManyToMany(() => album_1.Album, album => album.genres, { owner: true }),
    __metadata("design:type", orm_1.Collection)
], Genre.prototype, "albums", void 0);
__decorate([
    type_graphql_1.Field(() => [artist_1.ArtistQL]),
    decorators_1.ManyToMany(() => artist_1.Artist, artist => artist.genres, { owner: true }),
    __metadata("design:type", orm_1.Collection)
], Genre.prototype, "artists", void 0);
__decorate([
    type_graphql_1.Field(() => [folder_1.FolderQL]),
    decorators_1.ManyToMany(() => folder_1.Folder, folder => folder.genres, { owner: true }),
    __metadata("design:type", orm_1.Collection)
], Genre.prototype, "folders", void 0);
Genre = __decorate([
    decorators_1.Entity(),
    type_graphql_1.ObjectType()
], Genre);
exports.Genre = Genre;
let GenreQL = class GenreQL extends Genre {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], GenreQL.prototype, "trackCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], GenreQL.prototype, "albumCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], GenreQL.prototype, "artistCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], GenreQL.prototype, "folderCount", void 0);
GenreQL = __decorate([
    type_graphql_1.ObjectType()
], GenreQL);
exports.GenreQL = GenreQL;
let GenrePageQL = class GenrePageQL extends base_1.PaginatedResponse(Genre, GenreQL) {
};
GenrePageQL = __decorate([
    type_graphql_1.ObjectType()
], GenrePageQL);
exports.GenrePageQL = GenrePageQL;
let GenreIndexGroupQL = class GenreIndexGroupQL extends base_1.IndexGroup(GenreQL, GenreQL) {
};
GenreIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], GenreIndexGroupQL);
exports.GenreIndexGroupQL = GenreIndexGroupQL;
let GenreIndexQL = class GenreIndexQL extends base_1.Index(GenreIndexGroupQL) {
};
GenreIndexQL = __decorate([
    type_graphql_1.ObjectType()
], GenreIndexQL);
exports.GenreIndexQL = GenreIndexQL;
//# sourceMappingURL=genre.js.map