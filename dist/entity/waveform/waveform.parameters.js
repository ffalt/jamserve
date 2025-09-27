var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WaveformFormatType } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let WaveformParameters = class WaveformParameters {
};
__decorate([
    ObjectField(() => WaveformFormatType, { nullable: true, description: 'format of the waveform', example: WaveformFormatType.svg }),
    __metadata("design:type", String)
], WaveformParameters.prototype, "format", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300 }),
    __metadata("design:type", Number)
], WaveformParameters.prototype, "width", void 0);
WaveformParameters = __decorate([
    ObjectParametersType()
], WaveformParameters);
export { WaveformParameters };
let WaveformSVGParameters = class WaveformSVGParameters {
};
__decorate([
    ObjectField({ description: 'Object Id' }),
    __metadata("design:type", String)
], WaveformSVGParameters.prototype, "id", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300 }),
    __metadata("design:type", Number)
], WaveformSVGParameters.prototype, "width", void 0);
WaveformSVGParameters = __decorate([
    ObjectParametersType()
], WaveformSVGParameters);
export { WaveformSVGParameters };
//# sourceMappingURL=waveform.parameters.js.map