import fse from 'fs-extra';
import Mustache from 'mustache';
import path from 'path';
import {ApiCall, ApiCalls, getSubsonicApiCalls} from '../lib/api-calls';
import {run} from '../lib/run';

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

function getResultType(call: ApiCall): string {
	if (call.binaryResult) {
		return 'ApiBinaryResult';
	}
	if (call.resultSchema && call.resultSchema.required && call.resultSchema.properties) {
		const propname = call.resultSchema.required[0];
		const prop = call.resultSchema.properties[propname];
		if (prop && prop.$ref) {
			const proptype = prop.$ref.split('/')[2];
			return `{ ${propname}: ${proptype} }`;
		}
	}
	return '';
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
		controllerCall: call.operationId.replace('.view', ''),
		respondCall: getRespondCall(call, resultType.length > 0),
		callRoles: getCallRoles(call, !!call.pathParams),
		upload: call.upload || ''
	};
	if (call.pathParams) {
		const base = call.name.split('/')[0];
		result.apiPath = `${base}/:pathParameter`;
		result.apiPathCheck = `${base}/{pathParameter}`;
		result.parameterSource = 'params';
		result.parameterType = '{pathParameter: string}';
		result.controllerCall += 'ByPathParameter';
	}
	return result;
}

async function build(): Promise<string> {
	const destfile = path.resolve('../../src/api/subsonic/routes.ts');
	const basePath = path.resolve('../../src/model/');
	const apicalls: ApiCalls = await getSubsonicApiCalls(basePath);
	const publicAccess: Array<MustacheDataRegisterFunction> = [];
	const collectRoles = new Set<string>();
	for (const call of apicalls.calls) {
		for (const role of (call.roles || [])) {
			collectRoles.add(role);
		}
		publicAccess.push(generateRegisterFunction(call));
	}
	const roles = [...collectRoles].map(r => `'${r}'`).join(' | ');
	const template = Mustache.render((await fse.readFile('../templates/subsonic-routes.ts.template')).toString(), {publicAccess, roles, version: apicalls.version});
	await fse.writeFile(destfile, template);
	return destfile;
}

run(build);
