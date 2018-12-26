import {JamParameters} from '../../model/jam-rest-params';
import {IApiBinaryResult} from '../../typings';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {JamRequest} from '../../api/jam/api';
import {StreamService} from './stream.service';
import {Store} from '../store/store';
import {NowPlayingService} from '../nowplaying/nowplaying.service';
import {DBObject} from '../../objects/base/base.model';
import {User} from '../../objects/user/user.model';
import {DBObjectType} from '../../types';
import {Track} from '../../objects/track/track.model';
import {Episode} from '../../objects/episode/episode.model';

export class StreamController {

	constructor(private streamService: StreamService, private nowPlayingService: NowPlayingService, private store: Store) {

	}

	async streamTrack(track: Track, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<IApiBinaryResult> {
		const result = await this.streamService.streamTrack(track, format, maxBitRate, user);
		this.nowPlayingService.reportTrack(track, user); // do not wait
		return result;
	}

	async streamEpisode(episode: Episode, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<IApiBinaryResult> {
		const result = await this.streamService.streamEpisode(episode, format, maxBitRate, user);
		this.nowPlayingService.reportEpisode(episode, user); // do not wait
		return result;
	}

	private async streamDBObject(o: DBObject, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<IApiBinaryResult> {
		switch (o.type) {
			case DBObjectType.track:
				return this.streamTrack(<Track>o, format, maxBitRate, user);
			case DBObjectType.episode:
				return this.streamEpisode(<Episode>o, format, maxBitRate, user);

		}
		return Promise.reject(Error('Invalid Object Type for Streaming'));
	}

	async stream(req: JamRequest<JamParameters.PathStream>): Promise<IApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const result = await this.streamDBObject(obj, req.query.format, undefined, req.user);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}
}
