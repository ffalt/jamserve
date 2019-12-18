import {testStore} from '../base/base.store.spec';
import {mockArtist, mockArtist2} from './artist.mock';
import {Artist} from './artist.model';
import {ArtistStore, SearchQueryArtist} from './artist.store';

describe('ArtistStore', () => {
	let artistStore: ArtistStore;

	testStore(testDB => {
			artistStore = new ArtistStore(testDB.database);
			return artistStore;
		}, () => {
			return [mockArtist(), mockArtist2()];
		}, (mock: Artist) => {
			const matches: Array<SearchQueryArtist> = [
				{id: mock.id},
				{ids: [mock.id]},
				{name: mock.name},
				{slug: mock.slug},
				...(mock.genres || []).map(g => ({genre: g})),
				...(mock.albumTypes || []).map(t => ({albumType: t})),
				{albumTypes: mock.albumTypes},
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
		},
		() => {
			// nope
		});
});
