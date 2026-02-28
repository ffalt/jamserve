import express from 'express';
import { User } from '../../entity/user/user.js';
import { EngineRequest } from '../server/middlewares/engine.middleware.js';

export interface SubsonicBaseParameters {
	username: string;
	password?: string;
	token?: string;
	salt?: string;
	format: string;
	client: string;
	version: string;
	callback?: string;
}

function processParameters(req: express.Request<any, any, any,
	{
		u?: string;
		p?: string;
		f?: string;
		v?: string;
		t?: string;
		s?: string;
		c?: string;
		callback?: string;
	}>): SubsonicBaseParameters {
	/*
	Parameter 	Required 	Default 	Comment
	u 	Yes 		The username.
	p 	Yes* 		The password, either in clear text or hex-encoded with a "enc:" prefix. Since 1.13.0 this should only be used for testing purposes.
	t 	Yes* 		(Since 1.13.0) The authentication token computed as md5(password + salt). See below for details.
	s 	Yes* 		(Since 1.13.0) A random string ("salt") used as input for computing the password hash. See below for details.
	v 	Yes 		The protocol version implemented by the client, i.e., the version of the subsonic-rest-api.xsd schema used (see below).
	c 	Yes 		A unique string identifying the client application.
	f 	No 	xml 	Request data to be returned in this format. Supported values are "xml", "json" (since 1.4.0) and "jsonp" (since 1.6.0). If using jsonp, specify name of javascript callback function using a callback parameter.
	 */
	const parameters: SubsonicBaseParameters = {
		username: req.query.u ?? '',
		password: req.query.p,
		format: req.query.f ?? 'xml',
		version: req.query.v ?? '',
		token: req.query.t,
		salt: req.query.s,
		client: req.query.c ?? '',
		callback: req.query.callback?.slice(0, 128)
	};
	req.query.t = undefined;
	req.query.u = undefined;
	req.query.p = undefined;
	req.query.f = undefined;
	req.query.v = undefined;
	req.query.c = undefined;
	req.query.s = undefined;
	req.query.callback = undefined;
	return parameters;
}

export interface SubsonicParameterRequest extends EngineRequest {
	user: User;
	parameters: SubsonicBaseParameters;
}

export function SubsonicParameterMiddleWare(req: express.Request, _res: express.Response, next: express.NextFunction): void {
	(req as SubsonicParameterRequest).parameters = processParameters(req);
	next();
}
