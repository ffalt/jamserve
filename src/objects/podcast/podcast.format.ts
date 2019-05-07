import {Jam} from '../../model/jam-rest-data';
import {PodcastStatus} from '../../model/jam-types';
import {Podcast} from './podcast.model';

export function formatPodcast(podcast: Podcast, status: PodcastStatus): Jam.Podcast {
	return {
		id: podcast.id,
		url: podcast.url,
		created: podcast.created,
		lastCheck: podcast.lastCheck > 0 ? podcast.lastCheck : undefined,
		status: status as Jam.PodcastStatusType,
		errorMessage: podcast.errorMessage,
		name: podcast.tag ? podcast.tag.title : podcast.url,
		description: podcast.tag ? podcast.tag.description : undefined
	};
}
