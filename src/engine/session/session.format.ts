import {Jam} from '../../model/jam-rest-data';
import {Session} from './session.model';

const useragent = require('express-useragent');

export function formatSession(session: Session): Jam.UserSession {
	const ua = useragent.parse(session.agent);
	console.log(ua);

	const userAgent: any = {}; // parseUserAgent(session.agent);
	return {
		id: session.id,
		client: session.client,
		expires: session.expires,
		agent: userAgent.agent,
		os: userAgent.os
	};
}
