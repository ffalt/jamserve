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
import { Album, AlbumIndex, AlbumPage } from './album.model.js';
import { TrackOrderFields, UserRole } from '../../types/enums.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { TrackPage } from '../track/track.model.js';
import { AlbumFilterArgs, AlbumOrderArgs, IncludesAlbumArgs, IncludesAlbumChildrenArgs } from './album.args.js';
import { IncludesTrackArgs, TrackOrderArgs } from '../track/track.args.js';
import { IncludesArtistArgs } from '../artist/artist.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
let AlbumController = class AlbumController {
    async id(id, albumArgs, albumChildrenArgs, trackArgs, artistArgs, { orm, engine, user }) {
        return engine.transform.album(orm, await orm.Album.oneOrFailByID(id), albumArgs, albumChildrenArgs, trackArgs, artistArgs, user);
    }
    async index(filter, { orm, engine }) {
        return await engine.transform.Album.albumIndex(orm, await orm.Album.indexFilter(filter));
    }
    async search(page, albumArgs, albumChildrenArgs, trackArgs, artistArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Album.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.album(orm, o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user));
        }
        return await orm.Album.searchTransformFilter(filter, [order], page, user, o => engine.transform.album(orm, o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user));
    }
    async info(id, { orm, engine }) {
        const album = await orm.Album.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byAlbum(orm, album) };
    }
    async tracks(page, trackArgs, filter, order, { orm, engine, user }) {
        const albumIDs = await orm.Album.findIDsFilter(filter, user);
        const orders = [{ orderBy: order?.orderBy ? order.orderBy : TrackOrderFields.default, orderDesc: order?.orderDesc || false }];
        return await orm.Track.searchTransformFilter({ albumIDs }, orders, page, user, o => engine.transform.Track.trackBase(orm, o, trackArgs, user));
    }
    async similarTracks(id, page, trackArgs, { orm, engine, user }) {
        const album = await orm.Album.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byAlbum(orm, album, page);
        return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackArgs, user) };
    }
};
__decorate([
    Get('/id', () => Album, { description: 'Get an Album by Id', summary: 'Get Album' }),
    __param(0, QueryParam('id', { description: 'Album Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesAlbumArgs,
        IncludesAlbumChildrenArgs,
        IncludesTrackArgs,
        IncludesArtistArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "id", null);
__decorate([
    Get('/index', () => AlbumIndex, { description: 'Get the Navigation Index for Albums', summary: 'Get Index' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AlbumFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "index", null);
__decorate([
    Get('/search', () => AlbumPage, { description: 'Search Albums' }),
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
        IncludesAlbumArgs,
        IncludesAlbumChildrenArgs,
        IncludesTrackArgs,
        IncludesArtistArgs,
        AlbumFilterArgs,
        AlbumOrderArgs,
        ListArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "search", null);
__decorate([
    Get('/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of an Album by Id (External Service)', summary: 'Get Info' }),
    __param(0, QueryParam('id', { description: 'Album Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "info", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Albums', summary: 'Get Tracks' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesTrackArgs,
        AlbumFilterArgs,
        TrackOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "tracks", null);
__decorate([
    Get('/similar/tracks', () => TrackPage, { description: ' Get similar Tracks of an Album by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, QueryParam('id', { description: 'Album Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageArgs,
        IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "similarTracks", null);
AlbumController = __decorate([
    Controller('/album', { tags: ['Album'], roles: [UserRole.stream] })
], AlbumController);
export { AlbumController };
//# sourceMappingURL=album.controller.js.map