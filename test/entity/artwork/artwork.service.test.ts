import { jest } from '@jest/globals';
import path from 'node:path';
import { ArtworkService } from '../../../src/entity/artwork/artwork.service.js';
import { ArtworkImageType } from '../../../src/types/enums.js';
import { makeArtwork } from '../shared/make-artwork.js';

const mockOrm = {} as never;
const mockQueueInfo = { id: 'queue-1' };

function makeService() {
	const service = new ArtworkService();
	const artworkIo = {
		download: jest.fn().mockResolvedValue(mockQueueInfo as never),
		create: jest.fn().mockResolvedValue(mockQueueInfo as never),
		replace: jest.fn().mockResolvedValue(mockQueueInfo as never),
		rename: jest.fn().mockResolvedValue(mockQueueInfo as never),
		delete: jest.fn().mockResolvedValue(mockQueueInfo as never)
	};
	const ioService = { artwork: artworkIo };
	const imageModule = { get: jest.fn().mockResolvedValue({ buffer: Buffer.from('') } as never) };
	(service as never as { ioService: unknown }).ioService = ioService;
	(service as never as { imageModule: unknown }).imageModule = imageModule;
	return { service, artworkIo, imageModule };
}

function makeFolder(id = 'folder-1', rootId = 'root-1') {
	return {
		id,
		root: { idOrFail: () => rootId }
	};
}

describe('ArtworkService.getImage', () => {
	test('calls imageModule.get with artwork path and name', async () => {
		const { service, imageModule } = makeService();
		const artwork = makeArtwork({ id: 'art-1', path: '/music/album', name: 'cover.jpg' }) as never;

		await service.getImage(mockOrm, artwork, undefined, undefined);

		expect(imageModule.get).toHaveBeenCalledWith('art-1', path.join('/music/album', 'cover.jpg'), undefined, undefined);
	});

	test('passes size and format to imageModule.get', async () => {
		const { service, imageModule } = makeService();
		const artwork = makeArtwork() as never;

		await service.getImage(mockOrm, artwork, 300, 'webp');

		expect(imageModule.get).toHaveBeenCalledWith(
			'artwork-1',
			path.join('/music/artist/album', 'cover.jpg'),
			300,
			'webp'
		);
	});

	test('returns result from imageModule.get', async () => {
		const imageResult = { buffer: Buffer.from('image-data') };
		const { service, imageModule } = makeService();
		imageModule.get.mockResolvedValue(imageResult as never);
		const artwork = makeArtwork() as never;

		const result = await service.getImage(mockOrm, artwork, undefined, undefined);

		expect(result).toBe(imageResult);
	});
});

describe('ArtworkService.createByUrl', () => {
	test('delegates to ioService.artwork.download', async () => {
		const { service, artworkIo } = makeService();
		const folder = makeFolder('folder-1', 'root-1');
		const types = [ArtworkImageType.front];

		const result = await service.createByUrl(folder as never, 'https://example.com/cover.jpg', types);

		expect(artworkIo.download).toHaveBeenCalledWith('folder-1', 'https://example.com/cover.jpg', types, 'root-1');
		expect(result).toBe(mockQueueInfo);
	});

	test('uses folder.root.idOrFail() for root id', async () => {
		const { service, artworkIo } = makeService();
		const folder = makeFolder('folder-2', 'root-99');

		await service.createByUrl(folder as never, 'https://example.com/art.jpg', []);

		expect(artworkIo.download).toHaveBeenCalledWith('folder-2', 'https://example.com/art.jpg', [], 'root-99');
	});
});

describe('ArtworkService.createByFile', () => {
	test('delegates to ioService.artwork.create', async () => {
		const { service, artworkIo } = makeService();
		const folder = makeFolder('folder-1', 'root-1');
		const types = [ArtworkImageType.back];

		const result = await service.createByFile(folder as never, '/tmp/upload.jpg', types);

		expect(artworkIo.create).toHaveBeenCalledWith('folder-1', '/tmp/upload.jpg', types, 'root-1');
		expect(result).toBe(mockQueueInfo);
	});
});

describe('ArtworkService.upload', () => {
	test('fetches folder and delegates to ioService.artwork.replace', async () => {
		const { service, artworkIo } = makeService();
		const folder = makeFolder('folder-1', 'root-1');
		const artwork = makeArtwork({ folder });

		const result = await service.upload(artwork as never, '/tmp/new.jpg');

		expect(artwork.folder.getOrFail).toHaveBeenCalled();
		expect(artworkIo.replace).toHaveBeenCalledWith('artwork-1', '/tmp/new.jpg', 'root-1');
		expect(result).toBe(mockQueueInfo);
	});
});

describe('ArtworkService.rename', () => {
	test('fetches folder and delegates to ioService.artwork.rename', async () => {
		const { service, artworkIo } = makeService();
		const folder = makeFolder('folder-1', 'root-1');
		const artwork = makeArtwork({ folder });

		const result = await service.rename(artwork as never, 'back.jpg');

		expect(artwork.folder.getOrFail).toHaveBeenCalled();
		expect(artworkIo.rename).toHaveBeenCalledWith('artwork-1', 'back.jpg', 'root-1');
		expect(result).toBe(mockQueueInfo);
	});
});

describe('ArtworkService.remove', () => {
	test('fetches folder and delegates to ioService.artwork.delete', async () => {
		const { service, artworkIo } = makeService();
		const folder = makeFolder('folder-1', 'root-1');
		const artwork = makeArtwork({ folder });

		const result = await service.remove(artwork as never);

		expect(artwork.folder.getOrFail).toHaveBeenCalled();
		expect(artworkIo.delete).toHaveBeenCalledWith('artwork-1', 'root-1');
		expect(result).toBe(mockQueueInfo);
	});
});
