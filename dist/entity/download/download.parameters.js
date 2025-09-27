var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DownloadFormatType } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let DownloadParameters = class DownloadParameters {
};
__decorate([
    ObjectField(() => DownloadFormatType, { nullable: true, description: 'format of download stream', defaultValue: DownloadFormatType.zip, example: DownloadFormatType.zip }),
    __metadata("design:type", String)
], DownloadParameters.prototype, "format", void 0);
DownloadParameters = __decorate([
    ObjectParametersType()
], DownloadParameters);
export { DownloadParameters };
//# sourceMappingURL=download.parameters.js.map