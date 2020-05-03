// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY
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

			get = (apiPath, query, expect): supertest.Test =>
				request.get(apiPrefix + apiPath).set('Authorization', `Bearer ${user1token}`)
				.query(query).expect(expect);
			post = (apiPath, query, body, expect): supertest.Test =>
				request.post(apiPrefix + apiPath).set('Authorization', `Bearer ${user1token}`)
				.query(query).send(body).expect(expect);
			getNoRights = (apiPath, query, expect): supertest.Test =>
				request.get(apiPrefix + apiPath).set('Authorization', `Bearer ${user2token}`)
				.query(query).expect(expect);
			postNoRights = (apiPath, query, body, expect): supertest.Test =>
				request.post(apiPrefix + apiPath).set('Authorization', `Bearer ${user2token}`)
				.query(query).send(body).expect(expect);
			getNotLoggedIn = (apiPath, query, expect): supertest.Test =>
				request.post(apiPrefix + apiPath)
				.query(query).expect(expect);
			postNotLoggedIn = (apiPath, query, body, expect): supertest.Test =>
				request.post(apiPrefix + apiPath)
				.query(query).send(body).expect(expect);
	}, () => {
		describe('lastfm/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('lastfm/lookup', {type: 'artist', id: 'b8qGI'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: '', id: '^cmfsHG%Qvt'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('lastfm/lookup', {type: 'invalid', id: 'Zg(]cXP&lYqjt7cS&dV'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: 'album', id: ''}, 400);
				});
			});
		});
		describe('lyricsovh/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('lyricsovh/search', {title: '2pZ(%O!n6G0hZE3#dgDP', artist: 'IExXwj0V#'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"title" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: '', artist: '&CEet1kb6'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: 'HtaP1o@a#z5', artist: ''}, 400);
				});
			});
		});
		describe('acoustid/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acoustid/lookup', {id: '8!F$)]xUt6UYpYh'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: 'SIuB)', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/lookup', {type: 'place', id: 'Y3$l7$LV0'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: '', id: 'Pix]Lm*hD[uQr&G'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('musicbrainz/lookup', {type: 'invalid', id: 'rqxaMNy6]p4dUWbA^LZ'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'area', id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'work', id: 'BHLKKH07JN', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/search', {type: 'recording'}, 401);
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
					await get('musicbrainz/search', {type: 'artist', releasegroup: ''}, 400);
				});
				it('"release" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'work', release: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'area', artist: ''}, 400);
				});
				it('"tracks" set to "string"', async () => {
					await get('musicbrainz/search', {type: 'recording', tracks: 'HXmGrraOyAH#ZL7zXe'}, 400);
				});
				it('"tracks" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'release-group', tracks: ''}, 400);
				});
				it('"tracks" set to "boolean"', async () => {
					await get('musicbrainz/search', {type: 'release-group', tracks: true}, 400);
				});
				it('"tracks" set to "float"', async () => {
					await get('musicbrainz/search', {type: 'recording', tracks: 16.48}, 400);
				});
				it('"tracks" set to "less than minimum 0"', async () => {
					await get('musicbrainz/search', {type: 'artist', tracks: -1}, 400);
				});
			});
		});
		describe('acousticbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acousticbrainz/lookup', {id: '#1IP00Qr!t3P[*E'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: ''}, 400);
				});
				it('"nr" set to "string"', async () => {
					await get('acousticbrainz/lookup', {id: '5M6L30SVZ9', nr: 'uLWYV'}, 400);
				});
				it('"nr" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: 'w]!io$37N28fR', nr: ''}, 400);
				});
				it('"nr" set to "boolean"', async () => {
					await get('acousticbrainz/lookup', {id: '#hzT#ayOqwlwRTqk', nr: true}, 400);
				});
				it('"nr" set to "float"', async () => {
					await get('acousticbrainz/lookup', {id: '29eljM', nr: 21.38}, 400);
				});
				it('"nr" set to "less than minimum 0"', async () => {
					await get('acousticbrainz/lookup', {id: 'rjBQAue', nr: -1}, 400);
				});
			});
		});
		describe('coverartarchive/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('coverartarchive/lookup', {type: 'release', id: 'DD&D(j8Ft1CpPi9'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: '', id: 'duW)vvX'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('coverartarchive/lookup', {type: 'invalid', id: 'SSmwuwZfA&2Lx^@tXB4'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: 'release-group', id: ''}, 400);
				});
			});
		});
		describe('wikipedia/summary', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('wikipedia/summary', {title: 'PR^5oX'}, 401);
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
					await getNotLoggedIn('wikidata/summary', {id: 'g8@X#b'}, 401);
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
					await getNotLoggedIn('wikidata/lookup', {id: 'ZE9z4aPeIyQ!@j1j&Q6*'}, 401);
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
					await getNotLoggedIn('autocomplete', {query: '1HT!0e'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"query" set to "empty string"', async () => {
					await get('autocomplete', {query: ''}, 400);
				});
				it('"track" set to "string"', async () => {
					await get('autocomplete', {query: 'udp(NmF8%CmcwbI', track: '29@y#'}, 400);
				});
				it('"track" set to "empty string"', async () => {
					await get('autocomplete', {query: '33fYR', track: ''}, 400);
				});
				it('"track" set to "boolean"', async () => {
					await get('autocomplete', {query: 'Kt#6c3PswZ[jKPVKKkY', track: true}, 400);
				});
				it('"track" set to "float"', async () => {
					await get('autocomplete', {query: 'U*DX2f$lf2Y9pqk(x8O', track: 49.56}, 400);
				});
				it('"track" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'ZKgM8aqh$#CF', track: -1}, 400);
				});
				it('"artist" set to "string"', async () => {
					await get('autocomplete', {query: 'kq#!RJolzGkDi@qD', artist: 'B#x03'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('autocomplete', {query: 'fpbM8B8BV', artist: ''}, 400);
				});
				it('"artist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'ORnEs(J', artist: true}, 400);
				});
				it('"artist" set to "float"', async () => {
					await get('autocomplete', {query: 'o2URVn3EZqI', artist: 56.86}, 400);
				});
				it('"artist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '@^2Po', artist: -1}, 400);
				});
				it('"album" set to "string"', async () => {
					await get('autocomplete', {query: 'Uj#ms^wkwtf19aazvJ', album: 'QVqRVLfIpzp3dYW(hA'}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('autocomplete', {query: 'aLLIZU2aniGVSEWm', album: ''}, 400);
				});
				it('"album" set to "boolean"', async () => {
					await get('autocomplete', {query: 'nEOzT4Ku', album: true}, 400);
				});
				it('"album" set to "float"', async () => {
					await get('autocomplete', {query: 'jvCy&WC4YJwUk]3*qMl]', album: 61.12}, 400);
				});
				it('"album" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '@3J&5e[', album: -1}, 400);
				});
				it('"folder" set to "string"', async () => {
					await get('autocomplete', {query: 's%lj6Qp1l', folder: '08rYlm'}, 400);
				});
				it('"folder" set to "empty string"', async () => {
					await get('autocomplete', {query: '@aW]v)9^cj]Rew', folder: ''}, 400);
				});
				it('"folder" set to "boolean"', async () => {
					await get('autocomplete', {query: 'CnsD@5gWBwy', folder: true}, 400);
				});
				it('"folder" set to "float"', async () => {
					await get('autocomplete', {query: 'z4@FQ%!', folder: 42.97}, 400);
				});
				it('"folder" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'R7CGB@eaHbHU', folder: -1}, 400);
				});
				it('"playlist" set to "string"', async () => {
					await get('autocomplete', {query: 'Ly1lOV%1', playlist: 'zwBPuq!LPS]'}, 400);
				});
				it('"playlist" set to "empty string"', async () => {
					await get('autocomplete', {query: '#ILM9U', playlist: ''}, 400);
				});
				it('"playlist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'yB$dODeWZ7%5Czu%', playlist: true}, 400);
				});
				it('"playlist" set to "float"', async () => {
					await get('autocomplete', {query: 'zw0QgLDH&tN8', playlist: 1.53}, 400);
				});
				it('"playlist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'C[QwOV0Ovh0Ggt*', playlist: -1}, 400);
				});
				it('"podcast" set to "string"', async () => {
					await get('autocomplete', {query: 'oq)f[3W^4Qg[h[f1(TUT', podcast: 'HM3g4VC'}, 400);
				});
				it('"podcast" set to "empty string"', async () => {
					await get('autocomplete', {query: 'ZqA^&U6kP0MNDT', podcast: ''}, 400);
				});
				it('"podcast" set to "boolean"', async () => {
					await get('autocomplete', {query: '6cm4GUb]qO8Ev7VFBJF', podcast: true}, 400);
				});
				it('"podcast" set to "float"', async () => {
					await get('autocomplete', {query: '^7zO1(Fg69!d6b', podcast: 21.57}, 400);
				});
				it('"podcast" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'q1G@cN!wYFP5K*mNg]#!', podcast: -1}, 400);
				});
				it('"episode" set to "string"', async () => {
					await get('autocomplete', {query: 'Pvm@gobvuKy(W9', episode: 'kZ$uBab1SjZ2Q@0vdcdK'}, 400);
				});
				it('"episode" set to "empty string"', async () => {
					await get('autocomplete', {query: 'kG2o5RBQleox$2vnDQ', episode: ''}, 400);
				});
				it('"episode" set to "boolean"', async () => {
					await get('autocomplete', {query: '%y014[zeJyN2X03wO', episode: true}, 400);
				});
				it('"episode" set to "float"', async () => {
					await get('autocomplete', {query: 'v#shQ*VKU4m', episode: 10.18}, 400);
				});
				it('"episode" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '4^0h%%#hckGAuZNv5', episode: -1}, 400);
				});
				it('"series" set to "string"', async () => {
					await get('autocomplete', {query: 'geCgi', series: '%tz#KFIJD%9g@gbX(b'}, 400);
				});
				it('"series" set to "empty string"', async () => {
					await get('autocomplete', {query: 'MeSnvQC4Nu7', series: ''}, 400);
				});
				it('"series" set to "boolean"', async () => {
					await get('autocomplete', {query: '(OL(D1LZ!NbR2', series: true}, 400);
				});
				it('"series" set to "float"', async () => {
					await get('autocomplete', {query: 'VLDXrADG^Zipe9', series: 30.47}, 400);
				});
				it('"series" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'l*!tLm!7G6h', series: -1}, 400);
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
					await get('genre/list', {offset: 'qyWIP'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('genre/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('genre/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('genre/list', {offset: 98.88}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('genre/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('genre/list', {amount: 'Q8So]@0l5QioV'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('genre/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('genre/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('genre/list', {amount: 86.44}, 400);
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
					await get('nowPlaying/list', {offset: 'F5VsedSUGh'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('nowPlaying/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('nowPlaying/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('nowPlaying/list', {offset: 56.38}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('nowPlaying/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('nowPlaying/list', {amount: 'RdfF*VPi#7aJRDB'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('nowPlaying/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('nowPlaying/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('nowPlaying/list', {amount: 38.38}, 400);
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
					await get('chat/list', {since: 'w[oE(sO'}, 400);
				});
				it('"since" set to "empty string"', async () => {
					await get('chat/list', {since: ''}, 400);
				});
				it('"since" set to "boolean"', async () => {
					await get('chat/list', {since: true}, 400);
				});
				it('"since" set to "float"', async () => {
					await get('chat/list', {since: 23.88}, 400);
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
					await get('folder/index', {level: 'UMZk1MwkMRrl76'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/index', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/index', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/index', {level: 98.5}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/index', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/index', {newerThan: 'RP1D8PaV1D@PBFC1Caww'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/index', {newerThan: 21.72}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/index', {fromYear: '%c1*lTBVWBLibblyqH'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/index', {fromYear: 67.77}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/index', {toYear: '$kpYZiDXz]r#4T1O)'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/index', {toYear: 44.59}, 400);
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
					await get('folder/index', {sortDescending: 't&Mk@Lm)FhHE('}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/index', {sortDescending: 1714955309023234}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/index', {sortDescending: -6150482221334529}, 400);
				});
			});
		});
		describe('folder/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/id', {id: 'yePsC'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/id', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'T5Wh4mzk#GJbrlEH', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/id', {id: 'o$Nkt@z', folderTag: 'd2dU]N'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'RIghhUJR[A', folderTag: -3656915028541438}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: '%p7VFC2M820bI78rfF4', folderTag: -8429591894949889}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/id', {id: ']3vA^pSFFIt0JQF7[om', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/id', {id: 'Ya)4OZjsw*&rH[DD7@nj', folderState: ')x[l!7G(0OKLI'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'X38LszX', folderState: -232244853604350}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/id', {id: '22FaGrp#2mAu0', folderState: 6313680291495935}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/id', {id: 'OCU39H[(1&ZZ8', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/id', {id: '^dRGfKD&WN(tU', folderCounts: '@co]U]48l&o7'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'g&3ShE86jhYZ*2EIj&2', folderCounts: 4382574860304386}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/id', {id: '03QVTKz', folderCounts: -4216454773735425}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/id', {id: '[!!cGtBN#LCMDLpF4b', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/id', {id: '@bWl[thz', folderParents: 'rq9%RGFhMOsB6#3[Cm'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'Y@TzCeKv*S@', folderParents: 7621469060202498}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/id', {id: '(cKZM&yIu', folderParents: 7272839509966847}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/id', {id: ']07(7nY', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/id', {id: 'w5oNu*L$x(hN5bio9R', folderInfo: ')RJ3da6t'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/id', {id: '@Sf8ymr', folderInfo: 3737107914817538}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'f5B40)iPP$R1LX9l', folderInfo: -8742267208597505}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/id', {id: 'o*))q$4bE*', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/id', {id: 'lhd@PBzeBV!mpkZaqj3R', folderSimilar: 'h^)8)cCxe1jW))d'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'XZKGFd#]^6)j', folderSimilar: 7662830488649730}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/id', {id: '2J9pBn8nW$iVGF', folderSimilar: -3688141219168257}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/id', {id: 'K5iktjRU^%5)4YD%', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/id', {id: 'Qx@l)3', folderArtworks: '81f9OU'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'm(ILz3phz6VEoI(0', folderArtworks: -5279963741683710}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'EJZhn', folderArtworks: 3753813009760255}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/id', {id: 'xmMslLpMT8jBgI2f', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/id', {id: 'DJ@7Nv%#Y', folderChildren: 'r1BXkh)INEjvYkVC%w8'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/id', {id: '%CofXw', folderChildren: 7805456747593730}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'vz1uBK4ud4Q$X7N5NUC', folderChildren: 519252628996095}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/id', {id: 'DkdzKAb', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/id', {id: 'Zp#MI0Rqih)5WPBfR', folderSubfolders: 'w@*5gYw'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'i6I34VDq4sv$rF', folderSubfolders: -7951734890561534}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/id', {id: '(LSpSxDX)', folderSubfolders: 5768675101507583}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/id', {id: 'vqyysJv)M9', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/id', {id: 'WUVA(0', folderTracks: 'uBis4*169HiaiO'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'u]u4B@CUK@', folderTracks: 2361826264219650}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'I39$!L%e@X)7jj^Ipb(', folderTracks: 2250760519679999}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/id', {id: 'BuL1v', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/id', {id: '7u]7fiR]41a1aVu8', trackMedia: 'LA@mk1f('}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'GPMoEhedj$', trackMedia: 8097070518894594}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'H3S!tqjo(u3jLSV', trackMedia: -7715802052558849}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/id', {id: '%]L[KCCtykU#EOR3Gn2!', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/id', {id: 'bH2hvwYE0', trackTag: '!y4[m$uoI0&zY9aR3'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'flXc2#S4F4N0k9', trackTag: 8412796702162946}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: '6IW%t6[Kr%OHbePd', trackTag: 8485352759099391}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/id', {id: '*Z#IkOnY%ChA$G', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/id', {id: 'Ev!YQ)', trackRawTag: '05WbXN8d26!OUxXf56gi'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'cEIvO5', trackRawTag: 1663433749561346}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: '6V*S#TEYKCc', trackRawTag: 5602285556072447}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/id', {id: 'TT@pIs0n', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/id', {id: '$fRp)cua2[l', trackState: 'kZbVcEpc4fIWVh]'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'UD2UdpjpeSBuq9Q4[', trackState: -5242864875339774}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/id', {id: '2YNkT#!Y', trackState: 4878823103397887}, 400);
				});
			});
		});
		describe('folder/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/ids', {ids: [']fcC(T(O9xhvdgrFzGTB', 'vRCHhz']}, 401);
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
					await get('folder/ids', {ids: ['JYloD8%VnuYt&Q6uZpN7', '&0(IBS]M7(q$bXwHIoM'], folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['VrXn2vTm6aet', 'ZHFf#GMvEAOv@'], folderTag: 'Kf#PRwESWz!Y(n9g0M'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['Yx@2hgR&', '6WxQIQ8#@8q'], folderTag: 7240752610410498}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['2Jos]UG', 'jJzMT^w0bVi'], folderTag: -2086468424040449}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['D^&M*LF4', 'sXBz0!!%tL2RHJ!M(g'], folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/ids', {ids: ['QDsXBPzGj', 'obLtS4yWE7*yS]WQXfy'], folderState: 'HI]gaKc9lSD*p32Yh0'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['^]55x9CQQ$EUp', 'rgAwh85JF'], folderState: 786281130885122}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['qQ3ZCYptb#HCrAWHJNs$', 'sTvbA!SQlY&Oa'], folderState: -3372043626086401}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['hAOB!dGHxjQQ#wPFjZU', '$Pi3U6uphIuA%'], folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/ids', {ids: ['Dgt16', 'c$^96z9B1L0V'], folderCounts: 'A!CACa'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['r3(lIOX#@]#Z]C##obY', '@9lex#A15O!w'], folderCounts: -375320741937150}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['DDmuG9SK(', 'b#$m1ZfZCXY1opH2'], folderCounts: 8278299960672255}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['@pfl4', 'fZGtaXW8'], folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/ids', {ids: ['MhA(qaCs$((', 'gwGIe([[[(bFTfG0h^OY'], folderParents: '69ZSHfY7'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['rXcgIis', 'dhWm4@5f1]CBh1&'], folderParents: -1151194835714046}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['3@@ATNKRKe8OCZ*', 'DJ8iI5FqOr'], folderParents: -747382010544129}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['MD)HUCbsKXXm53rq!p', '7G[GTNe%foCho[X&Ihqf'], folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/ids', {ids: ['NvyVpbjQzRwR4ldM', '9)Teg^xNv'], folderInfo: '79eUwrx7@'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['au*[*l@K', 'sEkIfemV'], folderInfo: 5162992882679810}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['DuVHyt5I', 'pO@xo2vhLyCgrx2Gl'], folderInfo: -8809281558151169}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['cl!8^jhxPuGj%k', '$Z$qCd'], folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/ids', {ids: ['sVhqR9g8W$', 'Ugss8'], folderSimilar: '![@FVxjg8s'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['*Cg6EIHhnxYH9y1HNlJ', 'KKhUSFuNu42'], folderSimilar: -954908723380222}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['taV8t', 'i*!YiL@rX*SMtLrmoxR'], folderSimilar: 7996452538155007}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['iV#*RZ', '%PB6#C(mHvCa6[&'], folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/ids', {ids: ['JHSgDwICpqt', 'GbR&Y%Rj!'], folderArtworks: '^[pG1!y'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['Fe[Veh', 'TJEusEJB5(0riK$l6^uh'], folderArtworks: -6803429389238270}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['(4KRRiP', 'i]X^6X[pXMfs7QgY'], folderArtworks: -5632952423677953}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['kMdNlq', 'SZsQ#T^D@pzmF9GIcJYE'], folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/ids', {ids: ['3bWIaa', 'W$I^JPEZd%)wVks'], folderChildren: 'V(D0Hs!LldUHXwG4O'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['swEoSho)^', 'saKn(g$Tkzz1S*Esd8h'], folderChildren: -537764898537470}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['tW8F[B1diDpC)t3mp', 'in)0IR'], folderChildren: -4106895547695105}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['C4v$mNCEEVXI0u4zTnl9', 'xgU8sr)'], folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/ids', {ids: ['RdGY]d(hLaaL8Yx7yy)', 'u)[7F^o'], folderSubfolders: '*GOMIPqmam5F'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['b3Iu9gbz', 'y8KAoj]xY5Svk(P5IV'], folderSubfolders: -2339587179413502}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['HkVLmmPy47JdCh', ')QbX4T[SqVv4]sJF'], folderSubfolders: -3340412722872321}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['CbZs0il', '^GNjR^1beRd'], folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/ids', {ids: ['^%L)yyv^SjErG10Kc', 'NGss*@hO0tYjgP5Eh'], folderTracks: '&vlpzk6[(KXb[5e2'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['U#i(HTdXkZvj$sSG*', 'b8B^%hYKCOC*gsEX'], folderTracks: -50838982623230}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['EzEoBzrWWh@Y!D@^v', 'Db50re)VEDee9v52tJ8'], folderTracks: -7256447381405697}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['gAsEosYiy', '2cwV^0N'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/ids', {ids: ['r6xYVFHhC(4^7hE', 'upZ#77f4]cy'], trackMedia: '%#goTj3'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['JBHC9L3e', 'GjiVmhzSRn'], trackMedia: 6604530103877634}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['EnjCuiOwAS]Ws', ']EzVw2an5]D2G0*]!CLK'], trackMedia: -30401800175617}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['AR*FMrN]', 'Xz9G3'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['#vZ(XUW7S9', 'bwF1T'], trackTag: 'nU9[h'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['@i5Y5Am(ifr0ZDT1&zTC', '@bC*elMdOJbyuBJ'], trackTag: 1581852192145410}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['pK#9mt', 'QQjUjtv6Z^Gk&w3oC'], trackTag: -5778054139871233}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['(m)u5)S@[#s#', 'iLfUFa4'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['6dEvu2W)63G*EtF', '68%(Io2'], trackRawTag: '&NkvsNJ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['E$PMTYQo', 'egZGP'], trackRawTag: -4967246384332798}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['NbD7U', 'Mf1BKHkfvkrfT3'], trackRawTag: -1823117387235329}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['^n1rBx', '[)%dO]NZ1'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/ids', {ids: ['IkxgGcclbD', '%E@nBXQ$dmp'], trackState: '$Cay8Oyb'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['i4r5xW5)j7(x)ioV$', 'KiYutuY&&h'], trackState: 6060534977789954}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['Pche%]BcuOfs&23q4', 'P(vzQCTE$&'], trackState: 2130899768442879}, 400);
				});
			});
		});
		describe('folder/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/tracks', {ids: ['GIPc0', 'P7Ljig%HVIA!9z79']}, 401);
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
					await get('folder/tracks', {ids: ['h!3Ya2IMx', 'wkmR(TQ5R1&RuITt'], recursive: ''}, 400);
				});
				it('"recursive" set to "string"', async () => {
					await get('folder/tracks', {ids: ['YQIIAwks', 'l@nMfDpW'], recursive: 'rvVy&'}, 400);
				});
				it('"recursive" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['SlBPtvD0)CpEHdLPdn', 'C76a2^Xf(XVdc'], recursive: -4982027073880062}, 400);
				});
				it('"recursive" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['z3dg&*Y$a&5T[!ozu01', '1rD@c@5yMti6wtql'], recursive: -1814416966287361}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['F2&qF(glXs#', '6DmKn$%k]w83&(ANSu'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/tracks', {ids: ['jzP**', '&o7S3bnW'], trackMedia: 'LoGH8DY@'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['OM%8MB(wPl]Iw!w', '[J%!p2H5fx'], trackMedia: 5794430502043650}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['0Nr9ExvLvT1SlkV*N', '1dS2*8lEf[j'], trackMedia: -648129850376193}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: [']bK#Xo5', 'qPF7XX&^)y)1'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['[OnG$V7JJhE$', 'YyOX7(CY'], trackTag: '8@bNzbd72Mb'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['ZL1A(86FP4Zi*Lyg%N', 'BF*o(fuUE&FIdtGc'], trackTag: 5344565594685442}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['di[36SnTOU', 'Zy#6m299pg)x4['], trackTag: -4601835583176705}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['0QA3cMG8u)g[cgm)cxw', '2tJT7y9W!'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['9BhD5unKCqO09zU', 'obFfc#s9iVOHptuxiZIq'], trackRawTag: 'i!qihA7jrRQU'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['2igYN', 'mihJtWV3ZsyO&7)Q'], trackRawTag: 8437096452718594}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['^AWg#Ulmrqk#BuHJm9', '2W5k3'], trackRawTag: 3666437885394943}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['[F&4T2gtaI97LhtR', '*ST0RlDKnAx!(ZA'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/tracks', {ids: ['j4mm*0bwK', '&F@i2BmPl'], trackState: 'by6#13A'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['iDLE7J!RiymDkOSR(M', 'LnkRQYUwYZpBkgIb'], trackState: 750307344646146}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['x!p^*Wms*aBW5A!h', 'Jz42E(RatCY[0BcJfZK'], trackState: 1139215026880511}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/tracks', {ids: ['T4Irxn2T*eQujIbBoNtl', 'DhXyD9)vj3hPS'], offset: '4XZ&11z4KfcaK%wgBRp'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['EP4Zl%v$S2Ur59y4p', 'KojXvYY7'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['fKj&%)rKLRkV]A7i', '#@qo*&J1*J7&xBT'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/tracks', {ids: [']oSH80FjH22!', 'ziHakA2tmU1Jyz'], offset: 95.66}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/tracks', {ids: ['rj(mLsWA7', 'j4)8YG6'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/tracks', {ids: ['o$UfWUf', '15K4u#uVnCVc'], amount: 'nCEQ7E'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['@b@UZgl6DvXz0j)oo6A)', 'hg(3M4!6SrZ'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['pvgAzZmTPj[CWyqmk$', '6]Q5yDyv$(1M^ufnNY'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/tracks', {ids: ['NIoOwUNsI3', ']25pD(Vsm$]2*'], amount: 91.72}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/tracks', {ids: ['U6j#ccF7', 'N^VxCi0wcGpbaF'], amount: 0}, 400);
				});
			});
		});
		describe('folder/subfolders', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/subfolders', {id: 'IKMoWcpfhOPNqh'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/subfolders', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'y9Humtdd6', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/subfolders', {id: '$DECOFrt52f^', folderTag: 'cMNSo'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'J[wm8f5*ZEvm[', folderTag: 4266491444723714}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: '@cwQlbpjRO5W', folderTag: -6974778044841985}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'K1d^@', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/subfolders', {id: 'AU00gy*Ww', folderState: 'sdDf6lBYzO'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'EpA7IA6580k', folderState: -4706504535965694}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'hrQL0GN&6qScESvDwz', folderState: 8074368974323711}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '3XkMd0)JJ', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/subfolders', {id: '&dDYuUbE@oW0Hw7w)DBF', folderCounts: 'VNh%7cfylKwEBVznL'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'RjFa[NkqO)vZ$', folderCounts: 8769919030132738}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: '&t*Qi', folderCounts: 6807301084151807}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'JUq2iHfeW0OKljYWz**r', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/subfolders', {id: 'BQUqO', folderParents: 'no%7%U12%f&'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'D@G8!d3s', folderParents: -2198925557628926}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'u&$$5aj3w]F', folderParents: 422689550368767}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'pIQ$MiI!9yc$Ovg9WPv', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/subfolders', {id: '($K&zVqfFGu', folderInfo: '4zdI8Dr&CKPPURE'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'Pn9Q$4T[m^eJG9Ko', folderInfo: 3890712009506818}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'ZcTTZA2U]DrHQ', folderInfo: 7779164849438719}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'ibYCbM', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/subfolders', {id: 'z#^2n#', folderSimilar: 'axBJOF*U@Nl0FzaMfs['}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '2Dx!RUpqpV%WJ3oTqKBr', folderSimilar: -7269510562185214}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'pLlE9CTECItKQf', folderSimilar: -330157139165185}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'uVBgcXJY(lOdmKZW', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/subfolders', {id: '1JgSMH', folderArtworks: 'rBU!OKh'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'yLyuO0UQ%aesuJ', folderArtworks: 7728673541062658}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'oWzVZAfFPx', folderArtworks: -7505469639753729}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/subfolders', {id: 'FJ^[Rw0jL7', offset: '[L$ti]w5'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '&$TA2tJZN3UH6F2Z9&', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/subfolders', {id: '3Sbw3^!]s4G@', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/subfolders', {id: 'aq0W]y#PGUMeaJNL', offset: 59.55}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/subfolders', {id: 'MvUI05$chIv064b4@9[#', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/subfolders', {id: 'RufD6', amount: 'qidbiWnULg*'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '0Skf3^w2bLT[Gr*MRJrE', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/subfolders', {id: 'JTJMkNph#TcWN5VWx', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/subfolders', {id: 'yg%pv[DeRg#h)WPaOQ', amount: 86.99}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/subfolders', {id: ']sOQyOrZ]', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/similar', {id: 'vVQ([[awq8*g3'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'Ty^H5hIhw9o[P', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'VDgU]kgor&', folderTag: '#C[MVoojoxhbnuO'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'V@[vU8QDix!OqLEI', folderTag: 424453909512194}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'd$cj(bfZgB', folderTag: -4065888764428289}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '6aevlff]mCY2sxXlA^u', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'ELVWb&B', folderState: '7ZKcc0T'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'cXS#Y', folderState: 6889441226391554}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'V2dYzn$w]o9hYg4EQtKV', folderState: 1301656272633855}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ')QMKyGrqGoURplnUz9G4', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/artist/similar', {id: '9H8p&#E0We!f#HQ', folderCounts: 'uVG!#vU(1#(u28Zq%a!'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'QaZvRwX&rnQXmedn', folderCounts: -7155072064552958}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'jAihOOBwwkK%4x]', folderCounts: 8062724256825343}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'LaXc^1^', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'znTS^hnHdHks@B%)QIs', folderParents: 'K4[xc5F&'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'S1z#a$0m', folderParents: -5139337125560318}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'fGOvL1g&v7*Vt*95Ysko', folderParents: 7072657639997439}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'sLvpIv2jow[', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'Ewz5KnOR317xsV', folderInfo: '#p9oVn1Gwd3$'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '%P#NAp', folderInfo: -3828227889954814}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'tejug#^SzlC&a])^', folderInfo: -3682903154229249}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'Ox&i6', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'zY12eq*]z5x^]t#KeEaz', folderSimilar: 'ZMJDT&k^dzk0bA%v'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '6R*)3yhDHb0q7', folderSimilar: -3377115386871806}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'cvwOr2M9Qr)(IMbLl', folderSimilar: -8252339198623745}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '^wteU', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/artist/similar', {id: '[Yj2qlu', folderArtworks: '!S@JRE^VyPo'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'TWyEJx@R4RKh', folderArtworks: 271014512558082}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '9Kh@O(jdTc%Jv@', folderArtworks: 4160570316029951}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'trq0ACoE', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'ZPxby', folderChildren: 'pmAYC]7aQFIU20U#g'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'pbNJ]^YZT)L18W!@', folderChildren: 1664036949196802}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '7LF$p)y*TAc7H8x', folderChildren: -6608947905560577}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'p75[ku*3sNfINO*', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'Ww#]59PN1wHdP', folderSubfolders: 'jPP&pPmaTZ6V0Le[qTN'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'DjKN09IS99Zf[%!fD6', folderSubfolders: -2279942456868862}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'l*0K3@fEn#L', folderSubfolders: -6439904015810561}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'u*ImDc6#Jd', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'l9$N(SsI]hb', folderTracks: 'c7gZY0au7amC'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'x&($f@%', folderTracks: -1347281089462270}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '5Wbk6o', folderTracks: -3440289188413441}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'yr@#J@8[#q', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'BMAeD', trackMedia: 'cJ$U6xRQAc*'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'rdM6pfwh', trackMedia: 8528632259543042}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'R97y$WuPJm4L^#lo', trackMedia: -2709600637812737}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'w3bVuy', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'A&J%GCjt', trackTag: '6]pZh[F8()b'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'vl0j%Qx', trackTag: -3903990169337854}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'gqiPL[[jce^', trackTag: -5746379733336065}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'kR$vhlM', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'YV7z1K9q', trackRawTag: 'QomD9#saN5EFxB4BWc'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '7V)o&]7y4U25(Zrh^h', trackRawTag: 386895934652418}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '4Xl9P5z^&*xbN(', trackRawTag: 8368810985783295}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'WAI8(eA)i', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar', {id: '1[PU6BINgllPTrj9', trackState: 'AIz&@*x0OR7*p1g[3H'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '4V71WAlupmn', trackState: 3900199529349122}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '3smZwCHY#Es', trackState: 4517320168833023}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'Lr4^&BtmwD%jaiL5mo)w', offset: '[82QBmkoiyeKtJ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'mxEG7]NSOS%yZujND', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'bTldHkFq]', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar', {id: 'KuXc%OCp)wJhwUg', offset: 20.17}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar', {id: 'wvd5w52V5hidTWO#x', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar', {id: '8gR[NaRqKG1', amount: 'Ia@NueA'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'UXZyA', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'Dz*NzjIhk', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar', {id: 'iK*jp8D', amount: 52.89}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar', {id: 'y$D06erZPVv)9', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/info', {id: 't9u^cV0c7KSe49vJ$'}, 401);
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
					await getNotLoggedIn('folder/album/info', {id: 'pUPU1Il1TEOZ*I'}, 401);
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
					await get('folder/list', {list: 'faved', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('folder/list', {list: 'highest', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', parentID: ''}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', childOfID: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', artist: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', genre: ''}, 400);
				});
				it('"level" set to "string"', async () => {
					await get('folder/list', {list: 'random', level: 'rVkcYWBs403@GnF('}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/list', {list: 'recent', level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/list', {list: 'faved', level: 12.17}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'frequent', level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', newerThan: ')D5G$FHGspK8]8]30U'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/list', {list: 'highest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/list', {list: 'frequent', newerThan: 67.46}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'avghighest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/list', {list: 'highest', fromYear: 'Ih0HCkf1vz0r9m'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'highest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/list', {list: 'recent', fromYear: 88.91}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'recent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/list', {list: 'highest', toYear: '2@g#BH0Uo[%&@s]K'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'faved', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/list', {list: 'highest', toYear: 33.3}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'avghighest', toYear: -1}, 400);
				});
				it('"type" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'highest', type: 'invalid'}, 400);
				});
				it('"types" set to "null"', async () => {
					await get('folder/list', {list: 'frequent', types: null}, 400);
				});
				it('"types" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', types: [null, '']}, 400);
				});
				it('"types" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'random', types: [null, 'invalid']}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'frequent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('folder/list', {list: 'faved', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('folder/list', {list: 'recent', sortDescending: 'H@Ujl2huWa(v#'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'avghighest', sortDescending: -2945458473271294}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', sortDescending: -4603968948797441}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderTag: 'IGNX5x'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'recent', folderTag: -3427546779615230}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'highest', folderTag: 3008407917297663}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/list', {list: 'recent', folderState: 'S*tQ4i'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'random', folderState: -6240392496283646}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', folderState: 7016605108142079}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderCounts: 'sKd@61QB7OCvC4kHe^'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'random', folderCounts: 6832859323039746}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'frequent', folderCounts: -4416209365762049}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', folderParents: 'NaxQ$@ptxCKe62zoF@'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'highest', folderParents: -6490912364429310}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', folderParents: 4279443723911167}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/list', {list: 'random', folderInfo: 'Vi@Iil&$S30'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'frequent', folderInfo: 6246683578990594}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'faved', folderInfo: -5947866027655169}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/list', {list: 'recent', folderSimilar: 'H6TVBy)'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'highest', folderSimilar: -5372586183622654}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'recent', folderSimilar: -2370021783240705}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/list', {list: 'random', folderArtworks: 'qF7vg'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'highest', folderArtworks: -6046920795488254}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'faved', folderArtworks: 831144916418559}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/list', {list: 'highest', offset: '$1$SSlx$Y7'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/list', {list: 'faved', offset: 82.6}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'highest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', amount: '(Zm$y('}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/list', {list: 'faved', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/list', {list: 'random', amount: 95.58}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/list', {list: 'faved', amount: 0}, 400);
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
					await get('folder/search', {offset: 'ruYj#*z8yXm4a$wXZ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/search', {offset: 6.22}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/search', {amount: 'tP*C96vw'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/search', {amount: 90.32}, 400);
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
					await get('folder/search', {level: 'EMxEfG'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/search', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/search', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/search', {level: 62.2}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/search', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/search', {newerThan: '*7gYNTtKqsn%fT'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/search', {newerThan: 64.21}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/search', {fromYear: '#CoSd1nRP^]K6v'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/search', {fromYear: 29.52}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/search', {toYear: '[32&Tlnmaa9zy'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/search', {toYear: 52.76}, 400);
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
					await get('folder/search', {sortDescending: '0$WSoOp0CkV$8uJu'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/search', {sortDescending: 3221531303870466}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/search', {sortDescending: -8282908196339713}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/search', {folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/search', {folderChildren: 'OCXY#n%IB'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/search', {folderChildren: 6292009585213442}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/search', {folderChildren: -5594154935517185}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/search', {folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/search', {folderSubfolders: 'ObqZ*'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/search', {folderSubfolders: 1600061259644930}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/search', {folderSubfolders: 2038933328232447}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/search', {folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/search', {folderTracks: 'ZXcI9P%vXVCGo%vu'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/search', {folderTracks: -7891085120503806}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/search', {folderTracks: -8251969726578689}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/search', {trackMedia: 'gr(kf2g(^'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/search', {trackMedia: 6559379121766402}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/search', {trackMedia: 2189067596857343}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/search', {trackTag: 'YI5NeHu@TFG934IIfv'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackTag: 7083115885363202}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackTag: 467031828725759}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/search', {trackRawTag: 'nzXBsFqZ7K8DIabF8hRS'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackRawTag: 2000065182826498}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackRawTag: -3457262337130497}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/search', {trackState: 'fQnvL'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/search', {trackState: -322268076965886}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/search', {trackState: -7504977824055297}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/search', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/search', {folderTag: 'bPbj5tFEl#)kdpTNA3s5'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/search', {folderTag: -3711098599505918}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/search', {folderTag: 7964245996077055}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/search', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/search', {folderState: '@pyR5*cl57AcHJ(f'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/search', {folderState: 126577329307650}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/search', {folderState: 7159212366888959}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/search', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/search', {folderCounts: 'znxe[[xX5D[KcrO'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/search', {folderCounts: -8645989892095998}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/search', {folderCounts: 2906649643712511}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/search', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/search', {folderParents: 'Lk9]X)fq0)KK'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/search', {folderParents: -6716234624139262}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/search', {folderParents: -5990159585640449}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/search', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/search', {folderInfo: '78JhP*]^8OM@9pT21F3s'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/search', {folderInfo: 6253860947492866}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/search', {folderInfo: 7421643123064831}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/search', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/search', {folderSimilar: 'SDLZXBVeQ#CL'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/search', {folderSimilar: 47141795921922}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/search', {folderSimilar: 8242045462249471}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/search', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/search', {folderArtworks: 'lPvKSAO$ru@rkM'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/search', {folderArtworks: -3137503854854142}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/search', {folderArtworks: -8163284985315329}, 400);
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
					await get('folder/health', {level: 'i@SL!V&2rmGYO'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/health', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/health', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/health', {level: 39.8}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/health', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/health', {newerThan: 'grR3w'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/health', {newerThan: 80.36}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/health', {fromYear: 'U1rwU2%'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/health', {fromYear: 65.42}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/health', {toYear: 'AkGw@LY['}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/health', {toYear: 39.07}, 400);
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
					await get('folder/health', {sortDescending: 'iP1HOhqJrlV[7fC'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/health', {sortDescending: -5238453843263486}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/health', {sortDescending: -8863449278840833}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/health', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/health', {folderTag: 'L1W9RTLWONVZK3%IlV'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/health', {folderTag: -6978800659202046}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/health', {folderTag: -5086974310350849}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/health', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/health', {folderState: 'oYIV2$l[R5w&2h'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/health', {folderState: 4656469605613570}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/health', {folderState: 2005134129233919}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/health', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/health', {folderCounts: 'mf$8GGHm%)r'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/health', {folderCounts: 1882619994177538}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/health', {folderCounts: -6646087578288129}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/health', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/health', {folderParents: 'fLRGex9'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/health', {folderParents: -6535243343331326}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/health', {folderParents: 1888178638159871}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/health', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/health', {folderInfo: '^JKcch%(bF$a'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/health', {folderInfo: 5101369610469378}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/health', {folderInfo: 3784964906680319}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/health', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/health', {folderSimilar: '@7Bjt)M['}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/health', {folderSimilar: 6605261322059778}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/health', {folderSimilar: -6822787582787585}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/health', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/health', {folderArtworks: 'C5(Szu6N1YHkkkPXqh'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/health', {folderArtworks: -3296517972557822}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/health', {folderArtworks: 8116560258400255}, 400);
				});
			});
		});
		describe('folder/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/state', {id: 'x5rinpMXsh'}, 401);
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
					await getNotLoggedIn('folder/states', {ids: ['hTHkdMtR^[DGnn58aM', '#fh0x*uiS7']}, 401);
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
					await getNotLoggedIn('folder/artist/similar/tracks', {id: 'wJeWLMzFYm1EK12u)!'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'z11YJ7efoa^WF(1y', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'JCD@IiH4YL', trackMedia: 'DYWj14J3Ro!J]Gfdse'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'H3BP$pr', trackMedia: 6581137702912002}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'LR[LJ%T(kwx%5bni&y', trackMedia: 5734565276549119}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'ywpbF7pO08P&', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Lads@', trackTag: 'hxSV3]^gj5Zw&SXM[!'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: '#T9tODRf1UbThcGaSX4a', trackTag: 4238008056283138}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'pUOk(PHK0Menzash', trackTag: 5936924351004671}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '&4$^jblyCHX8bVoMx', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Ubd$j8[tyj', trackRawTag: 'OSSNGUbzE8*D'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'VDycbJC2iuYfv', trackRawTag: -573423017263102}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'x21[joZxNwo)', trackRawTag: 6804690989744127}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'XNlJoPsr@)t^#h', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'FsFOStN4w0]!', trackState: 'MwA2QBKKpPk@D2['}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: '[n@SO7w#cJZY9)eJJHgp', trackState: -6593960004812798}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'A#7tE0e0xRpgj&&3S', trackState: -6576777946202113}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'LEJ0mf1l6@IyWK!', offset: '$keZh6Ib9jZwP'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'P$*T!wMv7e', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'YU%MhFJ7x)*aj15Z*(', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: 's5*!9Q0s$4Ah^6', offset: 81.82}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'DFST670Z2XHT&k^w', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Pr@5m!EejH7k@TZ', amount: 'oIg2l'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '3D4*DyJ*a$NDVwv5UQe', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'd*NyzTO^%j', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: '[JsLsgop(U9m!igh', amount: 3.12}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'VkY51sH', amount: 0}, 400);
				});
			});
		});
		describe('folder/artworks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artworks', {id: 'Eh7R0Y'}, 401);
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
					await getNotLoggedIn('track/id', {id: 'l7rW[kwspbu'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/id', {id: 'aYUOFLb9TkPd7', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/id', {id: 'mez&Odfkg^Mf(mL0mEX1', trackMedia: 'oTDqR7p(m7lEL]ZN'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/id', {id: 'yKxMH%i', trackMedia: -5075228178776062}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/id', {id: 'ie(KNTya#X', trackMedia: 3306542728216575}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/id', {id: 'oooc^HgHJfccz7@Xg4#w', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/id', {id: 'N6c[s@', trackTag: 'hGS(2Hg2'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/id', {id: '][CAh[lG^xKroWteOMw', trackTag: 184724194590722}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/id', {id: 'VmnZd!%B4#', trackTag: 3913948092956671}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/id', {id: 'Y8qjzJKAWJN', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/id', {id: 'MY1N&nXw)qD&Ty^x', trackRawTag: 'JHR4jL5If7XN5Q3A'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/id', {id: 'H&Z(v6prMq$[gD', trackRawTag: 4320346828177410}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/id', {id: 'fN7F2]6', trackRawTag: 5548699832811519}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/id', {id: '846u6', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/id', {id: 'T1]SYLW4ZP@PT8&QaUf', trackState: 'Pilah[W#SVLYKNS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/id', {id: 'irq0O!4', trackState: 7503429316378626}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/id', {id: 'hAsbe27', trackState: 4417810855886847}, 400);
				});
			});
		});
		describe('track/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/ids', {ids: ['aQ7tg!*xn', 'TvQz*H1m']}, 401);
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
					await get('track/ids', {ids: ['2b8*36g', 'fPuF(sduskufy[Ye'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/ids', {ids: ['Q%&LeC2rD7C', 'gsHj9cstzIs5'], trackMedia: 'G5Ko6^^KXz8u[Z$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['[q$#HcH3', 'yyqU^raqAcD$R'], trackMedia: -676621195411454}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['OkoquNG', '2iwpgR^n&3xlK'], trackMedia: -3661815582031873}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['5w#q6Y3SpgB*Gzac', '46#*AQBZacE]&%o&'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/ids', {ids: ['nCP3rl!nY&&(z%', 'qo2PYO5f@z39'], trackTag: 'khaCnoT'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['9jp(f', 'YdRrm5[5@9nL'], trackTag: -671321579061246}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['YFqypbLXa(', 'waa47pnA'], trackTag: 8443605089779711}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['cXPq#tmdql(4qpbP9Y', '$Vcu)!axLQ#f5&##OZ'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/ids', {ids: ['5YR@r]Zh', 'S2iu@Y2GoGeVgwEqU'], trackRawTag: 'A%JFD#Ugb[D9[0Z'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['8M*%jfPdOo', 'i&K54Ru#!o]f0'], trackRawTag: -121975913578494}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['!(ttFf', 'mEiM&nDK!7t5xGAHRnZU'], trackRawTag: -4025924370563073}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/ids', {ids: [']DDbPSiP@s9', 'DKTjMb*WCotjJaXuM$B'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/ids', {ids: ['kHFkYO*', 'K6Egnv@3Gm'], trackState: 'y(QcO40tZ'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['%DxH6]54Gl394', 'X9e0&iHe(Sns'], trackState: 4446847049400322}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['(Dt)^U)', '!qZYJ*dLe1Lm8S9Y2'], trackState: 2100475855896575}, 400);
				});
			});
		});
		describe('track/rawTag', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/rawTag', {id: 'Y54Z@9Xk'}, 401);
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
					await getNotLoggedIn('track/rawTags', {ids: ['6YvlCe@8bQ*#I', '&OGW^o(EccK6r(']}, 401);
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
					await get('track/search', {offset: 'dE2T$'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/search', {offset: 5.5}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/search', {amount: 'J7@!%^sIXbC*YddNB*0O'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/search', {amount: 66.15}, 400);
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
					await get('track/search', {newerThan: '#dLNTCE10u71W'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/search', {newerThan: 88.77}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/search', {fromYear: '6sdb$mWlc)ZOp(^va9DT'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/search', {fromYear: 97.79}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/search', {toYear: '&H#ydTO6)jNq%'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/search', {toYear: 16.83}, 400);
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
					await get('track/search', {sortDescending: 'ZE6*4C'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/search', {sortDescending: 1025340734439426}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/search', {sortDescending: 3262966388490239}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/search', {trackMedia: 'NC4pCRv5WFOUXvH'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/search', {trackMedia: -7877432971362302}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/search', {trackMedia: -1683245187989505}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/search', {trackTag: '1NvI53paRK'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/search', {trackTag: -1567496058437630}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/search', {trackTag: 2681160329068543}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/search', {trackRawTag: '1]R4vS(Rz'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/search', {trackRawTag: 8974555297087490}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/search', {trackRawTag: -6360259727720449}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/search', {trackState: 'mSMWmwYtiqwP25dAG'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/search', {trackState: 3766328611569666}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/search', {trackState: -7071946051158017}, 400);
				});
			});
		});
		describe('track/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/state', {id: ']ri!3P'}, 401);
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
					await getNotLoggedIn('track/states', {ids: ['ECk*k*o!f', 'kbv[haf6']}, 401);
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
					await get('track/list', {list: 'highest', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', artistID: ''}, 400);
				});
				it('"albumArtistID" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', albumArtistID: ''}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', parentID: ''}, 400);
				});
				it('"parentIDs" set to "null"', async () => {
					await get('track/list', {list: 'faved', parentIDs: null}, 400);
				});
				it('"parentIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', parentIDs: [null, '']}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', childOfID: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('track/list', {list: 'frequent', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('track/list', {list: 'random', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('track/list', {list: 'random', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', genre: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('track/list', {list: 'highest', newerThan: 'thVG['}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/list', {list: 'highest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', newerThan: 57.11}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'highest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/list', {list: 'random', fromYear: '[O#JA4oA!'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/list', {list: 'faved', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/list', {list: 'frequent', fromYear: 76.19}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'random', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/list', {list: 'random', toYear: 'yb3CtXZDUp'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/list', {list: 'highest', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/list', {list: 'frequent', toYear: 10.09}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'random', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('track/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('track/list', {list: 'frequent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('track/list', {list: 'faved', sortDescending: 'IVgP4Y5zLYZ'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/list', {list: 'recent', sortDescending: 4940730363543554}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/list', {list: 'avghighest', sortDescending: -1232573267181569}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/list', {list: 'recent', trackMedia: 'i#fX#Vqa^Mzy3zY!y6s'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/list', {list: 'random', trackMedia: -5787987048660990}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/list', {list: 'random', trackMedia: 8037069729300479}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/list', {list: 'frequent', trackTag: 'D4r6Fb3T]RLsm['}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'random', trackTag: -4486007583932414}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'avghighest', trackTag: -727347917488129}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/list', {list: 'recent', trackRawTag: 'ARRc*L'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'avghighest', trackRawTag: -2281780107280382}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'random', trackRawTag: 2624232215281663}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/list', {list: 'avghighest', trackState: 'Z8$6$t10J0&$qf9gSb'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/list', {list: 'highest', trackState: 7056108690604034}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/list', {list: 'random', trackState: -10046134026241}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/list', {list: 'recent', offset: 'T5mO9%R8Y6Q%X(^gXd'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', offset: 56.4}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'avghighest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/list', {list: 'random', amount: 'r&v$pbL6T'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/list', {list: 'random', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/list', {list: 'frequent', amount: 1.99}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/list', {list: 'frequent', amount: 0}, 400);
				});
			});
		});
		describe('track/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/similar', {id: 'J(8#pYO4R'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/similar', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/similar', {id: 'LnrhABMF', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/similar', {id: 'dQ*Cx]7#D@yc@&]&TS', trackMedia: 'ZfmqYo'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/similar', {id: '#G#Ni', trackMedia: -5531250211160062}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/similar', {id: '61$v6', trackMedia: 4588660620001279}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'ix*9w1ET4[1))W5Oy', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/similar', {id: 'O#s5W]INfc7[', trackTag: 'lImT*St'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: '9aHxTh&V!z!27z8NtN', trackTag: -670925880033278}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'fO^&ROrQH', trackTag: 5672756276363263}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'n#E8Ggot', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/similar', {id: 'B*QW(M', trackRawTag: 'TAVyn[DqZM4$'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: '14u6R]tM*tgFK9B', trackRawTag: -8262587632320510}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'v4CSoWiQUo5^951q1ZXC', trackRawTag: 583157803909119}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/similar', {id: '&T^9Lu*a', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/similar', {id: 'MgcjlUcP', trackState: '[pIv3N3^s7'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/similar', {id: '4K[lB4Zux', trackState: 5898588278226946}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'rYsov!keEwIZ#JHboC', trackState: -504817273274369}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/similar', {id: '1^6@p', offset: '&Rg%WyYMKgz71$i'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/similar', {id: '*)&ReV#J8l', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/similar', {id: '7rB#XIw', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/similar', {id: 'LUeFBSoEq5yd', offset: 54.86}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/similar', {id: 'k9uhXbDl', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/similar', {id: ']QCI3N[g1JQg5SOVn[', amount: '4R&Ad7eKe#'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/similar', {id: 'OIf^cb', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/similar', {id: 'Uf1Ai', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/similar', {id: 'SS!mhtJya*xxI9mI', amount: 14.87}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/similar', {id: 'W&uEPZF#ESPA', amount: 0}, 400);
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
					await get('track/health', {media: 'QXWJ^'}, 400);
				});
				it('"media" set to "integer > 1"', async () => {
					await get('track/health', {media: -3968065926594558}, 400);
				});
				it('"media" set to "integer < 0"', async () => {
					await get('track/health', {media: -6984529545789441}, 400);
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
					await get('track/health', {newerThan: 'eY3KQW#U(!$Ex'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/health', {newerThan: 74.98}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/health', {fromYear: 'KbSHam%@UHrwGTbk$wU'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/health', {fromYear: 9.42}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/health', {toYear: 'zcZJDE[pM%'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/health', {toYear: 99.4}, 400);
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
					await get('track/health', {sortDescending: 'tkNWVMI^4Cks7y'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/health', {sortDescending: 4624369292673026}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/health', {sortDescending: 8208190634196991}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/health', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/health', {trackMedia: 'b5UJ)'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/health', {trackMedia: -3565166331428862}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/health', {trackMedia: -8390892473810945}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/health', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/health', {trackTag: 'LXdpD!5!QNSa(UZO9'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/health', {trackTag: 1658659905994754}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/health', {trackTag: 7300164444225535}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/health', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/health', {trackRawTag: '0A7[n7q'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/health', {trackRawTag: 1266234519715842}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/health', {trackRawTag: -641906593759233}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/health', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/health', {trackState: '6HyS0pjcSL*%[lMpAqff'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/health', {trackState: -1762080487112702}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/health', {trackState: -7145929157115905}, 400);
				});
			});
		});
		describe('track/lyrics', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/lyrics', {id: 'N8l]%]yQVrBeu'}, 401);
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
					await getNotLoggedIn('episode/id', {id: '%@sZo4bBxJw4@#7^WF'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/id', {id: 'ZomszYLm43KU', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/id', {id: '&HTh3C8o$hjsKIOAhq', trackMedia: 'EOS66'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'RH8P0B6O', trackMedia: 8802683553054722}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'L!bX$eQye&1*', trackMedia: -7812046322139137}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/id', {id: 'PFxEg2Ly', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/id', {id: 'l@pC0LZjk2', trackTag: '*JaRj07@6dLQa&Rx'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: '^(3qlF#uKa@juc!9', trackTag: 2557169853530114}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'zPKW*8i5WYP0@', trackTag: 1471003054047231}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/id', {id: 'gEz3Fh8z@yX&IF@3^c#', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/id', {id: 'O*XlyQax', trackRawTag: 'oeHAQuw$izHa'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: '9Oado5', trackRawTag: 2287131456176130}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'CHSNBGBISS', trackRawTag: -1638181980078081}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/id', {id: 'Zhp8Zb@jSAE4)J5D', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/id', {id: 'W*bCj*GqaaL&#ywVAk', trackState: 'nWB[BqR'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/id', {id: '9Ryj0ngKnL%*slZu', trackState: 3670780458041346}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'X@@9aQ', trackState: -8192792278859777}, 400);
				});
			});
		});
		describe('episode/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/ids', {ids: ['EvD)(kR', 'XjFspc']}, 401);
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
					await get('episode/ids', {ids: ['hJa#%iL5$zHcl%hS', '@Nk%%oM&U%V'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/ids', {ids: ['z[8QBD[07#XnME1w', 'I#8n8R'], trackMedia: '5NxULRyGpWjqPo!%j'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['XzM!e', 'z8MrNCW0a&25uXo9D%L0'], trackMedia: 7093336749899778}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['khMVPrrgKNbZJ', 'EDdm5UkJTc'], trackMedia: -2933154138554369}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['qzaA9G3twL@y&kg$R', 'PTKp^M$rJ'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['@kOirv(mkTbWs', '3#*97T0Qdy8s9BAN'], trackTag: '@%)QVD'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['xBhZUgpWPpb@F@', '$nDrh]e'], trackTag: -32856776638462}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['uw[rkFQQ', '%JVI3qx!FvHYqS'], trackTag: 8753978628112383}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['d!nvTpysF&', 'xeDfb'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['^0vGhOKQe!f2[XffQzb', '[KZjB@L9I3*(5mnC'], trackRawTag: 'fzYZ5jOus8qo[PP'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['D4]ATTTDlTA', '*&fYwIf&!^sATiBxg)'], trackRawTag: 8536403570851842}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['4E)3s!V', '1(7jWppXB'], trackRawTag: 4760206118486015}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['cHJW]@NykqLR752^xm', '5bV6Cn'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/ids', {ids: ['2O*J$i$0crf&RpeT', 'F6%4K@@XNKr5'], trackState: 'sc1NWRsGf&UJK2'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['Gnb*mpcA0kBFA3&', 'nCp9uQ8UEN6bB%'], trackState: -1152541597368318}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['SHp!kV', 'I0H0W'], trackState: 8978861995851775}, 400);
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
					await get('episode/search', {offset: '%u8JsrIUvGwSs*Wc&'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/search', {offset: 49.91}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/search', {amount: '@2LtpwO9'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/search', {amount: 23.64}, 400);
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
					await get('episode/search', {sortDescending: 'GpZ$m8s^5m#]nxs'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/search', {sortDescending: 5088487577485314}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/search', {sortDescending: -7509514660085761}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/search', {trackMedia: 'bVwt$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/search', {trackMedia: -7158698417848318}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/search', {trackMedia: -5292632011964417}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/search', {trackTag: 'Jlxrm6'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackTag: -8383478219407358}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackTag: -7800585050914817}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/search', {trackRawTag: '[CQ0PKQYP[N@l@KRhd^H'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackRawTag: 8456576167837698}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackRawTag: -4602533418893313}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/search', {trackState: 'opFaa25c0xxN(o0'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/search', {trackState: 2856117205991426}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/search', {trackState: -961828741971969}, 400);
				});
			});
		});
		describe('episode/retrieve', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/retrieve', {id: 'Sf)R4Ij#YO'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/retrieve', {id: 'Sf)R4Ij#YO'}, 401);
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
					await getNotLoggedIn('episode/state', {id: '*BDuvKZm9t*caxbMG'}, 401);
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
					await getNotLoggedIn('episode/states', {ids: ['I94di$l8sR)', 'nAlgD0gQYw41Wan']}, 401);
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
					await getNotLoggedIn('episode/status', {id: '9@!Vs7#dWdY70w7bOq'}, 401);
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
					await getNotLoggedIn('episode/list', {list: 'avghighest'}, 401);
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
					await get('episode/list', {list: 'frequent', name: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('episode/list', {list: 'faved', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('episode/list', {list: 'recent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('episode/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('episode/list', {list: 'random', sortDescending: 'fK(j7hm0'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'highest', sortDescending: -2092914985402366}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'random', sortDescending: -3634155497717761}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/list', {list: 'recent', trackMedia: 'r5bCJN^#Qy&x'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'recent', trackMedia: 7761665407844354}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'highest', trackMedia: 19844703453183}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/list', {list: 'faved', trackTag: 'py1O44X^5qaY'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'recent', trackTag: -8543931256012798}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'avghighest', trackTag: 6381164881248255}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/list', {list: 'avghighest', trackRawTag: 'FEI%McKGVuLsSag%@me'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'avghighest', trackRawTag: 8919516058746882}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'highest', trackRawTag: 2349236532281343}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/list', {list: 'avghighest', trackState: 'dx2U&wx'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'faved', trackState: -700945289707518}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'random', trackState: 1629987341860863}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('episode/list', {list: 'highest', offset: '$qEB2iOD)%A!wAp8B'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/list', {list: 'faved', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/list', {list: 'highest', offset: 85.53}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/list', {list: 'avghighest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/list', {list: 'avghighest', amount: 'fpn8Cna*(AOh4'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/list', {list: 'avghighest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/list', {list: 'random', amount: 16.33}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('episode/list', {list: 'faved', amount: 0}, 400);
				});
			});
		});
		describe('podcast/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/id', {id: 'gcJxY^WOJXblFZ23YHTZ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/id', {id: ''}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/id', {id: 'YQhmQR4IbJC96u78$L', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/id', {id: '^w7I#', podcastState: '62JW*'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'N*JRgzH)&rPelJj&R', podcastState: -2347634232655870}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'd6GAVH#eSN7rs]', podcastState: -3151546120404993}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/id', {id: '7xTCqb4tka5P*', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/id', {id: 'U[1ScTHd!*m3nr#bBDy', podcastEpisodes: 'M)9^9L1gVIFdlf0[Y^'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'K$AyhYS0Lk2%X^', podcastEpisodes: 7190168024907778}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'c(a6D#&hc7C', podcastEpisodes: 6692991175491583}, 400);
				});
				it('"podcastEpisodeCount" set to "empty string"', async () => {
					await get('podcast/id', {id: '(sskPL38kksKHhfl7', podcastEpisodeCount: ''}, 400);
				});
				it('"podcastEpisodeCount" set to "string"', async () => {
					await get('podcast/id', {id: '&]hMCcc', podcastEpisodeCount: 'T[XSYn[('}, 400);
				});
				it('"podcastEpisodeCount" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'w7hV#kL@q6DNSnz', podcastEpisodeCount: 72152803966978}, 400);
				});
				it('"podcastEpisodeCount" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '1G#aQQRa5xyU1M', podcastEpisodeCount: -6411820650725377}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/id', {id: 'FklRJzo&l2', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/id', {id: '($ZfcnxC8jVbPk%xUj7', trackMedia: 'qA]$p@xP42%kBM'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'BnxCnx$Q%FU', trackMedia: 8527457485324290}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '276rQ@', trackMedia: -1822305772634113}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/id', {id: '[#S$7^7Dh&7)bwGc#NQ@', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/id', {id: 'o!5AA', trackTag: '8$)CC'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'tsd$(', trackTag: -7878602544644094}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '&upVYBJKSbMqCjc57])O', trackTag: 3025436825092095}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/id', {id: 's^6q$jyL', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/id', {id: 'UDp1Yp#)lS7', trackRawTag: 'uREF66w1Z'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'bqdvz9dwSd(HSK', trackRawTag: 5065909328674818}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'X43l1r', trackRawTag: -3188060321742849}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/id', {id: 'Qf@AEuOG$NY]o', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/id', {id: 'EW(6O', trackState: '#&XKz4D@HqW40zUD'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'CsD[5c', trackState: 1952071133691906}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '%#wS#yX$926Hcww]', trackState: 626899680231423}, 400);
				});
			});
		});
		describe('podcast/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/ids', {ids: ['Ev323PqwXAG', '7RC!JP0njf)naq']}, 401);
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
					await get('podcast/ids', {ids: ['&0ZkLGBLKyt', 'hq@MRpR2db2x]516A('], podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['#lAGhznndqSy', 'pum&]RS^0L'], podcastState: 'i1!MY(#VF814z#zbGLz'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['%$VVzMS3SXFRMKa7%^lI', 'mJD8#c0u&3)uNsk5kRH'], podcastState: 8329353582608386}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['Og*O4yxlTPn', 'G3TuH8j!*B'], podcastState: 2911608095375359}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['@9Agqt]jl#HVY63', 'hjjT]ofr('], podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/ids', {ids: ['wP^*OfWI%$GD$9W6lm', 'Mn&NzMAC!aZDw9'], podcastEpisodes: 'eWvhIitc05Z'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['LyPiC', '21n5hF(eYn8lZTo'], podcastEpisodes: 502317216432130}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['&Y!dgn$Z^Lda2GIY', '!Rv2sXAz!hDp&D'], podcastEpisodes: 1347090168938495}, 400);
				});
				it('"podcastEpisodeCount" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['L5iueQWq*Y', '%*RgNVld4Od'], podcastEpisodeCount: ''}, 400);
				});
				it('"podcastEpisodeCount" set to "string"', async () => {
					await get('podcast/ids', {ids: ['vf97UDhuoVC]HHuA', 't%NHDCfU'], podcastEpisodeCount: '$Pj9m'}, 400);
				});
				it('"podcastEpisodeCount" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['aqXa6vkWD3', '$2WP@!rvr1yFsAgiQcSf'], podcastEpisodeCount: -8438840167497726}, 400);
				});
				it('"podcastEpisodeCount" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['s#Od5Fq3DVC558', '6JV2RdLA'], podcastEpisodeCount: 3204438944645119}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['BuaCK)tk)Kw', '^merUJbxX2nY'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/ids', {ids: ['DjCOrJeo4Fj@so', 'PlSr20]oqngl'], trackMedia: 'vFah9C6%AitSL7ByP74u'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['O[JN0)P', 'JyW*JUoiLdjggOs26*1'], trackMedia: 8708908239552514}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['PU8zosEkj&tex%yDx', 'P%8vsj&qi!Y'], trackMedia: 7646367493128191}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['L^OJA@(X*cuCT[CE(#h!', '(6#pZhL)eqN%7PPy[v'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['Ts54E8OzLSqJpZlb8', '0XuClq*pU2&Q1!'], trackTag: '2c44[)uUPh]e(fhL'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['7^tp(QVUN3', 'W6BLnHkmQLNx]cJPZb'], trackTag: -7502114813116414}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['M]zy2!L(tX&0n2Rht(', '66xfWc'], trackTag: 4246039150198783}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['n44v%&m', 'zP)gQklg'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['AX$7AG', 'W8uyN7Ou4Qx9B'], trackRawTag: 'jkMp3G8z#rOHblYs'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['yY3tjXGj4[0mR', '8TLNIp2B4RI*'], trackRawTag: -4370752652443646}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['SS^l1M', '9)xUN!'], trackRawTag: -638535870709761}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['%VF@sapadP', 'xTEIgO$^[WTQH%q67aa'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['Fo$x3', 'SiN9a'], trackState: 'S3%KNcBuNtoz'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['mklMXKq%nkUn', 'nJW(BLf5CYkRNR0a#%hq'], trackState: -2767076372512766}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['wOzsvhGv', 'wY50(wg'], trackState: -58943791431681}, 400);
				});
			});
		});
		describe('podcast/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/status', {id: 'E$LUVjmA1D%1'}, 401);
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
					await get('podcast/search', {offset: 'Xoa2((fI8HloI$9Onh6o'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/search', {offset: 8.72}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/search', {amount: 'tktuBMHF]J%KhS'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/search', {amount: 46.29}, 400);
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
					await get('podcast/search', {sortDescending: 'UrcfnoO8s'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/search', {sortDescending: 7043289547014146}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/search', {sortDescending: 1019204136337407}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/search', {podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/search', {podcastState: 'u[WdkW$OH7zGdREq8jC'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastState: -8928418561261566}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastState: -3953957504286721}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/search', {podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/search', {podcastEpisodes: 'GKVh%qQpVFOp9U6Qrig'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastEpisodes: -4444251307900926}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastEpisodes: -2045305029656577}, 400);
				});
				it('"podcastEpisodeCount" set to "empty string"', async () => {
					await get('podcast/search', {podcastEpisodeCount: ''}, 400);
				});
				it('"podcastEpisodeCount" set to "string"', async () => {
					await get('podcast/search', {podcastEpisodeCount: '(mtAGDCy'}, 400);
				});
				it('"podcastEpisodeCount" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastEpisodeCount: -512064040730622}, 400);
				});
				it('"podcastEpisodeCount" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastEpisodeCount: -8026893089505281}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/search', {trackMedia: 't)W@B6MJR]tkUHvs@#'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/search', {trackMedia: 2612471177150466}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/search', {trackMedia: -5764201423306753}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/search', {trackTag: 'Ap$mqG9n'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackTag: 154984373026818}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackTag: -2234140829155329}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/search', {trackRawTag: '(&x2Tj#GEkFuC7wlCC4A'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackRawTag: -1475479726981118}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackRawTag: 1129186345353215}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/search', {trackState: 'PYnFkT6s]NnOTnD^'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/search', {trackState: 4887554973237250}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/search', {trackState: -8457396661780481}, 400);
				});
			});
		});
		describe('podcast/episodes', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/episodes', {id: 'I17ZkU'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/episodes', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/episodes', {id: '9$)MdSHV]#s', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/episodes', {id: 'ic)BI&6x@3]2QN7qCmC', trackMedia: 'cqq^pURz5b3[z3'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'V(d[yVDQ%', trackMedia: -278959602270206}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: '^VgHg(wmPAZ0Wy', trackMedia: 304099304144895}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'ZPBwSb', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/episodes', {id: '1!SAYzEz0!Do7^u', trackTag: 'mn[BS(Ek*Q]13Cy7wp'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: '0Fpn(JO8!W%HDTZkmTV', trackTag: -8329524152369150}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'fCbCZkdV]9HTX#SUIA(', trackTag: 6633543513931775}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'Rb7Bhm57)dbtZ@(Y', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/episodes', {id: 'WlFbA3NW(3z$&4K1g%E!', trackRawTag: 'mVfLu3A3JiGrf'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'L@b7U%L', trackRawTag: -448153371279358}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'TAV[T4d', trackRawTag: 2151545818841087}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/episodes', {id: '@qJfN65', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/episodes', {id: 'eumW)!', trackState: 'el4Jpj'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'l6cDk7uvYvG$', trackState: 1331495503396866}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: '[^fHp2as@OGKbH', trackState: 3611722208247807}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/episodes', {id: 'BW(aeyyxaG6(Ka6i', offset: '4*mcLi*Ix#C@9B*RA'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'h^pqs5^q^EYgiRUR]', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'T7c3P$vs1$]*I!@(*zu', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/episodes', {id: '(BmO%wHX6WrE&c4Z', offset: 57.19}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/episodes', {id: 'jaqTg', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/episodes', {id: 'Ir]GkXKr#GaHKT', amount: 'P62XCyYBTpgZbO[OHn[1'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'k0)8Xfnr0KkuyT@p', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'b^FkuFThw', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/episodes', {id: 'Gg^Cce6ML)Xo4soFsa5', amount: 34.88}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/episodes', {id: 'lkNahk4thejEK', amount: 0}, 400);
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
					await getNotLoggedIn('podcast/refresh', {id: '*8Asfxqpne'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/refresh', {id: '*8Asfxqpne'}, 401);
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
					await getNotLoggedIn('podcast/state', {id: '4pTp['}, 401);
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
					await getNotLoggedIn('podcast/states', {ids: ['C0m1w7WeyMWgyKTMeP', '8nlwCmTT00nR^FpqM']}, 401);
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
					await getNotLoggedIn('podcast/list', {list: 'recent'}, 401);
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
					await get('podcast/list', {list: 'highest', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('podcast/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('podcast/list', {list: 'highest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('podcast/list', {list: 'avghighest', sortDescending: 'U4va!^6nq%o'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'frequent', sortDescending: -1806004996014078}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'recent', sortDescending: -3507714567176193}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', podcastState: '%DqE55PBX!'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'faved', podcastState: 2075961830932482}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'faved', podcastState: -6813078452699137}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', podcastEpisodes: ']JrHR['}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'highest', podcastEpisodes: -4420746466033662}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', podcastEpisodes: 3841897273491455}, 400);
				});
				it('"podcastEpisodeCount" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', podcastEpisodeCount: ''}, 400);
				});
				it('"podcastEpisodeCount" set to "string"', async () => {
					await get('podcast/list', {list: 'highest', podcastEpisodeCount: '^7oKU8gIH]PbGA&73m6'}, 400);
				});
				it('"podcastEpisodeCount" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', podcastEpisodeCount: -9003878771064830}, 400);
				});
				it('"podcastEpisodeCount" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'faved', podcastEpisodeCount: -7715564847890433}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/list', {list: 'frequent', trackMedia: 'qvrmZ%a@&'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'avghighest', trackMedia: -6138475522818046}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', trackMedia: 170908715057151}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/list', {list: 'random', trackTag: 'P(ErEg41P'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'faved', trackTag: 6888900601577474}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', trackTag: 4178352537599999}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', trackRawTag: '0Vnmelq'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'avghighest', trackRawTag: 5816114382635010}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'highest', trackRawTag: -6793681096933377}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', trackState: 'YfK1ELYvO'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'faved', trackState: 5660776224260098}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', trackState: 386622226956287}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/list', {list: 'random', offset: '5YSeYScN6KCpLe'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/list', {list: 'frequent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/list', {list: 'frequent', offset: 15.15}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/list', {list: 'highest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', amount: 'ug!^Rn7DmEHL68sgg'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/list', {list: 'recent', amount: 41.49}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/list', {list: 'frequent', amount: 0}, 400);
				});
			});
		});
		describe('radio/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/id', {id: 'xyDN@3', radioState: true}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('radio/id', {id: '', radioState: false}, 400);
				});
				it('"radioState" set to "empty string"', async () => {
					await get('radio/id', {id: 'jO@0[Hsm9^)PX', radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/id', {id: 'Ad6Ca5CA6QX9f#myt)7', radioState: 'a)U5m^w6FOD'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/id', {id: 'FC7R]![XiOy[N(', radioState: 7353056630931458}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/id', {id: '&sLmfT6O', radioState: -1371670983999489}, 400);
				});
			});
		});
		describe('radio/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/ids', {ids: ['SQ(ORR$0u!jDtR2qH', 'Cfx^a3DtQk^Y)HTIN$]'], radioState: false}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('radio/ids', {ids: null, radioState: false}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('radio/ids', {ids: [null, ''], radioState: true}, 400);
				});
				it('"radioState" set to "empty string"', async () => {
					await get('radio/ids', {ids: ['2(^w&^kV4sNC0grTO(8', '5Nx3zuS^yo'], radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/ids', {ids: ['D(1e)(&@', 'UrXRvfRJ'], radioState: 'do6$M]bTzjG#YJ$@s'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/ids', {ids: ['[dhD$0BF', 'S6HGJ6TY6]whZ'], radioState: -859903463784446}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/ids', {ids: ['*R6ulOr^CY%O&xYHM[CU', 'HlVl98D^DAIZ('], radioState: 3339185511464959}, 400);
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
					await get('radio/search', {radioState: 'gflosTTgQ!fS'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: 1624613431803906}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: 8654567466074111}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('radio/search', {radioState: false, offset: '*I[06uCJ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('radio/search', {radioState: false, offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('radio/search', {radioState: true, offset: 62.57}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('radio/search', {radioState: false, offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('radio/search', {radioState: true, amount: '0C(kUGNwbOj&[ehqyda'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('radio/search', {radioState: true, amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('radio/search', {radioState: false, amount: 91.92}, 400);
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
					await get('radio/search', {radioState: true, name: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('radio/search', {radioState: true, sortField: 'invalid'}, 400);
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
					await get('radio/search', {radioState: true, query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('radio/search', {radioState: true, sortDescending: 'QuG6US4ETll4uoIL!'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: true, sortDescending: 3460457599860738}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: true, sortDescending: 2152616435908607}, 400);
				});
			});
		});
		describe('radio/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/state', {id: '(JoD&tWjZxL7kG*'}, 401);
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
					await getNotLoggedIn('radio/states', {ids: ['rujGkHE', 'vc)uC8']}, 401);
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
					await getNotLoggedIn('artist/id', {id: 'z6ty!)(0a9(uT9I'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/id', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/id', {id: 'U)ZkkB%GJx$[H1YxB', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/id', {id: 'hn&6G#', artistAlbums: '5WcsRL&tl'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/id', {id: ']jdpD!u', artistAlbums: -8683873135230974}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'CMXSVD%', artistAlbums: 4065188626038783}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'RYchRqoux)HW[]7w!I', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/id', {id: 'ZJf^p2yVILvX*', artistAlbumIDs: ')KgYyqwTm]0)4O8&L@j'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'O2YfM', artistAlbumIDs: -7320583280787454}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'hRcy(', artistAlbumIDs: 7894753576222719}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/id', {id: 'AIFyfHNvHfTRZ%xhZy', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/id', {id: '^#D(4#xwB', artistState: '^a5ytIExeEbw'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/id', {id: '^KuUW$KYMvEd3bNpVBC0', artistState: -4896172116279294}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/id', {id: '8zjQ0TRu^S', artistState: -3792467996442625}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'b5D7mvJxmZ4hVV4', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/id', {id: 'BaQZ2Z]^6s6aGb%34', artistTracks: 'vJ822RA(Fw9O'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'YlLiQFE2', artistTracks: -8762248264679422}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: '*F]7IX2', artistTracks: 2498052824760319}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'pQ#*JPQ@nBkr', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'Ujl%RcH0gMiKSG25Lm', artistTrackIDs: '&Kx&eOCA'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: '((YwC1oNURC', artistTrackIDs: -159400190803966}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: ')z5uct', artistTrackIDs: -3459782568574977}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/id', {id: 'L4I0Ka5', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/id', {id: 'laGCz@6VlQymDKDhKqZO', artistSeries: '01O)L'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'o%kQ5e', artistSeries: 6282926798929922}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'p8qvIoB*OIJIG', artistSeries: -4243808841629697}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/id', {id: '47l*eruuX', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/id', {id: 'P[LRqlBW3ECI!SjoHh[', artistSeriesIDs: '9%PI8g'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'X]5Lk(RYtIJ', artistSeriesIDs: 2272867098034178}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: '64PqlXJqgh&GrCEn3&', artistSeriesIDs: -7098442631348225}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/id', {id: 'JZ@&yWI00xf6', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/id', {id: 'bhl(2BO', artistInfo: '3m)LB62m%j2rx5dn)MmY'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'PMmzT[k3dfTlX6k', artistInfo: 5070668915802114}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'suLmbJUQ%BH759FEAJW', artistInfo: -423716873830401}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/id', {id: 'EBgb@xdx)y$n', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/id', {id: '8nMg[0Zluos7', artistSimilar: 'yM(7F(M'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/id', {id: '3!t1bK[[L1(xbJ3r', artistSimilar: -3479798374465534}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'WECbYQoR[4&K', artistSimilar: -3017547586732033}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'p@I(rd[s7o5nGA6u3K', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/id', {id: 'Pf4eP', albumTracks: '*rJfaEJTz@1qWiMFu*PV'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'Lxr)#DZK$SYziS', albumTracks: -4455504671670270}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'tDV^GiC4xmfmok2', albumTracks: 6911297656455167}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'EmiHld)QYOzDu7Typ', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'kft@F0$YLb', albumTrackIDs: 'o6pkjS6uv0pxDIgR'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'Qm3P9%p&O', albumTrackIDs: -7532104682307582}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'hy7u]l%%t', albumTrackIDs: 785594905001983}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/id', {id: 'x*tZF', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/id', {id: '0cpDh', albumState: 'jT)uvJP5mRz!ZqiyX1g'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/id', {id: '8sAws&', albumState: 694089464938498}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'bwGN^im1', albumState: -5296884654538753}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/id', {id: ')#^cFr#0]pf', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/id', {id: '^!%BQ%r!V3&Sh', albumInfo: 'GnYuG9['}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'v5rfxd2J%McojQIG', albumInfo: 6227574787145730}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'VilzX$', albumInfo: -7304439098507265}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/id', {id: 'Ouc9AjT#j', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/id', {id: ')95fQnZAZTE3', trackMedia: '@jXRX7jEubE)]3bRKKKE'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/id', {id: '0&GevS5Mul', trackMedia: -8698620769468414}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/id', {id: '3Mhn56)P2FLZAejcg)p', trackMedia: 3293789863018495}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/id', {id: 'HtH[%CWrRw(ub', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/id', {id: 'qC5VUB(Rqw#jpGU^Qsk5', trackTag: 'xjL7%%2s#'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: '3iIUiF$P&MyH]&D#', trackTag: -1007672287559678}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: '&9B9HLuTg(nRlk%@D', trackTag: -607680985038849}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/id', {id: 'CIGtop0VtQgJ06Dg9g6b', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/id', {id: '@0TFs', trackRawTag: 'GptKuS[mBEAR0C'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'BHZKaXqMeIT]wjP$E1hk', trackRawTag: -2039598582595582}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'TG(9Dq^!0Al51C', trackRawTag: -2451876691836929}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/id', {id: 'lqsjPR]$I', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/id', {id: 'VoWl1L$WbQ&p@1', trackState: ')JthyW5P7'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/id', {id: '%nLDpMB8Q@GY4', trackState: 5404917342666754}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'sq(Fm%9#eaa]e', trackState: -491076762730497}, 400);
				});
			});
		});
		describe('artist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/ids', {ids: ['qwiqfRou4$^q', 'deoFS]n@^1ikl']}, 401);
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
					await get('artist/ids', {ids: ['Xu)]^', 'g]I36'], artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/ids', {ids: ['vLaPYJIS', 'xo7eD&Vr4ga!v8t)Y5K'], artistAlbums: 'iW5^%xHKV381@Wh'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['*@m%cfGZ', 'qSd%6NltvHkX$9b^fL'], artistAlbums: -2031389302063102}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['lt9iXA]zZ4eUsd2#', 'H%4TeLn(j*w'], artistAlbums: -8427015178813441}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['k7CDVux7x0gIuVvg', 'OrF*iTbp)DaQw^4x'], artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['gDGvIwFmqniKLXJ*', '5X#aJqeJ8^Z%'], artistAlbumIDs: 'V4NBfhM@qKEl(B4f7EJ'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['M#nyN2V4*0w', 'Sj%[v&J#QZ'], artistAlbumIDs: -630202719797246}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['v7PcLYs', '7daNfJb@U3bdMnH2xLX'], artistAlbumIDs: -823356538486785}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['zMS5gJ*qjdb6cDm', 'f#j6k*8%rzzEokiHuPWR'], artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/ids', {ids: ['9rP!ewgqBqT04GS', ')*aH2al8'], artistState: 'p1VsM03vmb^QPcqDyw'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['c$$MRpVyb[P(web]', 'wGEG!rA(ICR0fyXa)'], artistState: -7560100076060670}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['2XdHh%TFdBq2', 'AHG#g5LV5G*HSW5M'], artistState: 3583552721518591}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['jHrewC$[3*EL', 'l8i^cQg1SSJbg5w9VGj^'], artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['4Aebr0vSuTde]jm', 'h7M]$foEjdD[vqCpPz@T'], artistTracks: 'NYsTzIJqEXtfNlh'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['9^jBXEp^k!&UamqSYX', 'YivWhe'], artistTracks: 5183297596424194}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['F37IIexR7BM', ')Y@Hc4A7Z4(gG'], artistTracks: -7498275313680385}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['nzE$4', '0p^F#lNHi)'], artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['e8^R9mL2AQl2kDV5', 'qkIX)W'], artistTrackIDs: 'L@F^@jrxLetBO3@3^ojR'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['cNKA[f', 'f8Bfblv^*8gxAC2]^fF'], artistTrackIDs: 391651260366850}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['jM%%9!', 'uObYf'], artistTrackIDs: -1215463912636417}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['[BrCJ)P^Zu34OO#tk##a', 'kRQicJA7I8'], artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/ids', {ids: ['pgK%NgYFz27ux', 'un7G$'], artistSeries: 'vOwYCyDP8w'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['kXprcHZ6aCuS', 'gr3Q^UM$I*JK#'], artistSeries: -7465234415484926}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['Rvda#^TI', 'CS$(Lp^^NHRiE'], artistSeries: -6823171223191553}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['SNAdABU$B', 'egst(]T^R'], artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['pzRtXE5hr4*93', 'J6@)o0'], artistSeriesIDs: ']D$mKyHDiZku9G'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['YE2c9)VnXB1RN', 'WylIdU'], artistSeriesIDs: -500223671533566}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['[gl1!41B7', 'ZmbwVlJ'], artistSeriesIDs: 498843141537791}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['[yKis3K6D^4ng[&3', 'z3MT2Rt1e&$qwph'], artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['P[V1]sdxL', '@1#XEyAZh&'], artistInfo: 'SIG*u7#vR^7rC9jd'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['CE$wQNxrCgyy', '*k!p#n(q@4T&cy#^f'], artistInfo: -1903565601767422}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['gGAt@', '5D]t%'], artistInfo: -551496995307521}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['GriEi$zX19jySB9mT9', '%V$]gHSD5IcKkz!Edt'], artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/ids', {ids: ['([ecH6Q4bm[x^^q', 'k[f2*$I'], artistSimilar: '8t(gAWIXr6W'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['WgysfYeIqvT7Z5E', 'JYmV[pP*oFvXIDctij'], artistSimilar: -4372156515352574}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['Ga2pftSb8', 'R^%mjZ'], artistSimilar: -431268198088705}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['gKoNmqWLc5I', '^FqPSnVSNav6x'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['hhVMEgp]ndQIZxx&', 'L@c@B2@fRlk#0^IriS1Z'], albumTracks: '[k21HI'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['e#fLd', 'p[xyD]3'], albumTracks: 2754848172802050}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['QmW!w4W@', 'z%N)E2ba5le'], albumTracks: 4147871775457279}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['IPS)WLm@0u9vlcg', 'y[y(HlW]jeEV)x'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['&&*CycmJgLYxh1ZP#iyK', '5vg1b*@FuR$@Xy%'], albumTrackIDs: '2)eCydZazZH'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['71##6zt*rL3', 'VzAhGeNwZ4YK8i'], albumTrackIDs: -8562235722956798}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['H^wq*J@q[nVOo#o6cD', 'hCQKXJ0q1c]$kv'], albumTrackIDs: 1378750797185023}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['AXZL^R4Q', 'QFPUy!HoWPAo*lfBJSbD'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/ids', {ids: ['g@Nim#!', 'SbGHW^]9LFrp)oQ(#&AW'], albumState: '1)5*X'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['lLltzSG', 'KrhN@tAei!cKD0'], albumState: -5628794484293630}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['cvRjh8qFlXkg1p[OL4[', 'OzM5f'], albumState: -8642486494822401}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['z!Xz6H0TGh2*gq', 'J9c5NKgz75#V'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['nR9VY$j(', '%TB)4rRzToqh!vq'], albumInfo: 'Q[&UjGWceO%xyf!zr5P'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['HEj)p&AG', 'ue&x$m34r6OLvf8L'], albumInfo: -2261330564218878}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['UV5YVG$G', 'ECqn)%FN*4hX^S%j6'], albumInfo: 5838524553101311}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['RbSfx', '1a6Y77lOMKU'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/ids', {ids: ['*k&r0F4A8#1HjZ', ']vnTiEE*D'], trackMedia: '(k3[DC*p4['}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['$BqW@seMsKd', 'j09UIWse'], trackMedia: -8798021760319486}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['OmMmJtMw#[H', ')Ivlnz^goG'], trackMedia: -8997324751634433}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['U!Vvo5Mh[E(58T[P', 'IwBEIl#uH[Ax'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['6UnM#Mbz96@^I%Jc*8', 'c7X^hygK'], trackTag: 'Cf#dQ]nive%lIGaQS20'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['!mw1XI@$Bf9yoyLe', 'hZ&2^krxQ]Wg'], trackTag: 8486780865085442}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['Cgl*x3sP^14TR5', 'f]KR4%h]EJ*'], trackTag: 8309287386349567}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['UH!7LkuoJU#*6', 'fRBa4tEeoQ[0$i5cM'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['k*xFguHx3mD1u^)SDe$M', 'XIU0wgV'], trackRawTag: 'PhNj^WMbcM$Oed'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['Adfxd7x()WE0hJz', '7)HZcvO'], trackRawTag: -7569351154597886}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['2Ji6Pw!!81aC4', '0mhWmgIpE1g'], trackRawTag: -8091314499354625}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['M]blGDxGoTMDjyzC', 'SMxs4[fsMylY2IkfT!*E'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/ids', {ids: ['4wAKC!V8q659)[', 'vm)SA'], trackState: '4d28pB)^%tQirnxxi&n'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['*I&yBmQdYu2KhmMSAue', 'uvHtBqqE%(cC7S'], trackState: -855026390007806}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['T9JFWJw', 'qBo#&CYHrtx'], trackState: 2474545105600511}, 400);
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
					await get('artist/search', {offset: 'k#(DDU$l*@S#$%]i68@'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/search', {offset: 75.86}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/search', {amount: 'ABL%^giTeD'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/search', {amount: 31.84}, 400);
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
					await get('artist/search', {newerThan: 'R*^IRXsZyv&]RsQYLe'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/search', {newerThan: 84.52}, 400);
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
					await get('artist/search', {sortDescending: 'gjvEjqTAOku%y'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/search', {sortDescending: 4655660495011842}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/search', {sortDescending: 7759965540319231}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/search', {artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/search', {artistAlbums: 'Sk0K4LYW&16G*mi'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbums: -204577471201278}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbums: -2569141638660097}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/search', {artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/search', {artistAlbumIDs: '(3niE]%#'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbumIDs: 5884725113651202}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbumIDs: 1893121973551103}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/search', {artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/search', {artistState: 'uk!kFzAhB[#!SWF'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/search', {artistState: 576082021449730}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/search', {artistState: 765822926585855}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/search', {artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/search', {artistTracks: '%^h^)AmuWX5Jfh!PqqLn'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/search', {artistTracks: -5483831830249470}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/search', {artistTracks: 6253730315894783}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/search', {artistTrackIDs: 'xXpfP$VNp5zqaePqXFV1'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistTrackIDs: 5044937456353282}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistTrackIDs: 7811392623083519}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/search', {artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/search', {artistSeries: 'SjBRtyU$&o%rf4nu'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeries: 1060113414619138}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeries: -5256603724939265}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/search', {artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/search', {artistSeriesIDs: '!Eh0fjq5pGhY!N[jVMaD'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeriesIDs: 7441778068160514}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeriesIDs: 8528752468295679}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/search', {artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/search', {artistInfo: 'efo[KGuii9A'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/search', {artistInfo: -4735885350273022}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/search', {artistInfo: -6396264304345089}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/search', {artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/search', {artistSimilar: 'HIsjagGBTn'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/search', {artistSimilar: -1141024185384958}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/search', {artistSimilar: -1851606354100225}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/search', {albumTracks: '%BPCpJLc07S3U8jR%'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/search', {albumTracks: -1626634394271742}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/search', {albumTracks: -8322196258684929}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/search', {albumTrackIDs: 'h3K0TI$Y*g5LTiv'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {albumTrackIDs: 256561830166530}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {albumTrackIDs: -5099854560755713}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/search', {albumState: '$!K)VV'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/search', {albumState: 4758025344647170}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/search', {albumState: 7041174233677823}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/search', {albumInfo: '%lmY4]eLC#rm'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/search', {albumInfo: 8021192321531906}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/search', {albumInfo: 3736168520744959}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/search', {trackMedia: 'dlat!*dNaS7T'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/search', {trackMedia: -8576702322049022}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/search', {trackMedia: -8483263827935233}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/search', {trackTag: 'OoDn3Oh^#$'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackTag: -6025269735325694}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackTag: -6365016269783041}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/search', {trackRawTag: 'iqvZ!T0jCVNSSj#X8!j'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackRawTag: -4977669049417726}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackRawTag: -8780941774290945}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/search', {trackState: 'ciho%V'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/search', {trackState: -2037958400016382}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/search', {trackState: 8694102765862911}, 400);
				});
			});
		});
		describe('artist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/state', {id: 'O)7dnTwfK7Ol#[n'}, 401);
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
					await getNotLoggedIn('artist/states', {ids: ['ERaBXOLnuQzWX#X2[J]2', 'EoVawSf6aj']}, 401);
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
					await getNotLoggedIn('artist/list', {list: 'random'}, 401);
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
					await get('artist/list', {list: 'recent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('artist/list', {list: 'random', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'frequent', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('artist/list', {list: 'highest', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'avghighest', albumTypes: [null, 'invalid']}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', genre: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', newerThan: 'I4$d9gMK9ZM'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/list', {list: 'avghighest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/list', {list: 'random', newerThan: 87.05}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'random', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('artist/list', {list: 'highest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', sortDescending: 'MFSQ^HS$V'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', sortDescending: 7321279543640066}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', sortDescending: 7476710396133375}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', artistAlbums: 'TLHs&sTr6HAK2V]E2[o5'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', artistAlbums: 685768959852546}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', artistAlbums: 1056008495431679}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistAlbumIDs: '*wwMYPIGN9A]avysZCC'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistAlbumIDs: -5229333958361086}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', artistAlbumIDs: 4839064381423615}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', artistState: 'ITD)T'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistState: -3597562804174846}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistState: 8073404494118911}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/list', {list: 'faved', artistTracks: 'yZaLtLSlUaEg2lwZnV'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', artistTracks: -3068566853124094}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', artistTracks: 2631976079065087}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', artistTrackIDs: 'JWpik'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', artistTrackIDs: -1156624072835070}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistTrackIDs: -7709628175482881}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistSeries: 'ovEncY'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', artistSeries: 3190231721312258}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistSeries: 3812721829085183}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistSeriesIDs: 'Ahisg4'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistSeriesIDs: 8718596360372226}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistSeriesIDs: -1866002023317505}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/list', {list: 'highest', artistInfo: 'dQVt^UZPQhGCCu'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', artistInfo: -3921897414721534}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistInfo: 3846174888951807}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', artistSimilar: '#)H15'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', artistSimilar: -6888656774103038}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', artistSimilar: 4267651740205055}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/list', {list: 'random', albumTracks: '%@5Om[%1c'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', albumTracks: 2297966886914}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', albumTracks: 5703574747086847}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', albumTrackIDs: 'RAMhB%H&*nu'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', albumTrackIDs: 4447602326110210}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', albumTrackIDs: -1930044595240961}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', albumState: 'T2qoptHPdUO[&$3'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', albumState: -7559477234499582}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', albumState: -5335880218705921}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', albumInfo: 't4TsplA'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', albumInfo: 6451899427454978}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', albumInfo: -3612967941701633}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', trackMedia: 'km@S$A@*fVC$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', trackMedia: 851719252606978}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', trackMedia: -978562635005953}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', trackTag: 'FjBf@H&yqBP'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', trackTag: -4175624323203070}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', trackTag: -4945173020672001}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/list', {list: 'faved', trackRawTag: 'LurBDyu0lp0'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', trackRawTag: -1160855471259646}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', trackRawTag: -4214885000937473}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/list', {list: 'random', trackState: 'QqBmZcONY3'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', trackState: -2755183096365054}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', trackState: 1250354083659775}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', offset: 'q]E08le)0Vw9'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/list', {list: 'faved', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/list', {list: 'recent', offset: 64.73}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'highest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/list', {list: 'recent', amount: 'zT*pGSx&'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/list', {list: 'random', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/list', {list: 'highest', amount: 56.17}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/list', {list: 'highest', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar/tracks', {id: '4&d@n79F(g@b'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: '!hDUQLfoTR', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'Y$%9)zsM', trackMedia: 'la@qM5)rwGNEraz[Sk!'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'V*ewR9d3wG5hY)j3', trackMedia: 4490271647596546}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: '2PgAQ', trackMedia: -8952788528660481}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'Ahzb4[6!6FCZX1m2s(', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'ei28fT', trackTag: '^CXHF'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'g3276IOI', trackTag: 957343181307906}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'G](y6J$GC^6zOW', trackTag: -733464345182209}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'u7lo[Z', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: '2rBChja', trackRawTag: '3Q@AH**XdY(DyWB'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: '1L#dooJWlWf6p!]veLRo', trackRawTag: 7371356723216386}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: ')6#VCVu', trackRawTag: 1287212771573759}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'ib7PW*W0ddE@', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'Sp33gUSynW', trackState: 'D^Vvb4ott#tRq4Z!kUv0'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: '4)tJXgPf[S%', trackState: 8842928252256258}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: '@*]laE*Qxh!0i', trackState: 2701071931670527}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'znkNJ)a5', offset: 'o0yZ^Hm[@V62EZ0'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'U^wL%Uf3cEzdlW[S5', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: 'hhIiEExGt[YIG8o%$v', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'i*7IPvuhr6', offset: 29.7}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar/tracks', {id: ']bGPwz#%Z21%v', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar/tracks', {id: '38Q[cTo2]Sx7hAkUy', amount: 'AZCkUk0g'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'luMKS', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: '!@@)32w', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'P#r^CO25vvMhOZ&hkQx]', amount: 36.78}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar/tracks', {id: 'UyE^NL', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar', {id: 'YD67hG1HNGlz'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/similar', {id: 'VIp2*]^[Jonrsp', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/similar', {id: 'B8oqbH', artistAlbums: '&PRP[BXX*wL'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Segnwm[EWiv#', artistAlbums: -6624862244175870}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'RKaht8DU#gqkf3%mUwp', artistAlbums: 8634372194303999}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '2OGvy0e*w4p&[', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/similar', {id: '*QHh^c3K*S5Y9', artistAlbumIDs: '(B#Q[MQu7A'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '6sLI@nj^pM', artistAlbumIDs: -5602101052833790}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'gbi&us)n^G$&t&njp', artistAlbumIDs: 114675966541823}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'T1Px@Zs', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/similar', {id: '0K)3%(6JIAIyxz8waJ9', artistState: 'Unsjdlut2n5ev'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'z81AS', artistState: 3881178079690754}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'U$d$fQ4mQbOmS($', artistState: 5454013650698239}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'hOY3)DNK*M0EWU', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/similar', {id: '%Bh7Huu9Xon0H#', artistTracks: '2dWKJ[6#Q54vyDo@e'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Hv]xZy6gjZfwx8G*vV', artistTracks: 4601080298078210}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '5rCP^Rm', artistTracks: -1682304531431425}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: ']8%qIIihQl3vsLt!xs', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'QAKQ&9hBv)sc2', artistTrackIDs: 'MevmoX9P3'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'LQl2TJ[ihzAyJ#h$4#W', artistTrackIDs: -5591757504905214}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'AfO8$WH30AVl9Yus', artistTrackIDs: -8541893256282113}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/similar', {id: '[Urmv#Hrjm&e3Oy', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/similar', {id: '(r]rj&5zoSE#xZ7KGN9', artistSeries: '0^thbGGZ]x]e]m['}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'dLoI1WH8oQWE7e&^XAs', artistSeries: 220408301223938}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'Ckf$qflpp1X5L', artistSeries: -3071918097825793}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '7tsj2!zZ)CHkss$vGyhq', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'FDJRisi&ll', artistSeriesIDs: '*j^lwO'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'V&#gtzjfE52FwLFUy', artistSeriesIDs: -2390207303254014}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'LgphVw', artistSeriesIDs: -1216511217762305}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Ip[fI', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/similar', {id: 'BOoIYU9(SsDk', artistInfo: 's0z3o'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '5a!MqR', artistInfo: 5897334521069570}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'KE@dQ3miRHNh&*nm$A', artistInfo: -381069459193857}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Nj)VO@d', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/similar', {id: 'iSn46#8AV7', artistSimilar: '5*(mSl2zu]!2yTVxkjhs'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'V^*iRjL(x', artistSimilar: 2793243016167426}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'i$u3ml(b6czH6gPGTj(', artistSimilar: -1203978150871041}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'v^U8yst1kG', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/similar', {id: 'X[Kdsjo5xH#AJdGtA]%', albumTracks: 'tI6wXy'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'trMTF1w$jWR', albumTracks: -7955477442854910}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'OgxAIDI5NDB', albumTracks: -956690157535233}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '*rzk@imBMG5t', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 't%1yxaDK!', albumTrackIDs: 'cwRkq*Z@y&P7'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'EHrm4fyKIb', albumTrackIDs: 3500992700088322}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'p#NmL^pnQ)0JwY', albumTrackIDs: -1590741683929089}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'N(p9PaugG^DDy#4', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/similar', {id: 'DXfA[GByDue1i', albumState: 'k#Z$uKnZ'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'U@j((H@aa8b!a2x$&i*$', albumState: -5530632910274558}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'dH*4LiM&Y88S', albumState: -8731749123096577}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: 'M3AtMn7AU8(&((l[Qej', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/similar', {id: 'bxdGZ&7Z^d9', albumInfo: '%7]3rF9g9aM'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'W]OA&2VtP3&rgh1]TE9p', albumInfo: -7685559732404222}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'nSAGzq#w', albumInfo: -8537345049493505}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar', {id: 'ybK0^&dIG', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar', {id: 'I8)&H%SKMJZ', trackMedia: 'V4toecCzc[rv4ouXfv'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar', {id: ']5u%IP%&%cMyr66', trackMedia: -8613422941863934}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '#(DUzWHUO9!vIf', trackMedia: -5831720309882881}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar', {id: 'mODW[0u9FEJwxHIq^OG', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar', {id: 'dlD!^', trackTag: 'I9]k]E@YfT7d'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'y$x8d5CyB4$5y5T*ia', trackTag: 1806973477584898}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'YufMA#aV', trackTag: 1976961941372927}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar', {id: 'VekXG', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar', {id: '*CbqDACm)Fr%NG', trackRawTag: 'BF3I(7)'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '%l4cv', trackRawTag: 2643833837846530}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'jbhuG9*fpPPjv6', trackRawTag: 6856371626573823}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Rx*3LYuBDwIIMh', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar', {id: 'TH&#Vxf4azGWLC', trackState: 'QM59$(OhQKK@1)@'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '8Fi%f!]yM)Wfm', trackState: 6598009458524162}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'EVQyuRBIp&U!0()S', trackState: -5460065645494273}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar', {id: 'FJ54RGe1r@9zJssA', offset: '8s115*%lKu7'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar', {id: '*9X2VH', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar', {id: 'PP[O9SAC', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar', {id: 'uJpNqvlD7o3esi', offset: 5.04}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar', {id: 'wjm]MU0v', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar', {id: '2%bFSL!QUuZ7O^i4J*D', amount: 'XcBxht[kHic76$^D'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar', {id: 'w)qKRWpNr8v%B[123&lH', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar', {id: '97xKq(', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar', {id: 's3tf7qw#Wx7#C4Y11K!', amount: 54.64}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar', {id: '@eXv4z', amount: 0}, 400);
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
					await get('artist/index', {newerThan: 'Ar@v7XfbdaKRWvO#9O]'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/index', {newerThan: 10.51}, 400);
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
					await get('artist/index', {sortDescending: 'srTowo3$(VkxW7l'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/index', {sortDescending: 2401254068191234}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/index', {sortDescending: -8101079220748289}, 400);
				});
			});
		});
		describe('artist/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/tracks', {ids: ['!h$NzJI9kcPc', 'QWwN7WoN4jQD']}, 401);
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
					await get('artist/tracks', {ids: ['bUA)QrD^nh', 'KA1Qo'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/tracks', {ids: ['#RUICc9gkt!jWPKE0]u', '@M$ChZbTU&s'], trackMedia: 'z1FN8I@o'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['cY89k]y6[SaAp%Y%L', 'FUs]JEqddq9Uz#'], trackMedia: -6390069204090878}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['uKIbde0m', 'g7qiCdKrOQn5[M&3o'], trackMedia: -3387874204450817}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['JenVa2JSNcXo$(cJw', 'Acj0JmJj'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['3oAb)b[]qhgc^mKvfNv', '6g*iJ5Gi9i)#^&SD2*'], trackTag: 'Z!!8#z'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['pRDVP8&zP@Bu6P', 'kyj[S#'], trackTag: -2020759505469438}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['GURxC1$L8!!A37a7ix', 'Vz*kww'], trackTag: -1791606046851073}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['p%zFTRiLh', '89!j2uEb4it$E!!tp'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['y*bsOP', '[&W7Nx@m9'], trackRawTag: 'kI&Xq$jbiR3gx14@q3I'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['7BIkL9UYN$', 'mJadz)gc5%BK$mN0!vD'], trackRawTag: -3764109191413758}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['8YUN)idq0Q8', 'iCD7[XJQZq3vdJdH'], trackRawTag: -3451145439674369}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['K^IqEXTes', 'YQvyXc)YsgT'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/tracks', {ids: [']jkAcV8', 'y)15DCbeo[$7YFq#DK'], trackState: 'aSI!2qmfLHg4q'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['FM]RjnRx5n[ZE5^Ej@', 'Qy9ob'], trackState: 3885297033019394}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['Sf6R!G$F44oRdE9pV', 'n%bpSsenDm3mUFx9q[1$'], trackState: -1602016983908353}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/tracks', {ids: ['s4y2YedNYl2d21', 'Hu%Nwg57l'], offset: '@Dlks[%P5T#WU$@QA'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['Fqif[T5YocG[go', 'aQAOsra2RW6M'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['nFKVCU0', ')8dkaX5'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/tracks', {ids: ['TRU[xzK2OD*n', 'j9%kK]'], offset: 70.72}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/tracks', {ids: ['ww4xRpn', '&zf&zBRX4TZ*wokk8d'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/tracks', {ids: ['@%&D)Q^)ZXydt', 'mhqjId2A6HN@Ju2U'], amount: '(sbgUOtU0CjLoJeIPwZn'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['EvkDXq81fgV9W', 'g2BCu$Z29pTGG7A'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['RgB*VF%6[Nm9%ML0p', 'RrSnDsbJ'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/tracks', {ids: ['z!deh6JKDS', 'rzDu6c'], amount: 37.15}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/tracks', {ids: ['J0ZaL1DXjp$6QY38', 'xReOK17R[oDrSfI8nI'], amount: 0}, 400);
				});
			});
		});
		describe('artist/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/albums', {ids: ['s%bfM$EWEPg', 'hL6n6g5cllT']}, 401);
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
					await get('artist/albums', {ids: ['NZgtMnrncV9bxyBH!aJ', ')J3Hyv9IWcIm)LDY'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/albums', {ids: ['ExqzDGm!', '0HdH6pg*un5O4zubIHk'], albumTracks: '7fMuIN'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['uMGYc$L%', '9zz^@D'], albumTracks: 8616384686718978}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['bYtMFqUi', 'It(sQ%p!ifyqh'], albumTracks: -7868104361115649}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['s2dn!t[4H7', '8G%$U368'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/albums', {ids: ['FaLg4f@KdxuU(hhy%nh', 'MYwtqESFha71R'], albumTrackIDs: '5hn]Wn6DZ36Q8]EwV]'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['45KfJwai94Jt(dAI*T', 'tajTg2'], albumTrackIDs: -6491423750750206}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['ZWxOZ', '4iHMgk$'], albumTrackIDs: -6095735984488449}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['18t0M%BcBzR[@iz', 'W$)wsHEgX'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/albums', {ids: ['I578WX7SZ', 'BEK*ZX6&V1$Vo60^G'], albumState: '3wg8x%yH'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['Bw*@dsH', 'A!&tU7A2'], albumState: -5762464478134270}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['qBZ7KJWP1CXP94ndMoSd', 'R84cl'], albumState: -2228614619725825}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['hHbK#*%s9vL]l6g*8', 'KO(73jn'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/albums', {ids: ['^#YXnKI)9AgUi', '1I(UnFxA#e'], albumInfo: 'xor[Qnb)Q1)#CxM'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['Z!dwPfB6', '1JTp2gX)vq0bVI974S'], albumInfo: -8770633664036862}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['xHl]o!k*3p!&', '^Fp#7eR0v!JM]E'], albumInfo: 6955607420567551}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['x!L]dLdS#5@6dN8OyxvJ', 'tBaEUq'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/albums', {ids: ['%Fik5[2qVA%8J&CZ!#', 'Jm7c7z2D6U5T10'], trackMedia: '95Ee2sk@('}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['IcO%i@EK]^', 'lMgjlbZlPT7'], trackMedia: 7391673533333506}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['!Fx5j3vL6', 'XxbInfhI*w'], trackMedia: 7172077073203199}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['a(bm6d#cfIW8N7@$yuX', 'Pmx^tc0Vwx5&iX]#8etv'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['7Y83GMtG8W@K)x1', 'zw6TSj9S(4GYm32'], trackTag: 'xKSiS'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['a*q@g', '(JDSF1M3GYJT[RTt'], trackTag: 4549183717507074}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['59KVHZp0', '&zRStEvQQ'], trackTag: -7476519651770369}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['vyGzXraIYc7pj@', '23yDDuA]K0D2U'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['P&WjPfHm2HQT', ']J1GBoC%l@KKJflZNo'], trackRawTag: 'g9zBtVef'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['0M9T7QtpbisL(4*F', '@M#8kdR('], trackRawTag: -5734224191553534}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['Uw44tARwdt1z%l#CL', 'XPT1pOh#a'], trackRawTag: 271800126668799}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['KLvkAQ#M$784OoY[', 'rb&hxl'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/albums', {ids: ['hrJ8N]96PTGdnPr', 'pkH*qp6$wLpQ'], trackState: 'OPMFpO%848w'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['!CaoT)4wT[@7fzQGX)W', ')#E7VLwQlNiIFr['], trackState: 8503765342617602}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['DImJFGHU%L@u', '4qiQDvrf2G6A9lmBbKg'], trackState: 4511842571386879}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/albums', {ids: ['K%xF1', 'UpPXJDlePnUwsj*u&d'], offset: 'bn559ERm'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['iya@8kTwjje$&c&q', 'vFeeTc9YLCpeNP4jrz'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['RG1fvSJn*Ajz2xb', '32CV74t60gVx'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/albums', {ids: ['V6!KPCQN', '$s!Kr)$K5$T'], offset: 15.79}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/albums', {ids: ['O^*m@BwiGIB58@^Xh$C#', 'xnj$33EV'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/albums', {ids: ['re8T&W2Y', ']3PpmxH$2PC7yTEZ'], amount: 'P(mpSvDmA2BhQTn81D'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['kv6Ko!a0ILeb94', '&ljkld&vMq)f)mbaPJW'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['wMb)sZt[v0Jwv!vN', 'UmO%PCYXY^8Ae&l)7%'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/albums', {ids: ['vn%wxrwY31]$0Izb4', '1OEizhZ(pkdeJw'], amount: 54.54}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/albums', {ids: ['t]eHxLtuE[g6#v', '2iCcH[8&'], amount: 0}, 400);
				});
			});
		});
		describe('artist/series', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/series', {ids: [']b]t6Kzw!L', 'WPDrEN4@oe&']}, 401);
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
					await get('artist/series', {ids: ['eaW!0wK[YoX9', '8LDoGyq(WjDYY'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('artist/series', {ids: ['S@UYcnAzPv5', 't1ot69If)8Vl^G5'], seriesAlbums: '*kLYxUo9)]MmW17v'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['@*ZUMP](ee]8', '(ougK5KMO'], seriesAlbums: 4161580732252162}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['jh#FK@*blkxaEa(w$2Y', 'd9Km!r'], seriesAlbums: -6713207729160193}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['S20zHoiwdQgMo)', '^2O)^MSfSbizc698G]N*'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['*nv^e)#PUaWn(GKq3nSq', '%MtuqR'], seriesAlbumIDs: '1)#%f!XmB)z!D'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['&LvNA6]B5axIuq', '2QTlmOFqH4x1kxof'], seriesAlbumIDs: 7162998296674306}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['dx(#kSnpPA', '15KxZImD*5IwujITuCS1'], seriesAlbumIDs: -5212672102498305}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['kvxeB%j86Odc6N%', 'o23CXL'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('artist/series', {ids: ['lbddEi&', '^e5H$WgnQAwIedkgCKcZ'], seriesState: 'yj4A6)'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['LuG0Oy(', 'Kz(YZ)%0t)yp!L[e$'], seriesState: -2444154047037438}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['j%)7y%@^rSYIjf0D', 'rpdic'], seriesState: 780208953098239}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['UWB0*F', '#@j3c]sqDod(X#p'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['3Vjyj', '!IpvgV'], seriesTracks: '%p*()eWzS4mL%gs@sz^'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['jp6KXwS&[&v', 'ECNRMG&('], seriesTracks: 7823452320825346}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['F!UwMO)wD@MVzL', 'V%@ZcfdRVa&'], seriesTracks: -8642350943305729}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['4p8Et', 'pi$efLgXG7WMWFo#J&r1'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['Lb8[fI8@ePgE!', 'hm8fl7KAOTmM'], seriesTrackIDs: '0m1CyFSQRJ(xRt'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['%$4U6]r#9FC53j', '[nKf)5o'], seriesTrackIDs: 5860508989128706}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['Ly60zEzu', 'E4fjNkD'], seriesTrackIDs: 2257781440643071}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['uY(lp$', 'R)@9Mj[#C3*xVI'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('artist/series', {ids: ['%TmvpQp%', '6EpDD2c38QSe'], seriesInfo: 'Bt7k22]B]$N'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['jK6XD8$Ya%UWFWl', 'URQdDSPHwBE]yBXpkuB$'], seriesInfo: -8057000038498302}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['@@e0xcEMp)[15kL', '#RJUvr(SOp1E@Nda'], seriesInfo: 7869784460886015}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['9xLsaaab9Rm&7R#&T4', 'YW50C[mOd'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['CBPoXA8hO(w', 'gG#bnOhOw'], albumTracks: 'yKT7dr^JJmrqu4]'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['iD)BeM9N%AmH*MZHb*', 'P@Pjcv5'], albumTracks: -2627066562347006}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['[s&g&OGU(zkCS*M', 'Vx1U2nD6x]]r#r%'], albumTracks: 2427918181466111}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['(BGhl!TZurTQ]g0&S', 'DH*B@WG4GcmW)'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['H5121d$VX3m8k@7', 'dxiE6hyDfruw2eu[fVde'], albumTrackIDs: '4)XQQO'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['e^MP]7m(Lf[$f', '[%$V&OOWQ#UG@xKh]'], albumTrackIDs: 7004069994430466}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['lMxv00V]ZSWoK)tjmXKW', 'fQ46V'], albumTrackIDs: -2514224437788673}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['6#scRAx4KSEs!', 'oozpCN!'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/series', {ids: ['bo%zKfcP3Ccl)[$Pv@&B', 't@m%4zIP'], albumState: 'bT^8y'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['lBuUOah!tY', 'Zt(sK0m'], albumState: 2026786187640834}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['509UFd]3xA', 'k&DxLaosU)Sn(kaG9n'], albumState: 6253014251732991}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['y9feg!TbH', 'u(fzpfBKN'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/series', {ids: ['fR(vCwFIsGCb1Ik', ']U0SJR@HdM'], albumInfo: 'BT8#PYp'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['nl6m^@iw1#02%#BQ9#n', 'Fj(DgoIPJqa*hqiv'], albumInfo: -7540313807650814}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['C^Us5e57aU]Q1x[Xx0[^', 'T7%hghWKb!8vK(n#'], albumInfo: -1734287376252929}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/series', {ids: ['efV^8&rG', 'REG$k7VsG!d%F'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/series', {ids: ['#W3bb', 'A2bCUiQ3l$bt!Nsky'], trackMedia: 'FE3HLuEN!HB3RoYU'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['3O#UHF8g5c2H', 'rEs!WcU7r#myIutKdee'], trackMedia: -3027948550488062}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['!osAMOpXZ0', '7jBZx^w(D]qnP'], trackMedia: 4876684700418047}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['2%l6VZC', 'h&dYp%TBY)'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/series', {ids: ['d[KWtwNh352zJ', 'a^#z3O4r'], trackTag: 'EFzJ4[2sWS(kfGPE%h'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['6OH2^]', 'c#h*a5'], trackTag: -6036539242971134}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['MMRhs[hCP%3', 'qNP*L)R$RJjn%'], trackTag: -6326363850014721}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['bYLsgGf9Ark!H0', '1ZjfDgwn8uqcY)'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/series', {ids: ['!ow7f46', '8UwoQ3GJd1S'], trackRawTag: 'Fn@eWl8WHzq*$7M99'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['b#ehyHEE5s^$YOQo', 'vlVA$&S[7t'], trackRawTag: -8088723501613054}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: [']aXFoCnxO!YVA', 'Hb*EUtn'], trackRawTag: -2429302213705729}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['[5T@zj#n2]', 'G)%u#B@T'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/series', {ids: ['A&icobw@mLLarlDTdSC', 'uOWV&BOYgI$QcA'], trackState: 'R))x5'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['0iPmb%0', 'cVT$a!MfzUoGvDCbtA'], trackState: 682319056732162}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['dV(Q9', 'mgRQZNx1F@Cg^p3)vJ'], trackState: 7129797054431231}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/series', {ids: ['fDOR0^X', 'tbmXL0^'], offset: '8YcTeP'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/series', {ids: ['D(sWN47Oj3r6Dc@SG[', 'h#Fr)IlYGCpIqX8o5o'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/series', {ids: ['V4N0FnTbGljrBRd', '^QPyCd%0VIi7WO9JtY]p'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/series', {ids: ['9ORoMEVuw4*tpW6M', '1e3uyi^lUjm%'], offset: 65.07}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/series', {ids: ['BdON$@dFfZg%', 'R^A!@ECxE$K8TgT'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/series', {ids: ['4gq7e(a', '[8ocPBO#rsZa6lJ'], amount: 'GT5s4XGuAwYU'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/series', {ids: ['JI%sKoj', 'csMr1sE'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/series', {ids: ['V55&OcD4*1Yg', 'u]V)&1(qrs2n6UB'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/series', {ids: ['55PW22t!CSujC33V#EP#', 'SUD$(e7M'], amount: 9.96}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/series', {ids: ['H]qjv!HqlrM%IaFdztS', 'ynQPYfBJCkdymTfrp0'], amount: 0}, 400);
				});
			});
		});
		describe('artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/info', {id: 'kkQGtsG5sGp9EY@*'}, 401);
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
					await getNotLoggedIn('album/id', {id: 'nxm[#P$^6'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/id', {id: ''}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/id', {id: 'JmysKDUrW$&rqwdT26X', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/id', {id: '7[dprdLl1', albumTracks: 'm^F#wzpS'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/id', {id: 'tuU!L', albumTracks: -2625578695917566}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/id', {id: '(S644ZAPa&', albumTracks: 4008627295748095}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/id', {id: 'qYXMW&(IZiAo', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/id', {id: '0r#BAlZe6bhorj', albumTrackIDs: 'YaEV(rTW@5SjT]mnO'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/id', {id: 'ItZ3k2FV%zZSolo1QPN', albumTrackIDs: -6567360114720766}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/id', {id: 'yGhjowcJFI', albumTrackIDs: -401527919345665}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/id', {id: '2kh2LY$lBFAUZY2&gSa$', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/id', {id: '$q[Hc8UwR$$0)j3qbz2', albumState: '29KyUq%H5k6xN'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/id', {id: '&2xmP%qO@%', albumState: 5512637131522050}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/id', {id: '!#xD&z5k', albumState: -3864558112342017}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/id', {id: 'K%%Z$sYU', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/id', {id: '[KNGOs*ow6I$aCfQ', albumInfo: 'b2@Tx^R)cF1PM8V'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/id', {id: 'GP8KEVSkOUP', albumInfo: 1891049567944706}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/id', {id: '%@Ag##m6$$D*&y', albumInfo: 6772844830654463}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/id', {id: 'Uor]0])9', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/id', {id: '5)7ddL(rvjRaS0#z', trackMedia: ']fLw12L8J1&]tC*5$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/id', {id: 'hr*&4', trackMedia: -667000321867774}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/id', {id: 'eSA2LnLEVb&bI', trackMedia: -412687737552897}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/id', {id: 'uvLfKj&w6sy#GFMa', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/id', {id: 'gAdie', trackTag: 'gvEO8i&Ncw'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/id', {id: '72b)YgT[sei', trackTag: 5359987018694658}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/id', {id: '5z7smhN(fdk4ZI9f1tw$', trackTag: 6154079831064575}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/id', {id: '6[bnGy', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/id', {id: 'j5yhe!JotRQ83Z4^3', trackRawTag: 'yzeaHF&6p'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/id', {id: 'liYM%k2CD', trackRawTag: -1472298011852798}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'nx$pTDcnl6lf0Xr2@GS', trackRawTag: 3577414898679807}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/id', {id: 'xC#nP3jUtG3dkQNsy', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/id', {id: 'j!S9dM^a)l', trackState: '@0phLe2'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/id', {id: 'vwdK&F!5$ntDu5^1', trackState: 8476216562548738}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/id', {id: 'OimhMF89csChS**jj1vw', trackState: -5020985191301121}, 400);
				});
			});
		});
		describe('album/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/ids', {ids: ['MGVgN*UK38oWR', 'KF*c%jpbbClT']}, 401);
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
					await get('album/ids', {ids: ['AYA#n*h', 'Rm@tn'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/ids', {ids: ['JlXX!s1]rUx', 'BJEL^'], albumTracks: 'xKS)KnVq]W^['}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['ixMjJS4SwRKmzmI', 'U(1N$7XkaWfT#'], albumTracks: -4784286754406398}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['&W6g4u[isep5k', 'TuBf0j^&5UQM9p)F4)6'], albumTracks: -4045740884099073}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/ids', {ids: ['2eUmKCJSX[bYSV5', 'MQFgu7L#v'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/ids', {ids: ['ZM#IQI', ']]za6vE0erFGHQ$'], albumTrackIDs: 'Bawc9og#rak)rT'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['wxzf1uN#Yc*ZPp', '0#6pCjIZMU0Z^pn3K4Z4'], albumTrackIDs: -469999282028542}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['Lh$EtXo]DCzwyQ#', 'L2V9eE]C(1!78Q#gL'], albumTrackIDs: 7049386378919935}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/ids', {ids: [')Z9Wy0t8cqN%bHw', 'pJKC1U#p[ltUSK'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/ids', {ids: ['ZXNN3wvOxD3!qTx', 'A[$3k(6vm$dK@Swp3Bdq'], albumState: 'F96&3LiueLn&vG3R#lW'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['Iikyy2A&', '(!#yuK'], albumState: 6343139161800706}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['v1!!!VZkCi', 'EPbi0zAnYV@9*C*NHBX'], albumState: -8353698254159873}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/ids', {ids: ['8N^s2#ZXO40Rl!uIQk4v', 'XgwCcHSqPABmDm8#34'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/ids', {ids: ['nlFXdn', 'FVw0CxN6jND'], albumInfo: 'dl2Ojswiaj2'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['uLn4a4Si[R9eaJs', 'deZ3NTvFG#Ka(Rc'], albumInfo: -1789172335509502}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['*]9B]S', ')fY$s^]MB9h^7^5li'], albumInfo: 7810029021298687}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/ids', {ids: ['p$2b@duXj', 'LPBXq(G*^3sd'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/ids', {ids: ['vfPKjPlsdfv[fa15DYsn', ']fKpWmL'], trackMedia: 'KEjYRL6(9sNJ'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['1Kno6m', 'wuvc9555fD!'], trackMedia: 220214788620290}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['w[q@Tr5', 'McBVChPW'], trackMedia: -6295582884757505}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['@[wW54WwgQ7dszV%', 'tzxWHFB7*t1Aa#nM'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/ids', {ids: ['Ze4oRnyXpnh7LD1432', 'nBDwbu&C'], trackTag: 'W!iUq6vYp9Gx$8fd^ly'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['PeTFm@Bc66W', 'yU@HFQgbWfKPi!0O'], trackTag: 856863553880066}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['%yoXbdS1TrGtWqQa', 'Z4S9e&z79&'], trackTag: -7724542155816961}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['yTld&uuXgV', 'p[7LxxwqEn3TcNI'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/ids', {ids: ['t$tfxD', 'w2rZQceAH)!Z'], trackRawTag: '4%Oeb3GbKuuQevA!4h'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['(J%6guHRGMs)CY)5!s', '7dCnTK$H%'], trackRawTag: -6323799578378238}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['hHguc', ']*fPi$1^$7LbvDg^O'], trackRawTag: 2666800667951103}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['*l(i7', 'uvgzE'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/ids', {ids: ['tiMDxx[RFGGJOk*', 'hy8%vMtNipTfY8nyhI#'], trackState: '!HkB8knP5&cHMg4O'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['maKL%sskuhF', 'mlwj8'], trackState: -6735910112591870}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['z&Wzwn1C', '[!k1Q&M'], trackState: -6179385912590337}, 400);
				});
			});
		});
		describe('album/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/list', {list: 'faved'}, 401);
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
					await get('album/list', {list: 'recent', offset: 'BlE&Clhz0Q4@v'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/list', {list: 'frequent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/list', {list: 'frequent', offset: 76.84}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/list', {list: 'recent', amount: '!hyvkdD$6Vtxx0iUwY('}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/list', {list: 'highest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/list', {list: 'avghighest', amount: 95.42}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/list', {list: 'faved', amount: 0}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/list', {list: 'highest', albumTracks: 'vSh^3VcX)9HocRpuOc'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', albumTracks: -2203821832929278}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/list', {list: 'frequent', albumTracks: -8751306445422593}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/list', {list: 'faved', albumTrackIDs: '4Dm[]s'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', albumTrackIDs: 2192713571106818}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', albumTrackIDs: -3320359533150209}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/list', {list: 'recent', albumState: 'lu!9kY5OZigoayLb73$'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', albumState: -1781259755847678}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', albumState: 1596050611634175}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/list', {list: 'recent', albumInfo: 'UgSePX#FD^U1$FVO'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', albumInfo: 3936586190290946}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/list', {list: 'faved', albumInfo: -7007874832138241}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/list', {list: 'faved', trackMedia: '0rFbZ$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', trackMedia: -2324960747978750}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', trackMedia: 1489825110687743}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/list', {list: 'highest', trackTag: 'PxW9RMc'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', trackTag: 8157285486428162}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'frequent', trackTag: 193641716908031}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/list', {list: 'frequent', trackRawTag: 'cb4&3kT0^u&9J$jEJ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'avghighest', trackRawTag: -2997566715199486}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'faved', trackRawTag: 5479959367778303}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', trackState: 'c[5k@VP!Yh2GHm(*('}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', trackState: 8703382684434434}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', trackState: 7789530715258879}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('album/list', {list: 'frequent', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', rootIDs: [null, '']}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', artistID: ''}, 400);
				});
				it('"trackID" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', trackID: ''}, 400);
				});
				it('"mbReleaseID" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', mbReleaseID: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', mbArtistID: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('album/list', {list: 'random', genre: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('album/list', {list: 'random', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('album/list', {list: 'avghighest', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('album/list', {list: 'highest', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('album/list', {list: 'recent', newerThan: 'xI&uLKciH0A2cEpwd'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/list', {list: 'highest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/list', {list: 'random', newerThan: 35.35}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'avghighest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/list', {list: 'highest', fromYear: 's7DhzL)hcFXRQwv&U3V'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/list', {list: 'highest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/list', {list: 'faved', fromYear: 67.39}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'highest', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/list', {list: 'highest', toYear: 'avzvDxh@HgL'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/list', {list: 'random', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/list', {list: 'avghighest', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/list', {list: 'frequent', toYear: 55.92}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'highest', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('album/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('album/list', {list: 'avghighest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('album/list', {list: 'frequent', sortDescending: '*IMXhx$BBUadJ'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', sortDescending: 2721580958351362}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', sortDescending: 8750364857729023}, 400);
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
					await get('album/search', {offset: '&mBk1TUHMdbYSAG9&'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/search', {offset: 19.14}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/search', {amount: '*rBh^w)Cpdbo7JA@]3ia'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/search', {amount: 33.08}, 400);
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
					await get('album/search', {newerThan: 'lQ%ZRmd'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/search', {newerThan: 98.79}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/search', {fromYear: 'dL^Jm7Ek4iizo]W'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/search', {fromYear: 36.11}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/search', {toYear: '$CDnFh^Dc'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/search', {toYear: 99.12}, 400);
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
					await get('album/search', {sortDescending: 'QpK32bM8sAmMRGg'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/search', {sortDescending: 4793406534451202}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/search', {sortDescending: 2352627719340031}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/search', {albumTracks: 'cav7LkCO&#LiBX'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/search', {albumTracks: 7685980874080258}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/search', {albumTracks: 8824621478445055}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/search', {albumTrackIDs: 'c2aaUPMTpmKZ3'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/search', {albumTrackIDs: -4475279502213118}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/search', {albumTrackIDs: 4439209687384063}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/search', {albumState: 'tHl0M4d^KY%hSBi8SH^'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/search', {albumState: -6362903506583550}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/search', {albumState: 7566321084530687}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/search', {albumInfo: '4%Ar$mA@i77gP0j'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/search', {albumInfo: 1347190169534466}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/search', {albumInfo: 7316052912373759}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/search', {trackMedia: 'yLjdPO'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/search', {trackMedia: 8936732972023810}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/search', {trackMedia: 2789302748577791}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/search', {trackTag: 'RawmjljtXxzFRqa'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/search', {trackTag: -3974911177523198}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/search', {trackTag: -5907775481708545}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/search', {trackRawTag: '3j@TPOIfdW%Z5&DG$iNP'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/search', {trackRawTag: 8871657137504258}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/search', {trackRawTag: 2291117974355967}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/search', {trackState: '9FmT7nTeO&a#[wQ'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/search', {trackState: -7238503704297470}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/search', {trackState: 6744601608060927}, 400);
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
					await get('album/index', {newerThan: 'cnOUJK5'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/index', {newerThan: 9.93}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/index', {fromYear: 'VsPQbYE6RZi)63'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/index', {fromYear: 4.99}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/index', {toYear: '$9Z$92EFmkJ$cj&vd'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/index', {toYear: 58.61}, 400);
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
					await get('album/index', {sortDescending: 'RdlG9Jz8^Lm6'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/index', {sortDescending: 8835552950353922}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/index', {sortDescending: -8612139782635521}, 400);
				});
			});
		});
		describe('album/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/state', {id: 'AjzvkS%*'}, 401);
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
					await getNotLoggedIn('album/states', {ids: ['#8&FGti7zucTd', 'XeZM0wp']}, 401);
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
					await getNotLoggedIn('album/similar/tracks', {id: 'GdB^2bN7bT9XL79S^2'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: ')xjb7N&cVfM', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'hnOAY', trackMedia: 'Pty$OIlh0V78nKAiw('}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'EP*5i#7*8v', trackMedia: 7965451229331458}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'aWW0U[HO', trackMedia: -6004669654499329}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 't0m9SD*3P(Hf#0W^I', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: '7UU5BC^75hNF)', trackTag: 'W@$CE'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'E]ay!', trackTag: -6857184558186494}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'Nm4@e*FukRxrEQcxbF', trackTag: -5407179951570945}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'nm%jh1jFHXRZ1qMHgU)', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: '4TOiffAFcbmTATih', trackRawTag: 'FOTVTXy'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'HOH*yRsE%]MM', trackRawTag: 3583053242826754}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: '2SnFt@f', trackRawTag: 4289654224322559}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '6xk$4Taxv', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'B@^w@gR[9Vi*hNQlrIMx', trackState: 'fq]HUpcs'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'R*&lqMg3', trackState: -4649659645558782}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: '0ZRR0zRCg8@u', trackState: -2939852882444289}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/similar/tracks', {id: '%^L9^S8TheOaX', offset: 'h^lLQrU'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'Lh(xO', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: '5kSw)Axl53IVriq68', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'a4!N6Gcv', offset: 47.65}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/similar/tracks', {id: 'RGvg&', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'nRNUaUlypj*B@Q()', amount: '*4LFdNB'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '^OF2nrBEL', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: '*tR5Y![Yq1hUy[', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'qR9R1qctSQcs', amount: 74.92}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/similar/tracks', {id: '5fV0c%fFg8wN[l0sgnQ', amount: 0}, 400);
				});
			});
		});
		describe('album/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/tracks', {ids: ['55%3YP3Abw$o2KYPwX', 'UI1UszBNLGLGrf']}, 401);
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
					await get('album/tracks', {ids: ['zhJSQ$k', 'U3df3O0DKJI'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/tracks', {ids: ['TYYVDpm', 'hX$#v[d]RT^u0qI)aH!'], trackMedia: '7oqhBJ9RTu4g@AUyQ'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: [']3pVF', 'Y)BKavo5&yso'], trackMedia: -3188686585855998}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['QPT8%(DYc!i9nY', 's&u^5j)uf'], trackMedia: 5657086893490175}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['Y^31cQBHyoRQlS', 'EwyVOnBGTvf'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['o^$USgV6b5$3', 'jvIdl5uxlS3'], trackTag: ')qs6MkuMYyT8y7flo'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['*RQ[4', 'U*IaM0X&mQ'], trackTag: -4444579222781950}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['d&hk4V', 'N(xDE&y'], trackTag: -5825046375301121}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['SRJu8', '^m*WI4FWgJJID'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['*VLOM2@2NZpl[tY', 'q$L[fhgODec()E5zni*M'], trackRawTag: 'akobcvmJ94QXqxhW'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['$yzPegQfNM^)JeXbBfAw', 'cxIm[ja)@qYwTK0!TmB7'], trackRawTag: 5846574676574210}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['@%ddd&%u#e0E(1GP', 'Vj!Opo6V8'], trackRawTag: 1276257752842239}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['pKfJXb!ZAQ267ODM%', '2Y]TvshW#CY[ccg'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/tracks', {ids: ['wScNWSg4QB', '9lUKZ*F4%VE#P@jm*'], trackState: '3AyyCmEc6PR@jMh0'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['w@$g^fOtnNy6g9KrY[U7', '3bIkolKVlRaM!r'], trackState: 1309643666096130}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['@[@28', '3OJxCaM4!Y'], trackState: -1240042752180225}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/tracks', {ids: ['Z2@&YT$nje88mq*]8gs', 'LKpJoYXO5TeXsv4'], offset: 'Ef((q@xXjZHQPS'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['12g$SutDNUnsm[ks', '9y*Aw%967m3'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['OPEA[2N0a&s9', '6Nfo79Up'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/tracks', {ids: ['I%Q[Jx[C', 'CEXIhRMziKAGzi'], offset: 26.71}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/tracks', {ids: ['Aw754cB', ']%z3G9DSUz]iLoGz'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/tracks', {ids: ['[3@FhT^IF&xMpT', '9PdczFBGN'], amount: 'yyhk59hLFpZf1C86]m('}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['6mPYlP73*cAifhZjnSd', ')(&VoQx3pKW$%'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['S&erFQR8Eu&0R', 'qc4h4kO'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/tracks', {ids: ['gRgfrl', '6Oi&4iEw4Yv'], amount: 22.37}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/tracks', {ids: ['BhcmvthTAZLTx7ER', 'uF59@eATIU0%#t'], amount: 0}, 400);
				});
			});
		});
		describe('album/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/info', {id: 'D2bev)dvP61M3uwQqK9w'}, 401);
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
					await getNotLoggedIn('series/id', {id: 'gW]SbDwX)EuefVu'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('series/id', {id: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/id', {id: '7lL10zKI*I80K*', rootID: ''}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/id', {id: 'C7Ab]%[ih!C', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/id', {id: '0aqJzYt9THZ[Qy)', seriesAlbums: 'hXSfG'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/id', {id: 'HVr!da7', seriesAlbums: 5337413119377410}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/id', {id: 'CiP3y*1eClj1', seriesAlbums: 2989266669928447}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'f2#WFJ4rohP', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/id', {id: 'waOru]Q7', seriesAlbumIDs: 'N5yuG$'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'qq$iOqk[mi%mZDB', seriesAlbumIDs: 5274081851080706}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'dNNo1)7', seriesAlbumIDs: -6360404129218561}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/id', {id: 'IvH7nmXWzuopYe', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/id', {id: 'mO*c8Nnc', seriesState: 'W9E6tWfdJP)!5g)S3t'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/id', {id: '!USTK%', seriesState: 6700064072269826}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'N9zG6RpP0bWvfo', seriesState: -2619986124210177}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/id', {id: 'Lsvbc(1o*E[rY2Z5G', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/id', {id: 'mvJGj', seriesTracks: 'jvMmbrvx'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: 'F#zl*nJdyHz', seriesTracks: 6045928544796674}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: 'hc6m[', seriesTracks: -6896003156279297}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'jQH%YtZ0i9C(AKp%N4', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/id', {id: '6g7P]fCVr', seriesTrackIDs: '&gNfFOO6MW5rnD5r'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'etkCgjag', seriesTrackIDs: -8529916953886718}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'gJn*mg3RWyZC^yWsCt', seriesTrackIDs: -3178046966202369}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/id', {id: 'KTW5N$qSOCvhIQ1p49', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/id', {id: 'fzqzr3je00', seriesInfo: 'COW$F(B4Q#s'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: '&Wv5TO2HR', seriesInfo: -3674570443718654}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: 'R5WjjAax5x0', seriesInfo: 6053486688993279}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/id', {id: '1]FcUyn86srp', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/id', {id: 'KvnKz!sHKMoDnpir', albumTracks: 'Hh4TH][@II^!1cCwy58'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: '4)94hquOgY0ljh&]m(', albumTracks: -5326101651914750}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: 'w0scp90VTQFII1DlJ)$2', albumTracks: -1433296332390401}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'IziJGoos@XDdxien3', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/id', {id: 'h!e4pLOpn6qpS3Ol', albumTrackIDs: 'RkPNFZGlHtyJ['}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'Odb4NA', albumTrackIDs: 5589920970178562}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'AqOlv*G#]x#', albumTrackIDs: 5186693099421695}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/id', {id: 'c)%!ekDWMk3A4dcf#u[', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/id', {id: 's[IDCn$jX@y%', albumState: 'z@nh0q#Nw7[(UE%'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/id', {id: 'YuxrEl@FWc9', albumState: -5809283581083646}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'Nn6M5tPS4', albumState: 3892853604351999}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/id', {id: 'JqSWG*k)VZhC1l08gmOd', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/id', {id: 'Qf#bR)[Dn#ECo', albumInfo: '5Pw)Hr5i!TthHhSs'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: '@[N13AAcw4aWCR', albumInfo: -5659875967238142}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: '!3Lqeisc[2W2', albumInfo: 5078129693425663}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/id', {id: 'uk$g9FwxfLVK3)L3N1w*', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/id', {id: 'e0vdq*fjn%%u#BV3#L5*', trackMedia: 'wY%XFtZIW02B'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/id', {id: '%d@mU[4t&kB$ir$', trackMedia: -3111102443421694}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/id', {id: 'u@eYHBCx)sf4BQ', trackMedia: 6868046555643903}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/id', {id: 'YT$@3^Yg9aMJSg$sy', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/id', {id: 'K^^^^4HsYk$', trackTag: 'QM%lUN!rJa6&iLJ'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/id', {id: 'n3Ivc0^!', trackTag: 7539379245416450}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'tel1e!tY', trackTag: -4038063953018881}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/id', {id: 'cgGz@mEW*!ew', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/id', {id: 'UQ30%J]Rajg!PepVi%', trackRawTag: 'NwzvfSj#j^[ruAlZ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/id', {id: 'tl6vuqw(^EgWwp[a', trackRawTag: 3795369582395394}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'B$%14sFnch)qs%62Y', trackRawTag: 8446257060118527}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/id', {id: 'pM0onq', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/id', {id: 'd8JL(Wk&kcK(!tbP*%z', trackState: '5kWziKhnk)P2'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/id', {id: 'g1RJ]', trackState: -3417127092486142}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'F1Cg4cLKwrZ2@TmDJ)KN', trackState: -1169128454881281}, 400);
				});
			});
		});
		describe('series/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/ids', {ids: ['K7K6kIirI3X[A8@z$XV', 'ZLGgR!8v']}, 401);
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
					await get('series/ids', {ids: ['Tr4L4[XX$27', '7w3JFEMy6dPL4'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/ids', {ids: ['ACtPh0wDrL5W#S$ctct', '001n(T4#x'], seriesAlbums: 'KQs6kF@gYrWD'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['I]2Osg3UgiYpsm', '$frt]d)42d4T'], seriesAlbums: 4731450758791170}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['x6]zEW68', 'jfhu7P28mAAYGm]@'], seriesAlbums: -4208520664711169}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['UQ*WGTH', 'Q6]sd95'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['yBOCf)IW^A!D4jb!6JSN', 's^(OaNFG^8ejfIZR'], seriesAlbumIDs: 'UnFAS]'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['i#3*OryBb(^r*9FHD', '^DyeZRw'], seriesAlbumIDs: -7202794377314302}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['gbI20@G&A5p38vm', 'gO^Gsl$j6SXpdt0no@A'], seriesAlbumIDs: 5366746051510271}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['wkEr(RX@Y', '7zwpf^oVcL6@xVMFu'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/ids', {ids: ['z9xR[', '&w0((SxUd@uwhSt8$lmq'], seriesState: 'v6@Flf!lZcAxixr'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['73l3]Kdad', '9Vuf3Jg64O'], seriesState: -300169933357054}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['aQ&C(z#5rr$x', 'ML$KJ4NZL$k'], seriesState: 5049586469044223}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['AMb%tdGk@i', 'Rc^NBfr0d)9t7Vpj*G*'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['baf#T76Ts*OZMbscrx3', '53]jyDbY'], seriesTracks: '$&M9DaA^W*y'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['j5X^$O[W^y[fk', 'Y*sDo4BLQqw'], seriesTracks: 8032337518395394}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['Cj&Alrz9rB10', 'fpDR#*'], seriesTracks: 18778482016255}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['((nR(mV#[DZv7B', 'KIi8([@40'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: [')tFgn', 'G2L!Y'], seriesTrackIDs: 'jaBg3[xt'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['^s1mk6$79HCXsYn*', 'ykGf0G9b@'], seriesTrackIDs: 963890728927234}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['tD]Aj6[bwc', '1PYQ@hPrWFx3ZlbOH'], seriesTrackIDs: -1389099193729025}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['9ms47YtRb^7$0j', '8]1@9UHef!Q*^Zq['], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/ids', {ids: ['rNDi7M!e3Zb', 'z[Fs6i]xYsgacceX01'], seriesInfo: 'zw3iezU'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['Fntr4R6hr', '2rslZoGvq#qAn)('], seriesInfo: 4165354532110338}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['QUToc', 'k4%0@0TX[NoW(a6Uy'], seriesInfo: 5611105745371135}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['(zb%4JNa$3BMg', 'l35RmSq#'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['*E6eOR4', '#]BKZBkh76w2'], albumTracks: 'z*4VrXM'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['58IX]#rErEyDMLuG', 'GSvAQy2dTiwX'], albumTracks: -5720757384511486}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['UjwocYhUIov[^4', 'Lbus6bhAdD4[#7s%lVbm'], albumTracks: 4432955841708031}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['0SCBRoHXbkcm2iXS[', 'joA5RP$v@f2I48MdSAN'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['WM*noa', 'Sc(nf5MeEAh'], albumTrackIDs: 'd9EeP%Y$lV^n^#Kip]'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['DD4YzR)%qd', 'l1IVwkaIIuomAOkI'], albumTrackIDs: -4077452888375294}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['tJMm&G08&5@DN', 'E*[jDPEuMIYN'], albumTrackIDs: -5363606149398529}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['Cp0pbO#@3suj0OV', 'Fa#1xTcpdpQZG'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/ids', {ids: ['$qG3fgZC]Fsd', 'D4@]WH3QsgY'], albumState: 'Dfhp0$fmnzsc8PI'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['$5hs*a[#x7I)ly', 'p@B73mnTwdmCRQBPR'], albumState: -39811159162878}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['dMifChwp7N', '8U%4qI3XwtSMa%sYv'], albumState: -6575699729055745}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['o^zfQp9hvn2Y', 'BHKj&^CA#aDZ2clk*0'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/ids', {ids: ['M^5)Pyh)Gq4Mkin*Qu3H', ']&btIAPoB12L@WIZq'], albumInfo: 'uQEf^M^dqY%[rJ^h[XV'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['#ieO770AJP', 'TlqhD9DGNVTh'], albumInfo: -9949606313982}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['G]1rD', '7Eu(y5QMPaTwiQf]OH8'], albumInfo: -341036471681025}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/ids', {ids: ['(&J)k7k6aKBhLhht', 'Xe%R6OP)K$prVUJ5vAV'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/ids', {ids: ['v1OW4HLtP5ohVsFd2cb', 'lTI9K4Mg!alqcr*G]n3'], trackMedia: 'IV^K2@0zJ7(0j5'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['UW44H)&$w^L$b', 'Alm1BM8yWU11[BW^'], trackMedia: 8961766339903490}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['q92ed7NI%%W(', 'W^4Y1LlzKq*Cy2pP'], trackMedia: -8739464960540673}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['a*a$RQL*(h]Y9n0N', 'm1!WBmg'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/ids', {ids: ['2py3X%ci$', 'Pu5&*C^'], trackTag: 'MWeSjeLo'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['M^q30]&]xEOLDNEU3u', 'F!]f1&P#EY5C1h$'], trackTag: -5044282360594430}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['4q6[I', 'fm#(KP$e*&tumU'], trackTag: 638074451132415}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['SLPf#uw', 'G[Rhbvpj0tm1R@g4Sq'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/ids', {ids: ['LmXW%', 'R!yydkwsJ2h'], trackRawTag: 'MWviorOMMN5HDFOZP'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['a4RHtIbqjs[NqaVzb7', 'Y%#aQcfi9sRDh6SWM'], trackRawTag: -5495314039439358}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['IJK1B[SVgtXcf#22UU', 'q9Q&X#uXkRNX83Afh@$@'], trackRawTag: 2490240237305855}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['DmiYvrg*]3@cIKeHc', 'uUC5a4pAN3^7MLR8[WnE'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/ids', {ids: ['Y3W5cN87pd)gU8AL5Z', '*MAQZ4]Yu'], trackState: '0Vq2xiO'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['umjYTok', 'iSIqL^0n)q8V^FP1D9'], trackState: 3705556577550338}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['oLJ(EdFWRz', 'xzGSosILOUH8Yx7o'], trackState: -1326870289186817}, 400);
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
					await get('series/search', {offset: 'TsJW%#2w3*0t'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/search', {offset: 25.45}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/search', {amount: 'tG6jL0iEVE3'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/search', {amount: 34.67}, 400);
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
					await get('series/search', {newerThan: '4TC#!J46%7mJhl6&R'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/search', {newerThan: 24.73}, 400);
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
					await get('series/search', {sortDescending: '3]Cb(g1S$%['}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/search', {sortDescending: -915616504479742}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/search', {sortDescending: -3549341608312833}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/search', {seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/search', {seriesAlbums: 'Ikap&^mBpd0ZI%Cx8'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbums: 2909558146072578}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbums: -2498351392096257}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/search', {seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/search', {seriesAlbumIDs: 'PzMl#%Yl'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbumIDs: 2101645584367618}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbumIDs: 2889770925555711}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/search', {seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/search', {seriesState: 'lO7qb&*bh[l5Cxb6Ed0'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/search', {seriesState: 2840538218758146}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/search', {seriesState: 2406875949694975}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/search', {seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/search', {seriesTracks: 'zaz3[Cal0Z[rcIJV7'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/search', {seriesTracks: 6651854490435586}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/search', {seriesTracks: 2483178757423103}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/search', {seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/search', {seriesTrackIDs: 'pjM^tRMG'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesTrackIDs: -1277527788093438}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesTrackIDs: -4946826536943617}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/search', {seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/search', {seriesInfo: 'wG62jRL1DzT5XU9'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/search', {seriesInfo: -4193671989690366}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/search', {seriesInfo: -6121072898342913}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/search', {albumTracks: 'n])2X'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/search', {albumTracks: -2304136045395966}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/search', {albumTracks: -629788381282305}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/search', {albumTrackIDs: 'Ow69]YIV6LzgioQ'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {albumTrackIDs: -2172168255307774}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {albumTrackIDs: -8220245919531009}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/search', {albumState: '7VYpFJGfs)DV#[Ft26Y'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/search', {albumState: -625713384259582}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/search', {albumState: -5961441794326529}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/search', {albumInfo: 'fGCs3QXc)yYB$ZM'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/search', {albumInfo: -5931841399816190}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/search', {albumInfo: 1160032997605375}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/search', {trackMedia: ')s7Nj4fKerG*bHJ'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/search', {trackMedia: -2070406429147134}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/search', {trackMedia: -4121158618185729}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/search', {trackTag: '@u5$lpVM*UpE[9vi]B'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/search', {trackTag: 1340683780620290}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/search', {trackTag: 7310068156465151}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/search', {trackRawTag: 'BKnfukI[^3O%8O[sqW'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/search', {trackRawTag: -4786820734779390}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/search', {trackRawTag: -5743159594188801}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/search', {trackState: 'mZ)#&gxa'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/search', {trackState: -7951493424480254}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/search', {trackState: -5710798437482497}, 400);
				});
			});
		});
		describe('series/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/state', {id: 'tT$[zTQ'}, 401);
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
					await getNotLoggedIn('series/states', {ids: ['9!thA]b', ')vq20%od']}, 401);
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
					await getNotLoggedIn('series/list', {list: 'recent'}, 401);
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
					await get('series/list', {list: 'highest', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', rootID: ''}, 400);
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
					await get('series/list', {list: 'avghighest', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('series/list', {list: 'faved', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('series/list', {list: 'frequent', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('series/list', {list: 'highest', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('series/list', {list: 'faved', newerThan: '2CHd#I1iZH#'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/list', {list: 'random', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/list', {list: 'highest', newerThan: 33.01}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'avghighest', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('series/list', {list: 'recent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('series/list', {list: 'recent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('series/list', {list: 'highest', sortDescending: 'F$gPq1Nh!EjrA5K*up#'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', sortDescending: -6236883910654}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', sortDescending: 8461178095271935}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/list', {list: 'recent', seriesAlbums: 'fNe@4'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', seriesAlbums: -8255784286683134}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', seriesAlbums: -3883431641481217}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/list', {list: 'recent', seriesAlbumIDs: '5rC0zfvek'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', seriesAlbumIDs: -9006504300511230}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', seriesAlbumIDs: -3143442565693441}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/list', {list: 'faved', seriesState: 'emCqdk8xs]'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', seriesState: -2507025065967614}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', seriesState: 5278368685621247}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/list', {list: 'highest', seriesTracks: 'f)w7VU4!OaMjWol#tGf1'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', seriesTracks: -148944147447806}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', seriesTracks: -2584900385374209}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'frequent', seriesTrackIDs: 'YAp1hzBaaKcpbk55#'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', seriesTrackIDs: -6771411888635902}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'random', seriesTrackIDs: -4647470940291073}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/list', {list: 'faved', seriesInfo: 'DCEc([nR$4ZVE'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', seriesInfo: -2222682611384318}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'avghighest', seriesInfo: 8350281729310719}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', albumTracks: 'x%Z%av@3t[bzWWS%TVW*'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', albumTracks: 6242182788808706}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'random', albumTracks: 1654829797605375}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'random', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'recent', albumTrackIDs: 'tPd0%jecAx&P('}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', albumTrackIDs: -2130999953588222}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', albumTrackIDs: -1448873000173569}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', albumState: '@OO8]ESk8)NqK$z#!'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', albumState: 4863024133308418}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', albumState: 4020152702074879}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'random', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/list', {list: 'frequent', albumInfo: 'Z!]Wz0jv*HwBN5Y7'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', albumInfo: -4007633686102014}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', albumInfo: -1191797501984769}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/list', {list: 'faved', trackMedia: 'PVk7dJi4ry'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', trackMedia: -5024968496644094}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', trackMedia: 7867853441073151}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/list', {list: 'frequent', trackTag: '4Y[2@#Ds'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', trackTag: -2868413101768702}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'avghighest', trackTag: -932083107102721}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', trackRawTag: '8Vp7Tf!&VFkEghegp'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', trackRawTag: 7816175656370178}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', trackRawTag: 6839383575494655}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', trackState: '^A^(31uqva4Y!zq$elN'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', trackState: 1826804285308930}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', trackState: -6742439263993857}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/list', {list: 'recent', offset: 'IPy@y0%U0rs$7e'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/list', {list: 'recent', offset: 13.95}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', amount: 'rsF[sRQ'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/list', {list: 'faved', amount: 55.83}, 400);
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
					await get('series/index', {newerThan: 'h1#aiemE*'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/index', {newerThan: 23.79}, 400);
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
					await get('series/index', {sortDescending: ']Z7vRi5sL'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/index', {sortDescending: 6543285363408898}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/index', {sortDescending: -8735715546365953}, 400);
				});
			});
		});
		describe('series/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/tracks', {ids: ['GCvgs*w', 'tEGWA#*3Iph!EKan#DHg']}, 401);
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
					await get('series/tracks', {ids: ['Uzg1HoX&bgnV', '&nKUtujk'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/tracks', {ids: ['U*Hw!mqAwrQBEHv9Mbr', '3ktSZ%'], trackMedia: 'Vab4!powr5kPBk5rjrv'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['k4FK(YSR#N', 'V2ih^p!$Wn'], trackMedia: 142432968638466}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['%He&8N^JV%W1!#Y^', '0PkDqjB6@MerFQ'], trackMedia: 8126625765916671}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['exoc^gE', 'L2MkM'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/tracks', {ids: ['00qt!GqFtcZ]SfW(&y8M', '!$sd@qIODV#ULs#$VhL'], trackTag: 'jCanV2h&pjy'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['UX!XwI$y', 's1WD3Rz0pS9m*hYTd(V'], trackTag: 4605859015426050}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['miGo[tO]&', 'MY$06VKU^(EnCOrEVkA'], trackTag: -5008490787504129}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['uW*0k@fWcj$', 'q@wvJR(XvYTfRQ'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/tracks', {ids: ['GGpLpwr8sO110ofh', '2EI[$&T%S&oae%J'], trackRawTag: 'UR&LKfUAvj'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['jiLsA', 'HBPBn^u4&'], trackRawTag: 7698233757270018}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['NJ8#IQXVsJ2%DR7', 'XbGRf3&CBY'], trackRawTag: -5322882712338433}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['Ln5$Q', 'nqewRN!7(#7**NKT19'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/tracks', {ids: ['R6wedy', 'bdwylov'], trackState: 'R3PduTi3nOcEmidTH'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['SaJF3C2HZrTy3RFI1h5', 'yZiic&)eB6se)'], trackState: -180642662842366}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: [')L%4SDI', 'BEsb5gbr&0#$'], trackState: -1150533658214401}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/tracks', {ids: ['[(FTofNfb[35A', 'uE2Mi'], offset: 'GA$N&HcNM^MklI'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['2&[nmYyd', 'lo]0Q'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['0pj0Oy#', 'WNH*]MnxWR![]4'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/tracks', {ids: ['tA7jr1b*A', 'HoRjRc0X]'], offset: 83.35}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/tracks', {ids: ['5]ybk(BaWf0]P43OsR', 'k[uNgi8LeUao7Qqgjo'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/tracks', {ids: ['Tc[I2BCre*PyF99ot', '*bnIGPZzvN23#W3'], amount: 'h6Ywd'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['GFI^svSV', 'PtjDbEp7I2%'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['M(F&H[DUQ[dkfKD', 'm[3a!'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/tracks', {ids: ['$utcM)^*c1x(VI^', 'QiJ[s'], amount: 80.83}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/tracks', {ids: ['z)@)[g', 'nDh&xQrTscSfnevvpyU'], amount: 0}, 400);
				});
			});
		});
		describe('series/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/albums', {ids: ['ldn55[3fSy', '1#YoLa929G6bZ']}, 401);
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
					await get('series/albums', {ids: ['D6J9M9Uv@^)v', '$5%gsSziuZ&pMTuS'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/albums', {ids: ['U*1[vg3', 'zEyiaojcTMm'], seriesAlbums: '073QV@01VvOGQKOQ'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['N20hi6QAcJ0vajQaUb', 'LlONWp1EDRI)ZulaKp$'], seriesAlbums: 4658478354268162}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['uN[edGNs)', '*!gnWvGB'], seriesAlbums: -2449087337070593}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['!RlX8f#J9GbH9F', 'h4V((8R'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['W6gPzVBr#o5%Y', 'C52W#fZa3aochF1JwMQ'], seriesAlbumIDs: 'H#UhVFf[yATFpP'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['oa9lfcU]FEn', 'mfsr7GZ*#tLgDX(FmTZ'], seriesAlbumIDs: -1356366253916158}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['Ha7ud6V%$%', 'xL!YR#z6'], seriesAlbumIDs: 6863739483586559}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['KIWBZvf84eck4ntw', 'CqtNGIB'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/albums', {ids: ['VLip&QzvFFN', '#rRWWXyP&'], seriesState: 'Cv6MgILm'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['3l(4f%$', 'lSdTaga'], seriesState: -3338635998920702}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['%R%CRk77oDH', 'p)y&SQHIgPh'], seriesState: -6988750512979969}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['LVX9%(ZU]W^72UxEbDKZ', '7CkHP'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/albums', {ids: [']aCigTEoM', 'V3T2Rh8#RBQLG'], seriesTracks: 'n7aaWJl!7JIjn[KgSs'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['VIi8xy9$EbUE&&d', 'yN[BI3B]OO6EKd4dCH'], seriesTracks: -8130995958054910}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['BF[(a6Q6DlCsmax', 'V!0(LmIqQi#E^3gHbV^'], seriesTracks: -3810269629251585}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['2@aHAH2q[2)$[%', 'yfqVxWinog6hj$B8Y16'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['z^rqF', 'PG$z))('], seriesTrackIDs: 'P9MV6Uch%ac9jIYTSI'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['^EKxfOrWaosIi%C', '#JvRb'], seriesTrackIDs: 8119602370314242}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['3NT*G!Z]#S#kzquZYjH', '#5@H2]C6a814JgxPWXH'], seriesTrackIDs: -7246717577592833}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['41wO3rgdSnQi*bd4LhN', 'W]8tfX('], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/albums', {ids: ['Bd9%$g54dzC$25Q^cl', 'qFmE9eGIXu&IQLvbB&ST'], seriesInfo: ']P5$^DaZYP8ytDwx5qH)'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['$ihR^Hpz8DLIj@)4b', '!kO(uGNgDrBY'], seriesInfo: -6084877527023614}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['VDQ&Y', '8[WWZeu2$5x2y)FMB4p'], seriesInfo: -5612767453118465}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['3cIGgHBtk8P', 'OJk[)EJS@xPo'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/albums', {ids: ['7aGd8qvgIi*1rBJ3l^A', ']9J^Rsf2)KrpQKM&'], albumTracks: '0crTQH^YpAc3X5kOl'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['XA6Eg%HCF9ppT5lmA', 'dZjkLARiyNW@Bq'], albumTracks: 7937346926280706}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['F1iXmU6w6oonrm', 'S1802C'], albumTracks: -8877728065388545}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['u4S2Rk8y06n$', '3]KhQZc)#A#V'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: [']2UveV)Fth&y', 'PYSGcQqYQN'], albumTrackIDs: 'Byh)ZBWjd4iHhRiaICDB'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['EbJ0cq', 'tZMHwG%7Lo(f!ZG9Kzf'], albumTrackIDs: -7370933840904190}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['vaTrjQ7DQygoFnwwlzE', 'B4lQ30LiI^g'], albumTrackIDs: -1092422180274177}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['Y^)*H(8(e3iLso', 'uLiqwYNbu'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/albums', {ids: ['7APH5eEU[3b7r', 'Um(9XuV)C3fjmS)w[Dg'], albumState: 'bAJ*F7b@Ko*a5CSG'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['y7m#5UAedO%FyJLQ', 'rG6#wl(9O&pK1lIu'], albumState: -7850143512526846}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['0po]E', '(R4IcWNMCxr]Qgh'], albumState: -4312683985764353}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['1Ni8SMMRUfLCzA@m7', ')u@MbzcmQ5mV!LZY*'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/albums', {ids: ['9GPmxQO!NoAc2', 'MieULFs5d9Tk4$%Zn]Ox'], albumInfo: 'Fdi(E'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['0X4z$k@v3t7&wMPto&0]', 'GZCbzEBahdrhca'], albumInfo: -6099947950702590}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['[XVtock7g5a', '@p%]NzqdnDXhgpGHO5'], albumInfo: -1380987309129729}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/albums', {ids: ['rJKYm&3wXjN75Z6', '4SmM7Rmn6'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/albums', {ids: ['5U#Igv!Sm36', 'hDvrbUA!J#'], trackMedia: '9&LsGMV3sEI'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['4j$kv', '$RNMGll9k&^f!Xe2S)'], trackMedia: -7387296064077822}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['b1z&kG3glwXxWhX', '@H^TF$%XS'], trackMedia: -2837434026950657}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['%ujbDMO', 'mUQNZ1COkYFxy3I^K]'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/albums', {ids: ['D8CT!TVf4bAaACBjcS', 'bt$!4BgQ]Guh!Kxs^kC1'], trackTag: 'IJoFxqp91C'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['EpKczCq8StXsnK98', 'S!iQ&2I)vQ9d(R3vftx'], trackTag: -3713144346116094}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['uePrr)EJJZ#H(', 'OrNfN0aTOyzafHou4keR'], trackTag: -5172997572788225}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['oIL40@', 'ZiEW4dxsa&'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/albums', {ids: ['acm#gpDlW1ibdpQ', 'ZK5@MpWYa7IF(ynx%'], trackRawTag: 'iYmXcGuZ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['fi%PPWhOdQ(DXEBTjD97', '^ll^OkYMG'], trackRawTag: 3322383511322626}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['r!u4@5MABim0Q', '3yOBQ2FP'], trackRawTag: 1225901215842303}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['t@*2k', 'O0kILCm7J48S'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/albums', {ids: ['pevJ(lnBWAYqQ5c99', 'my]GVbXwxfTr'], trackState: 'Xmck)C5b#rFv6Pw3N'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['V9HLMS', 'tTHRLq&s1R0(PN3#5Nz'], trackState: 3255346378309634}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['U1Ocwa2SN^', 'XmxGsp!VN'], trackState: -6936773066227713}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/albums', {ids: ['IPWwV^Y0gp!%8ufu', 'XMqs9uaA2*HGjx'], offset: 'j4W6!'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/albums', {ids: ['iG(vTL)', 'fm]aHM4Jd!ru!Rqdf'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/albums', {ids: ['UUM#)AvV!1Qm218(6$K', '#KYoBfBnEZa'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/albums', {ids: ['m!uI%', 'E%P)IEy8i!b'], offset: 36.65}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/albums', {ids: ['Gma([B', '8pljK6(TCc$RNiBqGWgd'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/albums', {ids: ['mO&WjX)!%4pnL', 'A)g4BeX&K'], amount: 'uF][6p!Nc!8B'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/albums', {ids: ['A8)xY', '9F(T#Uny'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/albums', {ids: ['IQWbzsUUi1ex[GsBGWA', 'F$sATIlGNY]7Tp))d$'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/albums', {ids: ['^HYm8)EOZ*eJ', 'p4IQgst'], amount: 72.84}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/albums', {ids: ['SdS*8W*K', 'y9NVGy*)Yqee]'], amount: 0}, 400);
				});
			});
		});
		describe('series/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/info', {id: '0FJgy'}, 401);
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
					await getNotLoggedIn('playlist/id', {id: 'DuhI]eKI15k4Ommu3$'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/id', {id: ''}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/id', {id: 'dLpW(rXW', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/id', {id: 'CbVT5ybU1', playlistTracks: '^&WrkHD[3MuotS]B'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'qCnHIEB8!nn#', playlistTracks: -5989626099531774}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'k%X6v*g', playlistTracks: 8453182216732671}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/id', {id: 'sI@kS[wEbq)QI', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/id', {id: 'EcD!pCCa8H!oba', playlistTrackIDs: 'YhwiGT5'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'OW&AQ[', playlistTrackIDs: 2645176988205058}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'o@aJs', playlistTrackIDs: 388513560264703}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/id', {id: 'Afmr^e', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/id', {id: 'fT4Xsy!H$B7!sFNGFZ4m', playlistState: '*eyJ7t[F'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'opJMbJXl&ra@Zz', playlistState: 8690351585886210}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'a!^GtgLF5lIHvbE', playlistState: -1754281749250049}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/id', {id: 'NXw]6t$9UvWYQ0', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/id', {id: 'H4H9hXpiK5', trackMedia: 'dCh@3N*a*'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'M2$Cn(4p', trackMedia: -1959410448465918}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/id', {id: '2Nz5unHaJ^', trackMedia: 1693505785167871}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/id', {id: '@TvmBv!iOooruP', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/id', {id: 'C!Y@oH1XC!#$&', trackTag: 'jc8xSC5)7V8c'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '5YLcEJXb56!', trackTag: -7314814468620286}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'VLfDFEcQfO!KYlBjIu', trackTag: -1463089505501185}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/id', {id: '1qvl#Qx*', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/id', {id: 'fFGC)m*xfG8D@%jW', trackRawTag: '[zNlS5ANK0d'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'L6jsb!tX', trackRawTag: -8401239465263102}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'l9RQ!0HuJc', trackRawTag: 6931002819608575}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/id', {id: 'FE[fYS[m%LvcEO9Z', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/id', {id: 'RA2Z@WZLIngc9Hw53V', trackState: '^k*yH7%Uj1(bLT'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'i!tlaYMk$70[STVw', trackState: 5906269114204162}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'VBmEnJUBjr9[KD62', trackState: 3850572608307199}, 400);
				});
			});
		});
		describe('playlist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/ids', {ids: ['z0Y)(xp', 'JLzSqP2H^']}, 401);
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
					await get('playlist/ids', {ids: ['S$DTXcu@0GhYc3nu$q2r', '8Qpor1za0iyyfq)'], playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/ids', {ids: ['%Fu%y$b#S^Hpp3', 'TcPRn*wD)q7e!ZQ1oT'], playlistTracks: 'Y^)Td3z@PEefE3s&3vt'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['euVSCw(HE!vfyQ', 'f4*6lpO*wG*YC(N%WI'], playlistTracks: 8238513212358658}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['vWwbj', '@ucyCk[ZaIcIP87'], playlistTracks: 948157122871295}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['xsN$2%0jp5W', 'c6A#32KL#8y'], playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/ids', {ids: ['jao181P4qm)7Vg$*(!L', '8JFfs3U4(2nZPqG#xw'], playlistTrackIDs: '8FuhsAk'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['UCr%3fadqR[', 'k3lQF'], playlistTrackIDs: -8632221883695102}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['1k*[ny7]ECJ', 'f5PhDDdfP&1L1$BRfg'], playlistTrackIDs: 5907501081952255}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['$[36#a2', 'Im&406fv)4B*^'], playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['l2f[rv6c7A]&1$0qV', 'IJLlsGG67miowo'], playlistState: '5eK*LG)eS1@j'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['kuHZ8H^f', '@giD%]lH8##cx6ju'], playlistState: -5018032611000318}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['N0$tzSbk^wxBS', 'yJJqbhpieWS8q'], playlistState: 5784573346578431}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/ids', {ids: [']BBZcpYyW', '1#JP&$S'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/ids', {ids: ['Ngqlrx3Spr', 'opD]P(1dBvA1O'], trackMedia: 'KhWz7m*F2('}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['517EGIIaZyeOS', '[&LXSfCczyefX4@JJD'], trackMedia: -2149163697438718}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['VnNWUqw1$v', 'dp4%YuMKy4U'], trackMedia: -2662532867162113}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['K4ymD@jH$U2QCD&', 'GH2Q6WV]XD0^'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['A)o9]I@G0P0%%D', 'h$Dx0YL98zaYN$rM4'], trackTag: 'd3rKg'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['@GWlqOiN94m^r', 'iR4kQw)G1gHgurN8'], trackTag: -8320224130498558}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['(v6$DHi(ND$4@4$L!k]1', 'QCY7h4iuW![bFj52GW'], trackTag: -3861976761499649}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['Rk[kD7s87eisiZ]', 'fZwrVYV]ZEWGmPKJIa'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['Bx#j@cLqeVigE0dPJk', 'awWF9'], trackRawTag: ')Dw)QUJ1a'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['2ta4c4eUR46n1', '5kKvKFniXVHYVtdDe'], trackRawTag: -8316877877018622}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['iY$Ur58zo5gqV843DH&', 'Ail856#!g5Qe'], trackRawTag: -269642064986113}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: [')r%2@*rPmSV)yZ0]Nv', '5@]IwNQ'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['z[AsByods!$T', 'h6zbO'], trackState: 'SJ6syWuVyeHJkOuWn'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['o@MHczX', 'NGzdEF1^[]'], trackState: -2523567904260094}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['ecumor$y4rSsyfbQ59', 'AKx6tDcDnKt[LsuwY4'], trackState: 4118131748372479}, 400);
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
					await get('playlist/search', {offset: 'GU4ldsVvXz!zBw'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/search', {offset: 5.15}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/search', {amount: 'ib2qL0QOUvT*UyG*f'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/search', {amount: 83.03}, 400);
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
					await get('playlist/search', {isPublic: 'v0&2p**S*'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/search', {isPublic: -5864474208632830}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/search', {isPublic: 6952614671417343}, 400);
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
					await get('playlist/search', {sortDescending: 'oTkDljTq%!Xu$l'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/search', {sortDescending: -4058720103301118}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/search', {sortDescending: 8800222184472575}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/search', {playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/search', {playlistTracks: 'X[@2Hq2'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTracks: -6819816849539070}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTracks: -1058946118844417}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/search', {playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/search', {playlistTrackIDs: '(Q*sW!nnT'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTrackIDs: 5020607225790466}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTrackIDs: 5640467525926911}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/search', {playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/search', {playlistState: 'nw*fJdgFc1E9'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistState: 7963716452614146}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistState: 4868517509726207}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/search', {trackMedia: ']Dtl6'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/search', {trackMedia: 5065008333455362}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/search', {trackMedia: 7509808093593599}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/search', {trackTag: 'Lqc2j@MhFC'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackTag: -2319374618722302}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackTag: 3297370901053439}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/search', {trackRawTag: 'h(W]wpqE]wlzv5!V@d'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackRawTag: 8556341266219010}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackRawTag: 4705144432230399}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/search', {trackState: '7c[5[6%xA[[97wIepw'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/search', {trackState: 1018970375192578}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/search', {trackState: 4763940584161279}, 400);
				});
			});
		});
		describe('playlist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/state', {id: 'zkWez'}, 401);
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
					await getNotLoggedIn('playlist/states', {ids: ['Ttk0o%Bs0', 'mRErx6)%L#T65P']}, 401);
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
					await getNotLoggedIn('playlist/tracks', {ids: ['7A2Rv%w3^B#Z[r', '0$VPA*^BQx95Dd%RlNwr']}, 401);
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
					await get('playlist/tracks', {ids: ['nLYbZ]9lymLJgaPW#[', 'gVqtC7KcEvMRY7ro7CM'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['fbFAQtDOm', 'ksDdIO[t^t9D6!Vp6#'], trackMedia: 'hJm!LwgIbAtK^oru(t'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['(i*HgPP@)Sqk&Kem', 'cBcbHnlEO'], trackMedia: 2930762844209154}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: [']WcKWdOYX6', 'l8WrQ9*8(G)6RjPbcE'], trackMedia: -1047590648938497}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['x2W*pl', 'uBmf8fSl2GBeY'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['^)FX8', '#B1L8(ol5'], trackTag: 'XpYR$IsWr8o1pm%qk'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: [']q3SJb7b', 'kL]H]Ld]X6[u]i'], trackTag: 5721408181108738}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['1g&z7[Juij&]D8', 'BUzvh0$7yKK'], trackTag: -4137022839062529}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['bZ%M3MLq#a!@D6K)', '$@ZD$wK6hnZ'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['Q9R7lplLD47g', 'mcEVxBGRBn'], trackRawTag: '!a7)6)Imh2HCu'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['%bZ7)tHZ#', 'YsHAY6*MhE&rUUN'], trackRawTag: -7636330913726462}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['Q&JmnAN', 'nJ*Ez*jvDa'], trackRawTag: 4957522108612607}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['Yh5@V]e&)!sEyp', 'Vs!c['], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['K#mT$Eir*5(Q#', 'lw!EsGf9d8s%l4'], trackState: 'CQCGA8b#o60n'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['o(lVGRe^]iQeyS', 'M)nw2s'], trackState: -6864662100443134}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['JWxo5VKU6QS$', '7dXT4'], trackState: -3249337727451137}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['V]E!N2sE(]^DQJ)]7', '2Bi&2O'], offset: 'qjL$pZ[&a'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['QHL51at57yTMbJ*Qy1q', '$FLt5U[ZF!OnpQ'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['jg@4R$[Aj', '%Di!96o[@6'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['xSa7X[', '3sxQjGJZ'], offset: 20.72}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/tracks', {ids: ['rsD#Uv', '[^cmRr'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['33nAnGS8DB', 'bJ8)I11'], amount: '57lPxLq%E]uT0r[AD9ql'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['8uoUmCjoUz4GVr@', '46XLGx!0ty'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['*u%$K#LI6[', 'dUvl@iwUO2w5l'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['wukIm', '2$@G&MmOG27Pvjc'], amount: 64.36}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/tracks', {ids: [']I#!ON$28(f', 'W^V8IEION*6ob'], amount: 0}, 400);
				});
			});
		});
		describe('playlist/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/list', {list: 'frequent'}, 401);
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
					await get('playlist/list', {list: 'highest', offset: 'bYggQ0*Y^dK'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/list', {list: 'recent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/list', {list: 'faved', offset: 9.02}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/list', {list: 'random', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', amount: 'asFFIMvyN%$B'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/list', {list: 'random', amount: 80.25}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/list', {list: 'faved', amount: 0}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', playlistTracks: 'XKEqA%9*'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', playlistTracks: 4435768026071042}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', playlistTracks: 6519649034305535}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', playlistTrackIDs: 'q@]uh###QepjRCFq2'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'highest', playlistTrackIDs: 3911506794119170}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'random', playlistTrackIDs: -2018460628418561}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', playlistState: 'GNMp3%pBrhBJ'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'recent', playlistState: 7513193207300098}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'faved', playlistState: -4686766304919553}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackMedia: 'xeqWA'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', trackMedia: 7448650867277826}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', trackMedia: 1100307484377087}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', trackTag: 'l$jlc[n[hde(er@t'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', trackTag: 8772016849027074}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', trackTag: -1649092216225793}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackRawTag: 'D)%)R'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'avghighest', trackRawTag: -6192701053599742}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'faved', trackRawTag: 6819988845363199}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/list', {list: 'random', trackState: '!*2xZkSE'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'recent', trackState: -4918303399084030}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', trackState: 5191815460290559}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', name: ''}, 400);
				});
				it('"isPublic" set to "empty string"', async () => {
					await get('playlist/list', {list: 'faved', isPublic: ''}, 400);
				});
				it('"isPublic" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', isPublic: 'LewVe[w'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'recent', isPublic: -6518874895810558}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', isPublic: -6030468843569153}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('playlist/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('playlist/list', {list: 'faved', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('playlist/list', {list: 'highest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', sortDescending: 'tOqOS&Ye&ieOKOy!$B'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', sortDescending: 623752723300354}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'frequent', sortDescending: -4057607081820161}, 400);
				});
			});
		});
		describe('user/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/id', {id: '(8kH&q#]Hi1!Nl'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/id', {id: '(8kH&q#]Hi1!Nl'}, 401);
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
					await getNotLoggedIn('user/ids', {ids: ['DO](sCTV1#B', 'D^44Y]v']}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/ids', {ids: ['DO](sCTV1#B', 'D^44Y]v']}, 401);
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
					await get('user/search', {offset: 'aQjA3gWP#i]HWURmI6LH'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('user/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('user/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('user/search', {offset: 62.36}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('user/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('user/search', {amount: '(lo44I[n'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('user/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('user/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('user/search', {amount: 32.63}, 400);
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
					await get('user/search', {isAdmin: 'Cls4qZp'}, 400);
				});
				it('"isAdmin" set to "integer > 1"', async () => {
					await get('user/search', {isAdmin: -1649037916766206}, 400);
				});
				it('"isAdmin" set to "integer < 0"', async () => {
					await get('user/search', {isAdmin: -5159663314141185}, 400);
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
					await get('user/search', {sortDescending: 'ji83IVOW3$AYn'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('user/search', {sortDescending: 1779702012313602}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('user/search', {sortDescending: -4092024873549825}, 400);
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
					await get('playqueue/get', {playQueueTracks: 'RQ$EEZ)b)a3biveLN('}, 400);
				});
				it('"playQueueTracks" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTracks: -6319412151844862}, 400);
				});
				it('"playQueueTracks" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTracks: -475368083423233}, 400);
				});
				it('"playQueueTrackIDs" set to "empty string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: ''}, 400);
				});
				it('"playQueueTrackIDs" set to "string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: 'HpUyA@*x^gfb'}, 400);
				});
				it('"playQueueTrackIDs" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: -8544536569577470}, 400);
				});
				it('"playQueueTrackIDs" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: 4860178704891903}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playqueue/get', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playqueue/get', {trackMedia: 'Z5]A*A#K'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackMedia: -1405500964995070}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackMedia: 3859821371588607}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playqueue/get', {trackTag: 'p)bkccyn6aI*yzVU)s1'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackTag: 957108522582018}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackTag: -4709914282819585}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playqueue/get', {trackRawTag: '5rN0MH7'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackRawTag: -5034066520834046}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackRawTag: 1980298694754303}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playqueue/get', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playqueue/get', {trackState: 'L^A&AzW3Yo#F%HWg3M]'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackState: -3236856644763646}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackState: 4622555906310143}, 400);
				});
			});
		});
		describe('bookmark/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/id', {id: 'Fu7]y^qoW7Dk)Nej^#m'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('bookmark/id', {id: ''}, 400);
				});
				it('"bookmarkTrack" set to "empty string"', async () => {
					await get('bookmark/id', {id: '@uK1NGvxD2', bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/id', {id: 'I$RLelGUYxEI6GmUc', bookmarkTrack: 'Ah%!uI!p)%PPT1ID)E%'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: ']cd(E%LU]W)0', bookmarkTrack: -545747367886846}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: '@b$mmZ8QPVHg8kmgpHNB', bookmarkTrack: 1541424587735039}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'ewm8gU%H', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/id', {id: 'mpLYm)xV][]', trackMedia: '2SH#8VylyIHolO0'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '7RZpMAajuu1P(mFKDP#', trackMedia: 8028508668297218}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'i[hU4!L2!b3oyzZ4AT#2', trackMedia: -2234986426007553}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'b46a(FD4F', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/id', {id: '1!nTXcCFwX5hc]AS', trackTag: 'weuibK5[0'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'uREnxEE', trackTag: -8327233919778814}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: ')wL!^#xv', trackTag: -1059110275514369}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'a96nJx5*2%vc^7', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/id', {id: '1ngY$vclEeKpWYc', trackRawTag: '2d4L5(tLUW#'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '8oklVJ9B6mLXMLG$J', trackRawTag: 6294129541644290}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'UUoAZ9AaO9pPMn', trackRawTag: 3767933629104127}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'QkhYm1(A', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/id', {id: 'd67AH5UiVTqP]l', trackState: 'ikZ1)'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'w1YL$VmnsCDc!N^d', trackState: 6621337887965186}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'LF%ig7ocJ7oxcgdhdRu', trackState: 8039146601840639}, 400);
				});
			});
		});
		describe('bookmark/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/ids', {ids: ['n1p[q1u3[SD', 'MgGINkuIzn1']}, 401);
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
					await get('bookmark/ids', {ids: ['R%XMTZrBmq9hM#AzTl', '94$&#'], bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['mCVcdW&', 'fhJnqo9G5$^BKr'], bookmarkTrack: 'yOJEaSu0lOyxoNs'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['6wv72dAagLqnTe$', ']tcHZ*G35yN#q)!sll%o'], bookmarkTrack: 3262344608088066}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['$&nKA9', '%u[0pQR3d&3wG]W9Gn88'], bookmarkTrack: 1590671894904831}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['!HWf]Yg', 'AY6PBfMQbL*$tc'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['XzVjtRSsgdY0(', 'l9*F('], trackMedia: 'Y@dxIW^E(EU44X1xXA]'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['8KTA%SJircrM!Bf%', 'A@c2y5@'], trackMedia: 7691439152562178}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['%q8g*acksjDJRq', 'AAkNL#e*'], trackMedia: -4499160535400449}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['0YWN#JpkCJy]', '&k[AmZpLO'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['iS5wgj(vHBj6o', 'tylQhxhdU^Thi)S'], trackTag: 'yb!#w5JOgsqh$nmh'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['g$R*I', 'WwB]KahIw95W$#a'], trackTag: 1650516064993282}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['E0t29Tq!W#', '80aacXuMhS3'], trackTag: 8828633384747007}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['ERdPU^TuT8', 'E7075bblfZ7'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['c3]96bI(', 'v4CICs326'], trackRawTag: '572UV#IybnOms(o9lBU'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['3f*av[Gdxgl^5', 'I5d@]&a52ep0f75v'], trackRawTag: -91251714031614}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['bChVSTZmdz&pBOJ*!tm', 'q5IH4blCiV6zND%p0z0'], trackRawTag: 6678097747247103}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['k]#a6Sa', '7oU&^gj'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['tc0kGjio', 'k%WgII5h6Z3x0)(Y&'], trackState: 'DQrx9Ubgws1SFSbh'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['gLW^^z', '@v(5AE2StKF'], trackState: 1665939636486146}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['Eh1V!', '8u0qVY$IGKAF1'], trackState: -8517743653421057}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['mTOm*xzcfRZ', 'l5RJ*fJ$N2oueM'], offset: '$UvbOHsph&YN'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['(X(*D9p$L*or4%PVl', '!(KhDTWA@ahJ'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['s@aEJfr8)', '3c%hnG]&MXBBcFY2a7'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['rnHr5PtrQ', 'Ec$U!Mzo05n3ep!S'], offset: 12.37}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/ids', {ids: ['f(cH#BH9R', '!O^iwMlH)^Y8*X'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['GvxcTmS3sf3mneFL8', 'iKz4@'], amount: 'vZ[D!'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['Iph4!srBTn', 'oO[cC)Id8J7I$AaDUL'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['YwKGxk', '!myFByZ^D#'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['(9yVf#yvFFm', '!XkTwZ'], amount: 17.73}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/ids', {ids: ['HWv0Vu', '&3WP@oAdnu9KFE'], amount: 0}, 400);
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
					await get('bookmark/list', {bookmarkTrack: 'Q%q1vf@z#kAq[gT'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/list', {bookmarkTrack: 4984231470039042}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/list', {bookmarkTrack: -3144138971152385}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/list', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/list', {trackMedia: '36L9X%0iT0lUKlTjimNF'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackMedia: 1985783552540674}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackMedia: 121919483412479}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/list', {trackTag: 'YjY1i$zhYSzwUsxscx'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackTag: -3056238485045246}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackTag: -7422450379784193}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/list', {trackRawTag: 'l0YU9PwI8]6'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackRawTag: -6425552231596030}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackRawTag: -8597471336857601}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/list', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/list', {trackState: '@7pokF8JqS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackState: 8113826364915714}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackState: -8648034514632705}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/list', {offset: 'MxqjgP*7'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/list', {offset: 17.77}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/list', {amount: 'I^kM4!Is6%]7o3@Pmb'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/list', {amount: 62.59}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/list', {amount: 0}, 400);
				});
			});
		});
		describe('bookmark/byTrack/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/byTrack/list', {trackID: 'Xn1cK)Rro'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"trackID" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: ''}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: '8e&#OtGQLRz9', offset: '^XNZ3(fyqvc2Q(yUnTZ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: '2hAo9IsMn1i]Ej', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: 't$JDFf1*I', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'Bk$cXyIRQ*X3[b#dj#4s', offset: 8.28}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'KCL@WNmvWdRZvdT^', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'F7OMjA!y44X', amount: '03j&z('}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'OF&5Fsq3K!@', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'NOP]m)*3J', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'mOXtD[lBm*4', amount: 81.97}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/byTrack/list', {trackID: ']WlySk', amount: 0}, 400);
				});
			});
		});
		describe('root/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/id', {id: 'UN%hw@(*%S'}, 401);
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
					await getNotLoggedIn('root/ids', {ids: ['0))ymVhn0O', 'Ze!6Ewz$z']}, 401);
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
					await get('root/search', {offset: 'eu2wvMA]'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('root/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('root/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('root/search', {offset: 97.65}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('root/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('root/search', {amount: 'y7In56A*'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('root/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('root/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('root/search', {amount: 72.13}, 400);
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
					await get('root/search', {sortDescending: '*6Cd^](9Nq9'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('root/search', {sortDescending: -1146422590177278}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('root/search', {sortDescending: 3369187338616831}, 400);
				});
			});
		});
		describe('root/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/status', {id: '^RN4(ir&Dib6'}, 401);
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
					await getNotLoggedIn('admin/queue/id', {id: 'oPp6vx6*iu[CN'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('admin/queue/id', {id: 'oPp6vx6*iu[CN'}, 401);
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
					await getNotLoggedIn('folder/download', {id: 'zL6&JxPM2vm'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('folder/download', {id: 'zL6&JxPM2vm'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/download', {id: '@B69]N@n1gQTk0My', format: 'invalid'}, 400);
				});
			});
		});
		describe('folder/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/image', {id: 'mS%$q'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/image', {id: 'hwOy*M', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/image', {id: 'twncvL!GcRzG)y', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/image', {id: 'a$sNwZOw', size: 'd9NFjDDU'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/image', {id: 'MGzrx^', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/image', {id: 'cU!eQmKR8', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/image', {id: 'dX)rwK3KHhzz@GMet3', size: 808.81}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/image', {id: 'eH*hGA2op!', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/image', {id: 'bq]$to5@y', size: 1025}, 400);
				});
			});
		});
		describe('folder/artwork/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artwork/image', {id: 'jhKtjvZf4ns'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: 'x(13[Qi', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/artwork/image', {id: 'Xy5sPzupco)&AhAxt8x', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/artwork/image', {id: 'y9JVIhBYG#7#988boWf5', size: 'aQqq3RzX%RXItYv'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: '7Z^U5MRc2R#UI7uKn]*', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/artwork/image', {id: 'gwFPQEwBcDTbw%X', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/artwork/image', {id: '(!$M5Mx!zyan8U3jn', size: 577.76}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/artwork/image', {id: 'frh%T#QDQ%Jr', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/artwork/image', {id: '38@a6z@WCjw6h&1VOk^', size: 1025}, 400);
				});
			});
		});
		describe('track/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/stream', {id: '40gHZIecsX]02#'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/stream', {id: '40gHZIecsX]02#'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('track/stream', {id: 'h)sRoQFJE1ghfskomdw', maxBitRate: 'a7Rp0ghlC'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('track/stream', {id: '6uTGKL9^e@', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('track/stream', {id: 'a)xn)5(q6U(', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('track/stream', {id: 'Md0Tpq', maxBitRate: 66.59}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('track/stream', {id: 'Cjv(tvZ*[NDoKo9cu5', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/stream', {id: ')qHjCe(y6jlPMsb%5&fd', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/download', {id: '[Kvl$XRR4P'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/download', {id: '[Kvl$XRR4P'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/download', {id: 'ZMJmZtgZJ', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/image', {id: '9)X0)rsr'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('track/image', {id: ')dFRXIqgwLaFYg2oYWn', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/image', {id: 'Yd%]anmHNU3]#1', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('track/image', {id: ')oaQAy]SyBXyE', size: 'aMj]dYACAhueA7l1^mE6'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('track/image', {id: 'xv4QdrT6Sd3ZDJlYe)78', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('track/image', {id: 'jf]7dple', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('track/image', {id: 'zpu*itj1SI6', size: 59.23}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('track/image', {id: '4HYoqbKHEP6YKnD@Tcu5', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('track/image', {id: 'B10Ltq]%Dh3&Ltp', size: 1025}, 400);
				});
			});
		});
		describe('episode/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/stream', {id: '8tFEp8O2ff44gun'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/stream', {id: '8tFEp8O2ff44gun'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('episode/stream', {id: 'PqgaoCV2ATYaKgeo', maxBitRate: 'GTPC6'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('episode/stream', {id: '#^gNDeZV(]ai', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('episode/stream', {id: 'K3OH(', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('episode/stream', {id: 'Ga(e(h[(8]', maxBitRate: 76.91}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('episode/stream', {id: 'HWxli((OlEDZUR2u$', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/stream', {id: 'ez)W*wt@cS2[i', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/download', {id: '94DEICR#y'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/download', {id: '94DEICR#y'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/download', {id: '*hlU1i2pc[k*hHwb7Kg', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/image', {id: 'CghWnc5J2t9JyYSsCEYe'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('episode/image', {id: '9IU@mt)Nqt5t@xi[t', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/image', {id: 'CG(&0T6Pyad%%52', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('episode/image', {id: 'Ayc4UIoiPrYrr(EWJW', size: 'gepUv8MX)wvg([LsY0'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('episode/image', {id: '9ECUQ', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('episode/image', {id: 'IrhqGwsWJT*U4PtlwS', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('episode/image', {id: '^J]axhjN3o%Slpep[I(g', size: 449.39}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('episode/image', {id: 'Y5ou2[0pPpG', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('episode/image', {id: 'CXJpW#5l', size: 1025}, 400);
				});
			});
		});
		describe('podcast/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/image', {id: 'ARKdI@@mDglkrB02'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('podcast/image', {id: '&7oVDKcbdx##wp&i', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/image', {id: 'dNR8Ev@%]DD0D^A*a', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('podcast/image', {id: 'j]T3RHfGU(UP', size: '#s%*ix)m$X!'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('podcast/image', {id: 'VqW#]t', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('podcast/image', {id: 'JG#e%oZ7jaLyTfEF', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('podcast/image', {id: 'TM7A2ZLMLcw9e^', size: 872.27}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('podcast/image', {id: 'TH7r[Sm)P5H9VqbsNoWV', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('podcast/image', {id: 'PlAlSBpMX[', size: 1025}, 400);
				});
			});
		});
		describe('podcast/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/download', {id: '4fWoHc3!LkTWmX'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/download', {id: '4fWoHc3!LkTWmX'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/download', {id: 'vCa8S8H1iXCRH0ns@Z%', format: 'invalid'}, 400);
				});
			});
		});
		describe('artist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/image', {id: 'pd&UlYs'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('artist/image', {id: 'J*0wQ0(dLHkb4', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/image', {id: '0e&*EMiXP6xF()xr8H', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('artist/image', {id: 'tkbqju!K1K#aDn6Cq', size: 'RfT)T#i@@M6'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('artist/image', {id: 'Wg6L[', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('artist/image', {id: 'J@IGAO%PuC$o%*', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('artist/image', {id: 'b&172qTGOK', size: 95.03}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('artist/image', {id: 'Qb#qChC4', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('artist/image', {id: 'jIAID', size: 1025}, 400);
				});
			});
		});
		describe('artist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/download', {id: 'F3g6spTbS'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('artist/download', {id: 'F3g6spTbS'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/download', {id: '4G)6oX8[UQ%&', format: 'invalid'}, 400);
				});
			});
		});
		describe('album/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/image', {id: 'sqTT#B[d$*O6bg'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('album/image', {id: 'F2r(^@0i]a8', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/image', {id: '%FstUc%)[s[jbDt$3Ft', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('album/image', {id: 'Gz1yxiFmMPbz3LN8yRQb', size: 'HKG8Q@Q%cGCG0bMy'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('album/image', {id: 'RM%zU]]QJY4*5[*9ISrh', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('album/image', {id: '23[8n0ncdEV468', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('album/image', {id: 'jpqY)fEPM', size: 633.58}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('album/image', {id: 'T)X9z', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('album/image', {id: 'NrNsaB(gn', size: 1025}, 400);
				});
			});
		});
		describe('album/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/download', {id: '7RtDgq7t6Ye3&K'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('album/download', {id: '7RtDgq7t6Ye3&K'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/download', {id: 'M!!!)vjeYyK8JCuL6M', format: 'invalid'}, 400);
				});
			});
		});
		describe('playlist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/image', {id: '#GohrO132Rsb]X#4b'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('playlist/image', {id: '*^IbT9&gCex', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/image', {id: 'ZTocG[o8rQ4fuOXru', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('playlist/image', {id: 'MsF@1KPd', size: 'XuBQN#'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('playlist/image', {id: 'Tjpl))QA2]sPg', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('playlist/image', {id: '@ompo8LNd^WphC9B', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('playlist/image', {id: 'W5pN*A[w', size: 560.29}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('playlist/image', {id: 'nJqV@HGt9pCDK', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('playlist/image', {id: 'z3*@Ww*(', size: 1025}, 400);
				});
			});
		});
		describe('playlist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/download', {id: 'YLRZO8p^4Ny'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('playlist/download', {id: 'YLRZO8p^4Ny'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/download', {id: '1vMC7F0CbDarSA!vecId', format: 'invalid'}, 400);
				});
			});
		});
		describe('user/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/image', {id: 'LkZ*&P'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('user/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('user/image', {id: '0G%Uz4ko', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('user/image', {id: 'mgk1KmJKN%%#r#sJrU[', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('user/image', {id: 'c#RQ7', size: '9#UrmWqA2p*x'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('user/image', {id: '2ETqePjUup^2V45J', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('user/image', {id: 'RBeIt8EcmpY(!0z%', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('user/image', {id: 'dqSrk&TS9%6ERN7b', size: 955.44}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('user/image', {id: '[xB*!X#ml&hp2m', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('user/image', {id: 'S(64aeiX1ZPgdfEt1', size: 1025}, 400);
				});
			});
		});
		describe('root/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/image', {id: 'yyigM'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('root/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('root/image', {id: '0SfVnCZN[YY', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('root/image', {id: 'R]h5kq8)oM', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('root/image', {id: '4T&zA1BsF(f', size: '&8RYE'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('root/image', {id: 'xFAV3Hx', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('root/image', {id: 'U9blodY%a9ED0^M]RJ!', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('root/image', {id: 'V!Q#]', size: 469.61}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('root/image', {id: 'Y1nCb*YF]!t', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('root/image', {id: 'kL4%d', size: 1025}, 400);
				});
			});
		});
		describe('image/{id}-{size}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/%23o%252Z%409bb%40-834.jpeg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/vHkl2q3aVDn(M%5DS8K*S-710.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/sCdq0o-747.invalid', {}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('image/U%23hPdw%25g%5Brp-XcV348.tiff', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/aYqcn%23xNqGS-.jpg', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/c%40MX5qH*%25cd%5BdPYxId-true.tiff', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/A!%260eJJ7UDHCEiN(3-773.78.jpeg', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/dLG6R4Q6%25hV-15.jpg', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/C5mW4DQg0Gj-1025.tiff', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-133.tiff', {}, 400);
				});
			});
		});
		describe('image/{id}-{size}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/%24iPL%5Dcli4-540', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"size" set to "string"', async () => {
					await get('image/W0JA%5BwCds)O!niaoeSv%23-6zXhBSuLcsY', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/gd%400(06buWu%23!ifqS-', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/0y7JqE*y8%40pbP-true', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/seyJJrl-835.9', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/D%5D!TG*LpUC-15', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/mk50E%25c(Zj-1025', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-366', {}, 400);
				});
			});
		});
		describe('image/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/nFf97TLi.png', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/P%24j%254crW)DFk%5BVhmrxCE.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/%40wZ7p*rQEziNHkFxCS7.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/.png', {}, 400);
				});
			});
		});
		describe('image/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/sfvQ%5E6tjSf%25j', {}, 401);
				});
			});
		});
		describe('stream/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/*m%5Eg00(%24P9M%40x0Gqr4w1.mp4', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/*m%5Eg00(%24P9M%40x0Gqr4w1.mp4', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('stream/1TbG%23.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('stream/.mp4', {}, 400);
				});
			});
		});
		describe('stream/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/GjFTgUPei%25q%40MpZ2pq', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/GjFTgUPei%25q%40MpZ2pq', {}, 401);
				});
			});
		});
		describe('waveform/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform/%5EPK28p0.dat', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform/%5EPK28p0.dat', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('waveform/c%26Z*%5BVu(SjV8r(pnt2%5B.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform/.svg', {}, 400);
				});
			});
		});
		describe('waveform_svg/{id}-{width}.svg', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform_svg/tP%5DMKOtDRW%25mrLR00i%23A-375.svg', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform_svg/tP%5DMKOtDRW%25mrLR00i%23A-375.svg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"width" set to "string"', async () => {
					await get('waveform_svg/Z4%5DsasFR(4%5Eb-Jlfhf8Bi!qwL)K.svg', {}, 400);
				});
				it('"width" set to "empty string"', async () => {
					await get('waveform_svg/nxaz%26%5DH64LZfg-.svg', {}, 400);
				});
				it('"width" set to "boolean"', async () => {
					await get('waveform_svg/qSk4zT%5D%260tfWlQV%5Dmj-true.svg', {}, 400);
				});
				it('"width" set to "float"', async () => {
					await get('waveform_svg/wMZQieRJ*y%40-523.05.svg', {}, 400);
				});
				it('"width" set to "less than minimum 1"', async () => {
					await get('waveform_svg/S)%26JmSr9-0.svg', {}, 400);
				});
				it('"width" set to "more than minimum 6000"', async () => {
					await get('waveform_svg/zpYrO2n1O%5DDh%5BI-6001.svg', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform_svg/-4132.svg', {}, 400);
				});
			});
		});
		describe('waveform_json', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform_json', {id: 'mIkSG'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform_json', {id: 'mIkSG'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('waveform_json', {id: ''}, 400);
				});
			});
		});
		describe('download/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/QfZdm2i', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/QfZdm2i', {}, 401);
				});
			});
		});
		describe('download/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/FtJnPcm.zip', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/FtJnPcm.zip', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('download/5liOkdC1Bsp%5E.invalid', {}, 400);
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
		describe('stream/scrobble', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('stream/scrobble', {}, {}, 401);
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
