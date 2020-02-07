import {DBObject} from '../base/base.model';
import {SessionMode} from './session.types';

export interface Session extends DBObject {
	userID: string;
	client: string;
	agent: string;
	expires: number;
	mode: SessionMode;
	sessionID: string; // session id
	cookie: string; // session cookie
	jwth: string; // hashed jwt
}
