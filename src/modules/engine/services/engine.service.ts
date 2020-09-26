import path from 'path';
import fse from 'fs-extra';
import {SettingsService} from '../../../entity/settings/settings.service';
import {IoService} from './io.service';
import {ConfigService} from './config.service';
import {JAMSERVE_VERSION} from '../../../version';
import {Orm, OrmService} from './orm.service';
import {WaveformService} from '../../../entity/waveform/waveform.service';
import {Inject, InRequestScope} from 'typescript-ioc';
import {logger} from '../../../utils/logger';
import {RootScanStrategy} from '../../../types/enums';
import {UserService} from '../../../entity/user/user.service';
import {SessionService} from '../../../entity/session/session.service';
import {PodcastService} from '../../../entity/podcast/podcast.service';
import {EpisodeService} from '../../../entity/episode/episode.service';
import {GenreService} from '../../../entity/genre/genre.service';
import {StatsService} from '../../../entity/stats/stats.service';
import {MetaDataService} from '../../../entity/metadata/metadata.service';
import {AudioModule} from '../../audio/audio.module';
import {StateService} from '../../../entity/state/state.service';
import {NowPlayingService} from '../../../entity/nowplaying/nowplaying.service';
import {PlayQueueService} from '../../../entity/playqueue/playqueue.service';
import {ChatService} from '../../../entity/chat/chat.service';
import {TrackService} from '../../../entity/track/track.service';
import {ArtworkService} from '../../../entity/artwork/artwork.service';
import {DownloadService} from '../../../entity/download/download.service';
import {FolderService} from '../../../entity/folder/folder.service';
import {ImageService} from '../../../entity/image/image.service';
import {PlaylistService} from '../../../entity/playlist/playlist.service';
import {StreamService} from '../../../entity/stream/stream.service';
import {TransformService} from './transform.service';
import {BookmarkService} from '../../../entity/bookmark/bookmark.service';
import {RateLimitService} from './ratelimit.service';

const log = logger('Engine');

@InRequestScope
export class EngineService {
	@Inject public artwork!: ArtworkService;
	@Inject public audio!: AudioModule;
	@Inject public chat!: ChatService;
	@Inject public config!: ConfigService;
	@Inject public download!: DownloadService;
	@Inject public episode!: EpisodeService;
	@Inject public folder!: FolderService;
	@Inject public genre!: GenreService;
	@Inject public image!: ImageService;
	@Inject public io!: IoService;
	@Inject public metadata!: MetaDataService;
	@Inject public nowPlaying!: NowPlayingService;
	@Inject public orm!: OrmService;
	@Inject public playlist!: PlaylistService;
	@Inject public playQueue!: PlayQueueService;
	@Inject public podcast!: PodcastService;
	@Inject public session!: SessionService;
	@Inject public settings!: SettingsService;
	@Inject public state!: StateService;
	@Inject public stats!: StatsService;
	@Inject public stream!: StreamService;
	@Inject public track!: TrackService;
	@Inject public transform!: TransformService;
	@Inject public user!: UserService;
	@Inject public waveform!: WaveformService;
	@Inject public bookmark!: BookmarkService;
	@Inject public rateLimit!: RateLimitService;

	constructor() {
		this.io.registerAfterRefresh((): Promise<void> => this.afterRefresh());
	}

	private async afterRefresh(): Promise<void> {
		// nop
	}

	private resolveCachePaths(): Array<string> {
		return [
			this.config.getDataPath(['cache', 'waveforms']),
			this.config.getDataPath(['cache', 'uploads']),
			this.config.getDataPath(['cache', 'images']),
			this.config.getDataPath(['cache', 'transcode']),
			this.config.getDataPath(['images']),
			this.config.getDataPath(['podcasts'])
		];
	}

	private async checkRescan(orm: Orm): Promise<void> {
		const version = await this.settings.settingsVersion(orm);
		const forceRescan = !!version && version !== JAMSERVE_VERSION;
		if (forceRescan) {
			log.info(`Updating from version ${version || '-'}`);
		}
		if (forceRescan || this.settings.settings.library.scanAtStart) {
			log.info(`Starting rescan`);
			this.io.startUpRefresh(orm, forceRescan).then(() => {
				return forceRescan ? this.settings.saveSettings(orm) : undefined;
			}).catch(e => {
				log.error('Error on startup scanning', e);
			});
		}
	}

	private async checkDataPaths(): Promise<void> {
		await fse.ensureDir(path.resolve(this.config.env.paths.data));
		const paths = this.resolveCachePaths();
		for (const p of paths) {
			await fse.ensureDir(p);
		}
	}

	async init(): Promise<void> {
		log.debug(`check data paths`);
		await this.checkDataPaths();
		log.debug(`init orm`);
		await this.orm.init(this.config);
	}

	async start(): Promise<void> {
		log.debug(`start orm`);
		await this.orm.start();
		const orm = this.orm.fork();
		log.debug(`load settings`);
		await this.settings.loadSettings(orm);
		log.debug(`check first start`);
		await this.checkFirstStart(orm);
		log.debug(`check for rescan`);
		await this.checkRescan(orm);
	}

	async stop(): Promise<void> {
		await this.orm.stop();
	}

	private async buildAdminUser(orm: Orm, admin: { name: string; pass: string; mail: string }): Promise<void> {
		await this.user.createUser(orm, admin.name, admin.mail || '', admin.pass, true, true, true, true);
	}

	private static async buildRoots(orm: Orm, roots: Array<{ name: string; path: string; strategy?: RootScanStrategy }>): Promise<void> {
		for (const first of roots) {
			const root = orm.Root.create({
				name: first.name,
				path: first.path,
				strategy: first.strategy as RootScanStrategy || RootScanStrategy.auto
			});
			await orm.Root.persistAndFlush(root);
		}
	}

	private async checkFirstStart(orm: Orm): Promise<void> {
		if (!this.config.firstStart) {
			return;
		}
		if (this.config.firstStart.adminUser) {
			const count = await orm.User.count();
			if (count === 0) {
				await this.buildAdminUser(orm, this.config.firstStart.adminUser);
			}
		}
		if (this.config.firstStart.roots) {
			const count = await orm.Root.count();
			if (count === 0) {
				await EngineService.buildRoots(orm, this.config.firstStart.roots);
			}
		}
	}
}
