import express from 'express';
import {logger} from '../../../utils/logger';

const log = logger('Jam.Api');

export function useLogMiddleware(): express.RequestHandler {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
		// log all requests
		log.info(`${req.method} ${req.originalUrl}`);
		next();
	};
}
