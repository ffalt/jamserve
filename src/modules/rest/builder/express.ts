import express, {Router} from 'express';
import {getMetadataStorage} from '../metadata';
import {ApiBaseResponder} from './express-responder';
import {UnauthError} from './express-error';
import {MethodMetadata} from '../definitions/method-metadata';
import multer from 'multer';
import {ensureTrailingPathSeparator, fileDeleteIfExists} from '../../../utils/fs-utils';
import finishedRequest from 'on-finished';
import {ControllerClassMetadata} from '../definitions/controller-metadata';
import {processCustomPathParameters} from './express-parameters';
import {callMethod} from './express-method';

export interface RouteInfo {
	method: 'GET' | 'POST';
	endpoint: string;
	role: string;
	format: string;
}

export interface RestOptions {
	validateRoles: (user: Express.User | undefined, roles: Array<string>) => boolean;
	controllers: any[];
	tmpPath: string;
}

function registerAutoClean(req: express.Request, res: express.Response): void {
	finishedRequest(res, err => {
		if (err && req.file && req.file.path) {
			fileDeleteIfExists(req.file.path).catch(e => {
				console.error(e);
			});
		}
	});
}

function getMethodResultFormat(method: MethodMetadata): string {
	if (method.binary) {
		return 'binary';
	}
	if (!method.getReturnType) {
		return 'void';
	}
	const target = method.getReturnType();
	if (target === String) {
		return 'string';
	}
	return 'json';
}

function restPOST(
	post: MethodMetadata, ctrl: ControllerClassMetadata, router: Router, options: RestOptions,
	uploadHandler: (field: string, autoClean?: boolean) => express.RequestHandler
): RouteInfo {
	let route = (post.route || '/');
	if (post.customPathParameters) {
		route = (!post.route) ? '/:pathParameters' : post.route.split('{')[0] + ':pathParameters';
	}
	const roles = post.roles || ctrl.roles || [];
	const handlers: Array<express.RequestHandler> = [];
	for (const param of post.params) {
		if ((param.kind === 'arg' && param.mode === 'file')) {
			handlers.push(uploadHandler(param.name));
		}
	}


	router.post(route, ...handlers, async (req, res, next) => {
		try {
			if (!options.validateRoles(req.user, roles)) {
				throw UnauthError();
			}
			if (post.customPathParameters) {
				req.params = {
					...req.params,
					...processCustomPathParameters(
						post.customPathParameters,
						req.params.pathParameters,
						post
					), pathParameters: undefined
				} as any;
			}
			await callMethod(post, {req, res, next, orm: (req as any).orm, engine: (req as any).engine, user: req.user}, 'Post');
		} catch (e) {
			ApiBaseResponder.sendError(req, res, e);
		}
	});
	return {
		method: 'POST',
		endpoint: ctrl.route + route,
		role: roles.length > 0 ? roles.join(',') : 'public',
		format: getMethodResultFormat(post)
	};
}

function restGET(get: MethodMetadata, ctrl: ControllerClassMetadata, router: Router, options: RestOptions): RouteInfo {
	let route = (get.route || '/');
	if (get.customPathParameters) {
		route = (!get.route) ? '/:pathParameters' : get.route.split('{')[0] + ':pathParameters';
	}
	const roles = get.roles || ctrl.roles || [];
	router.get(route, async (req, res, next) => {
		try {
			if (!options.validateRoles(req.user, roles)) {
				throw UnauthError();
			}
			if (get.customPathParameters) {
				req.params = {
					...req.params,
					...processCustomPathParameters(
						get.customPathParameters,
						req.params.pathParameters,
						get
					), pathParameters: undefined
				} as any;
			}
			await callMethod(get, {req, res, orm: (req as any).orm, engine: (req as any).engine, next, user: req.user}, 'Get');
		} catch (e) {
			ApiBaseResponder.sendError(req, res, e);
		}
	});
	return {
		method: 'GET',
		endpoint: ctrl.route + route,
		role: roles.length > 0 ? roles.join(',') : 'public',
		format: getMethodResultFormat(get)
	};
}

export function restRouter(api: express.Router, options: RestOptions): Array<RouteInfo> {
	const routeInfos: Array<RouteInfo> = [];
	const upload = multer({dest: ensureTrailingPathSeparator(options.tmpPath)});
	const metadata = getMetadataStorage();

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
		let gets = metadata.gets.filter(g => g.controllerClassMetadata === ctrl);
		let posts = metadata.posts.filter(g => g.controllerClassMetadata === ctrl);

		let superClass = Object.getPrototypeOf(ctrl.target);
		while (superClass.prototype !== undefined) {
			const superClassType = getMetadataStorage().controllerClasses.find(it => it.target === superClass);
			if (superClassType) {
				gets = gets.concat(metadata.gets.filter(g => g.controllerClassMetadata === superClassType));
				posts = posts.concat(metadata.posts.filter(g => g.controllerClassMetadata === superClassType));
			}
			superClass = Object.getPrototypeOf(superClass);
		}
		for (const get of gets) {
			routeInfos.push(restGET(get, ctrl, router, options));
		}
		for (const post of posts) {
			routeInfos.push(restPOST(post, ctrl, router, options, uploadHandler));
		}
		api.use(ctrl.route, router);
	}
	return routeInfos.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}
