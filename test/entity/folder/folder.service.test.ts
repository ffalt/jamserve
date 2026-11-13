import { jest } from '@jest/globals';
import { FolderService, getFolderDisplayArtwork } from '../../../src/entity/folder/folder.service.js';
import { ArtworkImageType, FolderType } from '../../../src/types/enums.js';
import { Artwork } from '../../../src/entity/artwork/artwork.js';
import { Folder } from '../../../src/entity/folder/folder.js';

const mockOrm = {} as never;

function createMockArtwork(name: string, types: Array<ArtworkImageType>, id = 'art-1', path = '/media/artist/album/'): Artwork {
	return {
		id,
		name,
		path,
		types
	} as unknown as Artwork;
}

function createMockFolder(options: {
	folderType?: FolderType;
	artworks?: Array<Artwork>;
	parent?: Folder;
	path?: string;
}): Folder {
	const artworksList = options.artworks ?? [];
	return {
		folderType: options.folderType ?? FolderType.album,
		path: options.path ?? '/media/artist/album/',
		artworks: {
			getItems: jest.fn<() => Promise<Array<Artwork>>>().mockResolvedValue(artworksList),
			count: jest.fn<() => Promise<number>>().mockResolvedValue(artworksList.length)
		},
		parent: {
			get: jest.fn<() => Promise<Folder | undefined>>().mockResolvedValue(options.parent),
			id: jest.fn<() => string | undefined>().mockReturnValue(options.parent ? 'parent-id' : undefined)
		}
	} as unknown as Folder;
}

describe('getFolderDisplayArtwork', () => {
	test('returns front artwork for standard album folder', async () => {
		const artwork = createMockArtwork('cover.jpg', [ArtworkImageType.front]);
		const folder = createMockFolder({
			folderType: FolderType.album,
			artworks: [artwork]
		});

		const result = await getFolderDisplayArtwork(mockOrm, folder);
		expect(result).toBe(artwork);
	});

	test('returns artist artwork for artist folder', async () => {
		const artwork = createMockArtwork('artist.jpg', [ArtworkImageType.artist]);
		const folder = createMockFolder({
			folderType: FolderType.artist,
			artworks: [artwork]
		});

		const result = await getFolderDisplayArtwork(mockOrm, folder);
		expect(result).toBe(artwork);
	});

	test('returns undefined when no matching artwork type exists in folder', async () => {
		const artwork = createMockArtwork('back.jpg', [ArtworkImageType.back]);
		const folder = createMockFolder({
			folderType: FolderType.album,
			artworks: [artwork]
		});

		const result = await getFolderDisplayArtwork(mockOrm, folder);
		expect(result).toBeUndefined();
	});

	test('finds front artwork in root of multifolders when child multialbum folder has no artwork', async () => {
		const rootArtwork = createMockArtwork('cover.jpg', [ArtworkImageType.front], 'art-root', '/media/artist/multialbum/');
		const rootFolder = createMockFolder({
			folderType: FolderType.multialbum,
			path: '/media/artist/multialbum/',
			artworks: [rootArtwork]
		});
		const cd1Folder = createMockFolder({
			folderType: FolderType.multialbum,
			path: '/media/artist/multialbum/CD1/',
			artworks: [],
			parent: rootFolder
		});

		const result = await getFolderDisplayArtwork(mockOrm, cd1Folder);
		expect(result).toBe(rootArtwork);
	});

	test('prefers child multialbum folder artwork over parent multialbum artwork if present', async () => {
		const rootArtwork = createMockArtwork('cover.jpg', [ArtworkImageType.front], 'art-root', '/media/artist/multialbum/');
		const cdArtwork = createMockArtwork('cd1-cover.jpg', [ArtworkImageType.front], 'art-cd1', '/media/artist/multialbum/CD1/');
		const rootFolder = createMockFolder({
			folderType: FolderType.multialbum,
			path: '/media/artist/multialbum/',
			artworks: [rootArtwork]
		});
		const cd1Folder = createMockFolder({
			folderType: FolderType.multialbum,
			path: '/media/artist/multialbum/CD1/',
			artworks: [cdArtwork],
			parent: rootFolder
		});

		const result = await getFolderDisplayArtwork(mockOrm, cd1Folder);
		expect(result).toBe(cdArtwork);
	});

	test('traverses multiple levels of multialbum folders to find artwork', async () => {
		const rootArtwork = createMockArtwork('cover.jpg', [ArtworkImageType.front], 'art-root', '/media/artist/boxset/');
		const rootFolder = createMockFolder({
			folderType: FolderType.multialbum,
			path: '/media/artist/boxset/',
			artworks: [rootArtwork]
		});
		const subMultialbum = createMockFolder({
			folderType: FolderType.multialbum,
			path: '/media/artist/boxset/part1/',
			artworks: [],
			parent: rootFolder
		});
		const cdFolder = createMockFolder({
			folderType: FolderType.multialbum,
			path: '/media/artist/boxset/part1/cd1/',
			artworks: [],
			parent: subMultialbum
		});

		const result = await getFolderDisplayArtwork(mockOrm, cdFolder);
		expect(result).toBe(rootArtwork);
	});

	test('stops traversal if parent is not a multialbum folder', async () => {
		const artistArtwork = createMockArtwork('artist.jpg', [ArtworkImageType.artist], 'art-artist', '/media/artist/');
		const artistFolder = createMockFolder({
			folderType: FolderType.artist,
			path: '/media/artist/',
			artworks: [artistArtwork]
		});
		const multialbumFolder = createMockFolder({
			folderType: FolderType.multialbum,
			path: '/media/artist/multialbum/',
			artworks: [],
			parent: artistFolder
		});

		const result = await getFolderDisplayArtwork(mockOrm, multialbumFolder);
		expect(result).toBeUndefined();
	});
});

describe('FolderService.getImage', () => {
	function makeFolderService() {
		const service = new FolderService();
		const imageModule = {
			get: jest.fn<() => Promise<{ file: { filename: string } }>>().mockResolvedValue({ file: { filename: 'image.jpg' } })
		};
		(service as never as { imageModule: unknown }).imageModule = imageModule;
		return { service, imageModule };
	}

	test('returns image result when artwork is found', async () => {
		const { service, imageModule } = makeFolderService();
		const artwork = createMockArtwork('cover.jpg', [ArtworkImageType.front], 'art-1', '/media/album/');
		const folder = createMockFolder({
			folderType: FolderType.album,
			artworks: [artwork]
		});

		const result = await service.getImage(mockOrm, folder, 300, 'jpeg');
		expect(imageModule.get).toHaveBeenCalledWith('art-1', '/media/album/cover.jpg', 300, 'jpeg');
		expect(result).toEqual({ file: { filename: 'image.jpg' } });
	});

	test('returns undefined when no artwork is found', async () => {
		const { service, imageModule } = makeFolderService();
		const folder = createMockFolder({
			folderType: FolderType.album,
			artworks: []
		});

		const result = await service.getImage(mockOrm, folder);
		expect(imageModule.get).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});
});
