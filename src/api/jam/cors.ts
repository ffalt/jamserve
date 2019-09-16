import cors from 'cors';
import express from 'express';
import {Engine} from '../../engine/engine';

export function registerPublicCORS(router: express.Router, engine: Engine): void {
	router.use(cors({
		preflightContinue: false,
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
		origin: true,
		methods: ['GET', 'POST']
	}));
}

export function registerAuthenticatedCors(router: express.Router, engine: Engine): void {
	const corsOptionsDelegate = (req: express.Request, callback: (err: Error | null, options: cors.CorsOptions) => void) => {
		const origins = engine.config.server.session.allowedCookieDomains || [];
		const corsOptions: cors.CorsOptions = {
			preflightContinue: false,
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
			origin(origin, cb): void {
				if (!origin || origins.includes(origin)) {
					cb(null, true);
				} else {
					if (req.method === 'OPTIONS' || req.jwt) {
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
	router.use(cors(corsOptionsDelegate));
}
