import tmp from 'tmp';
import {WaveformService} from './waveform.service';

export class WaveformServiceTest {
	waveformService!: WaveformService;
	dir!: tmp.DirResult;

	async setup(): Promise<void> {
		this.dir = tmp.dirSync();
		this.waveformService = new WaveformService(this.dir.name);
	}

	async cleanup(): Promise<void> {
		this.dir.removeCallback();
	}

}
