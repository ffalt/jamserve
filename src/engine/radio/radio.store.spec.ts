import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {RadioStore, SearchQueryRadio} from './radio.store';
import {Radio} from './radio.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';

function mockRadio(): Radio {
	return {
		id: '',
		type: DBObjectType.radio,
		name: 'a name',
		url: 'https://example.org/radioID1/stream',
		homepage: 'https://example.org/radioID1',
		disabled: false
	};
}

function mockRadio2(): Radio {
	return {
		id: '',
		type: DBObjectType.radio,
		name: 'second name',
		url: 'https://example.org/radioID2/stream',
		homepage: 'https://example.org/radioID2',
		disabled: true
	};
}

describe('RadioStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let radioStore: RadioStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					radioStore = new RadioStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = radioStore;
				this.generateMockObjects = () => {
					return [mockRadio(), mockRadio2()];
				};
				this.generateMatchingQueries = (mock: Radio) => {
					const matches: Array<SearchQueryRadio> = [
						{name: mock.name},
						{url: mock.url},
						{query: mock.name[0]}
					];
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});
