var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ObjParamsType } from '../../modules/rest/decorators';
import { ArtworkImageType, ListType } from '../../types/enums';
import { ArgsType, Field, Float, ID, InputType, Int } from 'type-graphql';
import { DefaultOrderArgs, PaginatedFilterArgs } from '../base/base.args';
import { examples } from '../../modules/engine/rest/example.consts';
let IncludesArtworkArgs = class IncludesArtworkArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include state (fav,rate) on artwork(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtworkArgs.prototype, "artworkIncState", void 0);
IncludesArtworkArgs = __decorate([
    ObjParamsType()
], IncludesArtworkArgs);
export { IncludesArtworkArgs };
let IncludesArtworkChildrenArgs = class IncludesArtworkChildrenArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include folder on artwork(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtworkChildrenArgs.prototype, "artworkIncFolder", void 0);
IncludesArtworkChildrenArgs = __decorate([
    ObjParamsType()
], IncludesArtworkChildrenArgs);
export { IncludesArtworkChildrenArgs };
let ArtworkNewUploadArgs = class ArtworkNewUploadArgs {
};
__decorate([
    ObjField({ description: 'Folder Id', isID: true }),
    __metadata("design:type", String)
], ArtworkNewUploadArgs.prototype, "folderID", void 0);
__decorate([
    ObjField(() => [ArtworkImageType], { description: 'Types of the image' }),
    __metadata("design:type", Array)
], ArtworkNewUploadArgs.prototype, "types", void 0);
ArtworkNewUploadArgs = __decorate([
    ObjParamsType()
], ArtworkNewUploadArgs);
export { ArtworkNewUploadArgs };
let ArtworkNewArgs = class ArtworkNewArgs extends ArtworkNewUploadArgs {
};
__decorate([
    ObjField({ description: 'URL of an image' }),
    __metadata("design:type", String)
], ArtworkNewArgs.prototype, "url", void 0);
ArtworkNewArgs = __decorate([
    ObjParamsType()
], ArtworkNewArgs);
export { ArtworkNewArgs };
let ArtworkRenameArgs = class ArtworkRenameArgs {
};
__decorate([
    ObjField({ description: 'Artwork Id' }),
    __metadata("design:type", String)
], ArtworkRenameArgs.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'New Image Filename' }),
    __metadata("design:type", String)
], ArtworkRenameArgs.prototype, "newName", void 0);
ArtworkRenameArgs = __decorate([
    ObjParamsType()
], ArtworkRenameArgs);
export { ArtworkRenameArgs };
let ArtworkOrderArgs = class ArtworkOrderArgs extends DefaultOrderArgs {
};
ArtworkOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], ArtworkOrderArgs);
export { ArtworkOrderArgs };
let ArtworkOrderArgsQL = class ArtworkOrderArgsQL extends ArtworkOrderArgs {
};
ArtworkOrderArgsQL = __decorate([
    InputType()
], ArtworkOrderArgsQL);
export { ArtworkOrderArgsQL };
let ArtworkFilterArgs = class ArtworkFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'cover' }),
    __metadata("design:type", String)
], ArtworkFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Artist Name', example: 'Cover.png' }),
    __metadata("design:type", String)
], ArtworkFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artwork Ids', isID: true }),
    __metadata("design:type", Array)
], ArtworkFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artwork Image Formats', example: ['png'] }),
    __metadata("design:type", Array)
], ArtworkFilterArgs.prototype, "formats", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], ArtworkFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    ObjField({ nullable: true, description: 'filter if artwork is in folder id (or its child folders)', isID: true }),
    __metadata("design:type", String)
], ArtworkFilterArgs.prototype, "childOfID", void 0);
__decorate([
    Field(() => [ArtworkImageType], { nullable: true }),
    ObjField(() => [ArtworkImageType], { nullable: true, description: 'filter by Artwork Image Types', example: ArtworkImageType.front }),
    __metadata("design:type", Array)
], ArtworkFilterArgs.prototype, "types", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by since size', min: 0, example: 100 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "sizeFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by until size', min: 0, example: 200 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "sizeTo", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by since width', min: 0, example: 100 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "widthFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by until width', min: 0, example: 200 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "widthTo", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by since height', min: 0, example: 100 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "heightFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by until height', min: 0, example: 200 }),
    __metadata("design:type", Number)
], ArtworkFilterArgs.prototype, "heightTo", void 0);
ArtworkFilterArgs = __decorate([
    ObjParamsType(),
    InputType()
], ArtworkFilterArgs);
export { ArtworkFilterArgs };
let ArtworkFilterArgsQL = class ArtworkFilterArgsQL extends ArtworkFilterArgs {
};
ArtworkFilterArgsQL = __decorate([
    InputType()
], ArtworkFilterArgsQL);
export { ArtworkFilterArgsQL };
let ArtworkPageArgsQL = class ArtworkPageArgsQL extends PaginatedFilterArgs(ArtworkFilterArgsQL, ArtworkOrderArgsQL) {
};
ArtworkPageArgsQL = __decorate([
    ArgsType()
], ArtworkPageArgsQL);
export { ArtworkPageArgsQL };
let ArtworksArgsQL = class ArtworksArgsQL extends ArtworkPageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], ArtworksArgsQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ArtworksArgsQL.prototype, "seed", void 0);
ArtworksArgsQL = __decorate([
    ArgsType()
], ArtworksArgsQL);
export { ArtworksArgsQL };
//# sourceMappingURL=artwork.args.js.map