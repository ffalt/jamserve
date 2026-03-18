import { Op } from 'sequelize';
import { AlbumRepository } from '../../../src/entity/album/album.repository.js';
import { AlbumOrderFields } from '../../../src/types/enums.js';
import { AlbumFilterParameters, AlbumOrderParameters } from '../../../src/entity/album/album.parameters.js';
import { flattenWhere } from '../shared/query-helpers.js';
import { makeRepo as makeBaseRepo } from '../shared/make-repo.js';

function makeRepo(dialect: 'sqlite' | 'postgres' = 'sqlite'): AlbumRepository {
	return makeBaseRepo(AlbumRepository, dialect);
}

describe('AlbumRepository.buildOrder', () => {
	test('returns empty array when no order given', () => {
		const repo = makeRepo();
		expect(repo.buildOrder(undefined)).toEqual([]);
	});

	test('returns empty array for unknown orderBy value', () => {
		const repo = makeRepo();
		expect(repo.buildOrder({ orderBy: 'unknown' as AlbumOrderFields, orderDesc: false })).toEqual([]);
	});

	test.each([
		[AlbumOrderFields.created, false, [['createdAt', 'ASC']]],
		[AlbumOrderFields.created, true, [['createdAt', 'DESC']]],
		[AlbumOrderFields.updated, false, [['updatedAt', 'ASC']]],
		[AlbumOrderFields.updated, true, [['updatedAt', 'DESC']]],
		[AlbumOrderFields.name, false, [['name', 'ASC']]],
		[AlbumOrderFields.name, true, [['name', 'DESC']]],
		[AlbumOrderFields.duration, false, [['duration', 'ASC']]],
		[AlbumOrderFields.duration, true, [['duration', 'DESC']]],
		[AlbumOrderFields.albumType, false, [['albumType', 'ASC']]],
		[AlbumOrderFields.albumType, true, [['albumType', 'DESC']]],
		[AlbumOrderFields.year, false, [['year', 'ASC']]],
		[AlbumOrderFields.year, true, [['year', 'DESC']]],
		[AlbumOrderFields.artist, false, [['artistORM', 'name', 'ASC']]],
		[AlbumOrderFields.artist, true, [['artistORM', 'name', 'DESC']]]
	])('orderBy %s desc=%s returns %j', (orderBy, orderDesc, expected) => {
		const repo = makeRepo();
		expect(repo.buildOrder({ orderBy, orderDesc })).toEqual(expected);
	});

	test('default order returns 4-field sort ascending', () => {
		const repo = makeRepo();
		const result = repo.buildOrder({ orderBy: AlbumOrderFields.default, orderDesc: false });
		expect(result).toHaveLength(4);
		expect(result[0]).toEqual(['artistORM', 'name', 'ASC']);
		expect(result[1]).toEqual(['albumType', 'ASC']);
		expect(result[2]).toEqual(['year', 'DESC']); // year is inverted for ASC default
		expect(result[3]).toEqual(['name', 'ASC']);
	});

	test('default order inverts year direction when descending', () => {
		const repo = makeRepo();
		const result = repo.buildOrder({ orderBy: AlbumOrderFields.default, orderDesc: true });
		expect(result[2]).toEqual(['year', 'ASC']); // year is inverted for DESC default
	});

	test('seriesNr order on sqlite uses substr literal', () => {
		const repo = makeRepo('sqlite');
		const result = repo.buildOrder({ orderBy: AlbumOrderFields.seriesNr, orderDesc: false });
		expect(result).toHaveLength(1);
		const [item] = result as Array<[unknown, string]>;
		expect(item[1]).toBe('ASC');
		const literal = item[0] as { val: string };
		expect(literal.val).toContain('seriesNr');
	});

	test('seriesNr order on postgres uses LPAD literal', () => {
		const repo = makeRepo('postgres');
		const result = repo.buildOrder({ orderBy: AlbumOrderFields.seriesNr, orderDesc: true });
		expect(result).toHaveLength(1);
		const [item] = result as Array<[unknown, string]>;
		expect(item[1]).toBe('DESC');
		const literal = item[0] as { val: string };
		expect(literal.val).toContain('LPAD');
	});

	test('seriesNr order throws for unknown dialect', () => {
		const repo = makeRepo();
		(repo as never as { em: { dialect: string } }).em = { dialect: 'mysql' };
		expect(() => repo.buildOrder({ orderBy: AlbumOrderFields.seriesNr, orderDesc: false })).toThrow();
	});
});

describe('AlbumRepository.buildFilter', () => {
	test('returns empty object when filter is undefined', async () => {
		const repo = makeRepo();
		const result = await repo.buildFilter(undefined, undefined);
		expect(result).toEqual({});
	});

	test('returns result for empty filter object', async () => {
		const repo = makeRepo();
		const result = await repo.buildFilter({} as AlbumFilterParameters, undefined);
		expect(result).toBeDefined();
	});

	test('includes id filter when ids provided', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { ids: ['id-1', 'id-2'] };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const idCondition = conditions.find(c => 'id' in c);
		expect(idCondition).toBeDefined();
		// Sequelize accepts an array directly as an IN clause
		expect(idCondition!.id).toEqual(['id-1', 'id-2']);
	});

	test('includes name filter when name provided', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { name: 'Dark Side' };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const nameCondition = conditions.find(c => 'name' in c && c.name === 'Dark Side');
		expect(nameCondition).toBeDefined();
	});

	test('includes mbReleaseID filter', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { mbReleaseIDs: ['mb-release-1'] };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const mbCondition = conditions.find(c => 'mbReleaseID' in c);
		expect(mbCondition).toBeDefined();
		expect(mbCondition!.mbReleaseID).toBe('mb-release-1');
	});

	test('includes mbArtistID filter', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { mbArtistIDs: ['mb-artist-1'] };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const mbCondition = conditions.find(c => 'mbArtistID' in c);
		expect(mbCondition).toBeDefined();
		expect(mbCondition!.mbArtistID).toBe('mb-artist-1');
	});

	test('includes albumTypes filter', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { albumTypes: ['album'] as AlbumFilterParameters['albumTypes'] };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const typeCondition = conditions.find(c => 'albumType' in c);
		expect(typeCondition).toBeDefined();
		expect(typeCondition!.albumType).toBe('album');
	});

	test('includes since filter using Op.gte on createdAt', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { since: 1_700_000_000 };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const sinceCondition = conditions.find(c => 'createdAt' in c);
		expect(sinceCondition).toBeDefined();
		const value = sinceCondition!.createdAt as Record<symbol, unknown>;
		expect(value[Op.gte]).toBe(1_700_000_000);
	});

	test('includes year range filters using Op.gte and Op.lte', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { fromYear: 2000, toYear: 2010 };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const yearConditions = conditions.filter(c => 'year' in c);
		expect(yearConditions.length).toBeGreaterThanOrEqual(2);
		const lteValues = yearConditions.map(c => (c.year as Record<symbol, unknown>)[Op.lte]).filter(v => v !== undefined);
		const gteValues = yearConditions.map(c => (c.year as Record<symbol, unknown>)[Op.gte]).filter(v => v !== undefined);
		expect(lteValues).toContain(2010);
		expect(gteValues).toContain(2000);
	});

	test('includes notMbArtistID exclusion using Op.ne', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { notMbArtistID: 'excluded-artist' };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const artistCondition = conditions.find(c => 'mbArtistID' in c);
		expect(artistCondition).toBeDefined();
		const value = artistCondition!.mbArtistID as Record<symbol, unknown>;
		expect(value[Op.ne]).toBe('excluded-artist');
	});

	test('includes like query on name for sqlite using Op.like', async () => {
		const repo = makeRepo('sqlite');
		const filter: AlbumFilterParameters = { query: 'dark' };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const nameCondition = conditions.find(c => 'name' in c);
		expect(nameCondition).toBeDefined();
		const value = nameCondition!.name as Record<symbol, unknown>;
		expect(value[Op.like]).toContain('dark');
	});

	test('includes iLike query on name for postgres', async () => {
		const repo = makeRepo('postgres');
		const filter: AlbumFilterParameters = { query: 'dark' };
		const result = await repo.buildFilter(filter, undefined);
		const conditions = flattenWhere(result.where);
		const nameCondition = conditions.find(c => 'name' in c);
		expect(nameCondition).toBeDefined();
		const value = nameCondition!.name as Record<symbol, unknown>;
		expect(value[Op.iLike]).toContain('dark');
	});

	test('sets include for genre filter', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { genreIDs: ['genre-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('genre-1');
	});

	test('sets include for track filter', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { trackIDs: ['track-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('track-1');
	});

	test('sets include for series filter', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { seriesIDs: ['series-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('series-1');
	});

	test('sets include for folder filter', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { folderIDs: ['folder-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('folder-1');
	});

	test('sets include for root filter', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { rootIDs: ['root-1'] };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('root-1');
	});

	test('sets include for artist filter by name', async () => {
		const repo = makeRepo();
		const filter: AlbumFilterParameters = { artist: 'Pink Floyd' };
		const result = await repo.buildFilter(filter, undefined);
		expect(result.include).toBeDefined();
		expect(JSON.stringify(result.include)).toContain('Pink Floyd');
	});
});

describe('AlbumRepository properties', () => {
	test('objType is album', () => {
		const repo = makeRepo();
		expect(repo.objType).toBe('album');
	});

	test('indexProperty is name', () => {
		const repo = makeRepo();
		expect(repo.indexProperty).toBe('name');
	});
});

describe('AlbumOrderParameters', () => {
	test('orderBy is optional', () => {
		const parameters: AlbumOrderParameters = {};
		expect(parameters.orderBy).toBeUndefined();
	});

	test('orderDesc is optional', () => {
		const parameters: AlbumOrderParameters = { orderBy: AlbumOrderFields.name };
		expect(parameters.orderDesc).toBeUndefined();
	});
});
