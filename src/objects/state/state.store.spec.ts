import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {SearchQueryState, StateStore} from './state.store';
import {State} from './state.model';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';
import {mockState, mockState2} from './state.mock';

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
