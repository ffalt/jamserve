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
	paths['waveform_svg/{pathParameter}'] = pathParameterPath;
	paths['stream/{pathParameter}'] = pathParameterPath;
}

extendOpenApi();

async function check(name: string, req: express.Request): Promise<void> {
	await checkOpenApiParameters(name, req, JamOpenApi as OpenAPIObject);
}

export function apiCheck(name: string): express.RequestHandler {
	function CheckApiParametersHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
		check(name, req)
			.then(() => {
				next();
			}).catch(e => {
			// console.log(e.message);
			ApiResponder.error(req, res, InvalidParamError(e.message));
		});
	}

	return CheckApiParametersHandler;
}

// tslint:disable-next-line:interface-name
export interface IDFormat {
	id: string;
	format?: string;
}

export async function validatePathParameterIDFormat(pathParameter: string, validFormats: Array<string>, defaultFormat: string | undefined): Promise<IDFormat> {
	const p = (pathParameter || '').trim();
	if (!p || p.length === 0) {
		return Promise.reject(InvalidParamError());
	}
	const split = p.split('.');
	const id = split[0];
	if (!id || id.length === 0) {
		return Promise.reject(InvalidParamError());
	}
	const format = split[1] !== undefined ? split[1] : defaultFormat;
	if (format !== undefined && !validFormats.includes(format)) {
		return Promise.reject(InvalidParamError());
	}
	return {id, format};
}

// tslint:disable-next-line:interface-name
export interface IDSizeFormat {
	id: string;
	size?: number;
	format?: string;
}

export async function validatePathParameterIDSizeFormat(
	pathParameter: string, validFormats: Array<string>,
	defaultFormat: string | undefined, minSize: number, maxSize: number): Promise<IDSizeFormat> {
	const {id, format} = await validatePathParameterIDFormat(pathParameter, validFormats, defaultFormat);
	const idsplit = id.split('-');
	const iid = idsplit[0];
	if (!iid || iid.length === 0) {
		return Promise.reject(InvalidParamError());
	}
	const size = idsplit[1] !== undefined ? Number(idsplit[1]) : undefined;
	if (size !== undefined) {
		if (isNaN(size)) {
			return Promise.reject(InvalidParamError('parameter is not a number'));
		}
		if (size < minSize || size > maxSize) {
			return Promise.reject(InvalidParamError('parameter number not in allowed range'));
		}
	}
	return {id: iid, format, size};
}
