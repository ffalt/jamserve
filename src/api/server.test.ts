// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import supertest from 'supertest';
import {testEngines} from '../engine/engine.spec';
import {mockUserName, mockUserName2, mockUserPass, mockUserPass2} from '../engine/user/user.mock';
import {Server} from './server';

describe('Server', () => {
	let server: Server;
	let request: supertest.SuperTest<supertest.Test>;
	let get: (apiPath: string) => supertest.Test;
	let post: (apiPath: string) => supertest.Test;
	let getNotLoggedIn: (apiPath: string) => supertest.Test;
	let postNotLoggedIn: (apiPath: string) => supertest.Test;
	let getNoRights: (apiPath: string) => supertest.Test;
	let postNoRights: (apiPath: string) => supertest.Test;
	testEngines({}, async testEngine => {
		testEngine.engine.config.server.port = 10010;
		testEngine.engine.config.server.listen = 'localhost';
		server = new Server(testEngine.engine);
		await server.start();
		request = supertest('http://localhost:10010');
		const res1 = await request.post('/api/v1/login')
			.send({username: mockUserName, password: mockUserPass, client: 'supertest-tests'});
		const user1token = res1.body.jwt;
		get = apiPath => request.get(apiPath).set('Authorization', 'Bearer ' + user1token);
		post = apiPath => request.post(apiPath).set('Authorization', 'Bearer ' + user1token);
		const res2 = await request.post('/api/v1/login')
			.send({username: mockUserName2, password: mockUserPass2, client: 'supertest-tests'});
		const user2token = res2.body.jwt;
		getNoRights = apiPath => request.get(apiPath).set('Authorization', 'Bearer ' + user2token);
		postNoRights = apiPath => request.post(apiPath).set('Authorization', 'Bearer ' + user2token);
		getNotLoggedIn = apiPath => request.post(apiPath);
		postNotLoggedIn = apiPath => request.post(apiPath);
	}, () => {
		describe('/lastfm/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/lastfm/lookup').query({type: 'album-toptracks', id: 'EO(12qMB^&K@L'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/lastfm/lookup').query({type: '', id: 'FaS!a'}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/lastfm/lookup').query({type: 'invalid', id: 'WncUJ'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/lastfm/lookup').query({type: 'track', id: ''}).expect(400);
					});
			});
		});
		describe('/acoustid/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/acoustid/lookup').query({id: 'F%e3iTJT&[(JRHFGZ'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/acoustid/lookup').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "inc" set to value empty string', async () => {
						return get('/api/v1/acoustid/lookup').query({id: 'TwJSTEJGOj0E', inc: ''}).expect(400);
					});
			});
		});
		describe('/musicbrainz/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/musicbrainz/lookup').query({type: 'place', id: 'DRv(b]^civaVzQ'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/lookup').query({type: '', id: '43SAF@H3m%jfL(9fP'}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/musicbrainz/lookup').query({type: 'invalid', id: '7YmNblCg2EL@P'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/lookup').query({type: 'artist', id: ''}).expect(400);
					});
					it('should respond with 400 with "inc" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/lookup').query({type: 'instrument', id: 'nb2Vv', inc: ''}).expect(400);
					});
			});
		});
		describe('/musicbrainz/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/musicbrainz/search').query({type: 'release'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: ''}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "recording" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'artist', recording: ''}).expect(400);
					});
					it('should respond with 400 with "releasegroup" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'release', releasegroup: ''}).expect(400);
					});
					it('should respond with 400 with "release" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'work', release: ''}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'artist', artist: ''}).expect(400);
					});
					it('should respond with 400 with "tracks" set to value string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'artist', tracks: '4dRa1L(NctI'}).expect(400);
					});
					it('should respond with 400 with "tracks" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'label', tracks: ''}).expect(400);
					});
					it('should respond with 400 with "tracks" set to value boolean', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'release', tracks: true}).expect(400);
					});
					it('should respond with 400 with "tracks" set to value float', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'release-group', tracks: 34.45}).expect(400);
					});
			});
		});
		describe('/acousticbrainz/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/acousticbrainz/lookup').query({id: 'mN6e*E]u25%KsPz'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/acousticbrainz/lookup').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "nr" set to value string', async () => {
						return get('/api/v1/acousticbrainz/lookup').query({id: 'I3H(m&YS&V$H*3', nr: 'XB]VbQ^BxnM3^'}).expect(400);
					});
					it('should respond with 400 with "nr" set to value empty string', async () => {
						return get('/api/v1/acousticbrainz/lookup').query({id: '9Iu3Iw4v8', nr: ''}).expect(400);
					});
					it('should respond with 400 with "nr" set to value boolean', async () => {
						return get('/api/v1/acousticbrainz/lookup').query({id: 'b!HGZtaqFfXxr', nr: true}).expect(400);
					});
			});
		});
		describe('/coverartarchive/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/coverartarchive/lookup').query({type: 'release-group', id: '!rEcd'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/coverartarchive/lookup').query({type: '', id: 'Qm4aVhyD^x%qg1L]'}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/coverartarchive/lookup').query({type: 'invalid', id: 'tNJ1s3VpkT['}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/coverartarchive/lookup').query({type: 'release', id: ''}).expect(400);
					});
			});
		});
		describe('/wikipedia/summary', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/wikipedia/summary').query({title: '#s7TWBJDxg1Bi6z(O'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/wikipedia/summary').query({title: ''}).expect(400);
					});
			});
		});
		describe('/wikidata/summary', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/wikidata/summary').query({id: '^[6aOH2Om@e9d'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/wikidata/summary').query({id: ''}).expect(400);
					});
			});
		});
		describe('/wikidata/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/wikidata/lookup').query({id: '%7zS1JPg)nz&S^OKK'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/wikidata/lookup').query({id: ''}).expect(400);
					});
			});
		});
		describe('/autocomplete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/autocomplete').query({query: '3S$aqjF9D9vQW'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "track" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: 'GXaMKzDUq', track: 'w7THXnsPZX'}).expect(400);
					});
					it('should respond with 400 with "track" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'gs02Y4eJw&D', track: ''}).expect(400);
					});
					it('should respond with 400 with "track" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'rZdV6o7PQJ%P2#$%', track: true}).expect(400);
					});
					it('should respond with 400 with "track" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: 'Ij098ne', track: 23.41}).expect(400);
					});
					it('should respond with 400 with "track" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'ml0b(xIa7d9[H', track: -1}).expect(400);
					});
					it('should respond with 400 with "artist" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: '&(7729^IgJJ', artist: 'AcI%3MGpfbma'}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'ba[WE!MoG7$mPekLf', artist: ''}).expect(400);
					});
					it('should respond with 400 with "artist" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: '1bIc9M)sool50Z%cq', artist: true}).expect(400);
					});
					it('should respond with 400 with "artist" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: 'jkjg]Hm', artist: 28.04}).expect(400);
					});
					it('should respond with 400 with "artist" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'P(J(@4*U', artist: -1}).expect(400);
					});
					it('should respond with 400 with "album" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: 'O!9Y1bVltVlP[', album: 'ZHkJgr!E2]X$tT@!w'}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: '4j(223H[EJjGg]RT', album: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: '@yOppZ]&]c5N(', album: true}).expect(400);
					});
					it('should respond with 400 with "album" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: 'TC0t*9(9qYuChh9ykb', album: 61.1}).expect(400);
					});
					it('should respond with 400 with "album" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'P$He69kS10WrqeQk', album: -1}).expect(400);
					});
					it('should respond with 400 with "folder" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: '2jSv@41pzho[', folder: 'x27ZfxnCpq2*z3PDe)N'}).expect(400);
					});
					it('should respond with 400 with "folder" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'BB7F]%oTem)gUP', folder: ''}).expect(400);
					});
					it('should respond with 400 with "folder" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'weDyKy', folder: true}).expect(400);
					});
					it('should respond with 400 with "folder" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: '39HCW', folder: 49.94}).expect(400);
					});
					it('should respond with 400 with "folder" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: '[sKm(S$TpI@kfVt529', folder: -1}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: 'wsJDsV4tXquTV%R1]QMq', playlist: 'wNo4U1*1'}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: '93qBR]5', playlist: ''}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'jZf#w8', playlist: true}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: '1yKM4n%', playlist: 32.93}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'N2WUg#0', playlist: -1}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: 'lfPU6!EV1N7vR', podcast: 'n2jNSrZ6ba'}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'TgNT5yhvTo1', podcast: ''}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: '^oYRa9H', podcast: true}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: 'WFYxui', podcast: 63.99}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'fUndZ!97X', podcast: -1}).expect(400);
					});
					it('should respond with 400 with "episode" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: 'ZetJn', episode: 'D6DdFElC]5sL2'}).expect(400);
					});
					it('should respond with 400 with "episode" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'o*4*OUxFuB!bp#fO(fdl', episode: ''}).expect(400);
					});
					it('should respond with 400 with "episode" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'chU6Cu%', episode: true}).expect(400);
					});
					it('should respond with 400 with "episode" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: 'E[Gwyz*]wvTPoA', episode: 40.92}).expect(400);
					});
					it('should respond with 400 with "episode" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'f]97xf*', episode: -1}).expect(400);
					});
			});
		});
		describe('/genre/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/genre/list').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/genre/list').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/genre/list').query({offset: 'eW%2ilYLWl5@z'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/genre/list').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/genre/list').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/genre/list').query({offset: 26.29}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/genre/list').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/genre/list').query({amount: 'dIjZsj]87'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/genre/list').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/genre/list').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/genre/list').query({amount: 61.16}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/genre/list').query({amount: 0}).expect(400);
					});
			});
		});
		describe('/stats', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/stats').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/stats').query({rootID: ''}).expect(400);
					});
			});
		});
		describe('/nowPlaying/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/nowPlaying/list').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/nowPlaying/list').query({offset: '^YrUV)lv9e'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/nowPlaying/list').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/nowPlaying/list').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/nowPlaying/list').query({offset: 37.36}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/nowPlaying/list').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/nowPlaying/list').query({amount: 'IF6u(j$'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/nowPlaying/list').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/nowPlaying/list').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/nowPlaying/list').query({amount: 74.52}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/nowPlaying/list').query({amount: 0}).expect(400);
					});
			});
		});
		describe('/chat/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/chat/list').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "since" set to value string', async () => {
						return get('/api/v1/chat/list').query({since: '47cUclSLgK(dBtq@'}).expect(400);
					});
					it('should respond with 400 with "since" set to value empty string', async () => {
						return get('/api/v1/chat/list').query({since: ''}).expect(400);
					});
					it('should respond with 400 with "since" set to value boolean', async () => {
						return get('/api/v1/chat/list').query({since: true}).expect(400);
					});
					it('should respond with 400 with "since" set to value float', async () => {
						return get('/api/v1/chat/list').query({since: 17.63}).expect(400);
					});
					it('should respond with 400 with "since" set to value less than minimum 0', async () => {
						return get('/api/v1/chat/list').query({since: -1}).expect(400);
					});
			});
		});
		describe('/folder/index', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/index').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/folder/index').query({rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "parentID" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({parentID: ''}).expect(400);
					});
					it('should respond with 400 with "childOfID" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({childOfID: ''}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({artist: ''}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({title: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({album: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({genre: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value string', async () => {
						return get('/api/v1/folder/index').query({level: '92BKjSoRbe'}).expect(400);
					});
					it('should respond with 400 with "level" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({level: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value boolean', async () => {
						return get('/api/v1/folder/index').query({level: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/folder/index').query({newerThan: 'PWEqeyy!LaW8b'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/folder/index').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/folder/index').query({newerThan: 84.44}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/index').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/folder/index').query({fromYear: 'X!DSGt0!N1%oqI5'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/folder/index').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/folder/index').query({fromYear: 19.36}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/index').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/folder/index').query({toYear: 'n74BxLr0oR2&'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/folder/index').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/folder/index').query({toYear: 60.71}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/index').query({toYear: -1}).expect(400);
					});
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({type: ''}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/folder/index').query({type: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "types" set to value null', async () => {
						return get('/api/v1/folder/index').query({types: null}).expect(400);
					});
					it('should respond with 400 with "types" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({types: [null, '']}).expect(400);
					});
					it('should respond with 400 with "types" set to value invalid enum', async () => {
						return get('/api/v1/folder/index').query({types: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/folder/index').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/folder/index').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/folder/index').query({sortDescending: '@IClHB!2FBsLD4ct'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/folder/index').query({sortDescending: 7426442488971266}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/folder/index').query({sortDescending: -3800271708749825}).expect(400);
					});
			});
		});
		describe('/folder/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/id').query({id: 'a42(h6O@'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '8ErMXxLRFyqBzjbGx', folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'tuw%[k1!zEEP5SW6', folderTag: '2b1ur2A'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'w#^xr6*HZN6(K', folderTag: 8330766526185474}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: '[bB)9OSV*KTjW', folderTag: -4376105565814785}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'V(a4HPkt%', folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'pvAwYkBm', folderState: '2Z]5j(7QoWHf$s'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '0xRvIDSuiLTKhdRQ9d', folderState: 522086120423426}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'SGeb5rV*e(', folderState: -2230967909482497}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '5z5eAFh@RP12^)VvV', folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'fVx18*coVdu$rld', folderCounts: '6qVyg7Nc82g3j69gsU#D'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '[iRz74&#d&ugfe', folderCounts: 1930893916635138}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'H5tkNe', folderCounts: 966378345463807}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'RD9tqPXUenfVr', folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'MHNaPiR%sN4q0vm', folderParents: 'E(YLztVuq9UZ6r'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'fxZ$fq9@7JCm24xQ', folderParents: -1335296272629758}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'eR26HzmET*[t@Q(0d', folderParents: -2013973431975937}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'rpQZjpSJCcm4W)(e', folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'ySRQ9XoG1Q&(rjInC!I', folderInfo: '6x4g(lRyOFWNmoiGGCR'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'tH)gb0#uBvbi', folderInfo: 7918628833853442}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'ffLj3hakAY', folderInfo: 7831291613413375}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'Y*2BOF@Tyo$tk2E8x', folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'D]425y', folderSimilar: 'Op)0XnCifRdjOl'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'p@rDuQON%HG[ms7x7%', folderSimilar: -4515345633116158}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'Ekh@o@*sVex%[', folderSimilar: 6837237585018879}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'vwRU0$X^n58', folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: '*VtQk4c)SwI@lJ', folderArtworks: 'o[U(0254'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '8%(mE1&SJBh', folderArtworks: 577450559930370}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: '#mD]mw', folderArtworks: 5208773295603711}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '1H%ORJo(g0Tlq0LYF', folderChildren: ''}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'fpxgM[VI]ZQ!KA5mTB', folderChildren: 'c0$gW*B^h4xP!2MPy383'}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '2DRUVAED*TFvewY1(Sr', folderChildren: 772998751584258}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'W&o8l', folderChildren: -848696501600257}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '4736QmVLaVPp]d', folderSubfolders: ''}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: '2WpxUUnbS8jxZ$Gr', folderSubfolders: 'k]tTAGh'}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '1cR!)qZV2O7a*!&ZHd', folderSubfolders: 6590418657476610}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'lL%!g9gMEtQ])j3', folderSubfolders: -5042048222625793}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'YIsg[b@VlsqBR', folderTracks: ''}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: '!I)!vvQ(lqpJ4t2T', folderTracks: 'rx%fHVQ'}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '3q[EYP', folderTracks: -906688869695486}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'P@zfO&gndmgyC6', folderTracks: -6057061179719681}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'Za1rnFdZBaCw(VCyj5k', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'KfQcZm', trackMedia: 'PcH9L'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'C@@k8tc1)T0DijI1Y', trackMedia: -8228582589464574}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'j^J&(Vw9@GIq26c$I', trackMedia: -6172755586187265}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'yD5]v', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: '2JEPh@C8', trackTag: '$A*%Zrcm'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'uWJ!I!&o&Ww%HoSM*e5%', trackTag: -1898925950763006}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'kt*CWm)k]LF$', trackTag: 8746563211886591}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'THn4Gc^A', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'CcsCg#cBe8', trackRawTag: '3AIelSKY#(u25e!jGpY'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'h1n0zlBTYtE%E7%[6', trackRawTag: -2600691633750014}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: ')*MriZhcQhkKBtYls', trackRawTag: -5359977673785345}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '#%PBaI', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'v6CNNGzoxq&Ek$*%', trackState: 'HPXf(5(Q7%'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'lXEDxw]', trackState: -444900097130494}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'knErnW!b(xEQg2Xn', trackState: -7512642952364033}).expect(400);
					});
			});
		});
		describe('/folder/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/ids').query({ids: ['Ts@*3tL', 'OgXTLP&']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/folder/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['s4ysvlGGc', 'hL[Edp3EDZn6fwptW[We'], folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['%qjqEq1GaAt', 't)Rg0Xn71(mTLH@4#)2'], folderTag: '^pieYzoFNULgADktr(7T'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['^F6T81*^H', '6woA07i4qwkJe&Z%3'], folderTag: -3306089428811774}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['3Q%gCuXjn(lF^Vk&(@', '$El@E*&@P'], folderTag: -3963734166863873}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['0NZB4wY)od*6%(vV', 'J8QUBHT'], folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['rnUe6n(2#yjfQc2', 'rN8Arn'], folderState: 'cOVbf2J@]1Te'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['p(7AP0YY0GtAsUH)As', 'kY*wMQ@HTcwf4LMzpK'], folderState: 5128743706165250}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['f)LP*^F', 'UQPh84'], folderState: 4397203523108863}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['!1al1YQ%FUDR4ovN4', '5rH%Z3u31Bp$Ca'], folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['Um[M7hQb20zsLI]9Lxi', '@2Empz$j'], folderCounts: 'oapuEt99WesZhJF'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['WkeYZL', 'Hy4hx8IXA'], folderCounts: -391898652999678}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['0phKERJXoWm', ']ZS)ukyWBhTEbnIQ'], folderCounts: 5281288575516671}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['tUuzfub!', 'S2BBr7K7a]S(XC7CY'], folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['QaTKMq', 'oZHv%73xDiO506qJH'], folderParents: 'jk*TqTL&'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['bYIvK8', 'IHs0]O!BUNtL'], folderParents: -3825039694626814}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['Yeg1ghFol0g', '!*Y5[yLhbLq]%'], folderParents: 7121016077680639}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['18SbpGOEjGNP', 'w0A[Izk&ee'], folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['dBU@vHqBY5%C&$4zc]', 'uQE#gIKs9Mv&$F%EUMx6'], folderInfo: '7E#]Zp[9%I'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['ejRCT%&JuA%^V', '%5ITtnipG6PClDIdQMM('], folderInfo: 8431138112536578}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['0woQqPe%I^^5H%TG$C', 'Qv2C*odbj3s3Sz'], folderInfo: 8816536936513535}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['(QxU0^lWznc1OWn3P', 'JCsYPcG)5QCP&!d'], folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['EsYYM', '8[#$iy]r!cr'], folderSimilar: '@mgkF7h[EcmvtPc50'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['t5%%NDI', 'Z4tIzLxqNrpNgnoVkKwB'], folderSimilar: -8844089801834494}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['C25IMTp', 'VytB8E0PojOa6'], folderSimilar: 955250915672063}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['w*dYKTsE@f7U%[P', 'TXJoFrG5%zo9h*!pJ)'], folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['ZXZPIjp0tUeowUiE%q@', 'n[j&iZ'], folderArtworks: 'g[x!mtYZzSb(I*'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['$9hs1uLTW', '@j$Sy!$'], folderArtworks: 6622906796736514}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['ZmrCr0!v5qaP', '$%Q1SvLDgh](3O'], folderArtworks: -6581722716045313}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['*ypbaLw5SCh7bxbcdAJB', '7]WZ5rRK8DQvK'], folderChildren: ''}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['ZK4ojiI8v', '72Y1XRVsskOu*Jxz'], folderChildren: 'P0YMp1'}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['E#VGr^XM', '!^6V#o9sP[WVF157'], folderChildren: 4776289600798722}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['zGe3Fo*', 'pG!6JgzH8'], folderChildren: -6187321103745025}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['$(J]2', 'gg)AlsW[IKU6'], folderSubfolders: ''}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['^u^X2Mpgs', 'k)*3PxEKG)Yj0'], folderSubfolders: '5tDvd]D]'}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['U64PQZ', '15@(9iGa'], folderSubfolders: 4449268777615362}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['J[nvgbyTXQ4A3ZZBdlJ', '(5lSITEk'], folderSubfolders: -8787549455646721}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['n%XU*BZzk', 'bBcGZ6TBLcvAgF'], folderTracks: ''}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['W8L(JPB6DHy!lY', '47NDt]o^q@88f2gnc'], folderTracks: 'ugV6sh'}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['m2nD7G1G*MsLah9Zf', 'lixIF#CBt)zD'], folderTracks: -1779760329916414}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['AqyL2ken0)PIYvZ9', '@VKmHM(5rIUP'], folderTracks: -378422446522369}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['OAY]XcC!w2VjTGi[7', '[%VA$k3J6ZFCq3My2PQU'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: [']iAn9U0k]HTs$', 'qI[xn'], trackMedia: 'CpBq&KX]'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['osij9m0br(KD', '8#RO&#Z%lwzKf9#u'], trackMedia: 340135149305858}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['r$PB8hCkB[&!&hbKnA', '2tKn]006z'], trackMedia: 7975104629702655}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['*tVNBHW[', '4^P3LW2'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['nPzlpLP!C4v@RJhf&G7[', 'gtpYfG(RHP8f0YTEce'], trackTag: 'j&e*Uw'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['qgXrpc', '%VSE@'], trackTag: 1311893675311106}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['IgOqHeyf', '3f2@aU&GsE5'], trackTag: -6274116730486785}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['#75gNIOin@', 'l!w^N&'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['^HqBFO0@6aoPFK', 'k[z)fDf[fAb#K!y)d!$'], trackRawTag: 'bOthA['}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['9AiMg$o', '[UDpC'], trackRawTag: -4756628268122110}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['puN!bKv4xO', 'hAUq6n'], trackRawTag: 8810628856676351}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['S]1JxrsM4', 'bFt*05&OMfX6RK'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['oZL[imf[&KDH0GmeS@', 'lv2bVdzgO'], trackState: '3Qplo%Xmz'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['iY9f@(D^Rr]Hoqee', 'Ud5M6'], trackState: -5225635626614782}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['omoBb%9VKlviUSafT', '4]qAmPl@'], trackState: -6539959389388801}).expect(400);
					});
			});
		});
		describe('/folder/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/tracks').query({ids: [')1[RU', 'ECnvz!mZx#w']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/folder/tracks').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "recursive" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['U1kBoylp', '!(vq4159xEp$!4L'], recursive: ''}).expect(400);
					});
					it('should respond with 400 with "recursive" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['l18aa@IfPcUM$@', ']HE[HE4d'], recursive: '1vdYKcaz'}).expect(400);
					});
					it('should respond with 400 with "recursive" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['aX)pwVlBTeqgcCAcEN', 'DZ*saUp!7MmBH'], recursive: -1003360408829950}).expect(400);
					});
					it('should respond with 400 with "recursive" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['lLSH!IQe4%k%7VRJ55u', '2DxJvw*Y'], recursive: 227780549672959}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['L(l1NEP', '@H4omwy('], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['c4ONI', 'V$JizxtrP@'], trackMedia: '6(XKJr'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['ukxa3pk@AU]gP43', 'w*Xw)9hBDD$SkST2'], trackMedia: -8820643185295358}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['wmXEN4X$LwrrO9VAb', 'NzPlX$Vv&GtSrl)'], trackMedia: 3074896800251903}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['nqwhfQzPfbia[&2', 'e4jpbs@r64p*!v(VF'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['4wZth^wem$BI*wM', 'zJUV5])c'], trackTag: '74xbAnhZ'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['s&)PVlo[CFF', 'Bp6FR2@#2]2QEo'], trackTag: 4151721303474178}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['h8bsu%OdwiPB&$q', '9ZF]FbSxF'], trackTag: -5136737705656321}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['YTF%gCFB', 'v%[C5'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['KFw0^F', ')SCln9(51GB6reIj4'], trackRawTag: '(oZtif'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['HG^Oe]tpw', 'PmK7FG8t6Z'], trackRawTag: -4493395883982846}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['zotpg$$kW', 'P0]#Cd@*u3r0Dx'], trackRawTag: -5895521688354817}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: [')&NQYMK', 'k$R#[vbJKemEeRgybI*6'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['jDGOMaP', '!kDDZ^9'], trackState: '1NIJgb9LHTZcN'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['M0l!I', 'N60M9)!K'], trackState: 4755161968803842}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['3K9j^#)^jT^*k77JN', 'oY#70'], trackState: -3886732231573505}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['fsc$fBC*nIux1', 'tOe$Q[CNRFyN@u!H'], offset: 'b$S7S'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['xUhNLsokNHd', 'b7aRP7&ELV'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['Aw8*mHMZbx', '0aT*sd3L&zGZ*k4d]'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['eN!daukT@0JhIqgPZH', 'LkcqJKaFV6dF1O'], offset: 44.82}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['XB(ijC3AW!gylr^72', 'F^ySVDDnXPh%v9p'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['JjB4v*NQ1', 'n&MSz@fNZ'], amount: 'kg2]7D1WO!%PWo'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['0FA@5zCj15]y!!UoKZ', '!B)9E405#Y6'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['Y&kCGg', 'cowa)WP%xc'], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['!ZFazFdJo', '@80Mpv'], amount: 72.84}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['qEwqY%c%vm3y', 'dg6NVwuPe6X'], amount: 0}).expect(400);
					});
			});
		});
		describe('/folder/subfolders', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/subfolders').query({id: 'Om@^IAhVy'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'A$mBdirCK6X(', folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '7ba4L*8', folderTag: '@F#TE2G77p6M9#o'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'tmF8^!w', folderTag: 8475925985361922}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: '&ZIf)rFU8D', folderTag: -7456909070172161}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'HjK%xFq]i', folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'wsRlWQ6D', folderState: 'oF42E'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'UvEi0Zg3ogp4G0w0qJe', folderState: 3709647101886466}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'P())*7rDvM5B*7Q$C', folderState: -266504775925761}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'v&0^ZO(2rxx0oa*p)]y', folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'pdJ%utBprqZ*oNJJn', folderCounts: 'Q9fZhn'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'zuxGsm', folderCounts: 7441343198527490}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'rHATTex!4)j', folderCounts: 2380866940567551}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '8Dx%ko&', folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'Hz*aavc', folderParents: 'BT6vI'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: '4L^apz!K!GX@75Ch1', folderParents: 6208783663497218}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'uZ9FiD4Ny^jPe4', folderParents: 998720560693247}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'TMeLHJ!Q20$42Ljsy', folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'STnw&#)&CTzJsfqzo', folderInfo: 'C2D^bN7)toFQW'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'nr^)QOxQg18h#&jDg', folderInfo: 7388614719700994}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'I8dZVGhjkeq)eve]B', folderInfo: -7086661661884417}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'U8ObW!JF&', folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'b88wCPq1D62*XT(RB)t', folderSimilar: '[d3Wcjb'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'uGYNo', folderSimilar: 4868406650077186}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'G$4S[1th[gMy@VCq', folderSimilar: -3573532290187265}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '[03t%cxw*mhU3wPd', folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '6qpJx$E1zd$', folderArtworks: 'l0C(do0'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'gqIk&xaV', folderArtworks: -1339799407427582}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'TI9@Ad3ojJNFU*k!GHR7', folderArtworks: -6134352672980993}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'NGfLYXu*sHKY59', offset: 'DQq25US(D'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: ')U[#UN71VTC3i3y8z2', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/subfolders').query({id: '6f&Th', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'PUMEN3krW3J1!5y', offset: 58.15}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'oALzbxeg[D#I[', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'obg[hNUnC*', amount: '!r0DDo[IVB$nWZ%(17u'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '0EhO]7Ws2@YFqu9FI5', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'E^7Evt0O', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'eJ080[vb#0FgZmA8qC^', amount: 57.66}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'fo^dK]4Of41RR', amount: 0}).expect(400);
					});
			});
		});
		describe('/folder/artist/similar', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/artist/similar').query({id: '345Jo3ZeM'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '5pzps]j2a)ZW0', folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'AT1[%iWK', folderTag: 'mhx8V&GPSis'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'DOaw9h', folderTag: -4215153289592830}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '*Qn10X', folderTag: -883565105512449}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'Vz@)4Qrk#UhYyDx^!', folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'ium&TSmD5w0CZ76', folderState: 'uQsCW6%(QPyk#FlkjN#'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '1UD8nv]Cvfqrtl))0Y', folderState: -2975986861735934}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '0$USzONSGOK^', folderState: -4313237268987905}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'AyHe[#)e', folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'C^Gop9uIXHxfmn', folderCounts: 'KkSxS526D(d[1fo56R'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '148YM[l', folderCounts: -5726907567964158}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'jbS8hvIPY@aC2VB', folderCounts: -3021808030711809}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '3zXrUqI@GJJd$Ml(', folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '[Bw]YV)X@Z(iqHf', folderParents: 'ARt^^XmHrVXO%)EHXdFE'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '1s4nlgm', folderParents: -629826205515774}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'qSrb4bCQi8F&&@FizBy', folderParents: -2698134027239425}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'xODf0KsX[hrD&3YjJ', folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'JkmmV^', folderInfo: '82vo$3vZR2cLH%M4!X]'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'X2TX7M96a', folderInfo: -7425506915909630}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'd)9l]1YK0vzDk', folderInfo: -6656056822333441}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'G[DxrJ1nJWfoW9', folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'RKAOzwT@x9', folderSimilar: 'rkFXbf0qK'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '@f*8gUGdGpSRhID', folderSimilar: 6659374915256322}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'DK3sT&W*%%4o[^Wj6v(', folderSimilar: 3004075184488447}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'n!DQR5vx7d7fkX]z', folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'JU3Iqqep!wNIlqo9pvJ', folderArtworks: 'oZ5Rv$'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'z&FVybk$W9XM1N6fj[', folderArtworks: 5194341190467586}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '57SIqACzV*&kjF(1', folderArtworks: -1900244858044417}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'y77r[Pf', folderChildren: ''}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'S5HZH[WWP&', folderChildren: 'R2dMq'}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'sr$q@HLlTH]%oWa', folderChildren: 3948787638730754}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'pxtd#Op6', folderChildren: 6397220437884927}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'lySNK$XGNy8y*zVYJ#ya', folderSubfolders: ''}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '#6&9H2^9lK4i', folderSubfolders: 'wbuG4]G0IJ4Oe)l0j4Sd'}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: ']d)t7h0KlMWC7sP', folderSubfolders: 823640840994818}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'v7xxFPyG)zBT[', folderSubfolders: 2042573048774655}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'Eh^vwtD', folderTracks: ''}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'PdP%NJLUuJr2Enif!tM9', folderTracks: 'm^aHzEYoS'}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '0ChV6n%8Fe0VJm', folderTracks: -2104172862242814}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '%yYX0', folderTracks: -7807509855207425}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'GvXMSi8cG4sli@Iv$]v^', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'C[X@Sb1*fj6BKJ', trackMedia: 'XNUV)1ajnei9*bg0'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '6k!xb5gK[@OR', trackMedia: 1758417165221890}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'mIjmbVcTV!y', trackMedia: -2437913518276609}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 's8(HLIqv!N', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'CEYa28y', trackTag: 'ObjoujOEr0$[Mq@4i'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'IRn8W!Lg[B$2B1', trackTag: 1891171404087298}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'zYMf9R', trackTag: 2055825581408255}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'aV$ii', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'Dh%7)4', trackRawTag: 'iMFydjM'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: ')dPwQdT%mCmZ', trackRawTag: 6786155513118722}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'gtxOlVRcklxaTsL', trackRawTag: 5959859493142527}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'hnGw&', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '*5nkdpuec', trackState: 'J88b2g@'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: ']M4%MA1s)&%L5', trackState: -3101953143865342}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'Iy7)!oHg&emWXD', trackState: -7363065540509697}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '6dR7xEoS', offset: 'ff&]Gq4L*cc0R)yp5&O'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '$P]4*m%2lt4Tiui0', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'XaIsI*rXBCb#0n', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '9)Bb[EIUKkc', offset: 33.68}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'W9K6Tkn714', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '7b(Rt8m]p%g', amount: 'NJugAHw'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 't2dv(1l7t', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'xT8M^L]V]%UfXgDpL', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'V[Gp2F97x^pB7w', amount: 94.14}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '$QB%[gUOrDZ', amount: 0}).expect(400);
					});
			});
		});
		describe('/folder/artist/info', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/artist/info').query({id: 'eSpSeUHPtsXZY$O'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/artist/info').query({id: ''}).expect(400);
					});
			});
		});
		describe('/folder/album/info', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/album/info').query({id: 'IhO82@aX'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/album/info').query({id: ''}).expect(400);
					});
			});
		});
		describe('/folder/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/list').query({list: 'highest'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "list" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: ''}).expect(400);
					});
					it('should respond with 400 with "list" set to value invalid enum', async () => {
						return get('/api/v1/folder/list').query({list: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "parentID" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', parentID: ''}).expect(400);
					});
					it('should respond with 400 with "childOfID" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', childOfID: ''}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', artist: ''}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', title: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', album: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', genre: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', level: '1UF@KK0aG@N]Ox9J'}).expect(400);
					});
					it('should respond with 400 with "level" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', level: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', level: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', newerThan: 'EIrZf!7sSWW*z'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'random', newerThan: 46.84}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', fromYear: 'Zu@tT'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', fromYear: 77.72}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', toYear: 'hY]UaEtm5fq0E%sCU@'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'random', toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', toYear: 79.53}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', toYear: -1}).expect(400);
					});
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', type: ''}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/folder/list').query({list: 'random', type: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "types" set to value null', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', types: null}).expect(400);
					});
					it('should respond with 400 with "types" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', types: [null, '']}).expect(400);
					});
					it('should respond with 400 with "types" set to value invalid enum', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', types: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/folder/list').query({list: 'random', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', sortDescending: 'bkGJXBr0N75ey8zbFs'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'random', sortDescending: 4417458177835010}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', sortDescending: 408726162898943}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderTag: '3WpkJWG]gF'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', folderTag: 8209061124243458}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderTag: 1399299468427263}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderState: 'ca(Acxc'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderState: -7211095911563262}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderState: -4375317577728001}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderCounts: 'n2(zlYJ%u4zQnIvAiZhX'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', folderCounts: -3171122526814206}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', folderCounts: -6668635359674369}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderParents: '9LF&Y%zgLI(NA^'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderParents: 4244000923975682}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', folderParents: -3715475334758401}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderInfo: 'hIJ^&EhW3K@b['}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderInfo: 2970245648089090}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderInfo: 8639768854265855}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderSimilar: 'EyGVnB1ws'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', folderSimilar: -2621107555270654}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderSimilar: -5049139226214401}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', folderArtworks: 'ksHOkEcJw@[(*hGspI@f'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderArtworks: 4506160329654274}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', folderArtworks: -5378949811011585}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', offset: 'UwuxmH*cHd5R!'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', offset: 18.32}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', amount: 'G4SeI'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', amount: 85.37}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', amount: 0}).expect(400);
					});
			});
		});
		describe('/folder/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/search').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/search').query({offset: 'ySYhjWGTrOrSiZdFG'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/search').query({offset: 31.58}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/search').query({amount: '6ke]$O%mo'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/search').query({amount: 60.05}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/search').query({amount: 0}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/folder/search').query({rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "parentID" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({parentID: ''}).expect(400);
					});
					it('should respond with 400 with "childOfID" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({childOfID: ''}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({artist: ''}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({title: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({album: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({genre: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value string', async () => {
						return get('/api/v1/folder/search').query({level: '^Nn]sW'}).expect(400);
					});
					it('should respond with 400 with "level" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({level: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({level: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/folder/search').query({newerThan: 'S3@QHv^1qfyN@PSh'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/folder/search').query({newerThan: 18.07}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/search').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/folder/search').query({fromYear: 'nOrTsq'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/folder/search').query({fromYear: 63.02}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/search').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/folder/search').query({toYear: '[tu!mD0T[tO0wkv'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/folder/search').query({toYear: 71.53}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/search').query({toYear: -1}).expect(400);
					});
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({type: ''}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/folder/search').query({type: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "types" set to value null', async () => {
						return get('/api/v1/folder/search').query({types: null}).expect(400);
					});
					it('should respond with 400 with "types" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({types: [null, '']}).expect(400);
					});
					it('should respond with 400 with "types" set to value invalid enum', async () => {
						return get('/api/v1/folder/search').query({types: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/folder/search').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/folder/search').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/folder/search').query({sortDescending: 'tWGnRAZst@nPqMhzO'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({sortDescending: -3427962636468222}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({sortDescending: -8073806211973121}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderChildren: ''}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderChildren: 'z3FP#PtIP8'}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderChildren: -8986595893968894}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderChildren: 1078926042464255}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderSubfolders: ''}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderSubfolders: 'qQbjut4J#7w]p&J'}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderSubfolders: -612447614402558}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderSubfolders: 5581860323196927}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderTracks: ''}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderTracks: '3)eF&LQ[EpLzIB7w'}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderTracks: -6873860678877182}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderTracks: 5963208061878271}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/search').query({trackMedia: 'd[XkLOQ%oy^Okq'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({trackMedia: 826634294788098}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({trackMedia: -6081454278705153}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/search').query({trackTag: 'tAqn7'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({trackTag: 20358413418498}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({trackTag: -5054856914010113}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/search').query({trackRawTag: 'awADzwam*TA@#J)sO'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({trackRawTag: 3467817185705986}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({trackRawTag: -6519029204254721}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/search').query({trackState: ']ffdezGMBH12WV@'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({trackState: 6212394493673474}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({trackState: -2457351059668993}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderTag: 'JqGA6'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderTag: 3873759719063554}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderTag: 7122624840728575}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderState: '$[*dc'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderState: 5992533393932290}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderState: -341056105218049}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderCounts: 'TUdKpQ9@OK8'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderCounts: -5455994251378686}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderCounts: 5507719851147263}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderParents: 'L)4HsbITENL3A]iN'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderParents: 7159924068974594}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderParents: 2108252569468927}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderInfo: 'nae6qEx3CXZfP'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderInfo: -8612770975055870}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderInfo: 8986575631286271}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderSimilar: 'e#4KeG'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderSimilar: 5758214452805634}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderSimilar: 3211508439842815}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderArtworks: 'JG&l%X'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderArtworks: 2781473924972546}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderArtworks: 2456485355323391}).expect(400);
					});
			});
		});
		describe('/folder/health', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/health').query({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/folder/health').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/folder/health').query({rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "parentID" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({parentID: ''}).expect(400);
					});
					it('should respond with 400 with "childOfID" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({childOfID: ''}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({artist: ''}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({title: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({album: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({genre: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value string', async () => {
						return get('/api/v1/folder/health').query({level: 'itGrkp*l'}).expect(400);
					});
					it('should respond with 400 with "level" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({level: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value boolean', async () => {
						return get('/api/v1/folder/health').query({level: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/folder/health').query({newerThan: 'OKefNdRl#89'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/folder/health').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/folder/health').query({newerThan: 96.67}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/health').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/folder/health').query({fromYear: '0]XYeU3S)Xn10af6]r'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/folder/health').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/folder/health').query({fromYear: 47.43}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/health').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/folder/health').query({toYear: 'ViP55ZQlp!]t77NwKBA'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/folder/health').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/folder/health').query({toYear: 50.11}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/health').query({toYear: -1}).expect(400);
					});
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({type: ''}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/folder/health').query({type: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "types" set to value null', async () => {
						return get('/api/v1/folder/health').query({types: null}).expect(400);
					});
					it('should respond with 400 with "types" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({types: [null, '']}).expect(400);
					});
					it('should respond with 400 with "types" set to value invalid enum', async () => {
						return get('/api/v1/folder/health').query({types: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/folder/health').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/folder/health').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/folder/health').query({sortDescending: '3483m'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({sortDescending: -7072188104441854}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({sortDescending: 8014325113421823}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderTag: 'qdi##&3!2[30T]'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderTag: -8280136981938174}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderTag: 7074916692131839}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderState: 'wb%cy2mkgjSymzQ7E'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderState: -1774255737929726}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderState: -7281775323643905}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderCounts: 'Q5gaH@N3X#^F['}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderCounts: -6034559950913534}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderCounts: 5019612060057599}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderParents: 'l#hcHOdOdbS26t]Ko'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderParents: -4754238701830142}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderParents: -1410055693926401}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderInfo: '9mRJExD'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderInfo: -2281869802471422}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderInfo: -4919521102004225}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderSimilar: 'a1V3cUJQ9ksy'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderSimilar: -1359552742162430}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderSimilar: -2343541485338625}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderArtworks: '1v5sf!yfk'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderArtworks: -7602472780562430}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderArtworks: -6442111457034241}).expect(400);
					});
			});
		});
		describe('/folder/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/state').query({id: 'kQ1Tbxhw'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/state').query({id: ''}).expect(400);
					});
			});
		});
		describe('/folder/states', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/states').query({ids: ['x3h&h(1sF2Jf', 'o%5vPB87Al']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/folder/states').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/folder/states').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/folder/artist/similar/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/artist/similar/tracks').query({id: ']#a!A%*C8OF3Dh[B'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'SgyjwUp', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'e^]M55h%hG$bny5Fw&', trackMedia: 't$2OFVJuX)'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'X8a$T#!V!EmbA$', trackMedia: 7036947163774978}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'NASGk8*', trackMedia: 3517877764227071}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '1y[&Kr@', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '4!MXbebA$', trackTag: 'xAig*AA2S[0zkwtDmRjb'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: ')tTS2WU#su1y*Uv', trackTag: -5210631166754814}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '50uO&Fa', trackTag: -6468347797438465}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: ']rvckcb', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'i8sp%4', trackRawTag: 'xyOOZPmh4t(5b'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: ')liBtBfJwV3uIOT3', trackRawTag: 2172375047077890}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '[VEd2(f', trackRawTag: 6875370942889983}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'cZ69C', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'SF[XwNt%l(wEPz46hc', trackState: 'RGde]o6ZbPN'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: ')OP@HH]4)%', trackState: 457147808743426}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'gh$gg#Zd&2]dSKzf', trackState: 4872685825818623}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '0&UDG', offset: '!f8GJzVjAa'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '1A&lg^YkgXe%pZY^^0P', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'KnBvO7hJf80[Z*b', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '40xX#!)fSVojNQ7K', offset: 21.73}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: ')vq7WFifQ4hKa*m$o%#', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'sFA23!Je2A7[5Y', amount: 'II(p*IGoh%ZOt#'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'Wa6J5o!195F0U2)', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'KS*nGofHd3F[8A1$3', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'ToYw1&A^$GVOT7^w', amount: 41.15}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'hi91JEC5[$', amount: 0}).expect(400);
					});
			});
		});
		describe('/folder/artworks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/artworks').query({id: 'hHslrBl'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/artworks').query({id: ''}).expect(400);
					});
			});
		});
		describe('/track/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/id').query({id: 'F)4k5'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: 'NDvDEYCInlvAEm(Ekb', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/id').query({id: 'mjbGOfRmh', trackMedia: 'b[xTj'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/id').query({id: 'uLolmkZavJ6', trackMedia: 7145023279726594}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/id').query({id: 'hgy@VxZqaSrlPF2VR#Q', trackMedia: 3274890295640063}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: 'Z71&XIeO', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/id').query({id: 'DpzSvB*', trackTag: '))Mkx8T'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/id').query({id: '^CynF@t5]t#', trackTag: 7155972267048962}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/id').query({id: 'q7%([8', trackTag: 3310702391459839}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: '2J90Rvot@HO18^', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/id').query({id: 'P1%RMyn%wYCJQ', trackRawTag: 'eWmfjh1rlpC]'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/id').query({id: 'kQTRI0', trackRawTag: 3802695873855490}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/id').query({id: 'UKG4HgY', trackRawTag: 6988275080232959}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: 'PLkfHkFywijMIZlblxc', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/id').query({id: 'W16&fUkr5k#@', trackState: '(E3ibJ(TBQod#AUR'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/id').query({id: 'T)JV(j^#pYsKTiUw^yT', trackState: -8038948861378558}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/id').query({id: '0zch3CinGW', trackState: 5304051528892415}).expect(400);
					});
			});
		});
		describe('/track/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/ids').query({ids: ['pDxvbC$ykFURlag', '^*l(g3%W8']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/track/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/track/ids').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/ids').query({ids: ['ci0&sN', 'pAigA3vq52'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/ids').query({ids: ['YU2MB1*1pIkR@u%Fv', 'XMAmH%WGArT%'], trackMedia: 'jiUup'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/ids').query({ids: [')$MUTQQn3', '&#%pCcc'], trackMedia: 8325306691616770}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/ids').query({ids: ['U]q[7pYQShp5[9s', '68r]TNnoDaE^d][6AOzH'], trackMedia: -4587825345331201}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/ids').query({ids: ['chugL&3h$TuCB2', 'ad6C^3ge3tepc%zJOR'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/ids').query({ids: ['@mE%QQc2TSov', 'zW&cp'], trackTag: '][S9@sWRd[L'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/ids').query({ids: ['JurZDoA', '95JNYe4'], trackTag: 4037952896237570}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/ids').query({ids: ['@[[fMsWAsh9[w[6G', '#M)qI!sy1nygZG'], trackTag: -3382684168486913}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/ids').query({ids: ['UhH(hfPsmN^X*', 'A30!l2)'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/ids').query({ids: ['zI4WO@aBqonI&0)', 'Pk5oM7)BrbS$TxAG3rj'], trackRawTag: '1jId$htcjZX$4]L40xL#'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/ids').query({ids: ['km^*AiFo3W9[VOr3', 'EsD1val2qv'], trackRawTag: -8119747887497214}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/ids').query({ids: ['(OkFzYhM@L', 'uFPUnCeuKgK7DW$wM5LI'], trackRawTag: -8445420409716737}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/ids').query({ids: ['F5q%n1je83CW2SZ', 'v#b0FA!pID*'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/ids').query({ids: ['ssG]efyu#a', 'iLPEd5c9l95iwt@'], trackState: 'NS5I@uY3LaZqn4lCrV%E'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/ids').query({ids: ['Uk)Yk]TWA&WoLKUC6[t7', 'y*f(Kcmk5U'], trackState: 2794714474479618}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/ids').query({ids: ['TQkK2z&FMj9wCF', 'd#$6]]J%Xleaf'], trackState: -3878461982638081}).expect(400);
					});
			});
		});
		describe('/track/rawTag', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/rawTag').query({id: '!YGfk^cQjq87t'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/rawTag').query({id: ''}).expect(400);
					});
			});
		});
		describe('/track/rawTags', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/rawTags').query({ids: ['cZ4&glFlgKG1Sc%ua', 'kKSAvV']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/track/rawTags').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/track/rawTags').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/track/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/search').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/track/search').query({offset: 'n@v*mZRI*'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/track/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/track/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/track/search').query({offset: 45.35}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/track/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/track/search').query({amount: '7baX*E^%[Pe%%zdd]CYD'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/track/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/track/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/track/search').query({amount: 3.87}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/track/search').query({amount: 0}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/track/search').query({artist: ''}).expect(400);
					});
					it('should respond with 400 with "artistID" set to value empty string', async () => {
						return get('/api/v1/track/search').query({artistID: ''}).expect(400);
					});
					it('should respond with 400 with "albumArtistID" set to value empty string', async () => {
						return get('/api/v1/track/search').query({albumArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "parentID" set to value empty string', async () => {
						return get('/api/v1/track/search').query({parentID: ''}).expect(400);
					});
					it('should respond with 400 with "parentIDs" set to value null', async () => {
						return get('/api/v1/track/search').query({parentIDs: null}).expect(400);
					});
					it('should respond with 400 with "parentIDs" set to value empty string', async () => {
						return get('/api/v1/track/search').query({parentIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "childOfID" set to value empty string', async () => {
						return get('/api/v1/track/search').query({childOfID: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/track/search').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/track/search').query({rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/track/search').query({rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/track/search').query({title: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/track/search').query({album: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/track/search').query({genre: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/track/search').query({newerThan: 'Bzsr^2!%htO'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/track/search').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/track/search').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/track/search').query({newerThan: 3.5}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/track/search').query({fromYear: '6*&EZl0Ni'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/track/search').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/track/search').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/track/search').query({fromYear: 7.85}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/track/search').query({toYear: 'b#0ujSkCsL]p99B'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/track/search').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/track/search').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/track/search').query({toYear: 43.88}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/track/search').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/track/search').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/search').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/track/search').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/track/search').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/track/search').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/track/search').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/track/search').query({sortDescending: 'iiKe6G3u8F2T6oz'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({sortDescending: -889626105479166}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({sortDescending: 5123646494343167}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/search').query({trackMedia: 'ieQccIYIR'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({trackMedia: 2943866281918466}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({trackMedia: -7823354434158593}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/search').query({trackTag: 'rXc0P@5rLZ$VK1uH^'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({trackTag: 2400216263163906}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({trackTag: 5945352553234431}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/search').query({trackRawTag: '^20xM^xFFTUmu'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({trackRawTag: -7277202202689534}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({trackRawTag: -2805222959218689}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/search').query({trackState: 'Dnkcr(FG#UB[hB58ruZ'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({trackState: -819681233469438}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({trackState: -3380630968598529}).expect(400);
					});
			});
		});
		describe('/track/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/state').query({id: 'QfMOnF5XTIlA7!$na7W'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/state').query({id: ''}).expect(400);
					});
			});
		});
		describe('/track/states', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/states').query({ids: ['lW2T5@', 'fLY!0T29z']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/track/states').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/track/states').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/track/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/list').query({list: 'random'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "list" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: ''}).expect(400);
					});
					it('should respond with 400 with "list" set to value invalid enum', async () => {
						return get('/api/v1/track/list').query({list: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', artist: ''}).expect(400);
					});
					it('should respond with 400 with "artistID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', artistID: ''}).expect(400);
					});
					it('should respond with 400 with "albumArtistID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', albumArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "parentID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', parentID: ''}).expect(400);
					});
					it('should respond with 400 with "parentIDs" set to value null', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', parentIDs: null}).expect(400);
					});
					it('should respond with 400 with "parentIDs" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', parentIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "childOfID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', childOfID: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'random', rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', title: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', album: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'recent', genre: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', newerThan: 'CDLZDA3092vRe6'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'faved', newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'faved', newerThan: 19.8}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', fromYear: 'S2A2@8F'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'faved', fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'recent', fromYear: 62.35}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', toYear: 'xsSN7DU8ielnnKA7'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'recent', toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'faved', toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'faved', toYear: 4.1}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/track/list').query({list: 'faved', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'random', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', sortDescending: 'Tv!SU6AQFGfyjRW'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'recent', sortDescending: -816662936813566}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', sortDescending: -3203397926780929}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', trackMedia: 't]^1xOC1'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'recent', trackMedia: 2343744946831362}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', trackMedia: -4491455703810049}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', trackTag: 'ZvhMfgwWyx'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'highest', trackTag: -2527694071791614}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'highest', trackTag: 5839128222498815}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', trackRawTag: '39C%j%]l1bQvoYkfR'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'random', trackRawTag: 2751368829861890}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'recent', trackRawTag: -1040073382428673}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', trackState: 'Bosnw6*'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', trackState: 5574555028422658}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'recent', trackState: 8138185066414079}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', offset: '&nc!4RGm8m%R5@'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'random', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'faved', offset: 80.85}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/track/list').query({list: 'random', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'random', amount: 'I0WRkBkd%&'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'random', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'faved', amount: 43.28}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/track/list').query({list: 'random', amount: 0}).expect(400);
					});
			});
		});
		describe('/track/similar', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/similar').query({id: 'P&u0*AmPE9'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: 'HAV7bAv#J(uB0k^z%', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: '2]En@Aa&!#eltuql]', trackMedia: 't[U(1wb5[C&EaDK'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/similar').query({id: '#@4ahDv', trackMedia: 238555662123010}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/similar').query({id: 'vRz2eG^', trackMedia: -7807383694737409}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: ']wBT3$fWZIfPP8UO', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: 'YbI*GsqaMcq', trackTag: 'nVWe[^]@udou4z3c(#'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/similar').query({id: '!P%6ha6l7#Y1', trackTag: -3535624548122622}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/similar').query({id: 'W8)h1UcO', trackTag: 4230816284540927}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: 'k(w0l$XPX!9WoM', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: 'Z[vM5@5VNw7j0V239', trackRawTag: 'qVoW1JV][9x%8RUXfO@'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/similar').query({id: '9vCZjI@^7(QrUNh$4iP', trackRawTag: 6926839184359426}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/similar').query({id: 'YB*a!xoVvj0qS)uB1ALx', trackRawTag: 8996767714508799}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: 'Z]Vs]N1G0*y]L', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: 'KXg2qWTQ)@4', trackState: 'YigRcNMocN!O$YgGiTu'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/similar').query({id: 'cXR9kHge0QlTP2ZP%[Y', trackState: 5895515405287426}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/similar').query({id: '$9KqVoRfeYJ', trackState: -276198722633729}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: 'mo5P[mfW&]', offset: 'Htxzj5UGNbW@$Fxri'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: 'w6O4@vjZJ[M', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/track/similar').query({id: 'MJbLuXs5G6*x6lkJ3', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/track/similar').query({id: 'h9RuUeBmo5oaLdq', offset: 98.68}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/track/similar').query({id: 'nHH$^%1F!&D', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: 'cm*ib4maq', amount: 'ScLf1'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: '#PZN0[!FKS*OI*vC@(', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/track/similar').query({id: '%rjm%qmUmmC', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/track/similar').query({id: '#tg1Vf4N9', amount: 61.72}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/track/similar').query({id: 'Tj7o5MLW#[P%', amount: 0}).expect(400);
					});
			});
		});
		describe('/track/health', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/health').query({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/track/health').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "media" set to value empty string', async () => {
						return get('/api/v1/track/health').query({media: ''}).expect(400);
					});
					it('should respond with 400 with "media" set to value string', async () => {
						return get('/api/v1/track/health').query({media: '2*A$oy#l1R%4GtQ'}).expect(400);
					});
					it('should respond with 400 with "media" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({media: 7319042406744066}).expect(400);
					});
					it('should respond with 400 with "media" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({media: 7337979915796479}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/track/health').query({artist: ''}).expect(400);
					});
					it('should respond with 400 with "artistID" set to value empty string', async () => {
						return get('/api/v1/track/health').query({artistID: ''}).expect(400);
					});
					it('should respond with 400 with "albumArtistID" set to value empty string', async () => {
						return get('/api/v1/track/health').query({albumArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "parentID" set to value empty string', async () => {
						return get('/api/v1/track/health').query({parentID: ''}).expect(400);
					});
					it('should respond with 400 with "parentIDs" set to value null', async () => {
						return get('/api/v1/track/health').query({parentIDs: null}).expect(400);
					});
					it('should respond with 400 with "parentIDs" set to value empty string', async () => {
						return get('/api/v1/track/health').query({parentIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "childOfID" set to value empty string', async () => {
						return get('/api/v1/track/health').query({childOfID: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/track/health').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/track/health').query({rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/track/health').query({rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/track/health').query({title: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/track/health').query({album: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/track/health').query({genre: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/track/health').query({newerThan: 'DSfKeEHpRwE*'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/track/health').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/track/health').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/track/health').query({newerThan: 22.98}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/track/health').query({fromYear: 'U#KlAFJ(cz*A6]TfP'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/track/health').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/track/health').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/track/health').query({fromYear: 47.45}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/track/health').query({toYear: 'XL#4CHWDC0P2(*r'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/track/health').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/track/health').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/track/health').query({toYear: 90.41}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/track/health').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/track/health').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/health').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/track/health').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/track/health').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/track/health').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/track/health').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/track/health').query({sortDescending: 'lz1Ji5secxqDIy'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({sortDescending: 7385333352103938}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({sortDescending: 2439845016240127}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/health').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/health').query({trackMedia: '^p$xh1D8'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({trackMedia: -4543601455398910}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({trackMedia: -7296203892981761}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/health').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/health').query({trackTag: 'ZOiBlf10o'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({trackTag: 1430385745461250}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({trackTag: -1284969460662273}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/health').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/health').query({trackRawTag: '#(ddbCX'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({trackRawTag: -5342608586964990}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({trackRawTag: 7802427612856319}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/health').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/health').query({trackState: '5mjQK'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({trackState: -4788799036981246}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({trackState: -6333573640486913}).expect(400);
					});
			});
		});
		describe('/track/lyrics', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/lyrics').query({id: 'S1q1$^Ph[2'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/lyrics').query({id: ''}).expect(400);
					});
			});
		});
		describe('/episode/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/id').query({id: '@W16CKBna^$]o'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: 'C(yB58%8mp', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/episode/id').query({id: 'X(v5ryXu', trackMedia: 'c[K&[t'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/episode/id').query({id: 'FMGx!@7yYkHi', trackMedia: -4308588709281790}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/episode/id').query({id: 'b84pGOGK', trackMedia: 1899162727612415}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: 'qpjX#D6ZL', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/episode/id').query({id: ']N^sRUV[j', trackTag: 'mI!J2jGlScS8K'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/id').query({id: 'wQ9]udp@pp', trackTag: 5011611676835842}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/id').query({id: 'x4u]#^2[', trackTag: 7472049748443135}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: '9*eFEt]eKr%9k96', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/episode/id').query({id: 'dP9IA%saeI2c24l3O', trackRawTag: 'xpTQi'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/id').query({id: 'HuNE$a9![*c8]TNu1Z', trackRawTag: -1774600778153982}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/id').query({id: 'kt$tUsZJ[nKf', trackRawTag: -3323088036954113}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: '8gcV%BdUTg7TA0B!Q', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/episode/id').query({id: 'WO7o5', trackState: 'MyepQObTP&0w82]EYL'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/episode/id').query({id: 'A@s2Ol0frQQfF8', trackState: -4336225624260606}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/episode/id').query({id: 'QxiUx', trackState: -1338113838284801}).expect(400);
					});
			});
		});
		describe('/episode/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/ids').query({ids: ['mrbKbrL@g6@vT*OO', 'Fi5&Jc*T21)P%ApXM*']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/episode/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/episode/ids').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['B9b(#A!*DM2[xbiSF[g', 'wnt]!]8!#wgmGmEg4)q6'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['Y(N3@m!%]6s7%o1C', 'qx$kpf4%G(!mtY'], trackMedia: ')tIdkJ0v'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/episode/ids').query({ids: ['k]oXM[k', 'x&6&DBr3OAdOW]'], trackMedia: -1538973004464126}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/episode/ids').query({ids: ['IGhO!6kr3eo*KqPP)C', 'zdHoV^y#qv53I'], trackMedia: -6674086063243265}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['FoeWMppq!1YYTG8nR', 'vF@4ogOCg2G3)6d'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['dfWU$Tgjd&', '@r4Wrw!o3%@f'], trackTag: 'e45]jfV]uY'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/ids').query({ids: ['DqYL3TYpp!b2@haBw%', 'mDWE![Uv7'], trackTag: 3142102754000898}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/ids').query({ids: ['pjMY!N', '6u6V[58Zn!LF$i'], trackTag: -978520499027969}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['E2CW8s21$m3VTz%DdJ', 'gZx&9Hl)L[fEhBmgL'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['1Abblm3H', 'aR5Q&[iQtsqRFFp'], trackRawTag: 'DJqL953fM7I'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/ids').query({ids: ['fR5C5zSsV5l!&(kMx', '@Orw*t^L'], trackRawTag: 113562487881730}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/ids').query({ids: ['Ug6m%iR$$Es52NK[6CLN', '30NH$VIH38HwTnXwIm'], trackRawTag: 267491003596799}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['TpT459', 'W@pFNG'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['7Jm*3m', 'V)gwROVzC'], trackState: '(pPr94su%]euNWO*t6'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/episode/ids').query({ids: ['IP1RKyrgpkL', 's6rW5RiD#IFX'], trackState: -5534096344219646}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/episode/ids').query({ids: ['j8XfzF@fFEP4WjrvZ0E', 'Rwh(dI&RP$xN'], trackState: -8922749984571393}).expect(400);
					});
			});
		});
		describe('/episode/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/search').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/episode/search').query({offset: 'wfIR$qfB&OG0'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/episode/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/episode/search').query({offset: 10.78}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/episode/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/episode/search').query({amount: 'F2OxDA(tKaOz*R1'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/episode/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/episode/search').query({amount: 66.69}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/episode/search').query({amount: 0}).expect(400);
					});
					it('should respond with 400 with "podcastID" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({podcastID: ''}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({name: ''}).expect(400);
					});
					it('should respond with 400 with "status" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({status: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/episode/search').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/episode/search').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/episode/search').query({sortDescending: '[BvURy1ZBWzsCxI'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({sortDescending: 2762629340725250}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({sortDescending: 7157054133239807}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/episode/search').query({trackMedia: ']BFAvF5@TxwOD0yBMrQl'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({trackMedia: -7462791975796734}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({trackMedia: -6023055314780161}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/episode/search').query({trackTag: 'Oufuz7'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({trackTag: 6324480888537090}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({trackTag: -7547678586044417}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/episode/search').query({trackRawTag: 'ZU$azI)7a*(w^KVk5J'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({trackRawTag: 8555265590820866}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({trackRawTag: -6545129825370113}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/episode/search').query({trackState: 'xT!7Y'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({trackState: -7922208735231998}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({trackState: -5137319547895809}).expect(400);
					});
			});
		});
		describe('/episode/retrieve', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/retrieve').query({id: 'YD%gF'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/episode/retrieve').query({id: 'YD%gF'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/retrieve').query({id: ''}).expect(400);
					});
			});
		});
		describe('/episode/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/state').query({id: 'HPPxFbT'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/state').query({id: ''}).expect(400);
					});
			});
		});
		describe('/episode/states', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/states').query({ids: ['2cbUIxvXxbi)', 'DA9[DA9Wkvh']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/episode/states').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/episode/states').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/episode/status', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/status').query({id: 'WWK4z&nPji'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/status').query({id: ''}).expect(400);
					});
			});
		});
		describe('/episode/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/list').query({list: 'frequent'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "list" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: ''}).expect(400);
					});
					it('should respond with 400 with "list" set to value invalid enum', async () => {
						return get('/api/v1/episode/list').query({list: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "podcastID" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', podcastID: ''}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'random', name: ''}).expect(400);
					});
					it('should respond with 400 with "status" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', status: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', sortDescending: 'Vmlx!GeV$c@rmXe%'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', sortDescending: 348144785162242}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'random', sortDescending: -4660386326380545}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'frequent', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'frequent', trackMedia: 'S)Js(XX&4G'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', trackMedia: 488902683000834}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', trackMedia: 6389631373279231}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'frequent', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', trackTag: 'ueN*EBfOa8bdsBkB'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', trackTag: 5093164989808642}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', trackTag: 6246109139697663}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', trackRawTag: 'V0cIulb9@c'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', trackRawTag: -5505795638689790}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', trackRawTag: -8681955080011777}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', trackState: '*d@&(P'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', trackState: -8155477686878206}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'frequent', trackState: -187026666160129}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', offset: 'w[LVv)3vtU3Kd^&M3nsF'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', offset: 31.69}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', amount: '^oGI5GK'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'frequent', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/episode/list').query({list: 'random', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', amount: 22.46}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', amount: 0}).expect(400);
					});
			});
		});
		describe('/podcast/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/id').query({id: '4ykK)$7YSnu'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: '6za!wvnYe(B$', podcastState: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: 'CW]@neQCf', podcastState: 'PoQKZgI)3Bvz9Asnj'}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'uBXqMw6uA3J*lu&8', podcastState: 5991823650586626}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: 'Mxrfv97#BryZ0F', podcastState: -7189827917185025}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: '!i&OYER]s&7)#)', podcastEpisodes: ''}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: 'wdk^v]zU@)Ke', podcastEpisodes: 'JG4KH2dc)!m&Tri*b!@)'}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'z)cK*A(K', podcastEpisodes: 507144537374722}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: '7YDwx7sctj%', podcastEpisodes: -8353068382945281}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: 'rnKQQ%oW]jKY!gwPF^', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: '!kPDkAiUV(q2JG5', trackMedia: 'MmwctMIX[N@Gj'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'y]bhT))DZnxRwCId', trackMedia: -5184433153900542}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: 'L5dJse&Agxytp#MMD', trackMedia: 7849875249037311}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: 'Jus@lp]wN)J8%ThNhX#4', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: 'ZwlUQ', trackTag: 'GI7kONSnU(tMxxC2@'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'nSW]N2O', trackTag: -4733534505795582}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: ']19!SlYWo!kJzL^NjN5m', trackTag: -6518862363230209}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: 'KRHBfvR&svnsducO', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: '[e5N21', trackRawTag: 'Iegmj'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'izShYioH2^)j3Ue1oUEm', trackRawTag: -2555405242728446}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: '3q#YOoKdA', trackRawTag: -6166789562040321}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: '5$g[Rk0P', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: '#B3sUHb^', trackState: 'VuCcnRnGV3Y'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'dz7y2e', trackState: -6236372050378750}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: 'Ul*cheqgiz$Hy#ooXK', trackState: 6750148008869887}).expect(400);
					});
			});
		});
		describe('/podcast/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/ids').query({ids: ['C!WvpD5DLKA53JWHR3F', '@x$y^bI']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/podcast/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['#G4z0yk#)GZxOpfAfDhE', '61RWic9CIdI&'], podcastState: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['[Ihwc5ai[9Uq4J', 'sRdB8F'], podcastState: 'ZV9cl(^'}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['Z4HtD', 'M2RnEVvidk6w(D'], podcastState: 939388074721282}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['YBZ^z%wfRbGEg9b', 'X&L1q#cowCm3J6514JG'], podcastState: 1886764637618175}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['F1uHdJW', '$hzSSjjo]'], podcastEpisodes: ''}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['2t)4dsgIvD#8', 'JUWkvwJ)&@Q$@'], podcastEpisodes: 'Y8P9S@eP#n9U!V%W9'}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['9UJj4m4re$', 'Z0vCzR9UX^c$zfELP'], podcastEpisodes: -2564676982407166}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['C(3b@aF(5VLdlmkhPb[', 'Ol0SGPz6]cURNz'], podcastEpisodes: 9003070281220095}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['FIZya', 'W2h9grAg!k'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['RYZ^x9#T1QzF9(](Y', '%ev]vH%OX#mc'], trackMedia: 'xrKuAQ)lli'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['AEhuk', 'MPowdRurQs!bN'], trackMedia: -1885085875830782}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['5kSF9avOkcbKVhG4', '8]gHSZ3'], trackMedia: -8941328050159617}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['uy])#)w', 'l[KcN)!L(Wbo#b'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['Z@i^]]Q)mAPgc', 'q!C&&yt'], trackTag: 'A0XgGRs'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['H9X3zC', '[2kZ2[z'], trackTag: 6443107067363330}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['Zx#)pV)qC0Xpk7fKVRU', 'Q$AJ(tmQv6rbN'], trackTag: -2361429189459969}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['1^2^CrTtLoeVjGfN', 'oogIlO$'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['%WQ3#hsomj4Li', 'wNr0BCe'], trackRawTag: 'CXc1os'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['8q2(sbGC3*I2JUVU', 'KM#oTz'], trackRawTag: 8817924441636866}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['tFtF#C$i$6gBf1s', 'vM&]QkO8nfHURFc^c@sd'], trackRawTag: -5261176048975873}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['yEgTxtlvoN5fpH', 'L7EN(O'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['QDOg*RF@nvL[(W', 'gPY^DZ@SIAgk[$^wv'], trackState: 'Z8dtpPJkTXE)'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['K&oD#p73^R7HA4BaU]', '*$sEeZmL(m'], trackState: 4266500244373506}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['wezzRVXMIsFI', 'xAc3e^#[a0AL4iym(v'], trackState: 5206013472931839}).expect(400);
					});
			});
		});
		describe('/podcast/status', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/status').query({id: '4KPPwQ6k9nChmm'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/status').query({id: ''}).expect(400);
					});
			});
		});
		describe('/podcast/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/search').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/podcast/search').query({offset: '!xiDUrX'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/podcast/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/podcast/search').query({offset: 75.81}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/podcast/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/podcast/search').query({amount: '$YBorDUP$D7'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/podcast/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/podcast/search').query({amount: 34.3}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/podcast/search').query({amount: 0}).expect(400);
					});
					it('should respond with 400 with "url" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({url: ''}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({title: ''}).expect(400);
					});
					it('should respond with 400 with "status" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({status: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/podcast/search').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/podcast/search').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/podcast/search').query({sortDescending: 'o6A4a&bx8q6'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({sortDescending: 4945178406158338}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({sortDescending: -628943119974401}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({podcastState: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value string', async () => {
						return get('/api/v1/podcast/search').query({podcastState: 'ZuKFg)Sx^[s'}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({podcastState: -5484208038346750}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({podcastState: 2849116950364159}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({podcastEpisodes: ''}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value string', async () => {
						return get('/api/v1/podcast/search').query({podcastEpisodes: 'QaA1Y^Bm6O8z&'}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({podcastEpisodes: 2001777570349058}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({podcastEpisodes: -2754785094664193}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/search').query({trackMedia: '@la7LsKGeiB'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({trackMedia: -4604158522949630}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({trackMedia: 1635483318747135}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/search').query({trackTag: 'L2x*pNn5'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({trackTag: -1073857259634686}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({trackTag: -8188577900920833}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/search').query({trackRawTag: 'po6hM&J(udC(fk(5'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({trackRawTag: 954840679186434}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({trackRawTag: 1398136698306559}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/search').query({trackState: 'e(#4%('}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({trackState: 7575628446433282}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({trackState: -3735458752233473}).expect(400);
					});
			});
		});
		describe('/podcast/episodes', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/episodes').query({id: ')cyU4Tyc5txshlz$t#'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'pCrC$sT', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: '(#Xhxso78W8)', trackMedia: 'zSylZ&i!%LdMimYW5cm'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'RFge[#fuZTg', trackMedia: 7310303922487298}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'bvPCcmRx]6', trackMedia: -2488833551630337}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'ABa5ptBPJzlH', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'HB#vG#UOg[VO5YUsR$x!', trackTag: 'h&[DAFWu'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'P*O#XG[pd2My', trackTag: 4229252958388226}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'Q7h6V@sb)R(DK5', trackTag: -3732842165043201}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'Q]tBMZ2', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'c#*OKpa^W3%1zsXFym', trackRawTag: 'N*y&NfHDp!bzs8)P#'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'x1euzx^meQyGDnbC', trackRawTag: -4874464231686142}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: '0O3fTg!FpSp', trackRawTag: -3982310324043777}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'nx$l70gyCV', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'o4HwTSte76$v%JlDx', trackState: 'pZ4^U0nwS'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'xAHg%SFAa8XKZerV@H]', trackState: 5788967744045058}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: '%zB)PBeP0GGET', trackState: -2315323126579201}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: '$K^Rn*EtS^d!', offset: 'ZELpEHI'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'cL@Dmn$Dy4pm%A)7eg', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/podcast/episodes').query({id: '#9rXM', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'L2^CvQjt#J%jFJ[XK', offset: 83.33}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: '4kGvWUrQaVBg', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'V$w(#hE%4X', amount: '&%etr'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'j&Ou%s(pExmw', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'agt3[kI!', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'C#AX0', amount: 63.04}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'D@Skw', amount: 0}).expect(400);
					});
			});
		});
		describe('/podcast/refreshAll', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/refreshAll').query({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/podcast/refreshAll').query({}).expect(401);
					});
			});
		});
		describe('/podcast/refresh', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/refresh').query({id: '8dG0v'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/podcast/refresh').query({id: '8dG0v'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/refresh').query({id: ''}).expect(400);
					});
			});
		});
		describe('/podcast/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/state').query({id: 'ABJc&L2@0c2q@['}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/state').query({id: ''}).expect(400);
					});
			});
		});
		describe('/podcast/states', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/states').query({ids: ['Z((mCne8^97en*', '4gp2t43QTC7h&E']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/podcast/states').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/podcast/states').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/podcast/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/list').query({list: 'highest'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "list" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: ''}).expect(400);
					});
					it('should respond with 400 with "list" set to value invalid enum', async () => {
						return get('/api/v1/podcast/list').query({list: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "url" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', url: ''}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', title: ''}).expect(400);
					});
					it('should respond with 400 with "status" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', status: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', sortDescending: 'YXNG[H'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', sortDescending: -4704485104418814}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', sortDescending: 2740763729330175}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', podcastState: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', podcastState: 'a^$&mox'}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', podcastState: 3917368623366146}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', podcastState: 767016029913087}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', podcastEpisodes: ''}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', podcastEpisodes: 'E#zZ(qXQ'}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', podcastEpisodes: -3693466261389310}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', podcastEpisodes: -4593230008025089}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', trackMedia: 'p8gQtzhi'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', trackMedia: -7268382915166206}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', trackMedia: -567877543395329}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', trackTag: '9lruOMri'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', trackTag: -5239510229057534}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', trackTag: -4299385294815233}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', trackRawTag: 'msDvm%yX@g'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', trackRawTag: -734038214049790}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', trackRawTag: -6698708376748033}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', trackState: 'hdI#b3%K'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', trackState: -3664819110543358}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', trackState: -8493726120804353}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', offset: 'q0hKqXi)3$3'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', offset: 75.32}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', amount: 'qgAOFB!VN6e'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', amount: 71.3}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', amount: 0}).expect(400);
					});
			});
		});
		describe('/radio/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/radio/id').query({id: 'l[#U8gWXHVduO%O8YA', radioState: true}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/radio/id').query({id: '', radioState: false}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value empty string', async () => {
						return get('/api/v1/radio/id').query({id: 'ANRFc0BB!', radioState: ''}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value string', async () => {
						return get('/api/v1/radio/id').query({id: 'VOqc3g5dtbccU(Ak8[', radioState: 'q@6@F3a5X8bEa#W'}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer > 1', async () => {
						return get('/api/v1/radio/id').query({id: 'c3^2wsJXtqj[X1)', radioState: -5874144289751038}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer < 0', async () => {
						return get('/api/v1/radio/id').query({id: '7@[CaXq!', radioState: -2007483585396737}).expect(400);
					});
			});
		});
		describe('/radio/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/radio/ids').query({ids: ['pc@PRv!', 'W2mgs%a*'], radioState: true}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/radio/ids').query({ids: null, radioState: false}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/radio/ids').query({ids: [null, ''], radioState: true}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value empty string', async () => {
						return get('/api/v1/radio/ids').query({ids: ['j7y5Uncg9EktLKQFidZn', 'tgLLt'], radioState: ''}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value string', async () => {
						return get('/api/v1/radio/ids').query({ids: ['Knejz@zoS$', 'ZJ$9wp1a0)$WP16R0^'], radioState: 'J*]$NKH#]5t68Zgyw'}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer > 1', async () => {
						return get('/api/v1/radio/ids').query({ids: ['#pm[T1*4Lwue1a^', '@SvJGJSFS9s9T]cvw'], radioState: -5212630557917182}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer < 0', async () => {
						return get('/api/v1/radio/ids').query({ids: ['RDck9gwvjAGGKZ@COu', '@E!Swgu8w'], radioState: -5874938045005825}).expect(400);
					});
			});
		});
		describe('/radio/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/radio/search').query({radioState: true}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "radioState" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: ''}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value string', async () => {
						return get('/api/v1/radio/search').query({radioState: '@xAT6w'}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer > 1', async () => {
						return get('/api/v1/radio/search').query({radioState: -5685749319991294}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer < 0', async () => {
						return get('/api/v1/radio/search').query({radioState: -3686804385431553}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, offset: 'g!x($6RTXI3H]'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/radio/search').query({radioState: false, offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/radio/search').query({radioState: true, offset: 51.77}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/radio/search').query({radioState: false, offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, amount: 'LDHBnTw#@t]JB%s'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/radio/search').query({radioState: true, amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/radio/search').query({radioState: false, amount: 39.59}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/radio/search').query({radioState: false, amount: 0}).expect(400);
					});
					it('should respond with 400 with "url" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, url: ''}).expect(400);
					});
					it('should respond with 400 with "homepage" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, homepage: ''}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, name: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/radio/search').query({radioState: true, sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/radio/search').query({radioState: false, ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, sortDescending: 'ef8UbG6(o4'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/radio/search').query({radioState: false, sortDescending: -9248574537726}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/radio/search').query({radioState: true, sortDescending: 7119121435066367}).expect(400);
					});
			});
		});
		describe('/radio/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/radio/state').query({id: 'XWyzFYKY$u%QDV2)tQ'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/radio/state').query({id: ''}).expect(400);
					});
			});
		});
		describe('/radio/states', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/radio/states').query({ids: ['sBB1%G0F', '*c1eHqOVwt!#s%U[eqzA']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/radio/states').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/radio/states').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/artist/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/id').query({id: '8gwloeGHuEDiD05J(U0k'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'Jas&#13TQQ', rootID: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'mKW43xuwCdLCK7C@', artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'c$J2xPWY', artistAlbums: 'gD!qjfcSsnVpbau'}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '!LMBhSAEWPzs1^', artistAlbums: 5631080279310338}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'tPGWNzg%D8W9N)YLr%*z', artistAlbums: 7258846271635455}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'ByrCRP4xQIdb', artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'OC7GK5O', artistAlbumIDs: '895Abog2*'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'Z7s$KRRu*4GxoR', artistAlbumIDs: 4195292765224962}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'J1LAoMGjC4atT$U0qlx@', artistAlbumIDs: -437665287634945}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: '^BQOunDQbrz(YXKpVa', artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'lyay(R&GyIrqoa', artistState: 'T!*p]N'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'F5M^(rxJ(3', artistState: 5203236206149634}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: '13MKnq[VE!sJ@77wwy', artistState: 6190985864282111}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: '61$2bWzSoj', artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'kX%H][r2%2RYWLZL%', artistTracks: 'RhItA'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'mSo%m8Cao', artistTracks: -5723801664880638}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'w37d7&3^tXvrYsQf', artistTracks: 8454505603530751}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: '1)A0NlcsFDLxqE', artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: '[z2D[0$TllTMV5vvwF', artistTrackIDs: 'wBI2GWI[U)Bo$'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 't]g)Z@Z@4qVKcVf8E', artistTrackIDs: 3106726152765442}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 't[9Zp3f3D', artistTrackIDs: 6522948458381311}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'r&p*8DL4t(6a@rp6&]gW', artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'QuDgU8jcuM^Mkq#%OQj6', artistInfo: 'qMr!)g5j75U[YKr'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '[Rqgt)VHvYR', artistInfo: -374204390178814}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'l^[3)R)9D', artistInfo: -492314090799105}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'Y(KDzqNHc8g12*', artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: '1fsyJ!KHn&L5D', artistSimilar: '2rH^ByTB6!'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'ofM1Y)3p4hUw', artistSimilar: 6310666277224450}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'QU^E&k!NbI)@G', artistSimilar: 2626107270496255}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'l$niFWegL@%bm9l2uk]', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'rDj6afK5jYW7kW@O8', albumTracks: 'GotxL#lw7q'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'q60@rID[Lnv(RHD1n6Bt', albumTracks: 7888255273926658}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'bc8dTDOeRY@m%WqfS', albumTracks: 7962337424179199}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'RKloPEx', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'qF[srJp', albumTrackIDs: '#Q[m5YO8UQ()'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'capnIreBZIaLFqr[v', albumTrackIDs: 3629085351739394}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: '03jS75rWV2jFY8', albumTrackIDs: 8762212579540991}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'T7bA@BH9LAfr3%J*D', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'Af22m7i&DtdVOGVck2VH', albumState: '9JZc*&1pwy8N'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '[[h6$W&0b', albumState: 6358775178985474}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: '1s8iEM&CLkWY', albumState: 7306720183320575}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'N9C91)(DHnlVA', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: '063HDEGr8M@[JtQEcA]', albumInfo: '0R8%Tb'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'p8)9SXCL', albumInfo: 4115261116383234}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'J$!Gv#d#[C!e#Sc', albumInfo: -970600491253761}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'aX^#^1NFe1QH$IydU', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'J]rQ4bDOM', trackMedia: '&BNlOdLw6cPj4'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'fnOF#Mt', trackMedia: 839403136090114}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: '2iV9yO@551g$av2hT', trackMedia: 1861932948652031}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: '2&@]k9', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'pJN6bR', trackTag: 'FFc1Np7X]bC7Q@ERAN'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'RsY*0(%jgDRtngk', trackTag: 4522913692647426}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: '!^Ol%KX*6S1!aMMRRQ', trackTag: -4808288629686273}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: '7LgYP*!', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'r3Wgp)kdpX@nGz]', trackRawTag: '[J*yRJmsV'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '&vAI7!OnpO4', trackRawTag: -467815102414846}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'I7dYb@BXD', trackRawTag: 1677784086740991}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'MiuRErQf@5Zy5j)Yo', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: '9Ec2kV[', trackState: '0H5ucOWGmeSL^Lyn'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '(p1uPzWfVcw9t', trackState: -5847700780089342}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'gzKI^', trackState: 2478058623729663}).expect(400);
					});
			});
		});
		describe('/artist/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/ids').query({ids: ['zp^6FQvCJ', 'wa#0NAmbQmVlS5k&0jX']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/artist/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['(8M]wKPfNrvUwPz72c', 'j3O43V^Oei6OxWj0'], artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['P2b^K', 'jD6C]W'], artistAlbums: '!bcgI)xO'}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Z32JpMVIXPfW5fTx7', 'CK8Rw)urzQK]eS'], artistAlbums: -8667241595797502}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['xGvd]!tR43d1*Fk', '7XiJa5BjsTA5HOO'], artistAlbums: -5395377754734593}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['#Mph!XPC', 'wmXTxfGMy9MH*'], artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Rnpa(O1ebpjCLmvL', '&Ds2^SFqw3CRRkusWT'], artistAlbumIDs: '*O$LwZY!T)jRCn1p&'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['$OMvFUKQX2v[O4zE@', 'josM*Y5BeZNAUAH'], artistAlbumIDs: -2663447510646782}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['hrNRaFq%RT', 'Eral@A]AW^IacLIQ'], artistAlbumIDs: -7629646183006209}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['1BVlyU', '4GbrWvwUyh&[sx'], artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['u(zGZn[)', 'weV0KZGxvS5u6'], artistState: '9pBUrFNVLa7qCZmS!8r'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['IwrcD@Y$^BfO3', 'rHrYVnoi4zhO%y0elK'], artistState: -135971572023294}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['AYx@BT9Y5[SxaAC', 'zpIOt5cvjC4Psz2r%R'], artistState: -5826566672089089}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['oBivu8VU0iUHNS!^n', 'bqddKs^^n6[C'], artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['L9Bk#*Csu5!6]TLm!t', 'iy#gp'], artistTracks: '3fuWx'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['KzHIr^t@j', '91(%9'], artistTracks: 2470416190799874}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['euDmPyW12nx6aj', 'Lt@9A$IgD[u(Np))'], artistTracks: -2689886708563969}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['iPrCr$', 'vNWXxjB*lGQgrnK9)oPM'], artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['$]h9)', '3fU2GoA0l'], artistTrackIDs: 'ggR$oJ#1%T(0Dp'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['P%nUfLU6(Hs', 'V13bZ'], artistTrackIDs: 2161686156935170}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['VYIBBu36$Fb', 'o&v1grOagLz2y'], artistTrackIDs: -4038243360178177}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['wcx73Lx^WH', 'T*B[mO'], artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['NRc9EbilaZ', 'wUOzncRt&xr)pD0b'], artistInfo: 'prxW2'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['w@%xQ09yP', '@)ISr4R0S7u99cHqbY^o'], artistInfo: 4530713994985474}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['xMZZyd@^MZ5t1Ww', '9vS(P4&9@'], artistInfo: 1246059296718847}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['PJPia4im^6)ciuKM', '506BMy8'], artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['[Z^l7%NfB', 'CBRna&uyDbfUB'], artistSimilar: 'ZWcMuLk$2'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['sGlc#u1n', 'VKcuF4xl'], artistSimilar: -7042035873742846}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['3l%Gvm&pARfx]f', 'TwEzHzIW'], artistSimilar: 976714607886335}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['5AtXG5', 'T5BA9RLimXc'], albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['aoWxQM2JQyYg', '4N4KKzrSyDe0^'], albumTracks: 'WfcVispyg'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Ko%QCgunZY7$O8sPuM31', 'dQ^]Q'], albumTracks: 7067328982286338}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['^XQqvd^', 'vkME3FY&s&M1RA'], albumTracks: -783521572454401}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['9Kh^zjyoK', '9xM@!@YxbNJf*$cKllQ'], albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Q31d]#L', 'lz6btDU9mBJ'], albumTrackIDs: 'hB(GS4^5f0l6ZBgF'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['VM6UWcrQsn3', '1YdMkV2Qhmzo4X$KL'], albumTrackIDs: 7848742543687682}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['qqRI9g9XkldL', 'Bb1W$NpXUw6Gmzb'], albumTrackIDs: -7567484513157121}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['mGemyixZKcJmwyfKVc', 'gES@^LM]X@ffqyY'], albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['VT9bv[i', 'cH7N0j(rNpK8^Ddx'], albumState: 'VggFHO%)!6@3'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['B[yMzxPZ7[EO%', '&NuG*Psv7Bp!3Z'], albumState: -7024394090053630}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['M6yleIsG0W(', 'LZ*DGRqp$'], albumState: -3299305846734849}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['NPE*Jehv0b0V', '#vJEGOGSkhCDa'], albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['4PyPONbY1V(YBCT', 'nv$rsSz0C!YAXD@1Q9e'], albumInfo: 'eKSo)@O9x5^'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['mM!elm2Pwf@', '1XE5nPYV0S@SiUC*'], albumInfo: 1399961417678850}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['oC!g&ns4!0WV', 'AgUzik*AwBq#O'], albumInfo: -1296840972566529}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['djTEOvoc', 'F]NAlJb8&[mF[AM4MT'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['tX$GlB8', 'p7GR#C4TdHT1T1emr'], trackMedia: 'xILj9'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['KMqc)q', 'e5NNq(FK^nQCpBnmP7'], trackMedia: 222445877329922}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['!BfiwI8nHuU$', '&RA3lz@T'], trackMedia: -714756272947201}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['bS[NwdP7rhT', 'XPc2%fi'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['WxTRCjCTdYw9j', 'rIf8&YCJX'], trackTag: 'XfPKf9bcMHn5%'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['T8GUE(1aqlbTn*', '(TcgU^EKRiwAXOf'], trackTag: -7122151219920894}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['4cb3^Z', 'hljV067[&zx'], trackTag: 4087857190797311}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['e@BILx%VEZDNe&t', 'jC]64XB^ne#T^g'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['l%gh&3mOTe3cYx', '%qAujv3BN@y('], trackRawTag: 'Q0c%IyjWK^m1Usq*F'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['rw*JXjY2pa*u2i', '0$s&WSjA&qTO$ed'], trackRawTag: 7854950432374786}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['XWF#9@9CY9g', 'K@A%K6UJRe'], trackRawTag: -3240576786890753}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['fX@U!wlg]xJm7AFHX', 'GzNx&#Uq&wf'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['v]RDG!F2mj1[z&5Jcclf', ')NN6XGDf'], trackState: '4H]BefCJ8]xn'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['0%qqDZrPpp@c', ')2S&owyeRx'], trackState: -4105196107988990}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['ZCL0ZAjL3ju!boYR', 'o4MI5[qIIeJ'], trackState: -4129327159443457}).expect(400);
					});
			});
		});
		describe('/artist/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/search').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/artist/search').query({offset: 'xBR[qKZBK'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/search').query({offset: 10.66}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/search').query({amount: 'oDEbh'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/search').query({amount: 24.03}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/artist/search').query({amount: 0}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({name: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/artist/search').query({rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumID" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumID: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumType: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value invalid enum', async () => {
						return get('/api/v1/artist/search').query({albumType: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value null', async () => {
						return get('/api/v1/artist/search').query({albumTypes: null}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumTypes: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value invalid enum', async () => {
						return get('/api/v1/artist/search').query({albumTypes: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "mbArtistID" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({mbArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/artist/search').query({newerThan: 'm5]A%mZEPB9WL&u%l'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/artist/search').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/artist/search').query({newerThan: 7.08}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/search').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/artist/search').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/artist/search').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/artist/search').query({sortDescending: 'smehaEzNxP'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({sortDescending: 7948871833485314}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({sortDescending: 4114375233241087}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistAlbums: 'WImnNt!e]Ra'}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistAlbums: 3911038638489602}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistAlbums: 1527855431286783}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistAlbumIDs: 'CKrdKZ'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistAlbumIDs: 8668043693522946}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistAlbumIDs: 7812362845290495}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistState: 'oHb7yeuCSf@5xH(O!'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistState: 3362464271958018}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistState: -6752866303737857}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistTracks: 'iiIfK03rodco'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistTracks: -8371309067108350}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistTracks: -1118309533614081}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistTrackIDs: '72QWR9By'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistTrackIDs: -8950402686910462}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistTrackIDs: -8265515566891009}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistInfo: 'Us7NiOL9poIX2Z!WWF@'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistInfo: -5888041428189182}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistInfo: 8289410621636607}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistSimilar: '@V[(OQvp!1C)ZO'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistSimilar: -7258706479677438}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistSimilar: -4122337695760385}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/search').query({albumTracks: '8Jog6YoGc]J('}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({albumTracks: 8834982944440322}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({albumTracks: 3533792539049983}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/search').query({albumTrackIDs: 'QvL6Yd[H2Y!avf&WQ1!K'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({albumTrackIDs: -3985895208255486}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({albumTrackIDs: 5587570519965695}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/search').query({albumState: 'HFB2tdB9G2dWK'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({albumState: 6847697747181570}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({albumState: -5927418384613377}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/search').query({albumInfo: '4hNiXPh'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({albumInfo: 4906245282594818}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({albumInfo: -3518494251417601}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/search').query({trackMedia: '(hoiv'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({trackMedia: 3889224117911554}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({trackMedia: -772604226961409}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/search').query({trackTag: '!&zf7ORB2!Rf5b'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({trackTag: 1507529288843266}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({trackTag: -3222891621515265}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/search').query({trackRawTag: 'OJQUjkrKNog'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({trackRawTag: -204782077739006}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({trackRawTag: -6173573215420417}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/search').query({trackState: 'ZjTHcebHM'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({trackState: 2418212234854402}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({trackState: -3023760105930753}).expect(400);
					});
			});
		});
		describe('/artist/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/state').query({id: 'S!ido9'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/state').query({id: ''}).expect(400);
					});
			});
		});
		describe('/artist/states', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/states').query({ids: ['VOeYE*VX2*85[buX5q3b', 's0PRd2RPl']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/artist/states').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/artist/states').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/artist/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/list').query({list: 'avghighest'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "list" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: ''}).expect(400);
					});
					it('should respond with 400 with "list" set to value invalid enum', async () => {
						return get('/api/v1/artist/list').query({list: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', name: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumID" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', albumID: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', albumType: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value invalid enum', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', albumType: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value null', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', albumTypes: null}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', albumTypes: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value invalid enum', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', albumTypes: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "mbArtistID" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', mbArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', newerThan: '!C6VXWd6]Qij6]NnJI'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', newerThan: 98.95}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/artist/list').query({list: 'random', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', sortDescending: 'A#EiD4'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', sortDescending: -279482996883454}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', sortDescending: -1245712981426177}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistAlbums: 'iJ$Ay4H(Zh]'}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', artistAlbums: -7786336392052734}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', artistAlbums: 5368446648844287}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', artistAlbumIDs: 'R[LU0M#zW]oQ'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistAlbumIDs: -3821347419455486}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistAlbumIDs: -2296951164895233}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistState: 'NGpP&KUE'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistState: 3372269120258050}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistState: 3983494292176895}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistTracks: 'nzi!]6AqlBKG9'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistTracks: -628575266930686}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', artistTracks: -7471043421667329}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistTrackIDs: 'jecGp]w'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistTrackIDs: 6920523804049410}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistTrackIDs: -4423612937273345}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', artistInfo: ')hpG$b9ts'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', artistInfo: 6901896472166402}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistInfo: 2468139304484863}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistSimilar: '9UsArw%n'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistSimilar: -1160845660782590}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistSimilar: 5216076388368383}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', albumTracks: 'eC$6fX'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', albumTracks: -1934621700784126}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', albumTracks: -1250539274764289}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', albumTrackIDs: '@JOrcf'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', albumTrackIDs: 1870978447572994}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'random', albumTrackIDs: 5458192607739903}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', albumState: 'U(1*th5l95PM'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', albumState: 8927632259284994}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', albumState: 4727615722094591}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', albumInfo: '27HDPCv#OGosJZ'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', albumInfo: 3467480181768194}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', albumInfo: -3484702111432705}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', trackMedia: 'JLmnF#JF'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', trackMedia: -4689158689783806}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'random', trackMedia: 1167189591719935}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', trackTag: 'PsrRJv47$OI#S^O'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', trackTag: 5416676673716226}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', trackTag: -6668614362988545}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', trackRawTag: '[U2DJJ%'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', trackRawTag: -4925318410272766}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', trackRawTag: -6549501930110977}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', trackState: 'WkEJ3MqP'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', trackState: 5206671999631362}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', trackState: -7893754920828929}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', offset: '#wqaUv2Co$y9dyQFW'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/list').query({list: 'random', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', offset: 92.62}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', amount: 'x7Z0]T1kGOz]$c]glQ'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/list').query({list: 'random', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/list').query({list: 'random', amount: 44.74}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', amount: 0}).expect(400);
					});
			});
		});
		describe('/artist/similar/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/similar/tracks').query({id: '4$j86f'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'Qg80O4hjry5^d0L86', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '3f*kzSwdzmrF*1E^8', trackMedia: 'qZ8]AUZP6njoi*T'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'I4$85[lA(DroedW^C0', trackMedia: -4817437518200830}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '7x$RS0txbo]pM', trackMedia: -5600479341969409}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '%Ct6B3CR', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: ')S$OOldG31^]hX', trackTag: 'Q7pVOd*VD1S&KSMzfij'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'yNE!a]#J38(k', trackTag: -8302256466165758}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'mdo$yfgp11m8', trackTag: -373319387840513}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: ')CzS#@wMWXTEF(', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'R%]8Zx%1^ERCB7n2r', trackRawTag: '[WI5LD'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'yb*J3Ex3Fug', trackRawTag: 7210449636425730}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'DHYnHg]Oba$Slv9[nqoT', trackRawTag: 2586687783829503}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'UrvXx#UeyYgei', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'AANVpxR7%Lt2tHS0G&5F', trackState: '5a7P!k@lWMv6mM0yxq0Q'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'OTPx8', trackState: -769048023400446}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'UshJ3LF^S5z', trackState: -2495067159789569}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'NDPOyYLRZ', offset: 'd)oRStP'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'ds8vNCnO0FX2TyKh', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'lNy^bvyMHWq', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'u3XQFQHub', offset: 73.17}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'rfgtnJm', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'WWl%vxtX4XbkmVNrtCp', amount: 'LSyGt]&0'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '&PBuuqdDTIdhM]!B0c5W', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '4dAmIaqTl$(rl', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '9*@Qz8T', amount: 27.21}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'F][$jnF8q', amount: 0}).expect(400);
					});
			});
		});
		describe('/artist/similar', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/similar').query({id: 'n!N@WXsbI(vdFSk'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'C4i##F5erV3[m', artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'E99v2[EV(Tv5tAc^pjhV', artistAlbums: 'kx1[M[ajVVhszMj'}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'hGhF7qf$4', artistAlbums: -6022894031208446}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'Wg(pd5XuBwUh9&a[Xs4#', artistAlbums: -6525058646278145}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'QcTknuf]', artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'M%GA0poYgctF0*jAysf', artistAlbumIDs: 'b1T2Zs'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'VTlth', artistAlbumIDs: 8031064475828226}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'uS3TuPOJQcb8M&jUTj3W', artistAlbumIDs: 5079432624603135}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'bCWJ*LJ#', artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'G4XCQb(T6HKazO', artistState: 'XA%2YW'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'i@VS&2ruaX', artistState: 8098411718901762}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'tgbv$KA]9aGVG2]6x', artistState: -8907112226750465}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'NN&[HO[I92qNR$@VZ', artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'X1wZm]XEx$UEO7B^CCkT', artistTracks: 'wxJ7clGz)'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: '0a95tQpaf&lR', artistTracks: -1815970985279486}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'XF4q#q7oeQi85hh', artistTracks: -98466210512897}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'i6tgp**9drp8zQ*of', artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'dYDb$RcErI]&8*(5)y', artistTrackIDs: 'Lnq8O9(SpG3'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: '$hK*3qj(gnX&1qR@m5', artistTrackIDs: 5004110537424898}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'UT0mE5CP6!^OOd!f0V', artistTrackIDs: -5711075211214849}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'oe&Gbxr*w98N', artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'z!Zqiwd6QJv8MA^', artistInfo: '*NDDX[G*S61haa^Se'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'dR[Zdoz1oVB', artistInfo: 5749110296543234}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'U^vT%8', artistInfo: 3084167285833727}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'aiCP&', artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'FvooaBb8MPjmJRO', artistSimilar: 'rV9dC0^%q&J*@(J'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'weT@]N9%)jF$T^T', artistSimilar: 4033243187773442}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: '0BlSm4ZJuYu]GUv33', artistSimilar: -4605908629848065}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '@KbXfM', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '$9NL4F1Mrg1r[a3Ue1^X', albumTracks: 'E]Ku!t2dq8'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'dpz#q8uY14oe^o)5W', albumTracks: -5913833373695998}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'Rw]ktF)nOdlCH%qEVf9', albumTracks: -7414934790995969}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '38KryEvTd', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'O21bY!9DUODnz', albumTrackIDs: 'GgBJLcZbmyEmL'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'sFKvkkNxSg!', albumTrackIDs: -1251015835779070}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'IdQF*mlZeAO0o2w', albumTrackIDs: 3594422511992831}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'nnvdVdaXYC[J', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'nMXLct7t!eRUY[L', albumState: 'Kn3DqLOEL%Wu6'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: '9NSN4C^kz]*Jpr@c#', albumState: -4306572649955326}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'OhI0@srk', albumState: 2092398976958463}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'jjH46s)f', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'lOE9(oDqS', albumInfo: 'szBl05mio5[Ei(!4'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'Zy%3xt', albumInfo: -1712771628531710}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'q4EY!CRN^', albumInfo: 6504111507767295}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '[sk*PP#zZ5F9OC', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '4Yarac0&Hwx@W', trackMedia: 'nnqe6gsE'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'Fj#$4', trackMedia: 5275238728204290}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'gT%AO9JFl1*!', trackMedia: -3055808824737793}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '!ZT[V', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'rbMqgCmI$Jiu8w4#MU9', trackTag: 'A[^Bnay'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: '(eig1vj]02[FHaRlhf', trackTag: -8754358288121854}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'U]pz(1@TtrUAZw', trackTag: -7105333105262593}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'Pta*4c', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '#aQtB[BF&(sXYiCS9P', trackRawTag: 'p*uZFx!U![Hd'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'H*W(Gn!zh4r1^mnT', trackRawTag: 3490141653958658}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'gtlK6*Pz2rk9EE&SQL', trackRawTag: -6802573013024769}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '3A4rCuRxj$mY&cRJe', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 's]qELoz3H', trackState: ')]Dgzgc'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'I02$o', trackState: -2207373519224830}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: '&r^zqOqx7%0f', trackState: -4714426041106433}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'dWbcYgAtXF5Kk', offset: ']Gp@&w^'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'im)zA', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/similar').query({id: 'KViW^c6', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/similar').query({id: 'ut9WmV1IZjP5', offset: 16.73}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'K8)GnEBX3', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'BT!]&2!C', amount: 'JNguYF6ZKrOkPTS('}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'NMe#m5%iQqfMonJvF1', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/similar').query({id: 'b%t4yChw1)Z#p', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/similar').query({id: 'npRz8)O33KhmMy', amount: 40.59}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/artist/similar').query({id: '#XFq(Wt4dXwW', amount: 0}).expect(400);
					});
			});
		});
		describe('/artist/index', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/index').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({name: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/artist/index').query({rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumID" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({albumID: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({albumType: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value invalid enum', async () => {
						return get('/api/v1/artist/index').query({albumType: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value null', async () => {
						return get('/api/v1/artist/index').query({albumTypes: null}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({albumTypes: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value invalid enum', async () => {
						return get('/api/v1/artist/index').query({albumTypes: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "mbArtistID" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({mbArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/artist/index').query({newerThan: 'mG(Qrki5f5!'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/artist/index').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/artist/index').query({newerThan: 60.23}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/index').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/artist/index').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/artist/index').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/artist/index').query({sortDescending: 'k84!WEvyjSm'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/artist/index').query({sortDescending: 8834934802219010}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/artist/index').query({sortDescending: -2530539009474561}).expect(400);
					});
			});
		});
		describe('/artist/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/tracks').query({ids: ['6tf5j[vZ[wL&&4#', 'XbrFW*1O[CJ%#^[*l']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/artist/tracks').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['9KXjn#0HLwmQ', 'hYt4PCVsRqW)m^'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['i2tLxlJ(pN', '33nbPbIw*[ZIYSpqTUB'], trackMedia: 'p*L]wV'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['!kRG0c*jCPI2X', 'K4ODmO%J(eHIr3Qz6'], trackMedia: 3762883787751426}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['JgwoQIj9Pd7M0vQDZJ', 'I2dd&tEos'], trackMedia: 7034224829792255}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['OEN!&oa(vU', '@qkPiwonG$[nMIOnWj'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['TlYi#kJ3dx)!Llp^)k6', '5Vl3T2'], trackTag: '$ng7Ts)[wRg)VzvI'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['uIwN0713L', 'NOqMicYoSGK&Mc'], trackTag: -7994600136376318}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['^og)l%mY@tQTC@', '$PeSn(51[LP^&'], trackTag: -4396072893939713}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['D2TxtS)1', 'S]5A!d&ir0v4J'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['UcxH6x^ym93', 'T!L&WTvtZ*f3pAngJg'], trackRawTag: '927C1'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['d#Khu', 'Gt6HOQYAUvy$)6H'], trackRawTag: 3763394289074178}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['1dmRrAPHcY4zifSe##g', '6KqVXCooI00M9WsMH1'], trackRawTag: -8029748764606465}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['Jj5P4En1vHY2[p&(', 'BaXM7f'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['Q(IPdz', 'Z5T^63p@IZkpa#gqUoRC'], trackState: 'Cl3)6XEo@3]t1^Mq0S'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['ePcYc&Z4B6PHeKSE', 'km6XRbeW'], trackState: -573633802010622}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['[dAoEbIx^RK1tuAy1h', '1IgmrYi9gh6]$Se('], trackState: 291804310142975}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['1zPDQhSI4aWNrJD', ']fcKCz95'], offset: ')@oL]Hf@8dt'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['d!YRhp3', 'V9vIb8iGl]XJM4'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['z3ti54T6', 'T0o]NBPI6jH15t6'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['3SrwGc[Qsg]O)QE', 'kZ!yg'], offset: 7.97}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['7Rifen&9jnVd076', '7ozQ&CO4qumL&UEB5y#'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['pdkuuhm*G]$*n', 'KOpz#XAz'], amount: 'YLmkFoY%kWJ@T'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['x[P!KJ6bejGu7', 'v#3tSKs'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['&s%WE!Shgl6v$ZCf', 'lV!%sCI8)ltiS[nB8W('], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['xHd)kqm$JP', 'Tx6V%'], amount: 38.95}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['cJLU4UE0xeb', 'k^kk!xYN(0TyjC'], amount: 0}).expect(400);
					});
			});
		});
		describe('/artist/info', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/info').query({id: 'ilw0OGC'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/info').query({id: ''}).expect(400);
					});
			});
		});
		describe('/album/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/id').query({id: 'YTQ8IyE'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'yGD&MT2', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'hKMLdw*YcFlQM6', albumTracks: '08hTGoA[Q5IG6QKZ'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'l412yJY1^', albumTracks: 5783018006380546}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'n6ygibgvPK1H', albumTracks: -6697184422526977}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'v!fk*U1DC!^drFpTDp2', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'IZqD%u2', albumTrackIDs: 'y9wzK!AU374'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: '[]uBWww$Hrji', albumTrackIDs: -6794432326139902}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'c[jQrhPhH*Dn]fs6', albumTrackIDs: -3468264835383297}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'Wr%xZT%n[&c@NL7Z', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/album/id').query({id: '^eT*yhX@aLQ4l', albumState: '1tz$uq&pPgeB$K'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'z0cCDJa*(InqT', albumState: 7079432711831554}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: '@h49br[IvoMS9D6zfx', albumState: -3615888024535041}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'F[[NXeRcM#tB9)i', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/album/id').query({id: '9ZXKM@jxkGIGj7BDBZAI', albumInfo: '&QrHX%6kpjF2dt&'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'oEi&SK', albumInfo: 5416535074013186}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'Hpc5SB!Sec!0Y*d95v', albumInfo: 3067345631182847}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'M2@na7$0I^$t8!', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'Rz98T', trackMedia: '5vqOQr@BDv]$cwLF^fsy'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'ta)RLF]GK1aez2U#XCg8', trackMedia: 5493079402348546}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'FwzF4', trackMedia: 1221976530092031}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'dI3bdzu)kO7y', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/id').query({id: '1VQ&Cy@5mg[o74rR', trackTag: 'Pv95aWS'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'MVTFMY', trackTag: -5500418767454206}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'buEbiMcVJC@kp4tILkf$', trackTag: -406410894508033}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'DXC98aQ&xp4bL!XVU', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/id').query({id: '^oDIDScRzj0@I', trackRawTag: 'xXTS4hv9)pms'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: '9%PnN4DLRQM!xYwPjU5Y', trackRawTag: -2681098031071230}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'IfB9B)YoH$UK09Ec', trackRawTag: -1215884563578881}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'WO]Zy$#iTsMtvGL0Ne', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'A(#uk(s^@HupHG3xEp', trackState: 'f&ygo7'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'j5cRg41[2LfcuJwC', trackState: 2236674545287170}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'ov)2ZXH!u%(RSoWa%', trackState: 6063391407865855}).expect(400);
					});
			});
		});
		describe('/album/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/ids').query({ids: ['rpj!1Nq!gd41C', 'tVQb%dN48^pF!(']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/album/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['F023JUGdq3xb', '18m6P$J%tvo0'], albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['34]h6)][(f3aVISm!Ff', 'ywyHBh3uz3I3QPX'], albumTracks: 'CQDn*qz)V4daDI)pX3C'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['cE&QnIr^&]$RY(W', '@VJyD'], albumTracks: 4745208331763714}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['w(A[[SKW(xC2x', 'gcUclp%Ha4zj3'], albumTracks: -1361490791628801}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['TiHN8%ojBrCZG', 'Wg7l^j^R9ryOw'], albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['EtUjf@^z))q', 'eELS8F64Rxq'], albumTrackIDs: 'KHwgV3p'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['A@nw*yXHR[D', 'V2GnNEkkPljKKJUqye9'], albumTrackIDs: 6325651388760066}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['9!SgRGOWGnW[l', 'y5aVkh]SAMMN3NzGOS'], albumTrackIDs: -4746684240232449}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['^QjVi2s^KC', 'isQW8Gmn*SG7'], albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['w^^ogQ$8ezFF@D', 'IAmUOu7'], albumState: 'gQt&[q$HEj'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['p7qSYypbQ()afQQ^5$', 'WWaQA&8Bj1Qzbm^Q'], albumState: -7127078826672126}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['KPt@FBWj5bkGxBj)O6', '@&xVmkrnO$V)4'], albumState: -4428406594732033}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['&AvRfEfMn$e)yH', 'K@eTMgoNSer^r)D$7'], albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['IxgcOMUc!Lp2D[KFB[aD', 'dME*^U[xTzj[gj'], albumInfo: '#4Y*yVKSwyUbP[0kFY'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['s[P)7!2UnU@KZ', '6euAY'], albumInfo: 903940602331138}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['ntMwlT6F@UXP8', 'K(1(zO'], albumInfo: -6578473481011201}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['@0xf)*h', 'D)xe#A7xkX%57]!!'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: [']%]Xn)pj', 'Xc@I#$Ql]IdPuR)CX1f'], trackMedia: '30tiPEUt^wcs$s&E4Gj'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['l4W6PZwCn]Y!j)uxL76w', 'VVhC@]gd5l1)hO7qb0*J'], trackMedia: -3680080924508158}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['qRThta', 'AHN2wQ(#S0ABpX'], trackMedia: -4981627633532929}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['&uOUwm3zNXMpAzq^np', '8gAwa9UbMX2'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['^nrWMR7e', 'hjGZf'], trackTag: 'FK3JdUvnJMvdkH'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['DOYaHt*Zw@', '3GMUD[C@MSeVfqn['], trackTag: 3927489592164354}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['S3LoYm4O30#hrCb', 'l8qOLfCmrI!YW^%C$yX['], trackTag: 7526244996349951}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['1QFmEjRf', 'q*jSE6Cf$#'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['wC&xDE[BW0#EOOp8', 'RyGNQW(HXmt*()'], trackRawTag: '3aKdwN3itH'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['ipBSp!S2D@()]JzOdMX', 'TKH%C'], trackRawTag: 8733859789144066}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['UciCogYc)6k(@n8', 'do!Ftb@yIRHTCB3[0tA'], trackRawTag: 5160237401112575}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['Tm$x[35f3)^Y', '9]S^Syq$'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['dI(7W2$w$BosWs*je%HW', 'Skmkr3X'], trackState: 'SD^(W16OmW@&q1'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['G9o#z*^rh%8mM]tT', 'K)Tb05EO^r)oL@'], trackState: -2183900537290750}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['sHMXVLX3!l(Kqc!$]AZK', 'JnsOf'], trackState: -6896898619211777}).expect(400);
					});
			});
		});
		describe('/album/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/list').query({list: 'avghighest'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "list" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: ''}).expect(400);
					});
					it('should respond with 400 with "list" set to value invalid enum', async () => {
						return get('/api/v1/album/list').query({list: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', offset: 'U3L#5u%K'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'random', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'faved', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', offset: 55.27}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/album/list').query({list: 'random', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'random', amount: 'lGc0mHZ8zox4X[UD'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', amount: 28.13}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', amount: 0}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'random', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'random', albumTracks: 'MRXFoxqqZ*[F%pl0I'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumTracks: -420354409365502}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', albumTracks: -8070819561340929}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'random', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumTrackIDs: 'C*Y48hQ06^q'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'recent', albumTrackIDs: -5711494360596478}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumTrackIDs: -5921613283328001}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', albumState: '3U@bdYL]@Q^'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', albumState: 230906031767554}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'recent', albumState: -3854378851106817}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', albumInfo: '*U]sAM'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumInfo: -2273402320584702}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumInfo: 6968123932540927}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', trackMedia: '[DjIrWctcmBiSBs^PBU'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'recent', trackMedia: -609003675582462}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'faved', trackMedia: 1143209514237951}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', trackTag: '8KtoV'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'random', trackTag: -3515152615866366}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'random', trackTag: -2324341442215937}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'random', trackRawTag: '%i5W!hC)QaEaE]F*'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', trackRawTag: 2932046028603394}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', trackRawTag: -5765225596846081}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', trackState: 'O!fKKhwr4W!'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'faved', trackState: -473896134377470}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', trackState: 8241677445627903}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', name: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'random', artist: ''}).expect(400);
					});
					it('should respond with 400 with "artistID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', artistID: ''}).expect(400);
					});
					it('should respond with 400 with "trackID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', trackID: ''}).expect(400);
					});
					it('should respond with 400 with "mbAlbumID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', mbAlbumID: ''}).expect(400);
					});
					it('should respond with 400 with "mbArtistID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', mbArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', genre: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', albumType: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value invalid enum', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', albumType: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value null', async () => {
						return get('/api/v1/album/list').query({list: 'highest', albumTypes: null}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumTypes: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value invalid enum', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', albumTypes: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', newerThan: 'N4Dh3#G'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'faved', newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'random', newerThan: 65.48}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/album/list').query({list: 'random', newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', fromYear: 'LfSE2mk1'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'faved', fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'highest', fromYear: 20.46}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', toYear: 'tMP)AoO%'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'highest', toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'random', toYear: 51.17}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/list').query({list: 'recent', toYear: -1}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/album/list').query({list: 'highest', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/album/list').query({list: 'random', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'random', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', sortDescending: 'G1]gC]Q*^m'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', sortDescending: -1682658421637118}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'faved', sortDescending: 788883289669631}).expect(400);
					});
			});
		});
		describe('/album/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/search').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/album/search').query({offset: 'AeZ8R5oMEIZW&b#5i'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/album/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/album/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/album/search').query({offset: 81.21}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/album/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/album/search').query({amount: '9]pN!H!r3poUVnzC]@'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/album/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/album/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/album/search').query({amount: 86.4}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/album/search').query({amount: 0}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/album/search').query({name: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/album/search').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/album/search').query({rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/album/search').query({rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/album/search').query({artist: ''}).expect(400);
					});
					it('should respond with 400 with "artistID" set to value empty string', async () => {
						return get('/api/v1/album/search').query({artistID: ''}).expect(400);
					});
					it('should respond with 400 with "trackID" set to value empty string', async () => {
						return get('/api/v1/album/search').query({trackID: ''}).expect(400);
					});
					it('should respond with 400 with "mbAlbumID" set to value empty string', async () => {
						return get('/api/v1/album/search').query({mbAlbumID: ''}).expect(400);
					});
					it('should respond with 400 with "mbArtistID" set to value empty string', async () => {
						return get('/api/v1/album/search').query({mbArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/album/search').query({genre: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumType: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value invalid enum', async () => {
						return get('/api/v1/album/search').query({albumType: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value null', async () => {
						return get('/api/v1/album/search').query({albumTypes: null}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumTypes: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value invalid enum', async () => {
						return get('/api/v1/album/search').query({albumTypes: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/album/search').query({newerThan: 'Q$^C6#9$BPn'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/album/search').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/album/search').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/album/search').query({newerThan: 58.15}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/album/search').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/album/search').query({fromYear: 'mnN^GrW*dK[0&frjP'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/album/search').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/album/search').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/album/search').query({fromYear: 40.4}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/search').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/album/search').query({toYear: 'zI8yfzRrj'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/album/search').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/album/search').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/album/search').query({toYear: 33.42}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/search').query({toYear: -1}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/album/search').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/album/search').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/search').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/album/search').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/album/search').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/album/search').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/album/search').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/album/search').query({sortDescending: '*VGhN[s1hvt%3'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({sortDescending: -3971223704829950}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({sortDescending: 6901444254892031}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/album/search').query({albumTracks: 'gXr*ot6OEqeSp6ngI'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({albumTracks: -6639662353350654}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({albumTracks: 1345809106862079}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/album/search').query({albumTrackIDs: 'ZKp1omdeoYeTy'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({albumTrackIDs: 6819710733647874}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({albumTrackIDs: 4964227634692095}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/album/search').query({albumState: 'LGtF@C'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({albumState: 8990984587182082}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({albumState: -3992183443030017}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/album/search').query({albumInfo: 'LWFJQRB!Ce'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({albumInfo: -5339752668594174}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({albumInfo: -1012247392419841}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/search').query({trackMedia: 'P5VCQM5L5HzN@NF'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({trackMedia: -8504547521593342}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({trackMedia: 8529216492535807}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/search').query({trackTag: 's2jI0JxtiqL&lwuuX&wo'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({trackTag: -6553952061489150}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({trackTag: -4134557393616897}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/search').query({trackRawTag: 'L6aCN9$frJ'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({trackRawTag: 5075588817616898}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({trackRawTag: -8771195017101313}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/search').query({trackState: '7C(FW^SQf(iQo[F'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({trackState: -2779469169295358}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({trackState: 1772689324769279}).expect(400);
					});
			});
		});
		describe('/album/index', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/index').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/album/index').query({name: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/album/index').query({rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/album/index').query({rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/album/index').query({rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/album/index').query({artist: ''}).expect(400);
					});
					it('should respond with 400 with "artistID" set to value empty string', async () => {
						return get('/api/v1/album/index').query({artistID: ''}).expect(400);
					});
					it('should respond with 400 with "trackID" set to value empty string', async () => {
						return get('/api/v1/album/index').query({trackID: ''}).expect(400);
					});
					it('should respond with 400 with "mbAlbumID" set to value empty string', async () => {
						return get('/api/v1/album/index').query({mbAlbumID: ''}).expect(400);
					});
					it('should respond with 400 with "mbArtistID" set to value empty string', async () => {
						return get('/api/v1/album/index').query({mbArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/album/index').query({genre: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value empty string', async () => {
						return get('/api/v1/album/index').query({albumType: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value invalid enum', async () => {
						return get('/api/v1/album/index').query({albumType: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value null', async () => {
						return get('/api/v1/album/index').query({albumTypes: null}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value empty string', async () => {
						return get('/api/v1/album/index').query({albumTypes: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value invalid enum', async () => {
						return get('/api/v1/album/index').query({albumTypes: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/album/index').query({newerThan: '4qWK6SKhVO'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/album/index').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/album/index').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/album/index').query({newerThan: 11.01}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/album/index').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/album/index').query({fromYear: 'iXwqx]v$r@*G'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/album/index').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/album/index').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/album/index').query({fromYear: 99.9}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/index').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/album/index').query({toYear: '*Ac2J2^#nx%p[vs'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/album/index').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/album/index').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/album/index').query({toYear: 64.67}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/index').query({toYear: -1}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/album/index').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/album/index').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/index').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/album/index').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/album/index').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/album/index').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/album/index').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/album/index').query({sortDescending: 'g$&PZ!%egTAn#A('}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/album/index').query({sortDescending: 2221900780535810}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/album/index').query({sortDescending: -4947207153254401}).expect(400);
					});
			});
		});
		describe('/album/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/state').query({id: '2C%f^0RkpF2'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/state').query({id: ''}).expect(400);
					});
			});
		});
		describe('/album/states', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/states').query({ids: ['ky1S@cy', '7^9UH']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/album/states').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/album/states').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/album/similar/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/similar/tracks').query({id: 'OifsW*hoTrvF)epb'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'hRy%05bEM$UcCxv)bC#', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: ']#(jokmwUDJm', trackMedia: 'RBCe4$'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '7[%MJr3La]', trackMedia: -456778034708478}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'n@R97mdM', trackMedia: -6988016362979329}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'K[!MS#O!zrtUgrXtXHH', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '(iSuenQ[zoKa(DB#zBpI', trackTag: 'xuIg!D'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'CzeW[zBLpmd', trackTag: -4073946366345214}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'tfx%VR^C$oAHhOa(M3dm', trackTag: 6401677800243199}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '%o4wSmQPM$o^', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'R##eN!', trackRawTag: 'k1HdZfAQ4Q'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'Sfdc7v*JSb5l%6', trackRawTag: -3324364892143614}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'LbeIVLOVOrNFN&30Q', trackRawTag: 1446413284147199}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'v3#&olR7MYg0N%pS', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'J2#vJm0WuBnsPJ$', trackState: 'eKf7HeV9t'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'hj1zpI38', trackState: -6071767839801342}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '2[RJFc', trackState: 5069452479561727}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'lGXV1!', offset: 'wVhx#](7nz'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '04D@5m', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'O2%KRpJjr42RC', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '^N&ebYmAYgahsN#Xn', offset: 74.48}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'ng%0Kj6t%dY[JMMO8Gi', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '&K(l@', amount: 'k*pX8gS0'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '#EGdQn!', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '2uU5A$s', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'K@iZkqFV&z2', amount: 9.14}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'a5Glgtz8C&cN9', amount: 0}).expect(400);
					});
			});
		});
		describe('/album/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/tracks').query({ids: ['sZ]H%VGzUDSxn0j', 'lvLsD2YcXQ']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/album/tracks').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['OOXkc8!M2Hp!dmQ&1)', ']K(1QkEh'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['GkhDJLNS75Kiw%vLf', 'WGIu!g@zr5lab%Lj[G9&'], trackMedia: 'FBG@xitsqvFY)$#@)*'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/tracks').query({ids: ['@ucBLFU', 'Rg7w4X%2uI(dCteXep'], trackMedia: -4135337261531134}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['!&bvn', '%8KTT0'], trackMedia: -2672328500576257}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['y3]2UcpvS', 's)7IoZBq(ci97F!uA)'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['U!FnlYtm0geUhFITEYdN', 'Us&bc3'], trackTag: 'mYplqT99]'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/tracks').query({ids: [']&BK&#TiC', 'canV7'], trackTag: -6796265404760062}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['tHzCtBD8N1', '!xS[r0jWRQhu%Hk*rYq^'], trackTag: 6761598026776575}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['$xh&P@DrPe', 'VkuqW2vOsM(enhEWkIwz'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['3tT2A', 'oQ6F(GWX'], trackRawTag: 'lY)wqj'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/tracks').query({ids: ['l7ESM[tO&kh4a', '(s13ucFchwr)IsZDiN5'], trackRawTag: 8516438708977666}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['N$#YBeaarxmd9A', 'Fe3iESDmoyoOh3Gy'], trackRawTag: 7066192707583999}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['@oKUGV)s2fvTk]dYs9R*', 'Nq(@aE@@KGmUKC4G9Jfg'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['CsMVIDiH$OXY]zs', 'sjhaHftP5Lr'], trackState: '93Vr22xgZ[7W!Nkf'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/tracks').query({ids: ['GAJYnMIhb@)', 'yez%[(%xf78JZcO]'], trackState: 7907711219924994}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['&iT3(#NdUlxV(tcycS', 'h$6h3$EL7ht%oo0[QDAP'], trackState: -4958639546695681}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['uqzr%xra4OIaKJB^', '#CDh!Ia0Zuoq'], offset: 'osJt2TOE'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['oxv8ho1!c', 'IA$9%^'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/album/tracks').query({ids: ['M&gZ44]zB', '^gkOzrwVCvfk'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/album/tracks').query({ids: ['PYCv7ST', 'RUaQGY^fKV^3Si))nc'], offset: 29.43}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['4^y(kfSQ)4ZV&N@', 'lK48an8eknqIR^'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['P2]rf', '!8k3BDdFCQ9l'], amount: '&mVs5LlVFZaZ'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['Z]fzX', 'hOzMHigkCCK'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/album/tracks').query({ids: ['yT^$a$V#i]rnIq[v', 'DmwOmD@EeB'], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/album/tracks').query({ids: ['(VN9]$nTeE!NgBoySZn', 'K6WjSp8*#m4'], amount: 14.17}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/album/tracks').query({ids: ['N0zB$QJqaKuR!6vSN', 'F@[WeEeGdY'], amount: 0}).expect(400);
					});
			});
		});
		describe('/album/info', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/info').query({id: 'J%%SFc1ODIGXP7Ujv'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/info').query({id: ''}).expect(400);
					});
			});
		});
		describe('/playlist/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/id').query({id: ')9XeKhyHO#3OR7u(T%sI'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: '0wVvU7U^ZjbRhab', playlistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'qojcjkJXyR', playlistTracks: '(m]Z^!MsERySMh'}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'rgOGLD6&[W', playlistTracks: 596803493822466}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: '#*5Q[jaUw5M', playlistTracks: -8000496920952833}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: '3UB(9sy8%%Yfgvv*3', playlistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'xqShPyLV3', playlistTrackIDs: 'rbviFDbZNd8la)YsK[lJ'}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'uLil]JK]iWdcqs[&WHF', playlistTrackIDs: -1881644159991806}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: 'r0nybK*P', playlistTrackIDs: -8179424830685185}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: 'ffo!Vv', playlistState: ''}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'HC%Qi14Z#46', playlistState: 'X(61zv91pTA5M8XFImJ*'}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'L)P!e*uwx0', playlistState: -7185209749405694}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: ')LtM!]0kNzVIE', playlistState: -2943820278792193}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: 'p9za34kG', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'm*hU)*uvEU9h^7]', trackMedia: 'm7KfAhP93IwCW0'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'U]loX$lWX#(^Y]Ck', trackMedia: 3630392095539202}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: 'KOmSHYu4n@0M*Wp7)D', trackMedia: -7767559805861889}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: 'gNGTb!a@9aaYa4Rn3', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'g]*Qw', trackTag: ')oK!nYfk8SGZZnY'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: ')8syKcYP', trackTag: 5270924144148482}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: 'cMVZIySBdh3nu#D', trackTag: 6099958511960063}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: 'MK4xHS&', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'q6kKc(44IMAwC2', trackRawTag: '@Gt2U'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'uHmKO', trackRawTag: -6507882514219006}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: 'y1rg7C6mEMl@qO', trackRawTag: 4209136736665599}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: 'UlYQIq5B', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: '4IeOGxFv', trackState: '3Z7f1JdH92#d)eq@Tw'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: '6oB2Hn', trackState: 7717654273982466}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: '4SUbbY!tK44[N&miM8I', trackState: 4427434556391423}).expect(400);
					});
			});
		});
		describe('/playlist/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/ids').query({ids: ['3QV3!KqZc#P9M', '#%7@$)fIna4o5m']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/playlist/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['bj@SDjrX4h5@X', 'yBHQS@)[6vV@'], playlistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['tVxm2EX^hr', 'p2aMn4XfXM#021p'], playlistTracks: 'D6UvwyOeyf'}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['!H1QO%R&SG@(CWXw3g[', 'tWtuTU'], playlistTracks: -6436972469944318}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['D9zcl&xd2WT)lONA4S', 'c4GbkV7N$PF'], playlistTracks: -5982158036402177}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['2p2gMzfrMyv', 'ohf31$oC8ZP&'], playlistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['*BwEs83c', 'AvCQA*OtSS!'], playlistTrackIDs: 'w4TC3cm(HNdMQL['}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['W3^21kyfM&Y%(iM', 'KR8G0$'], playlistTrackIDs: 2508146614468610}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['lJ#0HzKEygFoP^&EKY', '#TVWb]%hmzfX'], playlistTrackIDs: 7076441518768127}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['B&BFzE', 'VaQweBSp33FEzE'], playlistState: ''}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['YOGZ1qtUA', 'uM1se1O7iSzv)r8D'], playlistState: 'is4J04SPU('}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['nv^EmGBAL9Aj', 'kX(K%G$48utn#(8N(pW'], playlistState: 4199870395056130}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['36#2Y6yoYI&*YQZ', 'JQ$P%]NnfN^oz'], playlistState: 7374578183569407}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['^N5@Q*#ylQt!)A)K*', 'AAa%z#taHwb9V'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['a6Uko^YZ', 'g2BmyX4JKhps'], trackMedia: 'eA)q@QU*2yTH'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['6N7Ok4', 'fE(m(!FL'], trackMedia: -583424087687166}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['qlEaepNAR4Y5nj9r%#rz', 'bjB]n74Nxz'], trackMedia: 4902038605398015}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['rp1pqJ!@A4z)2', 'ShY]q8tSHdSB%*fuU9[4'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['NMPIa2u', '&7g4#uhmP7lV*Yrn1^HM'], trackTag: 'qM2gW#qyDU'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['GuAWKOSIXfY^1kr', 'mS#LrGedFPljNe'], trackTag: -8384421497405438}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['S@gmPXF$LgUPjo1O7aSi', 'I]Yaq6w^'], trackTag: 7964424002338815}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['$RQuRA#05XGm!1bmfK', 'tB&ZH$Aw[*6kMutBz'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['b@HaX8d^^r3*95#@6uy]', 'w)rDESs(S'], trackRawTag: 'B[@xQO6Ds6EsI4RGvS*'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['xkk9u]Hp11$jBccDHH', 'Hy6FZS3d6!$BcSpx]n('], trackRawTag: -6112209264443390}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['!Wd5SuhmZw]dqeu', '9^nrURNm$Sz7#V'], trackRawTag: 8203866394853375}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['y)ueKJk(NHTeBL#', 'N8BFOK(&F'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['*[x%vJw0Df[@', 'b%S#^B3s%d%4v'], trackState: 'lCUFbVkz('}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['W6bI1KeghpqV$iq8I(4', 'r7Oji%KW!'], trackState: 2792410920779778}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['2I56z50WqZxienqTEeH', '$8CoxkV8%'], trackState: 290743130259455}).expect(400);
					});
			});
		});
		describe('/playlist/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/search').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/playlist/search').query({offset: '2LBFckpn0SRZ68oKet'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/playlist/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/playlist/search').query({offset: 44.85}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/playlist/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/playlist/search').query({amount: ']&LrmUFnmjzt2mX$iG(S'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/playlist/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/playlist/search').query({amount: 76.25}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/playlist/search').query({amount: 0}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({name: ''}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({isPublic: ''}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value string', async () => {
						return get('/api/v1/playlist/search').query({isPublic: 'MEwUYPC@H2['}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({isPublic: -2215437966245886}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({isPublic: -5757280645545985}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/playlist/search').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/playlist/search').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/playlist/search').query({sortDescending: 'LKNX1LATJm'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({sortDescending: 8268412379725826}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({sortDescending: 2594003816022015}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({playlistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value string', async () => {
						return get('/api/v1/playlist/search').query({playlistTracks: 'u6b*(G'}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({playlistTracks: 7122698878582786}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({playlistTracks: 5781216078856191}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({playlistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value string', async () => {
						return get('/api/v1/playlist/search').query({playlistTrackIDs: '#jv^Ka[IaLM'}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({playlistTrackIDs: -2997929778348030}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({playlistTrackIDs: 1880851734331391}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({playlistState: ''}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value string', async () => {
						return get('/api/v1/playlist/search').query({playlistState: 'V]wQHM'}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({playlistState: 3926408736800770}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({playlistState: 2688167039729663}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/search').query({trackMedia: 'jmsqt%SB6nigaz(HS9O['}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({trackMedia: 1100909497024514}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({trackMedia: 3434998392684543}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/search').query({trackTag: '8eox2AJCxIIS7cLt'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({trackTag: -7885962671554558}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({trackTag: 2217671642841087}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/search').query({trackRawTag: 'W8Ag9D*ht[do3aui'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({trackRawTag: 5641214846042114}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({trackRawTag: 444041246277631}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/search').query({trackState: 'wYVTj)y'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({trackState: 1957787110211586}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({trackState: -750738594594817}).expect(400);
					});
			});
		});
		describe('/playlist/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/state').query({id: 'ZE78yN9Y[X)%Xb'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/state').query({id: ''}).expect(400);
					});
			});
		});
		describe('/playlist/states', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/states').query({ids: ['I@9QAMzQjS', 'vZ07^H!I4jHdCvN']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/playlist/states').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/playlist/states').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/playlist/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/tracks').query({ids: ['[[JUHvLF$D@!k', 'I)N6E!3erJHC8U1INbpG']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/playlist/tracks').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['jE#TC0tYYXk@', 'AeGyMyX5i#B[f(&3'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['*rtpL26', '7muQHA@pJ**'], trackMedia: '9J5[y]lO*08y5hB&x'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['9aFR2]CJ^05Co1', 'pfHViBtdoh(&E'], trackMedia: -1134192695967742}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['rkm1Wi#vv', '&b[aMwJleRzqWz'], trackMedia: -7912561114611713}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['WjwywBBh4uWs9m#o[', 'iWhJmI$ZXVl[ZpIA$vj'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['3fdjpr1j7qGgAthU5u', '&NRqOuNn'], trackTag: 'Mccp*'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['zGi*8LT@wbk', 'B#j97H4s5t&YldT5'], trackTag: -4795472459857918}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['e(iSy]', 'P4zXnXJUX'], trackTag: 6059078866436095}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['aKcl*RA51RMrAiT(', '8Ej^r01Z9O4hq'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['Pqj@7P8DmcGgBHw9a(', '8e$MJBPJo'], trackRawTag: '83ME0&IO9$'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['nOd6fplmqv2', 'NNTrT2'], trackRawTag: 2142613113143298}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['Vy5Uf', 'xk@mxrqF2y'], trackRawTag: -935703563206657}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['RS$dU*5VE9m)6', 'NVr%^'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['fL8EOXqM', 'CFICiFcz]rkgvbd@'], trackState: 'v*41Hbcxq0&8(FPW'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['PSQn&0JI]dv7I$', 'th]G&CoN*EPt'], trackState: 338699074142210}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['OY2S$A1NW@5c*', '$fBghTF]'], trackState: 3799699400163327}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['XuP4(v2iltv', '#^kc6om^6(j^&]'], offset: 'bi@j0KDqjUcmw'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['xAWT#@BhY4p10$%H]Nn', 'C)rU7#YKChm3$@'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['md7Dki[Cw%ebG7u', 'lcHNKLpg'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['hKtbX)', 'tUK5$W1^mLqP]WKsY9@e'], offset: 1.48}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['TKjqELjNGNW9GUns7F', '%jk2Pk*6Vwf0o[nB'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['Xlz0r9X97n)', '*(0R077%R'], amount: '0Ly9KnHvPXx6SNv9BlG'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['VNzJ8q@ZHsz$G', '!w4CAYCDxED)PWFu'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['J9I2YY', ')h0YW'], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['R@(hD^oYcuIv', 'iQL7zYO5Ee01('], amount: 71.83}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['*Zv1Y3^UXwf#', 'PJG%ZuX2%fvH$hBPQb'], amount: 0}).expect(400);
					});
			});
		});
		describe('/playlist/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/list').query({list: 'recent'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "list" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: ''}).expect(400);
					});
					it('should respond with 400 with "list" set to value invalid enum', async () => {
						return get('/api/v1/playlist/list').query({list: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', offset: 't#0jo'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/playlist/list').query({list: 'random', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', offset: 29.23}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', amount: '([fM&ot$(YzOJxBHqQXU'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', amount: 53.95}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', amount: 0}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', playlistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', playlistTracks: 'we2z['}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', playlistTracks: -5880111257616382}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', playlistTracks: 448127022661631}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'random', playlistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'random', playlistTrackIDs: 'N@M[1'}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', playlistTrackIDs: -3143720299921406}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', playlistTrackIDs: 4062259865190399}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', playlistState: ''}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', playlistState: 'KD3LvK!tt4m'}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', playlistState: 7995088823123970}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', playlistState: -836824234721281}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', trackMedia: '[cnc9T62'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', trackMedia: 1245765653495810}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', trackMedia: -3576238841004033}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', trackTag: '[(kmcfD07Y'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', trackTag: 1102791577698306}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', trackTag: 3419271057113087}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', trackRawTag: 'LebiTqXs9Wd'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'random', trackRawTag: 8874772129644546}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', trackRawTag: -8654431117639681}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'random', trackState: 'iBQM&A6H8dvRudpv'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'random', trackState: 2879252965883906}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', trackState: 507451904360447}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', name: ''}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', isPublic: ''}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', isPublic: '4bIwVPLO]vu7l'}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', isPublic: -621120717848574}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', isPublic: 4854939553628159}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', sortDescending: '#i!A)'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', sortDescending: -8315478694952958}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', sortDescending: -1283518076289025}).expect(400);
					});
			});
		});
		describe('/user/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/user/id').query({id: 'nt1bkd[J2$K4P'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/user/id').query({id: 'nt1bkd[J2$K4P'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/user/id').query({id: ''}).expect(400);
					});
			});
		});
		describe('/user/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/user/ids').query({ids: ['OuqljJT8WfWzt', 'fk@zLOH(e]XvJ']}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/user/ids').query({ids: ['OuqljJT8WfWzt', 'fk@zLOH(e]XvJ']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/user/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/user/ids').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/user/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/user/search').query({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/user/search').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/user/search').query({offset: 'gL&[R0Q@E]hK3NHO0*l$'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/user/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/user/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/user/search').query({offset: 60.66}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/user/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/user/search').query({amount: 'aNeiL5(*84FT18WAHqg'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/user/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/user/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/user/search').query({amount: 36.97}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/user/search').query({amount: 0}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/user/search').query({name: ''}).expect(400);
					});
					it('should respond with 400 with "isAdmin" set to value empty string', async () => {
						return get('/api/v1/user/search').query({isAdmin: ''}).expect(400);
					});
					it('should respond with 400 with "isAdmin" set to value string', async () => {
						return get('/api/v1/user/search').query({isAdmin: '7myln[2lN%'}).expect(400);
					});
					it('should respond with 400 with "isAdmin" set to value integer > 1', async () => {
						return get('/api/v1/user/search').query({isAdmin: 2343952120283138}).expect(400);
					});
					it('should respond with 400 with "isAdmin" set to value integer < 0', async () => {
						return get('/api/v1/user/search').query({isAdmin: 8011950696955903}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/user/search').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/user/search').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/user/search').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/user/search').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/user/search').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/user/search').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/user/search').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/user/search').query({sortDescending: 'GtPkEn3O40UT0%[A[I'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/user/search').query({sortDescending: 1561848537153538}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/user/search').query({sortDescending: -8559084190040065}).expect(400);
					});
			});
		});
		describe('/playqueue/get', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playqueue/get').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "playQueueTracks" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTracks: ''}).expect(400);
					});
					it('should respond with 400 with "playQueueTracks" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTracks: 'vNjkmWSbnY'}).expect(400);
					});
					it('should respond with 400 with "playQueueTracks" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTracks: -1310229413232638}).expect(400);
					});
					it('should respond with 400 with "playQueueTracks" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTracks: 2689865372139519}).expect(400);
					});
					it('should respond with 400 with "playQueueTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playQueueTrackIDs" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTrackIDs: 'gSCU)d'}).expect(400);
					});
					it('should respond with 400 with "playQueueTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTrackIDs: 4568890248003586}).expect(400);
					});
					it('should respond with 400 with "playQueueTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTrackIDs: 8204932649844735}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({trackMedia: 'ujXFOW'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({trackMedia: -4117185916043262}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({trackMedia: 395043504390143}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({trackTag: 'y[$byP%9nCGkkA#Z'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({trackTag: 5383779669508098}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({trackTag: 3826974153768959}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({trackRawTag: 'T39#T8pXBd4[)[0%'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({trackRawTag: -8349179701100542}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({trackRawTag: -805175136616449}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({trackState: 'e#6ruxSEW]5'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({trackState: -171322801913854}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({trackState: 874041829228543}).expect(400);
					});
			});
		});
		describe('/bookmark/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/bookmark/id').query({id: 'Rn!ru#oceONv1(H'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'RL37zcMEbaRF2', bookmarkTrack: ''}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: '*1Eh%br8MJoB*)d', bookmarkTrack: '6t@r43I5YvSLYk5$DOl'}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: ']r(1y4Ndf5R&4FWI', bookmarkTrack: -6377130292150270}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: '[u[[9DP@^gbL@', bookmarkTrack: -2225234631458817}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'FE6RvhA^ifY', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'V!#ad9', trackMedia: 'iW$^*z6!'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: '@gXC$faUGC', trackMedia: -4650614466281470}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: 'BFJkCRYvsh[UJgBgxS0', trackMedia: 6952271925477375}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'Y7eZl5!pJ[5*WxL', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: '$MK&DCG0nFZK', trackTag: 'ioYcj(6sKZy![^kZ'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: '4#d*30', trackTag: 2003845467078658}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: '6TVThDO)YG', trackTag: 7496749606240255}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'Rj1lPwtDI%noCc#g@hE', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'cxV@L#^cV3rf)', trackRawTag: 'QGu2WYN$rdI5!P%p@h'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: 'zUQt$er]ky(jx)ykm]', trackRawTag: -1064487633289214}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: 'KZ5xeT%6&RNQ', trackRawTag: 7764768576241663}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'hrO@a6EFeuR', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: '8A!b)#OGZOWVq', trackState: 'yhBeFP4nRak$#Qmrr5e'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: 'Qb8X]@N!GL@axLr4*KH!', trackState: 5794051865444354}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: 'fYJiH(qWcBUjz', trackState: -7291586274656257}).expect(400);
					});
			});
		});
		describe('/bookmark/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/bookmark/ids').query({ids: ['I7MGEHFR5qWT%L', 'tTF@aJUgj#[cfao)Rsdl']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/bookmark/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['Q1xqQKY(SxUH6[Kp', '(q%kmaV4'], bookmarkTrack: ''}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['5Yl7J1cz4i*#hX%*32', 'ChD54CkhGHYnybecs9W'], bookmarkTrack: '*mlBxameq)T'}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['aZtBU', '$6$Sr'], bookmarkTrack: -1525782413311998}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['r0B$DKzAlrja$Pbi', 'YhGNJmyj#X90Hk]g%I'], bookmarkTrack: 5747669167243263}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['l7qBp', 'J*3iTVvYqtM3'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['1X([BzESS5aZx^#SJ', '[%jNmx('], trackMedia: 'FY([W9fI0G'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['Fommn]Pj5@#m%jG', '1c6K2Ins*n(8BGo%W'], trackMedia: 5416964763680770}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['b(GR*rBiJuyS8OcHu8', '(rxw58EzLGfP^^Q9e8!B'], trackMedia: 8570573160447999}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['hqjE(Kew', '9rR79IB'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['[Ib6c', '^ZOo&aHO084b9T3wh@'], trackTag: 'mMl]nLeot'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['puo1OT[ehMpv', 'uBvtmIXNDHW3[!@e('], trackTag: -6691219006554110}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['^jsk[I', '0FO0fi5'], trackTag: -4097406148804609}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['%]%IJG2J]ZfY', 'L!bP8q2OCXFAgSB1ZlU8'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: [']Ot6t($eWJwwF!q4PH', '%YlR0S6^s#Q0KazD!16'], trackRawTag: '46)SoMC'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['gUXc2OxTP#wQ%Ih', '!UQaVg5x)dM3$'], trackRawTag: 820859459600386}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['&ewm&', 'm(mYK%8rIYG$gU'], trackRawTag: 7824767524536319}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['IJkscr6!YbTI[eg', 'hQz0[]D26V(jc9'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['9!EELUcl#dUX', 'VqHYk7aV'], trackState: 'woje9bfDZgWdgRMK#'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['6uKpQdQ^', '^bBovw'], trackState: 2191406437236738}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['WVdKv*KQ#IB', '6!VdwEJQaM@1pjc%8@'], trackState: 4888177705746431}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['Mxz#IQrj@5GNc8vEZA(k', 'ey7)am!V^1vttUFp*'], offset: 'wEf1W5C3'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['&IJ#aao', 'M]Pcr1KXvJ7F0I'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['gSMzm#h%XAZFBL', 'LTLKvGwu&!*P'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['Rk7UOThPIRhvCifKLvTk', ']h&^j(n[&Q0agxDO7Iyk'], offset: 95.51}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['wHxmf]g&6CzP]LBM', 'd)[^F[Qnc7!sR'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['w%b&k2tj0', '^%UGDPCh'], amount: 'ldm@Q8H7'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['8e(eLT', 'pEPw7y!SQCcoEV'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['zGiRhgy', 'ldD3m'], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['NkHAFogZssB&I]$qo', 'oM[D8XNV'], amount: 34.47}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['Ar2S99W*U', 'et8(8Y3H'], amount: 0}).expect(400);
					});
			});
		});
		describe('/bookmark/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/bookmark/list').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "bookmarkTrack" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({bookmarkTrack: ''}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({bookmarkTrack: '!iHhEwoQmzvzsj3('}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({bookmarkTrack: -182411379867646}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({bookmarkTrack: 6092176819748863}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({trackMedia: '$a81$x1hLtpRKXj'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({trackMedia: -589488359211006}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({trackMedia: 3659202232844287}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({trackTag: '2s55M'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({trackTag: -8642930545786878}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({trackTag: -3858768328654849}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({trackRawTag: 'xbg$[d'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({trackRawTag: 7054291369984002}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({trackRawTag: 1775927482646527}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({trackState: '&2(R1(tIf6Io$z0TlD^'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({trackState: 6307258212286466}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({trackState: 3667509899165695}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({offset: 'ogI1WVu)iN5qHVwu'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/bookmark/list').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/bookmark/list').query({offset: 47.38}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/bookmark/list').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({amount: 'ClV&NP6)ye@PzG('}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/bookmark/list').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/bookmark/list').query({amount: 42.5}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/bookmark/list').query({amount: 0}).expect(400);
					});
			});
		});
		describe('/bookmark/byTrack/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/bookmark/byTrack/list').query({trackID: 'k$3CIdpxSr]2#kXxS3'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "trackID" set to value empty string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: '2kR]NT&b', offset: 'lP7RH$'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: '&cTA39', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: '4fg]nM', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: '*%1uqx^N!iT*)SfE', offset: 31.81}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: '@WTJJ', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'yOyETKI', amount: '!BAF^yG3ty'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'WJbuZch9@oQuF8E', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'u4I&6d', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'NS2SRBO]p', amount: 41.44}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'aYsOj&ORZNXt1dJxyVU', amount: 0}).expect(400);
					});
			});
		});
		describe('/root/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/id').query({id: 'R$@J&KLh'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/root/id').query({id: ''}).expect(400);
					});
			});
		});
		describe('/root/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/ids').query({ids: ['43uZKyq', 'Mx2Kbz']}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/root/ids').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/root/ids').query({ids: [null, '']}).expect(400);
					});
			});
		});
		describe('/root/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/search').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/root/search').query({offset: 'sp&(!ulG'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/root/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/root/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/root/search').query({offset: 6.27}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/root/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/root/search').query({amount: 'Z1[!7IWb'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/root/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/root/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/root/search').query({amount: 3.81}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/root/search').query({amount: 0}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/root/search').query({sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/root/search').query({sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/root/search').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/root/search').query({ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/root/search').query({ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/root/search').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/root/search').query({sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/root/search').query({sortDescending: 'F28tI7hgk9aHsW9Prn'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/root/search').query({sortDescending: 4028327593508866}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/root/search').query({sortDescending: -1223798393143297}).expect(400);
					});
			});
		});
		describe('/root/scan', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/scan').query({id: '1J[RW'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/root/scan').query({id: '1J[RW'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/root/scan').query({id: ''}).expect(400);
					});
			});
		});
		describe('/root/scanAll', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/scanAll').query({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/root/scanAll').query({}).expect(401);
					});
			});
		});
		describe('/root/status', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/status').query({id: 'QEwVlW!rQHDV'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/root/status').query({id: ''}).expect(400);
					});
			});
		});
		describe('/admin/settings', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/admin/settings').query({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/admin/settings').query({}).expect(401);
					});
			});
		});
		describe('/admin/queue/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/admin/queue/id').query({id: 'PO0xM@y@SPTEVq56'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/admin/queue/id').query({id: 'PO0xM@y@SPTEVq56'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/admin/queue/id').query({id: ''}).expect(400);
					});
			});
		});
		describe('/folder/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/download').query({id: ']f]Qvk([iPs5O'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/folder/download').query({id: ']f]Qvk([iPs5O'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/folder/download').query({id: '[m]oDZLCw6FB22nKNnb', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/folder/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/image').query({id: '1Ib@duLgzad6'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/folder/image').query({id: '&HpZSl@7ek$KB)', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/folder/image').query({id: '7eRr%uGa[nNXp5P8', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/folder/image').query({id: 'T3xP#&', size: 'b(pGJ1hL5kamJh'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/folder/image').query({id: '$ddk7', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/folder/image').query({id: 'k%j3CITk#J3#^z&', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/folder/image').query({id: 'vOBUv1ei', size: 560.92}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/folder/image').query({id: 'cX(CsdbL4p', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/folder/image').query({id: 'v^1ODi2b4&', size: 1025}).expect(400);
					});
			});
		});
		describe('/folder/artwork/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/artwork/image').query({id: 'LOv13Wv7kNWmiZ1'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/artwork/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'KuVAzg*]wbnrHy6v&sG5', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'DfLV6!LnFGIHyBFf', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'HEx93C]sQ', size: '*clo(L1I)54n5!nzxYn'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'E0nHCo5', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'd%2AgIO!0!R#f%GQ@N', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'rMHHyZxTm6vxtKSj', size: 379.61}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'lPIS2W', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'eo45NxWD$', size: 1025}).expect(400);
					});
			});
		});
		describe('/track/stream', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/stream').query({id: 'u[dA$URshbX'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/track/stream').query({id: 'u[dA$URshbX'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/stream').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value string', async () => {
						return get('/api/v1/track/stream').query({id: 'M%uXNV0E$tanY7D', maxBitRate: '@7hJPbkCh0Q'}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value empty string', async () => {
						return get('/api/v1/track/stream').query({id: 'tI]M4', maxBitRate: ''}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value boolean', async () => {
						return get('/api/v1/track/stream').query({id: 'tv6Yb@CD)]Q6$!C7W', maxBitRate: true}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value float', async () => {
						return get('/api/v1/track/stream').query({id: 's4jG0R8Rn9Jt', maxBitRate: 87.93}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value less than minimum 10', async () => {
						return get('/api/v1/track/stream').query({id: '8kBlQuQYdSYAi^', maxBitRate: 9}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/track/stream').query({id: 'UOjv0OK2tn', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/track/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/download').query({id: '$Ch*1KT#0NH'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/track/download').query({id: '$Ch*1KT#0NH'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/track/download').query({id: '!]R(b[a%p2x]*mPk', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/track/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/image').query({id: '2pg)lUMO^B%QDZP'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/track/image').query({id: '[@!FMS7Mo', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/track/image').query({id: 'TvxphUg)ZexPt', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/track/image').query({id: '%ZXjXs6G[DO', size: 'CcT8cpFy6Mhq'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/track/image').query({id: 'I8iG![', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/track/image').query({id: 'YZNja@rtv&mN(', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/track/image').query({id: '^X8cbz[D]F71Ua', size: 237.77}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/track/image').query({id: 'XIRdQ7G)DfPcUa&q9]go', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/track/image').query({id: 'HTkN(3V00uNVdU&R[', size: 1025}).expect(400);
					});
			});
		});
		describe('/episode/stream', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/stream').query({id: 'wNZhwXu(5p8F'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/episode/stream').query({id: 'wNZhwXu(5p8F'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/stream').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value string', async () => {
						return get('/api/v1/episode/stream').query({id: 't5Djx1pA%8I#J2n', maxBitRate: 'oiw^b(VQPent7*[M'}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value empty string', async () => {
						return get('/api/v1/episode/stream').query({id: 'Xp#8u7(', maxBitRate: ''}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value boolean', async () => {
						return get('/api/v1/episode/stream').query({id: 'kD5#V(0', maxBitRate: true}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value float', async () => {
						return get('/api/v1/episode/stream').query({id: '@q#(Am8nT8hQItTKC', maxBitRate: 96.76}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value less than minimum 10', async () => {
						return get('/api/v1/episode/stream').query({id: 'BQ*uWhM(71qHfY', maxBitRate: 9}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/episode/stream').query({id: 'pGj@3M', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/episode/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/download').query({id: '(VPQuCulR]^8u'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/episode/download').query({id: '(VPQuCulR]^8u'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/episode/download').query({id: 'nZds]', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/episode/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/image').query({id: 'QE&f$(s3tQkkmyOZZR'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/episode/image').query({id: 'e$r2TJs3', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/episode/image').query({id: 'G@[YA[bD*(j(LwVvLKwL', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/episode/image').query({id: 'LxZj%QjBcBy(PZ%00&Xp', size: 'cXmYN'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/episode/image').query({id: 'A%c6!50^iwpr5Gbh', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/episode/image').query({id: 'qk4P1FI$tGJL$L', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/episode/image').query({id: '!YH8jShO%tw', size: 831.87}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/episode/image').query({id: 'q@JLbuGItmosai#', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/episode/image').query({id: 'fC0h[tu!aJ', size: 1025}).expect(400);
					});
			});
		});
		describe('/podcast/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/image').query({id: 'YOt1d4vD7ZjAq'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/podcast/image').query({id: 'tD)BF^4vOdOGlMS2', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/podcast/image').query({id: '85sG(!w72gHl', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/podcast/image').query({id: ']Lw&UPLHM3JZe', size: 'tSETdb&bovp5f8hv&3)'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/podcast/image').query({id: 'dqJ)V#Tzatp8PuEN4W@', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/podcast/image').query({id: '%tbXR%4%pr*GvC2Lc', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/podcast/image').query({id: '3QG*^&cAz#**md5W1q', size: 681.25}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/podcast/image').query({id: 'P60WY2)zb4', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/podcast/image').query({id: 'jbabnj1&ym[U02oB4uW', size: 1025}).expect(400);
					});
			});
		});
		describe('/podcast/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/download').query({id: ')eJ&qf$VZkLW(^cFv'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/podcast/download').query({id: ')eJ&qf$VZkLW(^cFv'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/podcast/download').query({id: '(n]A$[L9XH', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/artist/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/image').query({id: ']ZyZr7wKZ4'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/artist/image').query({id: '@]m!pgUz^D3)eZTVoid', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/artist/image').query({id: 'QhFzf5', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/artist/image').query({id: '6dvwHve', size: 'jQ]Bk0K]vVLL#2u$Nf('}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/artist/image').query({id: 'T&EzH%sj5PE7o', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/artist/image').query({id: 'smI*(OiZco', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/artist/image').query({id: 's)$VX', size: 335.78}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/artist/image').query({id: 'I&$CXc', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/artist/image').query({id: 'X]XcJR*Q7', size: 1025}).expect(400);
					});
			});
		});
		describe('/artist/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/download').query({id: '(0[Ip'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/artist/download').query({id: '(0[Ip'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/artist/download').query({id: 'diEvJcmzl', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/album/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/image').query({id: 'ItMPrP](u)iM0@0ZR'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/album/image').query({id: 'htXv%mQuEka', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/album/image').query({id: '6leVNYSt*^B', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/album/image').query({id: ']lQDXX4ZPnj(ZB@', size: 'AML$LL!qO43'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/album/image').query({id: 'ITte58q^', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/album/image').query({id: 'UJb7a', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/album/image').query({id: '8XnhUZAtm', size: 667.84}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/album/image').query({id: 'nv0EuIx#JUNO', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/album/image').query({id: 'KEFMuK!hL[Gd', size: 1025}).expect(400);
					});
			});
		});
		describe('/album/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/download').query({id: '@2!mS312x^m'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/album/download').query({id: '@2!mS312x^m'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/album/download').query({id: 'e8v^O9', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/playlist/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/image').query({id: 'qS6EvpX&R2^R1'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/playlist/image').query({id: 'z*TrdAecDo', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/playlist/image').query({id: 'x$t7Ru', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/playlist/image').query({id: '!Ae@k!Xa', size: 'Yu3(a)d'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/playlist/image').query({id: 'Od9AB&)dg@F7d![n', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/playlist/image').query({id: 'TuBnlGQF', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/playlist/image').query({id: 'u86urdUCg)kXbcBY(', size: 740.95}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/playlist/image').query({id: '0RJseBYoYun(hB', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/playlist/image').query({id: '^U&gYvVVCR[)hX7', size: 1025}).expect(400);
					});
			});
		});
		describe('/playlist/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/download').query({id: 's1&uNzrTkHV!*Zh5'}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/playlist/download').query({id: 's1&uNzrTkHV!*Zh5'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/playlist/download').query({id: 'H$k1X', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/user/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/user/image').query({id: 'lkN4sCh*'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/user/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/user/image').query({id: 'rtE2CrjrGyEoCJIKpyi', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/user/image').query({id: 'MU@bDR44S(qP', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/user/image').query({id: '@cQZ1KFY[8N3H9&Ud', size: 'd!KVf17^G]sAl#rkO'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/user/image').query({id: 'ga$p^sYfdayxWjuMsf', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/user/image').query({id: 'rrDInvyTV', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/user/image').query({id: 'a3[vU0', size: 766.15}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/user/image').query({id: 'r6A3hUg*fTsJG6x(7]pO', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/user/image').query({id: 'GN&UtZ*0bcecB5YH3Fkr', size: 1025}).expect(400);
					});
			});
		});
		describe('/root/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/image').query({id: '3kaq8!IqN7RDIlw)4'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/root/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/root/image').query({id: 'VdY2fW', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/root/image').query({id: '$Kwf)S[Re[', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/root/image').query({id: 'gxFV85', size: 'VCuNGMWvZ6KB['}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/root/image').query({id: 'jAMUUuWRspr^K&#o!klB', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/root/image').query({id: 'O!18dbuAF7zDIMM', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/root/image').query({id: 'RknKuWB6[q4i', size: 143.25}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/root/image').query({id: '5goX&SvxI[noK(Fhc', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/root/image').query({id: 'ubBpe&US%W7Xmm', size: 1025}).expect(400);
					});
			});
		});
		describe('/image/{id}-{size}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/image/!3iGpe%23seolp)r8N2%5E-776.tiff').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/image/N8(LRQ-401.').expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/image/%24sVs2p-345.invalid').expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/image/rzG31S%24%24Kk2(%40M%5E%26-Jk%5DdA4Ip%24Ip5SxnB5K.tiff').expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/image/fn048n(-.jpg').expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/image/)%26dlD2Lq9F%25IefMz-true.jpeg').expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/image/rqD(B-702.02.jpeg').expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/image/kZ38Fev0(%25I-15.jpg').expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/image/%5Bvb7U%23ihj-1025.jpg').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/image/-683.png').expect(400);
					});
			});
		});
		describe('/image/{id}-{size}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/image/(*Pm7p%237Ii8Qk-541').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/image/%5BLU3Cyo-W!!b4EWtVG').expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/image/g)AE2GFmY%25%24j1!E-').expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/image/D4itU-true').expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/image/OODvdF%23%40dUg%23)-950.27').expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/image/hXaeRD%5Bx5n%25-15').expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/image/p%24%5D682Ch9%5D-1025').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/image/-563').expect(400);
					});
			});
		});
		describe('/image/{id}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/image/1v)qtPw(HDP%23U.jpeg').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/image/8*rE4*gnzCEh)aaZHz.').expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/image/F1)I7X%23y*Na6KlRtie%24.invalid').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/image/.jpeg').expect(400);
					});
			});
		});
		describe('/image/{id}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/image/inQUJbcx7AgdPr%5En').expect(401);
					});
			});
		});
		describe('/stream/{id}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/stream/jbaq%24Fulc8tSY%402YHWHG.mp3').expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/stream/jbaq%24Fulc8tSY%402YHWHG.mp3').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/stream/o4rQjHmzUit2f%5E%25wX.invalid').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/stream/.mp3').expect(400);
					});
			});
		});
		describe('/stream/{id}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/stream/UJsOe%40m!%25ffCBng%26pqR7').expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/stream/UJsOe%40m!%25ffCBng%26pqR7').expect(401);
					});
			});
		});
		describe('/waveform/{id}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/waveform/szsw%24S2%25x0*z!jm1%267V.svg').expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/waveform/szsw%24S2%25x0*z!jm1%267V.svg').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/waveform/SEb%26ts%5E8%243%5B.invalid').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/waveform/.dat').expect(400);
					});
			});
		});
		describe('/download/{id}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/download/jB6%24jN').expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/download/jB6%24jN').expect(401);
					});
			});
		});
		describe('/download/{id}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/download/8ZVXZ2nbg7s*6IrD4.tar').expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return getNoRights('/api/v1/download/8ZVXZ2nbg7s*6IrD4.tar').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/download/lOnkIe2%24%5EahbD.invalid').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/download/.zip').expect(400);
					});
			});
		});
		describe('/logout', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/logout').send({}).expect(401);
					});
			});
		});
		describe('/bookmark/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/bookmark/create').send({}).expect(401);
					});
			});
		});
		describe('/bookmark/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/bookmark/delete').send({}).expect(401);
					});
			});
		});
		describe('/bookmark/byTrack/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/bookmark/byTrack/delete').send({}).expect(401);
					});
			});
		});
		describe('/chat/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/chat/create').send({}).expect(401);
					});
			});
		});
		describe('/chat/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/chat/delete').send({}).expect(401);
					});
			});
		});
		describe('/radio/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/radio/create').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/radio/create').send({}).expect(401);
					});
			});
		});
		describe('/radio/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/radio/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/radio/update').send({}).expect(401);
					});
			});
		});
		describe('/radio/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/radio/delete').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/radio/delete').send({}).expect(401);
					});
			});
		});
		describe('/track/fav/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/fav/update').send({}).expect(401);
					});
			});
		});
		describe('/track/rate/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/rate/update').send({}).expect(401);
					});
			});
		});
		describe('/track/rawTag/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/rawTag/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/track/rawTag/update').send({}).expect(401);
					});
			});
		});
		describe('/track/name/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/name/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/track/name/update').send({}).expect(401);
					});
			});
		});
		describe('/track/parent/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/parent/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/track/parent/update').send({}).expect(401);
					});
			});
		});
		describe('/track/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/delete').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/track/delete').send({}).expect(401);
					});
			});
		});
		describe('/track/fix', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/fix').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/track/fix').send({}).expect(401);
					});
			});
		});
		describe('/folder/artworkUpload/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artworkUpload/create').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/folder/artworkUpload/create').send({}).expect(401);
					});
			});
		});
		describe('/folder/artworkUpload/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artworkUpload/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/folder/artworkUpload/update').send({}).expect(401);
					});
			});
		});
		describe('/folder/artwork/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artwork/create').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/folder/artwork/create').send({}).expect(401);
					});
			});
		});
		describe('/folder/artwork/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artwork/delete').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/folder/artwork/delete').send({}).expect(401);
					});
			});
		});
		describe('/folder/artwork/name/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artwork/name/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/folder/artwork/name/update').send({}).expect(401);
					});
			});
		});
		describe('/folder/name/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/name/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/folder/name/update').send({}).expect(401);
					});
			});
		});
		describe('/folder/fav/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/fav/update').send({}).expect(401);
					});
			});
		});
		describe('/folder/rate/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/rate/update').send({}).expect(401);
					});
			});
		});
		describe('/folder/parent/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/parent/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/folder/parent/update').send({}).expect(401);
					});
			});
		});
		describe('/folder/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/delete').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/folder/delete').send({}).expect(401);
					});
			});
		});
		describe('/folder/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/create').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/folder/create').send({}).expect(401);
					});
			});
		});
		describe('/album/fav/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/album/fav/update').send({}).expect(401);
					});
			});
		});
		describe('/album/rate/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/album/rate/update').send({}).expect(401);
					});
			});
		});
		describe('/artist/fav/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/artist/fav/update').send({}).expect(401);
					});
			});
		});
		describe('/artist/rate/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/artist/rate/update').send({}).expect(401);
					});
			});
		});
		describe('/episode/fav/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/episode/fav/update').send({}).expect(401);
					});
			});
		});
		describe('/episode/rate/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/episode/rate/update').send({}).expect(401);
					});
			});
		});
		describe('/podcast/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/podcast/create').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/podcast/create').send({}).expect(401);
					});
			});
		});
		describe('/podcast/fav/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/podcast/fav/update').send({}).expect(401);
					});
			});
		});
		describe('/podcast/rate/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/podcast/rate/update').send({}).expect(401);
					});
			});
		});
		describe('/podcast/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/podcast/delete').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/podcast/delete').send({}).expect(401);
					});
			});
		});
		describe('/playlist/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/playlist/create').send({}).expect(401);
					});
			});
		});
		describe('/playlist/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/playlist/update').send({}).expect(401);
					});
			});
		});
		describe('/playlist/fav/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/playlist/fav/update').send({}).expect(401);
					});
			});
		});
		describe('/playlist/rate/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/playlist/rate/update').send({}).expect(401);
					});
			});
		});
		describe('/playlist/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/playlist/delete').send({}).expect(401);
					});
			});
		});
		describe('/playqueue/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/playqueue/update').send({}).expect(401);
					});
			});
		});
		describe('/playqueue/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/playqueue/delete').send({}).expect(401);
					});
			});
		});
		describe('/user/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/user/create').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/user/create').send({}).expect(401);
					});
			});
		});
		describe('/user/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/user/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/user/update').send({}).expect(401);
					});
			});
		});
		describe('/user/password/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/user/password/update').send({}).expect(401);
					});
			});
		});
		describe('/user/email/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/user/email/update').send({}).expect(401);
					});
			});
		});
		describe('/user/imageUpload/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/user/imageUpload/update').send({}).expect(401);
					});
			});
		});
		describe('/user/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/user/delete').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/user/delete').send({}).expect(401);
					});
			});
		});
		describe('/root/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/root/create').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/root/create').send({}).expect(401);
					});
			});
		});
		describe('/root/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/root/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/root/update').send({}).expect(401);
					});
			});
		});
		describe('/root/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/root/delete').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/root/delete').send({}).expect(401);
					});
			});
		});
		describe('/admin/settings/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/admin/settings/update').send({}).expect(401);
					});
			});
			describe('should fail without required rights', () => {
					it('should respond with 401 Unauth', async () => {
						return postNoRights('/api/v1/admin/settings/update').send({}).expect(401);
					});
			});
		});
	},
	async () => {
		await server.stop();
	});
});

