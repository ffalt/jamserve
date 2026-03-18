import { BookmarkTransformService } from '../../../src/entity/bookmark/bookmark.transform.js';
import { makeBookmark } from '../shared/make-bookmark.js';

const mockOrm = {} as never;

function makeService() {
	return new BookmarkTransformService();
}

describe('BookmarkTransformService.bookmarkBase', () => {
	test('returns core bookmark fields', async () => {
		const service = makeService();
		const bookmark = makeBookmark({
			position: 12_345,
			comment: 'paused here',
			trackId: 'track-1'
		}) as never;

		const result = await service.bookmarkBase(mockOrm, bookmark);

		expect(result.id).toBe('bookmark-1');
		expect(result.position).toBe(12_345);
		expect(result.comment).toBe('paused here');
	});

	test('sets created from createdAt timestamp', async () => {
		const service = makeService();
		const createdAt = new Date(1_700_000_000_000);
		const bookmark = makeBookmark({ createdAt }) as never;

		const result = await service.bookmarkBase(mockOrm, bookmark);

		expect(result.created).toBe(createdAt.valueOf());
	});

	test('sets changed from updatedAt timestamp', async () => {
		const service = makeService();
		const updatedAt = new Date(1_700_000_001_000);
		const bookmark = makeBookmark({ updatedAt }) as never;

		const result = await service.bookmarkBase(mockOrm, bookmark);

		expect(result.changed).toBe(updatedAt.valueOf());
	});

	test('sets trackID from track reference', async () => {
		const service = makeService();
		const bookmark = makeBookmark({ trackId: 'track-42' }) as never;

		const result = await service.bookmarkBase(mockOrm, bookmark);

		expect(result.trackID).toBe('track-42');
	});

	test('sets episodeID from episode reference', async () => {
		const service = makeService();
		const bookmark = makeBookmark({ episodeId: 'episode-7' }) as never;

		const result = await service.bookmarkBase(mockOrm, bookmark);

		expect(result.episodeID).toBe('episode-7');
	});

	test('trackID is undefined when bookmark has no track', async () => {
		const service = makeService();
		const bookmark = makeBookmark() as never;

		const result = await service.bookmarkBase(mockOrm, bookmark);

		expect(result.trackID).toBeUndefined();
	});

	test('episodeID is undefined when bookmark has no episode', async () => {
		const service = makeService();
		const bookmark = makeBookmark() as never;

		const result = await service.bookmarkBase(mockOrm, bookmark);

		expect(result.episodeID).toBeUndefined();
	});

	test('comment can be undefined', async () => {
		const service = makeService();
		const bookmark = makeBookmark() as never;

		const result = await service.bookmarkBase(mockOrm, bookmark);

		expect(result.comment).toBeUndefined();
	});
});
