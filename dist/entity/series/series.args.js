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
import { DefaultOrderArgs, FilterArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let IncludesSeriesArgs = class IncludesSeriesArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncAlbumIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include album counts on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncAlbumCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncState", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncTrackIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track counts on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncTrackCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncInfo", void 0);
IncludesSeriesArgs = __decorate([
    ObjParamsType()
], IncludesSeriesArgs);
export { IncludesSeriesArgs };
let IncludesSeriesChildrenArgs = class IncludesSeriesChildrenArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include albums on series', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesChildrenArgs.prototype, "seriesIncAlbums", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesChildrenArgs.prototype, "seriesIncTracks", void 0);
IncludesSeriesChildrenArgs = __decorate([
    ObjParamsType()
], IncludesSeriesChildrenArgs);
export { IncludesSeriesChildrenArgs };
let SeriesFilterArgs = class SeriesFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], SeriesFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Series' }),
    __metadata("design:type", String)
], SeriesFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => [AlbumType], { nullable: true }),
    ObjField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook] }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "albumTypes", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], SeriesFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "genreIDs", void 0);
SeriesFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], SeriesFilterArgs);
export { SeriesFilterArgs };
let SeriesFilterArgsQL = class SeriesFilterArgsQL extends SeriesFilterArgs {
};
SeriesFilterArgsQL = __decorate([
    InputType()
], SeriesFilterArgsQL);
export { SeriesFilterArgsQL };
let SeriesOrderArgs = class SeriesOrderArgs extends DefaultOrderArgs {
};
SeriesOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], SeriesOrderArgs);
export { SeriesOrderArgs };
let SeriesOrderArgsQL = class SeriesOrderArgsQL extends SeriesOrderArgs {
};
SeriesOrderArgsQL = __decorate([
    InputType()
], SeriesOrderArgsQL);
export { SeriesOrderArgsQL };
let SeriesIndexArgsQL = class SeriesIndexArgsQL extends FilterArgs(SeriesFilterArgsQL) {
};
SeriesIndexArgsQL = __decorate([
    ArgsType()
], SeriesIndexArgsQL);
export { SeriesIndexArgsQL };
let SeriesPageArgsQL = class SeriesPageArgsQL extends PaginatedFilterArgs(SeriesFilterArgsQL, SeriesOrderArgsQL) {
};
SeriesPageArgsQL = __decorate([
    ArgsType()
], SeriesPageArgsQL);
export { SeriesPageArgsQL };
let SeriesArgsQL = class SeriesArgsQL extends SeriesPageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], SeriesArgsQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], SeriesArgsQL.prototype, "seed", void 0);
SeriesArgsQL = __decorate([
    ArgsType()
], SeriesArgsQL);
export { SeriesArgsQL };
//# sourceMappingURL=series.args.js.map