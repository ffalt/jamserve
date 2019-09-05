import fse from 'fs-extra';
import path from 'path';
import {ApiBinaryResult} from '../../src/typings';
import {ApiCall, getSubsonicApiCalls} from './utils';

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

async function run(): Promise<void> {
	const apicalls: Array<ApiCall> = await getSubsonicApiCalls(basePath);
	const collectRoles: Array<string> = [];
	apicalls.forEach(call => {
		(call.roles || []).forEach(role => {
			if (!collectRoles.includes(role)) {
				collectRoles.push(role);
			}
		});
	});
	const roles = collectRoles.map(r => `'${r}'`).join(' | ');
	const userApi = generateCode(apicalls);

	const ts = `// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import express from 'express';
import {Subsonic} from '../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../model/subsonic-rest-params';
import {ApiBinaryResult} from '../../typings';
import {ApiOptions, SubsonicApi} from './api';
import {UserRequest} from './login';
import {ApiResponder} from './response';

export type SubSonicRole = ${roles};
export type RegisterCallback = (req: UserRequest, res: express.Response) => Promise<void>;
export interface Register {
	all: (name: string, roles: Array<SubSonicRole>, execute: RegisterCallback) => void;
}

export function registerApi(register: Register, api: SubsonicApi): void {
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
