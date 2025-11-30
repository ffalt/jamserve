import { Session } from './session.js';
import { useragent, AgentDetails } from 'express-useragent';

export function parseAgent(session: Session): AgentDetails | undefined {
	try {
		return useragent.parse(session.agent);
	} catch {
		//
	}
	return;
}
