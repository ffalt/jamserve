import {JamRequest} from '../../api/jam/api';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {WaveformDefaultFormat, WaveformFormats} from '../../model/jam-types';
import {ApiBinaryResult} from '../../typings';
import {Episode} from '../episode/episode.model';
import {Store} from '../store/store';
import {Track} from '../track/track.model';
import {WaveformService} from './waveform.service';

export class WaveformController {
	constructor(private store: Store, private waveformService: WaveformService) {

	}

	async waveformByPathParameter(req: JamRequest<{ pathParameter: string }>): Promise<ApiBinaryResult> {
		const pathParameter = (req.query.pathParameter || '').trim();
		if (!pathParameter || pathParameter.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const split = pathParameter.split('.');
		const id = split[0];
		const format = split[1];
		if (format !== undefined && !WaveformFormats.includes(format)) {
			return Promise.reject(InvalidParamError());
		}
		const query: JamParameters.Waveform = {id, format: format as JamParameters.WaveformFormatType};
		return this.waveform({query, user: req.user});
	}

	async waveform(req: JamRequest<JamParameters.Waveform>): Promise<ApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInStreamStores(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const format = (req.query.format || WaveformDefaultFormat);
		switch (obj.type) {
			case DBObjectType.track:
				return this.waveformService.getTrackWaveform(obj as Track, format);
			case DBObjectType.episode:
				return this.waveformService.getEpisodeWaveform(obj as Episode, format);
			default:
		}
		return Promise.reject(Error('Invalid Object Type for Waveform generation'));
	}
}
