import {Changes, ChangeSet} from '../../modules/engine/worker/changes.js';
import {MockRoot, validateMock} from './mock.root';
import {WorkerService} from '../../modules/engine/services/worker.service.js';
import {Orm} from '../../modules/engine/services/orm.service.js';

function validateChangeSet(name: string, changeSet: ChangeSet<any>, added: number, updated: number, removed: number) {
	expect(changeSet.added.size).toBe(added); // `New ${name} count doesnt match`
	expect(changeSet.updated.size).toBe(updated); // `Updated ${name} count doesnt match`
	expect(changeSet.removed.size).toBe(removed); // `Removed ${name} count doesnt match`
}

export function expectChanges(changes: Changes, expected: {
	tracksNew?: number;
	tracksUpdate?: number;
	tracksRemoved?: number;
	foldersNew?: number;
	foldersUpdate?: number;
	foldersRemoved?: number;
	artistsNew?: number;
	artistsUpdate?: number;
	artistsRemoved?: number;
	albumsNew?: number;
	albumsUpdate?: number;
	albumsRemoved?: number;
	seriesNew?: number;
	seriesUpdate?: number;
	seriesRemoved?: number;
	artworksNew?: number;
	artworksUpdate?: number;
	artworksRemoved?: number;
	genresNew?: number;
	genresUpdate?: number;
	genresRemoved?: number;
}): void {
	validateChangeSet('Folder', changes.folders, expected.foldersNew || 0, expected.foldersUpdate || 0, expected.foldersRemoved || 0);
	validateChangeSet('Track', changes.tracks, expected.tracksNew || 0, expected.tracksUpdate || 0, expected.tracksRemoved || 0);
	validateChangeSet('Artworks', changes.artworks, expected.artworksNew || 0, expected.artworksUpdate || 0, expected.artworksRemoved || 0);
	validateChangeSet('Artist', changes.artists, expected.artistsNew || 0, expected.artistsUpdate || 0, expected.artistsRemoved || 0);
	validateChangeSet('Album', changes.albums, expected.albumsNew || 0, expected.albumsUpdate || 0, expected.albumsRemoved || 0);
	validateChangeSet('Series', changes.series, expected.seriesNew || 0, expected.seriesUpdate || 0, expected.seriesRemoved || 0);
	validateChangeSet('Genres', changes.genres, expected.genresNew || 0, expected.genresUpdate || 0, expected.genresRemoved || 0);
}

export async function validateMockRoot(mockRoot: MockRoot, changes: Changes, workerService: WorkerService, orm: Orm): Promise<void> {
	validateChangeSet('Track', changes.tracks, mockRoot.expected.tracks, 0, 0);
	validateChangeSet('Artist', changes.artists, mockRoot.expected.artists.length, 0, 0);
	validateChangeSet('Folder', changes.folders, mockRoot.expected.folders, 0, 0);
	validateChangeSet('Artworks', changes.artworks, mockRoot.expected.artworks, 0, 0);
	validateChangeSet('Album', changes.albums, mockRoot.expected.albums, 0, 0);
	validateChangeSet('Series', changes.series, mockRoot.expected.series, 0, 0);
	validateChangeSet('Genres', changes.genres, mockRoot.expected.genres, 0, 0);
	expect(await orm.State.count()).toBe(mockRoot.expected.states);
	for (const a of mockRoot.expected.artists) {
		expect(await orm.Artist.findOne({where: {name: a}})).toBeDefined(); // `Missing Artist ${a}`
	}
	if (mockRoot.albums) {
		expect(changes.albums.added.size).toBe(mockRoot.albums.length); // 'Album count doesnt match'
		for (const album of mockRoot.albums) {
			const b = await orm.Album.findOneFilter({name: album.name, artist: album.artist});
			expect(b).toBeDefined(); // `Album not found ${album.name} - ${album.artist}`
			if (b) {
				expect(b.albumType).toBe(album.albumType); // `Album Type doesnt match ${album.name} - ${album.artist}`
			}
		}
	}
	await validateMock(mockRoot, workerService, orm);
}
