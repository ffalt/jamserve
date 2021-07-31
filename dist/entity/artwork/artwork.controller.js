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
import { Artwork, ArtworkPage } from './artwork.model';
import { BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams, Upload, UploadFile } from '../../modules/rest';
import { UserRole } from '../../types/enums';
import { ArtworkFilterArgs, ArtworkNewArgs, ArtworkNewUploadArgs, ArtworkOrderArgs, ArtworkRenameArgs, IncludesArtworkArgs, IncludesArtworkChildrenArgs } from './artwork.args';
import { ListArgs, PageArgs } from '../base/base.args';
import { AdminChangeQueueInfo } from '../admin/admin';
import { IncludesFolderArgs } from '../folder/folder.args';
let ArtworkController = class ArtworkController {
    async id(id, artworkArgs, artworkChildrenArgs, folderArgs, { orm, engine, user }) {
        return engine.transform.artwork(orm, await orm.Artwork.oneOrFailByID(id), artworkArgs, artworkChildrenArgs, folderArgs, user);
    }
    async search(page, artworkArgs, artworkChildrenArgs, folderArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Artwork.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.artwork(orm, o, artworkArgs, artworkChildrenArgs, folderArgs, user));
        }
        return await orm.Artwork.searchTransformFilter(filter, [order], page, user, o => engine.transform.artwork(orm, o, artworkArgs, artworkChildrenArgs, folderArgs, user));
    }
    async createByUrl(args, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(args.folderID);
        return await engine.artwork.createByUrl(folder, args.url, args.types);
    }
    async createByUpload(args, file, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(args.folderID);
        return await engine.artwork.createByFile(folder, file.name, args.types);
    }
    async update(id, file, { orm, engine }) {
        const artwork = await orm.Artwork.oneOrFailByID(id);
        return await engine.artwork.upload(artwork, file.name);
    }
    async rename(args, { orm, engine }) {
        const artwork = await orm.Artwork.oneOrFailByID(args.id);
        return await engine.artwork.rename(artwork, args.newName);
    }
    async remove(id, { orm, engine }) {
        const artwork = await orm.Artwork.oneOrFailByID(id);
        return await engine.artwork.remove(artwork);
    }
};
__decorate([
    Get('/id', () => Artwork, { description: 'Get an Artwork by Id', summary: 'Get Artwork' }),
    __param(0, QueryParam('id', { description: 'Artwork Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesArtworkArgs,
        IncludesArtworkChildrenArgs,
        IncludesFolderArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "id", null);
__decorate([
    Get('/search', () => ArtworkPage, { description: 'Search Artworks' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, QueryParams()),
    __param(6, QueryParams()),
    __param(7, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesArtworkArgs,
        IncludesArtworkChildrenArgs,
        IncludesFolderArgs,
        ArtworkFilterArgs,
        ArtworkOrderArgs,
        ListArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "search", null);
__decorate([
    Post('/create', () => AdminChangeQueueInfo, { description: 'Create an Artwork', roles: [UserRole.admin], summary: 'Create Artwork' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtworkNewArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createByUrl", null);
__decorate([
    Post('/upload', () => AdminChangeQueueInfo, { description: 'Upload an Artwork', roles: [UserRole.admin], summary: 'Upload Artwork' }),
    __param(0, BodyParams()),
    __param(1, Upload('image')),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtworkNewUploadArgs,
        UploadFile, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createByUpload", null);
__decorate([
    Post('/update', () => AdminChangeQueueInfo, { description: 'Update an Artwork', roles: [UserRole.admin], summary: 'Update Artwork' }),
    __param(0, BodyParam('id', { description: 'Artwork Id', isID: true })),
    __param(1, Upload('image')),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UploadFile, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "update", null);
__decorate([
    Post('/rename', () => AdminChangeQueueInfo, { description: 'Rename an Artwork', roles: [UserRole.admin], summary: 'Rename Artwork' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtworkRenameArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "rename", null);
__decorate([
    Post('/remove', () => AdminChangeQueueInfo, { description: 'Remove an Artwork', roles: [UserRole.admin], summary: 'Remove Artwork' }),
    __param(0, BodyParam('id', { description: 'Artwork Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "remove", null);
ArtworkController = __decorate([
    Controller('/artwork', { tags: ['Artwork'], roles: [UserRole.stream] })
], ArtworkController);
export { ArtworkController };
//# sourceMappingURL=artwork.controller.js.map