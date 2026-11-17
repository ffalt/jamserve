import { RequestFilteringHttpAgent, RequestFilteringHttpsAgent } from 'request-filtering-agent';

const KEEP_ALIVE_IDLE_MS = 10_000;
const MAX_SOCKETS_PER_HOST = 8;

const httpAgent = new RequestFilteringHttpAgent({ keepAlive: true, timeout: KEEP_ALIVE_IDLE_MS, maxSockets: MAX_SOCKETS_PER_HOST });
const httpsAgent = new RequestFilteringHttpsAgent({ keepAlive: true, timeout: KEEP_ALIVE_IDLE_MS, maxSockets: MAX_SOCKETS_PER_HOST });

export function filteringAgent(parsedUrl: URL): RequestFilteringHttpAgent | RequestFilteringHttpsAgent {
	return parsedUrl.protocol === 'https:' ? httpsAgent : httpAgent;
}
