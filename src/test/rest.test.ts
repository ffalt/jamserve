import jestOpenAPI from 'jest-openapi';
import nock from 'nock';
import {Server} from '../modules/server/server';
import tmp from 'tmp';
import fse from 'fs-extra';
import {OpenAPIObject} from '../modules/rest/builder/openapi-helpers';
import supertest from 'supertest';
import {JAMAPI_URL_VERSION} from '../modules/engine/rest/version';
import {bindMockConfig, DBConfigs} from './mock/mock.config';
import {FolderType, RootScanStrategy, UserRole} from '../types/enums';
import {waitEngineStart} from './mock/mock.engine';
import {MockRequests, RequestMock} from './mock/mock.request';
import {ensureTrailingPathSeparator} from '../utils/fs-utils';
import path from 'path';
import {buildMockRoot, MockRoot, writeAndStoreExternalMedia, writeAndStoreMock} from './mock/mock.root';
import {initTest} from './init';
import {Container, Snapshot} from 'typescript-ioc';
import {OpenAPISpecObject} from 'openapi-validator';
import TestAgent from 'supertest/lib/agent';

initTest();

const apiPrefix = `/jam/${JAMAPI_URL_VERSION}/`;
const roles = [UserRole.admin, UserRole.podcast, UserRole.upload, UserRole.stream];

describe('REST', () => {
	for (const db of DBConfigs) {
		describe(db.dialect, () => {
			let server: Server;
			let dir: tmp.DirResult;
			let openapi: OpenAPIObject;
			let request: TestAgent<supertest.Test>;
			let mockCall: (mock: RequestMock, expected: number, token?: string) => supertest.Test;
			let mockRoot: MockRoot;
			const tokens: { [role: string]: string } = {
				admin: '',
				podcast: '',
				stream: '',
				upload: ''
			};
			let mocks: Array<RequestMock>;
			let validMocks: Array<RequestMock>;
			let snapshot: Snapshot;

			beforeAll(async () => {
				nock.cleanAll();
				snapshot = Container.snapshot();
				dir = tmp.dirSync();
				server = Container.get(Server);
				bindMockConfig(dir.name, db, false);
				await server.init();
				await server.engine.init();
				await server.engine.orm.drop();
				await server.engine.start();
				await server.start();
				await waitEngineStart(server.engine);
				const orm = server.engine.orm.fork();

				request = supertest(`http://${server.configService.env.host}:${server.configService.env.port}`);

				await server.engine.user.createUser(orm, 'all', 'all@localhost', 'all', true, true, true, true);
				const res = await request.post(apiPrefix + 'auth/login')
					.send({username: 'all', password: 'all', client: 'supertest-tests', jwt: true});
				if (res.status !== 200) {
					throw new Error('Invalid Test Setup, Login failed ' + res.text);
				}
				tokens.all = res.body.jwt;

				for (const role of roles) {
					await server.engine.user.createUser(orm, role, role + '@localhost', role,
						role === UserRole.admin,
						role === UserRole.stream,
						role === UserRole.upload,
						role === UserRole.podcast
					);
					const res2 = await request.post(apiPrefix + 'auth/login')
						.send({username: role, password: role, client: 'supertest-tests', jwt: true});
					if (res2.status !== 200) {
						throw new Error('Invalid Test Setup, Login failed ' + res2.text);
					}
					tokens[role] = res2.body.jwt;
				}

				openapi = JSON.parse(server.docs.getOpenApiSchema(false));
				if ((jestOpenAPI as any).default) {
					(jestOpenAPI as any).default(openapi);
				} else {
					jestOpenAPI(openapi as OpenAPISpecObject);
				}
				const get = (mock: RequestMock, expected: number, token?: string): supertest.Test => {
					let url = apiPrefix + mock.apiName;
					if (mock.params) {
						const split = mock.apiName.split('/');
						let api = split[split.length - 1];
						Object.keys(mock.params).forEach(key => {
							const value = mock.params[key];
							api = api.replace(`{${key}}`, encodeURIComponent(`${value}`));
						});
						if (api.trim().length === 0) {
							expected = 404;
						}
						split[split.length - 1] = api;
						url = apiPrefix + split.join('/');
					}
					const message = JSON.stringify({url, message: token ? undefined : 'should fail of missing auth', mock}, null, '\t');
					return request.get(url)
						.query(mock.data)
						.set('Authorization', token ? `Bearer ${token}` : '')
						.expect(function(res) {
							if (res.status !== expected) {
								console.error(message + JSON.stringify(res.text));
							}
							expect(res.status).toBe(expected);
						});
				};
				const post = (mock: RequestMock, expected: number, token?: string): supertest.Test => {
					let url = apiPrefix + mock.apiName;
					if (mock.params) {
						const split = mock.apiName.split('/');
						let api = split[split.length - 1];
						Object.keys(mock.params).forEach(key => {
							const value = mock.params[key];
							api = api.replace(`{${key}}`, value);
						});
						if (api.trim().length === 0) {
							expected = 404;
						}
						split[split.length - 1] = api;
						url = apiPrefix + split.join('/');
					}
					const message = JSON.stringify({url, message: token ? undefined : 'should fail of missing auth', mock}, null, '\t');
					return request.post(url)
						.query({})
						.send(mock.data)
						.set('Authorization', token ? `Bearer ${token}` : '')
						.expect(function(res) {
							if (res.status !== expected) {
								console.error(message + JSON.stringify(res.text));
							}
							expect(res.status).toBe(expected);
						});
				};
				mockCall = (mock, expected, token): supertest.Test => {
					if (mock.method === 'get') {
						return get(mock, expected, token);
					} else {
						return post(mock, expected, token);
					}
				};
				mocks = await MockRequests.generateRequestMocks(openapi);
				validMocks = [];
				for (const call of mocks) {
					if (call.valid && !validMocks.find(c => c.apiName === call.apiName)) {
						validMocks.push(call);
					}
				}
			});
			afterAll(async () => {
				await server.engine.stop();
				await server.stop();
				await fse.remove(dir.name);
				// dir.removeCallback();
				snapshot.restore();
			});

			describe('must fail', () => {
				it('should reject all invalid calls', async () => {
					for (const call of mocks) {
						if (!call.valid) {
							await mockCall(call, call.expect, tokens.all);
						}
					}
				});
				it('should reject all calls without auth', async () => {
					for (const call of validMocks) {
						if (call.roles.length > 0) {
							await mockCall(call, 401);
						}
					}
				});
				for (const role of roles) {
					it('should reject all calls without role ' + role, async () => {
						for (const call of validMocks) {
							if (call.roles.length > 0 && call.roles.indexOf(role) < 0) {
								await mockCall(call, 401, tokens[role]);
							}
						}
					});
				}
			});
			describe('must succeed', () => {

				beforeAll(async () => {
					const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
					await fse.mkdir(mediaPath);
					mockRoot = buildMockRoot(mediaPath, 1, RootScanStrategy.auto);
					await writeAndStoreMock(mockRoot, server.engine.io.workerService, server.engine.orm.fork());
					await writeAndStoreExternalMedia(server.engine.io.workerService, server.engine.orm.fork());
				});
				afterEach(async () => {
					await fse.remove(dir.name);
				});

				it('should do something', async () => {
					const orm = server.engine.orm.fork();
					const album = await orm.Album.oneOrFailFilter({since: 1});
					const artist = await orm.Artist.oneOrFailFilter({since: 1});
					const series = await orm.Series.oneOrFailFilter({since: 1});
					const artwork = await orm.Artwork.oneOrFailFilter({since: 1});
					const folder = await orm.Folder.oneOrFailFilter({since: 1});
					const artistFolder = await orm.Folder.oneOrFailFilter({folderTypes: [FolderType.artist]});
					const albumFolder = await orm.Folder.oneOrFailFilter({folderTypes: [FolderType.album]});
					const bookmark = await orm.Bookmark.oneOrFailFilter({since: 1});
					const playlist = await orm.Playlist.oneOrFailFilter({since: 1});
					const track = await orm.Track.oneOrFailFilter({since: 1});
					const radio = await orm.Radio.oneOrFailFilter({since: 1});
					const podcast = await orm.Podcast.oneOrFailFilter({since: 1});
					const episode = await orm.Episode.oneOrFailFilter({since: 1});
					const genre = await orm.Genre.oneOrFailFilter({since: 1});
					const user = await orm.User.oneOrFailFilter({name: 'admin'});
					for (const call of mocks) {
						if (call.valid && call.method === 'get') {
							let expected = 200;
							switch (call.apiName) {
								case 'album/info':
								case 'album/id': {
									call.data.id = album.id;
									break;
								}
								case 'artist/info':
								case 'artist/id': {
									call.data.id = artist.id;
									break;
								}
								case 'artwork/id': {
									call.data.id = artwork.id;
									break;
								}
								case 'genre/id': {
									call.data.id = genre.id;
									break;
								}
								case 'folder/artworks':
								case 'folder/health':
								case 'folder/subfolders':
								case 'folder/tracks': {
									call.data.id = folder.id;
									if (call.data.childOfID) {
										call.data.childOfID = folder.id;
									}
									break;
								}
								case 'folder/artist/similar/tracks':
								case 'folder/artist/similar': {
									expected = 500;
									call.data.id = artistFolder.id;
									break;
								}
								case 'folder/artist/info': {
									call.data.id = artistFolder.id;
									break;
								}
								case 'folder/album/info': {
									call.data.id = albumFolder.id;
									break;
								}
								case 'folder/id': {
									call.data.id = folder.id;
									break;
								}
								case 'series/info':
								case 'series/id': {
									call.data.id = series.id;
									break;
								}
								case 'radio/id': {
									call.data.id = radio.id;
									break;
								}
								case 'root/status':
								case 'root/id': {
									call.data.id = mockRoot.id;
									break;
								}
								case 'playlist/id': {
									call.data.id = playlist.id;
									break;
								}
								case 'folder/search':
								case 'folder/index': {
									if (call.data.childOfID) {
										call.data.childOfID = folder.id;
									}
									break;
								}
								case 'bookmark/id': {
									call.data.id = bookmark.id;
									break;
								}
								case 'user/id': {
									call.data.id = user.id;
									break;
								}
								case 'state/id':
								case 'waveform/json':
								case 'waveform/svg':
								case 'track/lyrics':
								case 'track/id': {
									call.data.id = track.id;
									break;
								}
								case 'track/health':
								case 'track/rawTag/get': {
									if (call.data.childOfID) {
										call.data.childOfID = folder.id;
									}
									break;
								}
								case 'episode/status':
								case 'episode/id': {
									call.data.id = episode.id;
									break;
								}
								case 'podcast/status':
								case 'podcast/id': {
									call.data.id = podcast.id;
									break;
								}
								case 'stream/{id}_{maxBitRate}.{format}':
								case 'stream/{id}_{maxBitRate}':
								case 'stream/{id}.{format}':
								case 'stream/{id}':
								case 'download/{id}':
								case 'download/{id}.{format}':
								case 'waveform/{id}_{width}.{format}':
								case 'waveform/{id}.{format}':
								case 'waveform/{id}':
								case 'image/{id}':
								case 'image/{id}_{size}':
								case 'image/{id}.{format}':
								case 'image/{id}_{size}.{format}': {
									call.params.id = track.id;
									break;
								}
								case 'track/search':
								case 'artwork/search': {
									if (call.data.childOfID) {
										call.data.childOfID = folder.id;
									}
									break;
								}
								case 'artist/similar/tracks':
								case 'artist/similar': {
									expected = 500; // External service is disabled
									call.data.id = artist.id;
									break;
								}
								case 'album/similar/tracks': {
									expected = 500; // External service is disabled
									call.data.id = album.id;
									break;
								}
								case 'track/similar': {
									expected = 500; // External service is disabled
									call.data.id = track.id;
									break;
								}
								case 'metadata/acoustid/lookup': {
									expected = 500; // External service is disabled
									call.data.trackID = track.id;
									break;
								}
								case 'podcast/discover/top':
								case 'podcast/discover/byTag':
								case 'podcast/discover/tags':
								case 'podcast/discover':
								case 'metadata/lyricsovh/search':
								case 'metadata/musicbrainz/search':
								case 'metadata/acousticbrainz/lookup':
								case 'metadata/coverartarchive/lookup':
								case 'metadata/wikidata/summary':
								case 'metadata/wikidata/lookup':
								case 'metadata/wikipedia/summary':
								case 'metadata/musicbrainz/lookup':
								case 'metadata/lastfm/lookup': {
									expected = 500; // External service is disabled
									break;
								}
								case 'metadata/coverartarchive/image': {
									expected = 500; // External service is disabled
									call.data.url = 'http://coverartarchive.org/invalid.png';
									break;
								}
								// default: {
								// 	console.debug(call.apiName, call.data);
								// }
							}
							await mockCall(call, expected, tokens.all);
						}
					}
				});
			});
		});
	}
});
