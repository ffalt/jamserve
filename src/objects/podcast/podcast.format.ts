import {Jam} from '../../model/jam-rest-data';
import {Podcast} from './podcast.model';

export function formatPodcast(podcast: Podcast, status: string ): Jam.Podcast {
	return {
		id: podcast.id,
		url: podcast.url,
		created: podcast.created,
		lastCheck: podcast.lastCheck > 0 ? podcast.lastCheck : undefined,
		status: status,
		errorMessage: podcast.errorMessage,
		name: podcast.tag ? podcast.tag.title : podcast.url,
		description: podcast.tag ? podcast.tag.description : undefined
	};
}
