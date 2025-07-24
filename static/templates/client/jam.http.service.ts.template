// @generated
// This file was automatically generated and should not be edited.

import {HttpClient, type HttpEvent, type HttpHeaders, type HttpParams, HttpRequest, type HttpSentEvent} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {firstValueFrom, type Observable} from 'rxjs';

export interface HTTPOptions {
	headers?: HttpHeaders;
	params?: HttpParams;
	reportProgress?: boolean;
	withCredentials?: boolean;
	responseType?: 'arraybuffer' | 'text' | 'json';
}

async function handleError(error: any): Promise<any> {
	console.error(error);
	if (error.status === 0) {
		return Promise.reject(new Error('Could not reach server'));
	}
	return Promise.reject(error);
}

@Injectable()
export class JamHttpService {
	readonly client = inject(HttpClient);

	async raw(url: string, options: HTTPOptions): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		try {
			return new Promise<{ buffer: ArrayBuffer; contentType: string }>((resolve, reject) => {
				this.client.get<ArrayBuffer>(url, {
					headers: options.headers,
					params: options.params,
					reportProgress: options.reportProgress,
					responseType: 'arraybuffer' as 'json', // angular not detecting overload type for {responseType: 'arraybuffer', observe: 'response'}
					withCredentials: options.withCredentials,
					observe: 'response'
				})
					.subscribe(res => {
						if (!res?.body) {
							return reject(new Error('Invalid Binary Server Response'));
						}
						resolve({buffer: res.body, contentType: res.headers.get('content-type') || 'invalid'});
					});
			});
		} catch (error) {
			return handleError(error);
		}
	}

	async get<T>(url: string, options: HTTPOptions): Promise<T> {
		try {
			return await firstValueFrom(this.client.get<T>(url,
				{
					params: options.params, headers: options.headers, reportProgress: options.reportProgress,
					withCredentials: options.withCredentials, responseType: options.responseType as 'json'
				}
			)) as Promise<T>;
		} catch (error) {
			return handleError(error);
		}
	}

	async post<T>(url: string, body: any, options: HTTPOptions): Promise<T> {
		try {
			return await firstValueFrom(this.client.post<T>(url, body,
				{params: options.params, headers: options.headers, reportProgress: options.reportProgress, withCredentials: options.withCredentials}
			)) as Promise<T>;
		} catch (error) {
			return handleError(error);
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
