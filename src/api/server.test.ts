// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY
// tslint:disable:max-file-line-count
import supertest from 'supertest';
import {JAMAPI_URL_VERSION} from '../api/jam/version';
import {testEngines} from '../engine/engine.spec';
import {mockUserName, mockUserName2, mockUserPass, mockUserPass2} from '../engine/user/user.mock';
import {wait} from '../utils/wait';
import {Server} from './server';

describe('Server', () => {
	let server: Server;
	let request: supertest.SuperTest<supertest.Test>;
	let get: (apiPath: string, query: any, expect: number) => supertest.Test;
	let post: (apiPath: string, query: any, body: any, expect: number) => supertest.Test;
	let getNotLoggedIn: (apiPath: string, query: any, expect: number) => supertest.Test;
	let postNotLoggedIn: (apiPath: string, query: any, body: any, expect: number) => supertest.Test;
	let getNoRights: (apiPath: string, query: any, expect: number) => supertest.Test;
	let postNoRights: (apiPath: string, query: any, body: any, expect: number) => supertest.Test;
	testEngines({}, async testEngine => {
			testEngine.engine.config.server.port = 10010;
			testEngine.engine.config.server.listen = 'localhost';
			server = new Server(testEngine.engine);
			await server.start();
			await wait(100);
			request = supertest('http://localhost:10010');
			const apiPrefix = `/jam/${JAMAPI_URL_VERSION}/`;
			const res1 = await request.post(apiPrefix + 'login')
				.send({username: mockUserName, password: mockUserPass, client: 'supertest-tests', jwt: true});
			const user1token = res1.body.jwt;
			const res2 = await request.post(apiPrefix + 'login')
				.send({username: mockUserName2, password: mockUserPass2, client: 'supertest-tests', jwt: true});
			const user2token = res2.body.jwt;

			get = (apiPath, query, expect) => request.get(apiPrefix + apiPath).set('Authorization', `Bearer ${user1token}`)
				.query(query).expect(expect);
			post = (apiPath, query, body, expect) => request.post(apiPrefix + apiPath).set('Authorization', `Bearer ${user1token}`)
				.query(query).send(body).expect(expect);
			getNoRights = (apiPath, query, expect) => request.get(apiPrefix + apiPath).set('Authorization', `Bearer ${user2token}`)
				.query(query).expect(expect);
			postNoRights = (apiPath, query, body, expect) => request.post(apiPrefix + apiPath).set('Authorization', `Bearer ${user2token}`)
				.query(query).send(body).expect(expect);
			getNotLoggedIn = (apiPath, query, expect) => request.post(apiPrefix + apiPath)
				.query(query).expect(expect);
			postNotLoggedIn = (apiPath, query, body, expect) => request.post(apiPrefix + apiPath)
				.query(query).send(body).expect(expect);
	}, () => {
		describe('lastfm/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('lastfm/lookup', {type: 'track-similar', id: 'ES3AwCS%$zunaVy9V'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: '', id: 'dp]UVXYY$o4NaPMwgJYj'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('lastfm/lookup', {type: 'invalid', id: 'XM0w]L%2CytM^LCb9JO'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: 'artist', id: ''}, 400);
				});
			});
		});
		describe('lyricsovh/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('lyricsovh/search', {title: '7e3h]ebyAe%2bhiOjo0', artist: 'jTKPa0Jh7xRb0'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"title" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: '', artist: 'tFDq8$TC[QUMAAhqlL$6'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: '3hJR5', artist: ''}, 400);
				});
			});
		});
		describe('acoustid/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acoustid/lookup', {id: '&UiY#V!S54Irbp4A'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: 'q4L8vMTJbuWT06A', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/lookup', {type: 'place', id: 'Vu^pdmjah9YmT'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: '', id: 'ZS0[T60vlVmmLbA'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('musicbrainz/lookup', {type: 'invalid', id: 'evDtbLxKJ%pQpoAK*0'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'recording', id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'artist', id: 'vl3twg3#i9Wdfb', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/search', {type: 'release'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('musicbrainz/search', {type: 'invalid'}, 400);
				});
				it('"recording" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'recording', recording: ''}, 400);
				});
				it('"releasegroup" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'artist', releasegroup: ''}, 400);
				});
				it('"release" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'artist', release: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'artist', artist: ''}, 400);
				});
				it('"tracks" set to "string"', async () => {
					await get('musicbrainz/search', {type: 'release', tracks: '**!J%Tf9qFR0O7('}, 400);
				});
				it('"tracks" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'release-group', tracks: ''}, 400);
				});
				it('"tracks" set to "boolean"', async () => {
					await get('musicbrainz/search', {type: 'recording', tracks: true}, 400);
				});
				it('"tracks" set to "float"', async () => {
					await get('musicbrainz/search', {type: 'artist', tracks: 76.37}, 400);
				});
				it('"tracks" set to "less than minimum 0"', async () => {
					await get('musicbrainz/search', {type: 'recording', tracks: -1}, 400);
				});
			});
		});
		describe('acousticbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acousticbrainz/lookup', {id: '6TLDkvI5eKncm]B('}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: ''}, 400);
				});
				it('"nr" set to "string"', async () => {
					await get('acousticbrainz/lookup', {id: 'pvozpE^7rVM8', nr: 'zb6lOkV8S^h%Hp'}, 400);
				});
				it('"nr" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: 'BBKbT6k1JlJVsFrvDga', nr: ''}, 400);
				});
				it('"nr" set to "boolean"', async () => {
					await get('acousticbrainz/lookup', {id: '3rj[M9LWnYZ)tK', nr: true}, 400);
				});
				it('"nr" set to "float"', async () => {
					await get('acousticbrainz/lookup', {id: 'MP%PRw%TW8', nr: 91.17}, 400);
				});
				it('"nr" set to "less than minimum 0"', async () => {
					await get('acousticbrainz/lookup', {id: 'HR!#a&t1Izc', nr: -1}, 400);
				});
			});
		});
		describe('coverartarchive/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('coverartarchive/lookup', {type: 'release', id: '%darxKAYL$81G$TKt'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: '', id: 'hnvtw0gCVTjv5D6x36G'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('coverartarchive/lookup', {type: 'invalid', id: '5XiO3VQt1Qh0ejL5V^'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: 'release-group', id: ''}, 400);
				});
			});
		});
		describe('wikipedia/summary', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('wikipedia/summary', {title: 'zmm%[tNtleB'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"title" set to "empty string"', async () => {
					await get('wikipedia/summary', {title: ''}, 400);
				});
			});
		});
		describe('wikidata/summary', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('wikidata/summary', {id: ')(p5Mj#XSH)xkn44yMb@'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('wikidata/summary', {id: ''}, 400);
				});
			});
		});
		describe('wikidata/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('wikidata/lookup', {id: 'ci[GDd2u'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('wikidata/lookup', {id: ''}, 400);
				});
			});
		});
		describe('autocomplete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('autocomplete', {query: 'ri!0WVbiN2UzNeb!t'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"query" set to "empty string"', async () => {
					await get('autocomplete', {query: ''}, 400);
				});
				it('"track" set to "string"', async () => {
					await get('autocomplete', {query: 'WVtqxXXVCo5mc0', track: 'IuJh2IWEhaFgTyE'}, 400);
				});
				it('"track" set to "empty string"', async () => {
					await get('autocomplete', {query: 'wjX^jvQkF', track: ''}, 400);
				});
				it('"track" set to "boolean"', async () => {
					await get('autocomplete', {query: 'd$Xn8$g]duw%0$XTNR1', track: true}, 400);
				});
				it('"track" set to "float"', async () => {
					await get('autocomplete', {query: 'Q4MU#yY]5', track: 5.92}, 400);
				});
				it('"track" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'wRVdl741aN4SW', track: -1}, 400);
				});
				it('"artist" set to "string"', async () => {
					await get('autocomplete', {query: 'nvLK[vQTa84fX', artist: '#!2%3RdGs&'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('autocomplete', {query: 'v)taKiEISrb*', artist: ''}, 400);
				});
				it('"artist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'x%WUhMp', artist: true}, 400);
				});
				it('"artist" set to "float"', async () => {
					await get('autocomplete', {query: 'RBl[^^O!2xQ#G4i7kI6', artist: 11.34}, 400);
				});
				it('"artist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '7XVi!%(etnu$', artist: -1}, 400);
				});
				it('"album" set to "string"', async () => {
					await get('autocomplete', {query: 'WFU!VD&M', album: 'zJzQ@'}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('autocomplete', {query: '[B]9T#vIJMvnybKJwoH', album: ''}, 400);
				});
				it('"album" set to "boolean"', async () => {
					await get('autocomplete', {query: 'wiiLM6jmFReR[Yr', album: true}, 400);
				});
				it('"album" set to "float"', async () => {
					await get('autocomplete', {query: 'wAaCS^Br', album: 68.79}, 400);
				});
				it('"album" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'LU[wyF3(&', album: -1}, 400);
				});
				it('"folder" set to "string"', async () => {
					await get('autocomplete', {query: 'HiJTUbT([PO', folder: 'whQL34zeHzP96'}, 400);
				});
				it('"folder" set to "empty string"', async () => {
					await get('autocomplete', {query: 'Ec&Ab!', folder: ''}, 400);
				});
				it('"folder" set to "boolean"', async () => {
					await get('autocomplete', {query: 'iy3GJhk5$8l]d!#]Tgh', folder: true}, 400);
				});
				it('"folder" set to "float"', async () => {
					await get('autocomplete', {query: 'Eb4SIESw[VC@', folder: 32.69}, 400);
				});
				it('"folder" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'a#*y^NH]0bp6x7j9UC', folder: -1}, 400);
				});
				it('"playlist" set to "string"', async () => {
					await get('autocomplete', {query: 'mL5d*x@1BEi', playlist: 'I@DsqKvIlnSCNjp@7XiH'}, 400);
				});
				it('"playlist" set to "empty string"', async () => {
					await get('autocomplete', {query: '$O4R0*aw6mP6t&vM', playlist: ''}, 400);
				});
				it('"playlist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'fni8)TGG^eI[soP@', playlist: true}, 400);
				});
				it('"playlist" set to "float"', async () => {
					await get('autocomplete', {query: 'aFiZRJ$kXDlD&O5gOVeq', playlist: 64.07}, 400);
				});
				it('"playlist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '548bN', playlist: -1}, 400);
				});
				it('"podcast" set to "string"', async () => {
					await get('autocomplete', {query: 'Pm(H16z)LWj@j*KjvMm$', podcast: '!riyQob'}, 400);
				});
				it('"podcast" set to "empty string"', async () => {
					await get('autocomplete', {query: 'd])@uwY6', podcast: ''}, 400);
				});
				it('"podcast" set to "boolean"', async () => {
					await get('autocomplete', {query: 'mXfkGL', podcast: true}, 400);
				});
				it('"podcast" set to "float"', async () => {
					await get('autocomplete', {query: '4NO0sJ7f61', podcast: 23.42}, 400);
				});
				it('"podcast" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '#YyWfF(Z8C&WBW(@R', podcast: -1}, 400);
				});
				it('"episode" set to "string"', async () => {
					await get('autocomplete', {query: 'xGYg6', episode: ')@4f)*y#u(AvQouC'}, 400);
				});
				it('"episode" set to "empty string"', async () => {
					await get('autocomplete', {query: 'wbk!ZR^Au8ZL&E', episode: ''}, 400);
				});
				it('"episode" set to "boolean"', async () => {
					await get('autocomplete', {query: 'CKe)3VB]Z', episode: true}, 400);
				});
				it('"episode" set to "float"', async () => {
					await get('autocomplete', {query: 'R2)0DOsUy', episode: 65.41}, 400);
				});
				it('"episode" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'nc$SmmxA&v&', episode: -1}, 400);
				});
			});
		});
		describe('genre/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('genre/list', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"rootID" set to "empty string"', async () => {
					await get('genre/list', {rootID: ''}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('genre/list', {offset: '!2&cV!8%d32$)LF[Sy'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('genre/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('genre/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('genre/list', {offset: 15.41}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('genre/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('genre/list', {amount: 'C!KY)1zqz1M(1%R0y(9'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('genre/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('genre/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('genre/list', {amount: 84.26}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('genre/list', {amount: 0}, 400);
				});
			});
		});
		describe('stats', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stats', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"rootID" set to "empty string"', async () => {
					await get('stats', {rootID: ''}, 400);
				});
			});
		});
		describe('nowPlaying/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('nowPlaying/list', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('nowPlaying/list', {offset: 'N&Vyew$RRkw)16cKY'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('nowPlaying/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('nowPlaying/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('nowPlaying/list', {offset: 48.38}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('nowPlaying/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('nowPlaying/list', {amount: 'QhecwQrzsCV45WW'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('nowPlaying/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('nowPlaying/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('nowPlaying/list', {amount: 15.93}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('nowPlaying/list', {amount: 0}, 400);
				});
			});
		});
		describe('chat/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('chat/list', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"since" set to "string"', async () => {
					await get('chat/list', {since: 's7!Wh]A69e'}, 400);
				});
				it('"since" set to "empty string"', async () => {
					await get('chat/list', {since: ''}, 400);
				});
				it('"since" set to "boolean"', async () => {
					await get('chat/list', {since: true}, 400);
				});
				it('"since" set to "float"', async () => {
					await get('chat/list', {since: 25.27}, 400);
				});
				it('"since" set to "less than minimum 0"', async () => {
					await get('chat/list', {since: -1}, 400);
				});
			});
		});
		describe('folder/index', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/index', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"rootID" set to "empty string"', async () => {
					await get('folder/index', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('folder/index', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('folder/index', {rootIDs: [null, '']}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('folder/index', {parentID: ''}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('folder/index', {childOfID: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('folder/index', {artist: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('folder/index', {title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('folder/index', {album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('folder/index', {genre: ''}, 400);
				});
				it('"level" set to "string"', async () => {
					await get('folder/index', {level: 'Rh0EmvJGP^Oz603rK'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/index', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/index', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/index', {level: 75.15}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/index', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/index', {newerThan: 'BEL2B'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/index', {newerThan: 46.44}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/index', {fromYear: 'W^eTWVhIft%4zjO*VbV'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/index', {fromYear: 64.4}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/index', {toYear: 'F1A*y@qlru$'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/index', {toYear: 5.46}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('folder/index', {toYear: -1}, 400);
				});
				it('"type" set to "empty string"', async () => {
					await get('folder/index', {type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('folder/index', {type: 'invalid'}, 400);
				});
				it('"types" set to "null"', async () => {
					await get('folder/index', {types: null}, 400);
				});
				it('"types" set to "empty string"', async () => {
					await get('folder/index', {types: [null, '']}, 400);
				});
				it('"types" set to "invalid enum"', async () => {
					await get('folder/index', {types: [null, 'invalid']}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('folder/index', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('folder/index', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('folder/index', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('folder/index', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/index', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('folder/index', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('folder/index', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('folder/index', {sortDescending: 'YAeKj)9['}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/index', {sortDescending: -4207591232110590}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/index', {sortDescending: -8657163559895041}, 400);
				});
			});
		});
		describe('folder/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/id', {id: '72XCyZZfHsAJ('}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/id', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'h$A[eV!u)iRxM&W8vx', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/id', {id: 'rtRriS8N3)gnbF', folderTag: '4)[eu!%0S]'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'KdNsfg)*Z5(*gV(', folderTag: 2492100260134914}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'RfOWE4N]6NE0ps28Ssm', folderTag: -5497545077817345}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/id', {id: 'hyE#7@zc]Dve@wVR*', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/id', {id: 'b$#^z)(*TQSVL', folderState: 'g[@rmi(8)f9l'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/id', {id: '4tDc4[Vam', folderState: 2253759002443778}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'kJ!!yvvSR[Q', folderState: -5373866713022465}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/id', {id: 'MP$VZ]$', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/id', {id: '6h6(IENv', folderCounts: ')A9unR@'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/id', {id: '^Xx5QN', folderCounts: 4980075606835202}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'ZWOV^AmE9YTcBVtN', folderCounts: 758556462678015}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/id', {id: 'R*kkiB#^^afAeYVgU$8W', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/id', {id: 'zHOy8ou@J', folderParents: 'Up]a*GuDEMgHzX0bDN'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'E7DDle#5B', folderParents: -8029327258025982}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'pCCrpe', folderParents: 7378545160486911}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/id', {id: 'DVf7EdZThb0AU$02#2', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/id', {id: 'cJpdN3F9Nbx7%4WCYx1', folderInfo: 'pfUru'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/id', {id: ')Ju@xAi@o2r', folderInfo: -4086034002345982}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'sBXYbLzh8Oxu&[VjN$', folderInfo: 6506170520961023}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/id', {id: 'hB9I^@mTwTTM2bH', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/id', {id: 'RYaDdtUtbS0@', folderSimilar: 'kr*VP('}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/id', {id: '201E6', folderSimilar: -7355407831924734}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/id', {id: '1&9%o]EB', folderSimilar: 1659598050164735}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/id', {id: '%guRrWshCZ@Eh3G', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/id', {id: 'U[1#OIR', folderArtworks: 'uwvUDVM$R9Q%oBTO#34'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'ma7S7BWr4L*Z', folderArtworks: 6463950514290690}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'vjJ0MY0gDVAG^Pfw', folderArtworks: 1933789164994559}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/id', {id: '6]qjngEv5J@aSn', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/id', {id: 'vqclo]waU&z33pV*E4&C', folderChildren: 'Q$Lw!UqbPM@OV'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/id', {id: '02Kxhiezj0nJzNm', folderChildren: 8870017684733954}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'Wp(xcUCT&]#6!(Y8KG4', folderChildren: 2885901772390399}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/id', {id: '%%eD56$', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/id', {id: '2eb5CHdK6h', folderSubfolders: 'tVrRZ93Ub'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'a@k$lPYuI@k', folderSubfolders: -6523622717915134}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'yw9R)y1rCkXuT@Ohaq', folderSubfolders: -8178953965535233}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/id', {id: '!aO39q', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/id', {id: 'K)I^9$QH)Wz(9eu', folderTracks: 'f4D#CW8'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'IjU]pu0qysbZMO', folderTracks: 5295458507292674}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'F741Lob$WG', folderTracks: 5096746866704383}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/id', {id: '9(A1N7M', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/id', {id: 'tz45yrdGlkOUU)qc', trackMedia: 'CNQ3F(o&e2'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'wfnuM!Up', trackMedia: 3438016282492930}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/id', {id: ']cL%6TRNir1V(', trackMedia: -1186895417573377}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/id', {id: '8j)89Xkjp1', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/id', {id: ')O6aL', trackTag: 'luq$w'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'nxkgEZXGi^Aa*(Unt', trackTag: -6890340946542590}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'u3Gnk', trackTag: 623791776464895}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'C)yfJ7mglVO%', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/id', {id: 'E[qJVUxpNF', trackRawTag: '%hvS9niH@&'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'fVwmlXyfinVQ!', trackRawTag: -7988065972781054}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'LR)XU5ROnQl@on2c5nV', trackRawTag: 6176007593656319}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/id', {id: 'eVKLc&7k', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/id', {id: 'SnMES(b$%oi', trackState: 'ggz(0'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'gxky1@TcDNx', trackState: 8282822607372290}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/id', {id: '6!ssZSIbNDolH4b]rk', trackState: -5973838391148545}, 400);
				});
			});
		});
		describe('folder/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/ids', {ids: ['0MC1TyLut1i', 'S0mocm']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('folder/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/ids', {ids: [null, '']}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['HqyjUQC[P6', 'Or7P(C9*uRj1VxZO09P'], folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['Z^hs1G1v(!s(ktBp2', 'fxNWH#'], folderTag: 'vdaSCrryntk*9H5A'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['cxhNBd*v*owaaMgK6J4S', 'UK^lD^$wxufjV)kpRkC'], folderTag: 6187812231577602}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['N9Rz3!h&*Z8buID1u$*D', '4vg@eXjfP$9'], folderTag: 4548492676562943}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['iRroBax!c]fNY]VMIQ', 'DEm8Jnovx76$o%B'], folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/ids', {ids: ['$T@qYjZ', 'ixfjw%q)BJJUPI]'], folderState: 'MCgn9c)IKq4#iEcCC'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['^F7msE!1BZ', 'oV^PpbC&()FUSIT'], folderState: -7961436085026814}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: [')z0zsI0zqrCa7UbkOK3', '&KMqVV(Or5]zbYU8f'], folderState: -8233158071812097}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['s8kc!J', '7L)PYE'], folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/ids', {ids: ['afSzRfT6p$L', 'IOh(nflQ(53yeId'], folderCounts: 'kmeHTWfSSgp(iZ'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['&!i32)VS', '2W%kBL@'], folderCounts: 5416384674660354}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['t#&%4BO*d', 'TQ5%sW#hg^M'], folderCounts: 6119676622929919}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['9WL940PSsiDYpl*%k(t', ')plCF(ZGbTyI1XR)'], folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/ids', {ids: ['0Tj6FUP', 'K$5jYL3#pSSs'], folderParents: '^V0S1n3!#wwQM'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['%zu$YKPPOC', 'QvncPEoI827c'], folderParents: 455964855631874}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['7f3euHrS#', '$vI47F[l#Sv'], folderParents: 1743533362905087}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['ywYEjpgd', 'Ywa4l^CY3B'], folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/ids', {ids: ['8ONTDItT', 'V7RB!bxX2JXnehtJL'], folderInfo: 'G1vh^dS9$OWtt5f'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['LsSRTYx', 'W$pijR!h(Wa'], folderInfo: -4001206443704318}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['UvoBVug', 'rZ8eC@jzib]MvB63t'], folderInfo: -407362569502721}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['BhvtnwXpt$RL', 'zyR2MBbK!b3O*!T8'], folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/ids', {ids: ['P&SkMQwYm!MhM[DO', 'PV0J[&6^z'], folderSimilar: 'LvRf!QmF'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['52]SO9', 'soFIZ'], folderSimilar: -3517883841773566}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['EKtKJt$%Aw2W5s', 'VomqJ]26n9iZrphM'], folderSimilar: -3483126676324353}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['AS^WCyG', '(mTpYCStnLhQ(Z5'], folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/ids', {ids: ['Yt7Gs]', 'wmnOq5ODTjT'], folderArtworks: ')KLwnrHP$niGYj'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['iG3(Xm!v7rB', '4TZUekQ^cJ%Tw'], folderArtworks: 8829908327333890}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['FsB8exhJ(tldp', 'eG5EtzAjA)dAsU'], folderArtworks: 7267137529839615}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['l7xplkmci#hBdqEF', '4R0i#Bg'], folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/ids', {ids: ['yX0BeO]lU*', 'R18P8eq5#xliXLVu8'], folderChildren: 'o]M)9]'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['Q&%FM$XbT([CX', 'XoVmIWBBcqvszRiXrR'], folderChildren: -3889266706874366}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['k)eLH6M', 'N5UvOkSM3AyNa@@K'], folderChildren: 1896620027281407}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['u7MkoMF%!2!GDnSzSA', 'ftpFpmxMP)o'], folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/ids', {ids: ['gF]jjV', 'h8(YNk!X6*i6'], folderSubfolders: '1dAQ)NhqI(HaO6VNu8'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['aT#O(4', '4NkJsKoodISIiE'], folderSubfolders: 5226389888303106}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['Z3gZodJ0%w)L', '6jKi*)^TVZ&'], folderSubfolders: 5970231679778815}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['$xH4jg[w!1irmkSlF7(L', '@c68zhcc'], folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/ids', {ids: ['vZReuYi*', 'R8xKX5%@ZzDW'], folderTracks: '7eGjS'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['FXZ%Z)MPqFd', 'Pw%PLciR79r4Gu'], folderTracks: 3762278654541826}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['pMpntvQxiQvY5@', 'I]BrF'], folderTracks: 724854223405055}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['8LIFb#', 'R6N7j*!EW0'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/ids', {ids: ['r$tN&FEz%', 'uIm@kU5ZSFRbdrqLbN@'], trackMedia: 'Ni[%HRvjO)KBYI$O^s['}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['CgtySo0EmJkT]^^s', 'Sv](5[%0JwEGaUfk[Lo'], trackMedia: -8553034355310590}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['EB%Nz[Ob5Y%IKg)IzJ&', 'UgC91J4@t!5'], trackMedia: 5566972464988159}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['$tRmRdWux@MSn3Z', '9yQSi!kSQ'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['y0)Kg3FFZXm$sOj^o', '8Pxpy]O0'], trackTag: '#3X#Yan4Te'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['$se!mXBkhlx*p3', 'K4%RoMGxF8ivF[zca'], trackTag: -4469588037206014}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['BYZtk', 'JD!t2mzwq]xTnjaI]uOl'], trackTag: 539567664922623}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['VPJDx0S(VI24e9gNTp!m', 'R29u(hT5n6'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['S^dZ&(mE6R0W[', 'q7)#q&6OvW7&Ot'], trackRawTag: 'qwbte%X[G2JZs'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['SYM&UMY', 'Vb9UxHl7trk)q'], trackRawTag: 8491000536236034}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['1BjVHGACQOyZyLHP&z', 'v1f&&5TX#OB#@l'], trackRawTag: -6773637856100353}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['vMyzU5q*wZQtqQeAm', 'IKr!z3*yNgZ'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/ids', {ids: ['B%oXlaecBU0(5ajEC7', 'v2g1IEt1icrwL7$yjB#1'], trackState: 'h2lAVMWHBYKp]t'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['qJLrUu', 'xMcJzda&oB[lDqih!yQ7'], trackState: 844521734668290}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['I51Shhhi2c', 'l4*Te!%PPRUxH6vm)uz'], trackState: 3478067108380671}, 400);
				});
			});
		});
		describe('folder/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/tracks', {ids: ['r4^J1!&', '6hPFvgx%KWn']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('folder/tracks', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/tracks', {ids: [null, '']}, 400);
				});
				it('"recursive" set to "empty string"', async () => {
					await get('folder/tracks', {ids: [']N*9(GAm8m', 'on[cNLdCC5tNv^n*'], recursive: ''}, 400);
				});
				it('"recursive" set to "string"', async () => {
					await get('folder/tracks', {ids: ['(*QClS[SgDW6T', '^NyeJ0g[SNh'], recursive: 'WH5J6v$$'}, 400);
				});
				it('"recursive" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['a8O$[P[V', '5JFnK]hu'], recursive: -1850752045678590}, 400);
				});
				it('"recursive" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['Zk0B%0WsOJO)OJ4', 'zAWiGPitG[x$q4TFp&c'], recursive: 25740556894207}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['k1B8&', 'IWLT!RL)6'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/tracks', {ids: ['DsyTmO7DQh0#8yj7m', '8c3C*z*IkSKwJ'], trackMedia: '4m54(ta8)N5d'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['xFM)m8IznXy0Jh*Qga1%', 'f8SNkIjEu8UcjJY'], trackMedia: -7242048847478782}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['RVT932S', 'QBfHhHPE'], trackMedia: 8431975304003583}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['75p%3gi&IDg4py', 'J@8&*'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['!HG#mr5Wjpk', 'F]p[IV(!b]'], trackTag: 'YV^0R^O7Mdw'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['PKHWO9rznX&V', 'p^!XtB9Se$*$P[L&'], trackTag: -5261781362540542}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['RN$V2Rpg', 'Hrd$(XHo1GwNi%3'], trackTag: -500171104321537}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['92*sqyQJ%l&CAq', 'wTGK*HFRuM'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['u$avV2', ']Df4&90EFz^jpFtdzxar'], trackRawTag: '#jm))L8p)'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['nE&Eg9Vl', 'iJhEN3kHlY*Yy6NUJy'], trackRawTag: -3798377854664702}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['%2u7g5f7b[gZj', 'gf!h4nM0[#Et2xu'], trackRawTag: 5101528394235903}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['19yGF&jWLE', 'b^vQr]7H(KmVr)G&5'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/tracks', {ids: ['aBgKIiW0gp', '&^P[@'], trackState: 'Y8vXo'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['zv]F[4csC2laoYBW', 'I2D7hk'], trackState: 856451740336130}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['9KH)p@WP6kn5J', 'Zruck'], trackState: -4620103026999297}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/tracks', {ids: ['nZ*$4@H8$9A!Dp', 'vphhE2[I'], offset: 'qB6XSqmJWx3c^[JP'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['h5OO7Is(NG@reRAH7', '9zrWc!&xu]jPpUT'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['rfL&ubEQmAD&', '9OjBxTTZpcij3H0'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/tracks', {ids: ['AZpi46vH', 'HDS@Y]XEG'], offset: 15.72}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/tracks', {ids: ['o^z[E)L81c805hLikF', 'RW1MW]6'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/tracks', {ids: ['xsZsm', '@Phdg[5Awc'], amount: 'T%wmdtv'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['xUYuM', 'YkaUhyoCdruM'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['n7*XQg', '2Jytunm['], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/tracks', {ids: ['98LysdjL&nMyYDoYq', '*YlAw'], amount: 99.72}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/tracks', {ids: ['KqVIG', 'SbbBXykCG54fZnY'], amount: 0}, 400);
				});
			});
		});
		describe('folder/subfolders', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/subfolders', {id: '&M^)ElLE)^9'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/subfolders', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'oGk%T3t524Ek', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/subfolders', {id: 'j^i]QF)Mk5d(e4hU$V', folderTag: ']bx0(jW[8cErWXrug'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'N0Xbe48gV)M', folderTag: 6675155040337922}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'iqRSMTIo4$sw', folderTag: -2798937643679745}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'Vc[tI3w!7g4yZzJK7m', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/subfolders', {id: 'BLK)qfh', folderState: 'KzUV6r%cjXMqb^rmedA'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '*5*x$T', folderState: -7120194753265662}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'MZExoTuNeOzC', folderState: 696366191869951}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'HwpyI', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/subfolders', {id: 'F9#uowXIIxXB#lsQ&z', folderCounts: 'pOFILaZ]'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'EK%p$z[SboNec%LpiW', folderCounts: 1378094032093186}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'Ac*w^Wm5', folderCounts: 5393529832472575}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'hh@5iY@%yw1JA&Ha4', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/subfolders', {id: 'Cig2&HmgV19tPm', folderParents: 'DwH0$*G[41)gk2ffzZ*'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'O8S9Gz$qNK(LoIYaG%', folderParents: -1801804543164414}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'KhxovZxgNK$9!gGQvXoM', folderParents: 3616091431501823}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'HHA(BJ5bR1Q(I%jW2*', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/subfolders', {id: 'e*BGVg]j', folderInfo: '8DKaQqszfpsLvBdGao]%'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'z[Wp$c#JDH@tLj*iFD', folderInfo: -571381456568318}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'JuiZ[sC7!BcQXRxS[v%[', folderInfo: -508778550132737}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'JBiTXk%o^X]', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/subfolders', {id: 'BSiH8152', folderSimilar: 'wG6kDWJ7DRp*'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '9H@OZ^eTM', folderSimilar: 1238750583586818}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: '$F1FGwVO4^U0xXFx!Qh1', folderSimilar: 6687794969706495}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '&ut$g6FWa9GYb@', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/subfolders', {id: '3dq^TR]MZSdXB', folderArtworks: '(]NR0SmM'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'QftyRUju&]7#', folderArtworks: 891307920719874}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'HK5u9(2&K', folderArtworks: -770841197412353}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/subfolders', {id: 'd#FpxoB*]7qLnI0&R', offset: 'EFaZT'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'J2KY*fkU6)AIu', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/subfolders', {id: 'ec5EP$rGJxv8J8aeXT1', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/subfolders', {id: 'nkI]mwMkZ$x$^', offset: 91.7}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/subfolders', {id: 'mKKANGWXfx6c', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/subfolders', {id: 'yvRObrd6oj9@Kos', amount: '6p9jbcPee%ev@x9[h$ri'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'D]s04CBn*WEH63N*]Rf', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/subfolders', {id: 'LjRR2)Ep[', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/subfolders', {id: '@86g9S', amount: 93.64}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/subfolders', {id: 'CTQ6C#Vpx!lE$U*qZ', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/similar', {id: 'EzVH6rKRdcZLi^J8'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '3vEQ8qGY', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'zMs&HV', folderTag: 'MDF77aI[RD!HO&ZM'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'RjEjn]ZKZ$9', folderTag: -5552625541971966}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'xxShptnxOZX*E', folderTag: 3490897341710335}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'Q*jYo0#2$Y2r%mQG', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'LmXB4h6e@0sLP', folderState: 'dV6%e!%Aq'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'zHjVi9rgL3R)Ku8^', folderState: 5046714209665026}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'lsH7i6fe#3', folderState: -5250369080786945}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 't5(^16P@uGeP0OW#L', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/artist/similar', {id: '^U%MRS1G2wxP9G@N', folderCounts: 'd]u^qShBh'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'zz%51FLDb%Y1XS5', folderCounts: -6758344526135294}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '04Zb77D^TdbgA#Mou2T&', folderCounts: -1623622015778817}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'e[@!N', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'DGfc2U!9@TBb)L8tvtU', folderParents: '9^Qq&C'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: ')r]jN', folderParents: 2711916925419522}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'PkF8GI', folderParents: -6160161165017089}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '*FbF@r*A3*29Df6]xO', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/artist/similar', {id: '48Bjiww', folderInfo: '&LO7l35!1Y17O%'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'F^y#BQ#t$5N$#', folderInfo: 2432256756940802}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'kAByPx)nd9e', folderInfo: 297941931655167}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '%yVZ1$Lb^4AaXXVR$B', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'gFamy4YguT!ImL', folderSimilar: '4%kzL'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'fJn(L4d', folderSimilar: -6795000142626814}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '@o@TiZ[RZf0v3W', folderSimilar: 2675739841265663}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'AQug6', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'm&Lrv', folderArtworks: 'kcT8fSlaIRhuT3t'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '1*%jALGVXAcc03p2RSvl', folderArtworks: -2684645254627326}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '($oBk^f', folderArtworks: -3671018707091457}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'IlzID$xmg%Gw', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'WonGwE)NJ4op', folderChildren: 'mEw6vbgw&*6tz%)#69'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'W@M]vtgNOD$mQOZ8Y7v', folderChildren: 4457946230554626}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'X([NRo%HQM', folderChildren: 5019428072718335}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'SK^GqB%lEbK8Gg', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'tKW6A', folderSubfolders: 'D#RDED'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'a5@M1W', folderSubfolders: -1664471684612094}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'GR1TaPg!yylMw02ucsx', folderSubfolders: 7513876446838783}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'G0HKCgY0pTNcC%@bU', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/artist/similar', {id: '1bDv^fG', folderTracks: '^Tf4Cni6@'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'DjlRogrvE@]Tvxc3', folderTracks: 4097385458302978}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'IKX7t*C', folderTracks: -7887686132039681}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'NKABZWg38&dJ', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'rjKqxQ#2P!gfFqZpEZm', trackMedia: 'NN2KnLqDy34Rw0F0lo'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'JS73FQqy6jrr', trackMedia: -2618764168265726}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'D0OXuX!WSk', trackMedia: 1440319337922559}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'WvyT%T]*bQE$bQIvX&', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'zwgP&Vn%T', trackTag: 'WW4PbGFT^'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'T$r@0ftS@uBJq%1KzZ$', trackTag: 3392382716346370}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '^FARbLpu', trackTag: -4669132058394625}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'TC[3c5W%ie@$@T', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'W$D8yW', trackRawTag: '5E8]VO'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'oDhtUzKs@pJj)f2)', trackRawTag: 6377813569437698}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'C0*M*L!JLI5fg5', trackRawTag: -2863986785648641}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'an]%s', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar', {id: ']ZcSbmP', trackState: 'MCzt*5I4M'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '(I$nM^Va1@g', trackState: -1585815796842494}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'yHAa^KQQPlBaWN$^', trackState: -8027572667416577}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'RP23U9&1', offset: 'mynlqhEP8&*CyJU5'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '352(cKci3@ZEl3', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'rXx3#A6@q9aj4EHHhO', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar', {id: 'SdYJW2P(', offset: 93.56}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar', {id: 'nmzG^)*a5', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar', {id: '2v3AgQAkP^VKzfdLoka', amount: 'xfQfvNa!Pgt^(rSU@&rG'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'H)YpJueJr0', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'K&7(Dw325', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar', {id: 'Nx61!@ses', amount: 78.96}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar', {id: '[4BZ&!C9I3sh%b39C', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/info', {id: 'WOGiY'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/info', {id: ''}, 400);
				});
			});
		});
		describe('folder/album/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/album/info', {id: '7o[myGGC!'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/album/info', {id: ''}, 400);
				});
			});
		});
		describe('folder/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/list', {list: 'recent'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"list" set to "empty string"', async () => {
					await get('folder/list', {list: ''}, 400);
				});
				it('"list" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'invalid'}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('folder/list', {list: 'highest', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', rootIDs: [null, '']}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', parentID: ''}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', childOfID: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', artist: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', genre: ''}, 400);
				});
				it('"level" set to "string"', async () => {
					await get('folder/list', {list: 'highest', level: 'u3dfYVWJ!ei*mj$'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/list', {list: 'faved', level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/list', {list: 'frequent', level: 12.03}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'highest', level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', newerThan: 'l&Z4pWgU'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/list', {list: 'highest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/list', {list: 'faved', newerThan: 49.72}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'faved', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/list', {list: 'random', fromYear: '9&m!Wm*WjrO1'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'recent', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/list', {list: 'random', fromYear: 62.14}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'recent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/list', {list: 'random', toYear: 'w&kV$Rr0p$sVP('}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'frequent', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/list', {list: 'random', toYear: 43.91}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'avghighest', toYear: -1}, 400);
				});
				it('"type" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'random', type: 'invalid'}, 400);
				});
				it('"types" set to "null"', async () => {
					await get('folder/list', {list: 'highest', types: null}, 400);
				});
				it('"types" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', types: [null, '']}, 400);
				});
				it('"types" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'recent', types: [null, 'invalid']}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('folder/list', {list: 'recent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('folder/list', {list: 'faved', sortDescending: '3Ax2$omAhT1OaS1JSh4'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', sortDescending: -8852694173220862}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'recent', sortDescending: -2130336758628353}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/list', {list: 'highest', folderTag: 'ce5ob!WgyN!I]7i'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'recent', folderTag: -6669632261849086}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'highest', folderTag: -4702572472434689}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderState: '#G6%#I'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'avghighest', folderState: 6852342821421058}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'faved', folderState: 5694321776918527}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/list', {list: 'highest', folderCounts: 'idHy&ay#X!'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', folderCounts: -1386431142428670}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', folderCounts: 5889228688850943}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/list', {list: 'highest', folderParents: 'U4fEZa9'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'avghighest', folderParents: 6735893213741058}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'recent', folderParents: -4089482869473281}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', folderInfo: 'a^xhqvSg'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', folderInfo: -1655322452164606}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'random', folderInfo: -1332032684687361}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/list', {list: 'faved', folderSimilar: 'YvDE)UbgngP'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'recent', folderSimilar: -1115986023415806}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'highest', folderSimilar: 8107043340681215}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/list', {list: 'random', folderArtworks: '9gfP3Fv0qYuIi#nEk8'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'frequent', folderArtworks: -2401922057240574}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'recent', folderArtworks: 7709709037469695}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/list', {list: 'random', offset: 'FZ9y$l3G#Syima'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/list', {list: 'random', offset: 43.51}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'recent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/list', {list: 'recent', amount: 'Jk^peYE59iHvpT*sCAC'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/list', {list: 'faved', amount: 50.25}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/list', {list: 'avghighest', amount: 0}, 400);
				});
			});
		});
		describe('folder/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('folder/search', {offset: 'Q)Zj&wOBNUYyD'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/search', {offset: 45.03}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/search', {amount: 'b5v#5t'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/search', {amount: 33.04}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/search', {amount: 0}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('folder/search', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('folder/search', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('folder/search', {rootIDs: [null, '']}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('folder/search', {parentID: ''}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('folder/search', {childOfID: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('folder/search', {artist: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('folder/search', {title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('folder/search', {album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('folder/search', {genre: ''}, 400);
				});
				it('"level" set to "string"', async () => {
					await get('folder/search', {level: '4%uaLFm8foK9UM75ND6o'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/search', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/search', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/search', {level: 97.57}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/search', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/search', {newerThan: 'u7a4)Wvn%0C1xlMyt'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/search', {newerThan: 37.79}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/search', {fromYear: 'M*$We6VR'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/search', {fromYear: 45.25}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/search', {toYear: 'OZK7nHk['}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/search', {toYear: 54.48}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('folder/search', {toYear: -1}, 400);
				});
				it('"type" set to "empty string"', async () => {
					await get('folder/search', {type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('folder/search', {type: 'invalid'}, 400);
				});
				it('"types" set to "null"', async () => {
					await get('folder/search', {types: null}, 400);
				});
				it('"types" set to "empty string"', async () => {
					await get('folder/search', {types: [null, '']}, 400);
				});
				it('"types" set to "invalid enum"', async () => {
					await get('folder/search', {types: [null, 'invalid']}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('folder/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('folder/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('folder/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('folder/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('folder/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('folder/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('folder/search', {sortDescending: 'G7lZttV!%!'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/search', {sortDescending: 8225596303736834}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/search', {sortDescending: 6510032992600063}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/search', {folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/search', {folderChildren: 'S7Dhz)'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/search', {folderChildren: -500227299606526}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/search', {folderChildren: -5470233661800449}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/search', {folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/search', {folderSubfolders: '@(%YsbBoHHj'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/search', {folderSubfolders: 8108000162086914}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/search', {folderSubfolders: 7568835418783743}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/search', {folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/search', {folderTracks: '!)d&cVaF#iA'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/search', {folderTracks: -3595760734044158}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/search', {folderTracks: 607649116717055}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/search', {trackMedia: 'OnP)10'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/search', {trackMedia: -3007112028356606}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/search', {trackMedia: 8320128626196479}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/search', {trackTag: 'q&yKu]0us2771eEA3C'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackTag: -3824709036670974}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackTag: -731946980212737}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/search', {trackRawTag: 'igv@ARexZGrvRBZWF'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackRawTag: -6298674975997950}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackRawTag: -6019304881389569}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/search', {trackState: 'UNcBbs9pmuJn1Cd'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/search', {trackState: -3311326516477950}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/search', {trackState: 3316651491590143}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/search', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/search', {folderTag: '[F5lgCUnZsS'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/search', {folderTag: 3455758427488258}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/search', {folderTag: -8938522773815297}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/search', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/search', {folderState: '8J$X(IJ18cAq&Se26$'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/search', {folderState: -2155629334495230}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/search', {folderState: -1140921227804673}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/search', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/search', {folderCounts: '9ll#N607yu'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/search', {folderCounts: -5738256142434302}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/search', {folderCounts: 265743308423167}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/search', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/search', {folderParents: '56ohcx7UnV]ivV)c^J'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/search', {folderParents: 340183924867074}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/search', {folderParents: -6567275595300865}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/search', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/search', {folderInfo: '3O2norm0yfMJJC'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/search', {folderInfo: 8281267174899714}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/search', {folderInfo: 4871186185977855}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/search', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/search', {folderSimilar: 'iqjitD2Cqz'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/search', {folderSimilar: 7355459023405058}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/search', {folderSimilar: 2262454595747839}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/search', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/search', {folderArtworks: 'v8nPb7bN[^nfh!d171'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/search', {folderArtworks: -1800570734116862}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/search', {folderArtworks: 3894603795136511}, 400);
				});
			});
		});
		describe('folder/health', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/health', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('folder/health', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"rootID" set to "empty string"', async () => {
					await get('folder/health', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('folder/health', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('folder/health', {rootIDs: [null, '']}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('folder/health', {parentID: ''}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('folder/health', {childOfID: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('folder/health', {artist: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('folder/health', {title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('folder/health', {album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('folder/health', {genre: ''}, 400);
				});
				it('"level" set to "string"', async () => {
					await get('folder/health', {level: 'z@o(Q'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/health', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/health', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/health', {level: 8.85}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/health', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/health', {newerThan: 'T5Jgdn0'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/health', {newerThan: 42.5}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/health', {fromYear: 'lNV5]Z@@LDLZd('}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/health', {fromYear: 54.85}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/health', {toYear: 'kq!kE8@#'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/health', {toYear: 88.26}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('folder/health', {toYear: -1}, 400);
				});
				it('"type" set to "empty string"', async () => {
					await get('folder/health', {type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('folder/health', {type: 'invalid'}, 400);
				});
				it('"types" set to "null"', async () => {
					await get('folder/health', {types: null}, 400);
				});
				it('"types" set to "empty string"', async () => {
					await get('folder/health', {types: [null, '']}, 400);
				});
				it('"types" set to "invalid enum"', async () => {
					await get('folder/health', {types: [null, 'invalid']}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('folder/health', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('folder/health', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('folder/health', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('folder/health', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/health', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('folder/health', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('folder/health', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('folder/health', {sortDescending: '7&wLh]'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/health', {sortDescending: 6440188712583170}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/health', {sortDescending: -7030004684685313}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/health', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/health', {folderTag: '7PGJz'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/health', {folderTag: 1842834571264002}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/health', {folderTag: 276901415354367}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/health', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/health', {folderState: '6Sg7oh3G*N$o3N'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/health', {folderState: -1732437113569278}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/health', {folderState: 3454894304395263}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/health', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/health', {folderCounts: 'JjKkeukCN0&*7F9'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/health', {folderCounts: 8824184742346754}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/health', {folderCounts: 4965517790019583}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/health', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/health', {folderParents: 'zQfHrk*BV)jdF'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/health', {folderParents: 336585832792066}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/health', {folderParents: 1385091586588671}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/health', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/health', {folderInfo: 'RYzN9[4M*Vl14@KM!fm'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/health', {folderInfo: 4673649135058946}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/health', {folderInfo: 8750751937462271}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/health', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/health', {folderSimilar: 'EAKeqXFW%d]sx2Ie4c&'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/health', {folderSimilar: -7167917489651710}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/health', {folderSimilar: 874323229278207}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/health', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/health', {folderArtworks: 'I5i4TTw6JUFTAjuY50'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/health', {folderArtworks: -1576175033909246}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/health', {folderArtworks: -5171762094407681}, 400);
				});
			});
		});
		describe('folder/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/state', {id: 'yXgCU8R1(NWi$@1'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/state', {id: ''}, 400);
				});
			});
		});
		describe('folder/states', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/states', {ids: ['B%Ku9DlzNSQ!MPM', 'Ot(F]P']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('folder/states', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/states', {ids: [null, '']}, 400);
				});
			});
		});
		describe('folder/artist/similar/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/similar/tracks', {id: 'pEYA!Wt'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'jxdbyg^WT$6ba8Jt1', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'qZoA*oGKZmHXy%Kh^C', trackMedia: 'xm^$Op)(UgYtHinjn'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Denv1x', trackMedia: 5693405208248322}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'kt5eVRUZ67wG]vY*LD', trackMedia: -1572772274765825}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '#Bwu5pe@mIRsU4G', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'hPc9tC1D!$)Rj5pbO*y', trackTag: 'fs##c@cFYg09R3gucK3!'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'TDTRd)HYotF)', trackTag: -7983665711677438}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Bd4qjJQZ0li)l[r', trackTag: 6843313508319231}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'fBJZtvjxqMl', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: '5PhqoeWMbar!&0', trackRawTag: 'dqyFXaT'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'NBwvC', trackRawTag: 6811764998012930}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'gvCnlLRk[I!', trackRawTag: 3626694032228351}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '!$&DiXg', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'lLUuoJQF&P', trackState: 'DR^GkuVws9NNl5!oA'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'RuQ#*gIicw', trackState: 6517019310555138}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'TXGc1SW', trackState: 3576584128692223}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Ed5zdzOemJ%&TR', offset: '&CMUF'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'm5zNu*9', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'UJlF]enCGk', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: '2HcjL5!&&n', offset: 16.61}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar/tracks', {id: '^QbK@E%HC5jxb4', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: '3ZryexaR3VvD', amount: 'iEqGRr*]yEs[pPdF]'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Nwm1TC(DzKY', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: '8eo(P8*&hx5**', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: '@k#RYk0E3HA@P#puVC', amount: 43.59}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'URalHUJ&yQPhz0#^Hj5', amount: 0}, 400);
				});
			});
		});
		describe('folder/artworks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artworks', {id: '5mqyZp$'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artworks', {id: ''}, 400);
				});
			});
		});
		describe('track/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/id', {id: 'FtLgU3R8AB'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/id', {id: '2]T4mi4B13@!0GD', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/id', {id: '1NvHin7r)VN&', trackMedia: '(W^4eu'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/id', {id: 'q6Ali*F^HAB9F]2j[hTS', trackMedia: 4696068226809858}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/id', {id: ')NVEUx7h4#Y1', trackMedia: -7967043059974145}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/id', {id: 'ahUcT90%33qpra', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/id', {id: 'NM9w78ua', trackTag: 'PrX3)!2Li#6'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/id', {id: '&a%g#I)1XzZ', trackTag: -5188639730434046}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/id', {id: 'VHxnWxYKH*r#4Q', trackTag: 8151772862349311}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/id', {id: 'Ny)Ym0WoBm1&^', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/id', {id: 'kE06iT#H]T', trackRawTag: 'L5IN75d^wwZeaaqP'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/id', {id: 'PREn7cC@qhR%08(6ya', trackRawTag: 4488753598955522}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/id', {id: '0*v^teb', trackRawTag: -8891637010792449}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/id', {id: 'XiRl2Reic2%5g$R2mY', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/id', {id: 'H5xme^pPx%r%!8^(', trackState: '*^Ohm#ny8%DmF5r$*'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/id', {id: 'GyLM1$sgxS#XMIGn', trackState: -2627345475174398}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/id', {id: 'bBNtJ8@HeMb8i@zNN', trackState: 3099198949949439}, 400);
				});
			});
		});
		describe('track/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/ids', {ids: ['beE*3J', 'y!c&s']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('track/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/ids', {ids: [null, '']}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/ids', {ids: ['d(HdTX', 'yd@(yMqpEPYGJZJ'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/ids', {ids: ['qwe6n9wwF', 'ENwZoa[lcqqlM(U'], trackMedia: 'E@WCXq*A7'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['zez)g', 'ZtcwIG^yJbieBKIkz'], trackMedia: -8687449609863166}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['27b3CUv1eKKMunEz3e4D', '(iHjynH^eFSyTH$^H'], trackMedia: -4471747512369153}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['$DGXubg', '@6Wln^5u%o5f2mHC9'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/ids', {ids: ['gYv4O', 'eMRfZtNQd'], trackTag: '*mvfYbcYq4BMENKm4'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['64s^ntm9Aia', 'UKvq3pO0&P'], trackTag: -4380876158795774}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['yFHN5', 'kxRhv@5^iflc'], trackTag: -6829483717820417}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['e3Q2UlcD0w&Ch0l5', 'q*VTU]Imbwl9rufq0Qmk'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/ids', {ids: ['6aVoo69fwx2Q', 'gg)pMdkeee(#p'], trackRawTag: '9p[NDdp(h'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['^)h$1q15!j[57#iK', '64yHMM!WQo)9$gc('], trackRawTag: 1840305435312130}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['zSN(%GJ4F', ']fF&Yg)F$%ncsy'], trackRawTag: 7692722496339967}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/ids', {ids: ['Ptvze(X$n[RPPsHxcl', 'UEf9j4N6'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/ids', {ids: [']mO4U(z', '[rVjJ2q4sM^oVx0Jjhk'], trackState: 'fkqlWGRD'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['1#%9F', '!iDCbZGTEpW%RgU'], trackState: 103639452483586}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['WpVBiNcpqv', ')2cUC2D2DMRaLqc'], trackState: 1282711926865919}, 400);
				});
			});
		});
		describe('track/rawTag', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/rawTag', {id: '97^Q$*'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/rawTag', {id: ''}, 400);
				});
			});
		});
		describe('track/rawTags', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/rawTags', {ids: ['[h7IGR#RSxkuAB)', 'I0SVw51p[rK']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('track/rawTags', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/rawTags', {ids: [null, '']}, 400);
				});
			});
		});
		describe('track/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('track/search', {offset: '[5!zmsDOdRwMN(JMdEW7'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/search', {offset: 13.59}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/search', {amount: 'n7faHUS7m[X'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/search', {amount: 69.41}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/search', {amount: 0}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('track/search', {artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('track/search', {artistID: ''}, 400);
				});
				it('"albumArtistID" set to "empty string"', async () => {
					await get('track/search', {albumArtistID: ''}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('track/search', {parentID: ''}, 400);
				});
				it('"parentIDs" set to "null"', async () => {
					await get('track/search', {parentIDs: null}, 400);
				});
				it('"parentIDs" set to "empty string"', async () => {
					await get('track/search', {parentIDs: [null, '']}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('track/search', {childOfID: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('track/search', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('track/search', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('track/search', {rootIDs: [null, '']}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('track/search', {title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('track/search', {album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('track/search', {genre: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('track/search', {newerThan: 'glFm&VBdFsMY8FFK'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/search', {newerThan: 4.49}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/search', {fromYear: 'JPQ6GJJKfrP'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/search', {fromYear: 41.25}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/search', {toYear: 'DS[N8b'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/search', {toYear: 95.2}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('track/search', {toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('track/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('track/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('track/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('track/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('track/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('track/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('track/search', {sortDescending: 'DhkoPa1z4Ku)'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/search', {sortDescending: 2494174561566722}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/search', {sortDescending: 2008464012345343}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/search', {trackMedia: '6##l*'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/search', {trackMedia: -3579697912872958}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/search', {trackMedia: 155968553877503}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/search', {trackTag: '$wa&f2X4nFKb&1'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/search', {trackTag: -7009082405814270}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/search', {trackTag: -6137483674779649}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/search', {trackRawTag: 'j82SbPwfspP3REd4!Yk'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/search', {trackRawTag: -1349406557208574}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/search', {trackRawTag: -7301638070992897}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/search', {trackState: '[JJooe!w8'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/search', {trackState: 3556638896160770}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/search', {trackState: 8309577531523071}, 400);
				});
			});
		});
		describe('track/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/state', {id: 'rREmx&k[]u[!'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/state', {id: ''}, 400);
				});
			});
		});
		describe('track/states', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/states', {ids: ['9eL1[Tat6r7', 'xSSasbKad']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('track/states', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/states', {ids: [null, '']}, 400);
				});
			});
		});
		describe('track/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/list', {list: 'frequent'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"list" set to "empty string"', async () => {
					await get('track/list', {list: ''}, 400);
				});
				it('"list" set to "invalid enum"', async () => {
					await get('track/list', {list: 'invalid'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', artistID: ''}, 400);
				});
				it('"albumArtistID" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', albumArtistID: ''}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('track/list', {list: 'random', parentID: ''}, 400);
				});
				it('"parentIDs" set to "null"', async () => {
					await get('track/list', {list: 'frequent', parentIDs: null}, 400);
				});
				it('"parentIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', parentIDs: [null, '']}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('track/list', {list: 'random', childOfID: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('track/list', {list: 'frequent', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', rootIDs: [null, '']}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', genre: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('track/list', {list: 'frequent', newerThan: 'EcsyHhCd'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/list', {list: 'faved', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/list', {list: 'highest', newerThan: 10.02}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'highest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/list', {list: 'recent', fromYear: 'AWS^951q'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/list', {list: 'highest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/list', {list: 'faved', fromYear: 14.57}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'frequent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/list', {list: 'highest', toYear: 'SIepv9Jnk2'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/list', {list: 'random', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/list', {list: 'highest', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', toYear: 43.95}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'random', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('track/list', {list: 'avghighest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('track/list', {list: 'highest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('track/list', {list: 'highest', sortDescending: 'umEE1(a)@kw'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/list', {list: 'highest', sortDescending: 2802394702282754}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/list', {list: 'frequent', sortDescending: 5663080881061887}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/list', {list: 'frequent', trackMedia: '(Zp@AkBkwSw'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/list', {list: 'frequent', trackMedia: -4640995933159422}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/list', {list: 'recent', trackMedia: -1256816965058561}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/list', {list: 'random', trackTag: 'oFOY**OcPxB(a'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'recent', trackTag: -979427139780606}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'recent', trackTag: 3645166791426047}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/list', {list: 'avghighest', trackRawTag: 'Eb6tV$'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'avghighest', trackRawTag: 2394764938838018}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'avghighest', trackRawTag: 148394551017471}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/list', {list: 'recent', trackState: 'Ii(!xpH!31k53&]0OV*F'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/list', {list: 'recent', trackState: -4378161722687486}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/list', {list: 'random', trackState: 5924106671226879}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/list', {list: 'highest', offset: 'fBW@PwmYG]09M'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/list', {list: 'random', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/list', {list: 'recent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/list', {list: 'recent', offset: 88.4}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'recent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/list', {list: 'frequent', amount: 'mVdciZ^tl*BMV1P2WG8'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/list', {list: 'highest', amount: 88.62}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/list', {list: 'highest', amount: 0}, 400);
				});
			});
		});
		describe('track/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/similar', {id: 'FHK&t@lebvcb0'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/similar', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/similar', {id: 'CoTNC23!0lSHRns', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/similar', {id: 'vfENEpAU', trackMedia: 'pR(ye0*wCtncLyQ'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/similar', {id: '^3e5BM9[u', trackMedia: 4692228085645314}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'W01Nafl6PsrD%dbQ3m', trackMedia: 3230265732235263}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'ck9p@*mcc()Q[iO', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/similar', {id: 'Kv0I3blU2)UQo7g', trackTag: 'KehuDGgYpbyViILSJb29'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'v^Vl(9SVl', trackTag: -1591844781686782}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'weH&970PFIluzwH', trackTag: -6710009480085505}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'Gks#BqZ', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/similar', {id: '[gSKK7VEav)lco$8d5#', trackRawTag: 'BLS%QPG#Ew]aIJZOY'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'kJbqHWGN4P)ojrD6qx', trackRawTag: 2387371005837314}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'K7ws*dg]&Z(eN', trackRawTag: 7763297755463679}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/similar', {id: 'KoS5gre7fthmdjwR', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/similar', {id: 'X]I4hCTzJLdwX', trackState: 'Pb6L!'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/similar', {id: '^IX!I8Fkc', trackState: 7608724529086466}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/similar', {id: '1N@^D^1#TZ%k6G1K', trackState: 1323558445776895}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/similar', {id: 'aXQ0)V@t$ZR(', offset: '!a!sH8zMG'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/similar', {id: 'v&mglSYNFOlW', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/similar', {id: 'GraQG!lxB7', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/similar', {id: 'F7]E&tBu', offset: 36.88}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/similar', {id: 'fE@dLMtZ3whw&7D', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/similar', {id: 'yEvsEqJ91aRW', amount: 'sm[(EwH%k5Rm7V#$'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/similar', {id: '5v1qfdL*pPeAV4kwY', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/similar', {id: 'Y8I[4pG', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/similar', {id: 'D@GI%', amount: 39.5}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/similar', {id: 'E5uVLrnT]*N]sS0cJ#', amount: 0}, 400);
				});
			});
		});
		describe('track/health', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/health', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/health', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"media" set to "empty string"', async () => {
					await get('track/health', {media: ''}, 400);
				});
				it('"media" set to "string"', async () => {
					await get('track/health', {media: 'dDloLJ976bgZBPOHV9'}, 400);
				});
				it('"media" set to "integer > 1"', async () => {
					await get('track/health', {media: -8711392035078142}, 400);
				});
				it('"media" set to "integer < 0"', async () => {
					await get('track/health', {media: 1818649480396799}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('track/health', {artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('track/health', {artistID: ''}, 400);
				});
				it('"albumArtistID" set to "empty string"', async () => {
					await get('track/health', {albumArtistID: ''}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('track/health', {parentID: ''}, 400);
				});
				it('"parentIDs" set to "null"', async () => {
					await get('track/health', {parentIDs: null}, 400);
				});
				it('"parentIDs" set to "empty string"', async () => {
					await get('track/health', {parentIDs: [null, '']}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('track/health', {childOfID: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('track/health', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('track/health', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('track/health', {rootIDs: [null, '']}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('track/health', {title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('track/health', {album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('track/health', {genre: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('track/health', {newerThan: ')G)yr@FEki'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/health', {newerThan: 24.92}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/health', {fromYear: 'bOo0LlIBCn@fJ'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/health', {fromYear: 39.88}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/health', {toYear: 'ItPHZbqK!'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/health', {toYear: 79.5}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('track/health', {toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('track/health', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('track/health', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('track/health', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('track/health', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/health', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('track/health', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('track/health', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('track/health', {sortDescending: '(n&Wu1PAR'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/health', {sortDescending: -6988692161822718}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/health', {sortDescending: 3171232207863807}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/health', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/health', {trackMedia: ']OHw1)JQvPpW'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/health', {trackMedia: -2180769896202238}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/health', {trackMedia: 916697263374335}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/health', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/health', {trackTag: 'x^XsTMqfdpthN3##'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/health', {trackTag: -4485366081912830}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/health', {trackTag: 232931142402047}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/health', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/health', {trackRawTag: 'Kjd9KZj#[mQ!2pedh8JI'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/health', {trackRawTag: 1110836923858946}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/health', {trackRawTag: 4921548959907839}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/health', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/health', {trackState: 'NlB[&WqwR'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/health', {trackState: -7972105022865406}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/health', {trackState: 4362536757493759}, 400);
				});
			});
		});
		describe('track/lyrics', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/lyrics', {id: 'b@t&t4how$r*lD'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/lyrics', {id: ''}, 400);
				});
			});
		});
		describe('episode/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/id', {id: '%JSIIut'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/id', {id: 'QiV4eV', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/id', {id: 'KD@32UX$xr0B5mE', trackMedia: 'K%!rAL$wIRjw%^n'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/id', {id: ']x^8#QbN*T', trackMedia: 7908731262074882}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'Rj60S', trackMedia: -1767827375652865}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/id', {id: 'O$Cg34Ndo', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/id', {id: 'Kikk0M81$5wj214OEw', trackTag: 'n*03u6VmTWpOruuZP'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'p(dlr9GCR$)TCHd%e%PZ', trackTag: -4600874626187262}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'BH79YP@8]C%pTSY', trackTag: 7091463938637823}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/id', {id: '@I#(nLyIMBxywn', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/id', {id: 'y(x3RDX]dvX@OCqT', trackRawTag: '&iriJzFA@Y59jO3JVj2'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: '@eFT*pR', trackRawTag: 5420150576644098}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'chYLv9yip', trackRawTag: 1469301248753663}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/id', {id: '&g7gT#(cCr9cAjeA4r0f', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/id', {id: 'fH&dXUPuthx$tsa&', trackState: 'D(3Ro@uEl'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'MADZRJh6u&@[r', trackState: 8834105676398594}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/id', {id: '5%!IWG', trackState: 2834558047223807}, 400);
				});
			});
		});
		describe('episode/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/ids', {ids: ['rGHwfnJB', 'n7BdjLAIimSaV0GfB]a6']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('episode/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('episode/ids', {ids: [null, '']}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['#7h1FWmvW#J', '&OAF%Co#CcLU3uMj'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/ids', {ids: ['1sj^UpHL4J', 'rKCaSl[P0*Et[uU'], trackMedia: '0C!G['}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['$A(BDruX(', 'CfufA*j'], trackMedia: -2433210931740670}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['Bw*A@3', 'gn(Vn#SEi@WqaI3(U2'], trackMedia: -2438358244524033}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['nMl&*yqHdiuP]m', 'Xtr[xF('], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['V@)yechQO(T7wQHa]D', 'lK5bZI'], trackTag: 'myqvNq7&'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['RgBBzN^diepNhi2', 'PgEkBxrd'], trackTag: 4797841306288130}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['yvHC5RAn6ga@z0', 'S9A@X&nsU9dkfk!^lLIc'], trackTag: -7415088331882497}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['o5irVb0', 'otLem@nfxN0wwAH@$V('], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/ids', {ids: [')xLv0DL[^Ml', '6D)@1Dx8c*dUEVA3I^'], trackRawTag: 'x)4#l107n'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['fPD0GEi31x9g*f4', '%F[FpK'], trackRawTag: -3156355821076478}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['Dffz(Ep$*v8C', 'aHnJXEDQP'], trackRawTag: 7997628977512447}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['5a8sY][m5ZSbq!9Ma', 'mIT]a%y0w20FWJ^IL'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/ids', {ids: ['[n%HSJE1hIO', 'jg&F14r@mNiN0^'], trackState: '0qih%oAxuq&Qczz1m'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['4Y3968wo^Rz', 'YLUx0dsVMP822kvD$y6T'], trackState: -4870670685044734}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['2O5gr1U]qEk!q', 'eb%C@#NE'], trackState: 712243347980287}, 400);
				});
			});
		});
		describe('episode/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('episode/search', {offset: 'NIgNndMBwmG'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/search', {offset: 78.88}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/search', {amount: 'iQCjY*]hUSSCpWQ'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/search', {amount: 9.43}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('episode/search', {amount: 0}, 400);
				});
				it('"podcastID" set to "empty string"', async () => {
					await get('episode/search', {podcastID: ''}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('episode/search', {name: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('episode/search', {status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('episode/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('episode/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('episode/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('episode/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('episode/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('episode/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('episode/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('episode/search', {sortDescending: 'TL7nu4MGaT'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/search', {sortDescending: -3968047467462654}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/search', {sortDescending: 7569101337657343}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/search', {trackMedia: 'SK2L2lc92vIxl^'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/search', {trackMedia: 6891631257059330}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/search', {trackMedia: -2880387118268417}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/search', {trackTag: 'EE%pEw*#ot3YSHa1JVk'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackTag: 3273865530703874}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackTag: 2826850946514943}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/search', {trackRawTag: 'JPCX]'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackRawTag: -6941105564155902}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackRawTag: 294985039609855}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/search', {trackState: '39YOVYQlZxdKi'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/search', {trackState: 5425890418753538}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/search', {trackState: 145810440323071}, 400);
				});
			});
		});
		describe('episode/retrieve', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/retrieve', {id: '&cG$rkn'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/retrieve', {id: '&cG$rkn'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/retrieve', {id: ''}, 400);
				});
			});
		});
		describe('episode/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/state', {id: 'mS##zPBv5r]HjDMXOkJ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/state', {id: ''}, 400);
				});
			});
		});
		describe('episode/states', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/states', {ids: ['4mf*I', 'S^]rPn[Lj4vn4tb93']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('episode/states', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('episode/states', {ids: [null, '']}, 400);
				});
			});
		});
		describe('episode/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/status', {id: 'kJkTRVu'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/status', {id: ''}, 400);
				});
			});
		});
		describe('episode/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/list', {list: 'random'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"list" set to "empty string"', async () => {
					await get('episode/list', {list: ''}, 400);
				});
				it('"list" set to "invalid enum"', async () => {
					await get('episode/list', {list: 'invalid'}, 400);
				});
				it('"podcastID" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', podcastID: ''}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', name: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('episode/list', {list: 'avghighest', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('episode/list', {list: 'faved', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('episode/list', {list: 'faved', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('episode/list', {list: 'faved', sortDescending: 'Elgjbzl0Bf@6@'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'faved', sortDescending: 8717024091963394}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'recent', sortDescending: -2813158683049985}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/list', {list: 'highest', trackMedia: 'Mn8TC3ItQy]HtB'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'random', trackMedia: -2782975607439358}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'faved', trackMedia: 5590137299795967}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', trackTag: 'X8&ac!^Phqn'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'highest', trackTag: -8158179007397886}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'random', trackTag: 7150226485805055}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'avghighest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', trackRawTag: 'PX^N[J9PzoxPICjzkA'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'recent', trackRawTag: -8114485441069054}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'avghighest', trackRawTag: 8853698662891519}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/list', {list: 'random', trackState: 'twUvCeuf3HF]'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'highest', trackState: -3036971416944638}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'recent', trackState: 3025434199457791}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', offset: '#zWMw#!iD3[LDYW1[^dt'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/list', {list: 'faved', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/list', {list: 'faved', offset: 18.06}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/list', {list: 'highest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/list', {list: 'random', amount: '%2YK9Yw!ep5Wyd%&]'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/list', {list: 'highest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/list', {list: 'avghighest', amount: 16.52}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('episode/list', {list: 'recent', amount: 0}, 400);
				});
			});
		});
		describe('podcast/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/id', {id: 'o88*(l*$ZYk6'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/id', {id: ''}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/id', {id: 'p!@fVpX@xRYES8X', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/id', {id: '&!R7jd#68^km1Dg6X', podcastState: 'j]3y*[za[kT]0DbPv'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: '70zzAEs^)%Xkx', podcastState: -3395084011700222}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'WD4$Hu9Q4D[kK', podcastState: -4001958364971009}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/id', {id: '#VLND1Ty)', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/id', {id: 'V$gHZV&#^aI8', podcastEpisodes: 'ZwITW9%lJWd$h4a6Uw'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'ZF5ZODsKmHkJ5wXD06', podcastEpisodes: 486445273841666}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'CJ!N0aYu', podcastEpisodes: -8085015661379585}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/id', {id: 'E2m1JFVR8*o', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/id', {id: '*WTPE%%ZA38%M', trackMedia: 'x!]MqRS['}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/id', {id: '!a$6J0dj]', trackMedia: -402036667449342}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/id', {id: ')srjSVQ4U]', trackMedia: 1928940897697791}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/id', {id: 'Op%f(ojMpkYQcQ4]SZs', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/id', {id: 'Ft4YoYekdmVIVm', trackTag: '*6C)!#s)4qNuA'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'Pwowplz3^@nEU!P', trackTag: -8420343920197630}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '6At]1MN]I5', trackTag: 3222232851546111}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/id', {id: '%2LeBhZ7', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/id', {id: 'bTSo9dj', trackRawTag: 'WSmf8Bj[6q'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'eEjOw]Myz', trackRawTag: -1529192122417150}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'VQ6cnjPb&pwDAx8Ia', trackRawTag: 7208431547056127}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/id', {id: '6B4476]EbM', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/id', {id: 'R0Tu]q1nZN]fs#%N!', trackState: '$81xTw['}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'V%My8dGHl(ZPbOB1w', trackState: 403812955193346}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'dkWSpMuDCfqZ4N3LUpy', trackState: 5094449755455487}, 400);
				});
			});
		});
		describe('podcast/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/ids', {ids: ['&$4cxs8S3tjivBg', 'U6q[(K[FWls9oQ']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('podcast/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('podcast/ids', {ids: [null, '']}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['o$kc0lt[JT$iah9YpY', 'dqX!I4N93KGG4'], podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['1wYyTO*', '!]ik9CROv*mI@*1zu'], podcastState: 'oj(v7geQfH#&y74u!eVQ'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['RlMKtIOMxA', 'Q8mskN9t#2'], podcastState: 6727107027664898}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['&$)U%yX4sYgxb7Mo', 'O4R8(Yd$Rt!1MBwsez2'], podcastState: -2418919411286017}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['TDcuU8]eN', '[fa*(v^VAN'], podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/ids', {ids: ['g1q@CIAZ()f', '@VZJ6m3xMCVtO&u&iva('], podcastEpisodes: '@%FjBH9XCRp$^v4*u3W'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['1NMhJeCd)Fc]0[e', 'WuqYDIn0@vJFA'], podcastEpisodes: 7358327923146754}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['eZ^NrLVhYZiZ0', 'N*RwHHHc(N([t!Y'], podcastEpisodes: 2395123283394559}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['hMn7zrRBFpu', 'ZmgA(]b02oHG&5L[FoW'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/ids', {ids: ['^%^wrziF3nVhVf2', 'o4d861u)ugFW'], trackMedia: '@&aSiG!KSMx'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['!v]9F*o%%xDM3NKo', '$m1aA(&QKLT$Q)bMt9'], trackMedia: 5896014615543810}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['9$[B!]3]IoeS]yiIxAP', 'bbI5D]1W'], trackMedia: 3079253696446463}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['($F^sU$nqSI@@V66&C&O', 'TUDMJRiQ@&3HFK2u6o8'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['Nd7&$BDa', 'KUBW%ky^bfF77sBwk(^y'], trackTag: '(RkqCStgCl'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['@fY[!FFx1Pr94d', 'LzStVsVp!^'], trackTag: -3913619423100926}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['9nfN%ys(', 'K5jUeYNiGcInGs(o&Tu'], trackTag: 8126132884865023}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['9Iv40mVJj&]Bbc3a', 'gveNiE'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['#Z&F*d^0Q', 'SMbhyqY'], trackRawTag: '(1IsNIk*D[@jlDvfX'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['4k4GMUaRD)9', '%b2s9b'], trackRawTag: 7860958005297154}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['Qr!BS', 'lrgTL6L75$cpm2'], trackRawTag: 5270082540273663}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['0bU(xEhns!4XGb', '(#yV[ncT0uMNif(EcR91'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['9Bejt$E*GVy', 'Ow)f%g4jpGw'], trackState: '&^)$9rxi)ge'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['m9(kJJAry$O#sYIh56J', 'LSiHNL4MHq2MCd)emd'], trackState: 8169566635032578}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['f90[h2g', 'bg6He^zAHJSH'], trackState: 906604585156607}, 400);
				});
			});
		});
		describe('podcast/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/status', {id: 'ES0c6%hlP78'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/status', {id: ''}, 400);
				});
			});
		});
		describe('podcast/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('podcast/search', {offset: '@GuOd2y!#'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/search', {offset: 27.92}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/search', {amount: 'Yi5$UEq7$PWoIZYSG2D'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/search', {amount: 88.91}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/search', {amount: 0}, 400);
				});
				it('"url" set to "empty string"', async () => {
					await get('podcast/search', {url: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('podcast/search', {title: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('podcast/search', {status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('podcast/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('podcast/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('podcast/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('podcast/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('podcast/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('podcast/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('podcast/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('podcast/search', {sortDescending: 'yYM$DsCG9'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/search', {sortDescending: 4946413532217346}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/search', {sortDescending: 6448260906483711}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/search', {podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/search', {podcastState: 'elF(PPTq'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastState: 6944021469462530}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastState: 5098160586227711}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/search', {podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/search', {podcastEpisodes: '642sIkI6HV'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastEpisodes: -7872476633628670}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastEpisodes: 4494760077164543}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/search', {trackMedia: '01moSYR'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/search', {trackMedia: -3413393914462206}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/search', {trackMedia: -3222691792289793}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/search', {trackTag: 'w)DpnEqdLOso#tOA#Uu'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackTag: -8982349509296126}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackTag: 6460047173353471}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/search', {trackRawTag: 'bwrs6&msL'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackRawTag: -4761078550495230}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackRawTag: 6345934669611007}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/search', {trackState: '@VBiQhi(x'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/search', {trackState: -5206196537524222}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/search', {trackState: -5623442955042817}, 400);
				});
			});
		});
		describe('podcast/episodes', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/episodes', {id: '@t)b7M$lsU0'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/episodes', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/episodes', {id: '4R1NC&s#]H8CoM!sA]c', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/episodes', {id: '#k$dg', trackMedia: 'Jo4NNq'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'E5onxRb1^ejEjSmV*', trackMedia: -1119518696931326}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'IYIpaq4r&GIaJLW(', trackMedia: 5288999933444095}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'K(pvet]#MTx4p#Z', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/episodes', {id: '2pc9H&5w8JKmuM0', trackTag: 'Q$PNtx5flouitupAPr7'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: '^KWsY%![ro', trackTag: 2539007233753090}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'TW@GwB42*hfvO5WG[g', trackTag: -2520397815742465}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'RORoNBHHsn72SvmB2U8!', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/episodes', {id: ')f1o66E9Qg#)H%Yq', trackRawTag: 'LAde&St'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'hNF(azlmI$dFe', trackRawTag: 8979399797899266}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'Ao0p^NHRB@Ko', trackRawTag: 4089044791197695}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'Z[5br74^bwc1)*#G4', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/episodes', {id: '@gxb5NJ@3ttb706', trackState: '$p0L]Eb57GEjR*^'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'c#N5j', trackState: 3146250845159426}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'RGe(N0&o7OlLsL6', trackState: 6150711209361407}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/episodes', {id: 'PRF^i', offset: 'l7zxSH!'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/episodes', {id: '46AF9s)xLYQiE1!mV', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'iU6Vo19KoO', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/episodes', {id: 'A^Y$rWb#uN**RK', offset: 1.03}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/episodes', {id: 'XQV(wP6', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/episodes', {id: 'H^!sEO8P(', amount: '9Nh9hcQ'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'Q#&xEm0C%yz', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'Fd49M#ygR', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/episodes', {id: 'PMURA!*', amount: 28.12}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/episodes', {id: 'RSVfyLl!Y', amount: 0}, 400);
				});
			});
		});
		describe('podcast/refreshAll', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/refreshAll', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/refreshAll', {}, 401);
				});
			});
		});
		describe('podcast/refresh', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/refresh', {id: 'i9u#4m'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/refresh', {id: 'i9u#4m'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/refresh', {id: ''}, 400);
				});
			});
		});
		describe('podcast/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/state', {id: 'nZJxn'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/state', {id: ''}, 400);
				});
			});
		});
		describe('podcast/states', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/states', {ids: ['Dt$IUFP5', '@pkTjD)']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('podcast/states', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('podcast/states', {ids: [null, '']}, 400);
				});
			});
		});
		describe('podcast/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/list', {list: 'avghighest'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"list" set to "empty string"', async () => {
					await get('podcast/list', {list: ''}, 400);
				});
				it('"list" set to "invalid enum"', async () => {
					await get('podcast/list', {list: 'invalid'}, 400);
				});
				it('"url" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', url: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', title: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('podcast/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('podcast/list', {list: 'recent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('podcast/list', {list: 'frequent', sortDescending: '!Q^81lJqr'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', sortDescending: 7753946902822914}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'faved', sortDescending: 6778426430062591}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/list', {list: 'frequent', podcastState: 'Av2NOEU]vP[M32m[%X'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', podcastState: -4062526908137470}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'recent', podcastState: 3446858655465471}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/list', {list: 'highest', podcastEpisodes: 'Z*nyA1mUSQqV'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'avghighest', podcastEpisodes: 2219972512186370}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', podcastEpisodes: -7290728652734465}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/list', {list: 'frequent', trackMedia: 'Hpf@*ou!'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'faved', trackMedia: 4719709937205250}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'faved', trackMedia: -5360835006300161}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackTag: 'k%(GwN7'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'frequent', trackTag: 1789836805537794}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'recent', trackTag: -6301832854896641}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', trackRawTag: '#8&9p^xQz[gY6C2i'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'avghighest', trackRawTag: 7804760300191746}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'recent', trackRawTag: 6034858824433663}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackState: 'UnfSi0^XmV'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'random', trackState: -2993033511436286}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'random', trackState: 8104752143400959}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', offset: '*bq)i]TlMYO#'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/list', {list: 'recent', offset: 42.25}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/list', {list: 'recent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', amount: '%xv^Z9x$D80UZh'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/list', {list: 'faved', amount: 34.71}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/list', {list: 'frequent', amount: 0}, 400);
				});
			});
		});
		describe('radio/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/id', {id: 'H$Rqt]ylZhwC7KuH', radioState: false}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('radio/id', {id: '', radioState: true}, 400);
				});
				it('"radioState" set to "empty string"', async () => {
					await get('radio/id', {id: 'xun&jZ7(jbDu)V6)mAyU', radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/id', {id: 'DCi3cQBbPkAxd@k!J!1', radioState: '3mGuqA'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/id', {id: '$rQ22qn1cj', radioState: 5314252155912194}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/id', {id: 'X7p@yR1N', radioState: -8091296761643009}, 400);
				});
			});
		});
		describe('radio/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/ids', {ids: ['PIZhwN', 'iR8rsleipWc'], radioState: false}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('radio/ids', {ids: null, radioState: true}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('radio/ids', {ids: [null, ''], radioState: true}, 400);
				});
				it('"radioState" set to "empty string"', async () => {
					await get('radio/ids', {ids: ['KoK5bk8XEOGG(X', 'pIPqEpe)9O#tYvWNn3C'], radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/ids', {ids: ['ykmD16kQ7eSuCU2LnU', 'I@AyuLAxqd]R0c0^2I'], radioState: 'n4%8A3SoDYkA(z7'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/ids', {ids: ['(lV(Be*', 'g%Jk(8pnI064ftt'], radioState: -2482564358995966}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/ids', {ids: ['9ye$Cm$Q&VaC', 'kt%HHQ9oJ@y]TgJ2h'], radioState: 281330566823935}, 400);
				});
			});
		});
		describe('radio/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/search', {radioState: true}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"radioState" set to "empty string"', async () => {
					await get('radio/search', {radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/search', {radioState: 'f1[)wS^GfI!GGBm1GiK'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: 3709533142646786}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: 7360467110461439}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('radio/search', {radioState: true, offset: 'y#3W&LB87Wnz]('}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('radio/search', {radioState: false, offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('radio/search', {radioState: true, offset: 60.35}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('radio/search', {radioState: false, offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('radio/search', {radioState: true, amount: 'FlH^QAgXNpCG1'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('radio/search', {radioState: true, amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('radio/search', {radioState: false, amount: 52.63}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('radio/search', {radioState: false, amount: 0}, 400);
				});
				it('"url" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, url: ''}, 400);
				});
				it('"homepage" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, homepage: ''}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, name: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('radio/search', {radioState: false, sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('radio/search', {radioState: false, ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('radio/search', {radioState: false, sortDescending: '&Eg7K^%'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: false, sortDescending: 692082469502978}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: true, sortDescending: -8956246652616705}, 400);
				});
			});
		});
		describe('radio/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/state', {id: 'X[LF^bsZXX(F9pIzGG'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('radio/state', {id: ''}, 400);
				});
			});
		});
		describe('radio/states', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/states', {ids: ['u&bX85wvvtmbdKSCkpl', 'G^^^Y4o']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('radio/states', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('radio/states', {ids: [null, '']}, 400);
				});
			});
		});
		describe('artist/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/id', {id: 'QP!LmTKfQ5gvsa*zF[%'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/id', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/id', {id: 'M5pn$o)60j#en^5', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/id', {id: 'b[G*u$', artistAlbums: 'oX*72uCGLO0gHq9^#'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'fj^PB', artistAlbums: 4818410315710466}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/id', {id: '&rbNiMO4', artistAlbums: 1389878134702079}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'DfSNN^9y@4UI9IV', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/id', {id: 'qxReP!&8iB!', artistAlbumIDs: '*Tm^v'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: '2]Gsz1[nXs', artistAlbumIDs: 5493671449329666}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'yH@mdYeECvlC15YPY', artistAlbumIDs: -6619347388727297}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/id', {id: 'osor[v(rk', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/id', {id: 'z7KsYpdSPsR2@', artistState: '46xfYief9YnfxuuVD7DR'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'X1JEt1', artistState: -8092247128014846}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'PS&XUC', artistState: 8597017974538239}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'vICy8', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/id', {id: 'T^S&DSf', artistTracks: 'cgOronD'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: '[$14(c67#', artistTracks: 2949579272093698}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: '5S9ZL(A0J^Z1j37nf', artistTracks: 1206231595220991}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'chKHcvwJ', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'QE$#f', artistTrackIDs: 'tFyKO[DhwiMuR$B&h5'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: '!5y5a^6GYTc$029', artistTrackIDs: -7383967699304446}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'YBBJULzBgcl4SRiE3a]J', artistTrackIDs: -4200726150512641}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/id', {id: 'IDcLp)$a!Ol!g6o5^E', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/id', {id: 'il&p4(QR', artistSeries: 'DG*ISEFF'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/id', {id: '[ex0HGep#5y@c$514%#', artistSeries: -3438866237227006}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'soG@iUSZhpWs7', artistSeries: 1943770987757567}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'wvcusGnh5%r#t)@9', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/id', {id: '#zE7OYOo%bKkg(9', artistSeriesIDs: '&nDR%'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'j0BDvo@^[kCC', artistSeriesIDs: 3132215558930434}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'oK@B]!Lt', artistSeriesIDs: -1590822986317825}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/id', {id: 'Q3PiK61%6T2Y$a', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/id', {id: 'KxhERS6mN', artistInfo: 'CrL6WZ'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'mT]R6PxeVO*JKPkj6U', artistInfo: -6914145257521150}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'hOTHG3@i5UW*M', artistInfo: 191341468319743}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/id', {id: '%H71B]&x]AD1ck6YLOmg', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/id', {id: 'Nr8@x4EH**7AybJibh', artistSimilar: 's0$oOI$UF^k'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/id', {id: '8O%%[l5f[JJ]XnIpb]o', artistSimilar: 1743599771320322}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/id', {id: ']vQ^H1', artistSimilar: 5355217767890943}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'VYwKH!WVkq^n9eA', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/id', {id: 'RCLd*oEzRJTcVu7#qv', albumTracks: 'cJpvPjJeCas'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'inz9t', albumTracks: -3921171259064318}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'sO(*2qLuy6l4mr$60EL6', albumTracks: 1163302826672127}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: '#!MC$8M)Hb%*vO', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'uvJdMDeKWtZ', albumTrackIDs: '6H(3^eoKc7LXW2(k'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'hKjxraEWJC', albumTrackIDs: -5147380122910718}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'u)dyJqy0PgG0coLH&DFP', albumTrackIDs: 4602447733456895}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/id', {id: 'I%5D]TMDkuq9TsCVpS', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/id', {id: 'jiNP@Et', albumState: ']KvbI@im[W'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'V0U2rhM', albumState: -8795832400740350}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/id', {id: '&kBJjoI1zCNXzs6p', albumState: 1328657566007295}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('artist/id', {id: '%DjFUwQgyjkk', albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('artist/id', {id: 'kSVTHwHBAjyDc', albumTag: '%m0KYLNHIW5'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'voEmP6jSXQgQ85br9xcb', albumTag: -3419305064529918}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: '@ZC^f', albumTag: 1537589408432127}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/id', {id: ']WHkr52^8@cBw', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/id', {id: 'abYkwdRkXn48^0!5hOT6', albumInfo: '5ag!m9)0n'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'UWbPxuvwQI9Nl', albumInfo: 7803775850905602}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'i$f0tkVG(G2uRoxY', albumInfo: 5079927820910591}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/id', {id: 'h@*6Adts^q', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/id', {id: 'VVdq1!E&', trackMedia: 'VuFh]n'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'Ll&Xb', trackMedia: -710851975708670}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/id', {id: '@DfPCfGuiLgI#', trackMedia: -6659552623722497}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/id', {id: 'dIHSu9tDd', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/id', {id: 'aN4UTy', trackTag: 'Kdt$il@XACx2[)rpiH'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: '0Jk(sPX]&k4', trackTag: -4761906061508606}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'Nx0r!gS]MR', trackTag: 1527924721188863}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/id', {id: 'EdoLqo', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/id', {id: 'z2Xjlns^u&2rL1Z', trackRawTag: 'b5e&uamEoH'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'mQmZ!]SIvi4PdfWDtwN2', trackRawTag: 5824624243769346}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'o9@[M$C8v]da6yQCBE', trackRawTag: 5506586231439359}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/id', {id: 'o8bmS8', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/id', {id: '$tWYVbCd6SxpizfSs', trackState: 'q5R6ch36%GSM&&4fnR]'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'dD]o^s8l&cd&AHnr6k', trackState: 1361049525682178}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'x&eAO)B3Kv8%', trackState: -8180741192024065}, 400);
				});
			});
		});
		describe('artist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/ids', {ids: ['LWz1pTr', 'uytvD[IB7&c*&vU$']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('artist/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/ids', {ids: [null, '']}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['K*#QIyzhCK!', 'wnXqzj'], artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/ids', {ids: ['BQr9ePlx', 'K3pqqXkUcJh9iV'], artistAlbums: '24pE)3Rh4v$EVLsPF'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['4e3Y(os^TPVQ', '61o5z4$'], artistAlbums: -7906751328288766}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['ew#BzYi', 'O1c&z&0H^h2rjAS'], artistAlbums: 6487042154299391}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['e7f10]k]9d7TS', '$i!C@HmiwQRaqMFRO&S]'], artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['fL&Q7T', 'o(zxsI^[KSaA]'], artistAlbumIDs: 'QJv]nsf2'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['Ztk)Zr9yOv0x', '8*[2s^h'], artistAlbumIDs: 1986004739162114}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['$Ol]8x5S!dM', 'JxupX'], artistAlbumIDs: -4483579291631617}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['Ani7(7XmroNqFXV', 'k2%X3H!u^]b^7HU61!6c'], artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/ids', {ids: ['sXHgV$pimW90Rf!]*N', 'CNfNAXfb^@Q^'], artistState: '^xOZdmp9Fn6iNy0w'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['Y@#UcHr#rDp', 'fPH[GGV(rKtgL'], artistState: 1670861991968770}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['YHe8a^jJW]*dp]I22SW[', 'GOjET'], artistState: 4128316315402239}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['gSIZ4j@k4sULO#PM', 'tO23B]C0eolk@RXX@Gy'], artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['R%kr5Rhq59Af]h!!Yxd', 'zQzkIXu(lRmC'], artistTracks: 'hYqPtqkg'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['mII2hW@*', 'X)3eS%DFSZRA'], artistTracks: -7808165399756798}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['7enyMst0', 'sE]RR%)Rm(](R^OkjA2&'], artistTracks: 452224308215807}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['AiawIesFW8b', 'YMyLqB'], artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['RRuacU!3jftX', '3)$SGD78X9vcDeuR)'], artistTrackIDs: 'sdQi9*f8TnO$tBgw'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['EQ#Cp!keNE', 'cR]K[OEN@s9'], artistTrackIDs: -3021984367640574}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['oyJHwH(WC', 'XWXaFT[2'], artistTrackIDs: 1377640028045311}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['7mu3Fy1y$G]faw#M', 'm[3p&ldlh'], artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/ids', {ids: ['HBE[nWj[(c', 'LI8[$F)WHK'], artistSeries: 'v^Da2pCwoXUybQYBO&Lt'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['3nxT0F8%CFa7m', '[cIDG0H!T'], artistSeries: 7236991951306754}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['U3Osl[0sqG6GVvoLR', '7s5@ygo'], artistSeries: 3349094546276351}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['18l@kmNpw', '1TUY9EG]C*CrH'], artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['8a#yhV9', '87Zgxnz8)R&#gLAJ0'], artistSeriesIDs: 'kEg@mjAV'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['[p!)A5TFp!C)vi', 'ujn02wwsP'], artistSeriesIDs: -2435893189148670}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: [')K7*k[', '9AQhliGUL'], artistSeriesIDs: -4187259368636417}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['j&LUSq', 'UbLHz3teWkpvpM@Q'], artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/ids', {ids: [']0!d5DCw!]ad(LJ[!E', '45!2nYRYI[)%8^J)N&09'], artistInfo: 'N4UMts'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['p209D0L', ')@JrxrS!NT'], artistInfo: 2231503618572290}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['hBjgg58nT!jxCX', 'kccmM(sEhU(L%%R&wH'], artistInfo: -6864311725064193}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['mfwTZOvTK[m@**K', 'o4PSBOly&dfrkBWta6'], artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/ids', {ids: ['u4Y]^pKps(', 'yBcO^tOqebcv)P'], artistSimilar: '1PdSN8cF(D$cWkj&'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['bW*Uhp5Zy', 'OeYNgWiNtCY9QN'], artistSimilar: -8738803019677694}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['EYUuRva4)ffPnv', '[hGj#vQPn*'], artistSimilar: 4443992716476415}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['NQMEeJ0', '[GL]QaS8o$Avyw!PQ2'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['ZlskPwdB5Jm(Hh', 'kyA3EO0G*Bur'], albumTracks: 'mLlT&dl1y'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['Qu&fKOQ!7U!K', 'bsqL#s)L9aY)[Y'], albumTracks: 4877173164867586}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['pqnC8086@ZqJMvww)P', '7Jo5NsGzWcvc!'], albumTracks: -7666540723830785}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['[PSr8I', '3g[f3Lu@[$QF'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['%TfED(O!Q', 'yL&cb9[096*MEF15D'], albumTrackIDs: 'N0!^3'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['xI@k7N', 'GOVgX530xrIcp'], albumTrackIDs: 6605204627652610}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['ReA7K782jQJV(6PRn', '(]xU2&r5Y'], albumTrackIDs: 8560651240734719}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['9D2Y$)6@&IL[Fjq2eH5^', 'ppn%cp1@rBr'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/ids', {ids: ['(kUq][eG!#', ']ew(OiUd5Jg7gXOaKn'], albumState: 'PiPHX%1GIcrvb0LHz'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['V9$qFtGx#Bz', 'FAk%!vy4PPrssCa4t'], albumState: -7577479300513790}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['Ga1tL8Ao', 'JyAe&9XYG7Q3F)9xS2'], albumState: -6728969026011137}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['UJb2fWT', 'uojMTJ!!'], albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['K&AXD4Rj0]', 'XvjOStO^v^'], albumTag: 'ayMh4soMtsZaG('}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['OUOW4lYW(vSTITVn0', 'lXr@i$o$o'], albumTag: -6781869995589630}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['Olj0XeU', 'P3vqV'], albumTag: -8016572677357569}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['6GeX3Ar', 'bhopB2$ZGdEW'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['wLrk$cicK8T)g!8ZjuX', 'GF^oRMIE^vE(3@bN2UFX'], albumInfo: 'lra#7naL'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['Izy^Ig3ItJlh', '^txO@ZB&qA@T5*zQ'], albumInfo: -3369392859512830}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['t3*ibJ0jOHs02oQ', 'ol!tkoDnd2wRpzT[&He'], albumInfo: 6084526153400319}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['vai&xY]AyvP#MO^', 'R3Q#qC'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/ids', {ids: ['0gB0sFJy3P)bU6PB#Z6N', '!7asZlHnovXzxrEZf&'], trackMedia: 'CJzGib@hGb5'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: [']nxiBtS', 'GtuYOpd'], trackMedia: 7109482094002178}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['kZFxl^^45m3wbxVK!0', 'RKjO5]2dYrgY'], trackMedia: -2890146512896001}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['YW8D6r#xV', 'Hg^3p)MA](A(ds9HZ8)'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['my5HA', 'vR@uCR'], trackTag: 'ylS0EH0P(SIZMRt7'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['pNreCF^l', '9ZqMJ6JqgaYWgLD^0g'], trackTag: 2029370092814338}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['dthxeDn]Ho&DJS125]', '7HP*aMbj8JH@uDNr'], trackTag: 8472426367156223}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['Pt^#VcAyDY1$ng', '0])Q@9NXq'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['enj(jYro', 'K9WKXm'], trackRawTag: 'k%K$FSH'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['*EW6v1LZKQXf!3M%Q', '7o)Sd0ZU9K'], trackRawTag: 3420656825794562}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['IteNDCAJLkmNM!i7', 'RY*mc'], trackRawTag: -1396477347758081}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['(]CJWGh8ijmd', 'j&G]lLxD'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/ids', {ids: ['5*JScmwbrx@MY*GBw]', 'AaN3[]Ciqv'], trackState: 'iSns!gXn]i6!'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['xW#5FxAsQ5M', 'YiPbD'], trackState: 8169042107957250}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['p9OGbkQd', 'BTZxAqPQA$m)'], trackState: 2759862161244159}, 400);
				});
			});
		});
		describe('artist/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('artist/search', {offset: '#mE)i4!^^'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/search', {offset: 71.87}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/search', {amount: 'scOHrV9'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/search', {amount: 14.19}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/search', {amount: 0}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('artist/search', {name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('artist/search', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('artist/search', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('artist/search', {rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('artist/search', {albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('artist/search', {albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('artist/search', {albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('artist/search', {albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('artist/search', {albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('artist/search', {albumTypes: [null, 'invalid']}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/search', {mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/search', {newerThan: 'MQt5%kaF'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/search', {newerThan: 57.82}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('artist/search', {newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('artist/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('artist/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('artist/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('artist/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('artist/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('artist/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('artist/search', {sortDescending: 'lv@*)lE!$'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/search', {sortDescending: -7857584228794366}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/search', {sortDescending: -6659358377115649}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/search', {artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/search', {artistAlbums: 'Ct7&uYTkniXb8$p$W'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbums: -5407788469583870}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbums: 4622107258388479}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/search', {artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/search', {artistAlbumIDs: 'bIcJlz2g2'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbumIDs: 907010446983170}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbumIDs: 6106612955611135}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/search', {artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/search', {artistState: 'i]))FG$UqVl%y4nB0v7a'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/search', {artistState: -8416949746794494}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/search', {artistState: -2299306778296321}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/search', {artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/search', {artistTracks: 'yMF7*Vyd$GaCjyoNMD'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/search', {artistTracks: 2367770184384514}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/search', {artistTracks: 785337718669311}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/search', {artistTrackIDs: ')!yYsJQ$b0H(CSKv('}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistTrackIDs: 7593586719719426}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistTrackIDs: 8983254149365759}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/search', {artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/search', {artistSeries: '^j#a)'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeries: -4434061716094974}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeries: -7428795002781697}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/search', {artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/search', {artistSeriesIDs: 'Boh*GBU79(dxE9B@'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeriesIDs: -5921725971693566}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeriesIDs: 3911188857487359}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/search', {artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/search', {artistInfo: '2VvQIeccaPIw6MINaS'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/search', {artistInfo: 1538324669923330}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/search', {artistInfo: 3448292067246079}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/search', {artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/search', {artistSimilar: 'arUqn'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/search', {artistSimilar: 2091583218384898}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/search', {artistSimilar: -2167780082188289}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/search', {albumTracks: 'VM*S*Ttf90C@*YZ'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/search', {albumTracks: 1543524273094658}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/search', {albumTracks: 4289881337495551}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/search', {albumTrackIDs: 'K@$eQh*NF9d'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {albumTrackIDs: 3856881235787778}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {albumTrackIDs: 2374641754570751}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/search', {albumState: 'UZ49eReKHv[WIS3cI'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/search', {albumState: 6499369473802242}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/search', {albumState: 8986485399224319}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('artist/search', {albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('artist/search', {albumTag: 'R&t!iSO1d!pR*%)#8PU'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('artist/search', {albumTag: -1048830208376830}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('artist/search', {albumTag: -5325527313285121}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/search', {albumInfo: 'zgwCfr'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/search', {albumInfo: -2298972894920702}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/search', {albumInfo: 7259724789579775}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/search', {trackMedia: ']d33AtW#Q9U'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/search', {trackMedia: 980461501284354}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/search', {trackMedia: 7822819886891007}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/search', {trackTag: '$bYLN8ShBig'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackTag: 1994300099395586}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackTag: 864875370774527}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/search', {trackRawTag: '@(n5c'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackRawTag: 1506389620948994}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackRawTag: 5501661015441407}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/search', {trackState: 'vqBT)&RlgYn'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/search', {trackState: -6483856337141758}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/search', {trackState: -2617653487206401}, 400);
				});
			});
		});
		describe('artist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/state', {id: '0Nm*KJBQjdQFm2'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/state', {id: ''}, 400);
				});
			});
		});
		describe('artist/states', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/states', {ids: ['W&j9hR(Kcq%(!nizWBy', 'l8%Udq6hWLWOb[']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('artist/states', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/states', {ids: [null, '']}, 400);
				});
			});
		});
		describe('artist/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/list', {list: 'faved'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"list" set to "empty string"', async () => {
					await get('artist/list', {list: ''}, 400);
				});
				it('"list" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'invalid'}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('artist/list', {list: 'highest', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'faved', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('artist/list', {list: 'faved', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'avghighest', albumTypes: [null, 'invalid']}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/list', {list: 'highest', newerThan: '%j^QNG6lsF6O'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/list', {list: 'highest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/list', {list: 'random', newerThan: 31.08}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'highest', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'faved', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('artist/list', {list: 'frequent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', sortDescending: 'vuXLQfkIWCy9Ju^[g'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', sortDescending: 4030055634173954}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', sortDescending: -5697929281011713}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', artistAlbums: 'YqePemF$$3QkiVWEg'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistAlbums: -8977526885974014}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistAlbums: 7507264415989759}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/list', {list: 'faved', artistAlbumIDs: ')H5VyD#2B'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', artistAlbumIDs: 2032431418834946}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', artistAlbumIDs: -7212316621799425}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/list', {list: 'faved', artistState: '&IYu&wA70qZELTPzVlB'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistState: -5207102469439486}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistState: 6642821515706367}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/list', {list: 'highest', artistTracks: 'Vn$dZ'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistTracks: -5510607176466430}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistTracks: -8684278791536641}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', artistTrackIDs: 'l95[Z'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', artistTrackIDs: 602587199963138}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistTrackIDs: 3845316268785663}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/list', {list: 'highest', artistSeries: 'd2[SDfa%kJ)rL^A(Nh'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', artistSeries: 3069013420670978}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', artistSeries: 5033078749659135}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistSeriesIDs: '%0E4OzVj!yXc)x#Fnd'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', artistSeriesIDs: -6690862637514750}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistSeriesIDs: -157557322678273}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/list', {list: 'highest', artistInfo: ']oD#*Np5R6xFOwgT('}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', artistInfo: -7252585102704638}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistInfo: -5198864378232833}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', artistSimilar: 'NlgEWVz2GGfK5AloN'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', artistSimilar: -1260745165635582}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', artistSimilar: 7926900613709823}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', albumTracks: '[c*an@SXiVx5MwxQh'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', albumTracks: 2509580684754946}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', albumTracks: -5302595216211969}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', albumTrackIDs: 'qOre)dt[Q@ywA5xi2vw'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', albumTrackIDs: 187741434281986}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', albumTrackIDs: 5211923633143807}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', albumState: 'z3!bUeKuabK!'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', albumState: -7246125593526270}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', albumState: -7154518491922433}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('artist/list', {list: 'recent', albumTag: 'L1[HDiEb*'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', albumTag: 7760741922766850}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', albumTag: -2562968755634177}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/list', {list: 'recent', albumInfo: 'ghK@1L9G*$LX7u'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', albumInfo: -2500360040087550}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', albumInfo: -2951911594524673}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', trackMedia: '802uTG8M$j0IxVQa'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', trackMedia: 3455370781523970}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', trackMedia: -6749614942191617}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/list', {list: 'faved', trackTag: 'VSio3ril^3d(b'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', trackTag: -8704841731801086}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', trackTag: 8273010867830783}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/list', {list: 'faved', trackRawTag: 'TvH9sQ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', trackRawTag: -2839806920884222}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', trackRawTag: 3753348486397951}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', trackState: 'bnx*V&3AEim'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', trackState: 6022261660188674}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', trackState: -7381461934014465}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/list', {list: 'recent', offset: 'jrI[8*@Uq'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/list', {list: 'faved', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/list', {list: 'recent', offset: 7.59}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'random', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/list', {list: 'random', amount: 'C^Wjwxs*RANbTYP'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/list', {list: 'highest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/list', {list: 'frequent', amount: 58.82}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/list', {list: 'faved', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar/tracks', {id: 'w^(PoyYyf'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'ufr2DkYTiIjwr3]x2Xuu', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'xWEfs(e27j', trackMedia: 'D%bnnmTf'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'KzKg(G%', trackMedia: 6445315456499714}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'duC&W8YB[Y(lCz8LDE', trackMedia: 4807955002163199}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: '(FlmQ7YhIV', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'jy@qV6wF(I7s', trackTag: '2oSa5W1a6V4EY7'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'cHkA4C0Qm!Ci]7L&Fv03', trackTag: -318858376249342}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'oKWDJiE]%0TX*j0D', trackTag: 3085674630610943}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'PCWsWGpClWhVCBBdE9qq', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'o8JHLB#*OPreBE6', trackRawTag: '&kUXJVcemNNz8a1'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'A*dkT&RAs%^S', trackRawTag: -7138890695573502}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'NN4DsJ*[$5TV6iant[QE', trackRawTag: 91639427104767}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'Pdgh!tEz%9%4]g1^', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'a^sF7l*[h5Uam', trackState: 'u8!8ee]U'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'M]ImYuPwSnfLQVKzao8E', trackState: -6670567339982846}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'lxymEdlDN', trackState: 2387428266475519}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'sU@K7', offset: 'P2akpjlk(q'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: '*]taMivj', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: 'i%#v*J(wrn%NTawr', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'xJK@WqU*qJGcQ3TYSz8', offset: 45.72}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar/tracks', {id: '*^ueVqs&*1e', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar/tracks', {id: '5FvkD)x^CQT70t', amount: 'RIUNlTqu5HVpVvt6f#!4'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'RA6#tJRUmah]W', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: 'ZHcdO!qf]!yi[7]1#2V', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'Ija^luAp1', amount: 50.69}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar/tracks', {id: 'T#uHP&F[)%yyhWx[U', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar', {id: 'Ow&^s!SJf'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/similar', {id: '&MvkbkR]', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/similar', {id: '%yOCo', artistAlbums: 'C[a*)Yaua(iQ'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'JOb[F#GWQB@[YWl8Ca8', artistAlbums: -4019548122513406}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '!eT*VW[&O^V0a', artistAlbums: 1284346245808127}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '467YAKR[BIe', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'In6Op[VeFo', artistAlbumIDs: '@g9mo@*DAkEN4Y#'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '6#dUitG)XlZFh4', artistAlbumIDs: 7477221514018818}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'Fg0(on!cUgJYHju8Fr7S', artistAlbumIDs: -8986961129766913}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Kb(ZwMaR10', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/similar', {id: '@Wr8JHKk', artistState: '8jb8dhL0dQMt]uf4XrpV'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'B4kix8NT$x^exQe$1wn', artistState: 1223701064318978}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'a4hNt9[', artistState: 6824440998395903}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Tm&Yj*eP*', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/similar', {id: 'A%(!*%i)ABJo', artistTracks: 'k#1pBUYMYaf5'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'EPkA&l', artistTracks: -7322504028749822}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'ur5)iz8MJs', artistTracks: -4066229102837761}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '[FN*a9Sx$%Ty]uGv]', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'EBfHi!', artistTrackIDs: '6UCL^Ogw'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'VSYb)&bV', artistTrackIDs: -8036178032852990}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '9)Sc*jqrHmX@mWZ2', artistTrackIDs: -2038287359279105}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/similar', {id: '3CV9S', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/similar', {id: 'nz*%%Kr9osXc4g^Pvj', artistSeries: 'TNXMy0Zm*fi'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'tQo78#0C87Ih', artistSeries: 2147786447388674}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '7KC0HlR0$tMlQ', artistSeries: -6120659054755841}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '1B8k4YHhb#PSU%', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/similar', {id: '#Mb&qkz]AN)', artistSeriesIDs: 'CHM4O'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'cM9l]M2K2G', artistSeriesIDs: -1699781122457598}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'MD(db1qsZvBe', artistSeriesIDs: -7920100669652993}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: '6k7S^n6Z', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/similar', {id: 'SqLax7ue]u0AZ^g', artistInfo: 'Q1m33PIdFyg3y#7#3IKH'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'a&k]fzr', artistInfo: 4669154380480514}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '(ZJK)iaw$ozraNm5zUld', artistInfo: 4112134803816447}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/similar', {id: 'zm(rtsC', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/similar', {id: 'x(BwT2]jErfmGt', artistSimilar: 'JR@hL'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '7b[]I9BTM', artistSimilar: -1771335944503294}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'JX54a3w%Oudh', artistSimilar: -6194537424748545}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: '$Fq^u0F!BYs@', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/similar', {id: 'lhxdG@e#Vy)H', albumTracks: 'Hu)fEBXac3zGI##sf'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '3I)Uj$Be1@9cT', albumTracks: 7128496325263362}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'au^ikw&]nQML[KTzf', albumTracks: -1077307842232321}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: 'GNb2P$f6IQn(jOmZs', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: '$#1fy8vGLWG[kk8K$G', albumTrackIDs: 'C5a0^5'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'p6kDaHAb[q4OsgBsR', albumTrackIDs: 1236694607069186}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '59u7iPk6eQ7Fw4!FOrw]', albumTrackIDs: 2806965419900927}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/similar', {id: '%DYxm8tc(gu$F', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/similar', {id: 'se7S4hq', albumState: 'QcO2xHL#toW'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '*@dCaxmZrg%7m', albumState: -1936434910986238}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'Hr8UIUH%@cvHm@)d9&6', albumState: 7822218415308799}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('artist/similar', {id: '&QN6iT', albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('artist/similar', {id: 'AkXACxWSv&hOXyq*ec', albumTag: 'exHgH*Xnq['}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'd93J25JiOiYz1', albumTag: 4886434351677442}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'CmQALrgpocdhVc!xAR]J', albumTag: 1169842732269567}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: 'vzqTwcyvNG5Sq', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/similar', {id: 'LiB0rbBwI', albumInfo: 'N#N@Um7P@3QXe#@'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '*Iuo)rjvdHg5b&', albumInfo: -6825032097464318}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '%cD9hVQ9@EQ', albumInfo: 6189182057709567}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar', {id: '78VzPaM%$w', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar', {id: 'R7CGa5S', trackMedia: '(RV%%7I)l'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Fu9]fep', trackMedia: 4699829758328834}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'urAQ#JwQEDF', trackMedia: 6679094477455359}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar', {id: 'KZJwkR#mus3AxWioi', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar', {id: 'w%]njr3', trackTag: '#^@n6fQ1Cx'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'T%1ds', trackTag: 4538129256022018}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '!dFF[a', trackTag: 7390292013481983}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar', {id: 'HvsfU]bL@$JA#&', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar', {id: '@HIZsZYj%l', trackRawTag: 'y[oanEMjla**8@YY#'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '5q0v8', trackRawTag: 1976767870926850}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'QV@L]eD1Wh54c', trackRawTag: 94043514077183}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'v2$C$i8Q', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar', {id: 'GV^a7tN', trackState: 'qJl#s[[@7s^E43kT'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'QD%qr]m', trackState: -1712335995535358}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'cO%k&AQyG9(', trackState: 5971607281467391}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar', {id: 'wXvVwP', offset: '8!qKQX'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar', {id: 'r^([*D%aj!KI9Eq', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar', {id: '@VE5#x4XFy@Xa#gJ', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar', {id: 'yQXteM3uqFJreuJN&Fs', offset: 35.59}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar', {id: 'm3&j^9r%T)96GPHS', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar', {id: 'NDaXP*fmzhub1DP^p#l&', amount: ')Mw2V[g3)'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar', {id: 'V)&$jB^IlwU', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar', {id: '^m#vc(x', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar', {id: 'zy1vzT*5E', amount: 34.52}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar', {id: 'gkDR4PfhEKlzO', amount: 0}, 400);
				});
			});
		});
		describe('artist/index', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/index', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"name" set to "empty string"', async () => {
					await get('artist/index', {name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('artist/index', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('artist/index', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('artist/index', {rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('artist/index', {albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('artist/index', {albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('artist/index', {albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('artist/index', {albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('artist/index', {albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('artist/index', {albumTypes: [null, 'invalid']}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/index', {mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/index', {newerThan: '$AWhll5mTiS6'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/index', {newerThan: 29.68}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('artist/index', {newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('artist/index', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('artist/index', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('artist/index', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('artist/index', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/index', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('artist/index', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('artist/index', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('artist/index', {sortDescending: 'GfZl5j9o(N2]zLzXh'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/index', {sortDescending: -1451368325840894}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/index', {sortDescending: -4305138609029121}, 400);
				});
			});
		});
		describe('artist/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/tracks', {ids: ['aqb1YqC^eZ', '2o0Lmvoi)*VZRxX']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('artist/tracks', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/tracks', {ids: [null, '']}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['8B2KLq[o', '(kio0DCuDx'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/tracks', {ids: ['jCm*rZb5NJL', '[nW&p'], trackMedia: '*NGxHYKpHLd'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['ZJEqGDfMw1Vpy0', '^ypqf#813j53DDy78U7#'], trackMedia: -5829616358916094}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['zfg*fGEu$TWC7A(', '^npi]QXMMPE!V5Zga0!C'], trackMedia: 376369670258687}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['8@jm[RZoLaw4mf#HY', 'Ppdf6EYb8U@2Gd('], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['#II1@fJc6zpGo#', 'NYriDyrRtnYGkp%wu'], trackTag: '5JY8I'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['MfwdRXF', 'Qj3DV$'], trackTag: 6166785376124930}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['VxcB%', 'VD@1QmXn*pSme'], trackTag: 7719393702182911}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['W5CPawd##b!WR)E', 'eJGk$K^YG@2'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['lRs]LTOPSTsLQO0tq', 'SH8wb'], trackRawTag: '4XKR6Y5KlH2$2'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['G%kwzBd0Mli]Tw', 'gNmJ4$uqiv'], trackRawTag: -8774345824403454}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['8VJ6f]4QKugP[[hwP0', 'BRRO^qi0!'], trackRawTag: -1301408208912385}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['[uIhiK[3p78D0Eqn$', '4PYX8s'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/tracks', {ids: ['zqrduuugu4QX!B!K2', 'DP#h$A2CRP85mZQTu9r'], trackState: 'c&7eD'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['iMy(Rnun8Rrgs', 'veV@e%JBhmJ]TMOx)l'], trackState: 8655154718965762}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['59cwAJuA8vH3V', 'kNMC$q2Dc'], trackState: -6213978485161985}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/tracks', {ids: ['xx^9DXLGcNssujgh', 'Dk5sfSs@rgaIOc]pGDpw'], offset: 'yz8AkzNTV%)Crzg5Aw'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['4e9wLexpu[ZVfZM', 'D2[#RP%'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['gQXZQu[hHZZxo*', 'BYjN!6M3W*G'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/tracks', {ids: ['!0UH$a%*Bpw6w]qBE$Z', 'LWATUZ5ENwXP'], offset: 96.64}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/tracks', {ids: ['H2MefpX$gLTSbu^', 'L*0dWv$1u6*'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/tracks', {ids: ['&a!SbwJ$2)!lKp9B1', 'zmhhR^I1$G*#Ris$'], amount: '4eHkRrrcM4UI^zuHh['}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['g*5TR1[]%Apd)zVRq$', 'zbJ58^5p5nu0ZJL1tCy!'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['U@2yzEj', '*L4QamIDnwlhm*[['], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/tracks', {ids: ['tVmHeVsU2D[Cn', 'R0q#u'], amount: 65.87}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/tracks', {ids: ['w3ZiDHrxh', 'IAgqFa$'], amount: 0}, 400);
				});
			});
		});
		describe('artist/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/albums', {ids: ['@M51@[flD@RSgKs', 'hfhZWQupBwl2']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('artist/albums', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/albums', {ids: [null, '']}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['Jt&w[2KxjVNDS6fL)', 'A6@ic(s61ImKbi0be'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/albums', {ids: ['gkf&$#du$#b%]WTtfu', 'g4N^lhlgg'], albumTracks: 'Hr3!Z%U[iw)FM9TL['}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['TfndlktwEQ2mT9qO', 'skCrib^)O&b$GlY^x%'], albumTracks: -3033945516015614}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['fZnhrt%j', 'dADDZN8t(W'], albumTracks: 2553720533417983}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['#D%7WB', '^PVfPshV3#@PRA3'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/albums', {ids: ['$a3t(e6QiN39sW[eD%IT', 'xr5^0LR)'], albumTrackIDs: 'D4Cpp'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['vq2pfus&yFU', '0S4Ix1wN^Y'], albumTrackIDs: 7550474169352194}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['&x(vitqvg$vKR3', '&F28(AePE2)BvFpE'], albumTrackIDs: 1080549938561023}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['ZadwG', 'JKGHHJwS6%BJs'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/albums', {ids: ['WtrTR*UScXgyLx8H', '[xvAOAODML[iBRcgO5'], albumState: 'mnc%nWafzr%l^ijtD0ox'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['2wJUdA8G', '3nKkn5h'], albumState: -470964181663742}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['DgW7OtCnNt04]', '[A(5Bzu9kg'], albumState: 4246325625356287}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['gQdJCj!93xJ#LMxrTH#', 'pHywNrrWST$VJvf(ik%1'], albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['HMa3Lb', 'QaJW[CxNrz'], albumTag: 'tS3@80Rd'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['XonjsrSsn23lntbF', '&VrO^'], albumTag: 374637112328194}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['bWZ]DP4', '7Po$('], albumTag: -895575662788609}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['e&4)^dSX', ']nxw91n@Xb[S9'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/albums', {ids: ['&pw&L', 'cwpP1)7'], albumInfo: '26TfrXnpJS'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['DaKsIa0z72VW0II$$Ss', 'OvN783oT!c77!Q6'], albumInfo: -9003075138224126}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['KOv2u81^E4', 'StQ(IXbGJQ&9'], albumInfo: -8251572408549377}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['91eQm', 'aM%oT9I8w[gAJiyR)BY9'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/albums', {ids: ['lJ[6Xedfah7E', 'KsVydG3vg0zEj2^S'], trackMedia: 'cZDLvTVK'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['EnVkW', 'pMg0@g1h%kvpC&Oa'], trackMedia: -4140546993946622}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['fcTjcnVP6yQw1', '25epFh6]B[(&nDox*S!!'], trackMedia: -4379950731755521}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['qciB^S59', 'w[&$bJdP)y#TctP5w'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['ML#5@', 'nVtR]'], trackTag: 'dm)TC8sFS9U'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['yqa54&CG2dSd9', 'LxwJCQ(Ym'], trackTag: -2162796850577406}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['5R*tKUCsdonM#8^', 'CCn[!hbNucyX9^os'], trackTag: -1325396473675777}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['33R95kC', 'MrRmzAoiebyOEt6HNE2'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['uTN#xR%SfDlRI(', '8!bzJX3'], trackRawTag: '!U7s@H1FWtrAGcFw9'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['#$Gh$GVxH4', 'H2%r!Fmry#Z$gkLPB!2l'], trackRawTag: 4887621163548674}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['@&OE6KnRl4s@Bh7Aco[y', 's2I5OQ*EZtt'], trackRawTag: -5412291512107009}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['ktyMRp$0*x', '#x!WtnbFmxpqAtpxh'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/albums', {ids: ['R2NUsTZJd8aR@pq', 'R8cIRzJU3wUxpQi'], trackState: ']B@aHY2Q[g(Xk'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['9WR&!&R^', 'b@RmJaz0I2r'], trackState: 2416489831333890}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['&#%&MVq^', '2R4@P8Je)J9spS'], trackState: 7677144809340927}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/albums', {ids: ['t(!SmGG#I#JRsO)N^4XH', '7XtA9r)t4$1$'], offset: 'LSSolf^I'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['quiOm9%Q%E6K', 'oo)wvv9aW]mwU5CWi'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['k@ASB^nQ0kWU', ']9[gMJxdrZK0%so^'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/albums', {ids: [')%]]^6D', '6S%Z09'], offset: 3.08}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/albums', {ids: ['CE@psSA9E', 'etUN(E&enXRG6Ye#'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/albums', {ids: ['nh^Sr$j2zUIi', 'qP2!0nF9%Y26G#G1JbQ'], amount: 'wA&odcTslN$WHy'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['7S^1M', 'QGch!MQY*%R1WKh644o'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['v!VuuyEQ', 'SBdS*15Xu8$3oiKswk'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/albums', {ids: ['MB(03XIab^Wq&3vdj)[C', 'mt5@XT!'], amount: 12.25}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/albums', {ids: ['$GE^Dl7A!zUyhWqZns!h', 'K85&#@'], amount: 0}, 400);
				});
			});
		});
		describe('artist/series', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/series', {ids: ['l4sIfF(]TH0Xl&xZ&yA8', '$^EM*Y6%JL]7Q[U8hM']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('artist/series', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/series', {ids: [null, '']}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('artist/series', {ids: ['DtuecV4l$ttxYxU', 'LUwgO!^10'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('artist/series', {ids: ['7gA1LivWC#zoYp8', 'h4DPXsm2'], seriesAlbums: '9yr7Ca6u9sjU![Jw'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['V6Qu#PMFfJb#f@Xm!GVW', '%kLA3wH)^pOvAfy'], seriesAlbums: -5160735080447998}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['Ur[R58$#Zf', 'Qv0v63sYjPGNl5m#]'], seriesAlbums: -1597029222449153}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['l30zlqZTd6moD@ce', 'x^4WiGetI2WSX]GYS'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['Dfn#s2ku)nI', 'BPqH('], seriesAlbumIDs: 'UhQ1Lbccow'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['e^O[I!@eRUCD9gcf5n', 'uEvqWu4hRp&5x'], seriesAlbumIDs: -4912351362940926}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['SHz#qR9)T%uBkl', '&CoYI'], seriesAlbumIDs: 517794479210495}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['emdk)o)63zy3(', 'y@tKvNp)r543xhi'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('artist/series', {ids: ['k@2gGFVEmw', 'P&Ozk5!)8yGurfd]dOO'], seriesState: 'Cq[Tw]jSx#p6d4'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['!0hJq5dQC$fbsr2dOf', 'xoVK[(WiCcmyI^Y'], seriesState: -833662237016062}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['tviJ07XwXjP*tF8', '^EUmU1dnAst1V8$'], seriesState: -2079499919294465}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['3PK#%vLOckL9', '4F@BmeA#mt!3x'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['vi%]JJZOswQ', 'o02R)vh'], seriesTracks: 'J5oQM^S0'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['*b#IZV[c', 'r@y#HiwP6Jskg^cN'], seriesTracks: 7002061237387266}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['o(kEOh6)688acvXkxz', 'Gsn4Xq$WkA%%B$!m^qC'], seriesTracks: -4612944746774529}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['9fHqi)HUROV%Z&0', 'itD8l]VhV5'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['eVtRAoOP^fQ', 'tg%w^kOhVsK0'], seriesTrackIDs: '4gnlYRDV65$2#mZ[p%'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['ZSfnXwu^ZHqEzV#y', '4!@3xmMFkhwRR5G'], seriesTrackIDs: -314383674638334}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['HLZ7xA8K', 'k0GUR6PGRI2NFoU0SNzs'], seriesTrackIDs: -7121423277490177}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['XaAIp0)(S', 'P7@PCiK!OdOmYG'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('artist/series', {ids: ['GyWN5eU2ccM', 'm1fTB[)65T@]v'], seriesInfo: 'S0d(8jj9V'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['v(GUx0u', '#4fTnlSKsTzK2%'], seriesInfo: -8916639944802302}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['XGH[RNnz3', '8otqKZ%@9DgTOB5'], seriesInfo: -6328442291224577}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['ijzx#I', 'OJR#4wuzsVEQJP'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['oD*8WI5K#J&F%m4BZt', 'ydNp]rE6jZ(RW$8msy$X'], albumTracks: 'aO6ZDG)2O'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['sYk4slasxcbtGVlp', 'w8^#iU5JME68A['], albumTracks: 1367568623337474}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['KbV&I2tbb', 'TB)m&r8j(@yymZY'], albumTracks: -5624612398301185}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['8b@NvMO#P', '#NIaz3'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['yRZgIc%gs2m4L4$R@', '1S)r)Ef91[lh'], albumTrackIDs: 'VV4jYcBC%8'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['CYHoviBcxD]y9fm3Xo[E', 'U52#a(fASqryFnvne)aL'], albumTrackIDs: -4728861212278782}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['%kWlo@HsB*oJJ&L', 'c^hFQVOi[*vV7lm'], albumTrackIDs: -8441131377360897}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['ccW&MAL5o', 'ydK%eOh!Tw'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/series', {ids: ['p2qQw8ROG&TCYr6!', 'E4L#Y[)X2wjlm*'], albumState: 'o2s5hht06H6FVyxM*('}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['9e3uLzcW19', 'RLl&!nmbQZ)]'], albumState: -767227171176446}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['gPx3!qVi', '$ZuXs5I%e'], albumState: -6656691252756481}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('artist/series', {ids: [']!%U(6u9luuRhT', 's]sGkrD2vd'], albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('artist/series', {ids: ['9^$o%va', 'Q&H@Z7ngS(uvhFCy3g'], albumTag: 'ctztn*hT8ASGrhyQ$'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['fkGk%YYwpGuNUi', 'AjHN1si)#kf@6YzFC$2'], albumTag: -2705748198948862}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['a0lep', 'HhSVPgU6O6NtuCIRl'], albumTag: 5599490673213439}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['q87LHtn%PzaLkg', 'BM@Yu2nG'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/series', {ids: ['xTo!S88eAV', 'Qt1I0&*GJmkxj'], albumInfo: 'rNWX%g'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['5)(3[O6)ON3rf*0', '92gFampDZX'], albumInfo: -2123800309137406}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['xc!9]b4Khks4VQw!Bq8', 'ZenQua0Nv'], albumInfo: -6932145310269441}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/series', {ids: ['Z8NishI!!64@', 'Ku7gH71(zKKYSYp'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/series', {ids: ['Uumwy0S', 'aLFL0Jy3smWxl6'], trackMedia: 'hAuQs!6h'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['OOhXeyutBhJi[q[A!', '@2C[gM1*Ps'], trackMedia: 6288639680053250}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['KhoKNt(ql!t', 'piel#45DRuTE'], trackMedia: 4940280130174975}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['OG2Z1F)kjlHOl7tl', 'q9D24[JcHG9ABoh'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/series', {ids: ['hBs4CG6%Ueqrv%CU85Fo', '6D4rYu&UC8b9a*PG7Y'], trackTag: 'uqA]&6OXcmY(1fhmS!'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['o666qplio]@hkyebG', 'Hj8DpCG89e'], trackTag: -6675902654054398}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['n5qoz766', 'rkkUi9EpNkQhi0[&Hv'], trackTag: -8069137779654657}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['TUC1!mqF', '9E[sM)'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/series', {ids: ['$Td6cqxNdhGv[C3', 'g&QWumj*9T%xXfkzH('], trackRawTag: 'u!GgYzjrB^'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['!k9T%X4kz4*YoaFm)X3N', 'vzlUW'], trackRawTag: -3150094136246270}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['KTncaOdwx%Dr]*0@r!f', 'YBLy%HsnV'], trackRawTag: 2817941535981567}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['M@miSAA', '@&]K1X$FS[EO'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/series', {ids: ['c)2OIdstc9DNNO^u7o', 'V(Km3Xdx4dYJk*b!c]'], trackState: '9oJiw!bVlqv5gT'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['Hk)Uj!', 'ibaSK2J^*VmwLC'], trackState: -8578847876317182}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['^3zSI', 'zsi64MaFukQa]&Zq'], trackState: -7379678889246721}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/series', {ids: ['vD*X^fdsV^IboC8&8', 'JoA9*82frnEl^BpS$m'], offset: 'sZdsu)dlm]QaY'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/series', {ids: ['z%a0VhYO', 'j2hxVhjGFKWXA!OiX^ar'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/series', {ids: ['I&[hx5IkPp^*8PngZ', 'b(6%XU$3[W6H$t91qit*'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/series', {ids: ['H[mZT%Oe3$pGKm', 'wSlx^zcvA!'], offset: 3.79}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/series', {ids: ['r6lqrd', 'V1HzGz51n[V[ljsW[hyt'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/series', {ids: ['R1ZXBrnG$6Y', 'NDBj7QG&gkrfV*sw'], amount: '0MozPldw'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/series', {ids: ['fOFPUki', 'm[IITJhM(Go66F'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/series', {ids: ['MIGX6S65@#(', '(([JoR@y'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/series', {ids: ['X325]D%04h', '&DXnOE!Cw9)uQHP($'], amount: 65.56}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/series', {ids: ['ljTryFfh', '!T^T65#vKtY'], amount: 0}, 400);
				});
			});
		});
		describe('artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/info', {id: 'Ah4PJpWkISpZ^xi'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/info', {id: ''}, 400);
				});
			});
		});
		describe('album/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/id', {id: 'c7N5B'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/id', {id: ''}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/id', {id: 'Mm4^qH$u1jsl8u#', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/id', {id: 'KM&WbfAR3[', albumTracks: '[[uhUv6mSsPPJ[EE%a'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/id', {id: '^[p1i)B1', albumTracks: 3519213390004226}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/id', {id: '33Ad0eT)N#UKkM5W', albumTracks: -4735741770858497}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/id', {id: 'UXJmneyYzg4o4H', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/id', {id: '7FQa*Q@3DQ^FWmL', albumTrackIDs: 'eV)yhozU(8'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/id', {id: 'O4Mupm)j]cPKjK99HMR@', albumTrackIDs: 1311438186479618}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/id', {id: '$qEF8@UCFhx3kw@qAiy#', albumTrackIDs: -5286181839306753}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/id', {id: 'eQ)qLEAJiR', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/id', {id: 'ArlY&&', albumState: 'Z5E[A%zZG'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/id', {id: 'L!BKcsYTmFcWC@', albumState: 4469979466432514}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/id', {id: 'g00UDd0EbHKraK0M@Us6', albumState: -2759708716826625}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('album/id', {id: 'Qm!mTy83mq', albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('album/id', {id: 'DHFTKD', albumTag: 'W*@bNEm]Y5A[#nF'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('album/id', {id: 'f24zcyUWa@', albumTag: 8501850017890306}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'nZWbb7YW', albumTag: -3647476200374273}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/id', {id: '2uDE#uO(#r)*', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/id', {id: 'lzeih%lz#', albumInfo: 'TIrDxSe'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/id', {id: 'Ml(kfF[g#)UV', albumInfo: 3832465781161986}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/id', {id: 'hsmNjey^IRr', albumInfo: 1338176769622015}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/id', {id: 'EwlI!L!K0l0[MoBO3', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/id', {id: '#kl6mfd%oS^syWdGB', trackMedia: 'O&k5W#^tihK*nYoSFFkk'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/id', {id: 'h$pk]4H', trackMedia: 3535825807605762}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/id', {id: 'xgWao3p@EC]#dU', trackMedia: 6931823896559615}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/id', {id: 'CTTgX3*!eP', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/id', {id: '3Qxt)uC)[4k3*om', trackTag: 'CYqc5Bu'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/id', {id: 'zIutxkhUfVxs', trackTag: -4991869889019902}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'sO^SDhz@oEn', trackTag: 7844451565174783}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/id', {id: '(9g6@x)#5NZtrpA02#', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/id', {id: 'lXXCAb8c718NCW2', trackRawTag: '1r%en[jX]k^gzd'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/id', {id: 'if*6oJKxxa4mvhmS', trackRawTag: 8792459756699650}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'EjGODVfq^et&)f', trackRawTag: -6393858036334593}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/id', {id: '&#RlEK7BZJ', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/id', {id: '02JTB(M!gj8i', trackState: '@T(%ObJhe(CH'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/id', {id: 'Xy()j[Pz])GcK', trackState: 3401806117863426}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/id', {id: '!ZTFMNHYclg', trackState: 3193301540798463}, 400);
				});
			});
		});
		describe('album/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/ids', {ids: ['%P6bcrUu^8*[7K', 'Ksm[0b%xSZSTJN&4bm0']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('album/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/ids', {ids: [null, '']}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/ids', {ids: ['2YYhtE', 'ST9qi9S0APmbb[24'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/ids', {ids: ['m!LPYvf1(0jg9T$', 'Z^GwxzDBJn5X)'], albumTracks: 'WOU5rH6wG&LIsMQ%tn40'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['A56)O2)', '69O$EqYLuw'], albumTracks: -1325769540239358}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['4#Un%%]Ug', '2Uh[jJ(0@zTp31d'], albumTracks: -3896058597867521}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/ids', {ids: ['zy8n&R#', 'ISlGe68*XJ'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/ids', {ids: ['jLyiVhyF@p^*0A6', '4[0LUUZeBhk^yQ'], albumTrackIDs: 't4fTdpAB&PXlt]uMn4ie'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['3#fS1@ZdJ]hF*Z2eyI9i', 'sr)P3'], albumTrackIDs: 1622673574592514}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['CQop[J5m1Y', 'Mipx$'], albumTrackIDs: 5722454446047231}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['$*scIwTc', '8SZeW'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/ids', {ids: [')3E]Ll2TV', 's#gievxYS1TmPv730Q'], albumState: 'i@ZPF'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['!WPERK(kVI', 'n#toHEJBXFYhRej!q'], albumState: 5004046041612290}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['iR&DO[Uk7CO^^tvGJFJQ', 'sRPV#2'], albumState: 1663105885011967}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['BuaZuAZ9YpoYb[sx', 'AqCNIWvksRNt'], albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('album/ids', {ids: ['85l[IRw', 'AIRYu'], albumTag: 'UF^b!CKdU$i!zXr9Ox3x'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['sWBL$I', 'GlBeZvvpNY8PAy'], albumTag: -8854739693338622}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['wizG93Lq%oRJLuL@1', 'ICWdfJgj9k'], albumTag: -6035554747547649}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/ids', {ids: ['((JV6n%n&SYN@Rxlb', 'VvIN1j&n)cd'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/ids', {ids: ['%#]Y6kIVabkvZm', 'OtC[!drYvaI5qw'], albumInfo: 'vvnXpWPQtZ'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['V%GfDP)UWt', 'KJ3ufcQv$(B'], albumInfo: -3315662592147454}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['uPLlor6VMXW@ZjuC(s', 'z7]A[Cf#'], albumInfo: 1250220365053951}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/ids', {ids: ['n]iKKHeO', '!jpba'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/ids', {ids: ['622z0&6a8J', 'D0tyFKUz'], trackMedia: 'v3RBjIdMfXiDB4ZTXeG'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['R0MolkONu7&j', '*f62Vorq8E%K'], trackMedia: 8843373087555586}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['&mn#1B', 'bNu&hJSm3Z!QfsDRVWJn'], trackMedia: -6391761299570689}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['5Ibn49ApALf$D#iR', 'rlIAQ'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/ids', {ids: ['nWTeNSHNZX', '1d!nTC2l'], trackTag: 'q(7mL@l*%UJcV'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['kByQI', 'vY9xr%'], trackTag: -4662786135162878}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['8pIX^M9%$c', 'jl%zLq6e^G&Ksu'], trackTag: -6140789365145601}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['QW1Yu5MI3WcL&8*XquE', 'aPa!I*MF&h4%s5ay'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/ids', {ids: ['k8Y^2', '2md@ZtH@alaQ@z2'], trackRawTag: 'PXOKzOCOX&R#cl5$GR'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['sDtM0ApLjPR$B(3]', 'yAj%*O!udS8kE*jn'], trackRawTag: 5831672079581186}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['9NvqCxXuoD4Zm', 'eAS(m'], trackRawTag: -7069264733274113}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['Mm(0ajTKudVWFv(YiD', 'RyGEo&B$MV5wm7@!i['], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/ids', {ids: ['Ci[S8K', 'KP#D70s8[&X^DPcP(WU'], trackState: '#rh1UhLS8*'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['c8u1W', 'ScJyJrcForjFXRPve^'], trackState: 6882469819187202}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['1XgC!as[NpfL', 'esD5BLL%%2ysG^)'], trackState: -5158994280710145}, 400);
				});
			});
		});
		describe('album/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/list', {list: 'avghighest'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"list" set to "empty string"', async () => {
					await get('album/list', {list: ''}, 400);
				});
				it('"list" set to "invalid enum"', async () => {
					await get('album/list', {list: 'invalid'}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/list', {list: 'random', offset: 'EWtT3o1'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/list', {list: 'recent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/list', {list: 'random', offset: 64.53}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'highest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/list', {list: 'faved', amount: ')To@O]S%vNsix'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/list', {list: 'avghighest', amount: 76.97}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/list', {list: 'highest', amount: 0}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/list', {list: 'frequent', albumTracks: 'beSEATf$3cTkZbKB'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/list', {list: 'recent', albumTracks: -5077696178552830}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', albumTracks: 5413463765549055}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', albumTrackIDs: 'HjM7)'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', albumTrackIDs: 5206034905825282}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', albumTrackIDs: -6427414192193537}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/list', {list: 'random', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/list', {list: 'faved', albumState: 'Iv(q*boL(GD3'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'faved', albumState: -4151161594576894}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', albumState: 6581875728449535}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('album/list', {list: 'frequent', albumTag: 'cmiTzY]GAB'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', albumTag: 3558555340767234}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'frequent', albumTag: -667405088980993}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/list', {list: 'random', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/list', {list: 'frequent', albumInfo: 'C(%29H[[7NhW0]lL3c'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', albumInfo: -5920538635534334}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', albumInfo: 1600669203038207}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/list', {list: 'random', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', trackMedia: '^yKXBw*'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', trackMedia: 8001782814867458}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', trackMedia: -4524020443643905}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/list', {list: 'highest', trackTag: 'fj#)8wvJHZ'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', trackTag: 6420056447647746}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'frequent', trackTag: -5372257484406785}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/list', {list: 'faved', trackRawTag: '8A9x9Wwo2b%n^6OpZ1f'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', trackRawTag: 6389364548435970}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'frequent', trackRawTag: -6783505388273665}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/list', {list: 'frequent', trackState: 'KLp(c7zJOtB(l'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', trackState: -5371840436371454}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', trackState: -2643535085961217}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('album/list', {list: 'random', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('album/list', {list: 'faved', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'random', rootIDs: [null, '']}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', artistID: ''}, 400);
				});
				it('"trackID" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackID: ''}, 400);
				});
				it('"mbAlbumID" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', mbAlbumID: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('album/list', {list: 'random', mbArtistID: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', genre: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('album/list', {list: 'random', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('album/list', {list: 'faved', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('album/list', {list: 'faved', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('album/list', {list: 'highest', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', newerThan: 'QV&1vMZOUQ'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/list', {list: 'highest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/list', {list: 'avghighest', newerThan: 31.83}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'frequent', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/list', {list: 'faved', fromYear: 'DbhoN&p'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/list', {list: 'recent', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/list', {list: 'avghighest', fromYear: 50.46}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'recent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/list', {list: 'random', toYear: 'a]c@j7K8s9z(fd'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/list', {list: 'highest', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/list', {list: 'recent', toYear: 53.8}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'frequent', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('album/list', {list: 'faved', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('album/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('album/list', {list: 'recent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('album/list', {list: 'random', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('album/list', {list: 'random', sortDescending: 'Egf*v'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', sortDescending: -7703587568222206}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/list', {list: 'faved', sortDescending: 6516079518023679}, 400);
				});
			});
		});
		describe('album/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('album/search', {offset: 'AyWR5l4'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/search', {offset: 22.87}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/search', {amount: '%6P6dp65xwt9)1RtYAr'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/search', {amount: 17.26}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/search', {amount: 0}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('album/search', {name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('album/search', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('album/search', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('album/search', {rootIDs: [null, '']}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('album/search', {artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('album/search', {artistID: ''}, 400);
				});
				it('"trackID" set to "empty string"', async () => {
					await get('album/search', {trackID: ''}, 400);
				});
				it('"mbAlbumID" set to "empty string"', async () => {
					await get('album/search', {mbAlbumID: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('album/search', {mbArtistID: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('album/search', {genre: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('album/search', {albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('album/search', {albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('album/search', {albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('album/search', {albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('album/search', {albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('album/search', {newerThan: 'w]r*qNNBW08YdQ'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/search', {newerThan: 86.81}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/search', {fromYear: 'Vtr74tTzA6cF@lNBPH6j'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/search', {fromYear: 15.8}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/search', {toYear: 'yBuGdwbI'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/search', {toYear: 73.32}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('album/search', {toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('album/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('album/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('album/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('album/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('album/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('album/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('album/search', {sortDescending: 'i@h#Go)b%uD'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/search', {sortDescending: -1156106470555646}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/search', {sortDescending: -8801280168296449}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/search', {albumTracks: 'GfE(r$)W#eKvb!gRb'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/search', {albumTracks: -2739258846609406}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/search', {albumTracks: 7677825016397823}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/search', {albumTrackIDs: '8yM]Y'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/search', {albumTrackIDs: -3564222009049086}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/search', {albumTrackIDs: -5656619668996097}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/search', {albumState: 'A$1kmJ8!ah8L*d8M#'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/search', {albumState: -5401422094925822}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/search', {albumState: -8024119996055553}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('album/search', {albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('album/search', {albumTag: 'jkCa6tiT17Xotba'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('album/search', {albumTag: -1050550607020030}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('album/search', {albumTag: 7790739383648255}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/search', {albumInfo: '%e^0jIzWFA4*^65z'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/search', {albumInfo: 1442552674779138}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/search', {albumInfo: 1912421274877951}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/search', {trackMedia: 'xo^pj'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/search', {trackMedia: 3665169389453314}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/search', {trackMedia: 5588596971012095}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/search', {trackTag: 'ELldFg'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/search', {trackTag: -8312070638403582}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/search', {trackTag: -8288271595470849}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/search', {trackRawTag: 'x61$sS'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/search', {trackRawTag: 3856520911519746}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/search', {trackRawTag: 5689128289042431}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/search', {trackState: 'peJF64gu#hfr5!F'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/search', {trackState: -8728628552531966}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/search', {trackState: -3818924856573953}, 400);
				});
			});
		});
		describe('album/index', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/index', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"name" set to "empty string"', async () => {
					await get('album/index', {name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('album/index', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('album/index', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('album/index', {rootIDs: [null, '']}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('album/index', {artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('album/index', {artistID: ''}, 400);
				});
				it('"trackID" set to "empty string"', async () => {
					await get('album/index', {trackID: ''}, 400);
				});
				it('"mbAlbumID" set to "empty string"', async () => {
					await get('album/index', {mbAlbumID: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('album/index', {mbArtistID: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('album/index', {genre: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('album/index', {albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('album/index', {albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('album/index', {albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('album/index', {albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('album/index', {albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('album/index', {newerThan: '0r*VspBA[bhwqKW(G'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/index', {newerThan: 15.81}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/index', {fromYear: 'Gd)T)KM^#P'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/index', {fromYear: 71.69}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/index', {toYear: 'Zk$P9^iLsS'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/index', {toYear: 68.27}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('album/index', {toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('album/index', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('album/index', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('album/index', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('album/index', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/index', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('album/index', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('album/index', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('album/index', {sortDescending: 'dQdGQ'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/index', {sortDescending: 261871709978626}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/index', {sortDescending: -1043321011044353}, 400);
				});
			});
		});
		describe('album/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/state', {id: 'Y1OPl!B('}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/state', {id: ''}, 400);
				});
			});
		});
		describe('album/states', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/states', {ids: ['pbjngm[YsN9L@g', 'YsyXNmQAr^ieRS9jZub']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('album/states', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/states', {ids: [null, '']}, 400);
				});
			});
		});
		describe('album/similar/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/similar/tracks', {id: 'hEZ(o@XGQBcjz)Rnwt'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'mk66u', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/similar/tracks', {id: '0gdwikph', trackMedia: '#ayjafU#ci74pjcFom'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'Z#cl[e)zE]dO9bi', trackMedia: -7789508116348926}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'n]rbNa04', trackMedia: 2646244065279999}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '2bB7d9(%z0$lUoAA', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'bUn(rJ#&S2wYA#GRI', trackTag: 'mcF45lvf*eEXKDqt#'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'Lp(6*', trackTag: -5909096498724862}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'rh2e1c$Fi', trackTag: 7320861807738879}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '80SJZE4EJs', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'ZntZV', trackRawTag: 'tjPPoUyvPmyxz'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'B7g5]wxRmmEil7b', trackRawTag: -278138554679294}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'Xgl@65', trackRawTag: 3881170202787839}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'X3)wK2O#yzccL37Gp&', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'l(PmOCJBzf$^', trackState: 'a%3^G5zSLVmYAL)Ej'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'GGbB@J', trackState: 3263265131986946}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'W#r#2jdTJPqWfEpm', trackState: 7165115602305023}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'z)@^7w]OeQsrWn', offset: 'Xe!jj46'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '!4@Vm3R1d$f', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: ')zH[5N0jH', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'R8GyA(LdE[Bto', offset: 22.67}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/similar/tracks', {id: 'vuwqJPU4Lxug6', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/similar/tracks', {id: '6o$Q45N4DOP7', amount: ']LwRWq'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'jg7#HNInoR5mEWVFm', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: 'ESDSGe!mhCm#*Xf3', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'NC4esiUxVgPA#xIjNe)', amount: 68.68}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/similar/tracks', {id: 'tL3n@R4i@9@36', amount: 0}, 400);
				});
			});
		});
		describe('album/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/tracks', {ids: ['sWd0EDm&b', 'V]QjK8']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('album/tracks', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/tracks', {ids: [null, '']}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['dO4AAbvYhiE7YB3ynh0', 'y!vO$3fLBsXA$Mv'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/tracks', {ids: ['AquhK[5%e1%lLtf!r@3', '9JQ8Phn$1]U'], trackMedia: 'NOZiJ612S9&lRm7O6^iC'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['GeDoOh$Fk69IrcHK', ')8E!U'], trackMedia: 160211302088706}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['&06DnsafEAgoPNIaW&', 'MSW%@JDVb26'], trackMedia: 7325125380669439}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['4Eyelld0X#7]R*6^J)W', 'Wqs*Zgy$bJc5ii@'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['ISLTwHnxtbtUKTI7FpU', 'FeogH4X5Nxc^[QL@'], trackTag: 'S]dmJH(vu%yC'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['F)HHt', '#EJXFQ*]5nZh@ted'], trackTag: -5527105035042814}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['K^tI9np$m^RcC2nBHd1', '3lJd11LEiahH'], trackTag: -1435472333111297}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['AGYD[O', '&X@R85O23IE@F8VC'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['*Afas', 'O%yIGXp'], trackRawTag: 'x##YqJTX56d!A*44['}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['xTU7iwey', '#mThKtG3$bLc20'], trackRawTag: -4895465376055294}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['MLy[GFQ2Boeq@#i4l0', 'u9#E&K2r)&'], trackRawTag: 3445411599613951}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['XX5[$bV', 'rxiuBk3]rXVv^aeG8H'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/tracks', {ids: ['KzmFi6zUlutEm)o0S', 'qCTXgTisNhx!6ra3F'], trackState: '5jV[RHbk0R'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['!HXxyK4UHiNzxZqTlGn3', '*x]mo#o*JWri0tKgr'], trackState: -4258587970895870}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['bfTfODDiA1', 'LwQWUsn'], trackState: 8504950917169151}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/tracks', {ids: ['js55UIl7y', 'LWs$KxY'], offset: 'qEBRH#tK'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['f9DyU4Ae424k&v', '&3q4Ce4P[Rf[HTsbJmd'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['I04Sq)3', '[3L&vz%(U'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/tracks', {ids: ['R#yk)UK^@OU(', 'u(AU&lKMmh#'], offset: 19.99}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/tracks', {ids: ['Y&ifM', 'tRkdS2sbIYXI'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/tracks', {ids: ['20s@j^UECHTLI', 'EUm4K58Vd#t(g'], amount: 'T93yKLYyx8]X$S$Homo'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['if(LHXzHNz', '([zCC'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['aC$eV$*Fg9@FB2]SHa3', '24uJdj&lu3(Q6bKll'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/tracks', {ids: ['QD8wZbWPC[Pc', 'DWamvNPt8g5TUFkP5'], amount: 4.51}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/tracks', {ids: ['%p5zl', 'w!sUEuhHbxFycTTE706'], amount: 0}, 400);
				});
			});
		});
		describe('album/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/info', {id: 'Byb^&r9(TpsLb]m'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/info', {id: ''}, 400);
				});
			});
		});
		describe('series/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/id', {id: '*ESSuYlq0gcJ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('series/id', {id: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/id', {id: '75QTqXi*', rootID: ''}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/id', {id: 'Z&Xvm', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/id', {id: 'Lyk8kpq*KV6UmrUk)WA', seriesAlbums: '6v1BmRCT!XAwj09O'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/id', {id: 'oKYlqkvC0a3EPj', seriesAlbums: 6727672436621314}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/id', {id: '^NaQGBrRWFDY8DxGc#D', seriesAlbums: 7195687661862911}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'onC0qh13[', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/id', {id: 'Aw1*xC0Y%', seriesAlbumIDs: 'cB6q3hxpPVq7%3'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'NLQlY7czER', seriesAlbumIDs: 1644225477214210}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: '^Zji$XK', seriesAlbumIDs: -1116921252544513}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/id', {id: '10mPD0s7p', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/id', {id: 'el7M6%BBYj', seriesState: 'lda[rw'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/id', {id: '(RDCkWcl*u', seriesState: -2947020637601790}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'NfTjo^MAR', seriesState: -6061650587156481}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/id', {id: 'NOOUgTh6p)E8*&7h1z', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/id', {id: '0sPSI9F1$^#BK&6hEWpA', seriesTracks: 'c%5aYt%lrOt^'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: '3Z63]RL^', seriesTracks: -2528786444713982}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: '^N2%$tS%HY!uW^T)', seriesTracks: 8466114010939391}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'z9F6euzRz40M^Z8f', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/id', {id: 'tG1Vm', seriesTrackIDs: 'D0YfFKe'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'z7p(X76i16p%b*&W', seriesTrackIDs: -3807846680494078}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'MvVlA@sLLFeBb%0t', seriesTrackIDs: 6837218505129983}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/id', {id: 'FdhUjim$Q6!L', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/id', {id: 'ygRe2g', seriesInfo: '9K9*CD!^'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: 'rjqu8*T#SjrE4Z&R', seriesInfo: -6234562682159102}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: '#5(O#R1U', seriesInfo: 3455346978848767}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/id', {id: '5hqsEhWyILUDZ', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/id', {id: '!DUR)@zr4', albumTracks: '%(KY5DdA%6vD'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: 'm((yW65ce8zVp8S', albumTracks: -718872290263038}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: 'I357pk%zC^GiqF*)&McB', albumTracks: 3446443691999231}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'y70m*[jTcp9djv0', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/id', {id: 'Hh4cuYw9iK', albumTrackIDs: '%6105ivlr'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'OLoEeU', albumTrackIDs: -3958293701591038}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'Sf0KAbS', albumTrackIDs: -2624980315537409}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/id', {id: '2KbKOQED', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/id', {id: 'wIwkV*ftu#E31&', albumState: 'SgsSGSwNf&0xb'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/id', {id: 'GV%m0hJ934FK%0VCT#H7', albumState: -3796053329444862}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'zGNm]z%a7DNxN1^$YXUI', albumState: -4103069797187585}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('series/id', {id: '2Kcbk$8p', albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('series/id', {id: '##T@1', albumTag: '!ijkJVbr9Urk5w52t'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('series/id', {id: '^Vfkg[%Xc', albumTag: -1796546530115582}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'oD#71N#4(', albumTag: -7119167836651521}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/id', {id: '4amlK#ZlmZL', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/id', {id: '6AtryDY6LfAe1$Vi', albumInfo: 'x@aY)[qC%87cXK7IYc4'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: 'TTbSz%r1c6tokZ^F', albumInfo: 6980760334499842}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: '5YmlN)', albumInfo: 3309823764463615}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/id', {id: '1wn[O&OSSw', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/id', {id: '9kGQxAQ!Hoy9EXk3V4Hq', trackMedia: '&9hgKuWtlj]'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/id', {id: '0o5VtvXn5CKcR4k', trackMedia: -4105311421988862}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/id', {id: 'd#^kr!mCWjJ)', trackMedia: 6792400445898751}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/id', {id: 'J7hSJ61eDT7CgaK', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/id', {id: '1!wt%rlXIln', trackTag: 'MI2d2kzgHoU'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/id', {id: 'zoHlhyI49', trackTag: 916387153313794}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'Or(*b8vqWvy9o', trackTag: -3625249732034561}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/id', {id: 'vG*Rg*EUvMqQqK3I', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/id', {id: 'fpy1Ye^&', trackRawTag: '(QZ&aFUZ)'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/id', {id: '5)btuiaNVGD]m96r#uK', trackRawTag: 7900792468013058}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'Pq3&x))P', trackRawTag: -8915777478459393}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/id', {id: 'g1MDoyL0C0GBxu^)SMrL', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/id', {id: 'C#WZdstDPFMQ1T6', trackState: 'PkCcyKFa@J[48OfTboc8'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/id', {id: 'NOn%E', trackState: 4815956475904002}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'a$e2@NThs00B)', trackState: -4645352841936897}, 400);
				});
			});
		});
		describe('series/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/ids', {ids: ['YnaVpX45&4FXz1', 'Sv3AOp']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('series/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/ids', {ids: [null, '']}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/ids', {ids: ['I6rw&o', 'r#qqbU'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/ids', {ids: ['6CgRU)r$WA4a^1ZFjPz)', '^BApy4zvn)s@glaMR'], seriesAlbums: '0GpztHA9EC6YJwlB'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['02AiNlEew', 'bu$tHh'], seriesAlbums: 394037542518786}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['!eBU5(eDggZy7I', '#P)yBfN'], seriesAlbums: -7535132470673409}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['r@)Cm', 'mP3GITWgs[9r&3NXXOIj'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['lpLyVX#54ZjPCdZVTLQ0', '543Ltr'], seriesAlbumIDs: 'jgX12q4J8UjMyW^uDxm'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['*p^TnmmG9', 'yIwj7^XWv$#^'], seriesAlbumIDs: 91925264728066}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['9Oh%vtcrX8Xmr3jLvA69', 'y0oxCBcG(&uy'], seriesAlbumIDs: 1970742279274495}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['1$V1hc[fIn', '7L]k@K'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/ids', {ids: ['u04QQZHpF3EUePc2NQ', 'l0sO8fduvrnHzD'], seriesState: '(ydqtxlq'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['2#10GUDPtO06R!H', '4qV7n*L'], seriesState: 1526095761375234}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['iwxsT#', 'fIUfZj@132G^AbI'], seriesState: 4916833807237119}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['04AGP', 'yYBMx(PNkMlm'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['[5uLXI^zAVp(USg', 'Ywm]JSjfTZazQs'], seriesTracks: 'zY*VyZw'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['UUoOg8$]', 'Bwr9^mSjCEy71CF2BD4]'], seriesTracks: -72976254894078}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['wNt[ESCL*9nfo', 'i![mH$Axy9'], seriesTracks: -3587375972220929}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['*Ud@8k', ']lVuNYe3wzQpFugxUg'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['%R(tNQZ]UCN8[Q3L', 'AsSLnF'], seriesTrackIDs: 'UvUOxJLH%WH6pFpX'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['3zkC0%ZYQzKg)8', 'uHWm[kR'], seriesTrackIDs: 4608126963679234}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['Kv@Z8))sj#[wvS[', 'u55@W'], seriesTrackIDs: -8984825247563777}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['n9qlO6', ']Y!d[RnT[TlQXVM$'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/ids', {ids: ['IYtBoKL$qt', 'Bh3uxt'], seriesInfo: 'wmT(O4e%'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['7LTZ1q508RT$E5PH', 'PDsVWRX&)Th#ojHY&Bt#'], seriesInfo: 5206474091397122}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['b!HwIdr(c#3SV0MTySG', 'OAIy5e'], seriesInfo: -6560693125906433}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['atIY#PDUVu', '%#)j5Y'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['IvHSTmo', 'oZZ)BkdkMW'], albumTracks: 'S6w4VR[RGZb'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['@3gaiq@L^1(25Y5h]FHL', 'n33de'], albumTracks: -2470514790498302}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['p4HJ7u]iVOQ', 'A[lba'], albumTracks: -4915538488721409}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['8uF$U!$*', 'GsJgtYWDkhDY'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['f)rOU@*Ax', 'nrvLx'], albumTrackIDs: 'QQc]@6)8'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['EB(1s$p*RUygrKxGD!I)', 'X&6RseW&oHsQ'], albumTrackIDs: -583783120109566}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['EWXKqgxR^)3zG3RM*LMe', 'uitz)'], albumTrackIDs: 1591030956687359}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['v9xKrKgMc4WA', 'IeH7jqRo@X'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/ids', {ids: ['&Tae5ae2BJUT8w', '*jNH%)n)3(P'], albumState: 'LlobqwNJMdDcO[EV0'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['vE)uMfiBd', '&tl)VUi4MKJsHiU3'], albumState: 212037267357698}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['PX8%$JL#gyRBX6lLgm$i', 'rt#z1FxUKW'], albumState: -5198753212399617}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['*uI[Akv(5I&qS9o[', 'c&vU2'], albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('series/ids', {ids: ['^S50Hq6', '$5bmNGrmg'], albumTag: 'yzf*ZyRZ^'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['T6A@*cXnQRxQ*Xz', 'B(#)6lpuZA4JDNRLHn'], albumTag: 622039404642306}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['opoPaOtJN', 'rQSGW4Z!1H$xl7)BGkT'], albumTag: 5509138771607551}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['lKFgI', 'GUGXDrSBBUW*ff'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/ids', {ids: ['(hj!o', 'ltd9NH3i4s!27sDcP'], albumInfo: 'rV6s9$jl'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['n8l^CrumtfDpD%^', '^jF]JoxI8AbqmRuA8O]^'], albumInfo: -8428586386063358}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['RUw*y&jYJE#Y[dsQ6OF', 'nhmHoJUQSeRhX'], albumInfo: -7390697351020545}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/ids', {ids: ['bNZ]#oS', 'qqCKsL(sMwJq!M!tZeR2'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/ids', {ids: ['C&[c58tUYoAc&', 'ej8sJnT!OB^^ZAymxl'], trackMedia: 'r0Qdu0R'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['#Obsp6YKVPX', 'K1QnYR$#FnU7DOy33FJ'], trackMedia: -3660701461643262}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['(MtOxfH$nZfimX)hK', 'Agp0GQHQTeK'], trackMedia: 1282477389774847}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['iob3[!7x1$qF)^WH', 'FyXI6u[L!$QvSK1g'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/ids', {ids: ['#U!Ode', '%k^kwZAGIyS7ey'], trackTag: 'TYomB'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['SXecJ@cfM$8J*][jqI', '#!2YNUB^7(IyP!0%rHs'], trackTag: 5084737941012482}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['%3uLQ(WmHK', 'm8jN(36L0(6#VP#s1g'], trackTag: 8317107007651839}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['&T1wd2', 'k4NmNnKU'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/ids', {ids: ['D)oNA6Z%Lhq', 'aRp](MfaHcvRnWa'], trackRawTag: 'm$yV(7%AGMbB'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['FV7DM0b&vMayhJ', 'wo3]qY]r'], trackRawTag: -7060071729070078}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['P(A)aoVmW^#a', '8@H51(!OJOU1X'], trackRawTag: 6541629766762495}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['CsoOFst*(af', 'rFJ*Oe#rYS9'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/ids', {ids: ['iGF35O50', 'BviWz)W5V%'], trackState: '$0ADcjGewx5JS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['YFRslh!j6j', 'Aai%3e70zJ7SMs9'], trackState: 8856839387086850}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['w7z5vuMOGiC', '&ZC^PmzPf[7mo'], trackState: 5152053332541439}, 400);
				});
			});
		});
		describe('series/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('series/search', {offset: 'yU#ERz1#IJ$PDRM9m'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/search', {offset: 21.55}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/search', {amount: 'AhWe^e'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/search', {amount: 91.31}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/search', {amount: 0}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('series/search', {name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/search', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('series/search', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('series/search', {rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('series/search', {albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('series/search', {albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('series/search', {albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('series/search', {albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('series/search', {albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('series/search', {albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('series/search', {newerThan: 'V***6f(m[LBX'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/search', {newerThan: 95.79}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('series/search', {newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('series/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('series/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('series/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('series/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('series/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('series/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('series/search', {sortDescending: 'yQ1)rx'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/search', {sortDescending: 8785533077553154}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/search', {sortDescending: 6345486562754559}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/search', {seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/search', {seriesAlbums: 'JPZVYC2[11z*lU^'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbums: -155882214129662}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbums: 5936177169301503}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/search', {seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/search', {seriesAlbumIDs: 'xQJR1Nw%[6qp]SBTy5q'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbumIDs: -3893281700184062}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbumIDs: 1127711254773759}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/search', {seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/search', {seriesState: 'KvPB1oo&'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/search', {seriesState: -7555566457061374}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/search', {seriesState: -7225965948174337}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/search', {seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/search', {seriesTracks: '(K8Uk7ec&pU@&F$c'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/search', {seriesTracks: 75629168951298}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/search', {seriesTracks: 1991070929911807}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/search', {seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/search', {seriesTrackIDs: 'qL@ptODY)$V2npg'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesTrackIDs: -2152946749931518}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesTrackIDs: 6279126738534399}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/search', {seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/search', {seriesInfo: '0tDYCH$3mjWiYcZ&(]p'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/search', {seriesInfo: 3612185007751170}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/search', {seriesInfo: 2766275050733567}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/search', {albumTracks: 'uoAqkpRAt'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/search', {albumTracks: -4042840887787518}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/search', {albumTracks: 2000012921798655}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/search', {albumTrackIDs: 'l]yVQfZjJfNvDQ@^#'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {albumTrackIDs: 3493999109210114}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {albumTrackIDs: 566656929628159}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/search', {albumState: ')xZ*0^'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/search', {albumState: -5043863144103934}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/search', {albumState: -8214514537332737}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('series/search', {albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('series/search', {albumTag: 'VfUcwPOYzyZnYiH@i'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('series/search', {albumTag: 4059528941273090}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('series/search', {albumTag: 2629989073682431}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/search', {albumInfo: 'lB8PmIh'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/search', {albumInfo: 2180916298383362}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/search', {albumInfo: 7433551922331647}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/search', {trackMedia: 'B$J6PeOI'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/search', {trackMedia: 939998207541250}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/search', {trackMedia: 2022280427208703}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/search', {trackTag: 'tIXXvXva@K$S'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/search', {trackTag: -4382128531832830}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/search', {trackTag: -1699615430672385}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/search', {trackRawTag: ')3lr^'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/search', {trackRawTag: -9003518811701246}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/search', {trackRawTag: -3982957245104129}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/search', {trackState: 'Is#SQrS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/search', {trackState: -1386425417203710}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/search', {trackState: 2505195825135615}, 400);
				});
			});
		});
		describe('series/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/state', {id: 'tzK46e'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('series/state', {id: ''}, 400);
				});
			});
		});
		describe('series/states', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/states', {ids: ['RFUOUzHt*sIh@', '(k*TdJ*J#Dg']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('series/states', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/states', {ids: [null, '']}, 400);
				});
			});
		});
		describe('series/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/list', {list: 'highest'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"list" set to "empty string"', async () => {
					await get('series/list', {list: ''}, 400);
				});
				it('"list" set to "invalid enum"', async () => {
					await get('series/list', {list: 'invalid'}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('series/list', {list: 'recent', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('series/list', {list: 'random', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('series/list', {list: 'random', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('series/list', {list: 'recent', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('series/list', {list: 'faved', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('series/list', {list: 'random', newerThan: 'r(jQW]$!'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/list', {list: 'avghighest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/list', {list: 'frequent', newerThan: 52.96}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'faved', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('series/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('series/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('series/list', {list: 'frequent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('series/list', {list: 'random', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', sortDescending: 'DkE79c&R1%dX2Ix5XFPT'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', sortDescending: -3568507983757310}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', sortDescending: 5214833892917247}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/list', {list: 'random', seriesAlbums: 'isHY14TPU'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', seriesAlbums: -6495488635305982}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/list', {list: 'random', seriesAlbums: -5056281882656769}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', seriesAlbumIDs: 'vY1De7ajYjWBMLC9TI@'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', seriesAlbumIDs: -3761153301807102}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', seriesAlbumIDs: 1661449105571839}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/list', {list: 'frequent', seriesState: 'ayu[^s3xVa7BQ@!yUx'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', seriesState: -657858047770622}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', seriesState: 5370755936157695}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'random', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/list', {list: 'frequent', seriesTracks: 'mpy)(JhbNtR*y'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', seriesTracks: -7329612518391806}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'random', seriesTracks: 4445777766121471}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'recent', seriesTrackIDs: '*o9V5@348(tQ3TJrzlH'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', seriesTrackIDs: -3318491306262526}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'avghighest', seriesTrackIDs: -3109735339393025}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/list', {list: 'faved', seriesInfo: '72GryhcG(*Gb*j6I'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', seriesInfo: 1330412047564802}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'avghighest', seriesInfo: -5082595914153985}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'random', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/list', {list: 'frequent', albumTracks: '&c%CsZ@9I'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', albumTracks: -177707132387326}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', albumTracks: 3459427562684415}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'highest', albumTrackIDs: 'VTFiMI!NXV]]5'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', albumTrackIDs: -4567456777502718}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', albumTrackIDs: 5002428575383551}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/list', {list: 'random', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/list', {list: 'faved', albumState: '&JiS2eh8MhOfO1D1'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', albumState: 172169321512962}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', albumState: 1157892132569087}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('series/list', {list: 'random', albumTag: 'Th6L2Xmj2IJUWW*I&*'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', albumTag: 1393058847391746}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', albumTag: 7729147015069695}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'random', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', albumInfo: ']WcS1U6l)(x%O'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', albumInfo: -1893372386082814}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', albumInfo: 5334807756144639}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', trackMedia: 'YKZ#deRcz'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', trackMedia: -5433078180741118}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', trackMedia: -3669649765957633}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/list', {list: 'frequent', trackTag: 'k(8FQV5'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', trackTag: 7400858664828930}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'avghighest', trackTag: 8724640855752703}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/list', {list: 'random', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', trackRawTag: '*p2#KubBj0lBHjqP'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', trackRawTag: -1005038432419838}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'avghighest', trackRawTag: -7354925877035009}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/list', {list: 'faved', trackState: 'uUuuv6v'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', trackState: 732550372786178}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', trackState: -997163001708545}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/list', {list: 'recent', offset: 'w448EXYgOlMB'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/list', {list: 'random', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/list', {list: 'highest', offset: 76.28}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'avghighest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/list', {list: 'highest', amount: 'yt[os#A6bVI^SjWgxP'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/list', {list: 'random', amount: 27.97}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/list', {list: 'random', amount: 0}, 400);
				});
			});
		});
		describe('series/index', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/index', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"name" set to "empty string"', async () => {
					await get('series/index', {name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/index', {rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('series/index', {rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('series/index', {rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('series/index', {albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('series/index', {albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('series/index', {albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('series/index', {albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('series/index', {albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('series/index', {albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('series/index', {newerThan: 'YMMhf0LPKHu3Lv'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/index', {newerThan: 49.95}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('series/index', {newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('series/index', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('series/index', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('series/index', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('series/index', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/index', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('series/index', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('series/index', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('series/index', {sortDescending: 'UEph*x7gq7Ojg'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/index', {sortDescending: -2285321358147582}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/index', {sortDescending: -521919644303361}, 400);
				});
			});
		});
		describe('series/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/tracks', {ids: ['xXu@gwx', '!31&6kib']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('series/tracks', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/tracks', {ids: [null, '']}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['vCKrxXZRk$18', 'WJgm4A)eqiTA$T3E'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/tracks', {ids: ['ZKt@5pXm7#s^(#pm[OK', 'ki*O$czF'], trackMedia: 'CxLEdyWd32^Qh'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['si5KjH8Hr)', 'OGYl!T]5dpkF6]0CU'], trackMedia: 2551231578898434}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['mNOoybC%HEKdG%ra', 'l1Ez^yIj0[^#84[(s4^O'], trackMedia: 7643031779934207}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['oihiJVLBWlu2r*', '(l0Ac9^2]'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/tracks', {ids: ['!^Nq@x!Q#h', 'TQ^Sy2MTpFP7LB'], trackTag: 'T66e]'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['knmnOX[sxiICZ', '#NEIgew6l'], trackTag: 7321337659916290}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['sj%OG', 'pVPQQ&('], trackTag: 626317808631807}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['CIycb', 'VbVizp6lve1k'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/tracks', {ids: ['2GHpBVwQ9L88', 'WlaRomC$bxtDxVn$1c^'], trackRawTag: '3LdavAse&za04)qE0J7a'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['kgsSp', '2puXqU'], trackRawTag: 4751112053719042}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['X[VCnLDh#eN3Z(djd', ']rUtjq2UPEQg'], trackRawTag: -5484041256042497}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['g&w@@O', 'WUMD6DEFAfaPoA'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/tracks', {ids: ['yxmCiFmDDfN', ')ndRUNPvL'], trackState: 'G^FzlacwhGLz'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['krvwcqiW)*', 'Lx!Q7ntCa$^i4hGGb'], trackState: 7150333058875394}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['Pa]fL[nvos', 'bpzc5z'], trackState: 7966729888071679}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/tracks', {ids: ['w5FN)jRCwso3', 'A5]8cEKs!cKp((fx#]'], offset: 'i&ZBgI'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['o1)c2Fn', '%RlQ#2@HqHFdBbXXBC'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['Vam@8A', 'hokoc1nAs1TUKsFAobo'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/tracks', {ids: ['NqFn&0y$7rwqcI5%s', '8^936P0!8'], offset: 84.66}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/tracks', {ids: ['LxyVhnYTRu#4LbK', ')lEdbjQem'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/tracks', {ids: ['[l)F%%%xZzhb1L4lqE8', 'K7OpWy]kz8&@@hX#h0'], amount: 'fv5m999Q!T'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['wf]VVtFdf#2@!z686', '#0(7jRerTXFz'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['RVDbM1ZDKtf&O', '%tfo4V$LM6(Mh^9Bz6qG'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/tracks', {ids: ['(h5F0FdxueiB4WzaWpoX', 'w#R44T'], amount: 26.93}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/tracks', {ids: ['kJJlU8h]yiOX', '(OKB@diB'], amount: 0}, 400);
				});
			});
		});
		describe('series/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/albums', {ids: ['R8PAkD1eB@bv%kY', 'yh@*(2)n']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('series/albums', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/albums', {ids: [null, '']}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/albums', {ids: ['mZPoX))yxSYWqXS', 'v$KJeWNh5FRamq)c'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/albums', {ids: ['Yg^mberw1VfeQ2', 'uMUQQk0&Axse'], seriesAlbums: 'vp(bwolY%O54'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['@4$I!y4HKZCHs8CvVP^', 'ZaaGu&0(ODafrEx'], seriesAlbums: 6205369378406402}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['Q9#BBL', 'Oa#&0vl((cfwcfoB'], seriesAlbums: 67892620034047}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['s^cHX&d^', '31C0WQTNWb'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['@Sut[rh1kiuTXDqVnZ', 'tduh#z'], seriesAlbumIDs: 'PKmgCvI]Zb4d#V]0w3'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['x9hJ*Jidcb$rvbYci$ET', 'YU$Nw'], seriesAlbumIDs: -762964659404798}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['$^kAum&YQQ#X8ggw8n', 'jrss6&a18O@boP7'], seriesAlbumIDs: 2425136661659647}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['F%zqb)9[JA)g', 'XMNwO'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/albums', {ids: ['nrHdZdiQ*zT', 'JQGtUBXtc'], seriesState: '5nI5CH0DO^'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['GTbQ]6EJZeaWA[u&jkyG', 'YUn]6&'], seriesState: 8244599030022146}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['W0L7mgB2TZ1t', 'vPBE6irdbGKKwJ!N1!gP'], seriesState: 7770787654139903}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['ov)k&', 'R1iv(bU#BX5#J!vELzWY'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/albums', {ids: ['CD[iots46[k0VRM', 'lc$VA(['], seriesTracks: 'HiN])s4'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['BKlU9X$B!76kl[o7g%mK', 'yCGj8l!H0sX(cX'], seriesTracks: -3219293256810494}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['Pz1U(rA^O', '98Jyedc(D%E'], seriesTracks: -8532462254686209}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['hC9p0cM9q7(]HB[8X]', 'C8s3vvZWGz'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['k0Fj5A6Kzf(rz', 'n@Y@O%D'], seriesTrackIDs: 'C1Aol66GuO'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['@r%hhM2A3pK', 'J*RHYOcO'], seriesTrackIDs: -3021870467121150}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['VDS65pM]RgwL9H(cvum', 'i*vD1^BR[]DyxSq2'], seriesTrackIDs: -6261860072423425}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['XqcDed', 'zOSZZsd3i$'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/albums', {ids: ['BB19nxo[XG&9QC', 'RktbNQw*9qz8sm'], seriesInfo: 'j53lGl#WMldpn'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['^Qx23oq(d%r)X%TA*', '4*KmKZbvxFihl3TdF'], seriesInfo: -473244494725118}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['nh5BTF41[H&q2', 'e@Sdrt)u3Xg)&P'], seriesInfo: -2387395823534081}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['a$2X7lOrLqzrRa', '88mAl1I*G&WC'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/albums', {ids: ['UvRLrcX%CAr727', 'dxGsS*R9'], albumTracks: 'PcYs8Jl2lB7'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['uqdI)', '[P@IVX4ivh*OM0a'], albumTracks: 7320630613508098}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['B5ZOEeumHcfZmWWGhQ', 'ANJc$zRs(LuhvoU'], albumTracks: -8079534238728193}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['wlbaV@j#&i5$A0', 'S^WVn'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['jQmWgh3vE!@vKHBH', 'KG3daudiad'], albumTrackIDs: '96cFQ!ORl'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['u9rOy0inF[@r6JEh', 'dERH1gdwqB'], albumTrackIDs: -7996062195253246}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['ObLVeQ', 'NSGyhEGI5o2UiU#69]'], albumTrackIDs: -2852622016970753}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['cqO6O', 'qvX]l'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/albums', {ids: ['pXl5P7BJk7kYmQ^@e', 'vNJkSx6G&JiH4U7%zD'], albumState: 'k4vsN#2)&g'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['gpW2il9v!ao', '0$1IXl4w)zBov'], albumState: 5010678423224322}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: [']oje3[wFJ', 'oAI3PTUfxKi7Wx%'], albumState: -8075400022327297}, 400);
				});
				it('"albumTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['1viJbtu7Hv', '&qZavK11Ehp*i4rA'], albumTag: ''}, 400);
				});
				it('"albumTag" set to "string"', async () => {
					await get('series/albums', {ids: ['$5r$^G5Qh', 'YwAEP'], albumTag: '%JAM@H9qUtIJsRWicq6'}, 400);
				});
				it('"albumTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['RsKA8*N^9xo&PZY9N8XY', '[!TQ3O^1*!H4*'], albumTag: 1151023917826050}, 400);
				});
				it('"albumTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['ZV]u2!9gkUJ%iVSrA', 'TSlyP)PIR1ixK7yVbYEq'], albumTag: 6868094823694335}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['wD#Py', 'N8tN))BZm$ReDG'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/albums', {ids: ['egO8jdmcbMGt', 'wh!n*k6*2V#Q]S'], albumInfo: 'w&36Tqi$jYUZxJ)v'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['dP^0RHalrj3j52pZ', '1YMVlTxR!XEDS)K6'], albumInfo: 1341710428798978}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['w[r!BOy7r', 'dsVEls5YdLh@iQ^Sl'], albumInfo: -6511393780006913}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/albums', {ids: ['rv*AOeGTdUT', 'Gs]Ztlx^8HTYV9uBI'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/albums', {ids: ['1*9!VJ*fMTa&X3Bu)', '$y2tpm6M)VVnzh'], trackMedia: '2O^la*9]'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['G(6dERWYr4LDWs2yd', 'VwLngP4tpAl'], trackMedia: 8883664872013826}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['VYlCWtsPriUs', '%PFMBD[Tp3V]jB7bYsgZ'], trackMedia: -6986042083115009}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['@TK^B', 'Y@^2l!pVioGo'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/albums', {ids: ['YA&9sJSH]', 'PJD$(J4fhixK'], trackTag: '@3xZYU'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['ghTVoI@tgwNLsg', '*wOR892F9T'], trackTag: -5115620832051198}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['6z^fk8$Bm%', 'kXbFopfm'], trackTag: -308236104237057}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['t&t]yV', '1$sQ$NbdEO]'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/albums', {ids: ['w%!i4gYF4l@j]%]6(s', 'ZOfnm#zRDm'], trackRawTag: 'T!UQvZ4z2U'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['Oj6$EoTgmz', 'ilUFUkV'], trackRawTag: -170067434143742}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['7K[4lfgxQPgb8kjE0TCQ', '$I535cI&]ONFZUG5'], trackRawTag: 7175069650386943}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['W[]!1VWMZ7QtB', 'vs^a[d(G7f]KkBDdR8'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/albums', {ids: ['qPVvd[6', 'Gv2Iq4&meTJAnD*bd'], trackState: '6iKi9yLrCF'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['X9aV4TrjjpoSB@e^[01', 'lP8v8jAB)'], trackState: -7959588154376190}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['TmTgtO', 'y@t)xz0bj'], trackState: 2716909451608063}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/albums', {ids: ['HbQQxT3mdU3zmA', 'lakM]Jb%IB%ubHCE'], offset: '7H$Pl6C]js!'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/albums', {ids: ['G(i5w*pDv4u', 'R&XzT'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/albums', {ids: ['[b(NLvXo(K0M', 'wyN]SI1'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/albums', {ids: ['R@(I1WsG36C&0Imjx', 'AgnEMMbEAD1tp4'], offset: 56.18}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/albums', {ids: ['0CAIVg9w', 'sY!ei]'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/albums', {ids: ['2Jo#$i', '!r#Yi^kG(z'], amount: 'xhD[Dn]XUdyPtz8'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/albums', {ids: ['u2*gheF^w', 'kZ@lFs6FuYnMmy'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/albums', {ids: ['%j^WGY$', '$k7Or0Tu(EW'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/albums', {ids: ['UYaw&tWa', ')$fhom0Nfi&g]Z'], amount: 37.49}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/albums', {ids: ['[3Sj6CV%v#5l', 'XeB(o)ELl)BHEcKW'], amount: 0}, 400);
				});
			});
		});
		describe('series/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/info', {id: 'Q%T[Mmihc&P5uUNy9s'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('series/info', {id: ''}, 400);
				});
			});
		});
		describe('playlist/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/id', {id: 'McmDq1(nsxu^'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/id', {id: ''}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/id', {id: 'IN1h%Ar', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/id', {id: '*TGVX6r', playlistTracks: 'e25r*Zdv@Y'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'WKZIDEj8&*&qJ', playlistTracks: -2958531284172798}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'pN$ht3U%', playlistTracks: 1468765661298687}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/id', {id: '%9JywSxU', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/id', {id: 'N#rExDUNdo#WR0', playlistTrackIDs: 'j4SLoIhl'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'iq*tque!jS70JPYX^q', playlistTrackIDs: 4412351818235906}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'msNAry(dFznX4b', playlistTrackIDs: -7759922443845633}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/id', {id: '2iYF39', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/id', {id: 'gFe@QMWPc', playlistState: 'oN@Uudv%Ui&0y#x'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '%VvnV%2Zyp', playlistState: 4294527074435074}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: ']CtS0P%@JDYZ83Koz#', playlistState: -4002655533793281}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/id', {id: 'V%iZtRCD76a#', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/id', {id: '@jdwo2H', trackMedia: 'Tno8DPx(3Q$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '3X!ofZ*YPUe[rW^(C', trackMedia: 576355909500930}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/id', {id: '(J@(nPp', trackMedia: 5740047714222079}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/id', {id: 'XmHr9MI!J2NTq@SID^', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/id', {id: 'KtghtAAxgc%NOLI', trackTag: 'w5JsQcEj!rtCJtzd'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '2XrPjT', trackTag: 6870530250506242}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'DJxU@4z2WBL#ug8', trackTag: 3288267524931583}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/id', {id: 'AE0$tk)C@sZt7@i', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/id', {id: '7kQVt(G0e8IWC7', trackRawTag: 'B7dvo^kc'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'wezt4adMu', trackRawTag: 8045933874905090}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'p0RI*(Vn4KV@JCe', trackRawTag: -2642007923097601}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/id', {id: 'i(4Qw', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/id', {id: '2rIUKTo1or*D!Im1#', trackState: 'BQE6c3J'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'QdN1tCni7U$zM]k]J', trackState: 2771008939360258}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: ']j!IDU', trackState: -2349869641498625}, 400);
				});
			});
		});
		describe('playlist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/ids', {ids: ['pu%6K8(DLRyvf', '6pf01z']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('playlist/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/ids', {ids: [null, '']}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['@N0JSn^', 'RuGgl65$QPWzAT%]0i#u'], playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/ids', {ids: ['C#8o&4JEgs@zk', '[6]b7n'], playlistTracks: '$cXrD2*(WD2YfC0'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['66O(XBg!@OsAhk', 'tRun73y#SzKwTDocCfR'], playlistTracks: 8513563396145154}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['26wJz0pwRt0UbV', 'XtRz7GkU$T6s'], playlistTracks: -4719003977121793}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['Jr5vc)Ndd8dW74]]sMjg', '5qcSlVw&nim4'], playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/ids', {ids: ['SA*5TP#vg', ']vkS@'], playlistTrackIDs: 'rH!0(dFG'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['4KSvGpcg', 'Q7kXwt[VjGZr&'], playlistTrackIDs: -7095810244214782}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['t8jfooSqqtF', 'ePPz*LuZG@A&Y'], playlistTrackIDs: 5641045006090239}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['X7ddoRfaJtEWq[SmQ#', 'n8gls4f'], playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['TKpK^hDKp^AVt^Z', 'w$jd6'], playlistState: 'TNXHc'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['Oz#zgkTf', 'w@jfR%'], playlistState: -7607651907141630}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['68urdHB[VtPK7I*b9%b', 'kJYUcQT'], playlistState: -1900962654453761}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/ids', {ids: [']iLgpaO%2PjP', 'rDs!RaqktRuzsVUW5'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/ids', {ids: ['Fd2A[wkCjW7uh![6%SE', '6w[ML'], trackMedia: 'j%&A*rtWziA[pi'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['gO^ll6KCm3&N&L', 'G[RijaoeOSDph)duq'], trackMedia: 3710696164425730}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['daCMlK', '%w@Od'], trackMedia: -482090122477569}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['xzlD6(K5', '%D#[QvIVYBe[FoS'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['QX%9M&7', 'elVJyG&C@aU'], trackTag: '$%KJ6UaAn$&2X'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['KIJZidQiI3!Kzr&@7', 'jpHTDS2^Y'], trackTag: -1901196591759358}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['89X]WQKEF)IVAMXLzjL', 'MUuLlxGQ0'], trackTag: 2885979912273919}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['4WNmJj', '3qLa)582%iY^$%vT]ijX'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['5][k73MgeeliwyR', '%FDWA3hYCT#8iIrz8ju$'], trackRawTag: 'Vqg$X]V'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['LW!zm#U522uyU8KVU[', 'xM#qsdSGm]AVu3rz'], trackRawTag: 7013077543288834}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['r8SgpXT', 'NrTj&KqY^@@vP*m@QCj#'], trackRawTag: 2286190086586367}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['NmYHGz%@ehf#X4Nhk(N!', 'oZuxg9pe3Ytb%eMOE'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['(ty849X[*r&Rht', 'vvU1M9S[HZ668l0Rz3@T'], trackState: 'z88tnAKNbqq5[7bmy'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['cCAD5dP', '%VT7I6Sw(wKG#re(cOR'], trackState: -8862411398316030}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['D(3Xj6yWx(7y%3ZPU!H', 'C7*D!Y%zs4a'], trackState: 1556731347861503}, 400);
				});
			});
		});
		describe('playlist/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('playlist/search', {offset: 'ho^Kt'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/search', {offset: 63.05}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/search', {amount: '7PQTnT7XZI1q'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/search', {amount: 78.77}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/search', {amount: 0}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('playlist/search', {name: ''}, 400);
				});
				it('"isPublic" set to "empty string"', async () => {
					await get('playlist/search', {isPublic: ''}, 400);
				});
				it('"isPublic" set to "string"', async () => {
					await get('playlist/search', {isPublic: 'FdiO(*qSNHv2o9e'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/search', {isPublic: -2081937338400766}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/search', {isPublic: -5527069152772097}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('playlist/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('playlist/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('playlist/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('playlist/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('playlist/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('playlist/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('playlist/search', {sortDescending: 'r%@)8Nbq@m'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/search', {sortDescending: 1920412342550530}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/search', {sortDescending: 8456573043081215}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/search', {playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/search', {playlistTracks: ']i1PL]51eL[qw'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTracks: -1844189293707262}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTracks: 720528801267711}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/search', {playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/search', {playlistTrackIDs: 'A@Z&PZ4e1BugysZhA'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTrackIDs: -8306777288343550}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTrackIDs: 4985521453400063}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/search', {playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/search', {playlistState: 'T*Px1'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistState: 8303180827852802}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistState: 2715028213989375}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/search', {trackMedia: '#n6IdSRas]Aarm!]'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/search', {trackMedia: 8417760459620354}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/search', {trackMedia: -631066738032641}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/search', {trackTag: ')P*ckKW@'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackTag: 5941799944192002}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackTag: 6972109834158079}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/search', {trackRawTag: 'vVI62T$[0EVYU%WZb#j'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackRawTag: -578013234200574}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackRawTag: 5611782768951295}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/search', {trackState: '1GKzjf'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/search', {trackState: -4956776608825342}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/search', {trackState: -7746644539867137}, 400);
				});
			});
		});
		describe('playlist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/state', {id: 'K48D8'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/state', {id: ''}, 400);
				});
			});
		});
		describe('playlist/states', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/states', {ids: ['WKry@!B2om2YmnmNE0w&', '^0%Tfn#V@vR&u']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('playlist/states', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/states', {ids: [null, '']}, 400);
				});
			});
		});
		describe('playlist/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/tracks', {ids: ['tY#yb4q%&hCxAD', 'vub)eXnmlxrzW']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('playlist/tracks', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: [null, '']}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['PPLILg9S$c^%%)', 'J7uh7'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['C][r&', '&n]Y81iGo'], trackMedia: 'UQcWdsr'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['ZapH^', 'ih&lsx(EewWYrou%Zf'], trackMedia: 7890853997576194}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['sB5yK3mlplXNuPVtY', 'qMcnj#(HH'], trackMedia: -3126270124621825}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['fTyvQlRu(6m6UBWWa1a', 'RoXIa!#JxP!8m]G@EZ'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['60W!Nko8H', '0cnF#ztm1]&0fZ'], trackTag: 'Q3x**^u1!'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['Tlc%]9g)dWJ4', '3iHMGFl4$kdTF'], trackTag: -7515402498211838}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['PMx2j[j]YkpKTR%)Bb', 'X^6z9LmS'], trackTag: -1186034167578625}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['GyQFwzkv&)&a', '8cYVQSyqg1fBVG'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['qBzxGQ)Ff', 'sXLMk'], trackRawTag: '!][j5'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['Vi)5^xu2dmq04F6tIc', 'P8t92Q'], trackRawTag: -2679762640175102}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['0oggM', ']E9@33Jb'], trackRawTag: 6261830745849855}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['%QGcto5', 'EqK]t!0'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['[oC)^pCGp9a@*@Ig', 'M458Ho$xqvP0gL'], trackState: '&^PAzGvjfZidMJ&5nn'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['XiQS@Qt%jI@])Jx&', 'Ixon@Q3yi'], trackState: 5763161722454018}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['eUIwOj^$T', '5%P5P#rX'], trackState: -7595751760723969}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['NK)^E', 'R0KVHEnJ8V'], offset: 'sZz9Zq^dx&xHaXTQMNX&'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['bAda]uaI', 'K%&G&u5q2z'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['@DTx0bA5', 'vFq^IJngy&2tAW'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['*kn0lrAu&TIhJp^', 'P&ngHUdN'], offset: 40.07}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/tracks', {ids: ['az!#vi0cjOL&', 'c6!WOS^QDk'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['hj9@k(zfdWQm81', 'hcEvqYzz'], amount: 'ORJxe9hvSaT$DEm1DZ'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['7$xEPa', 'lbblxcASOrLCJQlX#2z'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['%aaFZUa@dS', 'ruc^Rtu'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['vg06FE', '7%Im1'], amount: 30.33}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/tracks', {ids: ['9]lDndl]W5orCW', 'CSLVr0Zz#7hW!a0SM'], amount: 0}, 400);
				});
			});
		});
		describe('playlist/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/list', {list: 'highest'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"list" set to "empty string"', async () => {
					await get('playlist/list', {list: ''}, 400);
				});
				it('"list" set to "invalid enum"', async () => {
					await get('playlist/list', {list: 'invalid'}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('playlist/list', {list: 'faved', offset: 'jTWL4f'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/list', {list: 'faved', offset: 9.95}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/list', {list: 'random', amount: '9ygeB6F&mutl'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/list', {list: 'faved', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/list', {list: 'random', amount: 4.56}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/list', {list: 'faved', amount: 0}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/list', {list: 'faved', playlistTracks: '2dpDblrBmjK8CsfesL'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'faved', playlistTracks: -5541208013144062}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistTracks: -8509606389088257}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', playlistTrackIDs: 'ygDLUZJXM8n&JaOow'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'faved', playlistTrackIDs: -5950670414807038}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'random', playlistTrackIDs: -4355436832620545}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', playlistState: '%]FBg1BggIUL2'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'faved', playlistState: 3455963906441218}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', playlistState: 8540808382775295}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', trackMedia: 'oA#n9(zLCD&15jajd'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'recent', trackMedia: 533084457926658}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', trackMedia: 4032175401861119}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', trackTag: 'pz&b#'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'highest', trackTag: -3765281256112126}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'faved', trackTag: 4908210234327039}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'faved', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', trackRawTag: 'PjvKx7iGqOAZz0a#E8'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', trackRawTag: -795826892832766}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', trackRawTag: -1686943922388993}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/list', {list: 'recent', trackState: 'LVia)hzccia1Gtd'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'highest', trackState: 4261274154172418}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', trackState: -6072804084547585}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', name: ''}, 400);
				});
				it('"isPublic" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', isPublic: ''}, 400);
				});
				it('"isPublic" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', isPublic: 'TkxA9d'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'avghighest', isPublic: -6486998512566270}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', isPublic: 357907199688703}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('playlist/list', {list: 'faved', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('playlist/list', {list: 'recent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('playlist/list', {list: 'recent', sortDescending: '#Ca!1&'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'highest', sortDescending: 3081865695068162}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', sortDescending: -8171539946012673}, 400);
				});
			});
		});
		describe('user/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/id', {id: 'oe27]A*5(o5jfS2Xqd)'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/id', {id: 'oe27]A*5(o5jfS2Xqd)'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('user/id', {id: ''}, 400);
				});
			});
		});
		describe('user/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/ids', {ids: ['0*Zfy9J1J@D', 'x3CGh&FT4#']}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/ids', {ids: ['0*Zfy9J1J@D', 'x3CGh&FT4#']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('user/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('user/ids', {ids: [null, '']}, 400);
				});
			});
		});
		describe('user/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/search', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('user/search', {offset: 'Kya8W^*kGEHRtitcNn@V'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('user/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('user/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('user/search', {offset: 80.64}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('user/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('user/search', {amount: 'uYL6T#o2mVCvFK]k'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('user/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('user/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('user/search', {amount: 72.22}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('user/search', {amount: 0}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('user/search', {name: ''}, 400);
				});
				it('"isAdmin" set to "empty string"', async () => {
					await get('user/search', {isAdmin: ''}, 400);
				});
				it('"isAdmin" set to "string"', async () => {
					await get('user/search', {isAdmin: 'p(8M&t3nld'}, 400);
				});
				it('"isAdmin" set to "integer > 1"', async () => {
					await get('user/search', {isAdmin: -6561347605102590}, 400);
				});
				it('"isAdmin" set to "integer < 0"', async () => {
					await get('user/search', {isAdmin: 6201134368686079}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('user/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('user/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('user/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('user/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('user/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('user/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('user/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('user/search', {sortDescending: 'H4Y037isibrA@%5'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('user/search', {sortDescending: -8308798187896830}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('user/search', {sortDescending: 2584668318728191}, 400);
				});
			});
		});
		describe('user/sessions/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/sessions/list', {}, 401);
				});
			});
		});
		describe('playqueue/get', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playqueue/get', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"playQueueTracks" set to "empty string"', async () => {
					await get('playqueue/get', {playQueueTracks: ''}, 400);
				});
				it('"playQueueTracks" set to "string"', async () => {
					await get('playqueue/get', {playQueueTracks: 'Y$%2B1laft&)Hkgs5]sJ'}, 400);
				});
				it('"playQueueTracks" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTracks: 425029552570370}, 400);
				});
				it('"playQueueTracks" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTracks: 4483610316898303}, 400);
				});
				it('"playQueueTrackIDs" set to "empty string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: ''}, 400);
				});
				it('"playQueueTrackIDs" set to "string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: 'Qt#B)4s#$'}, 400);
				});
				it('"playQueueTrackIDs" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: -2588309415002110}, 400);
				});
				it('"playQueueTrackIDs" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: -8105810173362177}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playqueue/get', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playqueue/get', {trackMedia: 'LqPuKUlgm7K4TOo&2pG'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackMedia: 686099303235586}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackMedia: -4279989323169793}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playqueue/get', {trackTag: '$HF$$8'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackTag: 557520129097730}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackTag: 5573874951389183}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playqueue/get', {trackRawTag: '8A5CmdFC'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackRawTag: 4972605543022594}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackRawTag: -6149901742243841}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playqueue/get', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playqueue/get', {trackState: 'A@I(cd!5('}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackState: -23221843787774}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackState: 8517027492790271}, 400);
				});
			});
		});
		describe('bookmark/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/id', {id: '4)aZ6o%*RpdqB%v5N'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('bookmark/id', {id: ''}, 400);
				});
				it('"bookmarkTrack" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'lUyeGNPqG)b%0Jn', bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/id', {id: 'kvF5qn%nX*T3', bookmarkTrack: 'R[$NbQCnS5BWu1L4DK#1'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '*yVTxGl8T73Q1cJX', bookmarkTrack: 3084376384471042}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: '#uheOtjIDg', bookmarkTrack: 5455089644863487}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/id', {id: ')tuI]33', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/id', {id: 'l6EYLmjV4xbj', trackMedia: 'xeRc6gB%kZAD&#s'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'M*WB&TxZUZ', trackMedia: 4116830083874818}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'drnn3u*DXZ8&V1yfU#', trackMedia: -6507748292296705}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'E5BEkg[lId[3zLYF', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/id', {id: 'SKCtc7Cikrxf%', trackTag: '5J)ds'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'q2ca7(2BJ2)dLizyq$', trackTag: 8711868684173314}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: '4qkK2N]w8jV^G(Z@76g', trackTag: -2190468439867393}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'zPx@s0xB', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/id', {id: 'NLHGqa(Pvwgsx@c', trackRawTag: '9^%iRfG*jEioj34a5o'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '9KM3^)rV9SEgEt]qX', trackRawTag: -8403760325853182}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'ZCrJy', trackRawTag: 7690934997221375}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/id', {id: '(DV!FrE7bmjZ)A', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/id', {id: '1tAwbff8L', trackState: 'LZ$Jq*B*]!mfqT^lDl^6'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '^QT&z99$TCfj$', trackState: 7737451317559298}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'buQD)zu36Mu', trackState: 155888610443263}, 400);
				});
			});
		});
		describe('bookmark/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/ids', {ids: ['#UrDyYtwjCTHiWVV9tJ$', 'Y1lX#qGi*7)W9Iskot']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('bookmark/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: [null, '']}, 400);
				});
				it('"bookmarkTrack" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['dxrI$R%&', '^A*(Fiux@uL3r#S7744'], bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['(IS8zN*KtOR', 'L]JW$v)&AZVUZkSw[b'], bookmarkTrack: 'J3w]TZ2F'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['wd^Of]', 'BzNM]!ISpAWX%QqH'], bookmarkTrack: 3750024332705794}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: [']6@8M@W$en#kPvs', 'plIwMNZD9#zKXuGFu'], bookmarkTrack: -3781900040667137}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['kuGjD6BpiRmK', '!NYBD3H[P(SoVrQR1U'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['@rbQw@B9c', 'LRTrMqW%nT^1V9vAhl'], trackMedia: '6G#%etvqp!w2'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['IWUno!%*svWG', 'ehUb$6#^eqH$gGax'], trackMedia: 7356902614761474}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['2eM9nBdUb![V$XkD&t6', 'Iv%bzAI7^Db2B6'], trackMedia: -7162385462722561}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['8*T7IVQacBv2v[Ff9', '7&zlnhP1W0M'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['u%W^Ncj!%3^9(R', 'vugt)&qFXA4e@('], trackTag: '(Bj(Kx!#8Wq5Ms['}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['qQaoxh2Irf', '!u76OLpoE#RV1oSAT'], trackTag: -7851463501938686}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['2V1ia', 'B5!MnqnqtiWhQb(BvHH'], trackTag: -3121354769432577}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['^pwj58fm*o(@p', 'p56kC*HH&'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['P^t1UOJ', 'iZ4Z!oNqTcQi1k$%ji(G'], trackRawTag: 'Xvlh4WSNEdN^Gi$5^'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['9mU0AjL5ikm&', '1N5octq!GXHApE'], trackRawTag: -8251851795333118}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['*Oo2wJXcf(HCk4An]lLF', '^VwM2$kG2'], trackRawTag: 2166569849323519}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['eg!hAK', '3l3nrNGZ)x'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['pCJA*i%HGU3', 'j#^92zQ$B5@^^]F'], trackState: 'P)OnbLkt'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['CkRNCq*UP)*d', '(YM]I%'], trackState: -4973327969943550}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['HWX$C01ixWElKBRF)n58', '9%N0KTy70gG7nC'], trackState: -4594404270538753}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['XCjd*4]EUoyRBo0Qkml', 'EkieFb&d@'], offset: 'SvD@zos'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['9&kw#FRjkO%rEit[G@R', 'uF8zO@yoVIZ@7n'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['@5akR1mNKivS0@^I*', '6TG16'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['7(*dBeG5AVVWq[gPO*v', 'W@eFMUSS@Xgr2bHww'], offset: 62.03}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/ids', {ids: ['bO]pLPH$(U', '$xKV5btJd'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['setHme)0H', 'Z*9JS'], amount: 'HU^iyQbt#I'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['elIV4Vj5%1&', '&Pt!4nO%u)q0'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['%*(LoE^QJ%@qjLkcHgX', 'A9&KdxACV'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['A*8f4*yfs#n', 'euqZu2&Ll*'], amount: 96.45}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/ids', {ids: ['4LE3!pik[a', 'vHUvvK4qe*nLwb@t'], amount: 0}, 400);
				});
			});
		});
		describe('bookmark/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/list', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"bookmarkTrack" set to "empty string"', async () => {
					await get('bookmark/list', {bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/list', {bookmarkTrack: 'I8UIL'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/list', {bookmarkTrack: 237712669933570}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/list', {bookmarkTrack: -4018483125813249}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/list', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/list', {trackMedia: '2W(4G&4U9yCpXn@)bbz#'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackMedia: 79131886747650}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackMedia: 911385252855807}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/list', {trackTag: 'XjYTOeFXeq1*&EiDxz'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackTag: -7966909504946174}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackTag: 1996232192950271}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/list', {trackRawTag: '7PmK[FP)MUQaRc'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackRawTag: -8767712620707838}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackRawTag: -1785525488844801}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/list', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/list', {trackState: '7)#v[w('}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackState: -1317180566142974}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackState: 6365860075667455}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/list', {offset: 'CGqAChL[aqg)8'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/list', {offset: 91.1}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/list', {amount: 'cwELmbkNioM(jp'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/list', {amount: 18.42}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/list', {amount: 0}, 400);
				});
			});
		});
		describe('bookmark/byTrack/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/byTrack/list', {trackID: '#0jt('}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"trackID" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: ''}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'Aj(83IsQw8RK2', offset: 'dd[(YAKM!0PCK'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'H8wjhRHyr', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'bII)V0c2H@03o', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'A1&4O$S21', offset: 40.67}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/byTrack/list', {trackID: '45Rq7', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: ')r*v$fx8A%NO2w$[7S', amount: '[BWX^(e%t'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'j20S8e', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'Ihl)x3pV', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'Y8F%F7CdZT5*dZKB', amount: 50.12}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/byTrack/list', {trackID: '1r^he%H&Ojiy#2', amount: 0}, 400);
				});
			});
		});
		describe('root/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/id', {id: '5z2X7A9Y'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('root/id', {id: ''}, 400);
				});
			});
		});
		describe('root/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/ids', {ids: ['fQARWWamgn5yUa', 'ooj6%)nFr36AA)qa']}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('root/ids', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('root/ids', {ids: [null, '']}, 400);
				});
			});
		});
		describe('root/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/search', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"offset" set to "string"', async () => {
					await get('root/search', {offset: '4YEd3jY'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('root/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('root/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('root/search', {offset: 49.54}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('root/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('root/search', {amount: 'C&%^)Wr2'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('root/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('root/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('root/search', {amount: 91.46}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('root/search', {amount: 0}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('root/search', {sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('root/search', {sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('root/search', {id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('root/search', {ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('root/search', {ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('root/search', {query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('root/search', {sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('root/search', {sortDescending: 'Ut[C]YrTUU%l1bg*o&]Z'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('root/search', {sortDescending: 8269506543616002}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('root/search', {sortDescending: -4912588055904257}, 400);
				});
			});
		});
		describe('root/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/status', {id: 'Q]%FawoIj'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('root/status', {id: ''}, 400);
				});
			});
		});
		describe('admin/settings', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('admin/settings', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('admin/settings', {}, 401);
				});
			});
		});
		describe('admin/queue/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('admin/queue/id', {id: '#t]Pqi4J&j]8DV'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('admin/queue/id', {id: '#t]Pqi4J&j]8DV'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('admin/queue/id', {id: ''}, 400);
				});
			});
		});
		describe('folder/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/download', {id: 'K%obIuNF9SLB@x1V[B8'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('folder/download', {id: 'K%obIuNF9SLB@x1V[B8'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/download', {id: 'r^vh*(a1i3RDVL6', format: 'invalid'}, 400);
				});
			});
		});
		describe('folder/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/image', {id: 'vTF9%^#'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/image', {id: 'm*sn7B7TCC', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/image', {id: '!(56R]sL^7y7RJ0]rS', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/image', {id: '*nLAWy', size: '3n5NHGnS%CgeZm'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/image', {id: 'Nf&uKS6gaCu', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/image', {id: 'bbbLOZc', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/image', {id: '!#TDuZGIv9HH)%', size: 785.82}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/image', {id: 'o8&ISc', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/image', {id: 'JVYmog*lsl9BCpn', size: 1025}, 400);
				});
			});
		});
		describe('folder/artwork/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artwork/image', {id: 'a44pkM%[5K3e9Ok3Kd$'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: 't$4xt2gX8BvK7yt', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/artwork/image', {id: 'i)5J!T1ChVrl', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/artwork/image', {id: '3iitF7iBsB6', size: '4XptfNO'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: 'w!$$^', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/artwork/image', {id: 'tivV]@$(bl', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/artwork/image', {id: '&3P[o', size: 653.72}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/artwork/image', {id: '[GFMx', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/artwork/image', {id: 'lucnol', size: 1025}, 400);
				});
			});
		});
		describe('track/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/stream', {id: 'Z%azsXPPKAch^8CV'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/stream', {id: 'Z%azsXPPKAch^8CV'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('track/stream', {id: 'JlufqSiUl)mFMJFt', maxBitRate: '5!kx8s5UWgEOQb'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('track/stream', {id: 'NT%L(D73Nj', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('track/stream', {id: 'vv)Zoc*Lj', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('track/stream', {id: 'Eb[2KSvbkoeg&', maxBitRate: 77.39}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('track/stream', {id: 'TSdCHlo', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/stream', {id: 'u2YYXWqn', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/download', {id: 'Z2smU(Y5rO29oE#K'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/download', {id: 'Z2smU(Y5rO29oE#K'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/download', {id: 'd()1mz', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/image', {id: 'pSVWcjA'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('track/image', {id: 'iApGI4$vRu8D814$Z', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/image', {id: 'BRDGJS(4])x)r', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('track/image', {id: '1BXAMD]', size: 'eTe)I)j(X$lJgU'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('track/image', {id: 'Nsw21UPw1nXUBCwi^^1D', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('track/image', {id: 'al$W9g$ahI(y!', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('track/image', {id: '*^ku[c', size: 277.69}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('track/image', {id: 'QUdU8%3q$Z0$]hGp', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('track/image', {id: '2(ssKpTHGN8B1PvPV', size: 1025}, 400);
				});
			});
		});
		describe('episode/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/stream', {id: 'k6k5QSOCs#TviA70jpV'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/stream', {id: 'k6k5QSOCs#TviA70jpV'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('episode/stream', {id: 'wczGuA37BSDe9*', maxBitRate: 'HK8tC1vB'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('episode/stream', {id: '%JhIIc3AX', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('episode/stream', {id: 'm8IN2fe8Yy', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('episode/stream', {id: '!H[]IEhXDt!I', maxBitRate: 64.43}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('episode/stream', {id: 'k9mdH#L7U^8f7kt', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/stream', {id: 'dYE2#dqGr0', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/download', {id: '4FkCTf'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/download', {id: '4FkCTf'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/download', {id: '8*4WMNpON%', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/image', {id: ']3d*dtT(Asy7ab0)'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('episode/image', {id: 'lJo8)dg', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/image', {id: '1iWaK]nPIyD*X9xW', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('episode/image', {id: 'Olt^MC]', size: 'v&B)5'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('episode/image', {id: 't2kYge1^%n', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('episode/image', {id: 'WFX6zYzXHv6RIab@k', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('episode/image', {id: '6LHl8Z5bSTcGOB', size: 90.85}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('episode/image', {id: 'rMJ&3', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('episode/image', {id: 'O&3$)T$fLcl01$$&v)X', size: 1025}, 400);
				});
			});
		});
		describe('podcast/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/image', {id: 'JMFg3obPR7aaM&O'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('podcast/image', {id: 'mj7gmtM2mbkisCERL', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/image', {id: 'yN&#8%AU8sj', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('podcast/image', {id: 'DMmjp)AQVXth', size: 'Jcj5LjfOp!$eZ74)7($]'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('podcast/image', {id: 'eFkdBtEC4S(', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('podcast/image', {id: 'uNrUPam&i', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('podcast/image', {id: 'DRrFvs]40Xoa', size: 767.35}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('podcast/image', {id: 'H#rGemsDm3p#bqTZ4@', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('podcast/image', {id: 'vMS(i*yuA*B0g', size: 1025}, 400);
				});
			});
		});
		describe('podcast/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/download', {id: 'DV6IhCRc)88p'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/download', {id: 'DV6IhCRc)88p'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/download', {id: 'V^I)e]P!Ys2', format: 'invalid'}, 400);
				});
			});
		});
		describe('artist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/image', {id: 'k7]E[W54Zen'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('artist/image', {id: 'vNBLv*(ml[Ng4', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/image', {id: 'oDGs6h2L', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('artist/image', {id: 'SC]mI(AKMOWgiScdu', size: '1$YR*)G)NL5hROl1NH'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('artist/image', {id: '^Z4R6fg3qs(m%', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('artist/image', {id: 'J0AZ8agO@t@', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('artist/image', {id: 'dorpY^bTD', size: 286.22}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('artist/image', {id: '6V*J*24sdyj$8CXzP(s', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('artist/image', {id: 'AtYD]OqVshPQMup', size: 1025}, 400);
				});
			});
		});
		describe('artist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/download', {id: 'q([oDfQS@oe@P2Ngg'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('artist/download', {id: 'q([oDfQS@oe@P2Ngg'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/download', {id: ')nF9y4X', format: 'invalid'}, 400);
				});
			});
		});
		describe('album/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/image', {id: '61q3lcu5'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('album/image', {id: 'lctgkGE', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/image', {id: 'k0i70M8Pq', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('album/image', {id: 'aHDKgDABgI5', size: '5ly[Q5)y'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('album/image', {id: 'op%Fm*Nc0)atbTPde', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('album/image', {id: 'OM@YC^(d][a6dgr0', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('album/image', {id: '76#8q55Xs', size: 365.73}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('album/image', {id: 'AeWesjY)N', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('album/image', {id: 'TEvf$Q#sI7LOyKgtdlpK', size: 1025}, 400);
				});
			});
		});
		describe('album/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/download', {id: ']07!jc][w'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('album/download', {id: ']07!jc][w'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/download', {id: 'FbMfskU%jf', format: 'invalid'}, 400);
				});
			});
		});
		describe('playlist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/image', {id: '@PsnXrR'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('playlist/image', {id: 'g[UOe5Jt50jZ@m1^l', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/image', {id: 'fyYI)1J^L]JHRJk2', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('playlist/image', {id: '!H6&QQF6Zp', size: 'efx4Q$[OZkif7h'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('playlist/image', {id: '5k9pWt', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('playlist/image', {id: '6$axcss^%lk', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('playlist/image', {id: '8Rp3Vv', size: 450.79}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('playlist/image', {id: 'IhTh[O9xH', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('playlist/image', {id: 'XvcwNPHa', size: 1025}, 400);
				});
			});
		});
		describe('playlist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/download', {id: 'RB7(ecqx'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('playlist/download', {id: 'RB7(ecqx'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/download', {id: 's@zhbBBb#63yIkdD8)Gw', format: 'invalid'}, 400);
				});
			});
		});
		describe('user/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/image', {id: '0S$@$*VDKouUZbZNJ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('user/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('user/image', {id: 'm$mdl)EG]C%LI1J', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('user/image', {id: '[j]k5cNg)[REk', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('user/image', {id: '4R1OQU@kbn$wEaFZH4s', size: 'C8biaL'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('user/image', {id: 'Zcl%[h', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('user/image', {id: '%BlK6eGZpZGKS', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('user/image', {id: 'A^qmBkEc', size: 523.72}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('user/image', {id: '@R5dZWQl', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('user/image', {id: 'IZuN2iCeTGQg*b&w@', size: 1025}, 400);
				});
			});
		});
		describe('root/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/image', {id: 'R80Z#gejb^ePBAkl27$b'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('root/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('root/image', {id: 'bv)$tXnZY(Yl4MC1#R', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('root/image', {id: 'uN4RHFr![XXb(pHp&1lm', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('root/image', {id: 'KHI7IWMEyDv31I3k^N', size: '^WnbRH6islKEQ2'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('root/image', {id: 'HJ&tM', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('root/image', {id: 'U0$0p!bc*f9^', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('root/image', {id: 'dUwcjNT0PVj', size: 209.31}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('root/image', {id: 'HH)cGNf0(rq*', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('root/image', {id: 'oh%7uR4]', size: 1025}, 400);
				});
			});
		});
		describe('image/{id}-{size}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/G%24%5DXYcl-592.tiff', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/a*1FPSMqQXfE%258(%23Y-943.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/YN4lzg%5B%5DBOaG%25%5D-175.invalid', {}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('image/aKjtfM1Kl%5Bs%25Mz-XXul7i00cNe33X(VAfA.jpg', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/*O2%5BiL-.jpg', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/*Leug-true.jpeg', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/R)H(BPa9xR2T%24M-393.96.png', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/mot8M-15.jpg', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/e2oDueQhml8lP%5Dcawn-1025.tiff', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-745.tiff', {}, 400);
				});
			});
		});
		describe('image/{id}-{size}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/%5E%5E%249it-679', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"size" set to "string"', async () => {
					await get('image/o)pMA9FJF%246!P9B!h-N%23n%25jXgW', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/3bt7Zw5Td(P62YDp%26-', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/XZWv4EDa5mchHQ%25-true', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/P%25RNG-575.49', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/7pY2%5BIs%5D%23-15', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/0*0N5ZKs%25IBMm-1025', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-591', {}, 400);
				});
			});
		});
		describe('image/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/QB%5D)uH.jpg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/0LhzXx)!%5Ep68jc.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/X%25dI9h%26F.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/.png', {}, 400);
				});
			});
		});
		describe('image/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/EzMMMPh3', {}, 401);
				});
			});
		});
		describe('stream/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/eqt4V8VmeW%25XG.webm', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/eqt4V8VmeW%25XG.webm', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('stream/PW1XtnI5%24pnQ%5BPH%5E.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('stream/.flac', {}, 400);
				});
			});
		});
		describe('stream/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/TEjAof%24W2IQ%5B%24o%5E', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/TEjAof%24W2IQ%5B%24o%5E', {}, 401);
				});
			});
		});
		describe('waveform/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform/Gd%40Y1%5ETLfPF.json', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform/Gd%40Y1%5ETLfPF.json', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('waveform/ZiOgLzbuNnd%23lYN%5B.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform/.dat', {}, 400);
				});
			});
		});
		describe('waveform_svg/{id}-{width}.svg', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform_svg/BYj5g-5791.svg', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform_svg/BYj5g-5791.svg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"width" set to "string"', async () => {
					await get('waveform_svg/%5DZjmG-W%5E%5DlF%26ysq2!68s%5DFY.svg', {}, 400);
				});
				it('"width" set to "empty string"', async () => {
					await get('waveform_svg/q53Xpv0!Zl-.svg', {}, 400);
				});
				it('"width" set to "boolean"', async () => {
					await get('waveform_svg/Mjgq(X9bxmf-true.svg', {}, 400);
				});
				it('"width" set to "float"', async () => {
					await get('waveform_svg/*I(*o9hkckPKKB!-428.32.svg', {}, 400);
				});
				it('"width" set to "less than minimum 1"', async () => {
					await get('waveform_svg/As%23Ld-0.svg', {}, 400);
				});
				it('"width" set to "more than minimum 6000"', async () => {
					await get('waveform_svg/4Y%24%5D%25Zq-6001.svg', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform_svg/-5489.svg', {}, 400);
				});
			});
		});
		describe('download/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/ifrMCgxt9', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/ifrMCgxt9', {}, 401);
				});
			});
		});
		describe('download/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/%24UjjT%5B.zip', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/%24UjjT%5B.zip', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('download/7MdFKaTRg%5EYzLg4H%232.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('download/.zip', {}, 400);
				});
			});
		});
		describe('logout', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('logout', {}, {}, 401);
				});
			});
		});
		describe('bookmark/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('bookmark/create', {}, {}, 401);
				});
			});
		});
		describe('bookmark/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('bookmark/delete', {}, {}, 401);
				});
			});
		});
		describe('bookmark/byTrack/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('bookmark/byTrack/delete', {}, {}, 401);
				});
			});
		});
		describe('chat/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('chat/create', {}, {}, 401);
				});
			});
		});
		describe('chat/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('chat/delete', {}, {}, 401);
				});
			});
		});
		describe('radio/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('radio/create', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('radio/create', {}, {}, 401);
				});
			});
		});
		describe('radio/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('radio/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('radio/update', {}, {}, 401);
				});
			});
		});
		describe('radio/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('radio/delete', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('radio/delete', {}, {}, 401);
				});
			});
		});
		describe('track/fav/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('track/fav/update', {}, {}, 401);
				});
			});
		});
		describe('track/rate/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('track/rate/update', {}, {}, 401);
				});
			});
		});
		describe('track/rawTag/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('track/rawTag/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('track/rawTag/update', {}, {}, 401);
				});
			});
		});
		describe('track/name/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('track/name/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('track/name/update', {}, {}, 401);
				});
			});
		});
		describe('track/parent/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('track/parent/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('track/parent/update', {}, {}, 401);
				});
			});
		});
		describe('track/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('track/delete', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('track/delete', {}, {}, 401);
				});
			});
		});
		describe('track/fix', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('track/fix', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('track/fix', {}, {}, 401);
				});
			});
		});
		describe('folder/artwork/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/artwork/create', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('folder/artwork/create', {}, {}, 401);
				});
			});
		});
		describe('folder/artwork/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/artwork/delete', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('folder/artwork/delete', {}, {}, 401);
				});
			});
		});
		describe('folder/artwork/name/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/artwork/name/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('folder/artwork/name/update', {}, {}, 401);
				});
			});
		});
		describe('folder/artworkUpload/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/artworkUpload/create', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('folder/artworkUpload/create', {}, {}, 401);
				});
			});
		});
		describe('folder/artworkUpload/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/artworkUpload/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('folder/artworkUpload/update', {}, {}, 401);
				});
			});
		});
		describe('folder/name/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/name/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('folder/name/update', {}, {}, 401);
				});
			});
		});
		describe('folder/fav/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/fav/update', {}, {}, 401);
				});
			});
		});
		describe('folder/rate/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/rate/update', {}, {}, 401);
				});
			});
		});
		describe('folder/parent/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/parent/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('folder/parent/update', {}, {}, 401);
				});
			});
		});
		describe('folder/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/delete', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('folder/delete', {}, {}, 401);
				});
			});
		});
		describe('folder/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('folder/create', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('folder/create', {}, {}, 401);
				});
			});
		});
		describe('album/fav/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('album/fav/update', {}, {}, 401);
				});
			});
		});
		describe('album/rate/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('album/rate/update', {}, {}, 401);
				});
			});
		});
		describe('artist/fav/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('artist/fav/update', {}, {}, 401);
				});
			});
		});
		describe('artist/rate/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('artist/rate/update', {}, {}, 401);
				});
			});
		});
		describe('series/fav/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('series/fav/update', {}, {}, 401);
				});
			});
		});
		describe('series/rate/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('series/rate/update', {}, {}, 401);
				});
			});
		});
		describe('episode/fav/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('episode/fav/update', {}, {}, 401);
				});
			});
		});
		describe('episode/rate/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('episode/rate/update', {}, {}, 401);
				});
			});
		});
		describe('podcast/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('podcast/create', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('podcast/create', {}, {}, 401);
				});
			});
		});
		describe('podcast/fav/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('podcast/fav/update', {}, {}, 401);
				});
			});
		});
		describe('podcast/rate/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('podcast/rate/update', {}, {}, 401);
				});
			});
		});
		describe('podcast/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('podcast/delete', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('podcast/delete', {}, {}, 401);
				});
			});
		});
		describe('playlist/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('playlist/create', {}, {}, 401);
				});
			});
		});
		describe('playlist/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('playlist/update', {}, {}, 401);
				});
			});
		});
		describe('playlist/fav/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('playlist/fav/update', {}, {}, 401);
				});
			});
		});
		describe('playlist/rate/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('playlist/rate/update', {}, {}, 401);
				});
			});
		});
		describe('playlist/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('playlist/delete', {}, {}, 401);
				});
			});
		});
		describe('playqueue/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('playqueue/update', {}, {}, 401);
				});
			});
		});
		describe('playqueue/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('playqueue/delete', {}, {}, 401);
				});
			});
		});
		describe('user/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/create', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('user/create', {}, {}, 401);
				});
			});
		});
		describe('user/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('user/update', {}, {}, 401);
				});
			});
		});
		describe('user/password/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/password/update', {}, {}, 401);
				});
			});
		});
		describe('user/email/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/email/update', {}, {}, 401);
				});
			});
		});
		describe('user/image/random', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/image/random', {}, {}, 401);
				});
			});
		});
		describe('user/imageUpload/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/imageUpload/update', {}, {}, 401);
				});
			});
		});
		describe('user/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/delete', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('user/delete', {}, {}, 401);
				});
			});
		});
		describe('user/sessions/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/sessions/delete', {}, {}, 401);
				});
			});
		});
		describe('user/sessions/subsonic/view', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/sessions/subsonic/view', {}, {}, 401);
				});
			});
		});
		describe('user/sessions/subsonic/generate', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('user/sessions/subsonic/generate', {}, {}, 401);
				});
			});
		});
		describe('root/create', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('root/create', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('root/create', {}, {}, 401);
				});
			});
		});
		describe('root/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('root/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('root/update', {}, {}, 401);
				});
			});
		});
		describe('root/delete', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('root/delete', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('root/delete', {}, {}, 401);
				});
			});
		});
		describe('root/refresh', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('root/refresh', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('root/refresh', {}, {}, 401);
				});
			});
		});
		describe('root/refreshAll', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('root/refreshAll', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('root/refreshAll', {}, {}, 401);
				});
			});
		});
		describe('admin/settings/update', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('admin/settings/update', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('admin/settings/update', {}, {}, 401);
				});
			});
		});
	},
	async () => {
		await server.stop();
	});
});
