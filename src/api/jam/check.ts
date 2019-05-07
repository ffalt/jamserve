import express from 'express';
import JamOpenApi from '../../model/jam-openapi.json';
import JamApiSchema from '../../model/jam-rest-api.schema.json';
import {OpenAPIObject} from '../../model/openapi-spec';
import {checkOpenApiParameters} from '../../utils/openapi-parameters-check';
import {ApiResponder} from './response';

export function apiCheck(name: string): express.RequestHandler {
	function CheckApiParametersHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
		checkOpenApiParameters(name, req, JamOpenApi as OpenAPIObject, JamApiSchema).then(() => {
			next();
		}).catch((e) => {
			ApiResponder.error(res, e);
		});
	}

	return CheckApiParametersHandler;
}
