import {getJamApiCalls, IApiCall} from './utils';
import path from 'path';
import {IApiBinaryResult} from '../../src/typings';
import fse from 'fs-extra';

const destPath = '../../src/api/jam/';
const destfile = path.resolve(destPath, 'routes.ts');
const basePath = path.resolve('../../src/model/');

function generateCode(calls: Array<IApiCall>): string {
	const result: Array<string> = [];
	calls.forEach(call => {
		if (['login', 'logout'].indexOf(call.name) >= 0) {
			return;
		}
		let datasouce = 'req.query';
		if (call.pathParams) {
			datasouce = 'req.params';
		} else if (call.method === 'post') {
			datasouce = 'req.body';
		}

		const options = '{query: ' + datasouce + ', user: req.user, client: req.client' + (call.upload ? ', file: req.file ? req.file.path : undefined' : '') + '}';

		let name = call.name;
		const operation = 'api.' + call.operationId;
		let paramType = call.paramType || '{}';
		let resultType = call.resultType;
		if (call.binaryResult) {
			resultType = 'IApiBinaryResult';
		}
		if (call.pathParams) {
			name = call.name.replace(/}/g, '').replace(/{/g, ':');
			paramType = call.pathParams.paramType;
		}
		let code = `const options: JamRequest<${paramType}> = ${options};`;
		if (resultType) {
			code += `\n\tconst result: ${resultType} = await ${operation}(options);`;
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

		result.push(s);
	});
	return result.join('\n\n');
}

async function run() {
	const apicalls: Array<IApiCall> = await getJamApiCalls(basePath);
	const publicApi = generateCode(apicalls.filter(call => call.isPublic));
	const accessControlApi = generateCode(apicalls.filter(call => !call.isPublic));

	const ts = `// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {Jam} from '../../model/jam-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {LastFM} from '../../model/lastfm-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {JamController, JamRequest} from './api';
import {ApiResponder} from './response';
import express from 'express';
import {IApiBinaryResult} from '../../typings';

export type RegisterCallback = (req: express.Request, res: express.Response) => Promise<void>;
export interface Register {
	get: (name: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<string>) => void;
	post: (name: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<string>) => void;
	upload: (name: string, field: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<string>) => void;
}

export function registerPublicApi(register: Register, api: JamController): void {
${publicApi}
}

export function registerAccessControlApi(register: Register, api: JamController): void {
${accessControlApi}
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
