import express from 'express';
import {OpenAPIObject} from '../../model/openapi-spec';
import SubsonicOpenApi from '../../model/subsonic-openapi.json';
import {checkOpenApiParameters} from '../../utils/openapi-parameters-check';
import {FORMAT} from './format';
import {ApiResponder} from './response';

export function apiCheck(name: string): express.RequestHandler {
	function CheckApiParametersHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
		checkOpenApiParameters(name, req, SubsonicOpenApi as OpenAPIObject, 'get').then(() => {
			next();
		}).catch((e) => {
			ApiResponder.error(req, res, {fail: FORMAT.FAIL.PARAMETER, text: e.toString()});
		});
	}

	return CheckApiParametersHandler;
}
