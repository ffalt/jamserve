var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ResultType } from '../../modules/rest/index.js';
let WaveFormData = class WaveFormData {
};
__decorate([
    ObjField({ description: 'The version number of the waveform data format', min: 1 }),
    __metadata("design:type", Number)
], WaveFormData.prototype, "version", void 0);
__decorate([
    ObjField({ nullable: true, description: 'The number of waveform channels present (version 2 only)', min: 0 }),
    __metadata("design:type", Number)
], WaveFormData.prototype, "channels", void 0);
__decorate([
    ObjField({ description: 'Sample rate of original audio file (Hz)', min: 0 }),
    __metadata("design:type", Number)
], WaveFormData.prototype, "sample_rate", void 0);
__decorate([
    ObjField({ description: 'Number of audio samples per waveform minimum/maximum pair', min: 0 }),
    __metadata("design:type", Number)
], WaveFormData.prototype, "samples_per_pixel", void 0);
__decorate([
    ObjField({ description: 'Resolution of waveform data. May be either 8 or 16', min: 0 }),
    __metadata("design:type", Number)
], WaveFormData.prototype, "bits", void 0);
__decorate([
    ObjField({ description: 'Length of waveform data (number of minimum and maximum value pairs per channel)', min: 0 }),
    __metadata("design:type", Number)
], WaveFormData.prototype, "length", void 0);
__decorate([
    ObjField(() => [Number], { description: 'Array of minimum and maximum waveform data points, interleaved. Depending on bits, each value may be in the range -128 to +127 or -32768 to +32727' }),
    __metadata("design:type", Array)
], WaveFormData.prototype, "data", void 0);
WaveFormData = __decorate([
    ResultType({ description: 'WaveForm Data' })
], WaveFormData);
export { WaveFormData };
//# sourceMappingURL=waveform.model.js.map