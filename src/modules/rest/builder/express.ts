import express from 'express';
import {getMetadataStorage} from '../metadata';
import {ParamMetadata, RestParamMetadata, RestParamsMetadata} from '../definitions/param-metadata';
import {FieldMetadata} from '../definitions/field-metadata';
import {getDefaultValue} from '../helpers/default-value';
import {CustomPathParameterGroup, CustomPathParameters, FieldOptions, TypeOptions} from '../definitions/types';
import {RestContext} from '../helpers/context';
import {ClassMetadata} from '../definitions/class-metadata';
import {ApiBaseResponder} from './express-responder';
import {GenericError, InvalidParamError, MissingParamError, UnauthError} from './express-error';
import {MethodMetadata} from '../definitions/method-metadata';
import multer from 'multer';
import {ensureTrailingPathSeparator, fileDeleteIfExists} from '../../../utils/fs-utils';
import finishedRequest from 'on-finished';
import {logger} from '../../../utils/logger';
import {getEnumReverseValuesMap} from '../helpers/enums';

const log = logger('RestAPI');

function prepareParameter(param: RestParamMetadata | FieldMetadata, data: any, isField: boolean): any {
	if (isField) {
		const argumentInstance = new (param.target as any)();
		param.typeOptions.defaultValue = getDefaultValue(
			argumentInstance,
			param.typeOptions,
			param.name
		);
	}
	let value = data[param.name];
	if (value === undefined) {
		value = param.typeOptions.defaultValue;
	}
	const typeOptions: FieldOptions & TypeOptions = param.typeOptions;
	const isNull = (value === undefined || value === null);
	if (!typeOptions.nullable && isNull) {
		throw MissingParamError(param.name);
	}
	if (isNull) {
		return;
	}
	const type = param.getType();
	if (type === Boolean) {
		if (typeOptions.array) {
			throw InvalidParamError(param.name);
		}
		if (typeof value !== 'boolean') {
			if (value === 'true') {
				value = true;
			} else if (value === 'false') {
				value = false;
			} else {
				throw InvalidParamError(param.name);
			}
		}
	} else if (type === Number) {
		if (typeOptions.array) {
			//TODO: support number arrays
			throw InvalidParamError(param.name);
		}
		if (typeof value === 'string' && value.length === 0) {
			throw InvalidParamError(param.name);
		}
		value = Number(value);
		if (isNaN(value)) {
			throw InvalidParamError(param.name, `Parameter value is not a number`);
		}
		if (value % 1 !== 0) {
			throw InvalidParamError(param.name, `Parameter value is not an integer`);
		}
		if (typeOptions.min !== undefined && value < typeOptions.min) {
			throw InvalidParamError(param.name, `Parameter value too small`);
		}
		if (typeOptions.max !== undefined && value > typeOptions.max) {
			throw InvalidParamError(param.name, `Parameter value too high`);
		}
	} else if (type === String) {
		if (typeOptions.array) {
			if (value && !Array.isArray(value)) {
				if (value.length === 0) {
					throw InvalidParamError(param.name);
				}
				value = [value];
			}
			value = (value || []).map((v: any) => String(v));
			value = value.filter((v: string) => {
				if (v.length === 0 && !typeOptions.nullable) {
					throw InvalidParamError(param.name);
				}
				return v.length > 0;
			});
		} else {
			value = String(value);
			if (value.length === 0) {
				throw InvalidParamError(param.name);
			}
		}
	} else {
		const enumInfo = getMetadataStorage().enums.find(e => e.enumObj === type);
		if (enumInfo) {
			const enumObj: any = enumInfo.enumObj;
			const enumValues = getEnumReverseValuesMap(enumObj);
			if (typeOptions.array) {
				if (!Array.isArray(value)) {
					value = [value];
				}
				value = (value || []).map((v: any) => String(v));
				for (const val of value) {
					if (!enumValues[val]) {
						throw InvalidParamError(param.name, `Enum value not valid`);
					}
				}
			} else {
				value = String(value);
				if (!enumValues[value]) {
					throw InvalidParamError(param.name, `Enum value not valid`);
				}
			}
		} else {
			if (typeof value !== 'object') {
				throw new Error(`Internal: Invalid Parameter Object Type for field '${param.name}'`);
			}
			const argumentType = getMetadataStorage().argumentTypes.find(it => it.target === type);
			if (argumentType) {
				const result = new (argumentType.target as any)();
				for (const field of argumentType.fields) {
					result[field.name] = prepareParameter(field, value, true);
				}
				return result;
			}
			if (param.typeOptions.generic) {
				return value;
			}
			throw new Error(`Internal: Unknown Parameter Type, did you forget to register an enum? '${param.name}'`);
		}
	}
	return value;
}

function prepareParameterSingle(param: RestParamMetadata, context: RestContext<any, any, any>): any {
	let data: any = {};
	switch (param.mode) {
		case 'body':
			data = context.req.body;
			break;
		case 'query':
			data = context.req.query;
			break;
		case 'path':
			data = context.req.params;
			break;
	}
	return prepareParameter(param, data, false);
}

function mapArgFields(argumentType: ClassMetadata, data: any, args: any = {}): void {
	argumentType.fields!.forEach(field => {
		args[field.name] = prepareParameter(field, data, true);
	});
}

function prepareParameterObj(param: RestParamsMetadata, context: RestContext<any, any, any>): any {
	const type = param.getType();
	const argumentType = getMetadataStorage().argumentTypes.find(it => it.target === type);
	if (!argumentType) {
		throw GenericError(
			`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
			`is not a class decorated with '@ObjParamsType' decorator!`,
		);
	}
	const args: any = {};
	let data: any = {};
	switch (param.mode) {
		case 'body':
			data = context.req.body;
			break;
		case 'query':
			data = context.req.query;
			break;
		case 'path':
			data = context.req.params;
			break;
	}
	let superClass = Object.getPrototypeOf(argumentType.target);
	while (superClass.prototype !== undefined) {
		const superArgumentType = getMetadataStorage().argumentTypes.find(it => it.target === superClass);
		if (superArgumentType) {
			mapArgFields(superArgumentType, data, args);
		}
		superClass = Object.getPrototypeOf(superClass);
	}
	mapArgFields(argumentType, data, args);
	return args;
}

function prepareArg(param: ParamMetadata, context: RestContext<any, any, any>): any {
	switch (param.kind) {
		case 'context':
			return param.propertyName ? (context as any)[param.propertyName] : context;
		case 'arg':
			return prepareParameterSingle(param, context);
		case 'args':
			return prepareParameterObj(param, context);
	}
	throw GenericError(`Internal: not implemented ${param.methodName} ${param.kind}`);
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

async function callMethod(method: MethodMetadata, context: RestContext<any, any, any>, name: string): Promise<void> {
	try {
		const Controller = method.controllerClassMetadata?.target as any;
		if (!Controller) {
			throw GenericError(`Internal: Invalid controller in method ${method.methodName}`);
		}
		const instance = new Controller();// Container.get(Controller) as any;
		const func = instance[method.methodName];
		const args = [];
		const params = method.params.sort((a, b) => a.index - b.index);
		for (const param of params) {
			const arg = prepareArg(param, context);
			args.push(arg);
		}
		if (method.binary !== undefined) {
			// eslint-disable-next-line prefer-spread
			const result = await func.apply(instance, args);
			ApiBaseResponder.sendBinary(context.req, context.res, result);
			return;
		}
		if (method.getReturnType === undefined) {
			// eslint-disable-next-line prefer-spread
			await func.apply(instance, args);
			ApiBaseResponder.sendOK(context.req, context.res);
			return;
		}
		const target = method.getReturnType();
		if (target === String) {
			// eslint-disable-next-line prefer-spread
			const result = await func.apply(instance, args);
			ApiBaseResponder.sendString(context.req, context.res, result);
			return;
		}
		const resultType = getMetadataStorage().resultType(target);
		if (!resultType) {
			throw GenericError(
				`The value used as a result type of '@${name}' for '${String(method.getReturnType())}' of '${method.target.name}.${method.methodName}' ` +
				`is not a class decorated with '@ResultType' decorator!`,
			);
		}
		// eslint-disable-next-line prefer-spread
		const result = await instance[method.methodName].apply(instance, args);
		ApiBaseResponder.sendJSON(context.req, context.res, result);
	} catch (e) {
		// console.error(e);
		log.error(e);
		ApiBaseResponder.sendError(context.req, context.res, e);
	}
}

export interface RouteInfo {
	method: 'GET' | 'POST';
	endpoint: string;
	role: string;
	format: string;
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

export interface RestOptions {
	validateRoles: (user: Express.User | undefined, roles: Array<string>) => boolean;
	controllers: any[];
	tmpPath: string;
}

function validateCustomPathParameterValue(rElement: string | undefined, group: CustomPathParameterGroup): any {
	const type = group.getType();
	let value: string = rElement || '';
	if (group.prefix) {
		value = value.replace(group.prefix, '').trim();
	}
	if (value.length === 0) {
		throw MissingParamError(group.name);
	}
	if (type === String) {
		return value;
	} else if (type === Boolean) {
		return Boolean(value);
	} else if (type === Number) {
		const number = Number(value);
		if (isNaN(number)) {
			throw InvalidParamError(group.name, 'is not a number');
		}
		if ((group.min !== undefined && number < group.min) ||
			(group.max !== undefined && number > group.max)) {
			throw InvalidParamError(group.name, 'number not in allowed range');
		}
		return number;
	} else {
		const metadata = getMetadataStorage();
		const enumInfo = metadata.enums.find(e => e.enumObj === type);
		if (enumInfo) {
			const enumObj: any = enumInfo.enumObj;
			if (!enumObj[value]) {
				throw InvalidParamError(group.name, `Enum value not valid`);
			}
			return value;
		}
		throw new Error('Internal: Invalid Custom Path Parameter Type ' + group.name);
	}
}

function processCustomPathParameters(customPathParameters: CustomPathParameters, pathParameters: string, method: MethodMetadata): any {
	const r = customPathParameters.regex.exec(pathParameters) || [];
	let index = 1;
	const result: any = {};
	const route = '/' + customPathParameters.groups.filter((g, index) => r[index + 1]).map(g => `${g.prefix || ''}{${g.name}}`).join('');

	const alias = (method.aliasRoutes || []).find(a => a.route === route);
	for (const group of customPathParameters.groups) {
		if (!alias || !alias.hideParameters.includes(group.name)) {
			result[group.name] = validateCustomPathParameterValue(r[index], group);
		}
		index++;
	}
	return result;
}

export function buildRestRouter(api: express.Router, options: RestOptions): Array<RouteInfo> {
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
			let route = (get.route || '/');
			if (get.customPathParameters) {
				route = (!get.route) ? '/:pathParameters' : get.route.split('{')[0] + ':pathParameters';
			}
			const roles = get.roles || ctrl.roles || [];
			routeInfos.push({
				method: 'GET',
				endpoint: ctrl.route + route,
				role: roles.length > 0 ? roles.join(',') : 'public',
				format: getMethodResultFormat(get)
			});
			const handlers: Array<express.RequestHandler> = [];
			for (const param of get.params) {
				if ((param.kind === 'arg' && param.mode === 'file')) {
					handlers.push(uploadHandler(param.name));
				}
			}
			router.get(route, ...handlers, async (req, res, next) => {
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
		}

		for (const post of posts) {
			let route = (post.route || '/');
			if (post.customPathParameters) {
				route = (!post.route) ? '/:pathParameters' : post.route.split('{')[0] + ':pathParameters';
			}
			const roles = post.roles || ctrl.roles || [];
			routeInfos.push({
				method: 'POST',
				endpoint: ctrl.route + route,
				role: roles.length > 0 ? roles.join(',') : 'public',
				format: getMethodResultFormat(post)
			});
			router.post(route, async (req, res, next) => {
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
		}
		api.use(ctrl.route, router);
	}
	return routeInfos.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}