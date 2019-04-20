import {Stats} from './stats.model';
import {Store} from '../store/store';
import {AlbumType} from '../../model/jam-types';

export class StatsService {
	private stats: Array<Stats> = [];

	constructor(private store: Store) {
	}

	async refresh(): Promise<void> {
		this.stats = [];
	}

	async getStats(rootID?: string): Promise<Stats> {
		let stat = this.stats.find(s => s.rootID === rootID);
		if (!stat) {
			stat = {
				rootID,
				album: await this.store.albumStore.searchCount({rootID}),
				albumTypes: {
					album: await this.store.albumStore.searchCount({rootID, albumType: AlbumType.album}),
					compilation: await this.store.albumStore.searchCount({rootID, albumType: AlbumType.compilation}),
					audiobook: await this.store.albumStore.searchCount({rootID, albumType: AlbumType.audiobook}),
					soundtrack: await this.store.albumStore.searchCount({rootID, albumType: AlbumType.soundtrack}),
					bootleg: await this.store.albumStore.searchCount({rootID, albumType: AlbumType.bootleg}),
					ep: await this.store.albumStore.searchCount({rootID, albumType: AlbumType.ep}),
					single: await this.store.albumStore.searchCount({rootID, albumType: AlbumType.single})
				},
				artist: await this.store.artistStore.searchCount({rootID}),
				artistTypes: {
					album: await this.store.artistStore.searchCount({rootID, albumType: AlbumType.album}),
					compilation: await this.store.artistStore.searchCount({rootID, albumType: AlbumType.compilation}),
					audiobook: await this.store.artistStore.searchCount({rootID, albumType: AlbumType.audiobook}),
					soundtrack: await this.store.artistStore.searchCount({rootID, albumType: AlbumType.soundtrack}),
					bootleg: await this.store.artistStore.searchCount({rootID, albumType: AlbumType.bootleg}),
					ep: await this.store.artistStore.searchCount({rootID, albumType: AlbumType.ep}),
					single: await this.store.artistStore.searchCount({rootID, albumType: AlbumType.single})
				},
				folder: await this.store.folderStore.searchCount({rootID}),
				track: await this.store.trackStore.searchCount({rootID})
			};
			this.stats.push(stat);
		}
		return stat;
	}

}
