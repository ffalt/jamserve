import {JamRequest} from '../../api/jam/api';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {paginate} from '../../utils/paginate';
import {ListResult} from '../base/list-result';
import {packNowPlaying} from './nowplaying.format';
import {NowPlayingService} from './nowplaying.service';

export class NowPlayingController {

	constructor(private nowplayingService: NowPlayingService) {
	}

	async list(req: JamRequest<JamParameters.NowPlaying>): Promise<ListResult<Jam.NowPlaying>> {
		const nowPlayings = await this.nowplayingService.getNowPlaying();
		const list = paginate(nowPlayings, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: list.items.map(entry => packNowPlaying(entry))
		};
	}

}
