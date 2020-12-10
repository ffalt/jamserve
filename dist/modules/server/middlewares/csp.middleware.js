"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCSPMiddleware = void 0;
const helmet_1 = __importDefault(require("helmet"));
function useCSPMiddleware() {
    const self = `'self'`;
    const none = '\'none\'';
    return helmet_1.default.contentSecurityPolicy({
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
exports.useCSPMiddleware = useCSPMiddleware;
//# sourceMappingURL=csp.middleware.js.map