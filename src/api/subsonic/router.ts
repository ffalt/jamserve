import express from 'express';
import {Engine} from '../../engine/engine';
import {User} from '../../engine/user/user.model';
import {logger} from '../../utils/logger';
import {UnauthError} from '../jam/error';
import {ApiBaseResponder} from '../response';
import {SubsonicApi} from './api';
import {apiCheck} from './check';
import {CheckAuthMiddleWare, SubsonicLoginMiddleWare, UserRequest} from './login';
import {SubsonicParameterMiddleWare} from './parameters';
import {ApiResponder} from './response';
import {Register, registerApi, SubSonicRole} from './routes';

const log = logger('Subsonic.Api');

async function checkRoles(user?: User, roles?: Array<SubSonicRole>): Promise<void> {
	if (!user) {
		return Promise.reject(UnauthError());
	}
	if (roles && roles.length > 0) {
		for (const role of roles) {
			if (role === 'admin' && !user.roles.admin) {
				return Promise.reject(UnauthError());
			}
			if (role === 'podcast' && !user.roles.podcast) {
				return Promise.reject(UnauthError());
			}
			if (role === 'share' && !user.roles.admin) {
				return Promise.reject(UnauthError());
			}
			if (role === 'jukebox' && !user.roles.admin) {
				return Promise.reject(UnauthError());
			}
		}
	}
}

async function runSubsonic(req: UserRequest, res: express.Response, execute: (req: UserRequest, res: express.Response) => Promise<void>, roles?: Array<SubSonicRole>): Promise<void> {
	try {
		await checkRoles(req.user, roles || []);
		await execute(req as UserRequest, res);
	} catch (e) {
		log.error(e);
		ApiResponder.error(req, res, e);
	}
}

export function initSubsonicRouter(engine: Engine): express.Router {
	const api = new SubsonicApi(engine);

	const register: Register = {
		all(name: string, execute: (req: UserRequest, res: express.Response) => Promise<void>, roles?: Array<SubSonicRole>): void {
			const shortName = name.split('.view')[0];
			router.all(shortName, apiCheck(name), async (req, res) => {
				return runSubsonic(req as UserRequest, res, execute, roles);
			});
			router.all(name, apiCheck(name),  async (req, res) => {
				return runSubsonic(req as UserRequest, res, execute, roles);
			});
		}
	};

	const router = express.Router();
	// router.options('*', cors());
	router.use((req, res, next) => {
		log.info(req.method, req.originalUrl);
		next();
	});

	router.use(SubsonicParameterMiddleWare);
	router.use(SubsonicLoginMiddleWare as express.RequestHandler);
	router.use(CheckAuthMiddleWare as express.RequestHandler);
	registerApi(register, api);

	router.use((req, res, next) => {
		ApiBaseResponder.sendErrorMsg(req, res, 404, 'subsonic api cmd not found');
	});

	return router;
}
