import {Session} from '../session/session.model';
import {BodyParams, Controller, Ctx, Post, UnauthError} from '../../modules/rest';
import passport from 'passport';
import {generateJWT, jwtHash} from '../../utils/jwt';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version';
import {CredentialsArgs} from './auth.args';
import {UserRole} from '../../types/enums';
import {logger} from '../../utils/logger';
import {Context} from '../../modules/engine/rest/context';

const log = logger('AuthController');

@Controller('/auth', {tags: ['Access']})
export class AuthController {
	@Post('/login', () => Session, {description: 'Start session or jwt access', summary: 'Login'})
	async login(
		@BodyParams() credentials: CredentialsArgs,
		@Ctx() {engine, req, res, next}: Context
	): Promise<Session> {
		return new Promise<Session>((resolve, reject) => {
			passport.authenticate('local', (err, user) => {
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
					const client = req.body.client || 'Unknown Client';
					// context.req.client = client;
					const token = credentials.jwt ? generateJWT(user.id, client,
						engine.config.env.jwt.secret,
						engine.config.env.jwt.maxAge
					) : undefined;
					if (req.session) { // express session data obj
						req.session.client = client;
						req.session.userAgent = req.headers['user-agent'] || client;
						if (token) {
							req.session.jwth = jwtHash(token);
						}
					}
					resolve({
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
					});
				});
			})(req, res, next);
		});
	}

	@Post('/logout', {roles: [UserRole.stream], description: 'End session or jwt access', summary: 'Logout'})
	logout(@Ctx() {req}: Context): void {
		req.logout();
	}
}
