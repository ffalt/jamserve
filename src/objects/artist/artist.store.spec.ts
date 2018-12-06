import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {ArtistStore, SearchQueryArtist} from './artist.store';
import {Artist} from './artist.model';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';
import {mockArtist, mockArtist2} from './artist.mock';

describe('ArtistStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let artistStore: ArtistStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					artistStore = new ArtistStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = artistStore;
				this.generateMockObjects = () => {
					return [mockArtist(), mockArtist2()];
				};
				this.generateMatchingQueries = (mock: Artist) => {
					const matches: Array<SearchQueryArtist> = [
						{id: mock.id},
						{ids: [mock.id]},
						{name: mock.name},
						{names: [mock.name]},
						{trackIDs: mock.trackIDs},
						{mbArtistID: mock.mbArtistID},
						{newerThan: mock.created - 1},
						{query: mock.name[0]}
					];
					mock.albumIDs.forEach(albumID => matches.push({albumID}));
					mock.rootIDs.forEach(rootID => matches.push({rootID}));
					mock.trackIDs.forEach(trackID => matches.push({trackID}));
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});

