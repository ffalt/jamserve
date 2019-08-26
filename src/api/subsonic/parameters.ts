import express from 'express';
import {EngineRequest} from '../server';
import {User} from '../../engine/user/user.model';

export interface SubsonicBaseParams {
	username: string;
	password?: string;
	token?: string;
	salt?: string;
	format: string;
	client: string;
	version: string;
	callback?: string;
}

function processParams(req: express.Request): SubsonicBaseParams {
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
	const params: SubsonicBaseParams = {
		username: req.query.u,
		password: req.query.p,
		format: req.query.f,
		version: req.query.v,
		token: req.query.t,
		salt: req.query.s,
		client: req.query.c,
		callback: req.query.callback
	};
	delete req.query.t;
	delete req.query.u;
	delete req.query.p;
	delete req.query.f;
	delete req.query.v;
	delete req.query.c;
	delete req.query.s;
	delete req.query.callback;
	return params;
}

export interface SubsonicParameterRequest extends EngineRequest {
	user?: User;
	parameters: SubsonicBaseParams;
}

export function SubsonicParameterMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction): void {
	(req as SubsonicParameterRequest).parameters = processParams(req);
	next();
}
