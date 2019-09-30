import express from 'express';
import path from 'path';
import {ApiBinaryResult, NodeError} from '../typings';

export class ApiBaseResponder {

	static sendJSONP(req: express.Request, res: express.Response, callback: string, data: any): void {
		res.writeHead(200, {'Content-Type': 'application/javascript'});
		res.end(`${callback}(${JSON.stringify(data)});`);
	}

	static sendJSON(req: express.Request, res: express.Response, data: any): void {
		res.status(200).json(data);
	}

	static sendXML(req: express.Request, res: express.Response, data: string): void {
		res.set('Content-Type', 'application/xml');
		res.status(200).send(data);
	}

	static sendError(req: express.Request, res: express.Response, err: NodeError): void {
		const msg = (typeof err === 'string' ? err : (err.message || 'Guru Meditation')).toString();
		const code = (typeof err.failCode === 'number' ? err.failCode : 500);
		ApiBaseResponder.sendErrorMsg(req, res, code || 500, msg);
	}

	static sendErrorMsg(req: express.Request, res: express.Response, code: number, msg: string): void {
		res.status(code).json({error: msg});
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
			const range = req.range(0);
			res.sendFile(data.file.filename, {
				filename: data.file.name || path.basename(data.file.filename),
				acceptRanges: range !== -1
			});
		}
	}
}
