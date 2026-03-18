import { jest } from '@jest/globals';
import { AlbumType } from '../../../src/types/enums.js';

export function makeSeries({
	id = 'series-1',
	name = 'Test Series',
	createdAt = new Date(1_700_000_000_000),
	albumTypes = [AlbumType.album] as Array<AlbumType>,
	artist = { id: 'artist-1', name: 'Test Artist' } as { id: string; name: string },
	trackIds = [] as Array<string>,
	trackCount = undefined as number | undefined,
	tracks = [] as Array<{ id: string }>,
	albumIds = [] as Array<string>,
	albumCount = undefined as number | undefined,
	albums = [] as Array<{ id: string }>,
	genres = [] as Array<unknown>,
	roots = [] as Array<unknown>,
	folders = [] as Array<unknown>
} = {}) {
	const resolvedTrackCount = trackCount ?? tracks.length;
	const resolvedAlbumCount = albumCount ?? albums.length;
	return {
		id,
		name,
		createdAt,
		albumTypes,
		artist: {
			getOrFail: jest.fn().mockResolvedValue(artist as never),
			get: jest.fn().mockResolvedValue(artist as never),
			id: jest.fn().mockReturnValue(artist?.id)
		},
		tracks: {
			getItems: jest.fn().mockResolvedValue(tracks as never),
			count: jest.fn().mockResolvedValue(resolvedTrackCount as never),
			getIDs: jest.fn().mockResolvedValue(trackIds as never)
		},
		albums: {
			getItems: jest.fn().mockResolvedValue(albums as never),
			count: jest.fn().mockResolvedValue(resolvedAlbumCount as never),
			getIDs: jest.fn().mockResolvedValue(albumIds as never)
		},
		genres: {
			getItems: jest.fn().mockResolvedValue(genres as never),
			count: jest.fn().mockResolvedValue(genres.length as never)
		},
		roots: {
			getItems: jest.fn().mockResolvedValue(roots as never),
			count: jest.fn().mockResolvedValue((roots as Array<unknown>).length as never)
		},
		folders: {
			getItems: jest.fn().mockResolvedValue(folders as never),
			count: jest.fn().mockResolvedValue((folders as Array<unknown>).length as never)
		}
	};
}
