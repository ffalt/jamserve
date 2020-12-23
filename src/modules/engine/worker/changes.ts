import {Track} from '../../../entity/track/track';
import {Artist} from '../../../entity/artist/artist';
import {Album} from '../../../entity/album/album';
import {Folder} from '../../../entity/folder/folder';
import {Series} from '../../../entity/series/series';
import {logger} from '../../../utils/logger';
import {Root} from '../../../entity/root/root';
import moment from 'moment';
import {Artwork} from '../../../entity/artwork/artwork';
import {MetaMerger} from './merge-meta';
import {BaseWorker} from './tasks/base';
import {Orm, OrmService} from '../services/orm.service';
import {Inject, InRequestScope} from 'typescript-ioc';
import {Genre} from '../../../entity/genre/genre';
import {Collection, Reference} from '../../orm';
import {Base} from '../../../entity/base/base';

const log = logger('IO.Changes');

class IdSet<T extends { id: string }> {
	private set = new Set<string>();

	get size(): number {
		return this.set.size;
	}

	add(item?: T): void {
		if (item) {
			this.set.add(item.id);
		}
	}

	addID(item?: string): void {
		if (item) {
			this.set.add(item);
		}
	}

	has(item: T): boolean {
		return this.set.has(item.id);
	}

	hasID(item: string): boolean {
		return this.set.has(item);
	}

	delete(item: T): void {
		this.set.delete(item.id);
	}

	ids(): Array<string> {
		return [...this.set];
	}

	append(items: Array<T>): void {
		for (const item of items) {
			this.add(item);
		}
	}

	appendIDs(items: Array<string>): void {
		for (const item of items) {
			this.set.add(item);
		}
	}
}


export class ChangeSet<T extends { id: string }> {
	added = new IdSet<T>();
	updated = new IdSet<T>();
	removed = new IdSet<T>();
}

export class Changes {
	artists = new ChangeSet<Artist>();
	albums = new ChangeSet<Album>();
	tracks = new ChangeSet<Track>();
	roots = new ChangeSet<Root>();
	folders = new ChangeSet<Folder>();
	series = new ChangeSet<Series>();
	artworks = new ChangeSet<Artwork>();
	genres = new ChangeSet<Genre>();
	start: number = Date.now();
	end: number = 0;
}

export function logChanges(changes: Changes): void {

	function logChange(name: string, list: IdSet<any>): void {
		if (list.size > 0) {
			log.info(name, list.size);
		}
	}

	function logChangeSet(name: string, set: ChangeSet<any>): void {
		logChange('Added ' + name, set.added);
		logChange('Updated ' + name, set.updated);
		logChange('Removed ' + name, set.removed);
	}

	const v = moment.utc(changes.end - changes.start).format('HH:mm:ss.SSS');
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

@InRequestScope
export class ChangesWorker extends BaseWorker {
	@Inject
	ormService!: OrmService;

	async start(rootID: string): Promise<{ changes: Changes; orm: Orm; root: Root }> {
		const orm = this.ormService.fork(true);
		const root = await orm.Root.findOneOrFailByID(rootID);
		return {root, orm, changes: new Changes()};
	}

	async finish(orm: Orm, changes: Changes, root: Root): Promise<Changes> {
		const metaMerger = new MetaMerger(orm, changes, root.id);
		await metaMerger.mergeMeta();
		await this.mergeDependendRemovals(orm, changes);
		await this.mergeRemovals(orm, changes);
		await this.cleanCacheFiles(changes);
		changes.end = Date.now();
		logChanges(changes);
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
			log.debug('Cleaning Image Cache IDs:', imageIDs.length);
			await this.imageModule.clearImageCacheByIDs(imageIDs);
		}

		const trackCleanIds = new IdSet<Base>();
		trackCleanIds.appendIDs(changes.tracks.removed.ids());
		trackCleanIds.appendIDs(changes.tracks.updated.ids());

		const trackIDs = trackCleanIds.ids();
		if (trackIDs.length > 0) {
			log.debug('Cleaning Audio Cache IDs:', trackIDs.length);
			await this.audioModule.clearCacheByIDs(trackIDs);
		}
	}

	private async mergeDependendRemovals(orm: Orm, changes: Changes): Promise<void> {
		const stateCleanIds = new IdSet<Base>();
		const trackIDs = changes.tracks.removed.ids();
		stateCleanIds.appendIDs(trackIDs);
		stateCleanIds.appendIDs(changes.albums.removed.ids());
		stateCleanIds.appendIDs(changes.artists.removed.ids());
		stateCleanIds.appendIDs(changes.folders.removed.ids());
		stateCleanIds.appendIDs(changes.genres.removed.ids());
		stateCleanIds.appendIDs(changes.roots.removed.ids());
		stateCleanIds.appendIDs(changes.series.removed.ids());
		const stateDestIDs = stateCleanIds.ids();
		if (stateDestIDs.length > 0) {
			const states = await orm.State.findIDs({where: {destID: stateDestIDs}});
			await orm.State.removeLaterByIDs(states);
		}
		const stateBookmarkIDs = await orm.Bookmark.findIDs({where: {track: trackIDs}});
		if (stateBookmarkIDs.length > 0) {
			await orm.Bookmark.removeLaterByIDs(stateBookmarkIDs);
		}
		const playlistEntryIDs = await orm.PlaylistEntry.findIDs({where: {track: trackIDs}});
		if (playlistEntryIDs.length > 0) {
			await orm.PlaylistEntry.removeLaterByIDs(playlistEntryIDs);
			// TODO: collect and update playlists
			/*
							log.debug('Updating Playlist:', playlist.name);
							await updatePlayListTracks(this.store.trackStore, playlist);
							await this.store.playlistStore.replace(playlist);
			*/
		}
		if (orm.em.hasChanges()) {
			log.debug('Syncing Removal Dependend Updates to DB');
			await orm.em.flush();
		}
	}

	private async mergeRemovals(orm: Orm, changes: Changes): Promise<void> {
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
}
