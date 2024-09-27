import express from 'express';
import {ApiError} from '../deco/express/express-error.js';
import {ApiBaseResponder} from '../deco/express/express-responder.js';

export class ApiResponder extends ApiBaseResponder {

	sendData(req: express.Request, res: express.Response, data: unknown): void {
		this.sendJSON(req, res, data);
	}

	sendOK(req: express.Request, res: express.Response): void {
		res.status(200).json({ok: true});
	}

	sendError(req: express.Request, res: express.Response, err: string | Error | ApiError): void {
		let failCode = 0;
		let message: string = '';
		if (typeof err === 'string') {
			message = err;
		} else if (err instanceof ApiError) {
			failCode = err.failCode;
			message = err.message;
		} else if (err instanceof Error) {
			message = err.message;
		}
		this.sendErrorMsg(req, res, failCode || 500, message || 'Guru Meditation');
	}

	sendErrorMsg(req: express.Request, res: express.Response, code: number, msg: string): void {
		res.status(code).json({error: msg});
	}
}
