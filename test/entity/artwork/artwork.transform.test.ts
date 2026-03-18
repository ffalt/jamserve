import { jest } from '@jest/globals';
import { ArtworkTransformService } from '../../../src/entity/artwork/artwork.transform.js';
import { ArtworkImageType, DBObjectType } from '../../../src/types/enums.js';
import { IncludesArtworkParameters } from '../../../src/entity/artwork/artwork.parameters.js';
import { makeMockOrm } from '../shared/make-orm.js';
import { makeArtwork } from '../shared/make-artwork.js';

const mockOrm = makeMockOrm();

function makeService() {
	return new ArtworkTransformService();
}

describe('ArtworkTransformService.artworkBase', () => {
	test('returns core artwork fields', async () => {
		const service = makeService();
		const artwork = makeArtwork({
			types: [ArtworkImageType.front, ArtworkImageType.back],
			width: 600,
			height: 400,
			format: 'png',
			fileSize: 204_800
		}) as never;
		const parameters: IncludesArtworkParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.artworkBase(mockOrm, artwork, parameters, user);

		expect(result.id).toBe('artwork-1');
		expect(result.name).toBe('cover.jpg');
		expect(result.types).toEqual([ArtworkImageType.front, ArtworkImageType.back]);
		expect(result.width).toBe(600);
		expect(result.height).toBe(400);
		expect(result.format).toBe('png');
		expect(result.size).toBe(204_800);
	});

	test('sets created from createdAt timestamp', async () => {
		const service = makeService();
		const createdAt = new Date(1_700_000_000_000);
		const artwork = makeArtwork({ createdAt }) as never;
		const parameters: IncludesArtworkParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.artworkBase(mockOrm, artwork, parameters, user);

		expect(result.created).toBe(createdAt.valueOf());
	});

	test('state is undefined when artworkIncState is false', async () => {
		const service = makeService();
		const artwork = makeArtwork() as never;
		const parameters: IncludesArtworkParameters = { artworkIncState: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artworkBase(mockOrm, artwork, parameters, user);

		expect(result.state).toBeUndefined();
	});

	test('state is included when artworkIncState is true', async () => {
		const service = makeService();
		const artwork = makeArtwork() as never;
		const parameters: IncludesArtworkParameters = { artworkIncState: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artworkBase(mockOrm, artwork, parameters, user);

		expect(result.state).toBeDefined();
		expect((mockOrm as never as { State: { findOrCreate: ReturnType<typeof jest.fn> } }).State.findOrCreate)
			.toHaveBeenCalledWith('artwork-1', DBObjectType.artwork, 'user-1');
	});
});

describe('ArtworkTransformService.artworkBases', () => {
	test('maps an empty list to empty array', async () => {
		const service = makeService();
		const parameters: IncludesArtworkParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.artworkBases(mockOrm, [], parameters, user);

		expect(result).toEqual([]);
	});

	test('transforms each artwork in the list', async () => {
		const service = makeService();
		const artwork1 = makeArtwork({ id: 'art-1', name: 'front.jpg' }) as never;
		const artwork2 = makeArtwork({ id: 'art-2', name: 'back.jpg' }) as never;
		const parameters: IncludesArtworkParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.artworkBases(mockOrm, [artwork1, artwork2], parameters, user);

		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('art-1');
		expect(result[1].id).toBe('art-2');
	});
});
