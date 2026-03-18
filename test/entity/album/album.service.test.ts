import { jest } from '@jest/globals';
import { AlbumService } from '../../../src/entity/album/album.service.js';
import { makeTrack } from '../shared/make-track.js';
import { makeFolder } from '../shared/make-folder.js';
import { makeAlbum } from '../shared/make-album.js';

const mockOrm = {} as never;

function makeService() {
	const service = new AlbumService();
	const trackService = { getImage: jest.fn<() => Promise<undefined>>().mockResolvedValue(undefined) };
	const folderService = { getImage: jest.fn<() => Promise<undefined>>().mockResolvedValue(undefined) };
	(service as never as { trackService: unknown }).trackService = trackService;
	(service as never as { folderService: unknown }).folderService = folderService;
	return { service, trackService, folderService };
}

describe('AlbumService.getImage', () => {
	test('returns undefined when album has no folders and no tracks', async () => {
		const { service } = makeService();
		const album = makeAlbum() as never;
		const result = await service.getImage(mockOrm, album);
		expect(result).toBeUndefined();
	});

	test('tries track image first when album belongs to a series', async () => {
		const trackImage = { file: { filename: 'track.jpg' } };
		const { service, trackService } = makeService();
		trackService.getImage.mockResolvedValue(trackImage as never);
		const track = makeTrack();
		const album = makeAlbum({ series: { id: 'series-id', name: 'series' }, tracks: [track] }) as never;

		const result = await service.getImage(mockOrm, album);

		expect(trackService.getImage).toHaveBeenCalledWith(mockOrm, track, undefined, undefined);
		expect(result).toBe(trackImage);
	});

	test('falls back to folder image when series track image not found', async () => {
		const folderImage = { file: { filename: 'folder.jpg' } };
		const { service, trackService, folderService } = makeService();
		trackService.getImage.mockResolvedValue(undefined as never);
		folderService.getImage.mockResolvedValue(folderImage as never);
		const folder = makeFolder();
		const album = makeAlbum({ series: { id: 'series-id', name: 'series' }, folders: [folder] }) as never;

		const result = await service.getImage(mockOrm, album);

		expect(result).toBe(folderImage);
	});

	test('falls back to track image when series has no folder image and no track image', async () => {
		const { service, trackService, folderService } = makeService();
		folderService.getImage.mockResolvedValue(undefined as never);
		trackService.getImage.mockResolvedValue(undefined as never);
		const folder = makeFolder();
		const track = makeTrack();
		const album = makeAlbum({ series: { id: 'series-id', name: 'series' }, folders: [folder], tracks: [track] }) as never;

		const result = await service.getImage(mockOrm, album);

		expect(result).toBeUndefined();
	});

	test('uses deepest folder (highest level) for folder image', async () => {
		const folderImage = { file: { filename: 'folder.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(folderImage as never);
		const shallow = makeFolder(1);
		const deep = makeFolder(3);
		const mid = makeFolder(2);
		const album = makeAlbum({ folders: [shallow, deep, mid] }) as never;

		await service.getImage(mockOrm, album);

		expect(folderService.getImage).toHaveBeenCalledWith(mockOrm, deep, undefined, undefined);
	});

	test('uses the single folder when only one folder exists', async () => {
		const folderImage = { file: { filename: 'folder.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(folderImage as never);
		const folder = makeFolder(2);
		const album = makeAlbum({ folders: [folder] }) as never;

		await service.getImage(mockOrm, album);

		expect(folderService.getImage).toHaveBeenCalledWith(mockOrm, folder, undefined, undefined);
	});

	test('falls back to track image when no folder image found (non-series)', async () => {
		const trackImage = { file: { filename: 'track.jpg' } };
		const { service, trackService, folderService } = makeService();
		folderService.getImage.mockResolvedValue(undefined as never);
		trackService.getImage.mockResolvedValue(trackImage as never);
		const folder = makeFolder();
		const track = makeTrack();
		const album = makeAlbum({ folders: [folder], tracks: [track] }) as never;

		const result = await service.getImage(mockOrm, album);

		expect(result).toBe(trackImage);
	});

	test('returns track image when no folders exist (non-series)', async () => {
		const trackImage = { file: { filename: 'track.jpg' } };
		const { service, trackService } = makeService();
		trackService.getImage.mockResolvedValue(trackImage as never);
		const track = makeTrack();
		const album = makeAlbum({ tracks: [track] }) as never;

		const result = await service.getImage(mockOrm, album);

		expect(result).toBe(trackImage);
	});

	test('passes size and format parameters to folder image service', async () => {
		const folderImage = { file: { filename: 'folder.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(folderImage as never);
		const folder = makeFolder();
		const album = makeAlbum({ folders: [folder] }) as never;

		await service.getImage(mockOrm, album, 200, 'jpeg');

		expect(folderService.getImage).toHaveBeenCalledWith(mockOrm, folder, 200, 'jpeg');
	});

	test('passes size and format parameters to track image service (series)', async () => {
		const trackImage = { file: { filename: 'track.jpg' } };
		const { service, trackService } = makeService();
		trackService.getImage.mockResolvedValue(trackImage as never);
		const track = makeTrack();
		const album = makeAlbum({ series: { id: 'series-id', name: 'series' }, tracks: [track] }) as never;

		await service.getImage(mockOrm, album, 300, 'png');

		expect(trackService.getImage).toHaveBeenCalledWith(mockOrm, track, 300, 'png');
	});

	test('returns undefined when album has tracks but track image returns undefined', async () => {
		const { service, trackService } = makeService();
		trackService.getImage.mockResolvedValue(undefined as never);
		const track = makeTrack();
		const album = makeAlbum({ tracks: [track] }) as never;

		const result = await service.getImage(mockOrm, album);

		expect(result).toBeUndefined();
	});

	test('uses first track when multiple tracks exist', async () => {
		const trackImage = { file: { filename: 'track.jpg' } };
		const { service, trackService } = makeService();
		trackService.getImage.mockResolvedValue(trackImage as never);
		const track1 = makeTrack('t1');
		const track2 = makeTrack('t2');
		const album = makeAlbum({ series: { id: 'series-id', name: 'series' }, tracks: [track1, track2] }) as never;

		await service.getImage(mockOrm, album);

		expect(trackService.getImage).toHaveBeenCalledWith(mockOrm, track1, undefined, undefined);
	});
});
