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
import { Folder, FolderHealth, FolderIndex, FolderPage } from './folder.model.js';
import { UserRole } from '../../types/enums.js';
import { TrackPage } from '../track/track.model.js';
import { ArtworkPage } from '../artwork/artwork.model.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { IncludesTrackArgs, TrackOrderArgs } from '../track/track.args.js';
import { FolderCreateArgs, FolderFilterArgs, FolderMoveArgs, FolderOrderArgs, FolderRenameArgs, IncludesFolderArgs, IncludesFolderChildrenArgs } from './folder.args.js';
import { ArtworkOrderArgs, IncludesArtworkArgs } from '../artwork/artwork.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { Post } from '../../modules/rest/decorators/Post.js';
import { BodyParams } from '../../modules/rest/decorators/BodyParams.js';
import { InvalidParamError } from '../../modules/deco/express/express-error.js';
import { BodyParam } from '../../modules/rest/decorators/BodyParam.js';
let FolderController = class FolderController {
    async id(id, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, { orm, engine, user }) {
        return engine.transform.folder(orm, await orm.Folder.oneOrFailByID(id), folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Folder.indexFilter(filter, user);
        return engine.transform.Folder.folderIndex(orm, result);
    }
    async search(page, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Folder.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.folder(orm, o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user));
        }
        return await orm.Folder.searchTransformFilter(filter, [order], page, user, o => engine.transform.folder(orm, o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user));
    }
    async tracks(page, trackArgs, filter, order, { orm, engine, user }) {
        const folderIDs = await orm.Folder.findIDsFilter(filter, user);
        return await orm.Track.searchTransformFilter({ folderIDs }, [order], page, user, o => engine.transform.Track.trackBase(orm, o, trackArgs, user));
    }
    async subfolders(page, folderArgs, filter, order, { orm, engine, user }) {
        const folderIDs = await orm.Folder.findIDsFilter(filter, user);
        return await orm.Folder.searchTransformFilter({ parentIDs: folderIDs }, [order], page, user, o => engine.transform.Folder.folderBase(orm, o, folderArgs, user));
    }
    async artworks(page, artworkArgs, filter, order, { orm, engine, user }) {
        const folderIDs = await orm.Folder.findIDsFilter(filter, user);
        return await orm.Artwork.searchTransformFilter({ folderIDs }, [order], page, user, o => engine.transform.Artwork.artworkBase(orm, o, artworkArgs, user));
    }
    async artistInfo(id, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byFolderArtist(orm, folder) };
    }
    async albumInfo(id, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byFolderAlbum(orm, folder) };
    }
    async artistsSimilar(id, page, folderArgs, { orm, engine, user }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        const result = await engine.metadata.similarArtists.byFolder(orm, folder, page);
        return { ...result, items: await engine.transform.Folder.folderBases(orm, result.items, folderArgs, user) };
    }
    async artistsSimilarTracks(id, page, trackArgs, { orm, engine, user }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byFolder(orm, folder, page);
        return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackArgs, user) };
    }
    async health(filter, folderArgs, { orm, engine, user }) {
        const folders = await orm.Folder.findFilter(filter, [], {}, user);
        const list = await engine.folder.health(orm, folders);
        const result = [];
        for (const item of list) {
            result.push({
                folder: await engine.transform.Folder.folderBase(orm, item.folder, folderArgs, user),
                health: item.health
            });
        }
        return result;
    }
    async create(args, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(args.id);
        return await engine.io.folder.create(folder.id, args.name, folder.root.idOrFail());
    }
    async rename(args, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(args.id);
        return await engine.io.folder.rename(folder.id, args.name, folder.root.idOrFail());
    }
    async move(args, { orm, engine }) {
        if (args.ids.length === 0) {
            throw InvalidParamError('ids', 'Must have entries');
        }
        const folder = await orm.Folder.oneOrFailByID(args.ids[0]);
        return await engine.io.folder.move(args.ids, args.newParentID, folder.root.idOrFail());
    }
    async remove(id, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        return await engine.io.folder.delete(folder.id, folder.root.idOrFail());
    }
};
__decorate([
    Get('/id', () => Folder, { description: 'Get a Folder by Id', summary: 'Get Folder' }),
    __param(0, QueryParam('id', { description: 'Folder Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesFolderArgs,
        IncludesFolderChildrenArgs,
        IncludesTrackArgs,
        IncludesArtworkArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "id", null);
__decorate([
    Get('/index', () => FolderIndex, { description: 'Get the Navigation Index for Folders', summary: 'Get Index' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "index", null);
__decorate([
    Get('/search', () => FolderPage, { description: 'Search Folders' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, QueryParams()),
    __param(6, QueryParams()),
    __param(7, QueryParams()),
    __param(8, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesFolderArgs,
        IncludesFolderChildrenArgs,
        IncludesTrackArgs,
        IncludesArtworkArgs,
        FolderFilterArgs,
        FolderOrderArgs,
        ListArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "search", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Folders', summary: 'Get Tracks' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesTrackArgs,
        FolderFilterArgs,
        TrackOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "tracks", null);
__decorate([
    Get('/subfolders', () => TrackPage, { description: 'Get Child Folders of Folders', summary: 'Get Sub-Folders' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesFolderArgs,
        FolderFilterArgs,
        FolderOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "subfolders", null);
__decorate([
    Get('/artworks', () => ArtworkPage, { description: 'Get Artworks of Folders', summary: 'Get Artwork' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesArtworkArgs,
        FolderFilterArgs,
        ArtworkOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artworks", null);
__decorate([
    Get('/artist/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of an Artist by Folder Id (External Service)', summary: 'Get Artist Info' }),
    __param(0, QueryParam('id', { description: 'Folder Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artistInfo", null);
__decorate([
    Get('/album/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of an Album by Folder Id (External Service)', summary: 'Get Album Info' }),
    __param(0, QueryParam('id', { description: 'Folder Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "albumInfo", null);
__decorate([
    Get('/artist/similar', () => FolderPage, { description: 'Get similar Artist Folders of a Folder by Id (External Service)', summary: 'Get similar Artists' }),
    __param(0, QueryParam('id', { description: 'Folder Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageArgs,
        IncludesFolderArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artistsSimilar", null);
__decorate([
    Get('/artist/similar/tracks', () => TrackPage, { description: 'Get similar Tracks of a Artist Folder by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, QueryParam('id', { description: 'Folder Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageArgs,
        IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artistsSimilarTracks", null);
__decorate([
    Get('/health', () => [FolderHealth], { description: 'Get a List of Folders with Health Issues', roles: [UserRole.admin], summary: 'Get Health' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderFilterArgs,
        IncludesFolderArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "health", null);
__decorate([
    Post('/create', () => AdminChangeQueueInfo, { description: 'Create a Folder', roles: [UserRole.admin], summary: 'Create Folder' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderCreateArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "create", null);
__decorate([
    Post('/rename', () => AdminChangeQueueInfo, { description: 'Rename a folder', roles: [UserRole.admin], summary: 'Rename Folder' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderRenameArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "rename", null);
__decorate([
    Post('/move', () => AdminChangeQueueInfo, { description: 'Move a Folder', roles: [UserRole.admin], summary: 'Move Folder' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderMoveArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "move", null);
__decorate([
    Post('/remove', () => AdminChangeQueueInfo, { description: 'Remove a Folder', summary: 'Remove Folder' }),
    __param(0, BodyParam('id', { description: 'Folder Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "remove", null);
FolderController = __decorate([
    Controller('/folder', { tags: ['Folder'], roles: [UserRole.stream] })
], FolderController);
export { FolderController };
//# sourceMappingURL=folder.controller.js.map