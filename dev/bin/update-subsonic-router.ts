import fse from 'fs-extra';
import path from 'path';
import {ApiBinaryResult} from '../../src/typings';
import {ApiCall, getSubsonicApiCalls} from './utils';
import Mustache from 'mustache';

const destPath = '../../src/api/subsonic/';
const destfile = path.resolve(destPath, 'routes.ts');
const basePath = path.resolve('../../src/model/');

function generateCode(calls: Array<ApiCall>): string {
	const result: Array<string> = [];
	calls.forEach(call => {
		let datasouce = 'req.query';
		if (call.pathParams) {
			datasouce = 'req.params';
		} else if (call.method === 'post') {
			datasouce = 'req.body';
		}

		const options = '{query: ' + datasouce + ', user: req.user, client: req.client' + (call.upload ? ', file: req.file?req.file.path:undefined' : '') + '}';

		let name = call.name;
		let operation = 'api.' + call.operationId.replace(/\.view/g, '');
		let paramType = call.paramType || '{}';
		let resultType = call.resultType;
		if (call.binaryResult) {
			resultType = 'ApiBinaryResult';
		} else if (call.resultSchema) {
			const propname = call.resultSchema.required[0];
			const proptype = call.resultSchema.properties[propname].$ref.split('/')[2];
			resultType = '{ ' + propname + ': ' + proptype + ' }';
		}
		if (call.pathParams) {
			operation = 'api.' + call.name.split('/')[0];
			name = call.name.replace(/}/g, '').replace(/{/g, ':');
			paramType = call.pathParams.paramType;
		}
		let code = `const options: ApiOptions<${paramType}> = ${options};`;
		if (resultType) {
			code += `\n\tconst result: ${resultType} = await ${operation}(options);`;
		} else {
			code += `\n\tawait ${operation}(options);`;
		}
		if (call.binaryResult) {
			code += '\n\tawait ApiResponder.binary(req, res, result);';
		} else if (!call.resultSchema) {
			code += '\n\tawait ApiResponder.ok(req, res);';
		} else {
			code += '\n\tawait ApiResponder.data(req, res, result);';
		}
		code = code.replace(/\n/g, '\n\t\t');
		let roles = '';
		if (call.roles && call.roles.length > 0) {
			roles = call.roles.map(r => `'${r}'`).join(', ');
		}
		const s = `	register.all('/${name}', [${roles}], async (req, res) => {
			${code}
	});`;

		result.push(s);

	});
	return result.join('\n\n');
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
		result.resultType = '{ ' + propname + ': ' + proptype + ' }';
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
		result.respondCall = 'binary(req, res, result)';
	} else if (!result.resultType) {
		result.respondCall = 'ok(req, res)';
	} else {
		result.respondCall = 'data(req, res, result)';
	}
	return result;
}

async function run(): Promise<void> {
	const apicalls: Array<ApiCall> = await getSubsonicApiCalls(basePath);
	const collectRoles: Array<string> = [];
	const publicAccess: Array<MustacheDataRegisterFunction> = [];
	apicalls.forEach(call => {
		(call.roles || []).forEach(role => {
			if (!collectRoles.includes(role)) {
				collectRoles.push(role);
			}
		});
		publicAccess.push(generateRegisterFunction(call));
	});
	const roles = collectRoles.map(r => `'${r}'`).join(' | ');
	const template = Mustache.render((await fse.readFile('../templates/subsonic-routes.ts.template')).toString(), {publicAccess, roles});
	await fse.writeFile(destfile, template);
}

run()
	.then(() => {
		console.log('👍', destfile, 'written');
	})
	.catch(e => {
		console.error(e);
	});
