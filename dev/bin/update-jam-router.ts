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
		method: call.method,
		apiPath: call.name,
		apiPathCheck: '',
		parameterType: call.paramType || '{}',
		parameterSource: 'query',
		resultType: '',
		controllerCall: call.operationId,
		respondCall: '',
		callRoles: '',
		upload: call.upload || ''
	};
	if (call.pathParams) {
		result.parameterSource = 'params';
	} else if (call.method === 'post') {
		result.parameterSource = 'body';
	}
	if (call.upload) {
		result.method = 'upload';
	}
	if (call.resultType) {
		result.resultType = call.resultType;
	}
	if (call.binaryResult) {
		result.resultType = 'ApiBinaryResult';
	}
	// result.upload = (call.upload ? ', file: req.file ? req.file.path : undefined' : '') + (call.upload ? ', fileType: req.file ? req.file.mimetype : undefined' : '');
	if (call.pathParams) {
		// name = call.name.replace(/}/g, '').replace(/{/g, ':');
		const list = call.name.split('/');
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
	/*
		let datasouce = 'req.query';
		if (call.pathParams) {
			datasouce = 'req.params';
		} else if (call.method === 'post') {
			datasouce = 'req.body';
		}

		const options = '{query: ' + datasouce + ', user: req.user, client: req.client' + (call.upload ? ', file: req.file ? req.file.path : undefined' : '') + (call.upload ? ', fileType: req.file ? req.file.mimetype : undefined' : '') + '}';

		let name = call.name;
		const operation = 'api.' + call.operationId;
		let paramType = call.paramType || '{}';
		let resultType = call.resultType;
		if (call.binaryResult) {
			resultType = 'ApiBinaryResult';
		}
		let operationSuffix = '';
		if (call.pathParams) {
			name = call.name.replace(/}/g, '').replace(/{/g, ':');
			const list = name.split('/');
			list.pop();
			list.push(':pathParameter');
			name = list.join('/');
			paramType = '{pathParameter: string}';
			operationSuffix = 'ByPathParameter';
		}
		let code = `const options: JamRequest<${paramType}> = ${options};`;
		if (resultType) {
			code += `\n\tconst result: ${resultType} = await ${operation}${operationSuffix}(options);`;
		} else {
			code += `\n\tawait ${operation}(options);`;
		}
		if (call.binaryResult) {
			code += '\n\tawait ApiResponder.binary(res, result);';
		} else if (!call.resultType) {
			code += '\n\tawait ApiResponder.ok(res);';
		} else {
			code += '\n\tawait ApiResponder.data(res, result);';
		}
		code = code.replace(/\n/g, '\n\t');
		const upload = call.upload ? ` '${call.upload}',` : '';
		let method = call.method;
		if (call.upload) {
			method = 'upload';
		}
		let apicheck = '';
		if (call.name !== name || call.roles.length > 0) {
			apicheck = `, '/${call.name}'`;
		}
		if (call.roles.length > 0) {
			apicheck += `, ${JSON.stringify(call.roles).replace(/"/g, '\'')}`;
		}
		const s = `	register.${method}('/${name}',${upload} async (req, res) => {
			${code}
		}${apicheck});`;
		return s;

	 */
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
