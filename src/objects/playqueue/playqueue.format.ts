import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {PlayQueue} from './playqueue.model';

export function formatPlayQueue(playQueue: PlayQueue, includes: JamParameters.IncludesPlayQueue): Jam.PlayQueue {
	return {
		changed: playQueue.changed,
		changedBy: playQueue.changedBy,
		currentID: playQueue.currentID,
		position: playQueue.position,
		trackIDs: includes.playQueueTrackIDs ? playQueue.trackIDs : undefined
	};
}
