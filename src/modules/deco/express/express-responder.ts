import express from 'express';
import path from 'node:path';

/**
 * Sanitize a filename for safe use in Content-Disposition headers.
 * Strips characters that could enable header injection (quotes, backslashes, control chars).
 */
function sanitizeContentDispositionFilename(name: string): string {
	// eslint-disable-next-line no-control-regex
	return name.replaceAll(/["\\]/g, '_').replaceAll(/[\u0000-\u001F\u007F]/g, '');
}

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
	sendString(_req: express.Request, res: express.Response, data: string): void {
		res.set('Content-Type', 'text/plain').status(200).send(data);
	}

	sendJSON(_req: express.Request, res: express.Response, data: unknown): void {
		res.status(200).json(data);
	}

	sendJSONP(_req: express.Request, res: express.Response, callback: string, data: any): void {
		// Validate callback to prevent XSS via JSONP injection
		if (!/^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(callback)) {
			res.status(400).send('Invalid callback parameter');
			return;
		}
		res.writeHead(200, { 'Content-Type': 'application/javascript' });
		res.end(`${callback}(${JSON.stringify(data)});`);
	}

	sendXML(_req: express.Request, res: express.Response, data: string): void {
		res.set('Content-Type', 'application/xml; charset=utf-8');
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
			const name = sanitizeContentDispositionFilename(data.file.name || path.basename(data.file.filename));
			res.sendFile(data.file.filename, {
				dotfiles: 'deny',
				headers: {
					'Content-Disposition': `attachment; filename="${name}"`
				}
			});
		}
	}

	abstract sendData(req: express.Request, res: express.Response, data: unknown): void;

	abstract sendOK(req: express.Request, res: express.Response): void;

	abstract sendError(req: express.Request, res: express.Response, error: unknown): void;
}
