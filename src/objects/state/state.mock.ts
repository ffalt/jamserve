import {State} from './state.model';
import {DBObjectType} from '../../types';

export function mockState(): State {
	return {
		id: '',
		type: DBObjectType.state,
		userID: 'userID1',
		destID: 'trackID1',
		destType: DBObjectType.track,
		played: 3,
		lastplayed: 1543495268,
		faved: 1543495268,
		rated: 3
	};
}

export function mockState2(): State {
	return {
		id: '',
		type: DBObjectType.state,
		userID: 'userID2',
		destID: 'folderID2',
		destType: DBObjectType.folder,
		played: 0,
		lastplayed: 0,
		faved: 0,
		rated: 0
	};
}
