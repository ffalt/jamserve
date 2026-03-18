import { jest } from '@jest/globals';
import { BookmarkResolver } from '../../../src/entity/bookmark/bookmark.resolver.js';
import type { Context } from '../../../src/modules/server/middlewares/apollo.context.js';
import { makeBookmark } from '../shared/make-bookmark.js';

const mockUser = { id: 'user-1', roleAdmin: false };
const mockAdminUser = { id: 'admin-1', roleAdmin: true };
const mockBookmarkData = { id: 'bookmark-1' };

function makeContext(user = mockUser) {
	const orm = {
		Bookmark: {
			oneOrFail: jest.fn().mockResolvedValue(mockBookmarkData as never),
			searchFilter: jest.fn().mockResolvedValue({ items: [], total: 0 } as never)
		}
	};
	const context = { orm, user } as unknown as Context;
	return { orm, ctx: context };
}

const resolver = new BookmarkResolver();

describe('BookmarkResolver.bookmark (Query)', () => {
	test('filters by id and user for non-admin user', async () => {
		const { orm, ctx } = makeContext(mockUser);

		const result = await resolver.bookmark('bookmark-1', ctx);

		expect(orm.Bookmark.oneOrFail).toHaveBeenCalledWith({ where: { id: 'bookmark-1', user: 'user-1' } });
		expect(result).toBe(mockBookmarkData);
	});

	test('filters by id only for admin user', async () => {
		const { orm, ctx } = makeContext(mockAdminUser);

		const result = await resolver.bookmark('bookmark-1', ctx);

		expect(orm.Bookmark.oneOrFail).toHaveBeenCalledWith({ where: { id: 'bookmark-1' } });
		expect(result).toBe(mockBookmarkData);
	});

	test('passes different id to oneOrFail', async () => {
		const { orm, ctx } = makeContext(mockUser);

		await resolver.bookmark('bookmark-99', ctx);

		expect(orm.Bookmark.oneOrFail).toHaveBeenCalledWith({ where: { id: 'bookmark-99', user: 'user-1' } });
	});
});

describe('BookmarkResolver.bookmarks (Query)', () => {
	test('calls searchFilter with filter, order, page and user', async () => {
		const { orm, ctx } = makeContext();
		const filter = { comment: 'note' };
		const order = [{ orderBy: 'created' }];
		const page = { take: 20, skip: 0 };
		const arguments_ = { filter, page, order } as never;

		const result = await resolver.bookmarks(arguments_, ctx);

		expect(orm.Bookmark.searchFilter).toHaveBeenCalledWith(filter, order, page, mockUser);
		expect(result).toEqual({ items: [], total: 0 });
	});

	test('works with empty filter', async () => {
		const { orm, ctx } = makeContext();
		const arguments_ = { filter: {}, page: {}, order: [] } as never;

		await resolver.bookmarks(arguments_, ctx);

		expect(orm.Bookmark.searchFilter).toHaveBeenCalledWith({}, [], {}, mockUser);
	});
});

describe('BookmarkResolver.track (FieldResolver)', () => {
	test('returns track from bookmark reference', async () => {
		const trackObj = { id: 'track-1' };
		const bookmark = makeBookmark({ trackId: 'track-1' });

		const result = await resolver.track(bookmark as never);

		expect(bookmark.track.get).toHaveBeenCalled();
		expect(result).toEqual(trackObj);
	});

	test('returns undefined when bookmark has no track', async () => {
		const bookmark = makeBookmark();

		const result = await resolver.track(bookmark as never);

		expect(result).toBeUndefined();
	});
});

describe('BookmarkResolver.episode (FieldResolver)', () => {
	test('returns episode from bookmark reference', async () => {
		const episodeObj = { id: 'episode-1' };
		const bookmark = makeBookmark({ episodeId: 'episode-1' });

		const result = await resolver.episode(bookmark as never);

		expect(bookmark.episode.get).toHaveBeenCalled();
		expect(result).toEqual(episodeObj);
	});

	test('returns undefined when bookmark has no episode', async () => {
		const bookmark = makeBookmark();

		const result = await resolver.episode(bookmark as never);

		expect(result).toBeUndefined();
	});
});
