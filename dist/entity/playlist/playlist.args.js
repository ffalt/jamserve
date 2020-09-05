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
exports.PlaylistsArgs = exports.PlaylistPageArgsQL = exports.PlaylistIndexArgs = exports.PlaylistOrderArgsQL = exports.PlaylistOrderArgs = exports.PlaylistFilterArgsQL = exports.PlaylistFilterArgs = exports.PlaylistMutateArgs = exports.IncludesPlaylistArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const type_graphql_1 = require("type-graphql");
const enums_1 = require("../../types/enums");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesPlaylistArgs = class IncludesPlaylistArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include entries on playlist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlaylistArgs.prototype, "playlistIncEntries", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include entry ids on playlist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlaylistArgs.prototype, "playlistIncEntriesIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include user state on playlist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlaylistArgs.prototype, "playlistIncState", void 0);
IncludesPlaylistArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesPlaylistArgs);
exports.IncludesPlaylistArgs = IncludesPlaylistArgs;
let PlaylistMutateArgs = class PlaylistMutateArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Playlist Name' }),
    __metadata("design:type", String)
], PlaylistMutateArgs.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Comment', example: 'Awesome!' }),
    __metadata("design:type", String)
], PlaylistMutateArgs.prototype, "comment", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Playlist is public?', example: false }),
    __metadata("design:type", Boolean)
], PlaylistMutateArgs.prototype, "isPublic", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'Track/Episode IDs of the playlist, may include duplicates', isID: true }),
    __metadata("design:type", Array)
], PlaylistMutateArgs.prototype, "mediaIDs", void 0);
PlaylistMutateArgs = __decorate([
    decorators_1.ObjParamsType()
], PlaylistMutateArgs);
exports.PlaylistMutateArgs = PlaylistMutateArgs;
let PlaylistFilterArgs = class PlaylistFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], PlaylistFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Playlist' }),
    __metadata("design:type", String)
], PlaylistFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Comment', example: 'Awesome Comment' }),
    __metadata("design:type", String)
], PlaylistFilterArgs.prototype, "comment", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true }),
    __metadata("design:type", Array)
], PlaylistFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], PlaylistFilterArgs.prototype, "userIDs", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by isPublic Flag', example: true }),
    __metadata("design:type", Boolean)
], PlaylistFilterArgs.prototype, "isPublic", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by since Playlist duration', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistFilterArgs.prototype, "durationFrom", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by until Playlist duration', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistFilterArgs.prototype, "durationTo", void 0);
PlaylistFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], PlaylistFilterArgs);
exports.PlaylistFilterArgs = PlaylistFilterArgs;
let PlaylistFilterArgsQL = class PlaylistFilterArgsQL extends PlaylistFilterArgs {
};
PlaylistFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], PlaylistFilterArgsQL);
exports.PlaylistFilterArgsQL = PlaylistFilterArgsQL;
let PlaylistOrderArgs = class PlaylistOrderArgs extends base_args_1.DefaultOrderArgs {
};
PlaylistOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], PlaylistOrderArgs);
exports.PlaylistOrderArgs = PlaylistOrderArgs;
let PlaylistOrderArgsQL = class PlaylistOrderArgsQL extends PlaylistOrderArgs {
};
PlaylistOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], PlaylistOrderArgsQL);
exports.PlaylistOrderArgsQL = PlaylistOrderArgsQL;
let PlaylistIndexArgs = class PlaylistIndexArgs extends base_args_1.FilterArgs(PlaylistFilterArgsQL) {
};
PlaylistIndexArgs = __decorate([
    type_graphql_1.ArgsType()
], PlaylistIndexArgs);
exports.PlaylistIndexArgs = PlaylistIndexArgs;
let PlaylistPageArgsQL = class PlaylistPageArgsQL extends base_args_1.PaginatedFilterArgs(PlaylistFilterArgsQL, PlaylistOrderArgsQL) {
};
PlaylistPageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], PlaylistPageArgsQL);
exports.PlaylistPageArgsQL = PlaylistPageArgsQL;
let PlaylistsArgs = class PlaylistsArgs extends PlaylistPageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], PlaylistsArgs.prototype, "list", void 0);
PlaylistsArgs = __decorate([
    type_graphql_1.ArgsType()
], PlaylistsArgs);
exports.PlaylistsArgs = PlaylistsArgs;
//# sourceMappingURL=playlist.args.js.map