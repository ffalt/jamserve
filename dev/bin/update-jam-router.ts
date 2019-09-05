import fse from 'fs-extra';
import path from 'path';
import {ApiBinaryResult} from '../../src/typings';
import {ApiCall, getJamApiCalls} from './utils';

const destPath = '../../src/api/jam/';
const destfile = path.resolve(destPath, 'routes.ts');
const basePath = path.resolve('../../src/model/');

function generateCode(calls: Array<ApiCall>): string {
	const result: Array<string> = [];
	calls.forEach(call => {
		if (['login', 'logout'].includes(call.name)) {
			return;
		}
		let datasouce = 'req.query';
		if (call.pathParams) {
			datasouce = 'req.params';
		} else if (call.method === 'post') {
			datasouce = 'req.body';
		}

		const options = '{query: ' + datasouce + ', user: req.user, client: req.client' + (call.upload ? ', file: req.file ? req.file.path : undefined' : '')  + (call.upload ? ', fileType: req.file ? req.file.mimetype : undefined' : '') + '}';

		let name = call.name;
		const operation = 'api.' + call.operationId;
		let paramType = call.paramType || '{}';
		let resultType = call.resultType;
		if (call.binaryResult) {
			resultType = 'ApiBinaryResult';
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

async function run(): Promise<void> {
	const apicalls: Array<ApiCall> = await getJamApiCalls(basePath);
	const publicApi = generateCode(apicalls.filter(call => call.isPublic));
	const accessControlApi = generateCode(apicalls.filter(call => !call.isPublic));
	const collectRoles: Array<string> = [];
	apicalls.forEach(call => {
		(call.roles || []).forEach(role => {
			if (!collectRoles.includes(role)) {
				collectRoles.push(role);
			}
		});
	});
	const roles = collectRoles.map(r => `'${r}'`).join(' | ');

	const ts = `// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import express from 'express';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {CoverArtArchive} from '../../model/coverartarchive-rest-data';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {LastFM} from '../../model/lastfm-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {ApiBinaryResult} from '../../typings';
import {JamApi, JamRequest} from './api';
import {UserRequest} from './login';
import {ApiResponder} from './response';

export type JamApiRole = ${roles};
export type RegisterCallback = (req: UserRequest, res: express.Response) => Promise<void>;
export interface Register {
	get: (name: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<JamApiRole>) => void;
	post: (name: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<JamApiRole>) => void;
	upload: (name: string, field: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<JamApiRole>) => void;
}

export function registerPublicApi(register: Register, api: JamApi): void {
${publicApi}
}

export function registerAccessControlApi(register: Register, api: JamApi): void {
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
