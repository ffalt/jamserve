import { jest } from '@jest/globals';
import { BookmarkService } from '../../../src/entity/bookmark/bookmark.service.js';
import { DBObjectType } from '../../../src/types/enums.js';

const mockUser = { id: 'user-1' } as never;

function makeService() {
	return new BookmarkService();
}

function makeOrm({ existingBookmark = null as unknown, streamResult = null as unknown } = {}) {
	const newBookmark = {
		comment: undefined as string | undefined,
		track: { set: jest.fn().mockResolvedValue(undefined as never) },
		episode: { set: jest.fn().mockResolvedValue(undefined as never) },
		user: { set: jest.fn().mockResolvedValue(undefined as never) }
	};
	const orm = {
		Bookmark: {
			findOne: jest.fn().mockResolvedValue(existingBookmark as never),
			create: jest.fn().mockReturnValue(newBookmark),
			persistAndFlush: jest.fn().mockResolvedValue(undefined as never),
			removeByQueryAndFlush: jest.fn().mockResolvedValue(undefined as never)
		},
		findInStreamTypes: jest.fn().mockResolvedValue(streamResult as never)
	};
	return { orm, newBookmark };
}

describe('BookmarkService.create', () => {
	test('updates comment on existing bookmark and saves', async () => {
		const service = makeService();
		const existingBookmark = { comment: 'old comment' };
		const { orm } = makeOrm({ existingBookmark });

		await service.create(orm as never, 'dest-1', mockUser, 1000, 'new comment');

		expect(existingBookmark.comment).toBe('new comment');
		expect(orm.Bookmark.persistAndFlush).toHaveBeenCalledWith(existingBookmark);
	});

	test('does not call findInStreamTypes when bookmark already exists', async () => {
		const service = makeService();
		const existingBookmark = { comment: 'old' };
		const { orm } = makeOrm({ existingBookmark });

		await service.create(orm as never, 'dest-1', mockUser, 1000, undefined);

		expect(orm.findInStreamTypes).not.toHaveBeenCalled();
	});

	test('rejects when destination stream type not found', async () => {
		const service = makeService();
		const { orm } = makeOrm({ streamResult: null });

		await expect(service.create(orm as never, 'missing-id', mockUser, 1000, undefined))
			.rejects.toBeDefined();
	});

	test('creates bookmark with track when destination is a track', async () => {
		const service = makeService();
		const trackObj = { id: 'track-1' };
		const { orm, newBookmark } = makeOrm({ streamResult: { objType: DBObjectType.track, obj: trackObj } });

		const result = await service.create(orm as never, 'track-1', mockUser, 1000, 'comment');

		expect(newBookmark.track.set).toHaveBeenCalledWith(trackObj);
		expect(newBookmark.episode.set).toHaveBeenCalledWith(undefined);
		expect(newBookmark.user.set).toHaveBeenCalledWith(mockUser);
		expect(orm.Bookmark.persistAndFlush).toHaveBeenCalledWith(newBookmark);
		expect(result).toBe(newBookmark);
	});

	test('creates bookmark with episode when destination is an episode', async () => {
		const service = makeService();
		const episodeObj = { id: 'episode-1' };
		const { orm, newBookmark } = makeOrm({ streamResult: { objType: DBObjectType.episode, obj: episodeObj } });

		await service.create(orm as never, 'episode-1', mockUser, 2000, undefined);

		expect(newBookmark.episode.set).toHaveBeenCalledWith(episodeObj);
		expect(newBookmark.track.set).toHaveBeenCalledWith(undefined);
		expect(newBookmark.user.set).toHaveBeenCalledWith(mockUser);
	});

	test('passes position and comment to Bookmark.create', async () => {
		const service = makeService();
		const { orm } = makeOrm({ streamResult: { objType: DBObjectType.track, obj: { id: 'track-1' } } });

		await service.create(orm as never, 'track-1', mockUser, 5000, 'my note');

		expect(orm.Bookmark.create).toHaveBeenCalledWith({ position: 5000, comment: 'my note' });
	});

	test('returns existing bookmark when found', async () => {
		const service = makeService();
		const existingBookmark = { comment: 'existing' };
		const { orm } = makeOrm({ existingBookmark });

		const result = await service.create(orm as never, 'dest-1', mockUser, 1000, 'updated');

		expect(result).toBe(existingBookmark);
	});
});

describe('BookmarkService.remove', () => {
	test('removes bookmark by id and user', async () => {
		const service = makeService();
		const { orm } = makeOrm();

		await service.remove(orm as never, 'bookmark-1', 'user-1');

		expect(orm.Bookmark.removeByQueryAndFlush).toHaveBeenCalledWith({ where: { id: 'bookmark-1', user: 'user-1' } });
	});

	test('uses provided bookmarkID and userID', async () => {
		const service = makeService();
		const { orm } = makeOrm();

		await service.remove(orm as never, 'bookmark-99', 'user-42');

		expect(orm.Bookmark.removeByQueryAndFlush).toHaveBeenCalledWith({ where: { id: 'bookmark-99', user: 'user-42' } });
	});
});

describe('BookmarkService.removeByDest', () => {
	test('removes bookmarks matching destination and user', async () => {
		const service = makeService();
		const { orm } = makeOrm();

		await service.removeByDest(orm as never, 'dest-1', 'user-1');

		expect(orm.Bookmark.removeByQueryAndFlush).toHaveBeenCalledTimes(1);
		const callArgument = orm.Bookmark.removeByQueryAndFlush.mock.calls[0][0] as { where: { user: string } };
		expect(callArgument.where.user).toBe('user-1');
	});

	test('uses provided destinationID and userID', async () => {
		const service = makeService();
		const { orm } = makeOrm();

		await service.removeByDest(orm as never, 'dest-99', 'user-42');

		const callArgument = orm.Bookmark.removeByQueryAndFlush.mock.calls[0][0] as { where: { user: string } };
		expect(callArgument.where.user).toBe('user-42');
	});
});
