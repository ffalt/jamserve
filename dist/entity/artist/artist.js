var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Track, TrackQL } from '../track/track.js';
import { Album, AlbumQL } from '../album/album.js';
import { Root, RootQL } from '../root/root.js';
import { Folder, FolderQL } from '../folder/folder.js';
import { Series, SeriesQL } from '../series/series.js';
import { AlbumOrderFields, AlbumType, DefaultOrderFields, FolderOrderFields, TrackOrderFields } from '../../types/enums.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, ManyToMany, OneToMany, Property } from '../../modules/orm/index.js';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base.js';
import { State, StateQL } from '../state/state.js';
import { Genre, GenreQL } from '../genre/genre.js';
let Artist = class Artist extends Base {
    constructor() {
        super(...arguments);
        this.albumTypes = [];
        this.genres = new Collection(this);
        this.tracks = new Collection(this);
        this.albumTracks = new Collection(this);
        this.albums = new Collection(this);
        this.roots = new Collection(this);
        this.folders = new Collection(this);
        this.series = new Collection(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Artist.prototype, "name", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Artist.prototype, "slug", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Artist.prototype, "nameSort", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Artist.prototype, "mbArtistID", void 0);
__decorate([
    Field(() => [AlbumType]),
    Property(() => [AlbumType]),
    __metadata("design:type", Array)
], Artist.prototype, "albumTypes", void 0);
__decorate([
    Field(() => [GenreQL]),
    ManyToMany(() => Genre, genre => genre.artists),
    __metadata("design:type", Collection)
], Artist.prototype, "genres", void 0);
__decorate([
    Field(() => [TrackQL]),
    OneToMany(() => Track, track => track.artist, { order: [{ orderBy: TrackOrderFields.album }, { orderBy: TrackOrderFields.default }] }),
    __metadata("design:type", Collection)
], Artist.prototype, "tracks", void 0);
__decorate([
    Field(() => [TrackQL]),
    OneToMany(() => Track, track => track.albumArtist, { order: [{ orderBy: TrackOrderFields.album }, { orderBy: TrackOrderFields.default }] }),
    __metadata("design:type", Collection)
], Artist.prototype, "albumTracks", void 0);
__decorate([
    Field(() => [AlbumQL]),
    OneToMany(() => Album, album => album.artist, { order: [{ orderBy: AlbumOrderFields.default }] }),
    __metadata("design:type", Collection)
], Artist.prototype, "albums", void 0);
__decorate([
    Field(() => [RootQL]),
    ManyToMany(() => Root, root => root.artists, { owner: true, order: [{ orderBy: DefaultOrderFields.default }] }),
    __metadata("design:type", Collection)
], Artist.prototype, "roots", void 0);
__decorate([
    Field(() => [FolderQL]),
    ManyToMany(() => Folder, folder => folder.artists, { owner: true, order: [{ orderBy: FolderOrderFields.default }] }),
    __metadata("design:type", Collection)
], Artist.prototype, "folders", void 0);
__decorate([
    Field(() => [SeriesQL]),
    OneToMany(() => Series, series => series.artist, { order: [{ orderBy: DefaultOrderFields.default }] }),
    __metadata("design:type", Collection)
], Artist.prototype, "series", void 0);
Artist = __decorate([
    ObjectType(),
    Entity()
], Artist);
export { Artist };
let ArtistQL = class ArtistQL extends Artist {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "tracksCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "albumsCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "rootsCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "foldersCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "genresCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], ArtistQL.prototype, "seriesCount", void 0);
__decorate([
    Field(() => StateQL),
    __metadata("design:type", State)
], ArtistQL.prototype, "state", void 0);
ArtistQL = __decorate([
    ObjectType()
], ArtistQL);
export { ArtistQL };
let ArtistPageQL = class ArtistPageQL extends PaginatedResponse(Artist, ArtistQL) {
};
ArtistPageQL = __decorate([
    ObjectType()
], ArtistPageQL);
export { ArtistPageQL };
let ArtistIndexGroupQL = class ArtistIndexGroupQL extends IndexGroup(Artist, ArtistQL) {
};
ArtistIndexGroupQL = __decorate([
    ObjectType()
], ArtistIndexGroupQL);
export { ArtistIndexGroupQL };
let ArtistIndexQL = class ArtistIndexQL extends Index(ArtistIndexGroupQL) {
};
ArtistIndexQL = __decorate([
    ObjectType()
], ArtistIndexQL);
export { ArtistIndexQL };
//# sourceMappingURL=artist.js.map