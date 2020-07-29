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
exports.PlayQueueEntryQL = exports.PlayQueueEntry = void 0;
const track_1 = require("../track/track");
const episode_1 = require("../episode/episode");
const playqueue_1 = require("../playqueue/playqueue");
const type_graphql_1 = require("type-graphql");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
let PlayQueueEntry = class PlayQueueEntry extends base_1.Base {
    constructor() {
        super(...arguments);
        this.playQueue = new orm_1.Reference(this);
        this.track = new orm_1.Reference(this);
        this.episode = new orm_1.Reference(this);
    }
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    orm_1.Property(() => orm_1.ORM_INT),
    __metadata("design:type", Number)
], PlayQueueEntry.prototype, "position", void 0);
__decorate([
    type_graphql_1.Field(() => playqueue_1.PlayQueueQL),
    orm_1.ManyToOne(() => playqueue_1.PlayQueue, playQueue => playQueue.entries),
    __metadata("design:type", orm_1.Reference)
], PlayQueueEntry.prototype, "playQueue", void 0);
__decorate([
    type_graphql_1.Field(() => track_1.TrackQL, { nullable: true }),
    orm_1.ManyToOne(() => track_1.Track, track => track.playqueueEntries, { nullable: true }),
    __metadata("design:type", Object)
], PlayQueueEntry.prototype, "track", void 0);
__decorate([
    type_graphql_1.Field(() => episode_1.EpisodeQL, { nullable: true }),
    orm_1.ManyToOne(() => episode_1.Episode, episode => episode.playqueueEntries, { nullable: true }),
    __metadata("design:type", Object)
], PlayQueueEntry.prototype, "episode", void 0);
PlayQueueEntry = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], PlayQueueEntry);
exports.PlayQueueEntry = PlayQueueEntry;
let PlayQueueEntryQL = class PlayQueueEntryQL extends PlayQueueEntry {
};
PlayQueueEntryQL = __decorate([
    type_graphql_1.ObjectType()
], PlayQueueEntryQL);
exports.PlayQueueEntryQL = PlayQueueEntryQL;
//# sourceMappingURL=playqueue-entry.js.map