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
exports.AlbumsArgsQL = exports.AlbumPageArgsQL = exports.AlbumIndexArgsQL = exports.AlbumOrderArgsQL = exports.AlbumOrderArgs = exports.AlbumFilterArgsQL = exports.AlbumFilterArgs = exports.IncludesAlbumChildrenArgs = exports.IncludesAlbumArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesAlbumArgs = class IncludesAlbumArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track ids on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncTrackIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track count on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncTrackCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include user states (fav,rate) on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncState", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include extended meta data on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncInfo", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include genre on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncGenres", void 0);
IncludesAlbumArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesAlbumArgs);
exports.IncludesAlbumArgs = IncludesAlbumArgs;
let IncludesAlbumChildrenArgs = class IncludesAlbumChildrenArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include tracks on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumChildrenArgs.prototype, "albumIncTracks", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include artist on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumChildrenArgs.prototype, "albumIncArtist", void 0);
IncludesAlbumChildrenArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesAlbumChildrenArgs);
exports.IncludesAlbumChildrenArgs = IncludesAlbumChildrenArgs;
let AlbumFilterArgs = class AlbumFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'balkan' }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Album Name', example: 'Balkan Beat Box' }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Album Slug', example: 'balkanbeatbox' }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "slug", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Artist Name', example: 'Balkan Beat Box' }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "artist", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "seriesIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.AlbumType], { nullable: true }),
    decorators_1.ObjField(() => [enums_1.AlbumType], { nullable: true, description: 'filter by Album Types', example: [enums_1.AlbumType.audiobook] }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "albumTypes", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Ids', example: [example_consts_1.examples.mbReleaseID] }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "mbReleaseIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [example_consts_1.examples.mbArtistID] }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "mbArtistIDs", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField(() => String, { nullable: true, description: 'exclude by MusicBrainz Artist Id', example: example_consts_1.examples.mbArtistID }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "notMbArtistID", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Genres', example: example_consts_1.examples.genres }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "genreIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], AlbumFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by since year', min: 0, example: example_consts_1.examples.year }),
    __metadata("design:type", Number)
], AlbumFilterArgs.prototype, "fromYear", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by until year', min: 0, example: example_consts_1.examples.year }),
    __metadata("design:type", Number)
], AlbumFilterArgs.prototype, "toYear", void 0);
AlbumFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], AlbumFilterArgs);
exports.AlbumFilterArgs = AlbumFilterArgs;
let AlbumFilterArgsQL = class AlbumFilterArgsQL extends AlbumFilterArgs {
};
AlbumFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], AlbumFilterArgsQL);
exports.AlbumFilterArgsQL = AlbumFilterArgsQL;
let AlbumOrderArgs = class AlbumOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.AlbumOrderFields, { nullable: true }),
    decorators_1.ObjField(() => enums_1.AlbumOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], AlbumOrderArgs.prototype, "orderBy", void 0);
AlbumOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], AlbumOrderArgs);
exports.AlbumOrderArgs = AlbumOrderArgs;
let AlbumOrderArgsQL = class AlbumOrderArgsQL extends AlbumOrderArgs {
};
AlbumOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], AlbumOrderArgsQL);
exports.AlbumOrderArgsQL = AlbumOrderArgsQL;
let AlbumIndexArgsQL = class AlbumIndexArgsQL extends base_args_1.FilterArgs(AlbumFilterArgsQL) {
};
AlbumIndexArgsQL = __decorate([
    type_graphql_1.ArgsType()
], AlbumIndexArgsQL);
exports.AlbumIndexArgsQL = AlbumIndexArgsQL;
let AlbumPageArgsQL = class AlbumPageArgsQL extends base_args_1.PaginatedFilterArgs(AlbumFilterArgsQL, AlbumOrderArgsQL) {
};
AlbumPageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], AlbumPageArgsQL);
exports.AlbumPageArgsQL = AlbumPageArgsQL;
let AlbumsArgsQL = class AlbumsArgsQL extends AlbumPageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], AlbumsArgsQL.prototype, "list", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], AlbumsArgsQL.prototype, "seed", void 0);
AlbumsArgsQL = __decorate([
    type_graphql_1.ArgsType()
], AlbumsArgsQL);
exports.AlbumsArgsQL = AlbumsArgsQL;
//# sourceMappingURL=album.args.js.map