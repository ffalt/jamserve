import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {PlaylistStore, SearchQueryPlaylist} from './playlist.store';
import {Playlist} from './playlist.model';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';
import {mockPlaylist, mockPlaylist2} from './playlist.mock';

describe('PlaylistStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let playlistStore: PlaylistStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					playlistStore = new PlaylistStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = playlistStore;
				this.generateMockObjects = () => {
					return [mockPlaylist(), mockPlaylist2()];
				};
				this.generateMatchingQueries = (mock: Playlist) => {
					const matches: Array<SearchQueryPlaylist> = [
						{id: mock.id},
						{ids: [mock.id]},
						{name: mock.name},
						{userID: mock.userID},
						{trackIDs: mock.trackIDs},
						{isPublic: mock.isPublic},
						{newerThan: mock.created - 1},
						{query: mock.name[0]}
					];
					mock.trackIDs.forEach(trackID => matches.push({trackID}));
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});
