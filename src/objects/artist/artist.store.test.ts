import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {ArtistStore, SearchQueryArtist} from './artist.store';
import {Artist} from './artist.model';
import {testStore} from '../base/base.store.spec';
import {mockArtist, mockArtist2} from './artist.mock';

describe('ArtistStore', () => {
	let artistStore: ArtistStore;

	testStore((testDB) => {
			artistStore = new ArtistStore(testDB.database);
			return artistStore;
		}, () => {
			return [mockArtist(), mockArtist2()];
		}, (mock: Artist) => {
			const matches: Array<SearchQueryArtist> = [
				{id: mock.id},
				{ids: [mock.id]},
				{name: mock.name},
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
		});
});
