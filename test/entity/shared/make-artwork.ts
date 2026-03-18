import { jest } from '@jest/globals';
import { ArtworkImageType } from '../../../src/types/enums.js';

export function makeArtwork({
	id = 'artwork-1',
	name = 'cover.jpg',
	path = '/music/artist/album',
	types = [ArtworkImageType.front] as Array<ArtworkImageType>,
	fileSize = 102_400,
	width = 500,
	height = 500,
	format = 'jpeg',
	createdAt = new Date(1_700_000_000_000),
	folder = { id: 'folder-1', root: { idOrFail: () => 'root-1' } } as { id: string; root: { idOrFail: () => string } }
} = {}) {
	return {
		id,
		name,
		path,
		types,
		fileSize,
		width,
		height,
		format,
		createdAt,
		folder: {
			getOrFail: jest.fn().mockResolvedValue(folder as never),
			get: jest.fn().mockResolvedValue(folder as never),
			id: jest.fn().mockReturnValue(folder?.id)
		}
	};
}
