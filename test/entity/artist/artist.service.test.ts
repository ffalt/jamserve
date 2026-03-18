import { jest } from '@jest/globals';
import { ArtistService } from '../../../src/entity/artist/artist.service.js';
import { MUSICBRAINZ_VARIOUS_ARTISTS_ID } from '../../../src/types/consts.js';
import { AlbumType, FolderType } from '../../../src/types/enums.js';
import { makeArtist } from '../shared/make-artist.js';
import { makeFolderOrm } from '../shared/make-orm.js';

function makeService() {
	const service = new ArtistService();
	const folderService = { getImage: jest.fn<() => Promise<undefined>>().mockResolvedValue(undefined) };
	(service as never as { folderService: unknown }).folderService = folderService;
	return { service, folderService };
}

describe('ArtistService.canHaveArtistImage', () => {
	test('returns true when albumTypes is non-empty and mbArtistID is not Various Artists', () => {
		const { service } = makeService();
		const artist = makeArtist({ albumTypes: [AlbumType.album], mbArtistID: 'some-id' });
		expect(service.canHaveArtistImage(artist as never)).toBe(true);
	});

	test('returns false when albumTypes is empty', () => {
		const { service } = makeService();
		const artist = makeArtist({ albumTypes: [] });
		expect(service.canHaveArtistImage(artist as never)).toBe(false);
	});

	test('returns false when mbArtistID matches MUSICBRAINZ_VARIOUS_ARTISTS_ID', () => {
		const { service } = makeService();
		const artist = makeArtist({ albumTypes: [AlbumType.album], mbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID });
		expect(service.canHaveArtistImage(artist as never)).toBe(false);
	});

	test('returns true when mbArtistID is undefined', () => {
		const { service } = makeService();
		const artist = makeArtist({ albumTypes: [AlbumType.album], mbArtistID: undefined });
		expect(service.canHaveArtistImage(artist as never)).toBe(true);
	});

	test('returns true with multiple albumTypes', () => {
		const { service } = makeService();
		const artist = makeArtist({ albumTypes: [AlbumType.album, AlbumType.live] });
		expect(service.canHaveArtistImage(artist as never)).toBe(true);
	});
});

describe('ArtistService.getArtistFolder', () => {
	test('calls orm.Folder.findOneFilter with artist id and artist folder type', async () => {
		const { service } = makeService();
		const artist = makeArtist();
		const folder = { id: 'folder-1' };
		const orm = makeFolderOrm(folder);

		const result = await service.getArtistFolder(orm as never, artist as never);

		expect(orm.Folder.findOneFilter).toHaveBeenCalledWith({
			artistIDs: ['artist-1'],
			folderTypes: [FolderType.artist]
		});
		expect(result).toEqual(folder);
	});

	test('returns undefined when no folder found', async () => {
		const { service } = makeService();
		const artist = makeArtist();
		const orm = makeFolderOrm(undefined);

		const result = await service.getArtistFolder(orm as never, artist as never);

		expect(result).toBeUndefined();
	});
});

describe('ArtistService.getImage', () => {
	test('returns undefined when artist has empty albumTypes', async () => {
		const { service } = makeService();
		const artist = makeArtist({ albumTypes: [] });
		const orm = makeFolderOrm();

		const result = await service.getImage(orm as never, artist as never);

		expect(result).toBeUndefined();
	});

	test('returns undefined when artist is Various Artists', async () => {
		const { service } = makeService();
		const artist = makeArtist({ albumTypes: [AlbumType.album], mbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID });
		const orm = makeFolderOrm();

		const result = await service.getImage(orm as never, artist as never);

		expect(result).toBeUndefined();
	});

	test('returns undefined when no artist folder found', async () => {
		const { service } = makeService();
		const artist = makeArtist();
		const orm = makeFolderOrm(undefined);

		const result = await service.getImage(orm as never, artist as never);

		expect(result).toBeUndefined();
	});

	test('returns folder image when artist folder is found', async () => {
		const folderImage = { file: { filename: 'artist.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(folderImage as never);
		const folder = { id: 'folder-1' };
		const orm = makeFolderOrm(folder);
		const artist = makeArtist();

		const result = await service.getImage(orm as never, artist as never);

		expect(folderService.getImage).toHaveBeenCalledWith(orm, folder, undefined, undefined);
		expect(result).toBe(folderImage);
	});

	test('does not call folderService when canHaveArtistImage returns false', async () => {
		const { service, folderService } = makeService();
		const artist = makeArtist({ albumTypes: [] });
		const orm = makeFolderOrm();

		await service.getImage(orm as never, artist as never);

		expect(folderService.getImage).not.toHaveBeenCalled();
	});

	test('passes size and format to folderService.getImage', async () => {
		const folderImage = { file: { filename: 'artist.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(folderImage as never);
		const folder = { id: 'folder-1' };
		const orm = makeFolderOrm(folder);
		const artist = makeArtist();

		await service.getImage(orm as never, artist as never, 300, 'webp');

		expect(folderService.getImage).toHaveBeenCalledWith(orm, folder, 300, 'webp');
	});

	test('returns undefined when folderService returns undefined', async () => {
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(undefined as never);
		const folder = { id: 'folder-1' };
		const orm = makeFolderOrm(folder);
		const artist = makeArtist();

		const result = await service.getImage(orm as never, artist as never);

		expect(result).toBeUndefined();
	});
});
