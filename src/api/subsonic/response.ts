import express from 'express';
import {IApiBinaryResult, NodeError} from '../../typings';
import path from 'path';
import {toXML} from '../../utils/to-xml';
import {SubsonicParameterRequest} from './parameters';
import {FORMAT} from './format';

export class ApiResponder {

	public static ok(req: express.Request, res: express.Response) {
		ApiResponder.send(req, res, FORMAT.packOK());
	}

	private static send(req: express.Request, res: express.Response, data: any) {
		const params = (<SubsonicParameterRequest>req).parameters;
		if ((params.format === 'jsonp') && (params.callback)) {
			res.status(200).send(params.callback + '(' + JSON.stringify(data) + ');');
		} else if (params.format === 'json') {
			res.status(200).json(data);
		} else {
			res.set('Content-Type', 'application/xml');
			res.status(200).send(toXML(data));
		}
	}

	public static data(req: express.Request, res: express.Response, data: any) {
		ApiResponder.send(req, res, FORMAT.packResponse(data));
	}

	public static error(req: express.Request, res: express.Response, err: NodeError) {
		if (err.fail) {
			ApiResponder.send(req, res, FORMAT.packFail(err.fail, err.text));
		} else {
			ApiResponder.send(req, res, FORMAT.packFail(FORMAT.FAIL.GENERIC, (typeof err === 'string' ? err : (err.message || 'Unknown Error')).toString()));
		}
	}

	public static binary(req: express.Request, res: express.Response, data: IApiBinaryResult) {
		if (data.pipe) {
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
