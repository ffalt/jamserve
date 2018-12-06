import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {SearchQueryTrack, TrackStore} from './track.store';
import {Track} from './track.model';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import path from 'path';
import {TestDBs} from '../../db/db.test';
import {mockTrack, mockTrack2} from './track.mock';

describe('TrackStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let trackStore: TrackStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					trackStore = new TrackStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = trackStore;
				this.generateMockObjects = () => {
					return [mockTrack(), mockTrack2()];
				};
				this.generateMatchingQueries = (mock: Track) => {
					const matches: Array<SearchQueryTrack> = [
						{id: mock.id},
						{ids: [mock.id]},
						{path: mock.path},
						{inPath: path.dirname(mock.path)},
						{inPaths: [path.dirname(mock.path)]},
						{artist: mock.tag.artist},
						{artistID: mock.artistID},
						{parentID: mock.parentID},
						{parentIDs: [mock.parentID]},
						{mbTrackID: mock.tag.mbTrackID},
						{mbTrackIDs: [mock.tag.mbTrackID || '']},
						{rootID: mock.rootID},
						{title: mock.tag.title},
						{album: mock.tag.album},
						{genre: mock.tag.genre},
						{fromYear: mock.tag.year, toYear: mock.tag.year},
						{newerThan: mock.stat.created - 1},
						{query: (mock.tag.title || '')[0]}
					];
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});
