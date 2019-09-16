import {DBObject} from '../base/base.model';

export interface Session extends DBObject {
	sessionID: string;
	userID: string;
	client: string;
	agent: string;
	expires: number;
	jwth: string; // hashed jwt
	cookie: string;
}
