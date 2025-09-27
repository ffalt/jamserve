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
import { AudioFormatType, UserRole } from '../../types/enums.js';
import { StreamParameters, StreamPathParameters } from './stream.parameters.js';
import { ApiStreamTypes } from '../../types/consts.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { PathParameter } from '../../modules/rest/decorators/path-parameter.js';
import { PathParameters } from '../../modules/rest/decorators/path-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
let StreamController = class StreamController {
    async stream(id, pathParameters, streamParameters, { orm, engine }) {
        const result = await orm.findInStreamTypes(id);
        if (!result) {
            return Promise.reject(notFoundError());
        }
        return engine.stream.streamDBObject(result.obj, result.objType, {
            format: pathParameters.format,
            maxBitRate: pathParameters.maxBitRate,
            timeOffset: streamParameters.timeOffset
        });
    }
};
__decorate([
    Get('/{id}_{maxBitRate}.{format}', {
        description: 'Stream a media file in a format [Episode, Track]',
        summary: 'Get Stream',
        binary: ApiStreamTypes,
        customPathParameters: {
            regex: /(.*?)(_.*?)?(\..*)?$/,
            groups: [
                { name: 'id', getType: () => String },
                { name: 'maxBitRate', getType: () => Number, prefix: '_', min: 10, max: 480 },
                { name: 'format', getType: () => AudioFormatType, prefix: '.' }
            ]
        },
        aliasRoutes: [
            { route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['maxBitRate'] },
            { route: '/{id}_{maxBitRate}', name: 'by Id and Bitrate', hideParameters: ['format'] },
            { route: '/{id}', name: 'by Id', hideParameters: ['format', 'maxBitRate'] }
        ]
    }),
    __param(0, PathParameter('id', { description: 'Media Id', isID: true })),
    __param(1, PathParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, StreamPathParameters,
        StreamParameters, Object]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "stream", null);
StreamController = __decorate([
    Controller('/stream', { tags: ['Stream'], roles: [UserRole.stream] })
], StreamController);
export { StreamController };
//# sourceMappingURL=stream.controller.js.map