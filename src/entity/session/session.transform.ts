import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Session as ORMSession } from './session.js';
import { UserSession } from './user-session.model.js';
import { parseAgent } from './session.utils.js';

@InRequestScope
export class SessionTransformService {
	userSession(orm: Orm, o: ORMSession): UserSession {
		const ua = parseAgent(o);
		return {
			id: o.id,
			client: o.client,
			expires: o.expires ? o.expires.valueOf() : undefined,
			mode: o.mode,
			platform: ua?.platform,
			os: ua?.os,
			agent: o.agent
		};
	}
}
