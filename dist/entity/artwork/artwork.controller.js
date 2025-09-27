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
import { Artwork, ArtworkPage } from './artwork.model.js';
import { UserRole } from '../../types/enums.js';
import { ArtworkFilterParameters, ArtworkNewParameters, ArtworkNewUploadParameters, ArtworkOrderParameters, ArtworkRenameParameters, IncludesArtworkParameters, IncludesArtworkChildrenParameters } from './artwork.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { IncludesFolderParameters } from '../folder/folder.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { Upload } from '../../modules/rest/decorators/upload.js';
import { UploadFile } from '../../modules/deco/definitions/upload-file.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
let ArtworkController = class ArtworkController {
    async id(id, artworkParameters, artworkChildrenParameters, folderParameters, { orm, engine, user }) {
        return engine.transform.artwork(orm, await orm.Artwork.oneOrFailByID(id), artworkParameters, artworkChildrenParameters, folderParameters, user);
    }
    async search(page, artworkParameters, artworkChildrenParameters, folderParameters, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Artwork.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.artwork(orm, o, artworkParameters, artworkChildrenParameters, folderParameters, user));
        }
        return await orm.Artwork.searchTransformFilter(filter, [order], page, user, o => engine.transform.artwork(orm, o, artworkParameters, artworkChildrenParameters, folderParameters, user));
    }
    async createByUrl(parameters, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(parameters.folderID);
        return await engine.artwork.createByUrl(folder, parameters.url, parameters.types);
    }
    async createByUpload(parameters, file, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(parameters.folderID);
        return await engine.artwork.createByFile(folder, file.name, parameters.types);
    }
    async update(id, file, { orm, engine }) {
        const artwork = await orm.Artwork.oneOrFailByID(id);
        return await engine.artwork.upload(artwork, file.name);
    }
    async rename(parameters, { orm, engine }) {
        const artwork = await orm.Artwork.oneOrFailByID(parameters.id);
        return await engine.artwork.rename(artwork, parameters.newName);
    }
    async remove(id, { orm, engine }) {
        const artwork = await orm.Artwork.oneOrFailByID(id);
        return await engine.artwork.remove(artwork);
    }
};
__decorate([
    Get('/id', () => Artwork, { description: 'Get an Artwork by Id', summary: 'Get Artwork' }),
    __param(0, QueryParameter('id', { description: 'Artwork Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesArtworkParameters,
        IncludesArtworkChildrenParameters,
        IncludesFolderParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "id", null);
__decorate([
    Get('/search', () => ArtworkPage, { description: 'Search Artworks' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, QueryParameters()),
    __param(6, QueryParameters()),
    __param(7, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesArtworkParameters,
        IncludesArtworkChildrenParameters,
        IncludesFolderParameters,
        ArtworkFilterParameters,
        ArtworkOrderParameters,
        ListParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "search", null);
__decorate([
    Post('/create', () => AdminChangeQueueInfo, { description: 'Create an Artwork', roles: [UserRole.admin], summary: 'Create Artwork' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtworkNewParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createByUrl", null);
__decorate([
    Post('/upload', () => AdminChangeQueueInfo, { description: 'Upload an Artwork', roles: [UserRole.admin], summary: 'Upload Artwork' }),
    __param(0, BodyParameters()),
    __param(1, Upload('image')),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtworkNewUploadParameters,
        UploadFile, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createByUpload", null);
__decorate([
    Post('/update', () => AdminChangeQueueInfo, { description: 'Update an Artwork', roles: [UserRole.admin], summary: 'Update Artwork' }),
    __param(0, BodyParameter('id', { description: 'Artwork Id', isID: true })),
    __param(1, Upload('image')),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UploadFile, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "update", null);
__decorate([
    Post('/rename', () => AdminChangeQueueInfo, { description: 'Rename an Artwork', roles: [UserRole.admin], summary: 'Rename Artwork' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtworkRenameParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "rename", null);
__decorate([
    Post('/remove', () => AdminChangeQueueInfo, { description: 'Remove an Artwork', roles: [UserRole.admin], summary: 'Remove Artwork' }),
    __param(0, BodyParameter('id', { description: 'Artwork Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "remove", null);
ArtworkController = __decorate([
    Controller('/artwork', { tags: ['Artwork'], roles: [UserRole.stream] })
], ArtworkController);
export { ArtworkController };
//# sourceMappingURL=artwork.controller.js.map