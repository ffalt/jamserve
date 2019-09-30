import path from 'path';

import {testStore} from '../base/base.store.spec';
import {mockTrack, mockTrack2} from './track.mock';
import {Track} from './track.model';
import {SearchQueryTrack, TrackStore} from './track.store';

describe('TrackStore', () => {
	let trackStore: TrackStore;

	testStore(testDB => {
			trackStore = new TrackStore(testDB.database);
			return trackStore;
		}, () => {
			return [mockTrack(), mockTrack2()];
		},
		(mock: Track) => {
			const matches: Array<SearchQueryTrack> = [
				{id: mock.id},
				{ids: [mock.id]},
				{path: mock.path},
				{inPath: path.dirname(mock.path)},
				{inPaths: [path.dirname(mock.path)]},
				{artist: mock.tag.artist},
				{artistID: mock.artistID},
				{parentID: mock.parentID},
				{parentIDs: [mock.parentID]},
				{mbTrackID: mock.tag.mbTrackID},
				{mbTrackIDs: [mock.tag.mbTrackID || '']},
				{rootID: mock.rootID},
				{title: mock.tag.title},
				{album: mock.tag.album},
				{genre: mock.tag.genre},
				{fromYear: mock.tag.year, toYear: mock.tag.year},
				{newerThan: mock.stat.created - 1},
				{query: (mock.tag.title || '')[0]}
			];
			return matches;
		},
		() => {
			// TODO
		});
});
