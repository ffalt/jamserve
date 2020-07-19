import express from 'express';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import passport from 'passport';
import {EngineService} from '../../engine/services/engine.service';
import {User} from '../../../entity/user/user';
import {EngineRequest} from './engine.middleware';
import {hashMD5} from '../../../utils/hash';
import {logger} from '../../../utils/logger';

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
	passport.serializeUser((user: User, done) => {
		done(null, user?.id || '_invalid_');
	});
	passport.deserializeUser((id: string, done) => {
		engine.userService.findByID(id).then(user => done(null, user ? user : false)).catch(done);
	});

	passport.use('local', new passportLocal.Strategy(
		{usernameField: 'username', passwordField: 'password'},
		(username, password, done) => {
			engine.userService.auth(username, password).then(user => done(null, user ? user : false)).catch(done);
		}
	));
	const resolvePayload = (jwtPayload: any, done: passportJWT.VerifiedCallback): void => {
		engine.userService.findByID(jwtPayload.id)
			.then(user => done(null, user ? user : false, jwtPayload))
			.catch(done);
	};
	passport.use('jwt-header', new passportJWT.Strategy({
			jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: engine.configService.env.jwt.secret
		}, resolvePayload
	));
	passport.use('jwt-parameter', new passportJWT.Strategy({
			jwtFromRequest: passportJWT.ExtractJwt.fromUrlQueryParameter('bearer'),
			secretOrKey: engine.configService.env.jwt.secret
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

	return (jwtAuthMiddleware as express.RequestHandler);
}
