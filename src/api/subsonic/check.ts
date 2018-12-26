import express from 'express';
import {checkOpenApiParameters} from '../../utils/openapi-parameters-check';
import {ApiResponder} from './response';
import {FORMAT} from './format';
import {OpenAPIObject} from '../../model/openapi-spec';

const SubsonicApiSchema = require('../../model/subsonic-rest-api.schema.json');
const openapi: OpenAPIObject = require('../../model/subsonic-openapi.json');

export function apiCheck(name: string): express.RequestHandler {
	function CheckApiParametersHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
		checkOpenApiParameters(name, req, openapi, SubsonicApiSchema, 'get').then(() => {
			next();
		}).catch((e) => {
			ApiResponder.error(req, res, {fail: FORMAT.FAIL.PARAMETER, text: e.toString()});
		});
	}
	return CheckApiParametersHandler;
}
