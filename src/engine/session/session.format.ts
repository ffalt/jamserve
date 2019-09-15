import useragent from 'express-useragent';
import {Jam} from '../../model/jam-rest-data';
import {Session} from './session.model';

export function parseAgent(session: Session): useragent.UserAgent | undefined {
	try {
		return useragent.parse(session.agent);
	} catch (e) {
		//
	}
}

export function formatSession(session: Session): Jam.UserSession {
	const ua = parseAgent(session);
	return {
		id: session.id,
		client: session.client,
		expires: session.expires,
		agent: ua ? ua.browser : undefined,
		os: ua ? ua.os : undefined,
		platform: ua ? ua.platform : undefined
	};
}
