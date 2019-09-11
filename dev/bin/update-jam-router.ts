import fse from 'fs-extra';
import Mustache from 'mustache';
import path from 'path';
import {ApiBinaryResult} from '../../src/typings';
import {ApiCall, getJamApiCalls} from './utils';

const destPath = '../../src/api/jam/';
const destfile = path.resolve(destPath, 'routes.ts');
const basePath = path.resolve('../../src/model/');

function generateRegisterFunction(call: ApiCall): MustacheDataRegisterFunction {
	const result: MustacheDataRegisterFunction = {
		method: call.upload ? 'upload' : call.method,
		apiPath: call.name,
		apiPathCheck: '',
		parameterType: call.paramType || '{}',
		parameterSource: (call.method === 'post') ? 'body' : 'query',
		resultType: '',
		controllerCall: call.operationId,
		respondCall: '',
		callRoles: '',
		upload: call.upload || ''
	};
	if (call.resultType) {
		result.resultType = call.resultType;
	}
	if (call.binaryResult) {
		result.resultType = 'ApiBinaryResult';
	}
	if (call.pathParams) {
		const list = call.name.split('/');
		result.parameterSource = 'params';
		result.apiPath = list[0] + '/:pathParameter';
		result.parameterType = '{pathParameter: string}';
		result.controllerCall += 'ByPathParameter';
		result.apiPathCheck = list[0] + '/{pathParameter}';
	}
	if (call.roles.length > 0) {
		result.callRoles = JSON.stringify(call.roles).replace(/"/g, '\'');
	}
	if (result.callRoles.length === 0 && result.apiPathCheck.length > 0) {
		result.callRoles = '[]';
	}
	if (call.binaryResult) {
		result.respondCall = 'binary(res, result)';
	} else if (!call.resultType) {
		result.respondCall = 'ok(res)';
	} else {
		result.respondCall = 'data(res, result)';
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

async function run(): Promise<void> {
	const apicalls: Array<ApiCall> = await getJamApiCalls(basePath);
	const publicAccess: Array<MustacheDataRegisterFunction> = [];
	const privateAccess: Array<MustacheDataRegisterFunction> = [];
	const collectRoles: Array<string> = [];
	apicalls.forEach(call => {
		(call.roles || []).forEach(role => {
			if (!collectRoles.includes(role)) {
				collectRoles.push(role);
			}
		});
		if (call.aliasFor || ['login', 'logout'].includes(call.name)) {
			return;
		}
		if (call.isPublic) {
			publicAccess.push(generateRegisterFunction(call));
		} else {
			privateAccess.push(generateRegisterFunction(call));
		}
	});
	const roles = collectRoles.map(r => `'${r}'`).join(' | ');
	const template = Mustache.render((await fse.readFile('../templates/jam-routes.ts.template')).toString(), {publicAccess, privateAccess, roles});
	await fse.writeFile(destfile, template);
}

run()
	.then(() => {
		console.log('👍', destfile, 'written');
	})
	.catch(e => {
		console.error(e);
	});
