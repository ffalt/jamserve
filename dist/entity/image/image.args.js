var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ObjParamsType } from '../../modules/rest/index.js';
import { ImageFormatType } from '../../types/enums.js';
let ImageSizeArgs = class ImageSizeArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'size of the image', example: 300, min: 16, max: 1024 }),
    __metadata("design:type", Number)
], ImageSizeArgs.prototype, "size", void 0);
ImageSizeArgs = __decorate([
    ObjParamsType()
], ImageSizeArgs);
export { ImageSizeArgs };
let ImageArgs = class ImageArgs extends ImageSizeArgs {
};
__decorate([
    ObjField({ description: 'Object Id', isID: true }),
    __metadata("design:type", String)
], ImageArgs.prototype, "id", void 0);
__decorate([
    ObjField(() => ImageFormatType, { nullable: true, description: 'format of the image', example: ImageFormatType.png }),
    __metadata("design:type", String)
], ImageArgs.prototype, "format", void 0);
ImageArgs = __decorate([
    ObjParamsType()
], ImageArgs);
export { ImageArgs };
let ImageFormatArgs = class ImageFormatArgs {
};
__decorate([
    ObjField(() => ImageFormatType, { nullable: true, description: 'format of the image', example: ImageFormatType.png }),
    __metadata("design:type", String)
], ImageFormatArgs.prototype, "format", void 0);
ImageFormatArgs = __decorate([
    ObjParamsType()
], ImageFormatArgs);
export { ImageFormatArgs };
//# sourceMappingURL=image.args.js.map