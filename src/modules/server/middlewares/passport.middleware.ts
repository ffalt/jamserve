import express from 'express';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import passport from 'passport';
import { EngineService } from '../../engine/services/engine.service.js';
import { User } from '../../../entity/user/user.js';
import { EngineRequest } from './engine.middleware.js';
import { logger } from '../../../utils/logger.js';
import { jwtHash, JWTPayload } from '../../../utils/jwt.js';

const log = logger('Passport');

export interface UserRequest extends EngineRequest {
	user: User;
	client: string;
	jwt: boolean;
	jwth?: string;
	params: any;
}

function passPortAuth(name: string, next: express.NextFunction, req: UserRequest, jwth: string, res: express.Response) {
	const result: express.RequestHandler = passport.authenticate(name, { session: false }, (error?: unknown, user?: User, info?: Error | { client: string }) => {
		if (error) {
			log.error(error);
			next();
			return;
		}
		if (info instanceof Error || !user) {
			next();
			return;
		}
		req.engine.session.isRevoked(jwth)
			.then(revoked => {
				if (!revoked) {
					req.jwt = !!user;
					req.jwth = jwth;
					req.client = info?.client ?? 'unknown';
					req.user = user;
				}
				next();
				req.engine.rateLimit.loginSlowDownReset(req)
					.catch((error: unknown) => {
						log.error(error);
					});
			})
			.catch((error: unknown) => {
				log.error(error);
				next(error);
			});
	});
	void result(req, res, next);
}

export function usePassPortMiddleWare(router: express.Router, engine: EngineService): express.RequestHandler {
	router.use(passport.initialize());
	router.use(passport.session());
	passport.serializeUser((user: User | undefined, done) => {
		done(undefined, user?.id ?? '_invalid_');
	});
	passport.deserializeUser((id: string, done) => {
		engine.user.findByID(engine.orm.fork(), id)
			.then(user => {
				done(undefined, user);
			})
			.catch(done);
	});

	passport.use('local', new passportLocal.Strategy(
		{ usernameField: 'username', passwordField: 'password' },
		(username, password, done) => {
			engine.user.auth(engine.orm.fork(), username, password)
				.then((user: User | undefined) => {
					done(undefined, user ?? false);
				})
				.catch(done);
		}
	));
	const resolvePayload = (jwtPayload: JWTPayload, done: passportJWT.VerifiedCallback): void => {
		engine.user.authJWT(engine.orm.fork(), jwtPayload)
			.then(user => {
				done(undefined, user ?? false, jwtPayload);
			})
			.catch(done);
	};
	passport.use('jwt-header', new passportJWT.Strategy({
		jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: engine.config.env.jwt.secret,
		algorithms: ['HS256']
	}, resolvePayload));

	function jwtAuthMiddleware(req: UserRequest, res: express.Response, next: express.NextFunction): void {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (req.user) {
			next();
			return;
		}
		let name = '';
		let token: string | undefined = req.header('Authorization');
		if (token) {
			token = token.slice(7); // Bearer xyz
			name = 'jwt-header';
		}
		if (!token || !name) {
			// no or not valid auth token, go to next login method (request will fail eventually if req.user is not set)
			next();
			return;
		}
		const jwth = jwtHash(token);
		req.engine.rateLimit.loginSlowDown(req, res)
			.then(handled => {
				if (!handled) {
					passPortAuth(name, next, req, jwth, res);
				}
			})
			.catch((error: unknown) => {
				log.error(error);
				next(error);
			});
	}

	return (jwtAuthMiddleware as express.RequestHandler);
}
