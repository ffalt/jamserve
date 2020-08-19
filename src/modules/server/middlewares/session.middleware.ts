import express from 'express';
import session from 'express-session';
import {ConfigService} from '../../engine/services/config.service';
import {ExpressSessionStore} from './session-store';
import {SessionService} from '../../../entity/session/session.service';

export function useSessionMiddleware(configService: ConfigService, sessionService: SessionService): express.RequestHandler {
	return session({
		name: 'jam.sid',
		secret: configService.env.session.secret,
		store: new ExpressSessionStore(sessionService),
		resave: false,
		proxy: configService.env.session.proxy,
		saveUninitialized: false,
		cookie: {
			secure: !!configService.env.session.secure,
			path: '/',
			maxAge: configService.env.session.maxAge > 0 ? configService.env.session.maxAge : undefined
		}
	});
}
