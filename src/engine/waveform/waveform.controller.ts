import {JamRequest} from '../../api/jam/api';
import {validatePathParameterIDFormat, validatePathParameterIDSizeFormat} from '../../api/jam/check';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {WaveformDefaultFormat, WaveformFormats, WaveformFormatType} from '../../model/jam-types';
import {ApiBinaryResult} from '../../typings';
import {DBObject} from '../base/base.model';
import {Episode} from '../episode/episode.model';
import {Store} from '../store/store';
import {Track} from '../track/track.model';
import {WaveformService} from './waveform.service';

export class WaveformController {

	constructor(private store: Store, private waveformService: WaveformService) {
	}

	async svgByPathParameter(req: JamRequest<{ pathParameter: string }>): Promise<ApiBinaryResult> {
		const {id, size, format} = await validatePathParameterIDSizeFormat(req.query.pathParameter,
			[WaveformFormatType.svg], WaveformFormatType.svg, 1, 6000);
		const query: JamParameters.Waveform = {id, format: format as JamParameters.WaveformFormatType, width: size};
		return this.waveform({query, user: req.user});
	}

	async waveformByPathParameter(req: JamRequest<{ pathParameter: string }>): Promise<ApiBinaryResult> {
		const {id, format} = await validatePathParameterIDFormat(req.query.pathParameter, WaveformFormats, WaveformDefaultFormat);
		const query: JamParameters.Waveform = {id, format: format as JamParameters.WaveformFormatType};
		return this.waveform({query, user: req.user});
	}

	async waveform(req: JamRequest<JamParameters.Waveform>): Promise<ApiBinaryResult> {
		const obj = await this.byID(req.query.id);
		const format = (req.query.format || WaveformDefaultFormat);
		switch (obj.type) {
			case DBObjectType.track:
				return this.waveformService.getTrackWaveform(obj as Track, format as WaveformFormatType, req.query.width);
			case DBObjectType.episode:
				return this.waveformService.getEpisodeWaveform(obj as Episode, format as WaveformFormatType, req.query.width);
			default:
		}
		return Promise.reject(Error('Invalid Object Type for Waveform generation'));
	}

	private async byID(id: string | undefined): Promise<DBObject> {
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInStreamStores(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		return obj;
	}
}
