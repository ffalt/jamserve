"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restRouter = void 0;
const express_1 = __importDefault(require("express"));
const metadata_1 = require("../metadata");
const default_value_1 = require("../helpers/default-value");
const express_responder_1 = require("./express-responder");
const express_error_1 = require("./express-error");
const multer_1 = __importDefault(require("multer"));
const fs_utils_1 = require("../../../utils/fs-utils");
const on_finished_1 = __importDefault(require("on-finished"));
const logger_1 = require("../../../utils/logger");
const enums_1 = require("../helpers/enums");
const log = logger_1.logger('RestAPI');
function validateBoolean(value, typeOptions, param) {
    if (typeOptions.array) {
        throw express_error_1.InvalidParamError(param.name);
    }
    if (typeof value !== 'boolean') {
        if (value === 'true') {
            return true;
        }
        else if (value === 'false') {
            return false;
        }
        else {
            throw express_error_1.InvalidParamError(param.name);
        }
    }
    return value;
}
function validateNumber(value, typeOptions, param) {
    if (typeOptions.array) {
        throw express_error_1.InvalidParamError(param.name);
    }
    if (typeof value === 'string' && value.length === 0) {
        throw express_error_1.InvalidParamError(param.name);
    }
    const val = Number(value);
    if (isNaN(val)) {
        throw express_error_1.InvalidParamError(param.name, `Parameter value is not a number`);
    }
    if (val % 1 !== 0) {
        throw express_error_1.InvalidParamError(param.name, `Parameter value is not an integer`);
    }
    if (typeOptions.min !== undefined && val < typeOptions.min) {
        throw express_error_1.InvalidParamError(param.name, `Parameter value too small`);
    }
    if (typeOptions.max !== undefined && val > typeOptions.max) {
        throw express_error_1.InvalidParamError(param.name, `Parameter value too high`);
    }
    return val;
}
function validateString(value, typeOptions, param) {
    if (typeOptions.array) {
        let array = [];
        if (value && Array.isArray(value)) {
            array = value;
        }
        else if (value) {
            const s = `${value}`;
            if (s.length === 0) {
                throw express_error_1.InvalidParamError(param.name);
            }
            array = [s];
        }
        return array.map((v) => String(v)).filter((v) => {
            if (v.length === 0 && !typeOptions.nullable) {
                throw express_error_1.InvalidParamError(param.name);
            }
            return v.length > 0;
        });
    }
    else {
        const val = String(value);
        if (val.length === 0) {
            throw express_error_1.InvalidParamError(param.name);
        }
        return val;
    }
}
function validateEnum(value, typeOptions, param, enumInfo) {
    const enumObj = enumInfo.enumObj;
    const enumValues = enums_1.getEnumReverseValuesMap(enumObj);
    if (typeOptions.array) {
        let array = Array.isArray(value) ? value : [value];
        array = (array || []).map((v) => String(v)).filter(s => s.length > 0);
        for (const val of array) {
            if (!enumValues[val]) {
                throw express_error_1.InvalidParamError(param.name, `Enum value not valid`);
            }
        }
        return array;
    }
    else {
        const val = String(value);
        if (!enumValues[val]) {
            throw express_error_1.InvalidParamError(param.name, `Enum value not valid`);
        }
        return val;
    }
}
function validateObjOrFail(value, typeOptions, param, type) {
    if (typeof value !== 'object') {
        throw new Error(`Internal: Invalid Parameter Object Type for field '${param.name}'`);
    }
    const argumentType = metadata_1.getMetadataStorage().argumentTypes.find(it => it.target === type);
    if (argumentType) {
        const result = new argumentType.target();
        for (const field of argumentType.fields) {
            result[field.name] = validateParameter(field, value, true);
        }
        return result;
    }
    if (param.typeOptions.generic) {
        return value;
    }
    throw new Error(`Internal: Unknown Parameter Type, did you forget to register an enum? '${param.name}'`);
}
function validateParameter(param, data, isField) {
    if (isField) {
        const argumentInstance = new param.target();
        param.typeOptions.defaultValue = default_value_1.getDefaultValue(argumentInstance, param.typeOptions, param.name);
    }
    let value = data[param.name];
    if (value === undefined) {
        value = param.typeOptions.defaultValue;
    }
    const typeOptions = param.typeOptions;
    const isNull = (value === undefined || value === null);
    if (!typeOptions.nullable && isNull) {
        throw express_error_1.MissingParamError(param.name);
    }
    if (isNull) {
        return;
    }
    const type = param.getType();
    if (type === Boolean) {
        value = validateBoolean(value, typeOptions, param);
    }
    else if (type === Number) {
        value = validateNumber(value, typeOptions, param);
    }
    else if (type === String) {
        value = validateString(value, typeOptions, param);
    }
    else {
        const enumInfo = metadata_1.getMetadataStorage().enums.find(e => e.enumObj === type);
        if (enumInfo) {
            value = validateEnum(value, typeOptions, param, enumInfo);
        }
        else {
            value = validateObjOrFail(value, typeOptions, param, type);
        }
    }
    return value;
}
function prepareParameterSingle(param, context) {
    let data = {};
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
        case 'file': {
            const upload = {
                name: context.req.file.path,
                size: context.req.file.size,
                originalname: context.req.file.originalname,
                type: context.req.file.mimetype
            };
            return upload;
        }
    }
    return validateParameter(param, data, false);
}
function mapArgFields(argumentType, data, args = {}) {
    argumentType.fields.forEach(field => {
        args[field.name] = validateParameter(field, data, true);
    });
}
function prepareParameterObj(param, context) {
    const type = param.getType();
    const argumentType = metadata_1.getMetadataStorage().argumentTypes.find(it => it.target === type);
    if (!argumentType) {
        throw express_error_1.GenericError(`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
            `is not a class decorated with '@ObjParamsType' decorator!`);
    }
    const args = {};
    let data = {};
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
        const superArgumentType = metadata_1.getMetadataStorage().argumentTypes.find(it => it.target === superClass);
        if (superArgumentType) {
            mapArgFields(superArgumentType, data, args);
        }
        superClass = Object.getPrototypeOf(superClass);
    }
    mapArgFields(argumentType, data, args);
    return args;
}
function validateArgument(param, context) {
    switch (param.kind) {
        case 'context':
            return param.propertyName ? context[param.propertyName] : context;
        case 'arg': {
            return prepareParameterSingle(param, context);
        }
        case 'args':
            return prepareParameterObj(param, context);
    }
    throw express_error_1.GenericError(`Internal: not implemented ${param.methodName} ${param.kind}`);
}
function registerAutoClean(req, res) {
    on_finished_1.default(res, err => {
        if (err && req.file && req.file.path) {
            fs_utils_1.fileDeleteIfExists(req.file.path).catch(e => {
                console.error(e);
            });
        }
    });
}
async function callMethod(method, context, name) {
    var _a;
    try {
        const Controller = (_a = method.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.target;
        if (!Controller) {
            throw express_error_1.GenericError(`Internal: Invalid controller in method ${method.methodName}`);
        }
        const instance = new Controller();
        const func = instance[method.methodName];
        const args = [];
        const params = method.params.sort((a, b) => a.index - b.index);
        for (const param of params) {
            const arg = validateArgument(param, context);
            if (arg) {
                args.push(arg);
            }
        }
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
        const resultType = metadata_1.getMetadataStorage().resultType(target);
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
function getMethodResultFormat(method) {
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
function validateCustomPathParameterValue(rElement, group) {
    const type = group.getType();
    let value = rElement || '';
    if (group.prefix) {
        value = value.replace(group.prefix, '').trim();
    }
    if (value.length === 0) {
        throw express_error_1.MissingParamError(group.name);
    }
    if (type === String) {
        return value;
    }
    else if (type === Boolean) {
        return Boolean(value);
    }
    else if (type === Number) {
        const number = Number(value);
        if (isNaN(number)) {
            throw express_error_1.InvalidParamError(group.name, 'is not a number');
        }
        if ((group.min !== undefined && number < group.min) ||
            (group.max !== undefined && number > group.max)) {
            throw express_error_1.InvalidParamError(group.name, 'number not in allowed range');
        }
        return number;
    }
    else {
        const metadata = metadata_1.getMetadataStorage();
        const enumInfo = metadata.enums.find(e => e.enumObj === type);
        if (enumInfo) {
            const enumObj = enumInfo.enumObj;
            if (!enumObj[value]) {
                throw express_error_1.InvalidParamError(group.name, `Enum value not valid`);
            }
            return value;
        }
        throw new Error('Internal: Invalid Custom Path Parameter Type ' + group.name);
    }
}
function processCustomPathParameters(customPathParameters, pathParameters, method) {
    const r = customPathParameters.regex.exec(pathParameters) || [];
    let index = 1;
    const result = {};
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
function restPOST(post, ctrl, router, options, uploadHandler) {
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
                    ...processCustomPathParameters(post.customPathParameters, req.params.pathParameters, post), pathParameters: undefined
                };
            }
            await callMethod(post, { req, res, next, orm: req.orm, engine: req.engine, user: req.user }, 'Post');
        }
        catch (e) {
            express_responder_1.ApiBaseResponder.sendError(req, res, e);
        }
    });
    return {
        method: 'POST',
        endpoint: ctrl.route + route,
        role: roles.length > 0 ? roles.join(',') : 'public',
        format: getMethodResultFormat(post)
    };
}
function restGET(get, ctrl, router, options) {
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
                    ...processCustomPathParameters(get.customPathParameters, req.params.pathParameters, get), pathParameters: undefined
                };
            }
            await callMethod(get, { req, res, orm: req.orm, engine: req.engine, next, user: req.user }, 'Get');
        }
        catch (e) {
            express_responder_1.ApiBaseResponder.sendError(req, res, e);
        }
    });
    return {
        method: 'GET',
        endpoint: ctrl.route + route,
        role: roles.length > 0 ? roles.join(',') : 'public',
        format: getMethodResultFormat(get)
    };
}
function restRouter(api, options) {
    const routeInfos = [];
    const upload = multer_1.default({ dest: fs_utils_1.ensureTrailingPathSeparator(options.tmpPath) });
    const metadata = metadata_1.getMetadataStorage();
    const uploadHandler = (field, autoClean = true) => {
        const mu = upload.single(field);
        return (req, res, next) => {
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
        const router = express_1.default.Router();
        let gets = metadata.gets.filter(g => g.controllerClassMetadata === ctrl);
        let posts = metadata.posts.filter(g => g.controllerClassMetadata === ctrl);
        let superClass = Object.getPrototypeOf(ctrl.target);
        while (superClass.prototype !== undefined) {
            const superClassType = metadata_1.getMetadataStorage().controllerClasses.find(it => it.target === superClass);
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
exports.restRouter = restRouter;
//# sourceMappingURL=express.js.map