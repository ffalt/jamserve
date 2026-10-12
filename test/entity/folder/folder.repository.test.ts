import { Op } from 'sequelize';
import { FolderRepository } from '../../../src/entity/folder/folder.repository.js';
import { Folder } from '../../../src/entity/folder/folder.js';

interface FolderRow {
	id: string;
	path: string;
	parent?: string;
}

function matchingRows(rows: Array<FolderRow>, options: unknown): Array<FolderRow> {
	const where = (options as { where?: Record<string, unknown> }).where ?? {};
	const value = where.parent;
	const list = (value as Record<symbol, Array<string> | undefined>)[Op.in] ?? [value as string];
	return rows.filter(row => !!row.parent && list.includes(row.parent));
}

function makeRepo(rows: Array<FolderRow>): FolderRepository {
	const em = {
		dialect: 'sqlite',
		find: async (_name: string, options: unknown): Promise<Array<Folder>> =>
			matchingRows(rows, options).map(row => row as unknown as Folder),
		findIDs: async (_name: string, options: unknown): Promise<Array<string>> =>
			matchingRows(rows, options).map(row => row.id)
	};
	return new FolderRepository(em as never, 'Folder' as never);
}

// f0 /music/
//  ├── f1 /music/Rock/
//  │    └── f3 /music/Rock/Album/
//  └── f2 /music/Rockabilly/
// g0 /backup/music/        (second root, path contains the path of f1)
//  └── g1 /backup/music/Rock/
const tree: Array<FolderRow> = [
	{ id: 'f0', path: '/music/' },
	{ id: 'f1', path: '/music/Rock/', parent: 'f0' },
	{ id: 'f2', path: '/music/Rockabilly/', parent: 'f0' },
	{ id: 'f3', path: '/music/Rock/Album/', parent: 'f1' },
	{ id: 'g0', path: '/backup/music/' },
	{ id: 'g1', path: '/backup/music/Rock/', parent: 'g0' }
];

describe('FolderRepository.findAllDescendantsIds', () => {
	test('returns the folder itself and all folders below it', async () => {
		const repo = makeRepo(tree);
		const ids = await repo.findAllDescendantsIds({ id: 'f1' } as Folder);
		expect(ids.sort((a, b) => a.localeCompare(b))).toEqual(['f1', 'f3']);
	});

	test('returns only the folder itself for a leaf', async () => {
		const repo = makeRepo(tree);
		expect(await repo.findAllDescendantsIds({ id: 'f3' } as Folder)).toEqual(['f3']);
	});

	test('descends more than one level', async () => {
		const repo = makeRepo(tree);
		const ids = await repo.findAllDescendantsIds({ id: 'f0' } as Folder);
		expect(ids.sort((a, b) => a.localeCompare(b))).toEqual(['f0', 'f1', 'f2', 'f3']);
	});

	test('does not match a folder of another root sharing the path', async () => {
		const repo = makeRepo(tree);
		expect(await repo.findAllDescendantsIds({ id: 'f1' } as Folder)).not.toContain('g1');
	});

	test('does not match a sibling with a longer name', async () => {
		const repo = makeRepo(tree);
		expect(await repo.findAllDescendantsIds({ id: 'f1' } as Folder)).not.toContain('f2');
	});

	test('does not treat LIKE wildcards in folder names as wildcards', async () => {
		const rows: Array<FolderRow> = [
			{ id: 'p', path: '/music/' },
			{ id: 'a', path: '/music/A_B/', parent: 'p' },
			{ id: 'b', path: '/music/AxB/', parent: 'p' },
			{ id: 'c', path: '/music/A_B/Album/', parent: 'a' },
			{ id: 'd', path: '/music/AxB/Album/', parent: 'b' }
		];
		const repo = makeRepo(rows);
		const ids = await repo.findAllDescendantsIds({ id: 'a' } as Folder);
		expect(ids.sort((a, b) => a.localeCompare(b))).toEqual(['a', 'c']);
	});

	test('terminates on a cycle in the parent relation', async () => {
		const rows: Array<FolderRow> = [
			{ id: 'a', path: '/music/a/', parent: 'b' },
			{ id: 'b', path: '/music/a/b/', parent: 'a' }
		];
		const repo = makeRepo(rows);
		expect((await repo.findAllDescendantsIds({ id: 'a' } as Folder)).sort((a, b) => a.localeCompare(b))).toEqual(['a', 'b']);
	});
});

describe('FolderRepository.findAllDescendants', () => {
	test('returns the given folder instance plus all folders below it', async () => {
		const repo = makeRepo(tree);
		const folder = { id: 'f1' } as Folder;
		const folders = await repo.findAllDescendants(folder);
		expect(folders.at(0)).toBe(folder);
		expect(folders.map(f => f.id).sort((a, b) => a.localeCompare(b))).toEqual(['f1', 'f3']);
	});

	test('does not match a folder of another root sharing the path', async () => {
		const repo = makeRepo(tree);
		const folders = await repo.findAllDescendants({ id: 'f1' } as Folder);
		expect(folders.map(f => f.id)).not.toContain('g1');
	});

	test('terminates on a cycle in the parent relation', async () => {
		const rows: Array<FolderRow> = [
			{ id: 'a', path: '/music/a/', parent: 'b' },
			{ id: 'b', path: '/music/a/b/', parent: 'a' }
		];
		const repo = makeRepo(rows);
		const folders = await repo.findAllDescendants({ id: 'a' } as Folder);
		expect(folders.map(f => f.id).sort((a, b) => a.localeCompare(b))).toEqual(['a', 'b']);
	});
});
