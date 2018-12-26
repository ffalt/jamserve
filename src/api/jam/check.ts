import {OpenAPIObject} from '../../model/openapi-spec';
import express from 'express';
import {checkOpenApiParameters} from '../../utils/openapi-parameters-check';
import {ApiResponder} from './response';

const openapi: OpenAPIObject = require('../../model/jam-openapi.json');
const JamApiSchema = require('../../model/jam-rest-api.schema.json');

export function apiCheck(name: string): express.RequestHandler {
	function CheckApiParametersHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
		checkOpenApiParameters(name, req, openapi, JamApiSchema).then(() => {
			next();
		}).catch((e) => {
			ApiResponder.error(res, e);
		});
	}
	return CheckApiParametersHandler;
}
