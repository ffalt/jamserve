import {JamRequest} from '../../api/jam/api';
import {NotFoundError} from '../../api/jam/error';
import {JAMAPI_VERSION} from '../../api/jam/version';
import {Config} from '../../config';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
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

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const session = await this.sessionService.byID(req.query.id);
		if (session && session.userID !== req.user.id) {
			if (!req.user.roles.admin) {
				return Promise.reject(NotFoundError());
			}
		}
		if (!session) {
			return Promise.reject(NotFoundError());
		}
		await this.sessionService.remove(session.sessionID);
		await this.sessionService.clearCache();
	}
}
