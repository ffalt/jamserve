import {DBObject} from '../base/base.model';

export interface PlayQueue extends DBObject {
	userID: string;
	trackIDs: Array<string>; // id of tracks
	currentID?: string; // id of current tracks
	position?: number; // position in track
	changed: number; // Datetime of change
	changedBy: string; //  Name of client app
}
