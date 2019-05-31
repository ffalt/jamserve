import cors, {CorsOptions} from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import autoUploadTempReap from 'multer-autoreap';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import path from 'path';
import {Engine} from '../../engine/engine';
import {formatUser} from '../../engine/user/user.format';
import {User} from '../../engine/user/user.model';
import {Jam} from '../../model/jam-rest-data';
import Logger from '../../utils/logger';
import {getMaxAge} from '../../utils/max-age';
import {SessionJSONFileStore} from '../../utils/session-storage';
import {JamApi} from './api';
import {apiCheck} from './check';
import {NotFoundError, UnauthError} from './error';
import {CheckAuthMiddleWare, UserRequest} from './login';
import {ApiResponder} from './response';
import {Register, registerAccessControlApi, RegisterCallback, registerPublicApi} from './routes';
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
		req.login(user, (err2) => {
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

async function checkRoles(user: User, roles?: Array<string>): Promise<void> {
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
		(jwt_payload, done) => {
			engine.userService.getByID(jwt_payload.id).then(user => done(null, user ? user : false, jwt_payload)).catch(done);
		}
	));
	passport.use('jwt-parameter', new passportJWT.Strategy(
		{
			jwtFromRequest: passportJWT.ExtractJwt.fromUrlQueryParameter('bearer'),
			secretOrKey: engine.config.server.jwt.secret
		},
		(jwt_payload, done) => {
			engine.userService.getByID(jwt_payload.id).then(user => done(null, user ? user : false, jwt_payload)).catch(done);
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

	const register: Register = {
		get: (name: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<string>) => {
			router.get(name, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await checkRoles(req.user, roles);
					await execute(req, res);
				} catch (e) {
					log.error(e);
					await ApiResponder.error(res, e);
				}
			});
		},
		post: (name: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<string>) => {
			router.post(name, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await checkRoles(req.user, roles);
					await execute(req, res);
				} catch (e) {
					log.error(e);
					await ApiResponder.error(res, e);
				}
			});
		},
		upload: (name: string, field: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<string>) => {
			router.post(name, upload.single(field), apiCheck(apiCheckName || name), autoUploadTempReap, async (req, res) => {
				try {
					await checkRoles(req.user, roles);
					await execute(req, res);
				} catch (e) {
					log.error(e);
					await ApiResponder.error(res, e);
				}
			});
		}
	};

	registerPublicApi(register, api);
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

	router.post('/logout', CallSessionLogoutHandler as express.RequestHandler);
	router.use('/docs', express.static(path.resolve('./dist/docs/api/')));

	router.use(CheckAuthMiddleWare as express.RequestHandler); // ensure req.user exists for all requests after this

	registerAccessControlApi(register, api);

	router.use((req, res, next) => {
		ApiResponder.error(res, NotFoundError('jam api cmd not found'));
	});

	return router;
}
