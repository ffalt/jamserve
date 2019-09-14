import fse from 'fs-extra';
import Mustache from 'mustache';
import path from 'path';
import {ApiBinaryResult} from '../../src/typings';
import {ApiCall, ApiCalls, getSubsonicApiCalls, run} from './utils';

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

function generateRegisterFunction(call: ApiCall): MustacheDataRegisterFunction {
	const result: MustacheDataRegisterFunction = {
		method: call.upload ? 'upload' : call.method,
		apiPath: call.name,
		apiPathCheck: '',
		parameterType: call.paramType || '{}',
		parameterSource: (call.method === 'post') ? 'body' : 'query',
		resultType: '',
		controllerCall: call.operationId.replace('.view', ''),
		respondCall: '',
		callRoles: '',
		upload: call.upload || ''
	};
	if (call.resultSchema) {
		const propname = call.resultSchema.required[0];
		const proptype = call.resultSchema.properties[propname].$ref.split('/')[2];
		result.resultType = `{ ${propname}: ${proptype} }`;
	}
	// if (call.resultType) {
	// 	console.log(call);
	// 	result.resultType = call.resultType;
	// }
	if (call.binaryResult) {
		result.resultType = 'ApiBinaryResult';
	}
	if (call.pathParams) {
		const list = call.name.split('/');
		result.parameterSource = 'params';
		result.apiPath = `${list[0]}/:pathParameter`;
		result.parameterType = '{pathParameter: string}';
		result.controllerCall += 'ByPathParameter';
		result.apiPathCheck = `${list[0]}/{pathParameter}`;
	}
	if (call.roles.length > 0) {
		result.callRoles = JSON.stringify(call.roles).replace(/"/g, '\'');
	}
	if (result.callRoles.length === 0 && result.apiPathCheck.length > 0) {
		result.callRoles = '[]';
	}
	if (call.binaryResult) {
		result.respondCall = 'binary(req, res, result)';
	} else if (!result.resultType) {
		result.respondCall = 'ok(req, res)';
	} else {
		result.respondCall = 'data(req, res, result)';
	}
	return result;
}

async function build(): Promise<string> {
	const destfile = path.resolve('../../src/api/subsonic/routes.ts');
	const basePath = path.resolve('../../src/model/');
	const apicalls: ApiCalls = await getSubsonicApiCalls(basePath);
	const collectRoles: Array<string> = [];
	const publicAccess: Array<MustacheDataRegisterFunction> = [];
	apicalls.calls.forEach(call => {
		(call.roles || []).forEach(role => {
			if (!collectRoles.includes(role)) {
				collectRoles.push(role);
			}
		});
		publicAccess.push(generateRegisterFunction(call));
	});
	const roles = collectRoles.map(r => `'${r}'`).join(' | ');
	const template = Mustache.render((await fse.readFile('../templates/subsonic-routes.ts.template')).toString(), {publicAccess, roles, version: apicalls.version});
	await fse.writeFile(destfile, template);
	return destfile;
}

run(build);
