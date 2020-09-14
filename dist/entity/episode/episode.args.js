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
exports.EpisodesArgsQL = exports.EpisodePageArgsQL = exports.EpisodeOrderArgsQL = exports.EpisodeOrderArgs = exports.EpisodeFilterArgsQL = exports.EpisodeFilterArgs = exports.IncludesEpisodeParentArgs = exports.IncludesEpisodeArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesEpisodeArgs = class IncludesEpisodeArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include media information on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeArgs.prototype, "episodeIncMedia", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include tag on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeArgs.prototype, "episodeIncTag", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include raw tag on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeArgs.prototype, "episodeIncRawTag", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include user states (fav,rate) on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeArgs.prototype, "episodeIncState", void 0);
IncludesEpisodeArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesEpisodeArgs);
exports.IncludesEpisodeArgs = IncludesEpisodeArgs;
let IncludesEpisodeParentArgs = class IncludesEpisodeParentArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include parent podcast on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeParentArgs.prototype, "episodeIncParent", void 0);
IncludesEpisodeParentArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesEpisodeParentArgs);
exports.IncludesEpisodeParentArgs = IncludesEpisodeParentArgs;
let EpisodeFilterArgs = class EpisodeFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], EpisodeFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Podcast Episode!' }),
    __metadata("design:type", String)
], EpisodeFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Podcast Ids', isID: true }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "podcastIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], EpisodeFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Authors', example: ['Poddy McPodcastface'] }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "authors", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by GUIDs', example: ['podlove-2018-04-12t11:08:02+00:00-b3bea1e7437bda4'] }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "guids", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.PodcastStatus], { nullable: true }),
    decorators_1.ObjField(() => [enums_1.PodcastStatus], { nullable: true, description: 'filter by Podcast Status', example: [enums_1.PodcastStatus.downloading] }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "statuses", void 0);
EpisodeFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], EpisodeFilterArgs);
exports.EpisodeFilterArgs = EpisodeFilterArgs;
let EpisodeFilterArgsQL = class EpisodeFilterArgsQL extends EpisodeFilterArgs {
};
EpisodeFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], EpisodeFilterArgsQL);
exports.EpisodeFilterArgsQL = EpisodeFilterArgsQL;
let EpisodeOrderArgs = class EpisodeOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.EpisodeOrderFields, { nullable: true }),
    decorators_1.ObjField(() => enums_1.EpisodeOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], EpisodeOrderArgs.prototype, "orderBy", void 0);
EpisodeOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], EpisodeOrderArgs);
exports.EpisodeOrderArgs = EpisodeOrderArgs;
let EpisodeOrderArgsQL = class EpisodeOrderArgsQL extends EpisodeOrderArgs {
};
EpisodeOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], EpisodeOrderArgsQL);
exports.EpisodeOrderArgsQL = EpisodeOrderArgsQL;
let EpisodePageArgsQL = class EpisodePageArgsQL extends base_args_1.PaginatedFilterArgs(EpisodeFilterArgsQL, EpisodeOrderArgsQL) {
};
EpisodePageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], EpisodePageArgsQL);
exports.EpisodePageArgsQL = EpisodePageArgsQL;
let EpisodesArgsQL = class EpisodesArgsQL extends EpisodePageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], EpisodesArgsQL.prototype, "list", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], EpisodesArgsQL.prototype, "seed", void 0);
EpisodesArgsQL = __decorate([
    type_graphql_1.ArgsType()
], EpisodesArgsQL);
exports.EpisodesArgsQL = EpisodesArgsQL;
//# sourceMappingURL=episode.args.js.map