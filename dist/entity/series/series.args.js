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
exports.SeriesArgsQL = exports.SeriesPageArgsQL = exports.SeriesIndexArgsQL = exports.SeriesOrderArgsQL = exports.SeriesOrderArgs = exports.SeriesFilterArgsQL = exports.SeriesFilterArgs = exports.IncludesSeriesChildrenArgs = exports.IncludesSeriesArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const type_graphql_1 = require("type-graphql");
const enums_1 = require("../../types/enums");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesSeriesArgs = class IncludesSeriesArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncAlbumIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include album counts on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncAlbumCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncState", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncTrackIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track counts on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncTrackCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesArgs.prototype, "seriesIncInfo", void 0);
IncludesSeriesArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesSeriesArgs);
exports.IncludesSeriesArgs = IncludesSeriesArgs;
let IncludesSeriesChildrenArgs = class IncludesSeriesChildrenArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include albums on series', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesChildrenArgs.prototype, "seriesIncAlbums", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesSeriesChildrenArgs.prototype, "seriesIncTracks", void 0);
IncludesSeriesChildrenArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesSeriesChildrenArgs);
exports.IncludesSeriesChildrenArgs = IncludesSeriesChildrenArgs;
let SeriesFilterArgs = class SeriesFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], SeriesFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Series' }),
    __metadata("design:type", String)
], SeriesFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.AlbumType], { nullable: true }),
    decorators_1.ObjField(() => [enums_1.AlbumType], { nullable: true, description: 'filter by Album Types', example: [enums_1.AlbumType.audiobook] }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "albumTypes", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], SeriesFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesFilterArgs.prototype, "folderIDs", void 0);
SeriesFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], SeriesFilterArgs);
exports.SeriesFilterArgs = SeriesFilterArgs;
let SeriesFilterArgsQL = class SeriesFilterArgsQL extends SeriesFilterArgs {
};
SeriesFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], SeriesFilterArgsQL);
exports.SeriesFilterArgsQL = SeriesFilterArgsQL;
let SeriesOrderArgs = class SeriesOrderArgs extends base_args_1.DefaultOrderArgs {
};
SeriesOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], SeriesOrderArgs);
exports.SeriesOrderArgs = SeriesOrderArgs;
let SeriesOrderArgsQL = class SeriesOrderArgsQL extends SeriesOrderArgs {
};
SeriesOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], SeriesOrderArgsQL);
exports.SeriesOrderArgsQL = SeriesOrderArgsQL;
let SeriesIndexArgsQL = class SeriesIndexArgsQL extends base_args_1.FilterArgs(SeriesFilterArgsQL) {
};
SeriesIndexArgsQL = __decorate([
    type_graphql_1.ArgsType()
], SeriesIndexArgsQL);
exports.SeriesIndexArgsQL = SeriesIndexArgsQL;
let SeriesPageArgsQL = class SeriesPageArgsQL extends base_args_1.PaginatedFilterArgs(SeriesFilterArgsQL, SeriesOrderArgsQL) {
};
SeriesPageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], SeriesPageArgsQL);
exports.SeriesPageArgsQL = SeriesPageArgsQL;
let SeriesArgsQL = class SeriesArgsQL extends SeriesPageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], SeriesArgsQL.prototype, "list", void 0);
SeriesArgsQL = __decorate([
    type_graphql_1.ArgsType()
], SeriesArgsQL);
exports.SeriesArgsQL = SeriesArgsQL;
//# sourceMappingURL=series.args.js.map