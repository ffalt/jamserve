import {DBObject} from '../base/base.model';
import {DBObjectType} from '../../model/jam-types';

export interface State extends DBObject {
	userID: string;
	destID: string;
	destType: DBObjectType;
	played: number;
	lastplayed: number;
	faved?: number;
	rated?: number;
}

export interface States {
	[id: string]: State;
}
