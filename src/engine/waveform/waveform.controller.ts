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
import {Jam} from '../../model/jam-rest-data';
import fse from 'fs-extra';

export class WaveformController {

	constructor(private store: Store, private waveformService: WaveformService) {
	}

	async svgByPathParameter(req: JamRequest<{ pathParameter: string }>): Promise<ApiBinaryResult> {
		const {id, size, format} = await validatePathParameterIDSizeFormat(req.query.pathParameter,
			[WaveformFormatType.svg], WaveformFormatType.svg, 1, 6000);
		return this.getWaveform(id, format as JamParameters.WaveformFormatType, size);
	}

	async waveformByPathParameter(req: JamRequest<{ pathParameter: string }>): Promise<ApiBinaryResult> {
		const {id, format} = await validatePathParameterIDFormat(req.query.pathParameter, WaveformFormats, WaveformDefaultFormat);
		return this.getWaveform(id, format as JamParameters.WaveformFormatType);
	}

	private async getWaveform(id: string, format?: JamParameters.WaveformFormatType, width?: number): Promise<ApiBinaryResult> {
		const obj = await this.byID(id);
		format = (format || WaveformDefaultFormat);
		switch (obj.type) {
			case DBObjectType.track:
				return this.waveformService.getTrackWaveform(obj as Track, format as WaveformFormatType, width);
			case DBObjectType.episode:
				return this.waveformService.getEpisodeWaveform(obj as Episode, format as WaveformFormatType, width);
			default:
		}
		return Promise.reject(Error('Invalid Object Type for Waveform generation'));
	}

	async waveform(req: JamRequest<JamParameters.Waveform>): Promise<ApiBinaryResult> {
		return this.getWaveform(req.query.id, req.query.format);
	}

	async json(req: JamRequest<JamParameters.ID>): Promise<Jam.WaveFormData> {
		const result = await this.getWaveform(req.query.id, WaveformFormatType.json);
		console.log(result);
		if (result.json) {
			return result.json;
		}
		if (result.buffer) {
			return JSON.parse(result.buffer.buffer.toString());
		}
		if (result.file) {
			return JSON.parse((await fse.readFile(result.file.filename)).toString());
		}
		return Promise.reject(Error('Error on Waveform generation'));
	}

	private async byID(id: string | undefined): Promise<DBObject> {
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInStores(id, this.store.streamStores());
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		return obj;
	}
}
