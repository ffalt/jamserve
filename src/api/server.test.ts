// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY
// tslint:disable:max-file-line-count
import supertest from 'supertest';
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
			const apiPrefix = '/api/v1/';
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
					await getNotLoggedIn('lastfm/lookup', {type: 'track-similar', id: '@opPUCqx2KBL'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: '', id: 'u$L95UtgEpf'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('lastfm/lookup', {type: 'invalid', id: 'P0uim7e8I'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: 'track-similar', id: ''}, 400);
				});
			});
		});
		describe('acoustid/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acoustid/lookup', {id: 'aDq5K8lHiQ$t3^'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: 'GcSJZH', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/lookup', {type: 'place', id: 't&api)^RTJ1[A$lqr4'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: '', id: '5KANT0ik#0^'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('musicbrainz/lookup', {type: 'invalid', id: '42Gr@%LqyGS[Wd#'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'recording', id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'event', id: 'L^Hh#am2H', inc: ''}, 400);
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
					await get('musicbrainz/search', {type: 'release', recording: ''}, 400);
				});
				it('"releasegroup" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'work', releasegroup: ''}, 400);
				});
				it('"release" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'recording', release: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'release-group', artist: ''}, 400);
				});
				it('"tracks" set to "string"', async () => {
					await get('musicbrainz/search', {type: 'work', tracks: 'IvKMhb7uHL03c'}, 400);
				});
				it('"tracks" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'area', tracks: ''}, 400);
				});
				it('"tracks" set to "boolean"', async () => {
					await get('musicbrainz/search', {type: 'label', tracks: true}, 400);
				});
				it('"tracks" set to "float"', async () => {
					await get('musicbrainz/search', {type: 'release-group', tracks: 21.37}, 400);
				});
				it('"tracks" set to "less than minimum 0"', async () => {
					await get('musicbrainz/search', {type: 'recording', tracks: -1}, 400);
				});
			});
		});
		describe('acousticbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acousticbrainz/lookup', {id: 'x&vb60uNFPDU^Lf4'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: ''}, 400);
				});
				it('"nr" set to "string"', async () => {
					await get('acousticbrainz/lookup', {id: 'NFwj9qw', nr: '&^dfevNxk^'}, 400);
				});
				it('"nr" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: 'pr7XWp1K5xfYXmO', nr: ''}, 400);
				});
				it('"nr" set to "boolean"', async () => {
					await get('acousticbrainz/lookup', {id: 'u3^7qzK@xE)2', nr: true}, 400);
				});
				it('"nr" set to "float"', async () => {
					await get('acousticbrainz/lookup', {id: ')E%cnzcl8NbYlV@&CkYo', nr: 63.7}, 400);
				});
				it('"nr" set to "less than minimum 0"', async () => {
					await get('acousticbrainz/lookup', {id: 'suU)2bD]3rI&DyT', nr: -1}, 400);
				});
			});
		});
		describe('coverartarchive/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('coverartarchive/lookup', {type: 'release', id: '#6@*^(5I)h8ZuV!0UjG'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: '', id: 'jlo![l'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('coverartarchive/lookup', {type: 'invalid', id: 'I9[2JXJdiG)m!d6h6'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: 'release', id: ''}, 400);
				});
			});
		});
		describe('wikipedia/summary', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('wikipedia/summary', {title: 's1Q6q$g%LZ(UIf#Cm(%5'}, 401);
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
					await getNotLoggedIn('wikidata/summary', {id: 'RP%OfW%dT(5dd2]#IqB'}, 401);
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
					await getNotLoggedIn('wikidata/lookup', {id: 'UvsFd7b(A'}, 401);
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
					await getNotLoggedIn('autocomplete', {query: 'k6pjsIx#09Nk27nbu'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"query" set to "empty string"', async () => {
					await get('autocomplete', {query: ''}, 400);
				});
				it('"track" set to "string"', async () => {
					await get('autocomplete', {query: '1r83S*Z@JIkNpfjJ', track: '&6aETX)gl[1pA6cmM'}, 400);
				});
				it('"track" set to "empty string"', async () => {
					await get('autocomplete', {query: '3)abL2X*R%ltM9&98KY', track: ''}, 400);
				});
				it('"track" set to "boolean"', async () => {
					await get('autocomplete', {query: 'lHQF^95M', track: true}, 400);
				});
				it('"track" set to "float"', async () => {
					await get('autocomplete', {query: 'qhrrMKWhvv7L@', track: 16.76}, 400);
				});
				it('"track" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'J!9ic28]H(Ff', track: -1}, 400);
				});
				it('"artist" set to "string"', async () => {
					await get('autocomplete', {query: 'TuhPB9IvNs', artist: 'jRvvUMI!R'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('autocomplete', {query: 'QwaFWsFuy&axT[$&', artist: ''}, 400);
				});
				it('"artist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'Co2ch#d@MT1TdE]p4d', artist: true}, 400);
				});
				it('"artist" set to "float"', async () => {
					await get('autocomplete', {query: 'uBMqXsW)vt[#QPaF)', artist: 97.91}, 400);
				});
				it('"artist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'RtaBpjop#YJJnf3VlVD', artist: -1}, 400);
				});
				it('"album" set to "string"', async () => {
					await get('autocomplete', {query: 'qI6*$^FPMm9%PB3W', album: 'k0UPTNxGv'}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('autocomplete', {query: '%Fzh6gWN($Dh1qk&', album: ''}, 400);
				});
				it('"album" set to "boolean"', async () => {
					await get('autocomplete', {query: '(K3ZX5', album: true}, 400);
				});
				it('"album" set to "float"', async () => {
					await get('autocomplete', {query: 'k8ZI%JuyZ37KNBltD', album: 22.67}, 400);
				});
				it('"album" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '2N!iYe@', album: -1}, 400);
				});
				it('"folder" set to "string"', async () => {
					await get('autocomplete', {query: 'zIduOkuKrjbOW!C', folder: 'lB57Bp5eRr2eN821'}, 400);
				});
				it('"folder" set to "empty string"', async () => {
					await get('autocomplete', {query: 'flhA@cTocDNeh', folder: ''}, 400);
				});
				it('"folder" set to "boolean"', async () => {
					await get('autocomplete', {query: 'bQ1*68QoA20W$dFx2jn', folder: true}, 400);
				});
				it('"folder" set to "float"', async () => {
					await get('autocomplete', {query: 'ZbsWC', folder: 91.41}, 400);
				});
				it('"folder" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '0@B6CVq]g^6T@iOmmat', folder: -1}, 400);
				});
				it('"playlist" set to "string"', async () => {
					await get('autocomplete', {query: '%T#ZE*Es8O^&&%FCix', playlist: '&AGb301@dSsP^qfR'}, 400);
				});
				it('"playlist" set to "empty string"', async () => {
					await get('autocomplete', {query: 'L%6SOis]', playlist: ''}, 400);
				});
				it('"playlist" set to "boolean"', async () => {
					await get('autocomplete', {query: '1B4UsRW4NpSLf3Q#', playlist: true}, 400);
				});
				it('"playlist" set to "float"', async () => {
					await get('autocomplete', {query: 'y2nWJxDcmgl[nwZ', playlist: 29.87}, 400);
				});
				it('"playlist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '$K(8VE%S', playlist: -1}, 400);
				});
				it('"podcast" set to "string"', async () => {
					await get('autocomplete', {query: '4E1DBHYfinX5!cTUUS5', podcast: 'P94$Ek*(F'}, 400);
				});
				it('"podcast" set to "empty string"', async () => {
					await get('autocomplete', {query: 'Kl4C#oLEaC89H', podcast: ''}, 400);
				});
				it('"podcast" set to "boolean"', async () => {
					await get('autocomplete', {query: 'SkUyTJLW$DP#RjkYIW@A', podcast: true}, 400);
				});
				it('"podcast" set to "float"', async () => {
					await get('autocomplete', {query: 'B[oP#ivnP', podcast: 45.06}, 400);
				});
				it('"podcast" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: ')WcgQwlkJ', podcast: -1}, 400);
				});
				it('"episode" set to "string"', async () => {
					await get('autocomplete', {query: 'PD#5yd', episode: 'taFR0XOBRW'}, 400);
				});
				it('"episode" set to "empty string"', async () => {
					await get('autocomplete', {query: '7zsqwF', episode: ''}, 400);
				});
				it('"episode" set to "boolean"', async () => {
					await get('autocomplete', {query: 'a#wSSB5yEEae9k', episode: true}, 400);
				});
				it('"episode" set to "float"', async () => {
					await get('autocomplete', {query: 'mfx8@AiwtldoEXt', episode: 90.23}, 400);
				});
				it('"episode" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'MeR]Q93V%DklL)m%fRF', episode: -1}, 400);
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
					await get('genre/list', {offset: ']Z4eBzZ7@vRT0qo'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('genre/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('genre/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('genre/list', {offset: 32.65}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('genre/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('genre/list', {amount: 'gGC4qu0)IajACAA#oxTz'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('genre/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('genre/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('genre/list', {amount: 94.4}, 400);
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
					await get('nowPlaying/list', {offset: 'z%iU7VvUdtj2gmrA'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('nowPlaying/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('nowPlaying/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('nowPlaying/list', {offset: 42.84}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('nowPlaying/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('nowPlaying/list', {amount: 'Y1m)]BP)Tlj'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('nowPlaying/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('nowPlaying/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('nowPlaying/list', {amount: 95.97}, 400);
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
					await get('chat/list', {since: 'tH&cI1D'}, 400);
				});
				it('"since" set to "empty string"', async () => {
					await get('chat/list', {since: ''}, 400);
				});
				it('"since" set to "boolean"', async () => {
					await get('chat/list', {since: true}, 400);
				});
				it('"since" set to "float"', async () => {
					await get('chat/list', {since: 47.97}, 400);
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
					await get('folder/index', {level: ')BwT]8A3[Ovsmnc'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/index', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/index', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/index', {level: 49.04}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/index', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/index', {newerThan: 'A7]g52$oAQF3f2uZiT^]'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/index', {newerThan: 33.87}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/index', {fromYear: 'bz)n1tPrwizLwe1'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/index', {fromYear: 29.86}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/index', {toYear: '1OfnxQg3s'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/index', {toYear: 52.35}, 400);
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
					await get('folder/index', {sortDescending: 'Y2ULgt7bSYh!#EDEHt'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/index', {sortDescending: 2487315234553858}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/index', {sortDescending: 7995205332500479}, 400);
				});
			});
		});
		describe('folder/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/id', {id: 'Md8r6ca6J16*'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/id', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/id', {id: ']F$Wi&q6!eKkHM', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/id', {id: 'TgKHG)7cxfE!@Y', folderTag: 'wgDF764WwTLg'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'LC[X$DJGTLm9u', folderTag: 2044535458758658}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'wtf1fitNS4%&r86R7ct', folderTag: 8445853463216127}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/id', {id: 'mxoTDlL6(', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/id', {id: 'wIDxZAm3', folderState: 'ULwu5DLh&kGl^FQA'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'h06%6g0ke#gy9mMlWb', folderState: -2798419202539518}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/id', {id: '5tZz67PRq8#1*^OOt', folderState: 6740373929983999}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/id', {id: 'hPQqeEK!!4r7jK', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/id', {id: 'Z*heaF]X^Q8o]&[C', folderCounts: 'E6uO)'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/id', {id: '8e18[CuApwnsK*COh1', folderCounts: -7958176158711806}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'zE^Jf]^fjKNr', folderCounts: 4032804480352255}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/id', {id: '6$!i[x', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/id', {id: 'TK@E4%1[]@7Oie0o', folderParents: 'B5#lsPa#C8kVOxWFbS'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'j$4zBa$bOR', folderParents: 561602940108802}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/id', {id: '!x^3uocY', folderParents: -3530838427828225}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/id', {id: 'H5mP(', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/id', {id: 'aCNiM3r', folderInfo: 'J64CUze&Ma'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'jE8pkRVy*', folderInfo: -4237911104946174}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'O&)&c4D&Vs', folderInfo: -6578763777179649}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/id', {id: 'u&MyMmY*jLU1w', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/id', {id: 'r8Z(gothGA6u8HzbV^', folderSimilar: 'ZB6k8xODEIg'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'V&ksBU#dT4k6vk0!0', folderSimilar: -6193001256714238}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'N8MjUoHpyKnT%7j[', folderSimilar: -5700570165805057}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/id', {id: 'RFAKLtuX%4!', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/id', {id: 'IH6$Z9!Go^hlUF', folderArtworks: 'V#qCChJ9A*'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'nn2ZgKZoTsWZrq', folderArtworks: 4437471106433026}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'U@3WpmKL8FAe0Z9xq', folderArtworks: -1997625121308673}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/id', {id: '0U#uE4EBC', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/id', {id: 'wrPTb', folderChildren: 'Iy(IMx)('}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'Q1JOd', folderChildren: -2933459236421630}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/id', {id: '21P(!9IOc', folderChildren: 5206425844318207}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/id', {id: 'hEmq1Sd^0DJ', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/id', {id: '9ivV*Ur@QR93kOi', folderSubfolders: 'ok(CW8'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'FBP#nt#ZPnc*Fk#(1JM1', folderSubfolders: -8012349256499198}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'i&MO)ZR', folderSubfolders: -697401635504129}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/id', {id: '9m*n[', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/id', {id: 'Bi^ApgEcIEk7hZw7H7Lc', folderTracks: 'pR#^eP9ihj@^4$z^b('}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'qs7MoWWdI&D*', folderTracks: 4070857928343554}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'CWuKtfHu))z9', folderTracks: -108274691080193}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/id', {id: 'm4VXDlWXyy9Di*k%Y', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/id', {id: '1X)ZnReS]RHzQUm#gh$m', trackMedia: 'E[emoSG^6S7D!1Wv[mz*'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'HW270oPqT!5QVo', trackMedia: -397314153775102}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'd$zNJs]T#5q', trackMedia: 167006041014271}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'oosAemLS@kFE9gn8', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/id', {id: 'A2ABPbs7zPGuaT2', trackTag: 'da5mj9Z*l)k9$s*!)'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: '@$kBZr*FW)cta%YTS!D', trackTag: -6615874152693758}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'OEiOwPNq', trackTag: 1393290310057983}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/id', {id: '[GT^gJ1Er', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/id', {id: '#4j2gOikSu)rivF8EvF(', trackRawTag: 'v]q0d**!l'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'V12DN2H(i#jJO)0DEZ', trackRawTag: -2969349337907198}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'rh@(dmf*uDkUUeCT%', trackRawTag: 8090188362285055}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/id', {id: 'RFIqxd@wo(Yz)x', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/id', {id: 'otdISLwh[Ty3Qfr', trackState: 'G5V^Zd'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'JuDWqCKT1P*v*wdOXD^s', trackState: 1015740815638530}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'ccc#SZErr)D@N', trackState: -5317466737606657}, 400);
				});
			});
		});
		describe('folder/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/ids', {ids: ['s&Z9QY[EWn&TA^ZF&', 'kIFTE']}, 401);
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
					await get('folder/ids', {ids: ['GMHLk]gmdI$C](h', 'T9$]S6z[%*$ZL3K%'], folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['KnMATu%', '7fzB3iZk[dau'], folderTag: 'mQ!s!kn1Y)pYC'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['TfmoMSR', '4OKuScOrOEL'], folderTag: -2215988418314238}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['Y$a3W)hRbetiz2LC)cNw', 'G$V@eG&fwNr'], folderTag: -4748389312888833}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['A[Wb[nC', 'Fe8T#HrQ]al9'], folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/ids', {ids: [']FyPyE90sW%p&!PTf^[C', 'i5Y4e$6^OHdAp$'], folderState: '4!(9T&Z3Co$5ju%'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['#&ih]te1', 'tKkh7u128B%x'], folderState: 7488894178164738}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['FvOIy', 'ZVq^44lR1K2Zd[Waq43h'], folderState: 1963989927985151}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['(vgAJz^9^TTK4MyBcG', 'fKfe@fq(#10o3HfHZP%'], folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/ids', {ids: ['Y&!@Z)!qTmby6', '*4F[5cQPYs#Y)I4M'], folderCounts: 'xb$o0E#Kci1'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['dMK8c0zz)NHQK', 'J!0*gmPAYa6wqX)'], folderCounts: -4473339154268158}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['AhKQ&', 'iPXi6(VXjNcR[E6Y'], folderCounts: -8493395861307393}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['qpRd]M^jh5!8K7C*I7', 'Y]9K&eoap%8rf5U&So0F'], folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/ids', {ids: ['8WsRZIw3Bi!FI7', 'JmNR&yzO!NvDQ'], folderParents: '11PjQ2IxNZrvP*r@P'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['Zo#Xi', 'bzD*1AicHO1LtL'], folderParents: -7191657657139198}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['HV6fZ]9#Ski9', 'W9espO49'], folderParents: 7559614400823295}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['BfuGc', '&3ogJ'], folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/ids', {ids: ['d($1P9vmy&e)Q', 'rVG#$!mM'], folderInfo: 'unO*XuoYIbD'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['!XOxKY%*Rf1wkn2PSQ', 'AMLH5!c'], folderInfo: -8386799399337982}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['zT8O6', 'dCQ^STPoVp&jHH#'], folderInfo: -8483143828897793}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['pXzn(cv[3v', 'bVk&^F'], folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/ids', {ids: ['3)kBQT@', 'kmhjXN3ag8KIC[IO5g'], folderSimilar: 'a(X(NY(1J'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['gYQsCN$)8S]', 'os$gMh'], folderSimilar: 7060365485539330}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['d@Jy2IJ%lPDz2P5@', '028rXn0#g2Z2F0gIk!Fq'], folderSimilar: -804916910096385}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['9I)tzHELP([@1PVZvm4h', '9&sRl(C5vvX5Glr'], folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/ids', {ids: ['!mdT$d(F2uLJos', '3sx6@G!f!'], folderArtworks: 'nf8O0x'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['iB!p^', '&g7prfT'], folderArtworks: -3933717588344830}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['n[lyU', 'BcEgAhC'], folderArtworks: -4995815701479425}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['uzF5g&X$', 'KGvO48N'], folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/ids', {ids: ['8nsNtdRXGkX7S%qc9', '4$fD#^slaX)Y(1C]RTj'], folderChildren: 'DiR5XZv@]t@E'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['aQBp#L1$kR9wE(e', '348$eXW*GGrYp'], folderChildren: -709694914035710}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['oVO4]PtAY7V%7RD', 'zN#*)djNy%'], folderChildren: -2885992964947969}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['LBj&UZd78mqtk0x2R0', 'sls]huPoU@3FjgBCdbYw'], folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/ids', {ids: ['MxXnxuUwpk2', 'BH0kt(0yZGNdmtm'], folderSubfolders: '5WTzwa'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['^gBhR89ZvTHpM!0', 'ZjWn5tWQ)r'], folderSubfolders: 5726181659770882}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['Vl*NN(', '2tR(!6tU9]vp)6QV'], folderSubfolders: -4165380591321089}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['7TuQOrX', 'GzKUVIZziVWS9lc'], folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/ids', {ids: ['47IRVgFPmIKNGh', 'PD]CEHUtL'], folderTracks: '17E!taht0S'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['@6^GhL!f$q9H7)@D', 'I2jD08gH#QgWW(@gb*['], folderTracks: 1413780793720834}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['xR#ePi*ZD', 'Dwv]7]LGQj4WY'], folderTracks: -4389006120845313}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['Eh9DWU0cwN)', 'nUY#@Iq$q9c6F]fO['], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/ids', {ids: ['!9W8qvBBx', 'AjZCk7A@C5K@LXmQHj3G'], trackMedia: 'PRlSn(SSMs%jo6kF3'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['U8DAID($[NmaL$', 'N*ag0%RVoWy!'], trackMedia: 7054650259800066}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['M]*(6O[rmc', 'XozUhm*A]dXU&gi'], trackMedia: 7502728800501759}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['qav#8rdU[2mgKl2Xy#EM', 'P4yZZN'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['0LGpEu^LS', 'QHbWm'], trackTag: 'ADAtwvGBQU85G]2w9P'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['VJyJurFqjxHeUQmMgHRY', 'pVJmO0'], trackTag: 7381472772096002}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['1Cb8ZsG[S05e2k@6', 'vwbg!*Kb#&T$fgtDL'], trackTag: -5924833841905665}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: [']o0W5]1a11t(grO6Fa@f', 'y876C))UKBrVp'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['B9OeVn5U2$jWZx', 'vOsqJ1ROmYM)uweK7cs*'], trackRawTag: 'iW$omj'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['0LIwA816)', '4]dzJdw]49e1xDv5IN2'], trackRawTag: -5460984273567742}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['][8iI1', 'MtTjQH^w89&#3'], trackRawTag: 7607765010743295}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['dU0Ol@r(v(*AZ', 'jUE6mJ5O'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/ids', {ids: ['eCRnXgyCfKwIBVLAyUd9', '3C3t(xg$'], trackState: 'PxsrIgs(c(tBEPJ'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['sKCT6%5N4r', '#^]zGp8qMA$%O%JY'], trackState: 6745002633854978}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: [')z!Zp^jdf(FUsV', '50cB^yWL'], trackState: -7762817088225281}, 400);
				});
			});
		});
		describe('folder/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/tracks', {ids: ['d%Paej', 'ZzEV57S(mC]G[8@!hO#2']}, 401);
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
					await get('folder/tracks', {ids: ['gZzztSWbMRb%', 'B4Q5nZt&'], recursive: ''}, 400);
				});
				it('"recursive" set to "string"', async () => {
					await get('folder/tracks', {ids: ['WDSIr[ilZnMdZLJ[eV', 'aqLf)x&Ok!o'], recursive: ')pl(N&PbT0nEM3'}, 400);
				});
				it('"recursive" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['G6*iM[y#G^zkDLh!Y#*', 'xIkBW'], recursive: -7162077516922878}, 400);
				});
				it('"recursive" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['t!DZ$DpY', 'WKBJ3'], recursive: -3135066410582017}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['4fdk)zprENCL[lk%3k', 'f4ay)0v]kd69)jxCj'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/tracks', {ids: [']U&B)IfPV', 'embQX6NqBTc'], trackMedia: 'P9n&0ME)uV3X%0Ir'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: [']R^X[j', 'DP1Cj!*qvMaEBu3fNX#K'], trackMedia: -7466990696398846}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['ioDzc', 'FrvsLg8Jzu$R&xw3B!u'], trackMedia: 2222797971521535}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['OC1M@zL*', 'R]$64BSzTbZjw1[0I1H'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['l2c%oXW', 'mZ(TO6(IyZUu'], trackTag: 'iiHU98UKDIE!BRR3Q'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['dTMHdb1l%(', '%AVYJPZ*'], trackTag: 1082636437028866}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['@L5yh%', '1!kSI6B]rit^COHe!'], trackTag: 4672877093715967}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['zIJ)%edRzZa1g', 'MbR#xTsyydrfBCxICj!'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['h$#fK#HMK45oDjGV5', '$e%%r[XAA7)nmvuM^0'], trackRawTag: 'Ze&OgB0#@!jkh[ZrV'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['AgOL1w%7K', 'X!png#sHO'], trackRawTag: -231790237188094}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['&!LMT', 'S4Eo5o&7'], trackRawTag: 6310870346891263}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['R@^%6Sv', '1RqfsN7)&6^LS)Z'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/tracks', {ids: ['UuW]ejY#', 'bu#8It61O'], trackState: 'e9iOT1z'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['3@Ygi1F', '&TIa#8b(iAqeOb'], trackState: -1567052980551678}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['G^XE2!*oGZbJuXZ9(', '%$Pri7P'], trackState: 2516550263242751}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/tracks', {ids: ['SIcbwkiL$K(Nf96', 'Ly^I$RGhy#Z!#CAw5w'], offset: '[Kv!EFV9b$CMApDq'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['rVWo@YMxTl][i!L', '#Ttu0l7rtD1S683'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['hPijHkI^4eoEo', 'I0fOqViTriCHuuecM'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/tracks', {ids: ['lqJ4d)gZ8LQT', 'Zi^3G7s6(o3nnPY1S*'], offset: 59.96}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/tracks', {ids: ['4ErnQtPoWA&', 'KvR]7FIm'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/tracks', {ids: ['P2g%UQ@q*b][rH!O3qb', 'o$&(WE#fPvpb'], amount: 'kaLZGN*bq'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['3PZ%0D[c*TtQ!', '#cxcf7X91hJH]&nl'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['23@g2uVHi*vbp*8NbkH', 'pktAab%'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/tracks', {ids: ['#6xqLx', '6R4Q8NAm66wH9cEkjr'], amount: 9.42}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/tracks', {ids: ['o^fxX^L^&', 'p]ohS$SDiVEblY'], amount: 0}, 400);
				});
			});
		});
		describe('folder/subfolders', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/subfolders', {id: 'pf2rlX*X'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/subfolders', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'eaeB]EsLGna&vQNz', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/subfolders', {id: '#uxjIm#I9tPN', folderTag: 'v5dv*Gu6'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'U)rh1viXY6Ugi7woz62Z', folderTag: -3294827680628734}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: '#P$3w(HbSS!6y^t@oP0W', folderTag: 1773789788504063}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'BrQHg%)y$wl8PGecte', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/subfolders', {id: 'quK#@w(rUsOi6k0wXT^', folderState: 'n@@tnXBQ&FvS3cubMB'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '4OWjzdwAYyi#', folderState: 4019248036839426}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'm*yK$xBSegJ', folderState: -3338210839101441}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'd*Yde)gXoa9gDj5', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/subfolders', {id: 'GBUIpb8)R]fhy1Zg*nVk', folderCounts: 'xFR$AHHeqNTklQ@'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'Z#8KfXp[^][fK8V0jr%', folderCounts: -7929393422794750}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'd0IuOhB7XxNi33E@r@O%', folderCounts: 1479153626906623}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'rcb]@i3KIM%30', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/subfolders', {id: 'H)8Zx%)igMagMfVb', folderParents: 'uI*UP'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '[*C7Adb1]qoBL', folderParents: 3912407764172802}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'kR3QIG^WV', folderParents: 8786321707368447}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '6whHIKyy3Ah#4T', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/subfolders', {id: 'd[wf8', folderInfo: 'sY)USkx404ecOiJ'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'rfX*aD0eVhbZa#Mjt(W9', folderInfo: 470490355335170}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'aDI)x&9huiSocHp]', folderInfo: -8490369457061889}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'Vjy&aiD!!@', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/subfolders', {id: 'H((y(%pL1ivU)JD', folderSimilar: 'hDBa%y7dg^a[^Rjtx1#'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'KDSRqd', folderSimilar: 4266190830567426}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: '(Utb5tmmp', folderSimilar: 1371984575332351}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'jsk@70[VT]L!gjV', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/subfolders', {id: 'HYIbA66WZO', folderArtworks: 'izO[0cqX('}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'eJhhrO(Zb%p(c', folderArtworks: -7878068194508798}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'of8Sq$RHzimHuFrF', folderArtworks: -1794796045729793}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/subfolders', {id: '[&))E', offset: '4KqWK4sZgwH[cqn'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '%t8Gy5*Ay]', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/subfolders', {id: '#$k2uqt4GpriHQ1R8W', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/subfolders', {id: '3h64V@](kvvY#haGI', offset: 7.44}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/subfolders', {id: ']8w$(7Qj&zblV2b^', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/subfolders', {id: 'FVqvM6&msMJ)7GC]g7', amount: 'm$wPzk'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '1wNZhC%abMa@wW', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/subfolders', {id: 'Terek]$@!HH', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/subfolders', {id: '8$YklirvGHN@rkSdd)', amount: 78.47}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/subfolders', {id: 'kBJ&8GQnLbWaiI$]', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/similar', {id: 'u8F[HRSIZ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '3os6WpvJ0gN)Y7qoMRs', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'Tr8%r', folderTag: 'yb8%zDGLsp%P4#f'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'XvaZ(jWy5J@', folderTag: -8672289105117182}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '06M5VO', folderTag: -7549665088110593}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '1woEXfN7l^DstS[y5', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'Lzu!6846R5xJHK5p^U8', folderState: 'fkPfYglq![4'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'CerOqVn1F5UJ4ak1oZ', folderState: 2048733650878466}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '@xX#$LUUg', folderState: -319878842023937}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '@y9h@FY2Cl7f84Yz', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'SMQPPHEZKqNY!O', folderCounts: 'z1j&Z8]qH*9R8LKWHI'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'kNl^len77X1[', folderCounts: 3203682120237058}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'DbXNhO', folderCounts: -5055330908110849}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '!rT)UiphyT%L]dtBiTAi', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'eIV1(B&%hH', folderParents: '7TVeF)2]Sb4u'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'RN)aeM(', folderParents: 5734759686733826}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'ewi&if^#', folderParents: 4714543947186175}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'JmHCHeVfO3Sp17R3', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/artist/similar', {id: '%0KP0SNaJAEqg', folderInfo: ')a&pY4'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'P!*wA]f%ERSL[wxz', folderInfo: 2549093750538242}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'WcO1d92J$Zy', folderInfo: 4618867183714303}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'jC(@&1jO^T^w', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'UjAR[', folderSimilar: 'xCxp&W^LfK!IQRJ'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: ')RInDTvKr2', folderSimilar: 827032829165570}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'r*GjO!*ro%da5Tz7lIQa', folderSimilar: 6284572983558143}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'NOO2wY1029YHUV', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'KOYy(F0eMi%k57sO[cx%', folderArtworks: '[[A8Ua9yqgZCQ(S'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'NuR8BN', folderArtworks: 7939248225255426}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'zY4*jE9PWblfmfmObgXC', folderArtworks: 5217813862023167}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'e3o461Cs', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/artist/similar', {id: ']63[L', folderChildren: 'v1dJd1'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'X*BEEqW^1UpGeW&hv]26', folderChildren: 8157542307856386}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'Bl(U41v]3', folderChildren: -1967467295408129}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'QyWYvT', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/artist/similar', {id: '%doChljRO5^!RgX4T2v3', folderSubfolders: 'B4Im9kAmi'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '9f9G#LFHFU', folderSubfolders: -8740811512479742}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'cw(1SQ', folderSubfolders: -7856042792714241}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'Q0@3zP7Dni^Xj', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/artist/similar', {id: '6RJzARNJBtU9ieF&sD', folderTracks: 'Z3pFo8fKy8NS!I'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '2Ax*ep$KknOt]G8SXSz', folderTracks: 3999468420595714}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'e^QKak2Oq', folderTracks: -1706168095342593}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '@HddsHCvfjK3jE', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'wcAU&bqgnYV', trackMedia: 'ih%(p^o]1g'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'oSALjJ!F', trackMedia: 6573351082393602}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: ')nR%VGC@IiEU7T&', trackMedia: -6974006334849025}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '!rcYHKpVAs', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'qoN8)a*qk', trackTag: '^%TK]'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'nY[OF4lGdtHS$jtokyd2', trackTag: 7539144196620290}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'jPEq!2Bh43IK44f1o2q', trackTag: 2257633729839103}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'AcB$cq@DufH]n2Y', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 's[prMkeMXe4wQI!M0nP%', trackRawTag: 'FMa2KzdaWFZ4S'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '&CFBftEbJ', trackRawTag: 6471024774217730}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'Q1u7M', trackRawTag: -5895948395872257}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'qqwM42VuBNdXcFjRh&2', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar', {id: '7TAnFsuX4O%0Y', trackState: 'HaXKewR2ZCPNzxSRoTU3'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '3aZ2!u59[*@vqS*rZCsy', trackState: -1068935688486910}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'CL@IcX[OPtGn$%b', trackState: -470180232691713}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'aD(h*21', offset: 'T[lyk'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'LJG6ZA(WTC[^w5', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'iODhmN', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar', {id: '6maaaQ^Pm#LQv)6', offset: 27.03}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar', {id: 't1Z4!^*20COYyRj', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'cfdSg%GhcC)', amount: 'cYEumM2&r'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'K@$chh$Ge', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'FY((sQXNzuQCrnE7ITkJ', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar', {id: 'pKi*qKjs)Vz8G', amount: 83.34}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar', {id: 's7JYt9SPyY!h', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/info', {id: 'x@u9#R%@60aehC'}, 401);
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
					await getNotLoggedIn('folder/album/info', {id: 'Wi$KI!aAmV7&cD!&('}, 401);
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
					await getNotLoggedIn('folder/list', {list: 'random'}, 401);
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
					await get('folder/list', {list: 'avghighest', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('folder/list', {list: 'avghighest', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', rootIDs: [null, '']}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', parentID: ''}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', childOfID: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', artist: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', genre: ''}, 400);
				});
				it('"level" set to "string"', async () => {
					await get('folder/list', {list: 'highest', level: ')@61x]hAXr'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/list', {list: 'recent', level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/list', {list: 'faved', level: 70.95}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'recent', level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/list', {list: 'random', newerThan: '9@DC0wpj@pVlSI'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/list', {list: 'recent', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/list', {list: 'faved', newerThan: 86.45}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'random', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', fromYear: 'i(QGZ&t'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'avghighest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/list', {list: 'faved', fromYear: 61.25}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'highest', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/list', {list: 'faved', toYear: 'EOVq34j#ab'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'random', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/list', {list: 'recent', toYear: 66.24}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'faved', toYear: -1}, 400);
				});
				it('"type" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'random', type: 'invalid'}, 400);
				});
				it('"types" set to "null"', async () => {
					await get('folder/list', {list: 'recent', types: null}, 400);
				});
				it('"types" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', types: [null, '']}, 400);
				});
				it('"types" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'faved', types: [null, 'invalid']}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('folder/list', {list: 'random', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('folder/list', {list: 'faved', sortDescending: '(8B4yTf[8v'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', sortDescending: 5161909288435714}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', sortDescending: -5635424907165697}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/list', {list: 'recent', folderTag: '2NCXNWu*PL9%Yic@f'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'highest', folderTag: -3289548255657982}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', folderTag: -8414050182496257}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/list', {list: 'highest', folderState: 'JTio%!&AI4'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'recent', folderState: 7362348784287746}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'faved', folderState: -2817226004496385}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/list', {list: 'faved', folderCounts: 'vOG)s#$wE3#j'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'highest', folderCounts: -1276496803004414}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', folderCounts: 4111208617607167}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/list', {list: 'random', folderParents: 'GRZS3*)S$Umjzd'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'frequent', folderParents: 532314429849602}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', folderParents: 6590285798703103}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderInfo: 'u(c7E'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'avghighest', folderInfo: 5681201255809026}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', folderInfo: -5402076595093505}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderSimilar: 'dCRQJEpVnJts2G('}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'random', folderSimilar: -4537203929645054}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'recent', folderSimilar: -6190313081143297}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderArtworks: '&AlKEq'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'avghighest', folderArtworks: 7793040609509378}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'faved', folderArtworks: -2148677963481089}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/list', {list: 'highest', offset: 'fV4gnOAW0Kd%mp'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/list', {list: 'random', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/list', {list: 'random', offset: 15.3}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/list', {list: 'recent', amount: 'LFNjA5p8GM%ajMr'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/list', {list: 'faved', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/list', {list: 'avghighest', amount: 80.34}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/list', {list: 'random', amount: 0}, 400);
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
					await get('folder/search', {offset: 'G^a)pWJI'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/search', {offset: 26.76}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/search', {amount: 'RyOdk*'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/search', {amount: 31.7}, 400);
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
					await get('folder/search', {level: 'pVu$84igq!Al'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/search', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/search', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/search', {level: 90.49}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/search', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/search', {newerThan: 'EF5Z]'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/search', {newerThan: 89.95}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/search', {fromYear: '[FMiW'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/search', {fromYear: 89.3}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/search', {toYear: '^HV[ea*0u1Bj'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/search', {toYear: 51.75}, 400);
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
					await get('folder/search', {sortDescending: 'DuzM^WNjnw41%3NPv'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/search', {sortDescending: -6249783027040254}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/search', {sortDescending: 8813707270291455}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/search', {folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/search', {folderChildren: 'cfJpA5&Qc3#'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/search', {folderChildren: 311283924598786}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/search', {folderChildren: -197694630920193}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/search', {folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/search', {folderSubfolders: 'QoH%$C(M3&vQ%S@8GaL]'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/search', {folderSubfolders: 2824274314264578}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/search', {folderSubfolders: -53805039222785}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/search', {folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/search', {folderTracks: 'ey^S^!rW'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/search', {folderTracks: -8390204977053694}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/search', {folderTracks: -6791516710240257}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/search', {trackMedia: '5TyUJRLiWCd2f@'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/search', {trackMedia: -6032754764414974}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/search', {trackMedia: 7654181473091583}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/search', {trackTag: 'C0(Y3B7u79HO[pKz[Z'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackTag: 5733171127648258}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackTag: -4722101197996033}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/search', {trackRawTag: 'uB@tpzhOU^m'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackRawTag: 5089477374509058}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackRawTag: -7592080503209985}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/search', {trackState: 'odspiMda!vATu'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/search', {trackState: -5595925187657726}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/search', {trackState: 3519684460675071}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/search', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/search', {folderTag: 'm(&$97eugvg!doqx['}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/search', {folderTag: 5219313417977858}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/search', {folderTag: 2953969747886079}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/search', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/search', {folderState: 'grj#%L5y$L'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/search', {folderState: -5154087234437118}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/search', {folderState: -5685176537448449}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/search', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/search', {folderCounts: 'h^oPN3oxMx'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/search', {folderCounts: 8398383429451778}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/search', {folderCounts: -177792880738305}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/search', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/search', {folderParents: 'vEu4wi]EbHY216OLzU'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/search', {folderParents: 2403228385804290}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/search', {folderParents: -5497286989709313}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/search', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/search', {folderInfo: 'MzK5ocW@X0nwFLNrM*Rr'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/search', {folderInfo: 1717819649556482}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/search', {folderInfo: 8196837609570303}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/search', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/search', {folderSimilar: 'mXWMZZMVw0ubyi&'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/search', {folderSimilar: -6464576312836094}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/search', {folderSimilar: 6612626557632511}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/search', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/search', {folderArtworks: 'iU*ulL#MDlBf$'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/search', {folderArtworks: -5924098286813182}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/search', {folderArtworks: 6067826754322431}, 400);
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
					await get('folder/health', {level: '7oCBw4ENq'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/health', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/health', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/health', {level: 98.42}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/health', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/health', {newerThan: '4D]&AphDnW'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/health', {newerThan: 77.46}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/health', {fromYear: 'Aqpg9YaSdFi8nuSZ[9'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/health', {fromYear: 10.08}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/health', {toYear: 'G7RgqPYD'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/health', {toYear: 88.82}, 400);
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
					await get('folder/health', {sortDescending: 'hZLKFpddO3Lxf@Lq'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/health', {sortDescending: 3630492096135170}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/health', {sortDescending: -3430453809774593}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/health', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/health', {folderTag: 's9J61'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/health', {folderTag: -102411364466686}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/health', {folderTag: -2579906198241281}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/health', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/health', {folderState: 'Cd)eN'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/health', {folderState: -2004969137897470}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/health', {folderState: -1139649649049601}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/health', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/health', {folderCounts: 'ySOpPn9'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/health', {folderCounts: 1355074576056322}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/health', {folderCounts: -4083316659585025}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/health', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/health', {folderParents: 'wAQ0IIzf1'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/health', {folderParents: -1490332030074878}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/health', {folderParents: -8977358228815873}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/health', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/health', {folderInfo: 'XyqlYh%1GP!Cn[#q&[A'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/health', {folderInfo: -519664165715966}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/health', {folderInfo: 7442118238797823}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/health', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/health', {folderSimilar: 'Yz7G8hw9MV9hb'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/health', {folderSimilar: 2458800015540226}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/health', {folderSimilar: -7360677970706433}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/health', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/health', {folderArtworks: 'C(2&i*'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/health', {folderArtworks: 5707346382684162}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/health', {folderArtworks: -810267306885121}, 400);
				});
			});
		});
		describe('folder/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/state', {id: 'FSoKL69V$Fv)K8bKD2Qk'}, 401);
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
					await getNotLoggedIn('folder/states', {ids: ['tT%ub*4Tf7', '%rF$uJp0C3W]vNf']}, 401);
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
					await getNotLoggedIn('folder/artist/similar/tracks', {id: 'ycI1Vc6atDnfJ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '(wphtwPz5B9iB7es', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'hcg]XO)sVkem$dM^gt', trackMedia: 'aJp1kTje$Tmh'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: '7Nd%TAp2U)%N(f', trackMedia: -3263375509291006}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'KE!]D&CvM2M)$l1^ILN1', trackMedia: -4712214174892033}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '[EpS]zcI%L', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'EQvE5h7So$Sqs2[pv', trackTag: 'UEVm9CXBgZ'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'k4#Yko&]IbHi5P', trackTag: 8559558616154114}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'UN%LeNHC^YGy9p%2h', trackTag: 3821254574342143}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Njj7V', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'zcZibLExrM0oH', trackRawTag: '5jll8gv!zxq!wqiehU7g'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: '%EEPGv(#RE*)B', trackRawTag: -3006146377940990}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: '!ZUyvjLRP', trackRawTag: -2869567659442177}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '@p0KZc2Z62421atD', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: '@h5Qbm*', trackState: 'hO$L1BKvX%'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: '9KOPswowQdOA41wJgt', trackState: -3234701695254526}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'EL8xZO%L4qnFO7(I$ORI', trackState: -534202860699649}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: '$&P4Qv9kz)]ljB', offset: 'BqRAwDB7ceubo27mv'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: ')2qebKwzOK', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'TYqZS]j6xTt^MsV', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: '5))O9SBU2H0fyJ', offset: 46.97}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'jEI1P$9I*GPLPZu9M3Vv', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'Dt8sS*C', amount: 'd8P1Soz%jMnQ&S6'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '#UDan)', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'k[L3YwxBLJ89QfI@', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: 'GuDJG^fH8aA', amount: 90.45}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'GH)tvUrv35M4ZG(JyX6', amount: 0}, 400);
				});
			});
		});
		describe('folder/artworks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artworks', {id: 'Z!9qDom'}, 401);
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
					await getNotLoggedIn('track/id', {id: 'gsB(LF*jbz&'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/id', {id: '*ZjdLPX8j6lSW', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/id', {id: ']^nS4OMpoZ!LRo3', trackMedia: 'YGnCI(ha)1'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/id', {id: '16*(VN@sINYp', trackMedia: 2291276590350338}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/id', {id: 'RqTmVa7C!LQEfZro6Ws$', trackMedia: -4502812138405889}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/id', {id: 't%[YpDn)VO(][MVAi@', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/id', {id: '9lLYkl0lWdxy(', trackTag: 'gWlKtLGZ2JKnLEM%1yl'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/id', {id: 'q8UUgSGtoKqL1', trackTag: -3684775432814590}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/id', {id: 'nA#^$Ss5d09!', trackTag: 8340087855120383}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/id', {id: 'pVbXwU1kx0', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/id', {id: 'dUR8iFgqcgz%5', trackRawTag: 'E&Zz*&s[ba14f)lU'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/id', {id: 'l)fuaMEYApS6@W', trackRawTag: 7978035428982786}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/id', {id: 'X5QB(P#LcT87', trackRawTag: -5928187468972033}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/id', {id: '8mqLnk8D!W', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/id', {id: '$obc54l@*dF91zS7!j', trackState: '9YhtkNRW['}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/id', {id: 'StC@!usm', trackState: -8231608075157502}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/id', {id: 'dl3Nc%($OnAVkg', trackState: 6362448055500799}, 400);
				});
			});
		});
		describe('track/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/ids', {ids: ['TlxmbURNxF7gVT', 'I(qzfH']}, 401);
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
					await get('track/ids', {ids: ['MWPnbWX5oq6dqlpN!', 'Gb3Um)fpS15R73(e'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/ids', {ids: ['^IWUX4aYz9V', 'z(@#XKQS[BSYz3PI'], trackMedia: 'OAXKhD(JwS0ZjCs'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['YxffvD(u0@^g[g[mU5V', 'FT9*OVe2Pb^xiE'], trackMedia: 517487309357058}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['bnS[Bt8TNrWT^KFq', '%KKEyZxBDi$G^oH8igNH'], trackMedia: 7451611232206847}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['RWgxP1Z13Nhi', 'YpV$hkPZ(*[H1uk8S9$'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/ids', {ids: ['3oo@Ynr!mzS!UaVFe', 'V&0YOi'], trackTag: '3m[Nf6pgPF@Vd0Wz4'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['k^06@f', '91u*L0J4h'], trackTag: -4726580861468670}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['fGNgy$Zv', 'fZHeaz'], trackTag: 5911474560040959}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['gnQCs&e]s', '$yb0(kI9LTfxFw@U^$'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/ids', {ids: ['ZoNf%Vx', 'khPj^KuJHB'], trackRawTag: 'Z5BNupX2Y&N*'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['tDovkexGpMW%BEIo1', 'v)FUN'], trackRawTag: 7741321494134786}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['Wy!uw]54H%x#%PF', ')]&rD(l%rDvgkCV'], trackRawTag: -6889402659766273}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/ids', {ids: ['edw5dZd1*B#lY$lMILa', 'DL%q6I'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/ids', {ids: ['Wd[6X', 'dOUoG8DE9q!&cqosCGaF'], trackState: '1yoe%q5gD*x'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['M*AC@tFup(2J#%hBX', 'TLit!aXZ'], trackState: 8063733364424706}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['Y5)bgVE*', 'UIpcjc3%r$xZnst[9'], trackState: -6900832729563137}, 400);
				});
			});
		});
		describe('track/rawTag', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/rawTag', {id: 's2znHTKWu6FVkt%z'}, 401);
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
					await getNotLoggedIn('track/rawTags', {ids: ['zncntWyF)oi', 'X5S9J']}, 401);
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
					await get('track/search', {offset: 'hrn3VZQtWHAXA(dMxIv'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/search', {offset: 90.56}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/search', {amount: 'NYkHfs'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/search', {amount: 36.09}, 400);
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
					await get('track/search', {newerThan: 'rQ^bd#KGpsPewCh'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/search', {newerThan: 49.12}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/search', {fromYear: 'e*bvD0ow34p$oRhSDa'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/search', {fromYear: 23.08}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/search', {toYear: '585zx6ymaEvJm2dOIG'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/search', {toYear: 66.39}, 400);
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
					await get('track/search', {sortDescending: 'CW8ic2'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/search', {sortDescending: 6694806352822274}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/search', {sortDescending: 7542363966668799}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/search', {trackMedia: 'tZuPg7MjT[$hJ@jrL3T'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/search', {trackMedia: 4944103536066562}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/search', {trackMedia: 637589753167871}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/search', {trackTag: '9zrNZw[z5r6Vc5p8Z3#'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/search', {trackTag: -94157100023806}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/search', {trackTag: -6646526663196673}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/search', {trackRawTag: 'qhZ[w]yP)'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/search', {trackRawTag: -2693947436564478}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/search', {trackRawTag: -2159593404760065}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/search', {trackState: 'hw01w3GBa4O1EViO#3'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/search', {trackState: -2529800379957246}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/search', {trackState: -5840484165484545}, 400);
				});
			});
		});
		describe('track/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/state', {id: 'R%BZ[v'}, 401);
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
					await getNotLoggedIn('track/states', {ids: ['imoCy', 'XuvI9btHfkt0e)xc!4t']}, 401);
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
					await get('track/list', {list: 'avghighest', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', artistID: ''}, 400);
				});
				it('"albumArtistID" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', albumArtistID: ''}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', parentID: ''}, 400);
				});
				it('"parentIDs" set to "null"', async () => {
					await get('track/list', {list: 'avghighest', parentIDs: null}, 400);
				});
				it('"parentIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', parentIDs: [null, '']}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', childOfID: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('track/list', {list: 'faved', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', rootIDs: [null, '']}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('track/list', {list: 'random', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', genre: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('track/list', {list: 'frequent', newerThan: 'l%kIQ[XHNjAblM2u'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/list', {list: 'faved', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/list', {list: 'recent', newerThan: 72.62}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'faved', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/list', {list: 'frequent', fromYear: 'q%%8)w'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/list', {list: 'highest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/list', {list: 'highest', fromYear: 25.41}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'recent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/list', {list: 'random', toYear: 'c!&1HeZmetF!ixPqE'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/list', {list: 'random', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', toYear: 28.58}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'faved', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('track/list', {list: 'frequent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('track/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('track/list', {list: 'highest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('track/list', {list: 'highest', sortDescending: 'RIL^DJBktDctdJ'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/list', {list: 'highest', sortDescending: 314042019217410}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/list', {list: 'avghighest', sortDescending: 1763636498399231}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/list', {list: 'avghighest', trackMedia: 'He46kKZaNUoVn]'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/list', {list: 'recent', trackMedia: 157715875758082}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/list', {list: 'faved', trackMedia: -4642528296961}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/list', {list: 'faved', trackTag: 'aC^XQCl9@%Id69tdajV'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'recent', trackTag: -536937249112062}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'highest', trackTag: -1492334806040577}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/list', {list: 'faved', trackRawTag: 'mng4[P2fMaQ4KoE0gMe*'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'frequent', trackRawTag: 2889897572564994}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'recent', trackRawTag: 1661463299096575}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/list', {list: 'faved', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/list', {list: 'random', trackState: 'Cji3c40vv7]'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/list', {list: 'frequent', trackState: -5398630361989118}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/list', {list: 'recent', trackState: 8687718175342591}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/list', {list: 'highest', offset: 'Mc!14IblUAPn#XnHX2^f'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/list', {list: 'frequent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', offset: 76.88}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'avghighest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/list', {list: 'recent', amount: 'Z7H7oHzG36hk^YL'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/list', {list: 'highest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/list', {list: 'recent', amount: 10.59}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/list', {list: 'frequent', amount: 0}, 400);
				});
			});
		});
		describe('track/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/similar', {id: 'b1%TF!LN#sLf)7S['}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/similar', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/similar', {id: 'eksbN0yC8ls', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/similar', {id: 'bX^a550xsX&rv2YLP*!]', trackMedia: '4]@zY0O1%r'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'U8Gkx*lBCBCG1ivUU', trackMedia: -2392665828098046}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/similar', {id: '&xkDYzh&I0qaWSD9Xk', trackMedia: 2154536751857663}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'nyOQs16nDnR', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/similar', {id: 'S$4RtX^x', trackTag: 'wxT*nv&aYi'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'FuL0zPDCKhO', trackTag: 8225363259817986}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'p$n30$li%hhrzaP', trackTag: -8532572317417473}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'A*1u8Lt8[#N[mZ#Y', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/similar', {id: 'RdP*JGDB#lb', trackRawTag: 'frhMpUdvKITtPQBho('}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'Epr5j&8kI$iIrY)W&n[', trackRawTag: 2234075490287618}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'gK9^cR&VN6LQh#*)L&', trackRawTag: 5842744966643711}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/similar', {id: 'gTZRyt0', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/similar', {id: '9Y@Vl0PDD#', trackState: 'g%3&vdR16C@'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/similar', {id: '!QJf)SfNU1ZyUX', trackState: 1870471654014978}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/similar', {id: '0pYeVbjSARoW0NvO', trackState: 7550034509823999}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/similar', {id: '!%YwhKV3KDjUlZ', offset: 'HhOj[@dpwDc%1svm&'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/similar', {id: 'qERq2&R', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/similar', {id: '!Iv$dr]Z*iB6x1%s', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/similar', {id: 'ZkGU4', offset: 30.25}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/similar', {id: 'UxQ9j8JO)xJit%y', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/similar', {id: 'ubFVypM9wj]kL]', amount: 'FoLCr'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/similar', {id: '(gMJB(F45zz', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/similar', {id: 'xXMoGPoKZymzFJ4N^Uz]', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/similar', {id: 'Jps8KY)', amount: 78.82}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/similar', {id: 'RAXDWmfLY9', amount: 0}, 400);
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
					await get('track/health', {media: '(nwpGNw6m#C^N'}, 400);
				});
				it('"media" set to "integer > 1"', async () => {
					await get('track/health', {media: -8773998657667070}, 400);
				});
				it('"media" set to "integer < 0"', async () => {
					await get('track/health', {media: -301058295332865}, 400);
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
					await get('track/health', {newerThan: 'cC*Hi$S)'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/health', {newerThan: 93.47}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/health', {fromYear: 'B[0@A'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/health', {fromYear: 79.27}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/health', {toYear: 'VHC4G'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/health', {toYear: 52.33}, 400);
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
					await get('track/health', {sortDescending: '8ACvL$xY]'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/health', {sortDescending: -3694530926739454}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/health', {sortDescending: -1364607448907777}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/health', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/health', {trackMedia: 'ty^o4]E2'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/health', {trackMedia: -5250962901958654}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/health', {trackMedia: 3932039120158719}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/health', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/health', {trackTag: '*CpUNX)IIH%81Y!%'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/health', {trackTag: 2172404537229314}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/health', {trackTag: -2737676339904513}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/health', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/health', {trackRawTag: 'a3#48LlxwiZcwd[Esibi'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/health', {trackRawTag: -7075802919206910}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/health', {trackRawTag: -1301544335048705}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/health', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/health', {trackState: 'TNRx[LxppXX@08'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/health', {trackState: 5876775691223042}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/health', {trackState: 2290369433698303}, 400);
				});
			});
		});
		describe('track/lyrics', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/lyrics', {id: '*(OxJmXy][[rRX5*h0qN'}, 401);
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
					await getNotLoggedIn('episode/id', {id: 'nLY4YwU7Y1G'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/id', {id: ')X%Ot&pg3c]3Su]kBi', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/id', {id: 'YDvQ*G8rEagZS9', trackMedia: '!1dII7'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/id', {id: '2Z%!uj3D0YAk*aG&h6D', trackMedia: -907003027259390}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/id', {id: ']Fb@Cm8i@pbyHseXDSif', trackMedia: 2731342391410687}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/id', {id: 'R##8XQbqXiG3PA&TXDa', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/id', {id: '@R)tQEZTwRbj', trackTag: 'A&#]MifTQ51#42GiTX'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'QmwtNRD4', trackTag: 6437834344890370}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'ZzHqjB#DhvU$DjLL', trackTag: 5353439986974719}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/id', {id: '2O8MSV', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/id', {id: '1jVcWl[I', trackRawTag: '8si2Rf!wb8H$cD(#!'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'cdILiUJ', trackRawTag: 499621843435522}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: '!g!V@1^QRi', trackRawTag: -3792441211617281}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/id', {id: 'eNt!YrHfegMTJBN#q', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/id', {id: 'P07Ir0T!QtZ', trackState: 'oo)zh59*L@FsnpIuUx['}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'wDjVq9DT', trackState: -1529199848325118}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'M@)kI', trackState: 8648852529741823}, 400);
				});
			});
		});
		describe('episode/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/ids', {ids: ['Sh#7BtgDNL5yY', 'UK2cdJn1z']}, 401);
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
					await get('episode/ids', {ids: ['XcDB[H5ayo[y', 'tqd1hh2'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/ids', {ids: ['^N5E1ioI&ZpIl', 'GY4vtx%2luv!4@Ey!t'], trackMedia: 'glFv^uNz'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: [')9X#(Wp))Ijl9', 'QyQkHup6H3'], trackMedia: 5199469960232962}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['D)inigL5sqaj7g', '3p2t9'], trackMedia: 6432298383704063}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['KU&tI7fy!A6B', 'U)ziCjx[EgV'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['s]Lbdv', 'K)kk4bpUdm4wJ]'], trackTag: '23x6Yg!)6[lC'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['q49]s2)QSZE)K12FKK', 'uRMqRgX@&(xKFLC$Qm'], trackTag: -1347699869745150}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['q2(1JAg(W6', '2aYqWB'], trackTag: -2024666889715713}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['#!CAbP', 'tnxJLy&QT(tAZ4VSXSq4'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['Uq^l]8p', '(9F7%aTlCkP#]zwi7^dr'], trackRawTag: '[UGSY'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['r]tRp)d^qCPBHZ*S$', 'DPA)H'], trackRawTag: -7363104530759678}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['!]Q&(giLqf)G@G0#G6i3', 'LiQ!xc5e9TeoPuPL4Nj%'], trackRawTag: 2924237522206719}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['X]p!$(fxVL(3$gpLw', 'Wgg)XnN1RN#S^fW8e'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/ids', {ids: ['#uz]nWAo)x', 'vJC14cwEsH@&skWr)d'], trackState: 'cLjEXb0XQ&yPeI)'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['bntZGpAO$pW', 'ff6HixyX*fJtJ'], trackState: -5234321229086718}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['J3]&y4jITRtEYv', 'DTEd9TUCE#&pIUFa]L'], trackState: -572157474111489}, 400);
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
					await get('episode/search', {offset: 'Hz2YLVnd!25G*wFh2u6'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/search', {offset: 17.6}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/search', {amount: '@9%lG00'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/search', {amount: 31.84}, 400);
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
					await get('episode/search', {sortDescending: 'uw(#K@zASpKPF6o%Aqs'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/search', {sortDescending: 5639445113995266}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/search', {sortDescending: -8818981133615105}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/search', {trackMedia: 'zbVlce[9l]'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/search', {trackMedia: 2248984546508802}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/search', {trackMedia: 8794587950743551}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/search', {trackTag: 'rIvd#!T'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackTag: -1734666977542142}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackTag: 4475766813229055}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/search', {trackRawTag: 'mA2UzG'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackRawTag: 6304860962029570}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackRawTag: -7556208772775937}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/search', {trackState: 'xbhl#O$A#%'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/search', {trackState: -7664410025787390}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/search', {trackState: -6003426051751937}, 400);
				});
			});
		});
		describe('episode/retrieve', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/retrieve', {id: 'tf(l)ZX)!9EKAAMu!'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/retrieve', {id: 'tf(l)ZX)!9EKAAMu!'}, 401);
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
					await getNotLoggedIn('episode/state', {id: 'gS$MC7B!s3LhSobn'}, 401);
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
					await getNotLoggedIn('episode/states', {ids: ['m@ECdfhqEV', 'ptTBnX']}, 401);
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
					await getNotLoggedIn('episode/status', {id: '589EfEF%d'}, 401);
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
					await getNotLoggedIn('episode/list', {list: 'highest'}, 401);
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
					await get('episode/list', {list: 'avghighest', podcastID: ''}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', name: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('episode/list', {list: 'avghighest', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('episode/list', {list: 'frequent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('episode/list', {list: 'avghighest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('episode/list', {list: 'highest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('episode/list', {list: 'recent', sortDescending: ']gI53hf)d'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'recent', sortDescending: -6429514313760766}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'faved', sortDescending: -8436131506946049}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/list', {list: 'recent', trackMedia: 'XqqLu@f&xhily[eu$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'highest', trackMedia: 797285747261442}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'avghighest', trackMedia: 516002727067647}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'highest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/list', {list: 'highest', trackTag: 'V5bebeGL$AU4r'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'avghighest', trackTag: -2404387624321022}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'random', trackTag: -4531029754773505}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', trackRawTag: 'YHZ2NF4uJ3Vt]'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'recent', trackRawTag: 3513829912739842}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'random', trackRawTag: -3277603007889409}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', trackState: '0MghTzG&2sMUYS$]l#f'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'frequent', trackState: -1651970771255294}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'frequent', trackState: -7734698738450433}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', offset: 'DXV&Vjx'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/list', {list: 'faved', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/list', {list: 'highest', offset: 3.8}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/list', {list: 'avghighest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/list', {list: 'faved', amount: 'Ry^nvo4IPlN@9&'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/list', {list: 'highest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/list', {list: 'random', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/list', {list: 'recent', amount: 27.4}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('episode/list', {list: 'faved', amount: 0}, 400);
				});
			});
		});
		describe('podcast/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/id', {id: 'T1V@TJ9jh29'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/id', {id: ''}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/id', {id: '5X3VYVt3C', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/id', {id: 'cuu[vv#FmuXRwV48QE5X', podcastState: '6%iHrpxN(u7'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'HS7iOYm*CJM', podcastState: -7258777577324542}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'UO5X2q', podcastState: 6157363073515519}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/id', {id: '#RHoxZme(25^tRty', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/id', {id: 'z@a3rZW', podcastEpisodes: 'a5ilrbU2U#5@(9hh'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'Evd3H', podcastEpisodes: 6338610726961154}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/id', {id: ')JKE*FUU4$*vK8&qyc3', podcastEpisodes: -7277267042435073}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/id', {id: '1ata2QV', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/id', {id: '[]0Kt^9hU^h', trackMedia: 'RHKudx%$D*MG@#u'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'nKs#]8pp', trackMedia: -2633731055550462}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'YNj@3xJ@z$Pi', trackMedia: -1329906583601153}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/id', {id: 'YI^AMYDqCEAdK', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/id', {id: 'wKW)tQBNb2usPVzj$spS', trackTag: 'eV0v886iT&kse9Ka'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'RljNK', trackTag: 6870738128601090}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '2K2AD)@Nm7inpsSo', trackTag: -718509134839809}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/id', {id: 'Gr)h5PERxwQ', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/id', {id: '(hXPwVG[g', trackRawTag: 'vySvI#7rn'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'lI05&ACn&MM!D9MMX', trackRawTag: -4057731266772990}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'w6u#Le1kZN2pdiHhAG4', trackRawTag: -6595774074847233}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/id', {id: 'TF@7rmf', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/id', {id: 'pznlNWid3]RmdV*a22S3', trackState: '$6QmVBL1zsu2('}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 's6O4EkE@', trackState: -6312066545614846}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'uaalr5&cFcBNT)UaH', trackState: 1634776167481343}, 400);
				});
			});
		});
		describe('podcast/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/ids', {ids: ['TSI6bK]9z169@%', 'VXVhfY#7sjk']}, 401);
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
					await get('podcast/ids', {ids: ['sm&BS1NS!8mv', 'ZF6z#YC^R!KiIe$[8dh'], podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['C)eX]LjyLg&tq', 'G1r%Qg1H^'], podcastState: 'IKhoW&rPyxp!T^*Jaq'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['jyZhv8E2t8A0RR', 'V[hQI])95'], podcastState: 4124524878495746}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['j#MiB4MSAkqgT8', 'yS7jhHv]Jwwn8G)'], podcastState: 7987140075978751}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['LTbsN)', 'm2c)eoZik65nT'], podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/ids', {ids: ['iO!zM1', 'Oefch3W'], podcastEpisodes: 's^omxeH2yo6&vRc8U[*Q'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['Wamihf', 'L3cKx4'], podcastEpisodes: -609844646117374}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['*8LUtYqE1A3h', 'q^!CzYnseIw'], podcastEpisodes: -3845904217931777}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['DB*dophh4', 'ec7qFZUTU^'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/ids', {ids: ['P0nL[', '!VouLjOB'], trackMedia: 'xiK1mYvRQe'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['IhCb6aAWD2MRyrBVXn', 'HzSb(rQ'], trackMedia: 473439408226306}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['%fITr', '@lqiMwAgcujGF*yn'], trackMedia: -7059134776082433}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['V!F5DT8]K', 'L9m8KvE0&N9Kg'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['x^!2&SG]L3', 'dig(W]K7#[#bEz'], trackTag: 'Kr%z3^avqQxmq*pKv'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['$sOoD', '$woVE8^)4GRjf'], trackTag: -216034237743102}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['ooW0@pHii^)TxFL*I$3!', '$seh8HbgPW4'], trackTag: 5162436311121919}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['gAlZcJ5ssKn', 'LSG(mtYDI8)!zI'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['46p5xodJ7YkBZio]rt@', '$MN0*8Vh%xyavjq3^'], trackRawTag: 'U7F25No2'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['vdQ92spS8&tORPG5wL', 'iM%D#ji'], trackRawTag: -6631453269950462}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['sXohoMPUZZJ(&5GW(', '[zovO^0U7!hLX1HmU@aU'], trackRawTag: -3437028146413569}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['PpdaHPG)', 'VIdzVkgY64CqZi'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['sHLqc@eDQ9k2oQXPm', 'rK7O(rc*0dhPFCtx'], trackState: 'xmhv4fQi$WHNmHyqs'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['TaRGs4gGBlj0eSbwjF', 'yRKQb$D@0fNJk%e8'], trackState: 3124474736017410}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['Pat3E[epd7yg[z0i', ')4qz7t6HrZ^H^(OFq%'], trackState: 1973492798980095}, 400);
				});
			});
		});
		describe('podcast/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/status', {id: 'w9lauU[J*JBxe2ye^z2'}, 401);
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
					await get('podcast/search', {offset: 'gdDJGzK'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/search', {offset: 61.45}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/search', {amount: '3k!r8Hf7dWFn'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/search', {amount: 35.49}, 400);
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
					await get('podcast/search', {sortDescending: 'LAP*jfSP'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/search', {sortDescending: -2990254327857150}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/search', {sortDescending: -6142353781817345}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/search', {podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/search', {podcastState: '8NN^(1sVdkjn7ea%lMC2'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastState: -3737061991383038}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastState: 6860989437837311}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/search', {podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/search', {podcastEpisodes: 'uIxY%Kp)8'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastEpisodes: 96632343363586}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastEpisodes: 907550673338367}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/search', {trackMedia: 'zfj@oiGiHWSm@Ai(N'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/search', {trackMedia: -6696451698589694}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/search', {trackMedia: 2763986302926847}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/search', {trackTag: 'u)65^2NIo$'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackTag: 5453746427396098}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackTag: -8897312872988673}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/search', {trackRawTag: '6V0j1fXqnuX5lccw'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackRawTag: 3805855598247938}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackRawTag: 2965136658661375}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/search', {trackState: '1HZUCZ&j45nYGtws'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/search', {trackState: 506511944056834}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/search', {trackState: -3080723288293377}, 400);
				});
			});
		});
		describe('podcast/episodes', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/episodes', {id: '6^8rx&Jh0qvk5cd9'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/episodes', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'Ygq4osEU[p(#VI5oj@f', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/episodes', {id: '&bZnVQbp$X@V3mMr', trackMedia: 'SFdd3dDLb6wdb3KgQ[K'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'y9kmTP8TV25FG&', trackMedia: -1142724484923390}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'sv(J3Hc', trackMedia: -4827527604338689}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'auBV!@tut]dVkb', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/episodes', {id: 'B[rz9ymf^!hswU7O5(h', trackTag: 'OoqhJI!S^JfvC(s'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'Rb2TOGSo', trackTag: -6669561352945662}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: '7WFe5c]b[5k1w&gFN54', trackTag: -5270644241465345}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'NxpFMMoUIHo6G', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/episodes', {id: 'q7tw81LN3rRl', trackRawTag: '(Esdb%8'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: '1h6%0B*w', trackRawTag: -7885092378640382}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'k4%urW2vo', trackRawTag: 8038706044731391}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'lO&82n6fxgz^6@1', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/episodes', {id: '@@kZGi54N', trackState: 'wi2O)T&O*DR@U09PE!c'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'Rs31cGfCRUJ5RI42K%6', trackState: 3112541597204482}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'cOAenbqfvSt2', trackState: -3631270504431617}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/episodes', {id: 'D3nlqJ%uiceCZK', offset: 'GA4XgXjn@Z6AtFLlD'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'DIP25cZDj)OTEHaj2', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'ld8w$S#ouJsZE*jb(5aY', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/episodes', {id: 'TD)pDahnt$h', offset: 35.44}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/episodes', {id: 'Pqxf]jR!kU)q2', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/episodes', {id: 'AW)Ety2lLh*McZ', amount: 'dCUs(1lnM#u'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'YhG1uR@v3', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'ietPMyeg!kzgj[', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/episodes', {id: '&KIkf2WI*w]RP7*Mt*', amount: 22.52}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/episodes', {id: 'M]K!AP6!jkTVo8hqdt9', amount: 0}, 400);
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
					await getNotLoggedIn('podcast/refresh', {id: '3p#(kmo^OT&u'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/refresh', {id: '3p#(kmo^OT&u'}, 401);
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
					await getNotLoggedIn('podcast/state', {id: 'cwhq5M'}, 401);
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
					await getNotLoggedIn('podcast/states', {ids: ['vfsWKhKijt!l(GlpI2[', 'lsZZHp9qrGY']}, 401);
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
					await getNotLoggedIn('podcast/list', {list: 'highest'}, 401);
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
					await get('podcast/list', {list: 'avghighest', url: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', title: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('podcast/list', {list: 'faved', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('podcast/list', {list: 'avghighest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', sortDescending: '#@@(amjO'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', sortDescending: -7216739523756030}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'avghighest', sortDescending: 6976153092882431}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/list', {list: 'random', podcastState: '*ahZ8NgYA[TyTTqBMy'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'avghighest', podcastState: 698635192893442}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', podcastState: -2187879140818945}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/list', {list: 'avghighest', podcastEpisodes: 'BR[iM'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'avghighest', podcastEpisodes: 6032575046877186}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'random', podcastEpisodes: 3753830516785151}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', trackMedia: 'hWA&Y3eq&trP0fDJ'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'random', trackMedia: -4509810212995070}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'recent', trackMedia: 5303518327996415}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', trackTag: 'jX@z)H49hJkQpD'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'faved', trackTag: 4054053629722626}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'avghighest', trackTag: -8117077852291073}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/list', {list: 'avghighest', trackRawTag: 'IoaKsu7%fp'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'highest', trackRawTag: 714472389869570}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'recent', trackRawTag: -482129574100993}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/list', {list: 'highest', trackState: 'cgUPV(Sbq20'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', trackState: 850416745054210}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', trackState: -3348627799932929}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/list', {list: 'frequent', offset: 'Dh696'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/list', {list: 'frequent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/list', {list: 'avghighest', offset: 15.01}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/list', {list: 'avghighest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/list', {list: 'random', amount: 'yEbGXsf2ji]t'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/list', {list: 'random', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/list', {list: 'avghighest', amount: 95.71}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/list', {list: 'faved', amount: 0}, 400);
				});
			});
		});
		describe('radio/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/id', {id: 'UoyoD', radioState: true}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('radio/id', {id: '', radioState: true}, 400);
				});
				it('"radioState" set to "empty string"', async () => {
					await get('radio/id', {id: 't@SKGh7sXxRHgr)iU', radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/id', {id: ')Nt1BX', radioState: '07&BVpf&9MZUh1dL)d'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/id', {id: 'EBRZj7Ul8cf8x', radioState: 8572065779023874}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/id', {id: 'q#Tz4*MaRk0#[s60q3', radioState: -6495787995365377}, 400);
				});
			});
		});
		describe('radio/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/ids', {ids: ['Lbw[(85B)Db', 'C8%CN[e1O[fU'], radioState: true}, 401);
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
					await get('radio/ids', {ids: ['UlDUo&$u5', 'NK(59RIHNw!T4W['], radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/ids', {ids: ['s8*8Y', 'SYv031HE^$JkyB]07iX0'], radioState: '3C3W[J('}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/ids', {ids: ['au@E3](4Y7ezSP', '&UOyBnTp7Bw'], radioState: -587519775211518}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/ids', {ids: ['FochwKUFV29!8F@', 'u6uK[6EwAWJy#kQ$Gi'], radioState: 816400595681279}, 400);
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
					await get('radio/search', {radioState: '6&@Bz'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: 4626897602347010}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: -2106883057909761}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('radio/search', {radioState: false, offset: '(XwH3M(b6X1&gE'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('radio/search', {radioState: true, offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('radio/search', {radioState: false, offset: 33.43}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('radio/search', {radioState: true, offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('radio/search', {radioState: false, amount: 'J2nB&$V1!caF%t'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('radio/search', {radioState: true, amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('radio/search', {radioState: true, amount: 98.3}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('radio/search', {radioState: true, amount: 0}, 400);
				});
				it('"url" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, url: ''}, 400);
				});
				it('"homepage" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, homepage: ''}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, name: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, sortField: ''}, 400);
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
					await get('radio/search', {radioState: false, query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('radio/search', {radioState: true, sortDescending: 'QOz^2GXkbeUYIfcI'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: false, sortDescending: 3884042856431618}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: true, sortDescending: 8200908424871935}, 400);
				});
			});
		});
		describe('radio/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/state', {id: '5DlzOT6m'}, 401);
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
					await getNotLoggedIn('radio/states', {ids: ['Oo4haYdaMCu', '8pSgvmvF(zuvumjsTd']}, 401);
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
					await getNotLoggedIn('artist/id', {id: '&EHrN%A@fRc*w'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/id', {id: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('artist/id', {id: 'L9D1K', rootID: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/id', {id: 'Ex]uE(lAo9wU48^', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/id', {id: '%v8Z8Evx[RL', artistAlbums: 'AOwG7Ueq1p%zpo57q3GL'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/id', {id: '96i)(2P(zebqop', artistAlbums: -48457314205694}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'usyku6w*ci5[v[W]NAG', artistAlbums: 690783199952895}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/id', {id: '(%WWLwR*YW8', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/id', {id: 'Kmuj]ild4', artistAlbumIDs: '7)(3('}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: '#[u*3X@x$8E#R', artistAlbumIDs: -5764593578147838}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'sNN0CwqcUDTgug', artistAlbumIDs: 1309238366306303}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/id', {id: 'xLwmi[KX7ckj&e4V', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/id', {id: '(DejRJj0V3Sydv@#]hom', artistState: '6^wT$L8c$3'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'WVLJ7SCI', artistState: -850299111604222}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'IUyIOj]85cI6]4', artistState: 6951005061119999}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/id', {id: '%omlC]SyGGLmbNLcky[', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/id', {id: '2@3TADH)e0)yYJPg4R)Q', artistTracks: 'UYlSzs'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'Ug&2pZf!qEg', artistTracks: -7339447179804670}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: '[I3sp^fijJ4Ax6Y21rp', artistTracks: 5444734579376127}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: '!jIt7q4OB[OJFhpK]', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'Nk*((rta', artistTrackIDs: 'Eq^Opki47'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'M9DC6S&8d0', artistTrackIDs: -5662634577756158}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: '2)(Jd6#Y', artistTrackIDs: 7033283955130367}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/id', {id: '39))6)eyv2NG', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/id', {id: 'EZ^tLVYazgQ[', artistInfo: '@aa#iRrnAv[nVJ'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'LIH7i', artistInfo: -8200317304830}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'jIcnZJ(NYVM369V6P', artistInfo: 6317218543435775}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/id', {id: 'Wlw]5FhjUTVp', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/id', {id: 'pyzo0X12vK1akHD8eQ', artistSimilar: 'V6pn4!WZKKH]L'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'oTfucF*mn!V@9oS', artistSimilar: 2043126646571010}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'muRtAs4(ViT', artistSimilar: 7542930503892991}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'hFR6u', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/id', {id: 'Ms()#x', albumTracks: 'YMGpw'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'SoZfv^', albumTracks: 1646984649768962}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: '#Wm[[EkY^#a8cV', albumTracks: 5552503563223039}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'HA8c^PYT85', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: '$0n&zm(YfPub2yR', albumTrackIDs: 'H!rTs09)hcsG8po!*cEh'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: '[[$53C(NIe', albumTrackIDs: 3672486763823106}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'K[VnpeLrjFjCf', albumTrackIDs: 2361953808809983}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/id', {id: '4%bJb@L', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/id', {id: '%8542K', albumState: 'nY4F^*875SKt'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'VyhcH&cgg&W#y', albumState: 4214388516978690}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'EHqOpuehg0', albumState: 1227033510150143}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/id', {id: '2N#H#SJ', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/id', {id: 'bWij9r2T![K8Xfe!ctcg', albumInfo: '$%PO(q'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: ']sV0n%2g*LDI45mGm', albumInfo: -2380686933622782}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'XALYaRTRWYD2B]9kBLk', albumInfo: -3051995665530881}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/id', {id: '0n%vQu!VGf(', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/id', {id: '80z^#kvlCxsy&', trackMedia: 'GEjaMXw*M0Unp(3&692Z'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'w5d@*&NXdjE', trackMedia: -1668590361116670}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/id', {id: '4Ay%6', trackMedia: 2072865134346239}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/id', {id: '3Hvga', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/id', {id: 'u5K2Xp20y&^h4[hm', trackTag: '^4Yxl1wS1fnJu'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'xA[2#R)fPAYeOuu', trackTag: -55930104315902}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'CyHYf)k1g]!eJ', trackTag: 1857687377674239}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/id', {id: 'NF5ZjQ3H!qX&yKO%4BUF', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/id', {id: 'U)*TgIadTAh', trackRawTag: 'K#NKe5OiC8UN$bjP'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: '(^zG6u2yOl(', trackRawTag: 8327213594181634}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'rymjrJLi3sgmx^', trackRawTag: 3524987998699519}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/id', {id: 'u8rhIWywA', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/id', {id: 'U3eZ^D!8yq3Ub^]p', trackState: '6Qrva'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/id', {id: '0Grbi42$O', trackState: 7008220774137858}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/id', {id: '&J^^]JQLqsSHkT2d!$3', trackState: 5811687714193407}, 400);
				});
			});
		});
		describe('artist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/ids', {ids: ['UyST!MrmtyzVdn)[XT', 'cO2G05e1v%()Y4']}, 401);
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
					await get('artist/ids', {ids: ['UbaTb9Rho)TvA&8Q', ')Eu%gb]'], artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/ids', {ids: ['H1OThy&JhVk!VXN5YV', 'PodLL35&'], artistAlbums: 'QrqrfCiX53i4N9)'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['Du^k3l$!s', 'Uvf[98fziKsHAi'], artistAlbums: -2799710200922110}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['SMvD9xbj3Wps', '!!5kFzSCV7SM*y'], artistAlbums: 3497262609072127}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['Dz5wOms2FnGuJu', 'Am5MA#@Tn(jP7'], artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['NwnnLDIj1yjfB6FMZM', 'MojK%)GIlCqYjG'], artistAlbumIDs: '!9nuiXbebS$d'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['vTkzi9', '[ht[knX2OXnyqcRw2jA'], artistAlbumIDs: -3023288942985214}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['dLc8ZZZTfxA*mR%zuTLa', 'gcsFF$Zwi'], artistAlbumIDs: -3704000293634049}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['!aow(ctL)6bm%1AV', '%N@hyH0Ok[UH6'], artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/ids', {ids: ['i#1A3N6mye', 'S7loJEB$96V9lUzav'], artistState: '9rJH)RObUvnwsLG09!)Z'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['h6f0f&', 'DF1znho'], artistState: -8694195850051582}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['e*gV]$o', 'JuUuq[$hJ'], artistState: -6222000955588609}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['JFxMM3%U@P4', '#AQ1&'], artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['SHj(svAEoc8psf', 'D%7SU!q$!E!cTrDdl'], artistTracks: 'jLw@1elWYFpxQ*XGv'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['5Ijr0%rdhAqkxEZet', 'e^^o$Y&3plS50j9zU'], artistTracks: 6337818708148226}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['voBrmNX', '7c^Lcd'], artistTracks: -5869357557088257}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['ThzOMpL*k%nA(8y', '7Y#kC1c^]ae!J'], artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['ohnxU9V]$hD[A', '8VcO6PvyXBjHUnh'], artistTrackIDs: 'R%hnPJd5rx%r09'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['$U9[tDlV', '!Ouj1uq1]0XI$q'], artistTrackIDs: -3571297908948990}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['RWRj(0eQtSc', '*QE453Nkji$z'], artistTrackIDs: -3362555028307969}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['oFm4el*', 'MEUQw'], artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['Qf^3r72qR!U8QpHY*1', 'a1v[znS!F4%XPZU'], artistInfo: 'hVOuB@4l@]Qog'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['pfX!Y', 'NC%6u#Gs&Ry9Q@9!bqr'], artistInfo: 2249618725273602}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['7(qPylYR(cH6ju%L4', 'WmfzNzg[or1R'], artistInfo: -713529875234817}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['$(kjbzqHJmZf', 'PPAKUx^a1A9eE'], artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/ids', {ids: ['Pykm^CNsmc]AP#uSen^', 'OrS@x*&)#'], artistSimilar: 'u)xz5M[)WHSO'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['ohvG(16d7Ocs9ROpm', '!XVW9sP!BaGydV@E0($j'], artistSimilar: -492126085316606}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['hJL@rN1rf381A7h', '(7e]aoiJN'], artistSimilar: 2601426102517759}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['W5k!!eFLbbHkDrl', 'M&0SpVQ'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['jdtCt4@oPqxyck', 'Hz2wnTU%AHK*v2zif&Z'], albumTracks: 'tY8DY2r4wcLLF[egXP'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['d7!GoWd@W@1XlYFQlBj0', 'gjXD6gfBy'], albumTracks: 227553184841730}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['N5DeMHbsOB', 'ruMNIBb3UV[4EFd'], albumTracks: 3180863994986495}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['*D)N0![pK!5IW', 'xCiCb0pMH2sdI'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['8LmCh58Wt[h9f#2', 'I7eNzjNA4(kBjhZyXyP'], albumTrackIDs: 'r0e]J@KnXdgc&Fh@'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['ipYHwP3ZzG', 'oCJMbVdQZUzausb@'], albumTrackIDs: -6908161814429694}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['(]AxZP8', 'hi2mhSkCz'], albumTrackIDs: -1108716514443265}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['xIumtb*VUZ5ONoEwhm', '@j^r49gYGw'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/ids', {ids: ['qn8zayOWR5wv', '&SVqONR5NT9Dlyj6Hr2'], albumState: '7TDQ#id'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['vfLCX%m', 'oVDje0uQqA'], albumState: -2862195784286206}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['AjAEhNuvwVixAaNaC', 'Ff)bm!V6W!cWoX['], albumState: -1128830408327169}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['67%WkJj*', '@[cM#q[T)'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['Nkl[u7X3t6PmZf', 'Wwn3Fy$)('], albumInfo: 'I]f!7Dw*^Jz^e^p'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['NDKUA30C^vMU3', 'mtv02s^k^'], albumInfo: 2492401591517186}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['bYqt)ZEkYSADM&j[%y$A', 'xOLtNP0em95O&ig3V'], albumInfo: -4611765446901761}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['PJ06ZlnXGK]z', '0k*%C$qI#(Bg*tR$W$br'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/ids', {ids: ['mrKP(5%l', 'D#MczLTzEyF4]@rHN%1'], trackMedia: ']aM]6d'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['k*oJtR^MotC0NUf3qg', '#KHnf'], trackMedia: -1864775030013950}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['koIpc]ZTMI0n5mJ', 'vI%#F2tXmgNJ@H!^eIn'], trackMedia: 672679262683135}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['&s@iIyw7(q(7bl1', 's5ILojGQNa'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['M)QFgh)RqbvCX', 'vN2a3F0B$s5[JUG8'], trackTag: 'ks@bkQs2m'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['b)7]55*0T0PeGbs%c#w', '@%y9@YU@&$LylZMK$'], trackTag: -5977928177287166}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['EwwQGzWsEC%9WoLT)dj', 'aenklbdp&Kcc'], trackTag: 7974623257821183}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['lnont#)OS4^h', '#Fa@BF8EHr*y]Dg^6w0'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['q8Ff*v', 'YB)DauMptEj[pesAkxTB'], trackRawTag: 'xm[Wr]GA'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['blx!QLe1', 'xX9!BpU'], trackRawTag: -4534592056852478}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['P%%PPpv1o', '!ZY)07!%P]5BjoxHJ'], trackRawTag: -1035424445235201}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['*1MU6%LO', 'IMZ)%rI'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/ids', {ids: ['%5sQm4cr3A@V3iWe4Z', 'C6os[FEzY@l&fjS6qw'], trackState: 'Vwe]8R@HDDU0'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['&5mhy', 'jBPPFo$KuvLkd3ae8Yu'], trackState: 41461382905858}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['EEWKEnQjXBiroB!&0', 'deZDzIoZ'], trackState: 6575049410609151}, 400);
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
					await get('artist/search', {offset: '$zC%U9'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/search', {offset: 13.46}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/search', {amount: 'L]31vS$qJ(NuJ'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/search', {amount: 49.67}, 400);
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
					await get('artist/search', {newerThan: '*[1d4PQM%qe'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/search', {newerThan: 10.92}, 400);
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
					await get('artist/search', {sortDescending: 'XvyYwFp]c'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/search', {sortDescending: 1849571789504514}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/search', {sortDescending: -7845487122055169}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/search', {artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/search', {artistAlbums: '$8mTpfeddaYZGMkX]x['}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbums: 2676563669680130}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbums: -5812588524863489}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/search', {artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/search', {artistAlbumIDs: 'sG#a]#&rs%xXWpzKKUIj'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbumIDs: 8913394908266498}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbumIDs: 6235178359848959}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/search', {artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/search', {artistState: '^R]0p65$4Os8'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/search', {artistState: -7128728152834046}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/search', {artistState: -4503305954787329}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/search', {artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/search', {artistTracks: 'Mbg&azg'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/search', {artistTracks: 8017666895773698}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/search', {artistTracks: 7987654452838399}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/search', {artistTrackIDs: 'pIE9X@@'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistTrackIDs: -504940766167038}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistTrackIDs: -6240839613284353}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/search', {artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/search', {artistInfo: 'KH#s9A9K'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/search', {artistInfo: 7569457169825794}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/search', {artistInfo: -5328591898279937}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/search', {artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/search', {artistSimilar: 'v^kPAe'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/search', {artistSimilar: -7358951632928766}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/search', {artistSimilar: 6319702632562687}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/search', {albumTracks: 'y4MuG'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/search', {albumTracks: -6608502965403646}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/search', {albumTracks: -2703185584062465}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/search', {albumTrackIDs: 'd3n(B'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {albumTrackIDs: 8712313037127682}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {albumTrackIDs: -2943928248565761}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/search', {albumState: 'wcA]n'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/search', {albumState: -2435822762590206}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/search', {albumState: -7437762059829249}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/search', {albumInfo: 'U!8X8#eKAwS&YKFJ0'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/search', {albumInfo: -379018427760638}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/search', {albumInfo: -8299742735892481}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/search', {trackMedia: 'P%JqiTx#N2^plPl502'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/search', {trackMedia: -6619577098174462}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/search', {trackMedia: 2205630525865983}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/search', {trackTag: 'egze[a'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackTag: 2848232740749314}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackTag: 7183603398082559}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/search', {trackRawTag: 'zn3[Z!@y7d'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackRawTag: -1649777884266494}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackRawTag: -1712034748039169}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/search', {trackState: '#[NWe4wA$8f]SNon'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/search', {trackState: 707349048197122}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/search', {trackState: -7110971814313985}, 400);
				});
			});
		});
		describe('artist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/state', {id: '*nJZ5cFe$T1a'}, 401);
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
					await getNotLoggedIn('artist/states', {ids: ['fur#e92!WpZ%', '6smA87W']}, 401);
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
					await get('artist/list', {list: 'faved', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('artist/list', {list: 'random', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'recent', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('artist/list', {list: 'random', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'faved', albumTypes: [null, 'invalid']}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/list', {list: 'recent', newerThan: 'kAe(i]CZS2Xk)(G7a5dx'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/list', {list: 'recent', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/list', {list: 'frequent', newerThan: 39.7}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'highest', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('artist/list', {list: 'highest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('artist/list', {list: 'random', sortDescending: '&eADANZYYQj1$D'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', sortDescending: -5977146996555774}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', sortDescending: 2669655843930111}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistAlbums: 'JVrs5#7gK#H$'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', artistAlbums: -4686333461135358}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistAlbums: 8110695509917695}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/list', {list: 'highest', artistAlbumIDs: 'wMPUW'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistAlbumIDs: -5673314907324414}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistAlbumIDs: -1636804738416641}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/list', {list: 'faved', artistState: 'z*N[ip[COWOq0('}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', artistState: -2521438804246526}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistState: -4896421287297025}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/list', {list: 'highest', artistTracks: 'g1*zw]y4t&I&'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', artistTracks: -6400293499568126}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', artistTracks: -4148740591976449}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'faved', artistTrackIDs: 'N0gH3tohCYvNV[ZQPA#a'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', artistTrackIDs: -6199384018518014}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistTrackIDs: -8028249271566337}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/list', {list: 'highest', artistInfo: 'lvRXDYwqnxY'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', artistInfo: -5679267333537790}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistInfo: 3133836300910591}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/list', {list: 'faved', artistSimilar: '36jlPLwL0q%ttk3a$k!o'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', artistSimilar: 6420015284748290}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', artistSimilar: -6615894583148545}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/list', {list: 'random', albumTracks: 'sGRL^H#TQzl)NP$jp'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', albumTracks: 3530820904026114}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', albumTracks: -6854757662588929}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'faved', albumTrackIDs: ']TAWn'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', albumTrackIDs: -5281370804846590}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', albumTrackIDs: -7878363825831937}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', albumState: '4cPC(WOX9'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', albumState: -8930776355700734}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', albumState: -3009447425212417}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', albumInfo: 'Qb9nv([4]'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', albumInfo: 7401487537799170}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', albumInfo: 2356377997541375}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/list', {list: 'random', trackMedia: '@pqxM$O'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'highest', trackMedia: -2339557081087998}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', trackMedia: -6303938047377409}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/list', {list: 'random', trackTag: 'yVZFU9Y(%9B0]8'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', trackTag: 5289391413002242}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', trackTag: 5322686561517567}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'faved', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/list', {list: 'highest', trackRawTag: '2eCMiXMV*UeEKAA][rt'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', trackRawTag: -7488576480608254}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', trackRawTag: 7431141552291839}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/list', {list: 'recent', trackState: 'KMmVgcSwt'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'avghighest', trackState: -7177879100063742}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', trackState: -1091490260451329}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', offset: 'BVKqh'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/list', {list: 'recent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/list', {list: 'recent', offset: 2.79}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'random', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', amount: 'Fi%q2#[Oa%lY'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/list', {list: 'faved', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/list', {list: 'frequent', amount: 79.73}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/list', {list: 'highest', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar/tracks', {id: 'pbdv!*A6j8GKWV^it*f'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: '%7CsRb', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'gq)UR6', trackMedia: '59*S(iWTnm'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'Xbs^sWly]qnVnax7', trackMedia: 927147489230850}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'fZI^N', trackMedia: 8384381823483903}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'Se)N@)3ZWlCs)^VU', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'aSFl5Iz[9d5iBCId', trackTag: 'Kxovx)'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: '#29Yniho', trackTag: 3430326219046914}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'Si]]Q%M', trackTag: -1853764344479745}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'P@H[uS4VTVz', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'S72gKtUfA@TnoO7Ysw', trackRawTag: 'cvbU#qqQ[&eB1prQ5sJw'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: '[Ma$hMrQA$7qP', trackRawTag: -2709745303551998}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: ')VU0OiW(ofD@yadi', trackRawTag: 2899217014063103}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'VL[4iP9XLbzMfXhp2', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'pQnmRn!plLW', trackState: 'FBzQk]$39FXY8BF*B'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'gOVEoZ', trackState: 5567626633805826}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: '%%TkBwDe', trackState: -3793884610035713}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'kwD(V6v%', offset: '&zT9I$y8cGe3'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'xC!%bnCcb&F4pC', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: '*rzMO[vOge3uydN', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'B%3p8Js', offset: 21.93}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar/tracks', {id: 'uF5743XI0n51c72qFa[', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'hwq%f9ZBm', amount: '(IQI44EGN@3K'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'eXtbfmn7n', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: 'NelLoPU$mMgs', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'sZ9o4E0eV', amount: 81.39}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar/tracks', {id: 'fIiatE7tqLGt(q*', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar', {id: 'HS%pcl'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/similar', {id: 'oYJ%0r33dzlRDRjfWII)', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/similar', {id: 't1KKs]aVuVf', artistAlbums: 'UnCg9OaDD4W#Quhec'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'tx3D%rA5rz&DOnO)CJ', artistAlbums: 4761499562147842}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '#LFV6', artistAlbums: -7592903870251009}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '4CQQBVdu#0P6h1J)B&', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'LMrtHljx[vED7Q%', artistAlbumIDs: 'ifT(Puk()c]du'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'CkF3k!Nja', artistAlbumIDs: -4774965559689214}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'dfZWFvsnm2wUb', artistAlbumIDs: -8639931031224321}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/similar', {id: '(Y8gZ)KfT0r1tMTJ42NU', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/similar', {id: 'Ivh&4e[XA', artistState: 'nmbTiIM!mA409x'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Dx&f7lD(wncNJ', artistState: 4515297973239810}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '7kXXN1M6*%kgG#bBG&', artistState: 2427047385235455}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'cge]v5', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/similar', {id: 'Yc!AiwckBoZ4C(orCi', artistTracks: 'QzDe4Kf'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '[TBuG2*', artistTracks: 8588639877464066}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'j3V(c$ni06', artistTracks: -652433877368833}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '7)2LURBmak9^', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'oFzob0!Rx37RstVJk', artistTrackIDs: '1T3RDAJ3^2dc(@ev&w'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '5(^QVi', artistTrackIDs: 6804514375991298}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'Hk2bl4', artistTrackIDs: -6117427863617537}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: ')#tDZpM', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/similar', {id: '4Uigy4jWasXQp', artistInfo: 'vTc&3'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Iw9%BToZd)x[gup', artistInfo: -6252168252227582}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'dq!n)OYobDlvkbM', artistInfo: 302043914829823}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/similar', {id: 'OF(6B', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/similar', {id: 'mBbW^5QweZADFxgLX', artistSimilar: 'biu^nZ[Ah!#UPW'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'jC9q(G5#sV8dScn', artistSimilar: 8731733469954050}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'waW#q^M8F', artistSimilar: 4674394857144319}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'M5SKxK%Ecx', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/similar', {id: 'KPx1WoU[yUiC@Vd!i', albumTracks: 'Jypctm*t0Rt'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'k&xiivAl(L&', albumTracks: -4157445890899966}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'u61^ggH&UmvLWl1pC', albumTracks: -2348220474720257}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '9nJ75!Yudg^', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'GaWAUYg)rWW', albumTrackIDs: 'DMMV#U5a'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'IRg36E!2Y]$Gsil4yd', albumTrackIDs: 3963608656510978}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'hWCH8M', albumTrackIDs: 3050210783657983}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/similar', {id: '[c6lKJP', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/similar', {id: 'oMZVTM5dN0^fNk48', albumState: 'xZq@omI'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Tcr#f', albumState: -68413783277566}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '2T#e$', albumState: 5383637721677823}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: '!%O]8L!soL%cWOEY', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/similar', {id: 'UeA0t', albumInfo: 'BP[S5XmvtYEAf$Jt8U$'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'RQ7z3xOQEg$', albumInfo: 3274076772630530}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'C5ua6gT7h', albumInfo: -2524705735049217}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar', {id: 'm3%p!roKp!9eIhO6X', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar', {id: 'k2TL4Z1AKe', trackMedia: '#)eLXja#*Dvhm'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Eu6tg', trackMedia: 2455429795807234}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'kd1E!PHLkOCHinyy&3', trackMedia: 1872226919907327}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar', {id: 'DDJEuUtN3jM1', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar', {id: 'l)2ndTArA0Reb', trackTag: 'IUVxBQc7)]11PTc)DQ'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'hH^S1Wj)iFlD', trackTag: -5794209348976638}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'cp8gmx[z', trackTag: 7187157936504831}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar', {id: 'NFIhMIJNwv', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar', {id: 'qRl6*rzCMv9$y&2ae6oX', trackRawTag: 'V%LB^g]AHG'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '&X8*IA', trackRawTag: -7206691955277822}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'Iow^x!', trackRawTag: 3936249446399999}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar', {id: '(kiH0i', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar', {id: '$1SynnX]mtY6', trackState: '6#T62!@MAeTt4IqlI'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '@#0si9d#', trackState: -1229598708727806}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '8[K54^X(', trackState: -5137782276096001}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar', {id: '@$RKCNZm', offset: 'YW)^)F7$B4XpIT9iAh'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar', {id: 'LQaoc(jQzQk[KTolW@(', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar', {id: 'B$u&B*j[Yp', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar', {id: 'o%4JTwH', offset: 16.41}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar', {id: 'NhJyGuKUuZCC^', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar', {id: 'iyi1(FbmV4N#0H', amount: 'QB(2BT1ty1W8A6tq'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar', {id: 'obRNrIw', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar', {id: '!p0#M', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar', {id: '!J3N$tmYYYAkVjn', amount: 40.3}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar', {id: 'ggCNIY(D$', amount: 0}, 400);
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
					await get('artist/index', {newerThan: 'yALaMW7FqDW'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/index', {newerThan: 49.38}, 400);
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
					await get('artist/index', {sortDescending: 's9@EP0'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/index', {sortDescending: 7348874914037762}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/index', {sortDescending: -1469188933681153}, 400);
				});
			});
		});
		describe('artist/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/tracks', {ids: ['mXF080GjmIpTs&awm8', '*HhU(2it(7gS']}, 401);
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
					await get('artist/tracks', {ids: ['1zJa4bnvKsg', 'BTK$ZY7SjthW5#6'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/tracks', {ids: ['edH11DO8^X@nn#2GU', 'Kxk7qej9#j&JW@XKsJB'], trackMedia: 'tTl^ysI6'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['hxMLuP6w', 'bVs]caI^MT7W&*0'], trackMedia: 4837048338874370}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['e^lHcBDk2N)F2!sSJ', '8s5pFL$AVTj&X3!T%Xi'], trackMedia: 3736331947606015}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['XwK)HWl^^QXI', '8%KXx@D'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['yaK!5gvYy^w@HL(T', 'dOT2@aPzz'], trackTag: '5ftB%*'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['nJ^*Ot(K)Lwy9[Bv)L41', '2Qh1USVyj@3Pr(TrE'], trackTag: -2648584172339198}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['wu[4r$TE41A^EL4(Rxy', '8(qEL6E%Xk4sgFL7Npr'], trackTag: 393870382727167}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['kGv6RWybK]GN9S', 'JVVg8J3P8o]Ej%%Qm'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['fgd33Q1JqCPH', 'Fcy4eB$v'], trackRawTag: 'mCutlEY7GpO1x'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['K!1J*w8wqlHahG8JlL)J', 'jdnbB#rAdT(dOSf'], trackRawTag: 3540837975719938}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['!qmLTFololh]$Khh', '@mLYv(B#UQVGJLvSiNS9'], trackRawTag: 4977969952980991}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['HiaPm&9I4k!zs#hKC', 'G7IiOjv9Wq*ui'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/tracks', {ids: ['V!I1Lp]', '2FYo1h[g]U]j'], trackState: 'JVo5odkppZqE%MS3A'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['UhxRTwr!8u(HL9', 'iI7pGvK]ZSk[^Kb(1[]'], trackState: 4349174149545986}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['y*L$j4Xu$', 'QF5@3XR2zAw@'], trackState: 6660484358995967}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/tracks', {ids: ['fXc4#', 'Sa6nQ'], offset: 'Lgr*$C3p62ABy!372N'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['FpIPKA^JTdw%z', 'Q8pk7jkm5[3vk9I(DC7'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['LTqR51', 'ySS1#z0hw4LRjma'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/tracks', {ids: ['SajEM', '0P6EvxWIN[v6Hks'], offset: 31.95}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/tracks', {ids: ['oZVYul', 'Bmr!uy[63lMEfA['], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/tracks', {ids: ['wfYxhJD1Cu', 'qXnM8R1oWCZ77tPJ(n'], amount: 'gEOHJo8j^9z'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['D69m^', 'qOSE]6w7bm)Z*('], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['!j[6Zl8@Lo', 'iLen0(LFm]Uz3!'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/tracks', {ids: ['QRkgJI2UhS0n^sB9m', '4bus1k7Z)A'], amount: 6.46}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/tracks', {ids: ['3Rh5dR]#@]sye(XEaH', 'YSYZfMmcKS29EmZe[i1O'], amount: 0}, 400);
				});
			});
		});
		describe('artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/info', {id: 'Ssj@YAT]NtGE5wy^qCd'}, 401);
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
					await getNotLoggedIn('album/id', {id: 'GD[%!yzyvEZRyV'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/id', {id: ''}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/id', {id: '^xEcMIavjPgvSg^9dz', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/id', {id: '0%JHo0OBi$rkwznPV', albumTracks: 'gAhRp8OduPx6Gd]'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/id', {id: 'J*IUM', albumTracks: -2012804076797950}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/id', {id: 'ZhL@^odOKx^RvFy7', albumTracks: -223138486943745}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/id', {id: 'CD*khN8X*', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/id', {id: 'pnfB5Rf8dc', albumTrackIDs: 'yHMOK'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/id', {id: 'M$@4hw5!crp)aU', albumTrackIDs: -8571607312236542}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/id', {id: 'jwHs9)CHXzkr', albumTrackIDs: -7973323870830593}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/id', {id: 'v!D1^xu^ws8IbJ)EPi1O', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/id', {id: 'rmG6m0SW7', albumState: 'OPHNA6[jLyw&kW[B)uWC'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/id', {id: 'aVKrxppcje5%]5&NQ92', albumState: 4070269698179074}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/id', {id: '3771m8XFw&', albumState: 166413541048319}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/id', {id: 'V6jX41(YnWHY]DYV', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/id', {id: 'itELN5V@8F1VX', albumInfo: 'a3ZN!ou'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/id', {id: '8$mCxE@Xt8T$5', albumInfo: 1635656669331458}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/id', {id: 'Q0&!Pt7Z9WN7a', albumInfo: -3552690315460609}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/id', {id: 'kRI1#L%exwJwFFvIhtn2', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/id', {id: 'pjKExTkx^Zt', trackMedia: '1oWfkKM'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/id', {id: 'u8aJ#vMzHt88', trackMedia: -1525037899186174}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/id', {id: 'lJXCdZfgQt2G1Lr', trackMedia: 7745728759726079}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/id', {id: 'g&Ve0IPAM6', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/id', {id: 'emw)iYdcBK4kEM(8Id5d', trackTag: 'VGJ]7yz!X$rbvk$]'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/id', {id: '@mh2N*a&', trackTag: 2850250733649922}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'nYdj(0vm', trackTag: 1948552318156799}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/id', {id: '8VG!vrKorGjuSvs$v(a5', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/id', {id: 'VTbWRpIfM@AC#k1)', trackRawTag: 'EPv*&JhlQfn3Yh(kCr5K'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/id', {id: '[9@69R', trackRawTag: -1856037946654718}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'SQCSJQHePOhMdu', trackRawTag: 2499607019913215}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/id', {id: '4@lRS#)', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/id', {id: 'K5UIJ[A2(!8!3]X4', trackState: 'y5jZ]l58SQsoJwX'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/id', {id: 'vH!k9x[Kp^ED*rhVGK', trackState: 5398988240977922}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/id', {id: 'R9VYsMXp]bO#MrKJ2d]I', trackState: -4755828410155009}, 400);
				});
			});
		});
		describe('album/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/ids', {ids: ['UHb@z8TiD^#P7Xh($#', 'UgRDx6M^88X%(T']}, 401);
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
					await get('album/ids', {ids: ['dtq$bP5CXfCr!tEk', '&(cqb'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/ids', {ids: ['Mj#r6sF]ERIIKn*p9V', 'IYVxe$%PGP6m'], albumTracks: 'uS5nDuno'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['A14wsFA', 'RrfSsF7NBT'], albumTracks: -6844938281025534}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['vNGXL8', '&Oua73&'], albumTracks: -7615446253568001}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/ids', {ids: [']zjjxVFQuH', '$r$Do'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/ids', {ids: ['CZHoaDv!5SK', ')3GFFq647hWzSPcS'], albumTrackIDs: 'Hny0a@y^n['}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['7)LBF4nQ76$sx]Bn', 'vd0dky!fTefSRW@eN'], albumTrackIDs: 1965361620582402}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['UhJiAJ%p7', 'LymxJEMpB'], albumTrackIDs: 3199614492606463}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['14AmXhhJo^cQ1m', 'irrqwrPAU@aQgIDs'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/ids', {ids: ['cGdvFqn', '#u$j%Uw1c'], albumState: 'Zhi2F^$koN'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['A)Y9q!oBo5wWow8tFjA', '6[pJ&u[i86C^Jh7x'], albumState: 4338064960782338}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['8[GYQSxuGlm', '*GMyvOwds'], albumState: -1605206265561089}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/ids', {ids: ['xGb#4H8*Meog%', 'Pes86]1ewRhLG('], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/ids', {ids: ['e8DIOMfhS', ')&KwY$ilgadyo)R]9g'], albumInfo: 'WY4]Hh&*3nV5ynFg'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['yS!j$uzS$Lnao!$6EV$d', 'SayXRM71'], albumInfo: -221824113704958}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['&]0NP)', 'vP7wFUmBM'], albumInfo: 1889804476219391}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/ids', {ids: ['2QYzjM4P@)ucaF', 'scl8pR9umiXrKSnUmb'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/ids', {ids: [')WU*OWzV[#H', '#2GVBMtv&fQ3x)52g'], trackMedia: 'houFW)j'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['QlLuBsB3%ho1u91RK', 'Old@k7rrlT1qfFU'], trackMedia: 7427406394556418}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['LaFQ*fjZ3&mrK^v', 'hNu0)BHqsFI'], trackMedia: -7512374017785857}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['ae&cz', 'NUN5f*GA&sRtOyxQ!za'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/ids', {ids: ['9eAc[s7KvhgM68F9)', '(NqkMUGPE8U*SK%T'], trackTag: 'U5PNcJ2ubkgE2&ln7G'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['52QCG]', 'k@D7Fne3k]sna5D65K'], trackTag: 7391552452165634}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['C&fHWwKJL((O9J3', 'EE84DdsAcSaO0'], trackTag: -1426232491114497}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['wE2Y20x3', '$x3C)UM9W$xyx]#'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/ids', {ids: ['y778CCh0Hgt6qe', 'Q412SJ$!9r%R&FL8(TW4'], trackRawTag: 'l61et(xjWY%gPHyXFI[h'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['D59Re', 'flqqs$kV0LLuB^OvaPS'], trackRawTag: 3247720659681282}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['dUNhhuX', 'fVcf9jg4'], trackRawTag: -2591092381843457}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['5U0xO8ORfb*zMRlfP', '$)x5hZ*jv$#1OCpSe'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/ids', {ids: ['0$)3W5)epz^', 'H%EfN4K)'], trackState: 'X*Qivz04bS)0!#7UFUZh'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['!rH@3cqa@O1OR*p', 'oHYMX'], trackState: -5103153749950462}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['p(cZolW0BfR7BBJOxQmo', 'A]uCYAm]5xHwNtik'], trackState: 4370629729976319}, 400);
				});
			});
		});
		describe('album/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/list', {list: 'frequent'}, 401);
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
					await get('album/list', {list: 'frequent', offset: 'D6F3ZK(BO%McPp4Hfs'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/list', {list: 'highest', offset: 32.85}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'avghighest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/list', {list: 'frequent', amount: 'N%6Yn(TuXyftra]LK'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/list', {list: 'avghighest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/list', {list: 'faved', amount: 97.49}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/list', {list: 'highest', amount: 0}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/list', {list: 'frequent', albumTracks: ']1VXNEqsw(eYCmguP'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/list', {list: 'faved', albumTracks: -5937657821528062}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', albumTracks: -4586283741478913}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'random', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/list', {list: 'recent', albumTrackIDs: 'Wt!uQRM9'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/list', {list: 'avghighest', albumTrackIDs: -5436145986961406}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/list', {list: 'recent', albumTrackIDs: 6893042619383807}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/list', {list: 'recent', albumState: 'fL75Tksko2y$obFC!'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'faved', albumState: -2654857873850366}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'recent', albumState: 1275839673008127}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/list', {list: 'frequent', albumInfo: 'uW#c2yZ'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', albumInfo: 6653880318296066}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/list', {list: 'frequent', albumInfo: -2146795765366785}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', trackMedia: '9*q(P'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', trackMedia: 7786898898550786}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/list', {list: 'recent', trackMedia: 5699815530823679}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', trackTag: 'yQZan9w)4B&UQYhLN7Pq'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'faved', trackTag: -2075791047262206}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', trackTag: -1576706808741889}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/list', {list: 'faved', trackRawTag: '1lxpM%'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'recent', trackRawTag: 2054598038650882}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'frequent', trackRawTag: 4597360923508735}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/list', {list: 'random', trackState: 'oz*J$iq^Th95'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'avghighest', trackState: -7433060626726910}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', trackState: 95137577304063}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('album/list', {list: 'avghighest', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', artistID: ''}, 400);
				});
				it('"trackID" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', trackID: ''}, 400);
				});
				it('"mbAlbumID" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', mbAlbumID: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', mbArtistID: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', genre: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('album/list', {list: 'frequent', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('album/list', {list: 'random', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('album/list', {list: 'faved', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('album/list', {list: 'recent', newerThan: 'Wmp6ZXTmM28ck'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/list', {list: 'avghighest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/list', {list: 'avghighest', newerThan: 94.69}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'highest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/list', {list: 'faved', fromYear: 'zj1pu$oZ(HRBI]1%c3'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/list', {list: 'random', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/list', {list: 'random', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/list', {list: 'random', fromYear: 56.78}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'random', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/list', {list: 'recent', toYear: 'h1XOooX4rA[RR'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/list', {list: 'faved', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/list', {list: 'highest', toYear: 93.66}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'highest', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('album/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('album/list', {list: 'faved', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('album/list', {list: 'random', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('album/list', {list: 'random', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('album/list', {list: 'frequent', sortDescending: 'Xr6ylbLjeaiJQRD0tP'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', sortDescending: -8761429893054462}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', sortDescending: -6958385350049793}, 400);
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
					await get('album/search', {offset: 'C3nC*iMjVhEfEQT7i@'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/search', {offset: 89.96}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/search', {amount: '$NRk]OL4pMp4bDp9'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/search', {amount: 11.79}, 400);
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
					await get('album/search', {newerThan: 'uxSeqWYsZtcal]W[K'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/search', {newerThan: 74.33}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/search', {fromYear: '2HeMTof#H@n%&fJ'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/search', {fromYear: 49.47}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/search', {toYear: 'PGg1j9xqa38'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/search', {toYear: 59.02}, 400);
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
					await get('album/search', {sortDescending: 'Liug!!uhdiVgsXmh*2v6'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/search', {sortDescending: -450271448662014}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/search', {sortDescending: 655399585841151}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/search', {albumTracks: 'askU4bobjT5@oxVs'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/search', {albumTracks: 6409113302990850}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/search', {albumTracks: 2061920714620927}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/search', {albumTrackIDs: 'd0lAfO'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/search', {albumTrackIDs: -5531498727866366}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/search', {albumTrackIDs: 7720831635423231}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/search', {albumState: 'fk0eYO'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/search', {albumState: -8413800017428478}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/search', {albumState: 1326511814606847}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/search', {albumInfo: 'F*O4$'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/search', {albumInfo: -8042183596703742}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/search', {albumInfo: -7340278474080257}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/search', {trackMedia: 'v32M3&lc97'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/search', {trackMedia: -5607146246897662}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/search', {trackMedia: 8659375832956927}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/search', {trackTag: 'TgwoG*bv2QlZOHK#'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/search', {trackTag: -745809268178942}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/search', {trackTag: -5059816653324289}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/search', {trackRawTag: 'tGJJkthBDhSI%0BtW'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/search', {trackRawTag: -8802362340671486}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/search', {trackRawTag: 5207299643670527}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/search', {trackState: 'tf5oG4L7fF4[FWB]37^r'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/search', {trackState: 3595897220890626}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/search', {trackState: 5646170097451007}, 400);
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
					await get('album/index', {newerThan: 'NYA6!vn%!vyTBtCfn)@S'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/index', {newerThan: 84.12}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/index', {fromYear: 'yiVS5chdE8pq!Z'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/index', {fromYear: 19.15}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/index', {toYear: 'y()WO7Szz#F7HJ4Ak'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/index', {toYear: 49.95}, 400);
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
					await get('album/index', {sortDescending: 'squ!j]BxFz0!5zk!OZpr'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/index', {sortDescending: -4451943732740094}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/index', {sortDescending: 7000087817355263}, 400);
				});
			});
		});
		describe('album/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/state', {id: 'yE4*4GDbSHT$b'}, 401);
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
					await getNotLoggedIn('album/states', {ids: ['9QjA7SkThHRw', 'fxXJxGt)*SzT03sSi']}, 401);
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
					await getNotLoggedIn('album/similar/tracks', {id: 'U%!nu&d@397EK^gs[Mm'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'p&Ks$', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'W[i8NiA1vd', trackMedia: 'Cg6TxR(%@'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'rfmv4Irj(dUWNx3p', trackMedia: 1798576879435778}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: '4]b^uiEumdhxe6j6Why', trackMedia: -4659144552349697}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'c0lFgoO$$J', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'S9mQSCXz$M)8', trackTag: 'E]EBix^VUP@v)(K9ipE&'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'z^4WC25N8o9#gOW*iO', trackTag: -6144678080544766}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: '$PtikR%QG1TcRp(ebUY5', trackTag: 5113797496799231}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '!d]*7o', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'Di!@5ZAsDcy1N)n', trackRawTag: 'vsX7@3%LwNAQM1DNWZ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'U(KbBEXyw[', trackRawTag: 104507719548930}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'YA9OkvseoRh', trackRawTag: 191418685456383}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '(DbpBi&!!', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'g$Xf%(BzTmVJD!sW[Asj', trackState: ')h#P@S0byr6(kcWD'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: '2jwzBr@t9AJ6iDow3q', trackState: 952557228785666}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'B25RnBi', trackState: 5338345181806591}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/similar/tracks', {id: '2@r16lWCnI', offset: 'FXADxKRBfWL'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'is#[mc', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: 'PYKmSr&Z', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/similar/tracks', {id: '8gNx6Eg6q', offset: 59.35}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/similar/tracks', {id: 'A]k)q]', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'q19to4!GIXRsckiY$', amount: 'bl[bI9dqXt9g9BHa'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'fvskLONIZaC$', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: 'GLtk!6Uo8tJZkWMVh&', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'y8uSISUc2jtp[^', amount: 54.73}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/similar/tracks', {id: ')]5Nfgb^sxTkGAE[KNM', amount: 0}, 400);
				});
			});
		});
		describe('album/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/tracks', {ids: ['ieIam', 'wWIrPcyj()qVZ']}, 401);
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
					await get('album/tracks', {ids: ['3x!@t[8R]', 'b1Er@fd'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/tracks', {ids: ['8!lylH]!', 'Hw9T('], trackMedia: 'XZxv&k[dFnXtJDWH'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['delf1Giu&AmfCJ8CH6yd', 'Xye1P6'], trackMedia: 159660929712130}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['@k#NJiddNikYv6k', 'U^z1Ec%*BRFBl'], trackMedia: 684284188819455}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['EwYc97h^rL(w', 'YI)zZz2bQ'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['gcpG%VxCPlf$tv)j@lCU', '%&tie7Xm'], trackTag: 'gXJ#S$JOo2NP%'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['jh[C2T', 'Df9G&uGTHbU8Bct8'], trackTag: -8627176916123646}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['0pLPyT4O)!o#A2R7', 'pr!sZIq^ZyFb'], trackTag: -212238556200961}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['68pT@O', '#FAgH^t8dvUuKYu'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['Ih8*FmwHzL!^VyM4BrnM', 'R^^xOk8Y8'], trackRawTag: 'Q[91hk'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['HQ@BV]57', '9ecr34nRA%hl%m'], trackRawTag: 1867901606821890}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['Ugu]6y6s6$', 'S6Fp9@T'], trackRawTag: 4150994032132095}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['pB6n@[9j)EVy4[Br9Ymz', 'ElzA!8v6I^'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/tracks', {ids: ['hmV*xl', 'OinclYN*BiO^'], trackState: ')KN25'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['rKlO(3pnY3y', 'VZ]iBb'], trackState: 8923693904297986}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['hJ9vp%F%', 'dGAb4yHwD]W)i'], trackState: -3592134779207681}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/tracks', {ids: ['&RCybbNOFGk#', 'Z9RgyQ0[wz'], offset: 'PXYOZRXwwCThZ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['v1nZk#JD', '6*xww(]*bU!seD'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['Bj0p0vj', 'cbg1K$QWti3yd1&cS'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/tracks', {ids: ['zoKFnLpEX&DH2M)d1R', '%9N2E3QXop'], offset: 17.52}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/tracks', {ids: ['BkZIRorwW', 'k8mv4!DC4VtQcm'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/tracks', {ids: ['etadaw7**h*ck]eI', 'Ok[W(1$bKHh'], amount: 'q#P@4f)K3[Iia'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['VyIH5@', 'efzgv'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['3WNAnODUih3XlZz$@', 'hd]1NX3rPsod4$j(F0'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/tracks', {ids: ['P[VAg)EoQUn', 'orG*Wh)PFr2SJ'], amount: 90.4}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/tracks', {ids: ['[^Kh3QI74ckM', 'J5eaDuhQ$jEZncU6ZTBe'], amount: 0}, 400);
				});
			});
		});
		describe('album/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/info', {id: 'yQjoLdApJsx^Hc8fx'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/info', {id: ''}, 400);
				});
			});
		});
		describe('playlist/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/id', {id: '5gipcq6fR4Dz&g]'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/id', {id: ''}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/id', {id: 'BGbfL(@(uu!2QwPd', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/id', {id: 'h5l*h9HAPg', playlistTracks: 'UIxNuHN%Z[Jbnu]2'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'CaXitQl!lBtYPf0C%', playlistTracks: 6267025693343746}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/id', {id: '2Mn9^', playlistTracks: 7514852163583999}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/id', {id: 'jOdsFQX3v3', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/id', {id: 'E]!SzhrJK#(O4', playlistTrackIDs: 'L#TeuTWU]26d14'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '86CTG#', playlistTrackIDs: 7088929140375554}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'S2Fo#uA$7KZmAye^O', playlistTrackIDs: -3045498768326657}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/id', {id: 'ryrJGrC', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/id', {id: '@h31DpUz', playlistState: 'HlDkT5'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'W7DAJ!jA)', playlistState: 7535305515073538}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'JcDtuoGMXRxa@3', playlistState: -8697149290184705}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/id', {id: 'T&NGJr@)hi', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/id', {id: '2$AFe(3v', trackMedia: '9d%%8*F'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/id', {id: ')1hD@%E[', trackMedia: -7684124261220350}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'Ca5VKjzp%4zcx0@U!*p', trackMedia: 7754744307122175}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/id', {id: 'cWzbm9P', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/id', {id: 'jYZZZ*a&a4qi', trackTag: 'dP4FdG'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'r2]2gfCYWOHb0', trackTag: -5012262293078014}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: '9BDA)', trackTag: -7891903475351553}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/id', {id: '0Wzqm#B', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/id', {id: 'GSh!JPhwggk1nmFYxS', trackRawTag: 'rszDr6JvhtjAnduRiw8'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'QDV7t@M&obs', trackRawTag: 7857385620111362}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'r4BF%EyWT7qcRXF*cOcq', trackRawTag: 6927568460578815}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/id', {id: 'b5$B[D]9EKthelFw', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/id', {id: 'DRpjk2rT!hp#jP', trackState: 'H6G0r7hPza%*'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '0Gc6udtYl%S*', trackState: -7277906732515326}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: '&EeCTXG]Nf', trackState: 1128780194119679}, 400);
				});
			});
		});
		describe('playlist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/ids', {ids: ['wV(i9B', 'ow*Oy]7UV']}, 401);
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
					await get('playlist/ids', {ids: ['TtD^d2VI$', '1jpPinA&iss'], playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/ids', {ids: ['1ULjKX#zOqd!W]GO8!', 'fws]S]C(ERS@'], playlistTracks: '0vvLADP8N6v4ki1g9'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['jA!r2!dn&5', 'JFbZGd6A#I4qTTiF'], playlistTracks: -1788702632181758}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['e3DhOwh&VOP95gao', 'NY8a9RggjXduNqb4&r'], playlistTracks: 1726901538258943}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['&YbCKy', '!Fl69v&c'], playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/ids', {ids: ['#OL[txm7!VbdrHWXR', 'KyDbOSST(Y!j'], playlistTrackIDs: '$L7a^TO$8sPU'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['N8PwZdHg', 'oM1B^Pu'], playlistTrackIDs: -2401923420389374}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['Fx1Mng7)ekuSpt6M', 'q*bloFP]4ANVin59QT^'], playlistTrackIDs: 1050653195501567}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['rw#a1BS@8Z6ml6l*9', 'n#no1*nVW'], playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['zn$N1VsShzTb9l%M', '#am7])l4oj9Fr'], playlistState: 'GJ*Vo5PHDoYEgbo]T'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['l6Xs#tlGX', '[me87U^$MiKxw[v'], playlistState: 6390278441140226}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['YeZV3DVLjyt', 'OUPGXCjH&0B^JJW)iu'], playlistState: 2597102261633023}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['4i(S[', 'vnAVoemx@'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/ids', {ids: ['6M&74f^K', 'o2%Q6mRP2g'], trackMedia: 'uxfU3Z#H'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['Fulmja2lkMaCWd%w', '5Ao@)L6^tj]r!h6E'], trackMedia: 7108544117604354}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['LhnPz3q#aI9w', 'ikNv&py2sE]&iDFdc'], trackMedia: -5479900693659649}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['YvNJ&8R', 'DyeV9'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['4I@1b6RQPeyhpx]2P5[7', 'AQ%HCUYB8v30$XN3gYIa'], trackTag: 'LKL$p'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['k4OeU3*]^so4w', 'SqVCw'], trackTag: 8821299811975170}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['Yd[&3K@dm', '*or%^X4m$5lZX#!%'], trackTag: 3602805734506495}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['yLZrmKBP4M#c32JQMV', 'KBpRq(N1YA8m2F@cR&y3'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['o&drAnbtDG', 'mCbJxKtMeIJ'], trackRawTag: 'k1vlJotAZ7Qw'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['aAT@Tfy6i$&x5', 'JN8w$uubeW^IP!CWy'], trackRawTag: -7706048257327102}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['aZsvp(GSMM', '2wOc6CvwdO)Q'], trackRawTag: 4638615640473599}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['Kfg[9GOJG', '&iJj6BgesLf8p*[aSr['], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['Z86H7J', 'OFo4$3fRk5[D^ulj7'], trackState: 'koShgiEgMV7x'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['fved9@Xj', 'hQL@0t'], trackState: 4881935788670978}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['tfPwa', 'yUC#ZN8irno9d[MgRy'], trackState: -8132258120597505}, 400);
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
					await get('playlist/search', {offset: '7ai@lWk'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/search', {offset: 93.33}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/search', {amount: 'lOdd#NqoT^%wYNqUF(t'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/search', {amount: 89.16}, 400);
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
					await get('playlist/search', {isPublic: 'UipmDYYd]dh'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/search', {isPublic: -6257782076473342}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/search', {isPublic: 285016407932927}, 400);
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
					await get('playlist/search', {sortDescending: '(zz8X'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/search', {sortDescending: 2533636695916546}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/search', {sortDescending: 5566826234773503}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/search', {playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/search', {playlistTracks: '4[rMCJMz'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTracks: 282268484501506}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTracks: 3569268411072511}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/search', {playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/search', {playlistTrackIDs: 'FaBqu1yjR7O%^F&90g$'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTrackIDs: 2077322370875394}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTrackIDs: 8834061191610367}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/search', {playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/search', {playlistState: 'x0w2%d7k%J'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistState: 8835251463782402}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistState: 5794745385222143}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/search', {trackMedia: 'LE%711QT&%w'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/search', {trackMedia: -3746043380367358}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/search', {trackMedia: -6848878284374017}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/search', {trackTag: 'Y[#@uP9D'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackTag: 3064527344107522}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackTag: -5517723006140417}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/search', {trackRawTag: '6)D7n'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackRawTag: 4479591208976386}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackRawTag: -8552982782148609}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/search', {trackState: 'RSl@29VdAvePL'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/search', {trackState: 4467051343118338}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/search', {trackState: -191821573521409}, 400);
				});
			});
		});
		describe('playlist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/state', {id: '33snKA#'}, 401);
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
					await getNotLoggedIn('playlist/states', {ids: ['K#K1U@LLswAB', 'g0#Z[J']}, 401);
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
					await getNotLoggedIn('playlist/tracks', {ids: ['g]9%Ltv', 'Sk]wePVNN']}, 401);
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
					await get('playlist/tracks', {ids: ['18qbjc#MR6xtx', 'A^k&@]UcQN9A^27'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['Tg&[w0Qy^e', '!tDb)n@97yrjtlM'], trackMedia: 'qtuC894JB)8N'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['#tCpz6%dPB8wAPF)7', 'Rh&T1)oTrsyRk'], trackMedia: 902175433687042}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['1(M[JKLyt)oL', '^W^A4G$RB'], trackMedia: -7176564328366081}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['TxKC7Mmu1e*DHv7', 'FA2iT8n'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['f&F84VIT4&J#m6Im', '9WQ5&uvbv'], trackTag: ']DMq&j67BodXiQv#d'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['TgkKuhj74pujd', 'Fh!y1rcYh][&HKUKz'], trackTag: -5793676194217982}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['UG!zGn', 'uu(3g89T9ecst'], trackTag: -3601166936047617}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['c#gpq#V@lX*7eXxo@f', '!tsM3$wza'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['zmb!*p&*P8DwPb', '3r1WV'], trackRawTag: '0R847WVrJMdQ4f1E'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['ZA0oA2', 'q0UEs5NifiL6sM'], trackRawTag: -2771813041963006}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['4NpO0zV]&X45$rc3S1', '*L7CzHlTUD'], trackRawTag: 7364793778307071}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['tAAa1vEGoSi*[]bp', '*rCEGe%JnvAIM2AyVe#'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['SvWhCWcFz@ycnmAaQ', 'qBr2D%'], trackState: 'Q^UaP(a2SM)9z$@UZr'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['1Uxvn*KAQtwoh^gdYSH', 'aAiB]tmt'], trackState: 8613371121238018}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['sZiAXK', '5K9eA^t#'], trackState: 8450779392245759}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['EJw9[mgyEduKjmrz)O)', '9Qrlljg8*D[Zwuobq['], offset: 'Gy%x[Nxu%NB6Vp&wh'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['bC@7Sxqn)SH9', '6ffIq0*n*H'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['tHm0muHLWh', 'C6ASg*W20@sM'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['DNm]Sz^)si[ivgDd7N', 'LP1paLhjE4[f'], offset: 27.81}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/tracks', {ids: ['21nq#XBfvUp7^$vu(L', 'jO#$*npp27u(gzMKF!Q'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['!KHo&mGz', 'Uje*mQf@pqv%'], amount: 'xMy^glL'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['K#Uzj2Awj9(U3Za3zzT3', 'Rc&0c1a*ufQQa4I'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['m*)i0MDtrfCOO', 'anxrMV'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['t7n^78%]UTNGH[L!(Ht', ')xp007i7o'], amount: 93.7}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/tracks', {ids: ['Rn#^iCS2ztDn&SFh', 'DNbh*cO'], amount: 0}, 400);
				});
			});
		});
		describe('playlist/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/list', {list: 'recent'}, 401);
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
					await get('playlist/list', {list: 'avghighest', offset: '^yqm4t'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/list', {list: 'highest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/list', {list: 'faved', offset: 13.02}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/list', {list: 'recent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', amount: 'fuV1DLOZK&RUdPe[!CO'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/list', {list: 'highest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/list', {list: 'random', amount: 59.96}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/list', {list: 'faved', amount: 0}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/list', {list: 'recent', playlistTracks: 'ZEd$^o'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', playlistTracks: 7763027575177218}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'faved', playlistTracks: 3139133631365119}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/list', {list: 'random', playlistTrackIDs: 'LTkjwpqqsDAJe!nLfT7'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', playlistTrackIDs: -3426397456433150}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', playlistTrackIDs: 4032339852132351}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/list', {list: 'faved', playlistState: 'zgxjn(RLI'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'highest', playlistState: 3267393577025538}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'frequent', playlistState: 293494862118911}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', trackMedia: 'BFLW7$TvjEV]80i[jEyV'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'faved', trackMedia: -4664250375077886}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', trackMedia: -4230929832738817}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackTag: '6KWIv0iM'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', trackTag: 7083935481724930}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', trackTag: 5014135813177343}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/list', {list: 'recent', trackRawTag: 'gEdR6y&odB$$i$jR]V'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'avghighest', trackRawTag: -5208802643148798}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', trackRawTag: 8351442083512319}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', trackState: 'B&%)hovdQIjBh'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', trackState: 7532385788755970}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', trackState: 2753312730382335}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', name: ''}, 400);
				});
				it('"isPublic" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', isPublic: ''}, 400);
				});
				it('"isPublic" set to "string"', async () => {
					await get('playlist/list', {list: 'random', isPublic: '!a*BewkoR7m3TK]sQ2)'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'frequent', isPublic: -8822884529078270}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'avghighest', isPublic: -5060455114473473}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('playlist/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('playlist/list', {list: 'avghighest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', sortDescending: '$y^H$B#pC'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'avghighest', sortDescending: -944299659231230}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', sortDescending: -4936512391086081}, 400);
				});
			});
		});
		describe('user/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/id', {id: 'erqMU]%[!'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/id', {id: 'erqMU]%[!'}, 401);
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
					await getNotLoggedIn('user/ids', {ids: ['iuQLpcp', 'Hzf&ZIW@zg%a2']}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/ids', {ids: ['iuQLpcp', 'Hzf&ZIW@zg%a2']}, 401);
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
					await get('user/search', {offset: '6&!rMFS]]@iXvM#'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('user/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('user/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('user/search', {offset: 34.47}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('user/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('user/search', {amount: ')Ga8hjW7aiG8B'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('user/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('user/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('user/search', {amount: 62.71}, 400);
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
					await get('user/search', {isAdmin: 'kREh8n@HfYaG1'}, 400);
				});
				it('"isAdmin" set to "integer > 1"', async () => {
					await get('user/search', {isAdmin: 6929600466649090}, 400);
				});
				it('"isAdmin" set to "integer < 0"', async () => {
					await get('user/search', {isAdmin: 8566568875196415}, 400);
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
					await get('user/search', {sortDescending: '&YY[We#RIDh4'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('user/search', {sortDescending: 8737682247122946}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('user/search', {sortDescending: 3937936433217535}, 400);
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
					await get('playqueue/get', {playQueueTracks: 'phOxGrU(I4qJ%&sgc(OW'}, 400);
				});
				it('"playQueueTracks" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTracks: 3000844379226114}, 400);
				});
				it('"playQueueTracks" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTracks: 136697832538111}, 400);
				});
				it('"playQueueTrackIDs" set to "empty string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: ''}, 400);
				});
				it('"playQueueTrackIDs" set to "string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: 'djE*tw'}, 400);
				});
				it('"playQueueTrackIDs" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: -6551017357311998}, 400);
				});
				it('"playQueueTrackIDs" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: -4847548846047233}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playqueue/get', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playqueue/get', {trackMedia: 'LYe2itZYTQ4Nf6u*#'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackMedia: 5692879452241922}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackMedia: -6791149264044033}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playqueue/get', {trackTag: 'jhhsg1vTA5(03#peM2'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackTag: 702878285037570}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackTag: -478109115613185}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playqueue/get', {trackRawTag: 'VJ0^@mC8kU'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackRawTag: 3905857888714754}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackRawTag: 4934717602267135}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playqueue/get', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playqueue/get', {trackState: 'Q7nbLy(q6tM#V1f'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackState: 3892153751175170}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackState: -3834279507263489}, 400);
				});
			});
		});
		describe('bookmark/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/id', {id: '[W*u1l]MAci4mBxmT^'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('bookmark/id', {id: ''}, 400);
				});
				it('"bookmarkTrack" set to "empty string"', async () => {
					await get('bookmark/id', {id: '9AVGtU', bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/id', {id: 'Tp0uDIk!', bookmarkTrack: 'YX&GNvNsZ'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '9DMr(T', bookmarkTrack: 7514774615097346}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'u]mW)$', bookmarkTrack: 4839528535687167}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'NRXOXzWl[wfTX0FF2Q]', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/id', {id: '1N8PMa)6&3EcG8r5pajq', trackMedia: 'OQSt2G@sYD'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'y0WLhQFWmkc)FS', trackMedia: 2189009333780482}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'xX3gLgcpO)j', trackMedia: -8890938025836545}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'm)DUS4', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/id', {id: 'KDBQCyGH[!CM', trackTag: 'X[LKnbv8P$)BZvdFS4w'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '1ZkjU^rmLkQqHbqCv', trackTag: -2112601827835902}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: '6qjI^c8nS!!PB', trackTag: 3388018262015999}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'IYnaBmR$V', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/id', {id: '5p@T3hg(', trackRawTag: 'fXt[P)Pu^Y^^]A$l$yf'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'IvJJ0vS', trackRawTag: -7581449704177662}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: '#Qow&ePYjSf', trackRawTag: -2809103164375041}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'YOxtd!aISN2U$v[*75', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/id', {id: 'o^4o7zqhINcT6UGPMF[b', trackState: 'Hx@gC!*RG'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '!3sptC', trackState: -4821615292448766}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: '&RoLXegkC%ey^Nynh10X', trackState: -1997007178694657}, 400);
				});
			});
		});
		describe('bookmark/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/ids', {ids: ['9&RyrcLzSkmY', '@l%AC*Mk$waT!YW!yz@']}, 401);
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
					await get('bookmark/ids', {ids: ['H&Bdr', 'MG*t*MTHBnbf'], bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['87D0NQig*$NJtX@J', 'T[UvCVyQEPX1AgUuPuPf'], bookmarkTrack: 'cn@r#fgCyCq'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['yeke!3[IKY]BYba)', 'TnR)pVgW6'], bookmarkTrack: -31216807968766}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['89HXB8Ru', 'HFp8U1RH&4)iL'], bookmarkTrack: 5335699175768063}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['OymyL!', 'U]UyQocp1(Z^&'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['bQj^Bv7dnC*C6APUTAD', 'rVEPtW'], trackMedia: 'rMwj2'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: [')dd3h9BNALg8d', '3[jRDXd%Z7uhj2t'], trackMedia: 381213227352066}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['tL$X[yfWjJr]$IFP', 'L7YB#nQFdfUtGwxUpnwT'], trackMedia: -5786733320863745}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['$Xj79!!OMT9pJw2#]p', 'N1r)v#y(zrpr[bT1dHu'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['@V)(T8S4ctKCU#', 'Y[k)wAVXg'], trackTag: 'UXyq@K'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['V@c!XI8^L7i]nc4SQ%', '$%$fVvNU0BOzF'], trackTag: 1032062597332994}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['Wkhn]Agn73oJt4]tdGR', 'xDXXIJ&1NcvkHP7OhoqS'], trackTag: 146277744508927}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['#LSPwLi%pkU', '7yYDiJZhnkf^)'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['(P*IQtRz5!Ap', 'xRTBej8'], trackRawTag: 'fwlq1bF4'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['%IFw8gFv*Dq*y1lgqD*', ']BjOfsTCwuf)(j8dmvE'], trackRawTag: 1136333745553410}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['ty3DRp9U#ZIAp', ']A)LPHLWrKBW0'], trackRawTag: -1301239337844737}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['49KPm*qFFzrwc3$Gg$27', 'JnPt82ar)Gq'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['2H)teIL&O8^!W', 'OhV3Hyk8IJ9%hw0XV'], trackState: '^73sGE0zdj3vC^k'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['OstWv6', 'bPcTae0!d'], trackState: -226340615749630}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['u55iEaOeaQwWQH', 'eecl2G6GG'], trackState: -8336026263093249}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['ML]R@DsHAa', 'QET98V'], offset: '2^K]ngaL6'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['8N%VeFnosL56[WHjf9P', ')w1&x9B2d)#z&*dq1pE7'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['D[%%bGPh', 'Z*PpzLq]UUqD)d2IxDX'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['%BkDMb2A(]$1MayT452P', 'PT*ie'], offset: 47.46}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/ids', {ids: [']i#ds5zWCn97qTur(6P', '8GRXq2jSnQdsKU'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['0NT&ON)x$qf!jJG9OY', 'eIC@RB&s$8Lm[%)otAy5'], amount: 'NmX&dS'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['ZEG5RGK*Kzg57', ']Ft^UtZG(q]'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['A[Rj0t[U0pU', 'eW&LfZ2@'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['oppj7NIrhbyy*F', '&aGSY2'], amount: 55.47}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/ids', {ids: ['IeJQCz7', 'hBo3M1uMwme'], amount: 0}, 400);
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
					await get('bookmark/list', {bookmarkTrack: '6D(LP6dVTi'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/list', {bookmarkTrack: -8803948475449342}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/list', {bookmarkTrack: 6736972831784959}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/list', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/list', {trackMedia: 'y(rbiGziYrpAJMoRo'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackMedia: 1982684494561282}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackMedia: -1997265795284993}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/list', {trackTag: 'OU%YE!E0'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackTag: -2948094522032126}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackTag: 5231492691132415}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/list', {trackRawTag: 'B6^IO'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackRawTag: -4891848850014206}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackRawTag: -570142253645825}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/list', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/list', {trackState: 'fztWc8xcDQs%urEc'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackState: -1310163101286398}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackState: -327096941412353}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/list', {offset: 'GPy*0Tz&a2c4]QO'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/list', {offset: 93.56}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/list', {amount: '8TEKP8X%(VU@'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/list', {amount: 75.92}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/list', {amount: 0}, 400);
				});
			});
		});
		describe('bookmark/byTrack/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/byTrack/list', {trackID: 'eebDz*#eK'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"trackID" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: ''}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: '$JtJtafe', offset: 'yDG!i3Zm%h'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'Pj&rX$y', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: '1Vr[#', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'm^Tl*plzg&z', offset: 95.92}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/byTrack/list', {trackID: '&IgHoE3NoY8QE0rB6$x', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: '!1uSb$', amount: 'ZR](7VKmygs3qnnmTY]g'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'XlQ8l!)#', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: '@HX$[xcy0u', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: '6k^WZoT@^', amount: 54.08}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/byTrack/list', {trackID: '9(z75CstH#^', amount: 0}, 400);
				});
			});
		});
		describe('root/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/id', {id: 'xi]4(CI^dYbWNIOpAK8'}, 401);
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
					await getNotLoggedIn('root/ids', {ids: ['1f6GWQeNT&%%4Q', 'hSHmuDF6w]jiGFz']}, 401);
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
					await get('root/search', {offset: 'b7*Lvic'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('root/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('root/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('root/search', {offset: 1.83}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('root/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('root/search', {amount: '[JB6VI3AyZ%xg'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('root/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('root/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('root/search', {amount: 45.71}, 400);
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
					await get('root/search', {sortDescending: 'BqlZgXqqLRc]T8rir'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('root/search', {sortDescending: -764639667290110}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('root/search', {sortDescending: -7662221681229825}, 400);
				});
			});
		});
		describe('root/scan', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/scan', {id: 'ti0MDXMNiDr4su'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('root/scan', {id: 'ti0MDXMNiDr4su'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('root/scan', {id: ''}, 400);
				});
			});
		});
		describe('root/scanAll', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/scanAll', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('root/scanAll', {}, 401);
				});
			});
		});
		describe('root/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/status', {id: 'NVQUJCz'}, 401);
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
					await getNotLoggedIn('admin/queue/id', {id: 'aDEr4pzaOU7ttvr('}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('admin/queue/id', {id: 'aDEr4pzaOU7ttvr('}, 401);
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
					await getNotLoggedIn('folder/download', {id: 'awEEERvKC7V'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('folder/download', {id: 'awEEERvKC7V'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/download', {id: 'jJt[XQZXU$^^Led@jq', format: 'invalid'}, 400);
				});
			});
		});
		describe('folder/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/image', {id: '3cLWlup'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/image', {id: '1oMi55t*fW$i', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/image', {id: 'wMCEXktCT[UO9xCP9', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/image', {id: '0Mb*ih', size: '8%EcTJAN^uJzA3^2'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/image', {id: 'Z%38ShTY!IcX', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/image', {id: 'Ilyc]d$6nf(30bzr&5Z', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/image', {id: 'pSiCKfODx!d[C1wfPju', size: 28.78}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/image', {id: '%Pl4d#u$R8hKZ', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/image', {id: 'ag07TQ', size: 1025}, 400);
				});
			});
		});
		describe('folder/artwork/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artwork/image', {id: 'z&%5r)RQ^Lq'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: 'm^aY!Q6y', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/artwork/image', {id: 'CLt!dWQWemvpLSzQ#', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/artwork/image', {id: 'oO8gOi6]J3]K', size: 'a0S1qseo@(CPqe'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: '8r6#p#4!', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/artwork/image', {id: 'GRi^cEdFs', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/artwork/image', {id: 'DGCr58', size: 465.5}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/artwork/image', {id: 'o5@rKdkvyPzFXV3n&*Om', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/artwork/image', {id: 'ep3KinWO@hK[e]a', size: 1025}, 400);
				});
			});
		});
		describe('track/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/stream', {id: 'RF4F19B$TM8B5$f7OJ'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/stream', {id: 'RF4F19B$TM8B5$f7OJ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('track/stream', {id: ')ge&q', maxBitRate: 'Azxt4fRD#z!'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('track/stream', {id: 'OQ3UUW[2Bw', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('track/stream', {id: '#EosDqVyo%&aF2NV]', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('track/stream', {id: 'b3SCYU', maxBitRate: 92.16}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('track/stream', {id: '@PN&P5Pg!D]S', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/stream', {id: ')j*RO(&)c', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/download', {id: '4]OI4oJxls#7e]!'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/download', {id: '4]OI4oJxls#7e]!'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/download', {id: 'cWoXd3cTTq*G^lt', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/image', {id: 'iTbseyg]jEg'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('track/image', {id: 'hB6XZScGnR9wkkMxbg', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/image', {id: 'aNt%(JggRju', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('track/image', {id: '4sz%b', size: 'LJDnTxWwi'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('track/image', {id: 'RlO[AuO]@he1', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('track/image', {id: 'y346U#MmyADE)tHUJ&5', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('track/image', {id: 'Q[vP!&lQCo*(', size: 485.24}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('track/image', {id: 'innqS6jVjkNc9S])Fq', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('track/image', {id: 'k3A(zYt3by', size: 1025}, 400);
				});
			});
		});
		describe('episode/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/stream', {id: 'Uah5BaSJtuk9SlCRu'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/stream', {id: 'Uah5BaSJtuk9SlCRu'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('episode/stream', {id: 'J0pKlK6DWgu05^%', maxBitRate: '4bO1WJnntq%jhQlZqSR'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('episode/stream', {id: '$ixe@k', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('episode/stream', {id: 'kLgdxlscDGEt', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('episode/stream', {id: 'fsv#X16duqFRrv', maxBitRate: 73.16}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('episode/stream', {id: '0r1x2yA#eZKM5$', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/stream', {id: 'o^e7J#', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/download', {id: '1kFQ@(c8ASvx8'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/download', {id: '1kFQ@(c8ASvx8'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/download', {id: 'N8Y&[QzN5IW$]M4[', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/image', {id: 'TtNJbygvlX%u8Gxc])A%'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('episode/image', {id: '8UnmDT&bqldWiw6j]', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/image', {id: 'Pt66vcbPSa0O^L', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('episode/image', {id: 'ZT$M&gozV^vfzrE9@$3I', size: 'L03SVM09'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('episode/image', {id: 'euoQtvEv]yBx', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('episode/image', {id: 'Ck5S[H6ayR(', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('episode/image', {id: 'p5CnbGL3aEigLNfWr', size: 303.73}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('episode/image', {id: 'STeGoTm(lvIw', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('episode/image', {id: '9%SAGwxaYTy', size: 1025}, 400);
				});
			});
		});
		describe('podcast/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/image', {id: 'sDKlbwR'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('podcast/image', {id: 'QM(]Fc', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/image', {id: '^WQEQkVyJb6wBxRAX(8', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('podcast/image', {id: 'Jr#g7pAaDziaJ&D0aF', size: '5eCW&MDd)bY#f^'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('podcast/image', {id: 'zCGx]j5hvV%iH', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('podcast/image', {id: 'n0d(crW3C@p', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('podcast/image', {id: 'IL!HdWU!WaCax94iIXs', size: 308.19}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('podcast/image', {id: 'YZmOVe13gYt]aPN', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('podcast/image', {id: 'F^AX8F1A', size: 1025}, 400);
				});
			});
		});
		describe('podcast/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/download', {id: '1](jfsOmbWBw3reYOS3'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/download', {id: '1](jfsOmbWBw3reYOS3'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/download', {id: 'hs888D[qBz8', format: 'invalid'}, 400);
				});
			});
		});
		describe('artist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/image', {id: '%W&MkRN7qLx4Omid'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('artist/image', {id: 'lxqI(7IBa[zY8zD$7^', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/image', {id: 'fo3JLJ**&KB1', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('artist/image', {id: 'MPbWwEhW5%&fe', size: 'vWxG8eXhXoL'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('artist/image', {id: 'C*6SOw8W6P1', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('artist/image', {id: 'I&!&ZiVJgE1!dk', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('artist/image', {id: '#awBaV', size: 374.71}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('artist/image', {id: 'Tv2AwcNhn&sJGj[mHzw5', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('artist/image', {id: 'LQ8vDbn0', size: 1025}, 400);
				});
			});
		});
		describe('artist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/download', {id: 'a!j]7'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('artist/download', {id: 'a!j]7'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/download', {id: 'QkiLw$n8sXmrECbc^9', format: 'invalid'}, 400);
				});
			});
		});
		describe('album/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/image', {id: 'EYTD4w#TJsp!vd!u'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('album/image', {id: '(Ghjwx', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/image', {id: 'Z!cPo', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('album/image', {id: '5Qe(TD', size: '4t$d24Sf4'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('album/image', {id: '2PHKXI#RXHI6bv', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('album/image', {id: '$oNlWv', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('album/image', {id: 'g9PN#9pPR8wk7lKkDF', size: 29.31}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('album/image', {id: 'kKoSUPP)#Mno#pRRS', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('album/image', {id: 'C&rnPBkUpLx', size: 1025}, 400);
				});
			});
		});
		describe('album/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/download', {id: 'AL%X9atjlakW('}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('album/download', {id: 'AL%X9atjlakW('}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/download', {id: '@RiUx]VGcF2EPcLg7j', format: 'invalid'}, 400);
				});
			});
		});
		describe('playlist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/image', {id: 'Bj!oIkB&kGAwfr!T'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('playlist/image', {id: 'sZasj)D]F', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/image', {id: 'qPkWV(4c1)^', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('playlist/image', {id: 'c@SApo9', size: 'g$CVtR13nA#'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('playlist/image', {id: 'M)UgvnB]YjJ56WzS', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('playlist/image', {id: '@@MeCOF', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('playlist/image', {id: 'ls8!(^50dwI&8', size: 495.21}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('playlist/image', {id: 'nD^(RE*RXX02kgP@#rK', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('playlist/image', {id: '2D!Id%ui&', size: 1025}, 400);
				});
			});
		});
		describe('playlist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/download', {id: 'o^jFJHn*)E7cj&KP'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('playlist/download', {id: 'o^jFJHn*)E7cj&KP'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/download', {id: 'vAn0hC]lI^5YOoal1OC', format: 'invalid'}, 400);
				});
			});
		});
		describe('user/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/image', {id: 'C6Rjsl!F7$We'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('user/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('user/image', {id: 'PcBA*St', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('user/image', {id: 'g!*49Hv^MK5YPp^', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('user/image', {id: 'xebhUf^TtMuQ0n3oRjyw', size: 'QMGrx^q'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('user/image', {id: 'MazWXj5U(vGM3q', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('user/image', {id: 'mctVF3^Shz9', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('user/image', {id: 'gFSziy', size: 318.31}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('user/image', {id: 'nu1lABcu1olQ@#h&', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('user/image', {id: 'PBy)Ztt', size: 1025}, 400);
				});
			});
		});
		describe('root/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/image', {id: '8Bx52mNp82]yRM3!*'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('root/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('root/image', {id: 'akSk0yNcico', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('root/image', {id: 'yitHlNEDvqh&d8', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('root/image', {id: 'F!aDtINR#3V', size: 'wPoj!R9DN*'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('root/image', {id: '2jS^kqD6T1Nyj4QogD$', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('root/image', {id: 'x#oo*]E', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('root/image', {id: 'zhzvNlf(n', size: 62.55}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('root/image', {id: 'V12fas7V2', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('root/image', {id: 'zeYcJ!isp', size: 1025}, 400);
				});
			});
		});
		describe('image/{id}-{size}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/PgVP%5DaoO5KikUOYgQ)-941.tiff', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/tJEzT-482.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/yuzsHcm%26%25TE9-807.invalid', {}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('image/s7%25hP%5Dzk%40NV%25wap-l%239fN.jpeg', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/XOV%25h%2524eIam2IhJwygK-.jpg', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/LZ44%5EnlgFR-true.jpg', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/Ai88f7JzEWOQ3s%25jpC-673.56.tiff', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/Z5rZuD)FdXHAI%23tg-15.jpg', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/eTjjlH0Gc%5BSek-1025.tiff', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-538.jpeg', {}, 400);
				});
			});
		});
		describe('image/{id}-{size}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/vhEt%25QM-308', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"size" set to "string"', async () => {
					await get('image/amfBHt8RRmkC3Y-xz5nfp63m%5EzwozE%26UC!', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/hLZau%26d%26HEJ0D%25KKRsR-', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/%5DcEgK-true', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/*iz9*c2Ivmy-546.06', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/6%24n%5B9J%5DXeCIdDV(4M-15', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/Vo%24BB%40H(2%5EVmJg(zNo%40l-1025', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-832', {}, 400);
				});
			});
		});
		describe('image/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/An2%23RFsgDJOnPn5!w.tiff', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/Cnp4F6ATHPyQPb47Ur.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/b3XC%40%5Bu.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/.jpg', {}, 400);
				});
			});
		});
		describe('image/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/uBxh%40rrwb', {}, 401);
				});
			});
		});
		describe('stream/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/qu(IceDm.wav', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/qu(IceDm.wav', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('stream/JJ%252cN3vBdC78YQ*1YL.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('stream/.webm', {}, 400);
				});
			});
		});
		describe('stream/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/dyi%24oW2C', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/dyi%24oW2C', {}, 401);
				});
			});
		});
		describe('waveform/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform/cVwjFHJA.dat', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform/cVwjFHJA.dat', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('waveform/r%5Dr%40lC83fz9pd%26.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform/.dat', {}, 400);
				});
			});
		});
		describe('waveform_svg/{id}-{width}.svg', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform_svg/oNpOoc%23B%5Bc%26qX%26aQ-3390.svg', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform_svg/oNpOoc%23B%5Bc%26qX%26aQ-3390.svg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"width" set to "string"', async () => {
					await get('waveform_svg/Pg%26(FnzM9gYik-JM7kuLjfnfsqsD.svg', {}, 400);
				});
				it('"width" set to "empty string"', async () => {
					await get('waveform_svg/%40G*un%5BKcV%5B8-.svg', {}, 400);
				});
				it('"width" set to "boolean"', async () => {
					await get('waveform_svg/chHnZCsALG86**8CnHq7-true.svg', {}, 400);
				});
				it('"width" set to "float"', async () => {
					await get('waveform_svg/rhClkruPOqKZ%23iy82-3996.38.svg', {}, 400);
				});
				it('"width" set to "less than minimum 1"', async () => {
					await get('waveform_svg/0Fr%5BK-0.svg', {}, 400);
				});
				it('"width" set to "more than minimum 6000"', async () => {
					await get('waveform_svg/%26IyVn5-6001.svg', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform_svg/-1156.svg', {}, 400);
				});
			});
		});
		describe('download/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/Wo(%23rV!H', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/Wo(%23rV!H', {}, 401);
				});
			});
		});
		describe('download/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/JM%5Dex.zip', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/JM%5Dex.zip', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('download/U9)Zx*f%5EI%5Em.invalid', {}, 400);
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
