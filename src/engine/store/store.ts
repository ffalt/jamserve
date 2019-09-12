import {Database} from '../../db/db.model';
import {logger} from '../../utils/logger';
import {AlbumStore} from '../album/album.store';
import {ArtistStore} from '../artist/artist.store';
import {DBObject} from '../base/base.model';
import {BaseStore, SearchQuery} from '../base/base.store';
import {BookmarkStore} from '../bookmark/bookmark.store';
import {EpisodeStore} from '../episode/episode.store';
import {FolderStore} from '../folder/folder.store';
import {MetaDataStore} from '../metadata/metadata.store';
import {PlaylistStore} from '../playlist/playlist.store';
import {PlayQueueStore} from '../playqueue/playqueue.store';
import {PodcastStore} from '../podcast/podcast.store';
import {RadioStore} from '../radio/radio.store';
import {RootStore} from '../root/root.store';
import {SettingsStore} from '../settings/settings.store';
import {StateStore} from '../state/state.store';
import {TrackStore} from '../track/track.store';
import {UserStore} from '../user/user.store';

const log = logger('Store');

export class Store {
	public settingsStore: SettingsStore;
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
	public metaStore: MetaDataStore;

	constructor(public db: Database) {
		this.settingsStore = new SettingsStore(this.db);
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
		this.metaStore = new MetaDataStore(this.db);
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

}
