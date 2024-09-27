import {Session} from './session.model.js';
import {SessionUser} from './session-user.model.js';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version.js';
import {UserSession} from './user-session.model.js';
import {UserRole} from '../../types/enums.js';
import {Context} from '../../modules/engine/rest/context.js';
import {Controller} from '../../modules/rest/decorators/Controller.js';
import {Get} from '../../modules/rest/decorators/Get.js';
import {Ctx} from '../../modules/rest/decorators/Ctx.js';
import {Post} from '../../modules/rest/decorators/Post.js';
import {BodyParam} from '../../modules/rest/decorators/BodyParam.js';

@Controller('/session', {tags: ['Access']})
export class SessionController {

	@Get(() => Session, {description: 'Check the Login State', summary: 'Check Session'})
	session(@Ctx() {engine, user}: Context): Session {
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
			allowedCookieDomains: engine.config.env.session.allowedCookieDomains,
			version: JAMAPI_VERSION,
			user: sessionUser
		};
	}

	@Get('/list', () => [UserSession],
		{roles: [UserRole.stream], description: 'Get a list of all sessions of the current user', summary: 'Get Sessions'})
	async list(
		@Ctx() {orm, engine, user}: Context
	): Promise<Array<UserSession>> {
		const sessions = await engine.session.byUserID(user.id);
		return sessions.map(session => engine.transform.Session.userSession(orm, session));
	}

	@Post(
		'/remove',
		{roles: [UserRole.stream], description: 'Remove a user session', summary: 'Remove Session'}
	)
	async remove(
		@BodyParam('id', {description: 'User Session Id', isID: true}) id: string,
		@Ctx() {engine, user}: Context
	): Promise<void> {
		await engine.session.removeUserSession(id, user.id);
	}
}
