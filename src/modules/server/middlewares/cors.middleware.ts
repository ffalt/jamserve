import cors from 'cors';
import express from 'express';
import { ConfigService } from '../../engine/services/config.service.js';

export function useAuthenticatedCors(configService: ConfigService): express.RequestHandler {
	const origins = configService.env.session.allowedCookieDomains ?? [];

	const corsOptionsDelegate = (_req: express.Request, callback: (error: Error | null, options: cors.CorsOptions) => void): void => {
		const corsOptions: cors.CorsOptions = {
			preflightContinue: false,
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
			origin(origin, originCallback): void {
				if (!origin || origins.includes(origin)) {
					originCallback(null, true);
				} else {
					// Reject all other origins, including preflight requests from unauthorized domains
					originCallback(new Error('Not allowed by CORS'));
				}
			},
			methods: ['GET', 'POST']
		};
		callback(null, corsOptions); // callback expects two parameters: error and options
	};
	return cors(corsOptionsDelegate);
}
