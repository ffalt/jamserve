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
exports.RootsArgs = exports.RootOrderArgsQL = exports.RootOrderArgs = exports.RootFilterArgsQL = exports.RootFilterArgs = exports.RootRefreshArgs = exports.RootMutateArgs = exports.IncludesRootArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
let IncludesRootArgs = class IncludesRootArgs {
};
IncludesRootArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesRootArgs);
exports.IncludesRootArgs = IncludesRootArgs;
let RootMutateArgs = class RootMutateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Root Name', example: 'Compilations' }),
    __metadata("design:type", String)
], RootMutateArgs.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Absolute Path for Root ', example: '/var/media/compilations' }),
    __metadata("design:type", String)
], RootMutateArgs.prototype, "path", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.RootScanStrategy, { description: 'Scan Strategy', example: enums_1.RootScanStrategy.compilation }),
    __metadata("design:type", String)
], RootMutateArgs.prototype, "strategy", void 0);
RootMutateArgs = __decorate([
    decorators_1.ObjParamsType()
], RootMutateArgs);
exports.RootMutateArgs = RootMutateArgs;
let RootRefreshArgs = class RootRefreshArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Root ID to refresh (empty for refreshing all)', isID: true }),
    __metadata("design:type", String)
], RootRefreshArgs.prototype, "id", void 0);
RootRefreshArgs = __decorate([
    decorators_1.ObjParamsType()
], RootRefreshArgs);
exports.RootRefreshArgs = RootRefreshArgs;
let RootFilterArgs = class RootFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'compilations' }),
    __metadata("design:type", String)
], RootFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Artist Name', example: 'Compilations' }),
    __metadata("design:type", String)
], RootFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], RootFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.RootScanStrategy]),
    decorators_1.ObjField(() => [enums_1.RootScanStrategy], { nullable: true, description: 'filter by Scan Strategy', example: [enums_1.RootScanStrategy.auto] }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "strategies", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "seriesIDs", void 0);
RootFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], RootFilterArgs);
exports.RootFilterArgs = RootFilterArgs;
let RootFilterArgsQL = class RootFilterArgsQL extends RootFilterArgs {
};
RootFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], RootFilterArgsQL);
exports.RootFilterArgsQL = RootFilterArgsQL;
let RootOrderArgs = class RootOrderArgs extends base_args_1.DefaultOrderArgs {
};
RootOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], RootOrderArgs);
exports.RootOrderArgs = RootOrderArgs;
let RootOrderArgsQL = class RootOrderArgsQL extends RootOrderArgs {
};
RootOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], RootOrderArgsQL);
exports.RootOrderArgsQL = RootOrderArgsQL;
let RootsArgs = class RootsArgs extends base_args_1.PaginatedFilterArgs(RootFilterArgsQL, RootOrderArgsQL) {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], RootsArgs.prototype, "list", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RootsArgs.prototype, "seed", void 0);
RootsArgs = __decorate([
    type_graphql_1.ArgsType()
], RootsArgs);
exports.RootsArgs = RootsArgs;
//# sourceMappingURL=root.args.js.map