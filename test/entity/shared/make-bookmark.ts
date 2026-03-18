import { jest } from '@jest/globals';

export function makeBookmark({
	id = 'bookmark-1',
	position = 42_000,
	comment = undefined as string | undefined,
	createdAt = new Date(1_700_000_000_000),
	updatedAt = new Date(1_700_000_001_000),
	trackId = undefined as string | undefined,
	episodeId = undefined as string | undefined
} = {}) {
	return {
		id,
		position,
		comment,
		createdAt,
		updatedAt,
		track: {
			get: jest.fn().mockResolvedValue((trackId ? { id: trackId } : undefined) as never),
			id: jest.fn().mockReturnValue(trackId),
			set: jest.fn().mockResolvedValue(undefined as never)
		},
		episode: {
			get: jest.fn().mockResolvedValue((episodeId ? { id: episodeId } : undefined) as never),
			id: jest.fn().mockReturnValue(episodeId),
			set: jest.fn().mockResolvedValue(undefined as never)
		},
		user: {
			get: jest.fn().mockResolvedValue({ id: 'user-1' } as never),
			set: jest.fn().mockResolvedValue(undefined as never)
		}
	};
}
