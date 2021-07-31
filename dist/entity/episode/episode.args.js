var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ObjParamsType } from '../../modules/rest/decorators';
import { EpisodeOrderFields, ListType, PodcastStatus } from '../../types/enums';
import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { OrderByArgs, PaginatedFilterArgs } from '../base/base.args';
import { examples } from '../../modules/engine/rest/example.consts';
let IncludesEpisodeArgs = class IncludesEpisodeArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include media information on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeArgs.prototype, "episodeIncMedia", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include tag on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeArgs.prototype, "episodeIncTag", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include raw tag on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeArgs.prototype, "episodeIncRawTag", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include user states (fav,rate) on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeArgs.prototype, "episodeIncState", void 0);
IncludesEpisodeArgs = __decorate([
    ObjParamsType()
], IncludesEpisodeArgs);
export { IncludesEpisodeArgs };
let IncludesEpisodeParentArgs = class IncludesEpisodeParentArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include parent podcast on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeParentArgs.prototype, "episodeIncParent", void 0);
IncludesEpisodeParentArgs = __decorate([
    ObjParamsType()
], IncludesEpisodeParentArgs);
export { IncludesEpisodeParentArgs };
let EpisodeFilterArgs = class EpisodeFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], EpisodeFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Podcast Episode!' }),
    __metadata("design:type", String)
], EpisodeFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Podcast Ids', isID: true }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "podcastIDs", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], EpisodeFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Authors', example: ['Poddy McPodcastface'] }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "authors", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by GUIDs', example: ['podlove-2018-04-12t11:08:02+00:00-b3bea1e7437bda4'] }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "guids", void 0);
__decorate([
    Field(() => [PodcastStatus], { nullable: true }),
    ObjField(() => [PodcastStatus], { nullable: true, description: 'filter by Podcast Status', example: [PodcastStatus.downloading] }),
    __metadata("design:type", Array)
], EpisodeFilterArgs.prototype, "statuses", void 0);
EpisodeFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], EpisodeFilterArgs);
export { EpisodeFilterArgs };
let EpisodeFilterArgsQL = class EpisodeFilterArgsQL extends EpisodeFilterArgs {
};
EpisodeFilterArgsQL = __decorate([
    InputType()
], EpisodeFilterArgsQL);
export { EpisodeFilterArgsQL };
let EpisodeOrderArgs = class EpisodeOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => EpisodeOrderFields, { nullable: true }),
    ObjField(() => EpisodeOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], EpisodeOrderArgs.prototype, "orderBy", void 0);
EpisodeOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], EpisodeOrderArgs);
export { EpisodeOrderArgs };
let EpisodeOrderArgsQL = class EpisodeOrderArgsQL extends EpisodeOrderArgs {
};
EpisodeOrderArgsQL = __decorate([
    InputType()
], EpisodeOrderArgsQL);
export { EpisodeOrderArgsQL };
let EpisodePageArgsQL = class EpisodePageArgsQL extends PaginatedFilterArgs(EpisodeFilterArgsQL, EpisodeOrderArgsQL) {
};
EpisodePageArgsQL = __decorate([
    ArgsType()
], EpisodePageArgsQL);
export { EpisodePageArgsQL };
let EpisodesArgsQL = class EpisodesArgsQL extends EpisodePageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], EpisodesArgsQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], EpisodesArgsQL.prototype, "seed", void 0);
EpisodesArgsQL = __decorate([
    ArgsType()
], EpisodesArgsQL);
export { EpisodesArgsQL };
//# sourceMappingURL=episode.args.js.map