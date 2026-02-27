import fs from 'node:fs';
import fetch from 'node-fetch';
import { fileDeleteIfExists } from './fs-utils.js';

export async function downloadFile(url: string, filename: string): Promise<void> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Unexpected Response ${response.statusText || response.status}`);
	}
	return new Promise((resolve, reject) => {
		const destination = fs.createWriteStream(filename);
		if (!response.body) {
			destination.destroy();
			reject(new Error('Bad file stream'));
			return;
		}
		response.body.pipe(destination);
		destination.on('close', () => {
			resolve();
		});
		destination.on('error', (error: unknown) => {
			fileDeleteIfExists(filename).then(() => {
				reject(error);
			}).catch(() => {
				reject(error);
			});
		});
	});
}
