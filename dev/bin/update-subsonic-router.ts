import {getSubsonicApiCalls, IApiCall} from './utils';
import path from 'path';
import {IApiBinaryResult} from '../../src/typings';
import fse from 'fs-extra';

const destPath = '../../src/api/subsonic/';
const destfile = path.resolve(destPath, 'routes.ts');
const basePath = path.resolve('../../src/model/');

function generateCode(calls: Array<IApiCall>): string {
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
			resultType = 'IApiBinaryResult';
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
			roles = call.roles.map(r => `roles.${r}`).join(', ') + ', ';
		}
		const s = `	router.all('/${name}', ${roles}apiCheck('/${call.name}'), async (req, res) => {
		try {
			${code}
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});`;

		result.push(s);

	});
	return result.join('\n\n');
}

async function run() {
	const apicalls: Array<IApiCall> = await getSubsonicApiCalls(basePath);
	const roles: Array<string> = [];
	apicalls.forEach(call => {
		(call.roles || []).forEach(role => {
			if (roles.indexOf(role) < 0) {
				roles.push(role);
			}
		});
	});
	const userApi = generateCode(apicalls);

	const rolesType = 'export interface SubsonicRolesHandler {\n' + roles.map(role => '\t' + role + ': express.RequestHandler;').join('\n') + '\n}';

	const ts = `import {Subsonic} from '../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../model/subsonic-rest-params';
import {SubsonicApi, ApiOptions} from './api';
import {ApiResponder} from './response';
import express from 'express';
import {IApiBinaryResult} from '../../typings';
import {apiCheck} from './check';

${rolesType}

export function registerApi(router: express.Router, api: SubsonicApi, roles: SubsonicRolesHandler): void {
${userApi}
}
`;

	await fse.writeFile(destfile, ts);
}

run()
	.then(() => {
		console.log(destfile, 'written');
	})
	.catch(e => {
		console.error(e);
	});
