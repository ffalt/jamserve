import fse from 'fs-extra';
import path from 'path';
import {Config} from '../config';
import {ThirdPartyConfig} from '../config/thirdparty.config';
import {DBObjectType} from '../db/db.types';
import {RootScanStrategy} from '../model/jam-types';
import {AudioModule} from '../modules/audio/audio.module';
import {ImageModule} from '../modules/image/image.module';
import {pathDeleteIfExists} from '../utils/fs-utils';
import {logger} from '../utils/logger';
import {randomString} from '../utils/random';
import {hashSaltPassword} from '../utils/salthash';
import {AlbumService} from './album/album.service';
import {ArtistService} from './artist/artist.service';
import {BookmarkService} from './bookmark/bookmark.service';
import {ChatService} from './chat/chat.service';
import {DownloadService} from './download/download.service';
import {EpisodeService} from './episode/episode.service';
import {FolderService} from './folder/folder.service';
import {GenreService} from './genre/genre.service';
import {ImageService} from './image/image.service';
import {IndexService} from './index/index.service';
import {IoService} from './io/io.service';
import {MetaDataService} from './metadata/metadata.service';
import {NowPlayingService} from './nowplaying/nowplaying.service';
import {PlaylistService} from './playlist/playlist.service';
import {PlayQueueService} from './playqueue/playqueue.service';
import {PodcastService} from './podcast/podcast.service';
import {RadioService} from './radio/radio.service';
import {Root} from './root/root.model';
import {RootService} from './root/root.service';
import {ScanService} from './scan/scan.service';
import {SettingsService} from './settings/settings.service';
import {StateService} from './state/state.service';
import {StatsService} from './stats/stats.service';
import {Store} from './store/store';
import {StreamService} from './stream/stream.service';
import {TrackService} from './track/track.service';
import {User} from './user/user.model';
import {UserService} from './user/user.service';
import {WaveformService} from './waveform/waveform.service';
import {SessionService} from './session/session.service';

const log = logger('Engine');

export class Engine {
	public ioService: IoService;
	public audioModule: AudioModule;
	public imageModule: ImageModule;
	public waveformService: WaveformService;
	public metaDataService: MetaDataService;
	public indexService: IndexService;
	public scanService: ScanService;
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
	public statsService: StatsService;
	public settingsService: SettingsService;
	public sessionService: SessionService;

	constructor(public config: Config, public store: Store, public version: string) {
		this.chatService = new ChatService();
		this.imageModule = new ImageModule(config.getDataPath(['cache', 'images']));
		this.audioModule = new AudioModule(ThirdPartyConfig, this.imageModule);
		this.waveformService = new WaveformService(config.getDataPath(['cache', 'waveforms']));
		this.stateService = new StateService(this.store.stateStore);
		this.folderService = new FolderService(this.store.folderStore, this.store.trackStore, this.stateService, this.imageModule);
		this.trackService = new TrackService(this.store.trackStore, this.folderService, this.stateService);
		this.albumService = new AlbumService(this.store.albumStore, this.store.trackStore, this.folderService, this.stateService);
		this.indexService = new IndexService(this.store.artistStore, this.store.albumStore, this.store.folderStore, this.store.trackStore);
		this.scanService = new ScanService(this.store, this.audioModule, this.imageModule, this.waveformService);
		this.settingsService = new SettingsService(store.settingsStore, this.chatService, this.indexService, this.scanService, version);
		this.artistService = new ArtistService(this.store.artistStore, this.store.trackStore, this.folderService, this.stateService);
		this.userService = new UserService(this.config.getDataPath(['images']), this.store.userStore, this.store.stateStore, this.store.playlistStore,
			this.store.bookmarkStore, this.store.playQueueStore, this.imageModule);
		this.genreService = new GenreService(this.store.trackStore);
		this.statsService = new StatsService(this.store);
		this.ioService = new IoService(this.store.rootStore, this.scanService, async () => {
			this.refresh().catch(e => {
				log.error('Error on Refresh Indexes & Stats', e);
			});
		});
		this.downloadService = new DownloadService(this.store.trackStore, this.store.episodeStore);
		this.nowPlayingService = new NowPlayingService(this.stateService);
		this.streamService = new StreamService();
		this.playlistService = new PlaylistService(this.store.playlistStore, this.store.trackStore, this.stateService);
		this.playQueueService = new PlayQueueService(this.store.playQueueStore);
		this.bookmarkService = new BookmarkService(this.store.bookmarkStore);
		this.episodeService = new EpisodeService(config.getDataPath(['podcasts']), this.store.episodeStore, this.stateService, this.audioModule);
		this.podcastService = new PodcastService(config.getDataPath(['podcasts']), this.store.podcastStore, this.episodeService, this.imageModule, this.stateService);
		this.imageService = new ImageService(this.imageModule, this.trackService, this.folderService, this.artistService, this.albumService, this.userService, this.podcastService);
		this.metaDataService = new MetaDataService(this.store.metaStore, this.store.folderStore, this.store.trackStore, this.store.albumStore, this.store.artistStore, this.audioModule);
		this.rootService = new RootService(this.store.rootStore);
		this.radioService = new RadioService(this.store.radioStore);
		this.sessionService = new SessionService(this.store.sessionStore);
	}

	async refresh(): Promise<void> {
		log.info('Refresh Indexes & Stats');
		await this.indexService.buildDefaultIndexes();
		await this.genreService.refresh();
		await this.statsService.refresh();
		await this.metaDataService.cleanUp();
	}

	private async checkFirstStart(): Promise<void> {
		if (!this.config.firstStart) {
			return;
		}
		if (this.config.firstStart.adminUser) {
			const count = await this.store.userStore.count();
			if (count === 0) {
				const adminUser = this.config.firstStart.adminUser;
				const pw = hashSaltPassword(adminUser.pass || '');
				const user: User = {
					id: '',
					name: adminUser.name,
					salt: pw.salt,
					hash: pw.hash,
					subsonic_pass: randomString(10),
					email: adminUser.mail || '',
					type: DBObjectType.user,
					// ldapAuthenticated: true,
					scrobblingEnabled: true,
					created: Date.now(),
					roles: {
						stream: true,
						upload: true,
						admin: true,
						podcast: true
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
						path: first.path,
						strategy: first.strategy as RootScanStrategy || RootScanStrategy.auto
					};
					await this.store.rootStore.add(root);
				}
			}
		}
	}

	private resolveCachePaths(): Array<string> {
		return [
			path.resolve(this.config.paths.data, 'cache', 'waveforms'),
			path.resolve(this.config.paths.data, 'cache', 'uploads'),
			path.resolve(this.config.paths.data, 'cache', 'images'),
			path.resolve(this.config.paths.data, 'images'),
			path.resolve(this.config.paths.data, 'session'),
			path.resolve(this.config.paths.data, 'podcasts')
		];
	}

	private async checkDataPaths(): Promise<void> {
		await fse.ensureDir(path.resolve(this.config.paths.data));
		const paths = this.resolveCachePaths();
		for (const p of paths) {
			await fse.ensureDir(p);
		}
	}

	async start(): Promise<void> {
		// check paths
		await this.checkDataPaths();
		// open store
		await this.store.open();
		// load settings
		await this.settingsService.loadSettings();
		// first start?
		await this.checkFirstStart();
	}

	async stop(): Promise<void> {
		await this.store.close();
	}

	async clearLocalFiles(): Promise<void> {
		const paths = this.resolveCachePaths();
		for (const p of paths) {
			await pathDeleteIfExists(p);
		}
	}
}
