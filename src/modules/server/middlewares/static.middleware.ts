import path from 'path';
import express from 'express';
import { ConfigService } from '../../engine/services/config.service.js';
import RateLimit from 'express-rate-limit';

export function useStaticMiddleware(app: express.Application, configService: ConfigService): express.Router {
	const router = express.Router();

	const limiter = RateLimit({
		windowMs: 10 * 60 * 1000, // 10 minutes
		limit: 1000 // max 1000 requests per windowMs
	});

	router.use(limiter);

	// frontend (jamberry domain config file)
	const jamberry_config = `document.jamberry_config = ${JSON.stringify({ name: 'Jam', fixed: { server: configService.env.domain } })}`;
	router.get('/assets/config/config.js', (req, res) => {
		res.type('text/javascript');
		res.send(jamberry_config);
	});
	// frontend (any)
	const indexHTML = path.resolve(configService.env.paths.frontend, 'index.html');
	const favicon = path.resolve('./static/api-docs/favicon.ico');
	router.get('/favicon.ico', (_req, res) => res.sendFile(favicon));
	router.get('/', (_req, res) => res.sendFile(indexHTML));
	router.get('/index.html', (_req, res) => res.sendFile(indexHTML));
	router.get('/*', express.static(path.resolve(configService.env.paths.frontend)));
	router.get('*', (_req, res) => res.sendFile(indexHTML));

	app.use(router);

	return router;
}
