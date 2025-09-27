var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArtworkImageType, ListType } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { DefaultOrderParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesArtworkParameters = class IncludesArtworkParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include state (fav,rate) on artwork(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtworkParameters.prototype, "artworkIncState", void 0);
IncludesArtworkParameters = __decorate([
    ObjectParametersType()
], IncludesArtworkParameters);
export { IncludesArtworkParameters };
let IncludesArtworkChildrenParameters = class IncludesArtworkChildrenParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include folder on artwork(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtworkChildrenParameters.prototype, "artworkIncFolder", void 0);
IncludesArtworkChildrenParameters = __decorate([
    ObjectParametersType()
], IncludesArtworkChildrenParameters);
export { IncludesArtworkChildrenParameters };
let ArtworkNewUploadParameters = class ArtworkNewUploadParameters {
};
__decorate([
    ObjectField({ description: 'Folder Id', isID: true }),
    __metadata("design:type", String)
], ArtworkNewUploadParameters.prototype, "folderID", void 0);
__decorate([
    ObjectField(() => [ArtworkImageType], { description: 'Types of the image' }),
    __metadata("design:type", Array)
], ArtworkNewUploadParameters.prototype, "types", void 0);
ArtworkNewUploadParameters = __decorate([
    ObjectParametersType()
], ArtworkNewUploadParameters);
export { ArtworkNewUploadParameters };
let ArtworkNewParameters = class ArtworkNewParameters extends ArtworkNewUploadParameters {
};
__decorate([
    ObjectField({ description: 'URL of an image' }),
    __metadata("design:type", String)
], ArtworkNewParameters.prototype, "url", void 0);
ArtworkNewParameters = __decorate([
    ObjectParametersType()
], ArtworkNewParameters);
export { ArtworkNewParameters };
let ArtworkRenameParameters = class ArtworkRenameParameters {
};
__decorate([
    ObjectField({ description: 'Artwork Id' }),
    __metadata("design:type", String)
], ArtworkRenameParameters.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'New Image Filename' }),
    __metadata("design:type", String)
], ArtworkRenameParameters.prototype, "newName", void 0);
ArtworkRenameParameters = __decorate([
    ObjectParametersType()
], ArtworkRenameParameters);
export { ArtworkRenameParameters };
let ArtworkOrderParameters = class ArtworkOrderParameters extends DefaultOrderParameters {
};
ArtworkOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], ArtworkOrderParameters);
export { ArtworkOrderParameters };
let ArtworkOrderParametersQL = class ArtworkOrderParametersQL extends ArtworkOrderParameters {
};
ArtworkOrderParametersQL = __decorate([
    InputType()
], ArtworkOrderParametersQL);
export { ArtworkOrderParametersQL };
let ArtworkFilterParameters = class ArtworkFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'cover' }),
    __metadata("design:type", String)
], ArtworkFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Artist Name', example: 'Cover.png' }),
    __metadata("design:type", String)
], ArtworkFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artwork Ids', isID: true }),
    __metadata("design:type", Array)
], ArtworkFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artwork Image Formats', example: ['png'] }),
    __metadata("design:type", Array)
], ArtworkFilterParameters.prototype, "formats", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], ArtworkFilterParameters.prototype, "folderIDs", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter if artwork is in folder id (or its child folders)', isID: true }),
    __metadata("design:type", String)
], ArtworkFilterParameters.prototype, "childOfID", void 0);
__decorate([
    Field(() => [ArtworkImageType], { nullable: true }),
    ObjectField(() => [ArtworkImageType], { nullable: true, description: 'filter by Artwork Image Types', example: ArtworkImageType.front }),
    __metadata("design:type", Array)
], ArtworkFilterParameters.prototype, "types", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], ArtworkFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by since size', min: 0, example: 100 }),
    __metadata("design:type", Number)
], ArtworkFilterParameters.prototype, "sizeFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by until size', min: 0, example: 200 }),
    __metadata("design:type", Number)
], ArtworkFilterParameters.prototype, "sizeTo", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by since width', min: 0, example: 100 }),
    __metadata("design:type", Number)
], ArtworkFilterParameters.prototype, "widthFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by until width', min: 0, example: 200 }),
    __metadata("design:type", Number)
], ArtworkFilterParameters.prototype, "widthTo", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by since height', min: 0, example: 100 }),
    __metadata("design:type", Number)
], ArtworkFilterParameters.prototype, "heightFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by until height', min: 0, example: 200 }),
    __metadata("design:type", Number)
], ArtworkFilterParameters.prototype, "heightTo", void 0);
ArtworkFilterParameters = __decorate([
    ObjectParametersType(),
    InputType()
], ArtworkFilterParameters);
export { ArtworkFilterParameters };
let ArtworkFilterParametersQL = class ArtworkFilterParametersQL extends ArtworkFilterParameters {
};
ArtworkFilterParametersQL = __decorate([
    InputType()
], ArtworkFilterParametersQL);
export { ArtworkFilterParametersQL };
let ArtworkPageParametersQL = class ArtworkPageParametersQL extends PaginatedFilterParameters(ArtworkFilterParametersQL, ArtworkOrderParametersQL) {
};
ArtworkPageParametersQL = __decorate([
    ArgsType()
], ArtworkPageParametersQL);
export { ArtworkPageParametersQL };
let ArtworksParametersQL = class ArtworksParametersQL extends ArtworkPageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], ArtworksParametersQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ArtworksParametersQL.prototype, "seed", void 0);
ArtworksParametersQL = __decorate([
    ArgsType()
], ArtworksParametersQL);
export { ArtworksParametersQL };
//# sourceMappingURL=artwork.parameters.js.map