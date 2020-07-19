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
exports.ImageFormatArgs = exports.ImageArgs = exports.ImageSizeArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
let ImageSizeArgs = class ImageSizeArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'size of the image', example: 300, min: 16, max: 1024 }),
    __metadata("design:type", Number)
], ImageSizeArgs.prototype, "size", void 0);
ImageSizeArgs = __decorate([
    decorators_1.ObjParamsType()
], ImageSizeArgs);
exports.ImageSizeArgs = ImageSizeArgs;
let ImageArgs = class ImageArgs extends ImageSizeArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Object Id', isID: true }),
    __metadata("design:type", String)
], ImageArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.ImageFormatType, { nullable: true, description: 'format of the image', example: enums_1.ImageFormatType.png }),
    __metadata("design:type", String)
], ImageArgs.prototype, "format", void 0);
ImageArgs = __decorate([
    decorators_1.ObjParamsType()
], ImageArgs);
exports.ImageArgs = ImageArgs;
let ImageFormatArgs = class ImageFormatArgs {
};
__decorate([
    decorators_1.ObjField(() => enums_1.ImageFormatType, { nullable: true, description: 'format of the image', example: enums_1.ImageFormatType.png }),
    __metadata("design:type", String)
], ImageFormatArgs.prototype, "format", void 0);
ImageFormatArgs = __decorate([
    decorators_1.ObjParamsType()
], ImageFormatArgs);
exports.ImageFormatArgs = ImageFormatArgs;
//# sourceMappingURL=image.args.js.map