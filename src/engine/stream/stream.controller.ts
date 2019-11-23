import {JamRequest} from '../../api/jam/api';
import {validatePathParameterIDFormat} from '../../api/jam/check';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {AudioFormats} from '../../model/jam-types';
import {ApiBinaryResult} from '../../typings';
import {logger} from '../../utils/logger';
import {DBObject} from '../base/base.model';
import {Episode} from '../episode/episode.model';
import {NowPlayingService} from '../nowplaying/nowplaying.service';
import {Store} from '../store/store';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';
import {StreamService} from './stream.service';

const log = logger('StreamController');

export class StreamController {

	constructor(private streamService: StreamService, private nowPlayingService: NowPlayingService, private store: Store) {

	}

	async streamTrack(track: Track, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		const result = await this.streamService.streamTrack(track, format, maxBitRate, user);
		this.nowPlayingService.reportTrack(track, user).catch(e => log.error(e)); // do not wait
		return result;
	}

	async streamEpisode(episode: Episode, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		const result = await this.streamService.streamEpisode(episode, format, maxBitRate, user);
		this.nowPlayingService.reportEpisode(episode, user).catch(e => log.error(e)); // do not wait
		return result;
	}

	private async streamDBObject(o: DBObject, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		switch (o.type) {
			case DBObjectType.track:
				return this.streamTrack(o as Track, format, maxBitRate, user);
			case DBObjectType.episode:
				return this.streamEpisode(o as Episode, format, maxBitRate, user);
			default:
		}
		return Promise.reject(Error('Invalid Object Type for Streaming'));
	}

	async stream(req: JamRequest<JamParameters.PathStream>): Promise<ApiBinaryResult> {
		if (req.query.format !== undefined && !AudioFormats.includes(req.query.format)) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.byID(req.query.id);
		const result = await this.streamDBObject(obj, req.query.format, undefined, req.user);
		if (result) {
			return result;
		}
		return Promise.reject(NotFoundError());
	}

	private async byID(id: string): Promise<DBObject> {
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInStores(id, this.store.streamStores());
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		return obj;
	}

	async streamByPathParameter(req: JamRequest<{ pathParameter: string }>): Promise<ApiBinaryResult> {
		const {id, format} = await validatePathParameterIDFormat(req.query.pathParameter, AudioFormats, undefined);
		return this.stream({query: {id, format: format as JamParameters.AudioFormatType}, user: req.user});
	}
}
