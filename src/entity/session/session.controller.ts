import {Session} from './session.model';
import {ConfigService} from '../../modules/engine/services/config.service';
import {Inject, InRequestScope} from 'typescript-ioc';
import {BodyParam, Controller, Ctx, CurrentUser, Get, Post} from '../../modules/rest/decorators';
import {User} from '../user/user';
import {SessionUser} from './session-user.model';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version';
import {UserSession} from '../settings/user-session.model';
import {UserRole} from '../../types/enums';
import {TransformService} from '../../modules/engine/services/transform.service';
import {Context} from '../../modules/engine/rest/context';
import { EngineRequest } from '../../modules/server/middlewares/engine.middleware';

@InRequestScope
@Controller('/session', {tags: ['Access']})
export class SessionController {
	@Inject
	private configService!: ConfigService;
	@Inject
	private transform!: TransformService;
	// @Inject
	// private sessionService!: SessionService;

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
	async list(
		@Ctx() {orm, req, user}: Context
	): Promise<Array<UserSession>> {
		const sessions = await (req as EngineRequest).engine.sessionService.byUserID(user.id);
		return sessions.map(session => this.transform.userSession(orm, session));
	}

	@Post(
		'/remove',
		{roles: [UserRole.stream], description: 'Remove a user session', summary: 'Remove Session'}
	)
	async remove(
		@BodyParam('id', {description: 'User Session Id', isID: true}) id: string,
		@Ctx() {orm, req, user}: Context
	): Promise<void> {
		await (req as EngineRequest).engine.sessionService.removeUserSession(id, user.id);
	}
}
