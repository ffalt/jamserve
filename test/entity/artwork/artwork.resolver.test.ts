import { jest } from '@jest/globals';
import { ArtworkResolver } from '../../../src/entity/artwork/artwork.resolver.js';
import type { Context } from '../../../src/modules/server/middlewares/apollo.context.js';
import { mockUser } from '../shared/mock-data.js';
import { makeArtwork } from '../shared/make-artwork.js';

function makeContext() {
	const orm = {
		Artwork: {
			oneOrFailByID: jest.fn().mockResolvedValue({ id: 'artwork-1' } as never),
			findListFilter: jest.fn().mockResolvedValue({ items: [], total: 0 } as never),
			searchFilter: jest.fn().mockResolvedValue({ items: [], total: 0 } as never)
		}
	};
	const context = { orm, user: mockUser } as unknown as Context;
	return { orm, ctx: context };
}

const resolver = new ArtworkResolver();

describe('ArtworkResolver.artwork (Query)', () => {
	test('returns artwork fetched by id', async () => {
		const { orm, ctx } = makeContext();

		const result = await resolver.artwork('artwork-1', ctx);

		expect(orm.Artwork.oneOrFailByID).toHaveBeenCalledWith('artwork-1');
		expect(result).toEqual({ id: 'artwork-1' });
	});

	test('passes different id to oneOrFailByID', async () => {
		const { orm, ctx } = makeContext();

		await resolver.artwork('artwork-99', ctx);

		expect(orm.Artwork.oneOrFailByID).toHaveBeenCalledWith('artwork-99');
	});
});

describe('ArtworkResolver.artworks (Query)', () => {
	test('uses searchFilter when no list type provided', async () => {
		const { orm, ctx } = makeContext();
		const arguments_ = { filter: {}, page: {}, order: [], list: undefined, seed: undefined } as never;

		const result = await resolver.artworks(arguments_, ctx);

		expect(orm.Artwork.searchFilter).toHaveBeenCalledWith({}, [], {}, mockUser);
		expect(orm.Artwork.findListFilter).not.toHaveBeenCalled();
		expect(result).toEqual({ items: [], total: 0 });
	});

	test('uses findListFilter when list type is provided', async () => {
		const { orm, ctx } = makeContext();
		const arguments_ = { filter: {}, page: {}, order: [], list: 'random' as never, seed: 'seed-1' } as never;

		const result = await resolver.artworks(arguments_, ctx);

		expect(orm.Artwork.findListFilter).toHaveBeenCalledWith('random', 'seed-1', {}, [], {}, mockUser);
		expect(orm.Artwork.searchFilter).not.toHaveBeenCalled();
		expect(result).toEqual({ items: [], total: 0 });
	});

	test('passes filter, order and page to searchFilter', async () => {
		const { orm, ctx } = makeContext();
		const filter = { types: ['front'] };
		const order = [{ orderBy: 'name' }];
		const page = { take: 5, skip: 0 };
		const arguments_ = { filter, page, order, list: undefined, seed: undefined } as never;

		await resolver.artworks(arguments_, ctx);

		expect(orm.Artwork.searchFilter).toHaveBeenCalledWith(filter, order, page, mockUser);
	});
});

describe('ArtworkResolver.folder (FieldResolver)', () => {
	test('returns folder from artwork reference', async () => {
		const folderObj = { id: 'folder-1' };
		const artwork = makeArtwork({ folder: folderObj as never });

		const result = await resolver.folder(artwork as never);

		expect(artwork.folder.getOrFail).toHaveBeenCalled();
		expect(result).toBe(folderObj);
	});
});
