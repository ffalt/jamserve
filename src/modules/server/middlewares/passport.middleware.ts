import express from 'express';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import passport from 'passport';
import {EngineService} from '../../engine/services/engine.service.js';
import {User} from '../../../entity/user/user.js';
import {EngineRequest} from './engine.middleware.js';
import {logger} from '../../../utils/logger.js';
import {hashMD5} from '../../../utils/md5.js';

const log = logger('Passport');

export interface UserRequest extends EngineRequest {
	user: User;
	client: string;
	jwt: boolean;
	jwth?: string;
	params: any;
}

function jwthash(token: string): string {
	return hashMD5(token);
}

export function usePassPortMiddleWare(router: express.Router, engine: EngineService): express.RequestHandler {
	router.use(passport.initialize());
	router.use(passport.session());
	passport.serializeUser((user, done) => {
		done(null, user?.id || '_invalid_');
	});
	passport.deserializeUser((id: string, done) => {
		engine.user.findByID(engine.orm.fork(), id).then(user => done(null, user)).catch(done);
	});

	passport.use('local', new passportLocal.Strategy(
		{usernameField: 'username', passwordField: 'password'},
		(username, password, done) => {
			engine.user.auth(engine.orm.fork(), username, password).then(user => done(null, user ? user : false)).catch(done);
		}
	));
	const resolvePayload = (jwtPayload: any, done: passportJWT.VerifiedCallback): void => {
		engine.user.authJWT(engine.orm.fork(), jwtPayload)
			.then(user => done(null, user ? user : false, jwtPayload))
			.catch(done);
	};
	passport.use('jwt-header', new passportJWT.Strategy({
			jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: engine.config.env.jwt.secret
		}, resolvePayload
	));
	passport.use('jwt-parameter', new passportJWT.Strategy({
			jwtFromRequest: passportJWT.ExtractJwt.fromUrlQueryParameter('bearer'),
			secretOrKey: engine.config.env.jwt.secret
		}, resolvePayload
	));

	function jwtAuthMiddleware(req: UserRequest, res: express.Response, next: express.NextFunction): void {
		if (req.user) {
			return next();
		}
		let name = '';
		let token: string | undefined = req.header('Authorization');
		if (token) {
			token = token.slice(7); // Bearer xyz
			name = 'jwt-header';
		} else {
			token = req.query.bearer as string;
			if (token) {
				name = 'jwt-parameter';
			}
		}
		if (!token || !name) {
			// no or not valid auth token, go to next login method (request will fail eventually if req.user is not set)
			return next();
		}
		const jwth = jwthash(token);
		req.engine.rateLimit.loginSlowDown(req, res)
			.then(() => {
				passport.authenticate(name, {session: false}, (err: Error, user: User, info: any) => {
					if (err) {
						log.error(err);
						return next();
					}
					if (info instanceof Error || !user) {
						return next();
					}
					req.engine.session.isRevoked(jwth)
						.then(revoked => {
							if (!revoked) {
								req.jwt = !!user;
								req.jwth = jwth;
								req.client = info.client;
								req.user = user;
							}
							next();
							req.engine.rateLimit.loginSlowDownReset(req).catch(e => {
								throw e;
							});
						})
						.catch(e => {
							throw e;
						});
				})(req, res, next);
			})
			.catch(e => {
				throw e;
			});
	}

	return (jwtAuthMiddleware as express.RequestHandler);
}
