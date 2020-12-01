import session, {Cookie} from 'express-session';

export interface SessionData extends Partial<session.SessionData> {
	passport: { user: string };
	jwth?: string;
	sessionID: string;
	client: string;
	userAgent: string;
	cookie: Cookie;
}

declare module 'express-session' {
	interface SessionData{
		passport: { user: string };
		jwth?: string;
		sessionID: string;
		client: string;
		userAgent: string;
		cookie: Cookie;
	}
}
