// @generated
// This file was automatically generated and should not be edited.

import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpSentEvent} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {firstValueFrom, Observable} from 'rxjs';

export interface HTTPOptions {
	headers?: HttpHeaders;
	params?: HttpParams;
	reportProgress?: boolean;
	withCredentials?: boolean;
	responseType?: 'arraybuffer' | 'text' | 'json';
}

async function handleError(e: any): Promise<any> {
	console.error(e);
	if (e.status === 0) {
		return Promise.reject(Error('Could not reach server'));
	}
	return Promise.reject(e);
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
							return reject(Error('Invalid Binary Server Response'));
						}
						resolve({buffer: res.body, contentType: res.headers.get('content-type') || 'invalid'});
					});
			});
		} catch (e) {
			return handleError(e);
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
		} catch (e) {
			return handleError(e);
		}
	}

	async post<T>(url: string, body: any, options: HTTPOptions): Promise<T> {
		try {
			return await firstValueFrom(this.client.post<T>(url, body,
				{params: options.params, headers: options.headers, reportProgress: options.reportProgress, withCredentials: options.withCredentials}
			)) as Promise<T>;
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
