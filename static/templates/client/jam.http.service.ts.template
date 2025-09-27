// @generated
// This file was automatically generated and should not be edited.

import { HttpClient, HttpErrorResponse, type HttpEvent, type HttpHeaders, type HttpParams, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, type Observable } from 'rxjs';

export type HTTPResponseType = 'arraybuffer' | 'text' | 'json';

export interface HTTPOptions {
	headers?: HttpHeaders;
	params?: HttpParams;
	reportProgress?: boolean;
	withCredentials?: boolean;
	responseType?: HTTPResponseType;
}

function handleError(error: unknown): never {
	console.error(error);
	if (error instanceof HttpErrorResponse && error.status === 0) {
		throw new Error('Could not reach server');
	}
	throw error;
}

@Injectable()
export class JamHttpService {
	readonly client = inject(HttpClient);

	async raw(url: string, options: HTTPOptions): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		try {
			return await new Promise<{ buffer: ArrayBuffer; contentType: string }>((resolve, reject) => {
				this.client.get<ArrayBuffer>(url, {
					headers: options.headers,
					params: options.params,
					reportProgress: options.reportProgress,
					responseType: 'arraybuffer' as 'json', // angular not detecting overload type for {responseType: 'arraybuffer', observe: 'response'}
					withCredentials: options.withCredentials,
					observe: 'response'
				})
					.subscribe(result => {
						if (!result.body) {
							reject(new Error('Invalid Binary Server Response'));
							return;
						}
						resolve({ buffer: result.body, contentType: result.headers.get('content-type') ?? 'invalid' });
					});
			});
		} catch (error: unknown) {
			handleError(error);
		}
	}

	async get<T>(url: string, options: HTTPOptions): Promise<T> {
		try {
			return await firstValueFrom(this.client.get<T>(url,
				{
					params: options.params, headers: options.headers, reportProgress: options.reportProgress,
					withCredentials: options.withCredentials, responseType: options.responseType as 'json'
				}
			));
		} catch (error: unknown) {
			handleError(error);
		}
	}

	async post<T>(url: string, body: any, options: HTTPOptions): Promise<T> {
		try {
			return await firstValueFrom(this.client.post<T>(url, body,
				{ params: options.params, headers: options.headers, reportProgress: options.reportProgress, withCredentials: options.withCredentials }
			));
		} catch (error: unknown) {
			handleError(error);
		}
	}

	postObserve<T>(url: string, body: any, options: HTTPOptions): Observable<HttpEvent<T>> {
		return this.client.request<T>(new HttpRequest('POST', url, body, {
			params: options.params,
			headers: options.headers,
			reportProgress: options.reportProgress,
			withCredentials: options.withCredentials
		}));
	}
}
