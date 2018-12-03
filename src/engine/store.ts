import {DBElastic} from '../db/elasticsearch/db-elastic';
import {DBNedb} from '../db/nedb/db-nedb';
import {Config} from '../config';
import {UserStore} from '../objects/user/user.store';
import {TrackStore} from '../objects/track/track.store';
import {FolderStore} from '../objects/folder/folder.store';
import {EpisodeStore} from '../objects/episode/episode.store';
import {AlbumStore} from '../objects/album/album.store';
import {ArtistStore} from '../objects/artist/artist.store';
import {RadioStore} from '../objects/radio/radio.store';
import {PlayQueueStore} from '../objects/playqueue/playqueue.store';
import {RootStore} from '../objects/root/root.store';
import {BookmarkStore} from '../objects/bookmark/bookmark.store';
import {PodcastStore} from '../objects/podcast/podcast.store';
import {PlaylistStore} from '../objects/playlist/playlist.store';
import {StateStore} from '../objects/state/state.store';
import {BaseStore, SearchQuery} from '../objects/base/base.store';
import {DBObject} from '../objects/base/base.model';
import {Database} from '../db/db.model';
import {ImageService} from './image/image.service';
import {WaveformService} from './waveform/waveform.service';
import {Track} from '../objects/track/track.model';
import {Folder} from '../objects/folder/folder.model';
import {DBObjectType} from '../types';
import {updatePlayListTracks} from '../objects/playlist/playlist.service';
import {clearID3} from './io/components/clean';
import Logger from '../utils/logger';

const log = Logger('Store');

export class Store {
	public config: Config;
	public db: Database;
	public trackStore: TrackStore;
	public folderStore: FolderStore;
	public userStore: UserStore;
	public stateStore: StateStore;
	public playlistStore: PlaylistStore;
	public podcastStore: PodcastStore;
	public episodeStore: EpisodeStore;
	public bookmarkStore: BookmarkStore;
	public rootStore: RootStore;
	public artistStore: ArtistStore;
	public albumStore: AlbumStore;
	public playQueueStore: PlayQueueStore;
	public radioStore: RadioStore;

	constructor(config: Config) {
		this.config = config;
		if (this.config.database.use === 'elasticsearch') {
			this.db = new DBElastic(config.database.options.elasticsearch);
		} else {
			const db_path = config.getDataPath(['nedb']);
			this.db = new DBNedb(db_path);
		}
		this.trackStore = new TrackStore(this.db);
		this.folderStore = new FolderStore(this.db);
		this.userStore = new UserStore(this.db);
		this.stateStore = new StateStore(this.db);
		this.playlistStore = new PlaylistStore(this.db);
		this.podcastStore = new PodcastStore(this.db);
		this.episodeStore = new EpisodeStore(this.db);
		this.bookmarkStore = new BookmarkStore(this.db);
		this.artistStore = new ArtistStore(this.db);
		this.albumStore = new AlbumStore(this.db);
		this.playQueueStore = new PlayQueueStore(this.db);
		this.radioStore = new RadioStore(this.db);
		this.rootStore = new RootStore(this.db);
	}

	async reset(): Promise<void> {
		await this.db.reset();
	}

	async check(): Promise<void> {
		await this.db.check();
	}

	async open(): Promise<void> {
		await this.db.open();
	}

	async close(): Promise<void> {
		await this.db.close();
	}

	async findInAll(id: string): Promise<DBObject | undefined> {
		const stores: Array<BaseStore<DBObject, SearchQuery>> =
			[this.folderStore, this.trackStore, this.albumStore, this.artistStore, this.podcastStore, this.episodeStore, this.playlistStore, this.artistStore, this.albumStore, this.radioStore, this.userStore];
		for (const store of stores) {
			const obj = await store.byId(id);
			if (obj) {
				return obj;
			}
		}
	}

	async findMultiInAll(ids: Array<string>): Promise<Array<DBObject>> {
		let result: Array<DBObject> = [];
		const stores: Array<BaseStore<DBObject, SearchQuery>> =
			[this.folderStore, this.trackStore, this.albumStore, this.artistStore, this.podcastStore, this.episodeStore, this.playlistStore, this.artistStore, this.albumStore, this.radioStore, this.userStore];
		for (const store of stores) {
			const objs = await store.byIds(ids);
			result = result.concat(objs);
		}
		return result;
	}

	async cleanStore(removeTracks: Array<Track>, removeFolders: Array<Folder>): Promise<Array<string>> {
		let ids: Array<string> = [];
		if (removeFolders.length > 0) {
			log.debug('Cleaning folders', removeFolders.length);
			const folderIDs = removeFolders.map(folder => folder.id);
			await this.folderStore.remove(folderIDs);
			await this.stateStore.removeByQuery({destIDs: folderIDs, type: DBObjectType.folder});
			ids = folderIDs;
		}
		if (removeTracks.length > 0) {
			log.debug('Cleaning tracks', removeTracks.length);
			const trackIDs = removeTracks.map(track => track.id);
			await this.trackStore.remove(trackIDs);
			await this.stateStore.removeByQuery({destIDs: trackIDs, type: DBObjectType.track});
			await this.bookmarkStore.removeByQuery({destIDs: trackIDs});
			const playlists = await this.playlistStore.search({trackIDs: trackIDs});
			ids = ids.concat(trackIDs);
			if (playlists.length > 0) {
				for (const playlist of playlists) {
					playlist.trackIDs = playlist.trackIDs.filter(id => trackIDs.indexOf(id) < 0);
					if (playlist.trackIDs.length === 0) {
						await this.playlistStore.remove(playlist.id);
					} else {
						await updatePlayListTracks(this.trackStore, playlist);
						await this.playlistStore.replace(playlist);
					}
				}

			}
		}
		return ids;
	}

}
