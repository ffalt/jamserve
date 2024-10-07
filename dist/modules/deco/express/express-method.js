import { GenericError, UnauthError } from './express-error.js';
import { logger } from '../../../utils/logger.js';
import { ExpressParameters } from './express-parameters.js';
import { processCustomPathParameters } from './express-path-parameters.js';
const log = logger('RestAPI');
export class ExpressMethod {
    constructor() {
        this.parameters = new ExpressParameters();
    }
    static getMethodResultFormat(method) {
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
    buildArguments(method, context, metadata) {
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
    async callMethod(method, context, name, { responder, resultTypes }, metadata) {
        try {
            const Controller = method.controllerClassMetadata?.target;
            if (!Controller) {
                throw GenericError(`Internal: Invalid controller in method ${method.methodName}`);
            }
            const instance = new Controller();
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
                throw GenericError(`The value used as a result type of '@${name}' for '${String(method.getReturnType())}' of '${method.target.name}.${method.methodName}' ` +
                    `is not a class decorated with '@ResultType' decorator!`);
            }
            const result = await instance[method.methodName].apply(instance, args);
            responder.sendData(context.req, context.res, result);
        }
        catch (e) {
            log.error(e.fail || e.message);
            responder.sendError(context.req, context.res, e);
        }
    }
    POST(post, ctrl, router, options, uploadHandler, metadata) {
        let route = (post.route || '/');
        if (post.customPathParameters) {
            route = (!post.route) ? '/:pathParameters' : post.route.split('{')[0] + ':pathParameters';
        }
        const roles = post.roles || ctrl?.roles || [];
        const handlers = [];
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
                        ...processCustomPathParameters(post.customPathParameters, req.params.pathParameters, post, options), pathParameters: undefined
                    };
                }
                await this.callMethod(post, { req, res, next, orm: req.orm, engine: req.engine, user: req.user }, 'Post', options, metadata);
            }
            catch (e) {
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
    GET(get, ctrl, router, options, metadata) {
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
                        ...processCustomPathParameters(get.customPathParameters, req.params.pathParameters, get, options), pathParameters: undefined
                    };
                }
                await this.callMethod(get, { req, res, orm: req.orm, engine: req.engine, next, user: req.user }, 'Get', options, metadata);
            }
            catch (e) {
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
    SUBSONIC(get, ctrl, router, options, metadata) {
        let route = (get.route || '/');
        if (get.customPathParameters) {
            route = (!get.route) ? '/:pathParameters' : get.route.split('{')[0] + ':pathParameters';
        }
        const roles = get.roles || ctrl?.roles || [];
        router.all(`${route}(.view)?`, async (req, res, next) => {
            try {
                if (!options.validateRoles(req.user, roles)) {
                    throw UnauthError();
                }
                if (get.customPathParameters) {
                    req.params = {
                        ...req.params,
                        ...processCustomPathParameters(get.customPathParameters, req.params.pathParameters, get, options), pathParameters: undefined
                    };
                }
                await this.callMethod(get, { req, res, orm: req.orm, engine: req.engine, next, user: req.user }, 'All', options, metadata);
            }
            catch (e) {
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
//# sourceMappingURL=express-method.js.map