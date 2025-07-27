// @generated
// This file was automatically generated and should not be edited.

import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export interface HttpHeaders {
	Authorization?: string;
}

export interface HTTPOptions {
	headers?: HttpHeaders;
	params?: any;
	reportProgress?: boolean;
	withCredentials?: boolean;
}

async function handleError(error: any): Promise<any> {
	console.error(error);
	if (error.status === 0) {
		return Promise.reject(new Error('Could not reach server'));
	}
	return Promise.reject(error);
}

export class JamHttpService {
	async raw(url: string, options: HTTPOptions): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		try {
			const axiosOptions: AxiosRequestConfig = {
				headers: options.headers as AxiosRequestHeaders,
				params: options.params,
				responseType: 'arraybuffer' as const,
				withCredentials: options.withCredentials
			};
			const result = await axios.get(url, axiosOptions);
			return { buffer: result.data, contentType: result.headers['content-type'] ?? '' };
		} catch (error) {
			return handleError(error);
		}
	}

	async get<T>(url: string, options: HTTPOptions): Promise<T> {
		try {
			const result = await axios.get(url, { params: options.params, headers: options.headers as AxiosRequestHeaders, withCredentials: options.withCredentials });
			return result.data;
		} catch (error) {
			return handleError(error);
		}
	}

	async post<T>(url: string, body: any, options: HTTPOptions): Promise<T> {
		try {
			const result = await axios.post(
				url,
				body,
				{
					params: options.params,
					headers: options.headers as AxiosRequestHeaders,
					withCredentials: options.withCredentials
				}
			);
			return result.data;
		} catch (error) {
			return handleError(error);
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
		} catch (error) {
			return handleError(error);
		}
	}
}
