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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamController = void 0;
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const rest_2 = require("../../modules/rest/");
const stream_args_1 = require("./stream.args");
const consts_1 = require("../../types/consts");
let StreamController = class StreamController {
    async stream(id, streamArgs, { orm, engine, user }) {
        const result = await orm.findInStreamTypes(id);
        if (!result) {
            return Promise.reject(rest_2.NotFoundError());
        }
        return engine.stream.streamDBObject(result.obj, result.objType, streamArgs.format, streamArgs.maxBitRate, user);
    }
};
__decorate([
    rest_1.Get('/{id}_{maxBitRate}.{format}', {
        description: 'Stream a media file in a format [Episode, Track]',
        summary: 'Get Stream',
        binary: consts_1.ApiStreamTypes,
        customPathParameters: {
            regex: /(.*?)(_.*?)?(\..*)?$/,
            groups: [
                { name: 'id', getType: () => String },
                { name: 'maxBitRate', getType: () => Number, prefix: '_', min: 10, max: 480 },
                { name: 'format', getType: () => enums_1.AudioFormatType, prefix: '.' }
            ]
        },
        aliasRoutes: [
            { route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['maxBitRate'] },
            { route: '/{id}_{maxBitRate}', name: 'by Id and Bitrate', hideParameters: ['format'] },
            { route: '/{id}', name: 'by Id', hideParameters: ['format', 'maxBitRate'] }
        ]
    }),
    __param(0, rest_2.PathParam('id', { description: 'Media Id', isID: true })),
    __param(1, rest_2.PathParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stream_args_1.StreamArgs, Object]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "stream", null);
StreamController = __decorate([
    rest_1.Controller('/stream', { tags: ['Stream'], roles: [enums_1.UserRole.stream] })
], StreamController);
exports.StreamController = StreamController;
//# sourceMappingURL=stream.controller.js.map