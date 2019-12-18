import {DBObjectType} from '../../db/db.types';
import {AudioFormatType, PodcastStatus, TrackTagFormatType} from '../../model/jam-types';
import {Episode} from './episode.model';

export function mockEpisode(): Episode {
	return {
		id: '',
		type: DBObjectType.episode,
		podcast: 'Podcast 1',
		podcastID: 'podcastID1',
		status: PodcastStatus.new,
		error: 'an error',
		path: '/tmp/jam/podcasts/podcastID1.mp3',
		link: 'https://example.org/podcastID1/episodeID1',
		summary: 'a episode summary',
		date: 1543495268,
		name: 'a name',
		guid: 'a GUID',
		author: 'an author name',
		chapters: [{
			start: 0,
			title: 'a chapter title 1'
		},         {
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
			format: TrackTagFormatType.id3v20,
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
			mbTrackID: 'mbTrackID1',
			mbAlbumType: 'mbAlbumType1',
			mbAlbumArtistID: 'mbAlbumArtistID1',
			mbArtistID: 'mbArtistID1',
			mbReleaseID: 'mbReleaseID1',
			mbReleaseTrackID: 'mbReleaseTrackID1',
			mbReleaseGroupID: 'mbReleaseGroupID1',
			mbRecordingID: 'mbRecordingID1',
			mbAlbumStatus: 'mbAlbumStatus1',
			mbReleaseCountry: 'mbReleaseCountry1'
		},
		media: {
			duration: 12345,
			bitRate: 56000,
			format: AudioFormatType.mp3,
			sampleRate: 44000,
			channels: 2,
			encoded: 'VBR',
			mode: 'joint',
			version: 'MPEG 1 Layer 3'
		}
	};
}

export function mockEpisode2(): Episode {
	return {
		id: '',
		type: DBObjectType.episode,
		podcast: 'Podcast 2',
		podcastID: 'podcastID2',
		status: PodcastStatus.completed,
		error: 'second error',
		path: '/tmp/jam/podcasts/podcastID1.mp3',
		link: 'https://example.org/podcastID1/episodeID2',
		summary: 'second episode summary',
		date: 1543495269,
		name: 'second name',
		guid: 'second GUID',
		author: 'second author name',
		chapters: [{
			start: 10,
			title: 'another chapter title 1'
		},         {
			start: 3000,
			title: 'another chapter title 2'
		}],
		enclosures: [],
		stat: {
			created: 1443495269,
			modified: 1443495269,
			size: 1001
		},
		tag: {
			format: TrackTagFormatType.id3v24,
			album: 'second album name',
			albumSort: 'album sort name, second',
			albumArtist: 'second album artist name',
			albumArtistSort: 'album artist sort name, second',
			artist: 'second artist name',
			artistSort: 'artist sort name, second',
			genre: 'second genre name',
			disc: 5,
			title: 'second title',
			titleSort: 'title sort, second',
			track: 5,
			year: 2000,
			mbTrackID: 'mbTrackID2',
			mbAlbumType: 'mbAlbumType2',
			mbAlbumArtistID: 'mbAlbumArtistID2',
			mbArtistID: 'mbArtistID2',
			mbReleaseID: 'mbReleaseID2',
			mbReleaseTrackID: 'mbReleaseTrackID2',
			mbReleaseGroupID: 'mbReleaseGroupID2',
			mbRecordingID: 'mbRecordingID2',
			mbAlbumStatus: 'mbAlbumStatus2',
			mbReleaseCountry: 'mbReleaseCountry2'
		},
		media: {
			duration: 55555,
			bitRate: 128000,
			format: AudioFormatType.mp3,
			sampleRate: 22000,
			channels: 1,
			encoded: 'CBR',
			mode: 'single',
			version: 'MPEG 1 Layer 8'
		}
	};
}
