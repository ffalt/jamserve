var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EpisodeOrderFields, ListType, PodcastStatus } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesEpisodeParameters = class IncludesEpisodeParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include media information on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeParameters.prototype, "episodeIncMedia", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include tag on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeParameters.prototype, "episodeIncTag", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include raw tag on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeParameters.prototype, "episodeIncRawTag", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include user states (fav,rate) on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeParameters.prototype, "episodeIncState", void 0);
IncludesEpisodeParameters = __decorate([
    ObjectParametersType()
], IncludesEpisodeParameters);
export { IncludesEpisodeParameters };
let IncludesEpisodeParentParameters = class IncludesEpisodeParentParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include parent podcast on episode(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesEpisodeParentParameters.prototype, "episodeIncParent", void 0);
IncludesEpisodeParentParameters = __decorate([
    ObjectParametersType()
], IncludesEpisodeParentParameters);
export { IncludesEpisodeParentParameters };
let EpisodeFilterParameters = class EpisodeFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], EpisodeFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Podcast Episode!' }),
    __metadata("design:type", String)
], EpisodeFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true }),
    __metadata("design:type", Array)
], EpisodeFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Podcast Ids', isID: true }),
    __metadata("design:type", Array)
], EpisodeFilterParameters.prototype, "podcastIDs", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], EpisodeFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Authors', example: ['Poddy McPodcastface'] }),
    __metadata("design:type", Array)
], EpisodeFilterParameters.prototype, "authors", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by GUIDs', example: ['podlove-2018-04-12t11:08:02+00:00-b3bea1e7437bda4'] }),
    __metadata("design:type", Array)
], EpisodeFilterParameters.prototype, "guids", void 0);
__decorate([
    Field(() => [PodcastStatus], { nullable: true }),
    ObjectField(() => [PodcastStatus], { nullable: true, description: 'filter by Podcast Status', example: [PodcastStatus.downloading] }),
    __metadata("design:type", Array)
], EpisodeFilterParameters.prototype, "statuses", void 0);
EpisodeFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], EpisodeFilterParameters);
export { EpisodeFilterParameters };
let EpisodeFilterParametersQL = class EpisodeFilterParametersQL extends EpisodeFilterParameters {
};
EpisodeFilterParametersQL = __decorate([
    InputType()
], EpisodeFilterParametersQL);
export { EpisodeFilterParametersQL };
let EpisodeOrderParameters = class EpisodeOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => EpisodeOrderFields, { nullable: true }),
    ObjectField(() => EpisodeOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], EpisodeOrderParameters.prototype, "orderBy", void 0);
EpisodeOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], EpisodeOrderParameters);
export { EpisodeOrderParameters };
let EpisodeOrderParametersQL = class EpisodeOrderParametersQL extends EpisodeOrderParameters {
};
EpisodeOrderParametersQL = __decorate([
    InputType()
], EpisodeOrderParametersQL);
export { EpisodeOrderParametersQL };
let EpisodePageParametersQL = class EpisodePageParametersQL extends PaginatedFilterParameters(EpisodeFilterParametersQL, EpisodeOrderParametersQL) {
};
EpisodePageParametersQL = __decorate([
    ArgsType()
], EpisodePageParametersQL);
export { EpisodePageParametersQL };
let EpisodesParametersQL = class EpisodesParametersQL extends EpisodePageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], EpisodesParametersQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], EpisodesParametersQL.prototype, "seed", void 0);
EpisodesParametersQL = __decorate([
    ArgsType()
], EpisodesParametersQL);
export { EpisodesParametersQL };
//# sourceMappingURL=episode.parameters.js.map