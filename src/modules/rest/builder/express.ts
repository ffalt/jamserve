import express from 'express';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import multer from 'multer';
import { ensureTrailingPathSeparator, fileDeleteIfExists } from '../../../utils/fs-utils.js';
import finishedRequest from 'on-finished';
import { ExpressMethod, RestOptions, RouteInfo } from '../../deco/express/express-method.js';
import { MethodMetadata } from '../../deco/definitions/method-metadata.js';
import { iterateControllers } from '../../deco/helpers/iterate-super.js';

export function restRouter(api: express.Router, options: RestOptions): Array<RouteInfo> {
	const routeInfos: Array<RouteInfo> = [];
	const upload = multer({ dest: ensureTrailingPathSeparator(options.tmpPath) });
	const metadata = getMetadataStorage();
	const method = new ExpressMethod();

	const registerAutoClean = (req: express.Request, res: express.Response): void => {
		finishedRequest(res, err => {
			if (err && req.file && req.file.path) {
				fileDeleteIfExists(req.file.path).catch(e => {
					console.error(e);
				});
			}
		});
	};

	const uploadHandler = (field: string, autoClean: boolean = true): express.RequestHandler => {
		const mu = upload.single(field);
		return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
			if (autoClean) {
				registerAutoClean(req, res);
			}
			mu(req, res, next);
		};
	};

	for (const ctrl of metadata.controllerClasses) {
		if (ctrl.abstract) {
			continue;
		}
		const router = express.Router();
		let gets: Array<MethodMetadata> = [];
		let posts: Array<MethodMetadata> = [];
		iterateControllers(metadata.controllerClasses, ctrl, ctrlClass => {
			gets = gets.concat(metadata.gets.filter(g => g.controllerClassMetadata === ctrlClass));
			posts = posts.concat(metadata.posts.filter(g => g.controllerClassMetadata === ctrlClass));
		});
		for (const get of gets) {
			routeInfos.push(method.GET(get, ctrl, router, options, metadata));
		}
		for (const post of posts) {
			routeInfos.push(method.POST(post, ctrl, router, options, uploadHandler, metadata));
		}
		api.use(ctrl.route, router);
	}
	return routeInfos.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}
