import tmp, {SynchrounousResult} from 'tmp';
import {WaveformService} from './waveform.service';


export class WaveformServiceTest {
	// @ts-ignore
	waveformService: WaveformService;
	// @ts-ignore
	dir: SynchrounousResult;

	async setup() {
		this.dir = tmp.dirSync();
		this.waveformService = new WaveformService(this.dir.name);
	}

	async cleanup() {
		this.dir.removeCallback();
	}

}
