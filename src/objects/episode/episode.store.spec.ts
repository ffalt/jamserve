import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {EpisodeStore, SearchQueryEpisode} from './episode.store';
import {Episode} from './episode.model';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';
import {mockEpisode, mockEpisode2} from './episode.mock';

describe('EpisodeStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let episodeStore: EpisodeStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					episodeStore = new EpisodeStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = episodeStore;
				this.generateMockObjects = () => {
					return [mockEpisode(), mockEpisode2()];
				};
				this.generateMatchingQueries = (mock: Episode) => {
					const matches: Array<SearchQueryEpisode> = [
						{id: mock.id},
						{ids: [mock.id]},
						{podcastID: mock.podcastID},
						{podcastIDs: [mock.podcastID]},
						{name: mock.name},
						{status: mock.status},
						{newerThan: mock.date - 1},
						{query: mock.name[0]}
					];
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});
