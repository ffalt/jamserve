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
					await getNotLoggedIn('lastfm/lookup', {type: 'album', id: 'duf8p7wiWKm@mY'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: '', id: 'Q*zK%W^F'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('lastfm/lookup', {type: 'invalid', id: 'ZN&xwcci97^1Bx1rz'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: 'artist-toptracks', id: ''}, 400);
				});
			});
		});
		describe('lyricsovh/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('lyricsovh/search', {title: 'eo%Ve', artist: 'eF&fdKRye7b$9mK]v'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"title" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: '', artist: '8@plcCyOr*MxO7bWSLEW'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: 'XrSyeW1JP', artist: ''}, 400);
				});
			});
		});
		describe('acoustid/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acoustid/lookup', {id: '8Im8rADYjzm%BO'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: 'ooTRxGVsV1E8', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/lookup', {type: 'recording', id: 'bGAmKZsbvN^WA@0d'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: '', id: '%c*]oQQEusTBmq5F*'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('musicbrainz/lookup', {type: 'invalid', id: 'Z$LIhXQI54VUh[GqyY'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'place', id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'label', id: 'FP@&3q840', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/search', {type: 'artist'}, 401);
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
					await get('musicbrainz/search', {type: 'label', releasegroup: ''}, 400);
				});
				it('"release" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'work', release: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'area', artist: ''}, 400);
				});
				it('"tracks" set to "string"', async () => {
					await get('musicbrainz/search', {type: 'area', tracks: 'uZ]GhK$#aexgeuj'}, 400);
				});
				it('"tracks" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'area', tracks: ''}, 400);
				});
				it('"tracks" set to "boolean"', async () => {
					await get('musicbrainz/search', {type: 'release', tracks: true}, 400);
				});
				it('"tracks" set to "float"', async () => {
					await get('musicbrainz/search', {type: 'recording', tracks: 49.02}, 400);
				});
				it('"tracks" set to "less than minimum 0"', async () => {
					await get('musicbrainz/search', {type: 'label', tracks: -1}, 400);
				});
			});
		});
		describe('acousticbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acousticbrainz/lookup', {id: 'BNdBTy'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: ''}, 400);
				});
				it('"nr" set to "string"', async () => {
					await get('acousticbrainz/lookup', {id: 'B(r*4lH', nr: '*[A&54pk'}, 400);
				});
				it('"nr" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: '64vB1^!zHnhMJ!', nr: ''}, 400);
				});
				it('"nr" set to "boolean"', async () => {
					await get('acousticbrainz/lookup', {id: 'WLHWk&P', nr: true}, 400);
				});
				it('"nr" set to "float"', async () => {
					await get('acousticbrainz/lookup', {id: 'Rot2(cVC(7', nr: 33.88}, 400);
				});
				it('"nr" set to "less than minimum 0"', async () => {
					await get('acousticbrainz/lookup', {id: '&EmId@q', nr: -1}, 400);
				});
			});
		});
		describe('coverartarchive/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('coverartarchive/lookup', {type: 'release', id: 'OVE!pi@LKh!27]ZdSda'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: '', id: 'XbKjfbvs'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('coverartarchive/lookup', {type: 'invalid', id: '(MxAeaqfkzWjI46w'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: 'release-group', id: ''}, 400);
				});
			});
		});
		describe('wikipedia/summary', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('wikipedia/summary', {title: 'Ld*YXU'}, 401);
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
					await getNotLoggedIn('wikidata/summary', {id: 'SDMuequ'}, 401);
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
					await getNotLoggedIn('wikidata/lookup', {id: ')NsalY0$7SZM@AclxK0V'}, 401);
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
					await getNotLoggedIn('autocomplete', {query: 'QSbQSoOTcDMefV'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"query" set to "empty string"', async () => {
					await get('autocomplete', {query: ''}, 400);
				});
				it('"track" set to "string"', async () => {
					await get('autocomplete', {query: 'dc(8SysnwzUO', track: '3@wE8u26c^4Qqu'}, 400);
				});
				it('"track" set to "empty string"', async () => {
					await get('autocomplete', {query: 'h^wplBNFO', track: ''}, 400);
				});
				it('"track" set to "boolean"', async () => {
					await get('autocomplete', {query: 'A7fdh)kq%QU%feP', track: true}, 400);
				});
				it('"track" set to "float"', async () => {
					await get('autocomplete', {query: '[PIOH', track: 35.66}, 400);
				});
				it('"track" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '2hl&kw[Udl', track: -1}, 400);
				});
				it('"artist" set to "string"', async () => {
					await get('autocomplete', {query: 'a%EgBe)BIL', artist: '^g@lvczw*u3uhkAosbXW'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('autocomplete', {query: 'yelC^c5qH$*FXBTI', artist: ''}, 400);
				});
				it('"artist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'pquqC7tfjoJn1Ri', artist: true}, 400);
				});
				it('"artist" set to "float"', async () => {
					await get('autocomplete', {query: 'Tr)F^7A^l2otOEY2Hdj', artist: 77.46}, 400);
				});
				it('"artist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '[R)9]*A[%Vz', artist: -1}, 400);
				});
				it('"album" set to "string"', async () => {
					await get('autocomplete', {query: 'tI0C!4xlIogKYTz', album: 'FJF%VSuZiGDlJlRjQU1'}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('autocomplete', {query: 'QqD!NXuvPQK!f]kD6tA', album: ''}, 400);
				});
				it('"album" set to "boolean"', async () => {
					await get('autocomplete', {query: 'Gqcj7JeWg0a8Xd#lMca2', album: true}, 400);
				});
				it('"album" set to "float"', async () => {
					await get('autocomplete', {query: 'ulasE^vzqsq^fG', album: 46.4}, 400);
				});
				it('"album" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'p5b@#U]8u*T', album: -1}, 400);
				});
				it('"folder" set to "string"', async () => {
					await get('autocomplete', {query: '6D[pD%', folder: 'y^45('}, 400);
				});
				it('"folder" set to "empty string"', async () => {
					await get('autocomplete', {query: '@SsM&*H3Zvq&Y', folder: ''}, 400);
				});
				it('"folder" set to "boolean"', async () => {
					await get('autocomplete', {query: 'i[czdQ8R', folder: true}, 400);
				});
				it('"folder" set to "float"', async () => {
					await get('autocomplete', {query: 'nmO&zk', folder: 36.81}, 400);
				});
				it('"folder" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '[0TbcawwHor3)!O#)IZ', folder: -1}, 400);
				});
				it('"playlist" set to "string"', async () => {
					await get('autocomplete', {query: 'eRS3!5t[T)Z1EvBcvWL', playlist: 'uhhR%q]cw)VTMud'}, 400);
				});
				it('"playlist" set to "empty string"', async () => {
					await get('autocomplete', {query: '#YYpTWkZLO9vDxry', playlist: ''}, 400);
				});
				it('"playlist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'UPpFBlsJFL', playlist: true}, 400);
				});
				it('"playlist" set to "float"', async () => {
					await get('autocomplete', {query: 'sQFlAg@wD$GIwOQmC7G6', playlist: 16.35}, 400);
				});
				it('"playlist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'BSh!8#Zh', playlist: -1}, 400);
				});
				it('"podcast" set to "string"', async () => {
					await get('autocomplete', {query: '1v3YL*$nZKKv[&', podcast: 'NLq!e5'}, 400);
				});
				it('"podcast" set to "empty string"', async () => {
					await get('autocomplete', {query: '[!vE65qjasGk$Qwee4', podcast: ''}, 400);
				});
				it('"podcast" set to "boolean"', async () => {
					await get('autocomplete', {query: '!kf]%drg%Wu5@U)qu', podcast: true}, 400);
				});
				it('"podcast" set to "float"', async () => {
					await get('autocomplete', {query: 'T@vNM(syQ&4nknh34f7', podcast: 51.87}, 400);
				});
				it('"podcast" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'FP3c#$72Per1Au9@N', podcast: -1}, 400);
				});
				it('"episode" set to "string"', async () => {
					await get('autocomplete', {query: 'LzmVUD', episode: '3sqgo!AInJ%I0[cN'}, 400);
				});
				it('"episode" set to "empty string"', async () => {
					await get('autocomplete', {query: 'czjEmaW4rJ', episode: ''}, 400);
				});
				it('"episode" set to "boolean"', async () => {
					await get('autocomplete', {query: 'Y6M(G3C7iOuByE', episode: true}, 400);
				});
				it('"episode" set to "float"', async () => {
					await get('autocomplete', {query: '6eMVKP', episode: 56.25}, 400);
				});
				it('"episode" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '@Q5(hsRoanNtsfYLPbq1', episode: -1}, 400);
				});
				it('"series" set to "string"', async () => {
					await get('autocomplete', {query: '!U(sq@E1x', series: 'jO]s1CgCNXgNx!2&'}, 400);
				});
				it('"series" set to "empty string"', async () => {
					await get('autocomplete', {query: 'RnGCR7', series: ''}, 400);
				});
				it('"series" set to "boolean"', async () => {
					await get('autocomplete', {query: '!RM6Lm@T^5RgLQ[lS[b1', series: true}, 400);
				});
				it('"series" set to "float"', async () => {
					await get('autocomplete', {query: 'emRlQOlZ6U1T(8o%H', series: 91.86}, 400);
				});
				it('"series" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'lL#Q0A*pXR', series: -1}, 400);
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
					await get('genre/list', {offset: 'X7uWK$ntqEn*bnD'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('genre/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('genre/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('genre/list', {offset: 55.32}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('genre/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('genre/list', {amount: 'KFR&%sq&'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('genre/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('genre/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('genre/list', {amount: 35.15}, 400);
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
					await get('nowPlaying/list', {offset: '1O&ndLe'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('nowPlaying/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('nowPlaying/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('nowPlaying/list', {offset: 95.34}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('nowPlaying/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('nowPlaying/list', {amount: 'F5dJ%&%n*m1FLU]J%0'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('nowPlaying/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('nowPlaying/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('nowPlaying/list', {amount: 52.68}, 400);
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
					await get('chat/list', {since: 'qPq*F!T'}, 400);
				});
				it('"since" set to "empty string"', async () => {
					await get('chat/list', {since: ''}, 400);
				});
				it('"since" set to "boolean"', async () => {
					await get('chat/list', {since: true}, 400);
				});
				it('"since" set to "float"', async () => {
					await get('chat/list', {since: 48.89}, 400);
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
					await get('folder/index', {level: 'kdA@03W'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/index', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/index', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/index', {level: 23.94}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/index', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/index', {newerThan: '94LrJL'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/index', {newerThan: 23.16}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/index', {fromYear: 'V3Mt9T&!C0@Kv7EQD'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/index', {fromYear: 55.72}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/index', {toYear: 'FTg%@iJ#b*Hi7F%h5oUJ'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/index', {toYear: 85.88}, 400);
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
					await get('folder/index', {sortDescending: 'NFXckriae]pzRKEXPx'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/index', {sortDescending: 2259871575572482}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/index', {sortDescending: 4522786697510911}, 400);
				});
			});
		});
		describe('folder/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/id', {id: 'r*KMnxl2nG'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/id', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'IKfW(G!F@Q5u#jX', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/id', {id: 'jy*Js10!bKq', folderTag: '1!%wPg'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'ZpVKP*K)TT^XtQ8JR2', folderTag: -1492247732289534}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: '8yPBpxk!FE', folderTag: -3386030237417473}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/id', {id: 'ytUr3Qz]HP4s#[KedYJ', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/id', {id: 'IGuvl9&qTKxo2C#u61', folderState: 'Y7X9Q1tDRSc'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'A6$@if', folderState: 5497526274752514}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/id', {id: '1[N(eYSInAJ', folderState: -5353477479858177}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/id', {id: 'onejj9&*', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/id', {id: 'Eoe^fR', folderCounts: 'pUP20Kg6'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'p8a$U', folderCounts: -2976993402421246}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'i&JMhv5q', folderCounts: -4464256875495425}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/id', {id: '2!^(AhyJYA', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/id', {id: 'xomy*cPEsx@s3h@JBSG', folderParents: '0*xa*t[$&]'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/id', {id: '71KS3FBf(2BGRkROv', folderParents: -6952876031082494}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/id', {id: '#YCNe]vcu1vL%LZMCR', folderParents: 5146039958896639}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/id', {id: 'yMoJ&)', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/id', {id: '&%y@zg9cE', folderInfo: 'D7S8V7@(HxFKE71#TIx4'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'oMs[D0rPgPh', folderInfo: -3008407841800190}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'Dk$!]P3bG!yE[5h8VX2', folderInfo: -5012344967004161}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/id', {id: 'UqBsAaPx^2', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/id', {id: 'O1O[yy[S', folderSimilar: 'sWNqWHgH8VJit]'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'p3kyJ3nL@2l', folderSimilar: -1433565099196414}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'gIHsRGgI!*S^', folderSimilar: -8883419144519681}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/id', {id: 'rdSoHz', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/id', {id: 'uN7^^9%HjbTvkk4A47Wb', folderArtworks: '%5[$D3cHtJO9QWO(6c'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'aBjMPI2Ns!PE)q6r^', folderArtworks: -6402352030416894}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'xc5tc*MU2B7*yBa', folderArtworks: -6199617469284353}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/id', {id: 'Q[YyY8h]#1j', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/id', {id: 'Eh1JFQ7YOq%&r', folderChildren: '3N3FmKU'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'l8%r@o9wc@Tw26pHiv', folderChildren: -1518578067046398}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/id', {id: '&%NPCK1', folderChildren: 8658250555719679}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/id', {id: '8fQW2IguRzB', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/id', {id: '4Yl6zHFn3FLBL[qkn', folderSubfolders: '!R&miGb612bKIYL2m'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'p$gnN$c)F$m*Yoi', folderSubfolders: -4577154834628606}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'VNrJDnlncc*]HRc9', folderSubfolders: -4304276025245697}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/id', {id: '(bU%PVbgk097JwcJ', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/id', {id: 'x#f(PvHazD2W', folderTracks: 'R&f82sckcu!xg0fyv'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'F$FX]alUjeB0oL', folderTracks: -7913374864113662}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'd7E)]R$Mf', folderTracks: 132367561785343}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/id', {id: 'fx%Gu8dJeGp', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/id', {id: '5^xs]iXy6Qd9iin4', trackMedia: 'YSbfcPWtLP2Z'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/id', {id: '0f[JDl@%X9acJGNCYo[u', trackMedia: -6107270039470078}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'brU)RB@n', trackMedia: 7578606859452415}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/id', {id: '0nT5cKrHzfX', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/id', {id: 'Zki1my', trackTag: 'wlz9D%'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: '^ut!R)DAN@44Pdfr', trackTag: 4860067862020098}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: '7]@c*mwM*', trackTag: 2278162146787327}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'kWGHYe3)de5FuqPEF9%', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/id', {id: 'jv0)F2Gzv', trackRawTag: 'J7]XlG0Oy]'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'o4R[y2#8Bbz#3Wkqn', trackRawTag: -8054042441809918}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'c1s9y6yDe9QS!GXP4*3', trackRawTag: 7263337494609919}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/id', {id: '1#0D4*r!f]B4l', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/id', {id: 'BUP38!htyamO0[f', trackState: 'C*n*VdML4E'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/id', {id: '9QP@zrZX]&y', trackState: -515472441212926}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'PX0UY$CL]4ijl1j#pB)@', trackState: 5364868513267711}, 400);
				});
			});
		});
		describe('folder/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/ids', {ids: ['PFCP9PP7[(', 'XbURn79zHPt']}, 401);
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
					await get('folder/ids', {ids: ['tWmeNS3FTZXkKb', '9xR(t(Ci8V6BmIV'], folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['b0%LNHK!^xD%iH&8Mt', 'NCWtnMOoE!TSIG'], folderTag: 'idOpC[n4[DUKzrYW4*4g'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['y2%5^)0Ft&*Ts', 'd&FGfxO*#ii)$MSBX'], folderTag: 8868795342913538}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['WKKKT', '*Cjw8iG'], folderTag: 7565895870185471}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['S#QyLkF8aCpZ2P%(', 'P]3E4'], folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/ids', {ids: ['I#q2dt1@YgiZc#@0Hz2', 'luQ%D'], folderState: '^O)kIb)la'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['X5GU!DLA9M$T7sPbx', 'NQ@*X#naYMe[j'], folderState: -6032885651865598}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['kn18oDH', '7ihAr5'], folderState: -7460870812598273}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['*1PN%$Owp#Bc#F', '6&0pc#X#K'], folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/ids', {ids: ['KL#Ke', 'jt0@it'], folderCounts: '^s^u[eJ2[uO$C)to'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['&jglW', '!*Ntkk]Kg'], folderCounts: 5720076997099522}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['6qZh7&I', 'tVD7#0tPD3UL&A1Ck'], folderCounts: 4159068377710591}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['N07XbuAhT*%qdux', ']ZMn$cD@Q!!^qF!O6'], folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/ids', {ids: [']0cFCDc!6bY!', 'Q&B0G[HuMpSsK7%@5v'], folderParents: '[OPtcD'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['y)l&YU6#rol', '8]ivGY#(LZbH@mPIYqeD'], folderParents: 6036760362483714}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['P!XE)wPcvv5u', 'c85)Vb3sEUYRM3AS]Re$'], folderParents: 6332146142674943}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['7yVYIrv#l^UuRo2i*dg', 'CU&)VTDR'], folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/ids', {ids: ['*7MoR]*xitr', 'YE4E3&NCCE3!3g'], folderInfo: 'v1oPS(E!aOzR*qqH(Bbz'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['AN#]aQCvE2)kn', 'IIrx!'], folderInfo: -1791715627237374}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['Dw0ODDQ', '6W8ZF'], folderInfo: 1900819750322175}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['L6#Y@7Zfy8J]sB', '5ZW1(eG#T'], folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/ids', {ids: ['e5L][Rc', 'iDD#Nna'], folderSimilar: 'Sg#^HDrp8t5'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['txG7Xq', '2]x&c'], folderSimilar: 1269168498278402}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['8Bz#5AKIwEl!kU', 'yJYyl3c)%H2@5vUxz'], folderSimilar: -6195103177637889}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['q)V*hCXg$lCq7qgE%', 'oAcHBOJ9U$g'], folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/ids', {ids: ['w7f0o]bCo0&i%9', 'x0#y7GB5qc&8&7C'], folderArtworks: 'PFUOSc[DuO4Hji)i'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['lX&EZZIuCAXA1E', 'lqM1GgOR)Hd1'], folderArtworks: -8692072961802238}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['9eDSNToC^S1wmoUdt8', 'CV99y'], folderArtworks: 4794093964099583}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['l[tcsZXsCQG[kR', 'FJE(bl$59je'], folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/ids', {ids: ['#YFEQ*aZejWixi6n', 'C@&G!cD]]h'], folderChildren: '4W[pww'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['tTzU3cikyJbH5Z', 'du@5PIlax3o92QhrwFie'], folderChildren: 5085972207239170}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['jutZupmgJOFWWoto', 'MYXgL0dw'], folderChildren: -2114802763694081}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['a%cl@', ')lwW5r[AhzDYom'], folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/ids', {ids: ['P9HQcfC((YqMA9*H@%Gk', '*llKWi9#l74hGbP3uwwF'], folderSubfolders: '5GcJ#u'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['8ewvzSQbcDpY3f6bmuM', 'bA$[kkE9Ak#CU!'], folderSubfolders: -593414395527166}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['I0]f&cNuFHOgHh*', '@0SrGBl3i'], folderSubfolders: -4941875005882369}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['A$H5QfM', 'zYVA9$baC'], folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/ids', {ids: ['r]s!gd5y0rkPV!w', '2jfTUz*1@ao8n'], folderTracks: '(1e#G2S9nahrPwX'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['JIi&i^gaFa6', 'uy97xa('], folderTracks: -8782498586689534}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['U4sXa%', '4O$foA67NK'], folderTracks: 7116492663422975}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['KFmWnhwlO3C$!2]3I3C', 'C!FlOWO)qeZUuN'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/ids', {ids: ['#xucH6TT4Bv@', 'zD&OZ[iOyFX8zWIv'], trackMedia: 'yaP6623#Dym'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: [']a@89aFQVSx6%4D7', 'jom7R7'], trackMedia: 1893521099325442}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['ji5js1TF(', '5vSSuTdGi]zjFJ(zP['], trackMedia: -3677080990515201}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['LeFn*MxUe5kPsa6', '9]7Sjs('], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['GJ@YgVoF', 'G(zpzevi$uk6p(gyaI0'], trackTag: 'DIb51[QPpDkCDiVrY'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['DE(Okhb[Iaz', 'LcpgWH56u*LMmtSd[V'], trackTag: 6680093019602946}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['b2q61pgcRLup$YOsPR', 'hPWx5RVO38N1d6z^14cd'], trackTag: -6205443625975809}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['Aec1$uJOPKntj]G', 'pcHiVVN[XZ'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['WMvMv3#[Swy$N56v#C', '@V)0b#z'], trackRawTag: 'rZX(8z@(Q!wzK'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['maAPC', 'VdnQT]Uu'], trackRawTag: 4857491133300738}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['nzeTLG', 'ZqX1ycH!xlV#'], trackRawTag: -8795668093075457}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['aghHIGiG1Kz', 'iwqo[vxpVMm[2C0)FcQ7'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/ids', {ids: ['75q!1Jm7s&[VRd3FR', '@]Z5!&eZpJ9*'], trackState: 'PojC4k^H7tJ'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['uQ@GCX', 'f3)Lfdv@S'], trackState: 5340778855399426}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['Z@r9b27f', 'tXCok4L87kI)Z['], trackState: -3749740730646529}, 400);
				});
			});
		});
		describe('folder/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/tracks', {ids: ['UpXB9r', 'Jx&GHA)']}, 401);
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
					await get('folder/tracks', {ids: ['ta%e4I', '*AF^^IkdQF8*Bt26'], recursive: ''}, 400);
				});
				it('"recursive" set to "string"', async () => {
					await get('folder/tracks', {ids: ['XDAEd5tBF', 'MAGGtYwkjyJIx'], recursive: 'VF)FS'}, 400);
				});
				it('"recursive" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: [']yaW1ByaJ349smQ9gcl', '9)E[Lk'], recursive: -254014922948606}, 400);
				});
				it('"recursive" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['#WBxl[OoR', 'k[JsL27'], recursive: 5087732535656447}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['6QET3mMcoOu', 'QuzS2z'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/tracks', {ids: ['^uwclL0*[FA5Kp', 'p#K!NbFJ!p'], trackMedia: 'uCl$EXT'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['AR3Grm', 'Fc#RMyWI'], trackMedia: -1589265645436926}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['b@WY5B)@$TpLNp3*', 'Dj$TN*xf6)dw2Db!u!E'], trackMedia: -2533876656242689}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['sTWy]X&h%B]]z]Q!(b', '99uh9Ijou]IK$VTm0*@'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/tracks', {ids: [')N@DL9', 'w4sc5Pm'], trackTag: 'ki%#&o*HY'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['n[2bzuO%V8JNdCTj@@WA', 'vlYGv6Xc'], trackTag: 4392933771968514}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['9ccTO', 'i&E%TKt'], trackTag: 5755661023444991}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['2D!Z]5F', '@g3nPc&$lmwzmUlvuhs'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['e41Q$tr%d)tFBrd6qZ', 'rMqvELZ'], trackRawTag: 'fkzPx'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['c[!jIsGTICmd2g', 'FwbDWwMiwLy4L#ajuG&'], trackRawTag: -8132754004770814}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['0hPD8Cq4AN$WHJiQ$6', 'OcoB##IVgBgcZl'], trackRawTag: -4051462246105089}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['r#T#bG9V', '&wgMTJa]MPiuE[q!bAL'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/tracks', {ids: ['mAQh5HMC)cA(BU^5)*]', 'QI(VQ7W[2@DQm)u'], trackState: 'HAPWFm[ts'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['lm$E#', 'dVQEL$xV%p6KgRI&F&'], trackState: -3490764403245054}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['RzKG!a68yv', 'BZV)PQjq1eid&ysiT'], trackState: -4139311599452161}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/tracks', {ids: ['J2*mcu^x8ER*u[d9Avtp', 'EbRJNw7$0B'], offset: '0etD)j8CSX0d*I9Q1wW'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['U&eOi$u5h', '1INaJ84nwc%'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['4JTjmh!D]', 'KQF$9]P'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/tracks', {ids: ['QDzxkwmrs3&)2Mj0', 'b$%6X)i'], offset: 95.63}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/tracks', {ids: ['YpUb@[cAo4EP', 'y4NK1&Wn'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/tracks', {ids: ['aljvTLY7', 'w$igp92$39uL'], amount: 'Eeh8yChg'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/tracks', {ids: [')wi8SQcN]M@ssF3O1V(', ')OUfUE'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['N!IAI[a3riB2fd7!@&o', '#l8z@JDCyM^rbXYPsT&'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/tracks', {ids: ['r6z$Cc1M&', 'QsQT1hbA&Q'], amount: 77.56}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/tracks', {ids: ['Lqe8aab!a%#gYu', '3lb9Y4b'], amount: 0}, 400);
				});
			});
		});
		describe('folder/subfolders', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/subfolders', {id: 'Sgu@CQr)[FxouZ5g^Ty'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/subfolders', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/subfolders', {id: ')B(T6mJsMld', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/subfolders', {id: 'HxcT3HNfhBnHQswQXN', folderTag: 'L)Vezk]J&(tK(u'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '[joZkvM6anKL&YZp#GP8', folderTag: 197981319987202}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'to&qUZY', folderTag: -7082728021295105}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '*me2kq(veXgUdc', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/subfolders', {id: 'e#xyB#AS9', folderState: 'ru]@p5eEN74zeY4'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'v69*FW@6xeB6r]gpMK', folderState: -2423097466552318}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'qrDM(XZ%N]jPyf@', folderState: -271699081691137}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'ds@O[ICZgN*', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/subfolders', {id: 'xOv79R3fi&5I', folderCounts: '!)P8ISFU)ds2'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '28oQIb', folderCounts: 2599565932888066}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'JWs3x27ZzBYJph7mX', folderCounts: 8865228016058367}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'UK^QnZSKdSt1YILKHCAf', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/subfolders', {id: '5xG]@bn(', folderParents: '&iWwAaU$18bS@Ru7LC'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'qW6aV&D4iW', folderParents: 5536780132548610}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'xRRU8', folderParents: 8931420881813503}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'CTKeU', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/subfolders', {id: 'JvIBew(XxCMuam', folderInfo: 'Q^44@ccc'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: ')Ub^Dt&', folderInfo: -3805509744328702}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'bh4r^*k', folderInfo: -6095582837866497}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'b&sC0Wr8nhZU]v0aeQ', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/subfolders', {id: 'qJ197wz(R[', folderSimilar: 'K)49dfjkD*'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '%Ud8d*blQ(c', folderSimilar: -4605042032115710}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'u*h%$4*1*!ya5W7', folderSimilar: 7050163273072639}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'Jmw0ntvs%AtCGpL&Xe', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/subfolders', {id: 'vQm^pm2ut19COBIcAwS', folderArtworks: 'LIJ@V'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'IR(bER2ewZ9GNaU', folderArtworks: -5580975794814974}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'OuLp6', folderArtworks: -745653533671425}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/subfolders', {id: 'H8)fF%5Nu5kL[Zc*3CZ', offset: 'tL0R)G'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'a*@!WrubqDU!)@', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/subfolders', {id: 'RDtL&V$]q5P', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/subfolders', {id: 'ANOx*7lJ[EtAAHnb8', offset: 29.66}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/subfolders', {id: 'eEYmeMr$n28v6($Or', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/subfolders', {id: '$Dv)S9p6', amount: 'cEeXDg6tXqjnhLT'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '6K97t$6SAElA3VhK', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/subfolders', {id: 'uGm!LZh5S65!vb', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/subfolders', {id: 'ny*iedIL$JTbp', amount: 28.82}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/subfolders', {id: 'nmY20Q60(h', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/similar', {id: '(DRb^SXRs3&&5HSJXM'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '5OffI5kdBowULv030lX', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'VJM[8GvePdBTGXTs5', folderTag: 'Fn*h^(Ur#[W'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'z3NrB%30Zt3OiERbEs', folderTag: -3605770276962302}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'ettjt(d', folderTag: 7923531132174335}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '!A)0##$T^mEEMc6J', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'NQMEy]cqt(AcA', folderState: '$CRHT&CBONaB'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '5hlF#', folderState: -3454918509723646}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'w!X3se', folderState: -8037764142465025}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '6tQKjP]ow', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'RfcZDQC&', folderCounts: 'B[sTSnuI7Bi'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: ')5O[QzvuL8G]U6', folderCounts: -2043693670334462}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '5pGOe9C^nBaJ3e', folderCounts: -2227312288333825}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'fjt*vdSP!w$ST[V', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/artist/similar', {id: '01S2z0[rj(2gfgRG7WN', folderParents: 'u2JeSzu#KH'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'gLDubuty9EwD3XN[d', folderParents: -559027490652158}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '(%ZjccnWt', folderParents: 440925801152511}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '3I*enQ1YmA%0L*', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'mie5WYs)zESvI', folderInfo: 'U]0$a4zL#M^FCv7Lnx8z'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '@9aL*', folderInfo: 8168842765271042}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'P2I8wG9GO[@', folderInfo: -7746878590418945}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'oYo4(XfGxd1s!f[BV', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/artist/similar', {id: ']W4yR6&a^6', folderSimilar: 'WYFAOI'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'v[voS)a4P', folderSimilar: 2413216562937858}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'CmBGKE()', folderSimilar: -4448980737982465}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'moE0lbzlV#35', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'WB(Z$0hL5b', folderArtworks: 'e0f9V!2UmBu!&'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'qkh%r[kuqAw]@ZXrbE', folderArtworks: 3648819958906882}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'NhFRD49pEcw4iNkh8', folderArtworks: -7630755492528129}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ']eM5hL%AiFKd6j3C!', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'Y4Cz90#ycnfyCef', folderChildren: '(0h@S8'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '1t6ivxbABrS[HgJo*e#', folderChildren: 7321924635983874}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '15bd&UCx8I', folderChildren: 5111883505860607}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'P!dd]shzLZ', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'K^#%Pi7!J^Uv', folderSubfolders: 'f7fc1vHkU'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '1biDoKClpIag4Si', folderSubfolders: 7182551097540610}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'V&FJ$s7pGuT', folderSubfolders: -8950534081871873}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '&%]t]8KBMGO@WW(ePh', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'lPe2iIZ', folderTracks: 'v0nxgyl7%'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '[9lMY8LSp2!Q', folderTracks: -2403949738983422}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'Ka8y3(mOo$O4azo8', folderTracks: 876241280303103}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'aBZ(bWl#RcC5CW*k', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'rv&^EW5PK(', trackMedia: ')BKxxg]jjP'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'Qnkuvnqaw', trackMedia: 3800524201656322}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'hnnTpo5#LLp%%z@A493l', trackMedia: 4148770669330431}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'NG$yC@I', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'LoQyJrDGni', trackTag: 'u7(wvuO'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'xPW8DwOhOc2', trackTag: -5594084563484670}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: ')OK*HKdfw%IjiRzt', trackTag: -3686899705184257}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'eZNz3g%zkMeXer', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'TvR[(butT1', trackRawTag: 'wUn(Pu1OeONgyeYlo'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '@HPW$NH*v37d', trackRawTag: -2248010239049726}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'Hu1qp6Xr*zQDlZJ', trackRawTag: -5760817211375617}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'Bs#VJ74YRZDz)NI]1i(H', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'padHq4x@X2uYRG(UJ', trackState: 'W2WCX'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'y6xfN', trackState: -7099366598770686}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'ztHFSu', trackState: -5831436091260929}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar', {id: '&TK63vXMmu!^22', offset: '2Dgqi'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'EuDQzQV1*', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'l4QkI191OBOVTy^a]', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar', {id: '1Q%%EgFm6*', offset: 60.11}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar', {id: 'xYK6&KaEkS', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'SgjxwUrtwdY', amount: '@0WSz690'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '2JF66DsbjIDXx99F', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'Bg]jhi', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar', {id: 'nQN8gWwATEl0PS', amount: 32.63}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar', {id: 'uZfa%cNRQ', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/info', {id: 'O6K&$ZGbE9ox5mTi'}, 401);
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
					await getNotLoggedIn('folder/album/info', {id: 'VIh3yhY8$^e'}, 401);
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
					await getNotLoggedIn('folder/list', {list: 'highest'}, 401);
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
					await get('folder/list', {list: 'highest', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', parentID: ''}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', childOfID: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', artist: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', genre: ''}, 400);
				});
				it('"level" set to "string"', async () => {
					await get('folder/list', {list: 'highest', level: 'LZmV]9rc7a]Z8'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/list', {list: 'avghighest', level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/list', {list: 'highest', level: 84.73}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'highest', level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', newerThan: 'yG)H^RJab^'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/list', {list: 'highest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/list', {list: 'random', newerThan: 80.69}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'highest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/list', {list: 'random', fromYear: 'QZCe!9tBjmZ21[z'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'frequent', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/list', {list: 'recent', fromYear: 94.35}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'recent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', toYear: 'y)W%1NK%^&SuNQxOvFX'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'random', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/list', {list: 'highest', toYear: 54.05}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'faved', toYear: -1}, 400);
				});
				it('"type" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'random', type: 'invalid'}, 400);
				});
				it('"types" set to "null"', async () => {
					await get('folder/list', {list: 'recent', types: null}, 400);
				});
				it('"types" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', types: [null, '']}, 400);
				});
				it('"types" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'frequent', types: [null, 'invalid']}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('folder/list', {list: 'random', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('folder/list', {list: 'random', sortDescending: '7^7*muYTnf'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'recent', sortDescending: 4805480165670914}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'highest', sortDescending: -6754388043366401}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderTag: '7pb(S3c#P0mjsq1o'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'random', folderTag: -674173932273662}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'frequent', folderTag: -316470324101121}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/list', {list: 'recent', folderState: 'B07G@6mlL'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', folderState: 7449409235189762}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'faved', folderState: -1145612338724865}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderCounts: 'WRsuJ]1dZl*cE'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'random', folderCounts: -4756357274140670}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'random', folderCounts: -8820551967571969}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/list', {list: 'random', folderParents: 'B!IZKBrxz'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'random', folderParents: 3395588779409410}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'highest', folderParents: -5257153866629121}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/list', {list: 'highest', folderInfo: '(q4z%5(RTaGGYy'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', folderInfo: -6666475754487806}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'random', folderInfo: 7612471955161087}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/list', {list: 'highest', folderSimilar: 'hvm(GvAvL0QuPoisju'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', folderSimilar: 956354185396226}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'random', folderSimilar: -3829481651306497}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/list', {list: 'highest', folderArtworks: '1Xv0#&tFuV'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'recent', folderArtworks: 8109308982067202}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'recent', folderArtworks: 2201875600375807}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/list', {list: 'highest', offset: '##Gl]O&'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/list', {list: 'random', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/list', {list: 'recent', offset: 82.08}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'random', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/list', {list: 'random', amount: 'dnQmiVZ9A@*mGu'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/list', {list: 'recent', amount: 95.9}, 400);
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
					await get('folder/search', {offset: 'ilChR#MAUC6s8POQA6%&'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/search', {offset: 84.75}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/search', {amount: '[pWj%J@HqRy'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/search', {amount: 20.84}, 400);
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
					await get('folder/search', {level: 'xA)k5b'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/search', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/search', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/search', {level: 64.8}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/search', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/search', {newerThan: 'JUzdUXQ#2gTpsBcH3PB)'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/search', {newerThan: 85.55}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/search', {fromYear: 'U8FKXj'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/search', {fromYear: 86.68}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/search', {toYear: 'mbV(tLN%kXxn'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/search', {toYear: 4.97}, 400);
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
					await get('folder/search', {sortDescending: 'Vwoa17nyM!)w0qVOIC'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/search', {sortDescending: -6136651671666686}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/search', {sortDescending: -5506366370217985}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/search', {folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/search', {folderChildren: '8OPdAP7FBLUMCIi%aGw['}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/search', {folderChildren: 8447703574904834}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/search', {folderChildren: -4156247334977537}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/search', {folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/search', {folderSubfolders: 'YoXqs1P'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/search', {folderSubfolders: 2864853416935426}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/search', {folderSubfolders: -8946753030062081}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/search', {folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/search', {folderTracks: 'Dm[4&6$gmRV&ZB4yiA'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/search', {folderTracks: -8336437225193470}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/search', {folderTracks: 1302910486970367}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/search', {trackMedia: 'QK2UpF4ZW)hi@4!UGToO'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/search', {trackMedia: -829046300606462}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/search', {trackMedia: 2600235851317247}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/search', {trackTag: '7DN8p$@gt'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackTag: -2985175080239102}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackTag: 2800530929745919}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/search', {trackRawTag: 'm5M^zpRs'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackRawTag: -4098593363329022}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackRawTag: 5098654465523711}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/search', {trackState: 'k@%#JK9e]1Sf#k6avGj'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/search', {trackState: 6795122284953602}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/search', {trackState: -3625888390316033}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/search', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/search', {folderTag: 'wxbZp'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/search', {folderTag: -3142801080451070}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/search', {folderTag: 276158914494463}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/search', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/search', {folderState: '&(j^wJ(NWPmrRa[kz8^'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/search', {folderState: 3127563291459586}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/search', {folderState: -1993870376173569}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/search', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/search', {folderCounts: 'kzhCgAVC'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/search', {folderCounts: -1676428538019838}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/search', {folderCounts: -7778102893608961}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/search', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/search', {folderParents: '7lDvp'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/search', {folderParents: 1088467664633858}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/search', {folderParents: -4404616477278209}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/search', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/search', {folderInfo: 'Dq7)A2ng@z$kBkGE'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/search', {folderInfo: 2658806316138498}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/search', {folderInfo: -7916503030562817}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/search', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/search', {folderSimilar: '#glZ4*9O'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/search', {folderSimilar: -1736517886148606}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/search', {folderSimilar: 3183698438520831}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/search', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/search', {folderArtworks: 'Mskx*'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/search', {folderArtworks: -2618234222149630}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/search', {folderArtworks: 1002950994427903}, 400);
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
					await get('folder/health', {level: 'TPko]OMmoOpZP'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/health', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/health', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/health', {level: 55.07}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/health', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/health', {newerThan: '$pSKe8E5tO'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/health', {newerThan: 8.66}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/health', {fromYear: 'H@CkGQ'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/health', {fromYear: 22.83}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/health', {toYear: 'hzCmH!PD'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/health', {toYear: 73.93}, 400);
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
					await get('folder/health', {sortDescending: ')1E7HKfvn4'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/health', {sortDescending: 1048493695172610}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/health', {sortDescending: 10115365208063}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/health', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/health', {folderTag: '%qj!Pi'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/health', {folderTag: 7555410416369666}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/health', {folderTag: -3060887959109633}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/health', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/health', {folderState: '4jnk)rwdROl#CsC'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/health', {folderState: 8260341423144962}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/health', {folderState: -4456058936360961}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/health', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/health', {folderCounts: 'BBFlS$'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/health', {folderCounts: -5689405163438078}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/health', {folderCounts: 4414656206602239}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/health', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/health', {folderParents: 'x[[Dm'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/health', {folderParents: -4223600403939326}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/health', {folderParents: -660525704806401}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/health', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/health', {folderInfo: 'bq[y4i!Dv'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/health', {folderInfo: -2242518154477566}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/health', {folderInfo: -5786516441792513}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/health', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/health', {folderSimilar: '2T9K6'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/health', {folderSimilar: -803234151137278}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/health', {folderSimilar: -6006731255578625}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/health', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/health', {folderArtworks: 'AjOe$Ro6!b'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/health', {folderArtworks: -7104983149314046}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/health', {folderArtworks: 5718929452302335}, 400);
				});
			});
		});
		describe('folder/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/state', {id: 'L8thj9&)jTL4C('}, 401);
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
					await getNotLoggedIn('folder/states', {ids: ['3bsPNH4^tmU1M4t&vqi', '6dO[fW2cUvR$mRG4]K']}, 401);
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
					await getNotLoggedIn('folder/artist/similar/tracks', {id: 'z*2LsAF'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '7HfYP#3T(!', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: '*z(zC0yDp', trackMedia: 'ieg%nJ^Hpff741MRD3F'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'wHqX3%', trackMedia: -5675206278381566}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'TiOMv6H%(', trackMedia: -8947711394971649}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'egF8^Cpo', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'HL8r22$(KDk!%7', trackTag: '109O@0%SDgB]BE1'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'ymRaMOSfh6b%dXr', trackTag: 1632985031901186}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'CJHZI4l$(O1Sd2KBU1fq', trackTag: -2844056275124225}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'vD2nEhxJ7M5ghV#', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'esd3Xz', trackRawTag: 'E%UkDW@0i#eq8Q'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: '[mB@pb@E37', trackRawTag: 8680299768578050}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'PQxR#o4uMXLz)LV&', trackRawTag: -4282352473735169}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'm95yaX!QXnWY', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'uxPXTXQDRZ*9U', trackState: 'qUdI4#BJIn'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'BuNQ)d^0I(&WdDUv', trackState: -608998264930302}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'ePzrUXi8M*ZI1@tH*2!r', trackState: 5613424801218559}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'GYAJ^ftBHC%Y8nZK', offset: 'ZNeBm'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'QcH#K', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: '05OElX%d!wm', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Sue*vcHWXO]IH1Y8i', offset: 75.94}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'YuDrQn^CHqaiOs', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'XsNcTU@Z', amount: 'op5o1O34CHjkL('}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'aBX%5p#pe7I', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'x@6EpFl3RLWp*jE', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: 'C]7QF', amount: 99.92}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'IV8QKW%$A54Tu', amount: 0}, 400);
				});
			});
		});
		describe('folder/artworks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artworks', {id: 'wUPFNEX)BNcP3ZdAgB*'}, 401);
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
					await getNotLoggedIn('track/id', {id: '*CB6JU#nl1x'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/id', {id: 'HQe8Ytphe)eWb1z6', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/id', {id: '@S@Qatj$NIgrbSdN[(Zs', trackMedia: 'vFU$Y^XG%u1YPgM'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/id', {id: '6uawmZ', trackMedia: -2351167896027134}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/id', {id: '&5zkLZ', trackMedia: 8720021366767615}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/id', {id: '6pegHi4PGH@', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/id', {id: 'Cha(XO8', trackTag: 'IW8GZ5DvS^5NF'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/id', {id: '$2OCuiwGV8&F', trackTag: -8002108863283198}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/id', {id: 'M!70R%y6', trackTag: 1888021108490239}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/id', {id: '3X@i&*eC(J$^k^XT', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/id', {id: 'da7*2Pxd3cv(V', trackRawTag: '(U39yeg4&#S'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/id', {id: 'OX[x@)*JQ9668', trackRawTag: -6535777450196990}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/id', {id: '9#BL[5V7vN7Wmxx4HL', trackRawTag: -6630391444144129}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/id', {id: 'CQDK9BeXZIHFgw', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/id', {id: 'I#t9K(', trackState: '#SOm5cCaVC'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/id', {id: 'xqGU@^t1imnyu', trackState: -4106166397304830}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/id', {id: 'n!eR$od&wu&0Ua', trackState: 1416227360604159}, 400);
				});
			});
		});
		describe('track/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/ids', {ids: ['TQjGfetIxHWP6(vsWKq', 'oSEFNcCmjU25i']}, 401);
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
					await get('track/ids', {ids: ['mNDDV', 'g2YY(vc'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/ids', {ids: ['Wokh#Yh22EUsH3kGSG7F', '*uk*liDorXV'], trackMedia: '9ojJYJwqmoET4pBcftV'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['bprcBQ1xrb', 'qSufcn'], trackMedia: -7983962144112638}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['Kz[&Y6', 'gz(w0r1^vCXcQ)Y'], trackMedia: -1652160525762561}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['%HN)mkwDk*', 'w9#Kp[0wv*BrFF^q&XN*'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/ids', {ids: ['J$lktq64KL59mLMb1(', 'H1dmnci%]S!VG'], trackTag: 'ESCT$U4USjYg*h4QRwj'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['ivmdN]I', 'gO2v#5e96quy44[9ghqH'], trackTag: -5771841373208574}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['T]4USfJeP*[MX!aFVB!', 'ABfhA'], trackTag: -860352224952321}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['A)iJ0UDf@T9o6X3^', 'uqEswW'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/ids', {ids: ['@(u2&2za0a7K&', 'RGi@%VTn@vJ*eJ]Off'], trackRawTag: '^bdP]9WV'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['0Kf!R[', '(Cfo3*#('], trackRawTag: 2829656344494082}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['eG0^D]LKZZ#8SPP3]', '&$i9l#FhEJbh)XQqGxx4'], trackRawTag: -4557258625122305}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/ids', {ids: ['UEaQS7][', 'PGH$R5D98Wyg[xhZVQ'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/ids', {ids: ['!q6kmX', 'b6BB*4IRsLZ'], trackState: 'qD[w%7d7L]nShzq&r]('}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['fII[DOzg', '2oX2$Ux'], trackState: -8159297410170878}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['3zmOXP9i)(', 't5aHeuQ'], trackState: -5754640180183041}, 400);
				});
			});
		});
		describe('track/rawTag', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/rawTag', {id: 'co]%QlK0'}, 401);
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
					await getNotLoggedIn('track/rawTags', {ids: ['S]9h(^b)u#@W', 'XDSt(Ynh^']}, 401);
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
					await get('track/search', {offset: ')!AlPsOWZOc5a*X5X'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/search', {offset: 41.67}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/search', {amount: 'iDv)SK72z23SS@'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/search', {amount: 24.76}, 400);
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
					await get('track/search', {newerThan: 'x]sRUQODG'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/search', {newerThan: 92.89}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/search', {fromYear: 's%Ymx)h]'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/search', {fromYear: 18.44}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/search', {toYear: 'uuUFCgK!9m1T@x'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/search', {toYear: 95.56}, 400);
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
					await get('track/search', {sortDescending: '$z@w2XiN*dj%e]L'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/search', {sortDescending: 1188653804027906}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/search', {sortDescending: -1686955226038273}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/search', {trackMedia: '!sJrQ'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/search', {trackMedia: -4655602471010302}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/search', {trackMedia: 589280447561727}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/search', {trackTag: 'P4xTRK0%gPgmz$i4H#'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/search', {trackTag: -8471849776185342}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/search', {trackTag: -928897512243201}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/search', {trackRawTag: '%w^Xi2*n68Px25ky'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/search', {trackRawTag: 3386863071002626}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/search', {trackRawTag: 7560676088217599}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/search', {trackState: '[[McWGpp(LN6qPV'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/search', {trackState: 6345518288470018}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/search', {trackState: 6792845427998719}, 400);
				});
			});
		});
		describe('track/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/state', {id: '2CvgQeC'}, 401);
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
					await getNotLoggedIn('track/states', {ids: ['PKb]W]', '2BnpH&U1VVAmK^C']}, 401);
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
					await get('track/list', {list: 'faved', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', artistID: ''}, 400);
				});
				it('"albumArtistID" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', albumArtistID: ''}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', parentID: ''}, 400);
				});
				it('"parentIDs" set to "null"', async () => {
					await get('track/list', {list: 'avghighest', parentIDs: null}, 400);
				});
				it('"parentIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', parentIDs: [null, '']}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', childOfID: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('track/list', {list: 'frequent', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', rootIDs: [null, '']}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('track/list', {list: 'random', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', genre: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('track/list', {list: 'recent', newerThan: 'Vh5mnhHG4XGYl'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/list', {list: 'highest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', newerThan: 58.18}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'highest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/list', {list: 'faved', fromYear: '72ZNwhv[t[##BgIm'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/list', {list: 'recent', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/list', {list: 'random', fromYear: 28.09}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'avghighest', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/list', {list: 'random', toYear: 'gT^X%8N%spY5y)IYne@%'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/list', {list: 'faved', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/list', {list: 'highest', toYear: 83.42}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'highest', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('track/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('track/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('track/list', {list: 'highest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('track/list', {list: 'frequent', sortDescending: '5%@]5$B^'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/list', {list: 'recent', sortDescending: 7772249339723778}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/list', {list: 'highest', sortDescending: -8995522916384769}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/list', {list: 'frequent', trackMedia: '^KTdq!B5rjaXekjfx'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/list', {list: 'random', trackMedia: 1622864931323906}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/list', {list: 'faved', trackMedia: 3537141158117375}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/list', {list: 'random', trackTag: 'lXY*71o[bPK1oVB'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'avghighest', trackTag: 3160418663006210}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'recent', trackTag: 3800255984304127}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/list', {list: 'frequent', trackRawTag: 'U0ROval(6V'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'frequent', trackRawTag: 6397670134382594}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'avghighest', trackRawTag: 8060269859176447}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/list', {list: 'frequent', trackState: 'jg(#fH@^wxJc'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/list', {list: 'faved', trackState: -4321757448110078}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/list', {list: 'avghighest', trackState: -5097324560777217}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/list', {list: 'random', offset: 'Kz1(]NDHOV[3JUJfnIIU'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/list', {list: 'frequent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/list', {list: 'highest', offset: 28.83}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/list', {list: 'recent', amount: 'rL0Z8'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/list', {list: 'recent', amount: 91.46}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/list', {list: 'highest', amount: 0}, 400);
				});
			});
		});
		describe('track/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/similar', {id: 'oW0Lcm4UmC3P'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/similar', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/similar', {id: 'Z#D2]DjFgT*LzUd', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/similar', {id: '5D@&F8dCMkKx6TGL6KC', trackMedia: 'uc)PPlk00e(IRv*!Mb'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'Y)!))fx[E!y7a', trackMedia: 2111935260655618}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/similar', {id: '5&bLx!Y&(g8%SzPjO2L$', trackMedia: -2457540851924993}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'Oc1hs09TU[a', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/similar', {id: '$u2RuwH5Nsv', trackTag: 'W$(DmbplIVHVCE)uX'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: '0cGMM6Q[lUhsxRVZpdZy', trackTag: -2651839170347006}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: '0shYHbc[z%qnXIP@9usf', trackTag: -664895846612993}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'aA*i$YWi#e', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/similar', {id: ']HPGP', trackRawTag: 'If[^Ohi(9hQ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: '1cyrlKdCRXZ[P%JPXfoO', trackRawTag: 6786573249019906}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'au0@4wf[voYWxOj9Pnf2', trackRawTag: -6758272665124865}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/similar', {id: '0rKL[A[Fk4R#2UN', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/similar', {id: 'LnUrCk1F', trackState: 'DvAO6Sd!$l1i'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'JJ(8!yh%', trackState: 3897354394533890}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/similar', {id: '(6V!bohbQ)@3*6cU', trackState: -5310386161057793}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/similar', {id: 'dZjmOnCq$txePi', offset: 'NklOtTt1'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/similar', {id: 'soo&z]', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/similar', {id: 'Rq9yoF#EgVVk*dUH0y', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/similar', {id: 'q$^RRA^rXfFZNKJC', offset: 38.31}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/similar', {id: 'go)UX8%mUYGwv54', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/similar', {id: ')7hWkh!NG$z&AU', amount: 'ti5fBICB2DE0'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/similar', {id: 'ZYc2iA#0BBu8Ca', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/similar', {id: 'm^D6(7LtG', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/similar', {id: '@thCu^Wh#AKU5Zv2!Ag', amount: 50.32}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/similar', {id: '%ek9(J2', amount: 0}, 400);
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
					await get('track/health', {media: '&]CGQ!S['}, 400);
				});
				it('"media" set to "integer > 1"', async () => {
					await get('track/health', {media: 4360282029686786}, 400);
				});
				it('"media" set to "integer < 0"', async () => {
					await get('track/health', {media: 900088910053375}, 400);
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
					await get('track/health', {newerThan: 'B#T!uEiJ&YhAt'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/health', {newerThan: 15.96}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/health', {fromYear: '7qM)$wJc5'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/health', {fromYear: 52.66}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/health', {toYear: 'rU@V#AQIVGDI@pG6aUc('}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/health', {toYear: 95.47}, 400);
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
					await get('track/health', {sortDescending: 'A4T$5'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/health', {sortDescending: -8289316820221950}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/health', {sortDescending: -3640751367913473}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/health', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/health', {trackMedia: '3C]qKmE7b]'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/health', {trackMedia: 2621244860006402}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/health', {trackMedia: -3006519960403969}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/health', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/health', {trackTag: 'nGtkSpx5RIMW4j9[!Ij*'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/health', {trackTag: 3807335675854850}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/health', {trackTag: -2057010174492673}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/health', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/health', {trackRawTag: 'FDdLb*pm4J&fUlbl'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/health', {trackRawTag: -895521384300542}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/health', {trackRawTag: -2801345337753601}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/health', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/health', {trackState: 'P)AFHEOx*'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/health', {trackState: -7963007921422334}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/health', {trackState: 1070713867862015}, 400);
				});
			});
		});
		describe('track/lyrics', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/lyrics', {id: 'IQFo7uhnPd4Il^b8Zp0&'}, 401);
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
					await getNotLoggedIn('episode/id', {id: 'rzvuxp#EATrwd^Kx'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/id', {id: 'MdSvspfG!', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/id', {id: '8]&4h3&jE0CF%(S', trackMedia: 'eNGAV^P[6lhL'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'z%09e*D', trackMedia: 2481348803559426}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'e#brbL%$GhB7OC*yGoOl', trackMedia: 640943803858943}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/id', {id: '^WsFQ1@6(WxkcH', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/id', {id: 'y6x3Bl*AV3#15Sjz', trackTag: 'AwicUFKj]kxX'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'Hz9]PmS', trackTag: -6265574942310398}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: '7&qPPvY*IRfxK[iu(', trackTag: 3852346064895999}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/id', {id: '$(ETC8Yw3#rqX@i', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/id', {id: '41d2^53&yzQ(TKw%*k', trackRawTag: '7rn(AE3^XjWAq2Wo&Qz'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: '9J9shQ6cqx^mHru', trackRawTag: -3309839929311230}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'Rmy[FY[]opd*cj5%y', trackRawTag: -3467729365368833}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/id', {id: 'kzi]*Z&j8#hgJ[', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/id', {id: '@TvM8[', trackState: '%pfH3GUNtG#9i5k]'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/id', {id: '@XQF*$[', trackState: 439410457837570}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'WK*THhRNj', trackState: 1910640658612223}, 400);
				});
			});
		});
		describe('episode/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/ids', {ids: ['FINcm0ncpW', 'E1eMwJt[v']}, 401);
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
					await get('episode/ids', {ids: ['Az&Bq3ymOqLK#COprC(', 'rzBnR'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/ids', {ids: ['cW##CWnwmNO6Q8GyI', '5F97Jga%GIEO'], trackMedia: '42dBTQ(R'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['n(X3^4B57p[QF', 'oH5U88*^(y'], trackMedia: 786304837091330}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['dm39wJCcEt[yl2A)5ww', 'FPzhng$D$P'], trackMedia: -8997082832568321}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['6muwvTreMO7Bj7FPU!v^', 'MUVStDB'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['COFu[FdD', '3xy1%gRL!zi9zK#9%Yt'], trackTag: 'SXEcmFm0I2vZaw'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['Z0XEds', 'ii#WVDj8iQdp'], trackTag: -2307960428560382}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['kH%NSV', 'gEDJH0YCe]9QAKOqx'], trackTag: -2887958554214401}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['NXpc&JM&lq082rd', '3LmTox4]Ehw(PkjHX'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['xLqazjZUQ$qx', ')g#w[Tf'], trackRawTag: '2d%kgeXi!mBFrlZp0'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['THKQ9y', 'K[UM#E9ixNTyGmten'], trackRawTag: -6141858585509886}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['VlQhxvrP*LRC', 'PF*S]fBK^or!7hhLFDg'], trackRawTag: -523263692242945}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/ids', {ids: [']tzAPMut6dsD*', '$U31IDH!MZXAJw%^d'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/ids', {ids: ['^A4pi3g3rKNxu', 'PFgdDH&JdFEg8$'], trackState: 'MvwAHAP6S3a5MVE0BwX'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['fngx0', 'LMHu[rEqu9xh86XSD'], trackState: -8584886415785982}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['V)WvPX^', 'ZJIP[Eo)'], trackState: -8821066092773377}, 400);
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
					await get('episode/search', {offset: 'eEvpkdqO'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/search', {offset: 62.01}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/search', {amount: 'ztngPl0NC%N4jz'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/search', {amount: 85.1}, 400);
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
					await get('episode/search', {sortDescending: 'uz4[)tdab3Z&'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/search', {sortDescending: 7248187806973954}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/search', {sortDescending: 5973639832797183}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/search', {trackMedia: 'Z)*DFLf9J^@'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/search', {trackMedia: -5450084405739518}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/search', {trackMedia: -1253387739856897}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/search', {trackTag: '@TCs]irSS'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackTag: 4925788486893570}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackTag: 2636986972110847}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/search', {trackRawTag: 'Vc410X'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackRawTag: -5785989301665790}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackRawTag: -7847773709795329}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/search', {trackState: 'EceyDYqgl'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/search', {trackState: 5131416308285442}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/search', {trackState: 8428842490265599}, 400);
				});
			});
		});
		describe('episode/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/state', {id: 'Etk@$x3PBwAK'}, 401);
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
					await getNotLoggedIn('episode/states', {ids: ['6K8ghbtzQ7SNH$j(no%', 'udoW@I8W6*M)4wO1N5r']}, 401);
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
					await getNotLoggedIn('episode/status', {id: 'SaH#WOX)pbLpR[Bt'}, 401);
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
					await getNotLoggedIn('episode/list', {list: 'recent'}, 401);
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
					await get('episode/list', {list: 'avghighest', name: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('episode/list', {list: 'faved', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('episode/list', {list: 'random', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('episode/list', {list: 'highest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('episode/list', {list: 'avghighest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('episode/list', {list: 'random', sortDescending: 'ssnlCgh*hg%e5R'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'highest', sortDescending: -5385463527374846}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'faved', sortDescending: -626634889625601}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/list', {list: 'recent', trackMedia: 'leqx)ctRw45@6)Hz'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'recent', trackMedia: 5913596215164930}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'highest', trackMedia: -2361950465949697}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'avghighest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/list', {list: 'faved', trackTag: 'px]rF'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'highest', trackTag: 484317553754114}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'frequent', trackTag: 1342257173102591}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/list', {list: 'highest', trackRawTag: 'q^er&kT$L6'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'faved', trackRawTag: 312574243504130}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'avghighest', trackRawTag: 283888505061375}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/list', {list: 'avghighest', trackState: '*SnXGw'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'faved', trackState: 8032343994400770}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'recent', trackState: -5759483112325121}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('episode/list', {list: 'avghighest', offset: 'pm])YdH@E%Cckds6jL'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/list', {list: 'recent', offset: 1.21}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/list', {list: 'avghighest', amount: 'q0XBT*RIP'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/list', {list: 'recent', amount: 49.64}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('episode/list', {list: 'random', amount: 0}, 400);
				});
			});
		});
		describe('podcast/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/id', {id: 'mdDJ[m(D'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/id', {id: ''}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/id', {id: 'WNtm(', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/id', {id: 'ewAmq28S$', podcastState: 'VQeC$*WG6E7'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'PESLo!B0j15YIv)vsR', podcastState: 8332303965093890}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '1#]uG%zyld!jJ6Q4', podcastState: -1053312283574273}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/id', {id: 'o$OIy8f12Y3', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/id', {id: '$T7t%f[BzWCdp', podcastEpisodes: 'VH3pSCFXTP'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'phvU^4vJItSGV', podcastEpisodes: -4558973856382974}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'n5bQ6y*&j)!A', podcastEpisodes: -1000699261353985}, 400);
				});
				it('"podcastEpisodeCount" set to "empty string"', async () => {
					await get('podcast/id', {id: 'oKQ7k', podcastEpisodeCount: ''}, 400);
				});
				it('"podcastEpisodeCount" set to "string"', async () => {
					await get('podcast/id', {id: 'y^%3Qe!]DZ', podcastEpisodeCount: 'V7Te[OWp#5DI'}, 400);
				});
				it('"podcastEpisodeCount" set to "integer > 1"', async () => {
					await get('podcast/id', {id: '#j4Ue4hF8e0)ln1@', podcastEpisodeCount: 3418315259117570}, 400);
				});
				it('"podcastEpisodeCount" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'oQbL5T]n5fh3DjFYDY', podcastEpisodeCount: 4848823549558783}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/id', {id: '80sZC0f2OE&5R', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/id', {id: 'PsYy8ULd%fvbk19x[Sl', trackMedia: 'D5Ow0'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'UPvYfXrqYv!5JyV', trackMedia: 5699319533404162}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'drL8&a5l)pAKrMaJS', trackMedia: -8860358580109313}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/id', {id: '%2F8t', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/id', {id: '5FPAf1xQ%5v84uF@9Ou', trackTag: 'jR&ADjcR]u7AwQOo'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'eIKgarNs[x]u', trackTag: 8540527137914882}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'sXBu5rLy8$MB', trackTag: 4648845900251135}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/id', {id: '!3*rJF', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/id', {id: '!kHCjX2l)', trackRawTag: '0Ve4ev'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'q2$5l3wHejHMD!', trackRawTag: 2787242032496642}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'qAPeUUQnJFJK', trackRawTag: 5077097701703679}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/id', {id: '$8mDwtoDD06XJJFS', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/id', {id: 'wAlUiH%', trackState: 'xe1ap'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'zvRaNUdGDMyI6ce1', trackState: 5058144396902402}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'LJy$EI]4$t^Ti)2O[[Gx', trackState: -5057631886508033}, 400);
				});
			});
		});
		describe('podcast/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/ids', {ids: ['ZnO$]xB[q$BncT0JjzK', '17dpr']}, 401);
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
					await get('podcast/ids', {ids: ['x*BjPg7[', '7W8!^z'], podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['u7c0]Zvkn', '%X%tA]KH'], podcastState: 'fo5nN7sfU#I'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['D!GUAeAGnvOH4Kq@2', '#A&XtVyks$AFvokV'], podcastState: -5230258278105086}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['wURafQk6n2yXO4azlB', 'qBj7u2Xq'], podcastState: 8902488564432895}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['UrBO4AqG3FS3qzq', 'M5$dbw%RAVz'], podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/ids', {ids: ['8k!xL)@', 'U6dv^5fn0t@mYL'], podcastEpisodes: 'p(dGc#HNgxPgIDaNZrpn'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['#23yiDYYa$Pg', 'YlL0JR)LJL^cWt*JktWN'], podcastEpisodes: 7029606687178754}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['RI285UN]6VewT[T7LS[', 'SLJ6UUQMZ%@c1n'], podcastEpisodes: 5317028470587391}, 400);
				});
				it('"podcastEpisodeCount" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['55QTVC[bQDkE5gzyj9rb', 'eJ1Ye&Ra4vP'], podcastEpisodeCount: ''}, 400);
				});
				it('"podcastEpisodeCount" set to "string"', async () => {
					await get('podcast/ids', {ids: ['CeZXH3!)6e)9BX', 'CL8FB'], podcastEpisodeCount: '9k*vG72S9dUrw)'}, 400);
				});
				it('"podcastEpisodeCount" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['o9G]Iy)9%A', 'H]g!y#R'], podcastEpisodeCount: 7141090532524034}, 400);
				});
				it('"podcastEpisodeCount" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['mM&SGgeFavttyI6XQ9cY', 'Q!j&&S[$BM2'], podcastEpisodeCount: -4069726099603457}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['Kj]OG', 'm6mNF1gjS'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/ids', {ids: ['IhEna2qen^9kiN)', 'MO$O6D^ZL@NTu[x%Q]'], trackMedia: 'JwA8f'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['mhOJAJXnu', 'A(rB3!0'], trackMedia: 6455049978904578}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['V[m!$TYlAzla)', 'X5K9IUSEmtV)('], trackMedia: 1166837102411775}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['G2hmG)', '%vD*Wh2sct%l'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['A4nrcru1x', 'tJd2y^!y#r'], trackTag: 'xPSYphy'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['[albW3L(1OY', 'xgz&RbngT6['], trackTag: -2086808422711294}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['fzO5Lg^jdgX8@vSyJW', '*myBt(EaSKaNVV3xpos3'], trackTag: -3240781829636097}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['[Q)zIUY^tvo[nUB', 'k4VIBZSNHD'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['x1j5WVIcIc', '#&VDp'], trackRawTag: '(eX0G$yWM8NrwiYTd5'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: [')4#bdafZlDA', ')rx3!EUDNjFR2(mT'], trackRawTag: -2506841816825854}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['B@!#hHt8AU5v', 'QPYaRt5GkvyuR'], trackRawTag: 3553485547110399}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['fzenbH2#Acf%LIc8O', '6K#2A$&'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['js6ICjdVCe*', '!)G0RrjkhC1ca@HWQA8D'], trackState: 'jbW0$[k%usf5Q6B'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['#tP5HBK2[olnz', ']FB8zN1dQ!Sn@Sf8K%'], trackState: -4283456397770750}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['KI9CzWkD8', 'HOa3(bcJm(RAK8'], trackState: -3195377012441089}, 400);
				});
			});
		});
		describe('podcast/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/status', {id: 'eLLoXak5'}, 401);
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
					await get('podcast/search', {offset: 'Vw98P*vWyPcn'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/search', {offset: 92.68}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/search', {amount: '!CCQTZan6'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/search', {amount: 28.47}, 400);
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
					await get('podcast/search', {sortDescending: 'U%O&P0'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/search', {sortDescending: -3033445311709182}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/search', {sortDescending: 7999868584853503}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/search', {podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/search', {podcastState: 'PY*jlQL('}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastState: 8770791642497026}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastState: 8443025214668799}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/search', {podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/search', {podcastEpisodes: ')C#AuF'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastEpisodes: 8974882209529858}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastEpisodes: -4938219015634945}, 400);
				});
				it('"podcastEpisodeCount" set to "empty string"', async () => {
					await get('podcast/search', {podcastEpisodeCount: ''}, 400);
				});
				it('"podcastEpisodeCount" set to "string"', async () => {
					await get('podcast/search', {podcastEpisodeCount: '3B8ZF@Q'}, 400);
				});
				it('"podcastEpisodeCount" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastEpisodeCount: 5686032129327106}, 400);
				});
				it('"podcastEpisodeCount" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastEpisodeCount: 8805767947747327}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/search', {trackMedia: 'MQo#pX4ac@WiHjH'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/search', {trackMedia: -5365922403450878}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/search', {trackMedia: 1723300384342015}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/search', {trackTag: '0HR9X#QxsbYz8iX&'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackTag: 656127842844674}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackTag: 8277336591958015}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/search', {trackRawTag: 'U6vO0)rxsenvc'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackRawTag: 3106088786329602}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackRawTag: -4296260580278273}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/search', {trackState: 'Fa9xm[lck[QHLI'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/search', {trackState: -2715472768270334}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/search', {trackState: 2245498190692351}, 400);
				});
			});
		});
		describe('podcast/episodes', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/episodes', {id: 'AwjFV0ix$S'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/episodes', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'Y0Gq&[c', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/episodes', {id: 'Up#Co)3WTUhaWL7SYBmj', trackMedia: 'iPEoS2k)'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'A@mpWmv)Q$#Xb', trackMedia: 1705842164367362}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'nh%T]xy*p(ZjUOkl', trackMedia: 6259995083538431}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'j$[w%olLPiAf(frb', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/episodes', {id: 'VqA$)#Yb410WO', trackTag: 'qQ^a4WKMOfr'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: ']o#wf', trackTag: 7940696363237378}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'IKaF%', trackTag: -5546378163912705}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'pDlYw', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/episodes', {id: 'lSH&]fjL^', trackRawTag: 'i8or*ld!5XOIbWu'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'Aof[3MjoL!eJ*Ec#', trackRawTag: -4361289560227838}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: '!pD8]]', trackRawTag: 7901228440748031}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'V6aGd@xDZ27sVX4Hw&', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/episodes', {id: '9ShRm', trackState: 'Muf%VDH'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: ']9I1q]e2pxzkbP', trackState: -2488669470457854}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'XNZCiU7ccdcOS', trackState: -1706783454265345}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/episodes', {id: '0s9UStMgX0b6', offset: '09BLb'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'f$N*DAQuHk0GA8pIKoA', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/episodes', {id: '**^tXVIWFVc', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/episodes', {id: 'FrP^vdg^QTCWeb!JG#N(', offset: 54.68}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/episodes', {id: 'YeR[FARO', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/episodes', {id: 'w7eYa', amount: 'IJ*2#qINe8Oc^onJ'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/episodes', {id: '^3VGy%f86K@h&y(P', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'P^nmp]ABdmRXBbL', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/episodes', {id: 'qkYtH2l', amount: 6.65}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/episodes', {id: 'JO!yOn&@3g)mzghd0', amount: 0}, 400);
				});
			});
		});
		describe('podcast/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/state', {id: 'PoqHds2'}, 401);
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
					await getNotLoggedIn('podcast/states', {ids: ['^FlPqHtl0[YIuXEP@iq', '6T&^%vK#*']}, 401);
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
					await getNotLoggedIn('podcast/list', {list: 'frequent'}, 401);
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
					await get('podcast/list', {list: 'faved', title: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('podcast/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('podcast/list', {list: 'frequent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('podcast/list', {list: 'highest', sortDescending: 'FH6Ss(8pn'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'random', sortDescending: 5693862756483074}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'highest', sortDescending: 1715110296944639}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', podcastState: 'R4@)0C8UeOXjNuSzqR10'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'frequent', podcastState: 6155010408710146}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'highest', podcastState: -3868828094169089}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/list', {list: 'frequent', podcastEpisodes: '96(b$7s@j$TRJ]RpqtEM'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', podcastEpisodes: -7344395372199934}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'random', podcastEpisodes: 2804509357113343}, 400);
				});
				it('"podcastEpisodeCount" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', podcastEpisodeCount: ''}, 400);
				});
				it('"podcastEpisodeCount" set to "string"', async () => {
					await get('podcast/list', {list: 'frequent', podcastEpisodeCount: 'FZB4G'}, 400);
				});
				it('"podcastEpisodeCount" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'avghighest', podcastEpisodeCount: -6214413358989310}, 400);
				});
				it('"podcastEpisodeCount" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'random', podcastEpisodeCount: -2763337695756289}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', trackMedia: '5&XVkuLYQdfCb'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'random', trackMedia: -5049998555217918}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', trackMedia: -8598516129595393}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', trackTag: 'Udnm@NcxQd'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'frequent', trackTag: 592125871783938}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'random', trackTag: -3153863884406785}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', trackRawTag: 'zgZLZoJULNT'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'random', trackRawTag: 2164862075535362}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'highest', trackRawTag: 7309386942775295}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', trackState: 'ReBdoQLRMS)$i3'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'random', trackState: 5547549565911042}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'random', trackState: 4936563553206271}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', offset: 'haIJGDH3VZ[Kiw0'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/list', {list: 'frequent', offset: 90.47}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/list', {list: 'random', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/list', {list: 'random', amount: 'XYBZOXHKY[GWIPAnWt'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/list', {list: 'random', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/list', {list: 'frequent', amount: 33.8}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/list', {list: 'recent', amount: 0}, 400);
				});
			});
		});
		describe('radio/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/id', {id: 'OdUOnNsCEbHkgekez', radioState: false}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('radio/id', {id: '', radioState: true}, 400);
				});
				it('"radioState" set to "empty string"', async () => {
					await get('radio/id', {id: '9Nqmpq)@5YHn(i8bgoY7', radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/id', {id: 'K%xM^2S', radioState: '#X9IfqF@Xx0NJFV1A'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/id', {id: 'tEFzk', radioState: -4552594970116094}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/id', {id: 'yhlJv^jiboVRniJAf[E', radioState: -4644677789679617}, 400);
				});
			});
		});
		describe('radio/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/ids', {ids: ['gL@2nQ1R', 'd%aq$L'], radioState: false}, 401);
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
					await get('radio/ids', {ids: [']xLiC#Hg', ')zfibN6#]'], radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/ids', {ids: ['2@D#l1)]', '3X0zEZFlVDrFV'], radioState: 'M[3$0DI)0*2'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/ids', {ids: ['GB#*y08jVsfBUJ4hSZE', '*zxcyniC@ReVJa0r5%'], radioState: 3351992663539714}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/ids', {ids: ['1qStjT123JD5^o3i', '@^pbn1es1iDqJXAI7'], radioState: 7326160908189695}, 400);
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
					await get('radio/search', {radioState: '3pBLwd)%IlmBYOW'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: 4456340458045442}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: -855611285700609}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('radio/search', {radioState: true, offset: '$i1zAlEtS5)('}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('radio/search', {radioState: true, offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('radio/search', {radioState: false, offset: 84.82}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('radio/search', {radioState: false, offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('radio/search', {radioState: true, amount: 'iuQtU1J9XlExTOHx&'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('radio/search', {radioState: true, amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('radio/search', {radioState: true, amount: 84.07}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('radio/search', {radioState: true, amount: 0}, 400);
				});
				it('"url" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, url: ''}, 400);
				});
				it('"homepage" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, homepage: ''}, 400);
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
					await get('radio/search', {radioState: true, id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('radio/search', {radioState: true, ids: null}, 400);
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
					await get('radio/search', {radioState: false, sortDescending: ')t2VBXZge'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: false, sortDescending: -8924897677934590}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: false, sortDescending: -5765718511452161}, 400);
				});
			});
		});
		describe('radio/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/state', {id: '!ElzLf3HQmCB1K*l'}, 401);
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
					await getNotLoggedIn('radio/states', {ids: ['#0sreYSk9Tdv', 'I]038$mp@H9Ou']}, 401);
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
					await getNotLoggedIn('artist/id', {id: '$TXN5EPc2BFBs'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/id', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/id', {id: 'qSWaPPHbF', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/id', {id: 'vxGgxIw84mPY', artistAlbums: 'Di)a9dEX'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/id', {id: '&BXKEL[T$ca', artistAlbums: -8009689384091646}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/id', {id: '8Auwfs[y6f]2@Hgi[CK', artistAlbums: 5508897641070591}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 's)B]sfdXM^JN9I^@ouU^', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/id', {id: '&vwmj3)LTaW)w4g', artistAlbumIDs: 'P8k!$SS(OC'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'WPp(r1qS@jU27zAMr', artistAlbumIDs: -8025948947480574}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: '2Eai4', artistAlbumIDs: -8211570697961473}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/id', {id: '($T4CGe!MoDjzrNe', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/id', {id: '&V0ShX', artistState: '^m)%(Ep(zA4J'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/id', {id: '8$zFIT91w', artistState: 170857708126210}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'drl[UToR*@x@$FZrfZY', artistState: 6007257288409087}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'Ja5hl@k', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/id', {id: '9qurBszIZjK7ZPOa', artistTracks: 'ybw2T'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'xlOWjdVUie(h', artistTracks: 191143497170946}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'RUIrsNO', artistTracks: 3349675121836031}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'DgZg)[4de3VEp', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'VFf7&ngoP&P3jinx@', artistTrackIDs: ')g]$kmA[K'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'Kl(m7', artistTrackIDs: 4955596482674690}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'qsY6LPZbl4', artistTrackIDs: -3343037145022465}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/id', {id: '3jw!AS)&gR', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/id', {id: '6wC3o4M&YRSuN', artistSeries: 'sp*Z!(07*gp3]M*dr#'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'VFCAB9q@', artistSeries: -4349038069547006}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'bxD@F%b^7*X', artistSeries: 5467803167490047}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/id', {id: '7Y9Ou08hN]cbpRon', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/id', {id: 'nt3[@tgi', artistSeriesIDs: 'xb([b6MctrM&E^b'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'ZihEEAtJcSE1AIP', artistSeriesIDs: -2373045368913918}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: '*v9^6qbP5nbygGMMw', artistSeriesIDs: -755447296425985}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/id', {id: 'bSx3cmX0BxZB', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/id', {id: '3u9gjmBAVky0HKk', artistInfo: 'qeio(qa'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: ')DUOx4NjCSKv', artistInfo: -1170617873203198}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'yNiMmgaMph', artistInfo: -840618997710849}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/id', {id: 'P!RHGadtAkJvw9c)', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/id', {id: '%CO6N', artistSimilar: '125kkKU'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'KgfpnV]Rev&e%RxmdgoP', artistSimilar: -1307778572353534}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'Y362eDkgeGKy9bQ0p', artistSimilar: -4713282531229697}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'b@[5pmaYXPA', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/id', {id: 'd%fdMqqfp$rek0rbdM', albumTracks: 'f5(wPs7mBs'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'FDBbMbm7x1iR&v9EqB!', albumTracks: -4453798995034110}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'bhZD[xEw2Ww#kBrk[3mf', albumTracks: 5028003100753919}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'eOG^xHY(V3Y2wnG&9o^', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: '%%ZlHGuJWVY70%SC', albumTrackIDs: '41qTJotds^v)TBcy'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: '6jR3!Be', albumTrackIDs: 4217164231868418}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: '*Ovd^P', albumTrackIDs: 4146394168295423}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/id', {id: '5vTs7E#Gs!pn', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/id', {id: 'k[baLxhwyJonggA', albumState: '*&OYp#6qrHvRi'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'lQJpbWlSJ4R8RtCM3V', albumState: -4410409704488958}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'sU!^tJUVTrc', albumState: -5027181721812993}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/id', {id: 'O31n71&ElG6)', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/id', {id: 'JzhvbO@&%IUjwA', albumInfo: 'B1(m584zenRjW1m'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'ZQah&!0', albumInfo: 2422100446937090}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: '97]b#Kk%&zH(#BYQyD', albumInfo: 7160136388837375}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/id', {id: 'S%D#GBSmB', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/id', {id: '1d7&H9', trackMedia: 'kzhwq'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'QGRjypK1]u00im', trackMedia: -3523069108813822}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'bk(9*', trackMedia: 1414266657701887}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/id', {id: 'i7Gw)shY^]*zHFbvkdG', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/id', {id: 'mAn9mZG$ZF%MInQD9j', trackTag: 'S&5*IIXLQIi7Bu5&J'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'Izznyqw4pWTS75x8oo', trackTag: -2086254388707326}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: '3E@y)M$VF2N0cs', trackTag: -8024627884326913}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/id', {id: 'Ae%#Q2T&T2XCefTPq', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/id', {id: 'p#prUaJkSx2N(Zt02]]Z', trackRawTag: 'Th3^vVT'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: '1wkuQ9bDE8FbWq', trackRawTag: -2327094818242558}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'JVnK!N3jPSBfpyHoQ', trackRawTag: 5871856913481727}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/id', {id: 'Tk]4]l6PhRXIf5!%', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/id', {id: '*DqqLP^RZj@0r', trackState: 'rytlb2o[(&Sl4iI'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'jwoenya@W9jFA9Lb', trackState: -8318364380299262}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'MT(Br8u(TB880k', trackState: -4746958388330497}, 400);
				});
			});
		});
		describe('artist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/ids', {ids: ['@0TaThd&*BA!#Pf[yM', '^%ua0rA5VI9OJDh3t3']}, 401);
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
					await get('artist/ids', {ids: ['Luse0hS%fNROZH#TAnr', '@UT9oEhigoJ%)KyWl3'], artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/ids', {ids: ['Fbsnv(%Ite#r93uT%', 'E&RBg!Iyh85j'], artistAlbums: 'os^DRPI5Rm'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['7w#0DbLipd&jaM', 'YCw2CU*'], artistAlbums: -6775206018285566}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['1#7q)K0zPYi1J6', 'NByFSC4ZZ0$j0'], artistAlbums: 8878686921031679}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['u(KVknqRE1593', '%NdBWZcek^'], artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['7zo4Emb%KRbRZo', ')LI%V%!l7INFqS7@V!B'], artistAlbumIDs: '^m]9e$)Gd&6@7f0wXM'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['&1Bqsy49s', 'n(JBT07)#4k'], artistAlbumIDs: -2727224440520702}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['eZSu75Zx9IgF2BWu', 'ZD4iBgxJl9'], artistAlbumIDs: -8310028532449281}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['ThXijPy8d]mo', 'M#oyJPeWv'], artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/ids', {ids: ['F)itHRv)wWbTHLO', 'JyQ[H)^7l5zwqkMRGg'], artistState: '1XAxx%F%C(Hz4(Oy'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['nyB#P&YQLLP#]Hm@BI', '5LoSd9l#'], artistState: -3169957730844670}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['&jxmG4UDgB*yL28iF', '0&&6soN%'], artistState: -6183018318266369}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['Tje@ZciD', 'Lxy70R4DvS]lZ7&'], artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['QLm4A', 'asuB9ThiP&^KO'], artistTracks: 'lj7m9o4oa!E]#wkmRFs'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['tdr&uFkBNMok1SF!0', 'V%50P(ieNw8$3u6'], artistTracks: -1937164191399934}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['&9][0kENfCJ', '#69zzO0%J8sQe'], artistTracks: -4417088076644353}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['ZVS)aBc', '@G8COv4)Z#7u'], artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['fCfnrj3QOb', 'uu!W&31!l'], artistTrackIDs: 'ehdanJ##[1bmHlKl'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['uqRpbo1', 'cmt!@43b3HY9O!cGp&e'], artistTrackIDs: -5847373079117822}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['Cs2%j[Tt', 'zj!]ihtyN3#0VTa'], artistTrackIDs: -5480744470183937}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['8htdwpd7llXXftl', 'PexqRQki!PIn3OVuCO#'], artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/ids', {ids: ['t(&X%$#^o', 'ThPDylCKHza39'], artistSeries: '3#jKWovL0riwUyLUJE'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['n7fv68rRehxBWo(H^!', '4#Km2sF8'], artistSeries: 2512831744311298}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['NXgdy*Tv', 'Bx7oSPY%16(Z6QBp'], artistSeries: 6759338295164927}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['1M]4Qm&nXakEoO', 'csLXn3$Y&C#AyAmj'], artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['KlxuS*R', '4ljz^NG%d@)E!H&Gpzy)'], artistSeriesIDs: 'DnWUyp1ZQoD5ppBp!#YN'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['r%hVWXvwMJLA)ttWM)FY', 'V@Op2('], artistSeriesIDs: -8348993536917502}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['AK5n(4GR[BZCeTmE)', '^xXO*]L^'], artistSeriesIDs: 3767805291790335}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['SNJVpO337#', 'mV$o7Z'], artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['WDaVa48Sg6G', 'Cu*rj]hw@opV9)ia'], artistInfo: 'H@I2hoE8F([LSkdZpt'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['bCjoweZP7(b', 'CLA*CYe9LFO0lBdp'], artistInfo: 3801526061498370}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['sZf7D9', 'b(E*!@h0'], artistInfo: 2758450119442431}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['qUT#yMb$X]', '^!UEIs#[2L'], artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/ids', {ids: ['BERFc(h%v$VdEgl#', 'tCtbrr3%v(c&sars'], artistSimilar: 'Ux)1yTvq1rI%1A$!9sjL'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['Xc%$bT(3mrU', 'tK&3TvIij!z!'], artistSimilar: -7341892861689854}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['12hLhkUWH]3ybKew', '6UZaMpyh'], artistSimilar: 5618911559024639}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['lu057vD!5uHSFRBsI', ']RmWLUzKmvi3(J)PSS'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['l6I51cD', '7#PgX8qn08'], albumTracks: 'Ni^lK&9ao8'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['IHz]r@]1e1v]', 'Ky1NV1aZO7D'], albumTracks: 2680126844174338}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['W&ZOKUgDSN6G9y', '1oblsfW'], albumTracks: -8501536950845441}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['Oxq[Ghryp3szR4*bH2V', 'BGl2$5Ycq0bdV#SLqA%'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['0$axSpigLzGA#8', 'hB&5hGdyobgCaaF*WZb'], albumTrackIDs: 'hafxuV84hwyhkclNc'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['MRxKs$', '*SFuaQey3'], albumTrackIDs: -7160117497692158}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['hxvfLAxTADw!bt', 'L*Gl*M0W'], albumTrackIDs: 7890678604365823}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['qQ^ZcjDBP', 'WI%6eva8GK)6M@AG'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/ids', {ids: ['(H8Sc#[Qv0pbmd3GnG', '8rCHO@q0'], albumState: 'UjqFKLtHK)sPe'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['CKx^Bf', 'raO9YQ2RcNJ8]IiAnXs'], albumState: -5527621127372798}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['q2AO42e!qJ', '$d9V$@v'], albumState: -2808153326485505}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['KH$hmgmfcw]DC$5n7CkP', 'ne[s8*wIB6@'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['7)cJrLnHjXV9x)U', 'e2V0D@8pc[Oq0NcXsxCj'], albumInfo: '0yeB#6d6*d(2NGPnL'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['j!MILz[EO2n*g$', 'pF]yy8lC'], albumInfo: 6676383136743426}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['D5vbx!RQY[XHLG1t', 'buPCvCr1'], albumInfo: 8857213217013759}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['aW9aWjwS[mzoH', 'Sfvl8QL'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/ids', {ids: ['get5eb', 's(0Zurw1[Jm9Ae5'], trackMedia: ')J6icsD@48y&X'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['T8KK^Z', 's()85jn'], trackMedia: -7182358558015486}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['XT2XEuvdljI[4hor', '0KHfkB'], trackMedia: -2179546702938113}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['sOC5cq!^2s3s8n7Bxa', 'BU3D3HIsjlSQ8f'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['53o0A', 's&(0EMRE)ELM%'], trackTag: 'pXj$^r&aX0REVU61pG&Z'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['t(@kZ!pQODHjn%ro6U', 'yhn3pL!'], trackTag: 1143996751544322}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['A1IxPzhg', 'MVfL1rk1&OL(JkUrsS'], trackTag: 8536143591112703}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['njZ]ou', 'PJKdtlFKX^g3VwYBbD'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['mr%)P2#YRKv!Nf', 'o#3y9Yd7@'], trackRawTag: 'Q^vn$R'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['qdzg8Zh(P3TE64qbkzn', 'Es111O'], trackRawTag: -459813569953790}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['V[sJ[2*tb)UE]T#', '0Ra3i&'], trackRawTag: 6711273198714879}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['UO9Ko6PJqpos[CV*)JGP', ']e]7nn'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/ids', {ids: ['(&dcA5n', 'HLBfcCaDp]P@))Awx3'], trackState: 'QuNE5SS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['p9ZP##9$zN', '[[bUl)i'], trackState: -5406919267188734}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['!jxp1mSOQD39YmoGFA1W', 'hbi$9wXUc9DV3YZ'], trackState: 1112105734373375}, 400);
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
					await get('artist/search', {offset: 'l(StJ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/search', {offset: 65.78}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/search', {amount: '7yUl6ULR[f'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/search', {amount: 87.08}, 400);
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
					await get('artist/search', {newerThan: 'WVIxIBN%#j(H'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/search', {newerThan: 43.12}, 400);
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
					await get('artist/search', {sortDescending: '4^iAyohgppmxZKNvNc'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/search', {sortDescending: -6782052770775038}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/search', {sortDescending: 8772168410202111}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/search', {artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/search', {artistAlbums: ']eIrihhLJ'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbums: -1062897006411774}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbums: -8024507683962881}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/search', {artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/search', {artistAlbumIDs: '7^1d@C5AUaS1gi@bq'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbumIDs: 5122539554603010}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbumIDs: 8019137980792831}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/search', {artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/search', {artistState: 'jqEbAXxBuSUE^*C8dg%'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/search', {artistState: -7050727646035966}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/search', {artistState: -7467142890913793}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/search', {artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/search', {artistTracks: 'z)eom#CpcfVIBVXvr^7'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/search', {artistTracks: 4325441540194306}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/search', {artistTracks: -793399577804801}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/search', {artistTrackIDs: 'pBzgWR'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistTrackIDs: -7469254983024638}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistTrackIDs: 3809705868656639}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/search', {artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/search', {artistSeries: 'AkuAK'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeries: -6560496652124158}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeries: -4139176794521601}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/search', {artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/search', {artistSeriesIDs: 'w!eFjiCWUmRFT7eZjA'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeriesIDs: -1330222897037310}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeriesIDs: 5924892075622399}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/search', {artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/search', {artistInfo: '$*SZqTQM&c(h8EK58]'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/search', {artistInfo: 515456830013442}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/search', {artistInfo: -5081054767480833}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/search', {artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/search', {artistSimilar: 'G0v0AOsB'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/search', {artistSimilar: -4630337304920062}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/search', {artistSimilar: -2704235984584705}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/search', {albumTracks: 'UOV7Baw!1g'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/search', {albumTracks: -1964456644968446}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/search', {albumTracks: 3789942610198527}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/search', {albumTrackIDs: '$cyZb0AZE*L4@&Ebcj'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {albumTrackIDs: 4053199648456706}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {albumTrackIDs: 3491561375531007}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/search', {albumState: '8KJbpm87TN!gniG'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/search', {albumState: -3729566593974270}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/search', {albumState: 5389212702474239}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/search', {albumInfo: '45KZ*MS!MRPDkF'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/search', {albumInfo: 8993721278267394}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/search', {albumInfo: 4916048922935295}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/search', {trackMedia: ')XN%87Chx8zU66s'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/search', {trackMedia: 6349450838540290}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/search', {trackMedia: -2742090073112577}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/search', {trackTag: 'Nhi3Tf$gqXMV#c'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackTag: 6668714598465538}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackTag: -3529553506992129}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/search', {trackRawTag: 'zeNNo$'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackRawTag: -8263175040401406}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackRawTag: 2810576338157567}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/search', {trackState: '9T5*nS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/search', {trackState: 8893735295254530}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/search', {trackState: 5462503412727807}, 400);
				});
			});
		});
		describe('artist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/state', {id: 'QO$[]QE'}, 401);
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
					await getNotLoggedIn('artist/states', {ids: ['VsSP2@Xu!pxg*zWHgFP@', 't2pfLD5j^SMo']}, 401);
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
					await getNotLoggedIn('artist/list', {list: 'highest'}, 401);
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
					await get('artist/list', {list: 'frequent', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('artist/list', {list: 'faved', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'recent', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('artist/list', {list: 'faved', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'faved', albumTypes: [null, 'invalid']}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', genre: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/list', {list: 'recent', newerThan: 'TiiDq#7R)2c'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/list', {list: 'avghighest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/list', {list: 'random', newerThan: 52.92}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'faved', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('artist/list', {list: 'random', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', sortDescending: 'EuWab%cnJ4X)zP#sGcc1'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', sortDescending: 8243882596761602}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', sortDescending: 7037586149212159}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistAlbums: 'nUeuWBxLJSjA'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', artistAlbums: -1010941068050430}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', artistAlbums: -335355198832641}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistAlbumIDs: 'huKOQCH'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', artistAlbumIDs: 7268756954808322}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistAlbumIDs: -8784240112041985}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistState: '(HKoBKMfzw8Dw]EZU'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', artistState: 5554001135271938}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistState: 7364141656309759}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistTracks: '8(Q[P5&]n@G'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', artistTracks: 6003139291381762}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistTracks: -4765601050394625}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistTrackIDs: 'MDxGmdp9#IurdbS(7'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', artistTrackIDs: 2828526969421826}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistTrackIDs: 7337119999590399}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/list', {list: 'highest', artistSeries: '9e5axb'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', artistSeries: -3744643497852926}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistSeries: -4378942614011905}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', artistSeriesIDs: 'O%Ki^HM^UF5&M%'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', artistSeriesIDs: 6014314095837186}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', artistSeriesIDs: 7761785809534975}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/list', {list: 'faved', artistInfo: 'l&ln(1K'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistInfo: -2532410705051646}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistInfo: -939721228288001}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', artistSimilar: '8LvgWslaI*9NIGjc'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', artistSimilar: 3501814532014082}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistSimilar: 6674902652289023}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/list', {list: 'highest', albumTracks: 'xCqC1ze[89O0fwDlPK'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', albumTracks: -4123891031080958}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', albumTracks: -1956691390234625}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'highest', albumTrackIDs: 's%d84x4Ke'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', albumTrackIDs: 4421412563451906}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', albumTrackIDs: 7695679396773887}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/list', {list: 'recent', albumState: 'UOy5YrqwEAbD*@&JhU'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', albumState: -4861238286745598}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', albumState: 1368436072513535}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', albumInfo: 'Bw&29HGmV'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', albumInfo: 4868970586832898}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', albumInfo: -1105676176719873}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', trackMedia: '^$u3B#Q0(7Kw0H'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', trackMedia: 696561344446466}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', trackMedia: -8863846571704321}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/list', {list: 'faved', trackTag: 'BF8CQumhwK'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', trackTag: 4603113809903618}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', trackTag: 1829546005364735}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/list', {list: 'highest', trackRawTag: 'dTM0d$hzam('}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', trackRawTag: -2351640506007550}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', trackRawTag: 7781335036854271}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/list', {list: 'highest', trackState: 'NPd4p[eKPlWrhB$m'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', trackState: 299623797227522}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', trackState: -6687873944256513}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/list', {list: 'random', offset: 'xE8ul0'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/list', {list: 'avghighest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/list', {list: 'faved', offset: 83.86}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'random', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/list', {list: 'faved', amount: 'KDwQrHPuPl'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/list', {list: 'faved', amount: 94.42}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/list', {list: 'recent', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar/tracks', {id: 'CasW[oZs!e^HA4U'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'Gwi3vypY', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'w&4!]GqgQU[^Ikyi#s8d', trackMedia: '31a0[hMc8!hfyXTcP'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'WB7[oMIyvya1H', trackMedia: -1665834317512702}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: '*$Eqosh[YUV0!A', trackMedia: 887588445487103}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'e#v]CyW(k', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'M8p!$BUuxs]Gx6T9mHD', trackTag: '!bN2mR'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'Wcjdp$g@!ZR', trackTag: -3325881493749758}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'Hz0MSzV]@E2F)mm^Z', trackTag: -5872231372554241}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'e0iz8xA@c', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: '0J1E9Tq(', trackRawTag: 'JnPwg7qU!tI'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: ']p4jgMnF#uUY$[ce', trackRawTag: 2294546994036738}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'Dkt^o^T5!Z&n5z]v3i5Y', trackRawTag: -7114205152935937}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'iOM1rNeeHFy', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar/tracks', {id: ')5)&Vt0SlB*q', trackState: '8kfVl8wt5Ub$7wBWVDU'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: '*mk^y^Wiv0ou3avYG', trackState: -5554851538796542}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: '!hL4fOHL%%Y06D9juBzF', trackState: -7962693189238785}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'oKA^LGS(eJ', offset: '!OxpA()r4'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'm3g^5&kLXvh@Yzi^k', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: 'gAh)pN1LwyEOD', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar/tracks', {id: '6cJgaIUQ[T!yPLq^', offset: 73.2}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar/tracks', {id: 'F8ad3oPIKt', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'fnKJHs2KiYXmn)k%P18', amount: 'ztvlzSW'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: '%Ury5FLop#JCh6OVNz^K', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: '2aR1oG', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'Z1oU!R7', amount: 47.42}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar/tracks', {id: 'd*v]EdWmNkJ', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar', {id: 'yxNpFP#)u^S'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/similar', {id: 'HG(ERx%Lakvl', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/similar', {id: 'h^jXiJN', artistAlbums: '#V%&St!'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'f(UOI%4FK[8j', artistAlbums: -1618215469842430}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'zOppFKX*7CV9fMU2cx', artistAlbums: 1935990067298303}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: 'PBE6Nl1', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'kQzx*VTCFHz6r]$', artistAlbumIDs: 'BQ6m(WU#crsz)!x7v^'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '^CXbGc1pC', artistAlbumIDs: 6439342947958786}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '$1[%Sp5^', artistAlbumIDs: 4146689732509695}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Uv*USbVu', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/similar', {id: 'ZFu@X#', artistState: 'JMW&I5D))2jwxiEK'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'XeG4&v!MgZtfyFzmgz', artistState: -2254876759293950}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'jjLI[hK4waZ!', artistState: -1225784630968321}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'ymFe0Ihr]Vqc3', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/similar', {id: 'auayH5#mUPYC', artistTracks: 'f8vcnWy#x!*H7f0AoT@'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Yg#ojSiW63', artistTracks: -3989958444449790}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '#C67rSFuIH', artistTracks: 4040589804830719}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '0wpfm6B*nZ', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'oH3JYP5RS3u', artistTrackIDs: 'Ez$qm)Z^'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'xVwPza3sFdKI', artistTrackIDs: 8638833356701698}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'J!KPi8jLZ', artistTrackIDs: 6614117003558911}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/similar', {id: 'qlY]k9NfWgi$B8KWhKB', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/similar', {id: 'zm&sHtiKG4RRtq[', artistSeries: 'bazo)1!pshp1lNrVx7H'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '*c86UDXX', artistSeries: 635435244060674}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '(s4(o', artistSeries: -2863435029151745}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '*yojK', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/similar', {id: '4uAqYxWs%', artistSeriesIDs: 'w)vgz%uaPpQpzO6Qe'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'WT)9)', artistSeriesIDs: 2334095216476162}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '3sWRT8rM3Bx3C%P5EZuT', artistSeriesIDs: -7075722757668865}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: 'nF!m7&o0KhV)]vG4Z', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/similar', {id: '7hD]]Eeu@oBHKW', artistInfo: '0bTKJ#Xc'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'cSU96&9HjHJc', artistInfo: 5702302824398850}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '1rj&U*0vADrsfFbMW9(', artistInfo: 4551395210428415}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/similar', {id: '6(ug[IMRty6FaGu', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/similar', {id: 'TBccQq]EECJ6UlL!', artistSimilar: '#vk^%S6*'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'x92$]', artistSimilar: -4385777072996350}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'ZZUMDMJG', artistSimilar: 7262676900118527}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'PpRVzTq@', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/similar', {id: 'V@G6aHSM', albumTracks: '%t8RK'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'P6w#EcgVlBSrUojrb', albumTracks: -8110515884654590}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'A[hBy)[jQ%K8otolVi', albumTracks: 3146615565058047}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '#mkciRzyRbx', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'Bj5&Rycd', albumTrackIDs: 'ECR2n)!Nw%etSR'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'iZ0s&]sY', albumTrackIDs: 5768868920295426}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'SZInr1dp*z@', albumTrackIDs: -7514752007798785}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'bk03jUqGCnh@Z3(', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/similar', {id: 'boiHM)32Ht', albumState: 'Wtwnk[#)5An)VRIfUg'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: ']d3bHf', albumState: -7639127969234942}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '&g!hbK', albumState: 138802609782783}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: '$QM3j7ZM]CmEAQ4wo', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/similar', {id: 'CRF8&((5#ttypE', albumInfo: '^H1SlUmut4q'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '5x[oWP&@cjKWw', albumInfo: -2911306596220926}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'jSLfUp(SXG$CK02', albumInfo: 468022426861567}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar', {id: '[]Xih1Jl4c', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar', {id: 'FUfas9ktN5)trqD2', trackMedia: 'YDZ!sJ*H8^*#z'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '*u1pUN#R6oLmuS#k1#v4', trackMedia: 2021255481917442}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'L3grt#9YST*jRr', trackMedia: 5975308872187903}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar', {id: 'r$[nYoZWz7#T', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar', {id: '95i3p', trackTag: 'I1R6k6MFey&zScSYTC'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'yO!^EA6VfemL', trackTag: -6169878104899582}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'WB8qaM4BZTB6Na', trackTag: 7507684689444863}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar', {id: '@71SjbKCD2cL*]O', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar', {id: '$oTKEKtw)', trackRawTag: 'YfvizASV@o$H'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'f6W8i!ni[D', trackRawTag: -1662122618519550}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '3rBGC@AJGY60aqLt', trackRawTag: -8055504483909633}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar', {id: ']VtpI@^2H0Yk03pMA$t', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar', {id: 'yDoektn7vlVY7ZbK9BD', trackState: '%RW2dfOf'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'YpXosGm&V]Los3g', trackState: -8577376099237886}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'YpUqLi0wl)G1LV', trackState: -2042399010324481}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar', {id: 'BKUKQBuJ[d[&w[sn', offset: 'U*[hFRn1&TfD@7RVKKq'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar', {id: 'HVP%HrZ$qxH2', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar', {id: '3U94E[9zs2', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar', {id: 'zV$[#)!WqC3Jydd(h', offset: 28.49}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar', {id: 'y751BY!qb(fjWIClC', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar', {id: 'H8B)NMCCXj', amount: ']MT85P@#dQAz14KBx'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar', {id: '32Ox6dVlg@#l[2*^7', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar', {id: '8UU2@3m1suAi)s$U&6sL', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar', {id: '#8Ht)jN', amount: 77.97}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar', {id: 'ne7BlqF', amount: 0}, 400);
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
					await get('artist/index', {newerThan: 'ur5hwWA'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/index', {newerThan: 39.83}, 400);
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
					await get('artist/index', {sortDescending: '^u6NZH'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/index', {sortDescending: -2060409192316926}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/index', {sortDescending: 2099977090236415}, 400);
				});
			});
		});
		describe('artist/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/tracks', {ids: ['5m0)FB4X9Qk', 'dck[b']}, 401);
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
					await get('artist/tracks', {ids: ['FW4mJ', 'W&s]#%Ils#JmWR(y1(Ht'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/tracks', {ids: ['P1mNm(Q$&XqReg2d#', '[sL&T2'], trackMedia: 'JhGo5lA]EXe4Ld6%A^'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['8tDg@axK', 'g7]XWo!eSc'], trackMedia: -3992085896101886}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['$7@P%2eL$l2byXKV65[y', 'x@oTm]Q@*#e'], trackMedia: 3414448869998591}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['c@&69n', '[ZHio)xM'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['^%*0G)UeF(Oo]pl', 'RbSCplDTyEwB*bkje)!'], trackTag: 'W]slF7O%'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['P$^LdS%4P1QkA', 'OQMA23QUVkOqY'], trackTag: -580979320160254}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['3@4rfVXsqu', 'MIs(N3JD9'], trackTag: 4304808290811903}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['wfF@[bc6O**5#r$W', 'O$Dw64(*bGU@eX]!M5L'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['f($(hbqlO@#kz)', 'wO3IfoEF!RV'], trackRawTag: 'E2m1i$nA^#ZX['}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['8lnCQqb$FSRj0M', 'Ev#hxyZxHGzwznb6)'], trackRawTag: -8278851901718526}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['9yDZDdGPjFg', 'o30xz4Ma(Lec'], trackRawTag: -8304056632082433}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['vVhmw', 'GIuiDUR4&6@YW^NH@T'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/tracks', {ids: ['Xz!E$D6(0W@j6$A@1Z', 'guf1p^KS'], trackState: '(Pi^VxNG'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['&R0Q#1n', 'oS&P@LV'], trackState: 1674573510606850}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['WQKhpu6qdi#K', 'LKPnIqyj2LvNDVv!Lx%#'], trackState: 2540556009865215}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/tracks', {ids: ['NICbz4mx2*9*t', 'YaB3A)#pCJIk'], offset: 'vL&omTTyY^(l'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['uoK9m%N2PX3)NK$i', 'cUmn37Gpt$UBJ(Yy'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['fRRLdMy', 'Iip5]ow'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/tracks', {ids: ['GO#LjFBF', 'J@Xb^Ky'], offset: 47.71}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/tracks', {ids: ['4[1C)uQ', 'bt6Nucrd'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/tracks', {ids: ['2&Lz&8', 'z7iOZajF0m%C2f&G3W^!'], amount: 'ng@]C)vStW53'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['x*U#WOnb91eyHi$#Li5', 'MgaoSma*os'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['dQ^Skxn3Cj', '0okXL%jbIQqdsY%7'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/tracks', {ids: ['Lg8RQ7dIetgSxFYpk', 'NJBHBH@K2ueH8'], amount: 65.35}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/tracks', {ids: ['%CB92dz*sv', 'QAXvj5VTjf@$0'], amount: 0}, 400);
				});
			});
		});
		describe('artist/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/albums', {ids: ['zo64jLgW9q', 'mIpRm!MhLGMpKaVh)Y@']}, 401);
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
					await get('artist/albums', {ids: ['SPkfnvsU1bXcpxxU', 'VRIgsGUK#rGe4oma'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/albums', {ids: ['k(uW$1G', 'g[Wlr'], albumTracks: 'uixJsZzp'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['HSm8l^3', 'K^7g*SWuE8lcaYOW#h'], albumTracks: 2946384441376770}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['1BZOE4I*XTzJq64', 'rh31jI4e!PC'], albumTracks: 8160915480379391}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['^pB1IbnXRgka', 'V^Hl3kdis'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/albums', {ids: ['6ueGVbGZDie5', 'Y855C%H3aDebAUF48I*'], albumTrackIDs: 'Ao1um[$c'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['lpib9G#T(VRxzZ', 'UfwBDOB0ngoBAZ5uqn6'], albumTrackIDs: -60875079679998}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['wZOEmeV', 'dmhZwtgw$wHU@Ocp2'], albumTrackIDs: -8663724135022593}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['AB0iJKe0q6LSqfYgu&g', 'Bs4r8)y1h^'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/albums', {ids: ['C3h(RAQ[0(M0zM3eP', 'n38jKOCryi$@E'], albumState: 'wp^wPMvhoa%%G@mIMvgY'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['e#wsYdJ205XQ', '7Oz[sQ'], albumState: 637839272312834}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['C)H[fbOF[(EtvH', '(!)mxrn6]0M$Wh%e%)G'], albumState: -7430851709108225}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['l[8U6E', 'Is#[HX'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/albums', {ids: ['yL8Myx^0e)F2v$#O', '4VLm#!dBO@%2hU2'], albumInfo: 'tI[2IV^!EF$()I'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['yU8Nf3HYsSw', '9njN)#m'], albumInfo: -4302581446737918}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['$D2Qz*bhZAKXa', '8&@&7jCFM9)Iy)aq'], albumInfo: 4322644048478207}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['hmcGSSIANY]Sr33', 'FH5Bl3xgy4D37F'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/albums', {ids: ['o(8Dyx', 'h]gBhJ6'], trackMedia: 'c)x37[X1bp4cU'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['@GKC*75Sy&0HvDnj', 'zIT4sdTY'], trackMedia: -5309833947381758}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['!V7zI$iM(l', 'PPc5Jj)niF$4qjpo'], trackMedia: 907168056344575}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['UOmPoH3', '(CIXVQ)v'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['4cRGdM[@j4AUY', '&TbEP*Tqqnsj9gE'], trackTag: 'U7zK3'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['n&QqqjGj9##4#Dl', '2f5v]@%w2$)'], trackTag: -4574734062714878}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['8m(]6t43sg', 'T]DVx7c'], trackTag: 8972384455360511}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['78d09nonx', 'YsqlSb2]w'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['OVFw9L8mwl', 'LC2n5@Q]Y'], trackRawTag: 'HJs)c4%uLUn2*LNPo$2'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['u7T2dZupTxHgOR*7QN2', 'zZfY#^VHsy#j@4U'], trackRawTag: -6151453286596606}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['m4lXp5f0y@5qFm@J6OR&', '3No*4KUFzQBI(ROh0zct'], trackRawTag: -4543048771960833}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['G(OwblgBY', '4tCACGyLm'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/albums', {ids: ['NtZ^bdb1adFhL(VfM$', 'a2b1HWT&LSNu'], trackState: 'zG(S5&NLMFTaa!x!'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['60)]HaUkV)ic0mjJ', '(sV3]Iw0'], trackState: 3605884462694402}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['K!lNEhc^^kN4qFw6l6dn', '7iBFrcf1L^zLpG!hDf5M'], trackState: 4636098135326719}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/albums', {ids: ['w7PGDd37MJG$fJKu$NN', 'WhemMmZhtwwTa%&h9U'], offset: 'c]G*u^2%1ac'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['z@rCpLp8)G', '5rX%$ELbjneTPT'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['&SD%U$8%Uo', 'E[HyhGMAPO98(V7Idv^'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/albums', {ids: ['VopLK&WM@L)W(FqE', 'Jhti]3IbisiQa&'], offset: 17.15}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/albums', {ids: ['*y[sh^2!i)rX', ')%5iL'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/albums', {ids: ['F5sPOj39@ZmLvot!kl', 'b7vNBBu0tRsh1f[c'], amount: 'jiy[m5]h'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['Huu$BEGc5PA5r!ao7w', 'M(asOVwo1ua'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['dB^)SkVePzWu6$Zb', 'YoyxqC]f0Kz[PP)F0'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/albums', {ids: ['OANdcPX[@(GVuG', 'F(miBq5YSZG1'], amount: 10.4}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/albums', {ids: [')Om(vn1M', 'YVxSOZYTknc'], amount: 0}, 400);
				});
			});
		});
		describe('artist/series', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/series', {ids: ['z0Re*u)KX$3dz[KBU', '0n5e3S#NK7MPE]f$i#']}, 401);
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
					await get('artist/series', {ids: ['kraV)NFBuc', '3%x&Rug!'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('artist/series', {ids: ['8!Y[6sN%P*Kk', 'DwEA8VUhiVt['], seriesAlbums: 't#lYZQ*yN2KLdrW'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['mW6%hZIBF)@', 'y[J)Mftx]1ZAVespqJ9'], seriesAlbums: -5367165490298878}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['(P%EMxcI3jIkfHt', '@vGT!v&AtHJJR9'], seriesAlbums: -8489003779096577}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['jYkn4MT6UO[wAV4kU', ')F1IA$'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['7gFhcv96aa%deIGDv', '@qQQlZ'], seriesAlbumIDs: 'WaV37JG9OsSwRPKU'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['tMa^SLv7r*RsUv', '^[AfQ(%NS4%N%'], seriesAlbumIDs: 1057578868015106}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['vS&&)wu*o', ')Nk!k)$OVm0CPWF'], seriesAlbumIDs: 3524426607886335}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['AVm7rgilKU', 'Q88LmZ'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('artist/series', {ids: ['GP9bIPlDJ[g', 'Zi(tOZ*'], seriesState: 'DWI1JjW^&gB2Su%'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['Dpl$ZA^]RFDr)', 'a%8x15ko'], seriesState: 7531658869735426}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['2MJT1NAzPoK^u3fK', '[p7f)sw!ssT!K]8ykW^['], seriesState: 3856444986228735}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['^^f3#dQ&iTrJF', '!m9)qozSslVa2z0'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['OC@Oa*LnkF5R)', 'lAg)d6x#k*M'], seriesTracks: 'Wf8!9'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['zzsW]oBwu2v^', 'I*6PD%jx)rNbLxY'], seriesTracks: 7035550754144258}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['OhAUrF', 'Lyv1W'], seriesTracks: 6753961902079}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['Uec[Bk7oC6', 'gIdN[gMNizLD]R%'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['3mn#2HH)S6w%3L', 'TGsGnx94Y*YIQWgylZ*#'], seriesTrackIDs: 'Lt78*l4uQCxoEAvwyub4'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['OweLeb0ODaYH97j', '9$Z8crYnX!ryfD'], seriesTrackIDs: -3729364822786046}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['7c9)ewT7%@Zbw', 'p]zR^*KfgWzGO&'], seriesTrackIDs: -8507063055417345}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['h&EvHuvabnbK', '^QR6)4%7W4'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('artist/series', {ids: ['Z&3[7hDoUa', '&(u8@bSEd1'], seriesInfo: 'XIL0l4@Wlzi2aBpb6U'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['[e%th0[Yvx!0', 'LDY2jw#cHv'], seriesInfo: 5243605421654018}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['$2fXTlMD]n&k2JB', 'eWFLb'], seriesInfo: 4255223350558719}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['lqqSlxRL2I5P]oPgi', '#!!0nAi'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['4lGs(t#ZQ*yF]i8', 'FDZebv&GLQkv'], albumTracks: '$uXodM%y'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['Vplk3qc%3Bk', 'KH85m5^'], albumTracks: 6895345711710210}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['(j[hLO!FpbyN', ']%CKlkkZMVy'], albumTracks: 3864690266472447}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['7^%d7h&^DORau', 'adTg!2'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['5*idJsRXay@d*2', 'VUJF^N94[y'], albumTrackIDs: '*zN1DrKW%i'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['0V^z#RsXh7z', 'ZzUZ2*F]S'], albumTrackIDs: -925398682566654}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['Ag[%CF$lT2@#^hqsC3', 'fLaAW5'], albumTrackIDs: 2074064441049087}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['yx3iFHrKNeh', '2TMjUACQwFJ'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/series', {ids: ['o*OjIn!X9WtLouq', 'yZVgAy1#'], albumState: 'E84!scNTo7K6E]8KA'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['z(2)tQvk7et[)4^x$', 'l6Gl@'], albumState: -678298422083582}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['fG%1R9DQ0', 'jZjS&5zR0q#4rL'], albumState: -45740902580225}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['AD($4I1GTkbFmaQaQw', '5XY]5asrKU3IO#H%'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/series', {ids: ['P*^RO&DZ]', 'XyOT6ICQneUyGjr*jB'], albumInfo: 'md2DF5Jk3$B'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['AKO^MBFfmnA9ufgrS', '5X&jOMj!8p@AhAGAS'], albumInfo: 8578941031809026}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['3ts]EgCEFED6J', '!lNQ(9E7P'], albumInfo: -3045629131489281}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/series', {ids: ['qqo&qOYuFD', 'l)b@w'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/series', {ids: ['8o]CD&ZC', '4*y$(6uc]Ip'], trackMedia: 'mm#Q][fErgZ!Y'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['hbxZIdOdGie', 'TINzJUTllPSl(gP'], trackMedia: 4262732069076994}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['1EbuX8Hd^@eHy(k', 'wkc#['], trackMedia: 4541551862611967}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['FOgXN]C2hd4Hqz$JE', '1x5]GaOGuS&PtYLLI3cZ'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/series', {ids: ['bEXKQQIqiK(StmtXxm', '^^qJtVsh@TrN'], trackTag: '3v1]7IDqhNs#q8LF^'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['CoeWND(ALnb', '#AS7iIs]pt81'], trackTag: -1447308042436606}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['sl4b3M!', 'nJhINAgHxk'], trackTag: 4311400281276415}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['0I)[l!iqGAd[jh', 'o&P)uijb2e4[ETvx!RKl'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/series', {ids: ['Qi958g3%)LmAaR', 'tP#$*OB$pGb7b'], trackRawTag: '*7E[&Mx!#4YH^JliTEPm'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['j90]Q&C@3y((ZifB1!8B', 'DBgFW^k0pjswAy9'], trackRawTag: 8649627012169730}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['08q#Ry7^cy*40JNy', '!T#BrkYalIU@'], trackRawTag: 3585826604711935}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['EA6b)', 'zG5S['], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/series', {ids: ['KnM6Fx*H', 'AibQx#(Om'], trackState: 'WPelRa(YA$ypK6b&AB'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['@Ao]ofMay*8#', 'EblBTvLuq3ygIKa0^Fv'], trackState: 356385724301314}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['hSfMEkeBI^)h9lJ&', 'n]ZgX@(GA5Np^Sf'], trackState: 1480994062335999}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/series', {ids: ['IdTKTHMf', 'UwE6ZVKdlQf78^0'], offset: 'iUhs0J77$NRJ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/series', {ids: ['AC6@%9*IY&S', 'cz9YcQyl8!%'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/series', {ids: ['B70OvSXayDYBz8', 'lSp#p'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/series', {ids: ['j17Jz&1!r', 'T^!61jOh'], offset: 35.24}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/series', {ids: ['b4x5)aPwu', 'AZu$jQ2RxJ4'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/series', {ids: ['Ur8ti&DXEEI@AwAT6x', 'EN3PF@%7)Jk1'], amount: '62C4H'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/series', {ids: ['4I6ClVZ', '[^fi1#q'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/series', {ids: ['C7TMoPJN6FWgtVP07cr', 'mPQ8@(0'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/series', {ids: ['3[kFDd[(tK@Pd4fL$#p$', 'xw%C38$^qW'], amount: 6.22}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/series', {ids: ['%$MnN5V5)Qz', 'sRLTp!ydVJ4'], amount: 0}, 400);
				});
			});
		});
		describe('artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/info', {id: '0##AbCTUzi'}, 401);
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
					await getNotLoggedIn('album/id', {id: '&BJwGZ[l(74#'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/id', {id: ''}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/id', {id: '!PshNetkJjZ4', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/id', {id: '6)0H5h1vJ&xMedq^bkH', albumTracks: '9ACo5wZcFGm5*T5'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/id', {id: 'OH[[s95Up$xQ', albumTracks: -8214280008630270}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/id', {id: 'prrjaj]$B%i(', albumTracks: -598938361004033}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/id', {id: 'joOcq[AWJo8f#', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/id', {id: 'j!#eMjL!TNfwd', albumTrackIDs: 'zjnVj#^'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/id', {id: '#[Mz0pXoSifBXd)DnB', albumTrackIDs: 1316808636235778}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/id', {id: '^1V0HaRTe4Ljr', albumTrackIDs: 8030734929362943}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/id', {id: 'nXRK87XDL8s!', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/id', {id: 'lBz5eZJe*ibMr', albumState: 'MjbI6x%OPmX#8z'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/id', {id: '65YDThXZ1XB7ZTNp', albumState: -2020319887884286}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/id', {id: 'b5tD3K', albumState: 314319065579519}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/id', {id: 'aX]&4dv', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/id', {id: ']y4mf%[vxisSbNMc', albumInfo: 'cEgXbI5MS2G7KHa'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/id', {id: 'RTNs6HuTFC)qiLMjv(zH', albumInfo: -1830961704599550}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/id', {id: 'liDj0DoXJbv', albumInfo: 6364663642062847}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/id', {id: 'x!ZIrX1t%ct0', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/id', {id: 'o^cFu', trackMedia: 'c$FHjNSb'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/id', {id: 'k2(@sp!', trackMedia: -4285337677332478}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/id', {id: 'A4@]340$GgcpML]zB', trackMedia: 2925302825091071}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/id', {id: 'dFHpM*[', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/id', {id: 'se*ljAJpIjhD', trackTag: 'lB^P00(uh'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/id', {id: '(RtOmohB]&%Gm8w%tXE', trackTag: -5432539518861310}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/id', {id: ']qAaYuD5ecE$ab^', trackTag: -6565572695293953}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/id', {id: 'N$(EaO)Jr*%&7p)', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/id', {id: 'OJHmY)2', trackRawTag: 'fODUKr%8&]$#b'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/id', {id: 'Nv3%LitPPab(lm', trackRawTag: -4122400065060862}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'vUsLS', trackRawTag: 4626705897488383}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/id', {id: 'Q[Uzp(m', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/id', {id: '*XAQd$)NX', trackState: 'M!oZ7KH&mBG9!$m'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/id', {id: 'bB1lz1^gFqF', trackState: -5352130432991230}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/id', {id: 'H@YaEEN*', trackState: -2703895226744833}, 400);
				});
			});
		});
		describe('album/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/ids', {ids: ['JJ4qEVPt#@Qs4B', 'tDNKemwPHpM@TqSg)La!']}, 401);
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
					await get('album/ids', {ids: ['slTSXzUCR3MAY', 'd1!QQcUkEUO)['], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/ids', {ids: ['1KHtO^ZH', 'BbT2epubqkIk'], albumTracks: 'w2%*ZoKjvzuOT*dp'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['FKwKex]iylw%cOo!mh', 'jELK(zJcK%k!&'], albumTracks: -6779881371205630}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['qFoLPI&y', 'AtS9Mvg'], albumTracks: -5011608757600257}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/ids', {ids: ['5u2Hkd', 'afw047K('], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/ids', {ids: ['N8E2gb', 'Gm823EO[C7vF^sna'], albumTrackIDs: 'Sai8[[xtgV*!tgx7yCK%'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['&OVGFFDfVGZz^v*0A0*', 'ZJVhJ6Oo9h9ohX5&ks@'], albumTrackIDs: 2457903894102018}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['TS#YbMpzW&MR%fX', 'DIUwd'], albumTrackIDs: 8871475800965119}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['Smly5sA6K7zw*AH$&bW]', 'I%5StT0!'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/ids', {ids: ['Rrq8Hpps)(', 'RccRH2O'], albumState: 'vNOxg7'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['&Wcbf9%i1Y)!kOmV', 'q(%i0evnciQvJ'], albumState: 8786554927448066}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['HF!wDdE1O(W$[YQOwQk', 'R6!PL)zG@!IkZ*F4^Zp'], albumState: -979562859069441}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/ids', {ids: ['DgK9AIA', 'ExXnUtpuoA&JzXpi'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/ids', {ids: ['%]cXMFV2dhFN', 'a)sXtqfBZuw'], albumInfo: '[m6O]pfM['}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['8]mN(kyDWHld', 'sA8KsY'], albumInfo: -1898330481229822}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['zLJgaYIK5awxVQn^qj(G', 'HwLeFN2]f3q*[y(qXU'], albumInfo: -2915993726746625}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/ids', {ids: ['PWHEgX@rgkJUzN6K', 'HD9bf$LHTi!MHP'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/ids', {ids: ['Sm)(FuQ', '[6Fcb[ZN&D21@lh'], trackMedia: 'n4TC%)3'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['CnE4kjfAc', 'H^U)2Ssv9UCIke0w(b'], trackMedia: -1348550403293182}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/ids', {ids: [']2XdD2jm', '*d#gFC6gT%]vUs0[S(O'], trackMedia: -7656167052410881}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['3KIQMr8r(AC#', 'DJkcdt![[m8)nv'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/ids', {ids: ['iw2xctQ1hJY#', 'q1*HhXAHu]4qw!4gph'], trackTag: '*PgGa(T24DLU2ME6s'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['JWe%Go!UxWNx#', 'T4GsVkUZt0j2'], trackTag: -6605629451927550}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['XKn@LlvOCdM82iKYhRZ', '9XuC@8hlz9Z])TNzy'], trackTag: -1317846546120705}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['0nL7j8IST]i6q)F[', '%zk6bDR6Mh#B'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/ids', {ids: ['0ij&h', 'g90r80Xs'], trackRawTag: 'Rw6wbiRV8k!rwY'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['FXMZU@', 'zCki2lwrFOSn'], trackRawTag: -8491523553361918}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['[&2UHiI6H^Pn9E^', 'BGh3zyZzvtRIF'], trackRawTag: -5790175942672385}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['RR1fOKN3C', '2f]wW60'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/ids', {ids: ['&cJ*T1zn', 'R[%q['], trackState: '^*9A^'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['HmNq[zUW#g', 'UmeI8zqe'], trackState: -7439792719527934}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['7JWdU', 'FztjtBz]IYEr#ooIqXG'], trackState: 5947387507900415}, 400);
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
					await get('album/list', {list: 'random', offset: '9L#FKDY8dG5x3#'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/list', {list: 'frequent', offset: 18.08}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'faved', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/list', {list: 'frequent', amount: '!mt0$c]10A*VBA'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/list', {list: 'highest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/list', {list: 'faved', amount: 71.11}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/list', {list: 'random', amount: 0}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/list', {list: 'random', albumTracks: '(ueTZnE'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', albumTracks: 5025001266741250}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', albumTracks: 8075191787716607}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/list', {list: 'frequent', albumTrackIDs: 'Z*NxDe'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', albumTrackIDs: -2350086491209726}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', albumTrackIDs: -6090205924687873}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/list', {list: 'frequent', albumState: 'xNNuL4z9LE8^S4wCOB'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', albumState: 2239104355926018}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'recent', albumState: 5598058817519615}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/list', {list: 'recent', albumInfo: 'WL^2O'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', albumInfo: 7326934157492226}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/list', {list: 'recent', albumInfo: 5239360555319295}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/list', {list: 'random', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/list', {list: 'frequent', trackMedia: 'VqfIvmBoOBr%$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', trackMedia: 6614208720404482}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', trackMedia: 8326135863574527}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/list', {list: 'recent', trackTag: '&24F4iIfO3n@13j'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'avghighest', trackTag: -7218950962151422}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', trackTag: 2806923103567871}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/list', {list: 'random', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/list', {list: 'random', trackRawTag: '17)kvYE^USx4!yTFH'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'recent', trackRawTag: -6419786170892286}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'faved', trackRawTag: -8845025379090433}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/list', {list: 'random', trackState: 'zUp0pHr0'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', trackState: 6187796859453442}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', trackState: -5811783365296129}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('album/list', {list: 'random', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('album/list', {list: 'random', rootIDs: null}, 400);
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
					await get('album/list', {list: 'random', trackID: ''}, 400);
				});
				it('"mbReleaseID" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', mbReleaseID: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', mbArtistID: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', genre: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('album/list', {list: 'random', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('album/list', {list: 'avghighest', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('album/list', {list: 'faved', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('album/list', {list: 'faved', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('album/list', {list: 'highest', newerThan: 'lWa%@PLUDkahSyG8t&'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/list', {list: 'random', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/list', {list: 'highest', newerThan: 12.23}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'frequent', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/list', {list: 'faved', fromYear: 'sS7J*]1EIfVd'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/list', {list: 'random', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/list', {list: 'frequent', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/list', {list: 'faved', fromYear: 13.47}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'recent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/list', {list: 'faved', toYear: 'zu(l[QL9@b'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/list', {list: 'avghighest', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/list', {list: 'random', toYear: 32.28}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'avghighest', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('album/list', {list: 'recent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('album/list', {list: 'avghighest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('album/list', {list: 'random', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('album/list', {list: 'recent', sortDescending: 'g6U4(DTv*'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', sortDescending: -5303466704502782}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', sortDescending: -6400994304851969}, 400);
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
					await get('album/search', {offset: 'Mq35[BHFcQ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/search', {offset: 60.51}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/search', {amount: 'JS3dAw9!kNmwk&i'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/search', {amount: 69.37}, 400);
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
					await get('album/search', {newerThan: 'E)!J@b)iM1'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/search', {newerThan: 37.13}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/search', {fromYear: '@CxDis7E4K'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/search', {fromYear: 96.12}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/search', {toYear: 'AIW%pj9P26wXIBBeZV'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/search', {toYear: 64.59}, 400);
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
					await get('album/search', {sortDescending: 'N!BXQG@'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/search', {sortDescending: -2315432740519934}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/search', {sortDescending: -5123641691865089}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/search', {albumTracks: 'sJoV!q$@$H3pU]MA'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/search', {albumTracks: -6284705422901246}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/search', {albumTracks: -3913504503365633}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/search', {albumTrackIDs: 'Cd(EB]'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/search', {albumTrackIDs: -3175496426717182}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/search', {albumTrackIDs: 7285470786486271}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/search', {albumState: '6q8d$1IojdjYdw['}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/search', {albumState: 1799362036367362}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/search', {albumState: -2322974497570817}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/search', {albumInfo: 'LZLvdbs1lrxvn6j'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/search', {albumInfo: -2335432301871102}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/search', {albumInfo: -540532900102145}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/search', {trackMedia: 'RrEG3WG4hKCjo$Mp'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/search', {trackMedia: -3329516743163902}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/search', {trackMedia: -1253493088190465}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/search', {trackTag: 'NE2f6qSOZRVp*wU8'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/search', {trackTag: 1245859568156674}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/search', {trackTag: 2619660142903295}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/search', {trackRawTag: '8RW6aLro'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/search', {trackRawTag: 8978126356873218}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/search', {trackRawTag: -2998561071431681}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/search', {trackState: 'y1$kD)3'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/search', {trackState: -2277357494730750}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/search', {trackState: -2129148545859585}, 400);
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
					await get('album/index', {newerThan: 'I*Vwf6sC8A'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/index', {newerThan: 59.87}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/index', {fromYear: 'Hsp4nl)QE4&o20nkSE'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/index', {fromYear: 71.94}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/index', {toYear: '!&kbE2y*kMYJMg56t4'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/index', {toYear: 77.37}, 400);
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
					await get('album/index', {sortDescending: 'fIb#4vQl@Rxe2t'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/index', {sortDescending: -5985738084581374}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/index', {sortDescending: -7219831191371777}, 400);
				});
			});
		});
		describe('album/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/state', {id: 'TkDYj3[iNKnP$7e'}, 401);
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
					await getNotLoggedIn('album/states', {ids: ['RPWjkh1d1o&8', 'Eg%]]RZnPakp]^0']}, 401);
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
					await getNotLoggedIn('album/similar/tracks', {id: '(h(1Z@P$M$Omn[$fX7'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'UT]9@q25', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'MMMXa4AiugO)Ndeq#]G', trackMedia: 'IdF*O'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'bguT2N(Tj2', trackMedia: -6632644993351678}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'ZGQpJMnNSoL!', trackMedia: 2375493030510591}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'c#@&1WSkKLjm&za564', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: '%T8vJ3hvmx351H3', trackTag: 'PPmUxZNhEZdxdzM'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'eRO^qU%g@vb7y', trackTag: 577096866856962}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'lsgV0mEHopdLyYYf', trackTag: -1205638881345537}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'rc8LYilH^kEgx', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: '&2DOYJproh', trackRawTag: 'vABA3FyD'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: '#4AV2ABOlg&8JGsz1z5', trackRawTag: 8066008589795330}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: '!sl*3geEK5', trackRawTag: 4730736452042751}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'ZVa@xQa3zhk5A$', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'txjOfPWw', trackState: '#mVa^R4#czHQl[Pm9sc3'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'Pd)%!3d19M]', trackState: 3517942792716290}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: '4]28uR%j!^Rk83)V0X5', trackState: -9005596560850945}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'x4ka5O3', offset: 'klO05tF#^[*6ZegEHG'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'Eb!xHFj&i', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: 'hO4n[xr&pSYb1H2PP', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'yDP2UN5bf2JiWTm', offset: 22.97}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/similar/tracks', {id: '[kJ$X4CI5l@', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/similar/tracks', {id: '8*oWllI2KDyHHd%', amount: 'vCRs3W)%dOlZ0qz*'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '@XKgq$pXjb', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: 'iZHbmDsBr*hH@xg', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'R#5Es6SK4m]9', amount: 82.5}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/similar/tracks', {id: 'OGS0vjr9it1GV', amount: 0}, 400);
				});
			});
		});
		describe('album/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/tracks', {ids: ['uL#ThB%36nAX7E]U', 'mL[d$Qn5BO28^#k75R7']}, 401);
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
					await get('album/tracks', {ids: ['X[N^#@armVZ0', '9VLsHF72jue!0@1pl'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/tracks', {ids: ['3E!svLymWx^nM9W!M9la', 'Z(hqpO'], trackMedia: '0nrgWaY5VR%'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['e1Jl8H)5k$Siqm!O4kr*', 'f*g8Fc)9w'], trackMedia: 8550502404980738}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['O[lRVgpLF#@)gJ', 'HM1sNLlp&VbYKJXyuhe&'], trackMedia: -980495999434753}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['@xFhmlsB9TmsTv881[I6', 'zEx)h0$U*0Q$s5sNV%'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['f$G[%AVc', 'qcivE'], trackTag: 'sZK%0!00a7n]c7e@^jh'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['dXv$A5LI0$#P]Ao9ygt5', 'I[xOKZxz'], trackTag: 2627214487060482}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['[qfB&J*$YIb', 'NQZLw3Y4R4Djr[(G'], trackTag: 1583225541492735}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['mm4Ul', 'zFM&o%Izafxp!0I'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['9UlzG6M[#C6K#5F', 'E9AvzKhTw#W5cY#Em2'], trackRawTag: 'lo9LDLZz#YS6'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['LLl[BJ]MR%', 'I3rJ6IeN5'], trackRawTag: 3813731012182018}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['y@2P7A#7K%b#C', '*krn$6rD5eI'], trackRawTag: 2311524819402751}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['M&J95l!t', 'A#nwTKE%sRZ@ay$9&y'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/tracks', {ids: ['m8AbmBe!JS', 's)Awa'], trackState: 'i%UFXvvxhz)f$)'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['QM[GlzI^', 'iEymCbIbDJfSlP'], trackState: 1883719581302786}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['()#pR&U!AWM', 'T91q)WPbiAh'], trackState: -4492750267351041}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/tracks', {ids: ['HY]e#YXL*ooha2$A^', 'ndHT11VCslxch*SK9k]h'], offset: 'Zy$d7ChF6D0'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['7FgQaRv9appFER', 'T58hypOCLKT(98'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['CZsFb$', 'u]cJt!fi4Z$YQ^x'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/tracks', {ids: ['g(Oa@kQPK)0K^x', 'VmPGf8YVL'], offset: 68.35}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/tracks', {ids: ['1o&E6)', 'H09zH[*fIKo8j4W3k1V'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/tracks', {ids: ['*2Vd@J74whL!P7S', '4$!JFY1T'], amount: '[4dx6V71aJIif2DQ'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['JqWBVn^', '&Q8K(qe'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['ST@zYJNN', 'hnQ(6YUMO*[ev9M&^'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/tracks', {ids: ['eVQxb%icMsD', 'ZQ^nlSpx9K38p0'], amount: 81.72}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/tracks', {ids: ['t)Vc8A3&ulRH[g', 'Y1G9@RsPB7)2Ac$'], amount: 0}, 400);
				});
			});
		});
		describe('album/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/info', {id: 'JJ3J@a^(qh5u^NcVzjW'}, 401);
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
					await getNotLoggedIn('series/id', {id: 'lLF50KD'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('series/id', {id: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/id', {id: 'cZsctj2C]QuT', rootID: ''}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/id', {id: 'N$P*ufbmr0l5acMC', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/id', {id: ')ttTgZn)[7b1g', seriesAlbums: '@1YbtvCfn%uyIV^Qj5Sk'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/id', {id: '%Bj4A', seriesAlbums: -7842436554424318}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/id', {id: '*NuzC$f', seriesAlbums: -6000829924376577}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'zQc9b', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/id', {id: '&Mp1l4jFNnb@I^)h', seriesAlbumIDs: '7*5crlc59Rr'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: '*N)4kRov18qAT', seriesAlbumIDs: 8914147920052226}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: '*4edZXs@f', seriesAlbumIDs: 8650655333875711}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/id', {id: 'iEU!YpXAYMulo5*k9', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/id', {id: '0AXvaO', seriesState: '8mtUk^*8'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/id', {id: 'gaTWuRiATH(SOg[B&', seriesState: -7962737070047230}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'mZMPH!', seriesState: -3982923661312001}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/id', {id: 'ORohP67R21U0VEE', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/id', {id: ')c]LyA[7V(U4XddF%9LE', seriesTracks: 'K129BFFt&$VwAY'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: 'WXvkZ2(T3dz4*XgpGv', seriesTracks: 7153765035540482}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: 'awmSCCt#2Zy*fE', seriesTracks: 5587774853873663}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'CyO19', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/id', {id: '3CU]7W#^oX63C4)', seriesTrackIDs: 'py77g9KX@^JI#Lq0LO4w'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: '1adVpnnuoBOE', seriesTrackIDs: -3672065047527422}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: '!R@CzchU', seriesTrackIDs: -8410918962593793}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/id', {id: '2)nkfsjOZh2Dk', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/id', {id: ']MF30', seriesInfo: '&WQZSCv)'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: 'uyz5hN@9MI', seriesInfo: -1782079641616382}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: 'FxKxKYi', seriesInfo: 61589973630975}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/id', {id: '%n[hjuO', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/id', {id: 'nXv0I(w^4Qbw]Z4lK', albumTracks: '!yZg)bm3&])Tib9tye^E'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: '[D1]hW*]pe823(AMve#', albumTracks: 6868661520302082}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: 'MVt0#^#(wS(a5', albumTracks: -4743195300724737}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: '3^S704Ghb5K9rj', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/id', {id: 'OUvmYhw9', albumTrackIDs: 'l&SzHxl&OD7iEf(%)'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'jcGo*W', albumTrackIDs: 1335474526355458}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'tB*Em@pvTGVXgU0n7Y]b', albumTrackIDs: 1987206101073919}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/id', {id: '84QNd&08Lb8f#4', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/id', {id: 'Hg]!z', albumState: 'IG2al0'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/id', {id: '8)jmIxWRwde7[%', albumState: -7124602589282302}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'J@HDu611WHDL3@$', albumState: -4632540732194817}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/id', {id: 'dQ%wxLGro&UvUj![', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/id', {id: '[J$]1)j]**crz4fLxN&', albumInfo: 'LF2wI5l9aqnTWvsTWC98'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: '#O(HD]uCc92PX', albumInfo: 5898101898346498}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: '%9]rJcP6[7u', albumInfo: 6278445168328703}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/id', {id: 'VXLHDa6[lZ]I@I', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/id', {id: 'VN*x!ZEHlrDeL', trackMedia: 'Z*zzi5Lff4mJdWV'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/id', {id: 'HED!lhdBm', trackMedia: -6150749155229694}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/id', {id: '(V7B8bCH', trackMedia: 5658298405617663}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/id', {id: '%KWqr&xIlZbP', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/id', {id: 'IRMd6kyjkGG78', trackTag: 'pdJx%dB23dHRdLnUg'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/id', {id: 'Df)Pdz5$*J^8Yb!Sx7gz', trackTag: -673590714302462}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'E&o89g9jZV4&6', trackTag: 3459868228845567}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/id', {id: '9rAoIzwiu', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/id', {id: 'EV3ph]m3py', trackRawTag: 'axY!knUeadSdFrTipE*'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/id', {id: '(SOl2', trackRawTag: -7910361298632702}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/id', {id: '6mM#Ynp4P9', trackRawTag: 536286104387583}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/id', {id: 'x5kECrb', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/id', {id: '^Ce&6F5uni8xDSeG', trackState: 'eZwq4FoWQnI['}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/id', {id: 'JS7HcF', trackState: -5261305434865662}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'f8Z)Gxh8whbqVh$1Tyv', trackState: -8480563702792193}, 400);
				});
			});
		});
		describe('series/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/ids', {ids: ['$6CzRQF0cG', 'U]LnHJ3*Vakw']}, 401);
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
					await get('series/ids', {ids: ['dDvhvZChnreCwU', '(4)SGWe)n'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/ids', {ids: ['jPk5)qq', '2v7iuO'], seriesAlbums: '%2Lt9Pa'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['*NAwiFl3*A%pANRvHt', 'Xz]i8RXyPMfPXxuSN@'], seriesAlbums: 2966852842029058}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['n$G!d4tNz)3rC5L', 'v#mm0joJr)6BQ'], seriesAlbums: -4783538930974721}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['S8nDyqqG&2MrQvOoy%8', '*hBKe1)]sLS[38vchN'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['4pv!Np$f', 'g1@Tt89@txVRCoQH2jB'], seriesAlbumIDs: 'quo6f[0BJ8t)Jm!'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['$9K*vKzrc', 'V*Z^sJmg#3A6'], seriesAlbumIDs: -2571540398866430}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['P2iFw', '#yt[EYXM%'], seriesAlbumIDs: 5539717550440447}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['dO**MOBrV1bp', 'SuE#^Jb#qH49soidG'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/ids', {ids: ['humLQlUpbT6SHv1)cnB', 'm%Koj%5)^(q[La5QBkC'], seriesState: 'IZKj]7R6'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['6F(&nmuuXPYS]22)tFA', ')zZ]rh'], seriesState: -4899263637094398}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['G9$5Wx4[hY', 'd69Zt]OeOigfRYb6r)'], seriesState: 4091014260195327}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['%E*#*Od', '*%ena&5*[IVsqrl'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['XJNZY6&(H', 'X4%6QQ^7RC'], seriesTracks: '*OHCSqJD'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['p2Nrurit1*s', 'lNZ^!]1Fo'], seriesTracks: 8020307193364482}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['uT6#bt8', 'DJe5e2rl!VOzvwLE'], seriesTracks: 2804709396054015}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['V5CWTjq[y5gdA)5', 'gjV3gk(WvMztSmbGaF'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['tKZgf[[#jDC9R9lBJkSn', 'yel7lN'], seriesTrackIDs: 'sDz^@1Gw&1#fE($r5J'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['zmWqX9n2Y1', 'XjwE^w'], seriesTrackIDs: -7702537796845566}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['g4HAe$!0IQ3I', 'UR#3&PvSvach@!TnJr'], seriesTrackIDs: -2804825557303297}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['VZ1x2r8h', 'cMXUl9d#*fuy7X'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/ids', {ids: ['HTqHLG1c2mz', 'ZP#k4'], seriesInfo: 'Qf)xQG@3Y@Epyg]Mj'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['F&E)U[rFts!Mc', 'FRx)SgFHOoHosynB)$Y'], seriesInfo: -6046351431303166}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: [']PUaIDQyr', 'b4NRy'], seriesInfo: 3017288596848639}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['s9(Kr6', 'Iu]cvi'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['Edg1!f%Uy(lk', 'E^xeRAb(DQeWE^%b'], albumTracks: 'dOmxPOgGaG'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['W#RiqETZ', 'q^S)8Fiu'], albumTracks: -2889136058925054}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['NN]8^', 'vigpjGTY%kH'], albumTracks: -3625016738447361}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['DXUdolgcWTgU(', '%sfQEC@Kv7@%'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['n^j*H', 'Zx6gNhu4VO*[$f'], albumTrackIDs: '@L&@lw'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['wkf21', 'uzHrRFld'], albumTrackIDs: 3743853697826818}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['^&y@C', '8cu5)Wl4ZKM8hSriR'], albumTrackIDs: -2683986472075265}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['7^@ohrnVDN9S', 'Q!rcTjBn8$'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/ids', {ids: ['v%$rIhaOG$A', 'cc7(JOF)9lsxnIj^M'], albumState: '*Y]pHO#YgdiQlj@]'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['iA4]Pz7LIWsr', '#jo5@TI)130'], albumState: 492871157284866}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['Q(IQ5p(As9GGLYN', '9]@!)&O(i[w*utogUqK'], albumState: 1777606005358591}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['MzqaBBBGOf', 'XXM$ZE(3UQFtfGYf!#u'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/ids', {ids: ['V)&%T(cQ[tt]Dk', 'B[MAOKtNZ[vIrpUD!k'], albumInfo: 'YPB]F'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['iIkiLwl(Hm&P', 'A#AU$DgFy[NJP'], albumInfo: -5672321557725182}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['SJzmoodG)CWNrzsHOKBC', '[XFKG'], albumInfo: 5074270434623487}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/ids', {ids: ['9W0fU@2', 'mpx6MK0tQqygdQnaSXZh'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/ids', {ids: ['NwUZ@1fvvj[KFX5', ')!8LL]L[dHOx^'], trackMedia: 'nB(sjmHuxs1WRn*^'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['[OT5&q%pW(KMn371M)', 'lFcVfhuf!H9ONhW$My'], trackMedia: -7431095607885822}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['mY&Wyysvb(&y', 'JrWOgpgT1qqj5ZD)Q'], trackMedia: -4727685595004929}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['2#Y8XV(GGKW', 'rnBgBwQ'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/ids', {ids: ['@[^3oA)(qMn', '9p%#3awd]Xn42'], trackTag: '8coO6nb'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['DNY6sZU*pf)%A9%Y', '02&[hJ'], trackTag: -4702158968586238}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['RJb*QMXiS]3R', 't@q!ztd[hEA'], trackTag: 7229636190666751}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['!EPTsr', 'qa&z%9r[H*4(wMMJBtp'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/ids', {ids: ['3^wb@x5(IJk95', 'QskODRoGvua'], trackRawTag: 'w&63SARVaYO'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['iN43Y', 'BL#acj$*ee6u1S'], trackRawTag: 3335426110652418}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['BMSl]HEFwPf8%', 'mOi%MXh5rPnvy'], trackRawTag: -1779486253121537}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['a5Q#kpP0Ma*ZVVnI', 'WS(DET9q6MN8'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/ids', {ids: ['$2nH@RN9', 'WgLj#UgCOrK(('], trackState: 'x*NLI@e'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['nw]27CGc$aI', ')o#uxDW0&0Ro@j3E(cDy'], trackState: 9000120154587138}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['&9)NqhaZwgO!#$', 'EBlVP)('], trackState: -2408169150087169}, 400);
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
					await get('series/search', {offset: '2Yd0TP2k*9O2u['}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/search', {offset: 60.16}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/search', {amount: 'R01)[VGL]$qm]jcE*n'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/search', {amount: 1.1}, 400);
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
					await get('series/search', {newerThan: 't9)6Wt(['}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/search', {newerThan: 76.36}, 400);
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
					await get('series/search', {sortDescending: 'qD$]!pL8LqzCBi'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/search', {sortDescending: -6173958692929534}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/search', {sortDescending: -5381266589351937}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/search', {seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/search', {seriesAlbums: '9VKla)T!*0dUNw]gQZ@t'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbums: -6752794023297022}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbums: -8930603395186689}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/search', {seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/search', {seriesAlbumIDs: 'I5W0X&lHOjpgvn'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbumIDs: 7631564783484930}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbumIDs: 4943169158381567}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/search', {seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/search', {seriesState: 'Tu(oyNBcnDP3L!Midm'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/search', {seriesState: 8417909751676930}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/search', {seriesState: 8194932409892863}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/search', {seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/search', {seriesTracks: 'n$5Q4qQO810M'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/search', {seriesTracks: 7918035021070338}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/search', {seriesTracks: 698682303315967}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/search', {seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/search', {seriesTrackIDs: 'NUgAZs53E'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesTrackIDs: 2448512318963714}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesTrackIDs: -802384930406401}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/search', {seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/search', {seriesInfo: 'WgFC3spBpx*'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/search', {seriesInfo: -8006926294056958}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/search', {seriesInfo: -6070020299816961}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/search', {albumTracks: 'PgY#rQX'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/search', {albumTracks: -3266889195192318}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/search', {albumTracks: -8437955513286657}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/search', {albumTrackIDs: '#Ut![D8'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {albumTrackIDs: 4596537162203138}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {albumTrackIDs: -7443038284546049}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/search', {albumState: 'NxG8&gsRIT@C'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/search', {albumState: -3215951189245950}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/search', {albumState: 5232773199560703}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/search', {albumInfo: 'DcV%$m%u'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/search', {albumInfo: 8583658713645058}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/search', {albumInfo: 7190868301709311}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/search', {trackMedia: '$3AUl2iNlg'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/search', {trackMedia: 4546527234097154}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/search', {trackMedia: -8668840292515841}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/search', {trackTag: 'jt[ZJZ'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/search', {trackTag: -1770611013582846}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/search', {trackTag: -2165672431845377}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/search', {trackRawTag: '4yqfGwlXwx2%8'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/search', {trackRawTag: 115562973757442}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/search', {trackRawTag: 6293245134897151}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/search', {trackState: 'n*RMvpZlE@v%D4'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/search', {trackState: 3923833878740994}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/search', {trackState: 1574282610081791}, 400);
				});
			});
		});
		describe('series/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/state', {id: '0YJO*(kaJ&ivgp('}, 401);
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
					await getNotLoggedIn('series/states', {ids: [')Z0ox85pE4b', 'OD5FvUNw&2uV32radd']}, 401);
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
					await getNotLoggedIn('series/list', {list: 'faved'}, 401);
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
					await get('series/list', {list: 'frequent', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('series/list', {list: 'avghighest', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('series/list', {list: 'highest', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('series/list', {list: 'faved', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('series/list', {list: 'recent', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', newerThan: '6rgL![LK%E1FlziB'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/list', {list: 'recent', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/list', {list: 'highest', newerThan: 70.88}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'recent', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', sortField: ''}, 400);
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
					await get('series/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('series/list', {list: 'highest', sortDescending: 'oo3k3U()1*3LU'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', sortDescending: -1155884449267710}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', sortDescending: -7424560177610753}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/list', {list: 'frequent', seriesAlbums: 'kaU0BBJcx@fk^A5'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', seriesAlbums: 4590109995302914}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', seriesAlbums: 8621992991260671}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', seriesAlbumIDs: '7gn*KgWn'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', seriesAlbumIDs: -6015041040023550}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', seriesAlbumIDs: -488689146789889}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/list', {list: 'recent', seriesState: '6%F5eZKvtHeo5%VWbTle'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', seriesState: 2961734499303426}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', seriesState: 7667571784417279}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', seriesTracks: '9@7Kyg*nFC'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', seriesTracks: -3964909654114302}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', seriesTracks: 6482687955042303}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'random', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'recent', seriesTrackIDs: 'EjeQn0uty'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', seriesTrackIDs: 8798522912538626}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', seriesTrackIDs: -4730192148824065}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/list', {list: 'random', seriesInfo: 'M7Q[x3ONADG#%I'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', seriesInfo: 2604227037757442}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', seriesInfo: -3706631246315521}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/list', {list: 'recent', albumTracks: '6M$7VaKL'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', albumTracks: 6304264485863426}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'random', albumTracks: -6906325212594177}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', albumTrackIDs: 'RodsM1$g0'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', albumTrackIDs: -4318935096754174}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', albumTrackIDs: -7508651338104833}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/list', {list: 'highest', albumState: '3(&Z^l@E#A97eZO'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', albumState: 8689261935067138}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', albumState: 3353781198651391}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/list', {list: 'highest', albumInfo: 'I#HRzIb'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', albumInfo: 4815307726127106}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'random', albumInfo: 4853138641125375}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/list', {list: 'recent', trackMedia: 'XR]haZKc]*J8e2Hy*'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', trackMedia: 5340865933344770}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', trackMedia: 2589254437830655}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/list', {list: 'random', trackTag: '$vGaBAYRg6iV9'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', trackTag: -3485277548969982}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', trackTag: -4922821838897153}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', trackRawTag: 'l9pda2&rtpOpXIy%'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', trackRawTag: 909184396689410}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'recent', trackRawTag: -2885754564902913}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/list', {list: 'highest', trackState: 'CQX(aLRNTWQgObR'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', trackState: -978290080743422}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', trackState: 8002501534023679}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/list', {list: 'faved', offset: 'JW(&H^8sA@G'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/list', {list: 'recent', offset: 23.94}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/list', {list: 'highest', amount: 'XRv@Gv'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/list', {list: 'recent', amount: 10.24}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/list', {list: 'highest', amount: 0}, 400);
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
					await get('series/index', {newerThan: 'RV7kCt9nX(okaP'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/index', {newerThan: 78.17}, 400);
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
					await get('series/index', {sortDescending: 'IY(2MDKHcwCD]5'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/index', {sortDescending: 3653657639780354}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/index', {sortDescending: -1285313766883329}, 400);
				});
			});
		});
		describe('series/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/tracks', {ids: ['kd71bIb^2Us9Sl[onO', 'q9P1Gbw&85l8oNWQ']}, 401);
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
					await get('series/tracks', {ids: ['7r)csGk$lFy', '*TgX]ZCcTWtA%q1L%xA8'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/tracks', {ids: ['MEmLZ8f', 'skkLN6Y9DyU&'], trackMedia: '9d$jH81J'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['^qlD9WicLMNtED', '^O*d#0L%^i'], trackMedia: -7855126039494654}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['aI0x[HpYcG', '(x6LroPYTJCz3DH3f5yv'], trackMedia: -6280351462719489}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['gXvNpFiT*f*Q5', '^^2OX7SY'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/tracks', {ids: ['G%UIbJMlJxd', 'IcL0]5(lmy'], trackTag: 'JumqJ0'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['!m0S37N4cALNuv', 'uCLWZv*GSU)J2rGftHw'], trackTag: -4422315748098046}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['10j*s[n&P&UmyYHn8L', 'FhrDr]motOOU$wJx'], trackTag: -5273747103678465}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['H0Xh[eUuVh9', '3AfSH'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/tracks', {ids: ['BYT%2KEga)K9V', 'gCI(Sns2U19tKa'], trackRawTag: '[j3PrBkk]FB'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['KXG4kKJtKUjpJ52Q84', 'Ot&pOX7TqsM3MsKNg'], trackRawTag: 8936664709726210}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['ZtuAN2CiFNY', 'eNZ9psJnb0)'], trackRawTag: -1777749559607297}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['3L^QQT', 'gpeq85ny!*89NeNE%&a'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/tracks', {ids: ['LXs]wa(b)keT&rnA', '*)[@xb[0o@H4fK2L'], trackState: '&!BUcGKr(7'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['gUac9zs4XY', '4FN9litVB#yCQ]%f'], trackState: -2949455322021886}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['!YG!mge#EC', 'f2Z!vSIz!'], trackState: 1222760755888127}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/tracks', {ids: ['pVmKHgGbA$QRn9NG8fA', 'RCd4tcgJV)#@dyi]'], offset: 'NlLa*K]0'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['JsMmPo%e4s', '!AamL^aKP)lY'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['txT(eG9(6u', 'MWLBa4A3c#if'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/tracks', {ids: ['[RY]S4!u', 'W5dDopRS#C7'], offset: 39.82}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/tracks', {ids: ['*RRD%Wn', '$nI%cCspmH9XSDz'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/tracks', {ids: ['dHEEjR$8', 'Z*mr4'], amount: '9SfFKCO3Qul'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['KTJWcN^UJlbA', '(XpWCJkL'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['z54[pyNR', 'X$B)0kBV'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/tracks', {ids: ['BDatUPM%UV', '@4uA[aH%DJV#m'], amount: 20.27}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/tracks', {ids: ['SPHOx)jY&', '9s]oUjQ1AqqIwe2OL'], amount: 0}, 400);
				});
			});
		});
		describe('series/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/albums', {ids: ['bEF1zJl@@xGHtu2Gts1Z', 'jq1R%SF']}, 401);
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
					await get('series/albums', {ids: ['8^gQI#4ehAU^O!Zvn', '7!#OBLoreIZNPUp@Qunr'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/albums', {ids: ['WmGdp', 'I2354*DqTsvp2'], seriesAlbums: 'wUx5O'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['MBWXsob', '!wO2CW9wK$rpF0Z'], seriesAlbums: 8342388548304898}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['aExwu6jYISQT', 'OC@lr'], seriesAlbums: -464625187422209}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['7&g6^5w4DKY2o$t7y!T', 'XfyR5fc'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['LSxYX', 'o$jJW'], seriesAlbumIDs: 'H[fYl'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['8OoO7FcIQ2pa7GZQK', 'NNfbdVJdewu6dJKn'], seriesAlbumIDs: -3536311734501374}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['zyzN%wws', 'Y]4V8lT^c(nvs'], seriesAlbumIDs: 1573719654793215}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['D%n1iU0DEo!T%iw', '@*HkaW#[1STT13X$w'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/albums', {ids: ['Q)hGddW*N)', 'n!mDMXzHDwgS0QMDlm'], seriesState: 'R^jKtz#Ps]WWH%Sh3'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['BV6%*4Y!kH@hKw(19swb', 'KBowkTqLifKGI&aL(2T&'], seriesState: 6314635502288898}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['#aFjAx2XEL!', 'Og0yN!6yiQmD1b9$'], seriesState: 7963661268156415}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['l$A9DUHG&b', 'RoEh[8omd)c'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/albums', {ids: ['JkGFu[6lG)4@x5B', 'zj8FnIZ^bMWpx5e'], seriesTracks: 'NdbH^wtA51'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['cSnksTHCMFW5', 'f!kcyUfPpD'], seriesTracks: 2628197174738946}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['zHG&h2$', 'l5HV^'], seriesTracks: 6362019594764287}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['ZaUfMPXGMGz', 'm)3Ue]s2ofoXfebaoq'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['RWfnveph$SM4Ppi', 'quick'], seriesTrackIDs: '4exICOR#'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['eDYlm5]If)9(G7C', '%Qab]bdfUt'], seriesTrackIDs: 6215026813698050}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['dfmbTj', 'udNn&6'], seriesTrackIDs: -4238985643687937}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['daUBkOs^Mq1Arul!^&sp', '@dizBvIP@zOs'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/albums', {ids: ['zUqp2Ct*y7B*ti3', 'rrlDhAdkRSg]gOwGp8T'], seriesInfo: 'iI&NMxru5gpgRB@eA'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['tJfidK*NiD@$DYUT', '!64CwSPNVzqAhw1y6'], seriesInfo: -3971261759750142}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['*q*9^', 'XIfIzgeIqd9M'], seriesInfo: 8940479571820543}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['wjrWLS3', ')DpR!jH@ZiGM'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/albums', {ids: ['pTbm#39ZWuP6', '^Q7JzH'], albumTracks: 'Oc4EJ%073]OC'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['Lv6qU^sCYlleAxS9', '%0!Jl'], albumTracks: 2735156687273986}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['et(Lw!', '9b%3M#$b#T5AQUCfr'], albumTracks: 5811842504982527}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['HMxw*i5', 'yRAe3D1Ou'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['*qmt[cW3x)5hzpId1[rN', '*Iim7MF9&o'], albumTrackIDs: ')hIfwe#'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['7EYn!%NHmqYypN2h', '$P1N(Pli'], albumTrackIDs: -5792024800264190}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['%tY5Ia0$YXtXQ', 'Lgyf02JGcLHy8'], albumTrackIDs: 6204720863510527}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['wD&3W7(Nmrb9', 'UDKSp@QTU*oX'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/albums', {ids: ['CFwX]M)[G', 'F3!sQofcUpv'], albumState: '5[#$7a!$rq$jf2dDV'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['pkvvskCWX(FM4pWy*zO$', 'c*a*Tg*t1R5W@Rl*1#'], albumState: 3330578199871490}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['jO3Ti2U3ymQ', 'yA##&QYx$zUQ4v'], albumState: 1039906973417471}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['jlY2E$pl8k', 'KFyCZGlT[G9'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/albums', {ids: ['DUpjccqdwGubP', 'vl7rY#Zersp*'], albumInfo: 'PVpPGHl[IPO$rq&'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['e)5eH', ')Jb]d&'], albumInfo: 1710053530796034}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['dZoYj99oP', '[wxlyuwENdPFe%unD'], albumInfo: -2815100549332993}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/albums', {ids: ['PNtyOLsKc6CT[', 'UV*JAL'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/albums', {ids: ['!VNJ2i%@ldym1', '8Lif[7PMlTZzB'], trackMedia: 'A*lsO[fv*zxU0NK^O'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['rjX[H%@%N2v[iethU', 'pvIL0yiGU7ED!Iu8rA'], trackMedia: -5229592314904574}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['WW#MX', 'TvzE%z%'], trackMedia: 8086477841891327}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['ul2qm4BW4B', 'C!s$T^4'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/albums', {ids: ['kx3CAiKnQA', 'qNDILIYW[LnPfRnO]eZ'], trackTag: 'StEuM)q2rk3z!#3Ql'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['WFcs3y', '%5Hxn'], trackTag: 5252890851540994}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['0DaAoTzbtSA[9', 'P5uPzxrdQL@&c9OA'], trackTag: 8037520113663999}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['ozXK*[I0OLWFct@f', 'LiA#EZq^dSo'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/albums', {ids: ['wqas55EZvIv#si#Uj%FC', 'bbH]xk!Oa80*&n)Foz'], trackRawTag: '6Q!*4k&6zV1&kl9(6'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['!wIhSPovmdf7lAMN6dLd', 'YUpo^LY'], trackRawTag: 3631459109699586}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: [')iXkC@7M%X', '6&*TSityV38QV(kVQ'], trackRawTag: -5527002039713793}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['VvkGSLnb)dw', 'auWT#[HR@or'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/albums', {ids: ['JzkgKaYKbzqC1m[]', 'iQSomO%'], trackState: '7%K]gZ5Tngh0ca2'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['HGm*B1!)xG#jY2Di)Ol*', '1VF0X'], trackState: -5353748071186430}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['7Efl1dOjD', '$XShq&h!cpp8k3A7PGin'], trackState: -8024325487591425}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/albums', {ids: ['R#3IX2(lLujmfto', 'K(5!wn3'], offset: '2TS2fQ7KB(wN&2L64'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/albums', {ids: ['vC!f*[Ve', 'ULTJ3xLo!]PqIIZZ'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/albums', {ids: ['^)WmgWT&B(D', 'Cl3OsfhCIpd2WaSrv'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/albums', {ids: ['LQbj)HCgJfu&(0', 'eOfIo'], offset: 98.25}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/albums', {ids: ['u0wQkqLtVmaV', '!*SWXdYMvo%WVX9'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/albums', {ids: ['V%SwB', 'nJlUJUbisxMt%2xaO2O'], amount: 'ul3v$s8'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/albums', {ids: ['p&@QlM', 'eS7CN[xA'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/albums', {ids: ['oVJaaroQai@V', 'w!2Rl)x'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/albums', {ids: ['wv*V0Nm(uWPt', 'gM@pe'], amount: 94.17}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/albums', {ids: ['GLM[VVNZL)SKSq', 'H4ORKG$9bZ'], amount: 0}, 400);
				});
			});
		});
		describe('series/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/info', {id: 'x@q^OFs'}, 401);
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
					await getNotLoggedIn('playlist/id', {id: '4$DwXMR$G70'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/id', {id: ''}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/id', {id: 'HohOB$2XB))qBt', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/id', {id: '@X#8)', playlistTracks: 'zg%QaXRGFVx*'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 's!zZBciaM1LD[', playlistTracks: -5306622385586174}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/id', {id: '(^^&SBi@sn2', playlistTracks: 5222909299654655}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/id', {id: 'iYiLMgCHq', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/id', {id: 'Uc(75lFYh(Yckns[', playlistTrackIDs: 'gFv#Rs4'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'k*P^C@oH', playlistTrackIDs: -7098397374808062}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'rXA^qpZj]#Y)&', playlistTrackIDs: 8853840824631295}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/id', {id: 'oHQ3148p71h[b%Qer8e', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/id', {id: 'n!G2i(vr7m1b#ulZ', playlistState: '3^*KzFypD'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '6TFhsve2(0xN^(9kpOI', playlistState: 5109944412012546}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'zMnJwU27Tgj$iW&#7rI!', playlistState: 4061614995144703}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/id', {id: 'zhrf)@T(G', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/id', {id: '*O^lGE', trackMedia: 't5Dq6beJxDa!z@y'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'Z6ilEA7SxqX', trackMedia: 8699242445012994}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'zHGGy', trackMedia: 2569526214393855}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/id', {id: '%UH#Q#', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/id', {id: 'SMZgHsW6O*', trackTag: 'YnyBVHoK(BTN'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'vXZZ]', trackTag: 2905978727038978}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'lrYxuCUi8V[CbKtM(15', trackTag: -6703541158674433}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/id', {id: '8]y%*nf)QKf6g8', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/id', {id: 'aZp#d', trackRawTag: '(]z]w5T]tmX3V'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'p)A0(Hbe', trackRawTag: -5344682926145534}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: '2cpJz]kit$6wtCbj]5j', trackRawTag: 2553489100111871}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/id', {id: '[ZQ5@Un!aXDv4]', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/id', {id: 'residuYfJJk2v$j6', trackState: 'DZ$sz#7qS8j'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '7fYRC1wE*0Va', trackState: -3931062304505854}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'SetFK', trackState: 6730419902873599}, 400);
				});
			});
		});
		describe('playlist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/ids', {ids: ['fr]&z78t1r0xqRL', 'FHpqt6B)bjk)M']}, 401);
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
					await get('playlist/ids', {ids: ['($3APM', 'YEJq*9yoKPS]AWS]H'], playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/ids', {ids: ['Z(u*5gs1mlr^z', 'Jaorcffk6M0M&72%!x'], playlistTracks: '8trb[#L'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['v@B&9Z%#qL', 'PEuicaopHm6]RFd$WGj'], playlistTracks: 1305111053729794}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['rE!jhriL#4e1P', '#X4qUoZ@ivch$kO[YdKp'], playlistTracks: 3249851861041151}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['iJeOWe9AR)^0FNu', 'K)wMz*c*&pNK'], playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/ids', {ids: ['MHN7SdFi)y4J10%NOU', 'KIW3gwpNc83&E6qZV'], playlistTrackIDs: 'v]Fc!MuNUrl$9]mE'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['OU!IRspju4Ne119', 'nAfP#6wEBCwW0^DAGro'], playlistTrackIDs: -8271639577886718}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['WNnt4S*G', 'w&IV(pE2MmL#i3'], playlistTrackIDs: -9005526918627329}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['YWb5Y*3ScDb2I3opE]', 'HPg6HoO'], playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['&C&f8O9', '$[fvEgjq$'], playlistState: '3E^GfjxkO67HuKnd'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['77HbST%t', '*ciKbXN7m$Ak3d'], playlistState: 6991624819179522}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['OvA*uiU0D7@7', '48mfK$a#waUSULz2vP'], playlistState: 3759403123605503}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['RsO&H*12e9T', 'aAu]sb$ZcSHJG'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/ids', {ids: ['rJ*bf(oYHBkys@&&$b#', 'I#N&AP#1j*N@tVR^l1ln'], trackMedia: '7M2zEt4(3]oqwW^LLyk'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['6hd6LcsU', '6)T7t'], trackMedia: -4384068351295486}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['Z$VN@rSI', '2h^ZxoQp8*X4VX*'], trackMedia: -3133669791236097}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['fF%wsQ5', 'EZDH@Kq*E*f%lI]Zy['], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['pVLW%pQ3r&(Mb^emB3', '7%arDWPic%8s4Mu&'], trackTag: 'X0M2G'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['v^Oq2Yw', '3LKGB1A4^M0'], trackTag: 2537672258093058}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['Rmz%!pTmCYW', 'btl2DJX$d'], trackTag: -7426159893544961}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['FvI(B5%J]S]6kLs', 'e^Xh$TYbWv0xuOO'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['3b9FB^(', 'DW7F*lDkEY'], trackRawTag: 'E01#SCOYvnhmm%[CR8'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['b1NwMG$7k', 'p]GJ48lft7o$8r6oB$'], trackRawTag: -229168558112766}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['Y!HPD4LuTcxhmH74', 'FS*vABwuJ1*'], trackRawTag: -6611211550457857}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['KlBfUAu[ou%', 'VCEwK(&vhvKVWHfs!xZ'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['a1r^@)', ']V5Hx)rM'], trackState: 'D^*@E9ORP(RX4aQr'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['xzv@W&c', '^@vMO%(2!&wI%E('], trackState: 7450459014955010}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['0k6urVT5VxdmF)', 'Q[ZWzwUw(^'], trackState: -424922736230401}, 400);
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
					await get('playlist/search', {offset: 'wtYL4kze)&gyL'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/search', {offset: 6.73}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/search', {amount: 'srAG6ae'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/search', {amount: 43.34}, 400);
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
					await get('playlist/search', {isPublic: 'vmFAJtMe80L8Jt5bIgP8'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/search', {isPublic: -5894771562250238}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/search', {isPublic: -4073013343420417}, 400);
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
					await get('playlist/search', {sortDescending: 'DDGiSRg3'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/search', {sortDescending: 2182956453986306}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/search', {sortDescending: 199545677938687}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/search', {playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/search', {playlistTracks: '#w897htRM13PQa8zy(Y'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTracks: -3759396219781118}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTracks: -5000276381532161}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/search', {playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/search', {playlistTrackIDs: 'shnQ8dpYXmE[Kvdy28u'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTrackIDs: -3202711759618046}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTrackIDs: -6586990287912961}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/search', {playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/search', {playlistState: '6g3dNMhT7tu'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistState: -6174951463714814}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistState: 7374839329325055}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/search', {trackMedia: 'DsU8VN6@*Z!Z'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/search', {trackMedia: -491296342933502}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/search', {trackMedia: 7760991383191551}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/search', {trackTag: 'yY0yV%m@ni%1cj'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackTag: -8379066612711422}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackTag: -995579253489665}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/search', {trackRawTag: '51em5@$(a08'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackRawTag: -5856876801556478}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackRawTag: 6756886019833855}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/search', {trackState: 'c0(4GZh[[x]T0(H'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/search', {trackState: -8094153539846142}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/search', {trackState: 7892576073940991}, 400);
				});
			});
		});
		describe('playlist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/state', {id: 'YgTg05W!$5t&f'}, 401);
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
					await getNotLoggedIn('playlist/states', {ids: ['XVjq4', 'Ss9ltz*']}, 401);
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
					await getNotLoggedIn('playlist/tracks', {ids: [')Pz3juIsYKbwRu1ip', 'bne)zeWBKdcYI*']}, 401);
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
					await get('playlist/tracks', {ids: ['%5merIOS5I30]l[!', 'apMnhr&Kv@w5#'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['B#V0D]2gp@dg%E0en7', '[K]NffyONm'], trackMedia: '4p6(SwYT#(jL$9X9'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['dA[uG%8crTH1', 'ymJ8Xko)q0JDflZPvPM'], trackMedia: 2161391632908290}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['3$F3RO]#]T(x(O1i&5i', 'dZzTp4j@%]Y0MfG%vK'], trackMedia: -4976223415435265}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['vo7sC4FMhrj$Ga7', 'chQmvss9ELKP]'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['5lmzP', 'uspDangRRTUgS'], trackTag: '!3rn&7aETD#'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['YHfGTvf#GTLIMWI%635)', '#AkPX[@'], trackTag: 4539811289366530}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['qs*dDxp&8WV@m', ']]p3j$mxrDEL'], trackTag: 8744060713959423}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['2XLtc]gvFs3', '83hYZU(Ju6MiNWqW'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['lmWY!T38', 'ekONmP#YLM'], trackRawTag: 'bENzwbTloP4'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['cA]]!FAXVw[Q!fH', 'S*CaZ%C8J*9noqRXr@jW'], trackRawTag: 214589329375234}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['SVcXx[oKJfZH', 'wiTb2(Jvneco2'], trackRawTag: 2169307576401919}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['Y@Jiq', '0JIj]MGgg'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['Oo3&&0zMvAl0KC7', 'v6OUPvrqyo7Wq8oT#'], trackState: '@THksa2'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['2lhsAc%', 'haZ#PLRT1FPKXBQL10$U'], trackState: -2837267701825534}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: [')qOnA^yoNGqa2', 'g&@29tk8'], trackState: -8341930538696705}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['IwtWWPGCh220]', 'Y[9fJ'], offset: 'BN79]61H^bO*b]@H3xk'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['cYlld2pQ)$[LqXVTl', ']Ak6#9Ch)IV$A2coj'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['ep^[g0kH&d1&', 'pNdhw'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['RhS[mhqOd46VE@O4G*', 'lqze8%9TEi%WAp'], offset: 26.35}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/tracks', {ids: ['O1pUep(@jT&5tm', 'po2MFF429VVOZ@x0@F'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['84oJN*H3PU', 'moUIqv18LN'], amount: 'VRetm)'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['0kJEK266Bp@4Lj', 'V9JBs'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['yzJKMAngCI0yx', '(In7$ULyp]L8&9bd3'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['8B16Q3eXAWp@4', 'mVm^D9l4w'], amount: 86.64}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/tracks', {ids: ['0HnT@@PfHAdm[S', 'UzbrVmTqBoMYr'], amount: 0}, 400);
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
					await get('playlist/list', {list: 'avghighest', offset: '6uZ8e*4iCWAqXA%ikJ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/list', {list: 'recent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/list', {list: 'frequent', offset: 27.75}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', amount: 'x10LuQwyavt[59r'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/list', {list: 'highest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/list', {list: 'avghighest', amount: 7.02}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/list', {list: 'frequent', amount: 0}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistTracks: '!5R6pq&p$Ty2zRRFiO])'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', playlistTracks: 1238439089405954}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', playlistTracks: -2947727616901121}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistTrackIDs: 'UYPAAd'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'highest', playlistTrackIDs: 3743518489051138}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'frequent', playlistTrackIDs: 3125493700231167}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/list', {list: 'recent', playlistState: 'M^qmW(#SH'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', playlistState: -7081879974969342}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', playlistState: 7977086207655935}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/list', {list: 'recent', trackMedia: 'dOmsA2ou'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', trackMedia: 7311865289900034}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'frequent', trackMedia: -6179424407912449}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/list', {list: 'random', trackTag: '@h1fz*FIg'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'recent', trackTag: -7086486902013950}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', trackTag: -2180809263939585}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/list', {list: 'faved', trackRawTag: ']a#Da'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', trackRawTag: -8239230249598974}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', trackRawTag: 4356326335447039}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', trackState: 'NHJTrifh#pegAL6aUFc'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'faved', trackState: -1292132157489150}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', trackState: -8174168143036417}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', name: ''}, 400);
				});
				it('"isPublic" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', isPublic: ''}, 400);
				});
				it('"isPublic" set to "string"', async () => {
					await get('playlist/list', {list: 'recent', isPublic: 'ymBHh'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', isPublic: -3234607717679102}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', isPublic: -4518713667616769}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('playlist/list', {list: 'frequent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('playlist/list', {list: 'random', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('playlist/list', {list: 'faved', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('playlist/list', {list: 'faved', sortDescending: 'Ui#jY@oCZH5sC*!4m'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', sortDescending: 7718070139224066}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', sortDescending: 2439432225423359}, 400);
				});
			});
		});
		describe('user/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/id', {id: '5tIgGwq'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/id', {id: '5tIgGwq'}, 401);
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
					await getNotLoggedIn('user/ids', {ids: ['jXi8h[27dhu6', 'Gl3*09Oranga[']}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/ids', {ids: ['jXi8h[27dhu6', 'Gl3*09Oranga[']}, 401);
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
					await get('user/search', {offset: 'frYgDVm87iIuVrTy9obX'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('user/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('user/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('user/search', {offset: 29.43}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('user/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('user/search', {amount: 'FO08!@KMqKS^6!o%ws'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('user/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('user/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('user/search', {amount: 87.66}, 400);
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
					await get('user/search', {isAdmin: '@W0ikQqYWUPn[K'}, 400);
				});
				it('"isAdmin" set to "integer > 1"', async () => {
					await get('user/search', {isAdmin: 4835331685744642}, 400);
				});
				it('"isAdmin" set to "integer < 0"', async () => {
					await get('user/search', {isAdmin: -8256784884039681}, 400);
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
					await get('user/search', {sortDescending: 'RolwnHb0hNHlZK7W7Z'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('user/search', {sortDescending: 6967694934933506}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('user/search', {sortDescending: 8025487754395647}, 400);
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
					await get('playqueue/get', {playQueueTracks: 'odLGMKqfH'}, 400);
				});
				it('"playQueueTracks" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTracks: 2510265438437378}, 400);
				});
				it('"playQueueTracks" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTracks: -6254295204757505}, 400);
				});
				it('"playQueueTrackIDs" set to "empty string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: ''}, 400);
				});
				it('"playQueueTrackIDs" set to "string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: 'RoNZNl'}, 400);
				});
				it('"playQueueTrackIDs" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: -2290932586119166}, 400);
				});
				it('"playQueueTrackIDs" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: -5151362249654273}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playqueue/get', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playqueue/get', {trackMedia: 'Nj8eQ5I!YuJ2mk'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackMedia: 1633799993556994}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackMedia: 8225864407842815}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playqueue/get', {trackTag: 'bbWSuS'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackTag: 5277274966327298}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackTag: -8678913437859841}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playqueue/get', {trackRawTag: 'Y$$Uo'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackRawTag: -5292145619501054}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackRawTag: -1172623014756353}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playqueue/get', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playqueue/get', {trackState: 'ck[G9I(50D9%x'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackState: -2009330622660606}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackState: -587972252532737}, 400);
				});
			});
		});
		describe('bookmark/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/id', {id: 'h))@cyAw$f'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('bookmark/id', {id: ''}, 400);
				});
				it('"bookmarkTrack" set to "empty string"', async () => {
					await get('bookmark/id', {id: '7UTddrlxi', bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/id', {id: 'N*xm*Tw*zeyQoRP3r4A', bookmarkTrack: '^(*]u'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'cpQ2w4MpNBAEs#dhz6K', bookmarkTrack: 8763702589259778}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'IGQLtI)5M%', bookmarkTrack: 6273899973050367}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'BStnJPawOHgfgbKn', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/id', {id: 'L@oo@J*z0', trackMedia: 'QE8XRz'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'YUElBz5T1W9PyiZ0ds', trackMedia: 3086035470778370}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'zu6vqwUzNHo(8NmV1llo', trackMedia: 3596151844503551}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'AU(m*7LdFsK9P]%KKFO', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/id', {id: 'HKXrW!3x4v6zu6', trackTag: 'lDv4z#sR$'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'TBPCv6^TB375tFIQ', trackTag: 3546770902614018}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'FzY6)3G', trackTag: 3763705456099327}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: '707ALYooLjQUEdQqdOh', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/id', {id: 'Hj9aXkf73SfQn)oJe', trackRawTag: 'yB^UciIsG[PdRAke'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'v&Xwjd(VnztM', trackRawTag: -4969139340836862}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 't&Iwr)!Y', trackRawTag: -7855694195720193}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'z0u)wmJk[b!Wg', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/id', {id: 'H4Ek(@Pm^1%KV2Fl5', trackState: 'Oqb##32dt0e^'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'B1R%dh$p', trackState: 6772089788825602}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: '4Mp7h[GOj&4[IFq', trackState: -1692578034483201}, 400);
				});
			});
		});
		describe('bookmark/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/ids', {ids: ['PTX3y4*RKtm', 'w^T8xv$Rp3#S']}, 401);
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
					await get('bookmark/ids', {ids: ['@9j3!ygTh9)g', 'ntAWXDlu'], bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['0(U*E#4u2K4fK&', 'Xd#oH'], bookmarkTrack: 'a^8OzTsC)4li'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['IIWC0b$Y^', 'NBPg6qBpwLCwf[Q'], bookmarkTrack: 3629134450262018}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['EGV9BS8D]PY', '1t%RyUlm'], bookmarkTrack: -6759204853383169}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['xK#$P', 'qtj0JM8B7E[FI3HQF4'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['dnV1im#ObtXOB', 'v8VN#y]Y'], trackMedia: 'iSt0ZmJ!e'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['NuYyl29M', 'XgI5pSW'], trackMedia: -6671487247319038}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['27bCHba*1$bO@yMLx&XA', 'NlKEFBl]'], trackMedia: 2350211133341695}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['1vTvkFKTiIdpMMiYx#', '^8Ekgmwp1a*'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['l6ywg', '$6vsdWh]s'], trackTag: '^[Y1x)YAmXw'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['b**JeNYg', '8&jWQw#p'], trackTag: -8283020645629950}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['Rz9dit0ws2B', 'Jg@T9BraFE9YV($jFVy'], trackTag: -1098756426563585}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['yFnen!6', 'MTSbxw3btw#JRvz'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['XiDxz@AeJyvyZUPx', 'GB&meirk6'], trackRawTag: 'kWCob2SjyG)CTPz'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['KKK@tz%I4llWeItK(Op3', 'oI$2V)dESB'], trackRawTag: -839714911289342}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['nfA6y', 'BqR#U0uqg&AnmUkfeB'], trackRawTag: 7391230363172863}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['g&n@8tQO', 'fNet!oW'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['eWAK8LsaH][Th6', 'QcwQTT&CWtFdw@'], trackState: '7^OUp8aQj1bX'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['o^6&ENl1', 'drKii'], trackState: -6886728077934590}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['zM)M3mQ]8^', 'Qz4Z5Ju6]L&4g'], trackState: 2334345184411647}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['tvU&JC', 'XWoXrYn'], offset: 'HPQ*4!BqBQ#6M5u^vB'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['Ynjlo5[RF51', 'A5XAqa2OCpVNdhbZx#Z'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['NyhGjbZtqsX@%9bM@&%v', '^F]xscN4VFc$'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['gQlo7kSzjPMV3', '[H6i49N%DNQ77AdWq43'], offset: 74.11}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/ids', {ids: ['BI%D00lDo*LAvmnNzCxm', 'F1$Js4wuSyP7ukxDxbZW'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['ls9[BdVXArF7uZxh', 'x6L7qfzVrF1Ci'], amount: 'nLaGSajc!*CM229u'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['zAXic^x', 'cy3Li!1P'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['WrWX2MCjhIxS', 'fUV3%(G0JxP$FVLylA'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['6C1qb8f@P[fXeN)n', 'epMQ8'], amount: 68.69}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/ids', {ids: ['PDy4Htbu', 'psTF3rDuJheP7'], amount: 0}, 400);
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
					await get('bookmark/list', {bookmarkTrack: ']BgxY^XCbE5RG'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/list', {bookmarkTrack: -1912028738355198}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/list', {bookmarkTrack: 767962633994239}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/list', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/list', {trackMedia: 'U^W9P3'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackMedia: 5091952336830466}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackMedia: -4969317443567617}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/list', {trackTag: '%aPE*Hz'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackTag: -1547364124852222}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackTag: -7823779904356353}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/list', {trackRawTag: '&I#Ou5w'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackRawTag: -126489991315454}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackRawTag: -6477450246619137}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/list', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/list', {trackState: 'AweLK##P'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackState: -4975715170648062}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackState: 5295890830983167}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/list', {offset: 'D6RhfCApRtnI#jb^'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/list', {offset: 54.5}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/list', {amount: ')T5SNt5i6S'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/list', {amount: 15.67}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/list', {amount: 0}, 400);
				});
			});
		});
		describe('bookmark/byTrack/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/byTrack/list', {trackID: 'y]smqS@'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"trackID" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: ''}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: '06MUDlU3jVoK(', offset: '%CSAdX$o7^^!'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'ebt)9h)XPXYaAO', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'pSjbmwFSzb(v', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'lQJMqU24V#]$lgSum[', offset: 34.23}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'C08@!S6*bs7f7X', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'TXslgnJ$*w)w!RCj#l', amount: 'kf620M#'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'Ou11(P8o9vEfN', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'fY]hItjtFHFNK!nzz(^]', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: ']rTs(%wXQs5', amount: 69.62}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'wUuMJ', amount: 0}, 400);
				});
			});
		});
		describe('root/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/id', {id: 'jObai*]1okL&o0vexsBt'}, 401);
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
					await getNotLoggedIn('root/ids', {ids: ['XuSz)FVF1GA)amY', '9PL10']}, 401);
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
					await get('root/search', {offset: 'Mq&V$Os#RB'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('root/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('root/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('root/search', {offset: 58.99}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('root/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('root/search', {amount: 'xFd(Q&d2xbZmp4u&xPg'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('root/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('root/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('root/search', {amount: 2.04}, 400);
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
					await get('root/search', {sortDescending: 'Isf^FA7jF6'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('root/search', {sortDescending: -3203653674467326}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('root/search', {sortDescending: 1585879726424063}, 400);
				});
			});
		});
		describe('root/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/status', {id: '6pcaK76S@#q)JimA&d'}, 401);
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
					await getNotLoggedIn('admin/queue/id', {id: 'NKsAnB3#)bBb!'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('admin/queue/id', {id: 'NKsAnB3#)bBb!'}, 401);
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
					await getNotLoggedIn('folder/download', {id: 'fswgGL'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('folder/download', {id: 'fswgGL'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/download', {id: 'pvxDlP0bQSqjcenH', format: 'invalid'}, 400);
				});
			});
		});
		describe('folder/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/image', {id: 'UGc9I3!8bi%Ilm%8'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/image', {id: '%&D[Z)aO', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/image', {id: 'PEa%!R#X&0lLUtHWc', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/image', {id: 'ZJGkXg', size: 'GFt2aKTaNY!e#R'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/image', {id: '*C!NI4Dnd', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/image', {id: 'w&Mr8Ik&HR', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/image', {id: 'vhLH86(9O]Yi6T*3', size: 75.63}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/image', {id: 'f@dviyFuLpA%elk', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/image', {id: ')dAdB)2Tp]wuKYI', size: 1025}, 400);
				});
			});
		});
		describe('folder/artwork/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artwork/image', {id: 'bLv6^D0^j*h2DO1HXP'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: '8hRNBzdCwQH$wb8(FSUd', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/artwork/image', {id: 'NI4))mA7O@Wk(nX', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/artwork/image', {id: 'kL7iYtgn', size: '%11*1zw'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: 'R5JEYx(Z', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/artwork/image', {id: 'CgNbww6C^KF', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/artwork/image', {id: '7GE7KSedC6g]72n72', size: 310.4}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/artwork/image', {id: 'mkPx2KXxi(UCVT&$', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/artwork/image', {id: '0clc*gPSPR1Q6[m1a', size: 1025}, 400);
				});
			});
		});
		describe('track/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/stream', {id: 'T#Alz'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/stream', {id: 'T#Alz'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('track/stream', {id: 'F*6oE8d8DR$U%I2iD', maxBitRate: 'mgW1p#K'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('track/stream', {id: '6UwmjwL1RS9GLXl*#B!P', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('track/stream', {id: '(dGKWGIb*THhvIQq', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('track/stream', {id: 'Dyz3z^qUUl2d^Z3!1(N', maxBitRate: 27.65}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('track/stream', {id: '^SU(Z!eD6qsY6', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/stream', {id: 'x7Q[pjEfYeJ', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/download', {id: 'dLW89FS'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/download', {id: 'dLW89FS'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/download', {id: '4zhQ0', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/image', {id: '7ERNist)kA$AU'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('track/image', {id: '$fO5KL', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/image', {id: '4bV#Ao5cyDLdTB', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('track/image', {id: '5KuE$]7!wEJQKT^(Ddb', size: '[Otw0)2'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('track/image', {id: '$d46bazBRnL$qMWo', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('track/image', {id: ')d$r9ISEsAgk)W5JU', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('track/image', {id: 'xkn$1tH@sR1emmiy[', size: 188.39}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('track/image', {id: 'br![nYxmll)V0siUnoQ', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('track/image', {id: 'ZBjGlnXG1m', size: 1025}, 400);
				});
			});
		});
		describe('episode/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/stream', {id: 'ec8K2XfE$rAnmLvil[i'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/stream', {id: 'ec8K2XfE$rAnmLvil[i'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('episode/stream', {id: 'Sm]lJpF', maxBitRate: '0&kr)tI'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('episode/stream', {id: 'zJJGbGS*I2j9r', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('episode/stream', {id: '9uuV^[07HV', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('episode/stream', {id: 'lKnaGG%e)NYZD6DK#$i', maxBitRate: 88.3}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('episode/stream', {id: 'J6U%nZZny2J[NSTFBmWP', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/stream', {id: '7ZxPfI%gw', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/download', {id: 'vVYWS3DIJ0)Ga1FBIb]#'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/download', {id: 'vVYWS3DIJ0)Ga1FBIb]#'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/download', {id: ')gtYm%7O', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/image', {id: 'NrDIM)6'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('episode/image', {id: '0jUizD@WP&!', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/image', {id: '3gJAKpQ', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('episode/image', {id: 'SFt@]sUza', size: '*bK!)JD^!Pm4WH%AL(0b'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('episode/image', {id: 'jbC(93A(', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('episode/image', {id: 'jgE4r2', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('episode/image', {id: 'Dv#^vc@$x4Rl', size: 361.37}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('episode/image', {id: '8]*oOqp7S8', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('episode/image', {id: '2DD5dIe#RDN1B339', size: 1025}, 400);
				});
			});
		});
		describe('podcast/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/image', {id: '&SKxUPfP&&x)s9'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('podcast/image', {id: 'W1%TSt@$', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/image', {id: 'IXN^yI1!q', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('podcast/image', {id: 'uJua4hdWCAfi7wKaX%', size: 'M7IaEz&'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('podcast/image', {id: 'Hwahrr', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('podcast/image', {id: 'aXm!)gka^5oo#F', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('podcast/image', {id: 'ghkXx0PioIJG!ZM0', size: 146.89}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('podcast/image', {id: 'SYr#rL5ZBl', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('podcast/image', {id: ']j[LrxB&', size: 1025}, 400);
				});
			});
		});
		describe('podcast/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/download', {id: '9ZxKHgNzQj!U*'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/download', {id: '9ZxKHgNzQj!U*'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/download', {id: 'oRrlZ5DLfxolO8', format: 'invalid'}, 400);
				});
			});
		});
		describe('artist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/image', {id: '2KJ2TJ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('artist/image', {id: '!2TVcI', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/image', {id: '4HCkW)68w8jgPJe', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('artist/image', {id: '!L!4Q&(g#p9wq@Qhzd8', size: 'CrEEG^2EcjW(OsV@'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('artist/image', {id: 'b##G!W9WXUbvHN', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('artist/image', {id: '#lfL)', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('artist/image', {id: 'g^P87', size: 676.84}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('artist/image', {id: '260vLRI', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('artist/image', {id: 'd&gzN@IamoVUZ', size: 1025}, 400);
				});
			});
		});
		describe('artist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/download', {id: 't7EkQsRo)6%Gs#$'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('artist/download', {id: 't7EkQsRo)6%Gs#$'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/download', {id: 'R)GEnQnN@iz', format: 'invalid'}, 400);
				});
			});
		});
		describe('album/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/image', {id: '7XhE*AhnWp@hsKMC6'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('album/image', {id: '8P6UDJue%kfZzy', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/image', {id: '^[K2@&Jg9cgO8l4my', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('album/image', {id: 'VY%k@Xkp8bg)', size: ')d@JNK3]g5vFli%'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('album/image', {id: 'mJ6C^r!BBlcp&VQVpkts', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('album/image', {id: '7]orI)(I[74', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('album/image', {id: 'E]FW2M4AGDir', size: 730.79}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('album/image', {id: '6cN5GZwbu0o', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('album/image', {id: 'hqsy$ayC', size: 1025}, 400);
				});
			});
		});
		describe('album/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/download', {id: 'S[aqnf]0xM*8hL'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('album/download', {id: 'S[aqnf]0xM*8hL'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/download', {id: 'hIotVVp5Ff19qZGo*y)q', format: 'invalid'}, 400);
				});
			});
		});
		describe('playlist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/image', {id: 'T8]oRjXe6]d*8HKTx'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('playlist/image', {id: 'k8%bVd5zXKDQQ1K', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/image', {id: 'T]*L01H^B', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('playlist/image', {id: 'WjA$N6D)KaY%#cl', size: 'gyBiZvk!K*92zS'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('playlist/image', {id: 'SwlhCW%V4F@by', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('playlist/image', {id: 'hxIxZLTQVg', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('playlist/image', {id: 'l8f^RHbMTX#WvnG7', size: 498.51}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('playlist/image', {id: 'XB@b3*Zbn^RM@', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('playlist/image', {id: 'FNclEvC7(RlIq', size: 1025}, 400);
				});
			});
		});
		describe('playlist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/download', {id: 'ixsYqPLQ5xi'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('playlist/download', {id: 'ixsYqPLQ5xi'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/download', {id: 'YAQT$H[G)0#(^gDM', format: 'invalid'}, 400);
				});
			});
		});
		describe('user/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/image', {id: 'qH]TdNOVC'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('user/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('user/image', {id: '%fMAjm#RlkNaZFtmfMjx', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('user/image', {id: 'SjLhnoR(7H@zo', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('user/image', {id: 'Nh]xDY', size: 'hZC#Tk6tquzZ3Lfk'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('user/image', {id: 'Ad!cq2yps9)', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('user/image', {id: 'jRaq$vkg7)JKVZd%NOs', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('user/image', {id: 'T!xR1K6vKBPNfw', size: 538.97}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('user/image', {id: 'DcKu29K4*VTVx@8oT', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('user/image', {id: '93ICSkW$EUS6k2', size: 1025}, 400);
				});
			});
		});
		describe('root/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/image', {id: 'C(l]aV*bT^xf0Pl#b84'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('root/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('root/image', {id: 'MNZ7ycr20@', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('root/image', {id: 'WsoO1)e[!DDju', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('root/image', {id: 'W2Ne#', size: ')TlI3otgzGX0exW#M'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('root/image', {id: 'zrB^eK', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('root/image', {id: 'I@I!pxMI', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('root/image', {id: 'zac0OK8rNe%S', size: 446.1}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('root/image', {id: 'TC%sD0]CiM]', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('root/image', {id: 'BYF3G@5DhKG', size: 1025}, 400);
				});
			});
		});
		describe('image/{id}-{size}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/8vjC%24FxU99Bb-187.jpeg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/%26QpA5y%23SqJYb)uD42-720.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/c3wI3VCo%24Iu68Te%25-533.invalid', {}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('image/71%5E3Wu!GnuOX-9ckV%5B%40ML%24gXhV3oi.jpg', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/Y%25klKD%5DrTY-.jpg', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/t8JkiI2WDaJJJS-true.jpeg', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/%24v9HZgs5R!7%26lFaC-79.27.jpg', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/bmLhgz4%262!5%26IL%5ECFVa-15.jpg', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/23sVNh%23-1025.jpg', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-211.jpeg', {}, 400);
				});
			});
		});
		describe('image/{id}-{size}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/s5Mfk9!I%25IsgU%258X9xY-398', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"size" set to "string"', async () => {
					await get('image/cPVvp)51fSe%24Qdvk8Vb-2EN47v4i)Q%265u1sifAP', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/MEdY1RAf%256g-', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/vGfn8Q1%5Dm0a%408Rmi%5EJ-true', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/MT%40Mbof%23s%25b%26%26AsTd%24-525.61', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/7s%24%5DIzE%5DeTznLMK7-15', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/bV%5E!mAeBpt2GaQl3L-1025', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-424', {}, 400);
				});
			});
		});
		describe('image/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/D(gL0rqbT8DkQfLkngk.jpg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/dLkR(mEOKPcU.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/Ajgxvu%5DEE.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/.tiff', {}, 400);
				});
			});
		});
		describe('image/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/Z5hzc%25r', {}, 401);
				});
			});
		});
		describe('stream/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/i774lDw%5DscuYlEk.oga', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/i774lDw%5DscuYlEk.oga', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('stream/zUSRs30bdn.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('stream/.flv', {}, 400);
				});
			});
		});
		describe('stream/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/mRK4jOwpP', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/mRK4jOwpP', {}, 401);
				});
			});
		});
		describe('waveform/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform/t7OdJryBxADq7(%5D.dat', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform/t7OdJryBxADq7(%5D.dat', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('waveform/%24v%26%40fGL5gC2YUAHC%23JA.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform/.svg', {}, 400);
				});
			});
		});
		describe('waveform_svg/{id}-{width}.svg', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform_svg/rk%25v5RtXO%23Bh%5Do-664.svg', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform_svg/rk%25v5RtXO%23Bh%5Do-664.svg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"width" set to "string"', async () => {
					await get('waveform_svg/%23!C(J%5Dt%23%40TR12NIW)%5BL-QSh2D*WL8)CkEKS%254.svg', {}, 400);
				});
				it('"width" set to "empty string"', async () => {
					await get('waveform_svg/nR%24sq!(Vqqyi-.svg', {}, 400);
				});
				it('"width" set to "boolean"', async () => {
					await get('waveform_svg/X%5D%26Og%5B3%26T8F3q6CpA-true.svg', {}, 400);
				});
				it('"width" set to "float"', async () => {
					await get('waveform_svg/5)Nh2cCES!0mR%5DY3uNG-5368.86.svg', {}, 400);
				});
				it('"width" set to "less than minimum 1"', async () => {
					await get('waveform_svg/2b%5Bqz8-0.svg', {}, 400);
				});
				it('"width" set to "more than minimum 6000"', async () => {
					await get('waveform_svg/Fus6%40x%23FM%23KUOD)jJ6%5D-6001.svg', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform_svg/-5902.svg', {}, 400);
				});
			});
		});
		describe('waveform_json', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform_json', {id: '9FjnXLw#1z2'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform_json', {id: '9FjnXLw#1z2'}, 401);
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
					await getNotLoggedIn('download/cIz%24NNL', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/cIz%24NNL', {}, 401);
				});
			});
		});
		describe('download/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/SXo%233ArAFmeOf39NP6%5D.tar', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/SXo%233ArAFmeOf39NP6%5D.tar', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('download/pqNvB5NH%26%24azx.invalid', {}, 400);
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
		describe('episode/retrieve', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('episode/retrieve', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('episode/retrieve', {}, {}, 401);
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
		describe('podcast/refreshAll', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('podcast/refreshAll', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('podcast/refreshAll', {}, {}, 401);
				});
			});
		});
		describe('podcast/refresh', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await postNotLoggedIn('podcast/refresh', {}, {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await postNoRights('podcast/refresh', {}, {}, 401);
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
