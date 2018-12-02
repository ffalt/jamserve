import {Store} from '../../engine/store';
import {DBObjectType} from '../../types';
import {PlayQueue} from './playqueue.model';

export class PlayQueueService {
	store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	async getQueueOrCreate(userID: string, client?: string): Promise<PlayQueue> {
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
		await this.store.playQueueStore.replace(playQueue);
		return playQueue;
	}

	async getQueue(userID: string): Promise<PlayQueue | undefined> {
		return this.store.playQueueStore.searchOne({userID});
	}

	async removeQueue(userID: string): Promise<void> {
		const playQueue = await this.getQueue(userID);
		if (playQueue) {
			await this.store.playQueueStore.remove(playQueue.id);
		}
	}

	async saveQueue(userID: string, trackIDs: Array<string>, currentID: string | undefined, position: number | undefined, client?: string): Promise<void> {
		let playQueue = await this.store.playQueueStore.searchOne({userID});
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
			playQueue.id = await this.store.playQueueStore.add(playQueue);
		} else {
			playQueue.trackIDs = trackIDs;
			playQueue.currentID = currentID;
			playQueue.position = position;
			playQueue.changed = Date.now();
			playQueue.changedBy = client || 'Unknown Client';
			await this.store.playQueueStore.replace(playQueue);
		}
	}
}
