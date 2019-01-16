import {Jam} from '../../model/jam-rest-data';
import {Stats} from './stats.model';

export function formatStats(stats: Stats): Jam.Stats {
	return {
		rootID: stats.rootID,
		trackCount: stats.trackCount,
		albumCount: stats.albumCount,
		artistCount: stats.artistCount,
		folderCount: stats.folderCount
	};
}
