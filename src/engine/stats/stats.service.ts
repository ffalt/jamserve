import {Stats} from './stats.model';
import {Store} from '../store/store';

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
				albumCount: await this.store.albumStore.searchCount({rootID}),
				artistCount: await this.store.artistStore.searchCount({rootID}),
				folderCount: await this.store.folderStore.searchCount({rootID}),
				trackCount: await this.store.trackStore.searchCount({rootID})
			};
			this.stats.push(stat);
		}
		return stat;
	}

}
