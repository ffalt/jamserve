import express from 'express';
import {CheckAuthMiddleWare, SubsonicLoginMiddleWare} from './login';
import {SubsonicParameterMiddleWare, SubsonicParameterRequest} from './parameters';
import Logger from '../../utils/logger';
import {FORMAT} from './format';
import {SubsonicApi} from './api';
import {Engine} from '../../engine/engine';
import {Subsonic} from '../../model/subsonic-rest-data-1.16.0';
import cors from 'cors';
import {registerApi, SubsonicRolesHandler} from './routes';
import {ApiResponder} from './response';

const log = Logger('Subsonic.Api');

export function AdminMiddleWare(req: SubsonicParameterRequest, res: express.Response, next: express.NextFunction) {
	if (!req.user || !req.user.roles.adminRole) {
		ApiResponder.error(req, res, {fail: FORMAT.FAIL.UNAUTH});
	}
	next();
}

export function PodcastAdminMiddleWare(req: SubsonicParameterRequest, res: express.Response, next: express.NextFunction) {
	if (!req.user || !req.user.roles.podcastRole) {
		ApiResponder.error(req, res, {fail: FORMAT.FAIL.UNAUTH});
	}
	next();
}

export function ShareMiddleWare(req: SubsonicParameterRequest, res: express.Response, next: express.NextFunction) {
	if (!req.user || !req.user.roles.shareRole) {
		ApiResponder.error(req, res, {fail: FORMAT.FAIL.UNAUTH});
	}
	next();
}

export function JukeboxMiddleWare(req: SubsonicParameterRequest, res: express.Response, next: express.NextFunction) {
	if (!req.user || !req.user.roles.jukeboxRole) {
		ApiResponder.error(req, res, {fail: FORMAT.FAIL.UNAUTH});
	}
	next();
}

export function initSubsonicRouter(engine: Engine): express.Router {
	const api = new SubsonicApi(engine);
	const roles: SubsonicRolesHandler = {
		admin: <express.RequestHandler>AdminMiddleWare,
		podcast: <express.RequestHandler>PodcastAdminMiddleWare,
		share: <express.RequestHandler>ShareMiddleWare,
		jukebox: <express.RequestHandler>JukeboxMiddleWare
	};

	const router = express.Router();
	router.options('*', cors());
	router.use((req, res, next) => {
		log.info(req.method, req.originalUrl);
		next();
	});

	router.use(SubsonicParameterMiddleWare);
	router.use(<express.RequestHandler>SubsonicLoginMiddleWare);
	router.use(<express.RequestHandler>CheckAuthMiddleWare);
	registerApi(router, api, roles);

	router.use((req, res, next) => {
		res.status(404).send('subsonic api cmd not found');
	});

	return router;
}
