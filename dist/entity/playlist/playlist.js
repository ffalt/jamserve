var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { User } from '../user/user.js';
import { PlaylistEntry, PlaylistEntryQL } from '../playlistentry/playlist-entry.js';
import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, ManyToOne, OneToMany, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base.js';
import { State, StateQL } from '../state/state.js';
import { PlaylistEntryOrderFields } from '../../types/enums.js';
let Playlist = class Playlist extends Base {
    constructor() {
        super(...arguments);
        this.user = new Reference(this);
        this.isPublic = false;
        this.duration = 0;
        this.entries = new Collection(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Playlist.prototype, "name", void 0);
__decorate([
    ManyToOne(() => User, user => user.playlists),
    __metadata("design:type", Reference)
], Playlist.prototype, "user", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "comment", void 0);
__decorate([
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "coverArt", void 0);
__decorate([
    Field(() => Boolean),
    Property(() => Boolean),
    __metadata("design:type", Boolean)
], Playlist.prototype, "isPublic", void 0);
__decorate([
    Field(() => Float),
    Property(() => ORM_INT),
    __metadata("design:type", Number)
], Playlist.prototype, "duration", void 0);
__decorate([
    Field(() => [PlaylistEntryQL]),
    OneToMany(() => PlaylistEntry, entry => entry.playlist, { order: [{ orderBy: PlaylistEntryOrderFields.position }] }),
    __metadata("design:type", Collection)
], Playlist.prototype, "entries", void 0);
Playlist = __decorate([
    ObjectType(),
    Entity()
], Playlist);
export { Playlist };
let PlaylistQL = class PlaylistQL extends Playlist {
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], PlaylistQL.prototype, "userID", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PlaylistQL.prototype, "userName", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], PlaylistQL.prototype, "entriesCount", void 0);
__decorate([
    Field(() => StateQL),
    __metadata("design:type", State)
], PlaylistQL.prototype, "state", void 0);
PlaylistQL = __decorate([
    ObjectType()
], PlaylistQL);
export { PlaylistQL };
let PlaylistPageQL = class PlaylistPageQL extends PaginatedResponse(Playlist, PlaylistQL) {
};
PlaylistPageQL = __decorate([
    ObjectType()
], PlaylistPageQL);
export { PlaylistPageQL };
let PlaylistIndexGroupQL = class PlaylistIndexGroupQL extends IndexGroup(Playlist, PlaylistQL) {
};
PlaylistIndexGroupQL = __decorate([
    ObjectType()
], PlaylistIndexGroupQL);
export { PlaylistIndexGroupQL };
let PlaylistIndexQL = class PlaylistIndexQL extends Index(PlaylistIndexGroupQL) {
};
PlaylistIndexQL = __decorate([
    ObjectType()
], PlaylistIndexQL);
export { PlaylistIndexQL };
//# sourceMappingURL=playlist.js.map