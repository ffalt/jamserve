import { jest } from '@jest/globals';
import { SeriesService } from '../../../src/entity/series/series.service.js';
import { FolderType } from '../../../src/types/enums.js';
import { makeSeries } from '../shared/make-series.js';

const mockOrm = {} as never;

function makeService() {
	const service = new SeriesService();
	const folderService = { getImage: jest.fn<() => Promise<undefined>>().mockResolvedValue(undefined) };
	(service as never as { folderService: unknown }).folderService = folderService;
	return { service, folderService };
}

function makeSeriesFolder(folderType: FolderType, parent?: unknown) {
	return {
		folderType,
		parent: { get: jest.fn().mockResolvedValue(parent as never) }
	};
}

describe('SeriesService.getImage', () => {
	test('returns undefined when series has no folders', async () => {
		const { service } = makeService();
		const series = makeSeries() as never;

		const result = await service.getImage(mockOrm, series);

		expect(result).toBeUndefined();
	});

	test('uses artist folder when first folder is artist type', async () => {
		const folderImage = { file: { filename: 'artist.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(folderImage as never);
		const artistFolder = makeSeriesFolder(FolderType.artist);
		const series = makeSeries({ folders: [artistFolder] }) as never;

		const result = await service.getImage(mockOrm, series);

		expect(folderService.getImage).toHaveBeenCalledWith(mockOrm, artistFolder, undefined, undefined);
		expect(result).toBe(folderImage);
	});

	test('traverses parent chain to find artist folder', async () => {
		const folderImage = { file: { filename: 'artist.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(folderImage as never);
		const artistFolder = makeSeriesFolder(FolderType.artist);
		const albumFolder = makeSeriesFolder(FolderType.album, artistFolder);
		const series = makeSeries({ folders: [albumFolder] }) as never;

		const result = await service.getImage(mockOrm, series);

		expect(folderService.getImage).toHaveBeenCalledWith(mockOrm, artistFolder, undefined, undefined);
		expect(result).toBe(folderImage);
	});

	test('falls back to iterating all folders when no artist folder found', async () => {
		const folderImage = { file: { filename: 'folder.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage
			.mockResolvedValueOnce(undefined as never)
			.mockResolvedValueOnce(folderImage as never);
		const folder1 = makeSeriesFolder(FolderType.album);
		const folder2 = makeSeriesFolder(FolderType.album);
		const series = makeSeries({ folders: [folder1, folder2] }) as never;

		const result = await service.getImage(mockOrm, series);

		expect(result).toBe(folderImage);
	});

	test('returns undefined when fallback finds no image in any folder', async () => {
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(undefined as never);
		const folder = makeSeriesFolder(FolderType.album);
		const series = makeSeries({ folders: [folder] }) as never;

		const result = await service.getImage(mockOrm, series);

		expect(result).toBeUndefined();
	});

	test('returns first successful result in fallback iteration', async () => {
		const folderImage = { file: { filename: 'second.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage
			.mockResolvedValueOnce(undefined as never)
			.mockResolvedValueOnce(folderImage as never);
		const folder1 = makeSeriesFolder(FolderType.album);
		const folder2 = makeSeriesFolder(FolderType.album);
		const series = makeSeries({ folders: [folder1, folder2] }) as never;

		const result = await service.getImage(mockOrm, series);

		expect(folderService.getImage).toHaveBeenCalledTimes(2);
		expect(result).toBe(folderImage);
	});

	test('passes size and format to folderService', async () => {
		const folderImage = { file: { filename: 'artist.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(folderImage as never);
		const artistFolder = makeSeriesFolder(FolderType.artist);
		const series = makeSeries({ folders: [artistFolder] }) as never;

		await service.getImage(mockOrm, series, 300, 'webp');

		expect(folderService.getImage).toHaveBeenCalledWith(mockOrm, artistFolder, 300, 'webp');
	});

	test('passes size and format to folderService in fallback', async () => {
		const folderImage = { file: { filename: 'folder.jpg' } };
		const { service, folderService } = makeService();
		folderService.getImage.mockResolvedValue(folderImage as never);
		const folder = makeSeriesFolder(FolderType.album);
		const series = makeSeries({ folders: [folder] }) as never;

		await service.getImage(mockOrm, series, 200, 'png');

		expect(folderService.getImage).toHaveBeenCalledWith(mockOrm, folder, 200, 'png');
	});

	test('does not call folderService when no folders exist', async () => {
		const { service, folderService } = makeService();
		const series = makeSeries() as never;

		await service.getImage(mockOrm, series);

		expect(folderService.getImage).not.toHaveBeenCalled();
	});
});
