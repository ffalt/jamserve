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
import { AlbumOrderFields, DBObjectType, LastFMLookupType, TrackOrderFields } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { SubsonicParameterArtistInfo, SubsonicParameterID, SubsonicParameterIndexes, SubsonicParameterMusicFolderID, SubsonicParameterSimilarSongs, SubsonicParameterTopSongs } from '../model/subsonic-rest-parameters.js';
import { SubsonicResponseAlbumInfo, SubsonicResponseAlbumWithSongsID3, SubsonicResponseArtistInfo, SubsonicResponseArtistInfo2, SubsonicResponseArtistsID3, SubsonicResponseArtistWithAlbumsID3, SubsonicResponseDirectory, SubsonicResponseGenres, SubsonicResponseIndexes, SubsonicResponseMusicFolders, SubsonicResponseSimilarSongs, SubsonicResponseSimilarSongs2, SubsonicResponseSong, SubsonicResponseTopSongs, SubsonicResponseVideoInfo, SubsonicResponseVideos } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
let SubsonicBrowsingApi = class SubsonicBrowsingApi {
    async getArtist(query, { orm, user }) {
        const artist = await orm.Artist.findOneOrFailByID(query.id);
        const albumlist = await orm.Album.findFilter({ artistIDs: [artist.id] }, [{ orderBy: AlbumOrderFields.year, orderDesc: true }]);
        const state = await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
        const states = await SubsonicHelper.loadStates(orm, albumlist.map(o => o.id), DBObjectType.album, user.id);
        const artistid3 = await SubsonicFormatter.packArtist(artist, state);
        const album = [];
        for (const a of albumlist) {
            album.push(await SubsonicFormatter.packAlbum(a, states[a.id]));
        }
        artistid3.album = album;
        return { artist: artistid3 };
    }
    async getAlbum(query, { orm, user }) {
        const album = await orm.Album.findOneOrFailByID(query.id);
        const state = await orm.State.findOrCreate(album.id, DBObjectType.album, user.id);
        const trackIDs = await album.tracks.getIDs();
        const tracks = await orm.Track.findFilter({ ids: trackIDs }, [{ orderBy: TrackOrderFields.trackNr }]);
        const childs = await SubsonicHelper.prepareTracks(orm, tracks, user);
        const albumid3 = await SubsonicFormatter.packAlbum(album, state);
        albumid3.song = childs;
        return { album: albumid3 };
    }
    async getArtistInfo(query, { engine, orm, user }) {
        const limitCount = query.count ?? 20;
        const includeNotPresent = query.includeNotPresent ?? false;
        const limitLastFMSimilarArtists = async (info) => {
            const similar = info.similar?.artist ?? [];
            if (similar.length === 0) {
                return [];
            }
            const result = [];
            for (const sim of similar) {
                if (result.length === limitCount) {
                    break;
                }
                const artist = await orm.Artist.findOneFilter({ mbArtistIDs: [sim.mbid] });
                if (artist) {
                    const state = await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
                    result.push(await SubsonicFormatter.packArtist(artist, state));
                }
                else if (includeNotPresent) {
                    const image = sim.image && sim.image.length > 0 ? sim.image.at(0) : undefined;
                    result.push({
                        id: '-1',
                        name: sim.name,
                        musicBrainzId: sim.mbid,
                        artistImageUrl: image?.url,
                        albumCount: 0
                    });
                }
            }
            return result;
        };
        const folder = await orm.Folder.findOneOrFailByID(query.id);
        if (folder.mbArtistID) {
            const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, folder.mbArtistID);
            if (lastfm?.artist) {
                return { artistInfo: SubsonicFormatter.packArtistInfo(lastfm.artist, await limitLastFMSimilarArtists(lastfm.artist)) };
            }
        }
        else if (folder.artist) {
            const al = await engine.metadata.lastFMArtistSearch(orm, folder.artist);
            if (al?.artist) {
                const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, al.artist.mbid);
                if (lastfm?.artist) {
                    return { artistInfo: SubsonicFormatter.packArtistInfo(lastfm.artist, await limitLastFMSimilarArtists(lastfm.artist)) };
                }
            }
        }
        return { artistInfo: {} };
    }
    async getArtistInfo2(query, { engine, orm, user }) {
        const includeNotPresent = query.includeNotPresent ?? false;
        const limitCount = query.count ?? 20;
        const limitLastFMSimilarArtists = async (info) => {
            const similar = info.similar?.artist ?? [];
            if (similar.length === 0) {
                return [];
            }
            const result = [];
            for (const sim of similar) {
                if (result.length === limitCount) {
                    break;
                }
                const artist = await orm.Artist.findOneFilter({ mbArtistIDs: [sim.mbid] });
                if (artist) {
                    const state = await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
                    result.push(await SubsonicFormatter.packArtist(artist, state));
                }
                else if (includeNotPresent) {
                    const image = sim.image && sim.image.length > 0 ? sim.image.at(0) : undefined;
                    result.push({
                        id: '-1',
                        name: sim.name,
                        musicBrainzId: sim.mbid,
                        artistImageUrl: image?.url,
                        albumCount: 0
                    });
                }
            }
            return result;
        };
        const artist = await orm.Artist.findOneOrFailByID(query.id);
        if (artist.mbArtistID) {
            const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, artist.mbArtistID);
            if (lastfm?.artist) {
                return { artistInfo2: SubsonicFormatter.packArtistInfo2(lastfm.artist, await limitLastFMSimilarArtists(lastfm.artist)) };
            }
        }
        else if (artist.name) {
            const al = await engine.metadata.lastFMArtistSearch(orm, artist.name);
            if (al?.artist) {
                const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, al.artist.mbid);
                if (lastfm?.artist) {
                    return { artistInfo2: SubsonicFormatter.packArtistInfo2(lastfm.artist, await limitLastFMSimilarArtists(lastfm.artist)) };
                }
            }
        }
        return { artistInfo2: {} };
    }
    async getAlbumInfo(query, { engine, orm }) {
        const folder = await orm.Folder.findOneOrFailByID(query.id);
        if (folder.mbReleaseID) {
            const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, folder.mbReleaseID);
            if (lastfm?.album) {
                return { albumInfo: SubsonicFormatter.packAlbumInfo(lastfm.album) };
            }
        }
        else if (folder.album && folder.artist) {
            const al = await engine.metadata.lastFMAlbumSearch(orm, folder.album, folder.artist);
            if (al?.album) {
                const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, al.album.mbid);
                if (lastfm?.album) {
                    return { albumInfo: SubsonicFormatter.packAlbumInfo(lastfm.album) };
                }
            }
        }
        return { albumInfo: {} };
    }
    async getAlbumInfo2(query, { engine, orm }) {
        const album = await orm.Album.findOneOrFailByID(query.id);
        if (album.mbReleaseID) {
            const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, album.mbReleaseID);
            if (lastfm?.album) {
                return { albumInfo: SubsonicFormatter.packAlbumInfo(lastfm.album) };
            }
        }
        else if (album.name && album.artist.id()) {
            const artist = await album.artist.getOrFail();
            const al = await engine.metadata.lastFMAlbumSearch(orm, album.name, artist.name);
            if (al?.album) {
                const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, al.album.mbid);
                if (lastfm?.album) {
                    return { albumInfo: SubsonicFormatter.packAlbumInfo(lastfm.album) };
                }
            }
        }
        return { albumInfo: {} };
    }
    async getIndexes(query, { engine, orm, user }) {
        const folderIndexORM = await orm.Folder.indexFilter({
            rootIDs: query.musicFolderId ? [query.musicFolderId] : undefined,
            level: 1
        }, user, engine.settings.settings.index.ignoreArticles);
        const folderIndex = await engine.transform.Folder.folderIndex(orm, folderIndexORM);
        if (query.ifModifiedSince && query.ifModifiedSince > 0 && (folderIndex.lastModified <= query.ifModifiedSince)) {
            return {};
        }
        let ids = [];
        for (const group of folderIndex.groups) {
            ids = [...ids, ...group.items.map(folder => folder.id)];
        }
        const states = await SubsonicHelper.loadStates(orm, ids, DBObjectType.folder, user.id);
        return {
            indexes: {
                lastModified: folderIndex.lastModified,
                ignoredArticles: engine.settings.settings.index.ignoreArticles.join(' '),
                index: await SubsonicFormatter.packFolderIndex(folderIndex, states)
            }
        };
    }
    async getArtists(query, { engine, orm, user }) {
        const artistIndex = await orm.Artist.indexFilter({ rootIDs: query.musicFolderId ? [query.musicFolderId] : undefined }, user, engine.settings.settings.index.ignoreArticles);
        let ids = [];
        for (const group of artistIndex.groups) {
            ids = [...ids, ...group.items.map(artist => artist.id)];
        }
        const states = await SubsonicHelper.loadStates(orm, ids, DBObjectType.artist, user.id);
        return {
            artists: {
                ignoredArticles: engine.settings.settings.index.ignoreArticles.join(' '),
                index: await SubsonicFormatter.packArtistIndex(artistIndex, states)
            }
        };
    }
    async getMusicDirectory(query, { orm, user }) {
        const folder = await orm.Folder.findOneOrFailByID(query.id);
        const tracks = await folder.tracks.getItems();
        const folders = await folder.children.getItems();
        let childs = [];
        let list = await SubsonicHelper.prepareFolders(orm, folders, user);
        childs = [...childs, ...list];
        list = await SubsonicHelper.prepareTracks(orm, tracks, user);
        childs = [...childs, ...list];
        const state = await orm.State.findOrCreate(folder.id, DBObjectType.folder, user.id);
        const directory = await SubsonicFormatter.packDirectory(folder, state);
        directory.child = childs;
        return { directory };
    }
    async getMusicFolders({ orm }) {
        const list = await orm.Root.all();
        const musicFolder = [];
        for (const r of list) {
            musicFolder.push(await SubsonicFormatter.packRoot(r));
        }
        return { musicFolders: { musicFolder } };
    }
    async getGenres({ orm }) {
        const genres = await orm.Genre.all();
        const list = [];
        for (const genre of genres) {
            list.push(await SubsonicFormatter.packGenre(genre));
        }
        if (list.length === 0) {
            const dummy = {
                value: '-',
                songCount: 0,
                artistCount: 0,
                albumCount: 0
            };
            list.push(dummy);
        }
        return { genres: { genre: list } };
    }
    async getSimilarSongs(query, { engine, orm, user }) {
        const result = await orm.findInRepos(query.id, [orm.Track, orm.Folder, orm.Artist, orm.Album]);
        if (!result?.obj) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
        }
        let tracks;
        const page = { take: query.count ?? 50, skip: 0 };
        switch (result.objType) {
            case DBObjectType.track: {
                tracks = await engine.metadata.similarTracks.byTrack(orm, result.obj, page);
                break;
            }
            case DBObjectType.folder: {
                tracks = await engine.metadata.similarTracks.byFolder(orm, result.obj, page);
                break;
            }
            case DBObjectType.artist: {
                tracks = await engine.metadata.similarTracks.byArtist(orm, result.obj, page);
                break;
            }
            case DBObjectType.album: {
                tracks = await engine.metadata.similarTracks.byAlbum(orm, result.obj, page);
                break;
            }
            default:
        }
        const childs = tracks ? await SubsonicHelper.prepareTracks(orm, tracks.items, user) : [];
        return { similarSongs: SubsonicFormatter.packSimilarSongs(childs) };
    }
    async getSimilarSongs2(query, { engine, orm, user }) {
        const artist = await orm.Artist.findOneOrFailByID(query.id);
        const page = { take: query.count ?? 50, skip: 0 };
        const tracks = await engine.metadata.similarTracks.byArtist(orm, artist, page);
        const childs = await SubsonicHelper.prepareTracks(orm, tracks.items, user);
        return { similarSongs2: SubsonicFormatter.packSimilarSongs(childs) };
    }
    async getSong(query, { orm, user }) {
        const track = await orm.Track.findOneOrFailByID(query.id);
        const child = await SubsonicHelper.prepareTrack(orm, track, user);
        return { song: child };
    }
    async getTopSongs(query, { engine, orm, user }) {
        const page = { take: query.count ?? 50, skip: 0 };
        const tracks = await engine.metadata.topTracks.byArtistName(orm, query.artist, page);
        const childs = await SubsonicHelper.prepareTracks(orm, tracks.items, user);
        return { topSongs: { song: childs } };
    }
    async getVideos(_context) {
        return { videos: {} };
    }
    async getVideoInfo(_query, _context) {
        return { videoInfo: { id: '0' } };
    }
};
__decorate([
    SubsonicRoute('/getArtist', () => SubsonicResponseArtistWithAlbumsID3, {
        summary: 'Artist',
        description: 'Returns details for an artist, including a list of albums. This method organizes music according to ID3 tags.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getArtist", null);
__decorate([
    SubsonicRoute('/getAlbum', () => SubsonicResponseAlbumWithSongsID3, {
        summary: 'Album',
        description: 'Returns details for an album, including a list of songs. This method organizes music according to ID3 tags.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getAlbum", null);
__decorate([
    SubsonicRoute('/getArtistInfo', () => SubsonicResponseArtistInfo, {
        summary: 'Artist Info',
        description: 'Returns artist info with biography, image URLs and similar artists, using data from last.fm.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterArtistInfo, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getArtistInfo", null);
__decorate([
    SubsonicRoute('/getArtistInfo2', () => SubsonicResponseArtistInfo2, {
        summary: 'Artist Info 2',
        description: 'Similar to getArtistInfo, but organizes music according to ID3 tags.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterArtistInfo, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getArtistInfo2", null);
__decorate([
    SubsonicRoute('/getAlbumInfo', () => SubsonicResponseAlbumInfo, {
        summary: 'Album Info',
        description: 'Returns album notes, image URLs etc, using data from last.fm.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getAlbumInfo", null);
__decorate([
    SubsonicRoute('/getAlbumInfo2', () => SubsonicResponseAlbumInfo, {
        summary: 'Album Info 2',
        description: 'Similar to getAlbumInfo, but organizes music according to ID3 tags.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getAlbumInfo2", null);
__decorate([
    SubsonicRoute('/getIndexes', () => SubsonicResponseIndexes, {
        summary: 'Artist Indexes',
        description: 'Returns an indexed structure of all artists.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterIndexes, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getIndexes", null);
__decorate([
    SubsonicRoute('/getArtists', () => SubsonicResponseArtistsID3, {
        summary: 'Artist Indexes 2',
        description: 'Similar to getIndexes, but organizes music according to ID3 tags.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterMusicFolderID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getArtists", null);
__decorate([
    SubsonicRoute('/getMusicDirectory', () => SubsonicResponseDirectory, {
        summary: 'Music Directory',
        description: 'Returns a listing of all files in a music directory. Typically used to get list of albums for an artist, or list of songs for an album.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getMusicDirectory", null);
__decorate([
    SubsonicRoute('/getMusicFolders', () => SubsonicResponseMusicFolders, {
        summary: 'Music Folders',
        description: 'Returns all configured top-level music folders.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getMusicFolders", null);
__decorate([
    SubsonicRoute('/getGenres', () => SubsonicResponseGenres, {
        summary: 'Genres',
        description: 'Returns all genres.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getGenres", null);
__decorate([
    SubsonicRoute('/getSimilarSongs', () => SubsonicResponseSimilarSongs, {
        summary: 'Similar Songs',
        description: 'Returns a random collection of songs from the given artist and similar artists, using data from last.fm. Typically used for artist radio features.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterSimilarSongs, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getSimilarSongs", null);
__decorate([
    SubsonicRoute('/getSimilarSongs2', () => SubsonicResponseSimilarSongs2, {
        summary: 'Similar Songs 2',
        description: 'Similar to getSimilarSongs, but organizes music according to ID3 tags.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterSimilarSongs, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getSimilarSongs2", null);
__decorate([
    SubsonicRoute('/getSong', () => SubsonicResponseSong, {
        summary: 'Songs',
        description: 'Returns details for a song.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getSong", null);
__decorate([
    SubsonicRoute('/getTopSongs', () => SubsonicResponseTopSongs, {
        summary: 'Top Songs',
        description: 'Returns top songs for the given artist, using data from last.fm.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterTopSongs, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getTopSongs", null);
__decorate([
    SubsonicRoute('/getVideos', () => SubsonicResponseVideos, {
        summary: 'Videos',
        description: 'Returns all video files.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getVideos", null);
__decorate([
    SubsonicRoute('/getVideoInfo', () => SubsonicResponseVideoInfo, {
        summary: 'Video Infos',
        description: 'Returns details for a video, including information about available audio tracks, subtitles (captions) and conversions.',
        tags: ['Browsing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBrowsingApi.prototype, "getVideoInfo", null);
SubsonicBrowsingApi = __decorate([
    SubsonicController()
], SubsonicBrowsingApi);
export { SubsonicBrowsingApi };
//# sourceMappingURL=browsing.js.map