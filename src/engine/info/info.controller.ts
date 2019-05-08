import {JamRequest} from '../../api/jam/api';
import {Config} from '../../config';
import {Jam} from '../../model/jam-rest-data';
import {JAMAPI_VERSION} from '../../version';
import {formatSessionUser} from '../user/user.format';

export class InfoController {

	constructor(private config: Config) {

	}

	async ping(req: JamRequest<{}>): Promise<Jam.Ping> {
		return {version: JAMAPI_VERSION};
	}

	async session(req: JamRequest<{}>): Promise<Jam.Session> {
		return {version: JAMAPI_VERSION, allowedCookieDomains: this.config.server.session.allowedCookieDomains, user: req.user ? formatSessionUser(req.user) : undefined};
	}
}
