var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { AlbumType, ListType } from '../../types/enums.js';
import { DefaultOrderParameters, FilterParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesSeriesParameters = class IncludesSeriesParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesParameters.prototype, "seriesIncAlbumIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include album counts on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesParameters.prototype, "seriesIncAlbumCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesParameters.prototype, "seriesIncState", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesParameters.prototype, "seriesIncTrackIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include track counts on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesParameters.prototype, "seriesIncTrackCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesParameters.prototype, "seriesIncInfo", void 0);
IncludesSeriesParameters = __decorate([
    ObjectParametersType()
], IncludesSeriesParameters);
export { IncludesSeriesParameters };
let IncludesSeriesChildrenParameters = class IncludesSeriesChildrenParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include albums on series', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesChildrenParameters.prototype, "seriesIncAlbums", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesChildrenParameters.prototype, "seriesIncTracks", void 0);
IncludesSeriesChildrenParameters = __decorate([
    ObjectParametersType()
], IncludesSeriesChildrenParameters);
export { IncludesSeriesChildrenParameters };
let SeriesFilterParameters = class SeriesFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], SeriesFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Series' }),
    __metadata("design:type", String)
], SeriesFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => [AlbumType], { nullable: true }),
    ObjectField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook] }),
    __metadata("design:type", Array)
], SeriesFilterParameters.prototype, "albumTypes", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], SeriesFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterParameters.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterParameters.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterParameters.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterParameters.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterParameters.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterParameters.prototype, "genreIDs", void 0);
SeriesFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], SeriesFilterParameters);
export { SeriesFilterParameters };
let SeriesFilterParametersQL = class SeriesFilterParametersQL extends SeriesFilterParameters {
};
SeriesFilterParametersQL = __decorate([
    InputType()
], SeriesFilterParametersQL);
export { SeriesFilterParametersQL };
let SeriesOrderParameters = class SeriesOrderParameters extends DefaultOrderParameters {
};
SeriesOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], SeriesOrderParameters);
export { SeriesOrderParameters };
let SeriesOrderParametersQL = class SeriesOrderParametersQL extends SeriesOrderParameters {
};
SeriesOrderParametersQL = __decorate([
    InputType()
], SeriesOrderParametersQL);
export { SeriesOrderParametersQL };
let SeriesIndexParametersQL = class SeriesIndexParametersQL extends FilterParameters(SeriesFilterParametersQL) {
};
SeriesIndexParametersQL = __decorate([
    ArgsType()
], SeriesIndexParametersQL);
export { SeriesIndexParametersQL };
let SeriesPageParametersQL = class SeriesPageParametersQL extends PaginatedFilterParameters(SeriesFilterParametersQL, SeriesOrderParametersQL) {
};
SeriesPageParametersQL = __decorate([
    ArgsType()
], SeriesPageParametersQL);
export { SeriesPageParametersQL };
let SeriesParametersQL = class SeriesParametersQL extends SeriesPageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], SeriesParametersQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], SeriesParametersQL.prototype, "seed", void 0);
SeriesParametersQL = __decorate([
    ArgsType()
], SeriesParametersQL);
export { SeriesParametersQL };
//# sourceMappingURL=series.parameters.js.map