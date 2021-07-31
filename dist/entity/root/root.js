var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Folder, FolderQL } from '../folder/folder';
import { Track, TrackQL } from '../track/track';
import { Album, AlbumQL } from '../album/album';
import { Artist, ArtistQL } from '../artist/artist';
import { Series, SeriesQL } from '../series/series';
import { AlbumOrderFields, ArtistOrderFields, DefaultOrderFields, FolderOrderFields, RootScanStrategy, TrackOrderFields } from '../../types/enums';
import { Field, ObjectType } from 'type-graphql';
import { Base, PaginatedResponse } from '../base/base';
import { Collection, Entity, ManyToMany, OneToMany, Property } from '../../modules/orm';
let Root = class Root extends Base {
    constructor() {
        super(...arguments);
        this.folders = new Collection(this);
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
], Root.prototype, "name", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Root.prototype, "path", void 0);
__decorate([
    Field(() => RootScanStrategy),
    Property(() => RootScanStrategy),
    __metadata("design:type", String)
], Root.prototype, "strategy", void 0);
__decorate([
    Field(() => [FolderQL]),
    OneToMany(() => Folder, folder => folder.root, { order: [{ orderBy: FolderOrderFields.default }] }),
    __metadata("design:type", Collection)
], Root.prototype, "folders", void 0);
__decorate([
    Field(() => [TrackQL]),
    OneToMany(() => Track, track => track.root, { order: [{ orderBy: TrackOrderFields.default }] }),
    __metadata("design:type", Collection)
], Root.prototype, "tracks", void 0);
__decorate([
    Field(() => [AlbumQL]),
    ManyToMany(() => Album, album => album.roots, { order: [{ orderBy: AlbumOrderFields.default }] }),
    __metadata("design:type", Collection)
], Root.prototype, "albums", void 0);
__decorate([
    Field(() => [ArtistQL]),
    ManyToMany(() => Artist, artist => artist.roots, { order: [{ orderBy: ArtistOrderFields.default }] }),
    __metadata("design:type", Collection)
], Root.prototype, "artists", void 0);
__decorate([
    Field(() => [SeriesQL]),
    ManyToMany(() => Series, series => series.roots, { order: [{ orderBy: DefaultOrderFields.default }] }),
    __metadata("design:type", Collection)
], Root.prototype, "series", void 0);
Root = __decorate([
    ObjectType(),
    Entity()
], Root);
export { Root };
let RootStatusQL = class RootStatusQL {
};
__decorate([
    Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], RootStatusQL.prototype, "lastScan", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], RootStatusQL.prototype, "scanning", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RootStatusQL.prototype, "error", void 0);
RootStatusQL = __decorate([
    ObjectType()
], RootStatusQL);
export { RootStatusQL };
let RootQL = class RootQL extends Root {
};
__decorate([
    Field(() => RootStatusQL),
    __metadata("design:type", Object)
], RootQL.prototype, "status", void 0);
RootQL = __decorate([
    ObjectType()
], RootQL);
export { RootQL };
let RootPageQL = class RootPageQL extends PaginatedResponse(Root, RootQL) {
};
RootPageQL = __decorate([
    ObjectType()
], RootPageQL);
export { RootPageQL };
//# sourceMappingURL=root.js.map