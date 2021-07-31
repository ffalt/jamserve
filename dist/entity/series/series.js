var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Track, TrackQL } from '../track/track';
import { Album, AlbumQL } from '../album/album';
import { Artist, ArtistQL } from '../artist/artist';
import { Root, RootQL } from '../root/root';
import { Folder, FolderQL } from '../folder/folder';
import { AlbumOrderFields, AlbumType, DefaultOrderFields, FolderOrderFields, TrackOrderFields } from '../../types/enums';
import { Field, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property, Reference } from '../../modules/orm';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base';
import { State, StateQL } from '../state/state';
let Series = class Series extends Base {
    constructor() {
        super(...arguments);
        this.artist = new Reference(this);
        this.tracks = new Collection(this);
        this.albums = new Collection(this);
        this.roots = new Collection(this);
        this.folders = new Collection(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Series.prototype, "name", void 0);
__decorate([
    Field(() => [AlbumType]),
    Property(() => [AlbumType]),
    __metadata("design:type", Array)
], Series.prototype, "albumTypes", void 0);
__decorate([
    Field(() => ArtistQL),
    ManyToOne(() => Artist, artist => artist.series),
    __metadata("design:type", Reference)
], Series.prototype, "artist", void 0);
__decorate([
    Field(() => [TrackQL]),
    OneToMany(() => Track, track => track.series, { order: [{ orderBy: TrackOrderFields.seriesNr }, { orderBy: TrackOrderFields.default }] }),
    __metadata("design:type", Collection)
], Series.prototype, "tracks", void 0);
__decorate([
    Field(() => [AlbumQL]),
    OneToMany(() => Album, album => album.series, { order: [{ orderBy: AlbumOrderFields.seriesNr }, { orderBy: AlbumOrderFields.name }] }),
    __metadata("design:type", Collection)
], Series.prototype, "albums", void 0);
__decorate([
    Field(() => [RootQL]),
    ManyToMany(() => Root, root => root.series, { owner: true, order: [{ orderBy: DefaultOrderFields.default }] }),
    __metadata("design:type", Collection)
], Series.prototype, "roots", void 0);
__decorate([
    Field(() => [FolderQL]),
    ManyToMany(() => Folder, folder => folder.series, { owner: true, order: [{ orderBy: FolderOrderFields.default }] }),
    __metadata("design:type", Collection)
], Series.prototype, "folders", void 0);
Series = __decorate([
    ObjectType(),
    Entity()
], Series);
export { Series };
let SeriesQL = class SeriesQL extends Series {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], SeriesQL.prototype, "rootsCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], SeriesQL.prototype, "foldersCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], SeriesQL.prototype, "tracksCount", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], SeriesQL.prototype, "albumsCount", void 0);
__decorate([
    Field(() => StateQL),
    __metadata("design:type", State)
], SeriesQL.prototype, "state", void 0);
SeriesQL = __decorate([
    ObjectType()
], SeriesQL);
export { SeriesQL };
let SeriesPageQL = class SeriesPageQL extends PaginatedResponse(Series, SeriesQL) {
};
SeriesPageQL = __decorate([
    ObjectType()
], SeriesPageQL);
export { SeriesPageQL };
let SeriesIndexGroupQL = class SeriesIndexGroupQL extends IndexGroup(Series, SeriesQL) {
};
SeriesIndexGroupQL = __decorate([
    ObjectType()
], SeriesIndexGroupQL);
export { SeriesIndexGroupQL };
let SeriesIndexQL = class SeriesIndexQL extends Index(SeriesIndexGroupQL) {
};
SeriesIndexQL = __decorate([
    ObjectType()
], SeriesIndexQL);
export { SeriesIndexQL };
//# sourceMappingURL=series.js.map