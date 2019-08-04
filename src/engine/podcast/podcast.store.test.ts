import {describe} from 'mocha';
import {PodcastStore, SearchQueryPodcast} from './podcast.store';
import {Podcast} from './podcast.model';
import {testStore} from '../base/base.store.spec';
import {mockPodcast, mockPodcast2} from './podcast.mock';

describe('PodcastStore', () => {
	let podcastStore: PodcastStore;

	testStore((testDB) => {
			podcastStore = new PodcastStore(testDB.database);
			return podcastStore;
		}, () => {
			return [mockPodcast(), mockPodcast2()];
		},
		(mock: Podcast) => {
			const matches: Array<SearchQueryPodcast> = [
				{id: mock.id},
				{ids: [mock.id]},
				{url: mock.url},
				{title: mock.tag ? mock.tag.title : ''},
				{status: mock.status},
				{newerThan: mock.created - 1},
				{query: (mock.tag ? mock.tag.title : '')[0]}

			];
			return matches;
		},
		() => {
		});
});
