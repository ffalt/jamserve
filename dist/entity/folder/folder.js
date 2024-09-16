var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Artwork, ArtworkQL } from '../artwork/artwork.js';
import { Root, RootQL } from '../root/root.js';
import { Track, TrackQL } from '../track/track.js';
import { Album, AlbumQL } from '../album/album.js';
import { Artist, ArtistQL } from '../artist/artist.js';
import { Series, SeriesQL } from '../series/series.js';
import { AlbumOrderFields, AlbumType, ArtistOrderFields, DefaultOrderFields, FolderOrderFields, FolderType, TrackOrderFields } from '../../types/enums.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, ORM_DATETIME, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base.js';
import { State, StateQL } from '../state/state.js';
import { FolderHealthHint } from '../health/health.model.js';
import { Genre, GenreQL } from '../genre/genre.js';
let Folder = class Folder extends Base {
    constructor() {
        super(...arguments);
        this.genres = new Collection(this);
        this.parent = new Reference(this);
        this.children = new Collection(this);
        this.root = new Reference(this);
        this.artworks = new Collection(this);
        this.tracks = new Collection(this);
        this.albums = new Collection(this);
        this.artists = new Collection(this);
        this.series = new Collection(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Folder.prototype, "name", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "title", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Folder.prototype, "path", void 0);
__decorate([
    Field(() => Date),
    Property(() => ORM_DATETIME),
    __metadata("design:type", Date)
], Folder.prototype, "statCreated", void 0);
__decorate([
    Field(() => Date),
    Property(() => ORM_DATETIME),
    __metadata("design:type", Date)
], Folder.prototype, "statModified", void 0);
__decorate([
    Field(() => Int),
    Property(() => ORM_INT),
    __metadata("design:type", Number)
], Folder.prototype, "level", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "album", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "artist", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "artistSort", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Folder.prototype, "albumTrackCount", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Folder.prototype, "year", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "mbReleaseID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "mbReleaseGroupID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "mbAlbumType", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "mbArtistID", void 0);
__decorate([
    Field(() => AlbumType, { nullable: true }),
    Property(() => AlbumType, { nullable: true }),
    __metadata("design:type", String)
], Folder.prototype, "albumType", void 0);
__decorate([
    Field(() => FolderType),
    Property(() => FolderType),
    __metadata("design:type", String)
], Folder.prototype, "folderType", void 0);
__decorate([
    Field(() => [GenreQL]),
    ManyToMany(() => Genre, genre => genre.folders),
    __metadata("design:type", Collection)
], Folder.prototype, "genres", void 0);
__decorate([
    Field(() => FolderQL, { nullable: true }),
    ManyToOne(() => Folder, folder => folder.children, { nullable: true }),
    __metadata("design:type", Reference)
], Folder.prototype, "parent", void 0);
__decorate([
    Field(() => [FolderQL]),
    OneToMany(() => Folder, folder => folder.parent, { order: [{ orderBy: FolderOrderFields.name }] }),
    __metadata("design:type", Collection)
], Folder.prototype, "children", void 0);
__decorate([
    Field(() => RootQL),
    ManyToOne(() => Root, root => root.folders),
    __metadata("design:type", Reference)
], Folder.prototype, "root", void 0);
__decorate([
    Field(() => [ArtworkQL]),
    OneToMany(() => Artwork, artwork => artwork.folder, { order: [{ orderBy: DefaultOrderFields.default }] }),
    __metadata("design:type", Collection)
], Folder.prototype, "artworks", void 0);
__decorate([
    Field(() => [TrackQL]),
    OneToMany(() => Track, track => track.folder, { order: [{ orderBy: TrackOrderFields.default }] }),
    __metadata("design:type", Collection)
], Folder.prototype, "tracks", void 0);
__decorate([
    Field(() => [AlbumQL]),
    ManyToMany(() => Album, album => album.folders, { order: [{ orderBy: AlbumOrderFields.default }] }),
    __metadata("design:type", Collection)
], Folder.prototype, "albums", void 0);
__decorate([
    Field(() => [ArtistQL]),
    ManyToMany(() => Artist, artist => artist.folders, { order: [{ orderBy: ArtistOrderFields.default }] }),
    __metadata("design:type", Collection)
], Folder.prototype, "artists", void 0);
__decorate([
    Field(() => [SeriesQL]),
    ManyToMany(() => Series, series => series.folders, { order: [{ orderBy: DefaultOrderFields.default }] }),
    __metadata("design:type", Collection)
], Folder.prototype, "series", void 0);
Folder = __decorate([
    ObjectType(),
    Entity()
], Folder);
export { Folder };
let FolderQL = class FolderQL extends Folder {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "childrenCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "artworksCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "tracksCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "albumsCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "artistsCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "genresCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "seriesCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], FolderQL.prototype, "rootsCount", void 0);
__decorate([
    Field(() => StateQL),
    __metadata("design:type", State)
], FolderQL.prototype, "state", void 0);
FolderQL = __decorate([
    ObjectType()
], FolderQL);
export { FolderQL };
let FolderPageQL = class FolderPageQL extends PaginatedResponse(Folder, FolderQL) {
};
FolderPageQL = __decorate([
    ObjectType()
], FolderPageQL);
export { FolderPageQL };
let FolderIndexGroupQL = class FolderIndexGroupQL extends IndexGroup(Folder, FolderQL) {
};
FolderIndexGroupQL = __decorate([
    ObjectType()
], FolderIndexGroupQL);
export { FolderIndexGroupQL };
let FolderIndexQL = class FolderIndexQL extends Index(FolderIndexGroupQL) {
};
FolderIndexQL = __decorate([
    ObjectType()
], FolderIndexQL);
export { FolderIndexQL };
let FolderHealth = class FolderHealth {
};
__decorate([
    Field(() => Folder),
    __metadata("design:type", Folder)
], FolderHealth.prototype, "folder", void 0);
__decorate([
    Field(() => [FolderHealthHint]),
    __metadata("design:type", Array)
], FolderHealth.prototype, "health", void 0);
FolderHealth = __decorate([
    ObjectType()
], FolderHealth);
export { FolderHealth };
//# sourceMappingURL=folder.js.map