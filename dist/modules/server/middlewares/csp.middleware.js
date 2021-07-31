import helmet from 'helmet';
export function useCSPMiddleware() {
    const self = `'self'`;
    const none = '\'none\'';
    return helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [none],
            scriptSrc: [self],
            baseUri: [self],
            manifestSrc: [self],
            formAction: [self],
            mediaSrc: [self, 'data:'],
            frameSrc: [self],
            styleSrc: [self, `https: 'unsafe-inline'`],
            childSrc: [self],
            connectSrc: [self,
                'https://en.wikipedia.org',
                'https://commons.wikimedia.org'
            ],
            imgSrc: [
                self,
                'data:',
                'https://gpodder.net',
                'https://coverartarchive.org'
            ],
            frameAncestors: [none],
            objectSrc: [none],
            workerSrc: [self],
            fontSrc: [self, 'data:'],
            reportUri: '/csp/report-violation'
        },
    });
}
//# sourceMappingURL=csp.middleware.js.map