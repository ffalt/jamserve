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
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let WaveformArgs = class WaveformArgs {
};
__decorate([
    ObjField(() => WaveformFormatType, { nullable: true, description: 'format of the waveform', example: WaveformFormatType.svg }),
    __metadata("design:type", String)
], WaveformArgs.prototype, "format", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300 }),
    __metadata("design:type", Number)
], WaveformArgs.prototype, "width", void 0);
WaveformArgs = __decorate([
    ObjParamsType()
], WaveformArgs);
export { WaveformArgs };
let WaveformSVGArgs = class WaveformSVGArgs {
};
__decorate([
    ObjField({ description: 'Object Id' }),
    __metadata("design:type", String)
], WaveformSVGArgs.prototype, "id", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300 }),
    __metadata("design:type", Number)
], WaveformSVGArgs.prototype, "width", void 0);
WaveformSVGArgs = __decorate([
    ObjParamsType()
], WaveformSVGArgs);
export { WaveformSVGArgs };
//# sourceMappingURL=waveform.args.js.map