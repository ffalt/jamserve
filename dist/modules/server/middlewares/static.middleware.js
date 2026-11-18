import path from 'node:path';
import express from 'express';
import { buildCSPMiddleware, CSP } from './csp.middleware.js';
import RateLimit from 'express-rate-limit';
const HASHED_ASSET = /-[A-Za-z0-9_-]{8}\.(?:js|mjs|css|woff2?|ttf|eot|svg)$/;
const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const REVALIDATE_CACHE = 'no-cache';
export function staticMiddleware(configService) {
    const router = express.Router();
    router.use(RateLimit(configService.rateLimits.frontend));
    router.use(buildCSPMiddleware({
        defaultSrc: [CSP.self],
        styleSrc: [CSP.self, CSP.unsafeInline],
        imgSrc: [CSP.self, CSP.data, CSP.blob, CSP.https],
        mediaSrc: [CSP.self, CSP.data, CSP.blob, CSP.https],
        connectSrc: [CSP.self, CSP.https, CSP.wss]
    }));
    const jamberry_config = `document.jamberry_config = ${JSON.stringify({ name: 'Jam', fixed: { server: configService.env.domain } })}`;
    router.get('/assets/config/config.js', (_req, res) => {
        res.type('text/javascript');
        res.setHeader('Cache-Control', REVALIDATE_CACHE);
        res.send(jamberry_config);
    });
    const frontendPath = path.resolve(configService.env.paths.frontend);
    const indexHTML = path.resolve(frontendPath, 'index.html');
    const favicon = path.resolve('./static/api-docs/favicon.ico');
    const isImmutableAsset = (filePath) => {
        const relative = path.relative(frontendPath, filePath);
        return !relative.startsWith(`assets${path.sep}`) && HASHED_ASSET.test(relative);
    };
    const sendIndexHTML = (res) => {
        res.setHeader('Cache-Control', REVALIDATE_CACHE);
        res.sendFile(indexHTML);
    };
    router.get('/', (_req, res) => {
        sendIndexHTML(res);
    });
    router.get('/index.html', (_req, res) => {
        sendIndexHTML(res);
    });
    router.get('/*splat', express.static(frontendPath, {
        setHeaders: (res, filePath) => {
            res.setHeader('Cache-Control', isImmutableAsset(filePath) ? IMMUTABLE_CACHE : REVALIDATE_CACHE);
        }
    }));
    router.get('/favicon.ico', (_req, res) => {
        res.sendFile(favicon);
    });
    router.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            next();
            return;
        }
        if (path.extname(req.path) || !req.accepts('html')) {
            res.status(404).end();
            return;
        }
        sendIndexHTML(res);
    });
    return router;
}
//# sourceMappingURL=static.middleware.js.map