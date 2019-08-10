import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {PodcastStatus} from '../../model/jam-types';
import {formatTrackTag} from '../track/track.format';
import {Episode, PodcastEpisodeChapter} from './episode.model';

export function formatChapters(chapters: Array<PodcastEpisodeChapter>): Array<Jam.PodcastEpisodeChapter> {
	return chapters.map(chap => {
		return {
			start: chap.start,
			title: chap.title
		};
	});
}

export function formatEpisode(episode: Episode, includes: JamParameters.IncludesTrack, status: PodcastStatus): Jam.PodcastEpisode {
	return {
		id: episode.id,
		parentID: '',
		created: episode.stat ? episode.stat.created : 0,
		podcastID: episode.podcastID,
		podcast: episode.podcast,
		status: status as Jam.PodcastEpisodeStatusType,
		errorMessage: episode.error,
		name: episode.name,
		duration: episode.media ? (episode.media.duration || -1) : (episode.duration ? episode.duration : -1),
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
		tag: includes.trackTag && episode.tag ? formatTrackTag(episode.tag) : undefined,
		chapters: episode.chapters && episode.chapters.length > 0 ? formatChapters(episode.chapters) : undefined
	};
}
