import {DBObjectType} from '../../types';
import {PlayQueue} from './playqueue.model';
import {PlayQueueStore, SearchQueryPlayQueue} from './playqueue.store';
import {BaseStoreService} from '../base/base.service';

export class PlayQueueService extends BaseStoreService<PlayQueue, SearchQueryPlayQueue> {

	constructor(private playQueueStore: PlayQueueStore) {
		super(playQueueStore);
	}

	async getQueueOrCreate(userID: string, client?: string): Promise<PlayQueue> {
		let playQueue = await this.get(userID);
		if (!playQueue) {
			playQueue = this.emptyPlaylist(userID, client);
			playQueue.id = await this.playQueueStore.add(playQueue);
		}
		return playQueue;
	}

	emptyPlaylist(userID: string, client?: string): PlayQueue {
		return {
			id: '',
			type: DBObjectType.playqueue,
			userID,
			trackIDs: [],
			changed: Date.now(),
			changedBy: client || 'Unknown Client'
		};
	}

	async get(userID: string): Promise<PlayQueue | undefined> {
		return this.playQueueStore.searchOne({userID});
	}

	async save(userID: string, trackIDs: Array<string>, currentID: string | undefined, position: number | undefined, client?: string): Promise<PlayQueue> {
		let playQueue = await this.playQueueStore.searchOne({userID});
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
			playQueue.id = await this.playQueueStore.add(playQueue);
		} else {
			playQueue.trackIDs = trackIDs;
			playQueue.currentID = currentID;
			playQueue.position = position;
			playQueue.changed = Date.now();
			playQueue.changedBy = client || 'Unknown Client';
			await this.playQueueStore.replace(playQueue);
		}
		return playQueue;
	}

	async remove(userID: string): Promise<void> {
		const playQueue = await this.get(userID);
		if (playQueue) {
			await this.playQueueStore.remove(playQueue.id);
		}
	}

}
