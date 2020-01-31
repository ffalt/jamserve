import moment from 'moment';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {formatEpisode} from '../episode/episode.format';
import {Episode} from '../episode/episode.model';
import {formatTrack} from '../track/track.format';
import {Track} from '../track/track.model';
import {NowPlaying} from './nowplaying.model';

export function packNowPlaying(entry: NowPlaying): Jam.NowPlaying {
	const playing: Jam.NowPlaying = {
		username: entry.user.name,
		minutesAgo: Math.round(moment.duration(moment().diff(moment(entry.time))).asMinutes())
	};
	switch (entry.obj.type) {
		case DBObjectType.track:
			playing.track = formatTrack(entry.obj as Track, {});
			break;
		case DBObjectType.episode: {
			const episode = entry.obj as Episode;
			playing.track = formatEpisode(episode, {}, episode.status);
			break;
		}
		default:
	}
	return playing;
}
