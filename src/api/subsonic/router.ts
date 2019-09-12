import express from 'express';
import {Engine} from '../../engine/engine';
import {User} from '../../engine/user/user.model';
import Logger from '../../utils/logger';
import {UnauthError} from '../jam/error';
import {SubsonicApi} from './api';
import {apiCheck} from './check';
import {CheckAuthMiddleWare, SubsonicLoginMiddleWare, UserRequest} from './login';
import {SubsonicParameterMiddleWare} from './parameters';
import {ApiResponder} from './response';
import {Register, registerApi, RegisterCallback, SubSonicRole} from './routes';

const log = Logger('Subsonic.Api');

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

export function initSubsonicRouter(engine: Engine): express.Router {
	const api = new SubsonicApi(engine);
	const register: Register = {
		all(name: string, execute: (req: UserRequest, res: express.Response) => Promise<void>, roles?: Array<SubSonicRole>): void {
			router.all(name, apiCheck(name), async (req, res) => {
				try {
					await checkRoles((req as UserRequest).user, roles || []);
					await execute(req as UserRequest, res);
				} catch (e) {
					log.error(e);
					ApiResponder.error(req, res, e);
				}
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
		res.status(404).send('subsonic api cmd not found');
	});

	return router;
}
