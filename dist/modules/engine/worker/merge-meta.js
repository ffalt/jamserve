"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaMerger = void 0;
const meta_cache_1 = require("./meta-cache");
const logger_1 = require("../../../utils/logger");
const consts_1 = require("../../../types/consts");
const log = logger_1.logger('Worker.MetaMerger');
class MetaMerger {
    constructor(orm, changes, root) {
        this.orm = orm;
        this.changes = changes;
        this.root = root;
        this.cache = new meta_cache_1.MetaMergerCache(orm, changes, root);
    }
    collectAlbumGenres(album) {
        const genres = new Set();
        const folders = album.folders.getItems();
        for (const folder of folders) {
            folder.genres.forEach(genre => genres.add(genre));
        }
        return [...genres];
    }
    collectArtistGenres(artist) {
        const genres = new Set();
        const albums = artist.albums.getItems();
        for (const album of albums) {
            album.genres.forEach(genre => genres.add(genre));
        }
        return [...genres];
    }
    collectArtistAlbumTypes(artist) {
        const types = new Set();
        const albums = artist.albums.getItems();
        for (const album of albums) {
            types.add(album.albumType);
        }
        return [...types];
    }
    async addMeta(trackInfo) {
        const linkArtist = async (a) => {
            a.roots.add(this.root);
            a.folders.add(trackInfo.folder);
            this.orm.orm.em.persistLater(a);
        };
        const artist = await this.cache.findOrCreateArtist(trackInfo, false);
        await this.orm.Artist.populate(artist, ['roots', 'folders', 'tracks']);
        await linkArtist(artist);
        artist.tracks.add(trackInfo.track);
        const albumArtist = (trackInfo.folder.artist === consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_NAME) ?
            await this.cache.findOrCreateCompilationArtist() :
            await this.cache.findOrCreateArtist(trackInfo, true);
        await this.orm.Artist.populate(albumArtist, ['roots', 'folders', 'albumTracks']);
        await linkArtist(albumArtist);
        albumArtist.albumTracks.add(trackInfo.track);
        const album = await this.cache.findOrCreateAlbum(trackInfo, albumArtist);
        await this.orm.Album.populate(album, ['roots', 'folders', 'tracks']);
        album.roots.add(this.root);
        album.folders.add(trackInfo.folder);
        album.tracks.add(trackInfo.track);
        this.orm.orm.em.persistLater(album);
        if (trackInfo.tag.series) {
            const series = await this.cache.findOrCreateSeries(trackInfo, albumArtist, album);
            if (series) {
                await this.orm.Series.populate(series, ['roots', 'folders', 'tracks', 'albums']);
                series.roots.add(this.root);
                series.folders.add(trackInfo.folder);
                series.tracks.add(trackInfo.track);
                series.albums.add(album);
                this.orm.orm.em.persistLater(series);
            }
        }
        this.orm.orm.em.persistLater(trackInfo.track);
    }
    async mergeMeta() {
        for (const track of this.changes.tracks.added.list.concat(this.changes.tracks.updated.list)) {
            await this.orm.Track.populate(track, ['folder', 'tag']);
            const tag = track.tag;
            const folder = track.folder;
            if (tag && folder) {
                const trackInfo = { track, tag, folder };
                await this.addMeta(trackInfo);
            }
        }
        if (this.changes.tracks.updated.size > 0) {
            const trackIDs = this.changes.tracks.updated.ids();
            const artists = await this.orm.Artist.findFilter({ trackIDs });
            this.changes.artists.updated.append(artists);
            const albumArtists = await this.orm.Artist.findFilter({ albumTrackIDs: trackIDs });
            this.changes.artists.updated.append(albumArtists);
            const albums = await this.orm.Album.findFilter({ trackIDs });
            this.changes.albums.updated.append(albums);
            const series = await this.orm.Series.findFilter({ trackIDs });
            this.changes.series.updated.append(series);
        }
        for (const track of this.changes.tracks.removed.list) {
            this.changes.albums.updated.add(track.album);
            this.changes.artists.updated.add(track.artist);
            this.changes.series.updated.add(track.series);
            this.changes.artists.updated.add(track.albumArtist);
        }
        for (const album of this.changes.albums.added.list) {
            log.debug('Updating new album meta', album.name);
            album.genres = this.collectAlbumGenres(album);
        }
        for (const album of this.changes.albums.updated.list) {
            log.debug('Updating album meta', album.name);
            const tracks = album.tracks.getItems().filter(t => { var _a; return ((_a = t.album) === null || _a === void 0 ? void 0 : _a.id) === album.id && !this.changes.tracks.removed.has(t); });
            album.tracks.set(tracks);
            if (tracks.length === 0) {
                album.folders.set([]);
                album.roots.set([]);
                this.changes.albums.removed.add(album);
                this.changes.albums.updated.delete(album);
            }
            else {
                const folders = [];
                for (const folder of album.folders.getItems()) {
                    await this.orm.Folder.populate(folder, ['albums']);
                    if (folder.albums.getItems().find(a => a.id === album.id) && !this.changes.folders.removed.has(folder)) {
                        folders.push(folder);
                    }
                }
                album.folders.set(folders);
                album.genres = this.collectAlbumGenres(album);
            }
        }
        for (const artist of this.changes.artists.added.list) {
            log.debug('Updating new artist meta', artist.name);
            artist.genres = this.collectArtistGenres(artist);
            artist.albumTypes = this.collectArtistAlbumTypes(artist);
        }
        for (const artist of this.changes.artists.updated.list) {
            log.debug('Updating artist', artist.name);
            await this.orm.Artist.populate(artist, ['roots', 'folders', 'tracks', 'albumTracks', 'albums']);
            const tracks = artist.tracks.getItems().filter(t => { var _a; return ((_a = t.artist) === null || _a === void 0 ? void 0 : _a.id) === artist.id && !this.changes.tracks.removed.has(t); });
            artist.tracks.set(tracks);
            const albumTracks = artist.albumTracks.getItems().filter(t => { var _a; return ((_a = t.albumArtist) === null || _a === void 0 ? void 0 : _a.id) === artist.id && !this.changes.tracks.removed.has(t); });
            artist.albumTracks.set(albumTracks);
            if (tracks.length === 0 && artist.albumTracks.length === 0) {
                artist.folders.set([]);
                artist.albums.set([]);
                this.changes.artists.removed.add(artist);
                this.changes.artists.updated.delete(artist);
            }
            else {
                const albums = artist.albums.getItems().filter(t => { var _a; return ((_a = t.artist) === null || _a === void 0 ? void 0 : _a.id) === artist.id && !this.changes.albums.removed.has(t); });
                artist.albums.set(albums);
                const folders = [];
                for (const folder of artist.folders.getItems()) {
                    await this.orm.Folder.populate(folder, ['albums']);
                    if (folder.albums.getItems().find(a => a.id === artist.id) && !this.changes.folders.removed.has(folder)) {
                        folders.push(folder);
                    }
                }
                artist.folders.set(folders);
                artist.genres = this.collectArtistGenres(artist);
                artist.albumTypes = this.collectArtistAlbumTypes(artist);
            }
        }
        for (const series of this.changes.series.added.list.concat(this.changes.series.updated.list)) {
            await this.orm.Series.populate(series, ['tracks', 'albums']);
            log.debug('Updating series', series.name);
            const albumTypes = new Set();
            const albums = series.albums.getItems().filter(t => {
                return !this.changes.albums.removed.has(t);
            });
            for (const album of albums) {
                albumTypes.add(album.albumType);
            }
            series.albumTypes = [...albumTypes];
            const tracks = series.tracks.getItems().filter(t => {
                return !this.changes.tracks.removed.has(t);
            });
            series.tracks.set(tracks);
            if (tracks.length === 0) {
                this.changes.series.removed.add(series);
                this.changes.series.updated.delete(series);
            }
        }
    }
}
exports.MetaMerger = MetaMerger;
//# sourceMappingURL=merge-meta.js.map