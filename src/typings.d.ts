import express from 'express';

export type NodeError = Error | string | null | undefined | {} | any;
export type NodeErrorCallback = (err?: NodeError) => void;
export type NodeDataCallback<T> = (err?: NodeError, data?: T) => void;

declare global {
	namespace Express {
		interface Request {
			client?: string;
			jwt: boolean;
		}
	}
}

export interface IStreamData {
	pipe: (stream: express.Response) => void;
}

export interface IApiBinaryResult {
	file?: { filename: string; name: string };
	pipe?: IStreamData;
	buffer?: {
		buffer: Buffer;
		contentType: string;
	};
	name?: string;
}
