import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../../objects/base/base.service.spec';
import {Store} from '../store/store';
import tmp, {SynchrounousResult} from 'tmp';
import {buildMockRoot, MockRoot, removeMockRoot, writeMockRoot} from '../store/store.mock';
import {IoService} from './io.service';
import {IndexService} from '../index/index.service';
import {GenreService} from '../genre/genre.service';
import {ScanService} from '../scan/scan.service';
import {WaveformServiceTest} from '../waveform/waveform.service.spec';
import {StatsService} from '../stats/stats.service';

describe('IOService', () => {
	let store: Store;
	let dir: SynchrounousResult;
	const waveFormServiceTest = new WaveformServiceTest();
	let mockRoot: MockRoot;
	let ioService: IoService;

	testService({mockData: false},
		async (storeTest, imageModuleTest, audioModule) => {
			store = storeTest;
			dir = tmp.dirSync();
			await waveFormServiceTest.setup();
			mockRoot = buildMockRoot(dir.name, 1, 'rootID');
			const statsService = new StatsService(store);
			const indexService = new IndexService({ignore: []}, store.artistStore, store.folderStore, store.trackStore);
			const genreService = new GenreService(store.trackStore);
			const scanService = new ScanService(store, audioModule, imageModuleTest.imageModule, waveFormServiceTest.waveformService);
			ioService = new IoService(store.rootStore, scanService, indexService, genreService, statsService);
			await writeMockRoot(mockRoot);
		},
		() => {
			it('should', async () => {

			});
		},
		async () => {
			await removeMockRoot(mockRoot);
			dir.removeCallback();
			await waveFormServiceTest.cleanup();
		}
	);

});
