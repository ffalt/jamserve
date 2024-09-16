import {MethodMetadata} from '../definitions/method-metadata.js';
import {RestContext} from '../helpers/context.js';
import {GenericError, UnauthError} from './express-error.js';
import {ApiBaseResponder} from './express-responder.js';
import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {logger} from '../../../utils/logger.js';
import {ExpressParameters} from './express-parameters.js';
import {MetadataStorage} from '../metadata/metadata-storage.js';
import {ControllerClassMetadata} from '../definitions/controller-metadata.js';
import express, {Router} from 'express';
import {processCustomPathParameters} from './express-path-parameters.js';

const log = logger('RestAPI');

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

export class ExpressMethod {
	parameters = new ExpressParameters();
	metadata: MetadataStorage;

	constructor() {
		this.metadata = getMetadataStorage();
	}

	private static getMethodResultFormat(method: MethodMetadata): string {
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

	private buildArguments(method: MethodMetadata, context: RestContext<any, any, any>) {
		const args = [];
		const params = method.params.sort((a, b) => a.index - b.index);
		for (const param of params) {
			const arg = this.parameters.validateArgument(param, context);
			if (arg) {
				args.push(arg);
			}
		}
		return args;
	}

	private async callMethod(method: MethodMetadata, context: RestContext<any, any, any>, name: string): Promise<void> {
		try {
			const Controller = method.controllerClassMetadata?.target as any;
			if (!Controller) {
				throw GenericError(`Internal: Invalid controller in method ${method.methodName}`);
			}
			const instance = new Controller();// Container.get(Controller) as any;
			const func = instance[method.methodName];
			const args = this.buildArguments(method, context);
			if (method.binary !== undefined) {
				const result = await func.apply(instance, args);
				ApiBaseResponder.sendBinary(context.req, context.res, result);
				return;
			}
			if (method.getReturnType === undefined) {
				await func.apply(instance, args);
				ApiBaseResponder.sendOK(context.req, context.res);
				return;
			}
			const target = method.getReturnType();
			if (target === String) {
				const result = await func.apply(instance, args);
				ApiBaseResponder.sendString(context.req, context.res, result);
				return;
			}
			const resultType = this.metadata.resultType(target);
			if (!resultType) {
				throw GenericError(
					`The value used as a result type of '@${name}' for '${String(method.getReturnType())}' of '${method.target.name}.${method.methodName}' ` +
					`is not a class decorated with '@ResultType' decorator!`,
				);
			}
			// eslint-disable-next-line prefer-spread
			const result = await instance[method.methodName].apply(instance, args);
			ApiBaseResponder.sendJSON(context.req, context.res, result);
		} catch (e: any) {
			// console.error(e);
			log.error(e);
			ApiBaseResponder.sendError(context.req, context.res, e);
		}
	}

	public POST(
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
				await this.callMethod(post, {req, res, next, orm: (req as any).orm, engine: (req as any).engine, user: req.user}, 'Post');
			} catch (e: any) {
				ApiBaseResponder.sendError(req, res, e);
			}
		});
		return {
			method: 'POST',
			endpoint: ctrl.route + route,
			role: roles.length > 0 ? roles.join(',') : 'public',
			format: ExpressMethod.getMethodResultFormat(post)
		};
	}

	public GET(get: MethodMetadata, ctrl: ControllerClassMetadata, router: Router, options: RestOptions): RouteInfo {
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
				await this.callMethod(get, {req, res, orm: (req as any).orm, engine: (req as any).engine, next, user: req.user}, 'Get');
			} catch (e: any) {
				ApiBaseResponder.sendError(req, res, e);
			}
		});
		return {
			method: 'GET',
			endpoint: ctrl.route + route,
			role: roles.length > 0 ? roles.join(',') : 'public',
			format: ExpressMethod.getMethodResultFormat(get)
		};
	}
}
