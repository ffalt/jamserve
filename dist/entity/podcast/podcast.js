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
exports.PodcastIndexQL = exports.PodcastIndexGroupQL = exports.PodcastPageQL = exports.PodcastQL = exports.Podcast = void 0;
const episode_1 = require("../episode/episode");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const mikro_orm_1 = require("mikro-orm");
const base_1 = require("../base/base");
const orm_types_1 = require("../../modules/engine/services/orm.types");
const state_1 = require("../state/state");
let Podcast = class Podcast extends base_1.Base {
    constructor() {
        super(...arguments);
        this.episodes = new mikro_orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "url", void 0);
__decorate([
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], Podcast.prototype, "lastCheck", void 0);
__decorate([
    type_graphql_1.Field(() => enums_1.PodcastStatus),
    mikro_orm_1.Enum(() => enums_1.PodcastStatus),
    __metadata("design:type", String)
], Podcast.prototype, "status", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "image", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "errorMessage", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "language", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "link", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "author", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Podcast.prototype, "generator", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    mikro_orm_1.Property({ type: orm_types_1.OrmStringListType }),
    __metadata("design:type", Array)
], Podcast.prototype, "categories", void 0);
__decorate([
    type_graphql_1.Field(() => [episode_1.EpisodeQL]),
    mikro_orm_1.OneToMany({ entity: () => episode_1.Episode, mappedBy: episode => episode.podcast, orderBy: { date: mikro_orm_1.QueryOrder.DESC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], Podcast.prototype, "episodes", void 0);
Podcast = __decorate([
    type_graphql_1.ObjectType(),
    mikro_orm_1.Entity()
], Podcast);
exports.Podcast = Podcast;
let PodcastQL = class PodcastQL extends Podcast {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PodcastQL.prototype, "episodesCount", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Number)
], PodcastQL.prototype, "lastCheck", void 0);
__decorate([
    type_graphql_1.Field(() => state_1.StateQL),
    __metadata("design:type", state_1.State)
], PodcastQL.prototype, "state", void 0);
PodcastQL = __decorate([
    type_graphql_1.ObjectType()
], PodcastQL);
exports.PodcastQL = PodcastQL;
let PodcastPageQL = class PodcastPageQL extends base_1.PaginatedResponse(Podcast, PodcastQL) {
};
PodcastPageQL = __decorate([
    type_graphql_1.ObjectType()
], PodcastPageQL);
exports.PodcastPageQL = PodcastPageQL;
let PodcastIndexGroupQL = class PodcastIndexGroupQL extends base_1.IndexGroup(Podcast, PodcastQL) {
};
PodcastIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], PodcastIndexGroupQL);
exports.PodcastIndexGroupQL = PodcastIndexGroupQL;
let PodcastIndexQL = class PodcastIndexQL extends base_1.Index(PodcastIndexGroupQL) {
};
PodcastIndexQL = __decorate([
    type_graphql_1.ObjectType()
], PodcastIndexQL);
exports.PodcastIndexQL = PodcastIndexQL;
//# sourceMappingURL=podcast.js.map