import express from 'express';
import JamOpenApi from '../../model/jam-openapi.json';
import {OpenAPIObject} from '../../model/openapi-spec';
import {checkOpenApiParameters} from '../../utils/openapi-parameters-check';
import {InvalidParamError} from './error';
import {ApiResponder} from './response';

function extendOpenApi(): void {
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
	const paths = (JamOpenApi.paths as any);
	paths['image/{pathParameter}'] = pathParameterPath;
	paths['download/{pathParameter}'] = pathParameterPath;
	paths['waveform/{pathParameter}'] = pathParameterPath;
	paths['stream/{pathParameter}'] = pathParameterPath;
}

extendOpenApi();

async function check(name: string, req: express.Request): Promise<void> {
	await checkOpenApiParameters(name, req, JamOpenApi as OpenAPIObject);
}

export function apiCheck(name: string): express.RequestHandler {
	function CheckApiParametersHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
		check(name, req).then(() => {
			next();
		}).catch(e => {
			// console.log(e.message);
			ApiResponder.error(res, InvalidParamError(e.message));
		});
	}

	return CheckApiParametersHandler;
}
