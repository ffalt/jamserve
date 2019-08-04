import express from 'express';
import {Engine} from '../../engine/engine';
import Logger from '../../utils/logger';
import {SubsonicApi} from './api';
import {FORMAT} from './format';
import {CheckAuthMiddleWare, SubsonicLoginMiddleWare} from './login';
import {SubsonicParameterMiddleWare, SubsonicParameterRequest} from './parameters';
import {ApiResponder} from './response';
import {registerApi, SubsonicRolesHandler} from './routes';

const log = Logger('Subsonic.Api');

export function AdminMiddleWare(req: SubsonicParameterRequest, res: express.Response, next: express.NextFunction): void {
	if (!req.user || !req.user.roles.admin) {
		ApiResponder.error(req, res, {fail: FORMAT.FAIL.UNAUTH});
	}
	next();
}

export function PodcastAdminMiddleWare(req: SubsonicParameterRequest, res: express.Response, next: express.NextFunction): void {
	if (!req.user || !req.user.roles.podcast) {
		ApiResponder.error(req, res, {fail: FORMAT.FAIL.UNAUTH});
	}
	next();
}

export function ShareMiddleWare(req: SubsonicParameterRequest, res: express.Response, next: express.NextFunction): void {
	if (!req.user || !req.user.roles.shareRole) {
		ApiResponder.error(req, res, {fail: FORMAT.FAIL.UNAUTH});
	}
	next();
}

export function JukeboxMiddleWare(req: SubsonicParameterRequest, res: express.Response, next: express.NextFunction): void {
	if (!req.user || !req.user.roles.jukeboxRole) {
		ApiResponder.error(req, res, {fail: FORMAT.FAIL.UNAUTH});
	}
	next();
}

export function initSubsonicRouter(engine: Engine): express.Router {
	const api = new SubsonicApi(engine);
	const roles: SubsonicRolesHandler = {
		admin: AdminMiddleWare as express.RequestHandler,
		podcast: PodcastAdminMiddleWare as express.RequestHandler,
		share: ShareMiddleWare as express.RequestHandler,
		jukebox: JukeboxMiddleWare as express.RequestHandler
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
	registerApi(router, api, roles);

	router.use((req, res, next) => {
		res.status(404).send('subsonic api cmd not found');
	});

	return router;
}
