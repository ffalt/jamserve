import {AudioModule, AudioScanResult} from './audio.module';

export class MockAudioModule extends AudioModule {
	async read(filename: string): Promise<AudioScanResult> {
		const result = await super.read(filename);
		if (result && result.media) {
			result.media.duration = 1;
		}
		return result;
	}
}
