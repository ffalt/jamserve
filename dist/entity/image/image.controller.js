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
exports.ImageController = void 0;
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const consts_1 = require("../../types/consts");
const image_args_1 = require("./image.args");
const decorators_1 = require("../../modules/rest/decorators");
let ImageController = class ImageController {
    async image(imageArgs, { orm, engine }) {
        const result = await orm.findInImageTypes(imageArgs.id);
        if (!result) {
            return Promise.reject(rest_1.NotFoundError());
        }
        return await engine.image.getObjImage(orm, result.obj, result.objType, imageArgs.size, imageArgs.format);
    }
};
__decorate([
    rest_1.Get('/{id}_{size}.{format}', {
        description: 'Image Binary [Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track, User]',
        summary: 'Get Image',
        binary: consts_1.ApiImageTypes,
        customPathParameters: {
            regex: /(.*?)(_.*?)?(\..*)?$/,
            groups: [
                { name: 'id', getType: () => String },
                { name: 'size', getType: () => Number, prefix: '_', min: 16, max: 1024 },
                { name: 'format', getType: () => enums_1.ImageFormatType, prefix: '.' }
            ]
        },
        aliasRoutes: [
            { route: '/{id}_{size}', name: 'by Id and Size', hideParameters: ['format'] },
            { route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['size'] },
            { route: '/{id}', name: 'by Id', hideParameters: ['size', 'format'] }
        ]
    }),
    __param(0, decorators_1.PathParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [image_args_1.ImageArgs, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "image", null);
ImageController = __decorate([
    rest_1.Controller('/image', { tags: ['Image'], roles: [enums_1.UserRole.stream] })
], ImageController);
exports.ImageController = ImageController;
//# sourceMappingURL=image.controller.js.map