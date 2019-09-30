import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {User} from '../user/user.model';
import {FolderController} from './folder.controller';

describe('FolderController', () => {
	let controller: FolderController;
	let user: User;
	testBaseListController({
		typeName: 'Jam.Folder',
		skipBaseTests: false
	}, async (jamApi, jamUser) => {
		controller = jamApi.folderController;
		user = jamUser;
		return controller;
	}, () => {
		describe('.subfolders', () => {
			it('should not return subfolders for invalid parameter', async () => {
				const result = await controller.subfolders({query: {id: 'invalid'}, user});
				expect(result).toBeTruthy();
				expect(result.items.length).toBe(0);
			});
			it('should return subfolders', async () => {
				const folders = await controller.folderService.folderStore.all();
				if (folders.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				for (const folder of folders) {
					const result = await controller.subfolders({query: {id: folder.id}, user});
					expect(result).toBeTruthy();
					expect(result.items.length).toBe(folder.tag.folderCount);
				}
			});
		});
		describe('.tracks', () => {
			it('should not return tracks for invalid parameter', async () => {
				const result = await controller.tracks({query: {ids: ['invalid']}, user});
				expect(result).toBeTruthy();
				expect(result.items.length).toBe(0);
			});
			it('should return tracks', async () => {
				const folders = await controller.folderService.folderStore.all();
				if (folders.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				for (const folder of folders) {
					const result = await controller.tracks({query: {ids: [folder.id]}, user});
					expect(result).toBeTruthy();
					expect(result.items.length).toBe(folder.tag.trackCount);
				}
			});
		});
		describe('.children', () => {
			it('should not return children for invalid parameter', async () => {
				const result = await controller.children({query: {id: 'invalid'}, user});
				expect(result).toBeTruthy();
				expect(result.folders.length).toBe(0);
				expect(result.tracks.length).toBe(0);
			});
			it('should return children', async () => {
				const folders = await controller.folderService.folderStore.all();
				if (folders.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				for (const folder of folders) {
					const result = await controller.children({query: {id: folder.id}, user});
					expect(result).toBeTruthy();
					expect(result.tracks.length).toBe(folder.tag.trackCount);
					expect(result.folders.length).toBe(folder.tag.folderCount);
				}
			});
		});
		describe('.index', () => {
			it('should return an index with all folders', async () => {
				const index = await controller.index({query: {}, user});
				expect(index).toBeTruthy();
				let count = 0;
				for (const group of index.groups) {
					count += group.entries.length;
				}
				expect(count).toBe(await controller.folderService.folderStore.count());
			});
			it('should return an empty index', async () => {
				const index = await controller.index({query: {id: 'invalid'}, user});
				expect(index).toBeTruthy();
				expect(index.groups.length).toBe(0);
			});
		});

		/*
		describe('.health', () => {
			it('should work', async () => {
				// TODO folderController tests health
			});
		});
		describe('.artworks', () => {
			it('should work', async () => {
				// TODO folderController tests artworks
			});
		});
		describe('.nameUpdate', () => {
			it('should work', async () => {
				// TODO folderController tests nameUpdate
			});
		});
		describe('.parentUpdate', () => {
			it('should work', async () => {
				// TODO folderController tests parentUpdate
			});
		});
		describe('.delete', () => {
			it('should work', async () => {
				// TODO folderController tests delete
			});
		});
		describe('.create', () => {
			it('should work', async () => {
				// TODO folderController tests create
			});
		});
		describe('.artistInfo', () => {
			it('should work', async () => {
				// TODO folderController tests artistInfo
			});
		});
		describe('.artistSimilar', () => {
			it('should work', async () => {
				// TODO folderController tests artistSimilar
			});
		});
		describe('.albumInfo', () => {
			it('should work', async () => {
				// TODO folderController tests albumInfo
			});
		});
		describe('.artistSimilarTracks', () => {
			it('should work', async () => {
				// TODO folderController tests artistSimilarTracks
			});
		});
		describe('.artworkImage', () => {
			it('should work', async () => {
				// TODO folderController tests artworkImage
			});
		});
		describe('.artworkCreate', () => {
			it('should work', async () => {
				// TODO folderController tests artworkCreate
			});
		});
		describe('.artworkUploadCreate', () => {
			it('should work', async () => {
				// TODO folderController tests artworkUploadCreate
			});
		});
		describe('.artworkUploadUpdate', () => {
			it('should work', async () => {
				// TODO folderController tests artworkUploadUpdate
			});
		});
		describe('.artworkNameUpdate', () => {
			it('should work', async () => {
				// TODO folderController tests artworkNameUpdate
			});
		});
		describe('.artworkDelete', () => {
			it('should work', async () => {
				// TODO folderController tests artworkDelete
			});
		});

		 */
	});
});
