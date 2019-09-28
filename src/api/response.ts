import express from 'express';
import path from 'path';
import {ApiBinaryResult, NodeError} from '../typings';

export class ApiBaseResponder {

	static sendJSONP(res: express.Response, callback: string, data: any): void {
		res.status(200).send(`${callback}(${JSON.stringify(data)});`);
	}

	static sendJSON(res: express.Response, data: any): void {
		res.status(200).json(data);
	}

	static sendXML(res: express.Response, data: string): void {
		res.set('Content-Type', 'application/xml');
		res.status(200).send(data);
	}

	static sendError(res: express.Response, err: NodeError): void {
		const msg = (typeof err === 'string' ? err : (err.message || 'Guru Meditation')).toString();
		const code = (typeof err.failCode === 'number' ? err.failCode : 500);
		ApiBaseResponder.sendErrorMsg(res, code || 500, msg);
	}

	static sendErrorMsg(res: express.Response, code: number, msg: string): void {
		res.status(code).json({error: msg});
	}

	static sendBinary(res: express.Response, data: ApiBinaryResult): void {
		if (data.json) {
			ApiBaseResponder.sendJSON(res, data.json);
		} else if (data.pipe) {
			data.pipe.pipe(res);
		} else if (data.buffer) {
			res.set('Content-Type', data.buffer.contentType);
			res.set('Content-Length', data.buffer.buffer.length.toString());
// 			res.set('Cache-Control', 'public, max-age=' + config.max_age);
			res.status(200).send(data.buffer.buffer);
		} else if (data.file) {
			res.sendFile(data.file.filename, data.file.name || path.basename(data.file.filename));
		}
	}
}
