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
exports.ArtworkPage = exports.Artwork = exports.ArtworkBase = void 0;
const base_model_1 = require("../base/base.model");
const enums_1 = require("../../types/enums");
const decorators_1 = require("../../modules/rest/decorators");
const folder_model_1 = require("../folder/folder.model");
let ArtworkBase = class ArtworkBase extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField(() => [enums_1.ArtworkImageType], { description: 'Artwork Image Type', example: [enums_1.ArtworkImageType.front] }),
    __metadata("design:type", Array)
], ArtworkBase.prototype, "types", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Image Height', min: 0, example: 500 }),
    __metadata("design:type", Number)
], ArtworkBase.prototype, "height", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Image Width', min: 0, example: 500 }),
    __metadata("design:type", Number)
], ArtworkBase.prototype, "width", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Image Format', example: 'png' }),
    __metadata("design:type", String)
], ArtworkBase.prototype, "format", void 0);
__decorate([
    decorators_1.ObjField({ description: 'File Size', min: 0, example: 500 }),
    __metadata("design:type", Number)
], ArtworkBase.prototype, "size", void 0);
ArtworkBase = __decorate([
    decorators_1.ResultType({ description: 'Artwork' })
], ArtworkBase);
exports.ArtworkBase = ArtworkBase;
let Artwork = class Artwork extends ArtworkBase {
};
__decorate([
    decorators_1.ObjField(() => folder_model_1.FolderBase, { nullable: true, description: 'Artwork Folder' }),
    __metadata("design:type", folder_model_1.FolderBase)
], Artwork.prototype, "folder", void 0);
Artwork = __decorate([
    decorators_1.ResultType({ description: 'Artwork with Folder' })
], Artwork);
exports.Artwork = Artwork;
let ArtworkPage = class ArtworkPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Artwork, { description: 'List of Artworks' }),
    __metadata("design:type", Array)
], ArtworkPage.prototype, "items", void 0);
ArtworkPage = __decorate([
    decorators_1.ResultType({ description: 'Artwork Page' })
], ArtworkPage);
exports.ArtworkPage = ArtworkPage;
//# sourceMappingURL=artwork.model.js.map