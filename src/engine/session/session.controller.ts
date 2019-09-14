import {JamRequest} from '../../api/jam/api';
import {JAMAPI_VERSION} from '../../api/jam/version';
import {Config} from '../../config';
import {Jam} from '../../model/jam-rest-data';
import {formatSessionUser} from '../user/user.format';
import {formatSession} from './session.format';
import {SessionService} from './session.service';

export class SessionController {

	constructor(public sessionService: SessionService, private config: Config) {
	}

	async ping(req: JamRequest<{}>): Promise<Jam.Ping> {
		return {version: JAMAPI_VERSION};
	}

	async session(req: JamRequest<{}>): Promise<Jam.Session> {
		return {version: JAMAPI_VERSION, allowedCookieDomains: this.config.server.session.allowedCookieDomains, user: req.user ? formatSessionUser(req.user) : undefined};
	}

	async sessions(req: JamRequest<{}>): Promise<Array<Jam.UserSession>> {
		const sessions = await this.sessionService.byUserID(req.user.id);
		return sessions.map(formatSession);
	}

}
