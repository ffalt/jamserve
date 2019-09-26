import fse from 'fs-extra';
import Mustache from 'mustache';
import path from 'path';
import {ApiCall, ApiCalls, getJamApiCalls, run} from './utils';

interface MustacheDataClientCallFunction {
	name: string;
	paramName: string;
	paramsType: string;
	resultType: string;
	baseFunc: string;
	baseFuncResultType: string;
	baseFuncParameters: string;
	apiPath: string;
	description?: string;
	apiPathTemplate?: boolean;
	sync?: boolean;
}

interface Part {
	name: string;
	part: string;
	isLast?: boolean;
}

function generateUploadClientCalls(call: ApiCall, name: string): Array<MustacheDataClientCallFunction> {
	return [{
		name,
		paramsType: '',
		paramName: `params: ${call.paramType}, file: File`,
		resultType: 'Observable<HttpEvent<any>>',
		baseFuncResultType: '',
		baseFunc: 'upload',
		baseFuncParameters: `${call.paramType ? 'params' : '{}'}, '${call.upload}', file`,
		apiPath: call.name,
		description: call.description,
		sync: true
	}];
}

function generateUrlClientCall(call: ApiCall, name: string, paramsType: string): MustacheDataClientCallFunction {
	return {
		name: `${name}_url`,
		paramName: 'params',
		paramsType: paramsType || '{}',
		resultType: 'string',
		baseFuncResultType: '',
		baseFunc: 'buildRequestUrl',
		baseFuncParameters: 'params',
		apiPath: call.name,
		description: call.description,
		sync: true
	};
}

function generatBinClientCall(call: ApiCall, name: string, paramsType: string): MustacheDataClientCallFunction {
	return {
		name: `${name}_binary`,
		paramName: 'params',
		paramsType: paramsType || '{}',
		resultType: 'ArrayBuffer',
		baseFuncResultType: '',
		baseFunc: 'binary',
		baseFuncParameters: 'params',
		apiPath: call.name,
		description: call.description
	};
}

function generatePathParamBinaryClientCalls(call: ApiCall): Array<MustacheDataClientCallFunction> {
	if (!call.pathParams || !call.pathParams.parameters) {
		return [];
	}
	const params = call.pathParams.parameters.map(para => `${para.name}${para.required ? '' : '?'}: ${para.type}`).join(', ');
	const basename = call.name.split('/')[0];
	const parampath = call.pathParams.parameters.map(para => {
		const prefix = para.prefix || '';
		const suffix = para.suffix || '';
		if (para.required) {
			return `${prefix}$\{${para.name}}${suffix}`;
		}
		return `$\{${para.name} !== undefined ? \`${prefix}$\{${para.name}}\` : ''}${suffix}`;
	}).join('');
	return [
		{
			name: `${basename}_url`,
			paramName: params,
			paramsType: '',
			resultType: 'string',
			baseFuncResultType: '',
			baseFunc: 'buildRequestUrl',
			baseFuncParameters: '',
			apiPath: `${basename}/${parampath}`,
			apiPathTemplate: true,
			description: call.description,
			sync: true
		},
		{
			name: `${basename}_binary`,
			paramName: params,
			paramsType: '',
			resultType: 'ArrayBuffer',
			baseFuncResultType: '',
			baseFunc: 'binary',
			baseFuncParameters: '',
			apiPathTemplate: true,
			apiPath: `${basename}/${parampath}`,
			description: call.description
		}];
}

function generateBinaryClientCalls(call: ApiCall, name: string): Array<MustacheDataClientCallFunction> {
	if (call.paramType) {
		return [
			generateUrlClientCall(call, name, call.paramType),
			generatBinClientCall(call, name, call.paramType)
		];
	}
	if (call.pathParams && call.pathParams.parameters) {
		return generatePathParamBinaryClientCalls(call);
	}
	if (call.pathParams) {
		return [
			generateUrlClientCall(call, name, call.pathParams.paramType),
			generatBinClientCall(call, name, call.pathParams.paramType)
		];
	}
	return [];
}

function generateClientCalls(call: ApiCall): Array<MustacheDataClientCallFunction> {
	const name = call.name.replace(/\//g, '_');
	if (call.upload) {
		return generateUploadClientCalls(call, name);
	}
	if (call.binaryResult) {
		return generateBinaryClientCalls(call, name);
	}
	return [{
		name,
		paramName: call.paramType ? 'params' : '',
		paramsType: call.paramType || '',
		resultType: call.resultType ? call.resultType : 'void',
		baseFuncResultType: call.resultType || '',
		baseFunc:
			call.resultType
				? (call.method === 'post' ? 'requestPostData' : 'requestData')
				: (call.method === 'post' ? 'requestPostDataOK' : 'requestOK'),
		baseFuncParameters: call.paramType ? 'params' : '{}',
		apiPath: call.name,
		description: call.description
	}];
}

async function writeService(destPath: string, serviceParts: Array<Part>): Promise<void> {
	const list: Array<Part> = [{name: 'auth', part: 'Auth'}, {name: 'base', part: 'Base'}]
		.concat(serviceParts)
		.sort((a, b) => a.name.localeCompare(b.name));
	list.forEach((p, i) => {
		p.isLast = i === list.length - 1;
	});
	const template = Mustache.render((await fse.readFile('../templates/client/jam.service.ts.template')).toString(), {list});
	const destfile = path.resolve(destPath, 'jam.service.ts');
	await fse.writeFile(destfile, template);
}

async function writeModule(destPath: string, serviceParts: Array<Part>): Promise<void> {
	const list: Array<Part> = [{name: 'http', part: 'Http'}, {name: 'auth', part: 'Auth'}, {name: 'base', part: 'Base'}]
		.concat(serviceParts)
		.sort((a, b) => a.name.localeCompare(b.name));
	list.forEach((p, i) => {
		p.isLast = i === list.length - 1;
	});
	const template = Mustache.render((await fse.readFile('../templates/client/jam.module.ts.template')).toString(), {list});
	const destfile = path.resolve(destPath, 'jam.module.ts');
	await fse.writeFile(destfile, template);
}

async function writePartService(destPath: string, key: string, part: string, calls: Array<MustacheDataClientCallFunction>): Promise<void> {
	const partfile = path.resolve(destPath, `jam.${key}.service.ts`);
	const l = calls.map(call => {
		return {...call, name: call.name.replace(key + '_', '')};
	});
	const withHttpEvent = calls.find(c => c.resultType.includes('HttpEvent'));
	const t = Mustache.render((await fse.readFile('../templates/client/jam.part.service.ts.template')).toString(), {list: l, part, withHttpEvent});
	await fse.writeFile(partfile, t);
}

async function writeAuthService(destPath: string, calls: ApiCalls): Promise<void> {
	const t = Mustache.render((await fse.readFile('../templates/client/jam.auth.service.ts.template')).toString(), {apiPrefix: calls.apiPrefix, version: calls.version});
	await fse.writeFile(path.resolve(destPath, `jam.auth.service.ts`), t);
}

async function writeBaseService(destPath: string): Promise<void> {
	const t = Mustache.render((await fse.readFile('../templates/client/jam.base.service.ts.template')).toString(), {});
	await fse.writeFile(path.resolve(destPath, `jam.base.service.ts`), t);
}

async function writeHttpService(destPath: string): Promise<void> {
	const t = Mustache.render((await fse.readFile('../templates/client/jam.http.service.ts.template')).toString(), {});
	await fse.writeFile(path.resolve(destPath, `jam.http.service.ts`), t);
}

async function writeJamConfiguration(destPath: string): Promise<void> {
	const t = Mustache.render((await fse.readFile('../templates/client/jam.configuration.ts.template')).toString(), {});
	await fse.writeFile(path.resolve(destPath, `jam.configuration.ts`), t);
}

async function build(): Promise<string> {
	const destPath = path.resolve('../../dist/jam/');
	if (await fse.pathExists(destPath)) {
		await fse.remove(destPath);
	}
	await fse.mkdirp(destPath);
	const basePath = path.resolve('../../src/model/');
	const apiCalls: ApiCalls = await getJamApiCalls(basePath);
	const sections: { [name: string]: Array<MustacheDataClientCallFunction> } = {};
	for (const call of apiCalls.calls) {
		if (!call.aliasFor) {
			sections[call.tag] = (sections[call.tag] || []).concat(generateClientCalls(call));
		}
	}
	const keys = Object.keys(sections);
	const list: Array<Part> = [];
	for (const key of keys) {
		const part = key[0].toUpperCase() + key.slice(1);
		list.push({name: key, part});
		await writePartService(destPath, key, part, sections[key]);
	}
	await writeService(destPath, list);
	await writeModule(destPath, list);
	await writeAuthService(destPath, apiCalls);
	await writeBaseService(destPath);
	await writeHttpService(destPath);
	await writeJamConfiguration(destPath);

	const models: Array<string> = [
		'jam-rest-api.d.ts',
		'jam-rest-params.d.ts',
		'jam-rest-data.d.ts',
		'jam-types.ts',
		'lastfm-rest-data.d.ts',
		'wikidata-rest-data.d.ts',
		'musicbrainz-rest-data.d.ts',
		'acousticbrainz-rest-data.d.ts',
		'acoustid-rest-data.d.ts',
		'coverartarchive-rest-data.d.ts',
		'id3v2-frames.d.ts'
	];
	const modelDestPath = path.resolve(destPath, 'model');
	await fse.mkdirp(modelDestPath);

	for (const model of models) {
		await fse.copy(path.resolve(basePath, model), path.resolve(modelDestPath, model));
	}

	return destPath;
}

run(build);
