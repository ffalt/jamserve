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
exports.WaveformSVGArgs = exports.WaveformArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
let WaveformArgs = class WaveformArgs {
};
__decorate([
    decorators_1.ObjField(() => enums_1.WaveformFormatType, { nullable: true, description: 'format of the waveform', example: enums_1.WaveformFormatType.svg }),
    __metadata("design:type", String)
], WaveformArgs.prototype, "format", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300 }),
    __metadata("design:type", Number)
], WaveformArgs.prototype, "width", void 0);
WaveformArgs = __decorate([
    decorators_1.ObjParamsType()
], WaveformArgs);
exports.WaveformArgs = WaveformArgs;
let WaveformSVGArgs = class WaveformSVGArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Object Id' }),
    __metadata("design:type", String)
], WaveformSVGArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300 }),
    __metadata("design:type", Number)
], WaveformSVGArgs.prototype, "width", void 0);
WaveformSVGArgs = __decorate([
    decorators_1.ObjParamsType()
], WaveformSVGArgs);
exports.WaveformSVGArgs = WaveformSVGArgs;
//# sourceMappingURL=waveform.args.js.map