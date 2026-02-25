import express from 'express';
import { ApiError } from '../deco/express/express-error.js';
import { ApiBaseResponder } from '../deco/express/express-responder.js';
import { errorToString } from '../../utils/error.js';

export class ApiResponder extends ApiBaseResponder {
	sendData(req: express.Request, res: express.Response, data: unknown): void {
		this.sendJSON(req, res, data);
	}

	sendOK(_req: express.Request, res: express.Response): void {
		res.status(200).json({ ok: true });
	}

	sendError(req: express.Request, res: express.Response, error: unknown): void {
		let failCode = 0;
		let message: string;
		if (error instanceof ApiError) {
			failCode = error.failCode;
			message = error.message;
		} else {
			message = errorToString(error);
		}
		this.sendErrorMsg(req, res, failCode || 500, message || 'Guru Meditation');
	}

	sendErrorMsg(_req: express.Request, res: express.Response, code: number, message: string): void {
		res.status(code).json({ error: message });
	}
}
