"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressMethod = void 0;
const express_error_1 = require("./express-error");
const express_responder_1 = require("./express-responder");
const metadata_1 = require("../metadata");
const logger_1 = require("../../../utils/logger");
const express_parameters_1 = require("./express-parameters");
const express_path_parameters_1 = require("./express-path-parameters");
const log = logger_1.logger('RestAPI');
class ExpressMethod {
    constructor() {
        this.parameters = new express_parameters_1.ExpressParameters();
        this.metadata = metadata_1.getMetadataStorage();
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
        var _a;
        try {
            const Controller = (_a = method.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.target;
            if (!Controller) {
                throw express_error_1.GenericError(`Internal: Invalid controller in method ${method.methodName}`);
            }
            const instance = new Controller();
            const func = instance[method.methodName];
            const args = this.buildArguments(method, context);
            if (method.binary !== undefined) {
                const result = await func.apply(instance, args);
                express_responder_1.ApiBaseResponder.sendBinary(context.req, context.res, result);
                return;
            }
            if (method.getReturnType === undefined) {
                await func.apply(instance, args);
                express_responder_1.ApiBaseResponder.sendOK(context.req, context.res);
                return;
            }
            const target = method.getReturnType();
            if (target === String) {
                const result = await func.apply(instance, args);
                express_responder_1.ApiBaseResponder.sendString(context.req, context.res, result);
                return;
            }
            const resultType = this.metadata.resultType(target);
            if (!resultType) {
                throw express_error_1.GenericError(`The value used as a result type of '@${name}' for '${String(method.getReturnType())}' of '${method.target.name}.${method.methodName}' ` +
                    `is not a class decorated with '@ResultType' decorator!`);
            }
            const result = await instance[method.methodName].apply(instance, args);
            express_responder_1.ApiBaseResponder.sendJSON(context.req, context.res, result);
        }
        catch (e) {
            log.error(e);
            express_responder_1.ApiBaseResponder.sendError(context.req, context.res, e);
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
                    throw express_error_1.UnauthError();
                }
                if (post.customPathParameters) {
                    req.params = {
                        ...req.params,
                        ...express_path_parameters_1.processCustomPathParameters(post.customPathParameters, req.params.pathParameters, post), pathParameters: undefined
                    };
                }
                await this.callMethod(post, { req, res, next, orm: req.orm, engine: req.engine, user: req.user }, 'Post');
            }
            catch (e) {
                express_responder_1.ApiBaseResponder.sendError(req, res, e);
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
                    throw express_error_1.UnauthError();
                }
                if (get.customPathParameters) {
                    req.params = {
                        ...req.params,
                        ...express_path_parameters_1.processCustomPathParameters(get.customPathParameters, req.params.pathParameters, get), pathParameters: undefined
                    };
                }
                await this.callMethod(get, { req, res, orm: req.orm, engine: req.engine, next, user: req.user }, 'Get');
            }
            catch (e) {
                express_responder_1.ApiBaseResponder.sendError(req, res, e);
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
exports.ExpressMethod = ExpressMethod;
//# sourceMappingURL=express-method.js.map