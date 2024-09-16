import {Session} from '../session/session.model.js';
import {BodyParams, Controller, Ctx, Post, UnauthError} from '../../modules/rest/index.js';
import passport from 'passport';
import {generateJWT, jwtHash} from '../../utils/jwt.js';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version.js';
import {CredentialsArgs} from './auth.args.js';
import {UserRole} from '../../types/enums.js';
import {logger} from '../../utils/logger.js';
import {Context} from '../../modules/engine/rest/context.js';
import {User} from '../user/user.js';
import {EngineService} from '../../modules/engine/services/engine.service.js';
import express from 'express';
import {SessionData} from '../../types/express.js';

const log = logger('AuthController');

@Controller('/auth', {tags: ['Access']})
export class AuthController {

	private async loginUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<User> {
		return new Promise<User>((resolve, reject) => {
			passport.authenticate('local', (err: Error, user: User) => {
				if (err || !user) {
					log.error(err);
					return reject(UnauthError('Invalid Auth'));
				}
				req.login(user, (err2: Error) => {
					if (err2) {
						log.error(err2);
						console.error(err2);
						return reject(UnauthError('Invalid Auth'));
					}
					resolve(user);
				});
			})(req, res, next);
		});
	}

	private async authenticate(credentials: CredentialsArgs, req: express.Request, res: express.Response, next: express.NextFunction, engine: EngineService): Promise<Session> {
		const user = await this.loginUser(req, res, next);
		await engine.rateLimit.loginSlowDownReset(req);
		return AuthController.buildSessionResult(req, credentials, user, engine);
	}


	@Post('/login', () => Session, {description: 'Start session or jwt access', summary: 'Login'})
	async login(
		@BodyParams() credentials: CredentialsArgs,
		@Ctx() {engine, req, res, next}: Context
	): Promise<Session> {
		return new Promise<Session>((resolve, reject) => {
			engine.rateLimit.loginSlowDown(req, res)
				.then(handled => {
					if (!handled) {
						this.authenticate(credentials, req, res, next, engine)
							.then(session => {
								resolve(session);
							})
							.catch(e => {
								reject(e);
							});
					}
				})
				.catch(e => {
					reject(e);
				});
		});
	}

	private static buildSessionResult(req: express.Request, credentials: CredentialsArgs, user: User, engine: EngineService): Session {
		const client = req.body.client || 'Unknown Client';
		// context.req.client = client;
		const token = credentials.jwt ? generateJWT(user.id, client,
			engine.config.env.jwt.secret,
			engine.config.env.jwt.maxAge
		) : undefined;
		if (req.session) { // express session data obj
			const session: SessionData = req.session as any;
			session.client = client;
			session.userAgent = req.headers['user-agent'] || client;
			if (token) {
				session.jwth = jwtHash(token);
			}
		}
		return {
			allowedCookieDomains: engine.config.env.session.allowedCookieDomains,
			version: JAMAPI_VERSION,
			jwt: token,
			user: {
				id: user.id,
				name: user.name,
				roles: {
					admin: user.roleAdmin,
					podcast: user.rolePodcast,
					stream: user.roleStream,
					upload: user.roleUpload
				}
			}
		};
	}

	@Post('/logout', {roles: [UserRole.stream], description: 'End session or jwt access', summary: 'Logout'})
	async logout(@Ctx() {req}: Context): Promise<void> {
		return new Promise<void>(resolve => {
			req.logout(resolve);
		});
	}
}
