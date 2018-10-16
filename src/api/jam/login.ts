import express from 'express';
import {JamServe} from '../../model/jamserve';
import {EngineRequest} from '../server';

/**
 * Fill user into req.user express requests
 */
export interface UserRequest extends EngineRequest {
	user: JamServe.User;
	client: string;
	jwt: boolean;
}

export function CheckAuthMiddleWare(req: UserRequest, res: express.Response, next: express.NextFunction) {
	if (!req.client && req.session && req.session.client) {
		req.client = req.session.client;
	}
	if (req.user) {
		return next();
	}
	return res.status(401).json({error: 'Unauthorized'});
}
