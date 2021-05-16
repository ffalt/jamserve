"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaMerger = void 0;
const meta_cache_1 = require("./meta-cache");
const logger_1 = require("../../../utils/logger");
const consts_1 = require("../../../types/consts");
const enums_1 = require("../../../types/enums");
const stats_builder_1 = require("../../../utils/stats-builder");
const slug_1 = require("../../../utils/slug");
const album_name_1 = require("../../../utils/album-name");
const log = logger_1.logger('Worker.MetaMerger');
class MetaMerger {
    constructor(orm, changes, rootID) {
        this.orm = orm;
        this.changes = changes;
        this.rootID = rootID;
    }
    static async collectArtistNames(artist) {
        const metaStatBuilder = new stats_builder_1.MetaStatBuilder();
        const tracks = await artist.tracks.getItems();
        for (const track of tracks) {
            const tag = await track.tag.getOrFail();
            if (track.artist.id() === artist.id) {
                metaStatBuilder.statSlugValue('artist', tag.artist);
                metaStatBuilder.statSlugValue('artistSort', tag.artistSort);
            }
            if (track.albumArtist.id() === artist.id) {
                metaStatBuilder.statSlugValue('artist', tag.albumArtist);
                metaStatBuilder.statSlugValue('artistSort', tag.albumArtistSort);
            }
        }
        const artistName = metaStatBuilder.mostUsed('artist') || consts_1.cUnknownArtist;
        return { artistName, slug: slug_1.slugify(artistName), artistSortName: metaStatBuilder.mostUsed('artistSort') || artist.name };
    }
    static async collectArtistAlbumTypes(artist) {
        const types = new Set();
        const albums = await artist.albums.getItems();
        for (const album of albums) {
            types.add(album.albumType);
        }
        return [...types];
    }
    async linkArtist(a, trackInfo) {
        await a.roots.add(this.root);
        await a.folders.add(trackInfo.folder);
        this.orm.Artist.persistLater(a);
    }
    async addMeta(trackInfo) {
        const artist = await this.cache.findOrCreateArtist(trackInfo, false);
        await this.linkArtist(artist, trackInfo);
        await trackInfo.track.artist.set(artist);
        await artist.tracks.add(trackInfo.track);
        const albumArtist = (trackInfo.folder.artist === consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_NAME) ?
            await this.cache.findOrCreateCompilationArtist() :
            await this.cache.findOrCreateArtist(trackInfo, true);
        await this.linkArtist(albumArtist, trackInfo);
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
    async loadChangedMeta() {
        const trackIDs = this.changes.tracks.updated.ids().concat(this.changes.tracks.removed.ids());
        if (trackIDs.length > 0) {
            log.info('Updating Metadata');
            const artists = await this.orm.Artist.findIDsFilter({ trackIDs });
            this.changes.artists.updated.appendIDs(artists);
            const albumArtists = await this.orm.Artist.findIDsFilter({ albumTrackIDs: trackIDs });
            this.changes.artists.updated.appendIDs(albumArtists);
            const albums = await this.orm.Album.findIDsFilter({ trackIDs });
            this.changes.albums.updated.appendIDs(albums);
            const series = await this.orm.Series.findIDsFilter({ trackIDs });
            this.changes.series.updated.appendIDs(series);
            const genres = await this.orm.Genre.findIDsFilter({ trackIDs });
            this.changes.genres.updated.appendIDs(genres);
        }
        await this.flush('Track/Folder');
    }
    async flush(section) {
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing ' + section + ' Meta to DB');
            await this.orm.em.flush();
        }
    }
    async flushIfNeeded(section) {
        if (this.orm.em.changesCount() > 500) {
            log.debug('Syncing ' + section + ' Meta to DB');
            await this.orm.em.flush();
        }
    }
    async applyChangedTrackMeta(id, folderCache) {
        const track = await this.orm.Track.oneOrFailByID(id);
        let folder = folderCache.get(track.folder.idOrFail());
        if (!folder) {
            folder = await track.folder.getOrFail();
            folderCache.set(folder.id, folder);
        }
        const tag = await track.tag.get();
        if (tag && folder) {
            const trackInfo = { track, tag, folder };
            await this.addMeta(trackInfo);
        }
    }
    async applyChangedTracksMeta() {
        const changedTracks = this.changes.tracks.added.ids().concat(this.changes.tracks.updated.ids());
        const folderCache = new Map();
        for (const id of changedTracks) {
            await this.applyChangedTrackMeta(id, folderCache);
            await this.flushIfNeeded('Track');
        }
        await this.flush('Track');
    }
    async applyChangedArtistMeta(id) {
        const artist = await this.orm.Artist.oneOrFailByID(id);
        log.debug('Updating artist', artist.name);
        const currentTracks = await this.orm.Track.findFilter({ artistIDs: [id] });
        const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
        await artist.tracks.set(tracks);
        const currentAlbumArtistTracks = await this.orm.Track.findFilter({ albumArtistIDs: [id] });
        const albumTracks = currentAlbumArtistTracks.filter(t => !this.changes.tracks.removed.has(t));
        await artist.albumTracks.set(albumTracks);
        const allTracks = tracks.concat(albumTracks);
        if (allTracks.length === 0) {
            this.changes.artists.removed.add(artist);
            this.changes.artists.updated.delete(artist);
        }
        else {
            await this.updateArtistMeta(artist, allTracks);
        }
    }
    async updateArtistMeta(artist, tracks) {
        if (artist.name !== consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_NAME) {
            const { artistName, artistSortName, slug } = await MetaMerger.collectArtistNames(artist);
            artist.name = artistName;
            artist.slug = slug;
            artist.nameSort = artistSortName;
        }
        const albums = (await artist.albums.getItems()).filter(t => t.artist.id() === artist.id && !this.changes.albums.removed.has(t));
        await artist.albums.set(albums);
        const folders = [];
        for (const folder of (await artist.folders.getItems())) {
            if ((await folder.albums.getItems()).find(a => (a.artist.id() === artist.id) && !this.changes.folders.removed.has(folder))) {
                folders.push(folder);
            }
        }
        await artist.folders.set(folders);
        const genreMap = new Map();
        for (const track of tracks) {
            const genres = await track.genres.getItems();
            for (const genre of genres) {
                genreMap.set(genre.id, genre);
            }
        }
        await artist.genres.set([...genreMap.values()]);
        artist.albumTypes = await MetaMerger.collectArtistAlbumTypes(artist);
        this.orm.Artist.persistLater(artist);
    }
    async applyChangedArtistsMeta() {
        const artistIDs = this.changes.artists.updated.ids().concat(this.changes.artists.added.ids());
        for (const id of artistIDs) {
            await this.applyChangedArtistMeta(id);
            await this.flushIfNeeded('Artist');
        }
        await this.flush('Artist');
    }
    async applyChangedSerieMeta(id) {
        const series = await this.orm.Series.oneOrFailByID(id);
        log.debug('Updating series', series.name);
        const albumTypes = new Set();
        const albums = (await series.albums.getItems()).filter(t => !this.changes.albums.removed.has(t));
        const currentTracks = await this.orm.Track.findFilter({ seriesIDs: [id] });
        const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
        await series.tracks.set(tracks);
        if (tracks.length === 0) {
            this.changes.series.removed.add(series);
            this.changes.series.updated.delete(series);
        }
        else {
            albums.forEach(album => albumTypes.add(album.albumType));
            series.albumTypes = [...albumTypes];
            this.orm.Series.persistLater(series);
        }
    }
    async applyChangedSeriesMeta() {
        const seriesIDs = this.changes.series.updated.ids().concat(this.changes.series.added.ids());
        for (const id of seriesIDs) {
            await this.applyChangedSerieMeta(id);
            await this.flushIfNeeded('Series');
        }
        await this.flush('Series');
    }
    async applyChangedAlbumMeta(id) {
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
            await this.updateAlbumMeta(album, tracks);
        }
    }
    async updateAlbumMeta(album, tracks) {
        const folders = [];
        const albumFolders = await album.folders.getItems();
        for (const folder of albumFolders) {
            const folderAlbums = await folder.albums.getItems();
            if (folderAlbums.find(a => a.id === album.id) && !this.changes.folders.removed.has(folder)) {
                folders.push(folder);
            }
        }
        await album.folders.set(folders);
        const metaStatBuilder = new stats_builder_1.MetaStatBuilder();
        folders.forEach(folder => metaStatBuilder.statID('albumType', folder.albumType));
        album.albumType = metaStatBuilder.mostUsed('albumType') || enums_1.AlbumType.unknown;
        let duration = 0;
        const genreMap = new Map();
        for (const track of tracks) {
            const tag = await track.tag.get();
            duration += (tag?.mediaDuration || 0);
            metaStatBuilder.statID('seriesNr', tag?.seriesNr);
            metaStatBuilder.statNumber('year', tag?.year);
            metaStatBuilder.statSlugValue('album', tag?.album && album_name_1.extractAlbumName(tag?.album));
            const genres = await track.genres.getItems();
            genres.forEach(genre => genreMap.set(genre.id, genre));
        }
        album.name = metaStatBuilder.mostUsed('album', album.name) || album.name;
        album.slug = slug_1.slugify(album.name);
        album.duration = duration;
        album.seriesNr = metaStatBuilder.mostUsed('seriesNr');
        album.year = metaStatBuilder.mostUsedNumber('year');
        await album.genres.set([...genreMap.values()]);
        this.orm.Album.persistLater(album);
    }
    async applyChangedAlbumsMeta() {
        const albumIDs = this.changes.albums.updated.ids().concat(this.changes.albums.added.ids());
        for (const id of albumIDs) {
            await this.applyChangedAlbumMeta(id);
            await this.flushIfNeeded('Album');
        }
        await this.flush('Album');
    }
    async applyChangedGenreMeta(id) {
        const genre = await this.orm.Genre.oneOrFailByID(id);
        log.debug('Updating genre', genre.name);
        const currentTracks = await this.orm.Track.findFilter({ genreIDs: [id] });
        const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
        if (tracks.length === 0) {
            this.changes.genres.removed.add(genre);
            this.changes.genres.updated.delete(genre);
            this.orm.Genre.removeLater(genre);
        }
        else {
            await genre.tracks.set(tracks);
            this.orm.Genre.persistLater(genre);
        }
    }
    async applyChangedGenresMeta() {
        const genreIDs = this.changes.genres.updated.ids();
        for (const id of genreIDs) {
            await this.applyChangedGenreMeta(id);
            await this.flushIfNeeded('Genre');
        }
        await this.flush('Genre');
    }
    async mergeMeta() {
        this.root = await this.orm.Root.oneOrFailByID(this.rootID);
        this.cache = new meta_cache_1.MetaMergerCache(this.orm, this.changes, this.root);
        await this.loadChangedMeta();
        await this.applyChangedTracksMeta();
        await this.applyChangedAlbumsMeta();
        await this.applyChangedArtistsMeta();
        await this.applyChangedSeriesMeta();
        await this.applyChangedGenresMeta();
    }
}
exports.MetaMerger = MetaMerger;
//# sourceMappingURL=merge-meta.js.map