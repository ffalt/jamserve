import {testStore} from '../base/base.store.spec';
import {generateMockObjects} from './radio.mock';
import {Radio} from './radio.model';
import {RadioStore, SearchQueryRadio} from './radio.store';

describe('RadioStore', () => {
	let radioStore: RadioStore;
	testStore(testDB => {
			radioStore = new RadioStore(testDB.database);
			return radioStore;
		},
		generateMockObjects,
		(mock: Radio) => {
			const matches: Array<SearchQueryRadio> = [
				{name: mock.name},
				{url: mock.url},
				{query: mock.name[0]}
			];
			return matches;
		},
		() => {
			// nope
		}
	);
});
