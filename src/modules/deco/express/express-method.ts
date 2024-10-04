import { MethodMetadata } from '../definitions/method-metadata.js';
import { RestContext } from './context.js';
import { GenericError, UnauthError } from './express-error.js';
import { ApiBaseResponder } from './express-responder.js';
import { logger } from '../../../utils/logger.js';
import { ExpressParameters } from './express-parameters.js';
import { ControllerClassMetadata } from '../definitions/controller-metadata.js';
import express, { Router } from 'express';
import { processCustomPathParameters } from './express-path-parameters.js';
import { ResultClassMetadata } from '../definitions/object-class-metdata.js';
import { EnumMetadata } from '../definitions/enum-metadata.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

const log = logger('RestAPI');

export interface RouteInfo {
	method: 'GET' | 'POST' | 'ALL';
	endpoint: string;
	role: string;
	format: string;
}

export interface RestOptions {
	validateRoles: (user: Express.User | undefined, roles: Array<string>) => boolean;
	tmpPath: string;
	resultTypes: ResultClassMetadata[];
	enums: EnumMetadata[];
	responder: ApiBaseResponder;
}

export class ExpressMethod {
	parameters = new ExpressParameters();

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
		return method.defaultReturnTypeFormat || 'json';
	}

	private buildArguments(method: MethodMetadata, context: RestContext<any, any, any>, metadata: MetadataStorage) {
		const args = [];
		const params = method.params.sort((a, b) => a.index - b.index);
		for (const param of params) {
			const arg = this.parameters.validateArgument(param, context, metadata);
			if (arg) {
				args.push(arg);
			}
		}
		return args;
	}

	private async callMethod(method: MethodMetadata, context: RestContext<any, any, any>, name: string, { responder, resultTypes }: RestOptions, metadata: MetadataStorage): Promise<void> {
		try {
			const Controller = method.controllerClassMetadata?.target as any;
			if (!Controller) {
				throw GenericError(`Internal: Invalid controller in method ${method.methodName}`);
			}
			const instance = new Controller();// Container.get(Controller) as any;
			const func = instance[method.methodName];
			const args = this.buildArguments(method, context, metadata);
			if (method.binary !== undefined) {
				const result = await func.apply(instance, args);
				responder.sendBinary(context.req, context.res, result);
				return;
			}
			if (method.getReturnType === undefined) {
				await func.apply(instance, args);
				responder.sendOK(context.req, context.res);
				return;
			}
			const target = method.getReturnType();
			if (target === String) {
				const result = await func.apply(instance, args);
				responder.sendString(context.req, context.res, result);
				return;
			}
			const resultType = resultTypes.find(it => it.target === target);
			if (!resultType) {
				throw GenericError(
					`The value used as a result type of '@${name}' for '${String(method.getReturnType())}' of '${method.target.name}.${method.methodName}' ` +
					`is not a class decorated with '@ResultType' decorator!`
				);
			}
			// eslint-disable-next-line prefer-spread
			const result = await instance[method.methodName].apply(instance, args);
			responder.sendData(context.req, context.res, result);
		} catch (e: any) {
			// console.error(e);
			log.error(e);
			responder.sendError(context.req, context.res, e);
		}
	}

	public POST(
		post: MethodMetadata, ctrl: ControllerClassMetadata, router: Router, options: RestOptions,
		uploadHandler: (field: string, autoClean?: boolean) => express.RequestHandler, metadata: MetadataStorage
	): RouteInfo {
		let route = (post.route || '/');
		if (post.customPathParameters) {
			route = (!post.route) ? '/:pathParameters' : post.route.split('{')[0] + ':pathParameters';
		}
		const roles = post.roles || ctrl?.roles || [];
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
							post,
							options
						), pathParameters: undefined
					} as any;
				}
				await this.callMethod(post, { req, res, next, orm: (req as any).orm, engine: (req as any).engine, user: req.user }, 'Post', options, metadata);
			} catch (e: any) {
				options.responder.sendError(req, res, e);
			}
		});
		return {
			method: 'POST',
			endpoint: (ctrl ? ctrl.route : '') + route,
			role: roles.length > 0 ? roles.join(',') : 'public',
			format: ExpressMethod.getMethodResultFormat(post)
		};
	}

	public GET(get: MethodMetadata, ctrl: ControllerClassMetadata, router: Router, options: RestOptions, metadata: MetadataStorage): RouteInfo {
		let route = (get.route || '/');
		if (get.customPathParameters) {
			route = (!get.route) ? '/:pathParameters' : get.route.split('{')[0] + ':pathParameters';
		}
		const roles = get.roles || ctrl?.roles || [];
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
							get,
							options
						), pathParameters: undefined
					} as any;
				}
				await this.callMethod(get, { req, res, orm: (req as any).orm, engine: (req as any).engine, next, user: req.user }, 'Get', options, metadata);
			} catch (e: any) {
				options.responder.sendError(req, res, e);
			}
		});
		return {
			method: 'GET',
			endpoint: (ctrl ? ctrl.route : '') + route,
			role: roles.length > 0 ? roles.join(',') : 'public',
			format: ExpressMethod.getMethodResultFormat(get)
		};
	}

	public ALL(get: MethodMetadata, ctrl: ControllerClassMetadata, router: Router, options: RestOptions, metadata: MetadataStorage): RouteInfo {
		let route = (get.route || '/');
		if (get.customPathParameters) {
			route = (!get.route) ? '/:pathParameters' : get.route.split('{')[0] + ':pathParameters';
		}
		const roles = get.roles || ctrl?.roles || [];
		router.all(route, async (req, res, next) => {
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
							get,
							options
						), pathParameters: undefined
					} as any;
				}
				await this.callMethod(get, { req, res, orm: (req as any).orm, engine: (req as any).engine, next, user: req.user }, 'All', options, metadata);
			} catch (e: any) {
				options.responder.sendError(req, res, e);
			}
		});
		return {
			method: 'ALL',
			endpoint: (ctrl ? ctrl.route : '') + route,
			role: roles.length > 0 ? roles.join(',') : 'public',
			format: ExpressMethod.getMethodResultFormat(get)
		};
	}
}
