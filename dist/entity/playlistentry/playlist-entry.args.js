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
exports.PlaylistEntryFilterArgs = exports.PlaylistEntryOrderArgsQL = exports.PlaylistEntryOrderArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const base_args_1 = require("../base/base.args");
const type_graphql_1 = require("type-graphql");
let PlaylistEntryOrderArgs = class PlaylistEntryOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    decorators_1.ObjField(() => enums_1.PlaylistEntryOrderFields, { nullable: true, description: 'order by field' }),
    type_graphql_1.Field(() => enums_1.PlaylistEntryOrderFields, { nullable: true }),
    __metadata("design:type", String)
], PlaylistEntryOrderArgs.prototype, "orderBy", void 0);
PlaylistEntryOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], PlaylistEntryOrderArgs);
exports.PlaylistEntryOrderArgs = PlaylistEntryOrderArgs;
let PlaylistEntryOrderArgsQL = class PlaylistEntryOrderArgsQL extends PlaylistEntryOrderArgs {
};
PlaylistEntryOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], PlaylistEntryOrderArgsQL);
exports.PlaylistEntryOrderArgsQL = PlaylistEntryOrderArgsQL;
let PlaylistEntryFilterArgs = class PlaylistEntryFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true }),
    __metadata("design:type", Array)
], PlaylistEntryFilterArgs.prototype, "playlistIDs", void 0);
PlaylistEntryFilterArgs = __decorate([
    decorators_1.ObjParamsType(),
    type_graphql_1.InputType()
], PlaylistEntryFilterArgs);
exports.PlaylistEntryFilterArgs = PlaylistEntryFilterArgs;
//# sourceMappingURL=playlist-entry.args.js.map