import Logger from '../../utils/logger';
import {MergeChanges} from './scan.changes';
import {Store} from '../store/store';

const log = Logger('Scan.Store');

export class ScanStorer {
	constructor(private store: Store) {
	}

	async storeChanges(changes: MergeChanges): Promise<void> {
		//	log.info('Storing:', dir);
		await this.store.trackStore.bulk(changes.newTracks.map(t => t.track));
		await this.store.trackStore.upsert(changes.updateTracks.map(t => t.track));
		await this.store.folderStore.bulk(changes.newFolders);
		await this.store.folderStore.upsert(changes.updateFolders);

		await this.store.albumStore.bulk(changes.newAlbums);
		await this.store.albumStore.upsert(changes.updateAlbums);
		await this.store.artistStore.bulk(changes.newArtists);
		await this.store.artistStore.upsert(changes.updateArtists);
	}

}
