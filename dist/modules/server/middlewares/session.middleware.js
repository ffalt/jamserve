import session from 'express-session';
import { ExpressSessionStore } from './session-store.js';
export function useSessionMiddleware(configService, sessionService) {
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
//# sourceMappingURL=session.middleware.js.map