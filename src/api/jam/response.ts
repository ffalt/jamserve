import express from 'express';
import {ApiBinaryResult, NodeError} from '../../typings';
import {ApiBaseResponder} from '../response';

export class ApiResponder {

	public static ok(res: express.Response): void {
		ApiBaseResponder.sendJSON(res, {});
	}

	public static data(res: express.Response, data: any): void {
		ApiBaseResponder.sendJSON(res, data);
	}

	public static error(res: express.Response, err: NodeError): void {
		ApiBaseResponder.sendError(res, err);
	}

	public static binary(res: express.Response, data: ApiBinaryResult): void {
		ApiBaseResponder.sendBinary(res, data);
	}
}
