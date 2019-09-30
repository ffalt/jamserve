import fse from 'fs-extra';
import Mustache from 'mustache';
import path from 'path';
import {ApiCall, ApiCalls, getJamApiCalls} from '../lib/api-calls';
import {run} from '../lib/run';

function getResultType(call: ApiCall): string {
	if (call.resultType) {
		return call.resultType;
	}
	if (call.binaryResult) {
		return 'ApiBinaryResult';
	}
	return '';
}

function getCallRoles(call: ApiCall, hasPathParameter: boolean): string {
	let result = '';
	if (call.roles.length > 0) {
		result = JSON.stringify(call.roles).replace(/"/g, '\'');
	}
	if (result.length === 0 && hasPathParameter) {
		return '[]';
	}
	return result;
}

function getRespondCall(call: ApiCall, hasResultType: boolean): string {
	return (call.binaryResult) ?
		'binary(req, res, result)' :
		(hasResultType ? 'data(req, res, result)' : 'ok(req, res)');
}

function generateRegisterFunction(call: ApiCall): MustacheDataRegisterFunction {
	const resultType = getResultType(call);
	const result: MustacheDataRegisterFunction = {
		method: call.upload ? 'upload' : call.method,
		apiPath: call.name,
		apiPathCheck: '',
		parameterType: call.paramType || '{}',
		parameterSource: (call.method === 'post') ? 'body' : 'query',
		resultType,
		controllerCall: call.operationId,
		respondCall: getRespondCall(call, resultType.length > 0),
		callRoles: getCallRoles(call, !!call.pathParams),
		upload: call.upload || ''
	};
	if (call.pathParams) {
		const base = call.name.split('/')[0];
		result.apiPathCheck = `${base}/{pathParameter}`;
		result.apiPath = `${base}/:pathParameter`;
		result.parameterSource = 'params';
		result.parameterType = '{pathParameter: string}';
		result.controllerCall += 'ByPathParameter';
	}
	return result;
}

interface MustacheDataRegisterFunction {
	method: string;
	apiPath: string;
	apiPathCheck: string;
	parameterType: string;
	parameterSource: string;
	resultType: string;
	controllerCall: string;
	respondCall: string;
	upload: string;
	callRoles: string;
}

async function build(): Promise<string> {
	const destFile = path.resolve('../../src/api/jam/routes.ts');
	const basePath = path.resolve('../../src/model/');
	const apiCalls: ApiCalls = await getJamApiCalls(basePath);
	const publicAccess: Array<MustacheDataRegisterFunction> = [];
	const privateAccess: Array<MustacheDataRegisterFunction> = [];
	const collectRoles = new Set<string>();
	for (const call of apiCalls.calls) {
		for (const role of (call.roles || [])) {
			collectRoles.add(role);
		}
		if (call.aliasFor || ['login', 'logout'].includes(call.name)) {
			continue;
		}
		(call.isPublic ? publicAccess : privateAccess).push(generateRegisterFunction(call));
	}
	const roles = [...collectRoles].map(r => `'${r}'`).join(' | ');
	const template = Mustache.render((await fse.readFile('../templates/jam-routes.ts.template')).toString(), {publicAccess, privateAccess, roles, version: apiCalls.version});
	await fse.writeFile(destFile, template);
	return destFile;
}

run(build);
