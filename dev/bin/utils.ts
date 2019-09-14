import fse from 'fs-extra';
import path from 'path';
import * as TJS from 'typescript-json-schema';
import {JAMAPI_VERSION} from '../../src/api/jam/version';
import {SUBSONIC_VERSION} from '../../src/api/subsonic/version';

const settings: TJS.PartialArgs = {
	required: true
};

export async function transformTS2JSONScheme(basePath: string, filename: string, symbol: string): Promise<TJS.Definition> {
	const compilerOptions: TJS.CompilerOptions = {
		strictNullChecks: true,
		resolveJsonModule: true,
		rootDir: basePath,
		typeRoots: [basePath]
	};
	const file = path.resolve(basePath, `${filename}.d.ts`);
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
	const scheme = generator.getSchemaForSymbol(symbol, true);
	if (scheme) {
		return scheme;
	}
	return Promise.reject(`Typescript symbol not found: ${symbol}`);
}

export async function transformTS2NamespaceJSONScheme(basePath: string, filename: string): Promise<TJS.Definition> {
	const compilerOptions: TJS.CompilerOptions = {
		strictNullChecks: true,
		rootDir: basePath,
		resolveJsonModule: true,
		typeRoots: [basePath]
	};
	const file = path.resolve(basePath, `${filename}.d.ts`);
	const program = TJS.getProgramFromFiles([file], compilerOptions, basePath);
	const generator = TJS.buildGenerator(program, settings);
	if (!generator) {
		console.log(program);
		return Promise.reject('Typescript generation failed');
	}
	const symbols = generator.getUserSymbols();
	const scheme = generator.getSchemaForSymbols(symbols, true);
	if (scheme) {
		return scheme;
	}
	return Promise.reject(`Typescript schema could not be created: ${filename}`);
}

export async function saveTS2JSONScheme(basePath: string, filename: string, symbol: string): Promise<void> {
	const scheme = await transformTS2JSONScheme(basePath, filename, symbol);
	const destfile = path.resolve(basePath, `${filename}.schema.json`);
	await fse.writeFile(destfile, JSON.stringify(scheme, null, '\t'));
	console.log('👍', destfile, 'written');
}

export async function saveTS2NamespaceJSONScheme(basePath: string, filename: string): Promise<void> {
	const scheme = await transformTS2NamespaceJSONScheme(basePath, filename);
	const destfile = path.resolve(basePath, `${filename}.schema.json`);
	await fse.writeFile(destfile, JSON.stringify(scheme, null, '\t'));
	console.log('👍', destfile, 'written');
}

export interface ApiCallPathParameters {
	paramType: string;
	parameters?: Array<{ name: string, type: string, prefix: string, description: string, required: boolean }>;
}

export interface ApiCalls {
	calls: Array<ApiCall>;
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
	paramSchema?: any;
	bodySchema?: any;
	resultType?: string;
	roles: Array<string>;
	resultErrors: Array<{ code: number, text: string }>;
	upload?: string;
	binaryResult: Array<string> | undefined;
	resultSchema: any;
	isPublic: boolean;
	definitions: any;
	pathParamsSchema: any;
	pathParams?: ApiCallPathParameters;
}

function getPathParamsCalls(name: string, api: any, pathParams: any): ApiCallPathParameters | undefined {
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
			const required = (paramDef.required || []).includes(id);
			return {name: id, prefix, type, required, description: prop.description};
		});
	return {paramType, parameters};
}

export async function getSubsonicApiCalls(basePath: string): Promise<ApiCalls> {
	const api = await transformTS2JSONScheme(basePath, 'subsonic-rest-api', 'SubsonicApi');
	return getApiCalls(api, SUBSONIC_VERSION);
}

export async function getJamApiCalls(basePath: string): Promise<ApiCalls> {
	const api = await transformTS2JSONScheme(basePath, 'jam-rest-api', 'JamApi');
	return getApiCalls(api, JAMAPI_VERSION);
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

function getDescriptionAndTag(name: string, apidef: any): { description?: string, tag: string } {
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
	return {description, tag};
}

function getApiCall(name: string, method: string, api: any): ApiCall {
	const apidef = api.properties[method].properties[name];
	const {description, tag} = getDescriptionAndTag(name, apidef);
	return {
		method: method.toLowerCase(),
		name,
		tag,
		description,
		paramType: apidef.properties.params && apidef.properties.params.$ref ? apidef.properties.params.$ref.split('/')[2] : undefined,
		paramSchema: method === 'GET' ? apidef.properties.params : undefined,
		bodySchema: method === 'POST' ? apidef.properties.params : undefined,
		operationId: getOperationId(name, apidef),
		upload: apidef.properties.upload ? apidef.properties.upload.enum[0] : undefined,
		roles: apidef.properties.roles ? apidef.properties.roles.items.map((item: any) => item.enum[0]) : [],
		resultErrors: getResultErrors(api, apidef),
		pathParamsSchema: apidef.properties.pathParams,
		definitions: api.definitions,
		resultSchema: apidef.properties.result,
		isPublic: !!apidef.properties.public,
		aliasFor: apidef.properties.aliasFor ? apidef.properties.aliasFor.enum[0] : undefined,
		binaryResult: apidef.properties.binary ? apidef.properties.binary.items.map((item: any) => item.enum[0]) : undefined,
		pathParams: getPathParamsCalls(name, api, apidef.properties.pathParams),
		resultType: getResultType(apidef.properties.result)
	};
}

export function getApiCalls(api: any, version: string): ApiCalls {
	const result: ApiCalls = {calls: [], version};
	Object.keys(api.properties).forEach(method => {
		Object.keys(api.properties[method].properties).forEach(name => {
			result.calls.push(getApiCall(name, method, api));
		});
	});
	return result;
}

export function run(build: () => Promise<string>): void {
	build()
		.then(destfile => {
			console.log('👍', destfile, 'written');
		})
		.catch(e => {
			console.error(e);
		});
}
