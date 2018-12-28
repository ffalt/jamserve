import path from 'path';
import fse from 'fs-extra';
import {IoService} from './io/io.service';
import {Store} from './store/store';
import {AudioModule} from '../modules/audio/audio.module';
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
import {User} from '../objects/user/user.model';
import {Root} from '../objects/root/root.model';
import {RadioService} from '../objects/radio/radio.service';
import {FolderService} from '../objects/folder/folder.service';
import {ImageModule} from '../modules/image/image.module';
import {TrackService} from '../objects/track/track.service';
import {ArtistService} from '../objects/artist/artist.service';
import {AlbumService} from '../objects/album/album.service';
import {EpisodeService} from '../objects/episode/episode.service';
import {ThirdPartyConfig} from '../config/thirdparty.config';

export class Engine {
	public ioService: IoService;
	public audioModule: AudioModule;
	public imageModule: ImageModule;
	public waveformService: WaveformService;
	public metaDataService: MetaDataService;
	public indexService: IndexService;
	public userService: UserService;
	public rootService: RootService;
	public chatService: ChatService;
	public genreService: GenreService;
	public playQueueService: PlayQueueService;
	public podcastService: PodcastService;
	public episodeService: EpisodeService;
	public playlistService: PlaylistService;
	public nowPlayingService: NowPlayingService;
	public streamService: StreamService;
	public bookmarkService: BookmarkService;
	public stateService: StateService;
	public imageService: ImageService;
	public downloadService: DownloadService;
	public radioService: RadioService;
	public folderService: FolderService;
	public trackService: TrackService;
	public artistService: ArtistService;
	public albumService: AlbumService;

	constructor(public config: Config, public store: Store) {
		this.audioModule = new AudioModule(ThirdPartyConfig);
		this.waveformService = new WaveformService(config.getDataPath(['cache', 'waveforms']));
		this.imageModule = new ImageModule(config.getDataPath(['cache', 'images']));
		this.stateService = new StateService(this.store.stateStore);
		this.folderService = new FolderService(this.store.folderStore, this.store.trackStore, this.stateService, this.imageModule);
		this.trackService = new TrackService(this.store.trackStore, this.folderService, this.stateService);
		this.artistService = new ArtistService(this.store.artistStore, this.store.trackStore, this.folderService, this.stateService);
		this.albumService = new AlbumService(this.store.albumStore, this.store.trackStore, this.folderService, this.stateService);
		this.userService = new UserService(this.config.getDataPath(['images']), this.store.userStore, this.store.stateStore, this.store.playlistStore,
			this.store.bookmarkStore, this.store.playQueueStore, this.imageModule);
		this.imageService = new ImageService(this.imageModule, this.trackService, this.folderService, this.artistService, this.albumService, this.userService);
		this.genreService = new GenreService(this.store.trackStore);
		this.indexService = new IndexService(config.app.index, this.store.artistStore, this.store.folderStore, this.store.trackStore);
		this.ioService = new IoService(this.store, this.audioModule, this.imageModule, this.waveformService, this.indexService, this.genreService);
		this.downloadService = new DownloadService(this.store.trackStore);
		this.chatService = new ChatService(config.app.chat);
		this.nowPlayingService = new NowPlayingService(this.stateService);
		this.streamService = new StreamService();
		this.playlistService = new PlaylistService(this.store.playlistStore, this.store.trackStore);
		this.playQueueService = new PlayQueueService(this.store.playQueueStore);
		this.bookmarkService = new BookmarkService(this.store.bookmarkStore);
		this.episodeService = new EpisodeService(config.getDataPath(['podcasts']), this.store.episodeStore, this.stateService, this.audioModule);
		this.podcastService = new PodcastService(this.store.podcastStore, this.episodeService, this.stateService);
		this.metaDataService = new MetaDataService(this.store.folderStore, this.store.trackStore, this.store.albumStore, this.store.artistStore, this.audioModule);
		this.rootService = new RootService(this.store.rootStore);
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
				await this.userService.create(user);
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

