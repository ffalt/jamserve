var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AlbumOrderFields, AlbumType, ListType } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { FilterParameters, OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesAlbumParameters = class IncludesAlbumParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include track ids on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumParameters.prototype, "albumIncTrackIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include track count on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumParameters.prototype, "albumIncTrackCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include user states (fav,rate) on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumParameters.prototype, "albumIncState", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include extended meta data on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumParameters.prototype, "albumIncInfo", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include genre on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumParameters.prototype, "albumIncGenres", void 0);
IncludesAlbumParameters = __decorate([
    ObjectParametersType()
], IncludesAlbumParameters);
export { IncludesAlbumParameters };
let IncludesAlbumChildrenParameters = class IncludesAlbumChildrenParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include tracks on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumChildrenParameters.prototype, "albumIncTracks", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include artist on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumChildrenParameters.prototype, "albumIncArtist", void 0);
IncludesAlbumChildrenParameters = __decorate([
    ObjectParametersType()
], IncludesAlbumChildrenParameters);
export { IncludesAlbumChildrenParameters };
let AlbumFilterParameters = class AlbumFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'balkan' }),
    __metadata("design:type", String)
], AlbumFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Album Name', example: 'Balkan Beat Box' }),
    __metadata("design:type", String)
], AlbumFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Album Slug', example: 'balkanbeatbox' }),
    __metadata("design:type", String)
], AlbumFilterParameters.prototype, "slug", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Artist Name', example: 'Balkan Beat Box' }),
    __metadata("design:type", String)
], AlbumFilterParameters.prototype, "artist", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "seriesIDs", void 0);
__decorate([
    Field(() => [AlbumType], { nullable: true }),
    ObjectField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook] }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "albumTypes", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Ids', example: [examples.mbReleaseID] }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "mbReleaseIDs", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID] }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "mbArtistIDs", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField(() => String, { nullable: true, description: 'exclude by MusicBrainz Artist Id', example: examples.mbArtistID }),
    __metadata("design:type", String)
], AlbumFilterParameters.prototype, "notMbArtistID", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Genres', example: examples.genres }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "genres", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterParameters.prototype, "genreIDs", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], AlbumFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by since year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], AlbumFilterParameters.prototype, "fromYear", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by until year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], AlbumFilterParameters.prototype, "toYear", void 0);
AlbumFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], AlbumFilterParameters);
export { AlbumFilterParameters };
let AlbumFilterParametersQL = class AlbumFilterParametersQL extends AlbumFilterParameters {
};
AlbumFilterParametersQL = __decorate([
    InputType()
], AlbumFilterParametersQL);
export { AlbumFilterParametersQL };
let AlbumOrderParameters = class AlbumOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => AlbumOrderFields, { nullable: true }),
    ObjectField(() => AlbumOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], AlbumOrderParameters.prototype, "orderBy", void 0);
AlbumOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], AlbumOrderParameters);
export { AlbumOrderParameters };
let AlbumOrderParametersQL = class AlbumOrderParametersQL extends AlbumOrderParameters {
};
AlbumOrderParametersQL = __decorate([
    InputType()
], AlbumOrderParametersQL);
export { AlbumOrderParametersQL };
let AlbumIndexParametersQL = class AlbumIndexParametersQL extends FilterParameters(AlbumFilterParametersQL) {
};
AlbumIndexParametersQL = __decorate([
    ArgsType()
], AlbumIndexParametersQL);
export { AlbumIndexParametersQL };
let AlbumPageParametersQL = class AlbumPageParametersQL extends PaginatedFilterParameters(AlbumFilterParametersQL, AlbumOrderParametersQL) {
};
AlbumPageParametersQL = __decorate([
    ArgsType()
], AlbumPageParametersQL);
export { AlbumPageParametersQL };
let AlbumsParametersQL = class AlbumsParametersQL extends AlbumPageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], AlbumsParametersQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], AlbumsParametersQL.prototype, "seed", void 0);
AlbumsParametersQL = __decorate([
    ArgsType()
], AlbumsParametersQL);
export { AlbumsParametersQL };
//# sourceMappingURL=album.parameters.js.map