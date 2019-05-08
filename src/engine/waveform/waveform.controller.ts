import {JamRequest} from '../../api/jam/api';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {Episode} from '../episode/episode.model';
import {Track} from '../track/track.model';
import {ApiBinaryResult} from '../../typings';
import {Store} from '../store/store';
import {WaveformService} from './waveform.service';
import WaveformFormatType = JamParameters.WaveformFormatType;

export class WaveformController {
	constructor(private store: Store, private waveformService: WaveformService) {

	}

	async waveform(req: JamRequest<JamParameters.Waveform>): Promise<ApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const format = req.query.format || 'svg' as WaveformFormatType;
		switch (obj.type) {
			case DBObjectType.track:
				return this.waveformService.getTrackWaveform(obj as Track, format);
			case DBObjectType.episode:
				return this.waveformService.getEpisodeWaveform(obj as Episode, format);
		}
		return Promise.reject(Error('Invalid Object Type for Waveform generation'));
	}
}
