// import nock from 'nock';
// import {ThirdPartyConfig} from '../../config/thirdparty.config';
//
// const scope1 = nock('https://ws.audioscrobbler.com')
// 	.get('/2.0/').query({method: 'artist.getInfo', artist: album.artist || '', api_key: ThirdPartyConfig.lastfm.apiKey, format: 'json'})
// 	.reply(200, lastFMresult);
// const scope2 = nock('https://ws.audioscrobbler.com')
// 	.get('/2.0/').query({method: 'artist.getInfo', mbid: 'dummyMDBID', api_key: ThirdPartyConfig.lastfm.apiKey, format: 'json'})
// 	.reply(200, lastFMresult);
// const scope3 = nock('https://ws.audioscrobbler.com')
// 	.get('/2.0/').query({method: 'artist.getTopTracks', mbid: mdbID, api_key: ThirdPartyConfig.lastfm.apiKey, format: 'json'})
// 	.reply(200, {toptracks: lastFMtopTracks});
// import {LastFM} from '../../model/lastfm-rest-data';
// const lastFMresult: LastFM.Result = {
// 	artist: {
// 		name: 'dummy',
// 		mbid: 'dummyMDBID',
// 		url: 'dummy',
// 		image: [],
// 		streamable: 'dummy',
// 		ontour: 'dummy',
// 		tags: [],
// 		similar: {
// 			artist: [{
// 				name: artist.name,
// 				mbid: mdbID,
// 				image: [],
// 				url: ''
// 			}]
// 		}
// 	}
// };
// const lastFMtopTracks: LastFM.TopTracks = {
// 	track: [{
// 		name: track.tag.title || '',
// 		mbid: track.tag.mbTrackID || 'dummyTrackMBID',
// 		url: '',
// 		streamable: '',
// 		playcount: 1,
// 		listeners: 2,
// 		image: [],
// 		artist: {
// 			name: artist.name,
// 			mbid: mdbID,
// 			url: ''
// 		},
// 		rank: ''
// 	}],
// 	artist: 'dummy2'
// };
// await api.metadataController.metadataService.clear();


// // TODO: move this into metaDataService.test.ts
// const artists = (await api.artistController.artistService.artistStore.all()).filter(a => a.id !== album.artistID && a.trackIDs.length > 0);
// if (artists.length === 0) {
// 	throw new Error('Wrong Test Setup');
// }
// const artist = artists[0];
// const mdbID = artist.mbArtistID || 'dummyMDBID2';
// const tracks = await api.trackController.trackService.trackStore.search({artistID: artist.id});
// if (tracks.items.length === 0) {
// 	throw new Error('Wrong Test Setup');
// }
// const track = tracks.items[0];
// const list = await controller.similarTracks({query: {id: album.id}, user});
// expect(scope1.isDone()).toBe(true);
// expect(scope2.isDone()).toBe(true);
// expect(scope3.isDone()).toBe(true);
// TODO: move this into metaDataService.test.ts
// import {LastFM} from '../../model/lastfm-rest-data';
// import nock from 'nock';
// import {ThirdPartyConfig} from '../../config/thirdparty.config';
//
// const lastFMresult: LastFM.Result = {
// 	artist: {
// 		name: 'dummy',
// 		mbid: 'dummyMDBID',
// 		url: 'dummy',
// 		image: [],
// 		streamable: 'dummy',
// 		ontour: 'dummy',
// 		tags: [],
// 		similar: {
// 			artist: []
// 		}
// 	}
// };
// const scope1 = nock('https://ws.audioscrobbler.com')
// 	.get('/2.0/').query({method: 'artist.getInfo', artist: album.artist || '', api_key: ThirdPartyConfig.lastfm.apiKey, format: 'json'})
// 	.reply(200, lastFMresult);
// const scope2 = nock('https://ws.audioscrobbler.com')
// 	.get('/2.0/').query({method: 'artist.getInfo', mbid: 'dummyMDBID', api_key: ThirdPartyConfig.lastfm.apiKey, format: 'json'})
// 	.reply(200, lastFMresult);
// await api.metadataController.metadataService.clear();
//
import {testService} from '../base/base.service.spec';
import {MetaDataService} from './metadata.service';

describe('MetaDataService', () => {
	let metaDataService: MetaDataService;
	testService({mockData: false},
		async (store, imageModuleTest, audioModule) => {
			metaDataService = new MetaDataService(store.metaStore, store.folderStore, store.trackStore, store.albumStore, store.artistStore, audioModule);
		},
		() => {
			describe('.', () => {
				it('should', async () => {
				});
			});
			/*
			describe('.getArtistInfo', () => {
				it('should', async () => {
				});
			});

			describe('.getAlbumInfo', () => {
				it('should', async () => {
				});
			});

			describe('.getFolderArtistInfo', () => {
				it('should', async () => {
				});
			});

			describe('.getFolderAlbumInfo', () => {
				it('should', async () => {
				});
			});

			describe('.getSimilarArtists', () => {
				it('should', async () => {
				});
			});

			describe('.getSimilarArtistFolders', () => {
				it('should', async () => {
				});
			});

			describe('.getTopTracks', () => {
				it('should', async () => {
				});
			});

			describe('.getAlbumSimilarTracks', () => {
				it('should', async () => {
				});
			});

			describe('.getArtistSimilarTracks', () => {
				it('should', async () => {
				});
			});

			describe('.getFolderSimilarTracks', () => {
				it('should', async () => {
				});
			});

			describe('.getTrackSimilarTracks', () => {
				it('should', async () => {
				});
			});

			describe('.musicbrainzSearch', () => {
				it('should', async () => {
				});
			});

			describe('.acoustidLookupTrack', () => {
				it('should', async () => {
				});
			});

			describe('.lastFMLookup', () => {
				it('should', async () => {
				});
			});

			describe('.lastFMAlbumSearch', () => {
				it('should', async () => {
				});
			});

			describe('.lastFMArtistSearch', () => {
				it('should', async () => {
				});
			});

			describe('.lastFMTopTracksArtist', () => {
				it('should', async () => {
				});
			});

			describe('.lastFMTopTracksArtistID', () => {
				it('should', async () => {
				});
			});

			describe('.lastFMSimilarTracks', () => {
				it('should', async () => {
				});
			});

			describe('.acousticbrainzLookup', () => {
				it('should', async () => {
				});
			});
			describe('.coverartarchiveLookup', () => {
				it('should', async () => {
				});
			});
			describe('.musicbrainzLookup', () => {
				it('should', async () => {
				});
			});
			describe('.lyrics', () => {
				it('should', async () => {
				});
			});
			describe('.wikipediaSummary', () => {
				it('should', async () => {
				});
			});
			describe('.wikidataLookup', () => {
				it('should', async () => {
				});
			});
			describe('.wikidataSummary', () => {
				it('should', async () => {
				});
			});
			describe('.cleanUp', () => {
				it('should', async () => {
				});
			});
			describe('.clear', () => {
				it('should', async () => {
				});
			});

			 */
		}
	);
});
