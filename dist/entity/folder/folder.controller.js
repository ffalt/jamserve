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
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { FolderCreateParameters, FolderFilterParameters, FolderMoveParameters, FolderOrderParameters, FolderRenameParameters, IncludesFolderParameters, IncludesFolderChildrenParameters } from './folder.parameters.js';
import { ArtworkOrderParameters, IncludesArtworkParameters } from '../artwork/artwork.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { invalidParameterError } from '../../modules/deco/express/express-error.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
let FolderController = class FolderController {
    async id(id, folderParameters, folderChildrenParameters, trackParameters, artworkParameters, { orm, engine, user }) {
        return engine.transform.folder(orm, await orm.Folder.oneOrFailByID(id), folderParameters, folderChildrenParameters, trackParameters, artworkParameters, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Folder.indexFilter(filter, user);
        return engine.transform.Folder.folderIndex(orm, result);
    }
    async search(page, folderParameters, folderChildrenParameters, trackParameters, artworkParameters, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Folder.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.folder(orm, o, folderParameters, folderChildrenParameters, trackParameters, artworkParameters, user));
        }
        return await orm.Folder.searchTransformFilter(filter, [order], page, user, o => engine.transform.folder(orm, o, folderParameters, folderChildrenParameters, trackParameters, artworkParameters, user));
    }
    async tracks(page, trackParameters, filter, order, { orm, engine, user }) {
        const folderIDs = await orm.Folder.findIDsFilter(filter, user);
        return await orm.Track.searchTransformFilter({ folderIDs }, [order], page, user, o => engine.transform.Track.trackBase(orm, o, trackParameters, user));
    }
    async subfolders(page, folderParameters, filter, order, { orm, engine, user }) {
        const folderIDs = await orm.Folder.findIDsFilter(filter, user);
        return await orm.Folder.searchTransformFilter({ parentIDs: folderIDs }, [order], page, user, o => engine.transform.Folder.folderBase(orm, o, folderParameters, user));
    }
    async artworks(page, artworkParameters, filter, order, { orm, engine, user }) {
        const folderIDs = await orm.Folder.findIDsFilter(filter, user);
        return await orm.Artwork.searchTransformFilter({ folderIDs }, [order], page, user, o => engine.transform.Artwork.artworkBase(orm, o, artworkParameters, user));
    }
    async artistInfo(id, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byFolderArtist(orm, folder) };
    }
    async albumInfo(id, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byFolderAlbum(orm, folder) };
    }
    async artistsSimilar(id, page, folderParameters, { orm, engine, user }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        const result = await engine.metadata.similarArtists.byFolder(orm, folder, page);
        return { ...result, items: await engine.transform.Folder.folderBases(orm, result.items, folderParameters, user) };
    }
    async artistsSimilarTracks(id, page, trackParameters, { orm, engine, user }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byFolder(orm, folder, page);
        return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackParameters, user) };
    }
    async health(filter, folderParameters, { orm, engine, user }) {
        const folders = await orm.Folder.findFilter(filter, [], {}, user);
        const list = await engine.folder.health(orm, folders);
        const result = [];
        for (const item of list) {
            result.push({
                folder: await engine.transform.Folder.folderBase(orm, item.folder, folderParameters, user),
                health: item.health
            });
        }
        return result;
    }
    async create(parameters, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(parameters.id);
        return await engine.io.folder.create(folder.id, parameters.name, folder.root.idOrFail());
    }
    async rename(parameters, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(parameters.id);
        return await engine.io.folder.rename(folder.id, parameters.name, folder.root.idOrFail());
    }
    async move(parameters, { orm, engine }) {
        const id = parameters.ids.at(0);
        if (parameters.ids.length === 0 || !id) {
            throw invalidParameterError('ids', 'Must have entries');
        }
        const folder = await orm.Folder.oneOrFailByID(id);
        return await engine.io.folder.move(parameters.ids, parameters.newParentID, folder.root.idOrFail());
    }
    async remove(id, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        return await engine.io.folder.delete(folder.id, folder.root.idOrFail());
    }
};
__decorate([
    Get('/id', () => Folder, { description: 'Get a Folder by Id', summary: 'Get Folder' }),
    __param(0, QueryParameter('id', { description: 'Folder Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesFolderParameters,
        IncludesFolderChildrenParameters,
        IncludesTrackParameters,
        IncludesArtworkParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "id", null);
__decorate([
    Get('/index', () => FolderIndex, { description: 'Get the Navigation Index for Folders', summary: 'Get Index' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderFilterParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "index", null);
__decorate([
    Get('/search', () => FolderPage, { description: 'Search Folders' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, QueryParameters()),
    __param(6, QueryParameters()),
    __param(7, QueryParameters()),
    __param(8, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesFolderParameters,
        IncludesFolderChildrenParameters,
        IncludesTrackParameters,
        IncludesArtworkParameters,
        FolderFilterParameters,
        FolderOrderParameters,
        ListParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "search", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Folders', summary: 'Get Tracks' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesTrackParameters,
        FolderFilterParameters,
        TrackOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "tracks", null);
__decorate([
    Get('/subfolders', () => TrackPage, { description: 'Get Child Folders of Folders', summary: 'Get Sub-Folders' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesFolderParameters,
        FolderFilterParameters,
        FolderOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "subfolders", null);
__decorate([
    Get('/artworks', () => ArtworkPage, { description: 'Get Artworks of Folders', summary: 'Get Artwork' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesArtworkParameters,
        FolderFilterParameters,
        ArtworkOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artworks", null);
__decorate([
    Get('/artist/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of an Artist by Folder Id (External Service)', summary: 'Get Artist Info' }),
    __param(0, QueryParameter('id', { description: 'Folder Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artistInfo", null);
__decorate([
    Get('/album/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of an Album by Folder Id (External Service)', summary: 'Get Album Info' }),
    __param(0, QueryParameter('id', { description: 'Folder Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "albumInfo", null);
__decorate([
    Get('/artist/similar', () => FolderPage, { description: 'Get similar Artist Folders of a Folder by Id (External Service)', summary: 'Get similar Artists' }),
    __param(0, QueryParameter('id', { description: 'Folder Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageParameters,
        IncludesFolderParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artistsSimilar", null);
__decorate([
    Get('/artist/similar/tracks', () => TrackPage, { description: 'Get similar Tracks of a Artist Folder by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, QueryParameter('id', { description: 'Folder Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageParameters,
        IncludesTrackParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "artistsSimilarTracks", null);
__decorate([
    Get('/health', () => [FolderHealth], { description: 'Get a List of Folders with Health Issues', roles: [UserRole.admin], summary: 'Get Health' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderFilterParameters,
        IncludesFolderParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "health", null);
__decorate([
    Post('/create', () => AdminChangeQueueInfo, { description: 'Create a Folder', roles: [UserRole.admin], summary: 'Create Folder' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderCreateParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "create", null);
__decorate([
    Post('/rename', () => AdminChangeQueueInfo, { description: 'Rename a folder', roles: [UserRole.admin], summary: 'Rename Folder' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderRenameParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "rename", null);
__decorate([
    Post('/move', () => AdminChangeQueueInfo, { description: 'Move a Folder', roles: [UserRole.admin], summary: 'Move Folder' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderMoveParameters, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "move", null);
__decorate([
    Post('/remove', () => AdminChangeQueueInfo, { description: 'Remove a Folder', summary: 'Remove Folder' }),
    __param(0, BodyParameter('id', { description: 'Folder Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "remove", null);
FolderController = __decorate([
    Controller('/folder', { tags: ['Folder'], roles: [UserRole.stream] })
], FolderController);
export { FolderController };
//# sourceMappingURL=folder.controller.js.map