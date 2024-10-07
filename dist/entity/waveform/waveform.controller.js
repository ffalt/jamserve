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
import { UserRole, WaveformFormatType } from '../../types/enums.js';
import fse from 'fs-extra';
import { WaveformArgs, WaveformSVGArgs } from './waveform.args.js';
import { WaveFormData } from './waveform.model.js';
import { ApiWaveformTypes } from '../../types/consts.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { GenericError, NotFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { PathParam } from '../../modules/rest/decorators/PathParam.js';
import { PathParams } from '../../modules/rest/decorators/PathParams.js';
let WaveformController = class WaveformController {
    async json(id, { orm, engine }) {
        const result = await orm.findInWaveformTypes(id);
        if (!result) {
            return Promise.reject(NotFoundError());
        }
        const bin = await engine.waveform.getWaveform(result.obj, result.objType, WaveformFormatType.json);
        if (bin.json) {
            return bin.json;
        }
        if (bin.buffer) {
            return JSON.parse(bin.buffer.buffer.toString());
        }
        if (bin.file) {
            return JSON.parse((await fse.readFile(bin.file.filename)).toString());
        }
        return Promise.reject(GenericError('Error on Waveform generation'));
    }
    async svg(args, { orm, engine }) {
        const result = await orm.findInWaveformTypes(args.id);
        if (!result) {
            return Promise.reject(NotFoundError());
        }
        const bin = await engine.waveform.getWaveform(result.obj, result.objType, WaveformFormatType.svg, args.width);
        if (bin.buffer) {
            return bin.buffer.buffer.toString();
        }
        if (bin.file) {
            return (await fse.readFile(bin.file.filename)).toString();
        }
        return Promise.reject(GenericError('Error on Waveform generation'));
    }
    async waveform(id, waveformArgs, { orm, engine }) {
        const result = await orm.findInWaveformTypes(id);
        if (!result) {
            return Promise.reject(NotFoundError());
        }
        return engine.waveform.getWaveform(result.obj, result.objType, waveformArgs.format, waveformArgs.width);
    }
};
__decorate([
    Get('/json', () => WaveFormData, { description: 'Get Peaks Waveform Data as JSON [Episode, Track]', summary: 'Get JSON' }),
    __param(0, QueryParam('id', { description: 'Object Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WaveformController.prototype, "json", null);
__decorate([
    Get('/svg', () => String, {
        description: 'Get Peaks Waveform Data as SVG [Episode, Track]', summary: 'Get SVG',
        responseStringMimeTypes: ['image/svg+xml']
    }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WaveformSVGArgs, Object]),
    __metadata("design:returntype", Promise)
], WaveformController.prototype, "svg", null);
__decorate([
    Get('/{id}_{width}.{format}', {
        description: 'Get Peaks Waveform Data [Episode, Track]', summary: 'Get Waveform',
        binary: ApiWaveformTypes,
        customPathParameters: {
            regex: /(.*?)(_.*?)?(\..*)?$/,
            groups: [
                { name: 'id', getType: () => String },
                { name: 'width', getType: () => Number, prefix: '_', min: 100, max: 4000 },
                { name: 'format', getType: () => WaveformFormatType, prefix: '.' }
            ]
        },
        aliasRoutes: [
            { route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['width'] },
            { route: '/{id}', name: 'by Id', hideParameters: ['width', 'format'] }
        ]
    }),
    __param(0, PathParam('id', { description: 'Media Id', isID: true })),
    __param(1, PathParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, WaveformArgs, Object]),
    __metadata("design:returntype", Promise)
], WaveformController.prototype, "waveform", null);
WaveformController = __decorate([
    Controller('/waveform', { tags: ['Waveform'], roles: [UserRole.stream] })
], WaveformController);
export { WaveformController };
//# sourceMappingURL=waveform.controller.js.map