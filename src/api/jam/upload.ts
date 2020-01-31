import express from 'express';
import multer from 'multer';

import finishedRequest from 'on-finished';
import {fileDeleteIfExists} from '../../utils/fs-utils';
import {logger} from '../../utils/logger';

const log = logger('Jam.Api.Upload');

function registerAutoClean(req: express.Request, res: express.Response): void {
	finishedRequest(res, err => {
		if (err && req.file && req.file.path) {
			fileDeleteIfExists(req.file.path).catch(e => {
				log.error(e);
			});
		}
	});
}

class JamUpload {
	upload: any; // import Multer from 'multer'; TODO: type not importable?

	constructor(tmpPath: string) {
		const dest = `${tmpPath}/`;
		this.upload = multer({dest});
	}

	handler(field: string, autoClean: boolean = true): express.RequestHandler {
		const mu = this.upload.single(field);
		return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
			if (autoClean) {
				registerAutoClean(req, res);
			}
			mu(req, res, next);
		};
	}
}

export function jamUpload(tmpPath: string): JamUpload {
	return new JamUpload(tmpPath);
}
