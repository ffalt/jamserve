import {Podcast} from './podcast.model';
import {DBObjectType} from '../../types';

export function mockPodcast(): Podcast {
	return {
		id: '',
		type: DBObjectType.podcast,
		url: 'https://example.org/feeds/podcastID1.xml',
		created: 1543495268,
		lastCheck: 1543495269,
		status: 'new',
		errorMessage: 'an error message',
		tag: {
			title: 'a title',
			link: 'https://example.org/podcastID1',
			author: 'an author',
			description: 'a description',
			generator: 'a generator',
			image: 'podcastID1.jpg',
			categories: ['category1', 'category2']
		}
	};
}

export function mockPodcast2(): Podcast {
	return {
		id: '',
		type: DBObjectType.podcast,
		url: 'https://example.org/feeds/podcastID2.xml',
		created: 1443495268,
		lastCheck: 1443495269,
		status: 'completed',
		errorMessage: 'second error message',
		tag: {
			title: 'second title',
			link: 'https://example.org/podcastID2',
			author: 'second author',
			description: 'second description',
			generator: 'second generator',
			image: 'podcastID2.jpg',
			categories: ['category3', 'category4']
		}
	};
}
