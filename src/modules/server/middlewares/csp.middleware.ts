import express from 'express';
import helmet from 'helmet';

export const CSP = {
	self: `'self'`,
	none: `'none'`,
	data: `data:`,
	blob: `blob:`,
	https: `https:`,
	wss: `wss:`,
	unsafeInline: `'unsafe-inline'`
};

type CSPDirectives = Record<string, Array<string> | string>;

const sharedDirectives: CSPDirectives = {
	scriptSrc: [CSP.self],
	baseUri: [CSP.self],
	formAction: [CSP.self],
	fontSrc: [CSP.self, CSP.data],
	objectSrc: [CSP.none],
	frameAncestors: [CSP.none],
	upgradeInsecureRequests: [],
	reportUri: '/csp/report-violation'
};

export function buildCSPMiddleware(overrides: CSPDirectives): express.RequestHandler {
	return helmet.contentSecurityPolicy({ directives: { ...sharedDirectives, ...overrides } });
}

export function useCSPMiddleware(): express.RequestHandler {
	return buildCSPMiddleware({
		defaultSrc: [CSP.none],
		styleSrc: [CSP.self, CSP.https, CSP.unsafeInline],
		imgSrc: [CSP.self, CSP.data, 'https://gpodder.net', 'https://coverartarchive.org'],
		mediaSrc: [CSP.self, CSP.data],
		connectSrc: [CSP.self, 'https://en.wikipedia.org', 'https://commons.wikimedia.org'],
		childSrc: [CSP.self],
		frameSrc: [CSP.self],
		manifestSrc: [CSP.self],
		workerSrc: [CSP.self]
	});
}
