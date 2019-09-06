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
