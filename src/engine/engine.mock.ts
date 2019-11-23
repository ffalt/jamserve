import tmp from 'tmp';
import {Config, extendConfig} from '../config/config';
import {DBType, JamServeConfig} from '../config/jamserve.config';
import {Database} from '../db/db.model';
import {TestDB} from '../db/db.spec';
import {DBObjectType} from '../db/db.types';
import {mockElasticDBConfig} from '../db/elasticsearch/db-elastic.spec';
import {RootScanStrategy} from '../model/jam-types';
import {AudioModuleTest} from '../modules/audio/audio.module.spec';
import {ImageModuleTest} from '../modules/image/image.module.spec';
import {JAMSERVE_VERSION} from '../version';
import {Engine} from './engine';
import {mockEpisode, mockEpisode2} from './episode/episode.mock';
import {mockPlaylist} from './playlist/playlist.mock';
import {mockPodcast} from './podcast/podcast.mock';
import {Store} from './store/store';
import {buildMockRoot, MockRoot, removeMockRoot, writeMockRoot} from './store/store.mock';
import {mockUser} from './user/user.mock';

export class TestEngineDataMock {
	dir: tmp.DirResult;
	mockRoot: MockRoot;

	constructor(public engine: Engine) {
		this.dir = tmp.dirSync();
		this.mockRoot = buildMockRoot(this.dir.name, 1, 'rootID');
	}

	async setup(): Promise<void> {
		const userID = await this.engine.userService.create(mockUser());
		await writeMockRoot(this.mockRoot);
		this.mockRoot.id = await this.engine.rootService.rootStore.add(
			{
				id: '',
				path: this.mockRoot.path,
				type: DBObjectType.root,
				name: this.mockRoot.name,
				strategy: RootScanStrategy.auto,
				created: Date.now()
			});
		await this.engine.workerService.refreshRoot({rootID: this.mockRoot.id, forceMetaRefresh: false});
		const podcastID = await this.engine.podcastService.podcastStore.add(mockPodcast());
		const episode = mockEpisode();
		episode.podcastID = podcastID;
		await this.engine.episodeService.episodeStore.add(episode);
		const episode2 = mockEpisode2();
		episode2.podcastID = podcastID;
		await this.engine.episodeService.episodeStore.add(episode2);
		const playlist = mockPlaylist();
		playlist.userID = userID;
		playlist.trackIDs = await this.engine.trackService.trackStore.allIds();
		await this.engine.playlistService.playlistStore.add(playlist);
	}

	async cleanup(): Promise<void> {
		await removeMockRoot(this.mockRoot);
		this.dir.removeCallback();
	}
}

export class TestEngine {
	engine!: Engine;
	engineMock!: TestEngineDataMock;
	imageModuleTest!: ImageModuleTest;
	audioModuleTest!: AudioModuleTest;
	dir: tmp.DirResult;

	constructor(public name: string, public useDB: DBType, public testDB: TestDB) {
		this.dir = tmp.dirSync();
	}

	protected async init(config: Config, db: Database): Promise<void> {
		this.imageModuleTest = new ImageModuleTest();
		await this.imageModuleTest.setup();
		this.audioModuleTest = new AudioModuleTest(this.imageModuleTest.imageModule);
		await this.audioModuleTest.setup();
		this.engine = new Engine(config, new Store(db), JAMSERVE_VERSION, {audio: this.audioModuleTest.audioModule, image: this.imageModuleTest.imageModule});
		this.engineMock = new TestEngineDataMock(this.engine);
	}

	async setup(): Promise<void> {
		await this.testDB.setup();
		const config = mockupConfig(this.dir.name, this.useDB);
		await this.init(config, this.testDB.database);
		await this.engineMock.setup();
	}

	async cleanup(): Promise<void> {
		await this.testDB.cleanup();
		await this.imageModuleTest.cleanup();
		await this.audioModuleTest.cleanup();
		await this.engineMock.cleanup();
		this.dir.removeCallback();
	}
}

function mockupConfig(testPath: string, useDB: DBType): Config {
	const mockBaseConfig: JamServeConfig = {
		log: {level: 'warn'},
		server: {
			listen: '0.0.0.0',
			port: 4041,
			session: {
				allowedCookieDomains: ['http://localhost:4041'],
				secret: '23409hj35bnkj34b5k345bhjk34534534',
				cookie: {
					name: 'jam-test.sid',
					secure: false,
					proxy: false,
					maxAge: {value: 5, unit: 'minute'}
				}
			},
			jwt: {
				secret: 'fksdjf4rk3j4b3k3bj45hv3j45hv3j4534534',
				maxAge: {value: 5, unit: 'minute'}
			},
			limit: {login: {max: 5, window: 60}, api: {max: 4000, window: 60}}
		},
		paths: {
			data: testPath,
			frontend: '../dist/jamberry'
		},
		database: {
			use: useDB,
			options: {
				elasticsearch: mockElasticDBConfig(),
				nedb: {}
			}
		}
	};
	return extendConfig(mockBaseConfig, {});
}
