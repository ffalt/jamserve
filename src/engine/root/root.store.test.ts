import {RootStore, SearchQueryRoot} from './root.store';
import {Root} from './root.model';
import {testStore} from '../base/base.store.spec';
import {mockRoot, mockRoot2} from './root.mock';

describe('RootStore', () => {
	let rootStore: RootStore;
	testStore((testDB) => {
			rootStore = new RootStore(testDB.database);
			return rootStore;
		}, () => {
			return [mockRoot(), mockRoot2()];
		}, (mock: Root) => {
			const matches: Array<SearchQueryRoot> = [
				{id: mock.id},
				{ids: [mock.id]},
				{name: mock.name},
				{path: mock.path},
				{query: mock.name[0]}
			];
			return matches;
		},
		() => {
		}
	);
});

