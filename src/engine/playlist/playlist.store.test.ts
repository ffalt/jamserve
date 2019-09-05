import {PlaylistStore, SearchQueryPlaylist} from './playlist.store';
import {Playlist} from './playlist.model';
import {testStore} from '../base/base.store.spec';
import {mockPlaylist, mockPlaylist2} from './playlist.mock';

describe('PlaylistStore', () => {
	let playlistStore: PlaylistStore;

	testStore((testDB) => {
		playlistStore = new PlaylistStore(testDB.database);
		return playlistStore;
	}, () => {
		return [mockPlaylist(), mockPlaylist2()];
	}, (mock: Playlist) => {
		const matches: Array<SearchQueryPlaylist> = [
			{id: mock.id},
			{ids: [mock.id]},
			{name: mock.name},
			{userID: mock.userID},
			{trackIDs: mock.trackIDs},
			{isPublic: mock.isPublic},
			{newerThan: mock.created - 1},
			{query: mock.name[0]}
		];
		mock.trackIDs.forEach(trackID => matches.push({trackID}));
		return matches;
	}, () => {

	});
});
