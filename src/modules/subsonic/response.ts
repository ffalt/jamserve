import express from 'express';
import { SubsonicParameterRequest } from './parameters.js';
import { xml } from './xml.js';
import { ApiBaseResponder, ApiBinaryResult } from '../deco/express/express-responder.js';

import { SubsonicFormatter } from './formatter.js';
import { errorNumberCode, errorToString } from '../../utils/error.js';
import { SubsonicResponse } from './model/subsonic-rest-data.js';

export class ApiResponder extends ApiBaseResponder {
	private send(req: express.Request, res: express.Response, data: Record<string, any>): void {
		res.setHeader('Access-Control-Allow-Origin', '*');
		const parameters = (req as SubsonicParameterRequest).parameters;
		if ((parameters.format === 'jsonp') && (parameters.callback)) {
			this.sendJSONP(req, res, parameters.callback, data);
		} else if (parameters.format === 'json') {
			this.sendJSON(req, res, data);
		} else {
			data['subsonic-response'].xmlns = 'http://subsonic.org/restapi';
			this.sendXML(req, res, xml(data));
		}
	}

	public sendData(req: express.Request, res: express.Response, data: SubsonicResponse): void {
		this.send(req, res, SubsonicFormatter.packResponse(data));
	}

	public sendOK(req: express.Request, res: express.Response): void {
		this.send(req, res, SubsonicFormatter.packOK());
	}

	public sendError(req: express.Request, res: express.Response, error: unknown): void {
		this.send(req, res, SubsonicFormatter.packFail(errorNumberCode(error) ?? SubsonicFormatter.FAIL.GENERIC, errorToString(error)));
	}

	public sendBinary(req: express.Request, res: express.Response, data: ApiBinaryResult): void {
		res.setHeader('Access-Control-Allow-Origin', '*');
		super.sendBinary(req, res, data);
	}
}
