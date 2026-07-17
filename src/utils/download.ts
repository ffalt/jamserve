import fs from 'node:fs';
import { Readable } from 'node:stream';
import fetch from 'node-fetch';
import { useAgent } from 'request-filtering-agent';
import { fileDeleteIfExists } from './fs-utils.js';

const DEFAULT_MAX_DOWNLOAD_SIZE = 500 * 1024 * 1024; // 500 MB

export async function downloadFile(url: string, filename: string, maxSize: number = DEFAULT_MAX_DOWNLOAD_SIZE): Promise<string | undefined> {
	const response = await fetch(url, { agent: parsedUrl => useAgent(parsedUrl.href) });
	if (!response.ok) {
		throw new Error(`Unexpected Response ${response.statusText || response.status}`);
	}
	const contentLength = Number(response.headers.get('content-length'));
	if (contentLength && contentLength > maxSize) {
		throw new Error(`Response too large: ${contentLength} bytes exceeds limit of ${maxSize} bytes`);
	}
	// Capture before the body stream is consumed.
	const contentType = response.headers.get('content-type') ?? undefined;
	return new Promise((resolve, reject) => {
		const destination = fs.createWriteStream(filename);
		if (!response.body) {
			destination.destroy();
			reject(new Error('Bad file stream'));
			return;
		}
		const body = response.body as unknown as Readable;
		let received = 0;
		let aborted = false;
		body.on('data', (chunk: Buffer) => {
			received += chunk.length;
			if (!aborted && received > maxSize) {
				aborted = true;
				body.destroy();
				destination.destroy();
				fileDeleteIfExists(filename).catch(() => {
					// ignore cleanup errors
				});
				reject(new Error(`Response too large: exceeded limit of ${maxSize} bytes`));
			}
		});
		body.pipe(destination);
		destination.on('close', () => {
			if (!aborted) {
				resolve(contentType);
			}
		});
		destination.on('error', (error: unknown) => {
			if (aborted) {
				return;
			}
			fileDeleteIfExists(filename).then(() => {
				reject(error);
			}).catch(() => {
				reject(error);
			});
		});
	});
}
