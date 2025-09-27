var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AudioFormatType } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let StreamPathParameters = class StreamPathParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'maximal bitrate if transcoding (in Kbps)', min: 10, max: 480, example: 128 }),
    __metadata("design:type", Number)
], StreamPathParameters.prototype, "maxBitRate", void 0);
__decorate([
    ObjectField(() => AudioFormatType, { nullable: true, description: 'format of the audio', example: AudioFormatType.mp3 }),
    __metadata("design:type", String)
], StreamPathParameters.prototype, "format", void 0);
StreamPathParameters = __decorate([
    ObjectParametersType()
], StreamPathParameters);
export { StreamPathParameters };
let StreamParameters = class StreamParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'start offset for transcoding/streaming', min: 0, example: 128 }),
    __metadata("design:type", Number)
], StreamParameters.prototype, "timeOffset", void 0);
StreamParameters = __decorate([
    ObjectParametersType()
], StreamParameters);
export { StreamParameters };
//# sourceMappingURL=stream.parameters.js.map