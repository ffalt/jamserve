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
exports.StreamArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
let StreamArgs = class StreamArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'maximal bitrate if transcoding (in Kbps)', min: 10, max: 480, example: 128 }),
    __metadata("design:type", Number)
], StreamArgs.prototype, "maxBitRate", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.AudioFormatType, { nullable: true, description: 'format of the audio', example: enums_1.AudioFormatType.mp3 }),
    __metadata("design:type", String)
], StreamArgs.prototype, "format", void 0);
StreamArgs = __decorate([
    decorators_1.ObjParamsType()
], StreamArgs);
exports.StreamArgs = StreamArgs;
//# sourceMappingURL=stream.args.js.map