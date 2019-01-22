import request from 'request';
import fs from 'fs';
import * as http from 'http';
import {fileDeleteIfExists} from './fs-utils';

export function downloadFile(url: string, filename: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		request.get(url)
			.on('error', (err: Error) => {
				reject(err);
			})
			.on('complete', (res: { statusCode: number }) => {
				if (res.statusCode !== 200) {
					fileDeleteIfExists(filename).then(() => {
						reject(new Error(http.STATUS_CODES[res.statusCode]));
					}).catch(e => {
						reject(new Error(http.STATUS_CODES[res.statusCode]));
					});
				} else {
					resolve();
				}
			})
			.pipe(fs.createWriteStream(filename));
	});
}
