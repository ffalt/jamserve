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
					await getNotLoggedIn('lastfm/lookup', {type: 'artist-toptracks', id: 'PT8x]xhnH)S8W6ij%Rg'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: '', id: '!CwjMnL4Pvkd'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('lastfm/lookup', {type: 'invalid', id: '74%UV(S2'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('lastfm/lookup', {type: 'artist', id: ''}, 400);
				});
			});
		});
		describe('lyricsovh/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('lyricsovh/search', {title: 'mFe@OzoY0lEf5U', artist: 'KY0c92O!V$9!y['}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"title" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: '', artist: 'm]dA9!PxrN4(NvAwJV'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('lyricsovh/search', {title: 'SJiAT', artist: ''}, 400);
				});
			});
		});
		describe('acoustid/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acoustid/lookup', {id: 'P3N0eJsXu*['}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('acoustid/lookup', {id: 'x(1T9gd&', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/lookup', {type: 'place', id: 'NxYI]K^K)IIJ2DV8'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: '', id: '5vLmmSe$#0Bpm3zz'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('musicbrainz/lookup', {type: 'invalid', id: 'K)FzrGUsa^MVkJe'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'release', id: ''}, 400);
				});
				it('"inc" set to "empty string"', async () => {
					await get('musicbrainz/lookup', {type: 'label', id: 'afa3l6ISDhZr@h]', inc: ''}, 400);
				});
			});
		});
		describe('musicbrainz/search', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('musicbrainz/search', {type: 'release-group'}, 401);
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
					await get('musicbrainz/search', {type: 'work', recording: ''}, 400);
				});
				it('"releasegroup" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'artist', releasegroup: ''}, 400);
				});
				it('"release" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'area', release: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'recording', artist: ''}, 400);
				});
				it('"tracks" set to "string"', async () => {
					await get('musicbrainz/search', {type: 'recording', tracks: '[no5TyR43'}, 400);
				});
				it('"tracks" set to "empty string"', async () => {
					await get('musicbrainz/search', {type: 'label', tracks: ''}, 400);
				});
				it('"tracks" set to "boolean"', async () => {
					await get('musicbrainz/search', {type: 'work', tracks: true}, 400);
				});
				it('"tracks" set to "float"', async () => {
					await get('musicbrainz/search', {type: 'recording', tracks: 88.56}, 400);
				});
				it('"tracks" set to "less than minimum 0"', async () => {
					await get('musicbrainz/search', {type: 'recording', tracks: -1}, 400);
				});
			});
		});
		describe('acousticbrainz/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('acousticbrainz/lookup', {id: '6l*4%'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: ''}, 400);
				});
				it('"nr" set to "string"', async () => {
					await get('acousticbrainz/lookup', {id: 'rLqfn', nr: '8Cl8Bu1'}, 400);
				});
				it('"nr" set to "empty string"', async () => {
					await get('acousticbrainz/lookup', {id: 'Bo4Jb', nr: ''}, 400);
				});
				it('"nr" set to "boolean"', async () => {
					await get('acousticbrainz/lookup', {id: '*F9LJQMT6cHyCJ4', nr: true}, 400);
				});
				it('"nr" set to "float"', async () => {
					await get('acousticbrainz/lookup', {id: '!QsJQ5)np*v[Lfe', nr: 10.79}, 400);
				});
				it('"nr" set to "less than minimum 0"', async () => {
					await get('acousticbrainz/lookup', {id: '#AK@N7LVW*o2E', nr: -1}, 400);
				});
			});
		});
		describe('coverartarchive/lookup', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('coverartarchive/lookup', {type: 'release-group', id: 'B8D#4Eh2pb42Ccvo]lI'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"type" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: '', id: 'b@LlA@9yW7D(8Y7qp'}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('coverartarchive/lookup', {type: 'invalid', id: 'cm%Al]5HJ4)'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('coverartarchive/lookup', {type: 'release', id: ''}, 400);
				});
			});
		});
		describe('wikipedia/summary', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('wikipedia/summary', {title: '&decehyyQJCPO'}, 401);
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
					await getNotLoggedIn('wikidata/summary', {id: 'IS5aTZx%EC4&gS3lw!1F'}, 401);
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
					await getNotLoggedIn('wikidata/lookup', {id: 'Uxa@cqb(m'}, 401);
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
					await getNotLoggedIn('autocomplete', {query: '3o]n@![ZB'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"query" set to "empty string"', async () => {
					await get('autocomplete', {query: ''}, 400);
				});
				it('"track" set to "string"', async () => {
					await get('autocomplete', {query: 'te^%Jg%l6N', track: 'S$!7['}, 400);
				});
				it('"track" set to "empty string"', async () => {
					await get('autocomplete', {query: '8NC^De', track: ''}, 400);
				});
				it('"track" set to "boolean"', async () => {
					await get('autocomplete', {query: 'd$jOZLh[*B', track: true}, 400);
				});
				it('"track" set to "float"', async () => {
					await get('autocomplete', {query: 'ZRDDByM', track: 83.9}, 400);
				});
				it('"track" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'E!Q^T&r#AG%(cMn', track: -1}, 400);
				});
				it('"artist" set to "string"', async () => {
					await get('autocomplete', {query: '0$cMxiT&', artist: 'wP(]ZwvGt'}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('autocomplete', {query: '5uKYWszQmD*#jTJJ6nV', artist: ''}, 400);
				});
				it('"artist" set to "boolean"', async () => {
					await get('autocomplete', {query: '$^dp7&XNJXQy', artist: true}, 400);
				});
				it('"artist" set to "float"', async () => {
					await get('autocomplete', {query: 'T#*pV0hfq&Wf3mTRHh3E', artist: 83.62}, 400);
				});
				it('"artist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'tG%v9GcZo08w]', artist: -1}, 400);
				});
				it('"album" set to "string"', async () => {
					await get('autocomplete', {query: '@C0^ERpT%d', album: 'yq^jr2zWBaOjlxU'}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('autocomplete', {query: 'CdB8dHsB', album: ''}, 400);
				});
				it('"album" set to "boolean"', async () => {
					await get('autocomplete', {query: 'cVN72g5RffkFb7yZ', album: true}, 400);
				});
				it('"album" set to "float"', async () => {
					await get('autocomplete', {query: '3&JX9RTmnt4Z@CX', album: 84.13}, 400);
				});
				it('"album" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'vVU0A#HQ', album: -1}, 400);
				});
				it('"folder" set to "string"', async () => {
					await get('autocomplete', {query: '5Lc!UKJ6GS&r', folder: '4fpQFqxD&237HndDWxd'}, 400);
				});
				it('"folder" set to "empty string"', async () => {
					await get('autocomplete', {query: 'W()1M@[QAN@nl%', folder: ''}, 400);
				});
				it('"folder" set to "boolean"', async () => {
					await get('autocomplete', {query: 'Iv&g6Q', folder: true}, 400);
				});
				it('"folder" set to "float"', async () => {
					await get('autocomplete', {query: '@Dc19%f7!FM2UAA', folder: 77.62}, 400);
				});
				it('"folder" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'TRMjhvuiyBQXta', folder: -1}, 400);
				});
				it('"playlist" set to "string"', async () => {
					await get('autocomplete', {query: 'OO98iMOXI@s&PSVhSxr', playlist: 'Npj&xXDDqre'}, 400);
				});
				it('"playlist" set to "empty string"', async () => {
					await get('autocomplete', {query: '#CoQMvL', playlist: ''}, 400);
				});
				it('"playlist" set to "boolean"', async () => {
					await get('autocomplete', {query: 'X80r]', playlist: true}, 400);
				});
				it('"playlist" set to "float"', async () => {
					await get('autocomplete', {query: 'uQJ%6e', playlist: 46.58}, 400);
				});
				it('"playlist" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'tOeS]wmu]MWL8F', playlist: -1}, 400);
				});
				it('"podcast" set to "string"', async () => {
					await get('autocomplete', {query: 'wuCESw&KuiSFW', podcast: 'i4F5dR$JzSVkoknhL'}, 400);
				});
				it('"podcast" set to "empty string"', async () => {
					await get('autocomplete', {query: 'dlsjIh(BMVcA^5', podcast: ''}, 400);
				});
				it('"podcast" set to "boolean"', async () => {
					await get('autocomplete', {query: '8czx5F6yw', podcast: true}, 400);
				});
				it('"podcast" set to "float"', async () => {
					await get('autocomplete', {query: '(thriYFH3cz[lKSnai', podcast: 76.76}, 400);
				});
				it('"podcast" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: '@wxttEMK[UKsl40Kqn', podcast: -1}, 400);
				});
				it('"episode" set to "string"', async () => {
					await get('autocomplete', {query: '6[ZggLIW3mtWvrsYhnv]', episode: 'o0bj$u78wa]RML]'}, 400);
				});
				it('"episode" set to "empty string"', async () => {
					await get('autocomplete', {query: 'U4aXClL[wrc2xhN', episode: ''}, 400);
				});
				it('"episode" set to "boolean"', async () => {
					await get('autocomplete', {query: 'HD3AJbpBp2#D7Uyt', episode: true}, 400);
				});
				it('"episode" set to "float"', async () => {
					await get('autocomplete', {query: 'FISj#hgoJ4!umwQPI[O', episode: 4.23}, 400);
				});
				it('"episode" set to "less than minimum 0"', async () => {
					await get('autocomplete', {query: 'l4cfAQxS2S5Ij$Al[', episode: -1}, 400);
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
					await get('genre/list', {offset: 'P^&oWOzkN'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('genre/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('genre/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('genre/list', {offset: 68.16}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('genre/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('genre/list', {amount: '^waKJoROsjJmr2e!0N'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('genre/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('genre/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('genre/list', {amount: 48.45}, 400);
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
					await get('nowPlaying/list', {offset: 'P&QAUxDgpOhbl'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('nowPlaying/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('nowPlaying/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('nowPlaying/list', {offset: 65.48}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('nowPlaying/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('nowPlaying/list', {amount: 'l4iQy'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('nowPlaying/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('nowPlaying/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('nowPlaying/list', {amount: 29.81}, 400);
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
					await get('chat/list', {since: 's2Por$QDtWzbWN%O$'}, 400);
				});
				it('"since" set to "empty string"', async () => {
					await get('chat/list', {since: ''}, 400);
				});
				it('"since" set to "boolean"', async () => {
					await get('chat/list', {since: true}, 400);
				});
				it('"since" set to "float"', async () => {
					await get('chat/list', {since: 17.74}, 400);
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
					await get('folder/index', {level: 'qpG@HJ@7Q&xbqH1wY'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/index', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/index', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/index', {level: 29.53}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/index', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/index', {newerThan: '2ncJL#ux5W)w%uTi'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/index', {newerThan: 94.74}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/index', {fromYear: 'bdhx2!F@6M5%0r'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/index', {fromYear: 90.49}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/index', {toYear: 'qGOuWzHCl@Y9GaO'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/index', {toYear: 55.1}, 400);
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
					await get('folder/index', {sortDescending: 'wx(6aE3]hOOsOz9GyPIZ'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/index', {sortDescending: -1821335487512574}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/index', {sortDescending: 4692166290964479}, 400);
				});
			});
		});
		describe('folder/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/id', {id: 'J(EAft]5OR8MuZRLV$p'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/id', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'lkmCA!UX*$bu', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/id', {id: 'XH(bd^V$', folderTag: ']^#g)GQ2(iJaSZsHf'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'O#!z!7ArQ#7@', folderTag: -7073285107875838}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: '$Av9D&wTP3Ab6JiZ]0V', folderTag: -2568044706529281}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/id', {id: '[kvS&HIUj21bIk', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/id', {id: 'ra&U0zg)', folderState: 'LsrcXlgpw0McRPjP'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'NtT!Ts^', folderState: -1282709066350590}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'pf^@0mclXhS#!5X', folderState: 8778937454821375}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/id', {id: '3yJ7tE', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/id', {id: 'a9f&45Op@Z*)Qo^nF', folderCounts: 'j[bf(C!lSN@YDgz'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'C!CZt]vJpeziqyZJ1EJ', folderCounts: -116853175222270}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'ix1oOAymbeR', folderCounts: -1844354469593089}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/id', {id: 'NaS3tqd5nPLxluNI', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/id', {id: 'GBG)DQg58%#%S@J%RH%', folderParents: '(ZQfY*'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'xNiw(gVnZ^SYNAG$%mxV', folderParents: -4331041372241918}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'X5^ycabs[[(', folderParents: 3256396426510335}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/id', {id: 'z#!f$@%4$MPOVRD8$0J', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/id', {id: 'Yri67i&kVzn7$$10)', folderInfo: 'FxNXWugu3g7wR'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/id', {id: '@pMpg*', folderInfo: 4437118780702722}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/id', {id: '[Yy!Kz', folderInfo: -5993240528420865}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/id', {id: 'ThxjE*tM)p4VvKxvV', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/id', {id: '49MUhF&q', folderSimilar: 'MiRwY'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'vm0hqNUfa5P5i', folderSimilar: 6667116346343426}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'Ia5wTf3mjj', folderSimilar: 1935278499430399}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/id', {id: '@Rtb2]JHrZOrN!*Zq', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/id', {id: 'G6e$G', folderArtworks: '1A34KbwEjJ'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'rELKzWcdCQN46d', folderArtworks: 7062713616302082}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/id', {id: '0%(PCeGAee', folderArtworks: 7023892396769279}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/id', {id: 'iqJYrnRuc[yAfOD*q', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/id', {id: '@5^7)H2BPJ', folderChildren: 'u1hzyS36'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'Hp*TZ)2fK8x&ZGzL!aW', folderChildren: 2958303848038402}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/id', {id: '0sbE6', folderChildren: 6320655922364415}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/id', {id: '5C^S&vL)2YBI0W$*kbB2', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/id', {id: 'SYX&vKuO*k', folderSubfolders: '7$fX^zkJUh[&wUZ67PyC'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'mnc93GVV', folderSubfolders: -2647562465050622}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'wXDk7Rmp3u9', folderSubfolders: -4808009599418369}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/id', {id: 'PKZLa&Rd[gr4sZ', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/id', {id: '2q6cX', folderTracks: '867]iVW'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'Un2%Zx)5[eR!', folderTracks: -8952966857883646}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/id', {id: '6AFIRPjuyh3', folderTracks: -574686572314625}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/id', {id: 'Yi&BRJCX', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/id', {id: 'L9qBSfDp&CbYW', trackMedia: 'WuAl304iIu*6#Rr'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'qxC4@P]Ed', trackMedia: -4826200325226494}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'MDH6lXJaHRTo', trackMedia: 8977745245634559}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'zNOg)vzhq[nwCbLJ', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/id', {id: '$tW*G)sWH', trackTag: 'U2BxY*yvBWcG'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'Pfu@s', trackTag: -3249236791525374}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: '7#CZP%sG)l37LqIY', trackTag: 5661699315073023}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/id', {id: 'zU[&u3Q!ZL]Vl', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/id', {id: '&I*siqE$jajV*JBw10', trackRawTag: '4In]Ibl!yktD'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'VgjrrL(#vKN', trackRawTag: -43056464134142}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'SY*60Kon', trackRawTag: 3898156735528959}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/id', {id: 'orNYZ[', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/id', {id: 'zuF!cHFIo[Jbt$Gn', trackState: 'SuiVAKME)gOCMe'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/id', {id: 'RWzUe', trackState: 2716046830075906}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/id', {id: 'aXGagTzre0HrPZW^', trackState: -1029525689335809}, 400);
				});
			});
		});
		describe('folder/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/ids', {ids: ['3U&T3', 'GjJlmk@bgs@sjajFnU(l']}, 401);
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
					await get('folder/ids', {ids: ['saV@j]!qf0eCp7ic', 'RE)%1PJx2FLjs8VN'], folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['IyfZ1%ApIYEG5ziXk', 'Kt^w82h[dCQ3WZ(5&4'], folderTag: 'Sm##4'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['JyHJ)NTFB]', 'P@YI0gS'], folderTag: -3553780373127166}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['IOR04yOG3&85%y7', 'FMrppT!z(rsdsv'], folderTag: -5838367803572225}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['th^U5lU', 'jxXZx$BwLf7Fplji'], folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/ids', {ids: ['osgGcZR[Tow]A', '4Q6]j@P'], folderState: '4s#EliqzCZMwam'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['nL$rtGrUzQ', 'wpi4&@(jD@dTfzMR'], folderState: -3286831428796414}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['A@zTCKI&K^!#', 'wg#l$'], folderState: -7995271925465089}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['TZW1Ej1[OrqK#1o', ']1ORIs%3AhJMxX'], folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/ids', {ids: ['riBRt', 'LQ4(t7r)Ed2iw0Tnap'], folderCounts: 'eWAml'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['NgfBuJjwxn6gtlt9', 'gXNRr]Ma&CNa'], folderCounts: -2060514406432766}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['w%(os2ykxvT0i&', '^I#ML^s5zg7oN^yhFf[7'], folderCounts: -6177144208097281}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['RBB)@YAY$m2eTv', '^m8DlAIov#e1Ft'], folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/ids', {ids: ['l*qr&mS4zxm]4uf', '2nmTj03)HWeLU'], folderParents: '&Av4RVVwHpdRoAIPCI'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['^pqxZ(RyteKmlE8hQrd!', '^[mMvxw9VVeops'], folderParents: -283512041111550}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['7sy4K(Z', 'TY%cmWbqjfk$qutuB'], folderParents: -2813066118955009}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['Q0z78', 'EyZap^%]C(KXH3k8%'], folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/ids', {ids: ['^Togcu1tj', 'pPAnoWWY'], folderInfo: '^8qLTCjCR!kBe'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['$5^eskAoS8CGt%', 'qs&dgCd33(2e([P4XTJ'], folderInfo: 2738313056223234}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['J[Bbf1NV*jEC5L7Ob', 'NsP1oik)J%&&eDu'], folderInfo: 5994726389972991}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['KRREaK6zChEIOY2AZV', 'B3qaXkTI4x2nR1'], folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/ids', {ids: ['CsY0yGx413c4&Y', 'H1yQcLf0%ku5'], folderSimilar: 'U)KO5'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['$SUw0vebpf', 'UF6RB'], folderSimilar: -6040413886480382}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['PQgS14MQB3HQ^B[TfgSi', 'HZrkrCc33gpo3&'], folderSimilar: -4812559819472897}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['MWqRpL#I!p)ty1I', '#DsTGq^qduR1jb2'], folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/ids', {ids: ['71gRn', 'p*XW7WaL*qxo&'], folderArtworks: 'a6P1A'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['pMhM5G[lWDEe$', 'D5)9ltG$A]b48b'], folderArtworks: 7033418663591938}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['^41a4!', 'b7aD8yR'], folderArtworks: -913029822676993}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['pGP(K7rC]U', '@GvfYl&7Sr[Qb1M8QH'], folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/ids', {ids: ['HqtslW$K3kKl7)', 'Kk]w4z)Q*IOzBx'], folderChildren: 'QRn9G$R4U'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['PO!IZ9jLFRQTXeZMYb', '*F028KA'], folderChildren: -3105812687880190}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['m]3!@!*GXy2ud$JCxJa', 'P3#KucXryYSJ'], folderChildren: -3105210364854273}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['qK[klcUIOl5zU', 'J*OY!'], folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/ids', {ids: ['](!UEM', 'a2%%A*v*t3$)1'], folderSubfolders: 'n&HOg3'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: [']l8ElTt', 'UX#ky^ZX]M6TvlXl'], folderSubfolders: 128572823961602}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['YMJPU', 'J%(^m*'], folderSubfolders: -8437830124568577}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['%yEnoXP2On@]VgF', 'mtlaG61]v'], folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/ids', {ids: ['2g#b8o0j)wWgcR5BH', '2RtTO6%F9m&DiAm'], folderTracks: 'i3D3Bj(L&f'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['4eZz&Yi^', 'GKcMjBthHIG(EW'], folderTracks: -5566808115380222}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['M*Q*GA', 'mU^0d3F@mK'], folderTracks: -1987840124649473}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['*kgNbxQRnS$KJ', 'BHZi2wDqki'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/ids', {ids: ['^]3YlzJ7)pwUW@V9', 'a6l3ChhZI^P'], trackMedia: 'WX&h2'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['0nHmGru', 'zbAf@RQ*F(*uvf$6'], trackMedia: -1187964050735102}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['#FeqT7yN7wtAN', '5JBq7Pq72PA23Q3'], trackMedia: 917852123037695}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['@JJZdDhQBP', 'FXKa(H&'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['dB(E5CX4tWv@QKE', 'gx%klYD%79CjKq7[g@pS'], trackTag: '3#EpN]dC9emjt9@jKziS'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['E@]1UdN!E', '^HZQz%oiknEeO4I6Bz'], trackTag: 2918412791578626}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['X(tiLt', 'EgF%%jMWLCU4@!9[m'], trackTag: 5702512824811519}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['8EHXl6103vZvyxh', '05]39wNZI'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/ids', {ids: ['GeNu)cs#', 'b]tlw*6fH#hgKNOiD#'], trackRawTag: 'Aausy7U&@YN'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: ['y6zyVoG$mG*dBEehE', 'K61uVW4l@sPom0'], trackRawTag: 6816293646761986}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['6o#CXLpV@%ijbU0DjGUy', 'bL@uaRDaUd'], trackRawTag: -7617352455684097}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/ids', {ids: ['NVe*FyKY@nrTQ', ']eCvdAE3Qb2REEh$'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/ids', {ids: ['aAK$U', 'w#hvD^)!'], trackState: 'DB2WtxPVQ$'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/ids', {ids: [')gEk9zjA0X4N7Y', 'AEN^3ina'], trackState: 6127497389277186}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/ids', {ids: ['aMGBHsv)%vRG8bM5mW', '1A3JsZG'], trackState: 7198145825996799}, 400);
				});
			});
		});
		describe('folder/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/tracks', {ids: ['76XxeTGtmFhGa', '*r)xXKN2AOv@lQ']}, 401);
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
					await get('folder/tracks', {ids: ['lsJ5Z[muBBw$dg6wAbx', '%us@P49H1k*fK'], recursive: ''}, 400);
				});
				it('"recursive" set to "string"', async () => {
					await get('folder/tracks', {ids: ['yT0X5*dotHN5c', 'RPI#MS0VqG(5NMWqmk9'], recursive: 'fJrLxSpFJaf!tMbsHNkW'}, 400);
				});
				it('"recursive" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['@SPog&J##Ykgeytk3f', 'TPg%by7(p@@'], recursive: -6936308215709694}, 400);
				});
				it('"recursive" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['7vmCCZ3QSvSYgepB9c', '@o@Fmf1Ja'], recursive: -2413554649006081}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['YnK$Q', 'aYEQJk1V9djC2)yYU'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/tracks', {ids: ['r5jE6%erVNU4AoikEIQR', 'XEr]tMp('], trackMedia: 'IAUzLNYxzUD59'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['6H%3IX6rgT', ']z&ndgfbVINKBOC41f'], trackMedia: 1287271173062658}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['K3TAR88[5TPyr', 'pxNHwFoP*['], trackMedia: 3447713609809919}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['162pDK3W@(', '9%GuFSj464W&CH'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['gDNrL', 'u2up0UQi7ntErQaBif]3'], trackTag: '9@CZaz[M&4g('}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['Q4hS(6oyPO!1aK8', '&r&DS3chtho]nHWb'], trackTag: -4774485123137534}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['Bq2hK*', '!5oZyfA'], trackTag: -7927093622996993}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/tracks', {ids: [')J!lQ*w]]QG!vJfO)3', 'iP((kIVwm'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/tracks', {ids: ['df40%zQtB[]]%Zl', 'i$xNK32NiCuMeW[%Lc4d'], trackRawTag: 'gw]1WTl5Rf@'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['RpdW4', 'Vg@suO)iYNEc]]odwC&'], trackRawTag: -2846171236139006}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['Fr76&K*E3m)%p', 'Gsjx1O$s8AuX'], trackRawTag: -1525789925310465}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['!]p3ICZkMmvCt)hK%', 'cupheI1lq4E(zmlhucj'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/tracks', {ids: ['x[5hYp]OHzy', 'l!exGAkX0'], trackState: 'bSUkVVQLQn7VcM(1XQy'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/tracks', {ids: ['XdXfsgwNBlNw', '#*Olc%(!MBkIkFOpn73'], trackState: 6716430737211394}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/tracks', {ids: ['V3fuQ%NXPrs(Mo07l^IZ', '#&WP*'], trackState: 4170355954417663}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/tracks', {ids: ['42^3]s@EnLnB]qNumdAy', '57AGQf[js2k'], offset: 'FUNg2$J'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['T1yYt', 'yd)TP4^JczaGJ'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['4H#IWSUqjItq]q[DI', '0N0r@fTrwi]z*!xaS'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/tracks', {ids: ['(^KqMgGZ^cxCo#J$lDE1', 'bBBbf!EWN'], offset: 82.65}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/tracks', {ids: ['h[&XL$5XO@6DN1P4', 'IXwS2^[k'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/tracks', {ids: ['fi#eI]S&PdQ', '[Ak](dgs2)M[L'], amount: 'M&LDIT^vJ^p(AI'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/tracks', {ids: ['MsVGGw]KC', '0b9e]pA#5uw]Dv#'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/tracks', {ids: ['CU7viCW60', 'iV8%FJ]A!t)m'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/tracks', {ids: ['9)LU5NfJ&KHbCG1', '5eshMNie4i4bD!V'], amount: 38.64}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/tracks', {ids: ['!qboGRVdC90c', '3vhYABtEPe&GjYY'], amount: 0}, 400);
				});
			});
		});
		describe('folder/subfolders', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/subfolders', {id: 'xQ3xVz&&)%Kz'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/subfolders', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '!Xft[L@6h]*NtiU2[X', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/subfolders', {id: 'X9LMoB@1NBm@oPJ2DT', folderTag: 'Ghf8Z&u'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '45y2mlh]', folderTag: -3424260357881854}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'R0lMGGuRzzr3o9Q', folderTag: -5578440426127361}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'i#*e6I', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/subfolders', {id: 'w%8dbWvI@VG]kxEJPO', folderState: '9MpixUVB@vrNRVV29[3'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'nSpRGyn)Ybjcyeh', folderState: -5135932961325054}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'dZT$%', folderState: 4526373439799295}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '4PasU^w8AtPEZls4A', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/subfolders', {id: 'S*O$2^KFTqOZaEtp8', folderCounts: 'UGx%@O'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: '$dtw9]nh]RfjXjzT', folderCounts: 6669752504156162}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'KaC@q#9LDgL]22', folderCounts: -1065559517036545}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'cI](i^])$a(u', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/subfolders', {id: 'icq]cpn', folderParents: 'JEy$8'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'rB#fJIlS2', folderParents: -5365371020247038}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'c#j!xgKDhIlPQRZx', folderParents: -6778755968139265}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/subfolders', {id: 'lipKcleKEbtk]3s', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/subfolders', {id: 'Sf[@S', folderInfo: 'GpIYcxeR51EgWQ#'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'Gk6x%', folderInfo: 3382698064216066}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'O$ijvoQ7wQ(CW%v', folderInfo: 13952318701567}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '0[qz$IJ$v0KruIci', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/subfolders', {id: 'A]C[Mv6D!igep', folderSimilar: 'kj@n4%b%B63]l'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'bbL)C', folderSimilar: -3724671161729022}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: 'qDy$sYkXl@UaSH', folderSimilar: -8433479704379393}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/subfolders', {id: ')wll4#Q', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/subfolders', {id: 'Xh$)(BL(dikej8TX', folderArtworks: '6s[HyA'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/subfolders', {id: 'TU))D(h#ga7]E!OOS', folderArtworks: -7521675247615998}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/subfolders', {id: '*zkw2xdvr2I@', folderArtworks: -7799275358519297}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/subfolders', {id: 'z2^CF#wJgG', offset: '$fm2NH6oJ]THNcZ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '(x2pMUbH]y]c', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/subfolders', {id: 'jmsmXgOx&qMPS*1ix', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/subfolders', {id: 'QtvCY%drz', offset: 62.59}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/subfolders', {id: 'rxn)QYS0', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/subfolders', {id: 'foc5!qFtrb', amount: 'jFQ9exV3DdNeMoE5Ta'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/subfolders', {id: '2ATU0y(6', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/subfolders', {id: 'c511Xe$s*%wuE', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/subfolders', {id: 'V%Za(', amount: 80.91}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/subfolders', {id: '$0eOXkLKV]#x6ndYY', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/similar', {id: '9j2NGO2'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ''}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '*BhzRyBO', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'ey]wU8%ml', folderTag: '7NBBeCTM5]%3'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '9qGBUsE6W)[eb', folderTag: 1905128839839746}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'x%67Sio0&', folderTag: -1804546745565185}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '7JFC3b!sb8xlg6XzRDj', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'boZGwGIsK0qdyE', folderState: 'e(haGD!dU'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'M7nx0&^aLshF2', folderState: -2556870086623230}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '62kgmunb)CIyeM&fl', folderState: -2188231676264449}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'lzGG@bzClc', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'h2KhLW8(k49I', folderCounts: 'Jz#N3ug7W'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '$ZDX(]SNtSUF(SBco', folderCounts: -3270179211444222}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'PM1Fb', folderCounts: 4576766672764927}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'o8E@Ai1Gp)4%fw]Y', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'bf[JY]', folderParents: 'zaJ0^T7kenvZdZFNT'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'j$wG[Qm&EzZTiTsy', folderParents: -4346146356985854}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'be4RYeGWBfel', folderParents: 8208211261784063}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'xgzGhUhZw5)vkx', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'P7(DcU#lw3[!87e', folderInfo: 'wUsdtnaebH6Ij!oVqFh3'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'DFRbfXr', folderInfo: -3148081369448446}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'wLX3o4hyCTfy]Dev6CUH', folderInfo: 7226441473196031}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'zz!QrPx', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'nV48Lh', folderSimilar: '4C2[0'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '!$@SBijHat', folderSimilar: -492418117926910}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'Cgtdy44q56^3HhaV]BwO', folderSimilar: 6369273773555711}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ']05!7', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/artist/similar', {id: '%E3b)fx#HZMPy#', folderArtworks: 'zdh@JOij@K!vCpXu'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'LNd5#X2', folderArtworks: -115977526181886}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'j%7BLCXF', folderArtworks: -7330608304881665}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'uVb[4tc2zrQ', folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/artist/similar', {id: '#dsdkT2$@gPz', folderChildren: '485dH^'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '1lfUD9j2k!QsuTa56rU', folderChildren: -2967678205558782}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: '860B@CedBf(Ws7ZOQL', folderChildren: -6639568929423361}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'WzUHOem*g045Bq74', folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/artist/similar', {id: '[!yvTRt]^Ht)0sOv&T', folderSubfolders: 'NBONj$GM]YtT4N'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: '2L@yQfo&YwkSl2jyt', folderSubfolders: -4795145023127550}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'Dkyx[4]X', folderSubfolders: 1217740601819135}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'bgoy[Mj$f&', folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'jIftXs#xoe)3u4h2Uac', folderTracks: '2@q8tTs'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'X1rSChLF@pZoIFhyXd', folderTracks: -5165269903212542}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'iFLCY5%jLqEPXgHK', folderTracks: -1835743789973505}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '(Zf)fZC7uv1CWMjfk8Yh', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'fvn9jXAKI8EF5RMY', trackMedia: '#)roz'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'p9xV1G%Qq', trackMedia: -4602509985316862}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'kI(MS]vhx$QGUEm7G!7', trackMedia: 5530003886309375}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'T&@*mhr7AYi[9', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: '*b5N*NC', trackTag: 'i%^CaVk#FQR*@aTZGRs'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'g2YcE', trackTag: -468511692423166}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'Qn0f]s', trackTag: 5597951980208127}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: '#z^6k25Sp', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'Rg^aL$krWwRZYnGLu', trackRawTag: ']8eH(adz'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'rSRfk&Ec2mwPmGNO', trackRawTag: -4115177502932990}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'XivsX7WE8Cx^)a#K', trackRawTag: -7656445482893313}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'IEz[am07fRjy7xg', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar', {id: '4bVxHY4ZkH#%H', trackState: '@K)Y^f@oRZ[DP7wGMh'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar', {id: 'O5Hxyjh', trackState: 3912373979054082}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar', {id: 'W1L2n(MS', trackState: 6718951325171711}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'Ey6sZo&8', offset: 'I^^8z!B8*nd!v(0[z'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: 'Z]iWegeDPxLr7j', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: 'por[@qG', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar', {id: 'ayhvI1JTr9i', offset: 96.69}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar', {id: 's^2ZR9(x(r0*eKg7HZdm', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar', {id: 'QYH#0INE*7N03o3fk', amount: '77OOLZJ6(7XFLO['}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar', {id: ']rj06CEnzcYDins[i', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar', {id: '@7koKuexaN]8Bqu', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar', {id: '0h]A5ew!feewLYi%P(', amount: 35.23}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar', {id: '*$Vf&DF%r)GNn^p[CB', amount: 0}, 400);
				});
			});
		});
		describe('folder/artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artist/info', {id: 'ohjD*fqg'}, 401);
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
					await getNotLoggedIn('folder/album/info', {id: 'iwhg6eGj6bP*7C'}, 401);
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
					await get('folder/list', {list: 'highest', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('folder/list', {list: 'faved', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', rootIDs: [null, '']}, 400);
				});
				it('"parentID" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', parentID: ''}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', childOfID: ''}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', artist: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', genre: ''}, 400);
				});
				it('"level" set to "string"', async () => {
					await get('folder/list', {list: 'random', level: 'tvcY(E6N7yux4)0gFrtI'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/list', {list: 'frequent', level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/list', {list: 'random', level: 57.2}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'highest', level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/list', {list: 'faved', newerThan: 'ph&lD]xmrISRL100eV'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/list', {list: 'recent', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/list', {list: 'frequent', newerThan: 14.52}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'avghighest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', fromYear: '6EB09Z9A3&3p'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'highest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/list', {list: 'highest', fromYear: 75.44}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'frequent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', toYear: 'z1hC9c140n)oIf'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/list', {list: 'random', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/list', {list: 'faved', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/list', {list: 'random', toYear: 76.88}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'frequent', toYear: -1}, 400);
				});
				it('"type" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', type: ''}, 400);
				});
				it('"type" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'faved', type: 'invalid'}, 400);
				});
				it('"types" set to "null"', async () => {
					await get('folder/list', {list: 'recent', types: null}, 400);
				});
				it('"types" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', types: [null, '']}, 400);
				});
				it('"types" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'highest', types: [null, 'invalid']}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('folder/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('folder/list', {list: 'random', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('folder/list', {list: 'highest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('folder/list', {list: 'random', sortDescending: '7BzAF]djPd3P(a1&xaA'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'avghighest', sortDescending: 4389543423770626}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'avghighest', sortDescending: 2314741976399871}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderTag: 'NYH(8)k*LzOCquc'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'avghighest', folderTag: 1152742655524866}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'random', folderTag: 2372931329982463}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/list', {list: 'avghighest', folderState: '[kw]&c]$L5]81U5[iw'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'frequent', folderState: 6758467461185538}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'frequent', folderState: -2416188973907969}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/list', {list: 'highest', folderCounts: 'FpL(1Q'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'avghighest', folderCounts: -8760661836300286}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'highest', folderCounts: -6652626871517185}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/list', {list: 'faved', folderParents: 'vLlM[E'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'highest', folderParents: -7940967793426430}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'faved', folderParents: 6499905266778111}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/list', {list: 'faved', folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', folderInfo: '#jEv^'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'frequent', folderInfo: -5650370084732926}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'highest', folderInfo: 4226581102854143}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/list', {list: 'recent', folderSimilar: 'gWSdm6v'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'faved', folderSimilar: -7064180146307070}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'faved', folderSimilar: 6342670351859711}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/list', {list: 'avghighest', folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/list', {list: 'random', folderArtworks: 'N1143wxjRVJ*['}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/list', {list: 'frequent', folderArtworks: -864922212761598}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/list', {list: 'highest', folderArtworks: -570373905055745}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/list', {list: 'faved', offset: 'yOZcPBRX$'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/list', {list: 'frequent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/list', {list: 'faved', offset: 63.82}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/list', {list: 'frequent', amount: ']%Q)A[2v2*T**'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/list', {list: 'random', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/list', {list: 'random', amount: 46.74}, 400);
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
					await get('folder/search', {offset: 'pLV]7sp]@#7RBaQ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/search', {offset: 7.79}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/search', {amount: 'r%p1b9F#'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/search', {amount: 62.84}, 400);
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
					await get('folder/search', {level: 'NwpnNyQW'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/search', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/search', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/search', {level: 67.92}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/search', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/search', {newerThan: '#YE*M0g'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/search', {newerThan: 55.04}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/search', {fromYear: '[Fx0&jw0]0i'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/search', {fromYear: 68.07}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/search', {toYear: 'XFSMcm8m4bhW'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/search', {toYear: 38.55}, 400);
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
					await get('folder/search', {sortDescending: '9%!p8QH'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/search', {sortDescending: 7861487003500546}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/search', {sortDescending: -59149622706177}, 400);
				});
				it('"folderChildren" set to "empty string"', async () => {
					await get('folder/search', {folderChildren: ''}, 400);
				});
				it('"folderChildren" set to "string"', async () => {
					await get('folder/search', {folderChildren: 'nLGPXVbnO5TdEILzfz]'}, 400);
				});
				it('"folderChildren" set to "integer > 1"', async () => {
					await get('folder/search', {folderChildren: -4927111206797310}, 400);
				});
				it('"folderChildren" set to "integer < 0"', async () => {
					await get('folder/search', {folderChildren: 5000457743237119}, 400);
				});
				it('"folderSubfolders" set to "empty string"', async () => {
					await get('folder/search', {folderSubfolders: ''}, 400);
				});
				it('"folderSubfolders" set to "string"', async () => {
					await get('folder/search', {folderSubfolders: '1(%RyTcb*'}, 400);
				});
				it('"folderSubfolders" set to "integer > 1"', async () => {
					await get('folder/search', {folderSubfolders: -45036670550014}, 400);
				});
				it('"folderSubfolders" set to "integer < 0"', async () => {
					await get('folder/search', {folderSubfolders: -8053891526557697}, 400);
				});
				it('"folderTracks" set to "empty string"', async () => {
					await get('folder/search', {folderTracks: ''}, 400);
				});
				it('"folderTracks" set to "string"', async () => {
					await get('folder/search', {folderTracks: '@Qepa2Ti4NnaRxI&F'}, 400);
				});
				it('"folderTracks" set to "integer > 1"', async () => {
					await get('folder/search', {folderTracks: 6112288889110530}, 400);
				});
				it('"folderTracks" set to "integer < 0"', async () => {
					await get('folder/search', {folderTracks: -492385616265217}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/search', {trackMedia: 'MJuwL(VtpYBj]Sk]R'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/search', {trackMedia: 3292878776303618}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/search', {trackMedia: -1129062252675073}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/search', {trackTag: 'GFwdpclJ)VW4J])%j6)'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackTag: -3216318450892798}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackTag: -2441849008553985}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/search', {trackRawTag: 'a]US3PUhlY&]x7eYT'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/search', {trackRawTag: 7955700550467586}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/search', {trackRawTag: 6736667180269567}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/search', {trackState: 'w!h3[]zyB'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/search', {trackState: 1904540328656898}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/search', {trackState: -5448305895014401}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/search', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/search', {folderTag: 'mW1zl1^'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/search', {folderTag: 142501088329730}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/search', {folderTag: 891577568329727}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/search', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/search', {folderState: '!h79g9E%O2EqcG'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/search', {folderState: -8562852763795454}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/search', {folderState: 7384432600154111}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/search', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/search', {folderCounts: 'h5([pBY5O1mn87gL*7Al'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/search', {folderCounts: -1441927153057790}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/search', {folderCounts: 4788715490639871}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/search', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/search', {folderParents: 'Hy%voQwYUTyJ5kVJ'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/search', {folderParents: 1926859847630850}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/search', {folderParents: 5398819843866623}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/search', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/search', {folderInfo: 'mhZp0O%'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/search', {folderInfo: 1747516315926530}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/search', {folderInfo: 182533840961535}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/search', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/search', {folderSimilar: 'ZR37x$nVW#94ZBb0q$'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/search', {folderSimilar: -8188852158070782}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/search', {folderSimilar: 5145427384991743}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/search', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/search', {folderArtworks: 'D%2XOE]b8xyp$Kw'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/search', {folderArtworks: -6767302791921662}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/search', {folderArtworks: -1069723764654081}, 400);
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
					await get('folder/health', {level: '#3%OYam'}, 400);
				});
				it('"level" set to "empty string"', async () => {
					await get('folder/health', {level: ''}, 400);
				});
				it('"level" set to "boolean"', async () => {
					await get('folder/health', {level: true}, 400);
				});
				it('"level" set to "float"', async () => {
					await get('folder/health', {level: 94.37}, 400);
				});
				it('"level" set to "less than minimum 0"', async () => {
					await get('folder/health', {level: -1}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('folder/health', {newerThan: 'y2MsG'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('folder/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('folder/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('folder/health', {newerThan: 2.82}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('folder/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('folder/health', {fromYear: 'wmMfvTkc(WN[AYyAtO'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('folder/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('folder/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('folder/health', {fromYear: 61.48}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('folder/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('folder/health', {toYear: 'Y[)SA'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('folder/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('folder/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('folder/health', {toYear: 52.98}, 400);
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
					await get('folder/health', {sortDescending: ']J!44bG9uetYesB*y[1'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('folder/health', {sortDescending: -536791639654398}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('folder/health', {sortDescending: -3958031796666369}, 400);
				});
				it('"folderTag" set to "empty string"', async () => {
					await get('folder/health', {folderTag: ''}, 400);
				});
				it('"folderTag" set to "string"', async () => {
					await get('folder/health', {folderTag: '#jO3cy$Z4r'}, 400);
				});
				it('"folderTag" set to "integer > 1"', async () => {
					await get('folder/health', {folderTag: 2170169963053058}, 400);
				});
				it('"folderTag" set to "integer < 0"', async () => {
					await get('folder/health', {folderTag: 2188900634198015}, 400);
				});
				it('"folderState" set to "empty string"', async () => {
					await get('folder/health', {folderState: ''}, 400);
				});
				it('"folderState" set to "string"', async () => {
					await get('folder/health', {folderState: '%Yrv]KqOdN#YL#gY)XkD'}, 400);
				});
				it('"folderState" set to "integer > 1"', async () => {
					await get('folder/health', {folderState: 7533334791979010}, 400);
				});
				it('"folderState" set to "integer < 0"', async () => {
					await get('folder/health', {folderState: 5973191654637567}, 400);
				});
				it('"folderCounts" set to "empty string"', async () => {
					await get('folder/health', {folderCounts: ''}, 400);
				});
				it('"folderCounts" set to "string"', async () => {
					await get('folder/health', {folderCounts: '36tv8MxewDwGt29*N'}, 400);
				});
				it('"folderCounts" set to "integer > 1"', async () => {
					await get('folder/health', {folderCounts: 7102783975063554}, 400);
				});
				it('"folderCounts" set to "integer < 0"', async () => {
					await get('folder/health', {folderCounts: -7642171721121793}, 400);
				});
				it('"folderParents" set to "empty string"', async () => {
					await get('folder/health', {folderParents: ''}, 400);
				});
				it('"folderParents" set to "string"', async () => {
					await get('folder/health', {folderParents: 'lYWy^3]WS[@]'}, 400);
				});
				it('"folderParents" set to "integer > 1"', async () => {
					await get('folder/health', {folderParents: 8838071218864130}, 400);
				});
				it('"folderParents" set to "integer < 0"', async () => {
					await get('folder/health', {folderParents: 7283432077918207}, 400);
				});
				it('"folderInfo" set to "empty string"', async () => {
					await get('folder/health', {folderInfo: ''}, 400);
				});
				it('"folderInfo" set to "string"', async () => {
					await get('folder/health', {folderInfo: 'II5wzyzHYUzKO'}, 400);
				});
				it('"folderInfo" set to "integer > 1"', async () => {
					await get('folder/health', {folderInfo: -5899093154988030}, 400);
				});
				it('"folderInfo" set to "integer < 0"', async () => {
					await get('folder/health', {folderInfo: -154839904419841}, 400);
				});
				it('"folderSimilar" set to "empty string"', async () => {
					await get('folder/health', {folderSimilar: ''}, 400);
				});
				it('"folderSimilar" set to "string"', async () => {
					await get('folder/health', {folderSimilar: 'i8gj*(kg4o'}, 400);
				});
				it('"folderSimilar" set to "integer > 1"', async () => {
					await get('folder/health', {folderSimilar: -8817716999749630}, 400);
				});
				it('"folderSimilar" set to "integer < 0"', async () => {
					await get('folder/health', {folderSimilar: -8743413637709825}, 400);
				});
				it('"folderArtworks" set to "empty string"', async () => {
					await get('folder/health', {folderArtworks: ''}, 400);
				});
				it('"folderArtworks" set to "string"', async () => {
					await get('folder/health', {folderArtworks: '1pAlvxuSCwgG'}, 400);
				});
				it('"folderArtworks" set to "integer > 1"', async () => {
					await get('folder/health', {folderArtworks: 2480443383349250}, 400);
				});
				it('"folderArtworks" set to "integer < 0"', async () => {
					await get('folder/health', {folderArtworks: -8601917949214721}, 400);
				});
			});
		});
		describe('folder/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/state', {id: 'Q%IzM2Fig'}, 401);
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
					await getNotLoggedIn('folder/states', {ids: ['*&cJJmnP*7QbQ', '0wRxcFAazC']}, 401);
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
					await getNotLoggedIn('folder/artist/similar/tracks', {id: 'x5WZclS[ZOeDZO5cz'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'fTAVzknJhNWP', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'r5kU$JUObf', trackMedia: 'w@!2@XQx%8k['}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'frdGLYC)QgGS0hC', trackMedia: 3551473329766402}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'nrP*xTglMhj0zB(0', trackMedia: -7741001640706049}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'EjPyprQ&@@ppxT', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'X2!F8mhSeg1B', trackTag: 'KHkzO%$jYh)4n9B'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'r0m[[hDOo&s*Sm24K', trackTag: 2992176380248066}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'MQb6CF', trackTag: -5388394372792321}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '*zyI$2u141%TV', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: '63hHqo^Wo8ts#D(r', trackRawTag: 'k5#nBo]F'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'XWtTHDkvCf0gTO77DLZa', trackRawTag: -316129780170750}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: '@yHCUk%6', trackRawTag: -622821927550977}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: '(G4RmJgtJw!fV&ugrvx', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'JhuOMvjTA1VWCVe[p]W', trackState: 'sLlx$Y#EUV4'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'SCvyPS(g(&)gn', trackState: -2487821101170686}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('folder/artist/similar/tracks', {id: 'gOXQorwnK4kQawN', trackState: -2676050215567361}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'ZWteZMS30Z%ZiMq*', offset: 'VEx2uQ'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'nN^yN8V]RfH', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'O0W%7&Hey#Cou]A', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: '^ITVSm', offset: 95.41}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('folder/artist/similar/tracks', {id: '0SLGci4!ymi[l', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('folder/artist/similar/tracks', {id: '9QF4khzKVqAe$WG9)bR0', amount: 'jhxta8A45S^qmU'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('folder/artist/similar/tracks', {id: 'LDI95^aHz#KQ', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('folder/artist/similar/tracks', {id: 'G)cAMk@NyY', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('folder/artist/similar/tracks', {id: '@SfDw4', amount: 95.62}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('folder/artist/similar/tracks', {id: 'a95]J1x49yXt8Vi', amount: 0}, 400);
				});
			});
		});
		describe('folder/artworks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artworks', {id: '0V^V8lcAPrcH'}, 401);
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
					await getNotLoggedIn('track/id', {id: '5Y#NAs6[gD&nHS'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/id', {id: 'lzIijG5J0lb', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/id', {id: 'tzbxrr3#', trackMedia: 'cX*FGT8h*2BnAG'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/id', {id: 'fAz[H', trackMedia: 81187741630466}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/id', {id: '4gEKQZ6hG%TzXTmu(qvO', trackMedia: 6111283040485375}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/id', {id: 'dRW!v#pxygIZFX', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/id', {id: 'poQ@!%IGckw4!u(', trackTag: 'c)9o^C4'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/id', {id: '%3)^Iu', trackTag: 7766244518264834}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/id', {id: 'J4v(O%t]', trackTag: -6115041673740289}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/id', {id: '%0!8ZInyXWn', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/id', {id: '2kXhPD1IT2l', trackRawTag: 'pw#wWLApk5WKOXzvZ4'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/id', {id: 'sEpp)rvZ!%vJqCt', trackRawTag: 7905210756235266}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/id', {id: 'msrRycVv1gAYYW', trackRawTag: 2368132194762751}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/id', {id: 'gV@r@h', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/id', {id: 'junYbWYx6A(ZEG7%4Rp', trackState: 'H6VIuwo@8%LIwPLj3'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/id', {id: '#KzPh]FW#rbl9KM]jz4[', trackState: 7693777351213058}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/id', {id: '4MvFD#r[hwtu5e%K', trackState: -5801239325442049}, 400);
				});
			});
		});
		describe('track/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/ids', {ids: ['J4Z69m2[NjPBIWYhYja', 'MTw7Df)LR']}, 401);
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
					await get('track/ids', {ids: ['8XZcd6Nro0e', 'xE28S]R@kXG'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/ids', {ids: ['Bf1@8', 'qPPoq'], trackMedia: 'G4dxB5eJ'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['RPQI)aq', 'nabEl3*y0Q*HGkMQ3('], trackMedia: 1653775953559554}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/ids', {ids: [')JayYjpd$HANB#[', 'S7Q)jmWz]UB%AP4Wke^n'], trackMedia: 3314552783503359}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['!]XWA9)w#L', 'neafRB'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/ids', {ids: ['J*Nj3(ywS5G', 'l8HB&aba'], trackTag: 'fyTO5CmKVcgUrOu6'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['TFibqvsKY9M8UZ3[', 'EWQ^g]zeoR5Vjl'], trackTag: -6481849748553726}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['A@Rma$P', 'ILy9RLn6lnQgc2QP'], trackTag: 3869529918668799}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/ids', {ids: ['rLmxks', 'Q2]08E'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/ids', {ids: ['qs[jRUX&', 'Zs)ZlHAiM#f5Zd'], trackRawTag: 'q6vKq0BQ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['7U^7X^)ZAbb)', 'ByD1LabkeHeIkm6Q'], trackRawTag: 786846212685826}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['Ahpbs[Fo2H@Ns1Atjy', 'cqobijRQKLQ&u)K*xd'], trackRawTag: -7668801483046913}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/ids', {ids: ['Bb9Cnm&G7jWxr[', 'PCCldvD'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/ids', {ids: ['AVPewR(Y)IVf1I*fR!', 'EXxVsG0t^bwOKUC'], trackState: '7cQbfNDS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/ids', {ids: ['Hj%D9', 'igPWNWNtZS8O5l5KZ1'], trackState: -4950497773486078}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/ids', {ids: ['J5qm1S', 'vok9WrsiYU2'], trackState: -8520089498288129}, 400);
				});
			});
		});
		describe('track/rawTag', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/rawTag', {id: ')vJj#yvkrOLu1F'}, 401);
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
					await getNotLoggedIn('track/rawTags', {ids: ['WM2Jy7AyNErcpbMmJ*', 'SUh^$pTBE)0i']}, 401);
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
					await get('track/search', {offset: 'Fsvw6iK^4E!dOTOq1lm'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/search', {offset: 12.09}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/search', {amount: '6b7zOn'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/search', {amount: 39.71}, 400);
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
					await get('track/search', {newerThan: 'KSt]k]CLAr]g'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/search', {newerThan: 43.27}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/search', {fromYear: 'WAh8ljqatyc9D!5&Q!r'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/search', {fromYear: 4.47}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/search', {toYear: 'HGKl1rvU&$&i4'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/search', {toYear: 32.55}, 400);
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
					await get('track/search', {sortDescending: 'J2*%39jB)%DP7mpe'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/search', {sortDescending: -3232217505464318}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/search', {sortDescending: -5495396004528129}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/search', {trackMedia: 'fvJ&Ga8ln%wtH'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/search', {trackMedia: 1330840743182338}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/search', {trackMedia: 4646593114406911}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/search', {trackTag: 'R[@DeDB27&EQ3Vuy%zM6'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/search', {trackTag: 1181904514580482}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/search', {trackTag: 3593833904340991}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/search', {trackRawTag: 'wnMJ41$'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/search', {trackRawTag: -7445964654641150}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/search', {trackRawTag: 5112008861024255}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/search', {trackState: '2KMamSs'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/search', {trackState: 5234616210292738}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/search', {trackState: -3781693265674241}, 400);
				});
			});
		});
		describe('track/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/state', {id: 'HkJtV'}, 401);
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
					await getNotLoggedIn('track/states', {ids: ['q8%]H!AMmi5Bh())', ')PekIj1Ba6dJM[5']}, 401);
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
					await get('track/list', {list: 'recent', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', artistID: ''}, 400);
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
					await get('track/list', {list: 'recent', parentIDs: [null, '']}, 400);
				});
				it('"childOfID" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', childOfID: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('track/list', {list: 'avghighest', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', rootIDs: [null, '']}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', title: ''}, 400);
				});
				it('"album" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', album: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('track/list', {list: 'recent', genre: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('track/list', {list: 'recent', newerThan: 'nhsHWfwjSJ1@]e1aZrO'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/list', {list: 'random', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/list', {list: 'highest', newerThan: 24.09}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'random', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/list', {list: 'frequent', fromYear: 'ijSI&V9m%O3nplrM18m9'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/list', {list: 'random', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', fromYear: 37.04}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'frequent', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/list', {list: 'avghighest', toYear: '[55J5(L'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/list', {list: 'recent', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/list', {list: 'avghighest', toYear: 58.27}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'recent', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('track/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', id: ''}, 400);
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
					await get('track/list', {list: 'highest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('track/list', {list: 'highest', sortDescending: '8nz!Ge!eRl4S3Kq9QH'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/list', {list: 'frequent', sortDescending: -4265564365127678}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/list', {list: 'avghighest', sortDescending: -1501707624251393}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/list', {list: 'random', trackMedia: '4)0i26qM)hpe)p'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/list', {list: 'random', trackMedia: 5406451975585794}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/list', {list: 'random', trackMedia: 6739283670990847}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/list', {list: 'random', trackTag: 'DOG0YJm$5h('}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'faved', trackTag: -574435559997438}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'random', trackTag: -4013079847239681}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/list', {list: 'avghighest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/list', {list: 'random', trackRawTag: 'bFPY1'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/list', {list: 'faved', trackRawTag: -7324467801882622}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/list', {list: 'faved', trackRawTag: 8495854935605247}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/list', {list: 'highest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/list', {list: 'faved', trackState: 'OB4]2$WAJd(B'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/list', {list: 'faved', trackState: 4307223371055106}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/list', {list: 'faved', trackState: -5546440675819521}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/list', {list: 'highest', offset: 'rZXfsVv'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/list', {list: 'random', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/list', {list: 'frequent', offset: 52.76}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/list', {list: 'recent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/list', {list: 'faved', amount: 'OIN0@mEyUaW(TFyZ497'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/list', {list: 'random', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/list', {list: 'random', amount: 41.11}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/list', {list: 'faved', amount: 0}, 400);
				});
			});
		});
		describe('track/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/similar', {id: 'ITjtxY^fT6YCjfa9w!'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/similar', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/similar', {id: 's%W1GK', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/similar', {id: '@ve^2Sc^EMMVn9eGgr', trackMedia: 'D]o$RE6f*PH$AN'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/similar', {id: '!Y&67*4cMjF', trackMedia: 7594663854735362}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/similar', {id: ')ruo#wLD4', trackMedia: -7051293243736065}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/similar', {id: '0b21ewocv%czimfJ', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/similar', {id: 'y]o1QGFyG4EcyHAj8&sh', trackTag: 'DeZD89#3HwPV9iKCsI'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: '3GgR9j6YDRb[o6', trackTag: -1484764016017406}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: 'mf^dhFP1s)d0Sr3A', trackTag: -7743295195185153}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/similar', {id: 'S4Y]wd', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/similar', {id: '*lvE67K)(', trackRawTag: '(vuvU@^j12'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/similar', {id: '7HeUQeRNuU]tBjz]NO', trackRawTag: 4100988893921282}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/similar', {id: '3nDokFpn0HU(HBiY', trackRawTag: -8399704312250369}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/similar', {id: ')7YG8]k)Je6PeFxif8Kq', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/similar', {id: 'poIN]GP', trackState: '&2T*HWdsIh8Qi&K'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/similar', {id: 'AZ14#1M9yxb^Y', trackState: -8108952927600638}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/similar', {id: '7]lG3SCIx6!G^np47ZA', trackState: -561526784131073}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('track/similar', {id: 'lXY#zHNq', offset: '5^$B7&KvkBoPaMU*a'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('track/similar', {id: 'n8h![YOzrGVt', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('track/similar', {id: 'ojnf()', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('track/similar', {id: 'Z)U8JwHjhAG', offset: 29.02}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('track/similar', {id: 'U96$gTnJJ*wa21n@^!T', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('track/similar', {id: 'VIDxu3xqwZRU#', amount: 'skpQyFGn(BP0rs82)%'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('track/similar', {id: 'vdHBpjF', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('track/similar', {id: 'RuhtOL16Q9yJ@Jul@g', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('track/similar', {id: 'LEzv2pw^c[YWrrsV@', amount: 6.07}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('track/similar', {id: '&tDr4M95epiMtq6Ii%', amount: 0}, 400);
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
					await get('track/health', {media: '][h1ivk'}, 400);
				});
				it('"media" set to "integer > 1"', async () => {
					await get('track/health', {media: -1833265698701310}, 400);
				});
				it('"media" set to "integer < 0"', async () => {
					await get('track/health', {media: -5323023531900929}, 400);
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
					await get('track/health', {newerThan: '@C8q*HGrHbyt'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('track/health', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('track/health', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('track/health', {newerThan: 95.44}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('track/health', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('track/health', {fromYear: 'UaKf5%t'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('track/health', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('track/health', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('track/health', {fromYear: 76.66}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('track/health', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('track/health', {toYear: 'l#0Y8vBgi39'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('track/health', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('track/health', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('track/health', {toYear: 21.57}, 400);
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
					await get('track/health', {sortDescending: '49msA4We0'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('track/health', {sortDescending: 4348299398086658}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('track/health', {sortDescending: -4955865194954753}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('track/health', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('track/health', {trackMedia: '[!RAF]AP^Zp@zA'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('track/health', {trackMedia: -6277565312401406}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('track/health', {trackMedia: -212058503118849}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('track/health', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('track/health', {trackTag: 't9!N]$lXv7owTzITH7v&'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('track/health', {trackTag: -60684813467646}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('track/health', {trackTag: -3751244912918529}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('track/health', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('track/health', {trackRawTag: 'lH#R3)1'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('track/health', {trackRawTag: 4998494041407490}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('track/health', {trackRawTag: 2534922996678655}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('track/health', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('track/health', {trackState: 'a%Ewk4'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('track/health', {trackState: -7754665672310782}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('track/health', {trackState: -8896840346894337}, 400);
				});
			});
		});
		describe('track/lyrics', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/lyrics', {id: 'ALsNG94C$jSE@fPO8gzu'}, 401);
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
					await getNotLoggedIn('episode/id', {id: '[!C*d'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/id', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/id', {id: 'vdcxBb18', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/id', {id: 'm%n0wCp', trackMedia: 'wk[PUlu4FjpZ2F'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'bVHf4dvV#1f%9[6&', trackMedia: -3594675592101886}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'WkJ^VbH3', trackMedia: 5475823830171647}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/id', {id: ']yxt*1&(9hXRuAl0mia#', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/id', {id: '(E!QBLNKg99qxd2OaXO', trackTag: '@2)YpdJLKC!(N'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'c0sBy8TdtmCup', trackTag: 1606209434025986}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'y91u%&^Qt9QU', trackTag: -5713155019767809}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/id', {id: 'GKs8nmw', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/id', {id: 'DDLp3', trackRawTag: '!ufs[iGLGn'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'xuXrFQrDJ^OK7R$u%', trackRawTag: 5931774693605378}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'zTrcB[LhIfyHWCkY', trackRawTag: -4752200525938689}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/id', {id: '[gDmhNb$Iwu)FV2g&', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/id', {id: 'dC0s)N7I&S%', trackState: 'TXfSDL9k'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/id', {id: 'P8SDO#!', trackState: -1723623597408254}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/id', {id: 'PQifvPod', trackState: -5768070781992961}, 400);
				});
			});
		});
		describe('episode/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/ids', {ids: ['Twtk2!)pRUs&NUwji', 'J98fT']}, 401);
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
					await get('episode/ids', {ids: ['qCUZDiq#GKlvR!Ua', 'Dx7&*A1&^FoYJL1*B8'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/ids', {ids: ['gQ1wq3NVXy!r[9V8', 'q(Tn#JpNnl8D2ml)R'], trackMedia: 'ubGIgvD#'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['KFp2DVz0vm2h]uMXc8', 'J[$@dt[uhY$bWE6f]$7'], trackMedia: -1247857977851902}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['CUtl&#h6pkT', '[3SZ19ES*Sz10Wno3'], trackMedia: 3024197747998719}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['QOW#ueolS%1O', 'Vc8tRld3t0%kYt]jL'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['HOIr%aiWthAdJczscSTl', 'bXOir8HUzrI&]72eq'], trackTag: '(2@9E752e3y@HQn9]t'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['jwEe@[aT4h', '8ZN]1DT]'], trackTag: -1640410208272382}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['h0VX[X*(', ')*5aSnsZ4@FXtX'], trackTag: -1764719299919873}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['cwPa0f1bJ$VJ]F', '47hdIeQV'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/ids', {ids: ['zgxegj', 'vwK7BUDt2%'], trackRawTag: 'bBO7vzx'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['wS96[U#!^fZjuOLiQ[', 'c!9@z*s^H'], trackRawTag: -3924522054975486}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['LgCWQp*2(R8mQ]SOG8m', 'P&Mh7cD'], trackRawTag: -1841484504498177}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/ids', {ids: ['j&H)^o', 'TQiLxBofZuAr'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/ids', {ids: ['QX!mAprPj#OXbIg', 'M)s1Hkg*nnd5('], trackState: 'bmNqYEgHE@Shr'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/ids', {ids: ['&BblX5M', 'i[PqPtqIxL'], trackState: -1657712978952190}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/ids', {ids: ['&G5dz', 'a1wHsS#)f!MoyczAkv'], trackState: -3456848220913665}, 400);
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
					await get('episode/search', {offset: 'XGIw#v'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/search', {offset: 66.02}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/search', {amount: 'SFWG!TE9tO)jQkHA'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/search', {amount: 26.77}, 400);
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
					await get('episode/search', {sortDescending: 'CI)R7E5D)3aL'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/search', {sortDescending: 3771229009870850}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/search', {sortDescending: 8728748606095359}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/search', {trackMedia: ')0at0xbE$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/search', {trackMedia: 3342676065779714}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/search', {trackMedia: -7185674784473089}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/search', {trackTag: 'IwJtM7i5'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackTag: -5400264664154110}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackTag: -8869413121949697}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/search', {trackRawTag: '$I51ku*V'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/search', {trackRawTag: -6358255492136958}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/search', {trackRawTag: -4026101512798209}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/search', {trackState: '#h]Pk'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/search', {trackState: -7185510774603774}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/search', {trackState: -2482820597415937}, 400);
				});
			});
		});
		describe('episode/retrieve', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/retrieve', {id: 'QCNEO0kU'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/retrieve', {id: 'QCNEO0kU'}, 401);
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
					await getNotLoggedIn('episode/state', {id: '!pQcurfH3gov'}, 401);
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
					await getNotLoggedIn('episode/states', {ids: ['GeUZc3M', '6Vk@25i']}, 401);
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
					await getNotLoggedIn('episode/status', {id: 'HhGHMk3du*&ooW'}, 401);
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
					await get('episode/list', {list: 'frequent', name: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('episode/list', {list: 'faved', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('episode/list', {list: 'highest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('episode/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('episode/list', {list: 'frequent', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('episode/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('episode/list', {list: 'avghighest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', sortDescending: '$3sEXdk$R'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'recent', sortDescending: 4233238918725634}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'faved', sortDescending: -4433662204444673}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('episode/list', {list: 'random', trackMedia: 'pzuh^Yix8IT9opveX'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'frequent', trackMedia: -3782537725870078}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'random', trackMedia: -7263397158584321}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('episode/list', {list: 'highest', trackTag: 'HdGsD2!Q8H'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'highest', trackTag: 5491000847892482}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'faved', trackTag: 1309213183705087}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('episode/list', {list: 'frequent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('episode/list', {list: 'highest', trackRawTag: '#ljw2XgHjFC)8]fu28XG'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'avghighest', trackRawTag: -5761715690012670}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'faved', trackRawTag: -8366391203725313}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('episode/list', {list: 'random', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('episode/list', {list: 'recent', trackState: 'C[v)jdmpfYsD*8'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('episode/list', {list: 'frequent', trackState: 2910283408343042}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('episode/list', {list: 'recent', trackState: -808554382491649}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('episode/list', {list: 'avghighest', offset: '!RL3DzLNlz]2LScW@s'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('episode/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('episode/list', {list: 'random', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('episode/list', {list: 'highest', offset: 31.67}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('episode/list', {list: 'faved', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('episode/list', {list: 'frequent', amount: 'EdJPE841B6^WHZEMy$U'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('episode/list', {list: 'highest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('episode/list', {list: 'highest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('episode/list', {list: 'faved', amount: 26.69}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('episode/list', {list: 'avghighest', amount: 0}, 400);
				});
			});
		});
		describe('podcast/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/id', {id: 'brw15l(qUGYz@o'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/id', {id: ''}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/id', {id: 'QacN7V%YGLk9#5*wmP2S', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/id', {id: 'YTZ^26[K)xXBds', podcastState: 'Ng2XAET0xF$9L^XprP1o'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'Fi)sclI', podcastState: -2806674989514750}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'YZmYB]Cp4w)#%@2V', podcastState: 6171370593452031}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/id', {id: '[qmlb', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/id', {id: '3f0c^E$t6(CFYiF9g6E[', podcastEpisodes: 'R[*DnOMlxNd5AIJTlE)!'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/id', {id: ']s%sL8', podcastEpisodes: -7360292807770110}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/id', {id: '1%2TTSpd!', podcastEpisodes: -6038982878035969}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/id', {id: 'tx]WR', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/id', {id: 'wLZSIn@LhX%ZK6f7I', trackMedia: '#rI]]8u7urq'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'zmnrIQb6&QWBvA&e)oG', trackMedia: 923710252908546}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'Bm1NPZX', trackMedia: -2737341219209217}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/id', {id: 'AbL6dSpHEbR', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/id', {id: '^*8c)mQ(c6MGmx&4sNr3', trackTag: 'f$E5AgAk9NKP5KK'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'VRJm9hKQs%w', trackTag: -8702222250541054}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'OOgT@Z7$m^z', trackTag: -6248052251688961}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/id', {id: 'Pf374PI', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/id', {id: 'AiBlKY$os4)%IjPj4[k', trackRawTag: 'S@Yr3$n1znD312u'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'wMpEOL*arM3$', trackRawTag: 3600911658123266}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'O%U2@rzMfqODy]^#jY', trackRawTag: 4975463059423231}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/id', {id: ']&%@]AuiL*2fLI', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/id', {id: 'hjnDR&hr', trackState: '$fL2[1%974iaHV6vXp'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/id', {id: 'eJg#*SI]nAtiPLqx[D(', trackState: -8135208540831742}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/id', {id: 'kDUFxwgagM^ReAJ1q^', trackState: 8635988049919999}, 400);
				});
			});
		});
		describe('podcast/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/ids', {ids: ['l$LLd1Z6N', 'KRgDZX']}, 401);
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
					await get('podcast/ids', {ids: ['ALkH(b', 'mAf8XS1[pe@EmhI'], podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['VE^ow@', '$ZRKYgjT3ybhAh%gVJS3'], podcastState: 'h5o!l^c4M7IA'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['RWt4#(a1%X', 'Bt^DOQFr!il'], podcastState: -3292818780979198}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['4k$05', 'UyBrw)stE5Q$I%'], podcastState: 8605370494746623}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['nUoDz&&JLL', '*6P[^%u)6R'], podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/ids', {ids: ['Y5^L8!bCBEq%OfDbyG', 'mPTFO'], podcastEpisodes: 'yQQDOXlR*DGa1m'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['zOO2Y84gNkvtOISLoZ$', 'nzbJ!4*Whed'], podcastEpisodes: -2012423301103614}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['KHvN4BVYLJ^0#QT', '4NQHNfh#K30CoKv'], podcastEpisodes: 7453854622810111}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['u@LFjlEhS', '3BU#N#!rwPg$'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/ids', {ids: ['2KRBTa^Ltb73MPRtb2qB', 'Iu9[dMN['], trackMedia: 'Phr%$gnN]SuWWW*6G'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['hpiSAfKS%422', '1ENVmpKx[l0X2&U6vSZ'], trackMedia: 6438223140093954}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['sbYq7rm@NPjyc&yB', 'J)V[mcT]'], trackMedia: -4148440179146753}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['qI!^e1][CiKH#*]4(Rca', '51gNNekzgNb)DR2['], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['uQL044ADuN%Cj', 'T7U5wNOZ$g1y0]$#8UI'], trackTag: '!g4SEh($Z[yaqdN5xE3&'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['iBQ3byOPxk', 'aHMh$KN2C0C*q'], trackTag: -923234476228606}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['pi1q*Sjw4if', 'H8KtSovt'], trackTag: 214766521942015}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['o@MA[Zc', '8ruDvBnkLLAITK2qL'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/ids', {ids: ['[vS60%P3(E8x', 'gblPk^9@7djG!1o'], trackRawTag: '!Bi!upr5T*&7tjeWj]'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['1z7%YU@lkY&zDM1[', 'CVNNY^jS02eQ5tls'], trackRawTag: 7029940654440450}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['O122^iC', '(X9bBzLwWo5dn%3H'], trackRawTag: 4830864768761855}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/ids', {ids: ['*tzE)Hz', 'DTon(Wgm*pigALjG#'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/ids', {ids: ['GTdU7n%vrAe!8egrROoU', 'Jj11j0%@&'], trackState: 'i9D!g1s'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/ids', {ids: ['C3mxB', 'BQH$M8['], trackState: 1665824490258434}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/ids', {ids: ['mng0Tw8rdV]DymrEe!$E', '(mNEpMP$Ch2Wy32KgQ'], trackState: 502230180429823}, 400);
				});
			});
		});
		describe('podcast/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/status', {id: 'n[W[(I3'}, 401);
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
					await get('podcast/search', {offset: '8pT7kRBgtEX[oz9TkY'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/search', {offset: 82.35}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/search', {amount: 'GTB9]ka6Gl'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/search', {amount: 44.47}, 400);
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
					await get('podcast/search', {sortDescending: 'rN94t9djC!W@XkIIDvVQ'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/search', {sortDescending: -7707152957308926}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/search', {sortDescending: -5345851073363969}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/search', {podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/search', {podcastState: 'jM4#k9'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastState: -6140446304632830}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastState: 4459893352300543}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/search', {podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/search', {podcastEpisodes: 'sYDEy@T&S(QaaP6$B'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/search', {podcastEpisodes: 1612731362836482}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/search', {podcastEpisodes: -8059259312930817}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/search', {trackMedia: 'iP*%jh$d21L'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/search', {trackMedia: 2347551097356290}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/search', {trackMedia: 2461389620772863}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/search', {trackTag: 'VKeBy*c*QGN3kAhBIu'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackTag: 353521241161730}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackTag: -4750701624295425}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/search', {trackRawTag: 'A42*Tyf3'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/search', {trackRawTag: 800331994759170}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/search', {trackRawTag: -8891168679002113}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/search', {trackState: '5O1b!V1#E'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/search', {trackState: -541691136180222}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/search', {trackState: 4317987033055231}, 400);
				});
			});
		});
		describe('podcast/episodes', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/episodes', {id: 'NK]twQvXh]Q'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/episodes', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'C29xT6ugNRQY6Ers', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/episodes', {id: '0Tx*lUUqL', trackMedia: '9zgp^Hq]aaLgb'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'D[h@@i12dsbz)cuNn', trackMedia: 6525621748367362}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: '81$%B1rAwLPU[', trackMedia: 8353827702964223}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'crsDbPOqyLWYtGmKQ', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/episodes', {id: '9t!5FMQ', trackTag: 'u$O*$'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'L3i7w', trackTag: 3861191252246530}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'AtO0kAf2gwWwq6g*h)', trackTag: 4577036383289343}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'fw05#L#6oCPQO#ocL', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/episodes', {id: 'z670QK84H6qNTaKt)cv', trackRawTag: 'mup*5y'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: '1%QZor$8ZJ9lEA4Y', trackRawTag: -327099915173886}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'JMnOWkvf724u^HkZezM', trackRawTag: -3551611771158529}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'K0ozH4zBP', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/episodes', {id: 'ZhX@$Y%*[Bm3w(K6%T3W', trackState: 'cW$b^7W&3)ZaX8'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/episodes', {id: 'k&OLOfk1$KZ%Me2', trackState: 640482006794242}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/episodes', {id: 'Pu5VUCq]smsmf*bh5v', trackState: -7864705871773697}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/episodes', {id: 'c*zSyXCZ*LXu#sR90IX3', offset: 'xnyk@1'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/episodes', {id: 'rRr&I4', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'JVz3)a', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/episodes', {id: 'YD2tRX#', offset: 73.61}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/episodes', {id: '8d(9VXrb', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/episodes', {id: 'YJj4bL', amount: 'ipj)o2oO6rhN0ZSCk'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/episodes', {id: '[FKAkph$i]H%XgRmyo', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/episodes', {id: 'v5K1SiRj%wSPtA9(r]A', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/episodes', {id: 'FTv7h7JS[nPagG', amount: 11.49}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/episodes', {id: ')v3msQ@MeO7H68', amount: 0}, 400);
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
					await getNotLoggedIn('podcast/refresh', {id: 'NgjpUSe&&^xZ^FIP8Fj'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/refresh', {id: 'NgjpUSe&&^xZ^FIP8Fj'}, 401);
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
					await getNotLoggedIn('podcast/state', {id: 'DVb0)w'}, 401);
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
					await getNotLoggedIn('podcast/states', {ids: ['p^s4u0QsGYH', 'TNpwpEcexeL^Psk!E4yy']}, 401);
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
					await get('podcast/list', {list: 'faved', url: ''}, 400);
				});
				it('"title" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', title: ''}, 400);
				});
				it('"status" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', status: ''}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('podcast/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('podcast/list', {list: 'highest', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('podcast/list', {list: 'highest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('podcast/list', {list: 'highest', sortDescending: '!TJR!zrbsZ$CyqY5Hlf'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', sortDescending: 7273471876792322}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'random', sortDescending: -3146964766031873}, 400);
				});
				it('"podcastState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'random', podcastState: ''}, 400);
				});
				it('"podcastState" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', podcastState: 'JCR%ay'}, 400);
				});
				it('"podcastState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'random', podcastState: -1463636073644030}, 400);
				});
				it('"podcastState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', podcastState: -314091365203969}, 400);
				});
				it('"podcastEpisodes" set to "empty string"', async () => {
					await get('podcast/list', {list: 'avghighest', podcastEpisodes: ''}, 400);
				});
				it('"podcastEpisodes" set to "string"', async () => {
					await get('podcast/list', {list: 'random', podcastEpisodes: 'jd%IHQ6a)'}, 400);
				});
				it('"podcastEpisodes" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'highest', podcastEpisodes: -8747378400034814}, 400);
				});
				it('"podcastEpisodes" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'frequent', podcastEpisodes: -3820795751038977}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('podcast/list', {list: 'highest', trackMedia: 'dsTlh8HHuJ6'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'random', trackMedia: -5807615359582206}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'faved', trackMedia: -6780333995327489}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('podcast/list', {list: 'random', trackTag: 'TXCM*!VU)2#Ac'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'frequent', trackTag: -2212558995980286}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'faved', trackTag: -7576657762189313}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('podcast/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', trackRawTag: 'pxgZZj0#V)XQ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'random', trackRawTag: 6389641787736066}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'highest', trackRawTag: 7965873407000575}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('podcast/list', {list: 'frequent', trackState: '%f[np1#J'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('podcast/list', {list: 'recent', trackState: -7254681717833726}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('podcast/list', {list: 'faved', trackState: 8537353106751487}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('podcast/list', {list: 'faved', offset: 'gwITa^'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('podcast/list', {list: 'frequent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('podcast/list', {list: 'avghighest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('podcast/list', {list: 'random', offset: 30.46}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('podcast/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('podcast/list', {list: 'recent', amount: '8wBYi]'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('podcast/list', {list: 'faved', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('podcast/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('podcast/list', {list: 'avghighest', amount: 15.02}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('podcast/list', {list: 'random', amount: 0}, 400);
				});
			});
		});
		describe('radio/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/id', {id: 'uA2ssZrYRQR', radioState: true}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('radio/id', {id: '', radioState: true}, 400);
				});
				it('"radioState" set to "empty string"', async () => {
					await get('radio/id', {id: 'C%Vn6jMs', radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/id', {id: 'tnEk4%NBmp4@S*vOHhsO', radioState: 'SfQLQ&0fR9ltePMb'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/id', {id: '0ZKg[5sWoAmY7Hu', radioState: 3479340935282690}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/id', {id: 'i8x0%4d[onf&$a', radioState: -8774699785912321}, 400);
				});
			});
		});
		describe('radio/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/ids', {ids: ['U4tdXEXCBk^rcRfTbbG)', 'KYH)av]j@[F2I@'], radioState: false}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"ids" set to "null"', async () => {
					await get('radio/ids', {ids: null, radioState: false}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('radio/ids', {ids: [null, ''], radioState: false}, 400);
				});
				it('"radioState" set to "empty string"', async () => {
					await get('radio/ids', {ids: ['yl)H3NLoRo^7to73DtA', 'X#9PlNYbjWoVc^'], radioState: ''}, 400);
				});
				it('"radioState" set to "string"', async () => {
					await get('radio/ids', {ids: ['Hyi!^', 'k(dbp7c$@X$9s'], radioState: 'lhQCfM'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/ids', {ids: ['ZrOon', 'U##IX5lDvUZ]c^0!tA['], radioState: 8761491725484034}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/ids', {ids: ['nT@oJK@ae3DV$yU4', '3S!LH)s'], radioState: 2810257130651647}, 400);
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
					await get('radio/search', {radioState: '7DQegyeg'}, 400);
				});
				it('"radioState" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: -4775042915237886}, 400);
				});
				it('"radioState" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: -7448929482309633}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('radio/search', {radioState: false, offset: 'z]aywwrz%w'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('radio/search', {radioState: false, offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('radio/search', {radioState: true, offset: 12.89}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('radio/search', {radioState: false, offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('radio/search', {radioState: false, amount: 'C[ZUoZ4'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('radio/search', {radioState: false, amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('radio/search', {radioState: true, amount: 72.89}, 400);
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
					await get('radio/search', {radioState: true, sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('radio/search', {radioState: true, ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('radio/search', {radioState: true, ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('radio/search', {radioState: false, sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('radio/search', {radioState: false, sortDescending: 'N8n&^[erIVzWDmpIm'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('radio/search', {radioState: false, sortDescending: -249011722256382}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('radio/search', {radioState: false, sortDescending: 1431888895934463}, 400);
				});
			});
		});
		describe('radio/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('radio/state', {id: 'L]QQo^(k@oVG'}, 401);
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
					await getNotLoggedIn('radio/states', {ids: ['dh0DqfPH*NNoDU5nEl', 'KuI7tP1)SZ1[th']}, 401);
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
					await getNotLoggedIn('artist/id', {id: ')FSEf7B%QaVE$'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/id', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/id', {id: 'LsyGsky3q2]', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/id', {id: 'cZofOP6yHZm44p9rS4', artistAlbums: 'W^v)ZwPXn%)$UbllJa['}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'vc2[avNyDNs98*e7', artistAlbums: -7990306725167102}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/id', {id: '5MDv!pMjhx$', artistAlbums: 1842099813089279}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'H009m2bvNZYTOlju^cGo', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/id', {id: 'Y!3^jIIj', artistAlbumIDs: 'p%zZjB81]q)^NQ5rl'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: '^CDQ7UVZkvPGi$%tV$#&', artistAlbumIDs: -8881423171715070}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: '9OTaXb(7hcGtJ3a#', artistAlbumIDs: -5827353372524545}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/id', {id: '(IhLi61I(HM!ng7V', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/id', {id: '[X)iOzQqM', artistState: 'T06@6aS87)5w7y)CVTQO'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'rpi]0L', artistState: 2090160564994050}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'zwUJw*&c!30', artistState: -1066364391391233}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'p3)wE(xGV4Y)4xJ', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/id', {id: 'G7xSU$0zf#r5*pTR', artistTracks: '1SKivZpYh'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: '#Lyp[agWEt]&lM', artistTracks: -7990423326818302}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'HLm2]tKwaSx@^o', artistTracks: -387807868616705}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'rKMG#rev', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'wwk1tp97&', artistTrackIDs: 'ay[htIxCU578f#'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'o$Xds&UKH1(96M6!E', artistTrackIDs: 916244219822082}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'mSTNYOP6gN', artistTrackIDs: -3085578128064513}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/id', {id: '!$P]yG', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/id', {id: 'L]V!5(ber!jN', artistSeries: '@WN2FR$]GZ!6'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'y@SBidDJvYRAZ', artistSeries: 4034367038947330}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'NFq@]ZrS5VMfAK@9', artistSeries: 5550374136053759}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'GELelpaqDn5^IgnUQb', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/id', {id: 'fx)vE(o!E9hal^l5V5Tf', artistSeriesIDs: ')NF]F$jFwd3m'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: '*lAc1', artistSeriesIDs: -4287709715628030}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'r!l(7]fd$i2^&9', artistSeriesIDs: 3575569648189439}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/id', {id: 'c^HKwQ1]LzUCv5Eye4q', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/id', {id: '@wDX[C60EgL', artistInfo: '6R*CApgBm'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'SxI2pi$ad]pQXdFY%!', artistInfo: 5111315534184450}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: '!1$qrwMNFQUDTRwP@', artistInfo: -3347359098470401}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/id', {id: 'K64jxJfa', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/id', {id: '36svw^pnNk', artistSimilar: ')LHK7U'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/id', {id: '5#qpv', artistSimilar: -1928070298599422}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'RIsYW[zE[Jbkc]o6', artistSimilar: -5588706392014849}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/id', {id: 'h)4lXYh', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/id', {id: 'ipCDKlLrY%)L', albumTracks: 'QgeFA(8K8g]f0&YxD$o'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'pkm1(', albumTracks: -3903924570423294}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'b]JkfXq6QuwBT', albumTracks: -414733215727617}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/id', {id: 'YSMi5vy7*(N4y', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/id', {id: 'Y8V(R5hDAog@', albumTrackIDs: '#Vp[5'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'vTn!RWF', albumTrackIDs: 8899667584614402}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'aISGFUU', albumTrackIDs: -4775964265414657}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/id', {id: 'xvOHw2ebkM', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/id', {id: 'Ch)G#xDp3vX!D7sstUb', albumState: ')%97xp6Us7F'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'AI)nd3psiu5n^mHYWG@', albumState: -8904701839933438}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/id', {id: '$R3LuNpRSTsdnKngGEX', albumState: 4088218098073599}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/id', {id: 'd6MHHNzK0HHb%', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/id', {id: 'w20w6', albumInfo: 'wR6yuvcE9eg$1'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'I8os]^7S7shm4)htVM@R', albumInfo: 1568900139450370}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'xFAYLcO[B5urr]yi8zq', albumInfo: -7077773197705217}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/id', {id: 'Ipa$%6mmzs', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/id', {id: '6fNC1j#Hd', trackMedia: '^L@^mS'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'F@[]7PXTt]10xd7bR', trackMedia: 4034739086295042}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'VB2ZwC%6rNycy#*', trackMedia: -7541857215053825}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/id', {id: '$K@VbsUICMBTjpRV', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/id', {id: 'PNY3Z8r@', trackTag: '*uD4q&vRg2#(P(4StJB('}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'dhEr$ZGJK4rmc^', trackTag: 5614764990398466}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: '(H0]NFj#DunXLQFb', trackTag: 1824011084365823}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/id', {id: '@sE(9b', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/id', {id: '^c#vNUEzc', trackRawTag: 'vc9M#0'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/id', {id: '7suAAMIPK&#[srAN@m(3', trackRawTag: 369215798247426}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/id', {id: 'p8h()qXwq1N*o', trackRawTag: -8533704213266433}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/id', {id: '5kd5UMm', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/id', {id: 'kVDoyGCh', trackState: 'X!whI'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/id', {id: 'f67jAmFOkd#^0b#p]@W', trackState: -6946974704074750}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/id', {id: '$738li', trackState: -2825518827175937}, 400);
				});
			});
		});
		describe('artist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/ids', {ids: ['*zAs10l$wHzD7f6', 'BiGM#FWf']}, 401);
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
					await get('artist/ids', {ids: ['OMw@Np^NB', 'XRaQdlgkp(0y!VSj%EO'], artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/ids', {ids: ['hk6F]bHg#hKBzF#', 'kaRLDMhnRh*AaJ'], artistAlbums: '5Q[fv*F]*[WVrcZ3nK'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['VQvReC4aIJSv', 'Hh$)gjp2zIM0Yi%'], artistAlbums: 1972145345265666}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['H*n)fg(kPWNRO0^CdT', 'BBlGdG8L'], artistAlbums: 5556602220314623}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['&89P)r', 'Gv^Eg#z*'], artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['w)^A(teI', 'NKu5&#ktPIseTh4o&9fe'], artistAlbumIDs: '4LB2osM06'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['PCm3qP5Aa', 'A!JOsH7^d@%9C#qQ9QBJ'], artistAlbumIDs: 4253217437253634}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['q%zd6vn]4sEuWel!E', 'KNkV3hch%VN^jLo'], artistAlbumIDs: 5762987142938623}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['XolQcUyuY#SceCf2Ef', 'JF(80CKB6%J'], artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/ids', {ids: ['6TFsoFStiaVwtB%eSot@', '#Y0bi(xB'], artistState: 'a7&88GFcB5g3dTh)'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['0qsO5Kx*Cw', 'FfjFaaYX^VH$mF4cC'], artistState: 1451567853076482}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['6G1]L$O]LXo#uRc', 'q2h6&*sNM$'], artistState: 7517440372113407}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['qi7QHZ^TVhU', '&Ci)r(74'], artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['Qpa&&cI3YXB7cjHXU', 'Ac#rT^Y$WRJ[15WUwrK'], artistTracks: 'i6vbD#gZP^5P5M2c!e'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['x7xKuSktEm7)%B%83h', 'S4xOe'], artistTracks: -6776739153838078}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['4YM#BgY)82i9ql', 'fGZ@lAQPcc'], artistTracks: 5403343010660351}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['Tg9WHwO', '@pqv]0Qt'], artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['fZVyA]5gl', 'BjFs5Z@y*k2%4AyCcwhQ'], artistTrackIDs: 'pmE7p9q9%'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['TTtA7996VhW8&dE', '*lt3zl'], artistTrackIDs: 6489170314788866}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['235II^dum3aiDE3Z0', 'zM2d8#Q^Tc$^7rs*UvHG'], artistTrackIDs: 6086989526859775}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['@h^&RuwCcT^%s2@fPLK', 'pMCFS'], artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/ids', {ids: [']EnKvm', '#N1Hy@iJlZbZO6)HwGQ'], artistSeries: 'f@!5IxS'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['IYDnGz^TquFe)CJ', '5M3K4f'], artistSeries: 6198909802119170}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['SxiXJz#C6Mi[MM&9%Na5', 'Narl$#Wu[06%4'], artistSeries: 1830524695871487}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['jkR^Siq)Gy', '*8YBG2P(#1'], artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['Goha*wHHK', 'elUXk4G&*wc6x[*'], artistSeriesIDs: 'KDZ#!WVpg%WCHw'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['MvTp95z1(]$B)UcY', '!aOPo3S]nWJEcW['], artistSeriesIDs: -5053523142115326}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['4kCB!O3orHIuc@MkjwD', 's9#Und@ns&V)(e'], artistSeriesIDs: 5194785694416895}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['Xg06XAyG#yS%7', 'd5sB$9BL5ur[hot[y'], artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['Yrh2Bh*0x*Cxef8rig1', ']2^oOdWNUDO@up5^'], artistInfo: 'mzpyW'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['4$UY2DrDhvQx$WIb*a^', 'z1k$l#L5dWqHUhJTHT'], artistInfo: -5840639887409150}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['w0Czyjw(d[o$3x', 'TQCeC'], artistInfo: 4208851456884735}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['K39KAj7WTM#eoUG', 'TS3byMuixAlIglwr'], artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/ids', {ids: ['m$uR23oVBAA)Adlm$2', 'vfnNcSf&fwlp22JB'], artistSimilar: '3wy64s8Ur9L0J$]ew0r0'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['8%xlM@$AVr)Bu*J6', 's#iQX%9s(csCV6tC'], artistSimilar: 150269526540290}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['WREb(O]8OkZc[lBLkUL', 'ar)1qZ!FY8)R'], artistSimilar: -6748463211479041}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['attDt%4gmny', '^z1a1k'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/ids', {ids: ['3Bqqu', 'ZxcOK'], albumTracks: 'VS6PY6'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['9culC([w8Dr9gyR', 'IN5ZwR[Jp0vU5g@z1xoK'], albumTracks: -2338924957532158}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['m49Gc^*4N^lT2aNO3(', '$oP$DT[LNr3Gkdm'], albumTracks: -5031693815644161}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['8#ujKSbuW1^', 'T&Tm4'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/ids', {ids: ['B*n)F', '9f7Ck78'], albumTrackIDs: 's!$VwZvM0'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['k%G10z*oQ!6$NzQuqYh%', 'psquAY'], albumTrackIDs: -6705862273925118}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['V79s*kqDPyWqM8ZbRM', '0BFCjDflDo^'], albumTrackIDs: 3978868377518079}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['Nt]dX)hJ)WrAY', 'AhHLf'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/ids', {ids: ['b22A8$FX', 'H3fSVjlM!n0@qvP1%sC&'], albumState: 'YY1GKc%f83'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['VF(]i', 'Mk1cV#Qn3$6x^8'], albumState: -4593066912514046}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['Fn9GjP!jlmX5e8', '7J0qRmMpXvoERwMi!NbC'], albumState: 8889549367279615}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['uJmA5501XVDlbsfH2', ')jX4$cW*NJqPYmv'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/ids', {ids: ['3gypGTgWUEQ5', 'i2u($xGEQp'], albumInfo: ']Fr^RzN'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['dUaMq!*6Bb#TDb', 'dHLxv1(zFJng!7E9M2wy'], albumInfo: 5962295901421570}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['f9MWd9X)bJf$RWci!A', '1Q$)ZhfXERaKeF0G$!'], albumInfo: -2888481105772545}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['SM#2TEb]', 'og2Rmu23BJC'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/ids', {ids: ['N3X9FN(%(2WX]ZRY', '&*S0Y7Mve'], trackMedia: 'RV#ka$^(D'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['M5@ouop', 'px8iNQzpw0]9Th1'], trackMedia: -2930196248264702}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['B6wQ2qPeATHd', 'R^8P3(Ti'], trackMedia: 1315445323857919}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['66^V4', 'mxsUV0(S0a#cmjHh^'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['yn3[D)6UPUr', 'VKf3trS(^P3xUKsvRy['], trackTag: ')$LZpPe4y3)FcUyT]G#'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['NCVymUPWgLmW', 'h*Jh6ei)5uK!kQn'], trackTag: -6474802810322942}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['Ti%5Cyh0Ky', 'JIQFw!g'], trackTag: 6646264384978943}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['rF5Ke4B1cUP%2O(8UQcY', 'WjpmEFN[s^WoZ)L'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/ids', {ids: ['v&rQd5P1F00', ')$yAUX1qpq3'], trackRawTag: 'dk%7BdRnui&y'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['N9NGX6D1iPUTK', 'XqO]u'], trackRawTag: 1062479983542274}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['@WIq#]', 'm7JA]p5!c*6#'], trackRawTag: -4013348509188097}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/ids', {ids: ['P%NQa$9c', '!t%zDP7m'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/ids', {ids: ['hPaJ4%52V)rcygfEQ*', '%2!JVoU)@RQ#aJCSBS'], trackState: 'uornxp#mCc(qVQ4(D'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/ids', {ids: ['hFATj$SfAXQV8*RP', 'kVs#9P'], trackState: 5197597744562178}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/ids', {ids: ['fTjYy%6kzU@ec', 'jA[Wq(5'], trackState: 8833632898646015}, 400);
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
					await get('artist/search', {offset: 'D3uiVbO*q(jfPdoZD'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/search', {offset: 6.97}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/search', {amount: '8zbQTAF8'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/search', {amount: 71.71}, 400);
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
					await get('artist/search', {newerThan: 'D#9YI%UFh'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/search', {newerThan: 26.98}, 400);
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
					await get('artist/search', {sortDescending: 'r!MVOe4]P'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/search', {sortDescending: 2654965470330882}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/search', {sortDescending: -7024774614089729}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/search', {artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/search', {artistAlbums: 'HVCT3YZ@Z4'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbums: -8579522282651646}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbums: -8116132313563137}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/search', {artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/search', {artistAlbumIDs: 'QXyaU@MUF'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistAlbumIDs: -5470290708529150}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistAlbumIDs: 3384097401470975}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/search', {artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/search', {artistState: 'iPlHx&5r@5ABR'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/search', {artistState: -2824756671807486}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/search', {artistState: 1912273606017023}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/search', {artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/search', {artistTracks: 'xo)dUnXvh'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/search', {artistTracks: -5697672149204990}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/search', {artistTracks: -9590976544769}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/search', {artistTrackIDs: '%i4rbfYZy[7o8Up)YZQ'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistTrackIDs: 2075155052363778}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistTrackIDs: 6924097908899839}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/search', {artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/search', {artistSeries: ']O[09ib5N2V'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeries: 2521793294237698}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeries: -8580175239315457}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/search', {artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/search', {artistSeriesIDs: '@if(jXtrC9V'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/search', {artistSeriesIDs: -3218807703207934}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/search', {artistSeriesIDs: 3236890606043135}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/search', {artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/search', {artistInfo: '*Tah^00sRH)pTV7'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/search', {artistInfo: 4754935069540354}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/search', {artistInfo: 6997216338116607}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/search', {artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/search', {artistSimilar: '&0u42g5pNozdSkJe%sT'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/search', {artistSimilar: -5425697950531582}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/search', {artistSimilar: 5606110757126143}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/search', {albumTracks: 'iDm(ZLMh#OXlu'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/search', {albumTracks: 592248383209474}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/search', {albumTracks: -6528398230814721}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/search', {albumTrackIDs: 'p!&T%!dJ4'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/search', {albumTrackIDs: 1368062976589826}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/search', {albumTrackIDs: 2082875096694783}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/search', {albumState: 'kGh3fgJ*EfwbY31@bTS'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/search', {albumState: 2860343776772098}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/search', {albumState: 2875300698390527}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/search', {albumInfo: 'oy4ZKxfGa'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/search', {albumInfo: 4789131813060610}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/search', {albumInfo: -4607915109384193}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/search', {trackMedia: 'j7P]5pmwDyC[jCm'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/search', {trackMedia: -6878738495045630}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/search', {trackMedia: -3347055082733569}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/search', {trackTag: 'yEtU]yM'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackTag: -4666926458470398}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackTag: -6140858579550209}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/search', {trackRawTag: 'x0@x]H7'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/search', {trackRawTag: -3393609059532798}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/search', {trackRawTag: -8312418442674177}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/search', {trackState: 'dv#DmwYKuxp7Jx'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/search', {trackState: 7757260306513922}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/search', {trackState: 949346057060351}, 400);
				});
			});
		});
		describe('artist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/state', {id: '%vyc^irLF!km'}, 401);
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
					await getNotLoggedIn('artist/states', {ids: ['eiMX2*iZf8tLG*V', '$B#*KMNE5PEyq*4CX']}, 401);
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
					await get('artist/list', {list: 'faved', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', rootID: ''}, 400);
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
					await get('artist/list', {list: 'avghighest', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'highest', albumTypes: [null, 'invalid']}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', genre: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', mbArtistID: ''}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', newerThan: 'Sv^j[YLJ@(s4t!n%O'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/list', {list: 'faved', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/list', {list: 'recent', newerThan: 63.59}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'avghighest', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('artist/list', {list: 'frequent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('artist/list', {list: 'faved', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('artist/list', {list: 'random', sortDescending: '@wPIFv%Dd%['}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', sortDescending: 2321717242363906}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', sortDescending: -7946900388970497}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', artistAlbums: '8kx11nBGd'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', artistAlbums: -5419766697164798}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistAlbums: 3370261671837695}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/list', {list: 'recent', artistAlbumIDs: 'yn)Wm9)]%es]MWLAS'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistAlbumIDs: 4578372692738050}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', artistAlbumIDs: 1372116960149503}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', artistState: 'fhH3whvpfe'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', artistState: -135354296303614}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistState: -8849265874960385}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/list', {list: 'random', artistTracks: '5r@RToiByiaI))R^od5v'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', artistTracks: 6685750296838146}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', artistTracks: -7834667671617537}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'recent', artistTrackIDs: '^ZGv0N*K4l'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'frequent', artistTrackIDs: 6844725663367170}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistTrackIDs: -7549569189543937}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/list', {list: 'recent', artistSeries: 'FbFaLA'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistSeries: 7494124571721730}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', artistSeries: -7958414965604353}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/list', {list: 'frequent', artistSeriesIDs: '%2RkS($0L$D%Tv'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', artistSeriesIDs: -1060791130259454}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', artistSeriesIDs: -6570401756872705}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/list', {list: 'avghighest', artistInfo: '7loky*(SsggfIvj*6'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', artistInfo: 3321903217377282}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', artistInfo: -8804243762839553}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/list', {list: 'faved', artistSimilar: '6hxt$'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', artistSimilar: 7681995467390978}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'recent', artistSimilar: 3192089043009535}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/list', {list: 'random', albumTracks: 'jfsiwC6kAZh%2fD4mV'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', albumTracks: 8373069194199042}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', albumTracks: -3231827577798657}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/list', {list: 'random', albumTrackIDs: 'O[7Bx8a['}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', albumTrackIDs: -5838938862256126}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', albumTrackIDs: 7748800735084543}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/list', {list: 'highest', albumState: '0JLyv7'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'faved', albumState: 2264835739877378}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', albumState: -4193112767332353}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/list', {list: 'highest', albumInfo: 'bGj3Ttp]0e6'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', albumInfo: -7191457928577022}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'faved', albumInfo: -4207961526239233}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/list', {list: 'highest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/list', {list: 'random', trackMedia: '1ELgtCM[CxsO2Kl$1N'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', trackMedia: -5041807486353406}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'avghighest', trackMedia: 2571657629663231}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'random', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/list', {list: 'random', trackTag: 'jWuBr6ochm1nX'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', trackTag: -5252110048296958}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'frequent', trackTag: -2987262321098753}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/list', {list: 'frequent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/list', {list: 'random', trackRawTag: '(zi3%DwTUgkF2'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'recent', trackRawTag: 3844015308931074}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'random', trackRawTag: 1096787003703295}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/list', {list: 'recent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/list', {list: 'random', trackState: 'vm6RiqA&1ITub!NkyY7'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/list', {list: 'random', trackState: 3330865820073986}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/list', {list: 'highest', trackState: 239596034064383}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/list', {list: 'highest', offset: '6wLlr&@O'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/list', {list: 'random', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/list', {list: 'faved', offset: 27.57}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/list', {list: 'frequent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/list', {list: 'faved', amount: 'tb^g^*'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/list', {list: 'avghighest', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/list', {list: 'frequent', amount: 10.6}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/list', {list: 'faved', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar/tracks', {id: 'OO07*O)C4zwJFQS'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: '10NW9(7hlJ^3ot3M#VQ', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'jp$^D&1jsJDln', trackMedia: 'Ji71M3#)#]G8f3%'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'Ei1*SYgb#', trackMedia: -2577358020149246}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: '61W^&', trackMedia: 3633683214893055}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'Ga4[4Lv', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'nRd5iCVtQ4', trackTag: 'O&U6#urRc74zmP&UpDOj'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'yc*Pw$8xkN42iX', trackTag: -19237481480190}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: '@^J^wQXmhyBIZCZmE', trackTag: -799634821742593}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'Y4mVo8', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'ERjcJmlb%#xfLl^', trackRawTag: 'rEBY3D*z4!LNYZ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'v0Xq])nMnqUTg', trackRawTag: -6739656645279742}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: 'A^Htg', trackRawTag: -7246013156818945}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'KSKIj', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'SwDvqf1VCf@Y', trackState: '3G7139EYNvto%a*4NU'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar/tracks', {id: 'biUeAu&7amb7H5bQ4H', trackState: -8090565295996926}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar/tracks', {id: '8Ez8hisZ%BZY(', trackState: 8671296124616703}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar/tracks', {id: 'oudUBRf&sx!0Juk&Qyu', offset: 'zKfOqFYt7]gipdL5$@Ea'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'VPu%**onL0[', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: 'Sc*jkuNoc@]t082AlYpG', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar/tracks', {id: 'h6DGt1f)f', offset: 14.46}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar/tracks', {id: 'rB$BFuvtkD$7Ofy#)i', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar/tracks', {id: '*((1@OJ!E', amount: '(kq9qv'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar/tracks', {id: 'mx%%8Ic', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar/tracks', {id: '$$OK7wtR5', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar/tracks', {id: '&F7bOM28', amount: 34.02}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar/tracks', {id: 'fi(Bw&Ya', amount: 0}, 400);
				});
			});
		});
		describe('artist/similar', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/similar', {id: '(5w!0'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/similar', {id: ''}, 400);
				});
				it('"artistAlbums" set to "empty string"', async () => {
					await get('artist/similar', {id: '^B7hnhu@6eu6gAEOuP', artistAlbums: ''}, 400);
				});
				it('"artistAlbums" set to "string"', async () => {
					await get('artist/similar', {id: 'bKOqb%LMsk', artistAlbums: 'CQGct6Xchh6P'}, 400);
				});
				it('"artistAlbums" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'NcINMomj%Io$ZnJ', artistAlbums: -6409196845137918}, 400);
				});
				it('"artistAlbums" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'EOi3V6]ViTBA', artistAlbums: 141793324695551}, 400);
				});
				it('"artistAlbumIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '3TWI3SVCR3)1B', artistAlbumIDs: ''}, 400);
				});
				it('"artistAlbumIDs" set to "string"', async () => {
					await get('artist/similar', {id: '%(&pAPKS$ZZ#*z]u^V', artistAlbumIDs: 'us5A]2b'}, 400);
				});
				it('"artistAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '*MukdHTnK]', artistAlbumIDs: 5172182342696962}, 400);
				});
				it('"artistAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '8MTt]BzzQontm(nm^t', artistAlbumIDs: 2151388008153087}, 400);
				});
				it('"artistState" set to "empty string"', async () => {
					await get('artist/similar', {id: '30s%ZP', artistState: ''}, 400);
				});
				it('"artistState" set to "string"', async () => {
					await get('artist/similar', {id: '@*axx7[Ak7o#iOthQhQ', artistState: 'M^UJth#V9$6mB4'}, 400);
				});
				it('"artistState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'EkKjjl7SgbS', artistState: -3543243786551294}, 400);
				});
				it('"artistState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: '2K!eueR]', artistState: -853043348242433}, 400);
				});
				it('"artistTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Lm2(ONwGxmo7Sb8C', artistTracks: ''}, 400);
				});
				it('"artistTracks" set to "string"', async () => {
					await get('artist/similar', {id: 'spWUSOJ9dK^f', artistTracks: 'lL&Ehf)fg1xqaQ7'}, 400);
				});
				it('"artistTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Svy0D&&7NuUT[A6cl', artistTracks: -3056866250719230}, 400);
				});
				it('"artistTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'PF2cek', artistTracks: -2895839131336705}, 400);
				});
				it('"artistTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: 'oMR)#6J*W', artistTrackIDs: ''}, 400);
				});
				it('"artistTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'iFevh5W5Yy', artistTrackIDs: 'np$qQNn0erQH2T3'}, 400);
				});
				it('"artistTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Ny&goYp', artistTrackIDs: -510520264228862}, 400);
				});
				it('"artistTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'lTa4T', artistTrackIDs: 1144419474472959}, 400);
				});
				it('"artistSeries" set to "empty string"', async () => {
					await get('artist/similar', {id: '2wNiQF)knrVHYl', artistSeries: ''}, 400);
				});
				it('"artistSeries" set to "string"', async () => {
					await get('artist/similar', {id: 'iHxSmkZf7A!N%NXQ0h', artistSeries: 'rW%jQA)%HEg'}, 400);
				});
				it('"artistSeries" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '[iAfd)ujAVZsS9bXb)i9', artistSeries: -1781377376714750}, 400);
				});
				it('"artistSeries" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'bepDR9a', artistSeries: -4501687658086401}, 400);
				});
				it('"artistSeriesIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '8sIH7zxl2us3', artistSeriesIDs: ''}, 400);
				});
				it('"artistSeriesIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'TmZo02', artistSeriesIDs: '2M^QWZllEn@yv^'}, 400);
				});
				it('"artistSeriesIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'd&jHPgORr', artistSeriesIDs: -6634075271987198}, 400);
				});
				it('"artistSeriesIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'qN0[b6vbpJ49H', artistSeriesIDs: -5759306062364673}, 400);
				});
				it('"artistInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Mqkzi)^4F1HRUS', artistInfo: ''}, 400);
				});
				it('"artistInfo" set to "string"', async () => {
					await get('artist/similar', {id: '(vv^0Rn%SMS', artistInfo: '4S2m2*mV'}, 400);
				});
				it('"artistInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'WZvCx^gv(', artistInfo: 519182156300290}, 400);
				});
				it('"artistInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'xs9R[Fgedt%y19z9wuMD', artistInfo: -8263706026704897}, 400);
				});
				it('"artistSimilar" set to "empty string"', async () => {
					await get('artist/similar', {id: 'B&TOszkXWb', artistSimilar: ''}, 400);
				});
				it('"artistSimilar" set to "string"', async () => {
					await get('artist/similar', {id: 'TRCVGdWz', artistSimilar: '30![Y@[z'}, 400);
				});
				it('"artistSimilar" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'ssOaYu#eJXWl7g', artistSimilar: -5756180479606782}, 400);
				});
				it('"artistSimilar" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'Q[xW*dVNulq2^!tU0e', artistSimilar: -5428493198295041}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/similar', {id: 'lBbX]&rH@PY)nr2', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/similar', {id: 'iYzs6o', albumTracks: 'aBfmk[7(oJH70ShF7r'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'LI1JW6)Mrh[', albumTracks: -4012531332939774}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'lxev85f!Gu', albumTracks: -775777922580481}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/similar', {id: '[R6zZ)@EaFs', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/similar', {id: 'o*Kskxv6', albumTrackIDs: 'Qp]HOv1i7QCKd^R'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Fcogs!xRJI', albumTrackIDs: 8510333052256258}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'H[At1YT2', albumTrackIDs: -349708371361793}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/similar', {id: 'bJT5kOL^jw0keYhYp$!5', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/similar', {id: '(Cw($Qn@[L#SBq', albumState: 'mlHb!jT)UdElLAUY[7L'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '9pXTG', albumState: 568548468457474}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'i(6xKLgvVX', albumState: -5498275243229185}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/similar', {id: 'Xj%wyi)F3', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/similar', {id: 'IEqx$5HzN0swXfWTg)Kp', albumInfo: '1lPTXTeIa&fBoN(ji'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'RA1oH', albumInfo: -472588492996606}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'OzF89tr597^yY*51Sj', albumInfo: 3673551768911871}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/similar', {id: ']OJIfql64^oUZbjKtXO3', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/similar', {id: 'pu#3arcY', trackMedia: 'Q[Ngg#&gPfr(kp$SyA'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'oMIGy', trackMedia: 4137476994105346}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'qZd$oqTe]rAFTNm', trackMedia: -4915543853236225}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/similar', {id: '^Mz4hjBJDQvk#!M[1Q', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/similar', {id: 'GJ^$k$R', trackTag: 'vtwHL7eg([(gp'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: 'Ucr1H*QE@NfyyW%T%l', trackTag: 371066518110210}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'e0a0m5qHO)8i3r4ia7', trackTag: -4219049537961985}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/similar', {id: 'EekKaW)9JPFO', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/similar', {id: '4YKo%fcwn', trackRawTag: 'cj]@qz31!m@r83n'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '#4%6s', trackRawTag: 3889944917442562}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'kXEeZH4nX&!', trackRawTag: 3502138294534143}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/similar', {id: '0[7aLBg3', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/similar', {id: 'SA$[DBq[4u6cUEaK', trackState: 'ZeCloMHTxx4zi$EUr8X%'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/similar', {id: '2(V1xNE2huvcv', trackState: -1518772854718462}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/similar', {id: 'opYoOyhI', trackState: -4489494136881153}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/similar', {id: 's1uV92%*RBViugl', offset: 'rGD85%Vt#'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/similar', {id: 'V0]KeY', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/similar', {id: 'n[%2RaXHhUl98', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/similar', {id: 'sa01LR1*XKZ]d5n$9hIq', offset: 9.18}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/similar', {id: 'n&Li&kjOwDqiJzMm0K', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/similar', {id: 'kh&jkzMAj8OQ*', amount: ')6O#6!x1Nvf!6['}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/similar', {id: '0H]H*ywz', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/similar', {id: 'tw$E%rrIpPqMy', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/similar', {id: 'cBNcUSxOzz', amount: 11.79}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/similar', {id: '&90tyYlKPv2SDUZ!', amount: 0}, 400);
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
					await get('artist/index', {newerThan: 'QIoNbxtV]WQ9F(n(]'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('artist/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('artist/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('artist/index', {newerThan: 55.65}, 400);
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
					await get('artist/index', {sortDescending: 'Zo@ub3cEmLnT4*]hx'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('artist/index', {sortDescending: -3066751013093374}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('artist/index', {sortDescending: -1107681876115457}, 400);
				});
			});
		});
		describe('artist/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/tracks', {ids: ['Ed3hvRBLWWyai$3', '*AnaIM7SCoU)@^o79DZZ']}, 401);
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
					await get('artist/tracks', {ids: ['GX&!rH%qG*qZR', 'WB!FK*C2P'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/tracks', {ids: ['#&erkvbu@]J^KT', 'PWOu)RE^EPuOi(ipX'], trackMedia: '@kRiEWxCMR9'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['qG0HEbiBZvJnQPTonWc', 'uf%B8[N*@P@'], trackMedia: 7107663422816258}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['19Y1lQ)P', 'hDVENpX%qLkZ'], trackMedia: -1495499450351617}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['0P&LAvq', 'Sd812jfmw[dam'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['enj]A5(VygtO!WtnC', 'PD7bG8'], trackTag: 'O(MhuUxycYxW0@C'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['HLXCwkqqCzcT49]k', 'Cr^JoeCPuh9'], trackTag: 6963398294110210}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['B(4ltP1!]^MJQj7N$I', 'y$YY]sB'], trackTag: -3126279398227969}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['L[(29x(', 'BP]$6]bPHWO3'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/tracks', {ids: ['iNMaTSXPjI)&gM5FPR', 'SavG2h)F)Vk6ixY!TYv'], trackRawTag: 'aT(imqrUkD%U'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['e$6o*qhx2nogxsC)]', '2ZO!GIf[lPB@YCgRU52H'], trackRawTag: -3661440309264382}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['f6SUxmF(nAc5N(WDHhq', 'EP808'], trackRawTag: 7041212112437247}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['SH*^Ue5WQ(o[kxRV@m', '%4)1d$a@Vt2P(kG'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/tracks', {ids: ['8UpodE', 'TKhF2HRAK(('], trackState: 'ulqx4u^ohUUsYIAWtnF$'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/tracks', {ids: ['NPbbYFsIFuTN4pk&Xi)n', 'o9PfHlwv'], trackState: 4384290884288514}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/tracks', {ids: ['MwZVSSs7@lvLNg', 'y0eE*Ft'], trackState: 5041239393042431}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/tracks', {ids: ['THbpLgir!', 'IUUsIOR%G'], offset: 'Ov!t)7]RTf'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['DB]vvwm*E00Yuq', 'G@a#E(8f)i2NHgp6)'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['oWbkZpnKmCT*lfRG', '*mTg$ns*ZbFNuw$GgFe8'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/tracks', {ids: ['q!yxAAW', '[@7IH'], offset: 37.68}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/tracks', {ids: ['#[UEm', 'X&o5[3i'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/tracks', {ids: ['rV^X0yfXVW&H3L*v8Pl', 'h)Xvm9ubB&FWhijQ1]('], amount: 'c6M[AMg87^(6L$ai!329'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/tracks', {ids: ['tGt@X', 'r*kaP'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/tracks', {ids: ['n&loNvqxyZR!c6RlM80M', 'jM7t5G[N*i'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/tracks', {ids: ['ayPX0)@N8V', 'l1Fa@Y*DhJYZT[ZW!A'], amount: 51.31}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/tracks', {ids: ['l&z5pNRd)GOqn9M7', 'UMtr]xdwf1XPv48!K6@0'], amount: 0}, 400);
				});
			});
		});
		describe('artist/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/albums', {ids: [']&MS0(vphf', '!@SaU&V3EE3qFWR^[S']}, 401);
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
					await get('artist/albums', {ids: ['xq0S]NkctCubJ^5R', '@F@L7EdJTS2Ya'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/albums', {ids: ['UD8#ADL32xk]MMT!!Gf', 'F1mhoHkXzopOk'], albumTracks: 'fQ^8shfX)0y$4p'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['LQk(3', 'h2)zH(Jl'], albumTracks: 2081072502276098}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['6LeWRccHojtttP', 'xdTfQOe@Qb['], albumTracks: -7205556053868545}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['s#]*C]aq(Vnx41^d^', 'V]gIp#LqNu(S'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/albums', {ids: ['rN6j7Q$A0q', 'GVwhxfsm5Z'], albumTrackIDs: 'Uj0HZMbTq((uMKt0y[t'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['h!n4DEu%CeoKCI)TP)Ui', ')eri0S3'], albumTrackIDs: -2305435650490366}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['8rW^$Pvw3$!kh9th71tT', '^gL$QzY]0P)@'], albumTrackIDs: 644234226958335}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['H*9bX4@W5yVdQ', 'nHYB1Qy(J)ffeN&!u4qo'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/albums', {ids: ['d32(xYh^b5T)Rt', '(l8dr%WEsTFwX9#6z'], albumState: 'BaSCtKmh2I^^Hw$EC'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['VnOej4', 'BEQpaMgaiUSVy5NS'], albumState: 8130680135352322}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['b4v!jrI*%kG@1PGE', '0VHIl(OGvSqnS&ehR'], albumState: -7330902237511681}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['rGnj@IeP(7%ygoz(l6Km', 'ur#$)'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/albums', {ids: ['SbYVg2H0SMPt$', 'wq6KRe2M5@f'], albumInfo: 'MQHtD&C*qkgc!#!rX*'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['j5b^@tWYd&X4TJ', 'vpX]$m@wT'], albumInfo: 4544547447111682}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['IA4U0A3e9k9Z', '01kpB2taGY'], albumInfo: 1962889103540223}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['3]jpSOn6jShXjq', 'ssd9l&4Xq'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/albums', {ids: ['bVmJ2t', 'mkpLw)'], trackMedia: '5iB*W^SD0Zm'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: [']SpA5N($#MNt', 'Ng!UH1*CfSAagt[^[U('], trackMedia: 6979125604515842}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['6!oCe', 'Q1BT%@Vu^H'], trackMedia: 1436221913956351}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['$Q^RA^NO3jkhVQgqS31', ']H5Ub3F'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['X$PfL(fkluB#', 'XZVYay)xae&y$z*e(hy'], trackTag: 'J]z]^i8rUK(E8RI9'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['5(k48nSFGTK#k5Gfg^', '5SdOd5#)%9Omh]!'], trackTag: 2147325396910082}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['xQ3VtJ#fyxHV%2l', '8bgIuT!'], trackTag: -3142988419039233}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['qlSU4Plx', 'rKW9d7XLTXMQ'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/albums', {ids: ['sLft(', 'L1o$uY4ocI!gn'], trackRawTag: 'L1@PtS6stlLZXWGy$'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['OAbr]uhXsMedPREzzi$', '^r2ku0IHw&v!yL3'], trackRawTag: 286735019802626}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['JY79U[PvjA', '0W5lqm)ZaiTdk'], trackRawTag: -3891098405568513}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['2qQbmFsBC2whIm', '@e((82dLkGeWU1zicnZ'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/albums', {ids: ['RRkyxdckdxglRU7)DRqp', 'bLz#Jza0tgN&]yeFMK'], trackState: 'SL]@[fRbaz4$(XE'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/albums', {ids: ['EYJs3npdz(yHiNfo$!$', 'pPS2u#!'], trackState: 5181338701266946}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/albums', {ids: ['mtR0a', 'ZXMfi'], trackState: -5506625943109633}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/albums', {ids: ['g$61d#k$&CbK%G', 'axm44EkKOloYi!6rhJHP'], offset: 'W@nr66MO'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['V%Vazo', 'YP3meV4tody$@NPlb'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['2ihksxpKte', 'Z4sRxooprIo(tT'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/albums', {ids: [')G4@Grz1YhYSqW', '#mXuXp'], offset: 26.22}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/albums', {ids: ['r0%YsB6fKssTbaCd*0', '#vGM6m4ny^IPXbQ'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/albums', {ids: ['Hjcp63Sv', 'A7KAlpTU]K*C^ik&'], amount: '5pxE[q'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/albums', {ids: ['KP!x9tNDN', 'oc$Tz'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/albums', {ids: ['KEnVgt8r9g57asJ(9nSa', 'Vw4m9iMyGafQMOc2]'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/albums', {ids: ['d$iXE$', 'T4X$&Pj3A2)6'], amount: 5.79}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/albums', {ids: ['yob26Y[o2', 'PVX8dhvDLEZZ!c^]e'], amount: 0}, 400);
				});
			});
		});
		describe('artist/series', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/series', {ids: ['qN0m4XI8LU)uV3', 'g%T8XEH7xE19T']}, 401);
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
					await get('artist/series', {ids: ['h2UEDD0L', 'MEw9QIc!mkl14M&Y'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('artist/series', {ids: ['I6&l1G6CD!UA!LoE][', '5kVBIIQ*x#]J7z8EoPKe'], seriesAlbums: 'SCVeH['}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['yR]solZt*6C1', 'yr8IcN'], seriesAlbums: 7176692120420354}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('artist/series', {ids: [')@eD81V5Mql', '6HaMLcp$2)Dq'], seriesAlbums: 2278374869303295}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['Wsg#T4r', 'Lz*S0'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['&WhgooZ^iGX37Eo', 'mZc#s[Ozf'], seriesAlbumIDs: '[3Nl]dNeHHiNhZH8FN^'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['7vdmlu4%UIXv5RcA^O@8', 'AOp!)6aRY&&Zd27'], seriesAlbumIDs: -806559206604798}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['bF39Zu8S[bED&f@', 'A*eWfZ&&Rg8]1'], seriesAlbumIDs: 7765125310185471}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['AHQDIP@a*rw', 'L4YeKMY'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('artist/series', {ids: ['ot7Qaf^!PctKD)8eYd', 'todrP5rK$'], seriesState: 'y%oX36'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['VP9@k(', 'QpR$j@rff3ck'], seriesState: 666965630779394}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['HEN)b#', 'g2$u!(82WEt['], seriesState: 7770659132276735}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['*H%S7ocHpkalHwsT', '5@#lw2Vw)ZYUM)p@Rd'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['yvk0FBrZ40On38r&]Oc', 'lgU!K!zSOml%b)XY'], seriesTracks: '&&cbE$^i((TS'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['b5cr0!K', 'ijkz$N@C3]CXlS!#amO'], seriesTracks: -6216807459323902}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['A1MJMT8qVB!Mk&5^mF', '8y9*7Y)wmD4jo&PpT'], seriesTracks: -6527472254320641}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['#)Z(yLi', 'IVG*7vS8LF&c&'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: ['8Q$gQ7m08i%!hZL', '0*]UWf(8bI'], seriesTrackIDs: 'oMbyUKf[z5u!BZk#(x'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['&qBxVjk6RGFIh5', '@j^fC[(Z'], seriesTrackIDs: -7533904919527422}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['F)km9VXqCw(x99dXRU8#', 'iK6AzmLNlYe'], seriesTrackIDs: -3590749086023681}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['yS4]CLgBlnAwnX', 'LULUyTWn77Y^65N@S'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('artist/series', {ids: ['dpiRThKyeqIQ', 'taA@lIT4wQyhqMYqY'], seriesInfo: 'D1(z*LkY2q8%kp'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['v)5L^bM9', 'm)C0QTG4BAZ'], seriesInfo: 3179968062291970}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['gnprvsZOI5gL4', '#sNxud5I&R@z'], seriesInfo: 3812651876483071}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('artist/series', {ids: ['W5Kc#iUkzgNyLU$', 'mAHD5'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('artist/series', {ids: ['Pq)an1', 'lFsMPc4kQM3&@8Og&'], albumTracks: 'KoqNpLeg0'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['8J2YnOiddp', '3*h3E(LSZ$^p2'], albumTracks: -4137784092655614}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['a!uv332', 'YugtBv%Q('], albumTracks: -7516388784603137}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('artist/series', {ids: ['VpEcP9Qw7qB^XlHcC', '6Aepv81N^s'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('artist/series', {ids: [')@eX0', '#$)t^4*z'], albumTrackIDs: 'N*6HHgXeygN#'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['FAdQkSq&', '@O(k[5IvdHBME)v4BH!6'], albumTrackIDs: -151859574603774}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['%Db$vWEtV3', 'SQ42HPJAe83^TZ'], albumTrackIDs: 7468450305802239}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['p42Iih', 'DSm)CJ'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('artist/series', {ids: ['jCcO6s)FO0Tsf(t', 'k7j8Ka!VKAlwL'], albumState: '&r5qZ1g'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['HSzmiwdy', 'Jb$H#IgxrDhmBf'], albumState: 6771438950285314}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['biVNOIn5eSQ!$', 't*@mJEzJ'], albumState: -3870915846733825}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('artist/series', {ids: ['9kdE!sOPxE7cv(6k@Uoe', 'uXVw)%z]8'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('artist/series', {ids: ['6&Bq%Ck&mrfYLW', 'j5H7V4vGfS]Dy*'], albumInfo: 'sI4&ph3#$y'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['dKumsxDY', 'V$8SIR'], albumInfo: 814141623238658}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['4AhfCv', 'aWenQCA3N(z9QdpG&'], albumInfo: 899694666448895}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('artist/series', {ids: ['N5Z$f', 'x8l%F(0g(uV'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('artist/series', {ids: ['$)l[q7seJVg', '@qT*wn8q'], trackMedia: 'l)LcwJ7Xr5FaJZZ#82'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['fEZU5KrPDKT(hbIupmAn', 'qnE3jsh6l'], trackMedia: 3780859744223234}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['812sc%TLBQ6sWWKOg', 'bBYoxHfgaN3'], trackMedia: 7703318453288959}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['crepn', 'bJYZ%pkj0&DmCXc[R$u'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('artist/series', {ids: ['WdrVz3ofQt3n', 'IP9oR'], trackTag: 'Y*0Xz4pu9M'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['r)wQVyvdYEIDR', 'XfITc6jUrimZtKZJyx'], trackTag: 8027910094979074}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['5HK1DqWb', 'OpALDFRE7o!Iz3h'], trackTag: 4016244692877311}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('artist/series', {ids: ['UaCYCR2k', 'ZKezBM8Z%qS7'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('artist/series', {ids: ['x4)h&E#v95214L%]IZ(', 'D0(aurF54dlCC!'], trackRawTag: 'zRBUOgs#i7cnsZCG'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['ix!$99h4', '6rzgg'], trackRawTag: 4937311712182274}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['bP*(SPZDd@s%Q', 'ft78HJ]5mxI'], trackRawTag: -4143423523127297}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('artist/series', {ids: ['%YH57#pUn', 'ft4x5q5^mNZejX'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('artist/series', {ids: ['9IOwgO5wK', '(@oRg[X7$q'], trackState: 'GcDoHWej(8jWj'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('artist/series', {ids: ['@*#(BbMQrh[pg', 'LbUO(k(uK)T8'], trackState: -3182397629661182}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('artist/series', {ids: ['hs200ODPYJUq]^', 'TvgTxE0c#H#[CtMpT'], trackState: 5603528147992575}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('artist/series', {ids: ['E0cPP', 'qL3*3uZ&C0mX^inX'], offset: '8mnqx'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('artist/series', {ids: [']zM^JriIgfJevT*XT$7', 'o(eLi!O3W1HxcvRzgXK'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('artist/series', {ids: ['FAkDK3]U', 'AiJsk*z[$s$9'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('artist/series', {ids: ['!Q7yF@DZ^&cw2', 'jO70sVyRq9PceoC)q'], offset: 98.48}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('artist/series', {ids: ['HOQr@KWea^Yn@p0wl]', '#8WC5U'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('artist/series', {ids: ['aGyUR1VTF5Qxc$1IGr0)', 'Lb9!G2PG'], amount: '$[1D^4gs4@!YuByH(t'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('artist/series', {ids: ['l%QcF#yWJ[5E8G!Z!d', 'Em0FOb64neRpSwt4W6'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('artist/series', {ids: ['uv7V99Zyc%', 'S3YyxCeJ&JN4qeUJg'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('artist/series', {ids: ['^dZOMg5HeNvNU!wD', 'QkLQ(v'], amount: 96.33}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('artist/series', {ids: ['s!0#RpCyj2', 'SW#I6PArO'], amount: 0}, 400);
				});
			});
		});
		describe('artist/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/info', {id: 'GzVa0X'}, 401);
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
					await getNotLoggedIn('album/id', {id: 'AxN9VRAlYWyk3$[ZYzbF'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/id', {id: ''}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/id', {id: '8]m[7', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/id', {id: ']2EIGtp^Ue', albumTracks: '*YNw(vBY'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/id', {id: '85@M&p*5U8XcPZy9Fh', albumTracks: -4001376132661246}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/id', {id: '%5eNl5W&goTC!gHn', albumTracks: 338030082654207}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/id', {id: 'ZfGspS%zO5gX8', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/id', {id: 'hiBG%Zlf75', albumTrackIDs: 'uB^q^Tz'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/id', {id: '%rmcIy', albumTrackIDs: -3640588280791038}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/id', {id: 'Sb&GjunmI#hB4w^^', albumTrackIDs: 2594571078860799}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/id', {id: 'k5YpT', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/id', {id: 'i!9jn7QtA!ox[oTmBvz', albumState: 'Y#bHrOP7Q^$qYwXt!e7'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/id', {id: 'CGDyguktGQ', albumState: 8048598570762242}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/id', {id: '59l45O!cXWJ', albumState: 1249114822017023}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/id', {id: 'WG%fSU6P%q]', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/id', {id: '(1%SY$CbSB*%rS$(!', albumInfo: ')D3Ecg'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/id', {id: 'hZWg(!do', albumInfo: 8698192803659778}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/id', {id: 'kQlY^vjzEJundEL', albumInfo: 5131827043893247}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/id', {id: '$&QULH^Rw$*Z', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/id', {id: 'MYFUuBuwc4w]B', trackMedia: '0wd1i6F@'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/id', {id: 'G9Zc*rcgrtW3gwpP&2II', trackMedia: -2651860829732862}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/id', {id: 'dkbX[Xakf&]W', trackMedia: 3534626215690239}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/id', {id: '%fx9jAmuP^L', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/id', {id: '*Cg3zO', trackTag: 'KoX7TmD2)b*U'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/id', {id: 'J9)yBwh%yw%(mP#', trackTag: 4047528550989826}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/id', {id: '6SS4m', trackTag: 2379896798052351}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/id', {id: '*Rw0kUHPmEV7zUnm&YT&', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/id', {id: 'FHeZS', trackRawTag: 'i&CPKa5(ET)#uewhw'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/id', {id: 'oNGhhmuP&j!]3%v', trackRawTag: 1169255710064642}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/id', {id: 'bfiBiQJdfYxt', trackRawTag: -6997951188566017}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/id', {id: 'arHpDODKZUW)09e3z*YB', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/id', {id: '*8$BVJRZSqMz', trackState: '^0uVRrr'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/id', {id: ')Y1&DC6vpX4Mi7#rh*s', trackState: 3664018262720514}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/id', {id: '42#U9v#', trackState: 1734671121514495}, 400);
				});
			});
		});
		describe('album/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/ids', {ids: ['QXZVkohH', 'IuX[V(19A']}, 401);
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
					await get('album/ids', {ids: ['Oh4tI#Iy%0@PrF1[@!k3', '(S#NnKAf5mHFC61m%'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/ids', {ids: ['7zxI6A@mHY#SL', '1e*kG8Ob!'], albumTracks: '*sy66JmaYit'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['[5iyO#vdCueHo', 'Kx0a)*n#[7fu'], albumTracks: 7306112575471618}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['[OeDuj*3!sxOLWhiY', ']S8z7hSVfxu5YOK'], albumTracks: 3054724173529087}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/ids', {ids: ['9a$F!W18V*RrMeWAB', '1KTXF6(eX%w'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/ids', {ids: ['PB7t8tNK2P]rR2Xxs', '$0tAYV'], albumTrackIDs: ']u7i]9v)EhKh@V0j'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['G5!h[y', 'vDqIg1R*41'], albumTrackIDs: 6676845151911938}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['8Qzi#R(', 'I)Tcf'], albumTrackIDs: 7601300439039999}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['YrBtQG', 'Z4C93080OY'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/ids', {ids: ['IfkXQow', 'NAZzDAurmo3Bh&67930Z'], albumState: 'v5piSPBu'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['k&LM$hniHpO8(&', 'NlPbwPZog'], albumState: 5077293777027074}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['PQ*&6aLoee^sk', 'c9bKX24Id3Cr1Uoe9ie'], albumState: -3358317183238145}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/ids', {ids: ['b!jXo', 'V1vp1^83eZ*8lv6E6u0'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/ids', {ids: ['EXj0[', '65w(H'], albumInfo: '$OTSdz3^*FW^673s'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['pZr0q9A)s@', 'IXoS6Y4b8CgP]d'], albumInfo: 4001135027290114}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['pWq#wVVwIP2', 'mZrjO#GvF&#m$HLqS'], albumInfo: -2923714790293505}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/ids', {ids: ['@M7tZjyr', '8JI*7FwY3Hq#C$9*FQr'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/ids', {ids: ['Tgz^pobZRYkdodP', 'rKq5cW0DC&9*haX'], trackMedia: 'Ql[nVcF@y5C^D'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['SI%Fgf#zT', 'E8U9Ww9wf)agve#'], trackMedia: -3264143985475582}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['J@JpikCMtmmDH1]Tne', '*6[TWJ'], trackMedia: -8865894600015873}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['rG28bSF7ezKLf7GCAGo', '0YwH*V$!N'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/ids', {ids: ['NpKUyFpkrC$%', 'V0jlR8UYailuUWZ8x'], trackTag: 'o5A4WpTD4KMg^oOn*pW'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['S$35svNePQhh[X[', '2h)[LKIaT3k'], trackTag: -1957616066494462}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['$2L]X4bR$Z7F', 'F^a[cv'], trackTag: 3221371668660223}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/ids', {ids: ['3Kol7hct[yFKI#rX', '](VZLoz8w#xrw'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/ids', {ids: ['s8GBQu', '6MLCFbg9V1ehgu7zuBur'], trackRawTag: 'VFhX^cbkjY'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['qlp7Im', 'zcDn)hHotKlXs'], trackRawTag: -5289540474372094}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['Dfl*&]S2Hll7', 'PscfkYpOk*Ej'], trackRawTag: 8529276009709567}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/ids', {ids: ['iPL#1R@(jqRs*2k', 'A]!J8n59*2de^'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/ids', {ids: ['v]M&!E$LZqJ5iIspF', 'ywN[yV!)EghX9SplULD%'], trackState: 'qGkNUdc'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/ids', {ids: ['2y&VYV$H', 'BEA6[FGaaoMW'], trackState: -5928615686438910}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/ids', {ids: ['62[Ha0)6V%aWgXIG9', '@]G[[O1*qp'], trackState: 5994409455779839}, 400);
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
					await get('album/list', {list: 'frequent', offset: 'GbMz2P6'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/list', {list: 'recent', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/list', {list: 'recent', offset: 20.08}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'faved', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/list', {list: 'highest', amount: 'dkmc9L1oE'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/list', {list: 'faved', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/list', {list: 'recent', amount: 67.76}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/list', {list: 'avghighest', amount: 0}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/list', {list: 'random', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/list', {list: 'faved', albumTracks: 'nyc%Qc6p2Gn4p'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', albumTracks: 4411677244129282}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', albumTracks: 7213734070059007}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'random', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', albumTrackIDs: 'h!7wTW(86899JNQ'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', albumTrackIDs: 5271821989445634}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', albumTrackIDs: 3664914770034687}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', albumState: '5De!6BL93Bl'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'highest', albumState: 1907306606362626}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'highest', albumState: 6593222126075903}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/list', {list: 'random', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/list', {list: 'random', albumInfo: 'msBN(yZN*Q$k'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', albumInfo: -1754287189262334}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', albumInfo: -6480057811861505}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/list', {list: 'random', trackMedia: '^mWfTds'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/list', {list: 'faved', trackMedia: 7243321512558594}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/list', {list: 'random', trackMedia: -4660523035525121}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/list', {list: 'random', trackTag: 'gtc*yBPq&qb8a2Hm@'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'avghighest', trackTag: 4016767097634818}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', trackTag: 2128435354796031}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/list', {list: 'recent', trackRawTag: 'Lm3vWD8q%G&jXqh5'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/list', {list: 'random', trackRawTag: -3270048361742334}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/list', {list: 'recent', trackRawTag: -3479658125328385}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/list', {list: 'recent', trackState: 'Bl[)CBAjb)Us5'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/list', {list: 'frequent', trackState: 3932628499562498}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/list', {list: 'avghighest', trackState: 5089513386803199}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('album/list', {list: 'recent', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', rootIDs: [null, '']}, 400);
				});
				it('"artist" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', artist: ''}, 400);
				});
				it('"artistID" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', artistID: ''}, 400);
				});
				it('"trackID" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', trackID: ''}, 400);
				});
				it('"mbReleaseID" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', mbReleaseID: ''}, 400);
				});
				it('"mbArtistID" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', mbArtistID: ''}, 400);
				});
				it('"genre" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', genre: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('album/list', {list: 'avghighest', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('album/list', {list: 'avghighest', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('album/list', {list: 'faved', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('album/list', {list: 'frequent', newerThan: 'DYM%z'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/list', {list: 'random', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/list', {list: 'random', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/list', {list: 'random', newerThan: 69.67}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'avghighest', newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/list', {list: 'random', fromYear: 'cwf*87MMeN)'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/list', {list: 'highest', fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/list', {list: 'recent', fromYear: 93.17}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'random', fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/list', {list: 'avghighest', toYear: 'sne4HGm]twM!@aj'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/list', {list: 'frequent', toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/list', {list: 'frequent', toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/list', {list: 'frequent', toYear: 57.83}, 400);
				});
				it('"toYear" set to "less than minimum 0"', async () => {
					await get('album/list', {list: 'highest', toYear: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('album/list', {list: 'highest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('album/list', {list: 'random', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('album/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('album/list', {list: 'avghighest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('album/list', {list: 'avghighest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('album/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('album/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('album/list', {list: 'highest', sortDescending: '5(Y53D!!qI9)hf^QOxvB'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/list', {list: 'avghighest', sortDescending: -3232697094766590}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/list', {list: 'faved', sortDescending: 7821379399319551}, 400);
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
					await get('album/search', {offset: '8I#Mp[Ma]WxC4sY1C1e'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/search', {offset: 23.34}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/search', {amount: '3[Usz1ZwZwm9Uqb!1&vO'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/search', {amount: 79.59}, 400);
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
					await get('album/search', {newerThan: 'Fb$KzdzPxL@'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/search', {newerThan: 48.24}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/search', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/search', {fromYear: 'gszAdI^lX'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/search', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/search', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/search', {fromYear: 74.74}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/search', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/search', {toYear: 'QX2GB8(so'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/search', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/search', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/search', {toYear: 96.64}, 400);
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
					await get('album/search', {sortDescending: '6^qNghD)W*xv$'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/search', {sortDescending: 2385451327422466}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/search', {sortDescending: 489195193761791}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('album/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('album/search', {albumTracks: 'LFEM@kh1&'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('album/search', {albumTracks: 3875672648843266}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('album/search', {albumTracks: -3988847872442369}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('album/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('album/search', {albumTrackIDs: 'Nh9BO*sgyw'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('album/search', {albumTrackIDs: 526359663214594}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('album/search', {albumTrackIDs: 7446257236705279}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('album/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('album/search', {albumState: '[M]NbU%[N@gTG('}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('album/search', {albumState: 2537189355290626}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('album/search', {albumState: -6382266280312833}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('album/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('album/search', {albumInfo: 'w&rmX7oWi'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('album/search', {albumInfo: -3315101641736190}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('album/search', {albumInfo: 4334740618346495}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/search', {trackMedia: '!OF8l%voCRBq'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/search', {trackMedia: 4267605879685122}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/search', {trackMedia: -8322413909508097}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/search', {trackTag: 'rJlJ[NRr#budfX'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/search', {trackTag: -1141127260405758}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/search', {trackTag: 1929388119556095}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/search', {trackRawTag: '6!J6^Wz'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/search', {trackRawTag: 8866507178115074}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/search', {trackRawTag: -3139592702132225}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/search', {trackState: 'SQdLHm&yUW0K9kDS'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/search', {trackState: 5741047195893762}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/search', {trackState: -2549948981706753}, 400);
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
					await get('album/index', {newerThan: 'yYuY8XfNGvfS'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('album/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('album/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('album/index', {newerThan: 23.43}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('album/index', {newerThan: -1}, 400);
				});
				it('"fromYear" set to "string"', async () => {
					await get('album/index', {fromYear: 'G*7N#0K^qR58'}, 400);
				});
				it('"fromYear" set to "empty string"', async () => {
					await get('album/index', {fromYear: ''}, 400);
				});
				it('"fromYear" set to "boolean"', async () => {
					await get('album/index', {fromYear: true}, 400);
				});
				it('"fromYear" set to "float"', async () => {
					await get('album/index', {fromYear: 36.91}, 400);
				});
				it('"fromYear" set to "less than minimum 0"', async () => {
					await get('album/index', {fromYear: -1}, 400);
				});
				it('"toYear" set to "string"', async () => {
					await get('album/index', {toYear: 'OqBMUG5PxpwO53Urf#I'}, 400);
				});
				it('"toYear" set to "empty string"', async () => {
					await get('album/index', {toYear: ''}, 400);
				});
				it('"toYear" set to "boolean"', async () => {
					await get('album/index', {toYear: true}, 400);
				});
				it('"toYear" set to "float"', async () => {
					await get('album/index', {toYear: 88.81}, 400);
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
					await get('album/index', {sortDescending: 'Gq8Pb'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('album/index', {sortDescending: -1202872549113854}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('album/index', {sortDescending: 3966786928115711}, 400);
				});
			});
		});
		describe('album/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/state', {id: 'ZXbR)K9&!51x7'}, 401);
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
					await getNotLoggedIn('album/states', {ids: ['OgQwVL9ZC8C%3]jdN51', 'gcdXOnom4ydkwt']}, 401);
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
					await getNotLoggedIn('album/similar/tracks', {id: 'z7i03yb6sPw'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: ''}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'YiplF4GHKAfb8fp0Wu9', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'm2ysmv[Gpqge', trackMedia: ')c!06g#9SYQEiUv6*Ar'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'D*^an4MQ6B1phwwtSt', trackMedia: -4574260420935678}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'k*MNw[GdJp4@V', trackMedia: 7874325617049599}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'V5EuLq##fIFFG[icdDG', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'iq2oFkBRR', trackTag: 'zktROnkyK&7V5&RH'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'SP44OOK', trackTag: -1965414921797630}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'X6BWm@v0flHkRMERPs$', trackTag: -2034705880842241}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'BW&kGi7o2EzI', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'AwycxhMT7qz', trackRawTag: '^HjN%8^3geQN3TezdiLo'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'Qgvz0MWR^Ocx2#u!6j', trackRawTag: -5062245759320062}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: '^QE^$Vz0', trackRawTag: -1891833013600257}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '$B2vuOqZBvj', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/similar/tracks', {id: 'fN7lZYWo]zE', trackState: 'Z#qcs8z#CHtbdo'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/similar/tracks', {id: 'yzIERYT72e8L7iB#Y!d', trackState: 4954059094097922}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/similar/tracks', {id: 'f2L6k#aH0tG6K%lsM', trackState: -500760064294913}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/similar/tracks', {id: '9EmIIMK', offset: 'XRkg(8Q2R'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: 'tCFr$RMGtX0Dr@', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: '5^M6eZJl0', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'IXKk4', offset: 22.63}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/similar/tracks', {id: 'xmkvWjlc]zr', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/similar/tracks', {id: '1#5mMYIprlg(d', amount: ')d6sU%2L%WqE'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/similar/tracks', {id: '0u%rj', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/similar/tracks', {id: '$sU^5lBCg$G%BgXZCwo', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/similar/tracks', {id: 'XlbnjOrGZKsAr1Xr', amount: 53.67}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/similar/tracks', {id: 'eRuH^z5rS[6FB$', amount: 0}, 400);
				});
			});
		});
		describe('album/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/tracks', {ids: ['gS(6EU8q0d', 'ZC@weR#SFvhom']}, 401);
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
					await get('album/tracks', {ids: ['vkyuC4dsJS&i89pqHz', 'Q!A]hu['], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('album/tracks', {ids: ['Q9TT8[KVpvRi', 'xC!%1Db'], trackMedia: 'RS)SI[e#xKgtR*AaSolr'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['DxizltVAx#ZA^qYk62)', '%@3Y8'], trackMedia: -3829383190020094}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['t(@Fu2hNm', 'J4KRQh$'], trackMedia: 550198845636607}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['0i14Ej0^[A([Ajz', 'O!M$T'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['AXr(8j4zma8rn%d9QXIy', 'LG*)8aU5odqk1MpKAz3'], trackTag: 'p3]t78i2'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['lGY5W!lmNzI^9', '#^BnghqFcQQ5TyI7q'], trackTag: 3170781928357890}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['1U5!c', '8hGw5njhfeMX'], trackTag: 6115536949739519}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['qtQ#7VLyW0IWGzqFl&5g', 'OqmK['], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('album/tracks', {ids: ['DPICZMS!2xZYMWIWu', 'e%lzz%J03ndi$D'], trackRawTag: 'sDHIeBu3AzF)S8'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['V58svU47U8c$XDB', 'YEAUWNly*xOp0GCsE'], trackRawTag: 1319360127827970}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['EPJ[(K88m7', 'Az^p6ny9gBCbgWbMbde]'], trackRawTag: -1637323703844865}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['eXI4Kiw!', 'Cdwr([IT'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('album/tracks', {ids: ['O]gMl0dL', '5538WAggpiXge'], trackState: 'fJwu*NNd7QSFmZ005'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('album/tracks', {ids: ['&Sh(1JgYQz6bIqz5@', '7O5xm0y6QCUO@@D'], trackState: 3152980203274242}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('album/tracks', {ids: ['sNt2NgT@M', '7lQ[v8NLUzMGe6S@'], trackState: -3398187909906433}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('album/tracks', {ids: ['866!qt', 'eabo&IsHErB[dR'], offset: 'h!)EmMyQB'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['Y&qLEHJbz40#c&11', 'jDVq9s'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['E2tNonf^q)', '5FrOu1qFYAtcqOSDFKK('], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('album/tracks', {ids: ['k8jEf(8ku$4Oh7$kpq', 'jHrS*Y'], offset: 68.64}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('album/tracks', {ids: [')aZ@7g(C6m!r%@OVq', 'frYmKRP54g5$'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('album/tracks', {ids: ['$dF1ejtm^FxVXU', 'xZ9@Xw6bkIK9LX4XI2nr'], amount: 'MdXH%Aa8Q]GHFOhKzm'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('album/tracks', {ids: ['v4u#RzcKQR]', '^[UfEUXgHB2jhoh*J'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('album/tracks', {ids: ['7l[Ko8Qbc2srtEnX0b', 'LduiEmr'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('album/tracks', {ids: ['*xyT]X6hP9OfuHS4', 'o6%s4q&m5'], amount: 35.27}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('album/tracks', {ids: ['8LSGu5Qd', 'ZcPqx48(0#K0viE!B'], amount: 0}, 400);
				});
			});
		});
		describe('album/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/info', {id: 'l0[bC4jiZFhJV!NBTj'}, 401);
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
					await getNotLoggedIn('series/id', {id: 'W*RhAy'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('series/id', {id: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/id', {id: 'k%iNDT67e!', rootID: ''}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/id', {id: 'YmJHNmMZc8O*tw$a9F', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/id', {id: ']hxl*nxp', seriesAlbums: 'fj[V1ipjZoeYFd'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/id', {id: 'hQA$@wRs&^lksOJ', seriesAlbums: 5765682364940290}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/id', {id: 'yq7ebwucp', seriesAlbums: -7148651189108737}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'yjo^xnHD3Kb', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/id', {id: 'ARNlrTH', seriesAlbumIDs: '%lLwYZsR@]2AZR5&'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'b!JL3Qld95!@SI', seriesAlbumIDs: -4537800149958654}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: '^#xL5$R0', seriesAlbumIDs: 1292208103751679}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/id', {id: '6wZXGpmN', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/id', {id: 'DltVMa93I', seriesState: 'GOvK8'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/id', {id: 'pGn^Bo', seriesState: 810218199973890}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'xycSHUAj@22vZJyksWG', seriesState: 6021240154226687}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/id', {id: '9nuYbi)pApxxswihk8', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/id', {id: '69EG^&#^[', seriesTracks: 'uRYXSDMTKu)P'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: '9js^BGWxmZy#IE2', seriesTracks: -1325109503590398}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: 'H)u6[Af6r', seriesTracks: 5189698519564287}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'lLeuSZ4TmlKh', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/id', {id: '&*)c)x0jLjV[If', seriesTrackIDs: '5xtu]T!2'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: '^tPo!iwzwB6Vu%Tke7e@', seriesTrackIDs: 7929906512003074}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'biI]Mb', seriesTrackIDs: 3170227546226687}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/id', {id: 'esc^&4!]Z', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/id', {id: 'U77]p(u', seriesInfo: '!siuIVf&jxMx11Ey'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: 'r7]s2Pp@x2VApyA@nP', seriesInfo: -6718614635806718}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: '1t4sMfrBBuL%A3awyvp', seriesInfo: -7973612959039489}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/id', {id: '4RrGldIei(*j5NpuA', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/id', {id: 'Fwbl7n8n^3N', albumTracks: 'it(1Z)s(Oj(V'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/id', {id: '31*Hi]vI', albumTracks: 1421482777378818}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/id', {id: '&qrdZa1*OB@V%HMSGrgP', albumTracks: -8218088751235073}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/id', {id: 'eJgJ7rPe', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/id', {id: '#Psk%', albumTrackIDs: 'C(4TU'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/id', {id: 'K7DPC&b^OYUfFAKX3', albumTrackIDs: 2448555746787330}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/id', {id: 'I&CqqBjJzrdEMqQ8JP4', albumTrackIDs: 8082391117594623}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/id', {id: 'W@Jit', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/id', {id: 'RvBh19!Uz3Og!X', albumState: 'c34osefM'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/id', {id: '^&n@HmLdtGvZSx^Einy', albumState: 8410766910685186}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/id', {id: '2hz[&^F', albumState: 2232684688441343}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/id', {id: 'GCs1M^j*', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/id', {id: '43Z[pr2#tQTZS!u', albumInfo: 't#]nX@0uj^Z^Hzqm6O!Z'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/id', {id: '[XN!x6AqWpLSVzb#PX', albumInfo: -3252062867423230}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/id', {id: 'U%4r0)PF', albumInfo: -7700008623144961}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/id', {id: 'YrpFZ4q3flX1llF)', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/id', {id: '5*urIfGZ#^xj', trackMedia: '4(UFhTl'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/id', {id: 'F$1nGscvmceZpi(Unb', trackMedia: -4355461167972350}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/id', {id: 'SSPU^VE)', trackMedia: 636317226500095}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/id', {id: 'lLBse', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/id', {id: '2D^rke%@2GXZYqohn', trackTag: 'vQQQVL2XcAxa'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/id', {id: 'bpYI%Z9lSoD*O^1O', trackTag: 2692190790746114}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'O#IPNBL1KL]!', trackTag: -2090523561033729}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/id', {id: 'JDKtmJlJzAg6EqGt!5', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/id', {id: '&U16Jh)', trackRawTag: ')Tby0%n0(t'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/id', {id: 'muWS@', trackRawTag: -7660145878237182}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/id', {id: 'S46$jNUu7gnC', trackRawTag: 3582861940621311}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/id', {id: 'aXo0*se]a', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/id', {id: 'cSu91d!R4!8d', trackState: '&jNl$9!e^yu%MIS)'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/id', {id: 'SY[Az(2$R%CxC1D', trackState: 8622632979136514}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/id', {id: 'G)#1HugjbYKTxazZj3', trackState: -8321744800579585}, 400);
				});
			});
		});
		describe('series/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/ids', {ids: ['o0FJ]zxmJxdEw', '7#QBH&e63llQCt3']}, 401);
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
					await get('series/ids', {ids: ['Ix9kN', 'p%pTmM'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/ids', {ids: ['GfxpKLQ', 'flw*3B[nT]9yN3'], seriesAlbums: '^![xM(a4F0n]!&^GW'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['!A)101Y(4', '6%4]I@lE5(BiNl0'], seriesAlbums: 8192979344818178}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['BQmDjPHj', 'iCfCk@oIVyu)'], seriesAlbums: 8673938947178495}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['kpEu#]0', 'ULQ9q69BJYV*6l3Iwr'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['I%S5l3J2gIJ', 'RjrfExbgb['], seriesAlbumIDs: '!ziQfLFP]LQyuRhvkN@'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['1mmjHW', '8SwPs'], seriesAlbumIDs: 7056012431327234}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['PWVgYZ]ZsN', 'z0iQTj5]'], seriesAlbumIDs: 4573768080949247}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['EV*!n', 'g7U4qgTKJHnvM'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/ids', {ids: ['eh6vR7Zum!%', '(IEr]eiB4jC'], seriesState: '#rd!&dB[SjC(kh*xlV)'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['CHOkd6k#8os*X@9S', 'aIdPNIJ^gyz2'], seriesState: -1379440776970238}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: [')u4AI&W*YXZo*U', 'N#my2dqQ6XkNzFf2TcE'], seriesState: -5274583330455553}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['fSRN)zWuvs@WXgmgc%ID', 'b1@G3T$zH2Qd#W95B*l'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['DFxu[qfHv&[z)5uMwz', 'MhS%TbAHR3dSwzhrZ'], seriesTracks: 'GORSd7B(J#wma1H'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['q3L6oLKE8$2', '#5OCv3rq007nx'], seriesTracks: 6105912750112770}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['!1QZ[uPk', '%z4iBQn'], seriesTracks: -1259056010362881}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['lWqP)%2eJo7SBE', 'RvE00BxTOkSA'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['Y7HgU', 'nb8!DYabROpc#'], seriesTrackIDs: '4HP&nW'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['3pl^]9ZqlX7)xgVY', '1Ydb2K0!WJ%^gl'], seriesTrackIDs: -6278044268363774}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['U][8s(XrR5H$sIfc&1E!', 'bNokq)'], seriesTrackIDs: 2729154780856319}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['YFHkgIDEdk', '@4wda'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/ids', {ids: ['ejBtez7%C', 'H9M0t(&'], seriesInfo: 'liKOmiY^V8yZz99ctrNA'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['IP^57BUHmaVnnR', '^TMgz@ooj$#3'], seriesInfo: 7119387647541250}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['D[J(SQ)la', 'oJ^FEN65B%6viM'], seriesInfo: 8088824492064767}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/ids', {ids: ['!tUI9tb!7u]m)Mi$', 'iQ4zo9(i%UTfkCPGC1a'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/ids', {ids: ['T[^LnicXWLurZT(]6', 'uHYl#!!TjFztA30CPb'], albumTracks: 'uTs10QZ)'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['[5(cmStbje5Fh^I', 'bkJ&2%^M&Fv&TWTRE'], albumTracks: 8457943875846146}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['AKcD9waCMg5ZSD!K%z', '^#9ZjAJHArGG'], albumTracks: -4864596036812801}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/ids', {ids: ['Q#&m7K#8JK)A', 'hYNdmAV'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/ids', {ids: ['27%uj%*Nw]Q', 'UN3n)lGs6cI4aTZr)'], albumTrackIDs: 'ylpXM)QtX'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['QajO*bMeK[', 'r5uh!C66S'], albumTrackIDs: -855481463603198}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['$[2buSSq^3cMUhaQ', '%f2TD)2tXJ5rew[*cnsV'], albumTrackIDs: -5630874942963713}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['01%^M4R(wSu', '9D3vu*e5Piyo'], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/ids', {ids: ['Dr(XkYRF!(Io', 'S!AP%UrVX%yQAcoV(5c'], albumState: '[TTAENBW&x'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['3NeAU09Glb', '9aOb6lV(A0'], albumState: -3636641000325118}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['CmU[kmwecrMP', 'esSa)u1v2^p'], albumState: -3617910157213697}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/ids', {ids: ['RQD&Ek5NSKR[VfDe8$Su', 'm[]SkO'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/ids', {ids: ['[TzrCk^Cpe', 'i#wKtMJIENXp[$0'], albumInfo: 'e4O@W]kZ]7V12pZkR4'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['q4d0xuy&uzdeSQI820T', 'NIc^F*28!QC&sj%9]'], albumInfo: 7354059556126722}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['EF(WG$yovw', 'S5FEI'], albumInfo: 7182989880459263}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/ids', {ids: ['HRszOvwZ', 'q[hIdTdKnu'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/ids', {ids: ['Q3XW9imj@p9c^b7^Ky7h', '!I8J&o*8EABZ8V#VL'], trackMedia: 'MvI%r['}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['PDW#1zn4zjt6n0H', 'odlmLYBV%D$rJ3lH'], trackMedia: -6844102721142782}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['GJ1wgG(ZzkE(lGTgPSur', '4nzcGZSu6[rA2T(L'], trackMedia: 8293636705878015}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['rZSBB]HTHnT', '*[7P^q6B6t3'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/ids', {ids: ['AOZ$aaabyKOvjqWP7', 'RV)d&3@wT'], trackTag: '6HwLmdB%vDbV5y'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['bE5lJW#q%voJ)wPG', 'NRkrN0issv3s8*2U1'], trackTag: -2597175796170750}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['8fkQ2RDHBa', 'NK08^(VlmX&^6Xl@RM!0'], trackTag: -8804116302135297}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/ids', {ids: ['$1LcUa&', 'rTO8]tNoZl3W6p^]H'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/ids', {ids: ['5etfP4)6bq70i1', 'Kyd19EUplZfk!12Z!aHf'], trackRawTag: 'Kf(B4'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['sGEbq7ZMJ6Np4L', '#P3d4FBq0'], trackRawTag: 3695346928582658}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['AeEGoY86', '[730)'], trackRawTag: -7540760056430593}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/ids', {ids: ['fL*b]jfnc', 'fTfvQHhR9T6zOFUN'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/ids', {ids: ['8813er*XQeLlgW@8Y', 'iPlB7jQKHso9u0'], trackState: 'oI[GKNY#*fXq$4QY'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/ids', {ids: ['Q^@oS#Q4#N1Zo@wzF', 'F3NaT6gjW4%z)kjldz6X'], trackState: 5262038158802946}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/ids', {ids: ['M#YOFmd6hO&bzLh9^2!', '4]UV8fQ#$hPNOq5vJH'], trackState: -8622918057590785}, 400);
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
					await get('series/search', {offset: 'PpJ2x3Mf'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/search', {offset: 24.77}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/search', {amount: '#N4OfH'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/search', {amount: 11.54}, 400);
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
					await get('series/search', {newerThan: 'TPb^aX8ckN2'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/search', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/search', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/search', {newerThan: 25.57}, 400);
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
					await get('series/search', {sortDescending: 'HgYbOG&'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/search', {sortDescending: 5327966422695938}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/search', {sortDescending: -4576995585294337}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/search', {seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/search', {seriesAlbums: '2UdrQhBOK'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbums: 1382977007255554}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbums: 1940517155766271}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/search', {seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/search', {seriesAlbumIDs: 'BJ2w2iSjhLp#vnKYd$3'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesAlbumIDs: -2954597425479678}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesAlbumIDs: 2331492252385279}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/search', {seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/search', {seriesState: 'VU1gWYTBe)GD#i'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/search', {seriesState: 6795654852509698}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/search', {seriesState: -3345132355059713}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/search', {seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/search', {seriesTracks: 'V]vAFlL#m[ZBa7yd*'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/search', {seriesTracks: 4434721870184450}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/search', {seriesTracks: 4998668205686783}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/search', {seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/search', {seriesTrackIDs: 'nVE3RI'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {seriesTrackIDs: 7089085671800834}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {seriesTrackIDs: -4209533119365121}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/search', {seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/search', {seriesInfo: '$%uONLF$hm$w!qJ[6U'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/search', {seriesInfo: -5847405568196606}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/search', {seriesInfo: -7723966596644865}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/search', {albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/search', {albumTracks: '1o9RM&t$inz8'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/search', {albumTracks: 2003895740006402}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/search', {albumTracks: 1911755114545151}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/search', {albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/search', {albumTrackIDs: 'gMZ4T]f4u'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/search', {albumTrackIDs: 2065580978864130}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/search', {albumTrackIDs: -2240485095636993}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/search', {albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/search', {albumState: 'hWdj7sRx#(@1csPUW'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/search', {albumState: 6208102500139010}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/search', {albumState: 164815318286335}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/search', {albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/search', {albumInfo: 'G)lTZCogQ'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/search', {albumInfo: 7416105144418306}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/search', {albumInfo: -7818667567874049}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/search', {trackMedia: '#@ZZVb4q)FbJ3'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/search', {trackMedia: 3561820774203394}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/search', {trackMedia: 68055031873535}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/search', {trackTag: 'pAVkDjA(l$JJMWHC43'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/search', {trackTag: -5763657224945662}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/search', {trackTag: -4840464914055169}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/search', {trackRawTag: 'TYyLufjhZ'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/search', {trackRawTag: 1783836354543618}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/search', {trackRawTag: -7692152175853569}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/search', {trackState: 'jEU&5jC'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/search', {trackState: 7514861923729410}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/search', {trackState: 5805570615410687}, 400);
				});
			});
		});
		describe('series/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/state', {id: 'th!)JbnBIjj&^B8UL$7'}, 401);
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
					await getNotLoggedIn('series/states', {ids: ['8qRTZt', '75$M(*2']}, 401);
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
					await getNotLoggedIn('series/list', {list: 'avghighest'}, 401);
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
					await get('series/list', {list: 'avghighest', name: ''}, 400);
				});
				it('"rootID" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', rootID: ''}, 400);
				});
				it('"rootIDs" set to "null"', async () => {
					await get('series/list', {list: 'faved', rootIDs: null}, 400);
				});
				it('"rootIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', rootIDs: [null, '']}, 400);
				});
				it('"albumID" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', albumID: ''}, 400);
				});
				it('"albumType" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumType: ''}, 400);
				});
				it('"albumType" set to "invalid enum"', async () => {
					await get('series/list', {list: 'faved', albumType: 'invalid'}, 400);
				});
				it('"albumTypes" set to "null"', async () => {
					await get('series/list', {list: 'random', albumTypes: null}, 400);
				});
				it('"albumTypes" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', albumTypes: [null, '']}, 400);
				});
				it('"albumTypes" set to "invalid enum"', async () => {
					await get('series/list', {list: 'random', albumTypes: [null, 'invalid']}, 400);
				});
				it('"newerThan" set to "string"', async () => {
					await get('series/list', {list: 'random', newerThan: 'TL9dzEKJlQuM7'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/list', {list: 'avghighest', newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/list', {list: 'recent', newerThan: 20.75}, 400);
				});
				it('"newerThan" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'highest', newerThan: -1}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('series/list', {list: 'avghighest', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('series/list', {list: 'random', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('series/list', {list: 'avghighest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('series/list', {list: 'faved', sortDescending: 'zE7!y@9a)ggA'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', sortDescending: 8370508202508290}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', sortDescending: -3906329689194497}, 400);
				});
				it('"seriesAlbums" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/list', {list: 'recent', seriesAlbums: 'a9IzzScsbc%'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', seriesAlbums: 525886583472130}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', seriesAlbums: -3305472517996545}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/list', {list: 'highest', seriesAlbumIDs: 'rpyjRqagA'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', seriesAlbumIDs: 6811995210776578}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', seriesAlbumIDs: -1669095917355009}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/list', {list: 'recent', seriesState: 'U1WL9NTgt8%qVar*zmgf'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', seriesState: 1368572869738498}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', seriesState: -1155287494950913}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', seriesTracks: 'p4kj)lLJC'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', seriesTracks: 744961603534850}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', seriesTracks: 7664593337843711}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'random', seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'highest', seriesTrackIDs: 'f(q6#QA@g5'}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', seriesTrackIDs: -1133687966007294}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', seriesTrackIDs: -8454513606262785}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', seriesInfo: 'Q&5Pzz9h'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'random', seriesInfo: 4677941136982018}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', seriesInfo: -1760729392742401}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/list', {list: 'highest', albumTracks: 'DyMU46HRadGm7@pY8z'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/list', {list: 'frequent', albumTracks: 6734046470078466}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/list', {list: 'random', albumTracks: -4219104105857025}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/list', {list: 'random', albumTrackIDs: 'lJ5Xu]0g(x'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', albumTrackIDs: -7505630126407678}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', albumTrackIDs: -8370818807496705}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/list', {list: 'random', albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', albumState: '%4fnqOnfEUKUqaUL3U'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', albumState: 4564004101947394}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'random', albumState: 7681306880114687}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/list', {list: 'frequent', albumInfo: 'r$4$[iZPWUZzeu$*%)FB'}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/list', {list: 'avghighest', albumInfo: -4152197579276286}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', albumInfo: -8494515941801985}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/list', {list: 'highest', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/list', {list: 'recent', trackMedia: 'fXCA%q^!SZmZU9Or'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/list', {list: 'recent', trackMedia: 2890350037303298}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', trackMedia: 4304550030737407}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/list', {list: 'avghighest', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/list', {list: 'random', trackTag: 'jK!Uk$OiwGHkZO0U!J'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'faved', trackTag: 4009161616523266}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'highest', trackTag: -5883056523051009}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/list', {list: 'frequent', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/list', {list: 'highest', trackRawTag: '&DuH*2Um3qQet'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', trackRawTag: 3949103427878914}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/list', {list: 'frequent', trackRawTag: -3037427870466049}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/list', {list: 'faved', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', trackState: 'FGa*HpW3IlSe97M9S'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/list', {list: 'highest', trackState: -7497623992795134}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/list', {list: 'faved', trackState: -4208873917382657}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/list', {list: 'avghighest', offset: 'FsQuh0co&'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/list', {list: 'avghighest', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/list', {list: 'faved', offset: 34.37}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/list', {list: 'avghighest', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/list', {list: 'random', amount: '8o7vFZzo'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/list', {list: 'recent', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/list', {list: 'frequent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/list', {list: 'highest', amount: 94.64}, 400);
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
					await get('series/index', {newerThan: 'l)aKS'}, 400);
				});
				it('"newerThan" set to "empty string"', async () => {
					await get('series/index', {newerThan: ''}, 400);
				});
				it('"newerThan" set to "boolean"', async () => {
					await get('series/index', {newerThan: true}, 400);
				});
				it('"newerThan" set to "float"', async () => {
					await get('series/index', {newerThan: 64.09}, 400);
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
					await get('series/index', {sortDescending: '0$zW6SoeJI]9k'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('series/index', {sortDescending: 785027545694210}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('series/index', {sortDescending: 5796122274562047}, 400);
				});
			});
		});
		describe('series/tracks', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/tracks', {ids: ['nzUa0xBkgzrh[gbL', '3UowMqOWlTHrbXT)']}, 401);
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
					await get('series/tracks', {ids: ['MGbA[ee)IPZ0l', 'jbA@3EbTQysMi$o!X8'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/tracks', {ids: ['lLE5)Km$tuSd', 'e1yC58M#1o'], trackMedia: 't*Z7a^Ss2$C'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['O^MZS]3c', 'S5Jr8Wa*U5E)l^YO6r&F'], trackMedia: 886582089351170}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['JT22@2^2O3@^YK@ZJ', 'hZ5ppM'], trackMedia: -5912047258697729}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['$GN5nkkkC57R)9', '%2WOCPwGQEAFL%&E^2'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/tracks', {ids: ['eThFMqy6oLTAy', '^Q8DnaKUc02)K'], trackTag: '[9tEL#DfpwdFw'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['HPfPG&', '3MyJ&*l'], trackTag: 4832683062460418}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['xxa^oltFM', 'uI1eDEetGc@Wc*Y'], trackTag: 5618841535119359}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['@sNRPox', 's8E&i*5(o'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/tracks', {ids: [')&]aBx', '9jSrLE#PDP2wSNwDweT'], trackRawTag: 'r&NHgTo5$1e5%AV'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['7(LLn#SlbbG@jai0t', 'cmL$7wfLDB#'], trackRawTag: 1524394098688002}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['UgG0&i*', 'Kd8js)D%D1'], trackRawTag: -4570492975448065}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['K5a4A1F#F1uwM@W', 'MVh3vFfxx77'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/tracks', {ids: ['D%ecQeT#9khW!PZ', '0Wyhxh%Nea[%wEOIlUe'], trackState: 'IgF1G]*!DZR2QPfO^'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/tracks', {ids: ['pPa7TjM@bK', 'dBUe*[BUm@@nVe'], trackState: 7674922134405122}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/tracks', {ids: ['W!)qEGNp9MDs5[bn', 'eGrAI'], trackState: -7596228896358401}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/tracks', {ids: ['US!S2bIFGRuaK&#Ii', 'qbWXwvq'], offset: 'nC6uFGeOfI%KvD'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['B3hxbqeug@A2gv5WzXL&', 'kkpWteqWEjO6L6e'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['uDcZzP#e3K8Q)yaf', 'TDaPyr@z'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/tracks', {ids: ['T)&RywiJcboZsV(F', 'RxJAJpUyR'], offset: 51.81}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/tracks', {ids: ['5XM4N7Cb3M%Iud6ozgW', '%G^gtR0c'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/tracks', {ids: ['tie@zCzes70RB', '^*mVW[T!gdFzN0GKb'], amount: 'ylcGpnbXh8g[1M&['}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/tracks', {ids: ['%m%&k*r#voTQyKSIQ*', 'SFEATxaj]sVu'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/tracks', {ids: ['f$Ar3554b8KebrgAM', 'p^[emMvRoPWp'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/tracks', {ids: ['oiyepJts$Ir%', 'Kr4EMjsMxXu#b'], amount: 75.96}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/tracks', {ids: ['*nYoG!', 'GygTKPVDge7(NznSR*'], amount: 0}, 400);
				});
			});
		});
		describe('series/albums', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/albums', {ids: ['X%n]@0*edX', '6peR1GfEcAy$lz*NhC0F']}, 401);
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
					await get('series/albums', {ids: ['7RtP2E0fB3]a[W!z', '4fiycT1P!S9iFOI'], seriesAlbums: ''}, 400);
				});
				it('"seriesAlbums" set to "string"', async () => {
					await get('series/albums', {ids: ['Rglv0mCjaN', 'nk&oV(qx*Ss'], seriesAlbums: 'MIPqmMNtnl3t#FFe'}, 400);
				});
				it('"seriesAlbums" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['*cvITf5gG8*^', 'lQ9nI'], seriesAlbums: 258148438900738}, 400);
				});
				it('"seriesAlbums" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['sXhKkRRVXZfZY', 'NAg&eh^'], seriesAlbums: 498887072677887}, 400);
				});
				it('"seriesAlbumIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['UX9%rqi6zT^TtO]i', 'GdE]m'], seriesAlbumIDs: ''}, 400);
				});
				it('"seriesAlbumIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['U8QRHPOX', 'aNKjbj)g@qEMY'], seriesAlbumIDs: 'aAEl6ui6F^J!'}, 400);
				});
				it('"seriesAlbumIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['3WOUkhwoRyevPL', 'xseAFB8LPBlL78lsp'], seriesAlbumIDs: 5105385883041794}, 400);
				});
				it('"seriesAlbumIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['kkDjj', 'Nj*HiY#2Kv'], seriesAlbumIDs: 5777743274835967}, 400);
				});
				it('"seriesState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['D5TPdk9Hyu9[N#g4@', 'HkRf0tP'], seriesState: ''}, 400);
				});
				it('"seriesState" set to "string"', async () => {
					await get('series/albums', {ids: ['eE7BFmcmEmBI!ew', 'ogg4Ruq$ty2$mbWNq'], seriesState: 'PmzLMb6mEl'}, 400);
				});
				it('"seriesState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['m$N]t)Ifp)rXvDra', '#Mbgnz666[C&fwPAjzk('], seriesState: 6594181350817794}, 400);
				});
				it('"seriesState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['aeaBJ', 'TD&%4p^$9k@@BiwzSY^'], seriesState: 5649447610482687}, 400);
				});
				it('"seriesTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['IBOY8MS2', 'ghg9Jx%oGq2'], seriesTracks: ''}, 400);
				});
				it('"seriesTracks" set to "string"', async () => {
					await get('series/albums', {ids: ['[Io1eE)^HdQi^lf4VTrD', 'UjmqAOW65'], seriesTracks: 'iN]xKw'}, 400);
				});
				it('"seriesTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['YEQ5jj!', '3lvdtFh*f]b4Ut4'], seriesTracks: 7145912631558146}, 400);
				});
				it('"seriesTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['^xToEnpD', 'MFqoKblXqrLSPy'], seriesTracks: 7669636535418879}, 400);
				});
				it('"seriesTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['XUeWK0', 'vE(6C#sZ6k!LF#fb'], seriesTrackIDs: ''}, 400);
				});
				it('"seriesTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['ncvyBXn9JWJf', 'd&6h^'], seriesTrackIDs: 'T7qFvRgv!z2qMO]bj['}, 400);
				});
				it('"seriesTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['6kn0UXaWf', 'rLUu%lgygfOj2FC24oa'], seriesTrackIDs: -5466414882226174}, 400);
				});
				it('"seriesTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['3(h[qWk&', '8m9wINSK'], seriesTrackIDs: -590089059041281}, 400);
				});
				it('"seriesInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['F]ND7dLD@jm9$!&', 'fVg0xfqm'], seriesInfo: ''}, 400);
				});
				it('"seriesInfo" set to "string"', async () => {
					await get('series/albums', {ids: ['P77](Mj]', '[7916(*v@B3V'], seriesInfo: 'Nyz#F6vZQaU&'}, 400);
				});
				it('"seriesInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['l81F8#)HMBnWAa^', '9$UWv65sh40'], seriesInfo: -3865034505584638}, 400);
				});
				it('"seriesInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['(]XthiV22zB', ')C&VH2N!NlQeNL*N6tx'], seriesInfo: -7123843386703873}, 400);
				});
				it('"albumTracks" set to "empty string"', async () => {
					await get('series/albums', {ids: ['dl5#adB4x$PFH^l3k!)', '[NDIDTexa]*uYaR'], albumTracks: ''}, 400);
				});
				it('"albumTracks" set to "string"', async () => {
					await get('series/albums', {ids: ['(BDqsVc[1znBD5', '#Wys(7EWH0@'], albumTracks: 'c(byqmlBZYaMZacU^I'}, 400);
				});
				it('"albumTracks" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['m4qnzD2hUy!', 'wIZG3i7r$S]mQx'], albumTracks: -185530662780926}, 400);
				});
				it('"albumTracks" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['sSzu&Y]FH(j', '[(7tGDf]^'], albumTracks: -2632467945095169}, 400);
				});
				it('"albumTrackIDs" set to "empty string"', async () => {
					await get('series/albums', {ids: ['QWZ*w', 'g6k$V1hQT(O^'], albumTrackIDs: ''}, 400);
				});
				it('"albumTrackIDs" set to "string"', async () => {
					await get('series/albums', {ids: ['j^l[O(lAd#gx0[qCS', '&rXgKr'], albumTrackIDs: 'K)diOxxZ7n8t]v'}, 400);
				});
				it('"albumTrackIDs" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['BHRBET9q)8G', 'dR[&L@Vu[fH&Ka8rBge'], albumTrackIDs: -1519292277325822}, 400);
				});
				it('"albumTrackIDs" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['ZHCX7J)^8*jE%JYAwY', '[#rIU1Ffsp*fDjn'], albumTrackIDs: -5571830337241089}, 400);
				});
				it('"albumState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['CC&c&mFJ', 'Sax313lWXhG('], albumState: ''}, 400);
				});
				it('"albumState" set to "string"', async () => {
					await get('series/albums', {ids: ['AljTF@u!nBLALTgrfyq', 'LGiwukvDzjNs'], albumState: 's^HL9#ZW'}, 400);
				});
				it('"albumState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['&(ns6u[xz@hw*uYb', '7E!Y4TsceB9VLSvyOk'], albumState: 2038055011614722}, 400);
				});
				it('"albumState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['Fok62rcOp#q', 'BB5GbmQSgnDR'], albumState: 4268043878268927}, 400);
				});
				it('"albumInfo" set to "empty string"', async () => {
					await get('series/albums', {ids: ['O[ynlts^)$', 'hBS7p'], albumInfo: ''}, 400);
				});
				it('"albumInfo" set to "string"', async () => {
					await get('series/albums', {ids: ['krqDFuIJe3UY2v', 'FL[Sby@A2ae'], albumInfo: 'JLtJJB)U['}, 400);
				});
				it('"albumInfo" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['QZVlVa3]#i', '6w#&$iRBk'], albumInfo: 5223499060740098}, 400);
				});
				it('"albumInfo" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['oUo39sX6]5kE&t', '5gRXFtkthN87A7IO'], albumInfo: 4953071255814143}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('series/albums', {ids: ['9mceE7(&K]1%pXHe%[J*', ']WNW*@J[zkjrA'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('series/albums', {ids: ['A&m@tWRdttGKh', 'quUeDg^K*Sw5&ho'], trackMedia: '8HkzTpO*Q1'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['KDkKLK9SODyLmi*Spz#q', 'yuUdD'], trackMedia: 4245017333858306}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['s2z!ITbeDwrDSx^ZB%', 'Y(qu9HIZ13UK]#28sCL7'], trackMedia: -878259537444865}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['g&*9qqsCDtDdQtwnNqZ', 'zg3aL'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('series/albums', {ids: [')Ya(i]9', 'kBEMZt5vyXL&Yw3S3U'], trackTag: 'ktPhY]uX5J'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['t0dZ*2LkOltF', 'l1bcl(t)JBuVELSaB5w'], trackTag: 1646659738009602}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['ym$aceCxZ!)8', 'BCqbZ8'], trackTag: 7384690675679231}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('series/albums', {ids: ['1S0avQPB', 'C]hx]&wXMtQ%LH1'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('series/albums', {ids: ['T]DOoJ!k86', 'pfX)YGqOY3bT3Dkiwr(g'], trackRawTag: '#*h6i'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['WbrN]K^35qH3)', 'B7!i$JXW'], trackRawTag: 1113759460360194}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['S5N2jBiCV&PT', '$Hcg$c@1G&'], trackRawTag: -7004098750578689}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('series/albums', {ids: ['i0ac1uD(TTPxZ1AAq', 'h#LF[Jqb*'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('series/albums', {ids: ['$JXHRjVDsvAERkSoLHxA', 'X1rmcRJoXm%Rs[XFIk'], trackState: '!ri3Qn$TyIUp(ywspIZ'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('series/albums', {ids: ['D%dls(%', 'DFD2g&Ujo6N'], trackState: -2012598719479806}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('series/albums', {ids: ['XLG#pHT]O!i', 'YTzRMC'], trackState: -5584339588874241}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('series/albums', {ids: ['YF9m]9Ifx^B@1U]hm', 'yGi*Oaicg'], offset: 'FbxD65GMX42eJzN4uB'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('series/albums', {ids: ['tlVUW]g&4', 'sR(rEGFT]%S'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('series/albums', {ids: ['kq]WUxuvGIQj', 'w]6xM9s#2$Si%n@'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('series/albums', {ids: ['JA$c6DHC8*DOxInr', 'lCb%s!3RuYqOBssnTCs'], offset: 37.28}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('series/albums', {ids: ['Z]gjqdAFY[te', 'mi%pWka3'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('series/albums', {ids: ['HyqIW', 'Yqcs&!]YqGLBF'], amount: 'q)]RndRaj6mC7&l^*me'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('series/albums', {ids: ['cJTWz48HWE7IwLNne', 'lnMxzbM^62HXNv'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('series/albums', {ids: ['G5Y@oi', 'X]t$dF9LANy315s]cV9'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('series/albums', {ids: ['TUvJF39', 'L6$yBT'], amount: 61.83}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('series/albums', {ids: ['fnF[@29sNrohmp', '$[h6R^Jl'], amount: 0}, 400);
				});
			});
		});
		describe('series/info', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('series/info', {id: 'r[LMxna^jowmF8#j8If'}, 401);
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
					await getNotLoggedIn('playlist/id', {id: '7Vpr[2*x7DpcpV'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/id', {id: ''}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/id', {id: 'E^()Nqb]Z', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/id', {id: 'RZl&0DdmoXwWD^', playlistTracks: 'Djo5xsN)9p)'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'YOzwuL6J%&3uh', playlistTracks: -78597071044606}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'IIwoq^c', playlistTracks: -331909540347905}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/id', {id: 'u%f141', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/id', {id: '1&mOdO^^CiIqN8ZY84', playlistTrackIDs: 'WjytWbWATedGCmHcQHz'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'vjr1q4x1zi9E1H', playlistTrackIDs: -2232421130960894}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'cNIua$EcQsu1LhqEz', playlistTrackIDs: 256159147622399}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/id', {id: 'zy7!y%pisSo(dVGQ9ZR', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/id', {id: 'e3C3c', playlistState: 'MZIDetr7'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'eZvMvL', playlistState: 8902897760731138}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: '[(x@d', playlistState: 2694673097293823}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/id', {id: '0N3kQdmYfp', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/id', {id: 'e&qnO4BIx*iu*Q3P[', trackMedia: '[2QRMKDpwel'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/id', {id: '6TI[V8n4&HRf', trackMedia: 6389519171452930}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'U@70DA8IT^', trackMedia: -8656521332260865}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/id', {id: 'G8GpJj8NaVw3dExt', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/id', {id: 'nyWrv1cQgLWVvxns', trackTag: 'D$9BCUQoPo)E*'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'h@Ujp8', trackTag: 4243615006064642}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'GTq)9f@7nVl#4*L', trackTag: -5197679701262337}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/id', {id: 'Nb)Sg', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/id', {id: 'ddjj8&HnO', trackRawTag: 'W*8TN'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'kgZM5^', trackRawTag: 4389111158800386}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'MZuCUyfb6', trackRawTag: -8759379138445313}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/id', {id: '2l2u[FYB^Tw@KQQhK20A', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/id', {id: 'gw5SZgoagubGQVpT4f', trackState: 'uxZRTfRqtRETu7h'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/id', {id: 'hYD!(R6Ai$XTuX', trackState: 6521125798412290}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/id', {id: 'Dg&i06M[m%u5', trackState: -5387734180954113}, 400);
				});
			});
		});
		describe('playlist/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/ids', {ids: ['L%t0fq6Mm8SKUzQ', 's[sqcQ7S$']}, 401);
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
					await get('playlist/ids', {ids: ['[gp&NH$OZojBNc%hVa', 'B6S21b8Andjdf)vBIDg'], playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/ids', {ids: ['(n!0utmXRZYF3nw', '8wtd7T'], playlistTracks: 'No3zGxLo'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['HsQeWR@B', 'a$xJ&$Lcow(C4'], playlistTracks: -5405115083128830}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['YqaT1#hkBus@GM&ePDqX', '7Uu!WSh)eP74q@M'], playlistTracks: -652652622905345}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['T*Vf*GB0zSOS*v&', '85v^jh4[SpKKiRH'], playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/ids', {ids: ['%%r1l*YvcoV[nlT2', 'kFAT1wf'], playlistTrackIDs: 'n)BBTszv1VZ34FL6]'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['t61nbfuF5hHaedB', 'QLDR3i4'], playlistTrackIDs: -8788844690276350}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['eOjHJOl', 'Iihe&*v]^K]9eO7W'], playlistTrackIDs: -694967399874561}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['Wmq8O]!k6a*4UJNOuq', 'WAFsPJM'], playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['10zY(%Ez(R', 'a@ExFtLmznpQiS5ER7'], playlistState: '4CaUbp7N'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['rb$xn3WNB1', '[DNZce9#yb)'], playlistState: 6910373147967490}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['#k()g*cFCz30F7O$HS$', 'mVR9r2IYb&8AI'], playlistState: -5054070616227841}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['wwvKy', 'qcMCQ9O]WSDx@'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/ids', {ids: ['YQAn)E8PY3p($', '4@V%@w8)(5N'], trackMedia: '*9aW$'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['zVKd$d$B1VWab6pvzO', 'QjDtIM9QqRE)o60'], trackMedia: 646978740420610}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['cTV3h[@D', 'RD^Do3!ULB]j!oa'], trackMedia: -5657900349390849}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['RIhexG*%HEYDye%V', '2pJMdqAK$8E2b8j%wt'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['*YxrBJCBFmAHWKX^', 'I!caASkCc37eNw5AY(n'], trackTag: 'cuyjzuDq'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['cL0^^', 'WO*FBVm(z3h3X16Pf'], trackTag: 8913172211695618}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: [']Rm5z83@(oLWv]E', 'ZR]Z1yEt^XM'], trackTag: -6939865904054273}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['C]zaWM)Wk', 'Hfv5SdYL$2'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/ids', {ids: ['xciem)*2EKv8RonXnI', '8aN%5$Git7'], trackRawTag: 'kZiwIhZNm8U'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['aJ2nbHlPsdFuoX', 'S#NqUyu3*2'], trackRawTag: 191414126247938}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['q^]SKiXs1Kmc8ds)', 'mSsz7PY(ej(81'], trackRawTag: -501527844225025}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/ids', {ids: ['kNb7hjOqv$d4L8Bly', 'YZgoV4%0x8'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/ids', {ids: ['!HhhqYdu][oX', '4B^A[a#Cl*IYD'], trackState: '(e##yOLg5]A%oOGFH1wC'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/ids', {ids: ['PYlXMVU#@784p', 'WMA*%B#'], trackState: -2241777364893694}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/ids', {ids: ['K#[P&5caTAMut5Xxsz[', '&DXxh(uNQ#v!7i&2'], trackState: -8435837242966017}, 400);
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
					await get('playlist/search', {offset: 'Z8Flpt#WBOv[st9vFBM0'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/search', {offset: 5.36}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/search', {amount: '8MW*@9IG3Pp'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/search', {amount: 11.23}, 400);
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
					await get('playlist/search', {isPublic: '#2WjqIY9TjBEQ%h%GetV'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/search', {isPublic: -8049578397925374}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/search', {isPublic: -1810951540047873}, 400);
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
					await get('playlist/search', {sortDescending: '0Xf7['}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/search', {sortDescending: 3527055450832898}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/search', {sortDescending: -7876503035445249}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/search', {playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/search', {playlistTracks: '#EaLrJH^u#$I&ZLAE'}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTracks: 5274298910507010}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTracks: -2117658052919297}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/search', {playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/search', {playlistTrackIDs: 'FcPhuxisOdOz'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistTrackIDs: 7851943074463746}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistTrackIDs: 199502216560639}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/search', {playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/search', {playlistState: 'qKr74Rt'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/search', {playlistState: 5050149453692930}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/search', {playlistState: -529716280819713}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/search', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/search', {trackMedia: 'quT&MbJ#o8NGH^w'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/search', {trackMedia: -5310865242849278}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/search', {trackMedia: 2647155785334783}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/search', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/search', {trackTag: 'p[NrvU'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackTag: 2381859375808514}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackTag: -6620612021714945}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/search', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/search', {trackRawTag: 'VCzDo7flCEhJ@u'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/search', {trackRawTag: 4913760837828610}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/search', {trackRawTag: -4782269998825473}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/search', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/search', {trackState: 'qZRLfQj&@X)FoZI'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/search', {trackState: -4378605442301950}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/search', {trackState: 3489656960188415}, 400);
				});
			});
		});
		describe('playlist/state', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/state', {id: 'A[hdMm]4$Pvr!W'}, 401);
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
					await getNotLoggedIn('playlist/states', {ids: ['a18haqW87h', '4[Z#1SS']}, 401);
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
					await getNotLoggedIn('playlist/tracks', {ids: ['br#DMrSkj2p1', 'Ujx0g@1DNToPoz']}, 401);
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
					await get('playlist/tracks', {ids: ['#*wh1a]EiCuUdQOthb', 'y5F*4$gh&d*n9J'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['Q)JV)5Fth', 'l)$ddIu4'], trackMedia: 'JBae]$pTB@x1q'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['EtvC)Lwtt])dc]5', '(NU[ZMBg!aCZFi3]gh'], trackMedia: -7632254394171390}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['yt$qH[vs', '[EFpbk'], trackMedia: 6487130872217599}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['WDfm43', 'zZeVla'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['v8Z#7JFeymN(pS$', 'H1Wdcl'], trackTag: 'yr]a%Hm84'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['(VUZH', 'P[0IaMe7D*m4mq**]6'], trackTag: 7649916121776130}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['[5WMEXscnt', 'fm!)zY6Po4()'], trackTag: -7456951097098241}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['h2znpGB(9CI(', '5*Dh%Y'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['#kNy*4[o$qRkg7', 'Q67x3'], trackRawTag: '8L#t4aPt@e0sN'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['%wZwY)00wes]M', 'Vq]RvD%FpKsVHXw8U'], trackRawTag: 8311283510149122}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: ['rN^@]$^RoDPPx4p', 'PzAcJMS)Ngq[S'], trackRawTag: 7745141351645183}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['!^klkWYrTZH)H18M', '!&8i9nDdyTnD!HVX'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['zwXcUEBj2', 'PHgWnRp[pWQj09GcE5Wx'], trackState: 'LI@vwdfyv3[)N'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/tracks', {ids: ['V7oa%qqw7GGCi@uPRE*', 'BoNjtzU@vrj((3Q'], trackState: -6567669276868606}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/tracks', {ids: [']YtcgN', 'aD1%DgQeXBAl'], trackState: 5731453811818495}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['MNnEoga4', 'tCgAH'], offset: '1L2at)'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['CT(%qs^7SD!fR!)N', 'e0cDpgtsbpaB3Q)Bz6[#'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['Aef((pXr0', 'OPy5UShaN^TIoZF'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['8[8U4m]EwRk', 'Ay[07$Py9gi1)NI'], offset: 99.93}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/tracks', {ids: ['NVmzVxT6MdKGs^b&LYRE', 'Je%]bf2d9Q5VHMBT]CQ%'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/tracks', {ids: ['m*KMVVXKMNjs*9', '7I6qoHLZ'], amount: 'W[39gqbiRv7'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/tracks', {ids: ['@)(a^3gqbOkD6$EOM*KH', 'ClaiAYzd8'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/tracks', {ids: ['8qqi7', 'KgZE(50A#y76#'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/tracks', {ids: ['iT4gbNTqHbR]$zq', 'jT1bF#'], amount: 67.95}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/tracks', {ids: ['N&Z]q', 'FvNoMH9x'], amount: 0}, 400);
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
					await get('playlist/list', {list: 'highest', offset: 'bp7G0jiob'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('playlist/list', {list: 'random', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('playlist/list', {list: 'random', offset: 37.05}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('playlist/list', {list: 'recent', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', amount: 'DUaGT'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('playlist/list', {list: 'recent', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('playlist/list', {list: 'avghighest', amount: 96.41}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('playlist/list', {list: 'frequent', amount: 0}, 400);
				});
				it('"playlistTracks" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', playlistTracks: ''}, 400);
				});
				it('"playlistTracks" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistTracks: 'rqtu$('}, 400);
				});
				it('"playlistTracks" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'recent', playlistTracks: 7200649146007554}, 400);
				});
				it('"playlistTracks" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'faved', playlistTracks: 8054614553264127}, 400);
				});
				it('"playlistTrackIDs" set to "empty string"', async () => {
					await get('playlist/list', {list: 'faved', playlistTrackIDs: ''}, 400);
				});
				it('"playlistTrackIDs" set to "string"', async () => {
					await get('playlist/list', {list: 'faved', playlistTrackIDs: 'qE9xpDZJw*a$v&qRa'}, 400);
				});
				it('"playlistTrackIDs" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'highest', playlistTrackIDs: 8251785667936258}, 400);
				});
				it('"playlistTrackIDs" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'random', playlistTrackIDs: 4989128672280575}, 400);
				});
				it('"playlistState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistState: ''}, 400);
				});
				it('"playlistState" set to "string"', async () => {
					await get('playlist/list', {list: 'avghighest', playlistState: '*#N0t'}, 400);
				});
				it('"playlistState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'random', playlistState: -5444579893444606}, 400);
				});
				it('"playlistState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'random', playlistState: 6382078392270847}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playlist/list', {list: 'frequent', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', trackMedia: 'Qm)GnMkY!H'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'avghighest', trackMedia: -7037466829651966}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', trackMedia: 1364309170978815}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'random', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', trackTag: 'V&Rg0aDt2f94&9K'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'avghighest', trackTag: 4948218118930434}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', trackTag: 4966472468135935}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playlist/list', {list: 'highest', trackRawTag: 'LAomlM]X'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'avghighest', trackRawTag: -1167510086877182}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'frequent', trackRawTag: 4890389731344383}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', trackState: '3v3Qjl0'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'recent', trackState: -577527533797374}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'highest', trackState: -6281815371284481}, 400);
				});
				it('"name" set to "empty string"', async () => {
					await get('playlist/list', {list: 'faved', name: ''}, 400);
				});
				it('"isPublic" set to "empty string"', async () => {
					await get('playlist/list', {list: 'faved', isPublic: ''}, 400);
				});
				it('"isPublic" set to "string"', async () => {
					await get('playlist/list', {list: 'frequent', isPublic: '#IE5cE6k3W^]J4sa#Om'}, 400);
				});
				it('"isPublic" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'avghighest', isPublic: 6038494082236418}, 400);
				});
				it('"isPublic" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', isPublic: -5924342563078145}, 400);
				});
				it('"sortField" set to "empty string"', async () => {
					await get('playlist/list', {list: 'avghighest', sortField: ''}, 400);
				});
				it('"sortField" set to "invalid enum"', async () => {
					await get('playlist/list', {list: 'recent', sortField: 'invalid'}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', id: ''}, 400);
				});
				it('"ids" set to "null"', async () => {
					await get('playlist/list', {list: 'avghighest', ids: null}, 400);
				});
				it('"ids" set to "empty string"', async () => {
					await get('playlist/list', {list: 'highest', ids: [null, '']}, 400);
				});
				it('"query" set to "empty string"', async () => {
					await get('playlist/list', {list: 'recent', query: ''}, 400);
				});
				it('"sortDescending" set to "empty string"', async () => {
					await get('playlist/list', {list: 'faved', sortDescending: ''}, 400);
				});
				it('"sortDescending" set to "string"', async () => {
					await get('playlist/list', {list: 'faved', sortDescending: 'Eq@#[3mTn(KE'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('playlist/list', {list: 'highest', sortDescending: -2692552788541438}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('playlist/list', {list: 'recent', sortDescending: 5184785739677695}, 400);
				});
			});
		});
		describe('user/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/id', {id: 'DN$yvv*Ze0Lp&IAN'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/id', {id: 'DN$yvv*Ze0Lp&IAN'}, 401);
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
					await getNotLoggedIn('user/ids', {ids: ['9rYIN0xQt0f9qKvKg', '^)NHvF4V[k%8yV)4w6']}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('user/ids', {ids: ['9rYIN0xQt0f9qKvKg', '^)NHvF4V[k%8yV)4w6']}, 401);
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
					await get('user/search', {offset: '6aYTW]^gJDu'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('user/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('user/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('user/search', {offset: 87.73}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('user/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('user/search', {amount: 'HIcV&LLzVB]'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('user/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('user/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('user/search', {amount: 97.81}, 400);
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
					await get('user/search', {isAdmin: 'W(40fC#&54w9'}, 400);
				});
				it('"isAdmin" set to "integer > 1"', async () => {
					await get('user/search', {isAdmin: -1351119443853310}, 400);
				});
				it('"isAdmin" set to "integer < 0"', async () => {
					await get('user/search', {isAdmin: -1084296743878657}, 400);
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
					await get('user/search', {sortDescending: 'AZxu7rN'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('user/search', {sortDescending: 6930334226579458}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('user/search', {sortDescending: -6978503828307969}, 400);
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
					await get('playqueue/get', {playQueueTracks: 'p6alvHsC7)#tp&HG'}, 400);
				});
				it('"playQueueTracks" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTracks: -1656227465527294}, 400);
				});
				it('"playQueueTracks" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTracks: -6880650057482241}, 400);
				});
				it('"playQueueTrackIDs" set to "empty string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: ''}, 400);
				});
				it('"playQueueTrackIDs" set to "string"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: 'qwHLFJRK'}, 400);
				});
				it('"playQueueTrackIDs" set to "integer > 1"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: 7060781174620162}, 400);
				});
				it('"playQueueTrackIDs" set to "integer < 0"', async () => {
					await get('playqueue/get', {playQueueTrackIDs: -7578291196133377}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('playqueue/get', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('playqueue/get', {trackMedia: 'm5vS2EaC%xwnT9z4FX&A'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackMedia: 949261160153090}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackMedia: 1233733088706559}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('playqueue/get', {trackTag: 'MT6eJ][]O'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackTag: -6440444695150590}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackTag: -7224772417028097}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('playqueue/get', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('playqueue/get', {trackRawTag: 'KXK!y[y(5'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackRawTag: 5403692140331010}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackRawTag: -5550469795545089}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('playqueue/get', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('playqueue/get', {trackState: '!Ci3o[!(xen6fK'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('playqueue/get', {trackState: 6612134708379650}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('playqueue/get', {trackState: 8736997803819007}, 400);
				});
			});
		});
		describe('bookmark/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/id', {id: 'O*NBLsKrI#&HzmqWZoH'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('bookmark/id', {id: ''}, 400);
				});
				it('"bookmarkTrack" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'CeuhEAloIg', bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/id', {id: 'U419cG(uo8!eapBq', bookmarkTrack: '!Ld77^Wbj7r7kh%ps'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'JDCKOm', bookmarkTrack: -4422672637231102}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: ')iaNIp9)Hi', bookmarkTrack: 6209556044578815}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'vofq(ikowN', trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/id', {id: 'N$wRorPS4qYRX%E', trackMedia: '3&nlrli'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'HtP5T%', trackMedia: -1945933646397438}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: '*HBesKktAGnp', trackMedia: 977002584604671}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'Im3JMN[dcms1BZyR^', trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/id', {id: 'oQYSelCKG8OBJh', trackTag: '1yCU!j^o[MwF^0X07m'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '2s^jB', trackTag: 8976608148848642}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'DTwj]!!iV0pHHfVsU', trackTag: 4138873311461375}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/id', {id: '9q0Jwn%P9#BB4lyUnbL', trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/id', {id: '9gVlr^m', trackRawTag: 'Nf!HT(IlQcR%mu5'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: '[[gc$R[z8RiNPDUAcX#', trackRawTag: -1764897603977214}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: 'oAmPHK#^AWVjFP', trackRawTag: 4631773929537535}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/id', {id: 'b3BUzc5rUw$3D)Z', trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/id', {id: 'I[2ZcFPv]UYBa1zgMM(', trackState: ']n8pzUWEksJb'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/id', {id: 'K]ZuJh', trackState: -5303685043191806}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/id', {id: ']b]!kQ0Fs&z4yqb', trackState: 2287190897852415}, 400);
				});
			});
		});
		describe('bookmark/ids', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/ids', {ids: ['znW*!kkFE2', 'l#hN(kH*Vl']}, 401);
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
					await get('bookmark/ids', {ids: ['9OED)rH2s2@e', 'a[OFaZUnvp52F)F%u4'], bookmarkTrack: ''}, 400);
				});
				it('"bookmarkTrack" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['0@Qsey72O*', 'xslicvm(5BG3wlOShS'], bookmarkTrack: 'qr6Ht(sBA@'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['vx!EIIPG6sc', 'OXCHQ9T%HNdok3BB9dAN'], bookmarkTrack: 7609740444041218}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['11BfmDJeBR^c', '4O%ihVW$Y[b40j(YC('], bookmarkTrack: -7786929248534529}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['Z3u51)vpVR732', '^bVDrXeMyGCDs&'], trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['W8OwLld75goWXj&7mP', 'VCz!N3j'], trackMedia: 'e7CQ5'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['K5v06ubzVqhSRF7l6oW!', ')1oba)GC'], trackMedia: -5991078058524670}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['FVvpVxy[juNRWpEeSE!9', 'S*I8JgfWuy#v'], trackMedia: 791620958027775}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['94suDNY2m[jg7E9KD', '2vrNQ0]xvbxPBzj*f9y'], trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['Cl]&m&J[q&', 'uu8mx!*o)l1w!K'], trackTag: ')O69vWOoJ%D!a'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: [']e^8!TwK!gBxvf*ir', 'kNotWaP]y'], trackTag: 2028164972806146}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['uNE%crd', 'N4ZT#lF8%5ayEiWB'], trackTag: -5174638967521281}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['V[xEOsj[', '1a4T9KNH4gZ0XSWRuyx'], trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['ZIcFu]e(QjvW', 'F9r@VsPxlby'], trackRawTag: 'W09^Esde'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['b*h5&@oNNO', 'Z5g@rjXF'], trackRawTag: 4242345927114754}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['^aVQSYNv32UMb*x7wx]', 'E7S9h$vrY5wFxe*yI2'], trackRawTag: -7640167284211713}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['HmWfvuJs0!', 'OWwWWrZmknM@noE756^'], trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['gY#]B*YC*W^L(nXZOiuK', '6V&C0m3jhy3J7J'], trackState: '4L8w5Le5Hpa7&7zUg$O6'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/ids', {ids: ['U]vpkvsIIxk!gO#D', 'RrmWiH%yP1fJ2qEi1(%'], trackState: -8595623087439870}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/ids', {ids: ['d[hXI1', '1O[vFHFQ]HuqX6HXW5Iz'], trackState: -4007913127411713}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/ids', {ids: [']Vou&n(', 'WZ1(d5zitbW@'], offset: '^^$%t*AM'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['K4ZAK2Q43', 'J8*233J'], offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['VM6LUD', 'Dij7%noGzXBzbrvaYcyW'], offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['5WQNA', 'FvdX4bB@9arpNKW'], offset: 25.68}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/ids', {ids: ['pRr9EW9A%hRI', 'KYQ9v4Gym]RtQ'], offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/ids', {ids: ['iCBXLreGo)!z9q0', 'OWZ9W3k&uLFD@j'], amount: 'v1KoLFi'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/ids', {ids: ['^hzb$$a', 'R9Vb7VNhP%6DbR4^vXEY'], amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/ids', {ids: ['5iBW#za1Q0lgYX2', 'Dav1]'], amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/ids', {ids: ['r[DlE3Q$czCbM3Q$', 'zbzc!79'], amount: 64.04}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/ids', {ids: ['n!08!%FqeARYC(KakGj', 'yoEZM'], amount: 0}, 400);
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
					await get('bookmark/list', {bookmarkTrack: 'TPIH8r!cQ$kWjxuW0&'}, 400);
				});
				it('"bookmarkTrack" set to "integer > 1"', async () => {
					await get('bookmark/list', {bookmarkTrack: 401581837123586}, 400);
				});
				it('"bookmarkTrack" set to "integer < 0"', async () => {
					await get('bookmark/list', {bookmarkTrack: 668866879422463}, 400);
				});
				it('"trackMedia" set to "empty string"', async () => {
					await get('bookmark/list', {trackMedia: ''}, 400);
				});
				it('"trackMedia" set to "string"', async () => {
					await get('bookmark/list', {trackMedia: 'Wh$UQTjqWh8LA'}, 400);
				});
				it('"trackMedia" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackMedia: -5207314130796542}, 400);
				});
				it('"trackMedia" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackMedia: -419502789492737}, 400);
				});
				it('"trackTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackTag: ''}, 400);
				});
				it('"trackTag" set to "string"', async () => {
					await get('bookmark/list', {trackTag: 'jUaJcLxOGa'}, 400);
				});
				it('"trackTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackTag: 6621355822809090}, 400);
				});
				it('"trackTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackTag: 912979109347327}, 400);
				});
				it('"trackRawTag" set to "empty string"', async () => {
					await get('bookmark/list', {trackRawTag: ''}, 400);
				});
				it('"trackRawTag" set to "string"', async () => {
					await get('bookmark/list', {trackRawTag: 'RQ4kRxcBc@ri*w'}, 400);
				});
				it('"trackRawTag" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackRawTag: -686621292756990}, 400);
				});
				it('"trackRawTag" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackRawTag: -7837300406878209}, 400);
				});
				it('"trackState" set to "empty string"', async () => {
					await get('bookmark/list', {trackState: ''}, 400);
				});
				it('"trackState" set to "string"', async () => {
					await get('bookmark/list', {trackState: 'mBOk)qDA*GQurQYmq'}, 400);
				});
				it('"trackState" set to "integer > 1"', async () => {
					await get('bookmark/list', {trackState: 6549012651966466}, 400);
				});
				it('"trackState" set to "integer < 0"', async () => {
					await get('bookmark/list', {trackState: 4850493742383103}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/list', {offset: '9G*Oj3DMBM'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/list', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/list', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/list', {offset: 86.62}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/list', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/list', {amount: 'G!tC0B4LAbW%2]K'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/list', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/list', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/list', {amount: 28.91}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/list', {amount: 0}, 400);
				});
			});
		});
		describe('bookmark/byTrack/list', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('bookmark/byTrack/list', {trackID: 'iMCW7Ly$B77vSD'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"trackID" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: ''}, 400);
				});
				it('"offset" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'X2e(4oBZMfwh!QI]!Y', offset: 'd0hld!ZCrGZ]x)zD6hB'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'l&#T1xntUKc', offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: '$KnDQFVj', offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'qI$^6^GE1j', offset: 7.94}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('bookmark/byTrack/list', {trackID: '5[OwcD0', offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('bookmark/byTrack/list', {trackID: ']VLlQxpwX5$M]dw', amount: '%Lu(080kpo*VUcHStmE7'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('bookmark/byTrack/list', {trackID: '!6GwS3F]^Cz@p', amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'zHFWu&b7Zg', amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'lTnR1*$U', amount: 1.65}, 400);
				});
				it('"amount" set to "less than minimum 1"', async () => {
					await get('bookmark/byTrack/list', {trackID: 'vkacZain8uhL*rOcX', amount: 0}, 400);
				});
			});
		});
		describe('root/id', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/id', {id: 'UFNQA7rLKYB'}, 401);
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
					await getNotLoggedIn('root/ids', {ids: ['#e!0%@gx', '*NO(t%AchHv[rnrSP)A']}, 401);
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
					await get('root/search', {offset: 'e[GVQh'}, 400);
				});
				it('"offset" set to "empty string"', async () => {
					await get('root/search', {offset: ''}, 400);
				});
				it('"offset" set to "boolean"', async () => {
					await get('root/search', {offset: true}, 400);
				});
				it('"offset" set to "float"', async () => {
					await get('root/search', {offset: 42.04}, 400);
				});
				it('"offset" set to "less than minimum 0"', async () => {
					await get('root/search', {offset: -1}, 400);
				});
				it('"amount" set to "string"', async () => {
					await get('root/search', {amount: 'w#)tJCjEfK'}, 400);
				});
				it('"amount" set to "empty string"', async () => {
					await get('root/search', {amount: ''}, 400);
				});
				it('"amount" set to "boolean"', async () => {
					await get('root/search', {amount: true}, 400);
				});
				it('"amount" set to "float"', async () => {
					await get('root/search', {amount: 68.04}, 400);
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
					await get('root/search', {sortDescending: '%[hzd9bEevb#'}, 400);
				});
				it('"sortDescending" set to "integer > 1"', async () => {
					await get('root/search', {sortDescending: -4384557193232382}, 400);
				});
				it('"sortDescending" set to "integer < 0"', async () => {
					await get('root/search', {sortDescending: 4998027206983679}, 400);
				});
			});
		});
		describe('root/status', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/status', {id: 'MeMwO5f4y'}, 401);
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
					await getNotLoggedIn('admin/queue/id', {id: 'sa44KW)XO(YL]KsZNM'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('admin/queue/id', {id: 'sa44KW)XO(YL]KsZNM'}, 401);
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
					await getNotLoggedIn('folder/download', {id: '9%fU3E9G[OGSLr3D@'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('folder/download', {id: '9%fU3E9G[OGSLr3D@'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/download', {id: 'z9Gk0WEuB]iWDk', format: 'invalid'}, 400);
				});
			});
		});
		describe('folder/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/image', {id: '$h]zU7^N'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/image', {id: 'ga*o1E', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/image', {id: 'UoKzAL16$!zKpTO4IRM', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/image', {id: '3bBTMxlFDesx6', size: '@Gu1r(lj'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/image', {id: 'KAN0hvsM', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/image', {id: 'X0z5j0U!R@lV', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/image', {id: 'ld$U#8CH', size: 370.35}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/image', {id: 'd!5!I', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/image', {id: 'fXKlCUtjReo9', size: 1025}, 400);
				});
			});
		});
		describe('folder/artwork/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('folder/artwork/image', {id: 'bUtfIsmN!o7OEyv'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: 'GF1jaP53tZr6BXWt', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('folder/artwork/image', {id: 'iIINAJ]CP', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('folder/artwork/image', {id: 'Hvd!yrIwnHk[Fl', size: '#5L()KwTgm'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('folder/artwork/image', {id: 'iIMjO&D*l!gdBc4ztE', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('folder/artwork/image', {id: 'X)&EKB', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('folder/artwork/image', {id: '#3ff![e3eV0D8*', size: 172.9}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('folder/artwork/image', {id: 'Bpuk9YR', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('folder/artwork/image', {id: 'D06xOs&*$b5BUZ8cP', size: 1025}, 400);
				});
			});
		});
		describe('track/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/stream', {id: 'inE&N4@HxUm)S^2Eq5Yt'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/stream', {id: 'inE&N4@HxUm)S^2Eq5Yt'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('track/stream', {id: 'A6orrekF%cDP', maxBitRate: 'IzltPR7F00]WzRbk!'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('track/stream', {id: 'Rmw]$7', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('track/stream', {id: 'G1)kmu936Gja5gVI', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('track/stream', {id: '1QF)^Hzg6B9qew0x', maxBitRate: 50.14}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('track/stream', {id: 'OtHDTZ0KzSeIV', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/stream', {id: '1wPWs', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/download', {id: 'RKFMk*@ACPuf!gYJ$BF3'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('track/download', {id: 'RKFMk*@ACPuf!gYJ$BF3'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/download', {id: 'uAG0WGMqh0(e0T', format: 'invalid'}, 400);
				});
			});
		});
		describe('track/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('track/image', {id: 'CN%R[H)oX@r'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('track/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('track/image', {id: 'YA]h8ki2k', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('track/image', {id: '3zwLe@4aW3metY&wziqH', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('track/image', {id: 'DWqZG4', size: 'wac]g1'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('track/image', {id: 'lEui39p&[avpdk', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('track/image', {id: 'OEHjPDr)', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('track/image', {id: 'ufSMDB6U7Qc9bNkjQQ', size: 718.66}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('track/image', {id: 'RZtwhP', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('track/image', {id: 'N%fNP4Y2', size: 1025}, 400);
				});
			});
		});
		describe('episode/stream', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/stream', {id: 'pBY212sRIKJkU)'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/stream', {id: 'pBY212sRIKJkU)'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/stream', {id: ''}, 400);
				});
				it('"maxBitRate" set to "string"', async () => {
					await get('episode/stream', {id: 'l49GJN)D)GQMoc', maxBitRate: 'txpAs%40ixj'}, 400);
				});
				it('"maxBitRate" set to "empty string"', async () => {
					await get('episode/stream', {id: 'zE!zAWx([b*83Obc', maxBitRate: ''}, 400);
				});
				it('"maxBitRate" set to "boolean"', async () => {
					await get('episode/stream', {id: '09NDsAy#hviNs0CRs0@', maxBitRate: true}, 400);
				});
				it('"maxBitRate" set to "float"', async () => {
					await get('episode/stream', {id: '2LAz&R', maxBitRate: 68.89}, 400);
				});
				it('"maxBitRate" set to "less than minimum 10"', async () => {
					await get('episode/stream', {id: 'nBs*Qg36BcAPuf', maxBitRate: 9}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/stream', {id: 'rW]L(UZpC%1^V$', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/download', {id: 'Uw%lE'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('episode/download', {id: 'Uw%lE'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/download', {id: 'uZXOt%!Cc^lLg56omv(G', format: 'invalid'}, 400);
				});
			});
		});
		describe('episode/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('episode/image', {id: 'P@r9bKEbfXm%fhu[#s'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('episode/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('episode/image', {id: '#@#@NAHnRK]^D!qc', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('episode/image', {id: '#0UppqIk@YR96', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('episode/image', {id: 'ow8X6hs]1er', size: 'Fgu[h)rls'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('episode/image', {id: 'tSyj@8EKpmX3', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('episode/image', {id: 'FQ)Qf]7sQWc@Q', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('episode/image', {id: '[56T8kZ', size: 703.49}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('episode/image', {id: '3XwKU66J[', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('episode/image', {id: 'qtgo^Y]T2nomOX', size: 1025}, 400);
				});
			});
		});
		describe('podcast/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/image', {id: 'Ol]XFdmC5wpwYv%PZp@A'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('podcast/image', {id: 'of5wgFSm(O)JU&iuMcS6', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/image', {id: 'MCsGPI2Sren6', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('podcast/image', {id: '(T&EGSfrq', size: '9rb!5l*Iv#NF$ldS('}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('podcast/image', {id: 'V[lo0%zv3c^', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('podcast/image', {id: '6]cAnHv(#z^Y061Qh(]', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('podcast/image', {id: 'RRMyzFCC]D$]l', size: 658.48}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('podcast/image', {id: '50!pRtJA6b#G)Y@)', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('podcast/image', {id: 'v7)FGiX', size: 1025}, 400);
				});
			});
		});
		describe('podcast/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('podcast/download', {id: 'ujUhXx#38NoJ'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('podcast/download', {id: 'ujUhXx#38NoJ'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('podcast/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('podcast/download', {id: 'q3(%bV', format: 'invalid'}, 400);
				});
			});
		});
		describe('artist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/image', {id: 'jQo%YZ8lvp'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('artist/image', {id: 'IDgrN8QNOtcwRunUE', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/image', {id: 'Taf]yEDa@GE]%U8L', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('artist/image', {id: '38X$Ft]S', size: 'RRxrjKGScLaOunGxJ9s'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('artist/image', {id: '%Icz6DtKRkbD', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('artist/image', {id: 'JS(IChlEQoml', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('artist/image', {id: 'bLUXP5uN@Z^$lo', size: 798.18}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('artist/image', {id: 'WKLhtkOzO7)bab', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('artist/image', {id: '83!i%]q%1', size: 1025}, 400);
				});
			});
		});
		describe('artist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('artist/download', {id: '@pNt&]UxAD3U'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('artist/download', {id: '@pNt&]UxAD3U'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('artist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('artist/download', {id: 'bilm^S(WX9Wr9a', format: 'invalid'}, 400);
				});
			});
		});
		describe('album/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/image', {id: '#BHjA'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('album/image', {id: 'tR3rWJ', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/image', {id: 'Z47A*FbLmGK', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('album/image', {id: '7N@Q^VrY3', size: 'nYt(ozeja4'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('album/image', {id: 'a)yhGrrMP1Urdv7j$M[Q', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('album/image', {id: 'UW69#yqrb', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('album/image', {id: 'BrAF$h6VYCPKzL]', size: 421.42}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('album/image', {id: 'GCJAJ', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('album/image', {id: 'fMk)JHoGOowKaMu', size: 1025}, 400);
				});
			});
		});
		describe('album/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('album/download', {id: 'rr9u$I[Y40I9uy'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('album/download', {id: 'rr9u$I[Y40I9uy'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('album/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('album/download', {id: 'zjdktGgbxnBOI#', format: 'invalid'}, 400);
				});
			});
		});
		describe('playlist/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/image', {id: 'nPsnN%JKyH'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('playlist/image', {id: 'wLqyrOLqpTB6lQ6', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/image', {id: '5(^GAyFnaEz6thR7', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('playlist/image', {id: 'bqGU#pwxNq&dk', size: 'becc[Io#]6'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('playlist/image', {id: '&vg^dkc2', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('playlist/image', {id: '4yH0ic)L7lMGLti[!VN', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('playlist/image', {id: 'vV9k5KHWaYtk82yb', size: 577.22}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('playlist/image', {id: 'q1UiSSegI!c6n[Jae', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('playlist/image', {id: '3)NZEB^ZM69WeVP1E', size: 1025}, 400);
				});
			});
		});
		describe('playlist/download', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('playlist/download', {id: ']7TuEy5y'}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('playlist/download', {id: ']7TuEy5y'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('playlist/download', {id: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('playlist/download', {id: 'ArX84i&H9aZ', format: 'invalid'}, 400);
				});
			});
		});
		describe('user/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('user/image', {id: '2x8p][@'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('user/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('user/image', {id: 'xLYugn@bu4hGeg46g', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('user/image', {id: '5jPmXX', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('user/image', {id: 'o!mty8Re*RSoXtS&vQ85', size: ')*VkqOxHd'}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('user/image', {id: '%L6u)', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('user/image', {id: '#ib2Z', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('user/image', {id: 'R8CQg', size: 787.42}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('user/image', {id: 'cEGAd&z4dM8*z', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('user/image', {id: '2]DCEHFuYokcak', size: 1025}, 400);
				});
			});
		});
		describe('root/image', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('root/image', {id: 'i%ivq'}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"id" set to "empty string"', async () => {
					await get('root/image', {id: ''}, 400);
				});
				it('"format" set to "empty string"', async () => {
					await get('root/image', {id: '@XtPTQF&N3tRQMQB', format: ''}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('root/image', {id: 'ioDJ46', format: 'invalid'}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('root/image', {id: '$zDLl2xT3w', size: 'QKWZc3(XXi36xlbt('}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('root/image', {id: '0qpW8Z]T', size: ''}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('root/image', {id: 'm1m6yI@8I0$%A$7Jk', size: true}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('root/image', {id: 'tOWThDc*#Ru&HB', size: 180.71}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('root/image', {id: 'FHjYjH@', size: 15}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('root/image', {id: '&CXF&P2MdSRim', size: 1025}, 400);
				});
			});
		});
		describe('image/{id}-{size}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/oBpbOEf6xBkU60k)%24-571.tiff', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/7%5EqMq%25-621.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/go!h%5BEs4N7b-511.invalid', {}, 400);
				});
				it('"size" set to "string"', async () => {
					await get('image/nDyhiLqM%40zHMZI-%24o)I2njjf%5E)%23t)k.tiff', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/K%5Ey5CC%26nV)iQ-.tiff', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/)D%23qNkdQk*hbKY%23mzt-true.tiff', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/%5DjNKq1Xug%5DZcpQo7-678.69.jpeg', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/mG%24k%5E7FuvI%40Z-15.png', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/jjA3F*E%5Bws%5B%5Du%5DXx2tT-1025.jpeg', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-976.png', {}, 400);
				});
			});
		});
		describe('image/{id}-{size}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/qoN%5BR%5B48x%26ibX)-721', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"size" set to "string"', async () => {
					await get('image/hdGWp3D4pwTL%23QAA-gp%40m%26Hkusqmr', {}, 400);
				});
				it('"size" set to "empty string"', async () => {
					await get('image/LjlPkvxj1L%5DMk5R%23E-', {}, 400);
				});
				it('"size" set to "boolean"', async () => {
					await get('image/XV6Ojx-true', {}, 400);
				});
				it('"size" set to "float"', async () => {
					await get('image/tr16!BamR-302.29', {}, 400);
				});
				it('"size" set to "less than minimum 16"', async () => {
					await get('image/F8mlc)xQgwYt0g%25-15', {}, 400);
				});
				it('"size" set to "more than minimum 1024"', async () => {
					await get('image/fVqVaKC-1025', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/-47', {}, 400);
				});
			});
		});
		describe('image/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/!%26VhkH%5E86*%23t%40h%5E.jpeg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "empty string"', async () => {
					await get('image/%5BInxV.', {}, 400);
				});
				it('"format" set to "invalid enum"', async () => {
					await get('image/Cx*mX)Gg%5D*aIw%5BWseUWp.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('image/.tiff', {}, 400);
				});
			});
		});
		describe('image/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('image/5N5D(r7X%5D0%26d', {}, 401);
				});
			});
		});
		describe('stream/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/%5DDe7gL4%25L.wav', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/%5DDe7gL4%25L.wav', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('stream/gmF7wla4OH1m.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('stream/.wav', {}, 400);
				});
			});
		});
		describe('stream/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('stream/ugs%5EgsB*VU!vO', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('stream/ugs%5EgsB*VU!vO', {}, 401);
				});
			});
		});
		describe('waveform/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform/BxyNW3tPSCtL7Qy.svg', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform/BxyNW3tPSCtL7Qy.svg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('waveform/JsvHAN.invalid', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform/.dat', {}, 400);
				});
			});
		});
		describe('waveform_svg/{id}-{width}.svg', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('waveform_svg/INtPn0lKYV)WS92%5Dkn-1336.svg', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('waveform_svg/INtPn0lKYV)WS92%5Dkn-1336.svg', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"width" set to "string"', async () => {
					await get('waveform_svg/%40YRpv3fOy*z2J-js479jyqfJZs07psuRpI.svg', {}, 400);
				});
				it('"width" set to "empty string"', async () => {
					await get('waveform_svg/7jtdAEIjGsq22v-.svg', {}, 400);
				});
				it('"width" set to "boolean"', async () => {
					await get('waveform_svg/3*%25FssQUk*gDogM(-true.svg', {}, 400);
				});
				it('"width" set to "float"', async () => {
					await get('waveform_svg/SIzm7*7i%5BbQHd-2506.96.svg', {}, 400);
				});
				it('"width" set to "less than minimum 1"', async () => {
					await get('waveform_svg/irp%5Bn%26c%268nhj*(6qx%236J-0.svg', {}, 400);
				});
				it('"width" set to "more than minimum 6000"', async () => {
					await get('waveform_svg/jD2%40wj%25lZS3Ca7kHi*ZL-6001.svg', {}, 400);
				});
				it('"id" set to "empty string"', async () => {
					await get('waveform_svg/-4087.svg', {}, 400);
				});
			});
		});
		describe('download/{id}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/JB9nlO%24SXTXVF(HPAB*', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/JB9nlO%24SXTXVF(HPAB*', {}, 401);
				});
			});
		});
		describe('download/{id}.{format}', () => {
			describe('should fail without login', () => {
				it('should respond with 401 Unauth', async () => {
					await getNotLoggedIn('download/5pEE8FvS5DpmxH(%40b.zip', {}, 401);
				});
			});
			describe('should fail without required rights', () => {
				it('should respond with 401 Unauth', async () => {
					await getNoRights('download/5pEE8FvS5DpmxH(%40b.zip', {}, 401);
				});
			});
			describe('should respond with 400 invalid/missing parameter', () => {
				it('"format" set to "invalid enum"', async () => {
					await get('download/%26vccC.invalid', {}, 400);
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
