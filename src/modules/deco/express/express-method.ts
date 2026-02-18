import { MethodMetadata } from '../definitions/method-metadata.js';
import { RestContext } from './context.js';
import { genericError, unauthError } from './express-error.js';
import { ApiBaseResponder, ApiBinaryResult } from './express-responder.js';
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
	resultTypes: Array<ResultClassMetadata>;
	enums: Array<EnumMetadata>;
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
		return method.defaultReturnTypeFormat ?? 'json';
	}

	private buildParameters(method: MethodMetadata, context: RestContext<any, any, any>, metadata: MetadataStorage): Array<any> {
		const result: Array<any> = [];
		const parameters = method.parameters.sort((a, b) => a.index - b.index);
		for (const parameter of parameters) {
			const validatedParameter = this.parameters.validateParameter(parameter, context, metadata);
			if (validatedParameter) {
				result.push(validatedParameter);
			}
		}
		return result;
	}

	private async callMethod(method: MethodMetadata, context: RestContext<any, any, any>, name: string, { responder, resultTypes }: RestOptions, metadata: MetadataStorage): Promise<void> {
		try {
			const Controller = method.controllerClassMetadata?.target as any;
			if (!Controller) {
				throw genericError(`Internal: Invalid controller in method ${method.methodName}`);
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			const instance = new Controller();
			const instanceFunction = instance[method.methodName] as Function;
			const parameters = this.buildParameters(method, context, metadata);
			if (method.binary !== undefined) {
				const result: ApiBinaryResult = await instanceFunction.apply(instance, parameters);
				responder.sendBinary(context.req, context.res, result);
				return;
			}
			if (method.getReturnType === undefined) {
				await instanceFunction.apply(instance, parameters);
				responder.sendOK(context.req, context.res);
				return;
			}
			const target = method.getReturnType();
			if (target === String) {
				const result: string = await instanceFunction.apply(instance, parameters);
				responder.sendString(context.req, context.res, result);
				return;
			}
			const resultType = resultTypes.find(it => it.target === target);
			if (!resultType) {
				throw genericError(
					`The value used as a result type of '@${name}' for '${JSON.stringify(method.getReturnType())}' of '${
						method.target.name}.${method.methodName}' is not a class decorated with '@ResultType' decorator!`
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			const result = await instance[method.methodName](...parameters);
			responder.sendData(context.req, context.res, result);
		} catch (error: unknown) {
			log.error(error);
			responder.sendError(context.req, context.res, error);
		}
	}

	public POST(
		post: MethodMetadata, ctrl: ControllerClassMetadata | undefined, router: Router, options: RestOptions,
		uploadHandler: (field: string, autoClean?: boolean) => express.RequestHandler, metadata: MetadataStorage
	): RouteInfo {
		let route = (post.route ?? '/');
		if (post.customPathParameters) {
			route = (post.route) ? `${post.route.split('{').at(0)}:pathParameters` : '/:pathParameters';
		}
		const roles = post.roles ?? ctrl?.roles ?? [];
		const handlers: Array<express.RequestHandler> = [];
		for (const parameter of post.parameters) {
			if ((parameter.kind === 'arg' && parameter.mode === 'file')) {
				handlers.push(uploadHandler(parameter.name));
			}
		}

		router.post(route, ...handlers, async (req, res, next) => {
			try {
				if (!options.validateRoles(req.user, roles)) {
					throw unauthError();
				}
				if (post.customPathParameters) {
					req.params = {
						...req.params,
						...processCustomPathParameters(
							post.customPathParameters,
							req.params.pathParameters,
							post,
							options
						),
						pathParameters: undefined
					};
				}
				await this.callMethod(post, { req, res, next, orm: (req as any).orm, engine: (req as any).engine, user: req.user }, 'Post', options, metadata);
			} catch (error: unknown) {
				options.responder.sendError(req, res, error);
			}
		});
		return {
			method: 'POST',
			endpoint: (ctrl?.route ?? '') + route,
			role: roles.length > 0 ? roles.join(',') : 'public',
			format: ExpressMethod.getMethodResultFormat(post)
		};
	}

	public GET(get: MethodMetadata, ctrl: ControllerClassMetadata | undefined, router: Router, options: RestOptions, metadata: MetadataStorage): RouteInfo {
		let route = (get.route ?? '/');
		if (get.customPathParameters) {
			route = (get.route) ? `${get.route.split('{').at(0)}:pathParameters` : '/:pathParameters';
		}
		const roles = get.roles ?? ctrl?.roles ?? [];
		router.get(route, async (req, res, next) => {
			try {
				if (!options.validateRoles(req.user, roles)) {
					throw unauthError();
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
					};
				}
				await this.callMethod(get, { req, res, orm: (req as any).orm, engine: (req as any).engine, next, user: req.user }, 'Get', options, metadata);
			} catch (error: unknown) {
				options.responder.sendError(req, res, error);
			}
		});
		return {
			method: 'GET',
			endpoint: (ctrl?.route ?? '') + route,
			role: roles.length > 0 ? roles.join(',') : 'public',
			format: ExpressMethod.getMethodResultFormat(get)
		};
	}

	public SUBSONIC(get: MethodMetadata, ctrl: ControllerClassMetadata | undefined, router: Router, options: RestOptions, metadata: MetadataStorage): RouteInfo {
		let route = (get.route ?? '/');
		if (get.customPathParameters) {
			route = (get.route) ? `${get.route.split('{').at(0)}:pathParameters` : '/:pathParameters';
		}
		const roles = get.roles ?? ctrl?.roles ?? [];
		router.all(`${route}{.view}`, async (req, res, next) => {
			try {
				if (!options.validateRoles(req.user, roles)) {
					throw unauthError();
				}
				if (get.customPathParameters) {
					req.params = {
						...req.params,
						...processCustomPathParameters(
							get.customPathParameters,
							req.params.pathParameters as string,
							get,
							options
						), pathParameters: undefined
					};
				}
				await this.callMethod(get, { req, res, orm: (req as any).orm, engine: (req as any).engine, next, user: req.user }, 'All', options, metadata);
			} catch (error: unknown) {
				options.responder.sendError(req, res, error);
			}
		});
		return {
			method: 'ALL',
			endpoint: (ctrl?.route ?? '') + route,
			role: roles.length > 0 ? roles.join(',') : 'public',
			format: ExpressMethod.getMethodResultFormat(get)
		};
	}
}
