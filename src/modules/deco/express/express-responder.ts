import express from 'express';
import path from 'node:path';
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

export abstract class ApiBaseResponder {
	sendString(req: express.Request, res: express.Response, data: string): void {
		res.set('Content-Type', 'text/plain').status(200).send(data);
	}

	sendJSON(req: express.Request, res: express.Response, data: unknown): void {
		res.status(200).json(data);
	}

	sendJSONP(req: express.Request, res: express.Response, callback: string, data: any): void {
		res.writeHead(200, { 'Content-Type': 'application/javascript' });
		res.end(`${callback}(${JSON.stringify(data)});`);
	}

	sendXML(req: express.Request, res: express.Response, data: string): void {
		res.set('Content-Type', 'application/xml');
		res.status(200).send(data);
	}

	sendBinary(req: express.Request, res: express.Response, data: ApiBinaryResult): void {
		if (data.json) {
			this.sendJSON(req, res, data.json);
		} else if (data.pipe) {
			data.pipe.pipe(res);
		} else if (data.buffer) {
			res.set('Content-Type', data.buffer.contentType);
			res.set('Content-Length', data.buffer.buffer.length.toString());
			res.status(200).send(data.buffer.buffer);
		} else if (data.file) {
			res.sendFile(data.file.filename, {
				dotfiles: 'deny',
				headers: {
					'Content-Disposition': `attachment; filename="${data.file.name || path.basename(data.file.filename)}"`
				}
			});
		}
	}

	abstract sendData(req: express.Request, res: express.Response, data: unknown): void;

	abstract sendOK(req: express.Request, res: express.Response): void;

	abstract sendError(req: express.Request, res: express.Response, err: string | Error | ApiError): void;
}
