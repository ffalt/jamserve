// @generated
// This file was automatically generated and should not be edited.

import axios, {AxiosRequestConfig, AxiosRequestHeaders} from 'axios';

export interface HttpHeaders {
	Authorization?: string;
}

export interface HTTPOptions {
	headers?: HttpHeaders;
	params?: any;
	reportProgress?: boolean;
	withCredentials?: boolean;
}

async function handleError(e: any): Promise<any> {
	console.error(e);
	if (e.status === 0) {
		return Promise.reject(Error('Could not reach server'));
	}
	return Promise.reject(e);
}

export class JamHttpService {

	async raw(url: string, options: HTTPOptions): Promise<{buffer: ArrayBuffer; contentType: string}> {
		try {
			const opts:AxiosRequestConfig<any> = {
				headers: options.headers as AxiosRequestHeaders,
				params: options.params,
				// reportProgress: options.reportProgress,
				responseType: 'arraybuffer' as const,
				withCredentials: options.withCredentials
			};
			const result = await axios.get(url, opts);
			return {buffer: result.data, contentType: result.headers['content-type']};
		} catch (e: any) {
			return handleError(e);
		}
	}

	async get<T>(url: string, options: HTTPOptions): Promise<T> {
		try {
			const result = await axios.get(url, {params: options.params, headers: options.headers as AxiosRequestHeaders, withCredentials: options.withCredentials});
			return result.data;
		} catch (e: any) {
			return handleError(e);
		}
	}

	async post<T>(url: string, body: any, options: HTTPOptions): Promise<T> {
		try {
			const result = await axios.post(
				url,
				body,
				{params: options.params, headers: options.headers as AxiosRequestHeaders, withCredentials: options.withCredentials}
			);
			return result.data;
		} catch (e: any) {
			return handleError(e);
		}
	}

	async postObserve<T>(url: string, body: any, options: HTTPOptions, onUploadProgress: (progressEvent: any) => void): Promise<T> {
		try {
			const result = await axios.post(
				url,
				body,
				{
					params: options.params,
					headers: options.headers as AxiosRequestHeaders,
					onUploadProgress,
					withCredentials: options.withCredentials
				}
			);
			return result.data;
		} catch (e: any) {
			return handleError(e);
		}
	}

}
