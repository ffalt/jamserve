import tmp from 'tmp';
import {ThirdPartyConfig} from '../../config/thirdparty.config';
import {ImageModule} from '../image/image.module';
import {AudioModule} from './audio.module';
import {MockAudioModule} from './audio.module.mock';

export class AudioModuleTest {
	audioModule!: AudioModule;
	dirWaveform!: tmp.DirResult;
	dirTranscode!: tmp.DirResult;

	constructor(private imageModule: ImageModule) {
	}

	async setup(): Promise<void> {
		this.dirWaveform = tmp.dirSync();
		this.dirTranscode = tmp.dirSync();
		this.audioModule = new MockAudioModule(this.dirWaveform.name, this.dirTranscode.name, ThirdPartyConfig, this.imageModule);
	}

	async cleanup(): Promise<void> {
		this.dirWaveform.removeCallback();
		this.dirTranscode.removeCallback();
	}

}
