import {Jam} from '../../model/jam-rest-data';
import {Stats} from './stats.model';

export function formatStats(stats: Stats): Jam.Stats {
	return {
		rootID: stats.rootID,
		album: stats.album,
		albumTypes: {
			album: stats.albumTypes.album,
			compilation: stats.albumTypes.compilation,
			audiobook: stats.albumTypes.audiobook
		},
		artist: stats.artist,
		folder: stats.folder,
		track: stats.track
	};
}
