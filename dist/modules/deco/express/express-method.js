import { genericError, unauthError } from './express-error.js';
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
        return method.defaultReturnTypeFormat ?? 'json';
    }
    buildParameters(method, context, metadata) {
        const result = [];
        const parameters = [...method.parameters].sort((a, b) => a.index - b.index);
        for (const parameter of parameters) {
            const validatedParameter = this.parameters.validateParameter(parameter, context, metadata);
            if (validatedParameter) {
                result.push(validatedParameter);
            }
        }
        return result;
    }
    async callMethod(method, context, name, { responder, resultTypes }, metadata) {
        try {
            const Controller = method.controllerClassMetadata?.target;
            if (!Controller) {
                throw genericError(`Internal: Invalid controller in method ${method.methodName}`);
            }
            const instance = new Controller();
            const instanceFunction = instance[method.methodName];
            const parameters = this.buildParameters(method, context, metadata);
            if (method.binary !== undefined) {
                const result = await instanceFunction.apply(instance, parameters);
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
                const result = await instanceFunction.apply(instance, parameters);
                responder.sendString(context.req, context.res, result);
                return;
            }
            const resultType = resultTypes.find(it => it.target === target);
            if (!resultType) {
                throw genericError(`The value used as a result type of '@${name}' for '${JSON.stringify(method.getReturnType())}' of '${method.target.name}.${method.methodName}' is not a class decorated with '@ResultType' decorator!`);
            }
            const result = await instance[method.methodName](...parameters);
            responder.sendData(context.req, context.res, result);
        }
        catch (error) {
            log.error(error);
            responder.sendError(context.req, context.res, error);
        }
    }
    POST(post, ctrl, router, options, uploadHandler, metadata) {
        let route = (post.route ?? '/');
        if (post.customPathParameters) {
            route = (post.route) ? `${post.route.split('{').at(0)}:pathParameters` : '/:pathParameters';
        }
        const roles = post.roles ?? ctrl?.roles ?? [];
        const handlers = [];
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
                        ...processCustomPathParameters(post.customPathParameters, req.params.pathParameters, post, options),
                        pathParameters: undefined
                    };
                }
                await this.callMethod(post, { req, res, next, orm: req.orm, engine: req.engine, user: req.user }, 'Post', options, metadata);
            }
            catch (error) {
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
    GET(get, ctrl, router, options, metadata) {
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
                        ...processCustomPathParameters(get.customPathParameters, req.params.pathParameters, get, options), pathParameters: undefined
                    };
                }
                await this.callMethod(get, { req, res, orm: req.orm, engine: req.engine, next, user: req.user }, 'Get', options, metadata);
            }
            catch (error) {
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
    SUBSONIC(get, ctrl, router, options, metadata) {
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
                        ...processCustomPathParameters(get.customPathParameters, req.params.pathParameters, get, options), pathParameters: undefined
                    };
                }
                await this.callMethod(get, { req, res, orm: req.orm, engine: req.engine, next, user: req.user }, 'All', options, metadata);
            }
            catch (error) {
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
//# sourceMappingURL=express-method.js.map