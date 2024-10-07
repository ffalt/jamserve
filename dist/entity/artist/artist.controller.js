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
import { Artist, ArtistIndex, ArtistPage } from './artist.model.js';
import { UserRole } from '../../types/enums.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { TrackPage } from '../track/track.model.js';
import { AlbumPage } from '../album/album.model.js';
import { SeriesPage } from '../series/series.model.js';
import { AlbumOrderArgs, IncludesAlbumArgs } from '../album/album.args.js';
import { IncludesSeriesArgs, SeriesFilterArgs, SeriesOrderArgs } from '../series/series.args.js';
import { IncludesTrackArgs, TrackOrderArgs } from '../track/track.args.js';
import { ArtistFilterArgs, ArtistOrderArgs, IncludesArtistArgs, IncludesArtistChildrenArgs } from './artist.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
let ArtistController = class ArtistController {
    async id(id, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, { orm, engine, user }) {
        return engine.transform.artist(orm, await orm.Artist.oneOrFailByID(id), artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Artist.indexFilter(filter, user, engine.settings.settings.index.ignoreArticles);
        return await engine.transform.Artist.artistIndex(orm, result);
    }
    async search(page, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Artist.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user));
        }
        return await orm.Artist.searchTransformFilter(filter, [order], page, user, o => engine.transform.artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user));
    }
    async info(id, { orm, engine }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byArtist(orm, artist) };
    }
    async similar(id, page, artistArgs, { orm, engine, user }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        const result = await engine.metadata.similarArtists.byArtist(orm, artist, page);
        return { ...result, items: await engine.transform.Artist.artistBases(orm, result.items, artistArgs, user) };
    }
    async similarTracks(id, page, trackArgs, { orm, engine, user }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byArtist(orm, artist, page);
        return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackArgs, user) };
    }
    async tracks(page, trackArgs, filter, order, { orm, engine, user }) {
        const artistIDs = await orm.Artist.findIDsFilter(filter, user);
        return await orm.Track.searchTransformFilter({ artistIDs }, [order], page, user, o => engine.transform.Track.trackBase(orm, o, trackArgs, user));
    }
    async albums(page, albumArgs, filter, order, { orm, engine, user }) {
        const artistIDs = await orm.Artist.findIDsFilter(filter, user);
        return await orm.Album.searchTransformFilter({ artistIDs }, [order], page, user, o => engine.transform.Album.albumBase(orm, o, albumArgs, user));
    }
    async series(page, seriesArgs, filter, order, { orm, engine, user }) {
        const artistIDs = await orm.Artist.findIDsFilter(filter, user);
        return await orm.Series.searchTransformFilter({ artistIDs }, [order], page, user, o => engine.transform.Series.seriesBase(orm, o, seriesArgs, user));
    }
};
__decorate([
    Get('/id', () => Artist, { description: 'Get an Artist by Id', summary: 'Get Artist' }),
    __param(0, QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, QueryParams()),
    __param(6, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesArtistArgs,
        IncludesArtistChildrenArgs,
        IncludesTrackArgs,
        IncludesAlbumArgs,
        IncludesSeriesArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "id", null);
__decorate([
    Get('/index', () => ArtistIndex, { description: 'Get the Navigation Index for Albums', summary: 'Get Index' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtistFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "index", null);
__decorate([
    Get('/search', () => ArtistPage, { description: 'Search Artists' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, QueryParams()),
    __param(6, QueryParams()),
    __param(7, QueryParams()),
    __param(8, QueryParams()),
    __param(9, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesArtistArgs,
        IncludesArtistChildrenArgs,
        IncludesTrackArgs,
        IncludesAlbumArgs,
        IncludesSeriesArgs,
        ArtistFilterArgs,
        ArtistOrderArgs,
        ListArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "search", null);
__decorate([
    Get('/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of an Artist by Id (External Service)', summary: 'Get Info' }),
    __param(0, QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "info", null);
__decorate([
    Get('/similar', () => ArtistPage, { description: 'Get similar Artists of an Artist by Id (External Service)', summary: 'Get similar Artists' }),
    __param(0, QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageArgs,
        IncludesArtistArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "similar", null);
__decorate([
    Get('/similar/tracks', () => TrackPage, { description: 'Get similar Tracks of an Artist by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageArgs,
        IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "similarTracks", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Artists', summary: 'Get Tracks' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesTrackArgs,
        ArtistFilterArgs,
        TrackOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "tracks", null);
__decorate([
    Get('/albums', () => AlbumPage, { description: 'Get Albums of Artists', summary: 'Get Albums' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesAlbumArgs,
        ArtistFilterArgs,
        AlbumOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "albums", null);
__decorate([
    Get('/series', () => SeriesPage, { description: 'Get Series of Artists', summary: 'Get Series' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesSeriesArgs,
        SeriesFilterArgs,
        SeriesOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "series", null);
ArtistController = __decorate([
    Controller('/artist', { tags: ['Artist'], roles: [UserRole.stream] })
], ArtistController);
export { ArtistController };
//# sourceMappingURL=artist.controller.js.map