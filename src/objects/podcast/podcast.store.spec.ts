import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {PodcastStore, SearchQueryPodcast} from './podcast.store';
import {Podcast} from './podcast.model';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';
import {mockPodcast, mockPodcast2} from './podcast.mock';

describe('PodcastStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let podcastStore: PodcastStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					podcastStore = new PodcastStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = podcastStore;
				this.generateMockObjects = () => {
					return [mockPodcast(), mockPodcast2()];
				};
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

			shouldBehaveLikeADBObjectStore();
		});

	}
});
