import {DBObject} from '../base/base.model';

export interface Session extends DBObject {
	userID: string;
	client: string;
	agent: string;
	expires: number;
	cookie: string;
}
