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
import { WaveformParameters, WaveformSVGParameters } from './waveform.parameters.js';
import { WaveFormData } from './waveform.model.js';
import { ApiWaveformTypes } from '../../types/consts.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { genericError, notFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { PathParameter } from '../../modules/rest/decorators/path-parameter.js';
import { PathParameters } from '../../modules/rest/decorators/path-parameters.js';
let WaveformController = class WaveformController {
    async json(id, { orm, engine }) {
        const result = await orm.findInWaveformTypes(id);
        if (!result) {
            return Promise.reject(notFoundError());
        }
        const bin = await engine.waveform.getWaveform(result.obj, result.objType, WaveformFormatType.json);
        if (bin.json) {
            return bin.json;
        }
        if (bin.buffer) {
            return JSON.parse(bin.buffer.buffer.toString());
        }
        if (bin.file) {
            const file = await fse.readFile(bin.file.filename);
            return JSON.parse(file.toString());
        }
        return Promise.reject(genericError('Error on Waveform generation'));
    }
    async svg(parameters, { orm, engine }) {
        const result = await orm.findInWaveformTypes(parameters.id);
        if (!result) {
            return Promise.reject(notFoundError());
        }
        const bin = await engine.waveform.getWaveform(result.obj, result.objType, WaveformFormatType.svg, parameters.width);
        if (bin.buffer) {
            return bin.buffer.buffer.toString();
        }
        if (bin.file) {
            const file = await fse.readFile(bin.file.filename);
            return file.toString();
        }
        return Promise.reject(genericError('Error on Waveform generation'));
    }
    async waveform(id, waveformParameters, { orm, engine }) {
        const result = await orm.findInWaveformTypes(id);
        if (!result) {
            return Promise.reject(notFoundError());
        }
        return engine.waveform.getWaveform(result.obj, result.objType, waveformParameters.format, waveformParameters.width);
    }
};
__decorate([
    Get('/json', () => WaveFormData, { description: 'Get Peaks Waveform Data as JSON [Episode, Track]', summary: 'Get JSON' }),
    __param(0, QueryParameter('id', { description: 'Object Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WaveformController.prototype, "json", null);
__decorate([
    Get('/svg', () => String, {
        description: 'Get Peaks Waveform Data as SVG [Episode, Track]', summary: 'Get SVG',
        responseStringMimeTypes: ['image/svg+xml']
    }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WaveformSVGParameters, Object]),
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
    __param(0, PathParameter('id', { description: 'Media Id', isID: true })),
    __param(1, PathParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, WaveformParameters, Object]),
    __metadata("design:returntype", Promise)
], WaveformController.prototype, "waveform", null);
WaveformController = __decorate([
    Controller('/waveform', { tags: ['Waveform'], roles: [UserRole.stream] })
], WaveformController);
export { WaveformController };
//# sourceMappingURL=waveform.controller.js.map