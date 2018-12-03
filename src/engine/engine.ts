import path from 'path';
import fse from 'fs-extra';
import {IoService} from './io/io.service';
import {Store} from './store';
import {AudioService} from './audio/audio.service';
import {DBObjectType} from '../types';
import {IndexService} from './index/index.service';
import {MetaDataService} from './metadata/metadata.service';
import {UserService} from '../objects/user/user.service';
import {ChatService} from './chat/chat.service';
import {GenreService} from './genre/genre.service';
import {PodcastService} from '../objects/podcast/podcast.service';
import {NowPlayingService} from './nowplaying/nowplaying.service';
import {RootService} from '../objects/root/root.service';
import {PlaylistService} from '../objects/playlist/playlist.service';
import {PlayQueueService} from '../objects/playqueue/playqueue.service';
import {Config} from '../config';
import {WaveformService} from './waveform/waveform.service';
import {StreamService} from './stream/stream.service';
import {BookmarkService} from '../objects/bookmark/bookmark.service';
import {StateService} from '../objects/state/state.service';
import {ImageService} from './image/image.service';
import {DownloadService} from './download/download.service';
import {ListService} from './list/list.service';
import {User} from '../objects/user/user.model';
import {Root} from '../objects/root/root.model';
import {RadioService} from '../objects/radio/radio.service';
import {FolderService} from '../objects/folder/folder.service';

export class Engine {
	public config: Config;
	public store: Store;
	public ioService: IoService;
	public audioService: AudioService;
	public waveformService: WaveformService;
	public metaDataService: MetaDataService;
	public indexService: IndexService;
	public userService: UserService;
	public rootService: RootService;
	public chatService: ChatService;
	public genreService: GenreService;
	public playQueueService: PlayQueueService;
	public podcastService: PodcastService;
	public playlistService: PlaylistService;
	public nowPlayingService: NowPlayingService;
	public streamService: StreamService;
	public bookmarkService: BookmarkService;
	public stateService: StateService;
	public imageService: ImageService;
	public downloadService: DownloadService;
	public listService: ListService;
	public radioService: RadioService;
	public folderService: FolderService;

	constructor(config: Config) {
		this.config = config;
		this.store = new Store(config);
		this.audioService = new AudioService(config.tools);
		this.waveformService = new WaveformService(config.getDataPath(['cache', 'waveforms']));
		this.imageService = new ImageService(config.getDataPath(['cache', 'images']), this.config.getDataPath(['images']), this.store.folderStore, this.store.trackStore);
		this.ioService = new IoService(this.store, this.audioService, this.imageService, this.waveformService);
		this.downloadService = new DownloadService(this.store.trackStore);
		this.chatService = new ChatService(config.app.chat);
		this.folderService = new FolderService(this.store.folderStore, this.ioService);
		this.genreService = new GenreService(this.store.trackStore);
		this.stateService = new StateService(this.store.stateStore);
		this.nowPlayingService = new NowPlayingService(this.stateService);
		this.streamService = new StreamService(this.nowPlayingService);
		this.playlistService = new PlaylistService(this.store.playlistStore, this.store.trackStore);
		this.playQueueService = new PlayQueueService(this.store.playQueueStore);
		this.bookmarkService = new BookmarkService(this.store.bookmarkStore);
		this.podcastService = new PodcastService(config.getDataPath(['podcasts']), this.store.podcastStore, this.store.episodeStore, this.audioService);
		this.indexService = new IndexService(config.app.index, this.store.artistStore, this.store.folderStore, this.store.trackStore, this.ioService);
		this.userService = new UserService(this.store.userStore, this.store.stateStore, this.store.playlistStore, this.store.bookmarkStore, this.store.playQueueStore, this.imageService);
		this.metaDataService = new MetaDataService(this.store.folderStore, this.store.trackStore, this.store.albumStore, this.store.artistStore, this.audioService);
		this.listService = new ListService(this.store.stateStore);
		this.rootService = new RootService(this.store.rootStore, this.ioService, this.indexService, this.genreService);
		this.radioService = new RadioService(this.store.radioStore);
	}

	private async checkFirstStart(): Promise<void> {
		if (!this.config.firstStart) {
			return;
		}
		if (this.config.firstStart.adminUser) {
			const count = await this.store.userStore.count();
			if (count === 0) {
				const adminUser = this.config.firstStart.adminUser;
				const user: User = {
					id: '',
					name: adminUser.name,
					pass: adminUser.pass || '',
					email: adminUser.mail || '',
					type: DBObjectType.user,
					// ldapAuthenticated: true,
					scrobblingEnabled: true,
					created: Date.now(),
					roles: {
						streamRole: true,
						uploadRole: true,
						adminRole: true,
						podcastRole: true,
						// coverArtRole: true,
						// settingsRole: true,
						// downloadRole: true,
						// playlistRole: true,
						// commentRole: true,
						// jukeboxRole: true,
						// videoConversionRole: true,
						// shareRole: true
					}
				};
				await this.userService.createUser(user);
			}
		}
		if (this.config.firstStart.roots) {
			const count = await this.store.rootStore.count();
			if (count === 0) {
				const firstStartRoots = this.config.firstStart.roots;
				for (const first of firstStartRoots) {
					const root: Root = {
						id: '',
						created: Date.now(),
						type: DBObjectType.root,
						name: first.name,
						path: first.path
					};
					await this.store.rootStore.add(root);
				}
			}
		}
	}

	private async checkDataPaths(): Promise<void> {
		await fse.ensureDir(path.resolve(this.config.paths.data));
		await fse.ensureDir(path.resolve(this.config.paths.data, 'cache', 'waveforms'));
		await fse.ensureDir(path.resolve(this.config.paths.data, 'cache', 'uploads'));
		await fse.ensureDir(path.resolve(this.config.paths.data, 'cache', 'images'));
		await fse.ensureDir(path.resolve(this.config.paths.data, 'images'));
		await fse.ensureDir(path.resolve(this.config.paths.data, 'session'));
		await fse.ensureDir(path.resolve(this.config.paths.data, 'podcasts'));
	}

	async start(): Promise<void> {
		// check paths
		await this.checkDataPaths();
		// open store
		await this.store.open();
		// first start?
		await this.checkFirstStart();
	}

	async stop(): Promise<void> {
		await this.store.close();
	}

}

