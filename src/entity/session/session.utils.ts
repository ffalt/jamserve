import {Session} from './session.js';
import useragent from 'express-useragent';

export function parseAgent(session: Session): useragent.Details | undefined {
	try {
		return useragent.parse(session.agent);
	} catch {
		//
	}
	return;
}
