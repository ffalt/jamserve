import express from 'express';
import path from 'path';
import {ApiBinaryResult, NodeError} from '../../typings';
import {FORMAT} from './format';
import {SubsonicParameterRequest} from './parameters';
import {xml} from './xml';

export class ApiResponder {

	public static ok(req: express.Request, res: express.Response): void {
		ApiResponder.send(req, res, FORMAT.packOK());
	}

	private static send(req: express.Request, res: express.Response, data: any): void {
		res.setHeader('Access-Control-Allow-Origin', '*');
		const params = (req as SubsonicParameterRequest).parameters;
		if ((params.format === 'jsonp') && (params.callback)) {
			res.status(200).send(`${params.callback}(${JSON.stringify(data)});`);
		} else if (params.format === 'json') {
			res.status(200).json(data);
		} else {
			res.set('Content-Type', 'application/xml');
			res.status(200).send(xml(data));
		}
	}

	public static data(req: express.Request, res: express.Response, data: any): void {
		ApiResponder.send(req, res, FORMAT.packResponse(data));
	}

	public static error(req: express.Request, res: express.Response, err: NodeError): void {
		if (err.fail) {
			ApiResponder.send(req, res, FORMAT.packFail(err.fail, err.text));
		} else {
			ApiResponder.send(req, res, FORMAT.packFail(FORMAT.FAIL.GENERIC, (typeof err === 'string' ? err : (err.message || 'Unknown Error')).toString()));
		}
	}

	public static binary(req: express.Request, res: express.Response, data: ApiBinaryResult): void {
		if (data.pipe) {
			data.pipe.pipe(res);
		} else if (data.buffer) {
			res.set('Content-Type', data.buffer.contentType);
			res.set('Content-Length', data.buffer.buffer.length.toString());
// 			res.set('Cache-Control', 'public, max-age=' + config.max_age);
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.status(200).send(data.buffer.buffer);
		} else if (data.file) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.sendFile(data.file.filename, data.file.name || path.basename(data.file.filename));
		}
	}
}
