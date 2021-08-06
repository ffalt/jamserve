import cors from 'cors';
import express from 'express';
import {ConfigService} from '../../engine/services/config.service';

/*
export function registerPublicCORS(_: express.Router): express.RequestHandler {
	return cors({
		preflightContinue: false,
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
		origin: true,
		methods: ['GET', 'POST']
	});
}
*/
export function useAuthenticatedCors(configService: ConfigService): express.RequestHandler {
	const origins = configService.env.session.allowedCookieDomains || [];

	const corsOptionsDelegate = (req: express.Request, callback: (err: Error | null, options: cors.CorsOptions) => void): void => {
		const corsOptions: cors.CorsOptions = {
			preflightContinue: false,
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
			origin(origin, cb): void {
				if (!origin || origins.includes(origin)) {
					cb(null, true);
				} else {
					if (req.method === 'OPTIONS' || req.query.jwt) {
						cb(null, true);
					} else {
						cb(new Error('Not allowed by CORS'));
					}
				}
			},
			methods: ['GET', 'POST']
		};
		callback(null, corsOptions); // callback expects two parameters: error and options
	};
	return cors(corsOptionsDelegate);
}
