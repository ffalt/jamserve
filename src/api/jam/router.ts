import express from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';
import {Engine} from '../../engine/engine';
import {logger} from '../../utils/logger';
import {JamApi} from './api';
import {apiCheck} from './check';
import {registerAuthenticatedCors, registerPublicCORS} from './cors';
import {NotFoundError} from './error';
import {registerAuthentication, UserRequest} from './login';
import {CallSessionLoginHandler, CallSessionLogoutHandler, registerPassPort} from './passport';
import {ApiResponder} from './response';
import {checkRoles} from './roles';
import {JamApiRole, Register, registerAccessControlApi, RegisterCallback, registerPublicApi} from './routes';
import {registerSession} from './session';
import {jamUpload} from './upload';

const log = logger('Jam.Api');

function registerLog(router: express.Router, engine: Engine): void {
	router.use((req, res, next) => {
		// log all requests
		log.info(req.originalUrl);
		next();
	});
}

function register404Error(router: express.Router, engine: Engine): void {
	router.use((req, res) => {
		ApiResponder.error(res, NotFoundError('jam api cmd not found'));
	});
}

function registerLogin(router: express.Router, api: JamApi): void {
	const LoginLimiter = rateLimit({
		windowMs: 60 * 60 * 1000, // 1 hour window
		max: 5, // start blocking after 5 requests
		message: 'Too many login requests from this IP, please try again after an hour'
	});
	router.post('/login', LoginLimiter, apiCheck('/login'), CallSessionLoginHandler as express.RequestHandler);
}

function registerApiPublic(router: express.Router, api: JamApi): void {
	registerLogin(router, api);
	const register: Register = {
		get(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			router.get<any>(name, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await execute(req as UserRequest, res);
				} catch (e) {
					log.error(e);
					ApiResponder.error(res, e);
				}
			});
		},
		post(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			// dummy, there is no public post
		},
		upload(name: string, field: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			// dummy, there is no public upload
		}
	};
	registerPublicApi(register, api);
}

function registerApiAuthenticated(router: express.Router, api: JamApi): void {

	router.post('/logout', CallSessionLogoutHandler as express.RequestHandler);
	router.use('/docs', express.static(path.resolve('./dist/docs/api/')));

	const upload = jamUpload(api.engine.config.getDataPath(['cache', 'uploads']));
	const register: Register = {
		get(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			router.get<any>(name, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await checkRoles((req as UserRequest).user, roles);
					await execute(req as UserRequest, res);
				} catch (e) {
					log.debug(e);
					ApiResponder.error(res, e);
				}
			});
		},
		post(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			router.post(name, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await checkRoles((req as UserRequest).user, roles);
					await execute(req as UserRequest, res);
				} catch (e) {
					log.debug(e);
					ApiResponder.error(res, e);
				}
			});
		},
		upload(name: string, field: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			router.post(name, upload.handler(field), apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await checkRoles((req as UserRequest).user, roles);
					await execute(req as UserRequest, res);
				} catch (e) {
					log.debug(e);
					ApiResponder.error(res, e);
				}
			});
		}
	};

	registerAccessControlApi(register, api);
}

export function initJamRouter(engine: Engine): express.Router {
	const api = new JamApi(engine);
	const router = express.Router();

	registerLog(router, engine);
	registerSession(router, engine);
	registerPassPort(router, engine);

	registerPublicCORS(router, engine);
	registerApiPublic(router, api);

	registerAuthentication(router, engine); // ensure a valid logged in req.user exists for all requests from here on
	registerAuthenticatedCors(router, engine);
	registerApiAuthenticated(router, api);

	register404Error(router, engine);
	return router;
}
