// @generated
// This file was automatically generated and should not be edited.

import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpSentEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface HTTPOptions {
	headers?: HttpHeaders;
	params?: HttpParams;
	reportProgress?: boolean;
	withCredentials?: boolean;
	responseType?: 'arraybuffer' | 'text' |  'json';
}

async function handleError(e): Promise<any> {
	console.error(e);
	if (e.status === 0) {
		return Promise.reject(Error('Could not reach server'));
	}
	return Promise.reject(e);
}

@Injectable()
export class JamHttpService {

	constructor(public client: HttpClient) {
	}

	async raw(url: string, options: HTTPOptions): Promise<ArrayBuffer> {
		try {
			const opts = {
				headers: options.headers,
				params: options.params,
				reportProgress: options.reportProgress,
				responseType: 'arraybuffer' as const,
				withCredentials: options.withCredentials
			};

			return await this.client.get(url, opts).toPromise();
		} catch (e) {
			return handleError(e);
		}
	}

	async get<T>(url: string, options: HTTPOptions): Promise<T> {
		try {
			return await this.client.get<T>(url,
				{
					params: options.params, headers: options.headers, reportProgress: options.reportProgress,
					withCredentials: options.withCredentials, responseType: options.responseType as 'json'
				}
			).toPromise();
		} catch (e) {
			return handleError(e);
		}
	}

	async post<T>(url: string, body: any, options: HTTPOptions): Promise<T> {
		try {
			return await this.client.post<T>(url, body,
				{params: options.params, headers: options.headers, reportProgress: options.reportProgress, withCredentials: options.withCredentials}
			).toPromise();
		} catch (e) {
			return handleError(e);
		}
	}

	postObserve(url: string, body: any, options: HTTPOptions): Observable<HttpEvent<HttpSentEvent>> {
		return this.client.request(new HttpRequest('POST', url, body, {
			params: options.params,
			headers: options.headers,
			reportProgress: options.reportProgress,
			withCredentials: options.withCredentials
		}));
	}

}
