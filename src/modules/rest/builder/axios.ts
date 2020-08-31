import {MethodMetadata} from '../definitions/method-metadata';
import {getMetadataStorage} from '../metadata';
import {RestParamMetadata} from '../definitions/param-metadata';
import {JAMAPI_URL_VERSION, JAMAPI_VERSION} from '../../engine/rest/version';
import {ApiBinaryResult} from './express-responder';
import {buildTSEnums, buildTSParameterTypes, buildTSResultTypes} from './typescript';
import {callDescription, getCallParamType, getClientZip, getCustomParameterTemplate, getResultType, MustacheDataClientCallFunction, Part, wrapLong, writeParts, writeTemplate} from './clients';

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
		apiPath: (call.controllerClassMetadata?.route || '') + (call.route || ''),
		description: callDescription(call)
	}];
}

function generateUrlClientCall(call: MethodMetadata, name: string, paramsType: string): MustacheDataClientCallFunction {
	let route = (call.route || '');
	let validate = undefined;
	let baseParam = 'params';
	if (call.customPathParameters) {
		const {validateCode, paramRoute} = getCustomParameterTemplate(call.customPathParameters, call, `return ''`);
		validate = validateCode;
		route = paramRoute;
		baseParam = '{}';
	}
	return {
		name: `${name}Url`,
		paramName: 'params',
		paramsType: (paramsType || '{}') + ', forDom: boolean',
		resultType: 'string',
		baseFuncResultType: '',
		baseFunc: 'buildRequestUrl',
		baseFuncParameters: baseParam + ', forDom',
		tick: call.customPathParameters ? '`' : '\'',
		validate,
		apiPath: (call.controllerClassMetadata?.route || '') + route,
		description: callDescription(call),
		sync: true
	};
}

function generateBinClientCall(call: MethodMetadata, name: string, paramsType: string): MustacheDataClientCallFunction {
	let route = (call.route || '');
	let validate = undefined;
	let baseParam = 'params';
	if (call.customPathParameters) {
		const {validateCode, paramRoute} = getCustomParameterTemplate(call.customPathParameters, call, `throw new Error('Invalid Parameter')`);
		validate = validateCode;
		route = paramRoute;
		baseParam = '{}';
	}
	return {
		name: `${name}Binary`,
		paramName: 'params',
		paramsType: paramsType || '{}',
		resultType: 'ArrayBuffer',
		baseFuncResultType: '',
		baseFunc: 'binary',
		baseFuncParameters: baseParam,
		tick: call.customPathParameters ? '`' : '\'',
		validate,
		apiPath: (call.controllerClassMetadata?.route || '') + route,
		description: callDescription(call)
	};
}

function generateBinaryClientCalls(call: MethodMetadata, name: string, paramType: string): Array<MustacheDataClientCallFunction> {
	return [
		generateUrlClientCall(call, name, paramType),
		generateBinClientCall(call, name, paramType)
	];
}

function generateClientCalls(call: MethodMetadata, method: 'post' | 'get'): Array<MustacheDataClientCallFunction> {
	const name = call.methodName.replace(/\//g, '_');
	const upload = call.params.find(o => o.kind === 'arg' && o.mode === 'file');
	const paramType = getCallParamType(call);
	if (upload) {
		return generateUploadClientCalls(call, name, paramType, upload as RestParamMetadata);
	}
	if (call.binary) {
		return generateBinaryClientCalls(call, name, paramType);
	}
	const resultType = getResultType(call);
	return [{
		name,
		paramName: paramType ? 'params' : '',
		paramsType: paramType || '',
		resultType: resultType ? resultType : 'void',
		baseFuncResultType: resultType || '',
		baseFunc:
			resultType
				? (method === 'post' ? 'requestPostData' : 'requestData')
				: (method === 'post' ? 'requestPostDataOK' : 'requestOK'),
		baseFuncParameters: paramType ? 'params' : '{}',
		tick: call.customPathParameters ? '`' : '\'',
		apiPath: (call.controllerClassMetadata?.route || '') + (call.route || ''),
		description: callDescription(call)
	}];
}

async function writePartService(key: string, part: string, calls: Array<MustacheDataClientCallFunction>): Promise<{ name: string; content: string }> {
	const l = calls.map(call => {
		return {...call, name: call.name.replace(key + '_', ''), paramsType: wrapLong(call.paramsType)};
	});
	const withHttpEvent = !!calls.find(c => c.resultType.includes('HttpEvent'));
	const withJam = !!calls.find(c => c.resultType.includes('Jam.'));
	const withJamParam = !!calls.find(c => c.paramsType.includes('JamParameter'));
	return writeTemplate(
		`services/jam.${key.toLowerCase()}.service.ts`,
		'./static/templates/client-axios/jam.part.service.ts.template',
		{list: l, part, withHttpEvent, withJam, withJamParam}
	);
}

export async function buildAxiosClientList(): Promise<Array<{ name: string; content: string }>> {
	const metadata = getMetadataStorage();
	const sections: { [name: string]: Array<MustacheDataClientCallFunction> } = {};
	for (const call of metadata.gets) {
		const ctrl = call.controllerClassMetadata!;
		const tag = ctrl.name.replace('Controller', '');
		sections[tag] = (sections[tag] || []).concat(generateClientCalls(call, 'get'));
	}
	for (const call of metadata.posts) {
		const ctrl = call.controllerClassMetadata!;
		const tag = ctrl.name.replace('Controller', '');
		sections[tag] = (sections[tag] || []).concat(generateClientCalls(call, 'post'));
	}
	const keys = Object.keys(sections);
	const parts: Array<Part> = [];
	const list: Array<{ name: string; content: string }> = [];
	for (const key of keys) {
		const part = key[0].toUpperCase() + key.slice(1);
		if (key !== 'Auth' && key !== 'Base') {
			parts.push({name: key.toLowerCase(), part});
			list.push(await writePartService(key, part, sections[key]));
		}
	}
	list.push(await writeParts('jam.service.ts', './static/templates/client-axios/jam.service.ts.template', parts));
	list.push(await writeTemplate(`jam.base.service.ts`, './static/templates/client-axios/jam.base.service.ts.template', {}));
	list.push(await writeTemplate(`jam.http.service.ts`, './static/templates/client-axios/jam.http.service.ts.template', {}));
	list.push(await writeTemplate(`jam.configuration.ts`, './static/templates/client-axios/jam.configuration.ts.template', {}));
	list.push(await writeTemplate(`index.ts`, './static/templates/client-axios/index.ts.template', {}));
	list.push(await writeTemplate(`jam.auth.service.ts`, './static/templates/client-axios/jam.auth.service.ts.template', {apiPrefix: `/jam/${JAMAPI_URL_VERSION}`, version: JAMAPI_VERSION}));
	list.push({name: 'model/jam-rest-data.ts', content: buildTSResultTypes()});
	list.push({name: 'model/jam-rest-params.ts', content: buildTSParameterTypes()});
	list.push({name: 'model/jam-enums.ts', content: buildTSEnums()});
	return list;
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