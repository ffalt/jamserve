import express from 'express';
import {ApiBinaryResult, NodeError} from '../../typings';
import {ApiBaseResponder} from '../response';

export class ApiResponder {

	public static ok(req: express.Request, res: express.Response): void {
		ApiBaseResponder.sendJSON(req, res, {});
	}

	public static data(req: express.Request, res: express.Response, data: any): void {
		ApiBaseResponder.sendJSON(req, res, data);
	}

	public static error(req: express.Request, res: express.Response, err: NodeError): void {
		ApiBaseResponder.sendError(req, res, err);
	}

	public static binary(req: express.Request, res: express.Response, data: ApiBinaryResult): void {
		ApiBaseResponder.sendBinary(req, res, data);
	}
}
