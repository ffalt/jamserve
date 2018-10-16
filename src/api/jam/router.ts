import express from 'express';
import {CheckAuthMiddleWare, UserRequest} from './login';
import {ApiResponder} from './response';
import multer from 'multer';
import path from 'path';
import Logger from '../../utils/logger';
import {JamServe} from '../../model/jamserve';
import {ApiJam} from './api';
import {APIVERSION, FORMAT} from './format';
import {Engine} from '../../engine/engine';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import cors, {CorsOptions} from 'cors';
import {SessionJSONFileStore} from '../../utils/session-storage';
import session from 'express-session';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import jwt from 'jsonwebtoken';
import {NotFoundError, UnauthError} from './error';
import {registerAdminApi, registerPublicApi, registerUserApi} from './routes';
import {apiCheck} from './check';
import {getMaxAge} from '../../utils/max-age';

const autoUploadTempReap = require('multer-autoreap'); // TODO: multer-autoreap types
const rateLimit = require('express-rate-limit');

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

function CallSessionLoginHandler(req: UserRequest, res: express.Response, next: express.NextFunction) {
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
			const result: Jam.Session = {version: APIVERSION, allowedCookieDomains: req.engine.config.server.session.allowedCookieDomains, jwt: token, user: FORMAT.packUser(req.user)};
			ApiResponder.data(res, result);
		});
	})(req, res, next);
}

function CallSessionLogoutHandler(req: UserRequest, res: express.Response, next: express.NextFunction) {
	req.logout();
	ApiResponder.ok(res);
}

function AdminMiddleWare(req: UserRequest, res: express.Response, next: express.NextFunction) {
	if (!req.user || !req.user.roles.adminRole) {
		ApiResponder.error(res, UnauthError());
	} else {
		next();
	}
}

export function initJamRouter(engine: Engine): express.Router {
	const api = new ApiJam(engine);

	const UPLOAD_PATH = engine.config.getDataPath(['cache', 'uploads']);
	const upload = multer({dest: `${UPLOAD_PATH}/`}); // multer configuration

	const router = express.Router();

	// if (router.get('env') === 'production') {
	// 	router.set('trust proxy', 1) // trust first proxy
	// 	sess.cookie.secure = true // serve secure cookies
	// }
	const maxAge = getMaxAge(engine.config.server.session.cookie.maxAge);
	router.use(session({
		name: engine.config.server.session.cookie.name,
		secret: engine.config.server.session.secret,
		store: new SessionJSONFileStore(engine.config.getDataPath(['session', 'sessions.json'])),
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: engine.config.server.session.cookie.secure,
			maxAge: maxAge > 0 ? maxAge : undefined
		}
	}));
	router.use(passport.initialize());
	router.use(passport.session());
	passport.serializeUser((user: JamServe.User, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id: string, done) => {
		engine.users.getUser(id).then(user => done(null, user ? user : false)).catch(done);
	});

	passport.use('local', new passportLocal.Strategy(
		{usernameField: 'username', passwordField: 'password'},
		(username, password, done) => {
			engine.users.auth(username, password).then(user => done(null, user ? user : false)).catch(done);
		}
	));
	passport.use('jwt-header', new passportJWT.Strategy(
		{
			jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: engine.config.server.jwt.secret
		},
		(jwt_payload, done) => {
			engine.users.getUser(jwt_payload.id).then(user => done(null, user ? user : false, jwt_payload)).catch(done);
		}
	));
	passport.use('jwt-parameter', new passportJWT.Strategy(
		{
			jwtFromRequest: passportJWT.ExtractJwt.fromUrlQueryParameter('bearer'),
			secretOrKey: engine.config.server.jwt.secret
		},
		(jwt_payload, done) => {
			engine.users.getUser(jwt_payload.id).then(user => done(null, user ? user : false, jwt_payload)).catch(done);
		}
	));

	function jwtParameterAuthMiddleware(req: UserRequest, res: express.Response, next: express.NextFunction) {
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

	function jwtHeaderAuthMiddleware(req: UserRequest, res: express.Response, next: express.NextFunction) {
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

	router.use(<express.RequestHandler>jwtHeaderAuthMiddleware);
	router.use(<express.RequestHandler>jwtParameterAuthMiddleware);


	router.use(cors({
		preflightContinue: false,
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
		origin: true,
		methods: ['GET', 'POST']
	}));
	registerPublicApi(router, api);
	router.post('/login', LoginLimiter, apiCheck('/login'), <express.RequestHandler>CallSessionLoginHandler);

	const corsOptionsDelegate = function(req: express.Request, callback: (err: Error | null, options: CorsOptions) => void) {
		const origins = engine.config.server.session.allowedCookieDomains || [];
		const corsOptions: CorsOptions = {
			preflightContinue: false,
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
			origin: function(origin, cb) {
				if (origins.indexOf(origin) !== -1 || !origin) {
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

	router.post('/logout', <express.RequestHandler>CallSessionLogoutHandler);
	router.use('/docs', express.static(path.resolve('./dist/docs/api/')));

	router.use(<express.RequestHandler>CheckAuthMiddleWare); // ensure req.user exists for all requests after this

	registerUserApi(router, api, upload.single('image'), autoUploadTempReap);

	router.use(<express.RequestHandler>AdminMiddleWare); // ensure req.user is an admin for all requests after this

	registerAdminApi(router, api, upload.single('image'), autoUploadTempReap);

	router.use((req, res, next) => {
		ApiResponder.error(res, NotFoundError('jam api cmd not found'));
	});

	return router;
}
