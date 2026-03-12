import { injectable, inject, injectFromBase } from 'inversify';
import { BaseWorker } from './tasks/base.js';
import { Orm, OrmService } from '../services/orm.service.js';
import { Root } from '../../../entity/root/root.js';
import { MetaMerger } from './merge-meta.js';
import { Base } from '../../../entity/base/base.js';
import { Changes, ChangeSet, IdSet } from './changes.js';
import { logger } from '../../../utils/logger.js';
import { formatElapsedDuration } from '../../../utils/date-time.js';

const log = logger('IO.Changes');

@injectable()
@injectFromBase()
export class ChangesWorker extends BaseWorker {
	@inject(OrmService)
	ormService!: OrmService;

	async start(rootID: string): Promise<{ changes: Changes; orm: Orm; root: Root }> {
		const orm = this.ormService.fork(true);
		const root = await orm.Root.findOneOrFailByID(rootID);
		return { root, orm, changes: new Changes() };
	}

	async finish(orm: Orm, changes: Changes, root: Root): Promise<Changes> {
		const metaMerger = new MetaMerger(orm, changes, root.id);
		await metaMerger.mergeMeta();
		await ChangesWorker.mergeDependendRemovals(orm, changes);
		await ChangesWorker.mergeRemovals(orm, changes);
		await this.cleanCacheFiles(changes);
		changes.end = Date.now();
		this.logChanges(changes);
		this.ormService.clearCache();
		return changes;
	}

	private async cleanCacheFiles(changes: Changes): Promise<void> {
		const imageCleanIds = new IdSet<Base>();
		for (const changeSet of [
			changes.albums, changes.artists, changes.artworks, changes.folders,
			changes.roots, changes.tracks, changes.series, changes.genres
		]) {
			imageCleanIds.appendIDs(changeSet.removed.ids());
			imageCleanIds.appendIDs(changeSet.updated.ids());
		}
		const imageIDs = imageCleanIds.ids();
		if (imageIDs.length > 0) {
			log.debug('Cleaning Image Cache IDs:', imageIDs.length.toString());
			await this.imageModule.clearImageCacheByIDs(imageIDs);
		}

		const trackCleanIds = new IdSet<Base>();
		trackCleanIds.appendIDs(changes.tracks.removed.ids());
		trackCleanIds.appendIDs(changes.tracks.updated.ids());

		const trackIDs = trackCleanIds.ids();
		if (trackIDs.length > 0) {
			log.debug('Cleaning Audio Cache IDs:', trackIDs.length.toString());
			await this.audioModule.clearCacheByIDs(trackIDs);
		}
	}

	private static async mergeDependendRemovals(orm: Orm, changes: Changes): Promise<void> {
		const stateCleanIds = new IdSet<Base>();
		const trackIDs = changes.tracks.removed.ids();
		stateCleanIds.appendIDs(trackIDs);
		stateCleanIds.appendIDs(changes.albums.removed.ids());
		stateCleanIds.appendIDs(changes.artists.removed.ids());
		stateCleanIds.appendIDs(changes.folders.removed.ids());
		stateCleanIds.appendIDs(changes.genres.removed.ids());
		stateCleanIds.appendIDs(changes.roots.removed.ids());
		stateCleanIds.appendIDs(changes.series.removed.ids());

		const stateBookmarkIDs = await orm.Bookmark.findIDs({ where: { track: trackIDs } });
		if (stateBookmarkIDs.length > 0) {
			await orm.Bookmark.removeLaterByIDs(stateBookmarkIDs);
			stateCleanIds.appendIDs(stateBookmarkIDs);
		}
		const playlistEntryIDs = await orm.PlaylistEntry.findIDs({ where: { track: trackIDs } });
		let affectedPlaylistIDs: Array<string> = [];
		if (playlistEntryIDs.length > 0) {
			const entries = await orm.PlaylistEntry.findByIDs(playlistEntryIDs);
			affectedPlaylistIDs = [...new Set(entries.map(entry => entry.playlist.id()).filter((id): id is string => id !== undefined))];
			for (const entry of entries) {
				orm.PlaylistEntry.removeLater(entry);
			}
			stateCleanIds.appendIDs(playlistEntryIDs);
		}
		const stateDestinationIDs = stateCleanIds.ids();
		if (stateDestinationIDs.length > 0) {
			const states = await orm.State.findIDs({ where: { destID: stateDestinationIDs } });
			await orm.State.removeLaterByIDs(states);
		}
		if (orm.em.hasChanges()) {
			log.debug('Syncing Removal Dependend Updates to DB');
			await orm.em.flush();
		}
		await ChangesWorker.updateAffectedPlaylists(orm, affectedPlaylistIDs);
	}

	private static async updateAffectedPlaylists(orm: Orm, affectedPlaylistIDs: Array<string>): Promise<void> {
		if (affectedPlaylistIDs.length === 0) {
			return;
		}
		const playlists = await orm.Playlist.findByIDs(affectedPlaylistIDs);
		for (const playlist of playlists) {
			log.debug('Updating Playlist:', playlist.name);
			const remainingEntries = await playlist.entries.getItems();
			let duration = 0;
			for (const entry of remainingEntries) {
				const track = await entry.track.get();
				if (track) {
					const tag = await track.tag.get();
					duration += tag?.mediaDuration ?? 0;
				} else {
					const episode = await entry.episode.get();
					if (episode) {
						const tag = await episode.tag.get();
						duration += tag?.mediaDuration ?? 0;
					}
				}
			}
			playlist.duration = duration;
			orm.Playlist.persistLater(playlist);
		}
		if (orm.em.hasChanges()) {
			log.debug('Syncing Playlist Duration Updates to DB');
			await orm.em.flush();
		}
	}

	private static async mergeRemovals(orm: Orm, changes: Changes): Promise<void> {
		await orm.Track.removeLaterByIDs(changes.tracks.removed.ids());
		await orm.Artwork.removeLaterByIDs(changes.artworks.removed.ids());
		await orm.Folder.removeLaterByIDs(changes.folders.removed.ids());
		await orm.Root.removeLaterByIDs(changes.roots.removed.ids());
		await orm.Album.removeLaterByIDs(changes.albums.removed.ids());
		await orm.Artist.removeLaterByIDs(changes.artists.removed.ids());
		await orm.Series.removeLaterByIDs(changes.series.removed.ids());

		if (orm.em.hasChanges()) {
			log.debug('Syncing Removal Updates to DB');
			await orm.em.flush();
		}
	}

	private logChanges(changes: Changes): void {
		function logChange(name: string, list: IdSet<any>): void {
			if (list.size > 0) {
				log.info(name, list.size.toString());
			}
		}

		function logChangeSet(name: string, set: ChangeSet<any>): void {
			logChange(`Added ${name}`, set.added);
			logChange(`Updated ${name}`, set.updated);
			logChange(`Removed ${name}`, set.removed);
		}

		const v = formatElapsedDuration(changes.end - changes.start);
		log.info('Duration:', v);
		logChangeSet('Tracks', changes.tracks);
		logChangeSet('Folders', changes.folders);
		logChangeSet('Artists', changes.artists);
		logChangeSet('Albums', changes.albums);
		logChangeSet('Series', changes.series);
		logChangeSet('Artworks', changes.artworks);
		logChangeSet('Roots', changes.roots);
		logChangeSet('Genres', changes.genres);
	}
}
