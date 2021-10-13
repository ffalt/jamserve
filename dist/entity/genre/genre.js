var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, Int, ObjectType } from 'type-graphql';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base';
import { Entity, ManyToMany, Property } from '../../modules/orm/decorators';
import { Collection } from '../../modules/orm';
import { Track, TrackQL } from '../track/track';
import { Album, AlbumQL } from '../album/album';
import { Artist, ArtistQL } from '../artist/artist';
import { Folder, FolderQL } from '../folder/folder';
import { Series, SeriesQL } from '../series/series';
let Genre = class Genre extends Base {
    constructor() {
        super(...arguments);
        this.tracks = new Collection(this);
        this.albums = new Collection(this);
        this.artists = new Collection(this);
        this.folders = new Collection(this);
        this.series = new Collection(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Genre.prototype, "name", void 0);
__decorate([
    Field(() => [TrackQL]),
    ManyToMany(() => Track, track => track.genres, { owner: true }),
    __metadata("design:type", Collection)
], Genre.prototype, "tracks", void 0);
__decorate([
    Field(() => [AlbumQL]),
    ManyToMany(() => Album, album => album.genres, { owner: true }),
    __metadata("design:type", Collection)
], Genre.prototype, "albums", void 0);
__decorate([
    Field(() => [ArtistQL]),
    ManyToMany(() => Artist, artist => artist.genres, { owner: true }),
    __metadata("design:type", Collection)
], Genre.prototype, "artists", void 0);
__decorate([
    Field(() => [FolderQL]),
    ManyToMany(() => Folder, folder => folder.genres, { owner: true }),
    __metadata("design:type", Collection)
], Genre.prototype, "folders", void 0);
__decorate([
    Field(() => [SeriesQL]),
    ManyToMany(() => Series, series => series.genres, { owner: true }),
    __metadata("design:type", Collection)
], Genre.prototype, "series", void 0);
Genre = __decorate([
    Entity(),
    ObjectType()
], Genre);
export { Genre };
let GenreQL = class GenreQL extends Genre {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], GenreQL.prototype, "trackCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], GenreQL.prototype, "albumCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], GenreQL.prototype, "artistCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], GenreQL.prototype, "folderCount", void 0);
GenreQL = __decorate([
    ObjectType()
], GenreQL);
export { GenreQL };
let GenrePageQL = class GenrePageQL extends PaginatedResponse(Genre, GenreQL) {
};
GenrePageQL = __decorate([
    ObjectType()
], GenrePageQL);
export { GenrePageQL };
let GenreIndexGroupQL = class GenreIndexGroupQL extends IndexGroup(GenreQL, GenreQL) {
};
GenreIndexGroupQL = __decorate([
    ObjectType()
], GenreIndexGroupQL);
export { GenreIndexGroupQL };
let GenreIndexQL = class GenreIndexQL extends Index(GenreIndexGroupQL) {
};
GenreIndexQL = __decorate([
    ObjectType()
], GenreIndexQL);
export { GenreIndexQL };
//# sourceMappingURL=genre.js.map