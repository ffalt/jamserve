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
import { Controller, Ctx, Get, NotFoundError, PathParam, PathParams } from '../../modules/rest/index.js';
import { DownloadFormatType, UserRole } from '../../types/enums.js';
import { ApiDownloadTypes } from '../../types/consts.js';
import { DownloadArgs } from './download.args.js';
const description = 'Download Archive Binary [Album, Artist, Artwork, Episode, Folder, Playlist, Podcast, Series, Track]';
let DownloadController = class DownloadController {
    async download(id, downloadArgs, { orm, engine, user }) {
        const result = await orm.findInDownloadTypes(id);
        if (!result) {
            return Promise.reject(NotFoundError());
        }
        return await engine.download.getObjDownload(result.obj, result.objType, downloadArgs.format, user);
    }
};
__decorate([
    Get('/{id}.{format}', {
        description,
        summary: 'Download',
        binary: ApiDownloadTypes,
        customPathParameters: {
            regex: /(.*?)(\..*)?$/,
            groups: [
                { name: 'id', getType: () => String },
                { name: 'format', getType: () => DownloadFormatType, prefix: '.' }
            ]
        },
        aliasRoutes: [
            { route: '/{id}', name: 'by Id', hideParameters: ['format'] }
        ]
    }),
    __param(0, PathParam('id', { description: 'Object Id', isID: true })),
    __param(1, PathParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, DownloadArgs, Object]),
    __metadata("design:returntype", Promise)
], DownloadController.prototype, "download", null);
DownloadController = __decorate([
    Controller('/download', { tags: ['Download'], roles: [UserRole.stream] })
], DownloadController);
export { DownloadController };
//# sourceMappingURL=download.controller.js.map