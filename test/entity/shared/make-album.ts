import { jest } from '@jest/globals';
import { AlbumType } from '../../../src/types/enums.js';

export function makeAlbum({
	id = 'album-1',
	name = 'Test Album',
	albumType = AlbumType.album,
	year = 2020,
	duration = 3600,
	mbArtistID = 'mb-artist-id' as string | undefined,
	mbReleaseID = 'mb-release-id',
	seriesNr = '001',
	createdAt = new Date(1_700_000_000_000),
	artist = { id: 'artist-1', name: 'Test Artist' } as { id: string; name: string },
	series = undefined as { id: string; name: string } | undefined,
	trackIds = [] as Array<string>,
	trackCount = undefined as number | undefined,
	tracks = [] as Array<{ id: string }>,
	genres = [] as Array<unknown>,
	roots = [] as Array<unknown>,
	folders = [] as Array<unknown>
} = {}) {
	const resolvedTrackCount = trackCount ?? tracks.length;
	return {
		id,
		name,
		albumType,
		year,
		duration,
		mbArtistID,
		mbReleaseID,
		seriesNr,
		createdAt,
		artist: {
			getOrFail: jest.fn().mockResolvedValue(artist as never),
			get: jest.fn().mockResolvedValue(artist as never),
			id: jest.fn().mockReturnValue(artist?.id)
		},
		series: {
			get: jest.fn().mockResolvedValue(series as never),
			id: jest.fn().mockReturnValue(series?.id)
		},
		tracks: {
			count: jest.fn().mockResolvedValue(resolvedTrackCount as never),
			getIDs: jest.fn().mockResolvedValue(trackIds as never),
			getItems: jest.fn().mockResolvedValue(tracks as never)
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
