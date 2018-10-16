import * as TJS from 'typescript-json-schema';
import path from 'path';
import {Definition} from 'typescript-json-schema/typescript-json-schema';
import {fileWrite} from '../../src/utils/fs-utils';

const basePath = path.resolve('../../src/model/');

const settings: TJS.PartialArgs = {
	required: true
};

const compilerOptions: TJS.CompilerOptions = {
	strictNullChecks: true,
	rootDir: basePath,
	typeRoots: [basePath]
};

export async function transformTS2JSONScheme(filename: string, symbol: string): Promise<Definition> {
	const file = path.resolve(basePath, filename + '.d.ts');
	const program = TJS.getProgramFromFiles([file], compilerOptions, basePath);
	const generator = TJS.buildGenerator(program, settings);
	if (!generator) {
		console.log(program);
		return Promise.reject('Typescript generation failed');
	}
	// if (generator) {
	// const symbols = generator.getUserSymbols();
	// console.log(symbols);
	// }
	const scheme = generator.getSchemaForSymbol(symbol);
	if (scheme) {
		return scheme;
	} else {
		return Promise.reject('Typescript symbol not found: ' + symbol);
	}
}

export async function saveTS2JSONScheme(filename: string, symbol: string): Promise<void> {
	const scheme = await transformTS2JSONScheme(filename, symbol);
	const destfile = path.resolve(basePath, filename + '.schema.json');
	await fileWrite(destfile, JSON.stringify(scheme, null, '\t'));
	console.log(destfile, 'written');
}


export interface IApiCall {
	method: string;
	name: string;
	tag: string;
	operationId: string;
	aliasFor?: string;
	description?: string;
	paramType?: string;
	paramSchema?: any;
	bodySchema?: any;
	resultType?: string;
	roles?: Array<string>;
	resultErrors: Array<{ code: number, text: string }>;
	upload?: string;
	binaryResult: Array<string> | undefined;
	resultSchema: any;
	isPublic: boolean;
	needsAdmin: boolean;
	definitions: any;
	pathParamsSchema: any;
	pathParams?: {
		paramType: string;
		parameters?: Array<{ name: string, type: string, prefix: string, description: string, required: boolean }>;
	};
}

function getPathParamsCalls(name: string, api: any, pathParams: any): {
	paramType: string;
	parameters?: Array<{ name: string, type: string, prefix: string, description: string, required: boolean }>
} | undefined {
	const paramType = pathParams && pathParams.$ref ? pathParams.$ref.split('/')[2] : undefined;
	if (!paramType) {
		return;
	}
	const paramDef = api.definitions[paramType];
	const paramParts = name.split('/')[1];
	if (!paramParts) {
		return {paramType};
	}
	const parameters: Array<{ name: string, type: string, prefix: string, description: string, required: boolean }> = paramParts
		.split('}')
		.filter(s => s.length > 0).map(s => {
			const defs = s.split('{');
			const prefix = defs[0];
			const id = defs[1];
			const prop = paramDef.properties[id];
			let type = prop.type;
			if (type === 'integer') {
				type = 'number';
			}
			const required = (paramDef.required || []).indexOf(id) >= 0;
			return {name: id, prefix, type, required, description: prop.description};
		});
	return {paramType, parameters};
}

export async function getSubsonicApiCalls(): Promise<Array<IApiCall>> {
	const api = await transformTS2JSONScheme('subsonic-rest-api-1.16.0', 'SubsonicApi');
	return getApiCalls(api);
}

export async function getJamApiCalls(): Promise<Array<IApiCall>> {
	const api = await transformTS2JSONScheme('jam-rest-api-0.1.0', 'JamApi');
	return getApiCalls(api);
}

export function getApiCalls(api: any): Array<IApiCall> {
	const result: Array<IApiCall> = [];
	Object.keys(api.properties).forEach(method => {
		Object.keys(api.properties[method].properties).forEach(name => {
			const apidef = api.properties[method].properties[name];
			const parasdef = apidef.properties.params;
			const resultdef = apidef.properties.result;
			const binarydef = apidef.properties.binary;
			const paramType = parasdef && parasdef.$ref ? parasdef.$ref.split('/')[2] : undefined;
			const splits = name.split('/');
			let operationId = splits[0];
			if (splits.length > 1) {
				operationId += '.' + splits[1];
				if (splits.length > 2) {
					operationId += splits.slice(2).map(sp => sp[0].toUpperCase() + sp.slice(1).toLowerCase()).join('');
				}
			}
			if (apidef.properties.operationId) {
				operationId = apidef.properties.operationId.enum[0];
			}
			const pathParams = apidef.properties.pathParams;
			let upload: string | undefined;
			if (apidef.properties.upload) {
				upload = apidef.properties.upload.enum[0];
			}
			let resultType: string | undefined;
			if (resultdef) {
				if (resultdef.type === 'array') {
					resultType = resultdef.items.$ref.split('/')[2];
					resultType = 'Array<' + resultType + '>';
				} else if (resultdef.$ref) {
					resultType = resultdef.$ref.split('/')[2];
				}
			}
			let aliasFor: string | undefined;
			if (apidef.properties.aliasFor) {
				aliasFor = apidef.properties.aliasFor.enum[0];
			}
			let description: string | undefined;
			let tag = name.split('/')[0];

			if (apidef.description) {
				const sl = apidef.description.split(':');
				if (sl.length > 1) {
					tag = sl[0].trim();
					description = sl[1].trim();
				} else {
					description = sl[0].trim();
				}
			}
			let binaryResult: Array<string> | undefined;
			if (binarydef) {
				binaryResult = apidef.properties.binary.items.map((item: any) => item.enum[0]);
			}

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
			let roles: Array<string> = [];
			if (apidef.properties.roles) {
				roles = apidef.properties.roles.items.map((item: any) => item.enum[0]);
			}
			result.push({
				method: method.toLowerCase(),
				name,
				tag,
				description,
				paramType,
				paramSchema: method === 'GET' ? apidef.properties.params : undefined,
				bodySchema: method === 'POST' ? apidef.properties.params : undefined,
				operationId,
				upload,
				roles,
				resultErrors,
				pathParamsSchema: pathParams,
				definitions: api.definitions,
				resultSchema: resultdef,
				isPublic: !!apidef.properties.public,
				needsAdmin: roles.indexOf('admin') >= 0,
				aliasFor,
				binaryResult,
				pathParams: getPathParamsCalls(name, api, pathParams),
				resultType
			});
		});
	});
	return result;
}
