import {Store} from '../../store/store';
import {DBObjectType} from '../../types';
import {JamServe} from '../../model/jamserve';

export class PlayQueues {
	store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	async getQueueOrCreate(userID: string, client?: string): Promise<JamServe.PlayQueue> {
		let playQueue = await this.getQueue(userID);
		if (!playQueue) {
			playQueue = {
				id: '',
				type: DBObjectType.playqueue,
				userID,
				trackIDs: [],
				changed: Date.now(),
				changedBy: client || 'Unknown Client'
			};
		}
		await this.store.playqueue.replace(playQueue);
		return playQueue;
	}

	async getQueue(userID: string): Promise<JamServe.PlayQueue | undefined> {
		return this.store.playqueue.searchOne({userID});
	}

	async saveQueue(userID: string, trackIDs: Array<string>, currentID: string | undefined, position: number | undefined, client?: string): Promise<void> {
		let playQueue = await this.store.playqueue.searchOne({userID});
		if (!playQueue) {
			playQueue = {
				id: '',
				type: DBObjectType.playqueue,
				userID,
				trackIDs,
				currentID,
				position,
				changed: Date.now(),
				changedBy: client || 'Unknown Client'
			};
			playQueue.id = await this.store.playqueue.add(playQueue);
		} else {
			playQueue.trackIDs = trackIDs;
			playQueue.currentID = currentID;
			playQueue.position = position;
			playQueue.changed = Date.now();
			playQueue.changedBy = client || 'Unknown Client';
			await this.store.playqueue.replace(playQueue);
		}
	}
}
