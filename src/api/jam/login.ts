import express from 'express';
import {Engine} from '../../engine/engine';
import {User} from '../../engine/user/user.model';
import {ApiBaseResponder} from '../response';
import {EngineRequest} from '../server';
import {Errors} from './error';

/**
 * Fill user into req.user express requests
 */
export interface UserRequest extends EngineRequest {
	user: User;
	client: string;
	jwt: boolean;
	jwth?: string;
	params: any;
}

function CheckAuthMiddleWare(req: UserRequest, res: express.Response, next: express.NextFunction): void {
	if (!req.client && req.session && req.session.client) {
		req.client = req.session.client;
	}
	if (req.user) {
		return next();
	}
	ApiBaseResponder.sendErrorMsg(res, 401, Errors.unauthorized);
}

export function registerAuthentication(router: express.Router, engine: Engine): void {
	router.use(CheckAuthMiddleWare as express.RequestHandler);
}
