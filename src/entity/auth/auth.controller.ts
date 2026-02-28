import { Session } from '../session/session.model.js';
import passport from 'passport';
import { generateJWT, jwtHash } from '../../utils/jwt.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
import { CredentialsParameters } from './auth.parameters.js';
import { UserRole } from '../../types/enums.js';
import { logger } from '../../utils/logger.js';
import { Context } from '../../modules/engine/rest/context.js';
import { User } from '../user/user.js';
import { EngineService } from '../../modules/engine/services/engine.service.js';
import express from 'express';
import { SessionData } from '../../types/express.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { unauthError } from '../../modules/deco/express/express-error.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';

const log = logger('AuthController');

@Controller('/auth', { tags: ['Access'] })
export class AuthController {
	private async loginUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<User> {
		return new Promise<User>((resolve, reject) => {
			const result: express.RequestHandler = passport.authenticate('local', (error?: unknown, user?: User) => {
				if (error || !user) {
					if (error) {
						log.error(error);
					}
					log.error(`Login failed for [${req.ip}]`);
					reject(unauthError('Invalid Auth'));
					return;
				}
				req.login(user, (loginError?: unknown) => {
					if (loginError) {
						log.error(loginError);
						log.error(`Login failed for [${req.ip}]`);
						reject(unauthError('Invalid Auth'));
						return;
					}
					resolve(user);
				});
			});
			void result(req, res, next);
		});
	}

	private async authenticate(credentials: CredentialsParameters, req: express.Request, res: express.Response, next: express.NextFunction, engine: EngineService): Promise<Session> {
		const user = await this.loginUser(req, res, next);
		await engine.rateLimit.loginSlowDownReset(req);
		return AuthController.buildSessionResult(req, credentials, user, engine);
	}

	@Post('/login', () => Session, { description: 'Start session or jwt access', summary: 'Login' })
	async login(
		@BodyParameters() credentials: CredentialsParameters,
		@RestContext() { engine, req, res, next }: Context
	): Promise<Session> {
		return new Promise<Session>((resolve, reject) => {
			engine.rateLimit.loginSlowDown(req, res)
				.then(handled => {
					if (handled) {
						reject(unauthError('Rate limited'));
					} else {
						this.authenticate(credentials, req, res, next, engine)
							.then(session => {
								resolve(session);
							})
							.catch((error: unknown) => {
								reject(error);
							});
					}
				})
				.catch((error: unknown) => {
					reject(error);
				});
		});
	}

	private static readonly MAX_CLIENT_LENGTH = 128;

	private static buildSessionResult(req: express.Request, credentials: CredentialsParameters, user: User, engine: EngineService): Session {
		const rawClient: unknown = req.body?.client;
		const client: string = (typeof rawClient === 'string' ? rawClient.trim().slice(0, AuthController.MAX_CLIENT_LENGTH) : '') || 'Unknown Client';
		const token = credentials.jwt ? generateJWT(user.id, client, engine.config.env.jwt.secret, engine.config.env.jwt.maxAge) : undefined;
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (req.session) { // express session data obj
			const session: SessionData = req.session as any;
			session.client = client;
			session.userAgent = req.headers['user-agent'] ?? client;
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

	@Post('/logout', { roles: [UserRole.stream], description: 'End session or jwt access', summary: 'Logout' })
	async logout(@RestContext() { req, engine }: Context): Promise<void> {
		// Revoke the JWT token from the session store if this was a JWT-authenticated request
		const jwth: string | undefined = (req as any).jwth;
		if (jwth) {
			await engine.session.removeByJwth(jwth);
		}
		return new Promise<void>(resolve => {
			req.logout(resolve);
		});
	}
}
