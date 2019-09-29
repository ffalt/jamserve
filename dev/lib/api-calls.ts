import {JAMAPI_VERSION} from '../../src/api/jam/version';
import {SUBSONIC_VERSION} from '../../src/api/subsonic/version';
import {AudioFormatType, WaveformFormatType} from '../../src/model/jam-types';
import {Definition, Definitions} from './json-schema';
import {transformTS2JSONScheme} from './ts2scheme';

export interface ApiCallPathParameter {
	name: string;
	type: string;
	prefix: string;
	suffix: string;
	description: string;
	required: boolean;
}

export interface ApiCallPathParameters {
	paramType: string;
	parameters?: Array<ApiCallPathParameter>;
}

export interface ApiCalls {
	calls: Array<ApiCall>;
	apiPrefix: string;
	version: string;
}

export interface ApiCall {
	method: string;
	name: string;
	tag: string;
	operationId: string;
	aliasFor?: string;
	description?: string;
	paramType?: string;
	paramSchema?: Definition;
	bodySchema?: Definition;
	resultType?: string;
	roles: Array<string>;
	resultErrors: Array<{ code: number, text: string }>;
	upload?: string;
	binaryResult: Array<string> | undefined;
	resultSchema: Definition;
	isPublic: boolean;
	definitions: Definitions;
	pathParamsSchema?: Definition;
	pathParams?: ApiCallPathParameters;
}

function getPathParamsPropType(prop: Definition): string {
	let type = prop.type;
	if (type === 'integer') {
		type = 'number';
	}
	if (prop.enum) {
		// hackerty hardcode hack! ts2jsonschema seems to destroys Union String Enum Types that are optional
		// (eg. format?: DownloadFormatType ==> format: 'zip'|'tar'|'undefined')
		// restore the type here
		if (prop.enum.includes('zip')) {
			type = 'JamParameters.DownloadFormatType';
		} else if (prop.enum.includes('jpeg')) {
			type = 'JamParameters.ImageFormatType';
		} else if (prop.enum.includes(WaveformFormatType.svg)) {
			type = 'JamParameters.WaveformFormatType';
		} else if (prop.enum.includes(AudioFormatType.mp3)) {
			type = 'JamParameters.AudioFormatType';
		} else {
			console.error('restore destroyed union enum type', prop.enum);
		}
	}
	return type || '';
}

function getPathParamsParameterCalls(paramType: string, paramDef: Definition, paramPart: string): ApiCallPathParameters | undefined {
	const paramParts = paramPart.split('}').filter(s => s.length > 0);
	const parameters: Array<ApiCallPathParameter> = [];
	for (const s of paramParts) {
		if (!s.includes('{') && parameters.length > 0) {
			parameters[parameters.length - 1].suffix = s;
			continue;
		}
		const defs = s.split('{');
		const prefix = defs[0];
		const name = defs[1];
		const prop = paramDef.properties ? paramDef.properties[name] : undefined;
		if (!prop) {
			console.error('Unknown PathParamProperty', name);
			continue;
		}
		parameters.push({name, prefix, suffix: '', type: getPathParamsPropType(prop), required: (paramDef.required || []).includes(name), description: prop.description || ''});
	}
	return {paramType, parameters};
}

function getPathParamsCalls(name: string, pathParams: any, api: Definition): ApiCallPathParameters | undefined {
	const paramType = pathParams && pathParams.$ref ? pathParams.$ref.split('/')[2] : undefined;
	if (!paramType) {
		return;
	}
	const paramDef = api.definitions ? api.definitions[paramType] : undefined;
	if (!paramDef || !paramDef.properties) {
		return;
	}
	const paramParts = name.split('/')[1];
	if (!paramParts) {
		return {paramType};
	}
	return getPathParamsParameterCalls(paramType, paramDef, paramParts);
}

export async function getSubsonicApiCalls(basePath: string): Promise<ApiCalls> {
	const api = await transformTS2JSONScheme(basePath, 'subsonic-rest-api', 'SubsonicApi');
	return getApiCalls(api, SUBSONIC_VERSION, '/rest/');
}

export async function getJamApiCalls(basePath: string): Promise<ApiCalls> {
	const api = await transformTS2JSONScheme(basePath, 'jam-rest-api', 'JamApi');
	return getApiCalls(api, JAMAPI_VERSION, '/api/v1/');
}

function getResultErrors(api: any, apidef: any): Array<{ code: number, text: string }> {
	const resultErrors: Array<{ code: number, text: string }> = [];
	if (apidef.properties.errors) {
		if (apidef.properties.errors.$ref) {
			const errspec = api.definitions[apidef.properties.errors.$ref.split('/')[2]].properties;
			const errcode = errspec.error.enum[0];
			const errtext = errspec.text.enum[0];
			resultErrors.push({code: errcode, text: errtext});
		} else if (apidef.properties.errors.anyOf) {
			apidef.properties.errors.anyOf.forEach((errspec: any) => {
				if (!api.definitions[errspec.$ref.split('/')[2]]) {
					console.log(Object.keys(api.definitions));
				}
				errspec = api.definitions[errspec.$ref.split('/')[2]].properties;
				const errcode = errspec.error.enum[0];
				const errtext = errspec.text.enum[0];
				resultErrors.push({code: errcode, text: errtext});
			});
		} else {
			console.error('Implement error spec', apidef.properties.errors);
		}
	}
	return resultErrors;
}

function getOperationId(name: string, apidef: any): string {
	let operationId = apidef.properties.operationId ? apidef.properties.operationId.enum[0] : undefined;
	let splits: Array<string>;
	if (operationId) {
		splits = operationId.split('.');
		if (splits.length > 1) {
			operationId = `${splits[0]}Controller.${splits[1]}`;
		}
	} else {
		splits = name.split('/');
		operationId = splits.length > 1 ?
			`${splits[0]}Controller.${splits[1]}` :
			name;
	}
	if (splits.length > 2) {
		operationId += splits.slice(2).map(sp => sp[0].toUpperCase() + sp.slice(1).toLowerCase()).join('');
	}
	return operationId;
}

function getResultType(resultdef: any): string | undefined {
	let resultType: string | undefined;
	if (resultdef) {
		if (resultdef.type === 'array') {
			resultType = resultdef.items.$ref.split('/')[2];
			resultType = `Array<${resultType}>`;
		} else if (resultdef.$ref) {
			resultType = resultdef.$ref.split('/')[2];
		}
	}
	return resultType;
}

function getDescriptionAndTag(name: string, description: string | undefined): { description?: string, tag: string } {
	let tag = name.split('/')[0];
	if (description) {
		const sl = description.split(':');
		if (sl.length > 1) {
			tag = sl[0].trim();
			description = sl[1].trim();
		} else {
			description = sl[0].trim();
		}
	}
	return {description, tag};
}

function getEnumValue(prop: Definition): string | undefined {
	return prop && prop.enum ? prop.enum[0] as string : undefined;
}

function getItemsEnum(prop: Definition): Array<string> | undefined {
	const result: Array<string | undefined> =
		prop && prop.items ?
			(prop.items as Array<Definition>).map(getEnumValue)
			: [];
	const res = result.filter(s => s !== undefined) as Array<string>;
	return res.length > 0 ? res : undefined;
}

function getParamType(prop: Definition): string | undefined {
	return (prop && prop.$ref) ? prop.$ref.split('/')[2] : undefined;
}

function getApiCall(name: string, method: string, apidef: Definition, api: Definition): ApiCall | undefined {
	if (!apidef.properties) {
		return;
	}
	const {description, tag} = getDescriptionAndTag(name, apidef.description);
	return {
		method: method.toLowerCase(), name, tag, description,
		paramType: getParamType(apidef.properties.params),
		paramSchema: method === 'GET' ? apidef.properties.params : undefined,
		bodySchema: method === 'POST' ? apidef.properties.params : undefined,
		operationId: getOperationId(name, apidef),
		upload: getEnumValue(apidef.properties.upload),
		roles: getItemsEnum(apidef.properties.roles) || [],
		resultErrors: getResultErrors(api, apidef),
		pathParamsSchema: apidef.properties.pathParams,
		resultSchema: apidef.properties.result,
		isPublic: !!apidef.properties.public,
		aliasFor: getEnumValue(apidef.properties.aliasFor),
		binaryResult: getItemsEnum(apidef.properties.binary),
		pathParams: getPathParamsCalls(name, apidef.properties.pathParams, api),
		resultType: getResultType(apidef.properties.result),
		definitions: api.definitions || {}
	};
}

export function getApiCalls(api: Definition, version: string, apiPrefix: string): ApiCalls {
	const result: ApiCalls = {calls: [], version, apiPrefix};
	if (!api.properties) {
		return result;
	}
	for (const method of Object.keys(api.properties)) {
		const methodSpec = api.properties[method];
		if (methodSpec.properties) {
			for (const name of Object.keys(methodSpec.properties)) {
				const spec = methodSpec.properties[name];
				const call = getApiCall(name, method, spec, api);
				if (call) {
					result.calls.push(call);
				}
			}
		}
	}
	return result;
}
