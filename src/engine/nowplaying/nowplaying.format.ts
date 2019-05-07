import moment from 'moment';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {formatEpisode} from '../../objects/episode/episode.format';
import {Episode} from '../../objects/episode/episode.model';
import {formatTrack} from '../../objects/track/track.format';
import {Track} from '../../objects/track/track.model';
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
		case DBObjectType.episode:
			const episode = entry.obj as Episode;
			playing.track = formatEpisode(episode, {}, episode.status);
			break;
	}
	return playing;
}
