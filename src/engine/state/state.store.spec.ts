import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {StateStore, SearchQueryState} from './state.store';
import {State} from './state.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';

function mockState(): State {
	return {
		id: '',
		type: DBObjectType.state,
		userID: 'userID1',
		destID: 'trackID1',
		destType: DBObjectType.track,
		played: 3,
		lastplayed: 1543495268,
		faved: 1543495268,
		rated: 3
	};
}

function mockState2(): State {
	return {
		id: '',
		type: DBObjectType.state,
		userID: 'userID2',
		destID: 'folderID2',
		destType: DBObjectType.folder,
		played: 0,
		lastplayed: 0,
		faved: 0,
		rated: 0
	};
}

describe('StateStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let stateStore: StateStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					stateStore = new StateStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});


			beforeEach(function() {
				this.store = stateStore;
				this.generateMockObjects = () => {
					return [mockState(), mockState2()];
				};
				this.generateMatchingQueries = (mock: State) => {
					const matches: Array<SearchQueryState> = [
						{destID: mock.destID},
						{destIDs: [mock.destID]},
						{userID: mock.userID},
						{type: mock.destType},
						{isPlayed: mock.played > 0},
						{isFaved: mock.faved ? mock.faved > 0 : false},
						{minRating: mock.rated ? mock.rated - 1 : 0},
						{maxRating: mock.rated ? mock.rated + 1 : 5}
					];
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});
