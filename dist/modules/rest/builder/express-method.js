import { GenericError, UnauthError } from './express-error';
import { ApiBaseResponder } from './express-responder';
import { getMetadataStorage } from '../metadata';
import { logger } from '../../../utils/logger';
import { ExpressParameters } from './express-parameters';
import { processCustomPathParameters } from './express-path-parameters';
const log = logger('RestAPI');
export class ExpressMethod {
    constructor() {
        this.parameters = new ExpressParameters();
        this.metadata = getMetadataStorage();
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
        return 'json';
    }
    buildArguments(method, context) {
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
    async callMethod(method, context, name) {
        try {
            const Controller = method.controllerClassMetadata?.target;
            if (!Controller) {
                throw GenericError(`Internal: Invalid controller in method ${method.methodName}`);
            }
            const instance = new Controller();
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
                throw GenericError(`The value used as a result type of '@${name}' for '${String(method.getReturnType())}' of '${method.target.name}.${method.methodName}' ` +
                    `is not a class decorated with '@ResultType' decorator!`);
            }
            const result = await instance[method.methodName].apply(instance, args);
            ApiBaseResponder.sendJSON(context.req, context.res, result);
        }
        catch (e) {
            log.error(e);
            ApiBaseResponder.sendError(context.req, context.res, e);
        }
    }
    POST(post, ctrl, router, options, uploadHandler) {
        let route = (post.route || '/');
        if (post.customPathParameters) {
            route = (!post.route) ? '/:pathParameters' : post.route.split('{')[0] + ':pathParameters';
        }
        const roles = post.roles || ctrl.roles || [];
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
                        ...processCustomPathParameters(post.customPathParameters, req.params.pathParameters, post), pathParameters: undefined
                    };
                }
                await this.callMethod(post, { req, res, next, orm: req.orm, engine: req.engine, user: req.user }, 'Post');
            }
            catch (e) {
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
    GET(get, ctrl, router, options) {
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
                        ...processCustomPathParameters(get.customPathParameters, req.params.pathParameters, get), pathParameters: undefined
                    };
                }
                await this.callMethod(get, { req, res, orm: req.orm, engine: req.engine, next, user: req.user }, 'Get');
            }
            catch (e) {
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
//# sourceMappingURL=express-method.js.map