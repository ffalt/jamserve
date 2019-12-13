import {testStore} from '../base/base.store.spec';
import {mockSeries, mockSeries2} from './series.mock';
import {Series} from './series.model';
import {SearchQuerySeries, SeriesStore} from './series.store';

describe('SeriesStore', () => {
	let seriesStore: SeriesStore;

	testStore(testDB => {
			seriesStore = new SeriesStore(testDB.database);
			return seriesStore;
		}, () => {
			return [mockSeries(), mockSeries2()];
		}, (mock: Series) => {
			const matches: Array<SearchQuerySeries> = [
				{id: mock.id},
				{ids: [mock.id]},
				{name: mock.name},
				{artistID: mock.artistID},
				{albumType: mock.albumTypes[0]},
				{albumTypes: mock.albumTypes},
				{trackIDs: mock.trackIDs},
				{newerThan: mock.created - 1},
				{query: mock.name[0]}
			];
			mock.albumIDs.forEach(albumID => matches.push({albumID}));
			mock.rootIDs.forEach(rootID => matches.push({rootID}));
			mock.trackIDs.forEach(trackID => matches.push({trackID}));
			mock.folderIDs.forEach(folderID => matches.push({folderID}));
			return matches;
		},
		() => {
			// none, yet
		});
});
