import supertest from 'supertest';
import {testEngines} from '../engine/engine.spec';
import {mockUserName, mockUserPass} from '../engine/user/user.mock';
import {Server} from './server';

describe('Server', () => {
	jest.setTimeout(30000);
	let server: Server;
	let token: string;
	let request: supertest.SuperTest<supertest.Test>;
	let get: (apiPath: string) => supertest.Test;
	let post: (apiPath: string) => supertest.Test;
	let getNotLoggedIn: (apiPath: string) => supertest.Test;
	let postNotLoggedIn: (apiPath: string) => supertest.Test;
	let getNoRights: (apiPath: string) => supertest.Test;
	let postNoRights: (apiPath: string) => supertest.Test;
	testEngines({}, async (testEngine) => {
		testEngine.engine.config.server.port = 10010;
		testEngine.engine.config.server.listen = 'localhost';
		server = new Server(testEngine.engine);
		await server.start();
		request = supertest('http://localhost:10010');
		const res = await request.post('/api/v1/login')
			.send({username: mockUserName, password: mockUserPass, client: 'supertest-tests'});
		token = res.body.jwt;
		get = (apiPath) => request.get(apiPath).set('Authorization', 'Bearer ' + token);
		getNotLoggedIn = (apiPath) => request.post(apiPath);
		post = (apiPath) => request.post(apiPath).set('Authorization', 'Bearer ' + token);
		postNotLoggedIn = (apiPath) => request.post(apiPath);
	}, () => {
		describe('/lastfm/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/lastfm/lookup').query({type: 'artist', id: 'DNy8r4F%F@HUwimlfwkf'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/lastfm/lookup').query({type: '', id: 'jha(5%R2gjr0KXjsd'}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/lastfm/lookup').query({type: 'invalid', id: 'GZ2iizMsaYJ%*o'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/lastfm/lookup').query({type: 'track', id: ''}).expect(400);
					});
			});
		});
		describe('/acoustid/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/acoustid/lookup').query({id: 'OQHbu^bCIRg!uz'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/acoustid/lookup').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "inc" set to value empty string', async () => {
						return get('/api/v1/acoustid/lookup').query({id: 'FeVJf', inc: ''}).expect(400);
					});
			});
		});
		describe('/musicbrainz/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/musicbrainz/lookup').query({type: 'series', id: 'Z$[zqzaRhELt*'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/lookup').query({type: '', id: '9EUNc!Nu5!'}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/musicbrainz/lookup').query({type: 'invalid', id: '7KyNZ2gJ^'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/lookup').query({type: 'release-group', id: ''}).expect(400);
					});
					it('should respond with 400 with "inc" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/lookup').query({type: 'artist', id: 'FjfN2Wt', inc: ''}).expect(400);
					});
			});
		});
		describe('/musicbrainz/search', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/musicbrainz/search').query({type: 'label'}).expect(401);
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
						return get('/api/v1/musicbrainz/search').query({type: 'release', recording: ''}).expect(400);
					});
					it('should respond with 400 with "releasegroup" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'recording', releasegroup: ''}).expect(400);
					});
					it('should respond with 400 with "release" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'release', release: ''}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'recording', artist: ''}).expect(400);
					});
					it('should respond with 400 with "tracks" set to value string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'release', tracks: 'sLLOfRqraq$9a0&e61'}).expect(400);
					});
					it('should respond with 400 with "tracks" set to value empty string', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'artist', tracks: ''}).expect(400);
					});
					it('should respond with 400 with "tracks" set to value boolean', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'release', tracks: true}).expect(400);
					});
					it('should respond with 400 with "tracks" set to value float', async () => {
						return get('/api/v1/musicbrainz/search').query({type: 'release-group', tracks: 90.37}).expect(400);
					});
			});
		});
		describe('/acousticbrainz/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/acousticbrainz/lookup').query({id: '^(k^SS#dcTTHS]Vo'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/acousticbrainz/lookup').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "nr" set to value string', async () => {
						return get('/api/v1/acousticbrainz/lookup').query({id: 'ZXk$U0MDW', nr: 'U&o$#NE#99Q'}).expect(400);
					});
					it('should respond with 400 with "nr" set to value empty string', async () => {
						return get('/api/v1/acousticbrainz/lookup').query({id: 'bYNTF0', nr: ''}).expect(400);
					});
					it('should respond with 400 with "nr" set to value boolean', async () => {
						return get('/api/v1/acousticbrainz/lookup').query({id: 'xKqqezgBADZNA[e', nr: true}).expect(400);
					});
			});
		});
		describe('/coverartarchive/lookup', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/coverartarchive/lookup').query({type: 'release', id: 'qUz]tsZjla)#SEe'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/coverartarchive/lookup').query({type: '', id: 't)#9Z1ag[*H7wkp'}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/coverartarchive/lookup').query({type: 'invalid', id: '7DQPvPMAXNRPZzF$'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/coverartarchive/lookup').query({type: 'release-group', id: ''}).expect(400);
					});
			});
		});
		describe('/wikipedia/summary', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/wikipedia/summary').query({title: 'S#zcrQr2^2mu85!7s82e'}).expect(401);
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
						return getNotLoggedIn('/api/v1/wikidata/summary').query({id: 'Sg9gffL03ClJ^N'}).expect(401);
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
						return getNotLoggedIn('/api/v1/wikidata/lookup').query({id: 'lCP!f**kh7)mCn!x'}).expect(401);
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
						return getNotLoggedIn('/api/v1/autocomplete').query({query: 'ZE&xCuYZkZRmKp3!'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: ''}).expect(400);
					});
					it('should respond with 400 with "track" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: 'GmCWNUi6KCxLb0EpJJm', track: 'KTV@oW!1cJA0V'}).expect(400);
					});
					it('should respond with 400 with "track" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'dUeL5os', track: ''}).expect(400);
					});
					it('should respond with 400 with "track" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'f%n5c7P6qMKkP', track: true}).expect(400);
					});
					it('should respond with 400 with "track" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: '$2Hxweo', track: 62.11}).expect(400);
					});
					it('should respond with 400 with "track" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'k[uyQpXAK8oBav&b', track: -1}).expect(400);
					});
					it('should respond with 400 with "artist" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: 'eEp3za5qWe6ciG', artist: 'pXrpqX9nmXMrukh'}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'Qm$F]qzdYFWSB7shS', artist: ''}).expect(400);
					});
					it('should respond with 400 with "artist" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'DQyl^&X)toiux', artist: true}).expect(400);
					});
					it('should respond with 400 with "artist" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: 'kkrn0auv[', artist: 59.74}).expect(400);
					});
					it('should respond with 400 with "artist" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'Fdl)4', artist: -1}).expect(400);
					});
					it('should respond with 400 with "album" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: 'QPVlWmsTZH1', album: 'uB!lX2qY'}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'RIS*J$CoJ6WPg&N(8', album: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: ')M9tr(x55whL^KfZR', album: true}).expect(400);
					});
					it('should respond with 400 with "album" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: '47X(5q44bb5Q', album: 59.32}).expect(400);
					});
					it('should respond with 400 with "album" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'ZFjLdZ8itt*y0nL', album: -1}).expect(400);
					});
					it('should respond with 400 with "folder" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: '!9$hKyuZE$cFE**gr', folder: 'DJV1hqSYhaq%5'}).expect(400);
					});
					it('should respond with 400 with "folder" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'RJvWZ(YvXJ', folder: ''}).expect(400);
					});
					it('should respond with 400 with "folder" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'yZQDc8L', folder: true}).expect(400);
					});
					it('should respond with 400 with "folder" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: 's^0lU^D[YNb((Y', folder: 10.72}).expect(400);
					});
					it('should respond with 400 with "folder" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'nofSV', folder: -1}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: '46sd3p1c', playlist: 'DgUS]'}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'CiEK$n*La^lkt', playlist: ''}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'Mn3qElaRvgg', playlist: true}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: 'd02gCYdrUIm^kh', playlist: 66.85}).expect(400);
					});
					it('should respond with 400 with "playlist" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: '1zh)KK6(Ljk', playlist: -1}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: '23QSKcEB', podcast: 'w)^BFSSn'}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 't#P*nWu&Jn#Zqv7U', podcast: ''}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'ki(ynbVG6gCqe&&tgIFT', podcast: true}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: '$nu9DN5UeFw(J', podcast: 81.96}).expect(400);
					});
					it('should respond with 400 with "podcast" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: '5m2z4qDsA]6amZ', podcast: -1}).expect(400);
					});
					it('should respond with 400 with "episode" set to value string', async () => {
						return get('/api/v1/autocomplete').query({query: 'Dau3!$wX5c', episode: 'yP0bfuXMYPtIHjD'}).expect(400);
					});
					it('should respond with 400 with "episode" set to value empty string', async () => {
						return get('/api/v1/autocomplete').query({query: 'INFQ%X1FHyBpc1', episode: ''}).expect(400);
					});
					it('should respond with 400 with "episode" set to value boolean', async () => {
						return get('/api/v1/autocomplete').query({query: 'qf9F@', episode: true}).expect(400);
					});
					it('should respond with 400 with "episode" set to value float', async () => {
						return get('/api/v1/autocomplete').query({query: '(@vsubb82^CE&m8L(g5', episode: 95.64}).expect(400);
					});
					it('should respond with 400 with "episode" set to value less than minimum 0', async () => {
						return get('/api/v1/autocomplete').query({query: 'dt1$PBcP5', episode: -1}).expect(400);
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
						return get('/api/v1/genre/list').query({offset: 'eK%ge['}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/genre/list').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/genre/list').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/genre/list').query({offset: 57.32}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/genre/list').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/genre/list').query({amount: 'MB)EFcxEvk'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/genre/list').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/genre/list').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/genre/list').query({amount: 84.46}).expect(400);
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
						return get('/api/v1/nowPlaying/list').query({offset: 'mYSn8AH0'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/nowPlaying/list').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/nowPlaying/list').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/nowPlaying/list').query({offset: 93.6}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/nowPlaying/list').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/nowPlaying/list').query({amount: '79^Wj!FSR2'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/nowPlaying/list').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/nowPlaying/list').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/nowPlaying/list').query({amount: 19.33}).expect(400);
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
						return get('/api/v1/chat/list').query({since: 'ue*iz!cM%J3'}).expect(400);
					});
					it('should respond with 400 with "since" set to value empty string', async () => {
						return get('/api/v1/chat/list').query({since: ''}).expect(400);
					});
					it('should respond with 400 with "since" set to value boolean', async () => {
						return get('/api/v1/chat/list').query({since: true}).expect(400);
					});
					it('should respond with 400 with "since" set to value float', async () => {
						return get('/api/v1/chat/list').query({since: 24.27}).expect(400);
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
						return get('/api/v1/folder/index').query({level: '08NEFSC'}).expect(400);
					});
					it('should respond with 400 with "level" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({level: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value boolean', async () => {
						return get('/api/v1/folder/index').query({level: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/folder/index').query({newerThan: 'VChr6kl9N8UfQQBhtPuh'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/folder/index').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/folder/index').query({newerThan: 20.65}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/index').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/folder/index').query({fromYear: 'O*E0K@gFRXgJ5'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/folder/index').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/folder/index').query({fromYear: 74.54}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/index').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/folder/index').query({toYear: '0tWoH8ALYN(]6'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/folder/index').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/folder/index').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/folder/index').query({toYear: 1.58}).expect(400);
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
						return get('/api/v1/folder/index').query({sortDescending: ']KO5NPnH&GJy9I'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/folder/index').query({sortDescending: 612130172698626}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/folder/index').query({sortDescending: -4274057570680833}).expect(400);
					});
			});
		});
		describe('/folder/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/id').query({id: '0o#v%HrFgk25ZHPbUj*z'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'uC!(zf399%*N7tf@B', folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'SkjKTv1aD', folderTag: 'vbN9UON]^O&xN'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '(a(5]H2QPqe3*PbMmRTK', folderTag: 4636586805297154}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'vJlc*0Y3e6xT3', folderTag: -2018445570867201}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'KH*BW', folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 't!*pcsGGA41QhqbZr!e', folderState: 'jJi0q*o&eZC(S(vG'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '2W3LI5sH#kICDKs', folderState: -555718818136062}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: '5#7VJ', folderState: 4536005856067583}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'C4jrK03t', folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'iq!Ijcg&(', folderCounts: ')160Je9LlJ6#'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'OOt83l8HUEgdSVY*', folderCounts: 2107957642788866}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: ')!TilMZfw&xk5zBKW', folderCounts: 8453114591969279}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'ww$EL]IdIlmVsB1C5R', folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'bryyFh!2QFcEjwbii', folderParents: 'FpXVhYsO0%LoJN'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'Zk2Y8t', folderParents: -4456184350244862}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'C7Vw3!JaJ)m9854PsX^i', folderParents: -3496696998789121}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '5l4kROLPD%QnG9', folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 's[OiscJthVvw', folderInfo: 'Oi(xwYGR3u7'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'K4r72U*2quS(QMd', folderInfo: -86428650307582}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'B%vUzrO', folderInfo: 4536148256882687}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '2qPP)7N%n', folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'eE#iG5v[*b', folderSimilar: '!qFez$QyHQU'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'QdG2@2PJYZ@94v6P#', folderSimilar: -2293339504246782}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: '#H9YWL', folderSimilar: 78565571821567}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '4S6j*iwyVd', folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: '5f6*^y5%mbbLm&O(', folderArtworks: 'fOGCKmzmrW8fx$$d53'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'i6BfWKw[(8McKfM*i$P', folderArtworks: 3755657618522114}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: '0ad*yhPy2fkk', folderArtworks: 2572730641678335}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'sEuHv', folderChildren: ''}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'H^HXe2iS28PmJeku', folderChildren: '8bW]XgR'}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'pw0tykO&CP)Tgl&Pe', folderChildren: 7614906606026754}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'M*3fUG5](', folderChildren: 5959409612095487}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '%1c*yb8nqy!#H', folderSubfolders: ''}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: '(]D)yciW*O8iR)', folderSubfolders: 'yDDxAQ!FeP*fDuY4z'}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'IHotypSNI*FMP8', folderSubfolders: 5520883644891138}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'v!dN1W', folderSubfolders: -1841326974828545}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'USiwd2^f[bsLE$26Oa]&', folderTracks: ''}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: ')1E!vVC*Bv]rqm@*J', folderTracks: '@x$!(FEg!LeEpbCq'}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '#p5Lym', folderTracks: 4379375516516354}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'SNA*gOgIWlO]QR@0NIpI', folderTracks: -2672526090043393}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'aYH5v', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: ')Z8d&&(fEwVPB4CW5EYO', trackMedia: 'Dm1Ivq]'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '8JgKd@V1&8NVAb72y', trackMedia: 8008677277564930}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'oYJfD', trackMedia: 8508184008327167}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: 'tn0gcVXnf8Nmt*#$j', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'zSBjFF*&0k4', trackTag: 'HaRktuA[iws@XLZ'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'c4Vz#VczxC3A7IaQkZGi', trackTag: -2144315627274238}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'lDBDy#yb&G#2JigQi', trackTag: -7008820362477569}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '2Hk#XMG7UvJ9T^XfU', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: '0MNd24XVR(2Z%apGM', trackRawTag: 'Vd^pqAhM$m1VkyfbDhp'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: '$$%[i7n#y&', trackRawTag: -3573076935573502}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'CbMoqOyONMpswxoyP3%0', trackRawTag: -3682030105657345}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/id').query({id: '6Y(FwSXYS6(65dJr]dH$', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/id').query({id: 'SpHXOO5WtKG4*jdUgx', trackState: 'X2nlo&CrQtS'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/id').query({id: 'gX3Xo@wkf3d)2orI**', trackState: 5646564311695362}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/id').query({id: 'FReuL%BY', trackState: 2480645636882431}).expect(400);
					});
			});
		});
		describe('/folder/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/ids').query({ids: ['ifYIhdO', 'h&rYBWG']}).expect(401);
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
						return get('/api/v1/folder/ids').query({ids: ['kX6REcMxrndgUGD1FC^', '6d^xYHD^4epFxb3j'], folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['#HA($', 'a]J9mDrFNzwqApiE72a'], folderTag: '&Cm!BS)f$hikZv0b9U^'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['[ZYSbEm#OR1Z(kL', 'R1P[o2ho15Jf$R'], folderTag: -3752651942526974}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['LMCk[lHM', 'c!U2QNHY9[N1xf6L!c'], folderTag: -2728125150527489}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['sLpJ)NDZdpKE3Tx64u', 'cH#^5#8'], folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['cS)%bP(5ah', '(WO3iiq0#k4W'], folderState: 'UbUA8Mf5cvGyh[m'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['&c@iE4oQGZO6#hMEfpE', '8J9vYe'], folderState: 3148329374449666}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['CiCA!e7u1XInl))n(os', 'CLlRa6z]f*0$3Y7'], folderState: -1789933517799425}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['XSzAgw', 'HAP$i'], folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['WGNe)PyvLV0mxO', 'TO%qe4P7dbN)usV&X'], folderCounts: '#l)EyOT'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['[EO3ayj2uYLyl', '&ret9h9]JCE%!S1rd'], folderCounts: -1003783161118718}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['5JMH3mo%mnDf*', 'zhMSsqreWlCQANqT8m'], folderCounts: 6600059089059839}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['1kK@j2JZHv!', '4V%BgAt3Ge(@v%4D)%wH'], folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['tPjk]AOZvo9iN', 'v(@[*E5Yf4bk1XjcAo6'], folderParents: 'BnxCjzm'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['^mI*jf', 'DagIbwM'], folderParents: -7415492599873534}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['Q]vVq', 'ElaXmISF9ZvFNbG3'], folderParents: -5379216375808001}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['#w]Hrv0', 'UB@NY712^G'], folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['qIysC', 'JKQ!VpQ'], folderInfo: 'Xb1tA%#@DVtfo'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['dvZZu%PI[S&6cEMPq7', 'M@j2iC2'], folderInfo: -308586655776766}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['u7kynwg@', '#vd)$r]!I8cK'], folderInfo: 2455125398388735}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['@8IZ&!K!kg4l1eLz*MI', 'wyMoHV9q2x'], folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['NI0BrB3uHhM', '9927h#W[6qA8!Qx]'], folderSimilar: 'UsjIQp'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['h(IiaVn@47JQ%', 'YzJcej!DVj#slSRCmR'], folderSimilar: -3648410615807998}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['(NxZA', '17[p6SfJjBc!gmYhi'], folderSimilar: -5769881446252545}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['j1RfAT$RRs[Ijd', '!t1j2J5M8V('], folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['*!tZp9!lo0yh2h', 'Gl^KS4'], folderArtworks: 'knw^1N'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['udD%uX', 'ocs3dCflunQ$Jb2'], folderArtworks: 6987237807882242}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: [')c3jtqN(', '2L$nQ'], folderArtworks: -749989055692801}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['u7Lvz[VGV6@EOfyK', '4J!K)(HhI&@exe'], folderChildren: ''}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['WYZfh[FBP8K0', '3GziJ20rQZkTt'], folderChildren: '0tYkDYNzC'}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['mQat)OOARO#5)', '$MaIpr'], folderChildren: 3255674154778626}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['c]M@her)(KlUoy&q1kvP', 'E2ON*O#'], folderChildren: -980180453556225}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['P2ony!BmCAwg*KMO*7', '&(iO)4BVM$B'], folderSubfolders: ''}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['tMVW^mLY4#kWUm3nX^', 'OMnrT7]6v'], folderSubfolders: 'e1wNG)$SH'}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['k6Baw!0e5EbFNv', 'BhiQ*'], folderSubfolders: 909107326353410}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['Fh0nQOL7@&', 'icgJRm%gDv7'], folderSubfolders: -2320428349521921}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['8ihx#ShY9f)2GI@5Q9D', 'LcNQ7T@X0]EHzThTj6VR'], folderTracks: ''}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['T9!4wIasR4@BTD', 'Ziv8N54@v'], folderTracks: 'LhfqAe5IHI%P'}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['jufdA]', 'buIpyyQiD#!1D439jvd7'], folderTracks: -8100561756880894}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['ZbJ55Kfyv]Z', '!*$3pS'], folderTracks: -1620129083293697}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['OsMeIZZ18sZ[oxNli', 'tj4kQ$]r'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['SYFvqi2l', 'BkTqGShxdhT9'], trackMedia: '37yd6M@QykofUTH'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['Mr8!Va5[rgUj[iE', 'Fj9#uYZXd9C9iz'], trackMedia: 7148075533467650}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['QFHY^ZWrboiBDg$', '8vbf#x)OooJr@9qEdS'], trackMedia: -4810918168887297}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['rEBrH4@P^)Uc', 'Xyu8Usa'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['^[UJrmkoc6mbmS7Vv', 'ys&9m!Gs8^U5VYa8'], trackTag: '9LG%]g7qBw(RA'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['a%@$4rIm', 'Co^d9pe#'], trackTag: 4046542516256770}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['DKAas5QY1Uc!4xZSK', 't&1HDB*'], trackTag: -7383882596876289}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['(d)6CQbdpld', ']ySgDExPuAEtiGXsf'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['Hh7[k$kgQ31C', '1cP)g4S]p'], trackRawTag: '5JCPimus9tS)4%'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: ['cG$l8', 'qczzhx&f)E'], trackRawTag: -2494230379364350}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['vhKnLw414FtVaA]', 'WB2Ez^'], trackRawTag: -8789239365894145}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['5)PF#OuJ', 'cSLPXeyE@LKhiLH9I^v'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/ids').query({ids: ['(VHA^tD', 'm&QZ1!'], trackState: 'ZMkypy)Lfv0TUP[66ANW'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/ids').query({ids: [']dt8aS*P4yCn[kja8v%c', 'K@srA3z'], trackState: 8192427613487106}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/ids').query({ids: ['5!%#!kJNjXlr#U8[Yu*e', 'Jm)221qS1hk*dUjamU'], trackState: 4170538662494207}).expect(400);
					});
			});
		});
		describe('/folder/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/tracks').query({ids: ['^25PW6', 'T!EG@']}).expect(401);
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
						return get('/api/v1/folder/tracks').query({ids: ['X#Cz)w3NumO!Y', 'La4*CfS!B'], recursive: ''}).expect(400);
					});
					it('should respond with 400 with "recursive" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['k((&&!56', '%n69m[4]Q61e!'], recursive: 'p[6TcYesT'}).expect(400);
					});
					it('should respond with 400 with "recursive" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['Ed9TO', '1J]W^z(YuJiF'], recursive: 4500826072547330}).expect(400);
					});
					it('should respond with 400 with "recursive" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['IY$14J', ']LXYmklo5#u!U)pRpj'], recursive: 1000248000380927}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['GjSlA0HyIYSRv(AKhNUI', 'BiKU^PQg4p!zr#(@J'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['@29J)*4', 'qCVfYb'], trackMedia: '0Z*)[k)y^*whB46^k!#'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['5jYgY', ']n7MB'], trackMedia: -550523841282046}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['L[mE5Y0I*lGfQyMMW&', '4FijcC@e'], trackMedia: -31736725504001}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['U(iS0C0qS', 'qo9ra9r0j1j'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['*XV*L&x%IGZ', 'c!Smd4e*S#baX'], trackTag: 'JM#dZI0^C'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['Q%T^0GeEG', 'I)ExihnOO2LVC]'], trackTag: -8896244785086462}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['Wkl3P', 'O1D*$'], trackTag: -8279765123334145}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['YLRGYwJ0SC3pZ3jqG', 'yrVXZYMuRhKkA'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['fc8x@hgxf[9', 'xv9%x4XUglDMWV*wH'], trackRawTag: '&07[3u2mSES['}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['b^&OPU@VbI%0ED', 'it^)EGRA'], trackRawTag: -4298408428830718}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['vYyVDOoj', 'i9ylY$kghMUG(*yzo('], trackRawTag: 3361133570293759}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['IwRjsAOTA4Cm!6d', 'OjsNafNIVMMH'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['AMjQHhig', 't#sy^6xf#u^XRTx5a7M'], trackState: 'HL^ZA$U7HmG'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['SzNboTynL', '6v*Z!K&aFAPn)Z]8M$'], trackState: 3786804054458370}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['cICCp9CWh0JWWH%*Zxd', 'ryGggwm8tZf11)Hdt'], trackState: 1496661062844415}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['U0srtxYmG^HzJ', 'j!Bx#v7y1j^YfyiN6HLV'], offset: '%Sm9l*9i1ODc]F'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['FIKXc', 'jZtgGc@%T2SRU'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['3RTKS^isvmd]H$', '[bclYt94dquX*'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['t2]$@PMoggnm', ')b$Yc[DQRQQerrPR'], offset: 66.8}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['Tiv84l6', 'Rl5OXRIAmRDu'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['AlzHJ4KsEeK!5(aU', 'Yh]yKLbZ)'], amount: '#7uJuv3%0v4G7f5!u4CJ'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['ZEOcA&3L', ']tzR80Gz2'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['PJc(wISNosT@&aj!!IY', '9mwv)IUU'], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['ewG]Ak', 'WSKIKR9h$clRBH9]rlL'], amount: 79.82}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/tracks').query({ids: ['rhI6RfMzm&y1n', 'LJeLW^1G6Fk%r*'], amount: 0}).expect(400);
					});
			});
		});
		describe('/folder/subfolders', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/subfolders').query({id: 'xG3&nE]lJzZs'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '!A[n4%D$gyZdt', folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'C$^LYy2yf@M4S%uXqAiW', folderTag: 't8k!St7iDpp$AT'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'i4y)GEKybSpvdIYYANp', folderTag: -5871344075931646}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: '!dCJ*S%vP', folderTag: 2654111019302911}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'jTa@SZLDs[w[lHw%%gZ', folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'OdHMzC6b1W2g$', folderState: 'qWfCOmG'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'Pc(Nm5JRyg@K', folderState: -7687861688074238}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: '0t#fK&ruyuSkN@6Wy*]', folderState: -4326435577659393}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'gArjCK6qT7w', folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 't%q**L3V', folderCounts: 'fGW$h06E6Z!&A'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'kszJ!z&A', folderCounts: 6081950401953794}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: '$@UBVb', folderCounts: -6829866594861057}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '&6XH0vwCcjd', folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'He$@kmPdMW465PUf5', folderParents: ']u9$lLIhVcG'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'G)n)6@%KX1!qY]Y*lfg', folderParents: 1884076235554818}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: '$A8QyOL!AjNN', folderParents: 2450758393921535}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'nwl8WuWF', folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'jq9w@@DmjoIxjS$KyU', folderInfo: 'bqCvDPMSrhS)rKW'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: '(Io6XrpKR^hzq', folderInfo: -6419024934076414}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'eJcqQQy&U!', folderInfo: 6672102987923455}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'SCxjyaeuRLp8', folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'es8#hPLzdly$s', folderSimilar: 'N6f![2b2wkdb@J21m!'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'kPS6eWOLauQ', folderSimilar: 4857295481602050}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: '!q8!nI@pSWl7', folderSimilar: 749701246746623}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '3g0Gup0b@', folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'kmgAaV9ACa]mV', folderArtworks: 'hecd%Nd'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: '(^KShwE@@B(', folderArtworks: 5063587907239938}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: '4P6Gb%8fG)NvyTApA&', folderArtworks: -5215158909534209}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '!crfP3312KWz', offset: 'ZFKnRh&p*l7mH'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '4jR4m', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'lgb]bBcd7', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'N^TdKB2T2)i9uW*)d', offset: 6.55}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'A0uONug[R', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '2d3d#eGf', amount: 'cl]hg%v'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/subfolders').query({id: '!T]jQZi(G6Qa3CCKsn', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/subfolders').query({id: '$IhGyj6XK4', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'NjCJxSjoyy', amount: 31.89}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/subfolders').query({id: 'K0VHwmCiv(L8mYCv%', amount: 0}).expect(400);
					});
			});
		});
		describe('/folder/artist/similar', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/artist/similar').query({id: 'utC2M@r3xech'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '2D2GkJzSAOZ@nZHcleq', folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '#j]BCIHYzX*TVY[', folderTag: 'USpKV'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '7AhR$Ds6hp7(MQJ]M', folderTag: 4800335214280706}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'TQL#4[kbp1u*%', folderTag: -58303732252673}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'xnr3@6Gp', folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: ')(aQin8', folderState: '5T)dsTjtDH3evn'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'JE4]y0j5o[gRR1z2MY5', folderState: 4470425060900866}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'EO!1!WR4UvcVLJh&oLjA', folderState: 2886208803831807}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '8NQ1d8b', folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'U2l)J13nqqz[Gs0', folderCounts: 'C2hOf@0wEPw'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '43&9u6b@vf', folderCounts: 8398231360765954}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'VC0DaOxHXwDpfeQk@S', folderCounts: -4524646330269697}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'oB%uHOD', folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'DK4gIYMEWx&z', folderParents: 'S%w(pmi%h!i'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'tIX(o5)T080[', folderParents: -2754925956169726}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'fSk[a', folderParents: -5838467024027649}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'AiJNhy^9rudXm)#', folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'i5Qg$oSONw3u!YmAPb', folderInfo: '5@SLsyCn[AMxMQsaEuzL'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'Il1loB$di^gASOx(rRfC', folderInfo: 2409225712041986}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'C&pFsFSEC1^a', folderInfo: 8548250239893503}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'S3]CIaX8w^[', folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'Fx!DLB90v^2cFq^R4(XH', folderSimilar: '3Rzqb076[85t4'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'rRi&Ef8nAtb0Hkeni3W', folderSimilar: -74822109364222}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '[IOfQEc', folderSimilar: -3533183140233217}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'mm*pO]LEcRjl0', folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'YPywR', folderArtworks: 'elnbNmP*ZB^^ny'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '^qP&@mc3', folderArtworks: 5573015832100866}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'rqWZS', folderArtworks: 4431346554372095}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'RaZUb)4]T', folderChildren: ''}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'A4!rssE', folderChildren: 'tnSeQ'}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '7RmHfRpwR(gm*PvFQ(n*', folderChildren: -4520724660223998}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'gUFTgYRSya', folderChildren: 2305180502589439}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '$sAFM$cGp&YW4m%z$%eh', folderSubfolders: ''}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'n&xfAZNUVdU', folderSubfolders: 'GqE%]B#0%[zSh8bX'}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '7W@6e*Njc', folderSubfolders: -526506220584958}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'sG6IYrR', folderSubfolders: -2114235580547073}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'U#WuXNEyV6NWvjLBs', folderTracks: ''}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'HIKBaZ0kCymmnjC1M', folderTracks: '*[1do$YJF@y&'}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'PoLH(bqaG', folderTracks: 3966564319625218}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '^#^wG6S&0C5e%)HXbvhD', folderTracks: -8991685904171009}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'YFw@rLgNY', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'ljGebr5QBGxHn*8(qaI^', trackMedia: 'h8E!Ynq'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '^OE%nykd6!JRrU2Zm', trackMedia: 8395958148661250}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '$VZ0s', trackMedia: -2572503994073089}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '5kFqd5I', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'SG)!S7)9(', trackTag: 'JRFLAmt^%O@xqyv]Z'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'VUhPc8sx2]Ms', trackTag: 2038681669992450}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'e24fU@ZqBS', trackTag: 2421903612444671}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '!jCTzI4@aJO(@M', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'V)RPe^NLx', trackRawTag: 'x3b4[WsIklO]$29'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'V8P6O[1xNp', trackRawTag: -5586512045408254}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'v(YLM2oFjDX8Me', trackRawTag: 3684465146593279}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'SVR[Q3', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '139*3]cd', trackState: 'ybzXsUgc)6OCAq'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'QCtt3dKbn64ivYqFE', trackState: 6546281895821314}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'jp2Kt1G6pfR%@VJ(g', trackState: -1218085235195905}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '7[!)j', offset: 'h(H2D!xu'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'opDGY(#%iKM6hzMbmPp', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'ioGUKsgRl', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'u#*AJLy8U9w(&o', offset: 26.51}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'UtQ&Qv9d@Lc5W07SIi', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '943NBRuc', amount: 'Qi(mMO^mwGW'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar').query({id: '$MS[ZAqJ', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'Z(*B18', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'VbYnq%&PI', amount: 8.21}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/artist/similar').query({id: 'c(6tkbjMsek', amount: 0}).expect(400);
					});
			});
		});
		describe('/folder/artist/info', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/artist/info').query({id: '4)Q7iu*$mO4p%e4axK'}).expect(401);
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
						return getNotLoggedIn('/api/v1/folder/album/info').query({id: 'ptWcCVENeQm!$#tZPk&'}).expect(401);
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
						return getNotLoggedIn('/api/v1/folder/list').query({list: 'frequent'}).expect(401);
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
						return get('/api/v1/folder/list').query({list: 'recent', rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "parentID" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', parentID: ''}).expect(400);
					});
					it('should respond with 400 with "childOfID" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', childOfID: ''}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', artist: ''}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', title: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', album: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', genre: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', level: '2hZtILg7X$83C0v87a'}).expect(400);
					});
					it('should respond with 400 with "level" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', level: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', level: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', newerThan: 'ylObUaxUP(p5ND(9CvL'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', newerThan: 14.3}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/list').query({list: 'random', newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', fromYear: 'ND88KeUMrfLU'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', fromYear: 96.86}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', toYear: 'jxfJC)ox3POU*o'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', toYear: 12.32}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', toYear: -1}).expect(400);
					});
					it('should respond with 400 with "type" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', type: ''}).expect(400);
					});
					it('should respond with 400 with "type" set to value invalid enum', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', type: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "types" set to value null', async () => {
						return get('/api/v1/folder/list').query({list: 'random', types: null}).expect(400);
					});
					it('should respond with 400 with "types" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', types: [null, '']}).expect(400);
					});
					it('should respond with 400 with "types" set to value invalid enum', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', types: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', ids: null}).expect(400);
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
						return get('/api/v1/folder/list').query({list: 'faved', sortDescending: 'Kj(Sgo'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'random', sortDescending: -5837799097892862}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', sortDescending: -2418836343095297}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', folderTag: 'H[E&)[)wMp7w*!$!H'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', folderTag: -8331404261720062}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', folderTag: -5606460461416449}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderState: 'TbVnGvWrx^ieN5L$A'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', folderState: 6466636433326082}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderState: 389909072314367}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', folderCounts: 'lzj@V)ZQ'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderCounts: 295184159997954}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', folderCounts: -3764449127170049}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', folderParents: '4&QDB&lD'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', folderParents: -7653082632552446}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', folderParents: -146320387997697}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderInfo: '0P97OR'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderInfo: -5387956579729406}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderInfo: -1574801768449}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderSimilar: 'TVu103lwj'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderSimilar: 5588644962238466}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', folderSimilar: 7527836931850239}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'avghighest', folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', folderArtworks: '3OxR^m90D'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderArtworks: -3157098426793982}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/list').query({list: 'highest', folderArtworks: 6396244029079551}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', offset: 'sA3aykaM!hz7*'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'random', offset: 48.2}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/list').query({list: 'frequent', amount: 'Q^Ca[jB9C'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/list').query({list: 'random', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/list').query({list: 'recent', amount: 78.96}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/list').query({list: 'faved', amount: 0}).expect(400);
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
						return get('/api/v1/folder/search').query({offset: 'ji!US(]xK$)#iYyvHu'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/search').query({offset: 17.35}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/search').query({amount: 'fX^LU%urfTr8J*(Nm6X'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/search').query({amount: 73.98}).expect(400);
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
						return get('/api/v1/folder/search').query({level: '0hdy2qd11AAAEV8'}).expect(400);
					});
					it('should respond with 400 with "level" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({level: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({level: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/folder/search').query({newerThan: 'mMyOXU'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/folder/search').query({newerThan: 7.91}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/search').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/folder/search').query({fromYear: '6#E5I4QgOJx)kbE'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/folder/search').query({fromYear: 77.67}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/search').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/folder/search').query({toYear: 'bgDaDMVQ&EW'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/folder/search').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/folder/search').query({toYear: 75.44}).expect(400);
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
						return get('/api/v1/folder/search').query({sortDescending: 'cON&R'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({sortDescending: 6203347518357506}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({sortDescending: 8793757449191423}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderChildren: ''}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderChildren: 'l7w6^t9&'}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderChildren: -5790924332335102}).expect(400);
					});
					it('should respond with 400 with "folderChildren" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderChildren: -8107317358755841}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderSubfolders: ''}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderSubfolders: 's$GTe*'}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderSubfolders: 2242028918276098}).expect(400);
					});
					it('should respond with 400 with "folderSubfolders" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderSubfolders: -1831177694478337}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderTracks: ''}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderTracks: 'Ws5uVvcb'}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderTracks: -2130231519346686}).expect(400);
					});
					it('should respond with 400 with "folderTracks" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderTracks: -8707797332000769}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/search').query({trackMedia: 'HfWshVXTAF@Bi!'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({trackMedia: -3606255348219902}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({trackMedia: 1751854828486655}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/search').query({trackTag: 'd!UtIcSyOLA&$i4'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({trackTag: 7399536213360642}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({trackTag: 8689634125021183}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/search').query({trackRawTag: '!f#2aGGD734'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({trackRawTag: -8681774305509374}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({trackRawTag: -4588098319024129}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/search').query({trackState: '#PUazt)tis%('}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({trackState: -3107906027257854}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({trackState: -2223763575799809}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderTag: 'A417@gEo09Le0tGQcMg'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderTag: 2094365157621762}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderTag: 3775435741593599}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderState: 'v[0Ll[I[BAWr'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderState: 8992554422894594}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderState: 2245880530862079}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderCounts: '^G9JX6'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderCounts: 3524499295174658}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderCounts: -392394453286913}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderParents: 'jYS2oTZDWEmMv)7&U'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderParents: -8072103534264318}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderParents: 1070032138272767}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderInfo: 'IwI$B)fz8mZLjaI'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderInfo: 5733970935283714}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderInfo: 5005000073805823}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderSimilar: 'tIMYQ]B#eDYebP8P*MaC'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderSimilar: -2779121381801982}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderSimilar: -8124865370390529}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/search').query({folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/search').query({folderArtworks: '4ZE0bNIw'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/search').query({folderArtworks: -5068729956171774}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/search').query({folderArtworks: 7621316932796415}).expect(400);
					});
			});
		});
		describe('/folder/health', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/health').query({}).expect(401);
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
						return get('/api/v1/folder/health').query({level: '1!cRy'}).expect(400);
					});
					it('should respond with 400 with "level" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({level: ''}).expect(400);
					});
					it('should respond with 400 with "level" set to value boolean', async () => {
						return get('/api/v1/folder/health').query({level: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/folder/health').query({newerThan: 'Hl2AMOxmw'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/folder/health').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/folder/health').query({newerThan: 19.7}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/health').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/folder/health').query({fromYear: 'O0lap4j]3#^uk'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/folder/health').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/folder/health').query({fromYear: 5.18}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/health').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/folder/health').query({toYear: 'PJQIr2Bg!zwqgBR)s)3'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/folder/health').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/folder/health').query({toYear: 45.87}).expect(400);
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
						return get('/api/v1/folder/health').query({sortDescending: 'oaa)('}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({sortDescending: -2889241159794686}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({sortDescending: 6926084205445119}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderTag: ''}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderTag: '2QbuRP6GQ)x9^1Ul9!7r'}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderTag: 5811904777814018}).expect(400);
					});
					it('should respond with 400 with "folderTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderTag: -8534623617286145}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderState: ''}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderState: 'FF$n31Lkq@FiQ6r'}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderState: -71756333187070}).expect(400);
					});
					it('should respond with 400 with "folderState" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderState: -2069917041950721}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderCounts: ''}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderCounts: 'PbP2S(k0@#q2qZ$'}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderCounts: -8332285304635390}).expect(400);
					});
					it('should respond with 400 with "folderCounts" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderCounts: -3079094371614721}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderParents: ''}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderParents: 'Ylm3o@'}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderParents: 3321897735421954}).expect(400);
					});
					it('should respond with 400 with "folderParents" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderParents: 6843729130291199}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderInfo: ''}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderInfo: 'JCdkNh^aLSsOpW7c'}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderInfo: 8901646289469442}).expect(400);
					});
					it('should respond with 400 with "folderInfo" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderInfo: -2590461604659201}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderSimilar: 'mZHOnc2)r8twq'}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderSimilar: -3319458965749758}).expect(400);
					});
					it('should respond with 400 with "folderSimilar" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderSimilar: -6518023041056769}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value empty string', async () => {
						return get('/api/v1/folder/health').query({folderArtworks: ''}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value string', async () => {
						return get('/api/v1/folder/health').query({folderArtworks: 'e9bEtr$!YmZ8w!tF)'}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer > 1', async () => {
						return get('/api/v1/folder/health').query({folderArtworks: -3883783212236798}).expect(400);
					});
					it('should respond with 400 with "folderArtworks" set to value integer < 0', async () => {
						return get('/api/v1/folder/health').query({folderArtworks: 6949361099472895}).expect(400);
					});
			});
		});
		describe('/folder/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/state').query({id: 'n9EUY$RK5MO[EIJ7[^m%'}).expect(401);
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
						return getNotLoggedIn('/api/v1/folder/states').query({ids: ['qLlAWmUr', 'xk6yoZJf&89A4CH(jj']}).expect(401);
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
						return getNotLoggedIn('/api/v1/folder/artist/similar/tracks').query({id: 'W!MzN(4&#sFJuZl'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'mX8EFTnC(mnMhNol8', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'A$jknfBMV9U^6Ss', trackMedia: '9i3Sj6sCYX'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'Lz&^j#Y9TDO]E5', trackMedia: -7887751626096638}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '!8Ks2', trackMedia: 2955732823572479}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '!TPj[n3bE6', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'SNbAzTQnlzx]', trackTag: '9gmk3hkU'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'srFjAMBoeb5Q', trackTag: 6763974519422978}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '0EsLk7jL', trackTag: 7533351002963967}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'Dk]&SOUvEx', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'wnZe)ysRnvks!', trackRawTag: 'OkPOk'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '#(YPCwZtY(x', trackRawTag: 2417261612630018}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'KKqtiSqPrbIYiw1pxZED', trackRawTag: 6010095024472063}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'PGZhhW2Aa)@5', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '5&7HkruSbIgil1g', trackState: 't]0YXW)Zg^M23!3'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'ULL1T3*6bROWj&Ud$S', trackState: -7452959449284606}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '6to7!x#q', trackState: -2351265526841345}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '4x0Zq!)H6VN', offset: 'Ur)cgAU[yd*BC'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'KJJ2^BvEjUQOCgcOJ[De', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'vUOPfbiSyhsv', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'bumyme8ho]O', offset: 34.48}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'IPfZ!@', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'Plc*AfEh8)gsXyXjF', amount: 'sLPNy]iJENlYUUuG%n'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'UU0KLZ2Dz#ESmhC6&', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'pGocy#qPh', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: 'b3bmtHWt*)eJf58$nmmj', amount: 85.75}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/folder/artist/similar/tracks').query({id: '1ZeIwuau9BXb%eJg2s', amount: 0}).expect(400);
					});
			});
		});
		describe('/folder/artworks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/artworks').query({id: 'GFshy4rYo'}).expect(401);
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
						return getNotLoggedIn('/api/v1/track/id').query({id: 'I0]WEibot5'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: 'Y$Cap7G46Qh', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/id').query({id: 'IXy6@EZxu', trackMedia: '$A1FSFXlG3iL*2M'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/id').query({id: '#IJ9XmFD4LY)MuQO', trackMedia: -6394483121848318}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/id').query({id: '@59Jy#353E1Trw', trackMedia: 8387589643960319}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: 'HVUWoDhHk[CZ@z2LS[$*', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/id').query({id: 'ZRVmO([fmoTJ[idakL4', trackTag: 'J2R[1pciicEX'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/id').query({id: '0AKz&y(TAi]EWa!i', trackTag: -120553197273086}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/id').query({id: 'N&SpIH', trackTag: 7388532519731199}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: '*J99mT5', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/id').query({id: 'IQ*vP8ji*aak!V', trackRawTag: '09k8O1]29$'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/id').query({id: 'l3hj)$aG', trackRawTag: 5783277478608898}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/id').query({id: 'jM6FLCY!7Ufot', trackRawTag: -1560450051342337}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/id').query({id: '9@Sb3^*KeZEi[D$pp', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/id').query({id: 'FqWZVpqA6#UWe$Xart', trackState: 'qcZxkpW!$2ygMD'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/id').query({id: 'aMs9IDBbmVH[6', trackState: -1143139356114942}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/id').query({id: 'q]LdogXfIYSMUM1ii', trackState: 113451938611199}).expect(400);
					});
			});
		});
		describe('/track/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/ids').query({ids: ['B@0ijZXW', 'WCGV5ZH8wa7sOpvFdI8']}).expect(401);
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
						return get('/api/v1/track/ids').query({ids: [')P7TvgF', 'mHK!@95tQ4be&#PrE'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/ids').query({ids: ['$Wwh8Hh', 'WN0jf#Z3V'], trackMedia: 'eBH^oQwYY&G8E^8]'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/ids').query({ids: ['@lmN4u*', 'fSNjOdCY%%'], trackMedia: -7004134666403838}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/ids').query({ids: ['adRZU', '&uDbYAmJ'], trackMedia: 5188095846645759}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/ids').query({ids: ['vr$2pevvU', '5nSIElDPl&an'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/ids').query({ids: ['X!v*W)9rLLg2)fDfl', 'WS$VT'], trackTag: 'xnpdR'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/ids').query({ids: ['Wum)su@Ic@Jbb(', '[T83jsy5m'], trackTag: -6239509272330238}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/ids').query({ids: ['BXDj@x4ghjWvOpF*Xs', 'd1S%KsfJLo'], trackTag: 5534559345049599}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/ids').query({ids: ['v7SQjK5#i', 'QxkcLfRzP$#Lr[S5'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/ids').query({ids: ['b]p2npgP', '7oqtwVOHPx#o#*Tt1q'], trackRawTag: 'p!Xgx]Ige8SqX'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/ids').query({ids: ['X@FAKLwUXx1B2v', 'S$GzFGOcDi'], trackRawTag: -4895584251019262}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/ids').query({ids: ['R663*', 'eqfL)lOZD'], trackRawTag: -7565775980199937}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/ids').query({ids: ['*HXu1', ')o%r%b'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/ids').query({ids: ['wLEzETXMtAV', ']4saWKD6gc9UHS)%d'], trackState: 'gyl]$KZ%2md!$O7ER#'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/ids').query({ids: ['Jv!oeTbZN(', 'oB645qFntWlU%yR'], trackState: -4849496332697598}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/ids').query({ids: ['T#hzF%S5Ri^)LSbzLxWa', '2wT!)k7kp$LJ%Ff'], trackState: 5011403874238463}).expect(400);
					});
			});
		});
		describe('/track/rawTag', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/rawTag').query({id: 'u8P)!1Iu'}).expect(401);
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
						return getNotLoggedIn('/api/v1/track/rawTags').query({ids: ['s5%pPobaW&rt', 'GtGb#@gmgQ$hV']}).expect(401);
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
						return get('/api/v1/track/search').query({offset: 'Dgaf9uf'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/track/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/track/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/track/search').query({offset: 52.49}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/track/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/track/search').query({amount: 'e6Yg83*QUYFmzlVk^[vk'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/track/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/track/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/track/search').query({amount: 48.91}).expect(400);
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
						return get('/api/v1/track/search').query({newerThan: '&zl#T)RPk$NLMtRTx)F'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/track/search').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/track/search').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/track/search').query({newerThan: 43.96}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/track/search').query({fromYear: 'YkS]gEvbYKvSwO'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/track/search').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/track/search').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/track/search').query({fromYear: 84.65}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/track/search').query({toYear: 'boaKyA^f62O'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/track/search').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/track/search').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/track/search').query({toYear: 83.28}).expect(400);
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
						return get('/api/v1/track/search').query({sortDescending: '*jbT6P'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({sortDescending: 7154654865522690}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({sortDescending: -1031554751004673}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/search').query({trackMedia: 'GOT)VjPJoHSA5zw^'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({trackMedia: 6468437719121922}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({trackMedia: -7129502496849921}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/search').query({trackTag: 'q%EqwI^'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({trackTag: -348028644884478}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({trackTag: 638314948329471}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/search').query({trackRawTag: 'YoZQ&]'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({trackRawTag: -7583569551556606}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({trackRawTag: 7618172815409151}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/search').query({trackState: '(&9SqRXUfk)jb'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/search').query({trackState: -408156836462590}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/search').query({trackState: 2334360921440255}).expect(400);
					});
			});
		});
		describe('/track/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/state').query({id: 'sEA6^a@hpNC'}).expect(401);
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
						return getNotLoggedIn('/api/v1/track/states').query({ids: ['!Hb(4(q!', 'gtMlAf2u1wNd&Lo9I']}).expect(401);
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
						return get('/api/v1/track/list').query({list: 'highest', artist: ''}).expect(400);
					});
					it('should respond with 400 with "artistID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', artistID: ''}).expect(400);
					});
					it('should respond with 400 with "albumArtistID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', albumArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "parentID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'random', parentID: ''}).expect(400);
					});
					it('should respond with 400 with "parentIDs" set to value null', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', parentIDs: null}).expect(400);
					});
					it('should respond with 400 with "parentIDs" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', parentIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "childOfID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', childOfID: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/track/list').query({list: 'random', rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', title: ''}).expect(400);
					});
					it('should respond with 400 with "album" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', album: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', genre: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'recent', newerThan: 'XeA&pr'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'random', newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'random', newerThan: 3.55}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'random', fromYear: 'mHyn#'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'random', fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'random', fromYear: 95.06}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', toYear: 'x!dSHfZmqK'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'random', toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'random', toYear: 22.27}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/track/list').query({list: 'random', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/track/list').query({list: 'recent', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'recent', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', sortDescending: 'AAn@Pg&JFt*1*yafQ9R'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'recent', sortDescending: -5967578698612734}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'faved', sortDescending: -7028711773700097}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', trackMedia: 'm!pdNb'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', trackMedia: 5363729130586114}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'random', trackMedia: 1785224484618239}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'random', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', trackTag: '%*n5X1UC!6K'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'random', trackTag: -2488189084237822}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', trackTag: -8778349442760705}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', trackRawTag: '$vFV0L^bGlAtFxeoTV'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'highest', trackRawTag: -2726759258652670}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'recent', trackRawTag: 419229056630783}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'highest', trackState: 'L7RFLm4Qf^Md$H1mKNf'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', trackState: -1065799716438014}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', trackState: -6929231233679361}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', offset: '[L6)N^ZFB*0'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'faved', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'avghighest', offset: 67.36}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/track/list').query({list: 'random', amount: 'lv5!wZWo'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/track/list').query({list: 'recent', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/track/list').query({list: 'highest', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/track/list').query({list: 'frequent', amount: 18.46}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/track/list').query({list: 'faved', amount: 0}).expect(400);
					});
			});
		});
		describe('/track/similar', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/similar').query({id: 'JMSF6kgX^'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: 'lmbB4nFPFKw&1', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: 'Yh*Jz4(#YvXckZG', trackMedia: 'ly[ZOUQc(dZE3X'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/similar').query({id: 'pxuXR^)(Cr', trackMedia: 8722273875787778}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/similar').query({id: 'o3bvey', trackMedia: 7873069775323135}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: 'J7fnGuhSo8F&@Jq', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: '6bKH0T)jao6asX[', trackTag: 'Q^y4kSi7Lxx'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/similar').query({id: 'YbD3mux', trackTag: 7721838079639554}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/similar').query({id: 'x4HwJ7q2vxodv6Z@@7J*', trackTag: 8643325187850239}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: 'h#M[k6(W', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: '8Ac]cG*0*&NKE', trackRawTag: 'FR8EK&#1DD]EE&#DPz'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/similar').query({id: 'G94OC!q15fwcuQBL]@[Y', trackRawTag: 8249834016342018}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/similar').query({id: 'NmyGt[k', trackRawTag: 2069304153473023}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: 'fm3IpqYGE!XvsXF8qFTj', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: '!c%JPrQ', trackState: 'WyAaRuQ'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/similar').query({id: ']IESHrug0E&l]kl', trackState: -5269327263563774}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/similar').query({id: 'X1z2whycgb[K', trackState: -6068774667026433}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: 'BkLaM9JDX90lYCJ7', offset: 'jJsrY'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: '5U!V!#K!D&G', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/track/similar').query({id: '&5[jDXqLleHAFTffW5S', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/track/similar').query({id: '(Z]jl', offset: 3.22}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/track/similar').query({id: 'TU0y5ZO(]Ou]90P', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/track/similar').query({id: '!9YJDCOMt#JJ*bzZf', amount: 'QsZhz'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/track/similar').query({id: 'oM^FNGV[iSS', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/track/similar').query({id: 'c#Uq7meg6w', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/track/similar').query({id: '6p9TcF073SpvbN[', amount: 47.13}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/track/similar').query({id: 'jGcFaPmE[Qsi1r3Lj', amount: 0}).expect(400);
					});
			});
		});
		describe('/track/health', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/health').query({}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "media" set to value empty string', async () => {
						return get('/api/v1/track/health').query({media: ''}).expect(400);
					});
					it('should respond with 400 with "media" set to value string', async () => {
						return get('/api/v1/track/health').query({media: 'LkzOO'}).expect(400);
					});
					it('should respond with 400 with "media" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({media: 4309645556449282}).expect(400);
					});
					it('should respond with 400 with "media" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({media: 7235483788640255}).expect(400);
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
						return get('/api/v1/track/health').query({newerThan: 'm(^ZVrcFR@7#'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/track/health').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/track/health').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/track/health').query({newerThan: 79.95}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/track/health').query({fromYear: 'xgN%qR[1gKDvLk'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/track/health').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/track/health').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/track/health').query({fromYear: 4.45}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/track/health').query({toYear: 'KaWsYdbHpeI(mb0#V2'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/track/health').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/track/health').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/track/health').query({toYear: 40.67}).expect(400);
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
						return get('/api/v1/track/health').query({sortDescending: 'T$wC]M6ZhMj!'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({sortDescending: 6501829231771650}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({sortDescending: -2938950750568449}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/track/health').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/track/health').query({trackMedia: ']yPuCEQ4VfwYwY8Mp&2'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({trackMedia: -1804047929573374}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({trackMedia: -4506326164045825}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/track/health').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/track/health').query({trackTag: 'Wbmz0enYNJHk3'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({trackTag: -8024596502544382}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({trackTag: 6874916687183871}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/track/health').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/track/health').query({trackRawTag: 'FNm%STfIDK2z@O'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({trackRawTag: -6685304312299518}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({trackRawTag: 3111124161527807}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/track/health').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/track/health').query({trackState: 'D4(Z36k(j4T2qS'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/track/health').query({trackState: -5183168453804030}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/track/health').query({trackState: -8665310177525761}).expect(400);
					});
			});
		});
		describe('/track/lyrics', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/lyrics').query({id: '4ED17xF0p2g8'}).expect(401);
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
						return getNotLoggedIn('/api/v1/episode/id').query({id: '2B]*u'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: '6&!Ay()H*DjrCtpwCj', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/episode/id').query({id: ')zCI0d9lqx', trackMedia: '*Hd]c5h#3B'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/episode/id').query({id: 'bx&aSrtv', trackMedia: 2619480618303490}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/episode/id').query({id: 'k24cRiMj5e', trackMedia: -5885460492582913}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: 'GidU4$)o)SX@9', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/episode/id').query({id: 'Qcz1JI', trackTag: '1$VW%!]'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/id').query({id: 'q5@Ya(ZVpB*]', trackTag: -7011644303474686}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/id').query({id: 'cv4FKOY&$46W', trackTag: 5790711437852671}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: 'FBavsnHcz8$kvko)dRRS', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/episode/id').query({id: 'erl4UBoy', trackRawTag: '^Bxq#!6m1jLlMGJI'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/id').query({id: 'hLyh[ftUgX$IedGED', trackRawTag: -6532782259961854}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/id').query({id: 'fK^PXef1&[QD[Z', trackRawTag: 5894804118437887}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/episode/id').query({id: '@$K[*X!uwwvNzd)FlK', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/episode/id').query({id: 'FKTX1JhzB&3^3geg)6w', trackState: 'e(7wSlsqRk*k'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/episode/id').query({id: '$4yk3GDfdI%!%]f9', trackState: -6271433311256574}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/episode/id').query({id: 'F[WAZ70[UYKz36($R', trackState: 5184318196416511}).expect(400);
					});
			});
		});
		describe('/episode/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/ids').query({ids: [']Z$TCttpZ#Fw5vOM7D', '$PB]0i']}).expect(401);
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
						return get('/api/v1/episode/ids').query({ids: ['JqLjty', 'A$upWGgiMZ5$ww'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['51#LD3L423m#Ny', 'Y^1keO'], trackMedia: 'bOc@(]0vTdHi'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/episode/ids').query({ids: ['ij00GRKt%w', '702@#m31CnI'], trackMedia: 5622056943091714}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/episode/ids').query({ids: ['(*X^lJIh(*T', 'DwCZ%3BbvNR'], trackMedia: 5122003866484735}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['eXFE!Xuu$&GpMT', 'BGD@u$@V$(LB^'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['kYYw[YbafF3[3', '7X5qFIm@(muQ7p8I9xy'], trackTag: 'ATfMJ&XOQMdrtsk]'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/ids').query({ids: ['jppmcC', ')0RJk'], trackTag: 839692522094594}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/ids').query({ids: ['%r9[pG', 'Pk@gIP^4!s![PUYmQEq'], trackTag: -8086002958598145}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/episode/ids').query({ids: [')G6qpENA]))', '[MW]mvl%3D^D(6%ih%j'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['AW)gpNH', 'J4RMh'], trackRawTag: 'ZTspsgM9'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/ids').query({ids: ['q&OG@EA2@6', 'dz)FCXeHPTxc90Jpnt'], trackRawTag: 8581544046231554}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/ids').query({ids: ['Cf*IH@', '#La9['], trackRawTag: 5928740190158847}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/episode/ids').query({ids: [']KmJcV', ')gnQ@n1wySP[AB)5viP'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/episode/ids').query({ids: ['Nqk$3]0jKa8vs@', 'Pmwr0sfv4'], trackState: 'wqm(4I^Bl$tB['}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/episode/ids').query({ids: ['vxx8bP9BDFAX]GU4w([', 'eaBoxX#47S44^W'], trackState: -6247742913380350}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/episode/ids').query({ids: ['$*7[3rkqz5atl)JFdG', 'czfQB6VtkyS'], trackState: -314949956009985}).expect(400);
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
						return get('/api/v1/episode/search').query({offset: '[Rw6gsZ2aFd[$FP'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/episode/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/episode/search').query({offset: 12.69}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/episode/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/episode/search').query({amount: '4d3W6O'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/episode/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/episode/search').query({amount: 90.8}).expect(400);
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
						return get('/api/v1/episode/search').query({sortDescending: 'zk72ZhB1ec4o8xGa@Vad'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({sortDescending: -2540872470102014}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({sortDescending: 3541199252094975}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/episode/search').query({trackMedia: 'i2]xr'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({trackMedia: 6919421658398722}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({trackMedia: -3275384414011393}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/episode/search').query({trackTag: '3B&vfYG6z1#Ivo8T%Yj'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({trackTag: 1902030335508482}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({trackTag: 8160953426247679}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/episode/search').query({trackRawTag: 'RVM9gXVaR)Ue9h&7QK'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({trackRawTag: -7163673940328446}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({trackRawTag: 6137272340578303}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/episode/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/episode/search').query({trackState: 'z74Gsc#0FMKGV'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/episode/search').query({trackState: -4330645660631038}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/episode/search').query({trackState: -2808245949300737}).expect(400);
					});
			});
		});
		describe('/episode/retrieve', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/retrieve').query({id: '73Vg5FGMdBlA]'}).expect(401);
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
						return getNotLoggedIn('/api/v1/episode/state').query({id: 'D7#b9kU'}).expect(401);
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
						return getNotLoggedIn('/api/v1/episode/states').query({ids: ['@*wj78To', 'xQKCvq5E[M']}).expect(401);
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
						return getNotLoggedIn('/api/v1/episode/status').query({id: 'g2@xj'}).expect(401);
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
						return getNotLoggedIn('/api/v1/episode/list').query({list: 'highest'}).expect(401);
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
						return get('/api/v1/episode/list').query({list: 'highest', podcastID: ''}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', name: ''}).expect(400);
					});
					it('should respond with 400 with "status" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', status: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'random', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/episode/list').query({list: 'random', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'frequent', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'frequent', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'random', sortDescending: 'fuX3wKMkQ*R4&t9oj'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', sortDescending: 2771941437997058}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', sortDescending: -8577444558667777}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', trackMedia: 'Qd8kjR'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', trackMedia: -7128931022929918}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'frequent', trackMedia: 8141997483229183}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', trackTag: 'kF2SUYvIYaa8Kv'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'random', trackTag: -8186087688110078}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', trackTag: -5596374691217409}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'random', trackRawTag: 'kEQpEdOcFBgkGhw'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'frequent', trackRawTag: 6350662946258946}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', trackRawTag: -7981632531202049}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'random', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'random', trackState: 'c$Sv*HEjnPZ]*VGfj'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/episode/list').query({list: 'random', trackState: -2779033376915454}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', trackState: -5176768164003841}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'random', offset: 'Mp3^$H$uDIhs2'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'random', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/episode/list').query({list: 'highest', offset: 73.29}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/episode/list').query({list: 'recent', amount: 'Qm%Cb18exIoep!TJu^'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/episode/list').query({list: 'random', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/episode/list').query({list: 'faved', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/episode/list').query({list: 'random', amount: 71.13}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/episode/list').query({list: 'avghighest', amount: 0}).expect(400);
					});
			});
		});
		describe('/podcast/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/id').query({id: 'CzDkeNf'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: '9%@cPr4]YMCyQ*w1M', podcastState: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: 'pIh7cd#aJ#s)f', podcastState: 'sUWXmqA'}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'J7[vxK9J68KL2o', podcastState: -7555205113577470}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: '8A2HeL@', podcastState: -2986072095064065}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: '(!TNm3k^#U', podcastEpisodes: ''}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: 'BKYsQyuPKeTE', podcastEpisodes: 'AK1i7*(WeoEY[V'}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'ZG[dwc4(', podcastEpisodes: 3961654677078018}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: '**]eEQrpStSPSS^Z7', podcastEpisodes: 5301749753577471}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: 'xOMr13*Ar7UDJIs', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: 'FHVx]', trackMedia: 'WI@g!VTN[XYr%Y30GvT%'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: '[Mr]wQqQJ8ZKi3(A', trackMedia: -2179676793470974}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: 'xwO)szDkWvVBoh$', trackMedia: -7266480685057}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: '!k0yt!6UhFfq', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: 'DbM%t^SmQ', trackTag: 'ZMu2(0'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: '(2TrK]E9V', trackTag: -5711898032996350}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: 'kD*o5wrIJf^n&t', trackTag: 4139977814310911}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: '9]qaDEqRMRbk', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: 'QuxE@b(6F5R', trackRawTag: 'b@R(t#ZY'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'pCXtOxB50iJwJA', trackRawTag: 6705252485038082}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: 'rTPqzs68', trackRawTag: -851149414465537}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/id').query({id: 'c*452*hOst&@Xjbxy0', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/id').query({id: 'Q(OR8kQ6n3P*U)[2m', trackState: '9su@2dSO(nO$9LUuM'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/id').query({id: 'Go##ZTWJ&&', trackState: -1648889706840062}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/id').query({id: 'JXW5u#c', trackState: -7765454634352641}).expect(400);
					});
			});
		});
		describe('/podcast/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/ids').query({ids: ['ce^8WVK7q6DjRHYaT5EB', '^1YtU%Ef3G']}).expect(401);
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
						return get('/api/v1/podcast/ids').query({ids: ['^BEVL4eOD)1EFK', 'P92CXTN'], podcastState: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['fv@EmqPHQ#vYj#l*W', 'se3s6YCDsM!eEz'], podcastState: 'BdvJL&]1R0Vz[t'}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['dY3rSoANvK0c#fk&8h', 'ETC]sNNSV@SOn'], podcastState: 4297075411910658}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['zvM#Ci6j', 'hA2x$ebw*RKUT'], podcastState: -2559161216794625}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['F[xh3^d@7[@7yw2', 'qLH1mb'], podcastEpisodes: ''}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['cLskI', 'Hy78DxrRs^z'], podcastEpisodes: 'RYv30ac$[ce!'}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['G53XyxnHWhf', 'Jqkp^E%FNtB9Oo6'], podcastEpisodes: -3601141841526782}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['b1[^73mb6cedbPbip', 'ND9o$@v]Z%]iVF%JH8'], podcastEpisodes: 822567363411967}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['IPJHZGUs9rmb7K', 'a3%Q[7'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['4#y5QEEEQBw5rfp*3r', 'I8mAs1hP'], trackMedia: '(*Jx!0'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['60M[W4voX&', 'qUpConER'], trackMedia: 3691758034616322}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['iy7dKlqwUZG3]fZI', 'FhtlZ9[QNkE9p'], trackMedia: -5342657857454081}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['lkIq]1', '8%kVelzdh#s2'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['l!iRNk)Fdne2tBT', 'zMS2ONG&^JV[U4EW[j'], trackTag: 'I]bvzOr1ga'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['DLgRY', '0Q(7r[GUJ8#sM7]'], trackTag: 3555753214345218}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['eX^M(vIg4', 'Tz6o2n($(xN*FlltgQ'], trackTag: -4472753658789889}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['$@XIEJYB', '6S#B4z2k1TXqAc43Xq0'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['B2iuSbFu9INebOkQP', '^RzD)QLQ%gll*lKfP![D'], trackRawTag: 'Jlio]yVKlV5%@'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['$r4YRvMYYsZWRRnIOS', 'FKT0[x^OW'], trackRawTag: 8010531348676610}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['uoVR2!UZwd', 'DRbwap%7@5L!)1'], trackRawTag: 7518442731077631}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['sH2crnx', 'AWCDgm0yVV'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['P%L@C(]IThd#jDdSKLS', 'YMxwn4'], trackState: 'Yj1))]3D'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['oehWuwAA$W&5hRTL9', '7@@gn5qx'], trackState: -2160532903690238}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/ids').query({ids: ['3RsazbO%cWDKt', '6i1GsB'], trackState: -6106520827723777}).expect(400);
					});
			});
		});
		describe('/podcast/status', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/status').query({id: 'oyWNImKhKa'}).expect(401);
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
						return get('/api/v1/podcast/search').query({offset: 'iU4((4AFNr[l7&#R7('}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/podcast/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/podcast/search').query({offset: 79.91}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/podcast/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/podcast/search').query({amount: '%Br5]gGM'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/podcast/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/podcast/search').query({amount: 49.11}).expect(400);
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
						return get('/api/v1/podcast/search').query({sortDescending: 'JN1(t8IPeXsdQG'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({sortDescending: -5139948910936062}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({sortDescending: -8514127995600897}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({podcastState: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value string', async () => {
						return get('/api/v1/podcast/search').query({podcastState: 'u$bgc9nXOg'}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({podcastState: 6804918572679170}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({podcastState: -4322599924400129}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({podcastEpisodes: ''}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value string', async () => {
						return get('/api/v1/podcast/search').query({podcastEpisodes: '8*Kg(z)3qi@'}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({podcastEpisodes: 8465908141916162}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({podcastEpisodes: -6404927739920385}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/search').query({trackMedia: 'rSXO2S'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({trackMedia: -1073401007439870}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({trackMedia: 8253689609322495}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/search').query({trackTag: '1@4ku'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({trackTag: 5783706908229634}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({trackTag: -1711882008264705}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/search').query({trackRawTag: 'wWY]xVhGw2o'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({trackRawTag: 5675840360677378}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({trackRawTag: -8551416234770433}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/search').query({trackState: 'yhtVb[Yv^$NGywgFp6'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/search').query({trackState: 4558101042692098}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/search').query({trackState: 4911345828888575}).expect(400);
					});
			});
		});
		describe('/podcast/episodes', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/episodes').query({id: 'IWKQfBmVRZP&'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'wQ(TctINatzZdufS^M0', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'C9ET3zt$wYg', trackMedia: '6TveffrQZS5u5Kno'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'ZdKea', trackMedia: -2296644875845630}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: '3$m2Vb1IjAVu', trackMedia: -8953048420319233}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'OEN%W', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'T&c72YzOS^m!6C', trackTag: 'KJ%CK@j0wCgjlo@p'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'q#ny!Nk4cf^rkFxp', trackTag: -99587859677182}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'om0xb#da7]J8', trackTag: 4813100528173055}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: '@vxZG#*', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: '#e&ERTVs20U3kZibUVP', trackRawTag: 'Tp^gB%Ji0'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: '%il3!JIFI(0#R', trackRawTag: 2443941605539842}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'v6J[!mqN', trackRawTag: -1994083354542081}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'oDsRu$l3P3)^*jy]Ee', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'q0tq04@J', trackState: 'BWjY(*P592F)0'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'L(zmHa', trackState: -6030785320583166}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'CxcU8Nstl', trackState: 3842615699046399}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'OcbAFI24v4h!L', offset: 'fEYc22[89'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: '7ufMDM@^xJ', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'W1D0gLAK8vlRbR', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'wa7QKeh]', offset: 79.28}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'scQQp', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/podcast/episodes').query({id: '6tdOjPwfE7U&S6eY', amount: '2^4WaK)e*'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'y9DC7T', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/podcast/episodes').query({id: '@3[sYk', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'j#vK!d4xt3][j%[lNPe', amount: 62.59}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/podcast/episodes').query({id: 'xR^NQ', amount: 0}).expect(400);
					});
			});
		});
		describe('/podcast/refreshAll', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/refreshAll').query({}).expect(401);
					});
			});
		});
		describe('/podcast/refresh', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/refresh').query({id: '5G)nRFcrpa1tj'}).expect(401);
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
						return getNotLoggedIn('/api/v1/podcast/state').query({id: 'Xg#KWq'}).expect(401);
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
						return getNotLoggedIn('/api/v1/podcast/states').query({ids: ['iT[nKxs(CoURq)M&EUJ', 'kCUmjcU']}).expect(401);
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
						return get('/api/v1/podcast/list').query({list: 'random', url: ''}).expect(400);
					});
					it('should respond with 400 with "title" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', title: ''}).expect(400);
					});
					it('should respond with 400 with "status" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', status: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', sortDescending: 'HelO(tzr'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', sortDescending: 2281540142759938}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', sortDescending: -1210719613747201}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', podcastState: ''}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', podcastState: 'SE^Nu%SFuKKm3c*'}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', podcastState: 8548919390765058}).expect(400);
					});
					it('should respond with 400 with "podcastState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', podcastState: 835011762716671}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', podcastEpisodes: ''}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', podcastEpisodes: 'SpvamNxs)ILwZDayD]'}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', podcastEpisodes: -5677858076753918}).expect(400);
					});
					it('should respond with 400 with "podcastEpisodes" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', podcastEpisodes: -8429384729886721}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', trackMedia: 'W!VnV8zb1@4k'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', trackMedia: 1069875296468994}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', trackMedia: 6014873683099647}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', trackTag: 'wyGkVZfY'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', trackTag: 8758614198059010}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', trackTag: -851094028681217}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'frequent', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', trackRawTag: 'VWE7RL@YytvLJJMyArtJ'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', trackRawTag: 3250727866597378}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', trackRawTag: -7632968889663489}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', trackState: 'NPIN9EdKNJy0'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', trackState: -7998851667460094}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', trackState: -7778877468311553}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'highest', offset: 'eP$FbQU[F^Ro*y'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'faved', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', offset: 22.85}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', amount: '6De^xZN9xs2'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/podcast/list').query({list: 'random', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/podcast/list').query({list: 'recent', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', amount: 28.34}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/podcast/list').query({list: 'avghighest', amount: 0}).expect(400);
					});
			});
		});
		describe('/radio/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/radio/id').query({id: 'VYSEWwTsl', radioState: false}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/radio/id').query({id: '', radioState: false}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value empty string', async () => {
						return get('/api/v1/radio/id').query({id: 'zOyraZtto', radioState: ''}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value string', async () => {
						return get('/api/v1/radio/id').query({id: 'FDqo$C', radioState: '[LOcEruNw@*PTtaKm7'}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer > 1', async () => {
						return get('/api/v1/radio/id').query({id: 'SI##1(okh#xxD8', radioState: 7634549739618306}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer < 0', async () => {
						return get('/api/v1/radio/id').query({id: 'q2R*Q', radioState: 6411419406827519}).expect(400);
					});
			});
		});
		describe('/radio/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/radio/ids').query({ids: ['3A5U27mc)@C', 'eCRUO3Q#stagw)Z'], radioState: false}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/radio/ids').query({ids: null, radioState: true}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/radio/ids').query({ids: [null, ''], radioState: true}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value empty string', async () => {
						return get('/api/v1/radio/ids').query({ids: ['6JM(c9', ']M1Nlhjd)t'], radioState: ''}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value string', async () => {
						return get('/api/v1/radio/ids').query({ids: ['qs1r9[Qdfoo*^)9XBx', ']]Ho#'], radioState: 'BRXfj1pkaIgW'}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer > 1', async () => {
						return get('/api/v1/radio/ids').query({ids: ['UF&aR9AC(', 'P*9LfEkYWfy^Jr'], radioState: 550484595179522}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer < 0', async () => {
						return get('/api/v1/radio/ids').query({ids: ['*IQbvJ7zb07^', 'EoBBDSY'], radioState: 4409419794219007}).expect(400);
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
						return get('/api/v1/radio/search').query({radioState: 'EH!Zn#GT4L9@]ekG2!'}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer > 1', async () => {
						return get('/api/v1/radio/search').query({radioState: 2539781904924674}).expect(400);
					});
					it('should respond with 400 with "radioState" set to value integer < 0', async () => {
						return get('/api/v1/radio/search').query({radioState: -3109701076123649}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, offset: '40n#pBIbqIs(q'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/radio/search').query({radioState: true, offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/radio/search').query({radioState: true, offset: 96.93}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/radio/search').query({radioState: true, offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, amount: 'hWp)cfiuu8CE7Gos'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/radio/search').query({radioState: true, amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/radio/search').query({radioState: true, amount: 11.04}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/radio/search').query({radioState: true, amount: 0}).expect(400);
					});
					it('should respond with 400 with "url" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, url: ''}).expect(400);
					});
					it('should respond with 400 with "homepage" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, homepage: ''}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, name: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: false, sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/radio/search').query({radioState: false, sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/radio/search').query({radioState: true, ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/radio/search').query({radioState: true, sortDescending: '*!q)Sl@9l2ogv11S0IMJ'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/radio/search').query({radioState: true, sortDescending: -5972137974169598}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/radio/search').query({radioState: true, sortDescending: 8475391471648767}).expect(400);
					});
			});
		});
		describe('/radio/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/radio/state').query({id: 'QBp!I[Y['}).expect(401);
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
						return getNotLoggedIn('/api/v1/radio/states').query({ids: ['jrNO^qTh[JD][NFg', 'm)YNQIECsuJ#&48mm[sw']}).expect(401);
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
						return getNotLoggedIn('/api/v1/artist/id').query({id: 'N&zG%zJwnhP$(Bp'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'h6MhSw3029DiKFFD@', rootID: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'UZ3V25ehN23D%&cx', artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'Kh!lfjG1e5ZA[(', artistAlbums: 'Pw[*D*R)GuGg*y!3m*'}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'vgM44[[D', artistAlbums: 3289697702903810}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'OA0h!^zi*09*r3@C', artistAlbums: 2394031631892479}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: '^mwgxb^w8gb', artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'pNHdL$I', artistAlbumIDs: 'hV0sA'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '9QPrC1%^E', artistAlbumIDs: 4763405323862018}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'E2]l*f6t][(Syj', artistAlbumIDs: -120674462990337}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: '[tNbrW^W2Vek)KMh!2', artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'MJzrCl$n(Hr*tLzE', artistState: 'l$j5]6MwJATw6S8ApG!$'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '9Vdvd$j3YoqO%*Et', artistState: 8008117241511938}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'rlatIll1rvWaJ1J#4deX', artistState: 7202450620547071}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: '&IL85', artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'b]icA3OaiiEJl', artistTracks: '[$(CXLYpAaQP9IR9qOES'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'Op3qbB&vc4%mlQ(JM$x', artistTracks: 730216762703874}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'R*eA]]eNDX6y4RVf', artistTracks: -6162186019799041}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: '@g@G8', artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'V2oYE', artistTrackIDs: 'juZ^0CQOn%GCQW'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '^!m(8%C', artistTrackIDs: -1182139076837374}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'uyci!JBzMXx$', artistTrackIDs: -3127319749197825}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'gOFi5*O', artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'jyvhj4', artistInfo: 'Pl0kK*8xi4'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'd5w5I]l0k)mRAv5^Z2O', artistInfo: 6310401784414210}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: '7*[wM*Iwh', artistInfo: 2966148438032383}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'jaTkU@yUA7*r', artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'sbe!tvy7I', artistSimilar: '((2i2'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'dPHVZgEq', artistSimilar: 2185077953921026}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'SXo&vmcyq0Pg', artistSimilar: -1561413042569217}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'py@C(5IAtI', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: '2E6LfR0GDOC82PKLI', albumTracks: '378dS!Go3%W1'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '*3^vq', albumTracks: 6321215153111042}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'k6OuQKS', albumTracks: 7973199849455615}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'yIxrh$TIp1)MVsY%', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: '!wL^y', albumTrackIDs: 'U^Vy$gW((SRCV#9I89I'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'R($ebCB%^OtH4XzFRFYp', albumTrackIDs: -8453045776023550}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'm^ifcz86!5N%jIz', albumTrackIDs: 1802666330030079}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'bYuBM*AUDGDPfxIW9x', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'v][jt7&', albumState: 'VAPJ(5YX'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'cGis&#pF1GJvFaHKnn', albumState: -6882540832948222}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'hUEte3!uv', albumState: -6454943598772225}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'rY8gmyPekWe!QSWH(j6N', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'YQodntF6ztMH4Kejr', albumInfo: '3CN7^[&'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'i@bB0zZdR#yNoOQKCo3(', albumInfo: 5118157190594562}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'ktw0#$HMxamo3u1Fw', albumInfo: -2167074604449793}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'FM4rTc', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'Yu@qcK[#%IInKJV7b', trackMedia: 'IpPw[Ytv#d!8uY'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: '%VfV4A', trackMedia: 8538463766839298}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'yJgRCMHs)xD&H(X)', trackMedia: 4440598073311231}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'mVb&Z]!iRy*S*', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: ']Icw%5', trackTag: 'Tphhx#w*2'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'AE5uf^wCPc', trackTag: 5252151374774274}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'l8SVP[2n4dV0P', trackTag: -8207072483082241}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: ']ytWYJfDh&]aN&ElT', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: ']%TF$C5khwEw2FuYs', trackRawTag: 'Rt$nj#'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'wJhQx4DH1qn&]L%y', trackRawTag: 1317152682409986}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'yFpxmW6h4', trackRawTag: 5864300199542783}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/id').query({id: 'jo20D!CqPby', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/id').query({id: 'gYY(^$58NY^HYuc%LX', trackState: 'hckuMq'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/id').query({id: 'TYg!JD&FZ]', trackState: -6090109283729406}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/id').query({id: 'lIO$ix', trackState: 8808509680386047}).expect(400);
					});
			});
		});
		describe('/artist/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/ids').query({ids: ['HDp@EJRFjvSm3WaDW8m', 'hzN8^c']}).expect(401);
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
						return get('/api/v1/artist/ids').query({ids: [']AdNaI', 'ePQDD*a$#EZ8aw'], artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['(%J!be', '2L([hfgpGCJ$VZ'], artistAlbums: '@j14rCmuB5YLes*IVM'}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['attfENW*)V7AUjf4t', 'z!x*!g607Y'], artistAlbums: -2353576508653566}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['2z](](', 'Rsrg*DzhPj!i!'], artistAlbums: -5598971842002945}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Gb20#Zpnn', '0RIwKML1HfYLAJcEo'], artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['9GDdeYMN#@t$H7o9Oa', 'xiV])[E7OQIO^7Jyn^zJ'], artistAlbumIDs: 'U)lrTmuSAVG&uPp$Jefm'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['tYPdV5B&f4r3XOJ]', 'c%xX$!&QWGEe'], artistAlbumIDs: -4550057089040382}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['%aoy#]FQvfKf', 'AyJSvu(%0d7i3fMm]e8'], artistAlbumIDs: -1705483073224705}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['sFBDZn9gVlc^hsdbK', '5bqbx*][JkE6YgPYl73t'], artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['l*DuWl#nG', ')JJDoj!3UTzdLj'], artistState: 'UOJXjj68xY(@3I'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['t$TPnmKV1e', 'iehqAkc[hs9w3^cz'], artistState: -7163313230184446}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['d5HlB[k]f8L$QXPmR', 'T087KwLKQL'], artistState: 6823740272803839}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['8G#fa18E', 'bLpbb&AHWx1Fo@oOEtf)'], artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Ar(AE$uPRMF', 'URc&!yv5xfA$lAyo'], artistTracks: 'Yf1TeS'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['vronlfS2O#z%', 'oRL9LOW)p5Y'], artistTracks: 8787173134303234}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['pPORmp%[8z', 'v2q!a'], artistTracks: -5653863528923137}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['^UjlsfIOe]^AfqMOq', 'd%eSgg(5[V'], artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['pg[b$Y^ChUnu]&uL#tJk', '26]e4T!^bUCUU%LK'], artistTrackIDs: '&@shRNhK@^xsU06VS'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['^QFIXRs5M%rP9Ob4wg92', ']99jN42Hy4c]o'], artistTrackIDs: 7022803240878082}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['mJDySoK7ne[y^EO3x', '^f4b5(36pnbRo#027TnC'], artistTrackIDs: 1197575772307455}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['6s(O@cBKC1fHwrc', '@dE&02QjGyDvJpY!o'], artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['^b@Tw7Ha^^59beZg', 'MBAc#!HojV3dbBU(%xA'], artistInfo: 'vj)@s]'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['rb7s$*[i23tGv0lk!wt', 'll[2Bv'], artistInfo: -8455819993546750}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['KmrZ]PQMLvz1InDk9Qs^', 'Mtn9MmO0M'], artistInfo: -8928834741075969}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['PekqKci]uYTcSIS', 'T!tAs4hrB)qk0x[n'], artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['vRzMygvS[j!Iiw', 'jl$vkNJ*wC9gQHORteKf'], artistSimilar: 'T[r1iA!'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: [')d7BdkMFF1ZGsny0iV', 'QOapR%*'], artistSimilar: -338731332534270}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['bWOBlhisM', 'd](PtuWE!qVhYO*umi'], artistSimilar: -6224800628342785}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['uvj7D*B%cc&QGH%feyQ', 'Oy)pbOpm9B6%PC'], albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['cdlLsty', 'Gpp8cKqW&8o'], albumTracks: 'c&)Se^o(3hldSGecK'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['j5T7a2D', 'mTs9EQQqqeFZJTK^P25'], albumTracks: -1804783014903806}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['R4T]WnQNTSEz', 'Ic2FM9'], albumTracks: 8212689356587007}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Sbk7Fh(]RWO#', 'BeGgEkn@JXb'], albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['!dP1pPmEyxYJo8R#G', 'CiW7ttdYo'], albumTrackIDs: 'HG@4g'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['n!(5n6', 'V&Im%'], albumTrackIDs: 7258955961073666}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: [']0#rMeRaTKU)!5uM5', 'vF8%af9FblX$cG0'], albumTrackIDs: -8429423711748097}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['t$nwr&*jX#q(X$GST3f', 'uO9rebm*%R1bY'], albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['AypQ!k', '0C(IQm8'], albumState: 'k0ZKJeg^AR'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['(vhhhj8L6Pz9', '&BiNx9zb'], albumState: 1524608817692674}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['FSVRGPtG0J*jY@dW', 'HQ^jt]'], albumState: -7890565605621761}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['qW@o1iWi0)', '4O4yC#bkro['], albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['%][K9tBCX4zD%u2&T0DQ', 'GBD^dEZ%Lv)'], albumInfo: '3KvVz@FrRz'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['ip#x$mViYX', 'tOd]gfXdka5B4SAM%K'], albumInfo: 1822659285352450}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['c*4d2Dj9h4z)Ds^', 'PPPfJ2U6NY'], albumInfo: 4916961788035071}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['2tx1Jl)b', 'FMo1uqV0'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['qVYRd[@a', 'O6TVXvJGZa'], trackMedia: 'qPVSfy3y'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['cowq)5', 't[1noppK@Hb%Mzs*N6D0'], trackMedia: -8965574419808254}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Sqc5349incdK1TH', 'W[cNdv8rU3M4QJ9$7'], trackMedia: 2260501690056703}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['7sIqw($', 'P&&I$%AdP2YJ'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['MS[sgM(C[b', 'yZWGTS%EUHEQ)g!me'], trackTag: 'uHopQ]k8ZE@j9#qZ'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['!okh$VlQKG01g', '[9EqSTAABr'], trackTag: -978725369806846}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['sA2p[RA', '70#X(vsu'], trackTag: -4114674505220097}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['UABpQ4L1fg6wq4kFgH', 'TszXkfN#'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['VGENett8x@W1n7', 'zZC&znMW3]Lfn'], trackRawTag: '82VG@BLCKK'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['&at7%8Er82', 'AQqYC7RLP(6)To2aHDDS'], trackRawTag: -1162280599289854}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['qpQBsvH%&CtY3vH@]zb', 'XOwf$6aDaELHuyx#X'], trackRawTag: 4486359494426623}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['L3Om^)HdEiue', 'rDe9vR(K'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Zp@#86jF94CT2mGrK^nm', 'VaI0Id%3ZTB'], trackState: '!37xU]YEfewofYR@f'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/ids').query({ids: ['Oc#owI(', '0$^!J!Jg)'], trackState: 1101335780917250}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/ids').query({ids: ['BECyY1Wr9IN9myD]OEl', '8l^esg2kH]'], trackState: -1307454881136641}).expect(400);
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
						return get('/api/v1/artist/search').query({offset: 'iL*G(bJbl(2v%MM!h%'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/search').query({offset: 75.02}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/search').query({amount: 'jfHBm'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/search').query({amount: 27.75}).expect(400);
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
						return get('/api/v1/artist/search').query({newerThan: '2GcQsHH%yc[v4tF%@u'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/artist/search').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/artist/search').query({newerThan: 38.72}).expect(400);
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
						return get('/api/v1/artist/search').query({sortDescending: 'PZYO3c'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({sortDescending: -2518524958343166}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({sortDescending: -3919207070695425}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistAlbums: 'DuXIHr#ZFh8wHv0['}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistAlbums: 1275041790558210}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistAlbums: 2477906513100799}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistAlbumIDs: 'CxGuv!4WIEW21)9B'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistAlbumIDs: -6805849024495614}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistAlbumIDs: 5341438212571135}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistState: '3tabnYzE#M#U@q9rByt'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistState: -3268314038009854}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistState: 7255510747185151}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistTracks: 'j^u#R1VD'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistTracks: -1754897556963326}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistTracks: 2609686520004607}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistTrackIDs: 'iOB!!S6dndMC4Qgai0T'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistTrackIDs: 6140455737622530}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistTrackIDs: 8369983000150015}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistInfo: 'AJk$@)%DTR'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistInfo: 4937359879569410}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistInfo: -1091700135034881}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/search').query({artistSimilar: 'OZE[@(oGANahK%f'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({artistSimilar: 8270253490438146}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({artistSimilar: 6557402430177279}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/search').query({albumTracks: 'lmArhmjlY$('}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({albumTracks: 9003549606281218}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({albumTracks: 1727053359480831}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/search').query({albumTrackIDs: 'C$5Z&kawgyFdnbPG'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({albumTrackIDs: -4470936409473022}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({albumTrackIDs: 7752716898009087}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/search').query({albumState: '[seRclWbWW*KQQw'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({albumState: 5941837130891266}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({albumState: 7440991569051647}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/search').query({albumInfo: 'EV1zGI&nR3'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({albumInfo: 4318834706087938}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({albumInfo: -1492521003778049}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/search').query({trackMedia: 'Eh7xJmJ(90TuXk9sM!PF'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({trackMedia: -1361123622256638}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({trackMedia: 8652954835877887}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/search').query({trackTag: 'mhc*rzA$5$PJ9SgjWyZf'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({trackTag: -8367130508525566}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({trackTag: -8720041944023041}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/search').query({trackRawTag: 'JcgFFU$mN$qtmz5slNE'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({trackRawTag: -4936124912893950}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({trackRawTag: 4427464679882751}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/search').query({trackState: 'k@6j8!9FJ*Ojv]'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/search').query({trackState: -7369309747675134}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/search').query({trackState: 4402356254932991}).expect(400);
					});
			});
		});
		describe('/artist/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/state').query({id: 'IRF%LRHy[uGN'}).expect(401);
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
						return getNotLoggedIn('/api/v1/artist/states').query({ids: ['0]2)DG7aMrSA1bOdMfA[', 'QrMHDsBbqWOQ']}).expect(401);
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
						return getNotLoggedIn('/api/v1/artist/list').query({list: 'faved'}).expect(401);
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
						return get('/api/v1/artist/list').query({list: 'recent', name: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumID" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', albumID: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', albumType: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value invalid enum', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', albumType: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value null', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', albumTypes: null}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', albumTypes: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value invalid enum', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', albumTypes: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "mbArtistID" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', mbArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', newerThan: 'o[975)$BVcWxW*Z*w'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', newerThan: 90.38}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', sortDescending: 'mwCrWCFsh*'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', sortDescending: -1617529961185278}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', sortDescending: -6832441859768321}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistAlbums: 'o@zQl2C$8jt#&'}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistAlbums: 6069590740172802}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistAlbums: 7705230678425599}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistAlbumIDs: 'aP5lA'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', artistAlbumIDs: -5920629341552638}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', artistAlbumIDs: -2308150283730945}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', artistState: 'EWSzeFE'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistState: 4145290147790850}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', artistState: 1809131086282751}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', artistTracks: 'xoVAw(3^[W96wNw'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistTracks: -5449651180273662}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistTracks: 8196355591766015}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistTrackIDs: 'mHmecT]4tX@jZ!YP0)'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistTrackIDs: -101478031163390}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', artistTrackIDs: 4017418724704255}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistInfo: 'XBTXpUwWzk(@AYFBjGDk'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', artistInfo: -8892057938558974}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', artistInfo: 8455984603201535}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', artistSimilar: '1$1pRe4#CNtwvaI%KN'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', artistSimilar: 478941127114754}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', artistSimilar: 7591655720878079}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', albumTracks: 'CVLMfZYF&tz'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', albumTracks: 1053764551180290}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', albumTracks: -6400885366194177}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', albumTrackIDs: 'Zv9%GOW2'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', albumTrackIDs: -3702319204007934}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', albumTrackIDs: -2662705362108417}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', albumState: '9Ngq^qAKX5d'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', albumState: -2754833031364606}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', albumState: 6919011711320063}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', albumInfo: ')%170hqzY$rZp#S(5xy'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', albumInfo: 8331016192131074}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'random', albumInfo: -157159107067905}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', trackMedia: '!Fs4CKJ0C'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', trackMedia: 4847477563850754}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', trackMedia: -1244719556329473}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', trackTag: 'P(Kkz3feV8'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', trackTag: 542525089644546}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', trackTag: -8359930612416513}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', trackRawTag: 'XaoQvT'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', trackRawTag: 4465688336924674}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', trackRawTag: -3672997881708545}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', trackState: 'mlGwM5hbZk7R7sYKdC'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/list').query({list: 'recent', trackState: -6025250479276030}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', trackState: -5907193815629825}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', offset: '&1HGYe'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'faved', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/list').query({list: 'random', offset: 64.36}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/list').query({list: 'random', amount: 'uPX)glO[KT'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/list').query({list: 'avghighest', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/list').query({list: 'highest', amount: 38.02}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/artist/list').query({list: 'frequent', amount: 0}).expect(400);
					});
			});
		});
		describe('/artist/similar/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/similar/tracks').query({id: 'Rk&7H'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'KvTtjfLl', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'zPUM)$CFPrU', trackMedia: 'tOjFBka0rxMfPZPB96'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'y$tFmvXW@]gPJU', trackMedia: 6659699260784642}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'q#X#r^GCsG^0[', trackMedia: -3249241006800897}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'JmrT!OUd%#JW', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '6C2xiU%MPLv$[U9oME', trackTag: '#Z9sv#R@spc'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'Pi2o@4V7wg', trackTag: 7760913973116930}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '&KAnJ', trackTag: -7849673503014913}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'uI[gRijEpq[$HAC', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'h%Ou6e^)Dw%n6DL', trackRawTag: '8)EwlT9x6#wYx9Jv'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'dM*06bJ@XblJdtsG', trackRawTag: -2633330902171646}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'ppRul&', trackRawTag: -7338252809797633}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'ksS%Ai^%&sTf', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'P*JSX!97@QG', trackState: '#xl3%cm'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'xifjNAtQ[sd1cyeTs&1l', trackState: -6459225412730878}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '^fOBp61isH8', trackState: -1382591336808449}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'aRXSd', offset: 'a2RpUFpWt%r)'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '@Zwrx', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '2[G[Of', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '*MgL8mPT8Ybj&5gm)s', offset: 49.23}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'kBs[hKAi&a', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: ']$Y)Cym2DN])2icg', amount: 'wW)QFG1rTJU'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: 'vZ8a^8x%gttzV', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '1iU0ae!VoUcx$Kp)N^9k', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '^(&NxGuegV3w4', amount: 58.26}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/artist/similar/tracks').query({id: '[2k#c0z]', amount: 0}).expect(400);
					});
			});
		});
		describe('/artist/similar', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/similar').query({id: 'xHltNsV0yOk('}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'Vt*1tG', artistAlbums: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '2*Ok#1sqA60UdCl%', artistAlbums: '@Fp8]qG)o*0TeKcJrvv'}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'v(ZD((GS', artistAlbums: 3158404470145026}).expect(400);
					});
					it('should respond with 400 with "artistAlbums" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'lTr[cWNxC]pYFhIkn*', artistAlbums: -8896645928321025}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'FgG4H2', artistAlbumIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'sgy3ijO6]VSGn', artistAlbumIDs: 'kWzSC@@6yO4m'}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'bE8X&c&w65', artistAlbumIDs: -3692661487697918}).expect(400);
					});
					it('should respond with 400 with "artistAlbumIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'BclQn%!1#FGr', artistAlbumIDs: -2936667333722113}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'So(j^*AGAYp9roHh', artistState: ''}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '*2EL9uV0c)O1trg4mIdL', artistState: 'GCk6l'}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'ZG14[BuC20%S46HE##$', artistState: -7218891910545406}).expect(400);
					});
					it('should respond with 400 with "artistState" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: '4yj(rql', artistState: -2505687137517569}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '8*WEb8R3$DlyeC]^Ht(', artistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '0!V7ZxH52j', artistTracks: '*%mOq18SwslZ]u'}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'tT85cww', artistTracks: 3786998770827266}).expect(400);
					});
					it('should respond with 400 with "artistTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: '(mf27kNdVspfgOTp', artistTracks: -3227964216967169}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '5an*9g]a)Jbpd#Xbf', artistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'Skla#%D)70e]S5xJG', artistTrackIDs: '(!u8g]H2e71j^b8zZ%'}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: '8L0)OELUx1RZXW283YuZ', artistTrackIDs: 2140524605603842}).expect(400);
					});
					it('should respond with 400 with "artistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'gy^vuVGgR&96)KiLVFSn', artistTrackIDs: 7771687902773247}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '&rNFSu', artistInfo: ''}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'xxh]h&FHrj', artistInfo: 'QvYfJV4QPE8E1$6)H01f'}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: ']rm@KVlB', artistInfo: -1513994774904830}).expect(400);
					});
					it('should respond with 400 with "artistInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'Z@w*(5rz1JIIGbzA3&d', artistInfo: -5020526070202369}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'jQIduh5%n(!SYo9', artistSimilar: ''}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: ']!txOax', artistSimilar: 'NdCJ8)tV7dP'}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'OOnMlsYldhMZ]I', artistSimilar: 5003969344569346}).expect(400);
					});
					it('should respond with 400 with "artistSimilar" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: ']T5w852z8IB(g3gCcdA', artistSimilar: -680326175129601}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '6rdUh', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'YgF[U8muEwz', albumTracks: 'jhqDLn2'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'eNvLm[#O6E&[', albumTracks: 6311270059868162}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: '#x!XR', albumTracks: 1598449430560767}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'kQNU$JQvjod]V', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '2!Ao[@lRL(WrK)w', albumTrackIDs: 'dA^Yb&8EN!s^m'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'Qt5J@!wZ^wZwzi', albumTrackIDs: 6940443866562562}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: '6BdYY5HVG@!', albumTrackIDs: -2514776525635585}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'W*)H2nz8lry)EOXari', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'Mh[x$zE)%@$', albumState: '7]xs6py1QsEJm$tPj(j'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'Jy$O)lJSN6sDARRO', albumState: -3545144070504446}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: '0F4RNeDm)UD(1&KZW4', albumState: 2140919205724159}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'DpTYDWr7ex(p0SDRs*', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '$sz4K6oG[Z', albumInfo: 'VZpLqCUPVTY%)@Bc&u'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'dggusbHqg', albumInfo: 6707211833180162}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'L!dC0JZl]rz5]lhx', albumInfo: 1291881312944127}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'zuwCAfc)l', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'Ghkya&e81[9bo^L', trackMedia: 'I#bvAWlGNzl'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'rpg@AWJET#6JNm(l*I', trackMedia: -4782147621617662}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: '2lWCq^buYjidDxqZ', trackMedia: 6517635676110847}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'hAFJH', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '0RGNw@GJbqER', trackTag: 'RRA2XwwHqrLD0M]3nO'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'p*VQxm^GvlnlGEw', trackTag: -8143225604800510}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'lF]JTC@sXr9JvYVitB]^', trackTag: 386162376048639}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'Wd%eMrCVwH4Rbnn(', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'Igh4jk]Mz', trackRawTag: '&8gi@qKnfy'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'whi3ZjV', trackRawTag: 6304009564454914}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'LOnyF', trackRawTag: -6090234156548097}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'HhMpY%eZ(MZB^[', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: '[Y0Of@*k3*gthw', trackState: 'iW$yNZAi$]jMibziF5p'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/similar').query({id: 'WFrdWQF[iSs0*1lAJ', trackState: 5842325016150018}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'ZyxgK*iCpLAyOGHH&5', trackState: -155707856912385}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'ZLHou#j24&1Hm', offset: '($%0lRe(ALA7blO!G'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: 'YMqF^jyUX', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/similar').query({id: 'C]SM4*]z6Fknvs[xZj', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/similar').query({id: 'd5zSfI58Mgb8KiIPwSL', offset: 47.13}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/similar').query({id: 'D!s@ET3ggExkUynMo8!', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/similar').query({id: 'R6nNT&4sIk3ybXf0c9F', amount: 'oZOKBwLW'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/similar').query({id: '5pp95m4*kLk@kei)Pa[b', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/similar').query({id: '9e6RFxR*g4$e7Hyscli', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/similar').query({id: 'WBa2uFS*NnBcc^S', amount: 14.33}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/artist/similar').query({id: '6)zrY@FST24#eMY20', amount: 0}).expect(400);
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
						return get('/api/v1/artist/index').query({newerThan: 'gP&mI%]u0CX8zuQG'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/artist/index').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/artist/index').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/artist/index').query({newerThan: 27.41}).expect(400);
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
						return get('/api/v1/artist/index').query({sortDescending: 'g6[50oM'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/artist/index').query({sortDescending: 5066280537161730}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/artist/index').query({sortDescending: 3286027942756351}).expect(400);
					});
			});
		});
		describe('/artist/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/tracks').query({ids: ['ipOCV[MYY', 'wI@ZRo]sN6y']}).expect(401);
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
						return get('/api/v1/artist/tracks').query({ids: ['g3ax5J', '^VJ@VPjp'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['*^PY!ld8kKj4VYWGTDDP', '9qpTKOBFJqnL$X&236n'], trackMedia: 'bXpEGV'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['JT^b&KNug', 'xa86avjtS[]%9v]@Hb^'], trackMedia: -6376640233865214}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['2V^i2Iv2Ut', 'Ax&)f458FGcggBRfL'], trackMedia: -7998359516217345}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['!GFT$9YmgOF%l', '#&cLOBlrz#mg'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['O#31AoxC[4m0bqb39u', 'AvayT0#Bj[X!Hn3la'], trackTag: 'Ar5aI(Kk6@vqBFC'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['##])WMt[l', '9)YLlF'], trackTag: 6595174411010050}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['z%!qX00RiK3pUzu2W', 'ct8sgPq2v&z3w2oX*(ii'], trackTag: 7373046130147327}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['SvYe*ONxx^Iy4E^qkJ(]', 'u[Nrg&'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['szDxfPyW', 'c[thfD'], trackRawTag: 'F$I$XMJ1tFhls4)F0'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['1!I#P59#(QMV^Opssr[', 'r%k3*qiKFpmk'], trackRawTag: 5146338454929410}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: [']S0g0CXcbeDwn9Gi3ua3', '!$Ka6)f)GH1n'], trackRawTag: -1698355147177985}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['okAWvNGB(b&msJJ', '[ag4n'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['7YTjkfRAR', 'Pw2*pJ5AV7X5ENRE'], trackState: 'pLAsyJ0D6gt08xgnHSg9'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['gfgz#$SB@4Od', '(Epv8i3'], trackState: -8294999716265982}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['%7W$@D7yF!7OJ', '1Ck1#hHTZLqX%YOYr1lN'], trackState: -1501592108924929}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['$]B4w', 'FoPs]!9Fs1Z]r4dSDx1'], offset: 'v#5iB#'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['b[#$(Iq[BNaT2oJri', '#t3zmPo]%WVy'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['7qk]!5om0TMDd@W6]7y', '$s66A'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['4swG%]cg1Rwj5MloC', 'kRNAwn7J@XVEdNx'], offset: 58.15}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['0Q6lK[', '$rezrO[3uX'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['S6Fy]u0Gv#QySqeYW', ')QCFnvvrqNAu6'], amount: 'oi&yGyC$GgbB$8![]oM'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['A9]YIiRE*nPhu', '^op3qkXaYI1R5JQY3'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['v@^Gd)jZpy8T@J)', 'KU6PQEtr0hqjIc&V8%O'], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['3PS!9US3i%(', ']Vf34'], amount: 66.01}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/artist/tracks').query({ids: ['@ey[gC1vN!HZZ)z4', 'X^SPbB]%(XPHr(E('], amount: 0}).expect(400);
					});
			});
		});
		describe('/artist/info', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/info').query({id: 'MUvb9d^#8I#L!89fA5pb'}).expect(401);
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
						return getNotLoggedIn('/api/v1/album/id').query({id: 'kZm6*QL!Oy#OE7dN@eC!'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'UGyHO', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'd(r*%h!L%', albumTracks: 'UI@H3M1LZ'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'K1VrB]qy', albumTracks: -6499711506710526}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'lbNBnI', albumTracks: -8201770002022401}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: '0m%%USE&Vn3Au]', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'b359Q2@60Uy5f&4zk%6', albumTrackIDs: 'EkA@##p'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: '5Oh7f]giCkSXr', albumTrackIDs: 8794936979750914}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'lhtY%ASJFE', albumTrackIDs: 3234053767561215}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'YxwxXz5@aq[d', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'nRiwQL13Co(yu!JiY81', albumState: 'k[)9r1oEtbsL0([xf&y'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'y1DNKuXrWj[)Eo$b', albumState: 1548468749336578}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'br8E%6blh', albumState: -145063350894593}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'wPGRsN1tGFD9$FW]Bu7', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'ArIN]', albumInfo: 'Wy%EbOpW'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: '4u9gk9K%k%Yn(t$', albumInfo: -923489947090942}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'RzoedwWohh%F', albumInfo: -2564764962127873}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'v2!JPF%Nrz!&Q5U%', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'dozb560!MfOPH!hy^', trackMedia: 'oAH&UBW'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'oXDSh%ao$H)', trackMedia: -4733715099942910}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: '7^P7bXM6$hNkAi5bldq#', trackMedia: 3278828017287167}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: 'upz]U9ww&fz', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'GXFeK#)G0cJ', trackTag: '%2!)yqreo!C6uT'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'yjkuZt&45Cz&', trackTag: 737270487318530}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: '(IKtn%9KeAmiEvo', trackTag: -3934038066724865}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: '[IbD&3U(', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/id').query({id: '1h3yX6Oy', trackRawTag: 'mb02uK^'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'ZQ@dS%KmWmV', trackRawTag: 7692119531585538}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'aJ)Lw55#JZhChHeNy', trackRawTag: 2231555078488063}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/id').query({id: '@P^rns@)0C^#qT%oI@b', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/id').query({id: 'ad^p%gA%4$F!EPHmCp9', trackState: '&lO$f0bowR)wJ1DLv'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/id').query({id: 'cz^mNl7^jp[4UnXwF(S', trackState: 5872970933207042}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/id').query({id: 'JKwAxrPNaw]dkZzu', trackState: -8979249293688833}).expect(400);
					});
			});
		});
		describe('/album/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/ids').query({ids: ['&F[ZrUWlu8e#ogZc', 'u!LtIkakc!6chk']}).expect(401);
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
						return get('/api/v1/album/ids').query({ids: ['2zsFKsxoYXiMy', 'BI&@W2sa55MTk#w8'], albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['Y4spdzv*3pRjj5MlA8', 'a!b0VYbC(k0CucbB'], albumTracks: 'bH)KofG$mNaI'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['$Xr[1IvSRlO', 'nvG%0'], albumTracks: -6894292916240382}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['G*h8[8$KQsnvK', '*D#MGG*P14&)&'], albumTracks: -5424788751253505}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: [']7kVe', 'sRSyQJwr$^DuXs6'], albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['34SRtnVT5AAbjq#E', '4eVk$'], albumTrackIDs: '^[p&0B$%l'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['f7IOW', 'J65RS0'], albumTrackIDs: -8282452363575294}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['GRGCBB(Sd)ipbPasfo5', 'EV4emD*S'], albumTrackIDs: -1007618428502017}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['#3^tPDFjzicNPZ9d', 'eG!^kIDp'], albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['*pop2H8kmsCuiDD2&', '8ES6tYCrV[oPwp!'], albumState: '!c6%ilq!Yy(mF]'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['pvZ7vT]&', 'Rfi@&$o6eR@Km[E'], albumState: 3667119745007618}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['Ucdroa)crpL4xRgzv', 'Esc$h!qfwA'], albumState: -441849688883201}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['On9nZQ', 'cqc91ZpUtp'], albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['%RZa1Q*4DMB]NO6(', '1yLv6M3K'], albumInfo: 'aD(Q6s9&[y5]'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['rIvE[gA)5c', 'dnNI]Xi^zhg7@VluM)'], albumInfo: 4401958194511874}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['iTrhc!(6C0RcIRqL@s', 'J2YXcjvNq'], albumInfo: -2784580650139649}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['rw2OludsH', 't7r$y8c'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['l&r]#lwImKUC@Zw0', 'Sx9j0)9C45fMEj76ncn6'], trackMedia: '!!hFYhY6ma'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['TAkswTl4&tTcfE*Fujmj', 'U)aa4HArA'], trackMedia: -1406980577034238}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['RbaQ0xTqXUS]kY2Y(hae', 'J3QI!1DlkV3p5d8s67O2'], trackMedia: 3232121401376767}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['IG%Mb#sZh^6rcgn1d', '7i#iyYk9Pa[Kq'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['[!av[KY%sl7iDy', 'l(aa]sXT'], trackTag: '$OHip(d2B'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['ULcuiAIQvnaR!z', 'kV(iwhLrnUjM5g@mogzj'], trackTag: 4724192155009026}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['Q4g4LgD', 'W5]w^NoGJr5oObi'], trackTag: 2495998836342783}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['^Uc*M', 'UKICi2O*JM359avpP$'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['(P&p5SN5Vvxq@^B&p', '5ueeQUh'], trackRawTag: 'wV70D7]@SOdJMjj0N#'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['^!5rUII1UxZsDBhV1', 'UEtEl0Ib%oOJ4Bh6'], trackRawTag: 4179288509120514}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['87^3Sk5Gk]jec]aaYmj', 'nPrdtixPqkco'], trackRawTag: -5217763647815681}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/ids').query({ids: ['FPBXQ18Alx', 'Zvkjxe74E[(*g8AbReU$'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/ids').query({ids: ['[EtWu6aX#', 'J4dA1'], trackState: 'ql%gP]kqxO5bnJp'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/ids').query({ids: ['JI!aDI(@Nr&', 'D8DrTrBeCF'], trackState: -2009490283036670}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/ids').query({ids: ['t37RPqwdkkX', 'Gq0mct4!zfL#SibCZ'], trackState: 2411332024401919}).expect(400);
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
						return get('/api/v1/album/list').query({list: 'random', offset: 'COrNc(x1UkSwW!68bx@h'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'faved', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', offset: 20.09}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', amount: 'iLuhAaA3$nZz6'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'faved', amount: 36.46}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', amount: 0}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumTracks: '^tu3GTohN4d'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumTracks: -1222585094242302}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'highest', albumTracks: 6830887073218559}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', albumTrackIDs: 'zsOGHr6rQoSvKj2OF'}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumTrackIDs: 138403597254658}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'recent', albumTrackIDs: 4478883030106111}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', albumState: 'Rsi&^XhM(PJ'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'recent', albumState: -640525543669758}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumState: -8314371532914689}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', albumInfo: 'c&MHVAc0M7ylCm5'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumInfo: -5117415016890366}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', albumInfo: -422754977316865}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', trackMedia: 'Bhjqd$'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', trackMedia: 1909944030855170}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'recent', trackMedia: -2301441502871553}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', trackTag: 'xm@lR%5QlSL&JD8p6'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'highest', trackTag: 2292478078091266}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', trackTag: 6759325108273151}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', trackRawTag: 'hyR*ELaZdv!qxgkm^^f'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'random', trackRawTag: -7827446317449214}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'faved', trackRawTag: 1292538405191679}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', trackState: 'sL!T^y!83Np7%(&r[1'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'highest', trackState: 6566723343876098}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'highest', trackState: -792478781276161}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'random', name: ''}).expect(400);
					});
					it('should respond with 400 with "rootID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', rootID: ''}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value null', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', rootIDs: null}).expect(400);
					});
					it('should respond with 400 with "rootIDs" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', rootIDs: [null, '']}).expect(400);
					});
					it('should respond with 400 with "artist" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'random', artist: ''}).expect(400);
					});
					it('should respond with 400 with "artistID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', artistID: ''}).expect(400);
					});
					it('should respond with 400 with "trackID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'random', trackID: ''}).expect(400);
					});
					it('should respond with 400 with "mbAlbumID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', mbAlbumID: ''}).expect(400);
					});
					it('should respond with 400 with "mbArtistID" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', mbArtistID: ''}).expect(400);
					});
					it('should respond with 400 with "genre" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', genre: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumType: ''}).expect(400);
					});
					it('should respond with 400 with "albumType" set to value invalid enum', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', albumType: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value null', async () => {
						return get('/api/v1/album/list').query({list: 'random', albumTypes: null}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', albumTypes: [null, '']}).expect(400);
					});
					it('should respond with 400 with "albumTypes" set to value invalid enum', async () => {
						return get('/api/v1/album/list').query({list: 'faved', albumTypes: [null, 'invalid']}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', newerThan: 'tmq1[H'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'highest', newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'random', newerThan: 65.95}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', fromYear: 'lLFFq(#5'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'random', fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', fromYear: 41.02}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/list').query({list: 'faved', fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'random', toYear: 'oESjUARK*h7^I%59'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/album/list').query({list: 'faved', toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/album/list').query({list: 'frequent', toYear: 38.65}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/list').query({list: 'random', toYear: -1}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/album/list').query({list: 'recent', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/album/list').query({list: 'avghighest', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'random', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'faved', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/album/list').query({list: 'recent', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/album/list').query({list: 'highest', sortDescending: 'ygk^4&d]hj!M[@)fuUS'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/album/list').query({list: 'random', sortDescending: -3579897272336382}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/album/list').query({list: 'random', sortDescending: -8000724621328385}).expect(400);
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
						return get('/api/v1/album/search').query({offset: 'uIrAx2'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/album/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/album/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/album/search').query({offset: 77.95}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/album/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/album/search').query({amount: 'qf4GI'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/album/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/album/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/album/search').query({amount: 22.25}).expect(400);
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
						return get('/api/v1/album/search').query({newerThan: 'y@B!yqSO9spEfK[L5J'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/album/search').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/album/search').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/album/search').query({newerThan: 50.23}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/album/search').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/album/search').query({fromYear: 'mhG$Is0wJvZA'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/album/search').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/album/search').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/album/search').query({fromYear: 67.21}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/search').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/album/search').query({toYear: 'LlzXBT43XCP5NBG]'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/album/search').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/album/search').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/album/search').query({toYear: 93.18}).expect(400);
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
						return get('/api/v1/album/search').query({sortDescending: ')kRoR]!'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({sortDescending: 2951043579117570}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({sortDescending: 6928034942681087}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumTracks: ''}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value string', async () => {
						return get('/api/v1/album/search').query({albumTracks: 'p$3D^2[!djEByXwew'}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({albumTracks: 1335047625900034}).expect(400);
					});
					it('should respond with 400 with "albumTracks" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({albumTracks: 4441866284040191}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value string', async () => {
						return get('/api/v1/album/search').query({albumTrackIDs: 'Z2#8xK@5U7q['}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({albumTrackIDs: 8356522945937410}).expect(400);
					});
					it('should respond with 400 with "albumTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({albumTrackIDs: -8537152052789249}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumState: ''}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value string', async () => {
						return get('/api/v1/album/search').query({albumState: '[*RNfWWonJ2L'}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({albumState: -7566690816622590}).expect(400);
					});
					it('should respond with 400 with "albumState" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({albumState: 2010113216872447}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value empty string', async () => {
						return get('/api/v1/album/search').query({albumInfo: ''}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value string', async () => {
						return get('/api/v1/album/search').query({albumInfo: 'YWcXvLk$J'}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({albumInfo: -23325359210494}).expect(400);
					});
					it('should respond with 400 with "albumInfo" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({albumInfo: -4478869419589633}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/search').query({trackMedia: 'i15bQmO'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({trackMedia: 7618074630946818}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({trackMedia: 4948736652345343}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/search').query({trackTag: 'zT%Ec'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({trackTag: -1814204256354302}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({trackTag: 5145858223898623}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/search').query({trackRawTag: '8b^tpmLT5[@l7a#LN'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({trackRawTag: 5953103895461890}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({trackRawTag: 7189999392915455}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/search').query({trackState: 'apyTuADkoXd*]d'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/search').query({trackState: -7981667109044222}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/search').query({trackState: 1453231330820095}).expect(400);
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
						return get('/api/v1/album/index').query({newerThan: 'XM$^smm*TUNw'}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value empty string', async () => {
						return get('/api/v1/album/index').query({newerThan: ''}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value boolean', async () => {
						return get('/api/v1/album/index').query({newerThan: true}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value float', async () => {
						return get('/api/v1/album/index').query({newerThan: 57.12}).expect(400);
					});
					it('should respond with 400 with "newerThan" set to value less than minimum 0', async () => {
						return get('/api/v1/album/index').query({newerThan: -1}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value string', async () => {
						return get('/api/v1/album/index').query({fromYear: 'zauby8bS8Z'}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value empty string', async () => {
						return get('/api/v1/album/index').query({fromYear: ''}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value boolean', async () => {
						return get('/api/v1/album/index').query({fromYear: true}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value float', async () => {
						return get('/api/v1/album/index').query({fromYear: 34.82}).expect(400);
					});
					it('should respond with 400 with "fromYear" set to value less than minimum 0', async () => {
						return get('/api/v1/album/index').query({fromYear: -1}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value string', async () => {
						return get('/api/v1/album/index').query({toYear: 'eHAqUT%$P2bCBw'}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value empty string', async () => {
						return get('/api/v1/album/index').query({toYear: ''}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value boolean', async () => {
						return get('/api/v1/album/index').query({toYear: true}).expect(400);
					});
					it('should respond with 400 with "toYear" set to value float', async () => {
						return get('/api/v1/album/index').query({toYear: 59.55}).expect(400);
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
						return get('/api/v1/album/index').query({sortDescending: '1X6Mvw'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/album/index').query({sortDescending: 4007311991373826}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/album/index').query({sortDescending: -7259745660436481}).expect(400);
					});
			});
		});
		describe('/album/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/state').query({id: 'c5Y@o$kLG(BsE$Pc'}).expect(401);
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
						return getNotLoggedIn('/api/v1/album/states').query({ids: ['eK!y(Qc', 'Eh9yyw$']}).expect(401);
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
						return getNotLoggedIn('/api/v1/album/similar/tracks').query({id: 'NIoW%mQMkRv1'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'P2FgOfKqEZGSS', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'Swh34EVBIc(dmWr1Z^P', trackMedia: '4xID)F'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '1mj5j^zgvL0%', trackMedia: -3573484718391294}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'C9vVbD9e', trackMedia: 8130166609936383}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'k6uN^E94', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'T6lgxVZn', trackTag: 'r@bl1kx$Xq7mL5[N)OBP'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'i45O$9ismhTXqJ', trackTag: 5333460289847298}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'cag13fFw9VkRJf', trackTag: 5660474905460735}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'BLO5GBhCL', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '6ySIhUp$XyVO5#Kr', trackRawTag: '4Kc@6qnRBVuY'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'w0F)DFCQ', trackRawTag: -8737578907860990}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'CV^B$2dN&o@SHWDBVMX', trackRawTag: 2867179171086335}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '@5I2w3Qf@Cof', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'lBB9rU^mniuP6', trackState: 'Y7ASba@XrJ#'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'L96Xwe9cl8fE', trackState: 1778567666991106}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 's*WVz1epVU1Ge', trackState: -8426493306732545}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '86(so(8wfef#A@)e', offset: 'P8Pjf4zCf'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'mdAUxWXF]', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '7l[SMNB[9AS$KPaAL', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'zK1qp5HqWHTP', offset: 39.85}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/album/similar/tracks').query({id: '(XuXj', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'xJbTY3e4^f2lxk^uCx', amount: 'P)JM[%4[GMuJ15(O]#'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'iIw5y%Efa', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'br(!b!a1X', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'ofW!]McVP', amount: 69.98}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/album/similar/tracks').query({id: 'PNm0zr', amount: 0}).expect(400);
					});
			});
		});
		describe('/album/tracks', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/tracks').query({ids: ['d#pG#8yfJo', 'WcV!VIvfSSdzrVZ&!']}).expect(401);
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
						return get('/api/v1/album/tracks').query({ids: ['O[7DU0cN]39MFYn[5y', 'uC0s61HieYZ20b6zw'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['%9DSq&D&SJj*y', '84m7G3$AC^4%0Q5'], trackMedia: 'bEKhkxn%DdlfE'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/album/tracks').query({ids: ['AQz^x5f$!)U)A', 'vbjH&ubMe'], trackMedia: -3323271218987006}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['[]Z1MWu', 'JyvxaVuxtFh'], trackMedia: -5808206865498113}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['rmYR5)g09iWI6&fg', '4I0unpJB#g&'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['J1K!jBV[JVx2gkB', '7q6e05TbIW8MIptTEK#'], trackTag: ']I%X#lLLaMoq36Mqwv'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/album/tracks').query({ids: ['lO$@0vsrAm0PN*T', '5#e)A7P*@UX@g!1fgM'], trackTag: -5821930074537982}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['sJZbFKR', '(gwb&WvYzTQ0iqM'], trackTag: -1258083846193153}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['p37FbdO#9L(', '1B4$[gFQNp0)^*Zb'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['0Vzf3hAha', 'kj#zRc&rd[SdStX'], trackRawTag: '@YknftSAn01o6d*OUw'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/album/tracks').query({ids: ['CcD*kju', 'TES%E0VM'], trackRawTag: -6997503794741246}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['HKhoC]k7bdFoM', 'XF*ip'], trackRawTag: 6428619647746047}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['z&CNWIS&JUO', '^ZrVWseu^vm&9obH4I'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['RG0crZkG]Q', '(37wtnF&qO5i1X6]WfQ'], trackState: '*kbtt]Z*H@@4[8Xjpspb'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/album/tracks').query({ids: ['yWk)vi', 'Pi%u*L6y1j5UT'], trackState: -2265912128307198}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['5tLwRE', '%p$n3(jP7Yq5'], trackState: 2196288615481343}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['kFkxBU]9RJy!f0Us', '8fxFU%9$5'], offset: 'cQEL]gZR7B%SJ'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['vJ&2Z$6UoUcuPQAz', '%273jBvhfb0Uu'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/album/tracks').query({ids: ['$wCuvw6g&F@q)X!&nP', 'km]1hUUT^$r]*x'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/album/tracks').query({ids: ['8@kX3h%PB3k', '3](#Ixj$i9h49'], offset: 21.27}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/album/tracks').query({ids: ['(2XgTk2Z', '6k3I89sjoiEljl*TI'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['5iGTSSUAq5MK(h234', 'Oe70NMeHJpxu4IhO'], amount: 'SB^or'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/album/tracks').query({ids: ['$f3D7%!4^KY', 'dn74Lr&^&J%27)zp)4!)'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/album/tracks').query({ids: ['fz8vHn7dJC^N', 'e5Ft]ard&8cdYvp9lu5F'], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/album/tracks').query({ids: ['W])P[^J1MBq4Ku#k', '37iT5!FCaEUm7$a9'], amount: 68.1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/album/tracks').query({ids: ['EVy6s5X2J@a', 'LBtacV]EB'], amount: 0}).expect(400);
					});
			});
		});
		describe('/album/info', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/info').query({id: 'bo5fy%Vs5Rk'}).expect(401);
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
						return getNotLoggedIn('/api/v1/playlist/id').query({id: 'qD9[RT]'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: 'Ih4mWNhC', playlistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'ne^iacG', playlistTracks: '9ER7B'}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'i%*EpsSf4m$#LK7CO5', playlistTracks: 7949856739950594}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: 'ZFnTZ', playlistTracks: -8934685161816065}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: '&jR&S4TaYS', playlistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: '4CoSkh(YL#kD4*', playlistTrackIDs: '#%Y[!^3qsxx'}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'gs&TTpMQwuWPgHc', playlistTrackIDs: -1834058258579454}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: '[SRzvnRY*p', playlistTrackIDs: 2906587366686719}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: 'S0V0KID$oMb(R', playlistState: ''}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'fZpLro', playlistState: '9nN)wlcSM7'}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: '%(ZLDO(O)hfh)bli3Xz', playlistState: 5936614610042882}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: 'XJABPs[wv5q4t]L3', playlistState: 4958469480251391}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: '&PB^KknejOqt', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: '8(TA9o*sEV&uu', trackMedia: 'ttSGdGtY]Ajhoyl7'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'j!DxFAjW', trackMedia: 2503853828210690}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: '5cg*bXG#', trackMedia: 7586269395681279}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: '7DZ[^', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'NihgkeBJnGd', trackTag: 'Yrr$IM'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'vKk[R@Ne0HjjfIf', trackTag: -119410551422974}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: '1W$I2(aKUS', trackTag: 7391760435118079}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: 'GaukdeGlIIB4%', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'fQW1msLehdhDWaqtS', trackRawTag: 'NL5mjYn^CTt)NJ*!a4o'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'NQ&%pShqwQv(WoBQzt', trackRawTag: 1076224575143938}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: '8!4tw5J', trackRawTag: 82836216348671}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/id').query({id: 'yUjDpQC1LTU&t45', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/id').query({id: 'rHeYmex$]b', trackState: 'Lr02IVPju4h2RKu]'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/id').query({id: 'wXu0C3Z@(*Qg', trackState: 4739950213857282}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/id').query({id: 'fg&]W^$qi', trackState: 1624189744185343}).expect(400);
					});
			});
		});
		describe('/playlist/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/ids').query({ids: ['l^yAA75I4BhRt870', 'X0Wq]44j*]c[!b']}).expect(401);
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
						return get('/api/v1/playlist/ids').query({ids: ['0[Hx7mcebEok', 'bWZ9G5hC]L4C'], playlistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['p0]28H', ')M$(Zua'], playlistTracks: 'rPA5&B'}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['MOe(vQs2PkKa@', 'EnCi)ONlnZvjd3^PgnJj'], playlistTracks: -2181947749040126}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['EnKl0hP', 'RasgRAdoX'], playlistTracks: -989619151699969}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['PC#!ogn8UfW]F#SqIC', 'aM8G4NOgqhS5H&qp6bc'], playlistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['AZKuTr*q', 'Q)WoYQHuK'], playlistTrackIDs: 'SE)KEaN1guOhj(o0gZ0'}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['8Q4A!Yki', 'R^homj'], playlistTrackIDs: 7202562155479042}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['XofJ[&', 'qpgzNOIb@A&T1wXi66U9'], playlistTrackIDs: 5152196240867327}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['vxwjY6H]', 'NG)@$b$oY'], playlistState: ''}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['0Mcu3RTsUSi', 'J(pp3Dp'], playlistState: '&FAyBx5g!5!p'}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['GVgs27n322cX5Q', 'oVatd'], playlistState: 8253956115398658}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['BLug]T6', '2mseFXzB4iy3AM$'], playlistState: -99340156665857}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['aUN4oaHAhMby*]', 'Z3JD[]!oqd3YPmTeD6'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['%MVbd*(t(*$&', 'JatULZWDRf'], trackMedia: '[*869rQ47Q'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['rpdpsHATh!', 'DLp]B6PuMDKu9BifuIV'], trackMedia: 1413031716192258}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['7axfnDlzdldDxz7nMs', '1NBWQMsKd*ZoTF'], trackMedia: 7296152307236863}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['l@oHefPpX%mDMO', 'lz!tp]G7'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['qX%)!B4[iq!cBJU0L', 'Kcf3ybcdhbq)%FCo'], trackTag: 'WT9mAlfjin[ZiP'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['rFpQ2VckOo', 'V1Z[gV9'], trackTag: -1929421468467198}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['uL#a[PAF0ldCwF', 'Ig5j)Mwj^q@'], trackTag: -7049704328134657}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['E!eBPXDiILAS', 'tU%w(vcUsJ3zcoo'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: [')n)FKax5oIILNCFQSE%t', '!fPPu5tHSTH'], trackRawTag: 'v7jCcuVRVtafJm'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['Ps2%0q]O4qtQ%Ga8', 'bL6f]Pd4VmHohhCcr*'], trackRawTag: -6757421364019198}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['f7XOX2', 'jjbEs'], trackRawTag: -1855124091699201}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['jhxHj)', '0)0swLhDkDG'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['C)g0d0N7nj5Fi0rZ]j', 'Eu@Hyg6IrlIZ0V'], trackState: '1ZW%g4!u@'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['A]#mD@3M^&)Z', '1mFfsHKd75u'], trackState: -5156620308840446}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/ids').query({ids: ['cf1IdUhuKu9gReOIZjd', 'sSiO#2ffNDf0n)z'], trackState: -3144024118525953}).expect(400);
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
						return get('/api/v1/playlist/search').query({offset: 'wnJE4IgnNTR(%'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/playlist/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/playlist/search').query({offset: 1.22}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/playlist/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/playlist/search').query({amount: 'dkDsD*7nh1Xp58MUlGpA'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/playlist/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/playlist/search').query({amount: 51.07}).expect(400);
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
						return get('/api/v1/playlist/search').query({isPublic: 'r!K6EM[e#v]'}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({isPublic: 162704408969218}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({isPublic: -2277303019110401}).expect(400);
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
						return get('/api/v1/playlist/search').query({sortDescending: '@G2X[3wuOAVZMl'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({sortDescending: -5673132417351678}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({sortDescending: 8865609693528063}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({playlistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value string', async () => {
						return get('/api/v1/playlist/search').query({playlistTracks: '8yC@Ea'}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({playlistTracks: -8936738160377854}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({playlistTracks: -1787019705450497}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({playlistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value string', async () => {
						return get('/api/v1/playlist/search').query({playlistTrackIDs: '42Sz!)hhiXAC'}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({playlistTrackIDs: 1514196374126594}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({playlistTrackIDs: -2678524695543809}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({playlistState: ''}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value string', async () => {
						return get('/api/v1/playlist/search').query({playlistState: 'Cv2V6YRSOfQbr3qcYFyY'}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({playlistState: -7789225642557438}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({playlistState: -6458480449814529}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/search').query({trackMedia: 'UjgckcHWusR$CW'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({trackMedia: 503569396531202}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({trackMedia: 1819977501900799}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/search').query({trackTag: 'p8LqdZNFbAb'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({trackTag: 1008266490413058}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({trackTag: 3735645587505151}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/search').query({trackRawTag: '32g6$tmDGeX[2i762E'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({trackRawTag: 24407896489986}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({trackRawTag: 923134475632639}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/search').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/search').query({trackState: '5PcbdZd^0nC'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/search').query({trackState: 6388977242210306}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/search').query({trackState: 8204313084035071}).expect(400);
					});
			});
		});
		describe('/playlist/state', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/state').query({id: 'XBdJHnQlyVSKrWg4u#fD'}).expect(401);
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
						return getNotLoggedIn('/api/v1/playlist/states').query({ids: ['og55*(DSEM^g%wv6', 'u)qHfy1RNnKdSI@RUAl3']}).expect(401);
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
						return getNotLoggedIn('/api/v1/playlist/tracks').query({ids: ['bY$@xH&0U&x*UFlAox8', 'mf*D93n8T4nFQfiSBx']}).expect(401);
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
						return get('/api/v1/playlist/tracks').query({ids: ['HFinW9yv2lQkG', 'lGzTP(3LjDUREELJQrC'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['PQqZnqno8dxyF[', 'kB#AnP3D0BW4g'], trackMedia: 'K07O%m7gef7A'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['!GwWw', 'EFh@)'], trackMedia: -2884735520997374}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['#moBOoMgb0AQYeD1', 'hDU&Z!^ft'], trackMedia: -6048623645163521}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['aZS5I[', '#Yj135^FgHkmfKG'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['UaW$k^V1G]7Xy03fJ2@V', 'WWNw&KKeDaJeXx(('], trackTag: 'Xds(dGQe4'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['aNHmY3mJSplUlzGah', 'Odu1ua(PMb'], trackTag: -2852004430872574}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['vsYu*s0#', 'N&qKY['], trackTag: 3162143646023679}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['06c!Qs#Y', 'Q$4(r'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['Bp&G7#pZGEKysm3', 'U7X#kUi'], trackRawTag: 'gg269M!VD!3sy*N9Zi'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['VvFl*%p[%7#b)u8P', '^xEp6'], trackRawTag: -2773050831405054}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['pausV', 'mo&LR%9)N'], trackRawTag: 73981226909695}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['Vzx*2aWb', 'H2G(prSx41Ig'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['HF6d@SGjf(6z', 'wwiQtq'], trackState: 'Y!8!o4R)8Le'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['A5jgwM*Bp', '2R*gYo6M!s3&'], trackState: 703703182999554}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['U$]g#whfdiKd9', '7S#]ZTnN'], trackState: -4482075109359617}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['Lkzhg@ax', ']KqwbYL'], offset: 'gi1O)RKzX'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['eHmuVp4aMK0ZTejv', '$rOW&0YSO'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['HvhnJcYqvU^e@!0', 'v]H8qKPW'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['!SPn!Kp!#JdwA78o', 'RE2uG5[vCQi&SflaX'], offset: 26.37}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['%^kVe2FjMsSEnA', 'BEB4A'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['D0Lh5', 'n06GTq$d'], amount: 'v)F!(()WGvQy!hFU7PQF'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['ObQ^]rPE90E7', ')y]lhD4#Nq@'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['vbLCxv$sKW@Er', 'ChB9vN[OU66V)BB'], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['I%9CMbnyWxlQLoTb', 'q3z[J#'], amount: 49.85}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/playlist/tracks').query({ids: ['37P2gEio]%50nIZ', 'ja*m1gzU[v!Zelv*vPb'], amount: 0}).expect(400);
					});
			});
		});
		describe('/playlist/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/list').query({list: 'frequent'}).expect(401);
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
						return get('/api/v1/playlist/list').query({list: 'avghighest', offset: 'HvU4QFBeG'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', offset: 18.21}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', amount: 'JMX(Z'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', amount: 14.27}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', amount: 0}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', playlistTracks: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'random', playlistTracks: 'Dj3My'}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', playlistTracks: 2974553995214850}).expect(400);
					});
					it('should respond with 400 with "playlistTracks" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', playlistTracks: -2046775141597185}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', playlistTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', playlistTrackIDs: 'j]V**[Z*7c'}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'random', playlistTrackIDs: -5585902185218046}).expect(400);
					});
					it('should respond with 400 with "playlistTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', playlistTrackIDs: -2915643703689217}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'random', playlistState: ''}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', playlistState: '2(rZvDaWSpVmY&wCG'}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', playlistState: 2074726507741186}).expect(400);
					});
					it('should respond with 400 with "playlistState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', playlistState: -3124049345511425}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', trackMedia: 'b%PjhGYk7DX'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', trackMedia: 2959763751043074}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', trackMedia: -6232101036752897}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', trackTag: '&wG*(&nYN^*NtldZoSbF'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', trackTag: 7292240808378370}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', trackTag: -1624171884838913}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', trackRawTag: 'WYlq#q![wI$)VrTFuh'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', trackRawTag: -5651591310868478}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', trackRawTag: -4182811871281153}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', trackState: '8L3mUH]izkJXm'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', trackState: -7699351883218942}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', trackState: -2509908633190401}).expect(400);
					});
					it('should respond with 400 with "name" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', name: ''}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', isPublic: ''}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', isPublic: 'd7VRVuMJaQwWjmJjYI'}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', isPublic: 4434448447700994}).expect(400);
					});
					it('should respond with 400 with "isPublic" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'faved', isPublic: -1474143669190657}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', sortField: ''}).expect(400);
					});
					it('should respond with 400 with "sortField" set to value invalid enum', async () => {
						return get('/api/v1/playlist/list').query({list: 'avghighest', sortField: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', id: ''}).expect(400);
					});
					it('should respond with 400 with "ids" set to value null', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', ids: null}).expect(400);
					});
					it('should respond with 400 with "ids" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', ids: [null, '']}).expect(400);
					});
					it('should respond with 400 with "query" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', query: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value empty string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', sortDescending: ''}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value string', async () => {
						return get('/api/v1/playlist/list').query({list: 'frequent', sortDescending: 'bjlLG%xeRtbuf]TD'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/playlist/list').query({list: 'highest', sortDescending: 5834160807608322}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/playlist/list').query({list: 'recent', sortDescending: 4643181975044095}).expect(400);
					});
			});
		});
		describe('/user/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/user/id').query({id: 'cm(dTVm4jKMbj'}).expect(401);
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
						return getNotLoggedIn('/api/v1/user/ids').query({ids: ['m4T%HQ0%XQV', '0RXMnRLb!WfZi']}).expect(401);
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
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/user/search').query({offset: 'LjI9t$)ca('}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/user/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/user/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/user/search').query({offset: 59.35}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/user/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/user/search').query({amount: '@ApolL8Na[!Pc*H(zzL'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/user/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/user/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/user/search').query({amount: 18.35}).expect(400);
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
						return get('/api/v1/user/search').query({isAdmin: 'IE%Xzodv3@P^%'}).expect(400);
					});
					it('should respond with 400 with "isAdmin" set to value integer > 1', async () => {
						return get('/api/v1/user/search').query({isAdmin: 4824585417523202}).expect(400);
					});
					it('should respond with 400 with "isAdmin" set to value integer < 0', async () => {
						return get('/api/v1/user/search').query({isAdmin: 8940643954982911}).expect(400);
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
						return get('/api/v1/user/search').query({sortDescending: 'QRuwbbyRiFpLy!iF'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/user/search').query({sortDescending: 5011851800739842}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/user/search').query({sortDescending: 8306061962379263}).expect(400);
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
						return get('/api/v1/playqueue/get').query({playQueueTracks: 'gMrI]8B7x'}).expect(400);
					});
					it('should respond with 400 with "playQueueTracks" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTracks: -965143068409854}).expect(400);
					});
					it('should respond with 400 with "playQueueTracks" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTracks: 1017757084680191}).expect(400);
					});
					it('should respond with 400 with "playQueueTrackIDs" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTrackIDs: ''}).expect(400);
					});
					it('should respond with 400 with "playQueueTrackIDs" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTrackIDs: '[7$02YBRZ@Do6@@'}).expect(400);
					});
					it('should respond with 400 with "playQueueTrackIDs" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTrackIDs: -654305409368062}).expect(400);
					});
					it('should respond with 400 with "playQueueTrackIDs" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({playQueueTrackIDs: -1228793893093377}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({trackMedia: 'jGD#losB@aZp'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({trackMedia: -7787012996202494}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({trackMedia: -7599355972288513}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({trackTag: 'aJATC^(1NYeWZsXLrXR'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({trackTag: -4148969005383678}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({trackTag: 3156125113384959}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({trackRawTag: '5T63%GPkq)KWHkn]*vG'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({trackRawTag: -5092393267232766}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({trackRawTag: 8390096365551615}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/playqueue/get').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/playqueue/get').query({trackState: '5BSw6YTIvXUqGbxpcv$'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/playqueue/get').query({trackState: 5656108693716994}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/playqueue/get').query({trackState: 4723810485927935}).expect(400);
					});
			});
		});
		describe('/bookmark/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/bookmark/id').query({id: '#W@N)gq[^l2bVkdVH'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'ecSuiL*gU0W8k95jo#Oc', bookmarkTrack: ''}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: '^Ug)o', bookmarkTrack: 'khkHc1n7X3*C!AdY'}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: '[zMcV9*Uv6Iqy', bookmarkTrack: 2035559283294210}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: 'SZYVZ', bookmarkTrack: 7220764335931391}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: '#o4W9G9^fE(D0x9', trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'p7SHsjC', trackMedia: 'q^irC07rcrR'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: 'WTNSmhqRLXYN%*oNHb', trackMedia: -8844371214467070}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: 'XnfFpfATdzY5(a&FNrp', trackMedia: 7058945050935295}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'PDC7yZsc1NuU([0m2', trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'v7SR3Zn3cs#wFKl', trackTag: 'pNZBbE7f!qOqnv'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: '*1HeOEuV', trackTag: -7397612818792446}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: 'Vd4N7CL$MZ#^4Xudrhx', trackTag: 2141710175961087}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'habvJ(jw1^Fnl*XTk', trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'zon[VtGVb4U9Y', trackRawTag: 'zk^iiA3'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: '$4GEUd5^', trackRawTag: 1338159304540162}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: 'n%Gsa&%w', trackRawTag: -2038363565588481}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'mvhmds6EPr(0goZi(]W', trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/bookmark/id').query({id: 'BcJ@^JaNBEP', trackState: 'x6!Pcy81'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/id').query({id: 'o93S*Gd!QrU', trackState: -4918312991457278}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/id').query({id: '(3Y7chrlaPKUzTv', trackState: 3974775152050175}).expect(400);
					});
			});
		});
		describe('/bookmark/ids', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/bookmark/ids').query({ids: ['BVg2%TmY@X@HRIFwTm2', 'EL3tf$LwtS']}).expect(401);
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
						return get('/api/v1/bookmark/ids').query({ids: ['hhtfVW', '89f^b'], bookmarkTrack: ''}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['NLHYh', 'kF7eDAIdT%%capj!Tn&'], bookmarkTrack: 'OkJtC]9FhFh1nyGe%'}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['TPx4Z#6e4Am', 'TCimF0ro'], bookmarkTrack: -3290487368712190}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['ymmkY0k&e$zllIj%Ho(N', 's[g8ujN11hTN'], bookmarkTrack: -4881750735978497}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['ZG@VOnF@V4g%ni', 'E)Smw]is96PdeF'], trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['9hRPs!1c84s', '#7KNUbD1oOuY'], trackMedia: '%mchk8'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['TMnnrT3oUX(T2je', 'BtOV!ymXtsS'], trackMedia: -3524613673844734}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['QR64cxknzmtwcyzQL*en', 'd5IktR*bKR^6vu**4'], trackMedia: 1938365029023743}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['E]^$aOF]N$', '6dUHm)O#b%'], trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['RPjacG^0UF#ol', 'aMvJQZZQ0RPP'], trackTag: '5c&94Iq3A50UFp*#('}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['OIKhCW', 'Or17O@gQ071hw'], trackTag: -1699196390342654}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['slc6TTe[k9%*pURZN6', 'M(v68SvxE)8vzkZ'], trackTag: 1339509555855359}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['Q#74CeUzhzBpJNAwUouU', 'Z]oskvf0%'], trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['wMR@25ueO44lcF$!%Er', 'F(gpVIu)'], trackRawTag: '[cwJR^sZBad3x'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['6)p[Ls', 'Xm)ZUzi!hYmpVU)0'], trackRawTag: 1754252909215746}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['U5Q#52q', 'qID4Zl7crn4TEy*Yc#Ia'], trackRawTag: -2206432321601537}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['l6rbDUM1Ss', 'JL*X8hcAI'], trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['%QZ40UjP', 'fEb]&9UU(sFK6kPLgzqT'], trackState: '#YNGx4[HDe#9#'}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['LiT83(aP', 'PF@6kEpOlAZq(%5Y%NU'], trackState: -3904534044737534}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['7(3@7LL', '(3fU]'], trackState: -7421472024821761}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['I^Ek6ITz0b(]jK$3sA', '45YOifOc]FcV2l!D#'], offset: 'f[S08S9A]I'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['[sbCVa^V1Q%w3OAW', 's4CK16OsvF'], offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['YwmMzp', '6#uX4(^yeJ'], offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['zu04$bCwq6!WD5Uhq]', 'r4zbFRo'], offset: 28.93}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['1&DRrpI2EU@oB', 'apc2sVuBWMH9GKgq'], offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['kPQ^JPw', 'xDaSx]#6fi(XI'], amount: 'J*Ct&eyY2Jm1@1MgPMr'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['H^!^rb%CjS6', '0NWq$[LfS3tFIw'], amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['b)1V1tR@S', 'MGq3HHm5T]A%Jga#S'], amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['#%9J3S$L^guvg', 'R^*D3E#G3'], amount: 79.3}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/bookmark/ids').query({ids: ['GdI]LtpLVuPM)O@my', 't3sxD%2@)K'], amount: 0}).expect(400);
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
						return get('/api/v1/bookmark/list').query({bookmarkTrack: 'ZBeipOr3'}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({bookmarkTrack: 1711028471595010}).expect(400);
					});
					it('should respond with 400 with "bookmarkTrack" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({bookmarkTrack: 2516154279002111}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({trackMedia: ''}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({trackMedia: '@WvYtZmAVbw'}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({trackMedia: -8136695962664958}).expect(400);
					});
					it('should respond with 400 with "trackMedia" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({trackMedia: -4312851585957889}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({trackTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({trackTag: '(@KDSn2CKp$U(QTeu^Y'}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({trackTag: -513922503278590}).expect(400);
					});
					it('should respond with 400 with "trackTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({trackTag: 3522656028590079}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({trackRawTag: ''}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({trackRawTag: 'CDBIc1ih9&&GZlip'}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({trackRawTag: -977241018204158}).expect(400);
					});
					it('should respond with 400 with "trackRawTag" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({trackRawTag: -8000654853275649}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({trackState: ''}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({trackState: 'vqe9K7MQPDCIRSoU('}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer > 1', async () => {
						return get('/api/v1/bookmark/list').query({trackState: 3735852500910082}).expect(400);
					});
					it('should respond with 400 with "trackState" set to value integer < 0', async () => {
						return get('/api/v1/bookmark/list').query({trackState: -7514019946561537}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({offset: 'M&7m)ObU7s(y'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/bookmark/list').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/bookmark/list').query({offset: 50.88}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/bookmark/list').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/bookmark/list').query({amount: 'e44NdP@z#Z^J'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/bookmark/list').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/bookmark/list').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/bookmark/list').query({amount: 87.48}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/bookmark/list').query({amount: 0}).expect(400);
					});
			});
		});
		describe('/bookmark/byTrack/list', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/bookmark/byTrack/list').query({trackID: 'gdov)0faPlLYx)K*LNQ'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "trackID" set to value empty string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: ']prUtmAA5[P4w', offset: 'Sl7Tsb'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'twXJ0w', offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'Zqz2fZQS^gLXCYaaLw', offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'vW60)MZ', offset: 85.13}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: '(4Me1vu', offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'gkt%v', amount: '7FFs%'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: '*8cFE', amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'f3viflchG$Oj&XZJhd5!', amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'grhX6F6VlQ9pO2jj4', amount: 62.4}).expect(400);
					});
					it('should respond with 400 with "amount" set to value less than minimum 1', async () => {
						return get('/api/v1/bookmark/byTrack/list').query({trackID: 'f1X$cES^', amount: 0}).expect(400);
					});
			});
		});
		describe('/root/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/id').query({id: 'y^wMr[pR'}).expect(401);
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
						return getNotLoggedIn('/api/v1/root/ids').query({ids: ['fTD]m@AlUbxFCxJ7H', 'bPC)Jb0#[45iYuCT[']}).expect(401);
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
						return get('/api/v1/root/search').query({offset: 'StzVpo$hkeuc@rLW&'}).expect(400);
					});
					it('should respond with 400 with "offset" set to value empty string', async () => {
						return get('/api/v1/root/search').query({offset: ''}).expect(400);
					});
					it('should respond with 400 with "offset" set to value boolean', async () => {
						return get('/api/v1/root/search').query({offset: true}).expect(400);
					});
					it('should respond with 400 with "offset" set to value float', async () => {
						return get('/api/v1/root/search').query({offset: 37.56}).expect(400);
					});
					it('should respond with 400 with "offset" set to value less than minimum 0', async () => {
						return get('/api/v1/root/search').query({offset: -1}).expect(400);
					});
					it('should respond with 400 with "amount" set to value string', async () => {
						return get('/api/v1/root/search').query({amount: 'b4vto3tB'}).expect(400);
					});
					it('should respond with 400 with "amount" set to value empty string', async () => {
						return get('/api/v1/root/search').query({amount: ''}).expect(400);
					});
					it('should respond with 400 with "amount" set to value boolean', async () => {
						return get('/api/v1/root/search').query({amount: true}).expect(400);
					});
					it('should respond with 400 with "amount" set to value float', async () => {
						return get('/api/v1/root/search').query({amount: 39.98}).expect(400);
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
						return get('/api/v1/root/search').query({sortDescending: 'v34$10OUY@J'}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer > 1', async () => {
						return get('/api/v1/root/search').query({sortDescending: 4617475207462914}).expect(400);
					});
					it('should respond with 400 with "sortDescending" set to value integer < 0', async () => {
						return get('/api/v1/root/search').query({sortDescending: 3868861371777023}).expect(400);
					});
			});
		});
		describe('/root/scan', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/scan').query({id: 'i]*on'}).expect(401);
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
		});
		describe('/root/status', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/status').query({id: 'BS1!PRvWAIfn3R2gS'}).expect(401);
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
		});
		describe('/admin/queue/id', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/admin/queue/id').query({id: 'LNj)y]!@8i64qgBx'}).expect(401);
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
						return getNotLoggedIn('/api/v1/folder/download').query({id: '6Mf@k(&$wImVw#'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/folder/download').query({id: 'TclhqL9$S&8U[', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/folder/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/image').query({id: 'dOeD1K&YwD7Ip69!*s$r'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/folder/image').query({id: '3yuer7%', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/folder/image').query({id: '5&cpq0CmP7[6pHOD', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/folder/image').query({id: 'WnC&&mMH27FTgyJf!', size: 'Eh3#zBsEbdb^a92(DWse'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/folder/image').query({id: 'SPF^z&s3^aRtoO2ED^', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/folder/image').query({id: '^w3Yf2hrJLCj', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/folder/image').query({id: 'PbnoRYj]65[6', size: 124.6}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/folder/image').query({id: '^D34rJO%QiyTh', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/folder/image').query({id: 'eQ5KoR]0h*', size: 1025}).expect(400);
					});
			});
		});
		describe('/folder/artwork/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/folder/artwork/image').query({id: 'sTCsbwAur%QjwcL@'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/folder/artwork/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'RL]PD[rC', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/folder/artwork/image').query({id: '9GQtrqtTjUPtw', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'dgL7^9wXw', size: 'ck$)jo11Xekz1gep'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'OT^3T9wmF', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'AB)rr#k%d*!sZ7W3(z4g', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'AoBNrL!EqWXP@m7n', size: 475.88}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'EZUon(z(kCzIZ6', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/folder/artwork/image').query({id: 'Dw@Nz@%', size: 1025}).expect(400);
					});
			});
		});
		describe('/track/stream', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/stream').query({id: 'FY28D'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/stream').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value string', async () => {
						return get('/api/v1/track/stream').query({id: 'B#5DPXAjrdII8)i]', maxBitRate: 'YFwO!$vYAFRl(4'}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value empty string', async () => {
						return get('/api/v1/track/stream').query({id: 'EwzRyS0Kr3HMGi', maxBitRate: ''}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value boolean', async () => {
						return get('/api/v1/track/stream').query({id: 'OU0We', maxBitRate: true}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value float', async () => {
						return get('/api/v1/track/stream').query({id: 'gc2!@[)Ff#', maxBitRate: 98.61}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value less than minimum 10', async () => {
						return get('/api/v1/track/stream').query({id: 'vu^BVU12mUXjHPR1BD', maxBitRate: 9}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/track/stream').query({id: 'HNK4@m&As', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/track/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/download').query({id: 'U&bF4Rrj@]t(xeZvVb7'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/track/download').query({id: '%DLFJpj@A', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/track/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/track/image').query({id: 'u0FMVeq&'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/track/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/track/image').query({id: '3(Y3ytHQ2C%', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/track/image').query({id: 'FlfrSh3z7N@*VbeF]PQ', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/track/image').query({id: 'c0AHPn@Fi0YwUJWB[4dT', size: 'RmhgKDR#4'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/track/image').query({id: '8#c&K7ZY', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/track/image').query({id: '8R63N(!huOM]*', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/track/image').query({id: 'ZJUVL8gdz', size: 328.75}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/track/image').query({id: 'npyUdmLzstv7', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/track/image').query({id: 'gGF*$cVI9Pl', size: 1025}).expect(400);
					});
			});
		});
		describe('/episode/stream', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/stream').query({id: '4Tq@]m[cPo)wXvXC*T'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/stream').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value string', async () => {
						return get('/api/v1/episode/stream').query({id: 'n7fR@qNXZ$w^C#[', maxBitRate: '4KoMk'}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value empty string', async () => {
						return get('/api/v1/episode/stream').query({id: 'fS!GcRgW0Rsq)', maxBitRate: ''}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value boolean', async () => {
						return get('/api/v1/episode/stream').query({id: 'jeMf$JkV', maxBitRate: true}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value float', async () => {
						return get('/api/v1/episode/stream').query({id: 'Xll0!Aog)BbuzQW', maxBitRate: 50.91}).expect(400);
					});
					it('should respond with 400 with "maxBitRate" set to value less than minimum 10', async () => {
						return get('/api/v1/episode/stream').query({id: 'oFLN]jKOQhh&2yZ[', maxBitRate: 9}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/episode/stream').query({id: 'cXhC9]PXKe!^6vV3', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/episode/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/download').query({id: '2R2bhDVEfT$Lf8wL^!'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/episode/download').query({id: 'vdqh9', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/episode/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/episode/image').query({id: '[HdCv##zlCuJZg'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/episode/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/episode/image').query({id: '1BJQK6YghtDiHs$90vVt', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/episode/image').query({id: 'OloJ3s)1rYgOx#Q', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/episode/image').query({id: '(HC*z', size: 'wsk*s&V3Ly*'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/episode/image').query({id: 'I)e@$[XhcFgNJZqDcoJ', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/episode/image').query({id: 'UHx&l9FTWWcPtW', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/episode/image').query({id: 'YKAMl1xI', size: 101.3}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/episode/image').query({id: '7wS%Sd3', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/episode/image').query({id: 'KWg7BLI@AnSLeD(t', size: 1025}).expect(400);
					});
			});
		});
		describe('/podcast/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/image').query({id: 'n*toYCO'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/podcast/image').query({id: 'M)8Vog!', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/podcast/image').query({id: 'rrxJ#S', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/podcast/image').query({id: '[pLvEQ^btfm', size: '3aujfc('}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/podcast/image').query({id: '6T!%Y', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/podcast/image').query({id: '3tyMS', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/podcast/image').query({id: 'lQn&8*dSeM!(j$!', size: 1010.4}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/podcast/image').query({id: 'V[ftY6niT&uoY', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/podcast/image').query({id: 'nY*waRu6Bi2qkkeXc6', size: 1025}).expect(400);
					});
			});
		});
		describe('/podcast/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/podcast/download').query({id: 'yaKkW*pMkk^]'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/podcast/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/podcast/download').query({id: 'NxkHahtvE#nRPDC]Fqp[', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/artist/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/image').query({id: 'tIKVMYl)x9^3X%'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/artist/image').query({id: 'P0QIQWi88V75', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/artist/image').query({id: 'p4)!ssBk(HScK)m7P', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/artist/image').query({id: 'ZXIwiBW', size: 'nb@mL8T9'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/artist/image').query({id: 'SJ*pk', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/artist/image').query({id: 'WaYaZoC', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/artist/image').query({id: 'ccwt!s8ArYY3u!l6l', size: 331.38}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/artist/image').query({id: '@@!%T&EE', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/artist/image').query({id: '57rk9nNHx%KJahM', size: 1025}).expect(400);
					});
			});
		});
		describe('/artist/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/artist/download').query({id: '[[bfc2x@ZO'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/artist/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/artist/download').query({id: 'Pepr)Kk!PtNqL#HHtIy', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/album/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/image').query({id: 'DL%TO'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/album/image').query({id: '5I#gZ(ZB2PlnrtGlu', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/album/image').query({id: 'pv$6gIZ', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/album/image').query({id: ']&]2D', size: 'A06o(yPD8'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/album/image').query({id: 'a0icb2mE)qz[Pmk', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/album/image').query({id: 'murmsb@96GxM', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/album/image').query({id: '0n)EGC(&#tqi32OM&!J', size: 620.32}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/album/image').query({id: 'PdsM*5*3$^]3hQjTx', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/album/image').query({id: '(%g5vT5', size: 1025}).expect(400);
					});
			});
		});
		describe('/album/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/album/download').query({id: ')txCmMlv3'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/album/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/album/download').query({id: 'S6Ep!', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/playlist/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/image').query({id: 'aroy6KlzlX^D'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/playlist/image').query({id: 'mHS^[3[Yr$I', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/playlist/image').query({id: 'd6MBZzf&q0[Bu2n', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/playlist/image').query({id: '3Qly6H(', size: 'NZI*oI!UVh'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/playlist/image').query({id: 'iiYFP6n(', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/playlist/image').query({id: '1Y#*w3GopA]&hPV', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/playlist/image').query({id: '4Va&P0tjB!(8H', size: 158.6}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/playlist/image').query({id: 'sr@(08DNm7Opf*xK', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/playlist/image').query({id: '%7er##kgbV*[P', size: 1025}).expect(400);
					});
			});
		});
		describe('/playlist/download', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/playlist/download').query({id: 'qwc^f6&Uewu'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/playlist/download').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/playlist/download').query({id: 'JkRA&]SyqOQmxd7', format: 'invalid'}).expect(400);
					});
			});
		});
		describe('/user/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/user/image').query({id: '#!Bl$jtSvCpUk9*hIPW'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/user/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/user/image').query({id: 'lx5Sxx', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/user/image').query({id: '**ex^!acDpxw', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/user/image').query({id: '9r02X6lS', size: 'd#b4jxen#cw4ytm8'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/user/image').query({id: '0Kb7)6OwMkNU8TUDJQ', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/user/image').query({id: '$R%a2gnTz*hjXFO%c@hY', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/user/image').query({id: 'zqtiBoUuLU*JDp9Xy', size: 616.75}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/user/image').query({id: 'fq6N3G9*3jB1]7k', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/user/image').query({id: 'CTyr#CK', size: 1025}).expect(400);
					});
			});
		});
		describe('/root/image', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/root/image').query({id: '95LE9vDHgq1k&xP%QS'}).expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/root/image').query({id: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/root/image').query({id: '8LbU]7Y^*y8E#dY', format: ''}).expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/root/image').query({id: 'kLNiA9hh9lj7@BFn&', format: 'invalid'}).expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/root/image').query({id: 'zLCfjTj', size: '&N8vyDw2gwVDo(F7ys'}).expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/root/image').query({id: 'Hl2ngY78(ea9]Cuq$(', size: ''}).expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/root/image').query({id: 'vh8(G$pt60', size: true}).expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/root/image').query({id: 'x]1hNwP5DEXKbMR^EL', size: 984.46}).expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/root/image').query({id: 'pVghii%i', size: 15}).expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/root/image').query({id: 'w!4y2N8B3ir', size: 1025}).expect(400);
					});
			});
		});
		describe('/image/{id}-{size}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/image/P%5DW%5BB%40M-504.bmp').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/image/bS(vt%23TZc*XL%5ERkB-433.').expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/image/8yX%40G5yYu3*-360.invalid').expect(400);
					});
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/image/HDu%261zStsCK1dMD-uAT*Abw0ZM%5EmI.tiff').expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/image/noepo%5DlU%5Edx%257Sa7U%5D-.jpg').expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/image/aZg%5EpNyTm)kc*hk-true.jpeg').expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/image/%5BBgVyAqkj-961.93.png').expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/image/JWWxuumI-15.tiff').expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/image/Q7cRi%40%5B%40oI-1025.png').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/image/-535.jpeg').expect(400);
					});
			});
		});
		describe('/image/{id}-{size}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/image/QgjE2jJafb-466').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "size" set to value string', async () => {
						return get('/api/v1/image/KIwZMXIC82Wym%25Encjl-qDJuYc%23j(%5EDuvsV)PAT').expect(400);
					});
					it('should respond with 400 with "size" set to value empty string', async () => {
						return get('/api/v1/image/OnAXr%25T%24!3W-').expect(400);
					});
					it('should respond with 400 with "size" set to value boolean', async () => {
						return get('/api/v1/image/ocACiq-true').expect(400);
					});
					it('should respond with 400 with "size" set to value float', async () => {
						return get('/api/v1/image/%5DqAr%23FM-1020.12').expect(400);
					});
					it('should respond with 400 with "size" set to value less than minimum 16', async () => {
						return get('/api/v1/image/MVS7%5E3zl))a*J-15').expect(400);
					});
					it('should respond with 400 with "size" set to value more than minimum 1024', async () => {
						return get('/api/v1/image/yw%5EnMv!YdF%23QQMZ4XV(5-1025').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/image/-155').expect(400);
					});
			});
		});
		describe('/image/{id}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/image/%232Tz%26VZiZ%5D9Xe.png').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value empty string', async () => {
						return get('/api/v1/image/0%24g9AHANY93%5Dc.').expect(400);
					});
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/image/CYtki%24.invalid').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/image/.png').expect(400);
					});
			});
		});
		describe('/image/{id}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/image/68w0P!4sEA46p').expect(401);
					});
			});
		});
		describe('/stream/{id}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/stream/tv4(W3X4.mp3').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/stream/Tf8%403cs1(GI3cy%5D9.invalid').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/stream/.mp3').expect(400);
					});
			});
		});
		describe('/stream/{id}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/stream/*U%26tJeVe%245dGl').expect(401);
					});
			});
		});
		describe('/waveform/{id}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/waveform/ZTg%5BUmB0%40T%24.json').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/waveform/XLUGgl9P.invalid').expect(400);
					});
					it('should respond with 400 with "id" set to value empty string', async () => {
						return get('/api/v1/waveform/.json').expect(400);
					});
			});
		});
		describe('/download/{id}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/download/%5EAKZ%5D1XiJm').expect(401);
					});
			});
		});
		describe('/download/{id}.{format}', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return getNotLoggedIn('/api/v1/download/HQep%5BJwA50%24Fce%5E%25NcN.zip').expect(401);
					});
			});
			describe('should fail with invalid data', () => {
					it('should respond with 400 with "format" set to value invalid enum', async () => {
						return get('/api/v1/download/w7%5B%23g.invalid').expect(400);
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
		});
		describe('/radio/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/radio/update').send({}).expect(401);
					});
			});
		});
		describe('/radio/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/radio/delete').send({}).expect(401);
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
		});
		describe('/track/name/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/name/update').send({}).expect(401);
					});
			});
		});
		describe('/track/parent/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/parent/update').send({}).expect(401);
					});
			});
		});
		describe('/track/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/delete').send({}).expect(401);
					});
			});
		});
		describe('/track/fix', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/track/fix').send({}).expect(401);
					});
			});
		});
		describe('/folder/artworkUpload/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artworkUpload/create').send({}).expect(401);
					});
			});
		});
		describe('/folder/artworkUpload/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artworkUpload/update').send({}).expect(401);
					});
			});
		});
		describe('/folder/artwork/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artwork/create').send({}).expect(401);
					});
			});
		});
		describe('/folder/artwork/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artwork/delete').send({}).expect(401);
					});
			});
		});
		describe('/folder/artwork/name/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/artwork/name/update').send({}).expect(401);
					});
			});
		});
		describe('/folder/name/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/name/update').send({}).expect(401);
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
		});
		describe('/folder/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/delete').send({}).expect(401);
					});
			});
		});
		describe('/folder/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/folder/create').send({}).expect(401);
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
		});
		describe('/user/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/user/update').send({}).expect(401);
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
		});
		describe('/root/create', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/root/create').send({}).expect(401);
					});
			});
		});
		describe('/root/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/root/update').send({}).expect(401);
					});
			});
		});
		describe('/root/delete', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/root/delete').send({}).expect(401);
					});
			});
		});
		describe('/admin/settings/update', () => {
			describe('should fail without login', () => {
					it('should respond with 401 Unauth', async () => {
						return postNotLoggedIn('/api/v1/admin/settings/update').send({}).expect(401);
					});
			});
		});
	},
	async () => {
		await server.stop();
	});
});

