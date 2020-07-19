import {Session} from './session.model';
import {ConfigService} from '../../modules/engine/services/config.service';
import {Inject} from 'typescript-ioc';
import {BodyParam, Controller, CurrentUser, Get, Post} from '../../modules/rest/decorators';
import {User} from '../user/user';
import {SessionUser} from './session-user.model';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version';
import {UserSession} from '../settings/user-session.model';
import {UserRole} from '../../types/enums';
import {SessionService} from '../settings/session.service';
import {TransformService} from '../../modules/engine/services/transform.service';

@Controller('/session', {tags: ['Access']})
export class SessionController {
	@Inject
	private configService!: ConfigService;
	@Inject
	private sessionService!: SessionService;
	@Inject
	private transform!: TransformService;

	@Get(() => Session, {description: 'Check the Login State', summary: 'Check Session'})
	session(@CurrentUser() user?: User): Session {
		let sessionUser: SessionUser | undefined;
		if (user) {
			sessionUser = {
				id: user.id,
				name: user.name,
				roles: {
					admin: user.roleAdmin,
					podcast: user.rolePodcast,
					stream: user.roleStream,
					upload: user.roleUpload
				}
			};
		}
		return {
			allowedCookieDomains: this.configService.env.session.allowedCookieDomains,
			version: JAMAPI_VERSION,
			user: sessionUser
		};
	}

	@Get('/list', () => [UserSession],
		{roles: [UserRole.stream], description: 'Get a list of all sessions of the current user', summary: 'Get Sessions'})
	async list(@CurrentUser() user: User): Promise<Array<UserSession>> {
		const sessions = await this.sessionService.byUserID(user.id);
		return sessions.map(session => this.transform.userSession(session));
	}

	@Post(
		'/remove',
		{roles: [UserRole.stream], description: 'Remove a user session', summary: 'Remove Session'}
	)
	async remove(
		@BodyParam('id', {description: 'User Session Id', isID: true}) id: string,
		@CurrentUser() user: User
	): Promise<void> {
		await this.sessionService.removeUserSession(id, user.id);
	}
}
