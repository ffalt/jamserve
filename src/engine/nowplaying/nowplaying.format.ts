import {Jam} from '../../model/jam-rest-data';
import moment from 'moment';
import {DBObjectType} from '../../db/db.types';
import {formatTrack} from '../../objects/track/track.format';
import {formatEpisode} from '../../objects/episode/episode.format';
import {NowPlaying} from './nowplaying.model';
import {Track} from '../../objects/track/track.model';
import {Episode} from '../../objects/episode/episode.model';

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

