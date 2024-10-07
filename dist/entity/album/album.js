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
import { Root, RootQL } from '../root/root.js';
import { Folder, FolderQL } from '../folder/folder.js';
import { Series, SeriesQL } from '../series/series.js';
import { Artist, ArtistQL } from '../artist/artist.js';
import { AlbumType, DefaultOrderFields, FolderOrderFields, TrackOrderFields } from '../../types/enums.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base.js';
import { State, StateQL } from '../state/state.js';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Genre, GenreQL } from '../genre/genre.js';
let Album = class Album extends Base {
    constructor() {
        super(...arguments);
        this.albumType = AlbumType.unknown;
        this.genres = new Collection(this);
        this.tracks = new Collection(this);
        this.roots = new Collection(this);
        this.folders = new Collection(this);
        this.series = new Reference(this);
        this.artist = new Reference(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Album.prototype, "name", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Album.prototype, "slug", void 0);
__decorate([
    Field(() => AlbumType),
    Property(() => AlbumType),
    __metadata("design:type", String)
], Album.prototype, "albumType", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Album.prototype, "seriesNr", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Album.prototype, "year", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Album.prototype, "duration", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Album.prototype, "mbArtistID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Album.prototype, "mbReleaseID", void 0);
__decorate([
    Field(() => [GenreQL]),
    ManyToMany(() => Genre, genre => genre.albums),
    __metadata("design:type", Collection)
], Album.prototype, "genres", void 0);
__decorate([
    Field(() => [TrackQL]),
    OneToMany(() => Track, track => track.album, { order: [{ orderBy: TrackOrderFields.default }] }),
    __metadata("design:type", Collection)
], Album.prototype, "tracks", void 0);
__decorate([
    Field(() => [RootQL]),
    ManyToMany(() => Root, root => root.albums, { owner: true, order: [{ orderBy: DefaultOrderFields.default }] }),
    __metadata("design:type", Collection)
], Album.prototype, "roots", void 0);
__decorate([
    Field(() => [FolderQL]),
    ManyToMany(() => Folder, folder => folder.albums, { owner: true, order: [{ orderBy: FolderOrderFields.default }] }),
    __metadata("design:type", Collection)
], Album.prototype, "folders", void 0);
__decorate([
    Field(() => [SeriesQL], { nullable: true }),
    ManyToOne(() => Series, series => series.albums, { nullable: true }),
    __metadata("design:type", Reference)
], Album.prototype, "series", void 0);
__decorate([
    Field(() => ArtistQL),
    ManyToOne(() => Artist, artist => artist.albums),
    __metadata("design:type", Reference)
], Album.prototype, "artist", void 0);
Album = __decorate([
    ObjectType(),
    Entity()
], Album);
export { Album };
let AlbumQL = class AlbumQL extends Album {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], AlbumQL.prototype, "tracksCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], AlbumQL.prototype, "rootsCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], AlbumQL.prototype, "foldersCount", void 0);
__decorate([
    Field(() => StateQL),
    __metadata("design:type", State)
], AlbumQL.prototype, "state", void 0);
AlbumQL = __decorate([
    ObjectType()
], AlbumQL);
export { AlbumQL };
let AlbumPageQL = class AlbumPageQL extends PaginatedResponse(Album, AlbumQL) {
};
AlbumPageQL = __decorate([
    ObjectType()
], AlbumPageQL);
export { AlbumPageQL };
let AlbumIndexGroupQL = class AlbumIndexGroupQL extends IndexGroup(Album, AlbumQL) {
};
AlbumIndexGroupQL = __decorate([
    ObjectType()
], AlbumIndexGroupQL);
export { AlbumIndexGroupQL };
let AlbumIndexQL = class AlbumIndexQL extends Index(AlbumIndexGroupQL) {
};
AlbumIndexQL = __decorate([
    ObjectType()
], AlbumIndexQL);
export { AlbumIndexQL };
//# sourceMappingURL=album.js.map