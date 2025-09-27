var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Base, Page } from '../base/base.model.js';
import { ArtworkImageType } from '../../types/enums.js';
import { FolderBase } from '../folder/folder-base.model.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
let ArtworkBase = class ArtworkBase extends Base {
};
__decorate([
    ObjectField(() => [ArtworkImageType], { description: 'Artwork Image Type', example: [ArtworkImageType.front] }),
    __metadata("design:type", Array)
], ArtworkBase.prototype, "types", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Image Height', min: 0, example: 500 }),
    __metadata("design:type", Number)
], ArtworkBase.prototype, "height", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Image Width', min: 0, example: 500 }),
    __metadata("design:type", Number)
], ArtworkBase.prototype, "width", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Image Format', example: 'png' }),
    __metadata("design:type", String)
], ArtworkBase.prototype, "format", void 0);
__decorate([
    ObjectField({ description: 'File Size', min: 0, example: 500 }),
    __metadata("design:type", Number)
], ArtworkBase.prototype, "size", void 0);
ArtworkBase = __decorate([
    ResultType({ description: 'Artwork' })
], ArtworkBase);
export { ArtworkBase };
let Artwork = class Artwork extends ArtworkBase {
};
__decorate([
    ObjectField(() => FolderBase, { nullable: true, description: 'Artwork Folder' }),
    __metadata("design:type", FolderBase)
], Artwork.prototype, "folder", void 0);
Artwork = __decorate([
    ResultType({ description: 'Artwork with Folder' })
], Artwork);
export { Artwork };
let ArtworkPage = class ArtworkPage extends Page {
};
__decorate([
    ObjectField(() => Artwork, { description: 'List of Artworks' }),
    __metadata("design:type", Array)
], ArtworkPage.prototype, "items", void 0);
ArtworkPage = __decorate([
    ResultType({ description: 'Artwork Page' })
], ArtworkPage);
export { ArtworkPage };
//# sourceMappingURL=artwork.model.js.map