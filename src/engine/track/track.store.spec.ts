import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {TrackStore, SearchQueryTrack} from './track.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Track} from './track.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import path from 'path';

function mockTrack(): Track {
	return {
		id: '',
		type: DBObjectType.track,
		rootID: 'rootID1',
		parentID: 'folderID1',
		albumID: 'albumID1',
		artistID: 'artistID1',
		name: 'folder name',
		path: '/var/media/root name/folder name',
		stat: {
			created: 1543495268,
			modified: 1543495268,
			size: 9001
		},
		tag: {
			album: 'an album name',
			albumSort: 'album sort name, an',
			albumArtist: 'an album artist name',
			albumArtistSort: 'album artist sort name, an',
			artist: 'an artist name',
			artistSort: 'artist sort name, an',
			genre: 'a genre name',
			disc: 3,
			title: 'a title',
			titleSort: 'title sort, a',
			track: 3,
			year: 1984,
			mbTrackID: 'mbTrackID',
			mbAlbumType: 'mbAlbumType',
			mbAlbumArtistID: 'mbAlbumArtistID',
			mbArtistID: 'mbArtistID',
			mbAlbumID: 'mbAlbumID',
			mbReleaseTrackID: 'mbReleaseTrackID',
			mbReleaseGroupID: 'mbReleaseGroupID',
			mbRecordingID: 'mbRecordingID',
			mbAlbumStatus: 'mbAlbumStatus',
			mbReleaseCountry: 'mbReleaseCountry'
		},
		media: {
			duration: 12345,
			bitRate: 56000,
			format: 'mp3',
			sampleRate: 44000,
			channels: 2,
			encoded: 'VBR',
			mode: 'joint',
			version: 'MPEG 1 Layer 3'
		}
	};
}

describe('TrackStore', () => {

	const testDB = new TestNeDB();
	let trackStore: TrackStore;

	before(async () => {
		await testDB.setup();
		trackStore = new TrackStore(testDB.database);
	});

	after(async () => {
		await testDB.cleanup();
	});

	beforeEach(function() {
		this.store = trackStore;
		this.obj = mockTrack();
		this.generateMatchingQueries = (mock: Track) => {
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
		};
	});

	describe('DBObject Store', () => {
		shouldBehaveLikeADBObjectStore();
	});

});

