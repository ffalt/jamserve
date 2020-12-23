import {logger} from '../../../utils/logger';
import {Collection, Reference} from '../../orm';
import {Orm} from '../services/orm.service';

const log = logger('Validator');

export class Validator {

	private async validateCollection(objID: string, collection: Collection<any>, property: string, object: string): Promise<void> {
		const count = await collection.count();
		const items = await collection.getItems();
		if (count !== items.length) {
			log.error(`Invalid ${property} Count on ${object} [${objID}]`);
		}
	}

	private async validateReference(objID: string, collection: Reference<any>, property: string, object: string, maybeNull: boolean): Promise<void> {
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

	private async validateStates(orm: Orm) {
		const states = await orm.State.all();
		for (const state of states) {
			log.info(`Validating State "${state.destType}" by User ${state.user.id()}`);
			const repo = orm.byType(state.destType);
			if (!repo) {
				log.error(`Invalid DestType "${state.destType}" in State [${state.id}]`);
			} else {
				const obj = await repo.findOneByID(state.destID);
				if (!obj) {
					log.error(`Missing DestObj "${state.destID}" in State [${state.id}]`);
				}
			}
		}
	}

	private async validatePlaylists(orm: Orm) {
		const playlists = await orm.Playlist.all();
		for (const playlist of playlists) {
			log.info(`Validating Playlist "${playlist.name}"`);
			await this.validateCollection(playlist.id, playlist.entries, 'Entries', 'Album');
		}
	}

	private async validateTracks(orm: Orm) {
		const tracks = await orm.Track.all();
		for (const track of tracks) {
			log.info(`Validating Track "${track.name}"`);
			await this.validateReference(track.id, track.albumArtist, 'AlbumArtist', 'Track', false);
			await this.validateReference(track.id, track.artist, 'Artist', 'Track', false);
			await this.validateReference(track.id, track.album, 'Album', 'Track', false);
			await this.validateReference(track.id, track.folder, 'Folder', 'Track', false);
			await this.validateReference(track.id, track.root, 'Root', 'Track', false);
			await this.validateReference(track.id, track.series, 'Series', 'Track', true);
			await this.validateCollection(track.id, track.playlistEntries, 'playlistEntries', 'Track');
			await this.validateCollection(track.id, track.playqueueEntries, 'playqueueEntries', 'Track');
			await this.validateCollection(track.id, track.genres, 'Genres', 'Track');
		}
	}

	private async validateFolders(orm: Orm) {
		const folders = await orm.Folder.all();
		for (const folder of folders) {
			log.info(`Validating Folder "${folder.name}"`);
			await this.validateReference(folder.id, folder.root, 'Root', 'Folder', false);
			await this.validateCollection(folder.id, folder.artworks, 'Artwork', 'Folder');
			await this.validateCollection(folder.id, folder.children, 'Children', 'Folder');
			await this.validateCollection(folder.id, folder.artists, 'Artists', 'Folder');
			await this.validateCollection(folder.id, folder.tracks, 'Tracks', 'Folder');
			await this.validateCollection(folder.id, folder.albums, 'Albums', 'Folder');
		}
	}

	private async validateSeries(orm: Orm) {
		const series = await orm.Series.all();
		for (const serie of series) {
			log.info(`Validating Series "${serie.name}"`);
			await this.validateCollection(serie.id, serie.folders, 'Folders', 'Series');
			await this.validateCollection(serie.id, serie.tracks, 'Tracks', 'Series');
			await this.validateCollection(serie.id, serie.albums, 'Albums', 'Series');
			await this.validateCollection(serie.id, serie.roots, 'Roots', 'Series');
		}
	}

	private async validateArtists(orm: Orm) {
		const artists = await orm.Artist.all();
		for (const artist of artists) {
			log.info(`Validating Artist "${artist.name}"`);
			await this.validateCollection(artist.id, artist.folders, 'Folders', 'Artist');
			await this.validateCollection(artist.id, artist.tracks, 'Tracks', 'Artist');
			await this.validateCollection(artist.id, artist.albums, 'Albums', 'Artist');
			await this.validateCollection(artist.id, artist.genres, 'Genres', 'Artist');
			await this.validateCollection(artist.id, artist.roots, 'Roots', 'Artist');
			await this.validateCollection(artist.id, artist.series, 'Series', 'Artist');
		}
	}

	private async validateAlbums(orm: Orm) {
		const albums = await orm.Album.all();
		for (const album of albums) {
			log.info(`Validating Album "${album.name}"`);
			await this.validateReference(album.id, album.artist, 'Artist', 'Album', false);
			await this.validateReference(album.id, album.series, 'Series', 'Album', true);
			await this.validateCollection(album.id, album.folders, 'Folders', 'Album');
			await this.validateCollection(album.id, album.tracks, 'Tracks', 'Album');
			await this.validateCollection(album.id, album.genres, 'Genres', 'Album');
			await this.validateCollection(album.id, album.roots, 'Roots', 'Album');
		}
	}

	async validateORM(orm: Orm): Promise<void> {
		log.info(`Validating DB`);
		await this.validateAlbums(orm);
		await this.validateArtists(orm);
		await this.validateSeries(orm);
		await this.validateFolders(orm);
		await this.validateTracks(orm);
		await this.validatePlaylists(orm);
		await this.validateStates(orm);
	}
}
