import {hashAndSaltSHA512} from '../../../utils/hash';
import {RootScanStrategy} from '../../../types/enums';
import path from 'path';
import fse from 'fs-extra';
import {SettingsService} from '../../../entity/settings/settings.service';
import {IoService} from './io.service';
import {ConfigService} from './config.service';
import {JAMSERVE_VERSION} from '../../../version';
import {OrmService} from './orm.service';
import {WaveformService} from '../../../entity/waveform/waveform.service';
import {Inject, Singleton} from 'typescript-ioc';
import {logger} from '../../../utils/logger';
import {UserService} from '../../../entity/user/user.service';
import {SessionService} from '../../../entity/settings/session.service';
import {PodcastService} from '../../../entity/podcast/podcast.service';
import {EpisodeService} from '../../../entity/episode/episode.service';
import {GenreService} from '../../../entity/genre/genre.service';
import {StatsService} from '../../../entity/stats/stats.service';
import {MetaDataService} from '../../../entity/metadata/metadata.service';
import {AudioModule} from '../../audio/audio.module';
import {StateService} from '../../../entity/state/state.service';
import {NowPlayingService} from '../../../entity/nowplaying/nowplaying.service';
import {PlayQueueService} from '../../../entity/playqueue/playqueue.service';

const log = logger('Engine');

@Singleton
export class EngineService {
	@Inject
	public configService!: ConfigService;
	@Inject
	public orm!: OrmService;
	@Inject
	public settingsService!: SettingsService;
	@Inject
	public stateService!: StateService;
	@Inject
	public ioService!: IoService;
	@Inject
	public audioModule!: AudioModule;
	@Inject
	public waveformService!: WaveformService;
	@Inject
	public metadataService!: MetaDataService;
	@Inject
	public userService!: UserService;
	@Inject
	public nowPlayingService!: NowPlayingService;
	@Inject
	public sessionService!: SessionService;
	@Inject
	public podcastService!: PodcastService;
	@Inject
	public episodeService!: EpisodeService;
	@Inject
	public genreService!: GenreService;
	@Inject
	public statsService!: StatsService;
	@Inject
	public playQueueService!: PlayQueueService;

	constructor() {
		this.ioService.registerAfterRefresh((): Promise<void> => this.afterRefresh())
	}

	private async afterRefresh(): Promise<void> {
		// nop
	}

	private resolveCachePaths(): Array<string> {
		return [
			this.configService.getDataPath(['cache', 'waveforms']),
			this.configService.getDataPath(['cache', 'uploads']),
			this.configService.getDataPath(['cache', 'images']),
			this.configService.getDataPath(['cache', 'transcode']),
			this.configService.getDataPath(['images']),
			this.configService.getDataPath(['podcasts'])
		];
	}

	private async checkRescan(): Promise<void> {
		const version = await this.settingsService.settingsVersion();
		const forceRescan = !!version && version !== JAMSERVE_VERSION;
		if (forceRescan) {
			log.info(`Updating from version ${version || '-'}`);
		}
		if (forceRescan || this.settingsService.settings.library.scanAtStart) {
			this.ioService.refresh().then(() => {
				return forceRescan ? this.settingsService.saveSettings() : undefined;
			}).catch(e => {
				log.error('Error on startup scanning', e);
			});
		}
	}

	private async checkDataPaths(): Promise<void> {
		await fse.ensureDir(path.resolve(this.configService.env.paths.data));
		const paths = this.resolveCachePaths();
		for (const p of paths) {
			await fse.ensureDir(p);
		}
	}

	async start(): Promise<void> {
		// check paths
		await this.checkDataPaths();
		// init orm
		await this.orm.start(this.configService.env.paths.data);
		// first start?
		await this.checkFirstStart();
		// check rescan?
		await this.checkRescan();
	}

	public async stop() {
		await this.orm.stop();
	}

	private async buildAdminUser(admin: { name: string; pass: string; mail: string }): Promise<void> {
		const pw = hashAndSaltSHA512(admin.pass || '');
		const user = this.orm.User.create({
			name: admin.name,
			salt: pw.salt,
			hash: pw.hash,
			email: admin.mail || '',
			roleAdmin: true,
			rolePodcast: true,
			roleStream: true,
			roleUpload: true
		})
		await this.orm.orm.em.persistAndFlush(user);
	}

	private async buildRoots(roots: Array<{ name: string; path: string; strategy?: RootScanStrategy }>): Promise<void> {
		for (const first of roots) {
			const root = this.orm.Root.create({
				name: first.name,
				path: first.path,
				strategy: first.strategy as RootScanStrategy || RootScanStrategy.auto
			})
			await this.orm.orm.em.persistAndFlush(root);
		}
	}

	private async checkFirstStart(): Promise<void> {
		if (!this.configService.firstStart) {
			return;
		}
		if (this.configService.firstStart.adminUser) {
			const count = await this.orm.User.count();
			if (count === 0) {
				await this.buildAdminUser(this.configService.firstStart.adminUser);
			}
		}
		if (this.configService.firstStart.roots) {
			const count = await this.orm.Root.count();
			if (count === 0) {
				await this.buildRoots(this.configService.firstStart.roots);
			}
		}
	}

}
