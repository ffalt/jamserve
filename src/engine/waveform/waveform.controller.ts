import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {IApiBinaryResult} from '../../typings';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {JamRequest} from '../../api/jam/api';
import {Store} from '../store';
import {WaveformService} from './waveform.service';
import {DBObject} from '../../objects/base/base.model';
import {User} from '../../objects/user/user.model';
import {DBObjectType} from '../../types';
import {Track} from '../../objects/track/track.model';
import path from 'path';
import {Episode} from '../../objects/episode/episode.model';

export class WaveformController {
	constructor(private store: Store, private waveformService: WaveformService) {

	}

	async getObjWaveform(o: DBObject, format: string, user: User): Promise<IApiBinaryResult> {
		switch (o.type) {
			case DBObjectType.track:
				const track: Track = <Track>o;
				return await this.waveformService.get(o.id, path.join(track.path, track.name), format, track.media);
			case DBObjectType.episode:
				const episode: Episode = <Episode>o;
				if (episode.path && episode.media) {
					return await this.waveformService.get(o.id, path.join(episode.path), format, episode.media);
				}
				break;
		}
		return Promise.reject(Error('Invalid Object Type for Waveform generation'));
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
		const result = await this.getObjWaveform(obj, <string>req.query.format, req.user);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}
}
