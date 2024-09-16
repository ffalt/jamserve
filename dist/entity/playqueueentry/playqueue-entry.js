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
import { PlayQueue, PlayQueueQL } from '../playqueue/playqueue.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, ManyToOne, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base } from '../base/base.js';
let PlayQueueEntry = class PlayQueueEntry extends Base {
    constructor() {
        super(...arguments);
        this.playQueue = new Reference(this);
        this.track = new Reference(this);
        this.episode = new Reference(this);
    }
};
__decorate([
    Field(() => Int),
    Property(() => ORM_INT),
    __metadata("design:type", Number)
], PlayQueueEntry.prototype, "position", void 0);
__decorate([
    Field(() => PlayQueueQL),
    ManyToOne(() => PlayQueue, playQueue => playQueue.entries),
    __metadata("design:type", Reference)
], PlayQueueEntry.prototype, "playQueue", void 0);
__decorate([
    Field(() => TrackQL, { nullable: true }),
    ManyToOne(() => Track, track => track.playqueueEntries, { nullable: true }),
    __metadata("design:type", Object)
], PlayQueueEntry.prototype, "track", void 0);
__decorate([
    Field(() => EpisodeQL, { nullable: true }),
    ManyToOne(() => Episode, episode => episode.playqueueEntries, { nullable: true }),
    __metadata("design:type", Object)
], PlayQueueEntry.prototype, "episode", void 0);
PlayQueueEntry = __decorate([
    ObjectType(),
    Entity()
], PlayQueueEntry);
export { PlayQueueEntry };
let PlayQueueEntryQL = class PlayQueueEntryQL extends PlayQueueEntry {
};
PlayQueueEntryQL = __decorate([
    ObjectType()
], PlayQueueEntryQL);
export { PlayQueueEntryQL };
//# sourceMappingURL=playqueue-entry.js.map