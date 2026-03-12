import { describe, expect, it, jest } from '@jest/globals';
import { RootWorker } from '../../../../src/modules/engine/worker/tasks/root.js';
import { Changes } from '../../../../src/modules/engine/worker/changes.js';

describe('RootWorker.remove', () => {
	it('collects removed ids in batches without loading full entities', async () => {
		const trackFindIDs = jest.fn<(options: unknown) => Promise<Array<string>>>()
			.mockResolvedValueOnce(['t1', 't2'])
			.mockResolvedValueOnce([]);
		const folderFindIDs = jest.fn<(options: unknown) => Promise<Array<string>>>()
			.mockResolvedValueOnce(['f1', 'f2'])
			.mockResolvedValueOnce([]);
		const artworkFindIDs = jest.fn<(options: unknown) => Promise<Array<string>>>()
			.mockResolvedValueOnce(['a1', 'a2']);

		const orm = {
			Track: { findIDs: trackFindIDs },
			Folder: { findIDs: folderFindIDs },
			Artwork: { findIDs: artworkFindIDs }
		} as any;
		const changes = new Changes();
		const root = { id: 'root-1' } as any;
		const worker = Object.create(RootWorker.prototype) as RootWorker;

		await worker.remove(orm, root, changes);

		expect(trackFindIDs.mock.calls.at(0)?.at(0)).toEqual({ where: { root: 'root-1' }, offset: 0, limit: 1000 });
		expect(folderFindIDs.mock.calls.at(0)?.at(0)).toEqual({ where: { root: 'root-1' }, offset: 0, limit: 1000 });
		expect(artworkFindIDs.mock.calls.at(0)?.at(0)).toEqual({ where: { folder: ['f1', 'f2'] } });
		expect(changes.tracks.removed.ids().sort()).toEqual(['t1', 't2']);
		expect(changes.folders.removed.ids().sort()).toEqual(['f1', 'f2']);
		expect(changes.artworks.removed.ids().sort()).toEqual(['a1', 'a2']);
		expect(changes.roots.removed.ids()).toEqual(['root-1']);
	});

	it('requests next pages with increasing offsets and chunks artwork lookup by folders', async () => {
		const firstTrackBatch = Array.from({ length: 1000 }, (_, index) => `t${index + 1}`);
		const secondTrackBatch = ['t1001'];
		const firstFolderBatch = Array.from({ length: 1000 }, (_, index) => `f${index + 1}`);
		const secondFolderBatch = ['f1001'];
		const trackFindIDs = jest.fn<(options: unknown) => Promise<Array<string>>>()
			.mockResolvedValueOnce(firstTrackBatch)
			.mockResolvedValueOnce(secondTrackBatch);
		const folderFindIDs = jest.fn<(options: unknown) => Promise<Array<string>>>()
			.mockResolvedValueOnce(firstFolderBatch)
			.mockResolvedValueOnce(secondFolderBatch);
		const artworkFindIDs = jest.fn<(options: unknown) => Promise<Array<string>>>()
			.mockResolvedValueOnce(['a1'])
			.mockResolvedValueOnce(['a2']);

		const orm = {
			Track: { findIDs: trackFindIDs },
			Folder: { findIDs: folderFindIDs },
			Artwork: { findIDs: artworkFindIDs }
		} as any;
		const changes = new Changes();
		const root = { id: 'root-2' } as any;
		const worker = Object.create(RootWorker.prototype) as RootWorker;

		await worker.remove(orm, root, changes);

		expect(trackFindIDs.mock.calls).toHaveLength(2);
		expect(trackFindIDs.mock.calls.at(0)?.at(0)).toEqual({ where: { root: 'root-2' }, offset: 0, limit: 1000 });
		expect(trackFindIDs.mock.calls.at(1)?.at(0)).toEqual({ where: { root: 'root-2' }, offset: 1000, limit: 1000 });
		expect(folderFindIDs.mock.calls).toHaveLength(2);
		expect(folderFindIDs.mock.calls.at(0)?.at(0)).toEqual({ where: { root: 'root-2' }, offset: 0, limit: 1000 });
		expect(folderFindIDs.mock.calls.at(1)?.at(0)).toEqual({ where: { root: 'root-2' }, offset: 1000, limit: 1000 });
		expect(artworkFindIDs.mock.calls).toHaveLength(2);
		const artworkCall0 = artworkFindIDs.mock.calls.at(0)?.at(0) as { where: { folder: Array<string> } };
		expect(artworkCall0.where.folder).toHaveLength(1000);
		expect(artworkCall0.where.folder.at(0)).toBe('f1');
		expect(artworkCall0.where.folder.at(-1)).toBe('f1000');
		const artworkCall1 = artworkFindIDs.mock.calls.at(1)?.at(0) as { where: { folder: Array<string> } };
		expect(artworkCall1.where.folder).toHaveLength(1);
		expect(artworkCall1.where.folder.at(0)).toBe('f1001');
		expect(changes.tracks.removed.ids()).toHaveLength(1001);
		expect(changes.folders.removed.ids()).toHaveLength(1001);
		expect(changes.artworks.removed.ids().sort()).toEqual(['a1', 'a2']);
	});
});
