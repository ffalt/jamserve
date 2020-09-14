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
exports.PodcastsArgsQL = exports.PodcastPageArgsQL = exports.PodcastIndexArgsQL = exports.PodcastOrderArgsQL = exports.PodcastOrderArgs = exports.PodcastFilterArgsQL = exports.PodcastFilterArgs = exports.PodcastRefreshArgs = exports.PodcastCreateArgs = exports.IncludesPodcastChildrenArgs = exports.IncludesPodcastArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const type_graphql_1 = require("type-graphql");
const enums_1 = require("../../types/enums");
const base_args_1 = require("../base/base.args");
let IncludesPodcastArgs = class IncludesPodcastArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include state (fav,rate) on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastArgs.prototype, "podcastIncState", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include episodes id on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastArgs.prototype, "podcastIncEpisodeIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include episode count on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastArgs.prototype, "podcastIncEpisodeCount", void 0);
IncludesPodcastArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesPodcastArgs);
exports.IncludesPodcastArgs = IncludesPodcastArgs;
let IncludesPodcastChildrenArgs = class IncludesPodcastChildrenArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include episodes on podcast(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPodcastChildrenArgs.prototype, "podcastIncEpisodes", void 0);
IncludesPodcastChildrenArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesPodcastChildrenArgs);
exports.IncludesPodcastChildrenArgs = IncludesPodcastChildrenArgs;
let PodcastCreateArgs = class PodcastCreateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Podcast Feed URL', example: 'https://podcast.example.com/feed.xml' }),
    __metadata("design:type", String)
], PodcastCreateArgs.prototype, "url", void 0);
PodcastCreateArgs = __decorate([
    decorators_1.ObjParamsType()
], PodcastCreateArgs);
exports.PodcastCreateArgs = PodcastCreateArgs;
let PodcastRefreshArgs = class PodcastRefreshArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Podcast ID to refresh (empty for refreshing all)', isID: true }),
    __metadata("design:type", String)
], PodcastRefreshArgs.prototype, "id", void 0);
PodcastRefreshArgs = __decorate([
    decorators_1.ObjParamsType()
], PodcastRefreshArgs);
exports.PodcastRefreshArgs = PodcastRefreshArgs;
let PodcastFilterArgs = class PodcastFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Podcast' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Podcast Ids', isID: true }),
    __metadata("design:type", Array)
], PodcastFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true }),
    __metadata("design:type", Array)
], PodcastFilterArgs.prototype, "episodeIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PodcastFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by URL', example: 'https://podcast.example.com/feed.xml' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "url", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.PodcastStatus], { nullable: true }),
    decorators_1.ObjField(() => [enums_1.PodcastStatus], { nullable: true, description: 'filter by Podcast Status', example: [enums_1.PodcastStatus.downloading] }),
    __metadata("design:type", Array)
], PodcastFilterArgs.prototype, "statuses", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by since Last Check timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PodcastFilterArgs.prototype, "lastCheckFrom", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by until Last Check timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PodcastFilterArgs.prototype, "lastCheckTo", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Title', example: 'Awesome Podcast' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Author', example: 'Poddy McPodcastface' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "author", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Title', example: 'Awesome Topic' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Title', example: 'Awesome Feed Generator' }),
    __metadata("design:type", String)
], PodcastFilterArgs.prototype, "generator", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Podcast Category', example: ['Awesome'] }),
    __metadata("design:type", Array)
], PodcastFilterArgs.prototype, "categories", void 0);
PodcastFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], PodcastFilterArgs);
exports.PodcastFilterArgs = PodcastFilterArgs;
let PodcastFilterArgsQL = class PodcastFilterArgsQL {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterArgsQL.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterArgsQL.prototype, "episodeIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], PodcastFilterArgsQL.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "url", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.PodcastStatus], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterArgsQL.prototype, "statuses", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], PodcastFilterArgsQL.prototype, "lastCheckFrom", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], PodcastFilterArgsQL.prototype, "lastCheckTo", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "author", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastFilterArgsQL.prototype, "generator", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PodcastFilterArgsQL.prototype, "categories", void 0);
PodcastFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], PodcastFilterArgsQL);
exports.PodcastFilterArgsQL = PodcastFilterArgsQL;
let PodcastOrderArgs = class PodcastOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.PodcastOrderFields, { nullable: true }),
    decorators_1.ObjField(() => enums_1.PodcastOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], PodcastOrderArgs.prototype, "orderBy", void 0);
PodcastOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], PodcastOrderArgs);
exports.PodcastOrderArgs = PodcastOrderArgs;
let PodcastOrderArgsQL = class PodcastOrderArgsQL extends PodcastOrderArgs {
};
PodcastOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], PodcastOrderArgsQL);
exports.PodcastOrderArgsQL = PodcastOrderArgsQL;
let PodcastIndexArgsQL = class PodcastIndexArgsQL extends base_args_1.FilterArgs(PodcastFilterArgsQL) {
};
PodcastIndexArgsQL = __decorate([
    type_graphql_1.ArgsType()
], PodcastIndexArgsQL);
exports.PodcastIndexArgsQL = PodcastIndexArgsQL;
let PodcastPageArgsQL = class PodcastPageArgsQL extends base_args_1.PaginatedFilterArgs(PodcastFilterArgsQL, PodcastOrderArgsQL) {
};
PodcastPageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], PodcastPageArgsQL);
exports.PodcastPageArgsQL = PodcastPageArgsQL;
let PodcastsArgsQL = class PodcastsArgsQL extends PodcastPageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], PodcastsArgsQL.prototype, "list", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodcastsArgsQL.prototype, "seed", void 0);
PodcastsArgsQL = __decorate([
    type_graphql_1.ArgsType()
], PodcastsArgsQL);
exports.PodcastsArgsQL = PodcastsArgsQL;
//# sourceMappingURL=podcast.args.js.map