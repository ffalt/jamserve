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
const user_1 = require("../user/user");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const base_controller_1 = require("../base/base.controller");
const artwork_args_1 = require("./artwork.args");
const base_args_1 = require("../base/base.args");
const typescript_ioc_1 = require("typescript-ioc");
const artwork_service_1 = require("./artwork.service");
const admin_1 = require("../admin/admin");
const folder_args_1 = require("../folder/folder.args");
let ArtworkController = class ArtworkController extends base_controller_1.BaseController {
    async id(id, artworkArgs, artworkChildrenArgs, folderArgs, user) {
        return this.transform.artwork(await this.orm.Artwork.oneOrFail(id), artworkArgs, artworkChildrenArgs, folderArgs, user);
    }
    async search(page, artworkArgs, artworkChildrenArgs, folderArgs, filter, order, list, user) {
        if (list.list) {
            return await this.orm.Artwork.findListTransformFilter(list.list, filter, [order], page, user, o => this.transform.artwork(o, artworkArgs, artworkChildrenArgs, folderArgs, user));
        }
        return await this.orm.Artwork.searchTransformFilter(filter, [order], page, user, o => this.transform.artwork(o, artworkArgs, artworkChildrenArgs, folderArgs, user));
    }
    async createByUrl(args, user) {
        const folder = await this.orm.Folder.oneOrFail(args.folderID);
        return await this.artworkService.createByUrl(folder, args.url, args.types);
    }
    async createByUpload(args, file, user) {
        const folder = await this.orm.Folder.oneOrFail(args.folderID);
        return await this.artworkService.createByFile(folder, file.name, args.types);
    }
    async update(id, file, user) {
        const artwork = await this.orm.Artwork.oneOrFail(id);
        return await this.artworkService.upload(artwork, file.name);
    }
    async rename(args, user) {
        const artwork = await this.orm.Artwork.oneOrFail(args.id);
        return await this.artworkService.rename(artwork, args.newName);
    }
    async remove(id, user) {
        const artwork = await this.orm.Artwork.oneOrFail(id);
        return await this.artworkService.remove(artwork);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", artwork_service_1.ArtworkService)
], ArtworkController.prototype, "artworkService", void 0);
__decorate([
    rest_1.Get('/id', () => artwork_model_1.Artwork, { description: 'Get an Artwork by Id', summary: 'Get Artwork' }),
    __param(0, rest_1.QueryParam('id', { description: 'Artwork Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, artwork_args_1.IncludesArtworkArgs,
        artwork_args_1.IncludesArtworkChildrenArgs,
        folder_args_1.IncludesFolderArgs,
        user_1.User]),
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
    __param(7, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        artwork_args_1.IncludesArtworkArgs,
        artwork_args_1.IncludesArtworkChildrenArgs,
        folder_args_1.IncludesFolderArgs,
        artwork_args_1.ArtworkFilterArgs,
        artwork_args_1.ArtworkOrderArgs,
        base_args_1.ListArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "search", null);
__decorate([
    rest_1.Post('/create', () => admin_1.AdminChangeQueueInfo, { description: 'Create an Artwork', roles: [enums_1.UserRole.admin], summary: 'Create Artwork' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artwork_args_1.ArtworkNewArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createByUrl", null);
__decorate([
    rest_1.Post('/upload', () => admin_1.AdminChangeQueueInfo, { description: 'Upload an Artwork', roles: [enums_1.UserRole.admin], summary: 'Upload Artwork' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Upload('image')),
    __param(2, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artwork_args_1.ArtworkNewUploadArgs,
        rest_1.UploadFile,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "createByUpload", null);
__decorate([
    rest_1.Post('/update', () => admin_1.AdminChangeQueueInfo, { description: 'Update an Artwork', roles: [enums_1.UserRole.admin], summary: 'Update Artwork' }),
    __param(0, rest_1.BodyParam('id', { description: 'Artwork Id', isID: true })),
    __param(1, rest_1.Upload('image')),
    __param(2, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rest_1.UploadFile,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "update", null);
__decorate([
    rest_1.Post('/rename', () => admin_1.AdminChangeQueueInfo, { description: 'Rename an Artwork', roles: [enums_1.UserRole.admin], summary: 'Rename Artwork' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artwork_args_1.ArtworkRenameArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "rename", null);
__decorate([
    rest_1.Post('/remove', () => admin_1.AdminChangeQueueInfo, { description: 'Remove an Artwork', roles: [enums_1.UserRole.admin], summary: 'Remove Artwork' }),
    __param(0, rest_1.BodyParam('id', { description: 'Artwork Id', isID: true })),
    __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_1.User]),
    __metadata("design:returntype", Promise)
], ArtworkController.prototype, "remove", null);
ArtworkController = __decorate([
    rest_1.Controller('/artwork', { tags: ['Artwork'], roles: [enums_1.UserRole.stream] })
], ArtworkController);
exports.ArtworkController = ArtworkController;
//# sourceMappingURL=artwork.controller.js.map