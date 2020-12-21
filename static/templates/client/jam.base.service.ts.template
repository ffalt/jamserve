// @generated
// This file was automatically generated and should not be edited.

import {HttpEvent, HttpParams, HttpSentEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {JamAuthService} from './jam.auth.service';
import {JamHttpService} from './jam.http.service';

@Injectable()
export class JamBaseService {

	constructor(private http: JamHttpService, private authService: JamAuthService) {
	}

	buildRequest(view: string, params: any, forDOM: boolean): { url: string; parameters: HttpParams } {
		const buildParams = params || {};
		if (forDOM && this.authService.auth?.token) {
			buildParams.bearer = this.authService.auth.token;
		}
		let result = new HttpParams();
		for (const key of Object.keys(buildParams)) {
			if (buildParams[key] !== undefined) {
				if (Array.isArray(buildParams[key])) {
					for (const sub of buildParams[key]) {
						result = result.append(key, sub);
					}
				} else {
					result = result.append(key, buildParams[key]);
				}
			}
		}
		return {url: `${this.authService.auth?.server}${JamAuthService.apiPrefix}${view}`, parameters: result};
	}

	buildUrl(view: string, params: any, forDOM: boolean): string {
		const {url, parameters} = this.buildRequest(view, params, forDOM);
		const flat = parameters.toString();
		return url + (flat ? `?${flat}` : '');
	}

	async raw(view: string, params: any): Promise<{buffer: ArrayBuffer; contentType: string}> {
		const {url, parameters} = this.buildRequest(view, params, false);
		return this.http.raw(url, {...this.authService.getHTTPOptions(), params: parameters});
	}

	async get<T>(view: string, params: any, responseType?: any): Promise<T> {
		const {url, parameters} = this.buildRequest(view, params, false);
		return this.http.get(url, {...this.authService.getHTTPOptions(), responseType, params: parameters});
	}

	async post<T>(view: string, params: any, body: any): Promise<T> {
		return this.http.post<T>(this.buildUrl(view, params, false), body, this.authService.getHTTPOptions());
	}

	async requestString(path: string, params: any): Promise<string> {
		if (!this.authService.isLoggedIn()) {
			return Promise.reject(Error('Not logged in'));
		}
		return this.get<string>(path, params, 'text');
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
		await this.requestPostData(path, params);
	}

	async requestOK(path: string, params: any): Promise<void> {
		await this.requestData(path, params);
	}

	buildRequestUrl(view: string, params?: any, forDom: boolean = true): string {
		return this.buildUrl(view, params, forDom);
	}

	async binary(path: string, params?: any): Promise<{ buffer: ArrayBuffer; contentType: string }> {
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
}
