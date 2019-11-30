// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {HttpEvent, HttpSentEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {JamAuthService} from './jam.auth.service';
import {JamHttpService} from './jam.http.service';
import {JamParameters} from './model/jam-rest-params';

@Injectable()
export class JamBaseService {

	constructor(private http: JamHttpService, private authService: JamAuthService) {
	}

	static flattenParams(params: any): string {
		const result: Array<string> = [];
		Object.keys(params).forEach(key => {
			const val = params[key];
			if (val !== undefined) {
				switch (typeof val) {
					case 'number':
					case 'string':
						result.push(`${key}=${encodeURIComponent(val)}`);
						break;
					case 'boolean':
						result.push(`${key}=${val ? 'true' : 'false'}`);
						break;
					case 'object':
						if (Array.isArray(val)) {
							val.forEach((v: string) => {
								result.push(`${key}=${encodeURIComponent(v)}`);
							});
						}
						break;
					default:
						break;
				}
			}
		});
		if (result.length) {
			return `?${result.join('&')}`;
		}
		return '';
	}

	buildUrl(view: string, params: any, forDOM: boolean): string {
		const buildParams = params || {};
		if (forDOM && this.authService.auth.token) {
			buildParams.bearer = this.authService.auth.token;
		}
		return this.authService.auth.server + this.authService.apiPrefix + view + JamBaseService.flattenParams(buildParams);
	}

	async raw(view: string, params: any): Promise<ArrayBuffer> {
		return this.http.raw(this.buildUrl(view, params, false), this.authService.getHTTPOptions());
	}

	async get<T>(view: string, params: any): Promise<T> {
		return this.http.get<T>(this.buildUrl(view, params, false), this.authService.getHTTPOptions());
	}

	async post<T>(view: string, params: any, body: any): Promise<T> {
		return this.http.post<T>(this.buildUrl(view, params, false), body, this.authService.getHTTPOptions());
	}

	async requestData<T>(path: string, params: any): Promise<T> {
		if (!this.authService.isLoggedIn()) {
			return Promise.reject(Error('Not logged in'));
		}
		return this.get<T>(path, params);
	}

	async requestPostData<T>(path: string, params: any): Promise<T> {
		if (!this.authService.isLoggedIn()) {
			return Promise.reject(Error('Not logged in'));
		}
		return this.post<T>(path, {}, params);
	}

	async requestPostDataOK(path: string, params: any): Promise<void> {
		await this.requestPostData<{}>(path, params);
	}

	async requestOK(path: string, params: any): Promise<void> {
		await this.requestData<{}>(path, params);
	}

	buildRequestUrl(view: string, params?: any): string {
		return this.buildUrl(view, params, true);
	}

	async binary(path: string, params?: any): Promise<ArrayBuffer> {
		if (!this.authService.isLoggedIn()) {
			return Promise.reject(Error('Not logged in'));
		}
		return this.raw(path, params);
	}

	upload(path: string, params: any, name: string, file: File): Observable<HttpEvent<HttpSentEvent>> {
		const formData = new FormData();
		Object.keys(params)
			.forEach(key => {
				formData.append(key, params[key]);
			});
		formData.append(name, file);
		const url = this.buildUrl(path, {}, false);
		const options = this.authService.getHTTPOptions();
		options.reportProgress = true;
		return this.http.postObserve(url, formData, options);
	}

	async fav(type: string, params: JamParameters.Fav): Promise<void> {
		await this.requestPostDataOK(`${type}/fav/update`, params);
	}

	async rate(type: string, params: JamParameters.Rate): Promise<void> {
		await this.requestPostDataOK(`${type}/rate/update`, params);
	}

	image_url(id: string, size?: number, format?: JamParameters.ImageFormatType): string {
		if ((!id) || (id.length === 0)) {
			return '';
		}
		const s = (size !== undefined ? `-${size.toString()}` : '');
		return this.buildRequestUrl(`image/${id}${s}` + (format ? '.' + format : ''));
	}

}
