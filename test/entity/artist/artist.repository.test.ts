import { Op } from 'sequelize';
import { ArtistRepository } from '../../../src/entity/artist/artist.repository.js';
import { ArtistOrderFields } from '../../../src/types/enums.js';
import { ArtistFilterParameters, ArtistOrderParameters } from '../../../src/entity/artist/artist.parameters.js';
import { flattenWhere } from '../shared/query-helpers.js';
import { makeRepo as makeBaseRepo } from '../shared/make-repo.js';

function makeRepo(dialect: 'sqlite' | 'postgres' = 'sqlite'): ArtistRepository {
	return makeBaseRepo(ArtistRepository, dialect);
}

describe('ArtistRepository.buildOrder', () => {
	test('returns empty array when no order given', () => {
		const repo = makeRepo();
		expect(repo.buildOrder(undefined)).toEqual([]);
	});

	test('returns empty array for unknown orderBy value', () => {
		const repo = makeRepo();
		expect(repo.buildOrder({ orderBy: 'unknown' as ArtistOrderFields, orderDesc: false })).toEqual([]);
	});

	test.each([
		[ArtistOrderFields.created, false, [['createdAt', 'ASC']]],
		[ArtistOrderFields.created, true, [['createdAt', 'DESC']]],
		[ArtistOrderFields.updated, false, [['updatedAt', 'ASC']]],
		[ArtistOrderFields.updated, true, [['updatedAt', 'DESC']]],
		[ArtistOrderFields.name, false, [['name', 'ASC']]],
		[ArtistOrderFields.name, true, [['name', 'DESC']]],
		[ArtistOrderFields.nameSort, false, [['nameSort', 'ASC']]],
		[ArtistOrderFields.nameSort, true, [['nameSort', 'DESC']]],
		[ArtistOrderFields.default, false, [['nameSort', 'ASC']]],
		[ArtistOrderFields.default, true, [['nameSort', 'DESC']]]
	])('orderBy %s desc=%s returns %j', (orderBy, orderDesc, expected) => {
		const repo = makeRepo();
		expect(repo.buildOrder({ orderBy, orderDesc })).toEqual(expected);
	});
});

describe('ArtistRepository.buildFilter', () => {
	test('returns empty object when filter is undefined', async () => {
		const repo = makeRepo();
		const result = await repo.buildFilter(undefined, undefined);
		expect(result).toEqual({});
	});

	test('returns result for empty filter object', async () => {
		const repo = makeRepo();
		const result = await repo.buildFilter({} as ArtistFilterParameters, undefined);
		expect(result).toBeDefined();
	});

	test('includes id filter when ids provided', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { ids: ['id-1', 'id-2'] };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const idCondition = conditions.find(c => 'id' in c);
		expect(idCondition).toBeDefined();
		expect(idCondition!.id).toEqual(['id-1', 'id-2']);
	});

	test('includes name filter when name provided', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { name: 'Pink Floyd' };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const nameCondition = conditions.find(c => 'name' in c && (c.name as Record<symbol, unknown>)[Op.like] === undefined && c.name === 'Pink Floyd');
		expect(nameCondition).toBeDefined();
	});

	test('includes slug filter when slug provided', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { slug: 'pink-floyd' };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const slugCondition = conditions.find(c => 'slug' in c);
		expect(slugCondition).toBeDefined();
		expect(slugCondition!.slug).toBe('pink-floyd');
	});

	test('includes like query on name for sqlite using Op.like', async () => {
		const repo = makeRepo('sqlite');
		const filter: ArtistFilterParameters = { query: 'pink' };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const nameCondition = conditions.find(c => 'name' in c && typeof c.name === 'object');
		expect(nameCondition).toBeDefined();
		const value = nameCondition!.name as Record<symbol, unknown>;
		expect(value[Op.like]).toContain('pink');
	});

	test('includes iLike query on name for postgres', async () => {
		const repo = makeRepo('postgres');
		const filter: ArtistFilterParameters = { query: 'pink' };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const nameCondition = conditions.find(c => 'name' in c && typeof c.name === 'object');
		expect(nameCondition).toBeDefined();
		const value = nameCondition!.name as Record<symbol, unknown>;
		expect(value[Op.iLike]).toContain('pink');
	});

	test('includes mbArtistID filter when mbArtistIDs provided', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { mbArtistIDs: ['mb-1'] };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const mbCondition = conditions.find(c => 'mbArtistID' in c);
		expect(mbCondition).toBeDefined();
		expect(mbCondition!.mbArtistID).toBe('mb-1');
	});

	test('includes notMbArtistID exclusion using Op.ne', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { notMbArtistID: 'excluded-artist' };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const artistCondition = conditions.find(c => 'mbArtistID' in c);
		expect(artistCondition).toBeDefined();
		const value = artistCondition!.mbArtistID as Record<symbol, unknown>;
		expect(value[Op.ne]).toBe('excluded-artist');
	});

	test('includes since filter using Op.gte on createdAt', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { since: 1_700_000_000 };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const sinceCondition = conditions.find(c => 'createdAt' in c);
		expect(sinceCondition).toBeDefined();
		const value = sinceCondition!.createdAt as Record<symbol, unknown>;
		expect(value[Op.gte]).toBe(1_700_000_000);
	});

	test('includes albumTypes filter using Op.like pattern', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { albumTypes: ['album'] as ArtistFilterParameters['albumTypes'] };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const typeCondition = conditions.find(c => 'albumTypes' in c);
		expect(typeCondition).toBeDefined();
		const value = typeCondition!.albumTypes as Record<symbol, unknown>;
		expect(String(value[Op.like])).toContain('album');
	});

	test('sets include for genre filter by name', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { genres: ['Rock'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('Rock');
	});

	test('sets include for genre filter by id', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { genreIDs: ['genre-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('genre-1');
	});

	test('sets include for track filter', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { trackIDs: ['track-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('track-1');
	});

	test('sets include for albumTrack filter', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { albumTrackIDs: ['track-2'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('track-2');
	});

	test('sets include for series filter', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { seriesIDs: ['series-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('series-1');
	});

	test('sets include for album filter', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { albumIDs: ['album-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('album-1');
	});

	test('sets include for folder filter', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { folderIDs: ['folder-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('folder-1');
	});

	test('sets include for root filter', async () => {
		const repo = makeRepo();
		const filter: ArtistFilterParameters = { rootIDs: ['root-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('root-1');
	});
});

describe('ArtistRepository properties', () => {
	test('objType is artist', () => {
		const repo = makeRepo();
		expect(repo.objType).toBe('artist');
	});

	test('indexProperty is nameSort', () => {
		const repo = makeRepo();
		expect(repo.indexProperty).toBe('nameSort');
	});
});

describe('ArtistOrderParameters', () => {
	test('orderBy is optional', () => {
		const parameters: ArtistOrderParameters = {};
		expect(parameters.orderBy).toBeUndefined();
	});

	test('orderDesc is optional', () => {
		const parameters: ArtistOrderParameters = { orderBy: ArtistOrderFields.name };
		expect(parameters.orderDesc).toBeUndefined();
	});
});
