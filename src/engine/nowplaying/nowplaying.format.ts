import {Jam} from '../../model/jam-rest-data-0.1.0';
import moment from 'moment';
import {DBObjectType} from '../../types';
import {formatTrack} from '../track/track.format';
import {formatEpisode} from '../episode/episode.format';
import {NowPlaying} from './nowplaying.model';
import {Track} from '../track/track.model';
import {Episode} from '../episode/episode.model';

export function packNowPlaying(entry: NowPlaying): Jam.NowPlaying {
	const playing: Jam.NowPlaying = {
		username: entry.user.name,
		minutesAgo: Math.round(moment.duration(moment().diff(moment(entry.time))).asMinutes())
	};
	switch (entry.obj.type) {
		case DBObjectType.track:
			playing.track = formatTrack(<Track>entry.obj, {});
			break;
		case DBObjectType.episode:
			const episode = <Episode>entry.obj;
			playing.track = formatEpisode(episode, {}, episode.status);
			break;
	}
	return playing;
}

