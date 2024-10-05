import express from 'express';
import { SubsonicParameterRequest } from './parameters.js';
import { xml } from './xml.js';
import { ApiBaseResponder, ApiBinaryResult } from '../deco/express/express-responder.js';

import { SubsonicFormatter } from './formatter.js';

export class ApiResponder extends ApiBaseResponder {
	private send(req: express.Request, res: express.Response, data: any): void {
		res.setHeader('Access-Control-Allow-Origin', '*');
		const params = (req as SubsonicParameterRequest).parameters;
		if ((params.format === 'jsonp') && (params.callback)) {
			this.sendJSONP(req, res, params.callback, data);
		} else if (params.format === 'json') {
			this.sendJSON(req, res, data);
		} else {
			data['subsonic-response'].xmlns = 'http://subsonic.org/restapi';
			this.sendXML(req, res, xml(data));
		}
	}

	public sendData(req: express.Request, res: express.Response, data: any): void {
		this.send(req, res, SubsonicFormatter.packResponse(data));
	}

	public sendOK(req: express.Request, res: express.Response): void {
		this.send(req, res, SubsonicFormatter.packOK());
	}

	public sendError(req: express.Request, res: express.Response, err: any): void {
		if (err?.fail) {
			this.send(req, res, SubsonicFormatter.packFail(err.code, err.fail));
		} else {
			this.send(req, res, SubsonicFormatter.packFail(SubsonicFormatter.FAIL.GENERIC, (typeof err === 'string' ? err : (err.message || 'Unknown Error')).toString()));
		}
	}

	public sendBinary(req: express.Request, res: express.Response, data: ApiBinaryResult): void {
		res.setHeader('Access-Control-Allow-Origin', '*');
		super.sendBinary(req, res, data);
	}
}
