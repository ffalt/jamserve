import express from 'express';
import { logger } from '../../../utils/logger.js';

const log = logger('Api');

export function useLogMiddleware(): express.RequestHandler {
	return (req: express.Request, _res: express.Response, next: express.NextFunction): void => {
		// log all requests
		let info = '';
		if (req.originalUrl === '/graphql') {
			const query = `${req.body?.query}`.slice(0, 50);
			info = query.slice(0, query.indexOf('{'));
		}
		log.access(`${req.ip} ${req.method} ${req.originalUrl} ${info}`);
		next();
	};
}
