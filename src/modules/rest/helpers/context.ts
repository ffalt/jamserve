import express from 'express';

export interface RestContext<USER, ORM, ENGINE> {
	req: express.Request;
	res: express.Response;
	next: express.NextFunction;
	user: USER;
	orm: ORM;
	engine: ENGINE;
}
