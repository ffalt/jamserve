var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ImageFormatType } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let ImageSizeParameters = class ImageSizeParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'size of the image', example: 300, min: 16, max: 1024 }),
    __metadata("design:type", Number)
], ImageSizeParameters.prototype, "size", void 0);
ImageSizeParameters = __decorate([
    ObjectParametersType()
], ImageSizeParameters);
export { ImageSizeParameters };
let ImageParameters = class ImageParameters extends ImageSizeParameters {
};
__decorate([
    ObjectField({ description: 'Object Id', isID: true }),
    __metadata("design:type", String)
], ImageParameters.prototype, "id", void 0);
__decorate([
    ObjectField(() => ImageFormatType, { nullable: true, description: 'format of the image', example: ImageFormatType.png }),
    __metadata("design:type", String)
], ImageParameters.prototype, "format", void 0);
ImageParameters = __decorate([
    ObjectParametersType()
], ImageParameters);
export { ImageParameters };
let ImageFormatParameters = class ImageFormatParameters {
};
__decorate([
    ObjectField(() => ImageFormatType, { nullable: true, description: 'format of the image', example: ImageFormatType.png }),
    __metadata("design:type", String)
], ImageFormatParameters.prototype, "format", void 0);
ImageFormatParameters = __decorate([
    ObjectParametersType()
], ImageFormatParameters);
export { ImageFormatParameters };
//# sourceMappingURL=image.parameters.js.map