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
import { AlbumOrderParameters, IncludesAlbumParameters } from '../album/album.parameters.js';
import { IncludesSeriesParameters, SeriesFilterParameters, SeriesOrderParameters } from '../series/series.parameters.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { ArtistFilterParameters, ArtistOrderParameters, IncludesArtistParameters, IncludesArtistChildrenParameters } from './artist.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
let ArtistController = class ArtistController {
    async id(id, artistParameters, artistChildrenParameters, trackParameters, albumParameters, seriesParameters, { orm, engine, user }) {
        return engine.transform.artist(orm, await orm.Artist.oneOrFailByID(id), artistParameters, artistChildrenParameters, trackParameters, albumParameters, seriesParameters, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Artist.indexFilter(filter, user, engine.settings.settings.index.ignoreArticles);
        return await engine.transform.Artist.artistIndex(orm, result);
    }
    async search(page, artistParameters, artistChildrenParameters, trackParameters, albumParameters, seriesParameters, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Artist.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.artist(orm, o, artistParameters, artistChildrenParameters, trackParameters, albumParameters, seriesParameters, user));
        }
        return await orm.Artist.searchTransformFilter(filter, [order], page, user, o => engine.transform.artist(orm, o, artistParameters, artistChildrenParameters, trackParameters, albumParameters, seriesParameters, user));
    }
    async info(id, { orm, engine }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byArtist(orm, artist) };
    }
    async similar(id, page, artistParameters, { orm, engine, user }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        const result = await engine.metadata.similarArtists.byArtist(orm, artist, page);
        return { ...result, items: await engine.transform.Artist.artistBases(orm, result.items, artistParameters, user) };
    }
    async similarTracks(id, page, trackParameters, { orm, engine, user }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byArtist(orm, artist, page);
        return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackParameters, user) };
    }
    async tracks(page, trackParameters, filter, order, { orm, engine, user }) {
        const artistIDs = await orm.Artist.findIDsFilter(filter, user);
        return await orm.Track.searchTransformFilter({ artistIDs }, [order], page, user, o => engine.transform.Track.trackBase(orm, o, trackParameters, user));
    }
    async albums(page, albumParameters, filter, order, { orm, engine, user }) {
        const artistIDs = await orm.Artist.findIDsFilter(filter, user);
        return await orm.Album.searchTransformFilter({ artistIDs }, [order], page, user, o => engine.transform.Album.albumBase(orm, o, albumParameters, user));
    }
    async series(page, seriesParameters, filter, order, { orm, engine, user }) {
        const artistIDs = await orm.Artist.findIDsFilter(filter, user);
        return await orm.Series.searchTransformFilter({ artistIDs }, [order], page, user, o => engine.transform.Series.seriesBase(orm, o, seriesParameters, user));
    }
};
__decorate([
    Get('/id', () => Artist, { description: 'Get an Artist by Id', summary: 'Get Artist' }),
    __param(0, QueryParameter('id', { description: 'Artist Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, QueryParameters()),
    __param(6, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesArtistParameters,
        IncludesArtistChildrenParameters,
        IncludesTrackParameters,
        IncludesAlbumParameters,
        IncludesSeriesParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "id", null);
__decorate([
    Get('/index', () => ArtistIndex, { description: 'Get the Navigation Index for Albums', summary: 'Get Index' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtistFilterParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "index", null);
__decorate([
    Get('/search', () => ArtistPage, { description: 'Search Artists' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, QueryParameters()),
    __param(6, QueryParameters()),
    __param(7, QueryParameters()),
    __param(8, QueryParameters()),
    __param(9, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesArtistParameters,
        IncludesArtistChildrenParameters,
        IncludesTrackParameters,
        IncludesAlbumParameters,
        IncludesSeriesParameters,
        ArtistFilterParameters,
        ArtistOrderParameters,
        ListParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "search", null);
__decorate([
    Get('/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of an Artist by Id (External Service)', summary: 'Get Info' }),
    __param(0, QueryParameter('id', { description: 'Artist Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "info", null);
__decorate([
    Get('/similar', () => ArtistPage, { description: 'Get similar Artists of an Artist by Id (External Service)', summary: 'Get similar Artists' }),
    __param(0, QueryParameter('id', { description: 'Artist Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageParameters,
        IncludesArtistParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "similar", null);
__decorate([
    Get('/similar/tracks', () => TrackPage, { description: 'Get similar Tracks of an Artist by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, QueryParameter('id', { description: 'Artist Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageParameters,
        IncludesTrackParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "similarTracks", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Artists', summary: 'Get Tracks' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesTrackParameters,
        ArtistFilterParameters,
        TrackOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "tracks", null);
__decorate([
    Get('/albums', () => AlbumPage, { description: 'Get Albums of Artists', summary: 'Get Albums' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesAlbumParameters,
        ArtistFilterParameters,
        AlbumOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "albums", null);
__decorate([
    Get('/series', () => SeriesPage, { description: 'Get Series of Artists', summary: 'Get Series' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesSeriesParameters,
        SeriesFilterParameters,
        SeriesOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "series", null);
ArtistController = __decorate([
    Controller('/artist', { tags: ['Artist'], roles: [UserRole.stream] })
], ArtistController);
export { ArtistController };
//# sourceMappingURL=artist.controller.js.map