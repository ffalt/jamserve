import express from 'express';
import {logger} from '../../../utils/logger';

const log = logger('Api');

export function useLogMiddleware(): express.RequestHandler {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
		// log all requests
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		log.access(`${ip} ${req.method} ${req.originalUrl}`);
		next();
	};
}
