import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {RootStore, SearchQueryRoot} from './root.store';
import {Root} from './root.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';

function mockRoot(): Root {
	return {
		id: '',
		type: DBObjectType.root,
		name: 'a name',
		path: '/var/media/root name',
		created: 1543495268
	};
}

function mockRoot2(): Root {
	return {
		id: '',
		type: DBObjectType.root,
		name: 'second name',
		path: '/var/media/second root name',
		created: 1443495268
	};
}

describe('RootStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let rootStore: RootStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					rootStore = new RootStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = rootStore;
				this.generateMockObjects = () => {
					return [mockRoot(), mockRoot2()];
				};
				this.generateMatchingQueries = (mock: Root) => {
					const matches: Array<SearchQueryRoot> = [
						{id: mock.id},
						{ids: [mock.id]},
						{name: mock.name},
						{path: mock.path},
						{query: mock.name[0]}
					];
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});
