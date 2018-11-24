import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
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
