"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaMerger = void 0;
const meta_cache_1 = require("./meta-cache");
const logger_1 = require("../../../utils/logger");
const consts_1 = require("../../../types/consts");
const log = logger_1.logger('Worker.MetaMerger');
class MetaMerger {
    constructor(orm, changes, rootID) {
        this.orm = orm;
        this.changes = changes;
        this.rootID = rootID;
    }
    async collectAlbumGenres(album) {
        const genres = new Set();
        const folders = await album.folders.getItems();
        for (const folder of folders) {
            folder.genres.forEach(genre => genres.add(genre));
        }
        return [...genres];
    }
    async collectArtistGenres(artist) {
        const genres = new Set();
        const albums = await artist.albums.getItems();
        for (const album of albums) {
            album.genres.forEach(genre => genres.add(genre));
        }
        return [...genres];
    }
    async collectArtistAlbumTypes(artist) {
        const types = new Set();
        const albums = await artist.albums.getItems();
        for (const album of albums) {
            types.add(album.albumType);
        }
        return [...types];
    }
    async addMeta(trackInfo) {
        const linkArtist = async (a) => {
            await a.roots.add(this.root);
            await a.folders.add(trackInfo.folder);
            this.orm.Artist.persistLater(a);
        };
        const artist = await this.cache.findOrCreateArtist(trackInfo, false);
        await linkArtist(artist);
        await trackInfo.track.artist.set(artist);
        await artist.tracks.add(trackInfo.track);
        const albumArtist = (trackInfo.folder.artist === consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_NAME) ?
            await this.cache.findOrCreateCompilationArtist() :
            await this.cache.findOrCreateArtist(trackInfo, true);
        await linkArtist(albumArtist);
        await trackInfo.track.albumArtist.set(albumArtist);
        await albumArtist.albumTracks.add(trackInfo.track);
        const album = await this.cache.findOrCreateAlbum(trackInfo, albumArtist);
        await album.roots.add(this.root);
        await album.folders.add(trackInfo.folder);
        await album.tracks.add(trackInfo.track);
        await trackInfo.track.album.set(album);
        this.orm.Album.persistLater(album);
        if (trackInfo.tag.series) {
            const series = await this.cache.findOrCreateSeries(trackInfo, albumArtist, album);
            if (series) {
                await series.roots.add(this.root);
                await series.folders.add(trackInfo.folder);
                await series.tracks.add(trackInfo.track);
                await series.albums.add(album);
                await trackInfo.track.series.set(series);
                this.orm.Series.persistLater(series);
            }
        }
        this.orm.Track.persistLater(trackInfo.track);
    }
    async applyChangedTrackMeta() {
        const changedTracks = this.changes.tracks.added.ids().concat(this.changes.tracks.updated.ids());
        if (changedTracks.length === 0) {
            return;
        }
        const folderCache = new Map();
        for (const id of changedTracks) {
            const track = await this.orm.Track.oneOrFailByID(id);
            const tag = await track.tag.get();
            let folder = folderCache.get(track.folder.idOrFail());
            if (!folder) {
                folder = await track.folder.getOrFail();
                folderCache.set(folder.id, folder);
            }
            if (tag && folder) {
                const trackInfo = { track, tag, folder };
                await this.addMeta(trackInfo);
            }
            if (this.orm.em.changesCount() > 500) {
                log.debug('Syncing new Track Meta to DB');
                await this.orm.em.flush();
            }
        }
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing new Track Meta to DB');
            await this.orm.em.flush();
        }
    }
    async loadChangedMeta() {
        const trackIDs = this.changes.tracks.updated.ids().concat(this.changes.tracks.removed.ids());
        if (trackIDs.length > 0) {
            const artists = await this.orm.Artist.findIDsFilter({ trackIDs });
            this.changes.artists.updated.appendIDs(artists);
            const albumArtists = await this.orm.Artist.findIDsFilter({ albumTrackIDs: trackIDs });
            this.changes.artists.updated.appendIDs(albumArtists);
            const albums = await this.orm.Album.findIDsFilter({ trackIDs });
            this.changes.albums.updated.appendIDs(albums);
            const series = await this.orm.Series.findIDsFilter({ trackIDs });
            this.changes.series.updated.appendIDs(series);
        }
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing Track/Folder Changes to DB');
            await this.orm.em.flush();
        }
    }
    async applyChangedArtistMeta() {
        const artistIDs = this.changes.artists.updated.ids().concat(this.changes.artists.added.ids());
        for (const id of artistIDs) {
            const artist = await this.orm.Artist.oneOrFailByID(id);
            log.debug('Updating artist', artist.name);
            const currentTracks = await this.orm.Track.findFilter({ artistIDs: [id] });
            const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
            await artist.tracks.set(tracks);
            const currentAlbumArtistTracks = await this.orm.Track.findFilter({ albumArtistIDs: [id] });
            const albumTracks = currentAlbumArtistTracks.filter(t => !this.changes.tracks.removed.has(t));
            await artist.albumTracks.set(albumTracks);
            if (tracks.length === 0 && albumTracks.length === 0) {
                this.changes.artists.removed.add(artist);
                this.changes.artists.updated.delete(artist);
            }
            else {
                const albums = (await artist.albums.getItems()).filter(t => t.artist.id() === artist.id && !this.changes.albums.removed.has(t));
                await artist.albums.set(albums);
                const folders = [];
                for (const folder of (await artist.folders.getItems())) {
                    if ((await folder.albums.getItems()).find(a => (a.artist.id() === artist.id) && !this.changes.folders.removed.has(folder))) {
                        folders.push(folder);
                    }
                }
                await artist.folders.set(folders);
                artist.genres = await this.collectArtistGenres(artist);
                artist.albumTypes = await this.collectArtistAlbumTypes(artist);
            }
            if (this.orm.em.changesCount() > 500) {
                log.debug('Syncing new Artist Meta to DB');
                await this.orm.em.flush();
            }
        }
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing new Artist Meta to DB');
            await this.orm.em.flush();
        }
    }
    async applyChangedSeriesMeta() {
        const seriesIDs = this.changes.series.updated.ids().concat(this.changes.series.added.ids());
        for (const id of seriesIDs) {
            const series = await this.orm.Series.oneOrFailByID(id);
            log.debug('Updating series', series.name);
            const albumTypes = new Set();
            const albums = (await series.albums.getItems()).filter(t => {
                return !this.changes.albums.removed.has(t);
            });
            for (const album of albums) {
                albumTypes.add(album.albumType);
            }
            series.albumTypes = [...albumTypes];
            const currentTracks = await this.orm.Track.findFilter({ seriesIDs: [id] });
            const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
            await series.tracks.set(tracks);
            if (tracks.length === 0) {
                this.changes.series.removed.add(series);
                this.changes.series.updated.delete(series);
            }
            this.orm.Series.persistLater(series);
            if (this.orm.em.changesCount() > 500) {
                log.debug('Syncing new Series Meta to DB');
                await this.orm.em.flush();
            }
        }
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing new Series Meta to DB');
            await this.orm.em.flush();
        }
    }
    async applyChangedAlbumMeta() {
        const albumIDs = this.changes.albums.updated.ids().concat(this.changes.albums.added.ids());
        for (const id of albumIDs) {
            const album = await this.orm.Album.oneOrFailByID(id);
            log.debug('Updating album', album.name);
            const currentTracks = await this.orm.Track.findFilter({ albumIDs: [id] });
            const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
            await album.tracks.set(tracks);
            if (tracks.length === 0) {
                this.changes.albums.removed.add(album);
                this.changes.albums.updated.delete(album);
            }
            else {
                const folders = [];
                const albumFolders = await album.folders.getItems();
                for (const folder of albumFolders) {
                    const folderAlbums = await folder.albums.getItems();
                    if (folderAlbums.find(a => a.id === album.id) && !this.changes.folders.removed.has(folder)) {
                        folders.push(folder);
                    }
                }
                await album.folders.set(folders);
                album.genres = await this.collectAlbumGenres(album);
                this.orm.Album.persistLater(album);
            }
            if (this.orm.em.changesCount() > 500) {
                log.debug('Syncing new Album Meta to DB');
                await this.orm.em.flush();
            }
        }
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing new Album Meta to DB');
            await this.orm.em.flush();
        }
    }
    async mergeMeta() {
        log.info('Updating Metadata');
        this.root = await this.orm.Root.oneOrFailByID(this.rootID);
        this.cache = new meta_cache_1.MetaMergerCache(this.orm, this.changes, this.root);
        await this.loadChangedMeta();
        await this.applyChangedTrackMeta();
        await this.applyChangedAlbumMeta();
        await this.applyChangedArtistMeta();
        await this.applyChangedSeriesMeta();
    }
}
exports.MetaMerger = MetaMerger;
//# sourceMappingURL=merge-meta.js.map