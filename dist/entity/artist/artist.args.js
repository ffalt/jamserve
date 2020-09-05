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
exports.ArtistsArgsQL = exports.ArtistPageArgsQL = exports.ArtistIndexArgsQL = exports.ArtistOrderArgsQL = exports.ArtistOrderArgs = exports.ArtistFilterArgsQL = exports.ArtistFilterArgs = exports.IncludesArtistChildrenArgs = exports.IncludesArtistArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesArtistArgs = class IncludesArtistArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncAlbumIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include album count on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncAlbumCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncState", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncTrackIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track count on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncTrackCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include series ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncSeriesIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include series count on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncSeriesCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncInfo", void 0);
IncludesArtistArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesArtistArgs);
exports.IncludesArtistArgs = IncludesArtistArgs;
let IncludesArtistChildrenArgs = class IncludesArtistChildrenArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include albums on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenArgs.prototype, "artistIncAlbums", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenArgs.prototype, "artistIncTracks", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include series on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenArgs.prototype, "artistIncSeries", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include similar artists on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenArgs.prototype, "artistIncSimilar", void 0);
IncludesArtistChildrenArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesArtistChildrenArgs);
exports.IncludesArtistChildrenArgs = IncludesArtistChildrenArgs;
let ArtistFilterArgs = class ArtistFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'pink' }),
    __metadata("design:type", String)
], ArtistFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Artist Name', example: 'Pink Floyd' }),
    __metadata("design:type", String)
], ArtistFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Artist Slug', example: 'pinkfloyd' }),
    __metadata("design:type", String)
], ArtistFilterArgs.prototype, "slug", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Album Track Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "albumTrackIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "seriesIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Genres', example: example_consts_1.examples.genres }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.AlbumType], { nullable: true }),
    decorators_1.ObjField(() => [enums_1.AlbumType], { nullable: true, description: 'filter by Album Types', example: [enums_1.AlbumType.audiobook] }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "albumTypes", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [example_consts_1.examples.mbArtistID] }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "mbArtistIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], ArtistFilterArgs.prototype, "since", void 0);
ArtistFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], ArtistFilterArgs);
exports.ArtistFilterArgs = ArtistFilterArgs;
let ArtistFilterArgsQL = class ArtistFilterArgsQL extends ArtistFilterArgs {
};
ArtistFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], ArtistFilterArgsQL);
exports.ArtistFilterArgsQL = ArtistFilterArgsQL;
let ArtistOrderArgs = class ArtistOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ArtistOrderFields, { nullable: true }),
    decorators_1.ObjField(() => enums_1.ArtistOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], ArtistOrderArgs.prototype, "orderBy", void 0);
ArtistOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], ArtistOrderArgs);
exports.ArtistOrderArgs = ArtistOrderArgs;
let ArtistOrderArgsQL = class ArtistOrderArgsQL extends ArtistOrderArgs {
};
ArtistOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], ArtistOrderArgsQL);
exports.ArtistOrderArgsQL = ArtistOrderArgsQL;
let ArtistIndexArgsQL = class ArtistIndexArgsQL extends base_args_1.FilterArgs(ArtistFilterArgsQL) {
};
ArtistIndexArgsQL = __decorate([
    type_graphql_1.ArgsType()
], ArtistIndexArgsQL);
exports.ArtistIndexArgsQL = ArtistIndexArgsQL;
let ArtistPageArgsQL = class ArtistPageArgsQL extends base_args_1.PaginatedFilterArgs(ArtistFilterArgsQL, ArtistOrderArgsQL) {
};
ArtistPageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], ArtistPageArgsQL);
exports.ArtistPageArgsQL = ArtistPageArgsQL;
let ArtistsArgsQL = class ArtistsArgsQL extends ArtistPageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], ArtistsArgsQL.prototype, "list", void 0);
ArtistsArgsQL = __decorate([
    type_graphql_1.ArgsType()
], ArtistsArgsQL);
exports.ArtistsArgsQL = ArtistsArgsQL;
//# sourceMappingURL=artist.args.js.map