import {EngineService} from '../../engine/services/engine.service';
import express from 'express';

export interface EngineRequest extends express.Request {
	engine: EngineService;
}

export function useEngineMiddleware(engine: EngineService): express.RequestHandler {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
		(req as EngineRequest).engine = engine;
		next();
	}
}
