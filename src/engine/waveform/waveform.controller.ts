import {JamParameters} from '../../model/jam-rest-params';
import {IApiBinaryResult} from '../../typings';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {JamRequest} from '../../api/jam/api';
import {Store} from '../store/store';
import {WaveformService} from './waveform.service';
import {DBObjectType} from '../../db/db.types';
import {Track} from '../../objects/track/track.model';
import {Episode} from '../../objects/episode/episode.model';
import WaveformFormatType = JamParameters.WaveformFormatType;

export class WaveformController {
	constructor(private store: Store, private waveformService: WaveformService) {

	}

	async waveform(req: JamRequest<JamParameters.Waveform>): Promise<IApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const format = req.query.format || <WaveformFormatType>'svg';
		switch (obj.type) {
			case DBObjectType.track:
				return await this.waveformService.getTrackWaveform(<Track>obj, format);
			case DBObjectType.episode:
				return await this.waveformService.getEpisodeWaveform(<Episode>obj, format);
		}
		return Promise.reject(Error('Invalid Object Type for Waveform generation'));
	}
}
