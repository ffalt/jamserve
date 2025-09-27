// @generated
// This file was automatically generated and should not be edited.

import { type HttpEvent, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { JamAuthService } from './jam.auth.service';
import { type HTTPResponseType, JamHttpService } from './jam.http.service';

type GenericParameters = Record<string, string | Array<string> | undefined>;

@Injectable()
export class JamBaseService {
	private readonly http = inject(JamHttpService);
	private readonly authService = inject(JamAuthService);

	buildRequest(view: string, params: GenericParameters = {}, forDOM: boolean = true): { url: string; parameters: HttpParams } {
		if (forDOM && this.authService.auth?.token) {
			params.bearer = this.authService.auth.token;
		}
		let result = new HttpParams();
		for (const key of Object.keys(params)) {
			if (params[key] !== undefined) {
				if (Array.isArray(params[key])) {
					for (const sub of params[key]) {
						result = result.append(key, sub);
					}
				} else {
					result = result.append(key, params[key]);
				}
			}
		}
		return { url: `${this.authService.auth?.server}${JamAuthService.apiPrefix}${view}`, parameters: result };
	}

	buildUrl(view: string, params: unknown, forDOM: boolean): string {
		const { url, parameters } = this.buildRequest(view, params as GenericParameters, forDOM);
		const flat = parameters.toString();
		return url + (flat ? `?${flat}` : '');
	}

	async raw(view: string, params?: unknown): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		const { url, parameters } = this.buildRequest(view, params as GenericParameters, false);
		return this.http.raw(url, { ...this.authService.getHTTPOptions(), params: parameters });
	}

	async get<T>(view: string, params: unknown, responseType?: HTTPResponseType): Promise<T> {
		const { url, parameters } = this.buildRequest(view, params as GenericParameters, false);
		return this.http.get(url, { ...this.authService.getHTTPOptions(), responseType, params: parameters });
	}

	async post<T>(view: string, params: unknown, body: any): Promise<T> {
		return this.http.post<T>(this.buildUrl(view, params, false), body, this.authService.getHTTPOptions());
	}

	async requestString(path: string, params: unknown): Promise<string> {
		if (!this.authService.isLoggedIn()) {
			return Promise.reject(new Error('Not logged in'));
		}
		return this.get<string>(path, params, 'text');
	}

	async requestData<T>(path: string, params: unknown): Promise<T> {
		if (!this.authService.isLoggedIn()) {
			return Promise.reject(new Error('Not logged in'));
		}
		return this.get<T>(path, params);
	}

	async requestPostData<T>(path: string, params: unknown): Promise<T> {
		if (!this.authService.isLoggedIn()) {
			return Promise.reject(new Error('Not logged in'));
		}
		return this.post<T>(path, {}, params);
	}

	async requestPostDataOK(path: string, params: unknown): Promise<void> {
		await this.requestPostData(path, params);
	}

	async requestOK(path: string, params: unknown): Promise<void> {
		await this.requestData(path, params);
	}

	buildRequestUrl(view: string, params?: unknown, forDom: boolean = true): string {
		return this.buildUrl(view, params, forDom);
	}

	async binary(path: string, params?: unknown): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		if (!this.authService.isLoggedIn()) {
			return Promise.reject(new Error('Not logged in'));
		}
		return this.raw(path, params);
	}

	upload<T>(path: string, params: unknown, name: string, file: File): Observable<HttpEvent<T>> {
		const formData = new FormData();
		const data = params as Record<string, string>;
		for (const key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		formData.append(name, file);
		const url = this.buildUrl(path, {}, false);
		const options = this.authService.getHTTPOptions();
		options.reportProgress = true;
		return this.http.postObserve<T>(url, formData, options);
	}
}
