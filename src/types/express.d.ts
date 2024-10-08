import session, { Cookie } from 'express-session';
import { User as OwnUser } from '../entity/user/user.js';

export interface SessionData extends Partial<session.SessionData> {
	passport: { user: string };
	jwth?: string;
	sessionID: string;
	client: string;
	userAgent: string;
	cookie: Cookie;
}

declare module 'express-session' {
	interface SessionData {
		passport: { user: string };
		jwth?: string;
		sessionID: string;
		client: string;
		userAgent: string;
		cookie: Cookie;
	}
}

declare global {
	namespace Express {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface User extends OwnUser {

		}
	}
}
