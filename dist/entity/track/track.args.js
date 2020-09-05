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
exports.TracksArgsQL = exports.TrackPageArgsQL = exports.TrackOrderArgsQL = exports.TrackOrderArgs = exports.TrackFilterArgsQL = exports.TrackFilterArgs = exports.RawTagUpdateArgs = exports.MediaTagRawUpdateArgs = exports.TrackFixArgs = exports.TrackMoveArgs = exports.TrackRenameArgs = exports.MediaHealthArgs = exports.IncludesTrackArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesTrackArgs = class IncludesTrackArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include media information on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackArgs.prototype, "trackIncMedia", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include tag on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackArgs.prototype, "trackIncTag", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include raw tag on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackArgs.prototype, "trackIncRawTag", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include user states (fav,rate) on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackArgs.prototype, "trackIncState", void 0);
IncludesTrackArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesTrackArgs);
exports.IncludesTrackArgs = IncludesTrackArgs;
let MediaHealthArgs = class MediaHealthArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'check media file integrity', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], MediaHealthArgs.prototype, "healthMedia", void 0);
MediaHealthArgs = __decorate([
    decorators_1.ObjParamsType()
], MediaHealthArgs);
exports.MediaHealthArgs = MediaHealthArgs;
let TrackRenameArgs = class TrackRenameArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], TrackRenameArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'New track file name', isID: true }),
    __metadata("design:type", String)
], TrackRenameArgs.prototype, "name", void 0);
TrackRenameArgs = __decorate([
    decorators_1.ObjParamsType()
], TrackRenameArgs);
exports.TrackRenameArgs = TrackRenameArgs;
let TrackMoveArgs = class TrackMoveArgs {
};
__decorate([
    decorators_1.ObjField(() => [String], { description: 'Track Ids', isID: true }),
    __metadata("design:type", Array)
], TrackMoveArgs.prototype, "ids", void 0);
__decorate([
    decorators_1.ObjField({ description: 'ID of the destination folder', isID: true }),
    __metadata("design:type", String)
], TrackMoveArgs.prototype, "folderID", void 0);
TrackMoveArgs = __decorate([
    decorators_1.ObjParamsType()
], TrackMoveArgs);
exports.TrackMoveArgs = TrackMoveArgs;
let TrackFixArgs = class TrackFixArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], TrackFixArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.TrackHealthID, { description: 'Which issue to fix with the track' }),
    __metadata("design:type", String)
], TrackFixArgs.prototype, "fixID", void 0);
TrackFixArgs = __decorate([
    decorators_1.ObjParamsType()
], TrackFixArgs);
exports.TrackFixArgs = TrackFixArgs;
let MediaTagRawUpdateArgs = class MediaTagRawUpdateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Tag Version' }),
    __metadata("design:type", Number)
], MediaTagRawUpdateArgs.prototype, "version", void 0);
__decorate([
    decorators_1.ObjField(() => Object, { description: 'Tag Frames', generic: true }),
    __metadata("design:type", Object)
], MediaTagRawUpdateArgs.prototype, "frames", void 0);
MediaTagRawUpdateArgs = __decorate([
    decorators_1.ObjParamsType()
], MediaTagRawUpdateArgs);
exports.MediaTagRawUpdateArgs = MediaTagRawUpdateArgs;
let RawTagUpdateArgs = class RawTagUpdateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], RawTagUpdateArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField(() => MediaTagRawUpdateArgs, { description: 'Raw tag to store in the track (e.g. id3v2/vorbis)' }),
    __metadata("design:type", MediaTagRawUpdateArgs)
], RawTagUpdateArgs.prototype, "tag", void 0);
RawTagUpdateArgs = __decorate([
    decorators_1.ObjParamsType()
], RawTagUpdateArgs);
exports.RawTagUpdateArgs = RawTagUpdateArgs;
let TrackFilterArgs = class TrackFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'these' }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Track Title', example: 'These Days' }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter if track is in folder id (or its child folders)', isID: true }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "childOfID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by artist name', example: 'Nico' }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "artist", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by album name', example: 'Chelsea Girl' }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "album", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by genres', example: ['Folk Pop'] }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], TrackFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "seriesIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Album Artist Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "albumArtistIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Bookmark Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "bookmarkIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by since year', min: 0, example: example_consts_1.examples.year }),
    __metadata("design:type", Number)
], TrackFilterArgs.prototype, "fromYear", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by until year', min: 0, example: example_consts_1.examples.year }),
    __metadata("design:type", Number)
], TrackFilterArgs.prototype, "toYear", void 0);
TrackFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], TrackFilterArgs);
exports.TrackFilterArgs = TrackFilterArgs;
let TrackFilterArgsQL = class TrackFilterArgsQL extends TrackFilterArgs {
};
TrackFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], TrackFilterArgsQL);
exports.TrackFilterArgsQL = TrackFilterArgsQL;
let TrackOrderArgs = class TrackOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.TrackOrderFields, { nullable: true }),
    decorators_1.ObjField(() => enums_1.TrackOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], TrackOrderArgs.prototype, "orderBy", void 0);
TrackOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], TrackOrderArgs);
exports.TrackOrderArgs = TrackOrderArgs;
let TrackOrderArgsQL = class TrackOrderArgsQL extends TrackOrderArgs {
};
TrackOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], TrackOrderArgsQL);
exports.TrackOrderArgsQL = TrackOrderArgsQL;
let TrackPageArgsQL = class TrackPageArgsQL extends base_args_1.PaginatedFilterArgs(TrackFilterArgsQL, TrackOrderArgsQL) {
};
TrackPageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], TrackPageArgsQL);
exports.TrackPageArgsQL = TrackPageArgsQL;
let TracksArgsQL = class TracksArgsQL extends TrackPageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], TracksArgsQL.prototype, "list", void 0);
TracksArgsQL = __decorate([
    type_graphql_1.ArgsType()
], TracksArgsQL);
exports.TracksArgsQL = TracksArgsQL;
//# sourceMappingURL=track.args.js.map