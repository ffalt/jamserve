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
import { ImageFormatType, UserRole } from '../../types/enums.js';
import { ApiImageTypes } from '../../types/consts.js';
import { ImageParameters } from './image.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';
import { PathParameters } from '../../modules/rest/decorators/path-parameters.js';
let ImageController = class ImageController {
    async image(parameters, { orm, engine }) {
        const result = await orm.findInImageTypes(parameters.id);
        if (!result) {
            return Promise.reject(notFoundError());
        }
        return await engine.image.getObjImage(orm, result.obj, result.objType, parameters.size, parameters.format);
    }
};
__decorate([
    Get('/{id}_{size}.{format}', {
        description: 'Image Binary [Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track, User]',
        summary: 'Get Image',
        binary: ApiImageTypes,
        customPathParameters: {
            regex: /(.*?)(_.*?)?(\..*)?$/,
            groups: [
                { name: 'id', getType: () => String },
                { name: 'size', getType: () => Number, prefix: '_', min: 16, max: 1024 },
                { name: 'format', getType: () => ImageFormatType, prefix: '.' }
            ]
        },
        aliasRoutes: [
            { route: '/{id}_{size}', name: 'by Id and Size', hideParameters: ['format'] },
            { route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['size'] },
            { route: '/{id}', name: 'by Id', hideParameters: ['size', 'format'] }
        ]
    }),
    __param(0, PathParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ImageParameters, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "image", null);
ImageController = __decorate([
    Controller('/image', { tags: ['Image'], roles: [UserRole.stream] })
], ImageController);
export { ImageController };
//# sourceMappingURL=image.controller.js.map