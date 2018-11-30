import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {RootStore, SearchQueryRoot} from './root.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Root} from './root.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';

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

	const testDB = new TestNeDB();
	let rootStore: RootStore;

	before(async () => {
		await testDB.setup();
		rootStore = new RootStore(testDB.database);
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

	describe('DBObject Store', () => {
		shouldBehaveLikeADBObjectStore();
	});

});

