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
exports.ArtworksArgsQL = exports.ArtworkPageArgsQL = exports.ArtworkFilterArgsQL = exports.ArtworkFilterArgs = exports.ArtworkOrderArgsQL = exports.ArtworkOrderArgs = exports.ArtworkRenameArgs = exports.ArtworkNewArgs = exports.ArtworkNewUploadArgs = exports.IncludesArtworkChildrenArgs = exports.IncludesArtworkArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesArtworkArgs = class IncludesArtworkArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include state (fav,rate) on artwork(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtworkArgs.prototype, "artworkIncState", void 0);
IncludesArtworkArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesArtworkArgs);
exports.IncludesArtworkArgs = IncludesArtworkArgs;
let IncludesArtworkChildrenArgs = class IncludesArtworkChildrenArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include folder on artwork(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtworkChildrenArgs.prototype, "artworkIncFolder", void 0);
IncludesArtworkChildrenArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesArtworkChildrenArgs);
exports.IncludesArtworkChildrenArgs = IncludesArtworkChildrenArgs;
let ArtworkNewUploadArgs = class ArtworkNewUploadArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Folder Id', isID: true }),
    __metadata("design:type", String)
], ArtworkNewUploadArgs.prototype, "folderID", void 0);
__decorate([
    decorators_1.ObjField(() => [enums_1.ArtworkImageType], { description: 'Types of the image' }),
    __metadata("design:type", Array)
], ArtworkNewUploadArgs.prototype, "types", void 0);
ArtworkNewUploadArgs = __decorate([
    decorators_1.ObjParamsType()
], ArtworkNewUploadArgs);
exports.ArtworkNewUploadArgs = ArtworkNewUploadArgs;
let ArtworkNewArgs = class ArtworkNewArgs extends ArtworkNewUploadArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'URL of an image' }),
    __metadata("design:type", String)
], ArtworkNewArgs.prototype, "url", void 0);
ArtworkNewArgs = __decorate([
    decorators_1.ObjParamsType()
], ArtworkNewArgs);
exports.ArtworkNewArgs = ArtworkNewArgs;
let ArtworkRenameArgs = class ArtworkRenameArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Artwork Id' }),
    __metadata("design:type", String)
], ArtworkRenameArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'New Image Filename' }),
    __metadata("design:type", String)
], ArtworkRenameArgs.prototype, "newName", void 0);
ArtworkRenameArgs = __decorate([
    decorators_1.ObjParamsType()
], ArtworkRenameArgs);
exports.ArtworkRenameArgs = ArtworkRenameArgs;
let ArtworkOrderArgs = class ArtworkOrderArgs extends base_args_1.DefaultOrderArgs {
};
ArtworkOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], ArtworkOrderArgs);
exports.ArtworkOrderArgs = ArtworkOrderArgs;
let ArtworkOrderArgsQL = class ArtworkOrderArgsQL extends ArtworkOrderArgs {
};
ArtworkOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], ArtworkOrderArgsQL);
exports.ArtworkOrderArgsQL = ArtworkOrderArgsQL;
let ArtworkFilterArgs = class ArtworkFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'cover' }),
    __metadata("design:type", String)
], ArtworkFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Artist Name', example: 'Cover.png' }),
    __metadata("design:type", String)
], ArtworkFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artwork Ids', isID: true }),
    __metadata("design:type", Array)
], ArtworkFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artwork Image Formats', example: ['png'] }),
    __metadata("design:type", Array)
], ArtworkFilterArgs.prototype, "formats", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], ArtworkFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter if artwork is in folder id (or its child folders)', isID: true }),
    __metadata("design:type", String)
], ArtworkFilterArgs.prototype, "childOfID", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.ArtworkImageType], { nullable: true }),
    decorators_1.ObjField(() => [enums_1.ArtworkImageType], { nullable: true, description: 'filter by Artwork Image Types', example: enums_1.ArtworkImageType.front }),
    __metadata("design:type", Array)
], ArtworkFilterArgs.prototype, "types", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by since size', min: 0, example: 100 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "sizeFrom", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by until size', min: 0, example: 200 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "sizeTo", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by since width', min: 0, example: 100 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "widthFrom", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by until width', min: 0, example: 200 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "widthTo", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by since height', min: 0, example: 100 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "heightFrom", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by until height', min: 0, example: 200 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "heightTo", void 0);
ArtworkFilterArgs = __decorate([
    decorators_1.ObjParamsType(),
    type_graphql_1.InputType()
], ArtworkFilterArgs);
exports.ArtworkFilterArgs = ArtworkFilterArgs;
let ArtworkFilterArgsQL = class ArtworkFilterArgsQL extends ArtworkFilterArgs {
};
ArtworkFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], ArtworkFilterArgsQL);
exports.ArtworkFilterArgsQL = ArtworkFilterArgsQL;
let ArtworkPageArgsQL = class ArtworkPageArgsQL extends base_args_1.PaginatedFilterArgs(ArtworkFilterArgsQL, ArtworkOrderArgsQL) {
};
ArtworkPageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], ArtworkPageArgsQL);
exports.ArtworkPageArgsQL = ArtworkPageArgsQL;
let ArtworksArgsQL = class ArtworksArgsQL extends ArtworkPageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], ArtworksArgsQL.prototype, "list", void 0);
ArtworksArgsQL = __decorate([
    type_graphql_1.ArgsType()
], ArtworksArgsQL);
exports.ArtworksArgsQL = ArtworksArgsQL;
//# sourceMappingURL=artwork.args.js.map