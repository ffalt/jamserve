import fse from 'fs-extra';
import Mustache from 'mustache';
import path from 'path';
import {ApiCall, getJamApiCalls} from './utils';

const destPath = '../../dist/';
const destfile = '/Users/ffalt/Projekte/own/jam/berry/src/app/services/jam/jam.service.ts';//path.resolve(destPath, 'jam.serviceB.ts');
const basePath = path.resolve('../../src/model/');

interface MustacheDataClientCallFunction {
	name: string;
	paramName: string;
	paramsType: string;
	resultType: string;
	baseFunc: string;
	baseFuncResultType: string,
	baseFuncParameters: string;
	apiPath: string;
	apiPathTemplate?: boolean;
	sync?: boolean;
}

function generateClientCall(call: ApiCall): Array<MustacheDataClientCallFunction> {
	const name = call.name.replace(/\//g, '_');
	if (call.upload) {
		return [{
			name,
			paramsType: '',
			paramName: 'params: ' + call.paramType + ', file: File',
			resultType: 'Observable<HttpEvent<any>>',
			baseFuncResultType: '',
			baseFunc: 'upload',
			baseFuncParameters: `${call.paramType ? 'params' : '{}'}, '${call.upload}', file`,
			apiPath: call.name,
			sync: true
		}];
	}
	if (call.binaryResult) {
		if (call.paramType) {
			return [{
				name: name + '_url',
				paramName: 'params',
				paramsType: call.paramType || '{}',
				resultType: 'string',
				baseFuncResultType: '',
				baseFunc: 'buildRequestUrl',
				baseFuncParameters: 'params',
				apiPath: call.name,
				sync: true
			}, {
				name: name + '_binary',
				paramName: 'params',
				paramsType: call.paramType || '{}',
				resultType: 'ArrayBuffer',
				baseFuncResultType: '',
				baseFunc: 'binary',
				baseFuncParameters: 'params',
				apiPath: call.name
			}];
		}
		if (call.pathParams && call.pathParams.parameters) {
			const params = call.pathParams.parameters.map(para => para.name + (para.required ? '' : '?') + ': ' + para.type).join(', ');
			const basename = call.name.split('/')[0];
			const parampath = call.pathParams.parameters.map(para => {
				if (para.required) {
					return '${' + (para.prefix ? ' \'' + para.prefix + '\' + ' : '') + para.name + (para.type !== 'string' ? '.toString()' : '') + '}';
				}
				const prefix = (para.prefix ? ' \'' + para.prefix + '\' + ' : '');
				const type = para.type !== 'string' ? '.toString()' : '';
				return '${(' + para.name + ' !== undefined ? ' + prefix + para.name + type + ' : \'\')}';
			}).join('');
			return [{
				name: basename + '_url',
				paramName: params,
				paramsType: '',
				resultType: 'string',
				baseFuncResultType: '',
				baseFunc: 'buildRequestUrl',
				baseFuncParameters: '',
				apiPath: basename + '/' + parampath,
				apiPathTemplate: true,
				sync: true
			}, {
				name: basename + '_binary',
				paramName: params,
				paramsType: '',
				resultType: 'ArrayBuffer',
				baseFuncResultType: '',
				baseFunc: 'binary',
				baseFuncParameters: '',
				apiPathTemplate: true,
				apiPath: basename + '/' + parampath
			}];
			// const s = `	${basename}_url(${params}): string {
			// 	return this.buildRequestUrl(\`${basename}/${parampath}\`);
			// }`;
			// 		resultAPI.push(s);
			// 		const s1 = `	async ${basename}_binary(${params}): Promise<ArrayBuffer> {
			// 	return this.binary(\`${basename}/${parampath}\`);
			// }`;
			// 		resultAPI.push(s1);
		}
		if (call.pathParams) {
			return [{
				name: name + '_url',
				paramName: 'params',
				paramsType: call.pathParams.paramType || '{}',
				resultType: 'string',
				baseFuncResultType: '',
				baseFunc: 'buildRequestUrl',
				baseFuncParameters: 'params',
				apiPath: call.name,
				sync: true
			}, {
				name: name + '_binary',
				paramName: 'params',
				paramsType: call.pathParams.paramType || '{}',
				resultType: 'ArrayBuffer',
				baseFuncResultType: '',
				baseFunc: 'binary',
				baseFuncParameters: 'params',
				apiPath: call.name
			}];
		}
		return [];
	}
	if (!call.resultType) {
		return [{
			name,
			paramName: call.paramType ? 'params' : '',
			paramsType: call.paramType || '',
			resultType: 'void',
			baseFuncResultType: '',
			baseFunc: (call.method === 'post' ? 'requestPostDataOK' : 'requestOK'),
			baseFuncParameters: call.paramType ? 'params' : '{}',
			apiPath: call.name
		}];
	}
	return [{
		name,
		paramName: call.paramType ? 'params' : '',
		paramsType: call.paramType || '',
		resultType: call.resultType,
		baseFuncResultType: call.resultType,
		baseFunc: (call.method === 'post' ? 'requestPostData' : 'requestData'),
		baseFuncParameters: call.paramType ? 'params' : '{}',
		apiPath: call.name
	}];
}

async function run(): Promise<void> {
	const calls: Array<ApiCall> = await getJamApiCalls(basePath);
	let list: Array<MustacheDataClientCallFunction> = [];
	for (const call of calls) {
		if (!call.aliasFor) {
			list = list.concat(generateClientCall(call));
		}
	}
	const template = Mustache.render((await fse.readFile('../templates/jam-client.ts.template')).toString(), {list});
	await fse.writeFile(destfile, template);
}

run()
	.then(() => {
		console.log('👍', destfile, 'written');
	})
	.catch(e => {
		console.error(e);
	});

