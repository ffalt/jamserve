import express from 'express';
import session from 'express-session';
import {Engine} from '../../engine/engine';
import {getMaxAge} from '../../utils/max-age';
import {ExpressSessionStore} from './session-store';

function jamSession(engine: Engine): express.RequestHandler {
	const maxAge = getMaxAge(engine.config.server.session.cookie.maxAge);
	return session({
		name: engine.config.server.session.cookie.name,
		secret: engine.config.server.session.secret,
		// store: new SessionJSONFileStore(engine.config.getDataPath(['session', 'sessions.json'])),
		store: new ExpressSessionStore(engine.sessionService),
		resave: false,
		proxy: engine.config.server.session.cookie.proxy,
		saveUninitialized: false,
		cookie: {
			secure: engine.config.server.session.cookie.secure,
			maxAge: maxAge > 0 ? maxAge : undefined
		}
	});
}

export function registerSession(router: express.Router, engine: Engine): void {
	router.use(jamSession(engine));
}
