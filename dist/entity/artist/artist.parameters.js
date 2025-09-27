var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AlbumType, ArtistOrderFields, ListType } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { FilterParameters, OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesArtistParameters = class IncludesArtistParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistParameters.prototype, "artistIncAlbumIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include album count on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistParameters.prototype, "artistIncAlbumCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistParameters.prototype, "artistIncState", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistParameters.prototype, "artistIncTrackIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include track count on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistParameters.prototype, "artistIncTrackCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include series ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistParameters.prototype, "artistIncSeriesIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include series count on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistParameters.prototype, "artistIncSeriesCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistParameters.prototype, "artistIncInfo", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include genre on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistParameters.prototype, "artistIncGenres", void 0);
IncludesArtistParameters = __decorate([
    ObjectParametersType()
], IncludesArtistParameters);
export { IncludesArtistParameters };
let IncludesArtistChildrenParameters = class IncludesArtistChildrenParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include albums on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenParameters.prototype, "artistIncAlbums", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenParameters.prototype, "artistIncTracks", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include series on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenParameters.prototype, "artistIncSeries", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include similar artists on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenParameters.prototype, "artistIncSimilar", void 0);
IncludesArtistChildrenParameters = __decorate([
    ObjectParametersType()
], IncludesArtistChildrenParameters);
export { IncludesArtistChildrenParameters };
let ArtistFilterParameters = class ArtistFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'pink' }),
    __metadata("design:type", String)
], ArtistFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Artist Name', example: 'Pink Floyd' }),
    __metadata("design:type", String)
], ArtistFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Artist Slug', example: 'pinkfloyd' }),
    __metadata("design:type", String)
], ArtistFilterParameters.prototype, "slug", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Album Track Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "albumTrackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "seriesIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Genres', example: examples.genres }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "genres", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "genreIDs", void 0);
__decorate([
    Field(() => [AlbumType], { nullable: true }),
    ObjectField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook] }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "albumTypes", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID] }),
    __metadata("design:type", Array)
], ArtistFilterParameters.prototype, "mbArtistIDs", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField(() => String, { nullable: true, description: 'exclude by MusicBrainz Artist Id', example: examples.mbArtistID }),
    __metadata("design:type", String)
], ArtistFilterParameters.prototype, "notMbArtistID", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], ArtistFilterParameters.prototype, "since", void 0);
ArtistFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], ArtistFilterParameters);
export { ArtistFilterParameters };
let ArtistFilterParametersQL = class ArtistFilterParametersQL extends ArtistFilterParameters {
};
ArtistFilterParametersQL = __decorate([
    InputType()
], ArtistFilterParametersQL);
export { ArtistFilterParametersQL };
let ArtistOrderParameters = class ArtistOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => ArtistOrderFields, { nullable: true }),
    ObjectField(() => ArtistOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], ArtistOrderParameters.prototype, "orderBy", void 0);
ArtistOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], ArtistOrderParameters);
export { ArtistOrderParameters };
let ArtistOrderParametersQL = class ArtistOrderParametersQL extends ArtistOrderParameters {
};
ArtistOrderParametersQL = __decorate([
    InputType()
], ArtistOrderParametersQL);
export { ArtistOrderParametersQL };
let ArtistIndexParametersQL = class ArtistIndexParametersQL extends FilterParameters(ArtistFilterParametersQL) {
};
ArtistIndexParametersQL = __decorate([
    ArgsType()
], ArtistIndexParametersQL);
export { ArtistIndexParametersQL };
let ArtistPageParametersQL = class ArtistPageParametersQL extends PaginatedFilterParameters(ArtistFilterParametersQL, ArtistOrderParametersQL) {
};
ArtistPageParametersQL = __decorate([
    ArgsType()
], ArtistPageParametersQL);
export { ArtistPageParametersQL };
let ArtistsParametersQL = class ArtistsParametersQL extends ArtistPageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], ArtistsParametersQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ArtistsParametersQL.prototype, "seed", void 0);
ArtistsParametersQL = __decorate([
    ArgsType()
], ArtistsParametersQL);
export { ArtistsParametersQL };
//# sourceMappingURL=artist.parameters.js.map