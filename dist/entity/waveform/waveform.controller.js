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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveformController = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const builder_1 = require("../../modules/rest/builder");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const decorators_1 = require("../../modules/rest/decorators");
const fs_extra_1 = __importDefault(require("fs-extra"));
const waveform_args_1 = require("./waveform.args");
const waveform_service_1 = require("./waveform.service");
const waveform_model_1 = require("./waveform.model");
const consts_1 = require("../../types/consts");
let WaveformController = class WaveformController {
    async json(id) {
        const result = await this.waveformService.findInWaveformTypes(id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        const bin = await this.waveformService.getWaveform(result.obj, result.objType, enums_1.WaveformFormatType.json);
        if (bin.json) {
            return bin.json;
        }
        if (bin.buffer) {
            return JSON.parse(bin.buffer.buffer.toString());
        }
        if (bin.file) {
            return JSON.parse((await fs_extra_1.default.readFile(bin.file.filename)).toString());
        }
        return Promise.reject(Error('Error on Waveform generation'));
    }
    async svg(args) {
        const result = await this.waveformService.findInWaveformTypes(args.id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        const bin = await this.waveformService.getWaveform(result.obj, result.objType, enums_1.WaveformFormatType.svg, args.width);
        if (bin.buffer) {
            return bin.buffer.buffer.toString();
        }
        if (bin.file) {
            return (await fs_extra_1.default.readFile(bin.file.filename)).toString();
        }
        return Promise.reject(Error('Error on Waveform generation'));
    }
    async waveform(id, waveformArgs) {
        const result = await this.waveformService.findInWaveformTypes(id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        return this.waveformService.getWaveform(result.obj, result.objType, waveformArgs.format, waveformArgs.width);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], WaveformController.prototype, "orm", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", waveform_service_1.WaveformService)
], WaveformController.prototype, "waveformService", void 0);
__decorate([
    rest_1.Get('/json', () => waveform_model_1.WaveFormData, { description: 'Get Peaks Waveform Data as JSON [Episode, Track]', summary: 'Get JSON' }),
    __param(0, rest_1.QueryParam('id', { description: 'Object Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WaveformController.prototype, "json", null);
__decorate([
    rest_1.Get('/svg', () => String, {
        description: 'Get Peaks Waveform Data as SVG [Episode, Track]', summary: 'Get SVG',
        responseStringMimeTypes: ['image/svg+xml']
    }),
    __param(0, decorators_1.QueryParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [waveform_args_1.WaveformSVGArgs]),
    __metadata("design:returntype", Promise)
], WaveformController.prototype, "svg", null);
__decorate([
    rest_1.Get('/{id}_{width}.{format}', {
        description: 'Get Peaks Waveform Data [Episode, Track]', summary: 'Get Waveform',
        binary: consts_1.ApiWaveformTypes,
        customPathParameters: {
            regex: /(.*?)(_.*?)?(\..*)?$/,
            groups: [
                { name: 'id', getType: () => String },
                { name: 'width', getType: () => Number, prefix: '_', min: 100, max: 4000 },
                { name: 'format', getType: () => enums_1.WaveformFormatType, prefix: '.' }
            ]
        },
        aliasRoutes: [
            { route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['width'] },
            { route: '/{id}', name: 'by Id', hideParameters: ['width', 'format'] }
        ]
    }),
    __param(0, decorators_1.PathParam('id', { description: 'Media Id', isID: true })),
    __param(1, decorators_1.PathParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, waveform_args_1.WaveformArgs]),
    __metadata("design:returntype", Promise)
], WaveformController.prototype, "waveform", null);
WaveformController = __decorate([
    rest_1.Controller('/waveform', { tags: ['Waveform'], roles: [enums_1.UserRole.stream] })
], WaveformController);
exports.WaveformController = WaveformController;
//# sourceMappingURL=waveform.controller.js.map