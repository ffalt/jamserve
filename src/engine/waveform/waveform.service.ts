import path from 'path';
import {WaveformFormatType} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {ApiBinaryResult} from '../../typings';
import {Episode} from '../episode/episode.model';
import {Track} from '../track/track.model';

export class WaveformService {

	constructor(private audioModule: AudioModule) {

	}

	async getTrackWaveform(track: Track, format: WaveformFormatType, width?: number): Promise<ApiBinaryResult> {
		return this.audioModule.waveform.get(track.id, path.join(track.path, track.name), format, width);
	}

	async getEpisodeWaveform(episode: Episode, format: WaveformFormatType, width?: number): Promise<ApiBinaryResult> {
		if (episode.path && episode.media) {
			return this.audioModule.waveform.get(episode.id, episode.path, format, width);
		}
		return Promise.reject(Error('Podcast episode not ready'));
	}
}
