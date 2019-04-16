import {Jam} from '../../model/jam-rest-data';
import {Stats} from './stats.model';

export function formatStats(stats: Stats): Jam.Stats {
	return {
		rootID: stats.rootID,
		album: stats.album,
		albumTypes: stats.albumTypes,
		artistTypes: stats.artistTypes,
		artist: stats.artist,
		folder: stats.folder,
		track: stats.track
	};
}
