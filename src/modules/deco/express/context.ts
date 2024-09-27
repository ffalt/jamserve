import {NextFunction, Request, Response} from 'express';

export interface RestContext<USER, ORM, ENGINE> {
	req: Request;
	res: Response;
	next: NextFunction;
	user: USER;
	orm: ORM;
	engine: ENGINE;
	client?: string;
}
