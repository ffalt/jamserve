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
const episode_2 = require("../episode/episode");
const playqueue_1 = require("../playqueue/playqueue");
const type_graphql_1 = require("type-graphql");
const mikro_orm_1 = require("mikro-orm");
const base_1 = require("../base/base");
const track_2 = require("../track/track");
const playqueue_2 = require("../playqueue/playqueue");
let PlayQueueEntry = class PlayQueueEntry extends base_1.Base {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], PlayQueueEntry.prototype, "position", void 0);
__decorate([
    type_graphql_1.Field(() => playqueue_2.PlayQueueQL),
    mikro_orm_1.ManyToOne(() => playqueue_1.PlayQueue),
    __metadata("design:type", playqueue_1.PlayQueue)
], PlayQueueEntry.prototype, "playQueue", void 0);
__decorate([
    type_graphql_1.Field(() => track_2.TrackQL, { nullable: true }),
    mikro_orm_1.OneToOne(() => track_1.Track),
    __metadata("design:type", track_1.Track)
], PlayQueueEntry.prototype, "track", void 0);
__decorate([
    type_graphql_1.Field(() => episode_2.EpisodeQL, { nullable: true }),
    mikro_orm_1.OneToOne(() => episode_1.Episode),
    __metadata("design:type", episode_1.Episode)
], PlayQueueEntry.prototype, "episode", void 0);
PlayQueueEntry = __decorate([
    type_graphql_1.ObjectType(),
    mikro_orm_1.Entity()
], PlayQueueEntry);
exports.PlayQueueEntry = PlayQueueEntry;
let PlayQueueEntryQL = class PlayQueueEntryQL extends PlayQueueEntry {
};
PlayQueueEntryQL = __decorate([
    type_graphql_1.ObjectType()
], PlayQueueEntryQL);
exports.PlayQueueEntryQL = PlayQueueEntryQL;
//# sourceMappingURL=playqueue-entry.js.map