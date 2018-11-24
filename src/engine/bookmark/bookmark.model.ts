import {DBObject} from '../base/base.model';

export interface Bookmark extends DBObject {
	destID: string;
	userID: string;
	comment?: string;
	created: number;
	changed: number;
	position: number;
}
