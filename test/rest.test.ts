import jestOpenAPI from 'jest-openapi';
import nock from 'nock';
import { Server } from '../src/modules/server/server.js';
import tmp from 'tmp';
import 'passport';
import fse from 'fs-extra';
import { OpenAPIObject } from '../src/modules/deco/builder/openapi-helpers.js';
import supertest from 'supertest';
import { JAMAPI_URL_VERSION } from '../src/modules/engine/rest/version.js';
import { bindMockConfig, DBConfigs, getTestContainer } from './mock/mock.config.js';
import { FolderType, RootScanStrategy, UserRole } from '../src/types/enums.js';
import { waitEngineStart } from './mock/mock.engine.js';
import { MockRequests, RequestMock } from './mock/mock.request.js';
import { ensureTrailingPathSeparator } from '../src/utils/fs-utils.js';
import path from 'node:path';
import { buildMockRoot, MockRoot, writeAndStoreExternalMedia, writeAndStoreMock } from './mock/mock.root.js';
import { OpenAPISpecObject } from 'openapi-validator';
import TestAgent from 'supertest/lib/agent.js';
import { describe, expect, beforeAll, afterAll, it } from '@jest/globals';

const apiPrefix = `/jam/${JAMAPI_URL_VERSION}/`;
const roles = [UserRole.admin, UserRole.podcast, UserRole.upload, UserRole.stream];

interface MockEntities {
	album: { id: string };
	artist: { id: string };
	series: { id: string };
	artwork: { id: string };
	folder: { id: string };
	artistFolder: { id: string };
	albumFolder: { id: string };
	bookmark: { id: string };
	playlist: { id: string };
	track: { id: string };
	radio: { id: string };
	podcast: { id: string };
	episode: { id: string };
	genre: { id: string };
	user: { id: string };
	mockRoot: { id: string };
}

interface MockCase {
	apiName: string;
	expected: number;
	binary?: boolean;
	setup?: (call: RequestMock, entities: MockEntities) => void;
}

const setupFolderWithSubtree = (call: RequestMock, entities: MockEntities): void => {
	call.data.id = entities.folder.id;
	if (call.data.childOfID) {
		call.data.childOfID = entities.folder.id;
	}
	if (call.data.inSubtreeOfID) {
		call.data.inSubtreeOfID = entities.folder.id;
	}
};

const setupFolderSubtreeOnly = (call: RequestMock, entities: MockEntities): void => {
	if (call.data.childOfID) {
		call.data.childOfID = entities.folder.id;
	}
	if (call.data.inSubtreeOfID) {
		call.data.inSubtreeOfID = entities.folder.id;
	}
};

const MOCK_CASES: Array<MockCase> = [
	{ apiName: 'album/info', expected: 200, setup: (call, entities) => { call.data.id = entities.album.id; } },
	{ apiName: 'album/id', expected: 200, setup: (call, entities) => { call.data.id = entities.album.id; } },
	{ apiName: 'artist/info', expected: 200, setup: (call, entities) => { call.data.id = entities.artist.id; } },
	{ apiName: 'artist/id', expected: 200, setup: (call, entities) => { call.data.id = entities.artist.id; } },
	{ apiName: 'artwork/id', expected: 200, setup: (call, entities) => { call.data.id = entities.artwork.id; } },
	{ apiName: 'genre/id', expected: 200, setup: (call, entities) => { call.data.id = entities.genre.id; } },
	{ apiName: 'folder/artworks', expected: 200, setup: setupFolderWithSubtree },
	{ apiName: 'folder/health', expected: 200, setup: setupFolderWithSubtree },
	{ apiName: 'folder/subfolders', expected: 200, setup: setupFolderWithSubtree },
	{ apiName: 'folder/tracks', expected: 200, setup: setupFolderWithSubtree },
	{ apiName: 'folder/search', expected: 200, setup: setupFolderSubtreeOnly },
	{ apiName: 'folder/index', expected: 200, setup: setupFolderSubtreeOnly },
	{ apiName: 'track/search', expected: 200, setup: setupFolderSubtreeOnly },
	{ apiName: 'artwork/search', expected: 200, setup: setupFolderSubtreeOnly },
	{ apiName: 'track/health', expected: 200, setup: setupFolderSubtreeOnly },
	{ apiName: 'track/rawTag/get', expected: 200, setup: setupFolderSubtreeOnly },
	{ apiName: 'folder/artist/similar/tracks', expected: 500, setup: (call, entities) => { call.data.id = entities.artistFolder.id; } },
	{ apiName: 'folder/artist/similar', expected: 500, setup: (call, entities) => { call.data.id = entities.artistFolder.id; } },
	{ apiName: 'folder/artist/info', expected: 200, setup: (call, entities) => { call.data.id = entities.artistFolder.id; } },
	{ apiName: 'folder/album/info', expected: 200, setup: (call, entities) => { call.data.id = entities.albumFolder.id; } },
	{ apiName: 'folder/id', expected: 200, setup: (call, entities) => { call.data.id = entities.folder.id; } },
	{ apiName: 'series/info', expected: 200, setup: (call, entities) => { call.data.id = entities.series.id; } },
	{ apiName: 'series/id', expected: 200, setup: (call, entities) => { call.data.id = entities.series.id; } },
	{ apiName: 'radio/id', expected: 200, setup: (call, entities) => { call.data.id = entities.radio.id; } },
	{ apiName: 'root/status', expected: 200, setup: (call, entities) => { call.data.id = entities.mockRoot.id; } },
	{ apiName: 'root/id', expected: 200, setup: (call, entities) => { call.data.id = entities.mockRoot.id; } },
	{ apiName: 'playlist/id', expected: 200, setup: (call, entities) => { call.data.id = entities.playlist.id; } },
	{ apiName: 'bookmark/id', expected: 200, setup: (call, entities) => { call.data.id = entities.bookmark.id; } },
	{ apiName: 'user/id', expected: 200, setup: (call, entities) => { call.data.id = entities.user.id; } },
	{ apiName: 'state/id', expected: 200, setup: (call, entities) => { call.data.id = entities.track.id; } },
	{ apiName: 'waveform/json', expected: 200, setup: (call, entities) => { call.data.id = entities.track.id; } },
	{ apiName: 'waveform/svg', expected: 200, setup: (call, entities) => { call.data.id = entities.track.id; } },
	{ apiName: 'track/lyrics', expected: 200, setup: (call, entities) => { call.data.id = entities.track.id; } },
	{ apiName: 'track/id', expected: 200, setup: (call, entities) => { call.data.id = entities.track.id; } },
	{ apiName: 'episode/status', expected: 200, setup: (call, entities) => { call.data.id = entities.episode.id; } },
	{ apiName: 'episode/id', expected: 200, setup: (call, entities) => { call.data.id = entities.episode.id; } },
	{ apiName: 'podcast/status', expected: 200, setup: (call, entities) => { call.data.id = entities.podcast.id; } },
	{ apiName: 'podcast/id', expected: 200, setup: (call, entities) => { call.data.id = entities.podcast.id; } },
	{ apiName: 'stream/{id}_{maxBitRate}.{format}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'stream/{id}_{maxBitRate}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'stream/{id}.{format}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'stream/{id}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'download/{id}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'download/{id}.{format}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'waveform/{id}_{width}.{format}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'waveform/{id}.{format}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'waveform/{id}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'image/{id}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'image/{id}_{size}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'image/{id}.{format}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'image/{id}_{size}.{format}', expected: 200, binary: true, setup: (call, entities) => { call.params.id = entities.track.id; } },
	{ apiName: 'artist/similar/tracks', expected: 500, setup: (call, entities) => { call.data.id = entities.artist.id; } },
	{ apiName: 'artist/similar', expected: 500, setup: (call, entities) => { call.data.id = entities.artist.id; } },
	{ apiName: 'album/similar/tracks', expected: 500, setup: (call, entities) => { call.data.id = entities.album.id; } },
	{ apiName: 'track/similar', expected: 500, setup: (call, entities) => { call.data.id = entities.track.id; } },
	{ apiName: 'metadata/acoustid/lookup', expected: 500, setup: (call, entities) => { call.data.trackID = entities.track.id; } },
	{ apiName: 'podcast/discover/top', expected: 500 },
	{ apiName: 'podcast/discover/byTag', expected: 500 },
	{ apiName: 'podcast/discover/tags', expected: 500 },
	{ apiName: 'podcast/discover', expected: 500 },
	{ apiName: 'metadata/lrclib/get', expected: 500 },
	{ apiName: 'metadata/lyricsovh/search', expected: 500 },
	{ apiName: 'metadata/musicbrainz/search', expected: 500 },
	{ apiName: 'metadata/acousticbrainz/lookup', expected: 500 },
	{ apiName: 'metadata/coverartarchive/lookup', expected: 500 },
	{ apiName: 'metadata/wikidata/summary', expected: 500 },
	{ apiName: 'metadata/wikidata/lookup', expected: 500 },
	{ apiName: 'metadata/wikipedia/summary', expected: 500 },
	{ apiName: 'metadata/musicbrainz/lookup', expected: 500 },
	{ apiName: 'metadata/discogs/search/release', expected: 500 },
	{ apiName: 'metadata/discogs/search/artist', expected: 500 },
	{ apiName: 'metadata/discogs/release', expected: 500 },
	{ apiName: 'metadata/discogs/artist', expected: 500 },
	{ apiName: 'metadata/discogs/master', expected: 500 },
	{ apiName: 'metadata/discogs/master/versions', expected: 500 },
	{ apiName: 'metadata/lastfm/lookup', expected: 500 },
	{ apiName: 'metadata/coverartarchive/image', expected: 500, binary: true, setup: call => { call.data.url = 'https://coverartarchive.org/invalid.png'; } },
	{ apiName: 'metadata/discogs/image', expected: 500, binary: true, setup: call => { call.data.url = 'https://i.discogs.com/invalid.png'; } },
	{ apiName: 'admin/queue/id', expected: 200 },
	{ apiName: 'admin/settings/get', expected: 200 },
	{ apiName: 'album/index', expected: 200 },
	{ apiName: 'album/search', expected: 200 },
	{ apiName: 'album/tracks', expected: 200 },
	{ apiName: 'artist/albums', expected: 200 },
	{ apiName: 'artist/index', expected: 200 },
	{ apiName: 'artist/search', expected: 200 },
	{ apiName: 'artist/series', expected: 200 },
	{ apiName: 'artist/tracks', expected: 200 },
	{ apiName: 'autocomplete', expected: 200 },
	{ apiName: 'bookmark/search', expected: 200 },
	{ apiName: 'chat/list', expected: 200 },
	{ apiName: 'episode/search', expected: 200 },
	{ apiName: 'genre/albums', expected: 200 },
	{ apiName: 'genre/artists', expected: 200 },
	{ apiName: 'genre/index', expected: 200 },
	{ apiName: 'genre/search', expected: 200 },
	{ apiName: 'genre/tracks', expected: 200 },
	{ apiName: 'landscape', expected: 200 },
	{ apiName: 'nowPlaying/list', expected: 200 },
	{ apiName: 'ping', expected: 200 },
	{ apiName: 'playlist/entries', expected: 200 },
	{ apiName: 'playlist/index', expected: 200 },
	{ apiName: 'playlist/search', expected: 200 },
	{ apiName: 'playqueue/get', expected: 200 },
	{ apiName: 'podcast/episodes', expected: 200 },
	{ apiName: 'podcast/index', expected: 200 },
	{ apiName: 'podcast/search', expected: 200 },
	{ apiName: 'radio/index', expected: 200 },
	{ apiName: 'radio/search', expected: 200 },
	{ apiName: 'root/search', expected: 200 },
	{ apiName: 'series/albums', expected: 200 },
	{ apiName: 'series/index', expected: 200 },
	{ apiName: 'series/search', expected: 200 },
	{ apiName: 'series/tracks', expected: 200 },
	{ apiName: 'session', expected: 200 },
	{ apiName: 'session/list', expected: 200 },
	{ apiName: 'state/list', expected: 200 },
	{ apiName: 'stats', expected: 200 },
	{ apiName: 'stats/user', expected: 200 },
	{ apiName: 'user/search', expected: 200 }
];

describe.each(DBConfigs)('REST with %o', db => {
	let server: Server;
	let dir: tmp.DirResult;
	let openapi: OpenAPIObject;
	let request: TestAgent<supertest.Test>;
	let mockCall: (mock: RequestMock, expected: number, token?: string, binary?: boolean) => supertest.Test;
	let mockRoot: MockRoot;
	const tokens: Record<string, string> = {
		admin: '',
		podcast: '',
		stream: '',
		upload: ''
	};
	let mocks: Array<RequestMock>;
	let validMocks: Array<RequestMock>;

	beforeAll(async () => {
		nock.cleanAll();
		dir = tmp.dirSync();
		bindMockConfig(dir.name, db, false);
		server = getTestContainer().get(Server);
		await server.init();
		await server.engine.init();
		await server.engine.orm.drop();
		await server.engine.start();
		await server.start();
		await waitEngineStart(server.engine);
		const orm = server.engine.orm.fork();

		request = supertest(`http://${server.configService.env.host}:${server.configService.env.port}`);

		await server.engine.user.createUser(orm, 'all', 'all@localhost', 'all', true, true, true, true);
		const response = await request.post(`${apiPrefix}auth/login`)
			.send({ username: 'all', password: 'all', client: 'supertest-tests', jwt: true });
		if (response.status !== 200) {
			throw new Error(`Invalid Test Setup, Login failed ${response.text}`);
		}
		tokens.all = response.body.jwt;

		for (const role of roles) {
			await server.engine.user.createUser(orm, role, `${role}@localhost`, role,
				role === UserRole.admin,
				role === UserRole.stream,
				role === UserRole.upload,
				role === UserRole.podcast
			);
			const res2 = await request.post(`${apiPrefix}auth/login`)
				.send({ username: role, password: role, client: 'supertest-tests', jwt: true });
			if (res2.status !== 200) {
				throw new Error(`Invalid Test Setup, Login failed ${res2.text}`);
			}
			tokens[role] = res2.body.jwt;
		}

		openapi = JSON.parse(server.docs.getOpenApiSchema());
		const joi = (jestOpenAPI as any).default ?? (jestOpenAPI as any);
		joi(openapi as OpenAPISpecObject);

		const get = (mock: RequestMock, expected: number, token?: string, binary?: boolean): supertest.Test => {
			let url = apiPrefix + mock.apiName;
			if (mock.params) {
				const split = mock.apiName.split('/');
				let api = split.at(-1) ?? '';
				for (const key of Object.keys(mock.params)) {
					const value = mock.params[key];
					api = api.replace(`{${key}}`, encodeURIComponent(`${value}`));
				}
				if (api.trim().length === 0) {
					expected = 404;
				}
				split[split.length - 1] = api;
				url = apiPrefix + split.join('/');
			}
			const message = JSON.stringify({ url, message: token ? undefined : 'should fail of missing auth', mock }, undefined, '\t');
			return request.get(url)
				.query(mock.data)
				.set('Authorization', token ? `Bearer ${token}` : '')
				.expect(response => {
					if (response.status !== expected) {
						console.error(message + JSON.stringify(response.text));
					}
					expect(response.status).toBe(expected);
					if (expected === 200 && !binary && process.env.API_SPEC_TEST !== 'false') {
						expect(response).toSatisfyApiSpec();
					}
				});
		};
		const post = (mock: RequestMock, expected: number, token?: string, binary?: boolean): supertest.Test => {
			let url = apiPrefix + mock.apiName;
			if (mock.params) {
				const split = mock.apiName.split('/');
				let api = split.at(-1) ?? '';
				for (const key of Object.keys(mock.params)) {
					const value = mock.params[key];
					api = api.replace(`{${key}}`, value);
				}
				if (api.trim().length === 0) {
					expected = 404;
				}
				split[split.length - 1] = api;
				url = apiPrefix + split.join('/');
			}
			const message = JSON.stringify({ url, message: token ? undefined : 'should fail of missing auth', mock }, undefined, '\t');
			return request.post(url)
				.query({})
				.send(mock.data)
				.set('Authorization', token ? `Bearer ${token}` : '')
				.expect(res => {
					if (res.status !== expected) {
						console.error(message + JSON.stringify(res.text));
					}
					expect(res.status).toBe(expected);
					if (expected === 200 && !binary && process.env.API_SPEC_TEST !== 'false') {
						expect(res).toSatisfyApiSpec();
					}
				});
		};
		mockCall = (mock, expected, token, binary): supertest.Test => {
			return mock.method === 'get' ? get(mock, expected, token, binary) : post(mock, expected, token, binary);
		};
		mocks = await MockRequests.generateRequestMocks(openapi);
		validMocks = [];
		for (const call of mocks) {
			if (call.valid && !validMocks.some(c => c.apiName === call.apiName)) {
				validMocks.push(call);
			}
		}
	});
	afterAll(async () => {
		await server.engine.stop();
		await server.stop();
		await fse.remove(dir.name);
	});

	describe('must fail', () => {
		it('should have MOCK_CASES entry for every valid GET mock', () => {
			const covered = new Set(MOCK_CASES.map(testCase => testCase.apiName));
			const uncovered = validMocks.filter(mock => mock.method === 'get' && !covered.has(mock.apiName));
			expect(uncovered.map(mock => mock.apiName)).toEqual([]);
		});
		it('should reject all invalid calls', async () => {
			const invalidMocks = mocks.filter(call => !call.valid);
			expect(invalidMocks.length).toBeGreaterThan(0);
			for (const call of invalidMocks) {
				await mockCall(call, call.expect, tokens.all);
			}
		});
		it('should reject all calls without auth', async () => {
			const validNonAuthMocks = mocks.filter(call => call.roles.length > 0);
			expect(validNonAuthMocks.length).toBeGreaterThan(0);
			for (const call of validNonAuthMocks) {
				await mockCall(call, 401);
			}
		});
		it.each(roles)('should reject all calls without role %s', async role => {
			const validRejectMocks = mocks.filter(call => call.roles.length > 0 && !call.roles.includes(role));
			expect(validRejectMocks.length).toBeGreaterThan(0);
			for (const call of validRejectMocks) {
				await mockCall(call, 401, tokens[role]);
			}
		});
	});

	describe('must succeed', () => {
		let entities: MockEntities;

		beforeAll(async () => {
			const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
			await fse.mkdir(mediaPath);
			mockRoot = buildMockRoot(mediaPath, 1, RootScanStrategy.auto);
			await writeAndStoreMock(mockRoot, server.engine.io.workerService, server.engine.orm.fork());
			await writeAndStoreExternalMedia(server.engine.io.workerService, server.engine.orm.fork());
			const orm = server.engine.orm.fork();
			entities = {
				album: await orm.Album.oneOrFailFilter({ since: 1 }),
				artist: await orm.Artist.oneOrFailFilter({ since: 1 }),
				series: await orm.Series.oneOrFailFilter({ since: 1 }),
				artwork: await orm.Artwork.oneOrFailFilter({ since: 1 }),
				folder: await orm.Folder.oneOrFailFilter({ since: 1 }),
				artistFolder: await orm.Folder.oneOrFailFilter({ folderTypes: [FolderType.artist] }),
				albumFolder: await orm.Folder.oneOrFailFilter({ folderTypes: [FolderType.album] }),
				bookmark: await orm.Bookmark.oneOrFailFilter({ since: 1 }),
				playlist: await orm.Playlist.oneOrFailFilter({ since: 1 }),
				track: await orm.Track.oneOrFailFilter({ since: 1 }),
				radio: await orm.Radio.oneOrFailFilter({ since: 1 }),
				podcast: await orm.Podcast.oneOrFailFilter({ since: 1 }),
				episode: await orm.Episode.oneOrFailFilter({ since: 1 }),
				genre: await orm.Genre.oneOrFailFilter({ since: 1 }),
				user: await orm.User.oneOrFailFilter({ name: 'admin' }),
				mockRoot
			};
			for (const testCase of MOCK_CASES) {
				const call = validMocks.find(mock => mock.apiName === testCase.apiName && mock.method === 'get');
				if (call && testCase.setup) {
					testCase.setup(call, entities);
				}
			}
		});

		afterAll(async () => {
			await fse.remove(dir.name);
		});

		it.each(MOCK_CASES)('should succeed $apiName', async testCase => {
			const call = validMocks.find(mock => mock.apiName === testCase.apiName && mock.method === 'get');
			expect(call).toBeDefined();
			if (!call) {
				return;
			}
			await mockCall(call, testCase.expected, tokens.all, testCase.binary);
		});
	});
});
