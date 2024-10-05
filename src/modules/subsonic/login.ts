/*

Authentication

If your targeting API version 1.12.0 or earlier, authentication is performed by sending the password as clear text or hex-encoded. Examples:

http://your-server/rest/ping.view?u=joe&p=sesame&v=1.12.0&c=myapp
http://your-server/rest/ping.view?u=joe&p=enc:736573616d65&v=1.12.0&c=myapp

Starting with API version 1.13.0, the recommended authentication scheme is to send an authentication token, calculated as a one-way salted hash of the password.

This involves two steps:

    For each REST call, generate a random string called the salt. Send this as parameter s.
    Use a salt length of at least six characters.
    Calculate the authentication token as follows: token = md5(password + salt). The md5() function takes a string and returns the 32-byte ASCII hexadecimal representation of the MD5 hash, using lower case characters for the hex values. The '+' operator represents concatenation of the two strings. Treat the strings as UTF-8 encoded when calculating the hash. Send the result as parameter t.

For example: if the password is sesame and the random salt is c19b2d, then token = md5("sesamec19b2d") = 26719a1196d2a940705a59634eb18eab. The corresponding request URL then becomes:

http://your-server/rest/ping.view?u=joe&t=26719a1196d2a940705a59634eb18eab&s=c19b2d&v=1.12.0&c=myapp

 */

import express from 'express';
import { User } from '../../entity/user/user.js';
import { SubsonicParameterRequest } from './parameters.js';
import { ApiResponder } from './response.js';
import { EngineService } from '../engine/services/engine.service.js';
import { Orm } from '../engine/services/orm.service.js';
import semver from 'semver';
import { SUBSONIC_VERSION } from './version.js';
import { SubsonicFormatter } from './formatter.js';
import { SubsonicError } from './model/subsonic-rest-data.js';

export function hexEncode(n: string): string {
	const i: Array<string> = [];
	const r: Array<string> = [];
	const u = '0123456789abcdef';
	for (let t = 0; t < 256; t++) {
		i[t] = u.charAt(t >> 4) + u.charAt(t & 15);
	}
	for (let t = 0; t < n.length; t++) {
		r[t] = i[n.charCodeAt(t)];
	}
	return r.join('');
}

export function hexDecode(hex: string): string {
	let str = '';
	for (let i = 0; i < hex.length; i += 2) {
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}
	return str.trim();
}

/**
 * Fill user into req.user express requests
 */
export interface SubsonicRequest extends SubsonicParameterRequest {
	user: User;
	client: string;
	engine: EngineService;
	orm: Orm;
}

function sendError(req: SubsonicParameterRequest, res: express.Response, error: SubsonicError) {
	(new ApiResponder()).sendError(req, res, error);
}

async function validateCredentials(req: SubsonicParameterRequest): Promise<User> {
	if (req.user) {
		return req.user;
	}
	if (req.parameters.password) {
		let pass = req.parameters.password;
		if (typeof pass !== 'string') {
			return Promise.reject(SubsonicFormatter.ERRORS.PARAM_INVALID);
		}
		if (pass.startsWith('enc:')) {
			pass = hexDecode(pass.slice(4)).trim();
		}
		return req.engine.user.authSubsonicPassword(req.orm, req.parameters.username, pass);
	}
	if (req.parameters.token && req.parameters.salt) {
		return req.engine.user.authSubsonicToken(req.orm, req.parameters.username, req.parameters.token, req.parameters.salt);
	}
	return Promise.reject(SubsonicFormatter.ERRORS.PARAM_MISSING);
}

export function SubsonicLoginMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction): void {
	if (req.user) {
		return next();
	}
	const sreq = req as SubsonicRequest;
	if (!sreq.parameters || !sreq.parameters.client) {
		sendError(sreq, res, SubsonicFormatter.ERRORS.PARAM_MISSING);
		return;
	}
	const version = semver.coerce(sreq.parameters.version);
	if (!version) {
		sendError(sreq, res, SubsonicFormatter.ERRORS.PARAM_MISSING);
		return;
	}
	if (!semver.valid(version)) {
		sendError(sreq, res, SubsonicFormatter.ERRORS.PARAM_INVALID);
		return;
	}
	if (semver.gt(version, SUBSONIC_VERSION)) {
		sendError(sreq, res, SubsonicFormatter.ERRORS.SERVER_OLD);
		return;
	}
	if (semver.lt(version, '1.0.0')) {
		sendError(sreq, res, SubsonicFormatter.ERRORS.CLIENT_OLD);
		return;
	}
	sreq.client = sreq.parameters.client;
	validateCredentials(sreq)
		.then(user => {
			if (user) {
				req.user = user;
				next();
			}
		})
		.catch(e => {
			return (new ApiResponder()).sendError(req, res, e);
		});
}

export function SubsonicCheckAuthMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction): void {
	if (req.user) {
		return next();
	}
	return (new ApiResponder()).sendError(req, res, SubsonicFormatter.ERRORS.UNAUTH);
}
