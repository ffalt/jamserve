import {DBObject} from '../base/base.model';

export interface Playlist extends DBObject {
	name: string;
	userID: string;
	comment?: string;
	coverArt?: string;
	changed: number;
	created: number;
	allowedUser?: Array<string>;
	isPublic: boolean;
	duration: number;
	trackIDs: Array<string>;
}
