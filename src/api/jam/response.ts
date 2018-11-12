import express from 'express';
import {IApiBinaryResult, NodeError} from '../../typings';
import path from 'path';

export class ApiResponder {

	public static ok(res: express.Response) {
		res.status(200).json({});
	}

	public static data(res: express.Response, data: any) {
		res.status(200).json(data);
	}

	public static error(res: express.Response, err: NodeError) {
		const msg = (typeof err === 'string' ? err : (err.message || 'Guru Meditation')).toString();
		const code = (typeof err.failCode === 'number' ? err.failCode : 500);
		res.status(code || 500).json({error: msg});
	}

	public static binary(res: express.Response, data: IApiBinaryResult) {
		if (data.json) {
			res.status(200).json(data.json);
		} else if (data.pipe) {
			data.pipe.pipe(res);
		} else if (data.buffer) {
			res.set('Content-Type', data.buffer.contentType);
			res.set('Content-Length', data.buffer.buffer.length.toString());
// 			res.set('Cache-Control', 'public, max-age=' + config.max_age);
			res.status(200).send(data.buffer.buffer);
		} else if (data.file) {
			res.sendFile(data.file.filename, data.file.name || path.basename(data.file.filename));
		}
	}
}
