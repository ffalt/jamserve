import {PlayQueue} from './playqueue.model';
import {DBObjectType} from '../../model/jam-types';

export function mockPlayQueue(): PlayQueue {
	return {
		id: '',
		type: DBObjectType.playqueue,
		userID: 'userID1',
		currentID: 'trackID1',
		trackIDs: ['trackID1', 'trackID2'],
		position: 1234,
		changed: 1543495268,
		changedBy: 'berry'
	};
}

export function mockPlayQueue2(): PlayQueue {
	return {
		id: '',
		type: DBObjectType.playqueue,
		userID: 'userID2',
		currentID: 'trackID3',
		trackIDs: ['trackID3', 'trackID4'],
		position: 54321,
		changed: 1443495268,
		changedBy: 'boree'
	};
}
