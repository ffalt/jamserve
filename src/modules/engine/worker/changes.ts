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

const log = logger('Worker.Changes');

class IdSet<T extends { id: string }> {
	public list: Array<T> = [];

	get size(): number {
		return this.list.length;
	}

	add(item?: T): void {
		if (item && !this.has(item)) {
			this.list.push(item);
		}
	}

	has(item: T): boolean {
		return !!this.list.find(i => i.id === item.id);
	}

	delete(item: T): void {
		this.list = this.list.filter(i => i.id !== item.id);
	}

	ids(): Array<string> {
		return this.list.map(i => i.id);
	}

	append(items: Array<T>): void {
		for (const item of items) {
			this.add(item);
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
}

export class ChangesWorker extends BaseWorker {

	/*
		async cleanChanges(changes: Changes): Promise<void> {
			let imageCleanIds = new IdSet<string>();
			let trackCleanIds = new IdSet<string>();
			if (changes.removedAlbums.length > 0) {
				log.debug('Removing Albums:', changes.removedAlbums.length);
				const albumIDs = changes.removedAlbums.map(a => a.id);
				await this.store.albumStore.remove(albumIDs);
				await this.store.stateStore.removeByQuery({destIDs: albumIDs, type: DBObjectType.album});
				imageCleanIds = new IdSet<string>([...imageCleanIds, ...albumIDs]);
			}
			if (changes.removedArtists.length > 0) {
				log.debug('Removing Artists:', changes.removedArtists.length);
				const artistIDs = changes.removedArtists.map(a => a.id);
				await this.store.artistStore.remove(artistIDs);
				await this.store.stateStore.removeByQuery({destIDs: artistIDs, type: DBObjectType.artist});
				imageCleanIds = new IdSet<string>([...imageCleanIds, ...artistIDs]);
			}
			if (changes.removedFolders.length > 0) {
				log.debug('Removing Folders:', changes.removedFolders.length);
				const folderIDs = changes.removedFolders.map(folder => folder.id);
				await this.store.folderStore.remove(folderIDs);
				await this.store.stateStore.removeByQuery({destIDs: folderIDs, type: DBObjectType.folder});
				imageCleanIds = new IdSet<string>([...imageCleanIds, ...folderIDs]);
			}
			if (changes.removedSeries.length > 0) {
				log.debug('Removing Series:', changes.removedSeries.length);
				const seriesIDs = changes.removedSeries.map(series => series.id);
				await this.store.seriesStore.remove(seriesIDs);
				await this.store.stateStore.removeByQuery({destIDs: seriesIDs, type: DBObjectType.series});
				imageCleanIds = new IdSet<string>([...imageCleanIds, ...seriesIDs]);
			}
			if (changes.removedTracks.length > 0) {
				log.debug('Removing Tracks:', changes.removedTracks.length);
				const trackIDs = changes.removedTracks.map(track => track.id);
				imageCleanIds = new IdSet<string>([...imageCleanIds, ...trackIDs]);
				trackCleanIds = new IdSet<string>([...trackCleanIds, ...trackIDs]);
				await this.store.trackStore.remove(trackIDs);
				await this.store.stateStore.removeByQuery({destIDs: trackIDs, type: DBObjectType.track});
				await this.store.bookmarkStore.removeByQuery({destIDs: trackIDs});
				const playlists = await this.store.playlistStore.search({trackIDs});
				if (playlists.items.length > 0) {
					for (const playlist of playlists.items) {
						const count = playlist.trackIDs.length;
						playlist.trackIDs = playlist.trackIDs.filter(id => !trackIDs.includes(id));
						if (count !== playlist.trackIDs.length) {
							log.debug('Updating Playlist:', playlist.name);
							await updatePlayListTracks(this.store.trackStore, playlist);
							await this.store.playlistStore.replace(playlist);
						}
					}

				}
			}
			if (changes.updateAlbums.length > 0) {
				const albumIDs = changes.updateAlbums.map(a => a.id);
				imageCleanIds = new IdSet<string>([...imageCleanIds, ...albumIDs]);
			}
			if (changes.updateArtists.length > 0) {
				const artistIDs = changes.updateArtists.map(a => a.id);
				imageCleanIds = new IdSet<string>([...imageCleanIds, ...artistIDs]);
			}
			if (changes.updateFolders.length > 0) {
				const folderIDs = changes.updateFolders.map(f => f.id);
				imageCleanIds = new IdSet<string>([...imageCleanIds, ...folderIDs]);
			}
			if (changes.updateSeries.length > 0) {
				const seriesIDs = changes.updateSeries.map(s => s.id);
				imageCleanIds = new IdSet<string>([...imageCleanIds, ...seriesIDs]);
			}
			if (changes.updateTracks.length > 0) {
				for (const t of changes.updateTracks) {
					imageCleanIds.add(t.track.albumID);
					imageCleanIds.add(t.oldTrack.albumID);
				}
			}
			let ids = [...imageCleanIds];
			if (ids.length > 0) {
				log.debug('Cleaning Image Cache IDs:', ids.length);
				await this.imageModule.clearImageCacheByIDs(ids);
			}
			ids = [...trackCleanIds];
			if (ids.length > 0) {
				log.debug('Cleaning Audio Cache IDs:', ids.length);
				await this.audioModule.clearCacheByIDs(ids);
			}
		}

		async storeChanges(changes: Changes): Promise<void> {
			log.debug('Storing New Tracks:', changes.newTracks.length);
			await this.store.trackStore.bulk(changes.newTracks);
			log.debug('Updating Tracks:', changes.updateTracks.length);
			await this.store.trackStore.upsert(changes.updateTracks.map(t => t.track));
			log.debug('Storing New Folders:', changes.newTracks.length);
			await this.store.folderStore.bulk(changes.newFolders);
			log.debug('Updating Folders:', changes.updateFolders.length);
			await this.store.folderStore.upsert(changes.updateFolders);
			log.debug('Storing New Albums:', changes.newTracks.length);
			await this.store.albumStore.bulk(changes.newAlbums);
			log.debug('Updating Albums:', changes.updateAlbums.length);
			await this.store.albumStore.upsert(changes.updateAlbums);
			log.debug('Storing New Artists:', changes.newTracks.length);
			await this.store.artistStore.bulk(changes.newArtists);
			log.debug('Updating Artists:', changes.updateArtists.length);
			await this.store.artistStore.upsert(changes.updateArtists);
			log.debug('Storing New Series:', changes.newTracks.length);
			await this.store.seriesStore.bulk(changes.newSeries);
			log.debug('Updating Series:', changes.updateSeries.length);
			await this.store.seriesStore.upsert(changes.updateSeries);
		}

		async mergeMatch(root: Root, rootMatch: MatchDir, rebuildDirTag: (dir: MatchDir) => boolean, forceTrackMetaRefresh: boolean, changes: Changes): Promise<void> {
			const merger = new MatchDirMerge(this.audioModule, this.imageModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
			await merger.merge(rootMatch, root.id, rebuildDirTag, forceTrackMetaRefresh, changes);
		}
	*/

	async start(rootID: string): Promise<{ changes: Changes; root: Root }> {
		if (!rootID) {
			return Promise.reject(Error(`Root not found`));
		}
		const root = await this.orm.Root.findOne(rootID);
		if (!root) {
			return Promise.reject(Error(`Root not found`));
		}
		return {root, changes: new Changes()};
	}

	async finish(changes: Changes, root: Root): Promise<Changes> {
		const metaMerger = new MetaMerger(this.orm, changes, root);
		await metaMerger.mergeMeta();
		changes.tracks.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
		changes.artworks.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
		changes.folders.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
		changes.roots.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
		changes.albums.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
		changes.artists.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
		changes.series.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
		// TODO: clean image caches
		log.debug('Flushing changes');
		await this.orm.orm.em.flush();
		changes.end = Date.now();
		logChanges(changes);

		return changes;
	}

}
