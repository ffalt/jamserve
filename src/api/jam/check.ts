import express from 'express';
import refParser from 'json-schema-ref-parser';
import JamOpenApi from '../../model/jam-openapi.json';
import {OpenAPIObject} from '../../model/openapi-spec';
import {checkOpenApiParameters} from '../../utils/openapi-parameters-check';
import {InvalidParamError} from './error';
import {ApiResponder} from './response';

let JamOpenApiDeref: OpenAPIObject;

const pathParameterPath = {
	get: {
		parameters: [
			{
				in: 'path',
				name: 'pathParameter',
				schema: {
					type: 'string'
				},
				required: true
			}
		]
	}
};

async function check(name: string, req: express.Request): Promise<void> {
	if (!JamOpenApiDeref) {
		const paths = (JamOpenApi.paths as any);
		paths['image/{pathParameter}'] = pathParameterPath;
		paths['download/{pathParameter}'] = pathParameterPath;
		paths['waveform/{pathParameter}'] = pathParameterPath;
		paths['stream/{pathParameter}'] = pathParameterPath;
		JamOpenApiDeref = (await refParser.dereference(JamOpenApi)) as any;
	}
	await checkOpenApiParameters(name, req, JamOpenApiDeref);
}

export function apiCheck(name: string): express.RequestHandler {
	function CheckApiParametersHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
		check(name, req).then(() => {
			next();
		}).catch((e) => {
			// console.log(e.message);
			ApiResponder.error(res, InvalidParamError(e.message));
		});
	}

	return CheckApiParametersHandler;
}
