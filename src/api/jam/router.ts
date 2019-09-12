import cors, {CorsOptions} from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import finishedRequest from 'on-finished';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import path from 'path';
import {Engine} from '../../engine/engine';
import {formatUser} from '../../engine/user/user.format';
import {User} from '../../engine/user/user.model';
import {Jam} from '../../model/jam-rest-data';
import {fileDeleteIfExists} from '../../utils/fs-utils';
import Logger from '../../utils/logger';
import {getMaxAge} from '../../utils/max-age';
import {SessionJSONFileStore} from '../../utils/session-storage';
import {JamApi} from './api';
import {apiCheck} from './check';
import {NotFoundError, UnauthError} from './error';
import {CheckAuthMiddleWare, UserRequest} from './login';
import {ApiResponder} from './response';
import {JamApiRole, Register, registerAccessControlApi, RegisterCallback, registerPublicApi} from './routes';
import {JAMAPI_VERSION} from './version';

const LoginLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour window
	max: 5, // start blocking after 5 requests
	message: 'Too many login requests from this IP, please try again after an hour'
});

const log = Logger('Jam.Api');

interface JWTPayload {
	id: string;
	exp?: number;
	client: string;
}

function CallSessionLoginHandler(req: UserRequest, res: express.Response, next: express.NextFunction): void {
	passport.authenticate('local', (err, user, info) => {
		if (err || !user) {
			return next();
		}
		req.login(user, err2 => {
			if (err2) {
				log.error(err2);
				return next();
			}
			const client = req.body.client || 'Unknown Client';
			req.client = client;
			const maxAge = getMaxAge(req.engine.config.server.jwt.maxAge);
			const tokenData: JWTPayload = {
				id: user.id,
				exp: maxAge > 0 ? Math.floor((Date.now() + maxAge) / 1000) : undefined,
				client
			};
			const token = jwt.sign(tokenData, req.engine.config.server.jwt.secret);
			const result: Jam.Session = {version: JAMAPI_VERSION, allowedCookieDomains: req.engine.config.server.session.allowedCookieDomains, jwt: token, user: formatUser(req.user)};
			ApiResponder.data(res, result);
		});
	})(req, res, next);
}

function CallSessionLogoutHandler(req: UserRequest, res: express.Response, next: express.NextFunction): void {
	req.logout();
	ApiResponder.ok(res);
}

function AutoCleanupHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
	finishedRequest(res, err => {
		if (err && req.file && req.file.path) {
			fileDeleteIfExists(req.file.path).catch(e => {
				log.error(e);
			});
		}
	});
	next();
}

async function checkRoles(user?: User, roles?: Array<JamApiRole>): Promise<void> {
	if (!user) {
		return Promise.reject(UnauthError());
	}
	if (roles && roles.length > 0) {
		for (const role of roles) {
			if (!user.roles[role]) {
				return Promise.reject(UnauthError());
			}
		}
	}
}

export function initJamRouter(engine: Engine): express.Router {
	const api = new JamApi(engine);

	const UPLOAD_PATH = engine.config.getDataPath(['cache', 'uploads']);
	const upload = multer({dest: `${UPLOAD_PATH}/`}); // multer configuration

	const router = express.Router();

	const maxAge = getMaxAge(engine.config.server.session.cookie.maxAge);
	router.use(session({
		name: engine.config.server.session.cookie.name,
		secret: engine.config.server.session.secret,
		store: new SessionJSONFileStore(engine.config.getDataPath(['session', 'sessions.json'])),
		resave: false,
		proxy: engine.config.server.session.cookie.proxy,
		saveUninitialized: false,
		cookie: {
			secure: engine.config.server.session.cookie.secure,
			maxAge: maxAge > 0 ? maxAge : undefined
		}
	}));
	router.use(passport.initialize());
	router.use(passport.session());
	passport.serializeUser((user: User, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id: string, done) => {
		engine.userService.getByID(id).then(user => done(null, user ? user : false)).catch(done);
	});

	passport.use('local', new passportLocal.Strategy(
		{usernameField: 'username', passwordField: 'password'},
		(username, password, done) => {
			engine.userService.auth(username, password).then(user => done(null, user ? user : false)).catch(done);
		}
	));
	passport.use('jwt-header', new passportJWT.Strategy(
		{
			jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: engine.config.server.jwt.secret
		},
		(jwtPayload, done) => {
			engine.userService.getByID(jwtPayload.id).then(user => done(null, user ? user : false, jwtPayload)).catch(done);
		}
	));
	passport.use('jwt-parameter', new passportJWT.Strategy(
		{
			jwtFromRequest: passportJWT.ExtractJwt.fromUrlQueryParameter('bearer'),
			secretOrKey: engine.config.server.jwt.secret
		},
		(jwtPayload, done) => {
			engine.userService.getByID(jwtPayload.id).then(user => done(null, user ? user : false, jwtPayload)).catch(done);
		}
	));

	function jwtParameterAuthMiddleware(req: UserRequest, res: express.Response, next: express.NextFunction): void {
		if (req.user) {
			return next();
		}
		passport.authenticate('jwt-parameter', {session: false}, (err, user, info: JWTPayload) => {
			if (err) {
				log.error(err);
				return next();
			}
			req.jwt = !!user;
			req.client = info.client;
			req.user = user;
			next();
		})(req, res, next);
	}

	function jwtHeaderAuthMiddleware(req: UserRequest, res: express.Response, next: express.NextFunction): void {
		if (req.user) {
			return next();
		}
		passport.authenticate('jwt-header', {session: false}, (err, user, info: JWTPayload) => {
			if (err) {
				log.error(err);
				return next();
			}
			req.jwt = !!user;
			req.client = info.client;
			req.user = user;
			next();
		})(req, res, next);
	}

	router.use((req, res, next) => {
		log.info(req.originalUrl);
		next();
	});

	router.use(jwtHeaderAuthMiddleware as express.RequestHandler);
	router.use(jwtParameterAuthMiddleware as express.RequestHandler);

	router.use(cors({
		preflightContinue: false,
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
		origin: true,
		methods: ['GET', 'POST']
	}));

	const registerPublic: Register = {
		get(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			router.get<any>(name, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await execute(req as UserRequest, res);
				} catch (e) {
					log.error(e);
					ApiResponder.error(res, e);
				}
			});
		},
		post(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			// dummy, there is no public post
		},
		upload(name: string, field: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			// dummy, there is no public upload
		}
	};

	registerPublicApi(registerPublic, api);

	router.post('/login', LoginLimiter, apiCheck('/login'), CallSessionLoginHandler as express.RequestHandler);

	const corsOptionsDelegate = (req: express.Request, callback: (err: Error | null, options: CorsOptions) => void) => {
		const origins = engine.config.server.session.allowedCookieDomains || [];
		const corsOptions: CorsOptions = {
			preflightContinue: false,
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
			origin(origin, cb): void {
				if (!origin || origins.includes(origin)) {
					cb(null, true);
				} else {
					if (req.method === 'OPTIONS' || req.jwt) {
						cb(null, true);
					} else {
						cb(new Error('Not allowed by CORS'));
					}
				}
			},
			methods: ['GET', 'POST']
		};
		callback(null, corsOptions); // callback expects two parameters: error and options
	};
	router.use(cors(corsOptionsDelegate));

	router.use('/docs', express.static(path.resolve('./dist/docs/api/')));

	router.use(CheckAuthMiddleWare as express.RequestHandler); // ensure req.user exists for all requests after this

	router.post('/logout', CallSessionLogoutHandler as express.RequestHandler);

	const register: Register = {
		get(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			router.get<any>(name, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await checkRoles((req as UserRequest).user, roles);
					await execute(req as UserRequest, res);
				} catch (e) {
					log.debug(e);
					ApiResponder.error(res, e);
				}
			});
		},
		post(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			router.post(name, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await checkRoles((req as UserRequest).user, roles);
					await execute(req as UserRequest, res);
				} catch (e) {
					log.debug(e);
					ApiResponder.error(res, e);
				}
			});
		},
		upload(name: string, field: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			router.post(name, upload.single(field), AutoCleanupHandler, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await checkRoles((req as UserRequest).user, roles);
					await execute(req as UserRequest, res);
				} catch (e) {
					log.debug(e);
					ApiResponder.error(res, e);
				}
			});
		}
	};

	registerAccessControlApi(register, api);

	router.use((req, res) => {
		ApiResponder.error(res, NotFoundError('jam api cmd not found'));
	});

	return router;
}
