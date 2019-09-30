import express from 'express';
import {ApiBinaryResult, NodeError} from '../../typings';
import {ApiBaseResponder} from '../response';
import {FORMAT} from './format';
import {SubsonicParameterRequest} from './parameters';
import {xml} from './xml';

export class ApiResponder {

	private static send(req: express.Request, res: express.Response, data: any): void {
		res.setHeader('Access-Control-Allow-Origin', '*');
		const params = (req as SubsonicParameterRequest).parameters;
		if ((params.format === 'jsonp') && (params.callback)) {
			ApiBaseResponder.sendJSONP(req, res, params.callback, data);
		} else if (params.format === 'json') {
			ApiBaseResponder.sendJSON(req, res, data);
		} else {
			data['subsonic-response'].xmlns = 'http://subsonic.org/restapi';
			ApiBaseResponder.sendXML(req, res, xml(data));
		}
	}

	public static ok(req: express.Request, res: express.Response): void {
		ApiResponder.send(req, res, FORMAT.packOK());
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
		res.setHeader('Access-Control-Allow-Origin', '*');
		ApiBaseResponder.sendBinary(req, res, data);
	}
}
