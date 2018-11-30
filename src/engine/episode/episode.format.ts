import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {formatTrackTag} from '../track/track.format';
import {Episode} from './episode.model';

export function formatEpisode(episode: Episode, includes: JamParameters.IncludesTrack, status: string): Jam.PodcastEpisode {
	return {
		id: episode.id,
		parentID: '',
		created: episode.stat ? episode.stat.created : 0,
		podcastID: episode.podcastID,
		status: status,
		errorMessage: episode.error,
		name: episode.name,
		duration: episode.media ? (episode.media.duration || -1) : -1,
		date: episode.date,
		summary: episode.summary,
		guid: episode.guid,
		author: episode.author,
		link: episode.link,
		media: includes.trackMedia && episode.media ? {
			bitRate: episode.media.bitRate || -1,
			format: episode.media.format || '',
			channels: episode.media.channels || -1,
			sampleRate: episode.media.sampleRate || -1
		} : undefined,
		tag: includes.trackTag && episode.tag ? formatTrackTag(episode.tag) : undefined
	};
}
