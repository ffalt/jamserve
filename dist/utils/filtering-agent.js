import { RequestFilteringHttpAgent, RequestFilteringHttpsAgent } from 'request-filtering-agent';
const KEEP_ALIVE_IDLE_MS = 10000;
const MAX_SOCKETS_PER_HOST = 8;
const httpAgent = new RequestFilteringHttpAgent({ keepAlive: true, timeout: KEEP_ALIVE_IDLE_MS, maxSockets: MAX_SOCKETS_PER_HOST });
const httpsAgent = new RequestFilteringHttpsAgent({ keepAlive: true, timeout: KEEP_ALIVE_IDLE_MS, maxSockets: MAX_SOCKETS_PER_HOST });
export function filteringAgent(parsedUrl) {
    return parsedUrl.protocol === 'https:' ? httpsAgent : httpAgent;
}
//# sourceMappingURL=filtering-agent.js.map