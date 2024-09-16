import { logger } from '../../../utils/logger.js';
const log = logger('Validator');
export class Validator {
    static async validateCollection(objID, collection, property, object) {
        const count = await collection.count();
        const items = await collection.getItems();
        if (count !== items.length) {
            log.error(`Invalid ${property} Count on ${object} [${objID}]`);
        }
    }
    static async validateReference(objID, collection, property, object, maybeNull) {
        const id = await collection.id();
        if (!maybeNull && !id) {
            log.error(`Missing ${property} ID on ${object} [${objID}]`);
        }
        const item = await collection.get();
        if (!maybeNull && !item) {
            log.error(`Invalid ${property} on ${object} [${objID}]`);
        }
        if (id && !item) {
            log.error(`Invalid ${property} Reference on ${object} [${objID}]`);
        }
    }
    static async validateStates(orm) {
        const states = await orm.State.all();
        for (const state of states) {
            const repo = orm.byType(state.destType);
            if (!repo) {
                log.error(`Invalid DestType "${state.destType}" in State [${state.id}]`);
            }
            else {
                const obj = await repo.findOneByID(state.destID);
                if (!obj) {
                    log.error(`Missing DestObj "${state.destID}" in State [${state.id}]`);
                }
            }
        }
    }
    async validatePlaylists(orm) {
        const playlists = await orm.Playlist.all();
        for (const playlist of playlists) {
            await Validator.validateCollection(playlist.id, playlist.entries, 'Entries', 'Album');
        }
    }
    async validateTracks(orm) {
        const tracks = await orm.Track.all();
        for (const track of tracks) {
            await Validator.validateReference(track.id, track.albumArtist, 'AlbumArtist', 'Track', false);
            await Validator.validateReference(track.id, track.artist, 'Artist', 'Track', false);
            await Validator.validateReference(track.id, track.album, 'Album', 'Track', false);
            await Validator.validateReference(track.id, track.folder, 'Folder', 'Track', false);
            await Validator.validateReference(track.id, track.root, 'Root', 'Track', false);
            await Validator.validateReference(track.id, track.series, 'Series', 'Track', true);
            await Validator.validateCollection(track.id, track.playlistEntries, 'playlistEntries', 'Track');
            await Validator.validateCollection(track.id, track.playqueueEntries, 'playqueueEntries', 'Track');
            await Validator.validateCollection(track.id, track.genres, 'Genres', 'Track');
        }
    }
    async validateFolders(orm) {
        const folders = await orm.Folder.all();
        for (const folder of folders) {
            await Validator.validateReference(folder.id, folder.root, 'Root', 'Folder', false);
            await Validator.validateCollection(folder.id, folder.artworks, 'Artwork', 'Folder');
            await Validator.validateCollection(folder.id, folder.children, 'Children', 'Folder');
            await Validator.validateCollection(folder.id, folder.artists, 'Artists', 'Folder');
            await Validator.validateCollection(folder.id, folder.tracks, 'Tracks', 'Folder');
            await Validator.validateCollection(folder.id, folder.albums, 'Albums', 'Folder');
        }
    }
    async validateSeries(orm) {
        const series = await orm.Series.all();
        for (const serie of series) {
            log.info(`Validating Series "${serie.name}"`);
            await Validator.validateCollection(serie.id, serie.folders, 'Folders', 'Series');
            await Validator.validateCollection(serie.id, serie.tracks, 'Tracks', 'Series');
            await Validator.validateCollection(serie.id, serie.albums, 'Albums', 'Series');
            await Validator.validateCollection(serie.id, serie.roots, 'Roots', 'Series');
        }
    }
    async validateArtists(orm) {
        const artists = await orm.Artist.all();
        for (const artist of artists) {
            log.info(`Validating Artist "${artist.name}"`);
            await Validator.validateCollection(artist.id, artist.folders, 'Folders', 'Artist');
            await Validator.validateCollection(artist.id, artist.tracks, 'Tracks', 'Artist');
            await Validator.validateCollection(artist.id, artist.albums, 'Albums', 'Artist');
            await Validator.validateCollection(artist.id, artist.genres, 'Genres', 'Artist');
            await Validator.validateCollection(artist.id, artist.roots, 'Roots', 'Artist');
            await Validator.validateCollection(artist.id, artist.series, 'Series', 'Artist');
        }
    }
    async validateAlbums(orm) {
        const albums = await orm.Album.all();
        for (const album of albums) {
            log.info(`Validating Album "${album.name}"`);
            await Validator.validateReference(album.id, album.artist, 'Artist', 'Album', false);
            await Validator.validateReference(album.id, album.series, 'Series', 'Album', true);
            await Validator.validateCollection(album.id, album.folders, 'Folders', 'Album');
            await Validator.validateCollection(album.id, album.tracks, 'Tracks', 'Album');
            await Validator.validateCollection(album.id, album.genres, 'Genres', 'Album');
            await Validator.validateCollection(album.id, album.roots, 'Roots', 'Album');
        }
    }
    async validateORM(orm) {
        log.info(`Validating DB`);
        await this.validateAlbums(orm);
        await this.validateArtists(orm);
        await this.validateSeries(orm);
        await this.validateFolders(orm);
        await this.validateTracks(orm);
        await this.validatePlaylists(orm);
        await Validator.validateStates(orm);
    }
}
//# sourceMappingURL=validator.js.map