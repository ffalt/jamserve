// @generated
// This file was automatically generated and should not be edited.

import { JamAuthService } from './jam.auth.service';
import { JamHttpService } from './jam.http.service';

type GenericParameters = Record<string, string | Array<string> | undefined>;

export class JamBaseService {
	constructor(private readonly http: JamHttpService, private readonly authService: JamAuthService) {
	}

	buildRequest(view: string, params?: GenericParameters, forDOM: boolean = true): { url: string; parameters: GenericParameters } {
		const buildParams = params ?? {};
		if (forDOM && this.authService.auth?.token) {
			buildParams.bearer = this.authService.auth?.token;
		}
		return { url: this.authService.auth?.server + JamAuthService.apiPrefix + view, parameters: buildParams };
	}

	static flattenParams(params: Record<string, unknown>): string {
		const result: Array<string> = [];
		for (const key of Object.keys(params)) {
			const value = params[key];
			if (value !== undefined) {
				switch (typeof value) {
					case 'number': {
						result.push(`${key}=${value}`);
						break;
					}
					case 'string': {
						result.push(`${key}=${encodeURIComponent(value)}`);
						break;
					}
					case 'boolean': {
						result.push(`${key}=${value ? 'true' : 'false'}`);
						break;
					}
					case 'object': {
						if (Array.isArray(value)) {
							for (const v of value) {
								result.push(`${key}=${encodeURIComponent(v as string)}`);
							}
						}
						break;
					}
					default: {
						break;
					}
				}
			}
		}
		if (result.length > 0) {
			return `${result.join('&')}`;
		}
		return '';
	}

	buildUrl(view: string, params?: unknown, forDOM: boolean = true): string {
		const { url, parameters } = this.buildRequest(view, params as GenericParameters, forDOM);
		const flat = JamBaseService.flattenParams(parameters);
		return url + (flat ? `?${flat}` : '');
	}

	async raw(view: string, params?: unknown): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		const { url, parameters } = this.buildRequest(view, params as GenericParameters, false);
		return this.http.raw(url, { ...this.authService.getHTTPOptions(), params: parameters });
	}

	async get<T>(view: string, params: unknown): Promise<T> {
		const { url, parameters } = this.buildRequest(view, params as GenericParameters, false);
		return this.http.get(url, { ...this.authService.getHTTPOptions(), params: parameters });
	}

	async post<T>(view: string, params: unknown, body: any): Promise<T> {
		return this.http.post<T>(this.buildUrl(view, params, false), body, this.authService.getHTTPOptions());
	}

	async requestData<T>(path: string, params: unknown): Promise<T> {
		if (this.authService.isLoggedIn()) {
			return this.get<T>(path, params);
		}
		return Promise.reject(new Error('Not logged in'));
	}

	async requestPostData<T>(path: string, params: unknown): Promise<T> {
		if (this.authService.isLoggedIn()) {
			return this.post<T>(path, {}, params);
		}
		return Promise.reject(new Error('Not logged in'));
	}

	async requestPostDataOK(path: string, params: unknown): Promise<void> {
		await this.requestPostData<{}>(path, params);
	}

	async requestOK(path: string, params: unknown): Promise<void> {
		await this.requestData<{}>(path, params);
	}

	buildRequestUrl(view: string, params?: unknown, forDom: boolean = true): string {
		return this.buildUrl(view, params, forDom);
	}

	async binary(path: string, params?: unknown): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		if (this.authService.isLoggedIn()) {
			return this.raw(path, params);
		}
		return Promise.reject(new Error('Not logged in'));
	}

	async upload<T>(path: string, params: unknown, name: string, file: any, onUploadProgress: (progressEvent: any) => void): Promise<T> {
		const formData = new FormData();
		const data = params as Record<string, string>;
		for (const key of Object.keys(data)) {
			formData.append(key, data[key]);
		}
		formData.append(name, file);
		const url = this.buildUrl(path, {}, false);
		const options = this.authService.getHTTPOptions();
		options.reportProgress = true;
		return this.http.postObserve<T>(url, formData, options, onUploadProgress);
	}
}
