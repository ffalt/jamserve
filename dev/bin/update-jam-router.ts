import {getJamApiCalls, IApiCall} from './utils';
import path from 'path';
import {IApiBinaryResult} from '../../src/typings';
import {fileWrite} from '../../src/utils/fs-utils';

const destPath = '../../src/api/jam/';
const destfile = path.resolve(destPath, 'routes.ts');

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
		let operation = 'api.' + call.operationId;
		let paramType = call.paramType || '{}';
		let resultType = call.resultType;
		if (call.binaryResult) {
			resultType = 'IApiBinaryResult';
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
			code += '\n\tawait ApiResponder.binary(res, result);';
		} else if (!call.resultType) {
			code += '\n\tawait ApiResponder.ok(res);';
		} else {
			code += '\n\tawait ApiResponder.data(res, result);';
		}
		code = code.replace(/\n/g, '\n\t\t');
		const upload = call.upload ? call.upload + ', uploadAutoRemove, ' : '';
		const apicheck = `apiCheck('/${call.name}'),`;
		const s = `	router.${call.method}('/${name}', ${upload}${apicheck} async (req, res) => {
		try {
			${code}
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});`;

		result.push(s);
	});
	return result.join('\n\n');
}

async function run() {
	const apicalls: Array<IApiCall> = await getJamApiCalls();
	const publicApi = generateCode(apicalls.filter(call => call.isPublic));
	const adminApi = generateCode(apicalls.filter(call => call.needsAdmin));
	const userApi = generateCode(apicalls.filter(call => !call.needsAdmin && !call.isPublic));

	const ts = `import {Jam} from '../../model/jam-rest-data-0.1.0';
import {MusicBrainz} from '../../model/musicbrainz-rest-data-2.0';
import {Acoustid} from '../../model/acoustid-rest-data-2.0';
import {LastFM} from '../../model/lastfm-rest-data-2.0';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {ApiJam, ApiOptions} from './api';
import {ApiResponder} from './response';
import express from 'express';
import {IApiBinaryResult} from '../../typings';
import {apiCheck} from './check';

export function registerPublicApi(router: express.Router, api: ApiJam): void {
${publicApi}
}

export function registerUserApi(router: express.Router, api: ApiJam, image: express.RequestHandler, uploadAutoRemove: express.RequestHandler): void {
${userApi}
}

export function registerAdminApi(router: express.Router, api: ApiJam, image: express.RequestHandler, uploadAutoRemove: express.RequestHandler): void {
${adminApi}
}
`;

	await fileWrite(destfile, ts);
}

run()
	.then(() => {
		console.log(destfile, 'written');
	})
	.catch(e => {
		console.error(e);
	});
