import path from 'path';
import express from 'express';
import { ConfigService } from '../../engine/services/config.service.js';

export function useStaticMiddleware(app: express.Application, configService: ConfigService) {
	// frontend (jamberry domain config file)
	const jamberry_config = `document.jamberry_config = ${JSON.stringify({ name: 'Jam', fixed: { server: configService.env.domain } })}`;
	app.get('/assets/config/config.js', (req, res) => {
		res.type('text/javascript');
		res.send(jamberry_config);
	});
	// frontend (any)
	const indexHTML = path.resolve(configService.env.paths.frontend, 'index.html');
	const favicon = path.resolve('./static/api-docs/favicon.ico');
	app.get('/favicon.ico', (_req, res) => res.sendFile(favicon));
	app.get('/', (_req, res) => res.sendFile(indexHTML));
	app.get('/index.html', (_req, res) => res.sendFile(indexHTML));
	app.get('/*', express.static(path.resolve(configService.env.paths.frontend)));
	app.get('*', (_req, res) => res.sendFile(indexHTML));
}
