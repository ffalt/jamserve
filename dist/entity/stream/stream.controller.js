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
import { StreamParamArgs, StreamPathArgs } from './stream.args.js';
import { ApiStreamTypes } from '../../types/consts.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { PathParam } from '../../modules/rest/decorators/PathParam.js';
import { PathParams } from '../../modules/rest/decorators/PathParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { NotFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
let StreamController = class StreamController {
    async stream(id, streamArgs, streamParamArgs, { orm, engine }) {
        const result = await orm.findInStreamTypes(id);
        if (!result) {
            return Promise.reject(NotFoundError());
        }
        return engine.stream.streamDBObject(result.obj, result.objType, {
            format: streamArgs.format,
            maxBitRate: streamArgs.maxBitRate,
            timeOffset: streamParamArgs.timeOffset
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
    __param(0, PathParam('id', { description: 'Media Id', isID: true })),
    __param(1, PathParams()),
    __param(2, QueryParams()),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, StreamPathArgs,
        StreamParamArgs, Object]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "stream", null);
StreamController = __decorate([
    Controller('/stream', { tags: ['Stream'], roles: [UserRole.stream] })
], StreamController);
export { StreamController };
//# sourceMappingURL=stream.controller.js.map