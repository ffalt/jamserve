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
exports.ArtworkController = void 0;
const artwork_model_1 = require("./artwork.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const artwork_args_1 = require("./artwork.args");
const base_args_1 = require("../base/base.args");
const admin_1 = require("../admin/admin");
const folder_args_1 = require("../folder/folder.args");
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
    rest_1.Get('/id', () => artwork_model_1.Artwork, { description: 'Get an Artwork by Id', summary: 'Get Artwork' }),
    __param(0, rest_1.QueryParam('id', { description: 'Artwork Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, artwork_args_1.IncludesArtworkArgs,
        artwork_args_1.IncludesArtworkChildrenArgs,
        folder_args_1.IncludesFolderArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "id", null);
__decorate([
    rest_1.Get('/search', () => artwork_model_1.ArtworkPage, { description: 'Search Artworks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.QueryParams()),
    __param(7, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        artwork_args_1.IncludesArtworkArgs,
        artwork_args_1.IncludesArtworkChildrenArgs,
        folder_args_1.IncludesFolderArgs,
        artwork_args_1.ArtworkFilterArgs,
        artwork_args_1.ArtworkOrderArgs,
        base_args_1.ListArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "search", null);
__decorate([
    rest_1.Post('/create', () => admin_1.AdminChangeQueueInfo, { description: 'Create an Artwork', roles: [enums_1.UserRole.admin], summary: 'Create Artwork' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artwork_args_1.ArtworkNewArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createByUrl", null);
__decorate([
    rest_1.Post('/upload', () => admin_1.AdminChangeQueueInfo, { description: 'Upload an Artwork', roles: [enums_1.UserRole.admin], summary: 'Upload Artwork' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Upload('image')),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artwork_args_1.ArtworkNewUploadArgs,
        rest_1.UploadFile, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createByUpload", null);
__decorate([
    rest_1.Post('/update', () => admin_1.AdminChangeQueueInfo, { description: 'Update an Artwork', roles: [enums_1.UserRole.admin], summary: 'Update Artwork' }),
    __param(0, rest_1.BodyParam('id', { description: 'Artwork Id', isID: true })),
    __param(1, rest_1.Upload('image')),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rest_1.UploadFile, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "update", null);
__decorate([
    rest_1.Post('/rename', () => admin_1.AdminChangeQueueInfo, { description: 'Rename an Artwork', roles: [enums_1.UserRole.admin], summary: 'Rename Artwork' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artwork_args_1.ArtworkRenameArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "rename", null);
__decorate([
    rest_1.Post('/remove', () => admin_1.AdminChangeQueueInfo, { description: 'Remove an Artwork', roles: [enums_1.UserRole.admin], summary: 'Remove Artwork' }),
    __param(0, rest_1.BodyParam('id', { description: 'Artwork Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "remove", null);
ArtworkController = __decorate([
    rest_1.Controller('/artwork', { tags: ['Artwork'], roles: [enums_1.UserRole.stream] })
], ArtworkController);
exports.ArtworkController = ArtworkController;
//# sourceMappingURL=artwork.controller.js.map