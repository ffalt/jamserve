import express from 'express';

export interface RestContext<T> {
	req: express.Request;
	res: express.Response;
	next: express.NextFunction;
	user: T;
}
