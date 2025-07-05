import { MethodMetadata } from '../../deco/definitions/method-metadata.js';
import { RestParamMetadata } from '../../deco/definitions/param-metadata.js';
import { JAMAPI_URL_VERSION, JAMAPI_VERSION } from '../../engine/rest/version.js';
import { ApiBinaryResult } from '../../deco/express/express-responder.js';
import { buildTSEnums, buildTSParameterTypes, buildTSResultTypes } from './typescript.js';
import { buildParts, buildPartService, buildServiceParts, buildTemplate, callDescription, getClientZip, getCustomParameterTemplate, getResultType, MustacheDataClientCallFunction, Part } from './clients.js';

function generateUploadClientCalls(call: MethodMetadata, name: string, paramType: string, upload: RestParamMetadata): Array<MustacheDataClientCallFunction> {
	return [{
		name,
		paramsType: '',
		paramName: `params: ${paramType}, file: any, onUploadProgress: (progressEvent: any) => void`,
		resultType: 'void',
		baseFuncResultType: '',
		baseFunc: 'upload',
		baseFuncParameters: `${paramType ? 'params' : '{}'}, '${upload.name}', file, onUploadProgress`,
		tick: '\'',
		apiPath: (call.controllerClassMetadata?.route ?? '') + (call.route ?? ''),
		description: callDescription(call)
	}];
}

function generateUrlClientCall(call: MethodMetadata, name: string, paramsType: string): MustacheDataClientCallFunction {
	let route = (call.route ?? '');
	let validate = undefined;
	let baseParam = 'params';
	if (call.customPathParameters) {
		const { validateCode, paramRoute } = getCustomParameterTemplate(call.customPathParameters, call, `return ''`);
		validate = validateCode;
		route = paramRoute;
		baseParam = '{}';
	}
	return {
		name: `${name}Url`,
		paramName: 'params',
		paramsType: `${paramsType ?? '{}'}, forDom: boolean`,
		resultType: 'string',
		baseFuncResultType: '',
		baseFunc: 'buildRequestUrl',
		baseFuncParameters: `${baseParam}, forDom`,
		tick: call.customPathParameters ? '`' : '\'',
		validate,
		apiPath: (call.controllerClassMetadata?.route ?? '') + route,
		description: callDescription(call),
		sync: true
	};
}

function generateBinClientCall(call: MethodMetadata, name: string, paramsType: string): MustacheDataClientCallFunction {
	let route = (call.route || '');
	let validate = undefined;
	let baseParam = 'params';
	if (call.customPathParameters) {
		const { validateCode, paramRoute } = getCustomParameterTemplate(call.customPathParameters, call, `throw new Error('Invalid Parameter')`);
		validate = validateCode;
		route = paramRoute;
		baseParam = '{}';
	}
	return {
		name: `${name}Binary`,
		paramName: 'params',
		paramsType: paramsType ?? '{}',
		resultType: '{buffer: ArrayBuffer; contentType: string}',
		baseFuncResultType: '',
		baseFunc: 'binary',
		baseFuncParameters: baseParam,
		tick: call.customPathParameters ? '`' : '\'',
		validate,
		apiPath: (call.controllerClassMetadata?.route ?? '') + route,
		description: callDescription(call)
	};
}

function generateBinaryClientCalls(call: MethodMetadata, name: string, paramType: string): Array<MustacheDataClientCallFunction> {
	return [generateUrlClientCall(call, name, paramType), generateBinClientCall(call, name, paramType)];
}

function generateRequestClientCalls(call: MethodMetadata, name: string, paramType: string, method: 'post' | 'get'): Array<MustacheDataClientCallFunction> {
	const resultType = getResultType(call);
	return [{
		name,
		paramName: paramType ? 'params' : '',
		paramsType: paramType ?? '',
		resultType: resultType ?? 'void',
		baseFuncResultType: resultType ?? '',
		baseFunc: resultType ? (method === 'post' ? 'requestPostData' : 'requestData') : (method === 'post' ? 'requestPostDataOK' : 'requestOK'),
		baseFuncParameters: paramType ? 'params' : '{}',
		tick: call.customPathParameters ? '`' : '\'',
		apiPath: (call.controllerClassMetadata?.route ?? '') + (call.route ?? ''),
		description: callDescription(call)
	}];
}

export async function buildAxiosClientList(): Promise<Array<{ name: string; content: string }>> {
	const parts: Array<Part> = await buildServiceParts(
		generateRequestClientCalls,
		generateBinaryClientCalls,
		generateUploadClientCalls,
		(key, part, calls) => buildPartService('./static/templates/client-axios/jam.part.service.ts.template', key, part, calls)
	);
	return parts.map(part => ({ name: `services/jam.${part.name}.service.ts`, content: part.content }))
		.concat([
			{ name: 'jam.service.ts', content: await buildParts('./static/templates/client-axios/jam.service.ts.template', parts) },
			{ name: `jam.base.service.ts`, content: await buildTemplate('./static/templates/client-axios/jam.base.service.ts.template') },
			{ name: `jam.http.service.ts`, content: await buildTemplate('./static/templates/client-axios/jam.http.service.ts.template') },
			{ name: `jam.configuration.ts`, content: await buildTemplate('./static/templates/client-axios/jam.configuration.ts.template') },
			{ name: `index.ts`, content: await buildTemplate('./static/templates/client-axios/index.ts.template') },
			{ name: `jam.auth.service.ts`, content: await buildTemplate('./static/templates/client-axios/jam.auth.service.ts.template', { apiPrefix: `/jam/${JAMAPI_URL_VERSION}`, version: JAMAPI_VERSION }) },
			{ name: 'model/jam-rest-data.ts', content: buildTSResultTypes() },
			{ name: 'model/jam-rest-params.ts', content: buildTSParameterTypes() },
			{ name: 'model/jam-enums.ts', content: buildTSEnums() }
		]);
}

export async function buildAxiosClientZip(): Promise<ApiBinaryResult> {
	const list = await buildAxiosClientList();
	const models = [
		'acousticbrainz-rest-data.ts',
		'acoustid-rest-data.ts',
		'coverartarchive-rest-data.ts',
		'lastfm-rest-data.ts',
		'musicbrainz-rest-data.ts',
		'lyricsovh-rest-data.ts',
		'id3v2-frames.ts',
		'wikidata-rest-data.ts',
		'jam-auth.ts'
	];
	return getClientZip(`axios-client-${JAMAPI_VERSION}.zip`, list, models);
}
