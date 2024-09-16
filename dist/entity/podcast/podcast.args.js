var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ObjParamsType } from '../../modules/rest/index.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { ListType, PodcastOrderFields, PodcastStatus } from '../../types/enums.js';
import { FilterArgs, OrderByArgs, PaginatedFilterArgs } from '../base/base.args.js';
let IncludesPodcastArgs = class IncludesPodcastArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include state (fav,rate) on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastArgs.prototype, "podcastIncState", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include episodes id on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastArgs.prototype, "podcastIncEpisodeIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include episode count on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastArgs.prototype, "podcastIncEpisodeCount", void 0);
IncludesPodcastArgs = __decorate([
    ObjParamsType()
], IncludesPodcastArgs);
export { IncludesPodcastArgs };
let IncludesPodcastChildrenArgs = class IncludesPodcastChildrenArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include episodes on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastChildrenArgs.prototype, "podcastIncEpisodes", void 0);
IncludesPodcastChildrenArgs = __decorate([
    ObjParamsType()
], IncludesPodcastChildrenArgs);
export { IncludesPodcastChildrenArgs };
let PodcastCreateArgs = class PodcastCreateArgs {
};
__decorate([
    ObjField({ description: 'Podcast Feed URL', example: 'https://podcast.example.com/feed.xml' }),
    __metadata("design:type", String)
], PodcastCreateArgs.prototype, "url", void 0);
PodcastCreateArgs = __decorate([
    ObjParamsType()
], PodcastCreateArgs);
export { PodcastCreateArgs };
let PodcastRefreshArgs = class PodcastRefreshArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'Podcast ID to refresh (empty for refreshing all)', isID: true }),
    __metadata("design:type", String)
], PodcastRefreshArgs.prototype, "id", void 0);
PodcastRefreshArgs = __decorate([
    ObjParamsType()
], PodcastRefreshArgs);
export { PodcastRefreshArgs };
let PodcastFilterArgs = class PodcastFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Podcast' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Podcast Ids', isID: true }),
    __metadata("design:type", Array)
], PodcastFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true }),
    __metadata("design:type", Array)
], PodcastFilterArgs.prototype, "episodeIDs", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PodcastFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by URL', example: 'https://podcast.example.com/feed.xml' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "url", void 0);
__decorate([
    Field(() => [PodcastStatus], { nullable: true }),
    ObjField(() => [PodcastStatus], { nullable: true, description: 'filter by Podcast Status', example: [PodcastStatus.downloading] }),
    __metadata("design:type", Array)
], PodcastFilterArgs.prototype, "statuses", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by since Last Check timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PodcastFilterArgs.prototype, "lastCheckFrom", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by until Last Check timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PodcastFilterArgs.prototype, "lastCheckTo", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Title', example: 'Awesome Podcast' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "title", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Author', example: 'Poddy McPodcastface' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "author", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Title', example: 'Awesome Topic' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "description", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Title', example: 'Awesome Feed Generator' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "generator", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Podcast Category', example: ['Awesome'] }),
    __metadata("design:type", Array)
], PodcastFilterArgs.prototype, "categories", void 0);
PodcastFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], PodcastFilterArgs);
export { PodcastFilterArgs };
let PodcastFilterArgsQL = class PodcastFilterArgsQL {
};
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterArgsQL.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterArgsQL.prototype, "episodeIDs", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    __metadata("design:type", Number)
], PodcastFilterArgsQL.prototype, "since", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "url", void 0);
__decorate([
    Field(() => [PodcastStatus], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterArgsQL.prototype, "statuses", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    __metadata("design:type", Number)
], PodcastFilterArgsQL.prototype, "lastCheckFrom", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    __metadata("design:type", Number)
], PodcastFilterArgsQL.prototype, "lastCheckTo", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "title", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "author", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "description", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "generator", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterArgsQL.prototype, "categories", void 0);
PodcastFilterArgsQL = __decorate([
    InputType()
], PodcastFilterArgsQL);
export { PodcastFilterArgsQL };
let PodcastOrderArgs = class PodcastOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => PodcastOrderFields, { nullable: true }),
    ObjField(() => PodcastOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], PodcastOrderArgs.prototype, "orderBy", void 0);
PodcastOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], PodcastOrderArgs);
export { PodcastOrderArgs };
let PodcastOrderArgsQL = class PodcastOrderArgsQL extends PodcastOrderArgs {
};
PodcastOrderArgsQL = __decorate([
    InputType()
], PodcastOrderArgsQL);
export { PodcastOrderArgsQL };
let PodcastIndexArgsQL = class PodcastIndexArgsQL extends FilterArgs(PodcastFilterArgsQL) {
};
PodcastIndexArgsQL = __decorate([
    ArgsType()
], PodcastIndexArgsQL);
export { PodcastIndexArgsQL };
let PodcastPageArgsQL = class PodcastPageArgsQL extends PaginatedFilterArgs(PodcastFilterArgsQL, PodcastOrderArgsQL) {
};
PodcastPageArgsQL = __decorate([
    ArgsType()
], PodcastPageArgsQL);
export { PodcastPageArgsQL };
let PodcastsArgsQL = class PodcastsArgsQL extends PodcastPageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], PodcastsArgsQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastsArgsQL.prototype, "seed", void 0);
PodcastsArgsQL = __decorate([
    ArgsType()
], PodcastsArgsQL);
export { PodcastsArgsQL };
let PodcastDiscoverArgs = class PodcastDiscoverArgs {
};
__decorate([
    Field(() => String),
    ObjField({ description: 'Search Podcast by Name', example: 'awesome' }),
    __metadata("design:type", String)
], PodcastDiscoverArgs.prototype, "query", void 0);
PodcastDiscoverArgs = __decorate([
    ArgsType(),
    ObjParamsType()
], PodcastDiscoverArgs);
export { PodcastDiscoverArgs };
let PodcastDiscoverArgsQL = class PodcastDiscoverArgsQL extends PodcastDiscoverArgs {
};
PodcastDiscoverArgsQL = __decorate([
    ArgsType()
], PodcastDiscoverArgsQL);
export { PodcastDiscoverArgsQL };
let PodcastDiscoverByTagArgs = class PodcastDiscoverByTagArgs {
};
__decorate([
    Field(() => String),
    ObjField({ description: 'Search Podcast by Tag', example: 'awesome' }),
    __metadata("design:type", String)
], PodcastDiscoverByTagArgs.prototype, "tag", void 0);
PodcastDiscoverByTagArgs = __decorate([
    ArgsType(),
    ObjParamsType()
], PodcastDiscoverByTagArgs);
export { PodcastDiscoverByTagArgs };
let PodcastDiscoverByTagArgsQL = class PodcastDiscoverByTagArgsQL extends PodcastDiscoverByTagArgs {
};
PodcastDiscoverByTagArgsQL = __decorate([
    ArgsType()
], PodcastDiscoverByTagArgsQL);
export { PodcastDiscoverByTagArgsQL };
//# sourceMappingURL=podcast.args.js.map