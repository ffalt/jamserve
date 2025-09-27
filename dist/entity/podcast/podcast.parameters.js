var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { ListType, PodcastOrderFields, PodcastStatus } from '../../types/enums.js';
import { FilterParameters, OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesPodcastParameters = class IncludesPodcastParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include state (fav,rate) on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastParameters.prototype, "podcastIncState", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include episodes id on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastParameters.prototype, "podcastIncEpisodeIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include episode count on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastParameters.prototype, "podcastIncEpisodeCount", void 0);
IncludesPodcastParameters = __decorate([
    ObjectParametersType()
], IncludesPodcastParameters);
export { IncludesPodcastParameters };
let IncludesPodcastChildrenParameters = class IncludesPodcastChildrenParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include episodes on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastChildrenParameters.prototype, "podcastIncEpisodes", void 0);
IncludesPodcastChildrenParameters = __decorate([
    ObjectParametersType()
], IncludesPodcastChildrenParameters);
export { IncludesPodcastChildrenParameters };
let PodcastCreateParameters = class PodcastCreateParameters {
};
__decorate([
    ObjectField({ description: 'Podcast Feed URL', example: 'https://podcast.example.com/feed.xml' }),
    __metadata("design:type", String)
], PodcastCreateParameters.prototype, "url", void 0);
PodcastCreateParameters = __decorate([
    ObjectParametersType()
], PodcastCreateParameters);
export { PodcastCreateParameters };
let PodcastRefreshParameters = class PodcastRefreshParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'Podcast ID to refresh (empty for refreshing all)', isID: true }),
    __metadata("design:type", String)
], PodcastRefreshParameters.prototype, "id", void 0);
PodcastRefreshParameters = __decorate([
    ObjectParametersType()
], PodcastRefreshParameters);
export { PodcastRefreshParameters };
let PodcastFilterParameters = class PodcastFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], PodcastFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Podcast' }),
    __metadata("design:type", String)
], PodcastFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Podcast Ids', isID: true }),
    __metadata("design:type", Array)
], PodcastFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true }),
    __metadata("design:type", Array)
], PodcastFilterParameters.prototype, "episodeIDs", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PodcastFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by URL', example: 'https://podcast.example.com/feed.xml' }),
    __metadata("design:type", String)
], PodcastFilterParameters.prototype, "url", void 0);
__decorate([
    Field(() => [PodcastStatus], { nullable: true }),
    ObjectField(() => [PodcastStatus], { nullable: true, description: 'filter by Podcast Status', example: [PodcastStatus.downloading] }),
    __metadata("design:type", Array)
], PodcastFilterParameters.prototype, "statuses", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by since Last Check timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PodcastFilterParameters.prototype, "lastCheckFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by until Last Check timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PodcastFilterParameters.prototype, "lastCheckTo", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Title', example: 'Awesome Podcast' }),
    __metadata("design:type", String)
], PodcastFilterParameters.prototype, "title", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Author', example: 'Poddy McPodcastface' }),
    __metadata("design:type", String)
], PodcastFilterParameters.prototype, "author", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Title', example: 'Awesome Topic' }),
    __metadata("design:type", String)
], PodcastFilterParameters.prototype, "description", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Title', example: 'Awesome Feed Generator' }),
    __metadata("design:type", String)
], PodcastFilterParameters.prototype, "generator", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Podcast Category', example: ['Awesome'] }),
    __metadata("design:type", Array)
], PodcastFilterParameters.prototype, "categories", void 0);
PodcastFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], PodcastFilterParameters);
export { PodcastFilterParameters };
let PodcastFilterParametersQL = class PodcastFilterParametersQL {
};
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterParametersQL.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterParametersQL.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterParametersQL.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterParametersQL.prototype, "episodeIDs", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], PodcastFilterParametersQL.prototype, "since", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterParametersQL.prototype, "url", void 0);
__decorate([
    Field(() => [PodcastStatus], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterParametersQL.prototype, "statuses", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], PodcastFilterParametersQL.prototype, "lastCheckFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], PodcastFilterParametersQL.prototype, "lastCheckTo", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterParametersQL.prototype, "title", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterParametersQL.prototype, "author", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterParametersQL.prototype, "description", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterParametersQL.prototype, "generator", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterParametersQL.prototype, "categories", void 0);
PodcastFilterParametersQL = __decorate([
    InputType()
], PodcastFilterParametersQL);
export { PodcastFilterParametersQL };
let PodcastOrderParameters = class PodcastOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => PodcastOrderFields, { nullable: true }),
    ObjectField(() => PodcastOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], PodcastOrderParameters.prototype, "orderBy", void 0);
PodcastOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], PodcastOrderParameters);
export { PodcastOrderParameters };
let PodcastOrderParametersQL = class PodcastOrderParametersQL extends PodcastOrderParameters {
};
PodcastOrderParametersQL = __decorate([
    InputType()
], PodcastOrderParametersQL);
export { PodcastOrderParametersQL };
let PodcastIndexParametersQL = class PodcastIndexParametersQL extends FilterParameters(PodcastFilterParametersQL) {
};
PodcastIndexParametersQL = __decorate([
    ArgsType()
], PodcastIndexParametersQL);
export { PodcastIndexParametersQL };
let PodcastPageParametersQL = class PodcastPageParametersQL extends PaginatedFilterParameters(PodcastFilterParametersQL, PodcastOrderParametersQL) {
};
PodcastPageParametersQL = __decorate([
    ArgsType()
], PodcastPageParametersQL);
export { PodcastPageParametersQL };
let PodcastsParametersQL = class PodcastsParametersQL extends PodcastPageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], PodcastsParametersQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastsParametersQL.prototype, "seed", void 0);
PodcastsParametersQL = __decorate([
    ArgsType()
], PodcastsParametersQL);
export { PodcastsParametersQL };
let PodcastDiscoverParameters = class PodcastDiscoverParameters {
};
__decorate([
    Field(() => String),
    ObjectField({ description: 'Search Podcast by Name', example: 'awesome' }),
    __metadata("design:type", String)
], PodcastDiscoverParameters.prototype, "query", void 0);
PodcastDiscoverParameters = __decorate([
    ArgsType(),
    ObjectParametersType()
], PodcastDiscoverParameters);
export { PodcastDiscoverParameters };
let PodcastDiscoverParametersQL = class PodcastDiscoverParametersQL extends PodcastDiscoverParameters {
};
PodcastDiscoverParametersQL = __decorate([
    ArgsType()
], PodcastDiscoverParametersQL);
export { PodcastDiscoverParametersQL };
let PodcastDiscoverByTagParameters = class PodcastDiscoverByTagParameters {
};
__decorate([
    Field(() => String),
    ObjectField({ description: 'Search Podcast by Tag', example: 'awesome' }),
    __metadata("design:type", String)
], PodcastDiscoverByTagParameters.prototype, "tag", void 0);
PodcastDiscoverByTagParameters = __decorate([
    ArgsType(),
    ObjectParametersType()
], PodcastDiscoverByTagParameters);
export { PodcastDiscoverByTagParameters };
let PodcastDiscoverByTagParametersQL = class PodcastDiscoverByTagParametersQL extends PodcastDiscoverByTagParameters {
};
PodcastDiscoverByTagParametersQL = __decorate([
    ArgsType()
], PodcastDiscoverByTagParametersQL);
export { PodcastDiscoverByTagParametersQL };
//# sourceMappingURL=podcast.parameters.js.map