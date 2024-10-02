import express from 'express';
import path from 'path';
import { ApiError } from './express-error.js';

export interface StreamData {
	pipe(stream: express.Response): void;
}

export interface ApiBinaryResult {
	file?: { filename: string; name: string };
	json?: any;
	pipe?: StreamData;
	buffer?: {
		buffer: Buffer;
		contentType: string;
	};
	name?: string;
}

export class ApiBaseResponder {
	static sendOK(req: express.Request, res: express.Response): void {
		res.status(200).json({ ok: true });
	}

	static sendString(req: express.Request, res: express.Response, data: string): void {
		res.set('Content-Type', 'text/plain').status(200).send(data);
	}

	static sendJSON(req: express.Request, res: express.Response, data: unknown): void {
		res.status(200).json(data);
	}

	static sendError(req: express.Request, res: express.Response, err: string | Error | ApiError): void {
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
		ApiBaseResponder.sendErrorMsg(req, res, failCode || 500, message || 'Guru Meditation');
	}

	static sendErrorMsg(req: express.Request, res: express.Response, code: number, msg: string): void {
		res.status(code).json({ error: msg });
	}

	static sendBinary(req: express.Request, res: express.Response, data: ApiBinaryResult): void {
		if (data.json) {
			ApiBaseResponder.sendJSON(req, res, data.json);
		} else if (data.pipe) {
			data.pipe.pipe(res);
		} else if (data.buffer) {
			res.set('Content-Type', data.buffer.contentType);
			res.set('Content-Length', data.buffer.buffer.length.toString());
			// 			res.set('Cache-Control', 'public, max-age=' + config.max_age);
			res.status(200).send(data.buffer.buffer);
		} else if (data.file) {
			res.sendFile(data.file.filename, { filename: data.file.name || path.basename(data.file.filename) });
		}
	}
}
