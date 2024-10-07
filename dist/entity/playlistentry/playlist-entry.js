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
import { Episode, EpisodeQL } from '../episode/episode.js';
import { Playlist, PlaylistQL } from '../playlist/playlist.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Base } from '../base/base.js';
import { Entity, ManyToOne, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
let PlaylistEntry = class PlaylistEntry extends Base {
    constructor() {
        super(...arguments);
        this.playlist = new Reference(this);
        this.track = new Reference(this);
        this.episode = new Reference(this);
    }
};
__decorate([
    Field(() => Int),
    Property(() => ORM_INT),
    __metadata("design:type", Number)
], PlaylistEntry.prototype, "position", void 0);
__decorate([
    Field(() => PlaylistQL),
    ManyToOne(() => Playlist, playlist => playlist.entries),
    __metadata("design:type", Reference)
], PlaylistEntry.prototype, "playlist", void 0);
__decorate([
    Field(() => TrackQL),
    ManyToOne(() => Track, track => track.playlistEntries),
    __metadata("design:type", Reference)
], PlaylistEntry.prototype, "track", void 0);
__decorate([
    Field(() => EpisodeQL),
    ManyToOne(() => Episode, episode => episode.playlistEntries),
    __metadata("design:type", Reference)
], PlaylistEntry.prototype, "episode", void 0);
PlaylistEntry = __decorate([
    ObjectType(),
    Entity()
], PlaylistEntry);
export { PlaylistEntry };
let PlaylistEntryQL = class PlaylistEntryQL extends PlaylistEntry {
};
PlaylistEntryQL = __decorate([
    ObjectType()
], PlaylistEntryQL);
export { PlaylistEntryQL };
//# sourceMappingURL=playlist-entry.js.map