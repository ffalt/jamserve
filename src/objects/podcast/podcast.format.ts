import {Jam} from '../../model/jam-rest-data';
import {Podcast} from './podcast.model';
import {PodcastStatus} from '../../types';

export function formatPodcast(podcast: Podcast, status: PodcastStatus): Jam.Podcast {
	return {
		id: podcast.id,
		url: podcast.url,
		created: podcast.created,
		lastCheck: podcast.lastCheck > 0 ? podcast.lastCheck : undefined,
		status: <Jam.PodcastStatusType>status,
		errorMessage: podcast.errorMessage,
		name: podcast.tag ? podcast.tag.title : podcast.url,
		description: podcast.tag ? podcast.tag.description : undefined
	};
}
