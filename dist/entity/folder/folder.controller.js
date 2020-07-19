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
exports.FolderController = void 0;
const folder_model_1 = require("./folder.model");
const user_1 = require("../user/user");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const track_model_1 = require("../track/track.model");
const artwork_model_1 = require("../artwork/artwork.model");
const base_controller_1 = require("../base/base.controller");
const metadata_model_1 = require("../metadata/metadata.model");
const track_args_1 = require("../track/track.args");
const folder_args_1 = require("./folder.args");
const artwork_args_1 = require("../artwork/artwork.args");
const typescript_ioc_1 = require("typescript-ioc");
const folder_service_1 = require("./folder.service");
const base_args_1 = require("../base/base.args");
const admin_1 = require("../admin/admin");
const io_service_1 = require("../../modules/engine/services/io.service");
let FolderController = class FolderController extends base_controller_1.BaseController {
    async id(id, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user) {
        return this.transform.folder(await this.orm.Folder.oneOrFail(id), folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user);
    }
    async index(filter, user) {
        const result = await this.orm.Folder.indexFilter(filter, user);
        return this.transform.folderIndex(result);
    }
    async search(page, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, filter, order, list, user) {
        if (list.list) {
            return await this.orm.Folder.findListTransformFilter(list.list, filter, [order], page, user, o => this.transform.folder(o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user));
        }
        return await this.orm.Folder.searchTransformFilter(filter, [order], page, user, o => this.transform.folder(o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user));
    }
    async tracks(page, trackArgs, filter, order, user) {
        const folderIDs = await this.orm.Folder.findIDsFilter(filter, user);
        return await this.orm.Track.searchTransformFilter({ folderIDs }, [order], page, user, o => this.transform.trackBase(o, trackArgs, user));
    }
    async subfolders(page, folderArgs, filter, order, user) {
        const folderIDs = await this.orm.Folder.findIDsFilter(filter, user);
        return await this.orm.Folder.searchTransformFilter({ parentIDs: folderIDs }, [order], page, user, o => this.transform.folderBase(o, folderArgs, user));
    }
    async artworks(page, artworkArgs, filter, order, user) {
        const folderIDs = await this.orm.Folder.findIDsFilter(filter, user);
        return await this.orm.Artwork.searchTransformFilter({ folderIDs }, [order], page, user, o => this.transform.artworkBase(o, artworkArgs, user));
    }
    async artistInfo(id) {
        const folder = await this.orm.Folder.oneOrFail(id);
        return { info: await this.metadata.extInfo.byFolderArtist(folder) };
    }
    async albumInfo(id) {
        const folder = await this.orm.Folder.oneOrFail(id);
        return { info: await this.metadata.extInfo.byFolderAlbum(folder) };
    }
    async artistsSimilar(id, page, folderArgs, user) {
        const folder = await this.orm.Folder.oneOrFail(id);
        const result = await this.metadata.similarArtists.byFolder(folder, page);
        return { ...result, items: await Promise.all(result.items.map(o => this.transform.folderBase(o, folderArgs, user))) };
    }
    async artistsSimilarTracks(id, page, trackArgs, user) {
        const folder = await this.orm.Folder.oneOrFail(id);
        const result = await this.metadata.similarTracks.byFolder(folder, page);
        return { ...result, items: await Promise.all(result.items.map(o => this.transform.trackBase(o, trackArgs, user))) };
    }
    async health(filter, folderArgs, user) {
        const folders = await this.orm.Folder.findFilter(filter, undefined, user);
        const list = await this.folderService.health(folders);
        const result = [];
        for (const item of list) {
            result.push({
                folder: await this.transform.folderBase(item.folder, folderArgs, user),
                health: item.health
            });
        }
        return result;
    }
    async create(args) {
        const folder = await this.orm.Folder.oneOrFail(args.id);
        return await this.ioService.newFolder(folder.id, args.name, folder.root.id);
    }
    async rename(args) {
        const folder = await this.orm.Folder.oneOrFail(args.id);
        return await this.ioService.renameFolder(folder.id, args.name, folder.root.id);
    }
    async move(args) {
        if (args.ids.length === 0) {
            throw rest_1.InvalidParamError('ids', 'Must have entries');
        }
        const folder = await this.orm.Folder.oneOrFail(args.ids[0]);
        return await this.ioService.moveFolders(args.ids, args.newParentID, folder.root.id);
    }
    async remove(id, user) {
        const folder = await this.orm.Folder.oneOrFail(id);
        return await this.ioService.deleteFolder(folder.id, folder.root.id);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", folder_service_1.FolderService)
], FolderController.prototype, "folderService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", io_service_1.IoService)
], FolderController.prototype, "ioService", void 0);
__decorate([
    rest_1.Get('/id', () => folder_model_1.Folder, { description: 'Get a Folder by Id', summary: 'Get Folder' }),
    __param(0, rest_1.QueryParam('id', { description: 'Folder Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, folder_args_1.IncludesFolderArgs,
        folder_args_1.IncludesFolderChildrenArgs,
        track_args_1.IncludesTrackArgs,
        artwork_args_1.IncludesArtworkArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "id", null);
__decorate([
    rest_1.Get('/index', () => folder_model_1.FolderIndex, { description: 'Get the Navigation Index for Folders', summary: 'Get Index' }),
    __param(0, rest_1.QueryParams()), __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_args_1.FolderFilterArgs, user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "index", null);
__decorate([
    rest_1.Get('/search', () => folder_model_1.FolderPage, { description: 'Search Folders' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.QueryParams()),
    __param(7, rest_1.QueryParams()),
    __param(8, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        folder_args_1.IncludesFolderArgs,
        folder_args_1.IncludesFolderChildrenArgs,
        track_args_1.IncludesTrackArgs,
        artwork_args_1.IncludesArtworkArgs,
        folder_args_1.FolderFilterArgs,
        folder_args_1.FolderOrderArgs,
        base_args_1.ListArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "search", null);
__decorate([
    rest_1.Get('/tracks', () => track_model_1.TrackPage, { description: 'Get Tracks of Folders', summary: 'Get Tracks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        folder_args_1.FolderFilterArgs,
        track_args_1.TrackOrderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "tracks", null);
__decorate([
    rest_1.Get('/subfolders', () => track_model_1.TrackPage, { description: 'Get Child Folders of Folders', summary: 'Get Sub-Folders' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        folder_args_1.IncludesFolderArgs,
        folder_args_1.FolderFilterArgs,
        folder_args_1.FolderOrderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "subfolders", null);
__decorate([
    rest_1.Get('/artworks', () => artwork_model_1.ArtworkPage, { description: 'Get Artworks of Folders', summary: 'Get Artwork' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        artwork_args_1.IncludesArtworkArgs,
        folder_args_1.FolderFilterArgs,
        artwork_args_1.ArtworkOrderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artworks", null);
__decorate([
    rest_1.Get('/artist/info', () => metadata_model_1.ExtendedInfoResult, { description: 'Get Meta Data Info of an Artist by Folder Id (External Service)', summary: 'Get Artist Info' }),
    __param(0, rest_1.QueryParam('id', { description: 'Folder Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artistInfo", null);
__decorate([
    rest_1.Get('/album/info', () => metadata_model_1.ExtendedInfoResult, { description: 'Get Meta Data Info of an Album by Folder Id (External Service)', summary: 'Get Album Info' }),
    __param(0, rest_1.QueryParam('id', { description: 'Folder Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "albumInfo", null);
__decorate([
    rest_1.Get('/artist/similar', () => folder_model_1.FolderPage, { description: 'Get similar Artist Folders of a Folder by Id (External Service)', summary: 'Get similar Artists' }),
    __param(0, rest_1.QueryParam('id', { description: 'Folder Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        folder_args_1.IncludesFolderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artistsSimilar", null);
__decorate([
    rest_1.Get('/artist/similar/tracks', () => track_model_1.TrackPage, { description: 'Get similar Tracks of a Artist Folder by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, rest_1.QueryParam('id', { description: 'Folder Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artistsSimilarTracks", null);
__decorate([
    rest_1.Get('/health', () => [folder_model_1.FolderHealth], { description: 'Get a List of Folders with Health Issues', roles: [enums_1.UserRole.admin], summary: 'Get Health' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_args_1.FolderFilterArgs,
        folder_args_1.IncludesFolderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "health", null);
__decorate([
    rest_1.Post('/create', () => admin_1.AdminChangeQueueInfo, { description: 'Create a Folder', roles: [enums_1.UserRole.admin], summary: 'Create Folder' }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_args_1.FolderCreateArgs]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "create", null);
__decorate([
    rest_1.Post('/rename', () => admin_1.AdminChangeQueueInfo, { description: 'Rename a folder', roles: [enums_1.UserRole.admin], summary: 'Rename Folder' }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_args_1.FolderRenameArgs]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "rename", null);
__decorate([
    rest_1.Post('/move', () => admin_1.AdminChangeQueueInfo, { description: 'Move a Folder', roles: [enums_1.UserRole.admin], summary: 'Move Folder' }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_args_1.FolderMoveArgs]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "move", null);
__decorate([
    rest_1.Post('/remove', () => admin_1.AdminChangeQueueInfo, { description: 'Remove a Folder', summary: 'Remove Folder' }),
    __param(0, rest_1.BodyParam('id', { description: 'Folder Id', isID: true })),
    __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_1.User]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "remove", null);
FolderController = __decorate([
    rest_1.Controller('/folder', { tags: ['Folder'], roles: [enums_1.UserRole.stream] })
], FolderController);
exports.FolderController = FolderController;
//# sourceMappingURL=folder.controller.js.map