var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ResultType } from '../../modules/rest/decorators';
let ExtendedInfo = class ExtendedInfo {
};
__decorate([
    ObjField({ description: 'Description', example: 'Very long Meta Information' }),
    __metadata("design:type", String)
], ExtendedInfo.prototype, "description", void 0);
__decorate([
    ObjField({ description: 'Source of the Description', example: 'https://mediaservice.example.com' }),
    __metadata("design:type", String)
], ExtendedInfo.prototype, "source", void 0);
__decorate([
    ObjField({ description: 'License of the Description', example: 'CC0' }),
    __metadata("design:type", String)
], ExtendedInfo.prototype, "license", void 0);
__decorate([
    ObjField({ description: 'Url of the Description', example: 'https://mediaservice.example.com/info/id/12345' }),
    __metadata("design:type", String)
], ExtendedInfo.prototype, "url", void 0);
__decorate([
    ObjField({ description: 'Url of the License', example: 'https://creativecommons.org/share-your-work/public-domain/cc0/' }),
    __metadata("design:type", String)
], ExtendedInfo.prototype, "licenseUrl", void 0);
ExtendedInfo = __decorate([
    ResultType({ description: 'Track/Folder/Artist/Album Info Data' })
], ExtendedInfo);
export { ExtendedInfo };
let ExtendedInfoResult = class ExtendedInfoResult {
};
__decorate([
    ObjField(() => ExtendedInfo, { nullable: true, description: 'Extended Info' }),
    __metadata("design:type", ExtendedInfo)
], ExtendedInfoResult.prototype, "info", void 0);
ExtendedInfoResult = __decorate([
    ResultType({ description: 'Extended Info Result' })
], ExtendedInfoResult);
export { ExtendedInfoResult };
let MetaDataResult = class MetaDataResult {
};
__decorate([
    ObjField(() => Object, { nullable: true, description: 'MetaData' }),
    __metadata("design:type", Object)
], MetaDataResult.prototype, "data", void 0);
MetaDataResult = __decorate([
    ResultType({ description: 'Metadata Result' })
], MetaDataResult);
export { MetaDataResult };
//# sourceMappingURL=metadata.model.js.map