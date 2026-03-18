import { jest } from '@jest/globals';
import { AlbumType } from '../../../src/types/enums.js';

export function makeArtist({
	id = 'artist-1',
	name = 'Test Artist',
	createdAt = new Date(1_700_000_000_000),
	mbArtistID = undefined as string | undefined,
	albumTypes = [AlbumType.album] as Array<AlbumType>,
	tracks = [] as Array<{ id: string }>,
	trackCount = undefined as number | undefined,
	trackIds = [] as Array<string>,
	albumTracks = [] as Array<{ id: string }>,
	albums = [] as Array<{ id: string }>,
	albumCount = undefined as number | undefined,
	albumIds = [] as Array<string>,
	series = [] as Array<{ id: string }>,
	seriesCount = undefined as number | undefined,
	seriesIds = [] as Array<string>,
	genres = [] as Array<unknown>,
	roots = [] as Array<{ id: string }>,
	folders = [] as Array<{ id: string }>
} = {}) {
	const resolvedTrackCount = trackCount ?? tracks.length;
	const resolvedAlbumCount = albumCount ?? albums.length;
	const resolvedSeriesCount = seriesCount ?? series.length;
	return {
		id,
		name,
		createdAt,
		mbArtistID,
		albumTypes,
		tracks: {
			getItems: jest.fn().mockResolvedValue(tracks as never),
			count: jest.fn().mockResolvedValue(resolvedTrackCount as never),
			getIDs: jest.fn().mockResolvedValue(trackIds as never)
		},
		albumTracks: {
			getItems: jest.fn().mockResolvedValue(albumTracks as never),
			count: jest.fn().mockResolvedValue(albumTracks.length as never)
		},
		albums: {
			getItems: jest.fn().mockResolvedValue(albums as never),
			count: jest.fn().mockResolvedValue(resolvedAlbumCount as never),
			getIDs: jest.fn().mockResolvedValue(albumIds as never)
		},
		series: {
			getItems: jest.fn().mockResolvedValue(series as never),
			count: jest.fn().mockResolvedValue(resolvedSeriesCount as never),
			getIDs: jest.fn().mockResolvedValue(seriesIds as never)
		},
		genres: {
			getItems: jest.fn().mockResolvedValue(genres as never),
			count: jest.fn().mockResolvedValue(genres.length as never)
		},
		roots: {
			getItems: jest.fn().mockResolvedValue(roots as never),
			count: jest.fn().mockResolvedValue(roots.length as never)
		},
		folders: {
			getItems: jest.fn().mockResolvedValue(folders as never),
			count: jest.fn().mockResolvedValue(folders.length as never)
		}
	};
}
