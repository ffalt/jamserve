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
exports.DownloadArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
let DownloadArgs = class DownloadArgs {
};
__decorate([
    decorators_1.ObjField(() => enums_1.DownloadFormatType, { nullable: true, description: 'format of download stream', defaultValue: enums_1.DownloadFormatType.zip, example: enums_1.DownloadFormatType.zip }),
    __metadata("design:type", String)
], DownloadArgs.prototype, "format", void 0);
DownloadArgs = __decorate([
    decorators_1.ObjParamsType()
], DownloadArgs);
exports.DownloadArgs = DownloadArgs;
//# sourceMappingURL=download.args.js.map