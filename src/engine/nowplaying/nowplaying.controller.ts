import {Jam} from '../../model/jam-rest-data';
import {JamRequest} from '../../api/jam/api';
import {NowPlayingService} from './nowplaying.service';
import {packNowPlaying} from './nowplaying.format';

export class NowPlayingController {

	constructor(private nowplayingService: NowPlayingService) {

	}

	async list(req: JamRequest<{}>): Promise<Array<Jam.NowPlaying>> {
		const list = await this.nowplayingService.getNowPlaying();
		return list.map(entry => packNowPlaying(entry));
	}

}
