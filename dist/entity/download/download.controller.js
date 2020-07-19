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
exports.DownloadController = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const consts_1 = require("../../types/consts");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const download_args_1 = require("./download.args");
const download_service_1 = require("./download.service");
const user_1 = require("../user/user");
const description = 'Download Archive Binary [Album, Artist, Artwork, Episode, Folder, Playlist, Podcast, Series, Track]';
let DownloadController = class DownloadController {
    async findInDownloadTypes(id) {
        const repos = [
            this.orm.Album,
            this.orm.Artist,
            this.orm.Artwork,
            this.orm.Episode,
            this.orm.Folder,
            this.orm.Playlist,
            this.orm.Podcast,
            this.orm.Series,
            this.orm.Track
        ];
        for (const repo of repos) {
            const obj = await repo.findOne({ id });
            if (obj) {
                return { obj: obj, objType: repo.objType };
            }
        }
    }
    async download(id, downloadArgs, user) {
        const result = await this.findInDownloadTypes(id);
        if (!result) {
            return Promise.reject(rest_1.NotFoundError());
        }
        return await this.downloadService.getObjDownload(result.obj, result.objType, downloadArgs.format, user);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], DownloadController.prototype, "orm", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", download_service_1.DownloadService)
], DownloadController.prototype, "downloadService", void 0);
__decorate([
    rest_1.Get('/{id}.{format}', {
        description,
        summary: 'Download',
        binary: consts_1.ApiDownloadTypes,
        customPathParameters: {
            regex: /(.*?)(\..*)?$/,
            groups: [
                { name: 'id', getType: () => String },
                { name: 'format', getType: () => enums_1.DownloadFormatType, prefix: '.' }
            ]
        },
        aliasRoutes: [
            { route: '/{id}', name: 'by Id', hideParameters: ['format'] }
        ]
    }),
    __param(0, rest_1.PathParam('id', { description: 'Object Id', isID: true })),
    __param(1, rest_1.PathParams()),
    __param(2, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, download_args_1.DownloadArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], DownloadController.prototype, "download", null);
DownloadController = __decorate([
    rest_1.Controller('/download', { tags: ['Download'], roles: [enums_1.UserRole.stream] })
], DownloadController);
exports.DownloadController = DownloadController;
//# sourceMappingURL=download.controller.js.map