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
import { SubsonicApiError, SubsonicFormatter } from './formatter.js';
import { SubsonicError } from './model/subsonic-rest-data.js';
import { hexDecode } from '../../utils/hex-decode.js';

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
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (req.user) {
		return req.user;
	}
	if (req.parameters.password) {
		let pass = req.parameters.password as unknown;
		if (typeof pass !== 'string') {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
		}
		if (pass.startsWith('enc:')) {
			pass = hexDecode(pass.slice(4)).trim();
		}
		return req.engine.user.authSubsonicPassword(req.orm, req.parameters.username, pass as string);
	}
	if (req.parameters.token && req.parameters.salt) {
		return req.engine.user.authSubsonicToken(req.orm, req.parameters.username, req.parameters.token, req.parameters.salt);
	}
	return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_MISSING));
}

export function validateSubsonicParameters(req: SubsonicRequest, res: express.Response): boolean {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!req.parameters?.client) {
		sendError(req, res, SubsonicFormatter.ERRORS.PARAM_MISSING);
		return false;
	}
	const version = semver.coerce(req.parameters.version);
	if (!version) {
		sendError(req, res, SubsonicFormatter.ERRORS.PARAM_MISSING);
		return false;
	}
	if (!semver.valid(version)) {
		sendError(req, res, SubsonicFormatter.ERRORS.PARAM_INVALID);
		return false;
	}
	if (semver.gt(version, SUBSONIC_VERSION)) {
		sendError(req, res, SubsonicFormatter.ERRORS.SERVER_OLD);
		return false;
	}
	if (semver.lt(version, '1.0.0')) {
		sendError(req, res, SubsonicFormatter.ERRORS.CLIENT_OLD);
		return false;
	}
	return true;
}

export async function subsonicLoginRateLimited(req: SubsonicRequest, res: express.Response, next: express.NextFunction): Promise<void> {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	req.client = req.parameters?.client;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (req.user) {
		next();
		return;
	}
	const handled = await req.engine.rateLimit.loginSlowDown(req, res);
	if (handled) {
		return;
	}
	if (!validateSubsonicParameters(req, res)) {
		return;
	}
	const user = await validateCredentials(req);
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (user) {
		req.user = user;
		next();
		await req.engine.rateLimit.loginSlowDownReset(req);
	}
}

export function SubsonicLoginMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction): void {
	subsonicLoginRateLimited(req as SubsonicRequest, res, next)
		.catch((error: unknown) => {
			(new ApiResponder()).sendError(req, res, error);
		});
}

export function SubsonicCheckAuthMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction): void {
	if (req.user) {
		next();
		return;
	}
	(new ApiResponder()).sendError(req, res, SubsonicFormatter.ERRORS.UNAUTH);
}
