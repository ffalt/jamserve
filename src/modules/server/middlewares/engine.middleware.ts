import {EngineService} from '../../engine/services/engine.service.js';
import express from 'express';
import {Orm} from '../../engine/services/orm.service.js';

export interface EngineRequest extends express.Request {
	engine: EngineService;
	orm: Orm;
}

export function useEngineMiddleware(engine: EngineService): express.RequestHandler {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
		(req as EngineRequest).engine = engine;
		(req as EngineRequest).orm = engine.orm.fork();
		next();
	};
}
