import {JamRequest} from '../../api/jam/api';
import {Jam} from '../../model/jam-rest-data';
import {packNowPlaying} from './nowplaying.format';
import {NowPlayingService} from './nowplaying.service';

export class NowPlayingController {

	constructor(private nowplayingService: NowPlayingService) {

	}

	async list(req: JamRequest<{}>): Promise<Array<Jam.NowPlaying>> {
		const list = await this.nowplayingService.getNowPlaying();
		return list.map(entry => packNowPlaying(entry));
	}

}
