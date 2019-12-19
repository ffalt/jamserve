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
					await getNotLoggedIn('lastfm/lookup', {type: 'track', id: '9X!z80Pty3b2cHEW#tq'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: '', id: 'CPQ)iy9![G*4@e'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('lastfm/lookup', {type: 'invalid', id: 'clm4^U6CZf'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: 'track', id: ''}, 400);
				});
			});
		});
		describe('lyricsovh/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('lyricsovh/search', {title: 'oKKW8kGVBui', artist: 'hJFd8G1d#oiV'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"title" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: '', artist: 'A9ChP'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: '%]SK7', artist: ''}, 400);
				});
			});
		});
		describe('acoustid/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acoustid/lookup', {id: 'pshieAiV$1Kx'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: ')6P3]w%3en', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/lookup', {type: 'series', id: '(ayI&&idsIx5$DkCIpV'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: '', id: 'El*D$U8(*ct4aB$'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('musicbrainz/lookup', {type: 'invalid', id: '*xQ!7%aP5Z@mPq9(D4&*'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'artist', id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'release', id: 'FJUfPnY62iaSC', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/search', {type: 'label'}, 401);
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
					await get('musicbrainz/search', {type: 'release-group', recording: ''}, 400);
				});
				it('"releasegroup" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'release-group', releasegroup: ''}, 400);
				});
				it('"release" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'area', release: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'area', artist: ''}, 400);
				});
				it('"tracks" set to "string"', async () => {
					await get('musicbrainz/search', {type: 'release', tracks: 'P#05qp]9dao3HBx@j50X'}, 400);
				});
				it('"tracks" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'release-group', tracks: ''}, 400);
				});
				it('"tracks" set to "boolean"', async () => {
					await get('musicbrainz/search', {type: 'area', tracks: true}, 400);
				});
				it('"tracks" set to "float"', async () => {
					await get('musicbrainz/search', {type: 'work', tracks: 30.12}, 400);
				});
				it('"tracks" set to "less than minimum 0"', async () => {
					await get('musicbrainz/search', {type: 'work', tracks: -1}, 400);
				});
			});
		});
		describe('acousticbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acousticbrainz/lookup', {id: '3U61q$'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: ''}, 400);
				});
				it('"nr" set to "string"', async () => {
					await get('acousticbrainz/lookup', {id: 'etUhIImKVT)tw', nr: '3I]*p'}, 400);
				});
				it('"nr" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: 'qZ$#WxsY!lhtf', nr: ''}, 400);
				});
				it('"nr" set to "boolean"', async () => {
					await get('acousticbrainz/lookup', {id: 'jCPpa(wVRdQqW', nr: true}, 400);
				});
				it('"nr" set to "float"', async () => {
					await get('acousticbrainz/lookup', {id: 'LRr34z7aqBNXRXN', nr: 30.07}, 400);
				});
				it('"nr" set to "less than minimum 0"', async () => {
					await get('acousticbrainz/lookup', {id: '942XRY', nr: -1}, 400);
				});
			});
		});
		describe('coverartarchive/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('coverartarchive/lookup', {type: 'release-group', id: 'OQSNO6'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: '', id: 'Z0SBBVD%94'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('coverartarchive/lookup', {type: 'invalid', id: 'rsr)J5vNEPF'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: 'release', id: ''}, 400);
				});
			});
		});
		describe('wikipedia/summary', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('wikipedia/summary', {title: 'Bh]U4oW*mw@ItwG3'}, 401);
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
					await getNotLoggedIn('wikidata/summary', {id: 'xYUFxyifHM)a%@D^JkdV'}, 401);
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
					await getNotLoggedIn('wikidata/lookup', {id: '66q9Y5knE((Ub['}, 401);
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
					await getNotLoggedIn('autocomplete', {query: 'JgY3g3D'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"query" set to "empty string"', async () => {
					await get('autocomplete', {query: ''}, 400);
				});
				it('"track" set to "string"', async () => {
					await get('autocomplete', {query: '0O^Ctkc&', track: 'AumDJm(j92#2iyA7]O'}, 400);
				});
				it('"track" set to "empty string"', async () => {
					await get('autocomplete', {query: 'rLbboAxNoOZ&DlRBa^7E', track: ''}, 400);
				});
				it('"track" set to "boolean"', async () => {
					await get('autocomplete', {query: 'vFmkxN8Dw8PbtBh(nxM', track: true}, 400);
				});
				it('"track" set to "float"', async () => {
					await get('autocomplete', {query: 'pG70V#9jqK6c*oDrP', track: 98.88}, 400);
				});
				it('"track" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'kN]^oYHSCWM', track: -1}, 400);
				});
				it('"artist" set to "string"', async () => {
					await get('autocomplete', {query: 'OLU^[$4G', artist: '^v&Nhu8T%AYkNy'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('autocomplete', {query: 'OQ!#JyVlJwggxU5i2cB', artist: ''}, 400);
				});
				it('"artist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'I@2ZSYPa', artist: true}, 400);
				});
				it('"artist" set to "float"', async () => {
					await get('autocomplete', {query: 'LcHK1k*wmQ#rYHvL&9', artist: 19.31}, 400);
				});
				it('"artist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '*1u1owJMp#NlTh2QL', artist: -1}, 400);
				});
				it('"album" set to "string"', async () => {
					await get('autocomplete', {query: 'q%r3BiUu[DUO', album: '@ulhsum#Ec5Gbc4c%a'}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('autocomplete', {query: '9@$iKkhnlngX)3', album: ''}, 400);
				});
				it('"album" set to "boolean"', async () => {
					await get('autocomplete', {query: '(nMs8!4fb2Cq7#!I', album: true}, 400);
				});
				it('"album" set to "float"', async () => {
					await get('autocomplete', {query: 'bO6uXlwW*93%ja79z[', album: 27.61}, 400);
				});
				it('"album" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'aasrU', album: -1}, 400);
				});
				it('"folder" set to "string"', async () => {
					await get('autocomplete', {query: ']N(xgAX&I%tB*O!cBhY', folder: 'ZV05j1'}, 400);
				});
				it('"folder" set to "empty string"', async () => {
					await get('autocomplete', {query: 'i[vo%', folder: ''}, 400);
				});
				it('"folder" set to "boolean"', async () => {
					await get('autocomplete', {query: '3c4sTA#pM8bDX4x#)Y', folder: true}, 400);
				});
				it('"folder" set to "float"', async () => {
					await get('autocomplete', {query: '6ktm$SGk37', folder: 53.91}, 400);
				});
				it('"folder" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'kVH2ioI3GRgiZLJ^QvTC', folder: -1}, 400);
				});
				it('"playlist" set to "string"', async () => {
					await get('autocomplete', {query: '^ovWcThv[IFOfWVJP^p', playlist: '58oNcGG)hG(3i&(]'}, 400);
				});
				it('"playlist" set to "empty string"', async () => {
					await get('autocomplete', {query: 'VExHdBRG6fsUlocyB', playlist: ''}, 400);
				});
				it('"playlist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'sSGKn^0Y2YfVZL1j2^R', playlist: true}, 400);
				});
				it('"playlist" set to "float"', async () => {
					await get('autocomplete', {query: 'Ea^UhiTeho', playlist: 85.4}, 400);
				});
				it('"playlist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'MN([pnO3s]WVJ', playlist: -1}, 400);
				});
				it('"podcast" set to "string"', async () => {
					await get('autocomplete', {query: 'XqqGtLiy', podcast: '7xj6zXNalA)f(fBw'}, 400);
				});
				it('"podcast" set to "empty string"', async () => {
					await get('autocomplete', {query: '2mn1Og@1(W^7idgI', podcast: ''}, 400);
				});
				it('"podcast" set to "boolean"', async () => {
					await get('autocomplete', {query: 'dIyd#FzBfn^)!FZT8$PH', podcast: true}, 400);
				});
				it('"podcast" set to "float"', async () => {
					await get('autocomplete', {query: 'nkz2l', podcast: 33.83}, 400);
				});
				it('"podcast" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'fp(Du$IVL', podcast: -1}, 400);
				});
				it('"episode" set to "string"', async () => {
					await get('autocomplete', {query: 'FLql66$afxr', episode: 'ffWTm&@c6@x'}, 400);
				});
				it('"episode" set to "empty string"', async () => {
					await get('autocomplete', {query: 's0L!W3zFZ', episode: ''}, 400);
				});
				it('"episode" set to "boolean"', async () => {
					await get('autocomplete', {query: '(xtX45hJPq^x^K(]Kt', episode: true}, 400);
				});
				it('"episode" set to "float"', async () => {
					await get('autocomplete', {query: 'B1js7eVq85oGZIzE6PkO', episode: 31.32}, 400);
				});
				it('"episode" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '*l^Va', episode: -1}, 400);
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
					await get('genre/list', {offset: 'MEEwh^6^'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('genre/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('genre/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('genre/list', {offset: 28.2}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('genre/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('genre/list', {amount: '5#NO]ft@nHK(M4l(Y'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('genre/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('genre/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('genre/list', {amount: 25.02}, 400);
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
					await get('nowPlaying/list', {offset: 'I[tH6D]Gbk#X@Se'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('nowPlaying/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('nowPlaying/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('nowPlaying/list', {offset: 86.41}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('nowPlaying/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('nowPlaying/list', {amount: '($Akeb5$2nhp39rb0e'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('nowPlaying/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('nowPlaying/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('nowPlaying/list', {amount: 71.25}, 400);
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
					await get('chat/list', {since: 'EBdPh]s6R(vK'}, 400);
				});
				it('"since" set to "empty string"', async () => {
					await get('chat/list', {since: ''}, 400);
				});
				it('"since" set to "boolean"', async () => {
					await get('chat/list', {since: true}, 400);
				});
				it('"since" set to "float"', async () => {
					await get('chat/list', {since: 27.32}, 400);
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
					await get('folder/index', {level: 'pFrz%'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/index', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/index', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/index', {level: 42.91}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/index', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/index', {newerThan: 'zGVi0'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/index', {newerThan: 66.92}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/index', {fromYear: 'cqzl!VA2'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/index', {fromYear: 47.89}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/index', {toYear: 'v[xL4SeEiQ9'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/index', {toYear: 38.79}, 400);
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
					await get('folder/index', {sortDescending: 'vm5(G&9cPjk0zQT'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/index', {sortDescending: -5353877373190142}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/index', {sortDescending: 3547564901138431}, 400);
				});
			});
		});
		describe('folder/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/id', {id: 'SbhaiB8Is@A%'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/id', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/id', {id: '(Rh9t', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/id', {id: '1IowFak%pE', folderTag: 'Mh&jG$7pY2lyFazC'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'Onr01*$ua9M(FMTySO', folderTag: -6879555415441406}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'HZ]gh00Uz', folderTag: -5284412799320065}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/id', {id: 'K$1Q$5LHxz', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/id', {id: '3QLl!J(9RP7EIkj)lT8', folderState: 'mff]f'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/id', {id: '8!)jVL2x842(J]', folderState: 16509078339586}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/id', {id: '(O$d2LHGv08%Um$', folderState: 865898206330879}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/id', {id: 'KRqe(TrYQSzitJBI@3y', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/id', {id: 'd)s97m8qSy6(', folderCounts: 'WB$pB)GN3plhjPg'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'k^(aF$3li(O#5D', folderCounts: -8867522426175486}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'Iv9$8GK', folderCounts: -3670115530833921}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/id', {id: 'XP6YEDxpT)IrEvB3nRM', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/id', {id: '9WkVm9q^w8)C$uN&Psm', folderParents: 'x6RUR3[7TB6)'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'IJR701A2UWe0[(hGVy', folderParents: 8368365852688386}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'evwSd^45JLP]Z', folderParents: -5067914809966593}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/id', {id: 'H0huS!', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/id', {id: '#wPcT#Jc3)', folderInfo: 'sKLqXZYhkZaBK@5vRo[]'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/id', {id: '@@UJVA1XPh2HPA', folderInfo: -6497727949045758}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'IAAVHEvWX1lrIUkOXQf', folderInfo: -7879226585776129}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/id', {id: 'Nx%i7i1!@qt&', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/id', {id: '67rdxo*sdfWQ', folderSimilar: 'zFg3#8Pkk7S55'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'kHSwnQ6a', folderSimilar: -233479191134206}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'oU9zwSMGOa', folderSimilar: -8276037242716161}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/id', {id: 'K05QA', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/id', {id: 'VyQztGkmc*kG&Z', folderArtworks: 'Uel8jyll25c5D'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'K&G8Jw', folderArtworks: -7042468197433342}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'nQ%&6pgPxWrbGuA', folderArtworks: -7672937574301697}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/id', {id: 'yn4APEK#CGX', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/id', {id: 'gvwlK]DH', folderChildren: '6qN41Z1o(GtJ^7$fcL4'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'PbBTutM$MGQsiUH', folderChildren: -6345886716133374}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'uT$oa4n37AheOIuu[kT*', folderChildren: -292779347410945}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/id', {id: 's[q&UxdY*y]oNR', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/id', {id: '1%GJ%ZNdx]j*p8@9ZFZS', folderSubfolders: 'fIUF^OLR'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/id', {id: '$5hUoIkyFKNFRM@Up!sS', folderSubfolders: 5104993656897538}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'EofI3OYsK4', folderSubfolders: -6753035954946049}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/id', {id: 'kSjvvcn#O', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/id', {id: '7H6TM]#ZHrU8k', folderTracks: 'e@lvoDH489O#waTYqXh'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'V6AY7#FC^wY', folderTracks: 1275934179065858}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'M#gQ[Ot9&', folderTracks: -1187261722918913}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/id', {id: 'UZOCu99E!Zp@8jA', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/id', {id: 'ml!1uI(mt!D9zx3JCb1k', trackMedia: 'hFGJC$5Q7n8o'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'iNU6bEXnxdH]rbK', trackMedia: 3706626779381762}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'l3%^v*TF', trackMedia: -7093127957446657}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'cBg5S)uNrDcT@LDH3^M', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/id', {id: '#D2CZmm', trackTag: 'j$edxy52MtkbU'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: '%MvMjR)vc^Hy]6Q5Vi', trackTag: -4504016037871614}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: '7h0wnn', trackTag: 3237980890202111}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'htyDWn6pbu', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/id', {id: 'Hz72NE(M1', trackRawTag: 'TwWJny%6Iuw'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'b#5fJr*qU(qAc#', trackRawTag: -3209437888118782}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'hP]O2mnGI', trackRawTag: 8333825071382527}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/id', {id: '6!^KY96Qrp', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/id', {id: 'DW$7Wd7P', trackState: 'p26POwb]bXUW!Ukga2Rz'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'cfMbXfxYWe84ni#6', trackState: -5336377457639422}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'i3Kc7m$&LrzvObdD', trackState: 4880256099942399}, 400);
				});
			});
		});
		describe('folder/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/ids', {ids: ['8BEBCsoIcqfG', 'j4r%U!cn^f']}, 401);
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
					await get('folder/ids', {ids: ['Mx%AM', '2(*&9z$l4vkpAj2mlnip'], folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['U]^VQPlV', '(k7b!Pk1bF&6y^K)5F'], folderTag: 'Z2)a3Qzu['}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['xW01@1rG', 'DggCym081ENbg'], folderTag: -3381650872336382}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['Fko[kGGbCt3@4UNKv', 'X(KIrFXD'], folderTag: -7780093036331009}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['$!bLs5PvKf0qLXK!GYNa', 'i[@Hl1I!oD7lr'], folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/ids', {ids: ['yOTs^5L[mM&T', 'aHZ(S6n'], folderState: '0SlxIlWn(g%'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['X$#AcRnb^7', 'i4C4#vxC'], folderState: -7231091110838270}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['o]jgQfOK4uu', 'cCN$l4q]dXLLtRY@6'], folderState: -7798076076982273}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['U8Kd@DTY]ZTCJyI1m', 'Ok9KkVM41'], folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/ids', {ids: ['q$VOW6WL6%a', 'jHsAuAbqJdF%@P04'], folderCounts: '&94(ypN@JA@Adop'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['gj6hVHA%P5HM', 'TTQRN@*QRm]GHSib1Fy'], folderCounts: -7328187319058430}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['8hU!OyldMYL', 'runK2MOYx2tR9'], folderCounts: -6610926199373825}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['ICCBD]z', '&&L5EUpFe[9YYm$ED3'], folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/ids', {ids: ['#6kmuAYe5Wh!mZxCV', 'HwO7O&hP3pCNTOsLh'], folderParents: 'dyOSJdTKNPvrjXa8'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['@()V@pTYNxSh', '(KU(I)a5e[xS)@SJy'], folderParents: -6459824292233214}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['sZmv2FPXa4PW!2z6j', '1lz&RcHb'], folderParents: -6807098981613569}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/ids', {ids: [']XwJ!Z', 'P8DpBni0pdjPzk^8^4z'], folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/ids', {ids: ['FuuHOS(zIx*', 'r(N&AUpnUdS'], folderInfo: 'Hw6GqyA961]f'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['w#XhemH$BxC', 'o4VBiwMjmNO%u^d'], folderInfo: 347492919017474}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['h(6GKP0g&f%T[', 'y!V$^ulp'], folderInfo: 8285289407578111}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['^SBMK', '8FpLH7ofgzs'], folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/ids', {ids: ['qy3!!yD1*S7', '6*!xsO)'], folderSimilar: 'zW^iXT'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['$Rnro6y4heFaJ4e)YS', 'Ev7Rt5%27#'], folderSimilar: 4741474579120130}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['^(!^X!K', '1vD!@[oUoqhX'], folderSimilar: 8426568187641855}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['nO[iEoBxhgz)', 'DF$NTjyOvKCfJFTz*['], folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/ids', {ids: ['DHy1RFiTfUon1d', 'kKm!zE0#x'], folderArtworks: 'erV5Wzi'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['0Vm[DuoWqGGNR5P%]', '3V(8!1e'], folderArtworks: 2139232873218050}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['NFcEj2yylf', 'g)PB^Ne1Twg51'], folderArtworks: 3708124850552831}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['yfXbOVxMn$PQl1', 'IfO@Oau#Qk'], folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/ids', {ids: ['brb[p3u4T$vy@rLP', ')Whe6d#Iv3i1t'], folderChildren: '9e1zBQ7u5q9GEQ[!P'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['7HWSe4mx#', 'D9Tz5'], folderChildren: -3864917446754302}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['FzmNLXIt(H*2ge7pzof', 'E)bly3Y3pd'], folderChildren: 2033734035439615}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['IrIrk^jxllPD#*', ']CBstsJ68](QGw3'], folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/ids', {ids: ['zECqct', 'Xri06K1jGfwZg$Vl6'], folderSubfolders: 'b)GH2VxI8t'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['WuRE0a#QQHPtyoJ', 'T^CkyUbSi'], folderSubfolders: 7185193316122626}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['DWze3esh@9acYe8j', 'P[On#caZ'], folderSubfolders: -8885076678934529}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['bD4sR6J', 'tzTWPJMFNJoxN0eDy^'], folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/ids', {ids: ['SDW9EE6wh$d&n', 'Tz5bbL3df'], folderTracks: '#ZecT(kBuk3D$A^'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['L&1ik', ']]A[01(H'], folderTracks: -2859921196449790}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['Tp2]JdUW1w', 'T!ez0)H]h7%'], folderTracks: 5251008967999487}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['DUKUxo47b*pa', 'Ihg&#6LY'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/ids', {ids: ['kWz!yGoi3', 'oKpskmv'], trackMedia: 'H[$g63%UbTh*%$3B1'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['Nsc$K', '2L2kWx0$2^FYcU2jan'], trackMedia: -6877915119615998}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['zsVjzBQUzy3I5ZM5d', 'pJ&S&)@&s$%fbbzaDw7k'], trackMedia: 8912990917099519}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: [')(Y!s', 'gqkoY]jQox8&60&X'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['*T9p[6IhlvXbO', '^Orxkg$Vdv$O2Q'], trackTag: '5#*SVSzDLJ'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['Nf6Z@m(7raSx0IZy*S&', 'r0ypw[3MTiWk'], trackTag: 6517223367639042}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['Muc^1A', '7!sspnOhDXGPne1)ZQK'], trackTag: 1620514623717375}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['U%$]c]4RQUnmldTmm#g', 'MpfVc3EpXU]y'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['][(kq1S8piHmhCbNN', 'u&u!vBQR4&U'], trackRawTag: 'BYFZgCgzPesg'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['1(mEA', 'md^Q5BfoUAssISNzl&W'], trackRawTag: 4836689830739970}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['RXS)vcBcZhAQFkj', '@agR5q!VM'], trackRawTag: -6014297935183873}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['et[1jI5q3[!3y75', '9aDOF**S9@aXX'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/ids', {ids: ['[aYG6@3ft&2TW', 'YS$y&EptdL2b6'], trackState: 'nySbOXMYCjRo8ow'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['#HE7neo!', 'fYid#$e9ojHIPA'], trackState: -2134013724590078}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['(w0aPWYnS$wSfWf*sDS^', 'XBWEjyuqs8RnYsZ!D'], trackState: 7011158900867071}, 400);
				});
			});
		});
		describe('folder/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/tracks', {ids: ['mI4%^b', ')f3rp$']}, 401);
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
					await get('folder/tracks', {ids: ['Vq)IS8K!xDBr8', 'mxmZzKf1)^'], recursive: ''}, 400);
				});
				it('"recursive" set to "string"', async () => {
					await get('folder/tracks', {ids: ['y&d#r$rtn]t(sDM(A', 'Y#C]fVt#whFE'], recursive: 'Z14#2FGe4MGcca@'}, 400);
				});
				it('"recursive" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['c(QdL', '44oeZolMl@OzDOPdj'], recursive: -421392373776382}, 400);
				});
				it('"recursive" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['nZ*F77UmzZKl24NLelO', '6*JNsUVsxE'], recursive: 1138373435588607}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['be#105C%w3', 'B7pwDKRfl5Ogng'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/tracks', {ids: ['0C(EL5LTFNAHx$yEx', 'daOvcaYl'], trackMedia: 'CocID%vU6'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['9R@nJ', '7ziaj870JWb3Q'], trackMedia: -8621425564844030}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['kUNMX', 'GL9b1EHu75&IlkvbQ2!'], trackMedia: 6224641043464191}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['thNyQ2)A6aA', 'y!P03xQf'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['RR6U8Siv', 'M]4wSRvUyX1g'], trackTag: '7Czo!YOLRTUJfi'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['aFOxivO', 'n!J9sMwYXBF51)cYI0iK'], trackTag: 7771188772208642}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['O4iot%0%5DC7fcY[17LP', '%CM6q3(DK]LnF*IJ$or'], trackTag: -8883662745501697}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['rj(4#L2ugpLTcR54K((', 'a^OkD2kiEdk'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['a7]k6yj3A1J#qgG', 'mR4sq4w^eX9k'], trackRawTag: '7z9)yv5Ig'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['9U@pW#sIpudfKIF', 'HF!xRk^J80FeY#%BzzZ'], trackRawTag: 6441577706684418}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['m[LnYaT@cZs9I&K', 'h&E7LVp6WsShMQ&'], trackRawTag: -1139985843486721}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['8C4pliMbq0rKfIdwcuX', 'N^1i%G'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/tracks', {ids: ['CWX[q0d%9ls*3%(Tr', '9Jq4W9zUnWT@Jg@w'], trackState: 'Gx6OO'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['Z7jK*M', 'jcVIWxJ'], trackState: 793007997583362}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['J*Jpd9gze[', 'wxT%c^[mS(#NCt]1rv$'], trackState: -1966281154625537}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/tracks', {ids: ['$%y*s', 'feJ59'], offset: 'aNVe3kbIm%X2DsTc#'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['v&d4&*nb!ArI]J#A', 'yZ@w76G'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['lC*IY&8uz*81MCv*3', 'dhHqgL]Shv'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/tracks', {ids: ['xHa(YDZDOhv)]Y', 'lXK)ERBmX8Pw'], offset: 55.12}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/tracks', {ids: ['aQ7]xXjy^jneBtgd%v', 'h3hElN'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/tracks', {ids: ['MQQQ(a)is', 'Rd!F&HBejQj%!&'], amount: '^gj2tSlDf1X*Ov'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['W2]c$yFZ', ')2ipliq&%9W[k#9'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['#&[TgvC6A7BO9ulU[ujQ', 'e^A]xju9RruSf@JWTm'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/tracks', {ids: ['!pOLTZO2imBZb9', ')PAMhecxOlMpYYHiY'], amount: 63.64}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/tracks', {ids: ['dItQfAfJZKX', 'A8jP^#tca#JRlA!QniBa'], amount: 0}, 400);
				});
			});
		});
		describe('folder/subfolders', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/subfolders', {id: 's)aoJFnc8XTLQQhie0O'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/subfolders', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'HqVFzQ%@', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/subfolders', {id: 'T2jCcFV)8$o3Kit%8F9', folderTag: 'b*G[k'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'lqCe&WN&H]%', folderTag: -4955316768735230}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'U#Fi*9xqj', folderTag: 5451686940246015}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'zOCtxoq^La3H', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/subfolders', {id: 'iR@LOu59F', folderState: '%xo$v5WlEn'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'Uu[lK&PD01g]GS@', folderState: -6786136751996926}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'Nc74m4G', folderState: -5344000579993601}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'r9aNB6Sr)0Vu4c^', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/subfolders', {id: '2i&!42TDvq$)oq', folderCounts: '501@#rillRC1Xc6'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'NW9yD4Z^s5k', folderCounts: 6073159694417922}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'Zmsjqjj16d!$@', folderCounts: -7095839474319361}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'AVC*Wy712eV', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/subfolders', {id: 'NzE#V6Y[', folderParents: '*0I]bQwq1Zk8'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'cQcd#y2MwuObzN', folderParents: 8792826376617986}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'd1rMWn!2r2!!4ZY', folderParents: 2164581740838911}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '0[bACZc9w8$', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/subfolders', {id: '9JCLDCFM@jfeIz02', folderInfo: '@rrub'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '))XIFmNvpZCiu[c&', folderInfo: 792883384811522}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'mci!@G', folderInfo: -2409510853410817}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '6hpi83XgxzFlg5(', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/subfolders', {id: 'Jh4#PQz8jd)M', folderSimilar: '#!tI7@OxR8'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'ndXHdEe60YPWM^XHCF', folderSimilar: -3176284087648254}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: '1C^Ee1#k', folderSimilar: 4825115212644351}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '5fEHz3', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/subfolders', {id: 'eHV5!IoimE0aLUM', folderArtworks: 't!U62d*C%60hbkG'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'xgf2]p697oXOg(@J2g', folderArtworks: 7105766800490498}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'uEY5n)hH', folderArtworks: 7098719853871103}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/subfolders', {id: 'TaZGRS9pKH!lXzkfO', offset: 'IJ^IXtVBtL5zo2P'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'H3yoVnF#6', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/subfolders', {id: ')L3w2sjS6MbxsSo', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/subfolders', {id: 'Zg(aAMovyxC%59@24b', offset: 97.97}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/subfolders', {id: 'SPl)xmK00@C]i5C^MQ', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/subfolders', {id: '36M6Vh[]n^J3k6', amount: 'W63nptu^NK!@S'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'tht[kVDjOht8@', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/subfolders', {id: 'L!C#vsoWx2va', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/subfolders', {id: 'uWEC67C0nBziJw', amount: 43.15}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/subfolders', {id: 'E2Sc93M*jM)VD', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/similar', {id: 'YIOkh&xOg@qGd'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'pZ(Gfl', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'AQLeBLj9JuMjd#', folderTag: 'XWzvu'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'Kf)Dx4]m', folderTag: 3402530105065474}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '^(c047%m%O[48u', folderTag: -4578398399627265}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '$9zJCD21&blEW', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'a*(zJR6', folderState: 'lm11QK*g*&V*oS'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'gkBIIX![1oTEgub*Wa', folderState: -8501648095707134}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'JD$MO*&^(aWfKf', folderState: -1406729237561345}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'y$GBSDh6', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/artist/similar', {id: '3XVx)4QKtEaCQ#PQ', folderCounts: 'tm7sE3GA(m$t'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'MpZtlQXYiCwLLvfXS8h', folderCounts: 8521524277411842}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '6VIM5LbOx^SM', folderCounts: -2300274156765185}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'Ab1uL]U54F5F1Q', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'l2tzB[&@', folderParents: 'bqC9h'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: ')n5EM&sueb4TrKMy', folderParents: -4142368097828862}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: ']S#nHz^8lY9YI7fIg', folderParents: -7347124828110849}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '[*7va^c', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/artist/similar', {id: '5Dc$aqFUBKXoZWeWsB8', folderInfo: 'IPMv&XGjyt!ZC(Q'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'maRK4*S[RKz^B^x@Oh', folderInfo: 7361770209411074}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '386IH*ac^BcQ$$qyqOX', folderInfo: 8245484976078847}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'lPv9@@Ig', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'QKhEByRuK6&r[OjKzmj', folderSimilar: '8M^O!cq'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'MPMdrirta*edGnjvonYF', folderSimilar: 5690772657537026}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'KUG3O6^5!Evd^)XSn7', folderSimilar: -1923642409615361}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '6CTsk7T1CN', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'mh6ulI1ugsbRSd', folderArtworks: 'S(c$nkh3&P*$!O'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '!0ja4j#SRL%cDHG3us', folderArtworks: 6151720249851906}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'VrkU^K#X4n*j', folderArtworks: -8881025425866753}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'slvZQi3sn[F!Ishh', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'ZWuv8)F(0*Rm7', folderChildren: 'U6%3z67b'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'MfRtEG6Da@[kXMBhnd]', folderChildren: 1392998860455938}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'PUOf3Y!0iy%Q$]GGZs9o', folderChildren: 1656439227547647}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '[%xT!', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'jJ@UGbtku', folderSubfolders: 'KU5oh52sf%91'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '[IQ*YllKW', folderSubfolders: 1000836213768194}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'C60[IH1g^MGJ(nCOf', folderSubfolders: -5974338448654337}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'hiesOW2', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/artist/similar', {id: '$BE0zLMr4xFy', folderTracks: 'zfcg8C!vt$]6m^'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'oavxrE7G6rM#FRoPr', folderTracks: 1714619328495618}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '8QRLmUT9!K!#ehu$eU', folderTracks: -879605439266817}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '%aT!!m%5Zvk$^', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar', {id: '@wvwuS0)N1QvmSqYQ)e$', trackMedia: 'VxJJls2uO*&@d0D^vb'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'x0Ymm11wX&g7yOs', trackMedia: 4212031607537666}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'LG)toLDz[', trackMedia: -7294787325526017}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'ElhQpR3[o3CCtAY', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'UW6]xzI', trackTag: '1e[!Us)W6lTWx&xk@Twd'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'zvW!$PA', trackTag: 7475062609281026}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'i$g&$^g$p98Ptv^xUN4s', trackTag: 4267557590663167}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'lirg*[NUEI7', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'pM]Z8jji)SLnjwg', trackRawTag: 'QhktC!L'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'TES6Kc^', trackRawTag: 8538564119756802}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'YjzodzH57Z', trackRawTag: -4202568083308545}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'H^MJz!uZbSM@[cf', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar', {id: ')GJa7WSnD0(K$gQF', trackState: '4dQ!5LUxitDO4xuVzV'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 't7MgW9T(F4z]!u', trackState: 3181210108952578}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'Fn[B]I9ps', trackState: -2217970507972609}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'NUuHYgT(M', offset: 'M(yyljS'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'iFEew61ytupC', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: '92EKi]#&U#Y', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar', {id: '4yEF#603jkfv', offset: 40.54}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar', {id: ']AnPMyMVYi!XdXXk', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'YGpa1BW]EQ', amount: 'wOhrk2fhg2v@rd7#'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'yogQ1*X^5@N!hpc', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'Ydx3Kb*!vUO%pLFD', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar', {id: 'KcW$^![&Ja', amount: 75.46}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar', {id: 'WK!xiJZ', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/info', {id: 'j*)(S3s*iFeiBU22tZ!'}, 401);
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
					await getNotLoggedIn('folder/album/info', {id: '#h^jSD%$AW7*h[tOB)'}, 401);
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
					await getNotLoggedIn('folder/list', {list: 'faved'}, 401);
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
					await get('folder/list', {list: 'highest', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('folder/list', {list: 'random', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', parentID: ''}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', childOfID: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', artist: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', genre: ''}, 400);
				});
				it('"level" set to "string"', async () => {
					await get('folder/list', {list: 'recent', level: 'yOdgg2M'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/list', {list: 'recent', level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/list', {list: 'random', level: 76.75}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'random', level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', newerThan: 'JC25j@IgQRmV1bifP$'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/list', {list: 'frequent', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/list', {list: 'random', newerThan: 35.75}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'avghighest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/list', {list: 'highest', fromYear: 'n*mh9hkDi9'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'highest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/list', {list: 'recent', fromYear: 11.84}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'recent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/list', {list: 'highest', toYear: 'VzUmf7)'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'random', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/list', {list: 'recent', toYear: 50.53}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'faved', toYear: -1}, 400);
				});
				it('"type" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'recent', type: 'invalid'}, 400);
				});
				it('"types" set to "null"', async () => {
					await get('folder/list', {list: 'frequent', types: null}, 400);
				});
				it('"types" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', types: [null, '']}, 400);
				});
				it('"types" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'avghighest', types: [null, 'invalid']}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('folder/list', {list: 'avghighest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('folder/list', {list: 'random', sortDescending: 'PoilkR7fKR06q'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'random', sortDescending: 3064679236632578}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'frequent', sortDescending: 2989095747846143}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/list', {list: 'faved', folderTag: 'Lr0%Ou[ExOVoq'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'recent', folderTag: -5860871582515198}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'random', folderTag: 1669372556869631}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', folderState: 'NZ30w%SO)CC6'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', folderState: -8527182884241406}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'recent', folderState: 2336457859530751}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/list', {list: 'highest', folderCounts: 'hO$MDOiI88mn#O1h'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'frequent', folderCounts: -8606596007460862}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'random', folderCounts: -181477069291521}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', folderParents: 'vh!SZLuC'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', folderParents: 1256744462319618}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'random', folderParents: 5842572547194879}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', folderInfo: 'R5%yzi*Fz#k^RD'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'avghighest', folderInfo: -1187641156435966}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'frequent', folderInfo: 6611188746027007}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderSimilar: 'TyrP1'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', folderSimilar: 2637079620091906}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'recent', folderSimilar: 8031360648216575}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderArtworks: 'TdrlAeq'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'random', folderArtworks: 6969724445392898}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'frequent', folderArtworks: 853171840745471}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/list', {list: 'recent', offset: ']tI4b^xx^7!*Mc'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/list', {list: 'frequent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/list', {list: 'avghighest', offset: 64.33}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'faved', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/list', {list: 'random', amount: 'XTGsQPlBvyRd5IP9[vyn'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/list', {list: 'faved', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/list', {list: 'random', amount: 98.08}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/list', {list: 'highest', amount: 0}, 400);
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
					await get('folder/search', {offset: 'rA(^#zfxtz$R'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/search', {offset: 60.68}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/search', {amount: 'SP)VUTSMV'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/search', {amount: 53.72}, 400);
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
					await get('folder/search', {level: 's@5%J'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/search', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/search', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/search', {level: 52.23}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/search', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/search', {newerThan: '5vpBlS(UHx]FXK'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/search', {newerThan: 8.86}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/search', {fromYear: 'kuef)47'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/search', {fromYear: 84.29}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/search', {toYear: 'joviS'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/search', {toYear: 21.42}, 400);
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
					await get('folder/search', {sortDescending: 'K!Px)'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/search', {sortDescending: -6830736472539134}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/search', {sortDescending: -4819068976627713}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/search', {folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/search', {folderChildren: 'PG9FmKoBKOV'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/search', {folderChildren: -5612084754644990}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/search', {folderChildren: -7543329755496449}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/search', {folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/search', {folderSubfolders: '6(e#zFYaHrr4N%y&bXT'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/search', {folderSubfolders: 8884505251151874}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/search', {folderSubfolders: 7543954841010175}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/search', {folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/search', {folderTracks: 'sDoaNL(D(#wrXBrC'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/search', {folderTracks: 4707686398558210}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/search', {folderTracks: 5645255969865727}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/search', {trackMedia: 'GnKGgp7hv#cMJSiv'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/search', {trackMedia: -2369365517271038}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/search', {trackMedia: 1807030130049023}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/search', {trackTag: 'taP[*1lc&a'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackTag: -8816311261986814}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackTag: 69510673465343}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/search', {trackRawTag: 'eE)vi@KqWe'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackRawTag: 7900549726863362}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackRawTag: -1362125553401857}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/search', {trackState: 'qKb6p!O@fGUy7h'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/search', {trackState: -4670109687742462}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/search', {trackState: -7226673783111681}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/search', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/search', {folderTag: 'j^y(*o]bN3ZQ'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/search', {folderTag: -552147271811070}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/search', {folderTag: 2603399879065599}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/search', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/search', {folderState: 'R$e#14oWh'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/search', {folderState: 1735812928503810}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/search', {folderState: 4581578856464383}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/search', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/search', {folderCounts: 'xfddcTga8g[f'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/search', {folderCounts: 5977531412905986}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/search', {folderCounts: -6023826269798401}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/search', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/search', {folderParents: 'h#AeWDxBGmWo5'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/search', {folderParents: -7280471645880318}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/search', {folderParents: 5254218176790527}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/search', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/search', {folderInfo: 'zj4dU7SR4lE'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/search', {folderInfo: -6896855627595774}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/search', {folderInfo: -4356044524355585}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/search', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/search', {folderSimilar: 'IUBr7DQ()^&I1Fadovsc'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/search', {folderSimilar: 3158172554493954}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/search', {folderSimilar: 8588317738139647}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/search', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/search', {folderArtworks: '1u1BdiR9gbP'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/search', {folderArtworks: -6917580195364862}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/search', {folderArtworks: -7537759929499649}, 400);
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
					await get('folder/health', {level: 'kM6rzJZxsY8r'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/health', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/health', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/health', {level: 91.25}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/health', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/health', {newerThan: '6gUQ0nyLuk134ZCpXsN#'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/health', {newerThan: 14.35}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/health', {fromYear: 'JID1Krp!%IFrS'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/health', {fromYear: 97.58}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/health', {toYear: '2kPG7#EFL'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/health', {toYear: 17.15}, 400);
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
					await get('folder/health', {sortDescending: 'RL^6[Hni[PmqCl5BhN]'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/health', {sortDescending: 4162004138852354}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/health', {sortDescending: 56789789835263}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/health', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/health', {folderTag: '8JxB0NV4Wr]M'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/health', {folderTag: 3558923961368578}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/health', {folderTag: 4585132878987263}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/health', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/health', {folderState: 'nrkJqkWDjGkx%i&5*On'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/health', {folderState: -7798430734745598}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/health', {folderState: -351036032155649}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/health', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/health', {folderCounts: 'FpO8QmaU0XK'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/health', {folderCounts: -956207904849918}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/health', {folderCounts: 2575182359166975}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/health', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/health', {folderParents: 'XK!cW$R*'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/health', {folderParents: 1880708402380802}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/health', {folderParents: -5073888853622785}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/health', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/health', {folderInfo: 'RpGqOjwfhZ!6b'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/health', {folderInfo: 4458829144129538}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/health', {folderInfo: -3849647105769473}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/health', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/health', {folderSimilar: '6AQ[q'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/health', {folderSimilar: 3003443736215554}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/health', {folderSimilar: -6375452318892033}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/health', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/health', {folderArtworks: 'A]qGSMb9I'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/health', {folderArtworks: -3591141471551486}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/health', {folderArtworks: 1684177606934527}, 400);
				});
			});
		});
		describe('folder/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/state', {id: 'QfqXg3[Q7R5x'}, 401);
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
					await getNotLoggedIn('folder/states', {ids: ['p6&8kn#kBytfC4%fk', 'u*OHYSPZR']}, 401);
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
					await getNotLoggedIn('folder/artist/similar/tracks', {id: '*el!Iq8P@j'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '[b3Gs7CFjF(JG!j', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'odpWW4jJbAtw9U', trackMedia: 'grXiAMR'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'gXRt!aqEA5', trackMedia: 614410200547330}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'ra79wjzwTlThR1!n7*', trackMedia: -8693629753229313}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'mR7XD2kTUhPkP0QJ7', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'CPkvw4ScWoe9]a', trackTag: 'jaIU82^)Fay'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Z#C!$8zi(x$5i[^T', trackTag: 8281378982461442}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'T^S6LU^2I', trackTag: 3160733940449279}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'uI0uZk^d', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Pj&RCC$7de82W', trackRawTag: 'Pw5fmDg*&[9pjQog'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'vpkbfqCTCA', trackRawTag: -3528872209416190}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'xXlJN', trackRawTag: -1566443015503873}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'pVU]V5[pM', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'utKTl4DpBaIe(q2sDAn', trackState: 'khH7V1qRz#p*u1bHs'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'LKI!(jTqYV(Qzt[gr5', trackState: 5045867417436162}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'qt(yeq%', trackState: 625407367839743}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'wYn$cy5%Rfn3cmkf!', offset: '#n*pXSQjaPDz'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'E@t6dWx#blpo(JH', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'HPn&wzP)#0J]Uw', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: ')j6Om1y0', offset: 48.21}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'ZX#pxk88y^', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'LYZ)R3VqWMJ[', amount: '2WPy#e(VX7gJVgW)t^n['}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'ltmVCdYFCgTiVvBw9!I', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'lCmN$', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: 'atW)#I#TI6R', amount: 65.41}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar/tracks', {id: ')d7[#[e$Y', amount: 0}, 400);
				});
			});
		});
		describe('folder/artworks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artworks', {id: 'ZE[b2'}, 401);
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
					await getNotLoggedIn('track/id', {id: 'o51Uzi@nV'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/id', {id: 'RI&GC*vPux^', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/id', {id: 'okh#K8Iefo#7H*hW^WN', trackMedia: '^]u(dLNlW'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/id', {id: '4%TC$HmW5]ZA4TD0u]', trackMedia: -2552404100775934}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/id', {id: 'Z#BI!yZ4JQm@Snq(!aJD', trackMedia: -4155812880580609}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/id', {id: 'YzA7X^gC5y@0^#(^00q', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/id', {id: '(lxMchgoCQLWL7lhyqBC', trackTag: '35Qci6P]nHbt0]Rh('}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/id', {id: '0K@*Nd0', trackTag: 5995986262425602}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/id', {id: '0^6T$W)YZt]rU', trackTag: 5861732949950463}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/id', {id: 'ezuIOj[&]tbXQW)', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/id', {id: '&c@H933zr', trackRawTag: 'J0P)K'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/id', {id: 'jjfE9Mb)!J', trackRawTag: -1434112401342462}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/id', {id: ')0y6vm5*y7h47X', trackRawTag: -3987893823471617}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/id', {id: '[5MFZ]e', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/id', {id: ')f9GdQ', trackState: 'X[T^F'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/id', {id: 'a@KxZy0', trackState: -8429092110073854}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/id', {id: 'EyhP0r]dB*0z', trackState: -5457875086344193}, 400);
				});
			});
		});
		describe('track/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/ids', {ids: ['aoT4uz6w9$I', '5jjJ3S&USoZEfdeP6K)']}, 401);
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
					await get('track/ids', {ids: ['46Xv527&U)!3sl', 'yf2YGiDA1qj5oH!R'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/ids', {ids: ['&IM]kaAxo', 'Bt&]DPbjD'], trackMedia: 'xmk[Ea'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['$5jq(#a$qAD6fN^gR$k', 'LxzbC5TLNS'], trackMedia: -4136862838947838}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['E(*3Md', '1OfgB34F*q'], trackMedia: -4769802744758273}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['e[KZtItW$', 'pFxg1Qm6gRsZX1'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/ids', {ids: ['jES6IBdTV9M()UZUjv', ']Lkzw6ErWFSD%3'], trackTag: 'Q9JLPU$O'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['%0drZ(Miq', 'TvR43jb(vQl0KPvTZXB'], trackTag: -3209586299371518}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['KDJW*e*J', 'psxK8jOm6mJS[jN'], trackTag: 2019753115779071}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['pf3nAopN&yn52', '#U^(xC'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/ids', {ids: ['7N4AI5^1gMpiPHgZ', 'BwsYUXEZS8t'], trackRawTag: ')Y%ZE5kFLC'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['OAK82iD(UBa', 'RXABQM9Y0'], trackRawTag: -2523141234491390}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['5bAKYKgu@NeZ[NQXzZyQ', '!CHVVf'], trackRawTag: -6057416240136193}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/ids', {ids: ['L(qY)h[^!', 'nVzPcqGDfo'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/ids', {ids: ['FUA(d', 'mIeV@'], trackState: 'eU4Vht#MBfnYVKx3Jdl'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['$T!Vh6By6CsszOz4cUs@', 'Fv)rWiUNQ(ex5t'], trackState: -73138964529150}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['9iI^L4MbNuxR', 'KOqU5$1&RtcvlzS'], trackState: -8791071639207937}, 400);
				});
			});
		});
		describe('track/rawTag', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/rawTag', {id: '$dgaJ4z2lfgl5O#m*%TL'}, 401);
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
					await getNotLoggedIn('track/rawTags', {ids: ['7k]kxfYrN91B*x', 'gDGw)rFCNsG[SG^c']}, 401);
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
					await get('track/search', {offset: 'Gh2A5TCubI'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/search', {offset: 71.1}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/search', {amount: '!rs0LeghST#*&XVFP'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/search', {amount: 93.67}, 400);
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
					await get('track/search', {newerThan: 'a8DLTzaZha'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/search', {newerThan: 26.84}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/search', {fromYear: 'rhS4bX04j]JLp'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/search', {fromYear: 8.61}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/search', {toYear: 'J1uLz3ai@!4C'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/search', {toYear: 22.82}, 400);
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
					await get('track/search', {sortDescending: 'awg^&zAKVjtafV$e!'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/search', {sortDescending: 3994548325842946}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/search', {sortDescending: -5846085717196801}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/search', {trackMedia: 'h2@onJM'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/search', {trackMedia: -3016519789314046}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/search', {trackMedia: 3221156073046015}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/search', {trackTag: 'jLkm49mnxf'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/search', {trackTag: 4384219442708482}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/search', {trackTag: -4835243437588481}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/search', {trackRawTag: 'f)yJwWN)PbR'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/search', {trackRawTag: -3543396782178302}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/search', {trackRawTag: -8370056127840257}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/search', {trackState: '0Ob*8o5h'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/search', {trackState: 5080796968779778}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/search', {trackState: -8242270692179969}, 400);
				});
			});
		});
		describe('track/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/state', {id: 'bnb1DOa%8Oy0H1wK'}, 401);
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
					await getNotLoggedIn('track/states', {ids: ['8oGo8ASrImtb', 'qTCI6S']}, 401);
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
					await getNotLoggedIn('track/list', {list: 'faved'}, 401);
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
					await get('track/list', {list: 'avghighest', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', artistID: ''}, 400);
				});
				it('"albumArtistID" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', albumArtistID: ''}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', parentID: ''}, 400);
				});
				it('"parentIDs" set to "null"', async () => {
					await get('track/list', {list: 'avghighest', parentIDs: null}, 400);
				});
				it('"parentIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', parentIDs: [null, '']}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', childOfID: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('track/list', {list: 'random', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', rootIDs: [null, '']}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', genre: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('track/list', {list: 'highest', newerThan: 'i4sG6z^t'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/list', {list: 'frequent', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', newerThan: 47.38}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'faved', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/list', {list: 'faved', fromYear: '9c2%%W$V#'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/list', {list: 'avghighest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/list', {list: 'highest', fromYear: 78.16}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'highest', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/list', {list: 'frequent', toYear: 'h%GpPlP'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/list', {list: 'highest', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', toYear: 68.61}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'highest', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('track/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('track/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('track/list', {list: 'recent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('track/list', {list: 'recent', sortDescending: '0ri$J!yylGgRU'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/list', {list: 'highest', sortDescending: 1716726131589122}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/list', {list: 'highest', sortDescending: -7463155731005441}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/list', {list: 'highest', trackMedia: '72RjsP8Kq8%41s(KS2)!'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/list', {list: 'avghighest', trackMedia: -8079292697149438}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/list', {list: 'recent', trackMedia: -6133075780042753}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/list', {list: 'frequent', trackTag: 'pQtwfCHI8h^%'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'recent', trackTag: -1760337900601342}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'highest', trackTag: -8460387527688193}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/list', {list: 'avghighest', trackRawTag: 'NHQ8aZ27*7Kio)Xlg48'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'highest', trackRawTag: -4784877274660862}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'recent', trackRawTag: 8515279495626751}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/list', {list: 'random', trackState: 'n[dvW6WsiJ4!)(t1EG('}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/list', {list: 'recent', trackState: 7338627734437890}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/list', {list: 'highest', trackState: 4535447862640639}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/list', {list: 'faved', offset: 'AewDd8'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/list', {list: 'frequent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', offset: 78.27}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/list', {list: 'random', amount: '59]l]ekoNdCQ(Pj'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/list', {list: 'random', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/list', {list: 'random', amount: 15.44}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/list', {list: 'random', amount: 0}, 400);
				});
			});
		});
		describe('track/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/similar', {id: 'u27hHHpM@Q2u'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/similar', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/similar', {id: 'F1ohZ07e', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/similar', {id: 'sl86Ge8wf', trackMedia: 'uZ2Zr!Kx4udK'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'n[hROVeZr^s', trackMedia: 2396118985998338}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'VPU#aTxM8l9', trackMedia: -2345681326964737}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'wV(cyR', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/similar', {id: 'ZdCy%', trackTag: 'j&e5vp'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'omc8)Wv', trackTag: -2262999582638078}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: '8324zA^$o28G', trackTag: -3630204215885825}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'AsF2V9ynBbmJ', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/similar', {id: 'ZZIHM[A$APeJjJ', trackRawTag: 'y7@UWQQ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: '5zna@O]MANJ(GWCpUjg', trackRawTag: -3057100666175486}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'H(B(!Pg0EzJ2PyN*CFCA', trackRawTag: -459568794566657}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/similar', {id: '0dwm3FBVIA', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/similar', {id: '611ydRpm@(Zpo', trackState: 'FHZCyUO1YyJDN5DFC8V7'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'GOu&MwgEJc@cM', trackState: -3908811215601662}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'KqR4dHy52RwmfS7', trackState: 7047676562505727}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/similar', {id: 'd7!h6', offset: 'w[uNXfTPdS)S7dC*'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/similar', {id: '(KMgta)uxs$oi#h', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/similar', {id: '1lyRBv]@@x#$Y', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/similar', {id: 'YJUOyGiUcP]O', offset: 12.32}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/similar', {id: '46OuQ6oAK$@*BB7Dpik', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/similar', {id: 'Akics5x8', amount: 'v]uUZ*Y&b[dsSqB8#y'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/similar', {id: 'T@R%%ZFdU[', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/similar', {id: 'QICHiBn&bscbIKr', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/similar', {id: 'qQjjnJz^wPTu', amount: 14.63}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/similar', {id: 's6bq2yXG)*5gAdyNZ', amount: 0}, 400);
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
					await get('track/health', {media: 'qq5O6P*JGF@IZZ)AoxX'}, 400);
				});
				it('"media" set to "integer > 1"', async () => {
					await get('track/health', {media: -6473378324021246}, 400);
				});
				it('"media" set to "integer < 0"', async () => {
					await get('track/health', {media: 2987223511203839}, 400);
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
					await get('track/health', {newerThan: 'GKvL1djfX3Wb4'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/health', {newerThan: 76.57}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/health', {fromYear: 'dP2I!'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/health', {fromYear: 71.46}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/health', {toYear: 'u$]P&l9mekigvsU'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/health', {toYear: 28.54}, 400);
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
					await get('track/health', {sortDescending: 'THlJJAZ'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/health', {sortDescending: 547300761927682}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/health', {sortDescending: -4877762598797313}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/health', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/health', {trackMedia: '8L!vr3LkoU1@hZwl(jM'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/health', {trackMedia: 1799696813129730}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/health', {trackMedia: -1912655132491777}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/health', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/health', {trackTag: 'BPsLR'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/health', {trackTag: 6858110064918530}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/health', {trackTag: 5281942039691263}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/health', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/health', {trackRawTag: 'IMAjl1jWs(WwLlQt)EU'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/health', {trackRawTag: 8080617858138114}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/health', {trackRawTag: 3814834340626431}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/health', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/health', {trackState: 'AIht3%]2(id%Ho#NaV'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/health', {trackState: 3136832564887554}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/health', {trackState: -7543917935329281}, 400);
				});
			});
		});
		describe('track/lyrics', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/lyrics', {id: '%PKbraod%p'}, 401);
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
					await getNotLoggedIn('episode/id', {id: 'JN74kDkYD*O'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/id', {id: 'M8tOe', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/id', {id: 'F2RVHfEg', trackMedia: 'a9UApq'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'iP0^tb%sTn%1(cgyQWV', trackMedia: -6348041216851966}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'KcGwQ#Ei4zciZy]ziDz', trackMedia: -7671119460958209}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/id', {id: 'aUYq@*)pQw$@&V', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/id', {id: 'GS3H5Ojx^Cws', trackTag: '555SO*Uz[Op2'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'iSQRxaa@NLm$alUV', trackTag: -638439795982334}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'c8r5Fa171P', trackTag: 639769805586431}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/id', {id: '*j8Ug', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/id', {id: '5DeD9Qn@r$Y', trackRawTag: '6Z!rJTV'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'hidVU&Bpk6oV%7MYR0P', trackRawTag: 3685439210782722}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'Ln0ApppyZ', trackRawTag: 3664830246420479}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/id', {id: 'V0P3BUMnBktvHh@ipw', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/id', {id: '0F&m8&j3lq&Z', trackState: ')IP!32pS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/id', {id: ']sWA0CjB1#3H', trackState: 6866342590283778}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'TW5aah4]LWDB3AM', trackState: -5516472046583809}, 400);
				});
			});
		});
		describe('episode/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/ids', {ids: ['iOceGZ#!GeaQ', 'r8UtN']}, 401);
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
					await get('episode/ids', {ids: ['nwFwFnp)Z', 'W$491lEyKp'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/ids', {ids: ['blg@33YouG[)RkYIHGDj', 'HRq]uBWEwm'], trackMedia: 't$W(Dc0aJ3'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['7y5n&7@@ECvi', '$vjIOc[!J@Q'], trackMedia: -1326603560812542}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['s^39A1QJ6A)#T0dIC)Y6', 'gP3)k'], trackMedia: 5539618782969855}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['Wl^1qnwqIcCd45h', 'QYdmNStsmAvrDu8a@NWp'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['EQ1FY$tZOG', 'RCg1HI'], trackTag: '*#sniEQY@oZHf5'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['9Xt#(AvUaa(3zE)ir6n', 'G9IEBP4Rq'], trackTag: -1935807199838206}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['2ExbM#3m', 'B(2X]&B'], trackTag: -5677067626610689}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['q$!3#N$ucWc&6', 'ePzCVp89oePtPzw3'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['yx^MTH)C@', 'h9fDVwL6d(g]O20Lo'], trackRawTag: 'gsb#740RZI'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['&[kXo2W', '@TKQVZqROud6[*AWM'], trackRawTag: 544328384512002}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['VN[W6Xm', 'aR@5M)ej[fM#'], trackRawTag: 7972583106412543}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['Wv@%&IXy', 'L55[#xXvOQJKrS9c!SUn'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/ids', {ids: ['Y%dfw3iRzp38i%tH', 'DxNhbi'], trackState: 'wQ]NA$qK9qm5a0[Jlj'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['sI(E8oz10HojOH', 'oBcVVZvYe9P#j9e$G]'], trackState: -8577308570943486}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['y(E5kSTJN8', 'p2E^p'], trackState: 4835787350736895}, 400);
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
					await get('episode/search', {offset: 'gHe2VE8JvfLWH'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/search', {offset: 4.99}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/search', {amount: 'lvot3W'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/search', {amount: 90.57}, 400);
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
					await get('episode/search', {sortDescending: 'JG3mhTs3Cx$v'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/search', {sortDescending: 2108658997526530}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/search', {sortDescending: 1904860114976767}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/search', {trackMedia: 'bqoX6TF#a0S'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/search', {trackMedia: 5429701770215426}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/search', {trackMedia: 5063422261592063}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/search', {trackTag: 'PJ57S]W'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackTag: -5741781861793790}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackTag: -4869521760321537}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/search', {trackRawTag: ')#rR%cBMK'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackRawTag: -7788578314649598}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackRawTag: 2475996225732607}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/search', {trackState: 'k4m1aJv8]@5GXG'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/search', {trackState: -7391578473627646}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/search', {trackState: -8457129962766337}, 400);
				});
			});
		});
		describe('episode/retrieve', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/retrieve', {id: 'DDa%rnFduE'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/retrieve', {id: 'DDa%rnFduE'}, 401);
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
					await getNotLoggedIn('episode/state', {id: 'MjdL8eRMSXFd6Jo'}, 401);
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
					await getNotLoggedIn('episode/states', {ids: ['6mGdAI@', 'sF3qG[dQCWhIHws3Pa']}, 401);
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
					await getNotLoggedIn('episode/status', {id: 'fW%Gofy)YW#U&p#g'}, 401);
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
					await getNotLoggedIn('episode/list', {list: 'frequent'}, 401);
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
					await get('episode/list', {list: 'highest', podcastID: ''}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', name: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('episode/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('episode/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('episode/list', {list: 'frequent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('episode/list', {list: 'highest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', sortDescending: '86I$5@lF$BPlY0'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'faved', sortDescending: -4430198892134398}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'avghighest', sortDescending: 8121515023269887}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', trackMedia: '6En[^vgSfGN^#V*#R'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'frequent', trackMedia: 499347892469762}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'frequent', trackMedia: 7493537423687679}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/list', {list: 'avghighest', trackTag: '!VFT!WCG9*vIXxL7ey'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'faved', trackTag: -711226011156478}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'random', trackTag: -3479993053085697}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/list', {list: 'faved', trackRawTag: 'cuRRx17EZ[xJB^Ldprs'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'random', trackRawTag: -3495633084219390}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'faved', trackRawTag: 5045838459961343}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/list', {list: 'random', trackState: 'xYO^NAf!l'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'recent', trackState: -6913347354099710}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'frequent', trackState: 8012948685455359}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('episode/list', {list: 'avghighest', offset: 'w%p*x'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/list', {list: 'recent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/list', {list: 'faved', offset: 53.19}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/list', {list: 'faved', amount: '6xMAwhwQLz43F'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/list', {list: 'avghighest', amount: 78.73}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('episode/list', {list: 'recent', amount: 0}, 400);
				});
			});
		});
		describe('podcast/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/id', {id: 'O[sRV#%t^tYxA8T'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/id', {id: ''}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/id', {id: '7bKUC34(^2v*^', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/id', {id: '[JyG0dJSB%!', podcastState: 'igy(L%d2BPhkkgvC3um$'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'Y@8hje', podcastState: -5402679740203006}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 's!]N^Mhcz4&jq@w4IVx', podcastState: 5039061190311935}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/id', {id: 'r1bof$N0rBj$8wj!Z4)7', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/id', {id: 'GEtV8Hmcic@', podcastEpisodes: '55rJo'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'QW#Fv@&7X', podcastEpisodes: -5554963891617790}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '1IEPsklIegYtU*66RxVi', podcastEpisodes: 6128040698445823}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/id', {id: 'KQD!KO', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/id', {id: '7B1v%%chJz', trackMedia: ']IWP9&O1TV'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'huUcHH', trackMedia: -948088676024318}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 't]J]bLiOCO5^r@', trackMedia: -3905566942429185}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/id', {id: '@WR4JV2ueN@h9', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/id', {id: 'fmFv@4', trackTag: 'p%Y5#**5NUW3C^'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'oaUodlS', trackTag: 4664888634900482}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'lFEFfGp8T', trackTag: -5450893822525441}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/id', {id: 'nOPrg8RP$', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/id', {id: 'p*GcB91', trackRawTag: 'I]Y7s$$r0WPN9nKk%J'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'g(xSTzOX4TsudVM(BO', trackRawTag: -5399286946725886}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'H4s3Ckgy8Q[hx#RI5@', trackRawTag: -2283029762408449}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/id', {id: 'ZbSuooTZj5%ruNY7(', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/id', {id: 'PG)hBtRFLhp', trackState: '^CMtuECxcg^Coe!ch8'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: '*&bz8N9$0EFP^G7', trackState: -4774459974090750}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '(Ofl2jPZ&Hi!$o', trackState: -7674125153730561}, 400);
				});
			});
		});
		describe('podcast/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/ids', {ids: ['nyZ624bFThugzw0wtD', 'DtIS]W']}, 401);
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
					await get('podcast/ids', {ids: ['YVJFe)RYKLh[DTSwfn', '^iF@86!jrfpqb#mz'], podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['AgbZQMWq%', 'T*Y8uIGoVC8#lvB'], podcastState: 'PtRAw0A2O@'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['im&1fgS6]6o!', '!nhwJ8USl7)aIEz9'], podcastState: 629603064348674}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['FUh6mUBZv($7g', 'nGyr0[T(vQ&J@)#)x$'], podcastState: -955179813830657}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['Lc4YY]D#maX%!s*', 'fU5qITdK6xHgr(71g'], podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/ids', {ids: ['8K$^mCSB5sQv$1&UQE', 'y)u3@%$'], podcastEpisodes: '5jAPs5]'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['je#7N$', 'NSS20$cs3)'], podcastEpisodes: 1062712935186434}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['62ld#k9%', 'V6^XjP0'], podcastEpisodes: 1812693979758591}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['SK#@T5dG640hmTvA*Lb', '95jw6cp9Mr!GLrcL7No'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/ids', {ids: ['sln85pw&s45yayR', 'RETj9KB(47g)9'], trackMedia: 'TYp!MUhhNYsA*#*uY9q'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['5BxjpqY2amZ&', 'cyI]WTL'], trackMedia: -2790980675698686}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['Y*JXMuBp1jk]', 'p#h6ht$@5^w@OLxhalA'], trackMedia: -4095098262388737}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['TCPeg4j(zc2Xp', 'ArVB&[O'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['O#4lx^jygm', 'O&]qJWPE(oVjI%'], trackTag: 'D&xz1KVOIczk)VgoLRv['}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['w9hAy^Tj^WGKF3Y', '(]RGxn2XR2g'], trackTag: 5988298027696130}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['*MWr*', 'OHIoScmi4IBm4VR2dsk@'], trackTag: 6392543172362239}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['E8iAZKa', ']u8DFYTkMzvwiCVsf0s'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['e[SODO', 'lqAKPwET[*kL$'], trackRawTag: '&[VY!dUHpR3p!C!@RS'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['x7xT6xaN', '1!q$EusSiz'], trackRawTag: 4665606318063618}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: [')XjGPO*#', 'Ou*4VLFPcFbG5'], trackRawTag: 6258349981040639}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['d#9*Mnq[h', 'esCZG5(Zhywz'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['jqes[Mq)tC44TP5v', 'vjkok]]i*AKX'], trackState: ')BId62h'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['!nK8vL', 'JwcOr8rX7XyutNdF*'], trackState: 6842841875611650}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['B)NYdzTFC3P(b', '9c#1dZRwQ'], trackState: 4692910767341567}, 400);
				});
			});
		});
		describe('podcast/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/status', {id: '2oF1*NW'}, 401);
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
					await get('podcast/search', {offset: '^]LYInrjVM1qGW*]%m85'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/search', {offset: 75.19}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/search', {amount: 'oY3!R'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/search', {amount: 6.46}, 400);
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
					await get('podcast/search', {sortDescending: 'A*##gzp&'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/search', {sortDescending: -336410796097534}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/search', {sortDescending: 4581219685629951}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/search', {podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/search', {podcastState: 'uZ&Fz5E][QZ[A(BD&&'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastState: -879769428164606}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastState: -5995450695942145}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/search', {podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/search', {podcastEpisodes: 'a%6rdPEW*'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastEpisodes: 7654267997388802}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastEpisodes: 5541712877322239}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/search', {trackMedia: 'p3nv$5hj323S'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/search', {trackMedia: 4297751961534466}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/search', {trackMedia: -7806503876558849}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/search', {trackTag: 'TQ&7Mp^9@o@dSNtD6)M'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackTag: -1545939223314430}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackTag: -6202283964497921}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/search', {trackRawTag: '@E*Ue6Xs'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackRawTag: -1345103096446974}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackRawTag: 3927945752084479}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/search', {trackState: 'oLr2]VMlm*4lBzH'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/search', {trackState: 6501605213995010}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/search', {trackState: 6465181282467839}, 400);
				});
			});
		});
		describe('podcast/episodes', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/episodes', {id: 'u7Unu^5^syE2#nbQ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/episodes', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'a[CyalbMfbj)BJS[&*', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/episodes', {id: 'eq%P[PDE04V4So1In', trackMedia: 'ncRpKaBSx[yP3)L'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: '$XAg!wk', trackMedia: -1101937017618430}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'Cjrxfdo', trackMedia: 3589078821896191}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: '490Cj', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/episodes', {id: 'HwR&Mb^oQTFluOv*', trackTag: '@w*2g'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'BGN)$wW)5uW2A#r#rBWA', trackTag: 2698700216336386}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'L3Bl)9x5V', trackTag: 736586358587391}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'kvq%12*E3O5)jsL', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/episodes', {id: 'K4G[uc', trackRawTag: '4y#RiU4K5De'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'D!X@H^oSO', trackRawTag: 7039251912851458}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'jSXKSj2%tC]%iG', trackRawTag: 6579150726889471}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'bDuf1P0[JP', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/episodes', {id: ']COAW', trackState: '4sJbt$wXED$'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'TcXbYjBeMpv5GEH', trackState: 1854874165706754}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'Gom#oZRTd', trackState: -5517283795402753}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/episodes', {id: 's%5W5vG@WH0&Z', offset: '[v(An9fo8$CF'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/episodes', {id: '1Es2TU', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/episodes', {id: '268SotVH', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/episodes', {id: ']ae)NhsQzy#1r]rgv', offset: 5.07}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/episodes', {id: 'fy#CnBQ4L6L8', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/episodes', {id: 'O]BboBzBrPyePw', amount: '$!jAc'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/episodes', {id: '@wW@[rpL6xNLVHU', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'v))YV1E(L', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/episodes', {id: '1$2igo*Ay&yhg@4v', amount: 46.87}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/episodes', {id: 'KV&*x@2)Nz$UCotYoxKB', amount: 0}, 400);
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
					await getNotLoggedIn('podcast/refresh', {id: 'dq8pFYBr9q'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/refresh', {id: 'dq8pFYBr9q'}, 401);
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
					await getNotLoggedIn('podcast/state', {id: 'LtGQ9Bk95'}, 401);
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
					await getNotLoggedIn('podcast/states', {ids: ['xUz24dUi3ay7A1C@', 'a2jW8']}, 401);
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
					await get('podcast/list', {list: 'recent', url: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', title: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('podcast/list', {list: 'recent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('podcast/list', {list: 'recent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', sortDescending: 'JcRb1Y'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', sortDescending: -5046069922627582}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'faved', sortDescending: -2157192220246017}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/list', {list: 'random', podcastState: '2#uJX]o4%e'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'highest', podcastState: 7893542772932610}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'recent', podcastState: 6524276874149887}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', podcastEpisodes: '4gbkSQ$zbUE8%Gi*cI'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'avghighest', podcastEpisodes: 2650002845335554}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'random', podcastEpisodes: -4302130278039553}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', trackMedia: 'uajq7B^)&jq6bv5'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', trackMedia: -5565936807444478}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'highest', trackMedia: 1407663267119103}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackTag: 'Pc&*oKtqiT[1K6Vh)'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', trackTag: 2178093829586946}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'random', trackTag: -216440380588033}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/list', {list: 'random', trackRawTag: 'DR6$rC!Zx!0RqNuCK'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'avghighest', trackRawTag: -4478179557244926}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'avghighest', trackRawTag: -4353918582652929}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/list', {list: 'highest', trackState: '@AFo65j@AdB^GXw&'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'faved', trackState: -976678318768126}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'recent', trackState: -6919491954933761}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/list', {list: 'frequent', offset: 'x2&m%f'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/list', {list: 'recent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/list', {list: 'random', offset: 2.43}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/list', {list: 'recent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', amount: 'znby(S$9L#gFyhMg&jWM'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/list', {list: 'recent', amount: 40.62}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/list', {list: 'avghighest', amount: 0}, 400);
				});
			});
		});
		describe('radio/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/id', {id: 'Qk(swbGUvz', radioState: false}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('radio/id', {id: '', radioState: false}, 400);
				});
				it('"radioState" set to "empty string"', async () => {
					await get('radio/id', {id: 'XM1cjS&!)', radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/id', {id: 'h$oXRve', radioState: 'CQfhq'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/id', {id: '7DQaZug13f2PO', radioState: -7607265875984382}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/id', {id: '#e&F&rVrbYg', radioState: -4374304707837953}, 400);
				});
			});
		});
		describe('radio/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/ids', {ids: [')BYkgkkd(pEgOK', 'xzo^pdmTTJ[2Xb]'], radioState: false}, 401);
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
					await get('radio/ids', {ids: ['nUqGW[oeBzWKkAYT1', 'qaFDHV3K!]JI3ae3x'], radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/ids', {ids: ['ZjFKL#', '%df)Z&N'], radioState: ']pi&vl7SD'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/ids', {ids: ['JmJ#p[]5W$@bwk2un&]', 'PiGaRKgVPU*D'], radioState: -2467376842932222}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/ids', {ids: ['M^lM0@gBOPPR8@an6P', 'X(3oUedV(T%hBU^'], radioState: 2823940460249087}, 400);
				});
			});
		});
		describe('radio/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/search', {radioState: false}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"radioState" set to "empty string"', async () => {
					await get('radio/search', {radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/search', {radioState: 'en1fhqQ'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: 4769608712060930}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: -1457359926853633}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('radio/search', {radioState: false, offset: 'OvY&SVu'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('radio/search', {radioState: true, offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('radio/search', {radioState: true, offset: 38.31}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('radio/search', {radioState: true, offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('radio/search', {radioState: true, amount: 'c!aspEwivG1r@&B'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('radio/search', {radioState: false, amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('radio/search', {radioState: false, amount: 19.14}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('radio/search', {radioState: false, amount: 0}, 400);
				});
				it('"url" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, url: ''}, 400);
				});
				it('"homepage" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, homepage: ''}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, name: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('radio/search', {radioState: false, sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('radio/search', {radioState: false, ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('radio/search', {radioState: false, sortDescending: '4dV6#xb!renl'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: false, sortDescending: 2319032388681730}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: true, sortDescending: 51058457968639}, 400);
				});
			});
		});
		describe('radio/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/state', {id: '(SoE$&A(alTih7o[Q)Z4'}, 401);
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
					await getNotLoggedIn('radio/states', {ids: ['F7a(cOk6', ']$yQ7*H@gBS']}, 401);
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
					await getNotLoggedIn('artist/id', {id: 'YFtlxdzXu2IKF#'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/id', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/id', {id: 'S*HimxZCl9eO4@so[', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/id', {id: 'g05fe^HoH', artistAlbums: '5hh6LRsq@kNN4)QpV'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/id', {id: '1&1UQe1a*CKN', artistAlbums: 7405659846868994}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'Sw2Fk', artistAlbums: -705577202221057}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'QzB]zmI%8A(q', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/id', {id: 'h[%WY', artistAlbumIDs: 'nFZ9x%[)ptd94Aj3WZ50'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'k4rt$', artistAlbumIDs: 6096048950870018}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: '[vu8W3kTRljsL', artistAlbumIDs: -6284569166741505}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/id', {id: 'RQuI^ty!vgLb', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/id', {id: 'un[Ulw[tAC!sx', artistState: 'd2]F#zfdv[@&B*'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'Tw1ozwK', artistState: -1663307652005886}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/id', {id: '58H923w2pnk3Czo&#', artistState: -1966182647201793}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'zarMq#68^3', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/id', {id: '2^uS%3Y4WG8FQm#8]', artistTracks: 'IHxwb57NaEi0K3!g%bM'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'okp8#okF[7(PuiC!wj', artistTracks: 5393745763631106}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: 't[8@Pog(t*hpWdv5P@', artistTracks: -503295890161665}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'Y[w3lT6TOr^A%f$zb9', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'QWFl)[!', artistTrackIDs: '*@s)G'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'c@yGIb%QyZ*h2%P$@5e]', artistTrackIDs: -7268214924902398}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'J4pAn1qmNv&K3GgM2FyD', artistTrackIDs: -5581484006047745}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/id', {id: 'EJSSzV)9', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/id', {id: '*(P%r', artistSeries: 'vQDa1mbUqqfB9dHwzqS'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/id', {id: '4DKx]Y%5y0I]cAQ', artistSeries: 1017554453659650}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'hewWS&C3gy*1D8Pl45', artistSeries: 3193964211470335}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'mkPrg95)CLm(osZYQz', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/id', {id: 'n$s]KjKef#cE6q7E', artistSeriesIDs: 'fy%VqNF'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'u1uiB^AX%64', artistSeriesIDs: -8877216280608766}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: '%1]I2m!bdn', artistSeriesIDs: -1051790443282433}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/id', {id: 'RU3m62wM)EYIgFE', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/id', {id: '(Hl5tX1FwFpmp@', artistInfo: ')x)oFc7$)h$JTPN'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'CzM1^AmwsWbjCB2@Ydz$', artistInfo: 8480479481167874}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'N7I(f', artistInfo: -7245398326378497}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/id', {id: 'z%O3ji^', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/id', {id: '7iMou4QumNC#AbpRj3RU', artistSimilar: '!q#Qrl(]19m'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'SmO1caRRgC*F', artistSimilar: 7963535577448450}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/id', {id: '53b1UiCs)gqobA]pC1', artistSimilar: 7352878968602623}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/id', {id: '4CqqC', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/id', {id: 'UublvMMl%c', albumTracks: '!)IrZqxPX*rhE'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'NgzoWtGGSA*!', albumTracks: 1541788259057666}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'AoAy81lqf2FX*p', albumTracks: -2021558763651073}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'Cb@!TErDEc7dbzY&Hm', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'IgE[U]&', albumTrackIDs: 'TRBh#Mr0uT0bm2)7n&'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'y*kYSeV', albumTrackIDs: -3449608755740670}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: ']PyVY', albumTrackIDs: 640119258218495}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/id', {id: 'TDHel^sbT6Ds9GkNk', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/id', {id: '5W$JMaxJ7', albumState: '(BoFJJ'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 't5LcATW0F4', albumState: 156237492649986}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'A53mKjOyTcdv6zEd3w@', albumState: -8339387267940353}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/id', {id: 'Pdsi!ZMbl%11M[U', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/id', {id: 'ltMcbVBF)B@sSda', albumInfo: 't)Gd)eTWo6^yAcR'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: '%Bu(&)Mi9h8a2', albumInfo: 8945835236655106}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'y)motf@Mil&E#Z#%', albumInfo: 3555491531718655}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/id', {id: '5JNQtM1]v', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/id', {id: 'qNWmfULUc$5yTgc8rl', trackMedia: 'yA#8T'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'Zds^gIuP2l2e4JW24*', trackMedia: -4017978274217982}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'a^oyYdZvL4v^7Djy9', trackMedia: -5722648982061057}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/id', {id: 'yq%73)AkEcZF9uIeLJ6', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/id', {id: 'luMEzMKxF', trackTag: '(w]2%!5g[O%^BF'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'Z0DRiEr0K6](p1cQa', trackTag: 5346037015248898}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'xtD4mk%K@mRl', trackTag: 5204716929679359}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/id', {id: 's$HU&wsXU)', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/id', {id: 'RrREcXnh9N', trackRawTag: 'MOtA2'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'R]Jq77XmjhNau', trackRawTag: -3892346206814206}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: '3KRxP1&*#7o', trackRawTag: -4976511241158657}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/id', {id: '6wS5D#6%', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/id', {id: 'RWU1uTGQN&5V0EvWNY39', trackState: '[HYU6rw*A%9kh)rJaG'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/id', {id: '(coy#K5JMLZGJ', trackState: -3356128272449534}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'a!fRHEETNr7', trackState: 3400327969636351}, 400);
				});
			});
		});
		describe('artist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/ids', {ids: ['m%GAkiuCGiyJcJ', 'ze$%4VvW(5X9t7']}, 401);
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
					await get('artist/ids', {ids: ['mr((Cw', 'cX8mP3VIylfudJ8Q'], artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/ids', {ids: ['cXx)k5gp0Z', 'S0o[VSeZCQ5kX]cr!'], artistAlbums: 'jjIx6$OIN'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['fb)oN3bM8iNbfMu$TCks', 'TvKAKWpOrS(b#]AfFR'], artistAlbums: -3025367312891902}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['c0n(H6M$qcdbk1^', 's%3iA'], artistAlbums: 770883610214399}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['$RT(HB6!m4pa[l]', '4eWw5B)hA$R'], artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['[WeH#', 'B(*!ee0OBHnQ'], artistAlbumIDs: '5E!U$ne9Vahkqo'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['K8QeW%', 'c(5!yAxju6h@'], artistAlbumIDs: 7883336760426498}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['qar5j$$a5*AG3VGjTHhQ', 'Q4cmnV'], artistAlbumIDs: -644464846569473}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['TDY$FrNWYP', 'KEPwd)B'], artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/ids', {ids: ['tFk[zSxt4', 'YcYfZtEr5U'], artistState: 'v)ZdWRYXD'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['Qr]JlAao)U6s', 'X17]h^6jFa7Y'], artistState: 2716225192853506}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['PZY!w&b2', 'CGs7ctw!'], artistState: -7245008457433089}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['KSGhk', '*dmR9efYUE(Pec3lw)'], artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['eqAngGL9shOM', 'eCYt!'], artistTracks: 'sswWHqA0g^)SbOB'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['f%KVcT*cOKL', 'KB@31o'], artistTracks: 791847014236162}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['p1xR@CZAXp$)', 'qNMg&aQDtdl5260Wk'], artistTracks: -5577020444508161}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: [']]eb^s6YTw', 'spGUB'], artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['TrPvDU', 'dgyiPOal$mumy'], artistTrackIDs: 'u#e5iYclsqn(VL]FKp]&'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['j4#1]pK]3%hdP33', '6hNTxK[XA!S^D'], artistTrackIDs: 6785840176955394}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['MwlxvjL', 'd(*9lNU4pcCfWC]HtNI'], artistTrackIDs: 680773938053119}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['JFDX(V', ']DxJGLNKKN@WA&gqt^Yi'], artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/ids', {ids: ['VhfYh', 'KHsVthIkwSX$2K'], artistSeries: '*5PhLrSo^]YFt$psy'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['[)WB3$%DD', 'p@H5K'], artistSeries: -632156137193470}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['%ZYrPlt1a', 'eSYUZ'], artistSeries: 1341462994223103}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['&Iv91', 'Z5H4b4eH6KxC&OqoL'], artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/ids', {ids: [')L3vPN%29Wl8][B', 'zUtCj8)TDfZ!KC[*'], artistSeriesIDs: 'JNd!^X%'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['*66^G#NpD9V^kMd]t', 'GZMHws*XJ'], artistSeriesIDs: -7600662472818686}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['u7**rJyId', 'w7Qh[xDpDiM1*Ub'], artistSeriesIDs: 25761608105983}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['pO@$30&V3D', 'Xs$6%ru(Eyk'], artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['dZ)@u7lMqs2$Rb)BF9!', '!iYm#ysDCPr)5i4t'], artistInfo: 'vbAtJZs[(*i(qjVXD'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['[QGRzbdI$O#[x%Yy7Mf', 'W85$1qa*$qE78GZi'], artistInfo: -4539919619850238}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['uhWtbqI#IY*l#WX3g2e^', 'TOqiWrBNOMFUN!O0e@yD'], artistInfo: -6695006014275585}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['ous6O%LXHWz5L', 'IsTAF)zWU%bwRbp88s!x'], artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/ids', {ids: ['y^Ctoc!hw(lPZ9O@', 'H#&P%FKRl@ZC%B'], artistSimilar: 'DBT6LOFy9BgV5O*'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['GV%#Zex!fo#Hs8EH7z#C', '@e[dTe0OatAHK]lze'], artistSimilar: 6805573739741186}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['uZ9$A', '@WFVDMt'], artistSimilar: 8069941991309311}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['w*G2j', 'rx8Ccs2rD[Yv'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['d]1sRd8TZDIMoiS0W6L', 'n&gw]d'], albumTracks: 'qlk[*!^ow*]r9('}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['tyW5(%YDGxy@#', 'KD%@4YJ$bxt2'], albumTracks: 7631312563208194}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['5$X11RbTs@Tp8#vvK', 'E6BwRx&VEojGU#oCFE'], albumTracks: 3364960033832959}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['uKKSzZ[[$yTu*Kb&S', 'Ags%NUqE&RT9BjM'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['u3pFw7]HeB(jbQs%bC', '94oTul7^Q!('], albumTrackIDs: 'wC0!j[Hj'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['F]IfeqDN1', 'T]IfEk24'], albumTrackIDs: 6298764578914306}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['ypO6WeyCt', '&a$N*0%[WVjuC$'], albumTrackIDs: 7308594215124991}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['dCWVE8', 'Co%wM3mf9q!6Cu]rw'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/ids', {ids: ['uv&(Jyqib&zW]@!2r@', 'PsPILkhc7Hnqw8arIu'], albumState: 'EC3mYun'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['Xrvx^%E2&8F$$2JS', '64^oiy1[o8wm#)C'], albumState: -5338778306609150}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['WG]U9n]IJHSPbNT', 'F%jO&in'], albumState: 3490585298075647}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['7BuuBpbBU', '$wl]1sz82lakEhO7G'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['RnyPayLcq4)*X', 'HN4*kEuk4vg'], albumInfo: '58diNz5YTjkodqSnG0m'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['%Q2dH]c#s*nmRf5q&2', 'LU%S$HmzOIX*zj0*u'], albumInfo: 2040351548243970}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['jX)b[37j', 'SNpy)jSq)LfzpS$RD'], albumInfo: 7786060654313471}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['2^o&fb@w*J', 'gmp8II*)Gij]vWOiy'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/ids', {ids: ['ePEB]sgjDEWmk', 'aDfR[L%#U2@^bk%i'], trackMedia: 'nPB5X2n0#'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['GqBuse28', ']2^vaqmeb[x^FWj9IT'], trackMedia: 8403655665385474}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['#Qtb6hh', ']NRmKk'], trackMedia: -1119264094289921}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['X!j*YCi1Cd(', 'oSAl^ll#CcUah*8XdLF0'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['HGkWJ)GVQp42w', 'jR2#XrWZ&()M(w&I['], trackTag: '1waIe'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['7Z8OD0q$c', 'twgx*66zWYxDZMv1tL4p'], trackTag: 8298860250136578}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['sRt$Tth0H4gMt6P', 'U%z9U)KUPP%!s'], trackTag: -7968146191286273}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['CpUh4]@kOP*]CNcF!j6', 'v6RnKmMn%5q[c9%'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['S(fel7X(t^]zYBZW', 'M%HgvZA2eQp4#Qb'], trackRawTag: '][9s&MKEtzc((W)kkQ0r'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['@h[t1HB0E@@vvg6BQx', 'z39728UWLwCKztt'], trackRawTag: 5984689936400386}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['#OzdToW^8G9FdK5OC', '(r!%68EAb'], trackRawTag: -8930786497527809}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['E7k$MLsAl[FB^PQ(]Fp)', 'F#xy]AgcG)P'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/ids', {ids: ['6X7knf8McP', 'V2ptS$zn*C'], trackState: 'zDw0t'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['wN0j)n', 'i@eiC6sR7%GvDFDz1caM'], trackState: -1966421915467774}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['og0twB#W7LLvtl', 'mD^4e'], trackState: 1197005367934975}, 400);
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
					await get('artist/search', {offset: 'e%3ZYjE'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/search', {offset: 57.54}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/search', {amount: 'fZQN)FxL%d%8k'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/search', {amount: 28.03}, 400);
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
				it('"genre" set to "empty string"', async () => {
					await get('artist/search', {genre: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/search', {mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/search', {newerThan: 'RMPyE1uKe'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/search', {newerThan: 42.86}, 400);
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
					await get('artist/search', {sortDescending: 'A7vzg'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/search', {sortDescending: 5537550500364290}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/search', {sortDescending: 6871893554495487}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/search', {artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/search', {artistAlbums: 'N*oNI7uiu'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbums: 5980216128176130}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbums: 4805004821004287}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/search', {artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/search', {artistAlbumIDs: 'pOjiQAc35o]bo'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbumIDs: 2521549894582274}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbumIDs: -3218129790435329}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/search', {artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/search', {artistState: 'DHee9I2hu#hqzMm[iigt'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/search', {artistState: -2232332731809790}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/search', {artistState: 382665857433599}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/search', {artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/search', {artistTracks: 'kxnAHN'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/search', {artistTracks: -4442536949055486}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/search', {artistTracks: -7545586861473793}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/search', {artistTrackIDs: 'Dn^tuzD32I2wcn]qqZ'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistTrackIDs: 3354510080606210}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistTrackIDs: 768089398444031}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/search', {artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/search', {artistSeries: 'K^^5HQ9AR6Irmm9#YKt'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeries: 8877804372361218}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeries: -2050311019560961}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/search', {artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/search', {artistSeriesIDs: 'gWC$2[W#m'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeriesIDs: 7188229715394562}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeriesIDs: 8390149016649727}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/search', {artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/search', {artistInfo: 'nnR@P*C&OJ2'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/search', {artistInfo: -865127603634174}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/search', {artistInfo: -6879577964019713}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/search', {artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/search', {artistSimilar: 'OJdXh7azzVn6xBX&Hz'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/search', {artistSimilar: 4158266900742146}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/search', {artistSimilar: 6198585670500351}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/search', {albumTracks: '&21%^*F[!M'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/search', {albumTracks: 206019112206338}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/search', {albumTracks: -6902049161609217}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/search', {albumTrackIDs: 'CZ!28(c^4raWjcMi2tdX'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {albumTrackIDs: -2610125277757438}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {albumTrackIDs: -5484429241745409}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/search', {albumState: 'z!vFD'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/search', {albumState: 6785727161434114}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/search', {albumState: 2082392718180351}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/search', {albumInfo: '2LbD$RdMU#O%Z'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/search', {albumInfo: 3646908480356354}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/search', {albumInfo: 4555318239428607}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/search', {trackMedia: 'JcnyUjN^kmF9Bk@9'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/search', {trackMedia: 1455227777581058}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/search', {trackMedia: -8001008378576897}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/search', {trackTag: 'OVAt7F3Cf(rQKAr'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackTag: 5790738117820418}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackTag: -515114562224129}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/search', {trackRawTag: '#&w7[lchHsfDTko2b'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackRawTag: -2362495180210174}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackRawTag: 6673455495774207}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/search', {trackState: 'ZmR&kujbgdS]8zqBti3k'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/search', {trackState: -2693753441615870}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/search', {trackState: -7580873067069441}, 400);
				});
			});
		});
		describe('artist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/state', {id: 'saFXL&f'}, 401);
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
					await getNotLoggedIn('artist/states', {ids: ['oY5nIxNB', 'D8DmPc%e^IzPd']}, 401);
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
					await getNotLoggedIn('artist/list', {list: 'recent'}, 401);
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
					await get('artist/list', {list: 'recent', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('artist/list', {list: 'faved', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'avghighest', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('artist/list', {list: 'highest', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'frequent', albumTypes: [null, 'invalid']}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', genre: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/list', {list: 'random', newerThan: 'dOg4hj1k4R'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/list', {list: 'highest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/list', {list: 'avghighest', newerThan: 80.72}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'avghighest', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'faved', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('artist/list', {list: 'random', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('artist/list', {list: 'highest', sortDescending: '#6!6Cy6Ich5iIt@(gA4'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', sortDescending: 5510807735500802}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', sortDescending: 8405531794341887}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', artistAlbums: 'tJaY2'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', artistAlbums: 4296009404383234}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', artistAlbums: 1535734129360895}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistAlbumIDs: 'q0TdnD8itpCTv6(N2#%e'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', artistAlbumIDs: -279242705207294}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistAlbumIDs: -3598112614514689}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', artistState: 'FrqeXQQ^1@9D['}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', artistState: -283384928534526}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistState: 3094020259577855}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', artistTracks: 'htgeq^M@@QAcjJk2j'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', artistTracks: -7102556622815230}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistTracks: 8810491438694399}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistTrackIDs: 'S6BGs[YsyfY^GmpU2q[a'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', artistTrackIDs: 2573517279199234}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistTrackIDs: -1173438853021697}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistSeries: 'wtN9e3c!1%32%2D'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistSeries: 5184246171828226}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistSeries: 4137631239634943}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/list', {list: 'recent', artistSeriesIDs: '67ho(aBMUo'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', artistSeriesIDs: -2968984072749054}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', artistSeriesIDs: -7191184187326465}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistInfo: 'sHJD]V%bj*B!z[ntHms8'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistInfo: 3523039203426306}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', artistInfo: 8599122252660735}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/list', {list: 'highest', artistSimilar: 'Z[JIdglytXCRFpELjM'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', artistSimilar: -1913953563181054}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistSimilar: -1171569829216257}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', albumTracks: 'iAQN%^Y17*Pio%HT*ye'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', albumTracks: -2890539674370046}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', albumTracks: 8659217103716351}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', albumTrackIDs: 'QNf#$RG01dBzSw'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', albumTrackIDs: -514482321227774}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', albumTrackIDs: 1684041220751359}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/list', {list: 'highest', albumState: '*5[US0cgOQ'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', albumState: 2611316766277634}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', albumState: 143655906050047}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/list', {list: 'random', albumInfo: 'AtrMbI43YwV7rBuwMams'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', albumInfo: 8490565884706818}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', albumInfo: 302323452608511}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/list', {list: 'highest', trackMedia: ')aN5fUrmT3xts*k6'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', trackMedia: -512356404690942}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', trackMedia: 2125998975877119}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/list', {list: 'faved', trackTag: '*(g%GFS(yfs266'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', trackTag: 8109038847918082}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', trackTag: -2919663633694721}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/list', {list: 'faved', trackRawTag: 'ieyR(g!*#euM[M*&%%1]'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', trackRawTag: -6001182170415102}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', trackRawTag: 1957983772737535}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/list', {list: 'faved', trackState: 'mqzV3GGfA%59youVV'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', trackState: -7035431036125182}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', trackState: 7419019988566015}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/list', {list: 'random', offset: 'jNk2k'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/list', {list: 'recent', offset: 36.88}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'avghighest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/list', {list: 'random', amount: 'j#zH7!vJa!w5w6jg'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/list', {list: 'random', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/list', {list: 'frequent', amount: 77.18}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/list', {list: 'frequent', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar/tracks', {id: 'Z2RaeRsgrBpv'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'KrMN8qBEcYdxU', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar/tracks', {id: '7g5Apz', trackMedia: 'wH)re4ob(p)T]iLIu94'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: '#1Y!COYBmc0pOW!k*', trackMedia: -7962802446663678}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'gCRW2n]E', trackMedia: 5748946844516351}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: '6dkQ8]IF(*mc)s', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: '9i4@CL5yG7Mq@2sG', trackTag: 'LMfJ5!QVC(&GWZ'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'MgmDuY$rSaSg%36EsQK', trackTag: -4487040997523454}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'x)5V2LJxx', trackTag: 6977646634205183}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: '&$e3jYP54C]oTimv', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'ot*%oq2', trackRawTag: '%di8Qq16'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'VWO5QjSYr', trackRawTag: 2519523420798978}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'IC!m0uC', trackRawTag: 3397055871451135}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'qdRUmBpP#TClnD', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'S2uQ6Ev', trackState: 'j$RiBfK4Eh'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'M^jKizm[GHpA', trackState: 471368600649730}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: '(A(gxinVmv)v2p$3cMKp', trackState: 3423260863627263}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'Sy&vTJ90cJ^PYu#$', offset: 'H@HL!jQM'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'A28PDaFB0kk)ska', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: 'R7zIrD9*#4xk]$W', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'K1@ZZ5j]', offset: 4.35}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar/tracks', {id: 'g@ekvRx', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'msGnkXGLUB7^', amount: 'Ma23HjzitJBXQREwc^]'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: '8VA9ZhM3NswD5Wr', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: 'c@LP94T*^2$mD@fhG', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'GaOAKbCi^Cfv0QsE*j!', amount: 56.61}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar/tracks', {id: 'umgH2XnQJIvPC9$E', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar', {id: 'fT8KZR4TAno9QLP]gjCS'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/similar', {id: 'iYQ7s9qbS$GkNyP4gT', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/similar', {id: 'qY)%sDt@[K[j%TD&!dM2', artistAlbums: 'zngC1j*pp!uU4'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'EnIV(l[wqZqp8nzdE', artistAlbums: 3070378519822338}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'mxTp^ybX)bc7*', artistAlbums: -1080800074268673}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: 'CbZT$xD#', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/similar', {id: '!WfIP^JPNz#dqQ)', artistAlbumIDs: '4Th55uIBin6IiAgSNk!X'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'a5qoOZ(I8iZOV(FBS', artistAlbumIDs: 6967024936812546}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'CNoJ2UQ', artistAlbumIDs: 8096937056141311}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'nmQXg%t5&tneF9VHTcaw', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/similar', {id: 'BL](*awH7k$pvX[iTg', artistState: 'YDwnuHxXRS'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'cGw3adS', artistState: 3066963945324546}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'vQ&Yjzhrs8reTb', artistState: -7567016386887681}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'S13Oiu#w%t!rlJ$0Na', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/similar', {id: '8a44T*v5N&JgpOvO0', artistTracks: 'iqXS(1M#NrJP@ZW3rL(5'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'VOY@#DfEzkbR', artistTracks: -4555051741741054}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'jNq8(u3vP#rjM', artistTracks: -2216379918843905}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Tq(nmy9JtuK', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'nhq%vH4', artistTrackIDs: 'vcCvM'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Le@8ADdlX1WpuN4s%e7', artistTrackIDs: -6762548057604094}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: ')CiPzjGa#JF', artistTrackIDs: -7375919727509505}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/similar', {id: 'gz7M9uAgy', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/similar', {id: 'GHPma8', artistSeries: 'TaxRt'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '36KvPj@*i', artistSeries: 1581434175225858}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'AC!vS&Zigjg', artistSeries: -3066699670618113}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: 'uHWD#^PYz', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/similar', {id: '9Ti9^jjN', artistSeriesIDs: '7y])wl!L'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'J]EqKucY0A', artistSeriesIDs: -6423338196926462}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'o[70YMtfO8%EfwBY', artistSeriesIDs: -798110360010753}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: 'VNuPwyDrAu95qE2xAZtK', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/similar', {id: ']Js#6E', artistInfo: 'p1Z$N'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'YMJYKk*)5ljq!Xrq^l', artistInfo: -2416869826887678}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'dq3r4#38aQt%', artistInfo: 1871465775366143}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/similar', {id: 'bM@H1klhJZ[$8nlwM', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/similar', {id: 'd!T35&wVTZ)LNm&SAwiL', artistSimilar: 'auc3O%ppQTCdq'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'iyIdH)Fi]G', artistSimilar: -7445955049684990}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'TI[2[UJwnGaZt0%VK', artistSimilar: -2735746402222081}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'n2aR%AtRB1*', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/similar', {id: '5H@ICgWj!', albumTracks: 'NSTLDaBf#t0G#!'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: ']sxP!h&TojKrTU', albumTracks: -7808428634275838}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'aY4aNHSg', albumTracks: 2037363714818047}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '5#cmy%ceR[xMj6t', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'J#TLKrYD6YKF]U@d0!zt', albumTrackIDs: 'yg(OVnagsnwIr'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'MXq0#e*WZ', albumTrackIDs: 7127883323539458}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '&Pb%I4C4oV', albumTrackIDs: 340208482516991}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'DEw671q', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/similar', {id: 'lX*Hlo^z6GZe%T', albumState: 'aqs4rfc1mek]PKjWbrl'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'ieG37[YX8', albumState: 2609702328336386}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '$Fhk@]8C(Y1', albumState: 7499081903505407}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: 'bD!Fe]a5kxZ%L)!', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/similar', {id: '!xGgck33xHp)(enD9[t', albumInfo: '6vOi!JW^X36eSA'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '!nE$XNCG', albumInfo: -6187134805344254}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '*f2!7W#!AB8C8', albumInfo: -2283082585473025}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar', {id: '6X$&Ddo#Fm(48^%)Ed$S', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar', {id: 'c1#MGN)p08FFdR*', trackMedia: '@%uVPyWtEpk#NuCaqC8u'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'TwSlVar0FdhR1$KA@', trackMedia: 4986840226463746}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'LtC5%hdW7T%', trackMedia: -8437543058014209}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar', {id: 'uRx]R', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar', {id: 'IxTez$SCVJqT', trackTag: 'Xq[I0'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '$Qi7X', trackTag: 1347288987336706}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'pyI4CRS8hv3s]enOvU', trackTag: 1426496199589887}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar', {id: '6O4103FY', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar', {id: 'Yh)Ju5!fiTNKl4Sh@sF)', trackRawTag: 'BfM2@3du$Gl5B!rhWQA'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'OUbsI#]tqVnVRH[X1qI', trackRawTag: -3644281176719358}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '#i2h4v5WT&', trackRawTag: 992021145714687}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'xIWFYL8pWiZI*', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar', {id: '[t^WzG6)hmKk8Wf$RFJ', trackState: 'H^x7Zlofl5^VgU#9o'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'EH%3qdpwnV28A(', trackState: 2567779089645570}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'QPx4Cz#', trackState: 3534971343994879}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar', {id: 'GV3bADtj$hN*', offset: '@(0Ip8'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar', {id: 'X[Oq9W!v6', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar', {id: 'z*hn[UMEGlM3WD%61', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar', {id: 'xc6#4PoQ9%HirUx&a', offset: 38.65}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar', {id: 'FxWGZ0SdQD3)f8J!', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar', {id: 'Ss!()8w2[$zZ!V(L]p', amount: '[Xy5x^$y&Fj'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar', {id: '(#j^3%W346k^*hZQFgWh', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar', {id: 'Q9UA@HB!w#k)B1&s', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar', {id: 'nB)Sk$r(n[YUKK', amount: 68.45}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar', {id: 'rs&zikyH!W', amount: 0}, 400);
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
				it('"genre" set to "empty string"', async () => {
					await get('artist/index', {genre: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/index', {mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/index', {newerThan: 'aAn]ewYtgSZEQTzAWBX4'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/index', {newerThan: 56.46}, 400);
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
					await get('artist/index', {sortDescending: '4dXSU4J9@WQfDPMs)!XK'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/index', {sortDescending: 8484698347012098}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/index', {sortDescending: -4455174659637249}, 400);
				});
			});
		});
		describe('artist/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/tracks', {ids: ['oBRa(uzeoW3x8b', 'QO)nkmmibNio']}, 401);
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
					await get('artist/tracks', {ids: ['%r8a1^', 'vF%Bq'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/tracks', {ids: ['vc3!yN^3', 'jk[Og5d'], trackMedia: 'eO9S@WQ)IgEJ4]'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['wjZ3BLKi7Ii$TTw*', '$1BWnm@M$Rsl%'], trackMedia: -4157861353488382}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['xQ]AB2', '0Gg6[k'], trackMedia: 6561496402231295}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['w!AU8[', 'A5sb2CgsqSk980V'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['cZn$&@KGcdU]On', 'aNOy70QeTyv6Qz'], trackTag: ')MZIKQzV4[fuE'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['(sSgbE&bNjc%', 'C&UqQPQ[v8(Aq@Qqb7'], trackTag: -2181056379748350}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['C8)RqV4aJx5', 'yPG&23sYIO0iG'], trackTag: 650292852948991}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['M2*oXtTEE7ch[&', 'nGRw4Fnmr#[2k)Q'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['HPRs6&dXipAJDJJcKJW', 'jw4FMJX('], trackRawTag: 'qPlgbXyqQO!z1a)pFV'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['KW4ROYe2T', 'R8zh$j!7LVBv('], trackRawTag: -5264711482343422}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['SCV#T&(FQ6U', 'YWmRi2UVwEN!Sw$'], trackRawTag: 6161597558947839}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['wwSVkIp]&f1D]pxpPvf', 'zQNnrtpKQ1SZEkYpSK'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/tracks', {ids: ['QNYIML', 'WM5B#tS[!bBDz#R%HRQE'], trackState: 'B*tCh^f0HTEoM9'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['R^(HzC%on!QT', 'Kn1BM0vJdr6MNcG1X'], trackState: 7926173237510146}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['[H!R$#qs**#@vcu5g@G', '$5FfoQ$1'], trackState: 5998985961537535}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/tracks', {ids: ['vp*ewCzAy8P%#', '9WPniM'], offset: 'Y[]hjm'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['OBFsEXY2Sd4@LR4#f#7', '4cPbPDaCQHm]P1xH0^x'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['modhr', 'Yr1!kGVmLW'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/tracks', {ids: ['(5tzl8uBh99UJW39', 'SX^B(Y'], offset: 77.8}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/tracks', {ids: ['p0oV)Bl', 'G94958!@Qhb2!Ky'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/tracks', {ids: ['X4#kPgIx', '3yEMJ&R(4rk9]F3rY'], amount: 'pfJWMkTZ6Q'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['Bmom39dP', '526IDB3IWJ'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['lW3gH!7]VeKphC8Z*t*', 'd9(!SwxO&62ah4ONE9&i'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/tracks', {ids: ['MnYw^7eo!yLM]CFfeM', 'uM34Hlnv3H'], amount: 46.25}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/tracks', {ids: ['u[pF[DlVxaq3WF)7t', 'henO$IrctJS31NQj*'], amount: 0}, 400);
				});
			});
		});
		describe('artist/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/albums', {ids: ['leiSXIMa8RsTnl', '*Hk3)p4XkmEYghymM']}, 401);
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
					await get('artist/albums', {ids: ['VKua[*[K26VkIOjGGT', 'n22Hi'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/albums', {ids: ['iuY4TSlwUDYP6&P$N', ')l81coNdKoG&'], albumTracks: 'GsTxhlz30!g3fV9Q5'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['39eJu)!89fx*Y0q49B', 'RkrKq'], albumTracks: -4470780842737662}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['b8!UH%nJyy^H', 'BUHDbASDL^DI]zE'], albumTracks: 7307004661989375}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['bn%on&]5$SOnM&KDeoNY', 'vpNqB1ivh9e2u4Dv8wec'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/albums', {ids: ['Fr#Th388', 'XaIHwPcmVm'], albumTrackIDs: 'L)^#rSa57fyOy'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['HLT]1HZv', ')9kmzePA$'], albumTrackIDs: 697818486407170}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['J2A@QEmNeac*nH]]', 'J@C[aiNRf@dpKwca['], albumTrackIDs: 7207002526711807}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['PL6L]HFF6r', 'Xdhe7y'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/albums', {ids: ['!ApKYNxjpPCzxef', 'bqDkm85%z7E7'], albumState: 'eKu^cSpo#ydXC'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['dHsXHjUPV', '0T04VCb7oo4B2)*(Gk'], albumState: -8904288998785022}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['n^HpE', '@[xIIaPGT@shtBMU'], albumState: -5784331255545857}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['(Q78Xw^9LD&@&Q)', 'QU6bG'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/albums', {ids: ['^4E$NfG)zKwv2', '3ITu*!)*'], albumInfo: '%oA*V7)'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['4yhHyWtF', '!L1fggUce9kEF#'], albumInfo: 354662628720642}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['AS5h8U]', 'pVMtFhRkTC&tN6'], albumInfo: -6403683533193217}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['QxFP2ZN(mK2f%x', 'vjdcJ8kk8PC03UFR7B'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/albums', {ids: ['AU]nyAxOT', 'jl73VOX)skdyv#*LQz4f'], trackMedia: '#4j#$bOoF'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['WL7!LCuVj!G]64R', 'l^0jPr#^'], trackMedia: -8092194653077502}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['Ho#RRUW8G', 'KZg%ozZ2'], trackMedia: -8572701773922305}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['0ogu6yhyH@OcJn', '61hn0)Mr4U'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['yrnikUw]s*vp', 'vjlCb)N&9J70#n7c^n'], trackTag: '71%4Z%BORJX6K02a'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['4p6iraLRQW%n&#Pab', 'k!5XKr$7'], trackTag: -4573681061724158}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['A6fTNCs[', 'UBs[cJsQ9'], trackTag: 3115893630435327}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['#UCKA', 'kbg@r2EZqaTD'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['HwL)ycKSB&', 'aTgION'], trackRawTag: 'GESmKIEUZeAgrDWUmMh'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['#V]LzMtZ&BF#ssGsd', 'FHAktBk7FWi#L'], trackRawTag: 1052424538161154}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['Igt[l1qwvi8NKSeUL', '&LOoVd'], trackRawTag: -3538506529898497}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['bBot1D', 'D&IJ9laFTfxJTS4EiBZF'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/albums', {ids: ['CC[C^Zwxw46@', '3[$])FRD*'], trackState: 'KEZOA2Q9*k)tl^'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['A5wcaWq1BUV$riMXjp', 'y(3RMrCLNcE'], trackState: 2966671421603842}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['wuqOy', 'JGri!3#(rB^]4KqjS'], trackState: -4120148491370497}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/albums', {ids: ['i7bBs5PsbgyFbv^ji', 'c2O6fp0kR'], offset: 'Rv7Q]'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/albums', {ids: [']vi@YejZ53xda', 'O(HB$kzFTk@[2IvgX*id'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['O]eihUNUCPS$uPk8mlr', 'jhhEFk'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/albums', {ids: ['J3xOHxI', 'WIRlg@SoEfVC&ED&t'], offset: 18.85}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/albums', {ids: ['5Zmz[gieoCQ4EK@EHd', 'ZdGw%DkEcraR'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/albums', {ids: ['Yx0tV', '^pgb9A457L55'], amount: 'hxR)IyGr'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['fG1SljGazzMHUk&KJY', ']r6GujUjrpKjGD!3iYTN'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['$@UE]U0Ydr0@', 'SkCx#^ljzQ&%PuO%eZ56'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/albums', {ids: ['#FF^iB$OW[r!DS#hoV', 'kj9)m%qg%('], amount: 38.44}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/albums', {ids: ['%8$X#P)^3HSRL', 'hF7Z(x^lyLW&o'], amount: 0}, 400);
				});
			});
		});
		describe('artist/series', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/series', {ids: ['LiZ%Xl2Bk', '9TmGIiBLyAO']}, 401);
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
					await get('artist/series', {ids: ['R49hG8N%oYJu[NuXKk', 'ZhWCJNm^1'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('artist/series', {ids: ['0%6)Omn8NSS^EmDp4mAf', 'f6W#D'], seriesAlbums: '!1Tii[lkhK!iGW9'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['i^a]3oZh!i60o5b@vDNm', '%(be3&)e9p4Qf%^*'], seriesAlbums: -4620642498379774}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['S2g#CD%&qamQrBil1e', '7LWMc1*FzFFfC'], seriesAlbums: 3609951700254719}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['MSoX88#OrzI^Y', '4J9)*D(v*Ycn'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['mu2gILP7FlpmlA)a', '!FCDze'], seriesAlbumIDs: 'G@08KUPu%QxUuW)'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['20Nu]#JexzpGGitjEl', 'T!$eYx2N0'], seriesAlbumIDs: -4802785644118014}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['jLeuI8O(p5B&%]U', 'j$2PgN6YMZy'], seriesAlbumIDs: 864356325654527}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['OxnyUcZ)fD0bnn', 'MhXglec&Iipupsh%'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('artist/series', {ids: ['RR*u%#2', 'RQAWDzukg9FuID(c$nO@'], seriesState: 'dcdiL7kA8'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['M#Y$%yhoZUS', '%l2AK'], seriesState: 1174588746629122}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['ymPm6Rqs9Naq', 'yI0XkKlGQL4Js'], seriesState: 8869055528173567}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['dkrC(s$WXC0n8Y', '8rCDZgQRz9Ae)C'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['TSn2oCD5gaR(xhEX', 'LWvFiyxzgB'], seriesTracks: 'c8^YCta'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['wIWY^9Ov3RN(dl1', 'bkwvHlHu*mASpgJL'], seriesTracks: -4594270958780414}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['3IZf8jM(leS4N', '$BJ55fWY%PxCO'], seriesTracks: 3557595595931647}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['WY6OL', 'AspDfCoTrP4H4SQC'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['#*!e*Ln', ']M&bD!5!#5['], seriesTrackIDs: '!4h]t9'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['!vOzHCpmq', 'W!sqtIT*j[JlarL@'], seriesTrackIDs: -40868807442430}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['iTUE@0', 'cJJgZI4I%KwvS0'], seriesTrackIDs: -8028504801148929}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['hsC$NYnG3*@2c', 'Y99WbgnoHYi'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('artist/series', {ids: ['gIZB(NN1hVgmZQ5W', 'iXNB]'], seriesInfo: 'o4fhzbk'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['muhsVEPuW%N', 'aXy@rAIv'], seriesInfo: -7162322934038526}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['IPvHGwhst8y3(ZHU3wd', 'TR4vELu'], seriesInfo: -7382929244160001}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['*!sidNR)4b(0Xgnzv]!$', 'j$25NGq[f#h'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['h$5sE[8eGdsJ)', 'f^Olf9PK^VG'], albumTracks: '@qq@%&Os(b5tpByIY4'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['t^Ve9', 'rJF@vZ&mwszJ(RYb'], albumTracks: -2786584332075006}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['I*D$puN', '#51#aPo#MJ&[WupM'], albumTracks: 285765997166591}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['[a^sUmKrVAbT', 'eGp[ya!2MgiaDd$eUu8'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['eFfgn#$Pe]', 'rSnSBL)OVDj6'], albumTrackIDs: '&(Tul8@!Hg(Zc'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['tQ$s2', 'J7Z&zAyw$d5DpX)3'], albumTrackIDs: -737909552447486}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['Jz8c(a^0CFP', 'EiX)44rM%[upB'], albumTrackIDs: 7045981036085247}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['AoS504(H!', '@6Ms7OQ)7GljH$YIP%(p'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/series', {ids: ['!0uUOTrXaGmjEZNiJ', 'yolKRBsJrEWCOfY'], albumState: '!wNR%kkCjjdZ)4w'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['6[Jl*rnV%A711g$Y7N', '%C11apjX0zUeaIdYM'], albumState: -1695819350671358}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['g12kd0@ZVgqajWQJ)Ur', 'd@S(%*s0O%'], albumState: 2385880924815359}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['yblREafwL5RuTaS2', 'ugeRAf)hncHP(P9#R#'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/series', {ids: [']e5Rs!Pjr&9Nr', 'g$izw3v0rTMCl'], albumInfo: '(nMyh'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['%qdIw', '0Kz!LnKBmgz'], albumInfo: -1477906417057790}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['n[5vGMFFDPRrisnq3', '#cxoR(Tr0@tKDAlo'], albumInfo: -8860951348510721}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/series', {ids: ['vHBoUt69M12#Rl', 'o]N8Uga8hq0(Y'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/series', {ids: ['vb4(6)D', 'D%P*b9Dbm^$aCZaEyy'], trackMedia: 'dRp)TE2yFstd2([m4ey'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['EhB^kq%', 'C)c5%z4TdW)z'], trackMedia: 287101983653890}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['5zrEw!pinuP', 'a$$[qZ@aIVFqk[F('], trackMedia: 6300820152778751}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['CbOSgwa', 'M%vIta!RLITS(xLS2*QB'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/series', {ids: ['xbptiePLF', 'pyeHVxAD1ReRl@yfwO^'], trackTag: 'wW*&G*KVAp$PT)u('}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['ELZvZ%1BN(CV!BgM', '6F!idpOi'], trackTag: 2649807726313474}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['HPij&o@0[', 'r^kK)VEPRIX8W7y'], trackTag: -4136678243434497}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['PU%jyTjRKLHu4sqsFS', 'Jwmq5K$y4uW'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/series', {ids: [')l7X&yyF2GYxr*b]sHi', 'KK5g2uMNFU[l'], trackRawTag: 'zY#ckiVnD0!AoB!x'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['yT(43', '7a8mDY#j9Nf'], trackRawTag: 6759634341724162}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['m(#ff6P', 'gxDy85p9D[xWku(^E&'], trackRawTag: -4911149103448065}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['%EQkMxKDB^o(1)1^T4x', '#z(nu$]Shxfuv&OLUECd'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/series', {ids: ['sOY4(ZMA7zyouE', 'Ku7jtj874D(jm6'], trackState: 'dlfDzh%Q(V'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['WNs@weTLrtn[@', 'iMvkMblsD@61W^^li'], trackState: -2977990581420030}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['$dS5StQ*tKve5#', 'mvB$tOB'], trackState: 1373019691810815}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/series', {ids: ['u9%FMDC', 'f5ER8S'], offset: 'aji97pA^14K!z]Tx3#'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/series', {ids: ['eayhIm9#*wH#(', 'yG*]I2'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/series', {ids: ['hx7U^1s6O', 'F8eHxpc7oe'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/series', {ids: ['gJSNrd@0HmY(&SgQK', 'IjNzDV8'], offset: 9.62}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/series', {ids: ['[DjYxZ8Wedi0QY1', 'OH2*ivbnxaBh[fF%#'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/series', {ids: ['GNG4pQZQ9Ezt', 'uv@y^9lmphcl*cP^'], amount: 'lDKVx2PD9%Ax'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/series', {ids: ['kP]n(b&S)[AU@XPq4h@', 't3U6w)SB5qX)'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/series', {ids: ['v8Jp9Q%g0', '9k^n3vSQ[LG[K'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/series', {ids: ['GgUy@jp&JJCVV5Na0Q', 'BvCxgkKHaJk^xlDKKWH7'], amount: 10.7}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/series', {ids: ['h3Jo1oC%NZzaRGITk', 'Sh&SnVAET'], amount: 0}, 400);
				});
			});
		});
		describe('artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/info', {id: 'Wwil5RCLU9t@v@9'}, 401);
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
					await getNotLoggedIn('album/id', {id: '3fF6IXZ9nkEx#SOapCKY'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/id', {id: ''}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/id', {id: 'R&zeIgi3', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/id', {id: 'vwleXE', albumTracks: 'Y4(lIom7iLQg*KgJ'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/id', {id: '$cKRk@$A', albumTracks: 4599134703058946}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/id', {id: 'su8t9v#zfG%[&Lt%SUCR', albumTracks: -2928466349522945}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/id', {id: '9T@v(tCdCcW', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/id', {id: '0D)bSZQE', albumTrackIDs: '6ASyN0oO'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/id', {id: '1cvFN0FxWqI', albumTrackIDs: -179309662699518}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/id', {id: 'AU5k47[@Lw^m%T', albumTrackIDs: -1357856838254593}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/id', {id: 'kqXDo(IbVFkRovX2', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/id', {id: '9Ke1RzCV2b*(D0XP', albumState: ')&L%cu)E@ix3!@*8'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/id', {id: '$nzqKU)hgSFVNwMa4o[g', albumState: -5130114148859902}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/id', {id: 'xrV^n', albumState: -6058893478199297}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/id', {id: '%aztS(*!)SfK$tzbGAY', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/id', {id: 'aqq$aHB[^Ocs5', albumInfo: 'igD*Vk'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/id', {id: '45NhH4c5wP]t(klXC', albumInfo: -3544329121431550}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/id', {id: 'z2B@K', albumInfo: 4659855969222655}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/id', {id: 'BxFqf', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/id', {id: 'HdGvF@@*m38', trackMedia: 'uC!jBzp4TdmV*q0q'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/id', {id: 'zjUGA!nVcZkDIwO(OE', trackMedia: -8879992154882046}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/id', {id: '$sRySfjo', trackMedia: 8901538978201599}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/id', {id: 'um2)T5', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/id', {id: '&*RijY7ezjM4U', trackTag: 'E31lKIwh'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/id', {id: 'Y)Tez', trackTag: 7393315494297602}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'soYA3l5L', trackTag: 8597977950060543}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/id', {id: '1hGn7Q@pe', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/id', {id: 'X#A]DWJVpQRpWcfXO', trackRawTag: 'fz9ET]'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/id', {id: 'bnYBw(U4IYutPZ^', trackRawTag: -1886645611659262}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'o90KOK3@#m6LFQe2VY', trackRawTag: -5859610384662529}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/id', {id: '!b%7IIJ&e2$$Oc*CXlm0', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/id', {id: '0dxxvR', trackState: 'TNsVfN4ZoAO2HR^[I)x^'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/id', {id: 'S$KXgC^J9p$8Z@hON5an', trackState: -7639707005485054}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/id', {id: 'TN(N4J&u4JHt1Nd@o', trackState: -8577923070033921}, 400);
				});
			});
		});
		describe('album/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/ids', {ids: ['Q%vkFN8$', 'gEXVEI!s7P']}, 401);
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
					await get('album/ids', {ids: ['2N%%Nd', 'zVgKgfB#NeIN)x7'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/ids', {ids: ['Cao8sZEmj*V)8LK5', 'JWr^M4^&pY0'], albumTracks: '!*[J[0%Z%oRdIRc'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['yqFuAQKW90#72z@2i', '3GZ(!Am3DQ%(DeI683qO'], albumTracks: -3762465514979326}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['Az1Eo#QvSDBcw', 'MH4oJKD'], albumTracks: -7464509153214465}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/ids', {ids: ['2GoA^4%qC(9se', 'ofJU%Ew'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/ids', {ids: ['^8jZfWx1PB', 'VoIHz'], albumTrackIDs: 'vgkD]YE)(MhCaP'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['s^p!e&TOFDqpeCc$', 'po1S@JMzj8Tqz'], albumTrackIDs: 8284200926969858}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['k9T6wRPw8roOOb*(1', 'oz[$9]Ok'], albumTrackIDs: 19769902235647}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['Qy1BvrPEmYb5u3sw', '[!pbvqV5LgIG44M7Mc'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/ids', {ids: ['(vj1#cjAW6KX1Szk5b5', 'Fs8o9ay0PUN'], albumState: '7@w$Vdl@3)!s'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['ZaTLC2nv4NwIliKMzz)b', 'z%%9VaWbr&L4v)Fbo(LA'], albumState: -322959180824574}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['lLdXmT7fX', 'pCi@zIL&VUG'], albumState: 6292297268330495}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/ids', {ids: ['$juR]9^5', 'TmoLgU!$JqrLR'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/ids', {ids: ['d73am', 'G1Tmk%G%T1cqr)Op#1^7'], albumInfo: '@%$iOz^R5!@ovDm'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['2[gV%X', 'fw1gj2'], albumInfo: -6340792884920318}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['atsxp@#jZyFt5396', '5MXfmdM3'], albumInfo: -4193637457985537}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/ids', {ids: ['UqxlfRxkL', 'FRyE6]3IEU'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/ids', {ids: ['kxrRn*E[glpINPTAVzT6', 'bhR5NUf3otL!C]TB'], trackMedia: 'Zrp%(5]JLYuckZd%S^Sb'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['^8u7vw2Wf$', 'a)nGW6TpjZlnE&ZVmT'], trackMedia: -558581690662910}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['$8[HLoBaeuIM]u', 'QEgRpVaE#cN]#6'], trackMedia: 56554975920127}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['97NIj])knMGzjpy', 'k]%sYY(c'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/ids', {ids: ['Kxb2sIS*p', 'OlUzv2'], trackTag: 'MgHRfOO*L]NxAlk(B'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['hgda%EW1B7qvp1NfA', '6f4rwNQXb^Wp@AReA['], trackTag: -6316236711395326}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['txI#ok@mopPES4XV*Z(', 'ADoOc'], trackTag: 575067901657087}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['AscER(RGa^c%DZX', 'jtk6T'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/ids', {ids: ['Jz[BNeo^MK6$7', 'zEZnHqhtI)8xL'], trackRawTag: 'Ny%G07h1mA[!'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['*p%6daW8S&]I4', '6D)7wnb30R3pnK@P'], trackRawTag: -3039736780292094}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['Y]K[b', '5jZepFrDIhtti'], trackRawTag: 4361545085616127}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['dZCNh6mzG2so', '$T%#YD!qfzr]uhbpL8P'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/ids', {ids: ['V8Ir@', '1frQ[1xTcgzOTU@DfJG'], trackState: '(0WegrC[#QF'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['P@4biR(!PjLKf8', '*ndmurEhjc6'], trackState: -2124898478587902}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['Igz36iBuq6NTYLv(vb4', '*DcT[12xaDxBQ'], trackState: -4966838383411201}, 400);
				});
			});
		});
		describe('album/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/list', {list: 'random'}, 401);
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
					await get('album/list', {list: 'faved', offset: 'YfS1^0]ka3RoSO'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/list', {list: 'random', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/list', {list: 'recent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/list', {list: 'highest', offset: 74.94}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'recent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/list', {list: 'highest', amount: '3bp@l0ANn[^UEq9'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/list', {list: 'random', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/list', {list: 'recent', amount: 65.14}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/list', {list: 'recent', amount: 0}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/list', {list: 'frequent', albumTracks: '8HBa(MpgWK1F'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', albumTracks: 170736383688706}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', albumTracks: -3712155048214529}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/list', {list: 'recent', albumTrackIDs: 'oW%XG9L!N)A'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/list', {list: 'faved', albumTrackIDs: -4436698775683070}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/list', {list: 'faved', albumTrackIDs: 362403472605183}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/list', {list: 'highest', albumState: 'gFLRih6K]D9jo&'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', albumState: 721510360678402}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', albumState: 5896081959288831}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/list', {list: 'highest', albumInfo: '!F)H7['}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/list', {list: 'faved', albumInfo: -3110021344788478}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', albumInfo: -5966919412744193}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/list', {list: 'highest', trackMedia: 'd53z1G5mN*MBy1pUkp9G'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/list', {list: 'faved', trackMedia: 8472618998956034}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/list', {list: 'faved', trackMedia: 3117431937564671}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/list', {list: 'recent', trackTag: '3Fj6!k0pv)'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'recent', trackTag: -5670879274991614}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', trackTag: -4483775018827777}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/list', {list: 'highest', trackRawTag: '51UEeF5$C6]Vm&'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', trackRawTag: -4613231305818110}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', trackRawTag: -8816969318924289}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/list', {list: 'random', trackState: '5^oKic'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', trackState: 5130592932855810}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', trackState: 5344311524720639}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('album/list', {list: 'random', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('album/list', {list: 'random', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('album/list', {list: 'recent', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', rootIDs: [null, '']}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', artistID: ''}, 400);
				});
				it('"trackID" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', trackID: ''}, 400);
				});
				it('"mbReleaseID" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', mbReleaseID: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', mbArtistID: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', genre: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('album/list', {list: 'avghighest', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('album/list', {list: 'avghighest', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('album/list', {list: 'random', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('album/list', {list: 'frequent', newerThan: '&DY*Zx#2UqEPgj&uU'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/list', {list: 'frequent', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/list', {list: 'random', newerThan: 74.75}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'highest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', fromYear: '0iM&hUmYOwP97I)YL51('}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/list', {list: 'avghighest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/list', {list: 'recent', fromYear: 25.82}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'avghighest', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/list', {list: 'frequent', toYear: '5OMQCmK0we(r4AXOpL'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/list', {list: 'avghighest', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/list', {list: 'highest', toYear: 95.61}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'frequent', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('album/list', {list: 'frequent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('album/list', {list: 'highest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('album/list', {list: 'highest', sortDescending: '954Ow!xD'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', sortDescending: 2150150852050946}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/list', {list: 'frequent', sortDescending: -551969101971457}, 400);
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
					await get('album/search', {offset: 'YG(i4r&OOZ^nB#JL'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/search', {offset: 75.57}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/search', {amount: 'RDUR77[S'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/search', {amount: 68.4}, 400);
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
				it('"mbReleaseID" set to "empty string"', async () => {
					await get('album/search', {mbReleaseID: ''}, 400);
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
					await get('album/search', {newerThan: '!zaNS#o[9Kh4W3#UuZ('}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/search', {newerThan: 66.28}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/search', {fromYear: 'CWBciJWLwP'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/search', {fromYear: 6.97}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/search', {toYear: 'zUZLJPlGuQV)C)K'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/search', {toYear: 54.9}, 400);
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
					await get('album/search', {sortDescending: '8LU)hYdc@TS'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/search', {sortDescending: -8411301533450238}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/search', {sortDescending: 7625293380452351}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/search', {albumTracks: 'g]5GaGwJ4K3%vq@UcPzw'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/search', {albumTracks: -2863122272485374}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/search', {albumTracks: 156715186126847}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/search', {albumTrackIDs: 'V8Ui94YkqwbSM'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/search', {albumTrackIDs: -7209107299762174}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/search', {albumTrackIDs: 1329880578916351}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/search', {albumState: 'WETCHKdDwH$('}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/search', {albumState: 6394946433056770}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/search', {albumState: -258861810319361}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/search', {albumInfo: 'Zm0o%cDLVE'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/search', {albumInfo: 2927182724726786}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/search', {albumInfo: -3221200700440577}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/search', {trackMedia: 'HlzW!]U'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/search', {trackMedia: 8119468328747010}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/search', {trackMedia: -972490151034881}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/search', {trackTag: '^caSD2o82ECs)%L7x'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/search', {trackTag: -731300155621374}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/search', {trackTag: 5962563355410431}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/search', {trackRawTag: 'NFY8BTRVZXzZaR'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/search', {trackRawTag: 624002049507330}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/search', {trackRawTag: -5975534446051329}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/search', {trackState: '8f)%FJewFVvFW'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/search', {trackState: -7106195592577022}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/search', {trackState: 4785964174016511}, 400);
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
				it('"mbReleaseID" set to "empty string"', async () => {
					await get('album/index', {mbReleaseID: ''}, 400);
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
					await get('album/index', {newerThan: 'DvYaBsKgSJr$(]'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/index', {newerThan: 58.55}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/index', {fromYear: '5BZwyYWcAs*l'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/index', {fromYear: 33.94}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/index', {toYear: 'Oc!m^'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/index', {toYear: 31.16}, 400);
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
					await get('album/index', {sortDescending: 'w@*n1t^7v69Z'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/index', {sortDescending: -3642479320498174}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/index', {sortDescending: -8663423688638465}, 400);
				});
			});
		});
		describe('album/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/state', {id: 'kUKscgtYF'}, 401);
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
					await getNotLoggedIn('album/states', {ids: ['uWP^[*I0okf6J7VWc', '4Z%RnWQuKOwf!c1H']}, 401);
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
					await getNotLoggedIn('album/similar/tracks', {id: 'VUB0Xn'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'v)[WSJ8M*0[kro', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'TmazlkcIuHtIxyU', trackMedia: 'J&5dyHZ#iO9f!S86b^%w'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'il7M[wR@', trackMedia: -425906791251966}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'cH*bDsuX', trackMedia: 3970155709202431}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'EKubU)j]7ksVh@IKj8B', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'TjJYbZ)!GfzpNDYY', trackTag: '7tJLF7Y9ackR'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: '$3hG)5DoU7hML4J3r3', trackTag: 7230380671238146}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: '$[j97G1eZ', trackTag: 874878374772735}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'oUqgsZ!#LJ', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'OB(UlovXs)7a[', trackRawTag: 'h15M2dU2bDSN[Uo#'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: '05X8u8ut&vu#KN#98D', trackRawTag: -4113828174364670}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: '$qM2piM$I$60pYYEUj', trackRawTag: -8077484658524161}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'VAVlfwgn]', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'V3Ol0', trackState: 'K#[(8Ppno2x074JS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: '@6yQ1wTqq', trackState: -7470759093993470}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'CCNgmsZ', trackState: 3168354785296383}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/similar/tracks', {id: 't5sZNH7XiBtvGj]', offset: '7h5%Yyb^i'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'sopV@X$AIZOu]e6Yjw$c', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: 'yf!aXF4s7!@', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'pr[f#[3prQGe', offset: 23.76}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/similar/tracks', {id: '1v4Oo*', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'Ok0dRC&wkWzTipbt', amount: '[VM9q$E8ELvMW4RqNX]'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'NQuWkhPH', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: 's1(QgF', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/similar/tracks', {id: '3S5)n[E#989QrY', amount: 34.37}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/similar/tracks', {id: 'Mdx99t#xiKH4', amount: 0}, 400);
				});
			});
		});
		describe('album/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/tracks', {ids: ['L9Ut)6lEs', 'yPOqN$7KKh']}, 401);
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
					await get('album/tracks', {ids: ['k*5*bGK7%n#e5PyZ2Fn', 'wnh8pQOi]IAv6J'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/tracks', {ids: ['LD&!28jC6w!paKgv8U', '6roEdKXg)pZ]daivfA$'], trackMedia: '(%[Q2JvN0u'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['T[AfFG]US', '&]&qPKKDy(vn]X@QD6M'], trackMedia: -5712929177468926}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['@k[8V0v[0iZidxB7oUU', '7cu48b)#g$#n1'], trackMedia: -2131584589234177}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['3KE0i%6', '$9(@qf$260E2C)a'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['1&0U2K', '*p#Yxmynk[49Y3g'], trackTag: 'ZG1GLE!](dD'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['xGEP5Fn#Zaq', '6V[uR'], trackTag: -6421915816165374}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['9vb2Xy', 'E)Z$cEhm%zNnb4@VlCU'], trackTag: 2631858923765759}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['%9At]fOkTDym', 't(JmgZ2K8lRT^o%n8'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['jE1QaB!i&T[Ch', '2vBW9&b[NKI#2'], trackRawTag: 'uA3$k'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['Po37t', '07LdW'], trackRawTag: -788939346542590}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: [']Q[oTyIFb!', 'eDnXI'], trackRawTag: 742443033034751}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['JGgJbl', '*pk]#D(1YLOO*@]'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/tracks', {ids: ['wIBxQo9[[P$', 'WMRD(qEV3ig@'], trackState: '(cFO&qt5^OfSM@7H8'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['QBvOhdOw%Q!QX6xn', '5*xgGBpI(Q'], trackState: 911550944641026}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['#LF#!Fu2Pi8ie', 'ZIcRSq3gpAFyowIzMUC'], trackState: -129377392132097}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/tracks', {ids: ['aJP)(', 'wX^qpK7o#ti'], offset: 'O9N#]!aFmYP'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['jQs1kmfh*s6zKlKJ2]F', 'P(@]JvmjdL'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['TVnPFRV$C', 'NAI(TqiTp'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/tracks', {ids: ['muRti8TLjEtIXdo', 'YGG@GY2Qv*^tfciYtN'], offset: 46.76}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/tracks', {ids: ['DYW$bBI(vmU', '2WYXCFw^rDd'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/tracks', {ids: ['EIGP[Tmx!dNFpN', 'MbiG]*OcUy'], amount: 'zajOXj'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['YmVXzXK', 'ynbAzWK^9'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['*47[%9&lSsgx(E', 'Zqr[]!Xge'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/tracks', {ids: ['T8ZEpk6yi3UoIle!WA*w', 'rJS7TFZ'], amount: 5.09}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/tracks', {ids: ['zDY%!j&h4&zc', 'lwLPh8'], amount: 0}, 400);
				});
			});
		});
		describe('album/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/info', {id: 'jTsY(3lk#Ta64f['}, 401);
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
					await getNotLoggedIn('series/id', {id: 'K*toJ5EdecxB[[X5V'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('series/id', {id: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/id', {id: 'MOKKwXOsCcID[2cY', rootID: ''}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/id', {id: '2GumuQ4sVs81bdsiSE', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/id', {id: 'C2auD5Bu%iCVSzd@6N', seriesAlbums: '4F#HVpYCUqibYF[H[Kip'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/id', {id: 'Vb8[1k5Wh$cPJ25b2A', seriesAlbums: -3997623388209150}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/id', {id: 'M92IUjWc*S0u2)C', seriesAlbums: 467009045266431}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'Jk6$OAP*CBU', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/id', {id: '%^kvmIIKr', seriesAlbumIDs: 'D%(43Vr3@SPnH2Zj](1e'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'Hj$U4Uxc%gz)#suLI', seriesAlbumIDs: -3572065655324670}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'FD]LGGX4tHliF@[%j4yi', seriesAlbumIDs: -5643033768886273}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/id', {id: 'kWrHQRKiM8r', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/id', {id: 'fc6%qDRieUcAEDT', seriesState: 'ddZXJZdZY@fm2W'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/id', {id: 'bsvhL]r49S', seriesState: 4981834584686594}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'p^0bEfqbUZ4Go#l#Zx', seriesState: -5441366121250817}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/id', {id: 'ZTCMm4^y&7ajpf#', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/id', {id: 'i@q3g', seriesTracks: 'WTRZ4z#a3cO'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: 'AOsKO8L%d%c@GZDpb', seriesTracks: -880421332058110}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: 'bPB@uWSGiG%dhFV@g', seriesTracks: -8851318009495553}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'PfKVF', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/id', {id: 'a2lGidQS', seriesTrackIDs: 'q6m$4dj'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'WUwlrB4t', seriesTrackIDs: -8709362574950398}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'EDQm!iX', seriesTrackIDs: -3019083096260609}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/id', {id: '%6%V^H4#[2', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/id', {id: 'TFsOZBFSBLj[vIh6', seriesInfo: '#9M#Q7RjygXo68q8'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: 'ohPTirP', seriesInfo: 5979911290355714}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: 'cD432UDDwHe', seriesInfo: -5729276389228545}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/id', {id: 'bu^1[zeHapvHAhON#]U', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/id', {id: '#5R2$OQE531vkNkf7', albumTracks: 'S2[E2fTbvkc4zis9g'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: 'O^op%5t8vKQai1Ox', albumTracks: 6286657733001218}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: 'dWpPwf1z6uz(@Tx]fPl', albumTracks: 8023743053955071}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'Px7MS$$AS[LH&', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/id', {id: 'F8uDJnWSq3qM4Clg', albumTrackIDs: 'vu)m3E]$exMuNm'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'zgIG50eL9DEQNfn', albumTrackIDs: 1314335158697986}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: '*4cnE%oa8a', albumTrackIDs: 7202044372844543}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/id', {id: 'Q1H#zNa@(TJA1J', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/id', {id: 'q4EsQ7c[ns(Tj1', albumState: 'EAK]&AOtqO)0y'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/id', {id: '0a&c[QDgJnke', albumState: 5983822860517378}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/id', {id: '6SDO9h4WNIEo#y', albumState: -1111361178304513}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/id', {id: 'ljaC@M(TIl', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/id', {id: 'oou^@i0Z[p)%l', albumInfo: 'W3v*29dS!wkoyh5Z(hU'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: 'jBzq7KYKY', albumInfo: 7068209559633922}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: 'VZC*%rG)bVm2ysQtzrTe', albumInfo: 4500352376242175}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/id', {id: 'in0@b!r7L*v1', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/id', {id: 'MK@8rxX3woWd7d^', trackMedia: 'e]#my)u7gEj^U)&tM'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/id', {id: 'DTzJVudi', trackMedia: 3168783174729730}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/id', {id: '&m(2k^yt$^T6Xs6mOe9D', trackMedia: 5845184696811519}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/id', {id: 'sX[0yzBM!]2JiJ', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/id', {id: 'yiJa7mqcLl5IA!]z', trackTag: 'Nc6]yz!oS@'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/id', {id: 'H0qGhgi@yh$3]C3XG2', trackTag: -607602715131902}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'RxYlBzh', trackTag: 3565931989041151}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/id', {id: 'lgAiaP2NS', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/id', {id: 'E*cRwJHcZ&gVz*wPqIE', trackRawTag: '[#rkUrBhzO$uCB'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/id', {id: '5gs*S6]T9', trackRawTag: -751473898029054}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'uAj5[', trackRawTag: -4042441082535937}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/id', {id: '%sQg0ZRLZz&mp$DSz%f', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/id', {id: 'Dmtu6OXXyz$b)B7$', trackState: '(A)1ws&'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/id', {id: '9&]*BvE^ps', trackState: -7364114292670462}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'fai4Y[nKaT0d!qSdjK#D', trackState: -3432849566859265}, 400);
				});
			});
		});
		describe('series/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/ids', {ids: ['H3#wAHPj', 'B!uzGAk*ylQ]8Rj(']}, 401);
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
					await get('series/ids', {ids: ['$YvCJt(G9UDQZtsI', 'gB&A!*e6'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/ids', {ids: ['gmTmYZvB2N0YIzG(vY@S', 'No&h(E!f'], seriesAlbums: 'oUApuZ!(40oJ!@dhj5L'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['ICFsv8W0', '9WBvujtPcx'], seriesAlbums: -6551426687827966}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['Ujh6NeBwz', 'rwCs6uE2NxKjQpOt4gO'], seriesAlbums: -8873339871297537}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['v5JsuU[%qQ', 'MWY2^AD^5nC('], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['tbequWS*R$G81q!gaD', '%uF&X9g^w)&tek'], seriesAlbumIDs: 'pMhMkV3K&N3el]Ff^e'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['6dMk9ME', 'sVBe2Kk2tt9)8F'], seriesAlbumIDs: -905996054560766}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['5633FXcB', 'IiA127y6'], seriesAlbumIDs: -912610664906753}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['b6czw7nR79', 'DnTRVURJy[rT'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/ids', {ids: ['&ExG75tH(*', 'Z@])3'], seriesState: '2!jTYI'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['8X@YXK', 'k![!(Qot('], seriesState: -1376418420228094}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['Z&54f', 'SiOb)9k&sOBLcQyEA9j3'], seriesState: -1707833976422401}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['EY4qAtNTcig)AgFsR6', '16Qrfi0cfH)Q'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['JtPBoP6[gwnF^]4TU4', 'b7F)nDmQS'], seriesTracks: 'krz)X0G&CXRw'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['rEi94oN', 'A*X6eq@cylwr&J'], seriesTracks: 6314384318005250}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['hPOTp', 'yWHt[YYMhZ)DZh(H'], seriesTracks: -6183467553390593}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['EWhQy1Z$m', 'rb@!uMYH1'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['(Jma4kC%d%^UXWE', 'iHzbKJ2X60YL9v'], seriesTrackIDs: 'hyGO9mvKwecv)aQY])N'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['(zV4GF^MMan*gHiOR5', 'rj^Htl'], seriesTrackIDs: -8031577334349822}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['LLtkmV5', '%gB@dIdzYHEgFE'], seriesTrackIDs: -2398776425709569}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['5v!w9nyKl#)9fegqY', '72ez(1&gs19cp'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/ids', {ids: ['JIQ0D[%2A5Bb@6]Ztdk2', 'W1V!NdK]bAbJr^RnoW'], seriesInfo: 'C(MkYFG(aTXG4Uxv)iLT'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['n1B7Vbn', 'ltO3HNfwId8[!wo8'], seriesInfo: 541838595325954}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['&eI4hf', 'BxPalHS)iV7'], seriesInfo: 5715451506065407}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['t(c91ZoJ', 'alxHOi%'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['(grCkeD@zVoV8D2bK9', 'uc[MT'], albumTracks: 'DywkS&nm&F3dsyz'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['6vzLKuOguW3%$#f', 'tgV&YXLo@N(1M'], albumTracks: -8111048661925886}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['EARaTM![U)LvV', 'q!*s['], albumTracks: -1555801919455233}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['s9Z1B5u$S@#v9X', '9RP$2b7xhHwpL'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['Za25Wo(', '4Y4Lo^2C1)dPFVXx'], albumTrackIDs: 'fKEuTM34eB'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['HFE!pzhWLsv*cH[BVkQ', 'oBo$7c64rV]'], albumTrackIDs: 1386600189657090}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['b!gh!ri', '6jrqoLyBy'], albumTrackIDs: 1596899844947967}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['wn!nV2s*II', '^f@nFvU6X1&s]UKgg(L'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/ids', {ids: ['j$K8k3tKm8S%wrl', 'STT$k$RQ&'], albumState: '%gxHXk[WxCa2f'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['o2i6bkliQlbLa', '!uTEz^t5pxbjP5d$4Z'], albumState: -4719623098335230}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['!*CRR', 'HGdZ(uhoukz6jLu'], albumState: 6140532220755967}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['0A3K%)hGt^GTY)5v', '8W0RRhud21oE5t'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/ids', {ids: [')0zU^I', 'JLi&j6c)KxfbnIW2gdf9'], albumInfo: '8La^KS]2tnp5sar'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['fmVxF9bRPCAywH', 'Ln4!0!'], albumInfo: 4852340611874818}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['pxQQDK', 'It)Se^7xREYmC8m9J'], albumInfo: 8634830023557119}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/ids', {ids: ['qmhhD1$', 'VZy&vUv#tQeG1M((*'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/ids', {ids: ['fcYlCxMjaw2mgmlH', 'Z!FpY%r(u2UoW(r'], trackMedia: 'Zjd]Xs8b@RSyxU!x'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['UrCKc4SqkS529MG8S[Rl', 'Mr%Y[8w$RX'], trackMedia: 4279860683866114}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['4A586k0@@k6Zz!a3', 'u!Qn8d^nnl28EbRl#K'], trackMedia: -1684667249983489}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['5MKYmb^cjhlTXX^o#Np', '$5xOtWCiHFDG'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/ids', {ids: ['KDXuhNKgw2!@Lb', '4JIl9k*[AzJ!7I'], trackTag: 'f*skIKU9b'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['c]mFy$', '@tX[FmNDX'], trackTag: 8991221468889090}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['7jvVY(2B8tp7d', 'NfKpyRNz*n%xJWra(9'], trackTag: 7494362632028159}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['1xujnhRx&0x', '4i@D675aK4%Kq%[Dr^W'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/ids', {ids: ['*Dal#beswUtF', 'NCJ(#KCM&oM0Q4'], trackRawTag: '2jMDBvGgpVH[C[EcW'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['lCZ6$ztm#Xa[2$ymhJg', 's%0gy8**Bs15'], trackRawTag: 6124943859253250}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['E[D0FoLJg9mQ(Fe4T', 'XGN1v'], trackRawTag: -8606258240159745}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['wfY&dqLzy^JlBQ$X5LY8', 't(ClmSdPbkavMSzGeHo5'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/ids', {ids: ['98eNpN]rwj6ChZ8yNlA', 'rDZ9QsjqJKf5vY5qQi'], trackState: '(4dZM9OB'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['HGSFACG21l%xCz^j', 'ESQeqsv35Vx&@'], trackState: -1702729252601854}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['(5wI9MUk4', 'j3QnYb8M3(Dz5N70'], trackState: -8222962079498241}, 400);
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
					await get('series/search', {offset: '8VK1I[ax#C'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/search', {offset: 19.93}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/search', {amount: '#il*23Sj@^Kk8zNqNL'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/search', {amount: 20.8}, 400);
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
					await get('series/search', {newerThan: 'r8%$BJm#BvX'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/search', {newerThan: 46.19}, 400);
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
					await get('series/search', {sortDescending: '!(9]&euc(YRxcC$ZYmZ0'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/search', {sortDescending: 2901757436887042}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/search', {sortDescending: -6774705625235457}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/search', {seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/search', {seriesAlbums: 'I$]UM2kn&ETbJ355'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbums: 1657687884431362}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbums: 2994354327126015}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/search', {seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/search', {seriesAlbumIDs: 'Fla^mdwYg'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbumIDs: 8847156639170562}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbumIDs: 1699531225825279}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/search', {seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/search', {seriesState: ')kZsND@xQYBBfY3(5'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/search', {seriesState: 8850190542831618}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/search', {seriesState: 7103720496037887}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/search', {seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/search', {seriesTracks: 'kCXlHsxLezwZ'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/search', {seriesTracks: -2163174262439934}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/search', {seriesTracks: -1850759083720705}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/search', {seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/search', {seriesTrackIDs: 'oE#jUj]1'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesTrackIDs: 4899150973894658}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesTrackIDs: -2111449358925825}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/search', {seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/search', {seriesInfo: 'nnox6g5DUcb'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/search', {seriesInfo: -5853020457795582}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/search', {seriesInfo: -7934815265357825}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/search', {albumTracks: 'iNiGDY'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/search', {albumTracks: -5905667332243454}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/search', {albumTracks: -3368869276155905}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/search', {albumTrackIDs: 'SEb(*fRV@R6hQ@QwQOaF'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {albumTrackIDs: -4783312988012542}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {albumTrackIDs: 7381203720077311}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/search', {albumState: '0A(CUX'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/search', {albumState: 2795964133801986}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/search', {albumState: -7638194606571521}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/search', {albumInfo: '*GkK*5EM@TmQ'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/search', {albumInfo: 6028645843861506}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/search', {albumInfo: -1267127222796289}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/search', {trackMedia: '^wz[J3JYy6CrjD'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/search', {trackMedia: -5089970201034750}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/search', {trackMedia: -524337400512513}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/search', {trackTag: 'aPr#GT['}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/search', {trackTag: -3767319478140926}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/search', {trackTag: -7044512677363713}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/search', {trackRawTag: 'Nh^1$wJ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/search', {trackRawTag: 7277532265054210}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/search', {trackRawTag: -1947095732846593}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/search', {trackState: '5OaOWRb*3wif'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/search', {trackState: -3915517639262206}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/search', {trackState: 4662080850362367}, 400);
				});
			});
		});
		describe('series/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/state', {id: 'tMmNF#A#7ZJ1P08vdpFK'}, 401);
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
					await getNotLoggedIn('series/states', {ids: ['e5Mi)iEL', 'swUY(xz9O44z']}, 401);
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
					await getNotLoggedIn('series/list', {list: 'random'}, 401);
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
					await get('series/list', {list: 'faved', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('series/list', {list: 'faved', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('series/list', {list: 'random', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('series/list', {list: 'recent', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('series/list', {list: 'avghighest', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('series/list', {list: 'random', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('series/list', {list: 'faved', newerThan: '1Tx]jV!6'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/list', {list: 'frequent', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/list', {list: 'frequent', newerThan: 93.64}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'random', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('series/list', {list: 'frequent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('series/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('series/list', {list: 'faved', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('series/list', {list: 'random', sortDescending: 'D#cMzq'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', sortDescending: 2468216483872770}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/list', {list: 'avghighest', sortDescending: -6282752844365825}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/list', {list: 'highest', seriesAlbums: 'E![d)&$7sLY$^wCG8d9'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', seriesAlbums: 4042366230986754}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', seriesAlbums: -234153790406657}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/list', {list: 'highest', seriesAlbumIDs: 'WIW4Q2UJ'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', seriesAlbumIDs: -3660210447056894}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', seriesAlbumIDs: -7180350748884993}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', seriesState: 'B*hKkbcvU]5'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', seriesState: 6241040012935170}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'avghighest', seriesState: 1462249583542271}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'random', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/list', {list: 'recent', seriesTracks: '5Qw!L*$31BmvX35S9'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', seriesTracks: 2562809636323330}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', seriesTracks: 8654921272393727}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'random', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'frequent', seriesTrackIDs: 'D]i*&cQ#'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', seriesTrackIDs: -3012841686695934}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', seriesTrackIDs: -4561270762110977}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/list', {list: 'frequent', seriesInfo: '4SbS3PlQLDN'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', seriesInfo: 665535561859074}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', seriesInfo: -1715771780628481}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/list', {list: 'faved', albumTracks: 'cZ)EGfgLdm'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', albumTracks: -2761310945148926}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', albumTracks: 5540888126160895}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'highest', albumTrackIDs: '@CIkU$4Fv]i(XimeHZ^'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', albumTrackIDs: 1410326339780610}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', albumTrackIDs: 127314306269183}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/list', {list: 'random', albumState: 'zy#NwfPkPfFxUi'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', albumState: -5477890116288510}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', albumState: -4509895269285889}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/list', {list: 'recent', albumInfo: '!h6zsh]w'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', albumInfo: 2869030939525122}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', albumInfo: 2728112215293951}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/list', {list: 'faved', trackMedia: 'yoVIkggr1cv[bWCs4(4'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', trackMedia: -5665333360721918}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', trackMedia: -3156534347431937}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/list', {list: 'random', trackTag: 'ql@c7#&H7T9Qbq'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', trackTag: 6780836766547970}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'avghighest', trackTag: 8178914241282047}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', trackRawTag: 'X6quSnvpzUL0bht6W'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', trackRawTag: -1411282678841342}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', trackRawTag: -304542616911873}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/list', {list: 'frequent', trackState: 'ugu$Va^$cyZKzfdE]f'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', trackState: -8625663099535358}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', trackState: -2321518654652417}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/list', {list: 'recent', offset: 'JQ&xqbf%H@8KwpiBWDF1'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/list', {list: 'frequent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/list', {list: 'random', offset: 91.25}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'faved', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/list', {list: 'recent', amount: 'RI!#)'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/list', {list: 'faved', amount: 76.16}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/list', {list: 'frequent', amount: 0}, 400);
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
					await get('series/index', {newerThan: 'GtHn&DeKqgkkrJH[@'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/index', {newerThan: 87.33}, 400);
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
					await get('series/index', {sortDescending: '$y6P()AMizCId0t]Htj'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/index', {sortDescending: -2421717825748990}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/index', {sortDescending: 4235310103789567}, 400);
				});
			});
		});
		describe('series/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/tracks', {ids: ['%vdj$]', '#1U7F%8C']}, 401);
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
					await get('series/tracks', {ids: ['*q]RzNol*Q', 'GkCnw1JP'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/tracks', {ids: ['fPH&mSvE2f(fgcGi27gK', '8oetjxY^*]kqLdXI'], trackMedia: '5ikC3r&7UwEEhJYrx'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['T!Umx&ZcrsHS', 'e2Qj6reZEYuJlvR'], trackMedia: 5940535336370178}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['n@IUE&7meUB&R8)UyE', '45Oodg2OA#&#X%'], trackMedia: -4456009628123137}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['PTKEUEHgp', ']Ydx(%J#*A'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/tracks', {ids: ['mDFQy', 'l^^@#xtZa(CpMC^2!'], trackTag: 'Ft%PbGWoiw2u'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['l&!#!&Q', 'n@*r47lMGXzWJM1y'], trackTag: -1727660724060158}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['mvEg0c#N^*V', 'XRH8QzgVcq[pNdms3Ec6'], trackTag: 938156459294719}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['Yr9X#q^[FpZ6$4', 'M0&M11[bOlV'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/tracks', {ids: ['QNYb!ovpc&ml', 'Qd[]1#RGuV05**0P'], trackRawTag: 'kPbw*ysSMIBRr0[8'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['ED[3*])gr', '5[&p]^@S6ZN3tzIug'], trackRawTag: 3164017401004034}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['7Lwc%&8SIErzK', 'bc%Tdg]4%2xTm%'], trackRawTag: -3174843302281217}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['NM@9ZH4H!5leFr(qW', 'Hz[oXef6ULHHOQ'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/tracks', {ids: ['OU5wBGI7gXerLY%m$#', 'CbJNT!YeN$#CA3Q8'], trackState: 'nHZ)QFx*R8s'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['H2cp8S1%zTh2GY(Y9gV', '0XkG^$ix1@ENF'], trackState: -2285309219831806}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['cOpXns!&1sW4*xZ]x74', 'kh0J6AQ$F'], trackState: -2454223576891393}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/tracks', {ids: ['$QCV^uZ', 's]ZFI74$LWg@*A'], offset: '&V%rDDvVG$9Uy'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['[2*VF5T', 'xr@92KKgtQyZ@9au5Y'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['WCm3H$dBE*t^a', '8WH!TZ^CFzo)ly5qiDvZ'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/tracks', {ids: ['ZN)PRg', '7#ten4lKH!sR(Zi['], offset: 88.77}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/tracks', {ids: ['G5vR()Dp94OIk', 'fS^)*adJJHgnzMZ'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/tracks', {ids: ['*3dlXLc', '^@yq&Y93OexRzseqSAvP'], amount: '5F8TmmnRing['}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['JW31FG', '%C](q#mKJOsbl'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['Qc&j%r!G8', '30cOA#wjBNsO)R'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/tracks', {ids: ['fiRdg3d', 'hCVhMWs)DB!gajBh43'], amount: 68.59}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/tracks', {ids: ['cx&!4', 'oM34WvDa@UNP6Fs85&%'], amount: 0}, 400);
				});
			});
		});
		describe('series/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/albums', {ids: ['C)J#Myyn#', '9rZ7MK#PG$fJt(%*25eI']}, 401);
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
					await get('series/albums', {ids: ['9Hu%j[bXy9EqBG7&694', 'd1Uq6)'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/albums', {ids: ['L8Oazs', '[*ubLLpp'], seriesAlbums: 'WXWv#XeBrf^PnXoqE'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['%4XcR(TOLq', 'J^86l$'], seriesAlbums: 4023135678496770}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['C3QjRU(', ')D4fqa69o%DdA!YGe'], seriesAlbums: 848801921236991}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['Xefm#NVatXf', 'coYl*5kcdwn44XOC'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['%KdQLzJ3QFV7SWH2mWm', 'e5MG@0!nKb6!z7euQBm'], seriesAlbumIDs: 'Nz*h4wK[a4'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['R]8Mf)T0', 'Gx!1sTC2DMAnk&'], seriesAlbumIDs: -5575523128311806}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['qMUJL7N9VwMe#0n^XVNH', 'y5yc^@pTTCyS%'], seriesAlbumIDs: -5041661742678017}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['$Lk9SnJIIPC[Tsvkb', 'dJ@7J7[UXz'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/albums', {ids: ['GMjZI8$p7i0w#Bdr1f', '6^G!!hd0Z[EL['], seriesState: 'JTq!t'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['KBHe5kITz9*63f', 'w&5Egg3M91uEqh'], seriesState: -8551618106621950}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['na23HxMb)]A', 'nWu*KoA'], seriesState: 1391980072402943}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['B4DcFByo', 'tvvbYr'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/albums', {ids: ['%d4qvG7N7WrlWFt', 'UuTIE&p]'], seriesTracks: '01e#rPBS19[H*0^!M*L'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['aG3g81QmD08vZh', 'I^CLH'], seriesTracks: 1147685360893954}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['*QcBXO', 'S3CZJ0xKT6PbxscV)iwO'], seriesTracks: -7491158099886081}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: [')fxh*OVFwcr61@hdPW', 'qa@[B8TP7e*5w@a'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['Ljdcx', '5$no8#'], seriesTrackIDs: 'px2v!$8H^T'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['Q*8!#[!k(lNtnSAx', 'A3ls%*(HoLtZW@NG'], seriesTrackIDs: -8798012830646270}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['*#37XK', 'Vel60'], seriesTrackIDs: -4140425002614785}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['QG[3g', 'WC!rQN('], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/albums', {ids: ['XIFgG*7bb*U[B]', 'UTy2VoQHXi@yC@5q5JL'], seriesInfo: '7kbF]'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['a0geGX]!QvhM', 'g6^nYVWJ1SA)aMT))n0b'], seriesInfo: 6248115363381250}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['s&)*0EE&8YsBrbMA]b7', '%eHnQjSYXAC!J8bxs&X3'], seriesInfo: 5989175161520127}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['6n^^Hb$2rP2H5HqBf', 'h0xNXV0SoLcvTr66Z%'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/albums', {ids: ['%mpQApu6JbCco', '1ZLB7UGq5'], albumTracks: '0ljS(G'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['oyWiffVC2^uhl%wz^K', 'miUz^H'], albumTracks: -7384986416054270}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['SwsSSgW9dK(NOc[c6H', 'xwSLGpqQ&wZb*Az3*'], albumTracks: 8051714145910783}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['uh*fz*)U7Q2AZ26X7x', 'Y8wxS#l^s*BIM#*9BQKx'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['nu9VUNaf$^2G4b#E', 'XMmXeRU'], albumTrackIDs: '%F38]WB3ZyeF6hl'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['v5T%s6wac]3IiNJL', 'u4%1mxCwgh%3kho$RSB'], albumTrackIDs: -7954016608714750}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['UcgUIvJ#ncBL6In0iv', '*l#6Rxb$9W'], albumTrackIDs: -1853139644841985}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['aCYR!h4Q1&vYl', 't99x^k]3yNcZvP^9G'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/albums', {ids: ['vAgRn9RYuJU4bZjOd', 'X3kw2j$@J]PHZKw@*ng'], albumState: 'n!Lmg1N7WJ3j'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['9XM][ygoG', 'EQTG5UUmO'], albumState: -2856606656102398}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['V1hUbF^WnUW', 'zJO6)'], albumState: -5009658347520001}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['Hf]hsInyi', '*02gNKBdaFMf0jg'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/albums', {ids: [')1a(]AOT@32', 'Z7OLyoWlKn*pI!y6^o'], albumInfo: '!yzZtvAp'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['!Dx0bgGzUJ', 'qG^k@V(Kow!7kZ*4MnR'], albumInfo: -3926771032391678}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['#xFfQiCNRCkHlMRD1', 'SYU0YVaCOXX3gvtR#n%'], albumInfo: 8692569751945215}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/albums', {ids: ['Kt4ijZL&nCJ(4BpU(jN', '60%XIQc^0@'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/albums', {ids: ['^rToGHHbmi', 'dSfI)yySD0Hygab6)'], trackMedia: '7yZRvnFY#y$c^Mc'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['u&2a^', '5Z84hDQ6j'], trackMedia: 7073871983280130}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['hI3O!RHZ0K', 'Nqi^[xL!g'], trackMedia: -5371681119928321}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['rDWZcyvn8H%Q[R', 's$$(]r)]^([CLY'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/albums', {ids: ['l8vBCtfKx[B', 'KEkxV(ZyXfh'], trackTag: '!LMDw)I'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['oY9x(qRk', 'iqIfTNiQxZRe6hh3!Bpd'], trackTag: -5098469479940094}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['G4gY6b%Gh5HQN@c[bcp0', 'ThgG5anb^6!z9^C'], trackTag: 165900560891903}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['F)qf3b%', 'T@73QfueDQxGvgwqL'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/albums', {ids: ['NaUTaqY7#q&ar^NbvT', '$avI#s5Qxgb'], trackRawTag: '$9E69]kBQ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['w7eqAsNF$OEOGcHbm', 'tU0TaBR$YY'], trackRawTag: -1378047861194750}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['VaNc23Gp', 'aGyt8B'], trackRawTag: 5294730363535359}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['9OF(Un%m8Z4XtnpG', 'gr![Z22[A@[TX2'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/albums', {ids: ['mZ)Pq^V*Rt)x8p', 'wK@UpMZ2)0jMZ'], trackState: '57EfeVu'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['kQvO$Rt[69zIK@Sbzh', 'v6EFLSeZtwBsL'], trackState: -4820175689875454}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['BgeooLxxMySRmRnruN', '!ZSy]sr()tRow4a'], trackState: -2836350411735041}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/albums', {ids: ['jhxc8*VKR9YjFaaz!j7', 'Qwi!193'], offset: '@bchNaa#Elo2'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/albums', {ids: ['x55N#IUsvRkG', '!$%ukF!XMf'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/albums', {ids: ['1kJtd', 'UL8*RjFWy@LqENzkP3'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/albums', {ids: ['$s@EmynK2B', 'v$)HwJ'], offset: 57.25}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/albums', {ids: ['$Dt%V2Awvn5&pc0', '4*%BSoUcHlv1'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/albums', {ids: ['eH)9wWnaxYXzuVi', '8e)Ubh]tm5bTEt0H'], amount: 'fH!^or!cUR%n2'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/albums', {ids: ['d3dHP&BE%N6', 'aPNd7[6'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/albums', {ids: ['#kl6vC(hiAlA7IOwOmnw', '4JYq[rNtU'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/albums', {ids: ['dO5p0!XufDNF', '^bL^n6lWY7#k[$Yaaa3'], amount: 40.22}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/albums', {ids: ['2VW2^d^Kn)Ntn26', 'Ajx!RyyGamOJgn#I'], amount: 0}, 400);
				});
			});
		});
		describe('series/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/info', {id: '77bl)23eM8!'}, 401);
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
					await getNotLoggedIn('playlist/id', {id: 'N]H[FIs[7]U%8]hVZ$Sz'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/id', {id: ''}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/id', {id: 'ZaWv$*mp&%mp', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/id', {id: 'VFH*rBtGtf)^$', playlistTracks: '%zaQaP^fcf#kLOuu'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '*NCumvITS', playlistTracks: -2931482075070462}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'jZn1BFXx', playlistTracks: -191737049907201}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/id', {id: 'teQcux*P]d*^Vrmnu', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/id', {id: 'pU!8SNf)*S@Bd^', playlistTrackIDs: 'ofpr)np'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'c(0Z0', playlistTrackIDs: -3064730780434430}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'mI#u)', playlistTrackIDs: -6394348321112065}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/id', {id: 'Aa*w@Woq$p', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/id', {id: 'BFjdpB*ec3Nu', playlistState: '1h44Rbhd!GFkDBqR2p'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'fQQ)145MbH8fZGks', playlistState: -8355283147423742}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'VfKGf0@gUpnm$X#', playlistState: -4636912920821761}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/id', {id: 'zmNi[W', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/id', {id: 'O9(&SjfKZ]0JHcs', trackMedia: '%q(OT$ziX%]QemZ&'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'ShgC5K)68fMY*', trackMedia: 3871681919582210}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'csMUa$wZlL2w$ITj', trackMedia: -5135120872767489}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/id', {id: 'mFt^a!x*1g@80M[WOux', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/id', {id: 'DO(1mtqyN3XtW', trackTag: 't%NZ7(grwg9'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '20qO@9I', trackTag: -263367251984382}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: '^]9fJU', trackTag: -4141945047744513}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/id', {id: 'qZLxecF)M9RGJqbLhr', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/id', {id: 'FerIAwtBMK0H#aQJUoF', trackRawTag: 'AtlZh5prr]'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'Q@*$$&', trackRawTag: -8867576557862910}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'O^GlR%O', trackRawTag: 6085224433713151}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/id', {id: 'sLIlqu]3b$t5WuBnH', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/id', {id: 'zL$&]ENR$ZOkfAYD!%]', trackState: 't[gn9q#0(&!4q$%sh@7'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'gocz*mY[oen[kY#', trackState: 7730446246871042}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'd)xN#D4YM[98JkfdW&', trackState: 1739703279681535}, 400);
				});
			});
		});
		describe('playlist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/ids', {ids: ['I&xbBJnTgET7CFJs', '$YKM0k0f0gOF8pd0n']}, 401);
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
					await get('playlist/ids', {ids: ['zvIXjKnpa@b#H5i@D', 'IJ[l$NqSW'], playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/ids', {ids: ['pXhnmu[Hs*%Aq$', 'VgbVNX'], playlistTracks: '78b)AAq$*hKz'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['#OUw$Z4V90u]1Xan8@', 'nVZiA3Aa*OSim4xZYu8t'], playlistTracks: 8803163737948162}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['[VSWNk]qg#f@zsAGL6t', 'u$0%&BH)O@TG'], playlistTracks: 7639916993314815}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['0w8DTVz5yP2YcN9YPXf', 'zSbxhalT1N'], playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/ids', {ids: ['sVyVT6OkSY^CEN', 'FM8tnRP4ZcG'], playlistTrackIDs: 'q!MBQ6zTGZr&Y'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['&$vDtWdO', 'rPgy8Id&z*I'], playlistTrackIDs: 2536983641456642}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['r9mUJvxwBJOc', '&7MVmPv%6]5fcAC'], playlistTrackIDs: -3581855731286017}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['aVaMslMPDuCoA6', 'RMH$%XGd(6'], playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['MqJ(hfTvLE[3A[a31', 'fa$)jd'], playlistState: '9FLSn&1#4@JpurNtl2mz'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['Four#CpPMfC2s', '[h4lj9tOC18i]l^r'], playlistState: -4039261917544446}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['Z$$w]dg4kHy4', 'uerf5&ak64ebQFd'], playlistState: 4521027291840511}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['vG4j@FZOiw', 'XikXwdcsoHW'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/ids', {ids: ['v(GItv$i[jbs2w', 'SdI)8@31MKaPdRBzknr!'], trackMedia: 'GM!$SX$ope9PxBa8'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['L]VOl5IVd61xT6u9Rpt', '5b)Kc[J!jm'], trackMedia: -85412399808510}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: [')2[I#5bG[a3O!3HiTH$', 'r%WOuRxjmfENBPW@ur'], trackMedia: -3418362109493249}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['MCHQVHywNtq', 'I3@w*9rkJCrCQS'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['N3^)3#s$!bSiiF833)F', 'qeHd&MfqY8'], trackTag: 'a5oOhLWo'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['I987]bP$z3w', '*xtk*x'], trackTag: 7961274704986114}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['oWvV5h(r3Uw', '[ec$28ddUBf&@wE*o'], trackTag: 889234458148863}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['A*8c7RF', 'v@$ooshvH'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['i5dofQ', 'xeI7k)A1%g'], trackRawTag: ']6kFc)SnFPu'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['vsazzJWY^bgjxt6$', '@Q6pInh$E]]i]m'], trackRawTag: -2625070249803774}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['MU8XOtlxYv7%4QTUX3Bg', '$Y!ORL&JLFD'], trackRawTag: 1136762848018431}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['ft%qjPQBX', 'y(zJ#qHU#m('], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['GEhnKZtV2K@7', '(xuQByg^1m'], trackState: 'OUR2oCVoS^cur!Q][sAl'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['txb8eXT*A)lo&&t', 'm#fy6Ja&'], trackState: 334437468340226}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['N(oiT', 'EE8Kzzw5DgkEH&zG76G'], trackState: 2287727278030847}, 400);
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
					await get('playlist/search', {offset: 'Y&Tkyr'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/search', {offset: 30.18}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/search', {amount: ')xA!fp8e&7jRXk*%f'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/search', {amount: 8.16}, 400);
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
					await get('playlist/search', {isPublic: '&Y#a[2KfrIo*M$2'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/search', {isPublic: -3810437426577406}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/search', {isPublic: 8299091511476223}, 400);
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
					await get('playlist/search', {sortDescending: 'libkhC'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/search', {sortDescending: -1404052759904254}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/search', {sortDescending: 5481881248202751}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/search', {playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/search', {playlistTracks: '8viJEWS%y)6yFsms$T('}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTracks: 1543304860663810}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTracks: -4244819203325953}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/search', {playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/search', {playlistTrackIDs: '8Z&0rJ58L)d&LxICO#z'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTrackIDs: -1250043935850494}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTrackIDs: 7433362402705407}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/search', {playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/search', {playlistState: 'juK0V1qkhT4NHiLf'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistState: 4720274742181890}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistState: 500264452751359}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/search', {trackMedia: ']BlIbqt3gPwa'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/search', {trackMedia: -6477522086658046}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/search', {trackMedia: 5545988336910335}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/search', {trackTag: 'jhbCbxt^hJZ87mZh3vWU'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackTag: 7972452168630274}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackTag: 6520472447483903}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/search', {trackRawTag: '5(FCg!9*X4Pt4wO'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackRawTag: -813454390722558}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackRawTag: 3061701851217919}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/search', {trackState: 'YeuJOZuMraFI5MHwy*('}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/search', {trackState: 6809044295614466}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/search', {trackState: 7615601178574847}, 400);
				});
			});
		});
		describe('playlist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/state', {id: 'RO]Cn'}, 401);
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
					await getNotLoggedIn('playlist/states', {ids: ['D)ZNJv6z@4NM[', 'Nq5s1yFNFdu5i']}, 401);
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
					await getNotLoggedIn('playlist/tracks', {ids: ['#lgBl5^6m7Tm8dt9I', '0pOLQBR']}, 401);
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
					await get('playlist/tracks', {ids: ['8DcjT4rH0HZHF', '^KdBMTPMh)*)61wLmO3w'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['^FO2ORsbusA6^t@U9w', 'mUNvohqa'], trackMedia: '3BWbafH%YY(i#)]ifM*i'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['k[^k)wSCwdyC!z', 'rijpyj7Uzg@'], trackMedia: -4165301440610302}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['IRM5oJtXRo', 'Iuv5!t7YHO(IXxvcZzh'], trackMedia: -6408257979547649}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['U$Kxx', ')43fn9qzoqhqO%YB'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['QZLTk5vVb6', 'u3ESglh%Jq$i'], trackTag: 'gGBFcV'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['y*kcLrDz', 'XGPw]Z'], trackTag: 868510758600706}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['bGW$EOcGc8aU297z', 'Wy(7Jn2)eVTUEbIqkz'], trackTag: -394609389731841}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['ElCwYAi@Il7$M*d]49X', 'kpEhM'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['SIwxL', 'ct5q&8V#jzFwC'], trackRawTag: 'oDswSirS@^mDgg'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['sPg9b4VueWjV7X7', '4FNT(WP&GZB19(c4Bw'], trackRawTag: -8996549057052670}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['JHw((l', 'G1eXQPUdb#'], trackRawTag: -5381986558410753}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['E^hM9%LrGS()LTL47cQ', 'TvYg*rvgBr5'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['I]]g(JRlQ', 'a&6Z^QOfA7[QFfg(5T'], trackState: ']6(QmlIfYfHSyPBmB!0^'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['Id)^oMJK', 'Yejf2T*[Z!'], trackState: -5946965472837630}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: [')PQ!cB6LOkoSw3gu', 'ahohZ#ZlfI&J)YV'], trackState: -1266603803017217}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['4#OWkjk7ne!WPzxt4l27', 'KHUlyU'], offset: '!yaiyW0MOXBmj'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['uG8pZ(t7*dkgQ7FyJ', 'e(ULC$1ZUSxn'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['2fq4C#([Qz7@', '#Bi[dE$]QO6N3U!'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['9qA*%hlDV6$KOVlYiF(m', 'Ycw!8)hEkpR'], offset: 49.86}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/tracks', {ids: ['&*NTK)rVr^87hY', 'y#!un&DU9'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['hb50Ga1ysHlif', ']kSpJs)XM'], amount: 'RX$!zy41uf'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['hKvoqgzLD0&*&kV[YD[^', 'p]I1OlFOtUkh'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['M@&hswL1', '@k%fE&Mxb'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['@OhMe^E$TGX0k', 'SPqtyLe2eWli0rv'], amount: 69.71}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/tracks', {ids: ['A@%1ajHhk!', '1U%sBtuSmJ'], amount: 0}, 400);
				});
			});
		});
		describe('playlist/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/list', {list: 'faved'}, 401);
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
					await get('playlist/list', {list: 'frequent', offset: 'JrWQs2#LfMPn'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/list', {list: 'faved', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/list', {list: 'avghighest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/list', {list: 'random', offset: 29.77}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/list', {list: 'faved', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', amount: 's252@ULug7e0IHnANm'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/list', {list: 'avghighest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/list', {list: 'faved', amount: 57.26}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/list', {list: 'random', amount: 0}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/list', {list: 'recent', playlistTracks: 'm]ZqwgpwyJR^YPV09KO'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', playlistTracks: -1366972826648574}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'faved', playlistTracks: -1532857612763137}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', playlistTrackIDs: 'JsBbsu)qXgMC^TFwK'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', playlistTrackIDs: -3241077410627582}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', playlistTrackIDs: -1810361506332673}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', playlistState: '8s01Fget%z1)g'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', playlistState: 3616764491464706}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'frequent', playlistState: -1777405861560321}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/list', {list: 'random', trackMedia: 'vUF1%)8'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', trackMedia: 1484113605296130}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'faved', trackMedia: -6975314076893185}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', trackTag: '5Td*[0ZGv'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', trackTag: 1633944248254466}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', trackTag: -2253157501501441}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackRawTag: 'Uf4V$n@m%jRc'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'recent', trackRawTag: -7979714379513854}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', trackRawTag: -5530572357107713}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/list', {list: 'random', trackState: 'AwJ3$N*RpGX8Hej'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'faved', trackState: -290171241103358}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', trackState: -3468595220709377}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', name: ''}, 400);
				});
				it('"isPublic" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', isPublic: ''}, 400);
				});
				it('"isPublic" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', isPublic: '@3qvFy8Q4y'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'highest', isPublic: 3433887397052418}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', isPublic: -2547570798755841}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('playlist/list', {list: 'recent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('playlist/list', {list: 'random', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', sortDescending: 'lO9pmsZvA'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'avghighest', sortDescending: -4024011860213758}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', sortDescending: 2670679770005503}, 400);
				});
			});
		});
		describe('user/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/id', {id: 'E5glzF'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/id', {id: 'E5glzF'}, 401);
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
					await getNotLoggedIn('user/ids', {ids: ['b*71cnP%', '8)FgsCqWRU@r']}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/ids', {ids: ['b*71cnP%', '8)FgsCqWRU@r']}, 401);
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
					await get('user/search', {offset: ')v0H1R#N'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('user/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('user/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('user/search', {offset: 27.74}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('user/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('user/search', {amount: 'gh%YdQQHg@Zq^Y'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('user/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('user/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('user/search', {amount: 20.41}, 400);
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
					await get('user/search', {isAdmin: 'UqPwC(jL]E$&jp%'}, 400);
				});
				it('"isAdmin" set to "integer > 1"', async () => {
					await get('user/search', {isAdmin: 8413857471004674}, 400);
				});
				it('"isAdmin" set to "integer < 0"', async () => {
					await get('user/search', {isAdmin: -7775072337002497}, 400);
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
					await get('user/search', {sortDescending: 'j5QBWyx3xwd8@W'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('user/search', {sortDescending: 5904929625473026}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('user/search', {sortDescending: -1227089927733249}, 400);
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
					await get('playqueue/get', {playQueueTracks: 'C(A7pIX)7^M'}, 400);
				});
				it('"playQueueTracks" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTracks: -1994804560920574}, 400);
				});
				it('"playQueueTracks" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTracks: -8259902799609857}, 400);
				});
				it('"playQueueTrackIDs" set to "empty string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: ''}, 400);
				});
				it('"playQueueTrackIDs" set to "string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: 'U0CnPCeBrfD8@V6]DLBA'}, 400);
				});
				it('"playQueueTrackIDs" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: 7413877721530370}, 400);
				});
				it('"playQueueTrackIDs" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: -7560811585208321}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playqueue/get', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playqueue/get', {trackMedia: 'M[%&PvpPT6(x*!gw#g'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackMedia: -6817844054458366}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackMedia: -7603113267560449}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playqueue/get', {trackTag: 'bNzax#b]M3BW1h'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackTag: 4336005498798082}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackTag: 2166311924793343}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playqueue/get', {trackRawTag: '[VVb#JcOsK2vim9'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackRawTag: -5758714048937982}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackRawTag: 8098719513706495}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playqueue/get', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playqueue/get', {trackState: 'OXCPvR'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackState: 5552221320118274}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackState: -2177393057857537}, 400);
				});
			});
		});
		describe('bookmark/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/id', {id: 'TqbE!FxOi[w%Y'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('bookmark/id', {id: ''}, 400);
				});
				it('"bookmarkTrack" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'YrpVGaKQdrkCw', bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/id', {id: '#eIHZ', bookmarkTrack: 'q@2gQ#2WjMBMLK'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'h@%PFO6I&H', bookmarkTrack: -4158638138589182}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'ZKP9%', bookmarkTrack: 1746605300514815}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'gnbh&0zGSc7B&0S', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/id', {id: '*zN]Opj]M1', trackMedia: 'QtazbT8Vc*'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '[v$D&5Qe&!!0QcKE', trackMedia: -601943072309246}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'AIpm6s@1&^yRds', trackMedia: -1924354594045953}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: '0(emo47rwQsNn', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/id', {id: '4hGg^eEW0q*W', trackTag: 'Y9Fx&scEIkVZ82'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'RPq7DEqKU', trackTag: 5055968664616962}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'qg6jovf96jpwkT', trackTag: 3318929288069119}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: '3(bh*9L&!S@$2', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/id', {id: 'yxFm%BQo)F#vxv', trackRawTag: 'O5kEzfwuX6C6lxA!34'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: ')ZAv@%R[XG0JDPB[[', trackRawTag: -8269567298109438}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: '7&3AQoKtzU3Y9D0pji^6', trackRawTag: 5719898193919}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'QD5*a', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/id', {id: 'tfD!m3V7SZZg%$mrk', trackState: ')e[k#IQgd*]kqnvy'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'BRlcGGrAqK62v5X', trackState: -6834114623700990}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'j$wR[S]xLz', trackState: -2259089971216385}, 400);
				});
			});
		});
		describe('bookmark/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/ids', {ids: ['%%BxfL', 'dl#hLn[h5Z2c9$*)TrM']}, 401);
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
					await get('bookmark/ids', {ids: ['Tz5rb$8ZVDPuWX', 'UeN@32HZ74eJFOOMtyL'], bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['B[RxQta4na1(x', '1maRrcOlxL'], bookmarkTrack: '!qFfsa0kX!g4AyekQf'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['MBsLvm0@', 'C3KISwJMXM'], bookmarkTrack: 6701566757175298}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['z#b9NUGurso', '0)*0&C$*7)SQIbeJzh'], bookmarkTrack: -3358079374589953}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['Mmefm', 'V160([0L*JQ'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['Wj]E^*Ja&g8[ZLV^O', 'ao[3!'], trackMedia: '76*9Fj4(EE&23I6to'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['dX0^V3FR!o(!qZ%Dv', '])wODj3a2PxZZe6'], trackMedia: 2021779237240834}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['nX]qtZvZF8@6dgi8p99', '8KFWE'], trackMedia: 2603262356226047}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['yt!@jn87yF(SBNZOhw', 'ozLxC^S8P'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['[#PDU5z#nmJS*^OYg5z', 'NRr%JMj'], trackTag: '*m5bwODD7&qXIYJrq'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['21x1odOZoRVTCYyS', 'WhX6$aislYa)k!eSA'], trackTag: -7024281342967806}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['Lo9*]HLRhK&!%%WcW', 'O[ZZh'], trackTag: -2235729254023169}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['S9qQy', 'c7dfjUB'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['87g4Us15L', 'qB#tQnhtxL6S*&9KGmi'], trackRawTag: 'mCp&cXOP#'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['Y&Np#K]^OrtPykZk*IQ8', 'YDIK[PHa'], trackRawTag: 8732691943915522}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['5@w@T4w*', 'AgCCOA]*KkAFYF'], trackRawTag: 115086052032511}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['vYjWAj2hAy6a7MPb', 'j(pXIy)5N'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['ncz78RQIp!)6v6G^xzHp', 'RQ0qcb0Rsp'], trackState: 'PY[j&%lUXH$'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['G!te7g)!Nld)s', '!!gu4YfciTSdF'], trackState: -3067746459844606}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['reqq8Bvj$&4^rEu9CtoZ', 'M8^Ijf'], trackState: 997198405828607}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['R5kVK6XrWB8@Ol2', '@mX#O)bW2!8DgZ3LoYj'], offset: 'k&0SL1'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['sUqC1fGw5ZxFraw(z!!', 'u!PA02vpQXvI8LPebH^'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['1WkEk', '*R4ZoNy$BV'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['uwyRoSki4DFirO%P55f', 'ey9z7f'], offset: 93.38}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/ids', {ids: ['BaIrcdU8qZJ7e2(Ykc', 'ceOHlDEO7hX'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['rDm$%iCn7$yD#Lw61', 'uOD2[sz3*rd'], amount: 'x5YkVHpYVbOk'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['9KW9v[TI^%$', 'JysCx(^sMf'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['@evK&t%XCkCR', 'IC]Vb0j!JDcl@ue'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['fqG&6d#Yj13N1@&!ncL', '3Gag1i'], amount: 45.74}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/ids', {ids: ['NG&p)WOclJkF', 'sAXvCsAhqMm'], amount: 0}, 400);
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
					await get('bookmark/list', {bookmarkTrack: 'xrHUEDM*'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/list', {bookmarkTrack: -1935778263334910}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/list', {bookmarkTrack: 4939301204787199}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/list', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/list', {trackMedia: '&4Bu)CYOz'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackMedia: -7227527319781374}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackMedia: -364677301272577}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/list', {trackTag: '$*3mU'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackTag: -4112813723222014}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackTag: -8008234023518209}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/list', {trackRawTag: 'bwLtJv2RqzqZ^bV*xCz^'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackRawTag: 4585054684577794}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackRawTag: 1036598347038719}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/list', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/list', {trackState: 'Q2R@awY'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackState: 6164378457997314}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackState: -7229780088848385}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/list', {offset: '@jSGX6K)'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/list', {offset: 71.95}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/list', {amount: 'hwdIl&'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/list', {amount: 60.72}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/list', {amount: 0}, 400);
				});
			});
		});
		describe('bookmark/byTrack/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/byTrack/list', {trackID: 'a]pwsMi8#l!b7wHqn'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"trackID" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: ''}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'HjBdiGL6Q', offset: '*%@54tq[YDos'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'W8&D(XkxX4', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'ObMe2rzfL9s]%cZH', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: '71q6^Ts', offset: 68.13}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/byTrack/list', {trackID: '[z%n4C(O(y6bqXgP2GNP', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'tNimB^4nC1RobV$0mGU', amount: 'g0@G]6N)(f7'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'NT9d09BaTcezqp', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'isnkiPF^]e3p', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'zAjlwVvDfD6uUDNGA', amount: 45.78}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/byTrack/list', {trackID: '@j%oNlAIKirJBVtb', amount: 0}, 400);
				});
			});
		});
		describe('root/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/id', {id: 'E$[2lM!ImzTtL'}, 401);
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
					await getNotLoggedIn('root/ids', {ids: ['&f2fVx0gYMZR', 'x)mu3Zii2dnqPwM']}, 401);
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
					await get('root/search', {offset: '[n(Uob)D$Z%J'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('root/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('root/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('root/search', {offset: 96.63}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('root/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('root/search', {amount: ')4zaZJrUTEvtjH)X@'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('root/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('root/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('root/search', {amount: 2.6}, 400);
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
					await get('root/search', {sortDescending: 'hesZF$XN'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('root/search', {sortDescending: -1978075633942526}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('root/search', {sortDescending: 844411575468031}, 400);
				});
			});
		});
		describe('root/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/status', {id: 'v7p^gUX3gSI^$SW3N*'}, 401);
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
					await getNotLoggedIn('admin/queue/id', {id: 'rT5f%[1K'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('admin/queue/id', {id: 'rT5f%[1K'}, 401);
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
					await getNotLoggedIn('folder/download', {id: 'XS@b9'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('folder/download', {id: 'XS@b9'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/download', {id: 'TRt1G@', format: 'invalid'}, 400);
				});
			});
		});
		describe('folder/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/image', {id: '12Y%C&DSU2zbe'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/image', {id: 'JR2yqQbW]l', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/image', {id: 'xiREv8', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/image', {id: 'dw0ot!qOrVs^OV#hK', size: 'Lu5S[*$('}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/image', {id: '#FVngF', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/image', {id: 'IdAt#sUAs', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/image', {id: 'R&ZASoTjU1', size: 435.81}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/image', {id: 'wChS92Xa&Xlbpy)v', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/image', {id: 'hSxUyTzwtt]', size: 1025}, 400);
				});
			});
		});
		describe('folder/artwork/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artwork/image', {id: 'qxGVcwsC'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: '61yoaLWa9@c8EU9sa]', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/artwork/image', {id: 'RtV%GEm', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/artwork/image', {id: '@4NDUG%jNGw6', size: '2)$Z5Mcb&'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: 'VorwHYJPyw^td2S^Vg', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/artwork/image', {id: '5B3#KKLnontIH', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/artwork/image', {id: 'R&!*AQhTb!H0(km', size: 924.68}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/artwork/image', {id: 'knOngPP', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/artwork/image', {id: 'NgVBhKP2GxV)lB4', size: 1025}, 400);
				});
			});
		});
		describe('track/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/stream', {id: 'qbPHlLLFnlXv%*i'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/stream', {id: 'qbPHlLLFnlXv%*i'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('track/stream', {id: 'V$1B73p', maxBitRate: '#4Wa%jx'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('track/stream', {id: 'lCwggCc!)', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('track/stream', {id: 'n2RpwGxy(Rg^Xyk', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('track/stream', {id: 'v%24LwpX', maxBitRate: 56.5}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('track/stream', {id: '6wfJ]a&fBo', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/stream', {id: 'tg7(bhlVfdM', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/download', {id: 'xE7Aaf6gvuB3vC'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/download', {id: 'xE7Aaf6gvuB3vC'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/download', {id: '^W0g9', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/image', {id: 'db&RmDPx)]^'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('track/image', {id: '7Cr!uoYU', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/image', {id: 'bnNvUBjY^l14!', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('track/image', {id: 'o2dPpfJVDRoT%o', size: 'os)WV'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('track/image', {id: 'NQT@Ip1ce]xnA&a', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('track/image', {id: ']u(g67t', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('track/image', {id: 'ee[hFF[I', size: 237.93}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('track/image', {id: 'U^VMr6', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('track/image', {id: 'K#SH6(m8ic#i', size: 1025}, 400);
				});
			});
		});
		describe('episode/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/stream', {id: '&T^C3m(*AA@C7XdA'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/stream', {id: '&T^C3m(*AA@C7XdA'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('episode/stream', {id: '^(]KjnMKaQ', maxBitRate: 'lQrNf'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('episode/stream', {id: 'uQiGoq6EPN[[KdYR', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('episode/stream', {id: 'GdhUrwSej', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('episode/stream', {id: 'xWs$l*nkeqg[JzADyx', maxBitRate: 48.69}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('episode/stream', {id: 'v1B#jaI', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/stream', {id: 'rPWDk', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/download', {id: 'AXJo$u'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/download', {id: 'AXJo$u'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/download', {id: 'ciivM%%inMH(LG39', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/image', {id: 'ZCL7zwg0^@Cr8o'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('episode/image', {id: 'a!)Cs]', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/image', {id: 'TUg5Wpk', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('episode/image', {id: ')%8VUmecWsX7Pg', size: 'JTo*ucBTN^tEYHjj1mq'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('episode/image', {id: '#@emFwJb2tsG*4FB', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('episode/image', {id: '9P1eR&I9@@5BKx@LzmK', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('episode/image', {id: '8f4p57r&fjL4MprpfQ', size: 890.08}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('episode/image', {id: 'l6glLZT@QYN', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('episode/image', {id: 'nZC9w*s^wL8TJjZsJB', size: 1025}, 400);
				});
			});
		});
		describe('podcast/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/image', {id: 'p1Z5SMj$6'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('podcast/image', {id: 'ZP4y%l', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/image', {id: 'a!yDC%2W0JAN$yJe', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('podcast/image', {id: 'FVZH[82%(G', size: '!tLn2E%'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('podcast/image', {id: '&@[s82EqlCv50#bY(h#Y', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('podcast/image', {id: 'oUQvj$hv]&#&vo57r', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('podcast/image', {id: 'gN&&V4S5R', size: 489.86}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('podcast/image', {id: 'M)sR]', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('podcast/image', {id: 'BJ]XN9QTSk$', size: 1025}, 400);
				});
			});
		});
		describe('podcast/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/download', {id: 'y*]3&@'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/download', {id: 'y*]3&@'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/download', {id: 'CeMb!YkFSk', format: 'invalid'}, 400);
				});
			});
		});
		describe('artist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/image', {id: 'IHbLK$0eeF@u*Xx)&!hv'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('artist/image', {id: 'O2Db!UKWlSzpd8', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/image', {id: '38lAGkn0B1&5H*%xHT3&', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('artist/image', {id: 'rv^doPD*CDw57', size: '!#CXut'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('artist/image', {id: '^Fsm1UKO$NfGNtx!', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('artist/image', {id: 'hFT3]##UqePGOiqVx', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('artist/image', {id: 'gPjbC9Lb$0%C', size: 894.96}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('artist/image', {id: 'CDmU@', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('artist/image', {id: 'ld[bo7Rk^q9oO3sFx2#', size: 1025}, 400);
				});
			});
		});
		describe('artist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/download', {id: 'fQ(1@hoL'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('artist/download', {id: 'fQ(1@hoL'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/download', {id: '0H5R186OH29fOOZGboGD', format: 'invalid'}, 400);
				});
			});
		});
		describe('album/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/image', {id: 'TWFCST1R5I(p8jodHRHb'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('album/image', {id: 'bYCpy4ryA)2I2k@0', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/image', {id: 'kkdqMBu4MPBJ^9', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('album/image', {id: 'VMXzQ', size: 'tD2wzifV!y'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('album/image', {id: '&aOw]bgfz1[', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('album/image', {id: '8bX0k&yL$WiQk&VS', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('album/image', {id: '^uq5v75Qx', size: 888.99}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('album/image', {id: 'DxGpM1BsL#)K', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('album/image', {id: 'c5SGDb[V$', size: 1025}, 400);
				});
			});
		});
		describe('album/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/download', {id: 'fsaUUd[w#nKzNRHd'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('album/download', {id: 'fsaUUd[w#nKzNRHd'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/download', {id: 'L#@tQsIkU(qzz7YOY', format: 'invalid'}, 400);
				});
			});
		});
		describe('playlist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/image', {id: 'Abo6Qi'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('playlist/image', {id: 'eFY#oxEsj0poH2(x', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/image', {id: 'bmgsHf)VA0ep[X^s#%)M', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('playlist/image', {id: '#n7y@xbClq$IL[', size: 'Ph6]#VyUM@B*R'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('playlist/image', {id: 'YP]npX)%I', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('playlist/image', {id: 'x!h0o[9Y(R', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('playlist/image', {id: '4[!wIFP', size: 436.9}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('playlist/image', {id: '!#rl(B$)v', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('playlist/image', {id: 'zBSqhG8aqz', size: 1025}, 400);
				});
			});
		});
		describe('playlist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/download', {id: 'Uu[kG69j]'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('playlist/download', {id: 'Uu[kG69j]'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/download', {id: 'zT(H91[RQA1uNAM@t', format: 'invalid'}, 400);
				});
			});
		});
		describe('user/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/image', {id: 'LY[Q!'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('user/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('user/image', {id: 'D()Y&)AMB@bom', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('user/image', {id: 'uLanYfM(5mnd', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('user/image', {id: 'u6eP[wEOq3o^', size: 'ao3&Qe(B'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('user/image', {id: ')7C)7r)A8DNr]wifgWG', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('user/image', {id: 'yC%)b', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('user/image', {id: 'bNV3&hAIyTy!!', size: 923.87}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('user/image', {id: 'MmczR08', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('user/image', {id: 'V9)VPsI(tDgpxJ9$*sJ@', size: 1025}, 400);
				});
			});
		});
		describe('root/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/image', {id: 'ndM[hUY'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('root/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('root/image', {id: 'T0EqDA!CFPF@V)r[I', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('root/image', {id: 'kdCNtDzF1ZJy$p7b12@', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('root/image', {id: '4elat[!jF85fAU2', size: 'lSFx)mprxl%wjcyG'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('root/image', {id: 'eH)w#6HGG8kDxTQ2^', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('root/image', {id: 'uDLWQ', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('root/image', {id: 'M*rsT9IK@H$*]8QD', size: 166.24}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('root/image', {id: '6W!L^AWtKY#L4*1B(6', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('root/image', {id: 'XA$p9^]zkJqrE6', size: 1025}, 400);
				});
			});
		});
		describe('image/{id}-{size}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/H%5B*%26VXw6N)1BU%26j-732.tiff', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/niTr%40AigbTWw*O-230.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/ZbpNua%40-854.invalid', {}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('image/71Vz%5BRwDiA3Hw-T82*AgqPkgeh5.jpg', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/8(IjAKe8tnob%24aQYbrDg-.jpg', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/7%261maTk%25SQf*oUiw-true.tiff', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/Kw%26*uvUo-302.74.tiff', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/0p2(mCjwKE5Y-15.jpg', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/ip5PcDiYtGTtij6Oy0bu-1025.png', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-836.tiff', {}, 400);
				});
			});
		});
		describe('image/{id}-{size}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/GM%5BMBgAp83p(%40Ju%5El*-254', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"size" set to "string"', async () => {
					await get('image/%5E9whP8cSi*K7tN*Cz-%24Ui5Epoa(*%40BF(cKj', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/!t%235*-', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/1L!v7%5Di%5Bsw3JpYw1M-true', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/J3R89)u4nvU7iY%5Bb-393.56', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/z0I70G-15', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/Ben2CJsdsF(%5BSGb%5Do-1025', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-979', {}, 400);
				});
			});
		});
		describe('image/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/WkE5Z05k2ia%5DY3.png', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/2%24%4072Z9epEJs.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/lgVzj0mp8B%40R9RO5E.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/.png', {}, 400);
				});
			});
		});
		describe('image/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/ML%24zRQlTV3Vy%40q', {}, 401);
				});
			});
		});
		describe('stream/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/Dybf%5B7*7BF.flv', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/Dybf%5B7*7BF.flv', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('stream/qe%40o%25i3WRwdQ.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('stream/.ogg', {}, 400);
				});
			});
		});
		describe('stream/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/IBHK)z7I', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/IBHK)z7I', {}, 401);
				});
			});
		});
		describe('waveform/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform/7VT(c5Y*Q3GHOYe.json', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform/7VT(c5Y*Q3GHOYe.json', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('waveform/RIrPA.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform/.svg', {}, 400);
				});
			});
		});
		describe('waveform_svg/{id}-{width}.svg', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform_svg/b)qQEJZ*rrM%25%26Pl-3480.svg', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform_svg/b)qQEJZ*rrM%25%26Pl-3480.svg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"width" set to "string"', async () => {
					await get('waveform_svg/J4%23bbHm7SIlIC)%25*pLN-7%5EVev1dVuPADMRJ)swu5.svg', {}, 400);
				});
				it('"width" set to "empty string"', async () => {
					await get('waveform_svg/LmiJNW3j%23N8-.svg', {}, 400);
				});
				it('"width" set to "boolean"', async () => {
					await get('waveform_svg/%23n%40*g%23wx-true.svg', {}, 400);
				});
				it('"width" set to "float"', async () => {
					await get('waveform_svg/tSR8K%5BPo(!k1b3u-4318.34.svg', {}, 400);
				});
				it('"width" set to "less than minimum 1"', async () => {
					await get('waveform_svg/(cN7%231n-0.svg', {}, 400);
				});
				it('"width" set to "more than minimum 6000"', async () => {
					await get('waveform_svg/yHfyj27W*9maM-6001.svg', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform_svg/-4213.svg', {}, 400);
				});
			});
		});
		describe('download/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/W4aGhew', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/W4aGhew', {}, 401);
				});
			});
		});
		describe('download/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/%40vsuHHve(juCM.tar', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/%40vsuHHve(juCM.tar', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('download/LEnwd8%5B.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('download/.tar', {}, 400);
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
