import {getJamApiCalls, IApiCall} from './utils';
import path from 'path';
import fse from 'fs-extra';

const destPath = '../../dist/';
const destfile = path.resolve(destPath, 'jam.service.ts');
const basePath = path.resolve('../../src/model/');

async function run() {

	const calls: Array<IApiCall> = await getJamApiCalls(basePath);
	const resultAPI: Array<string> = [];
	calls.forEach(call => {
		if (call.aliasFor) {
			return;
		}
		const callname = call.name.replace(/\//g, '_');
		if (call.upload) {
			console.log(call.name, call.upload);
			const params = (call.paramType ? 'params: ' + call.paramType : '');
			const callvalue = (call.paramType ? 'params' : '{}');
			const s = `	${callname}(${params}, file: File): Observable<HttpEvent<any>> {
		return this.upload('${call.name}', ${callvalue}, '${call.upload}', file);
	}`;
			resultAPI.push(s);
		} else if (call.binaryResult) {
			if (call.paramType) {
				const s = `	${callname}_url(params: ${call.paramType}): string {
		return this.buildRequestUrl('${call.name}', params);
	}`;
				resultAPI.push(s);
				const s1 = `	async ${callname}_binary(params: ${call.paramType}): Promise<ArrayBuffer> {
		return await this.binary('${call.name}', params);
	}`;
				resultAPI.push(s1);
			} else if (call.pathParams && call.pathParams.parameters) {
				const params = call.pathParams.parameters.map(para => para.name + (para.required ? '' : '?') + ': ' + para.type).join(', ');
				const basename = call.name.split('/')[0];
				const parampath = call.pathParams.parameters.map(para => {
					if (para.required) {
						return (para.prefix ? ' \'' + para.prefix + '\' + ' : '') + para.name + (para.type !== 'string' ? '.toString()' : '');
					} else {
						return '(' + para.name + ' !== undefined ? ' + (para.prefix ? ' \'' + para.prefix + '\' + ' : '') + para.name + (para.type !== 'string' ? '.toString()' : '') + ' : \'\')';
					}
				}).join(' + ');
				const s = `	${basename}_url(${params}): string {
		return this.buildRequestUrl('${basename}/' + ${parampath});
	}`;
				resultAPI.push(s);
				const s1 = `	${basename}_binary(${params}): Promise<ArrayBuffer> {
		return this.binary('${basename}/' + ${parampath});
	}`;
				resultAPI.push(s1);
			} else if (call.pathParams) {
				const s = `	${callname}_url(params: ${call.pathParams.paramType}): string {
		return this.buildRequestUrl('${call.name}', params);
	}`;
				resultAPI.push(s);
				const s1 = `	${callname}_binary(params: ${call.pathParams.paramType}): Promise<ArrayBuffer> {
		return this.binary('${call.name}', params);
	}`;
				resultAPI.push(s1);
			}
		} else if (!call.resultType) {
			const params = (call.paramType ? 'params: ' + call.paramType : '');
			const method = (call.method === 'post' ? 'requestPostDataOK' : 'requestOK');
			const callvalue = (call.paramType ? 'params' : '{}');
			const s = `	async ${callname}(${params}): Promise<void> {
		await this.${method}('${call.name}', ${callvalue});
	}`;
			resultAPI.push(s);
		} else {
			const params = (call.paramType ? 'params: ' + call.paramType : '');
			const method = (call.method === 'post' ? 'requestPostData' : 'requestData');
			const callvalue = (call.paramType ? 'params' : '{}');
			const s = `	async ${callname}(${params}): Promise<${call.resultType}> {
		return await this.${method}<${call.resultType}>('${call.name}', ${callvalue});
	}`;
			resultAPI.push(s);
		}
	});
	const result = `/** generated api */

import {Injectable} from '@angular/core';
import {HttpEvent} from '@angular/common/http';
import {NotificationService} from '../notification/notification.service';
import {Observable} from 'rxjs';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {LastFM} from '../../model/lastfm-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {AuthService} from '../auth/auth.service';
import {HttpService} from '../http/http.service';
import {JamServiceBase} from './jam.service.base';

@Injectable()
export class JamService extends JamServiceBase {

	constructor(http: HttpService, notify: NotificationService, auth: AuthService) {
		super(http, notify, auth);
	}

${resultAPI.join('\n\n')}

		}
`;

	await fse.writeFile(destfile, result);
}

run()
	.then(() => {
		console.log(destfile, 'written');
	})
	.catch(e => {
		console.error(e);
	});
