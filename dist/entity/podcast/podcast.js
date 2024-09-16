var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Episode, EpisodeQL } from '../episode/episode.js';
import { EpisodeOrderFields, PodcastStatus } from '../../types/enums.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, OneToMany, ORM_DATETIME, Property } from '../../modules/orm/index.js';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base.js';
import { State, StateQL } from '../state/state.js';
let Podcast = class Podcast extends Base {
    constructor() {
        super(...arguments);
        this.episodes = new Collection(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Podcast.prototype, "name", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Podcast.prototype, "url", void 0);
__decorate([
    Property(() => ORM_DATETIME, { nullable: true }),
    __metadata("design:type", Date)
], Podcast.prototype, "lastCheck", void 0);
__decorate([
    Field(() => PodcastStatus),
    Property(() => PodcastStatus),
    __metadata("design:type", String)
], Podcast.prototype, "status", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Podcast.prototype, "image", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Podcast.prototype, "errorMessage", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Podcast.prototype, "title", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Podcast.prototype, "language", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Podcast.prototype, "link", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Podcast.prototype, "author", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Podcast.prototype, "description", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Podcast.prototype, "generator", void 0);
__decorate([
    Field(() => [String]),
    Property(() => [String]),
    __metadata("design:type", Array)
], Podcast.prototype, "categories", void 0);
__decorate([
    Field(() => [EpisodeQL]),
    OneToMany(() => Episode, episode => episode.podcast, { order: [{ orderBy: EpisodeOrderFields.date, orderDesc: true }] }),
    __metadata("design:type", Collection)
], Podcast.prototype, "episodes", void 0);
Podcast = __decorate([
    ObjectType(),
    Entity()
], Podcast);
export { Podcast };
let PodcastQL = class PodcastQL extends Podcast {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], PodcastQL.prototype, "episodesCount", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], PodcastQL.prototype, "lastCheck", void 0);
__decorate([
    Field(() => StateQL),
    __metadata("design:type", State)
], PodcastQL.prototype, "state", void 0);
PodcastQL = __decorate([
    ObjectType()
], PodcastQL);
export { PodcastQL };
let PodcastPageQL = class PodcastPageQL extends PaginatedResponse(Podcast, PodcastQL) {
};
PodcastPageQL = __decorate([
    ObjectType()
], PodcastPageQL);
export { PodcastPageQL };
let PodcastIndexGroupQL = class PodcastIndexGroupQL extends IndexGroup(Podcast, PodcastQL) {
};
PodcastIndexGroupQL = __decorate([
    ObjectType()
], PodcastIndexGroupQL);
export { PodcastIndexGroupQL };
let PodcastIndexQL = class PodcastIndexQL extends Index(PodcastIndexGroupQL) {
};
PodcastIndexQL = __decorate([
    ObjectType()
], PodcastIndexQL);
export { PodcastIndexQL };
let PodcastDiscoverQL = class PodcastDiscoverQL {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverQL.prototype, "url", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverQL.prototype, "title", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverQL.prototype, "author", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverQL.prototype, "description", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], PodcastDiscoverQL.prototype, "subscribers", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], PodcastDiscoverQL.prototype, "subscribers_last_week", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverQL.prototype, "logo_url", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverQL.prototype, "scaled_logo_url", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverQL.prototype, "website", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverQL.prototype, "mygpo_link", void 0);
PodcastDiscoverQL = __decorate([
    ObjectType()
], PodcastDiscoverQL);
export { PodcastDiscoverQL };
let PodcastDiscoverPageQL = class PodcastDiscoverPageQL extends PaginatedResponse(PodcastDiscoverQL, PodcastDiscoverQL) {
};
PodcastDiscoverPageQL = __decorate([
    ObjectType()
], PodcastDiscoverPageQL);
export { PodcastDiscoverPageQL };
let PodcastDiscoverTagQL = class PodcastDiscoverTagQL {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverTagQL.prototype, "title", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], PodcastDiscoverTagQL.prototype, "tag", void 0);
__decorate([
    Field(() => Number),
    __metadata("design:type", Number)
], PodcastDiscoverTagQL.prototype, "usage", void 0);
PodcastDiscoverTagQL = __decorate([
    ObjectType()
], PodcastDiscoverTagQL);
export { PodcastDiscoverTagQL };
let PodcastDiscoverTagPageQL = class PodcastDiscoverTagPageQL extends PaginatedResponse(PodcastDiscoverTagQL, PodcastDiscoverTagQL) {
};
PodcastDiscoverTagPageQL = __decorate([
    ObjectType()
], PodcastDiscoverTagPageQL);
export { PodcastDiscoverTagPageQL };
//# sourceMappingURL=podcast.js.map