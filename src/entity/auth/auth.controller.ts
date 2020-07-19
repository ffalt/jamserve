import {Session} from '../session/session.model';
import {ConfigService} from '../../modules/engine/services/config.service';
import {Inject} from 'typescript-ioc';
import {BodyParams, Controller, Ctx, Post} from '../../modules/rest';
import passport from 'passport';
import {generateJWT, jwtHash} from '../../utils/jwt';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version';
import {Context} from '../../modules/server/middlewares/rest.context';
import {CredentialsArgs} from './auth.args';
import {UserRole} from '../../types/enums';
import {logger} from '../../utils/logger';

const log = logger('AuthController');

@Controller('/auth', {tags: ['Access']})
export class AuthController {
	@Inject
	private configService!: ConfigService;

	@Post('/login', () => Session, {description: 'Start session or jwt access', summary: 'Login'})
	async login(@BodyParams() credentials: CredentialsArgs, @Ctx() context: Context): Promise<Session> {
		return new Promise<Session>((resolve, reject) => {
			passport.authenticate('local', (err, user) => {
				if (err || !user) {
					log.error(err);
					return reject(new Error('Invalid Auth'));
				}
				context.req.login(user, (err2: Error) => {
					if (err2) {
						log.error(err2);
						reject(new Error('Invalid Auth'));
					}
					const client = context.req.body.client || 'Unknown Client';
					// context.req.client = client;
					const token = credentials.jwt ? generateJWT(user.id, client,
						this.configService.env.jwt.secret,
						this.configService.env.jwt.maxAge
					) : undefined;
					if (context.req.session) { // express session data obj
						context.req.session.client = client;
						context.req.session.userAgent = context.req.headers['user-agent'] || client;
						if (token) {
							context.req.session.jwth = jwtHash(token);
						}
					}
					resolve({
						allowedCookieDomains: this.configService.env.session.allowedCookieDomains,
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
			})(context.req, context.res, context.next);
		});
	}

	@Post('/logout', {roles: [UserRole.stream], description: 'End session or jwt access', summary: 'Logout'})
	logout(@Ctx() {req}: Context): void {
		req.logout();
	}
}
