import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import {Engine} from '../../engine/engine';
import {formatUser} from '../../engine/user/user.format';
import {User} from '../../engine/user/user.model';
import {Jam} from '../../model/jam-rest-data';
import {hashMD5} from '../../utils/hash';
import {logger} from '../../utils/logger';
import {getMaxAge} from '../../utils/max-age';
import {UserRequest} from './login';
import {ApiResponder} from './response';
import {JAMAPI_VERSION} from './version';

const log = logger('Jam.Api.Passport');

interface JWTPayload {
	id: string;
	exp?: number;
	client: string;
}

function jwthash(token: string): string {
	return hashMD5(token);
}

export function registerPassPort(router: express.Router, engine: Engine): void {
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
	const resolvePayload = (jwtPayload: any, done: passportJWT.VerifiedCallback): void => {
		engine.userService.getByID(jwtPayload.id)
			.then(user => done(null, user ? user : false, jwtPayload))
			.catch(done);
	};
	passport.use('jwt-header', new passportJWT.Strategy({
			jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: engine.config.server.jwt.secret
		}, resolvePayload
	));
	passport.use('jwt-parameter', new passportJWT.Strategy({
			jwtFromRequest: passportJWT.ExtractJwt.fromUrlQueryParameter('bearer'),
			secretOrKey: engine.config.server.jwt.secret
		}, resolvePayload
	));

	function jwtAuthMiddleware(req: UserRequest, res: express.Response, next: express.NextFunction): void {
		if (req.user) {
			return next();
		}
		let name = '';
		let token = req.header('Authorization');
		if (token) {
			token = token.slice(7); // Bearer xyz
			name = 'jwt-header';
		} else {
			token = req.query.bearer;
			if (token) {
				name = 'jwt-parameter';
			}
		}
		if (!token || !name) {
			// no or not valid auth token, go to next login method (request will fail eventually if req.user is not set)
			return next();
		}
		const jwth = jwthash(token);
		passport.authenticate(name, {session: false}, (err, user, info: any) => {
			if (err) {
				log.error(err);
				return next();
			}
			if (info instanceof Error || !user) {
				return next();
			}
			req.engine.sessionService.isRevoked(jwth)
				.then(revoked => {
					if (!revoked) {
						req.jwt = !!user;
						req.jwth = jwth;
						req.client = info.client;
						req.user = user;
					}
					next();
				})
				.catch(e => {
					throw e;
				});
		})(req, res, next);
	}

	router.use(jwtAuthMiddleware as express.RequestHandler);
}

function generateJWT(userID: string, client: string, req: UserRequest): string {
	const maxAge = getMaxAge(req.engine.config.server.jwt.maxAge);
	const tokenData: JWTPayload = {
		id: userID,
		exp: maxAge > 0 ? Math.floor((Date.now() + maxAge) / 1000) : undefined,
		client
	};
	return jwt.sign(tokenData, req.engine.config.server.jwt.secret);
}

export function CallSessionLoginHandler(req: UserRequest, res: express.Response, next: express.NextFunction): void {
	passport.authenticate('local', (err, user) => {
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
			const token = req.body.jwt ? generateJWT(user.id, client, req) : undefined;
			if (req.session) { // express session data obj
				req.session.client = client;
				req.session.userAgent = req.headers['user-agent'];
				if (token) {
					req.session.jwth = jwthash(token);
				}
			}
			const result: Jam.Session = {version: JAMAPI_VERSION, allowedCookieDomains: req.engine.config.server.session.allowedCookieDomains, jwt: token, user: formatUser(req.user)};
			ApiResponder.data(req, res, result);
		});
	})(req, res, next);
}

async function destroySession(req: UserRequest): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (!req.session) {
			return resolve();
		}
		req.session.destroy(err => {
			if (err) {
				return reject(err);
			}
			return resolve();
		});
	});
}

async function clearSession(req: UserRequest): Promise<void> {
	if (req.jwth) {
		await req.engine.sessionService.removeByJwth(req.jwth);
	}
	await destroySession(req);
	await req.engine.sessionService.clearCache();
}

export function CallSessionLogoutHandler(req: UserRequest, res: express.Response, next: express.NextFunction): void {
	req.logout();
	clearSession(req).catch(e => {
		console.error(e);
	});
	res.clearCookie(req.engine.config.server.session.cookie.name, {path: '/'});
	ApiResponder.ok(req, res);
}
