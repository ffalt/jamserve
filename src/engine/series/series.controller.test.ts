import {JamApi} from '../../api/jam/api';
import {Errors} from '../../api/jam/error';
import {Jam} from '../../model/jam-rest-data';
import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {User} from '../user/user.model';
import {SeriesController} from './series.controller';
import {Series} from './series.model';

describe('SeriesController', () => {
	let controller: SeriesController;
	let user: User;
	let api: JamApi;
	testBaseListController({
		typeName: 'Jam.Series'
	}, async (jamApi, jamUser) => {
		controller = jamApi.seriesController;
		user = jamUser;
		api = jamApi;
		return controller;
	}, () => {
		describe('.tracks', () => {
			it('should handle invalid parameters', async () => {
				await expect(controller.tracks({query: {ids: ['invalid']}, user})).resolves.toEqual({total: 0, items: []});
				await expect(controller.tracks({query: {} as any, user})).rejects.toThrow(Errors.invalidParameter);
			});
			it('should return tracks', async () => {
				const series = await controller.seriesService.seriesStore.random();
				if (!series || series.trackIDs.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				const list = await controller.tracks({query: {ids: [series.id]}, user});
				expect(list).toBeDefined();
				expect(list.items.length).toBe(series.trackIDs.length);
			});
		});
		describe('.index', () => {
			it('should return an index with all series', async () => {
				const index = await controller.index({query: {}, user});
				expect(index).toBeDefined();
				let count = 0;
				for (const group of index.groups) {
					count += group.entries.length;
				}
				expect(count).toBe(await controller.seriesService.seriesStore.count());
			});
			it('should return an empty index', async () => {
				const index = await controller.index({query: {id: 'invalid'}, user});
				expect(index).toBeDefined();
				expect(index.groups.length).toBe(0);
			});
		});
		describe('.info', () => {
			it('should return series info', async () => {
				const series = await controller.seriesService.seriesStore.random();
				if (!series) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.extInfo.bySeries;
				const extended: Jam.ExtendedInfo = {
					description: 'dummy',
					source: 'dummy',
					license: 'dummy',
					url: 'dummy',
					licenseUrl: 'dummy'
				};
				api.metadataController.metadataService.extInfo.bySeries = async (a: Series): Promise<Jam.ExtendedInfo | undefined> => {
					return extended;
				};
				const result = await controller.info({query: {id: series.id}, user});
				api.metadataController.metadataService.extInfo.bySeries = org;
				expect(result).toBeDefined();
				expect(result.info).toEqual(extended);
			});
		});
		describe('.id', () => {
			it('should return sub items', async () => {
				const seriess = await controller.seriesService.seriesStore.all();
				if (seriess.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				for (const series of seriess) {
					const result = await controller.id({query: {id: series.id, seriesState: true, seriesAlbumIDs: true, seriesAlbums: true, seriesTrackIDs: true, seriesTracks: true}, user});
					expect(result).toBeDefined();
					expect(result.trackIDs).toEqual(series.trackIDs);
					expect(result.albumIDs).toEqual(series.albumIDs);
					expect((result.tracks as any).length).toBe(series.trackIDs.length);
					expect((result.albums as any).length).toBe(series.albumIDs.length);
				}
			});
			it('should return series info in sub-object', async () => {
				const series = await controller.seriesService.seriesStore.random();
				if (!series) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.extInfo.bySeries;
				const extended: Jam.ExtendedInfo = {
					description: 'dummy',
					source: 'dummy',
					license: 'dummy',
					url: 'dummy',
					licenseUrl: 'dummy'
				};
				api.metadataController.metadataService.extInfo.bySeries = async (a: Series): Promise<Jam.ExtendedInfo | undefined> => {
					return extended;
				};
				const result = await controller.id({query: {id: series.id, seriesInfo: true}, user});
				api.metadataController.metadataService.extInfo.bySeries = org;
				expect(result).toBeDefined();
				expect(result.info).toEqual(extended);
			});
			it('should handle metadata not available for series series info in sub-object', async () => {
				const series = await controller.seriesService.seriesStore.random();
				if (!series) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.extInfo.bySeries;
				api.metadataController.metadataService.extInfo.bySeries = async (a: Series): Promise<Jam.ExtendedInfo | undefined> => {
					return undefined;
				};
				const result = await controller.id({query: {id: series.id, seriesInfo: true}, user});
				api.metadataController.metadataService.extInfo.bySeries = org;
				expect(result).toBeDefined();
				expect(result.info).toBeUndefined();
			});
		});
		describe('.albums', () => {
			it('should handle invalid parameters', async () => {
				await expect(controller.albums({query: {ids: ['invalid']}, user})).resolves.toEqual({total: 0, items: []});
				await expect(controller.albums({query: {} as any, user})).rejects.toThrow(Errors.invalidParameter);
			});
			it('should return albums', async () => {
				const series = await controller.seriesService.seriesStore.random();
				if (!series || series.albumIDs.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				const list = await controller.albums({query: {ids: [series.id]}, user});
				expect(list).toBeDefined();
				expect(list.items.length).toBe(series.albumIDs.length);
			});
		});
	});
});
