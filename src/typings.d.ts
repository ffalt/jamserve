import express from 'express';

export type NodeError = Error | string | null | undefined | {} | any;
export type NodeErrorCallback = (err?: NodeError) => void;

declare global {
	namespace Express {
		interface Request {
			client?: string;
			jwt: boolean;
		}
	}
}

declare module '*.json' {
	const value: any;
	export default value;
}

export interface StreamData {
	pipe: (stream: express.Response) => void;
}

export interface ApiBinaryResult {
	file?: { filename: string; name: string };
	json?: any;
	pipe?: StreamData;
	buffer?: {
		buffer: Buffer;
		contentType: string;
	};
	name?: string;
}
