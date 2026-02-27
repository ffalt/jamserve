import express from 'express';
import session from 'express-session';
import { ConfigService } from '../../engine/services/config.service.js';
import { ExpressSessionStore } from './session-store.js';
import { SessionService } from '../../../entity/session/session.service.js';

export function useSessionMiddleware(configService: ConfigService, sessionService: SessionService): express.RequestHandler {
	return session({
		name: 'jam.sid',
		secret: configService.env.session.secret,
		store: new ExpressSessionStore(sessionService),
		resave: false,
		proxy: configService.env.session.proxy,
		saveUninitialized: false,
		cookie: {
			secure: !!(configService.env.session.secure as unknown),
			httpOnly: true, // Prevent JavaScript access (XSS protection)
			sameSite: 'lax', // CSRF protection
			path: '/',
			maxAge: configService.env.session.maxAge > 0 ? configService.env.session.maxAge : undefined
		}
	});
}
