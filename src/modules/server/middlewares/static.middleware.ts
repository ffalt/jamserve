import path from 'node:path';
import express from 'express';
import { ConfigService } from '../../engine/services/config.service.js';
import RateLimit from 'express-rate-limit';

export function staticMiddleware(configService: ConfigService): express.Router {
	const router = express.Router();

	router.use(RateLimit(configService.rateLimits.frontend));

	// frontend (jamberry domain config file)
	const jamberry_config = `document.jamberry_config = ${JSON.stringify({ name: 'Jam', fixed: { server: configService.env.domain } })}`;
	router.get('/assets/config/config.js', (req, res) => {
		res.type('text/javascript');
		res.send(jamberry_config);
	});

	// frontend (any)
	const indexHTML = path.resolve(configService.env.paths.frontend, 'index.html');
	const favicon = path.resolve('./static/api-docs/favicon.ico');
	router.get('/', (_req, res) => res.sendFile(indexHTML));
	router.get('/index.html', (_req, res) => res.sendFile(indexHTML));
	router.get('/*splat', express.static(path.resolve(configService.env.paths.frontend)));
	router.get('/favicon.ico', (_req, res) => res.sendFile(favicon));
	router.get('{*splat}', (_req, res) => res.sendFile(indexHTML));
	return router;
}
