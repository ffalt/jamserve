import tmp from 'tmp';
import {BaseConfig, Config, extendConfig} from '../config';
import {Database} from '../db/db.model';
import {DBObjectType} from '../db/db.types';
import {mockElasticDBConfig, TestDBElastic} from '../db/elasticsearch/db-elastic.spec';
import {TestNeDB} from '../db/nedb/db-nedb.spec';
import {RootScanStrategy} from '../model/jam-types';
import {Engine} from './engine';
import {mockEpisode, mockEpisode2} from './episode/episode.mock';
import {mockPlaylist} from './playlist/playlist.mock';
import {mockPodcast} from './podcast/podcast.mock';
import {Store} from './store/store';
import {buildMockRoot, MockRoot, removeMockRoot, writeMockRoot} from './store/store.mock';
import {mockUser} from './user/user.mock';
import {JAMSERVE_VERSION} from '../version';
import {ImageModule} from '../modules/image/image.module';
import {ImageModuleTest} from '../modules/image/image.module.spec';
import {ThirdPartyConfig} from '../config/thirdparty.config';
import {MockAudioModule} from '../modules/audio/audio.module.mock';

export class EngineMock {
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
		await this.engine.scanService.scanRoot(this.mockRoot.id, false);
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
	// @ts-ignore
	engine: Engine;
	// @ts-ignore
	engineMock: EngineMock;
	// @ts-ignore
	imageModuleTest: ImageModuleTest;

	constructor(public name: string) {
	}

	protected async init(config: Config, db: Database): Promise<void> {
		const store = new Store(db);
		this.imageModuleTest = new ImageModuleTest();
		await this.imageModuleTest.setup();
		const audio = new MockAudioModule(ThirdPartyConfig, this.imageModuleTest.imageModule);
		this.engine = new Engine(config, store, JAMSERVE_VERSION, {audio, image: this.imageModuleTest.imageModule});
		this.engineMock = new EngineMock(this.engine);
	}

	async setup(): Promise<void> {
		await this.engineMock.setup();
	}

	async cleanup(): Promise<void> {
		await this.imageModuleTest.cleanup();
		await this.engineMock.cleanup();
	}
}

function mockupConfig(testPath: string, useDB: string): Config {
	const mockBaseConfig: BaseConfig = {
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
			}
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
	return extendConfig(mockBaseConfig as Config);
}

export class TestEngineElastic extends TestEngine {
	dir: tmp.DirResult;
	testDB = new TestDBElastic();

	constructor() {
		super('elastic engine');
		this.dir = tmp.dirSync();
	}

	async setup(): Promise<void> {
		await this.testDB.setup();
		const config = mockupConfig(this.dir.name, 'elasticsearch');
		await this.init(config, this.testDB.database);
		await super.setup();
	}

	async cleanup(): Promise<void> {
		await this.testDB.cleanup();
		this.dir.removeCallback();
	}

}

export class TestEngineNeDB extends TestEngine {
	dir: tmp.DirResult;
	testDB = new TestNeDB();

	constructor() {
		super('nedb engine');
		this.dir = tmp.dirSync();
	}

	async setup(): Promise<void> {
		await this.testDB.setup();
		const config = mockupConfig(this.dir.name, 'nedb');
		await super.init(config, this.testDB.database);
		await super.setup();
	}

	async cleanup(): Promise<void> {
		await this.testDB.cleanup();
		this.dir.removeCallback();
	}

}

export class TestEngines {
	engines: Array<TestEngine> = [];

	constructor() {
		// this.engines.push(new TestEngineElastic());
		this.engines.push(new TestEngineNeDB());
	}

}
