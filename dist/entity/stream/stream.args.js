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
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let StreamPathArgs = class StreamPathArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'maximal bitrate if transcoding (in Kbps)', min: 10, max: 480, example: 128 }),
    __metadata("design:type", Number)
], StreamPathArgs.prototype, "maxBitRate", void 0);
__decorate([
    ObjField(() => AudioFormatType, { nullable: true, description: 'format of the audio', example: AudioFormatType.mp3 }),
    __metadata("design:type", String)
], StreamPathArgs.prototype, "format", void 0);
StreamPathArgs = __decorate([
    ObjParamsType()
], StreamPathArgs);
export { StreamPathArgs };
let StreamParamArgs = class StreamParamArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'start offset for transcoding/streaming', min: 0, example: 128 }),
    __metadata("design:type", Number)
], StreamParamArgs.prototype, "timeOffset", void 0);
StreamParamArgs = __decorate([
    ObjParamsType()
], StreamParamArgs);
export { StreamParamArgs };
//# sourceMappingURL=stream.args.js.map