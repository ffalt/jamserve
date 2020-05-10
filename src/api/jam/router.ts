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
import {initJamGraphQLRouter} from './graphql';

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
		ApiResponder.error(req, res, NotFoundError('jam api cmd not found'));
	});
}

function registerLogin(router: express.Router, api: JamApi): void {
	const LoginLimiter = rateLimit({
		windowMs: api.engine.config.server.limit.login.window * 1000,
		skipSuccessfulRequests: true,
		max: api.engine.config.server.limit.login.max,
		message: 'Too many login fails from this IP, please try again later'
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
					ApiResponder.error(req, res, e);
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
	router.use('/docs', express.static(path.resolve('./static/docs/api/')));

	const upload = jamUpload(api.engine.config.getDataPath(['cache', 'uploads']));
	const register: Register = {
		get(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void {
			router.get<any>(name, apiCheck(apiCheckName || name), async (req, res) => {
				try {
					await checkRoles((req as UserRequest).user, roles);
					await execute(req as UserRequest, res);
				} catch (e) {
					log.debug(e);
					ApiResponder.error(req, res, e);
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
					ApiResponder.error(req, res, e);
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
					ApiResponder.error(req, res, e);
				}
			});
		}
	};

	registerAccessControlApi(register, api);
}

export function initJamRouter(app: express.Application, engine: Engine): express.Router {
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

	const graphqlServer = initJamGraphQLRouter(engine);
	const graphql = graphqlServer.getMiddleware({path: `/graphql`});
	router.use(graphql);

	register404Error(router, engine);
	return router;
}
