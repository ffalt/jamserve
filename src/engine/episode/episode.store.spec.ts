import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {EpisodeStore, SearchQueryEpisode} from './episode.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Episode} from './episode.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';

function mockEpisode(): Episode {
	return {
		id: '',
		type: DBObjectType.episode,
		podcastID: 'podcastID1',
		status: 'new',
		error: 'some error',
		path: '/tmp/jam/podcasts/podcastID1.mp3',
		link: 'https://example.org/podcastID1/episodeID',
		summary: 'a episode summary',
		date: 1543495268,
		title: 'a title',
		guid: 'a GUID',
		author: 'an author name',
		chapters: [{
			start: 0,
			title: 'a chapter title 1'
		}, {
			start: 2000,
			title: 'a chapter title 2'
		}],
		enclosures: [],
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

describe('EpisodeStore', () => {

	const testDB = new TestNeDB();
	let episodeStore: EpisodeStore;

	before(async () => {
		await testDB.setup();
		episodeStore = new EpisodeStore(testDB.database);
	});

	after(async () => {
		await testDB.cleanup();
	});

	beforeEach(function() {
		this.store = episodeStore;
		this.obj = mockEpisode();
		this.generateMatchingQueries = (mock: Episode) => {
			const matches: Array<SearchQueryEpisode> = [
				{id: mock.id},
				{ids: [mock.id]},
				{podcastID: mock.podcastID},
				{podcastIDs: [mock.podcastID]},
				{title: mock.title},
				{status: mock.status},
				{newerThan: mock.date - 1},
				{query: mock.title[0]}
			];
			return matches;
		};
	});

	describe('DBObject Store', () => {
		shouldBehaveLikeADBObjectStore();
	});

});

