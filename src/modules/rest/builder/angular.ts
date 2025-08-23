import { MethodMetadata } from '../../deco/definitions/method-metadata.js';
import { RestParameterMetadata } from '../../deco/definitions/parameter-metadata.js';
import { JAMAPI_URL_VERSION, JAMAPI_VERSION } from '../../engine/rest/version.js';
import { ApiBinaryResult } from '../../deco/express/express-responder.js';
import { buildTSEnums, buildTSParameterTypes, buildTSResultTypes } from './typescript.js';
import { buildParts, buildPartService, buildServiceParts, buildTemplate, callDescription, getClientZip, getCustomParameterTemplate, getResultType, MustacheDataClientCallFunction, Part } from './clients.js';

function generateUploadClientCalls(call: MethodMetadata, name: string, parameterType: string, upload: RestParameterMetadata): Array<MustacheDataClientCallFunction> {
	const resultType = getResultType(call);
	return [{
		name,
		paramsType: '',
		paramName: `params: ${parameterType}, file: File`,
		resultType: `Observable<HttpEvent<${resultType ?? 'any'}>>`,
		baseFuncResultType: '',
		baseFunc: 'upload',
		tick: '\'',
		baseFuncParameters: `${parameterType ? 'params' : '{}'}, '${upload.name}', file`,
		apiPath: (call.controllerClassMetadata?.route ?? '') + (call.route ?? ''),
		description: callDescription(call),
		sync: true
	}];
}

function generateUrlClientCall(call: MethodMetadata, name: string, parametersType?: string): MustacheDataClientCallFunction {
	let route = call.route ?? '';
	let validate = undefined;
	if (call.customPathParameters) {
		const { validateCode, paramRoute } = getCustomParameterTemplate(call.customPathParameters, call, `return ''`);
		validate = validateCode;
		route = paramRoute;
	}
	return {
		name: `${name}Url`,
		paramName: 'params',
		paramsType: parametersType ?? '{}',
		resultType: 'string',
		baseFuncResultType: '',
		baseFunc: 'buildRequestUrl',
		baseFuncParameters: call.customPathParameters ? '{}' : 'params',
		tick: call.customPathParameters ? '`' : '\'',
		validate,
		apiPath: (call.controllerClassMetadata?.route ?? '') + route,
		description: callDescription(call),
		sync: true
	};
}

function generateBinClientCall(call: MethodMetadata, name: string, parametersType?: string): MustacheDataClientCallFunction {
	let route = call.route ?? '';
	let validate = undefined;
	if (call.customPathParameters) {
		const { validateCode, paramRoute } = getCustomParameterTemplate(call.customPathParameters, call, `throw new Error('Invalid Parameter')`);
		validate = validateCode;
		route = paramRoute;
	}
	return {
		name: `${name}Binary`,
		paramName: 'params',
		paramsType: parametersType ?? '{}',
		resultType: '{ buffer: ArrayBuffer; contentType: string }',
		baseFuncResultType: '',
		baseFunc: 'binary',
		baseFuncParameters: call.customPathParameters ? '{}' : 'params',
		tick: call.customPathParameters ? '`' : '\'',
		validate,
		apiPath: (call.controllerClassMetadata?.route ?? '') + route,
		description: callDescription(call)
	};
}

function generateBinaryClientCalls(call: MethodMetadata, name: string, parameterType: string): Array<MustacheDataClientCallFunction> {
	return [generateUrlClientCall(call, name, parameterType), generateBinClientCall(call, name, parameterType)];
}

function generateRequestClientCalls(call: MethodMetadata, name: string, parameterType: string | undefined, method: 'post' | 'get'): Array<MustacheDataClientCallFunction> {
	const resultType = getResultType(call);
	let baseFunction: string;
	if (resultType) {
		if (method === 'post') {
			baseFunction = 'requestPostData';
		} else {
			baseFunction = resultType === 'string' ? 'requestString' : 'requestData';
		}
	} else {
		baseFunction = method === 'post' ? 'requestPostDataOK' : 'requestOK';
	}
	return [{
		name,
		paramName: parameterType ? 'parameters' : '',
		paramsType: parameterType ?? '',
		resultType: resultType ?? 'void',
		baseFuncResultType: resultType === 'string' ? '' : (resultType ?? ''),
		tick: call.customPathParameters ? '`' : '\'',
		baseFunc: baseFunction,
		baseFuncParameters: parameterType ? 'parameters' : '{}',
		apiPath: (call.controllerClassMetadata?.route ?? '') + (call.route ?? ''),
		description: callDescription(call)
	}];
}

export async function buildAngularClientList(): Promise<Array<{ name: string; content: string }>> {
	const parts: Array<Part> = await buildServiceParts(
		generateRequestClientCalls,
		generateBinaryClientCalls,
		generateUploadClientCalls,
		(key, part, calls) =>
			buildPartService('./static/templates/client/jam.part.service.ts.template', key, part, calls)
	);
	const list = parts.map(part => ({ name: `services/jam.${part.name}.service.ts`, content: part.content }));
	return [...list,
		{ name: 'jam.service.ts', content: await buildParts('./static/templates/client/jam.service.ts.template', parts) },
		{ name: 'jam.module.ts', content: await buildParts('./static/templates/client/jam.module.ts.template', parts) },
		{ name: 'jam.auth.service.ts', content: await buildTemplate('./static/templates/client/jam.auth.service.ts.template', { apiPrefix: `/jam/${JAMAPI_URL_VERSION}`, version: JAMAPI_VERSION }) },
		{ name: 'jam.base.service.ts', content: await buildTemplate('./static/templates/client/jam.base.service.ts.template') },
		{ name: 'jam.http.service.ts', content: await buildTemplate('./static/templates/client/jam.http.service.ts.template') },
		{ name: 'jam.configuration.ts', content: await buildTemplate('./static/templates/client/jam.configuration.ts.template') },
		{ name: 'index.ts', content: await buildTemplate('./static/templates/client/index.ts.template') },
		{ name: 'model/jam-rest-data.ts', content: buildTSResultTypes() },
		{ name: 'model/jam-rest-params.ts', content: buildTSParameterTypes() },
		{ name: 'model/jam-enums.ts', content: buildTSEnums() }
	];
}

export async function buildAngularClientZip(): Promise<ApiBinaryResult> {
	const list = await buildAngularClientList();
	const models = [
		'acousticbrainz-rest-data.ts',
		'acoustid-rest-data.ts',
		'coverartarchive-rest-data.ts',
		'lastfm-rest-data.ts',
		'musicbrainz-rest-data.ts',
		'lyricsovh-rest-data.ts',
		'wikidata-rest-data.ts'
	];
	return getClientZip(`angular-client-${JAMAPI_VERSION}.zip`, list, models);
}
