import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {PodcastStore, SearchQueryPodcast} from './podcast.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Podcast} from './podcast.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';

function mockPodcast(): Podcast {
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

describe('PodcastStore', () => {

	const testDB = new TestNeDB();
	let podcastStore: PodcastStore;

	before(async () => {
		await testDB.setup();
		podcastStore = new PodcastStore(testDB.database);
	});

	after(async () => {
		await testDB.cleanup();
	});

	beforeEach(function() {
		this.store = podcastStore;
		this.obj = mockPodcast();
		this.generateMatchingQueries = (mock: Podcast) => {
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
		};
	});

	describe('DBObject Store', () => {
		shouldBehaveLikeADBObjectStore();
	});

});

