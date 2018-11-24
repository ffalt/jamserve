import path from 'path';
import {IoService} from './io/io.service';
import {Store} from './store';
import {AudioService} from './audio/audio.service';
import {DBObjectType} from '../types';
import {makePath} from '../utils/fs-utils';
import {IndexService} from './index/index.service';
import {MetaDataService} from './metadata/metadata.service';
import {UserService} from './user/user.service';
import {ChatService} from './chat/chat.service';
import {GenreService} from './genre/genre.service';
import {PodcastService} from './podcast/podcast.service';
import {NowPlaylingService} from './nowplaying/nowplaying.service';
import {RootService} from './root/root.service';
import {PlaylistService} from './playlist/playlist.service';
import {PlayqueueService} from './playqueue/playqueue.service';
import {Config} from '../config';
import {WaveformService} from './waveform/waveform.service';
import {StreamService} from './stream/stream.service';
import {BookmarkService} from './bookmark/bookmark.service';
import {StateService} from './state/state.service';
import {ImageService} from './image/image.service';
import {DownloadService} from './download/download.service';
import {ListService} from './list/list.service';
import {User} from './user/user.model';
import {Root} from './root/root.model';

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
	public playqueueService: PlayqueueService;
	public podcastService: PodcastService;
	public playlistService: PlaylistService;
	public nowPlaylingService: NowPlaylingService;
	public streamService: StreamService;
	public bookmarkService: BookmarkService;
	public stateService: StateService;
	public imageService: ImageService;
	public downloadService: DownloadService;
	public listService: ListService;

	constructor(config: Config) {
		this.config = config;
		this.store = new Store(config);
		this.audioService = new AudioService(config);
		this.waveformService = new WaveformService(config);
		this.imageService = new ImageService(config, this.store);
		this.ioService = new IoService(this.store, this.audioService, this.imageService, this.waveformService);
		this.downloadService = new DownloadService(this.store);
		this.chatService = new ChatService(config);
		this.genreService = new GenreService(this.store);
		this.nowPlaylingService = new NowPlaylingService(this.store);
		this.streamService = new StreamService(this.nowPlaylingService);
		this.playlistService = new PlaylistService(this.store);
		this.playqueueService = new PlayqueueService(this.store);
		this.bookmarkService = new BookmarkService(this.store.bookmarkStore);
		this.podcastService = new PodcastService(this.config, this.store, this.audioService);
		this.indexService = new IndexService(config, this.store, this.ioService);
		this.userService = new UserService(this.config, this.store, this.imageService);
		this.metaDataService = new MetaDataService(this.store, this.audioService);
		this.listService = new ListService(this.store.stateStore);
		this.rootService = new RootService(this.store, this.ioService, this.indexService, this.genreService);
		this.stateService = new StateService(this.store.stateStore);
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
					ldapAuthenticated: true,
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
				await this.store.userStore.add(user);
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
		await makePath(path.resolve(this.config.paths.data));
		await makePath(path.resolve(this.config.paths.data, 'cache', 'waveforms'));
		await makePath(path.resolve(this.config.paths.data, 'cache', 'uploads'));
		await makePath(path.resolve(this.config.paths.data, 'cache', 'images'));
		await makePath(path.resolve(this.config.paths.data, 'images'));
		await makePath(path.resolve(this.config.paths.data, 'session'));
		await makePath(path.resolve(this.config.paths.data, 'podcasts'));
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

