"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOpenApi = exports.exampleID = void 0;
const version_1 = require("../../engine/rest/version");
const metadata_1 = require("../metadata");
const default_value_1 = require("../helpers/default-value");
const express_error_1 = require("./express-error");
exports.exampleID = 'c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0';
const SCHEMA_JSON = '#/components/schemas/JSON';
const SCHEMA_ID = '#/components/schemas/ID';
class OpenApiBuilder {
    constructor(extended = true) {
        this.extended = extended;
    }
    mapArgFields(mode, argumentType, parameters, schemas, hideParameters) {
        const argumentInstance = new argumentType.target();
        argumentType.fields.forEach(field => {
            if (hideParameters && hideParameters.includes(field.name)) {
                return;
            }
            field.typeOptions.defaultValue = default_value_1.getDefaultValue(argumentInstance, field.typeOptions, field.name);
            const typeOptions = field.typeOptions;
            const o = {
                in: mode,
                name: field.name,
                description: field.description,
                deprecated: field.deprecationReason ? true : undefined,
                required: !typeOptions.nullable || mode === 'path',
                example: typeOptions.isID ? exports.exampleID : typeOptions.example
            };
            const type = field.getType();
            o.schema = this.buildFieldSchema(type, typeOptions, schemas);
            if (!o.schema) {
                throw new Error(`Unknown Argument Type, did you forget to register an enum? ${JSON.stringify(field)}`);
            }
            if (typeOptions.array) {
                o.schema = { type: 'array', items: o.schema };
            }
            parameters.push(o);
        });
    }
    buildFieldSchema(type, typeOptions, schemas) {
        if (typeOptions.isID) {
            return { $ref: SCHEMA_ID };
        }
        else if (type === String) {
            return { type: 'string', default: typeOptions.defaultValue, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined };
        }
        else if (type === Number) {
            return {
                type: 'integer', default: typeOptions.defaultValue,
                minimum: typeOptions.min, maximum: typeOptions.max, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined
            };
        }
        else if (type === Boolean) {
            return { type: 'boolean', default: typeOptions.defaultValue, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined };
        }
        else {
            const enumInfo = metadata_1.getMetadataStorage().enums.find(e => e.enumObj === type);
            if (enumInfo) {
                return { $ref: this.getEnumRef(enumInfo, schemas) };
            }
        }
        return;
    }
    getResultRef(resultClassValue, name, schemas) {
        const argumentType = metadata_1.getMetadataStorage().resultType(resultClassValue);
        if (!argumentType) {
            if (resultClassValue === Object) {
                return SCHEMA_JSON;
            }
            throw new Error(`Missing ReturnType for method ${name}`);
        }
        if (!schemas[argumentType.name]) {
            this.buildRef(argumentType, schemas, this.getResultRef.bind(this));
        }
        return '#/components/schemas/' + argumentType.name;
    }
    buildRef(argumentType, schemas, recursiveBuild) {
        const argumentInstance = new argumentType.target();
        const properties = {};
        const required = [];
        for (const field of argumentType.fields) {
            field.typeOptions.defaultValue = default_value_1.getDefaultValue(argumentInstance, field.typeOptions, field.name);
            const typeOptions = field.typeOptions;
            if (!typeOptions.nullable) {
                required.push(field.name);
            }
            const type = field.getType();
            let f = this.buildFieldSchema(type, typeOptions, schemas);
            if (!f) {
                f = { $ref: recursiveBuild(type, argumentType.name, schemas) };
            }
            properties[field.name] = typeOptions.array ? { type: 'array', items: f } : f;
        }
        schemas[argumentType.name] = {
            type: 'object',
            properties,
            required: required.length > 0 ? required : undefined
        };
        const superClass = Object.getPrototypeOf(argumentType.target);
        if (superClass.prototype !== undefined) {
            const allOf = [{ $ref: recursiveBuild(superClass, argumentType.name, schemas) }];
            if (Object.keys(properties).length > 0) {
                allOf.push({
                    properties,
                    required: required.length > 0 ? required : undefined
                });
            }
            schemas[argumentType.name] = { allOf };
        }
    }
    getParamRef(paramClass, name, schemas) {
        const argumentType = metadata_1.getMetadataStorage().argumentType(paramClass);
        if (!argumentType) {
            return SCHEMA_JSON;
        }
        if (!schemas[argumentType.name]) {
            this.buildRef(argumentType, schemas, this.getParamRef.bind(this));
        }
        return '#/components/schemas/' + argumentType.name;
    }
    getEnumRef(enumInfo, schemas) {
        const name = enumInfo.name;
        if (!schemas[name]) {
            schemas[name] = { type: 'string', enum: Object.values(enumInfo.enumObj) };
        }
        return '#/components/schemas/' + name;
    }
    collectParameter(param, parameters, ctrl, schemas, hideParameters) {
        if (hideParameters && hideParameters.includes(param.name)) {
            return;
        }
        const typeOptions = param.typeOptions;
        const o = {
            in: param.mode,
            name: param.name,
            description: typeOptions.description,
            deprecated: typeOptions.deprecationReason || ctrl.deprecationReason ? true : undefined,
            required: !param.typeOptions.nullable || param.mode === 'path',
            example: typeOptions.isID ? exports.exampleID : typeOptions.example,
            schema: this.buildParameterSchema(param, schemas)
        };
        parameters.push(o);
    }
    collectParameterObj(param, parameters, schemas, hideParameters) {
        const argumentType = metadata_1.getMetadataStorage().argumentTypes.find(it => it.target === param.getType());
        if (!argumentType) {
            throw new Error(`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
                `is not a class decorated with '@ObjParamsType' decorator!`);
        }
        let superClass = Object.getPrototypeOf(argumentType.target);
        while (superClass.prototype !== undefined) {
            const superArgumentType = metadata_1.getMetadataStorage().argumentTypes.find(it => it.target === superClass);
            if (superArgumentType) {
                this.mapArgFields(param.mode, superArgumentType, parameters, schemas, hideParameters);
            }
            superClass = Object.getPrototypeOf(superClass);
        }
        this.mapArgFields(param.mode, argumentType, parameters, schemas, hideParameters);
    }
    buildParameters(method, ctrl, schemas, alias) {
        const params = method.params;
        const parameters = [];
        for (const param of params) {
            if (param.kind === 'args' && ['path', 'query'].includes(param.mode)) {
                this.collectParameterObj(param, parameters, schemas, alias === null || alias === void 0 ? void 0 : alias.hideParameters);
            }
            else if (param.kind === 'arg' && ['path', 'query'].includes(param.mode)) {
                this.collectParameter(param, parameters, ctrl, schemas, alias === null || alias === void 0 ? void 0 : alias.hideParameters);
            }
        }
        return parameters.sort((a, b) => {
            const result = (a.required === b.required) ? 0 : a.required ? -1 : 1;
            if (result === 0) {
                return a.name.localeCompare(b.name);
            }
            return result;
        });
    }
    fillErrorResponses(method, parameters, roles, responses) {
        if (parameters.length > 0) {
            responses['422'] = { description: express_error_1.Errors.invalidParameter };
            if (parameters.find(p => p.required)) {
                responses['400'] = { description: express_error_1.Errors.missingParameter };
            }
        }
        if (parameters.find(p => {
            var _a, _b, _c;
            return ((_a = p.schema) === null || _a === void 0 ? void 0 : _a.$ref) === SCHEMA_ID || ((_c = (_b = p.schema) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.$ref) === SCHEMA_ID;
        })) {
            responses['404'] = { description: express_error_1.Errors.itemNotFound };
        }
        if (roles.length > 0) {
            responses['401'] = { description: express_error_1.Errors.unauthorized };
        }
    }
    buildResponses(method, parameters, roles, schemas) {
        var _a;
        const responses = {};
        if (method.binary) {
            const content = {};
            method.binary.forEach(mime => {
                content[mime] = { schema: { type: 'string', format: 'binary' } };
            });
            responses['200'] = { description: 'binary data', content };
        }
        else if (method.getReturnType && method.getReturnType()) {
            const content = {};
            const type = method.getReturnType();
            if (type === String) {
                const mimeTypes = (method.responseStringMimeTypes || ['text/plain']);
                mimeTypes.forEach(mime => {
                    content[mime] = { schema: { type: 'string' } };
                });
                responses['200'] = { description: 'string data', content };
            }
            else {
                let schema = { $ref: this.getResultRef(type, method.methodName, schemas) };
                if ((_a = method.returnTypeOptions) === null || _a === void 0 ? void 0 : _a.array) {
                    schema = { type: 'array', items: schema };
                }
                content['application/json'] = { schema };
                responses['200'] = { description: 'json data', content };
            }
        }
        else {
            responses['200'] = { description: 'ok' };
        }
        this.fillErrorResponses(method, parameters, roles, responses);
        return responses;
    }
    buildParameterSchema(param, schemas) {
        const typeOptions = param.typeOptions;
        let result;
        if (typeOptions.isID) {
            result = { $ref: SCHEMA_ID };
        }
        else if (param.getType() === String) {
            result = { type: 'string' };
        }
        else if (param.getType() === Number) {
            result = { type: 'integer', default: typeOptions.defaultValue, minimum: typeOptions.min, maximum: typeOptions.max };
        }
        else if (param.getType() === Boolean) {
            result = { type: 'boolean', default: typeOptions.defaultValue };
        }
        else {
            const enumInfo = metadata_1.getMetadataStorage().enums.find(e => e.enumObj === param.getType());
            if (enumInfo) {
                result = { $ref: this.getEnumRef(enumInfo, schemas) };
            }
            else {
                throw new Error(`Implement OpenApi collectParameter ${JSON.stringify(param)}`);
            }
        }
        if (typeOptions.array) {
            result = { type: 'array', items: result };
        }
        if (this.extended || !result.$ref) {
            result.description = param.description;
            result.deprecated = param.deprecationReason ? true : undefined;
        }
        return result;
    }
    buildRequestBody(method, schemas) {
        const params = method.params;
        const refs = [];
        let isJson = true;
        for (const param of params) {
            if (param.kind === 'args' && param.mode === 'body') {
                refs.push({ $ref: this.getParamRef(param.getType(), param.methodName, schemas) });
            }
            else if (param.kind === 'arg' && param.mode === 'body') {
                const schema = this.buildParameterSchema(param, schemas);
                const properties = {};
                properties[param.name] = schema;
                refs.push({ properties, description: param.description, required: [param.name] });
            }
            else if (param.kind === 'arg' && param.mode === 'file') {
                isJson = false;
                const properties = {};
                properties[param.name] = {
                    type: 'object',
                    description: param.description,
                    properties: {
                        type: {
                            description: 'Mime Type',
                            type: 'string'
                        },
                        file: {
                            description: 'Binary Data',
                            type: 'string',
                            format: 'binary'
                        }
                    },
                    required: ['type', 'file']
                };
                const upload = { properties, required: [param.name], description: 'Binary Part' };
                refs.push(upload);
            }
        }
        if (refs.length > 0) {
            const result = {
                required: true,
                content: {}
            };
            const schema = refs.length === 1 ? refs[0] : { allOf: refs };
            if (isJson) {
                result.content['application/json'] = { schema };
            }
            else {
                result.content['multipart/form-data'] = { schema };
            }
            return result;
        }
        return;
    }
    buildOpenApiMethod(method, ctrl, schemas, isPost, alias) {
        const parameters = this.buildParameters(method, ctrl, schemas, alias);
        const path = (ctrl.route || '') + ((alias === null || alias === void 0 ? void 0 : alias.route) || method.route || '');
        const roles = method.roles || ctrl.roles || [];
        const o = {
            operationId: `${ctrl.name}.${method.methodName}${(alias === null || alias === void 0 ? void 0 : alias.route) || ''}`,
            summary: `${method.summary || method.description} ${(alias === null || alias === void 0 ? void 0 : alias.name) || ''}`.trim(),
            description: method.description,
            deprecated: method.deprecationReason || ctrl.deprecationReason ? true : undefined,
            tags: method.tags || ctrl.tags,
            parameters,
            requestBody: isPost ? this.buildRequestBody(method, schemas) : undefined,
            responses: this.buildResponses(method, parameters, roles, schemas),
            security: roles.length === 0 ? [] : [{ cookieAuth: roles }, { bearerAuth: roles }]
        };
        return { path, o };
    }
    buildOpenApiBase(version) {
        return {
            openapi: '3.0.0',
            info: {
                description: 'Api for JamServe',
                version,
                title: 'JamApi',
                license: {
                    name: 'MIT',
                    url: 'https://raw.githubusercontent.com/ffalt/jamserve/main/LICENSE'
                }
            },
            servers: [{
                    url: 'http://localhost:4040/jam/{version}',
                    description: 'A local JamServe API',
                    variables: { version: { enum: [version_1.JAMAPI_URL_VERSION], default: version_1.JAMAPI_URL_VERSION } }
                }],
            tags: [],
            paths: {},
            components: {
                securitySchemes: {
                    cookieAuth: { type: 'apiKey', in: 'cookie', name: 'jam.sid' },
                    bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
                },
                schemas: {}
            },
            security: []
        };
    }
    buildOpenApiMethods(methods, ctrl, schemas, paths, isPost) {
        for (const method of methods) {
            const { path, o } = this.buildOpenApiMethod(method, ctrl, schemas, isPost);
            const mode = isPost ? 'post' : 'get';
            paths[path] = paths[path] || {};
            paths[path][mode] = o;
            for (const alias of (method.aliasRoutes || [])) {
                const aliasMethod = this.buildOpenApiMethod(method, ctrl, schemas, isPost, alias);
                paths[aliasMethod.path] = paths[aliasMethod.path] || {};
                paths[aliasMethod.path][mode] = aliasMethod.o;
            }
        }
    }
    build() {
        var _a;
        const metadata = metadata_1.getMetadataStorage();
        const openapi = this.buildOpenApiBase(version_1.JAMAPI_VERSION);
        const schemas = {
            'ID': { type: 'string', format: 'uuid' },
            'JSON': { type: 'object' }
        };
        const controllers = metadata.controllerClasses.filter(c => !c.abstract).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        for (const ctrl of controllers) {
            if (ctrl.abstract) {
                continue;
            }
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
            this.buildOpenApiMethods(gets, ctrl, schemas, openapi.paths, false);
            this.buildOpenApiMethods(posts, ctrl, schemas, openapi.paths, true);
        }
        openapi.components = { schemas, securitySchemes: (_a = openapi.components) === null || _a === void 0 ? void 0 : _a.securitySchemes };
        if (this.extended) {
            const apiTags = new Set();
            const tags = [];
            const tagNames = [];
            for (const key of Object.keys(openapi.paths)) {
                const p = openapi.paths[key];
                const list = (p.get ? p.get.tags : p.post.tags) || [];
                for (const s of list) {
                    apiTags.add(s);
                }
            }
            for (const key of Object.keys(schemas)) {
                const modelName = `${key.toLowerCase()}_model`;
                tagNames.push(modelName);
                const tag = {
                    'name': modelName,
                    'x-displayName': key,
                    'description': `<SchemaDefinition schemaRef="#/components/schemas/${key}" />\n`
                };
                tags.push(tag);
            }
            tagNames.sort();
            openapi.tags = tags;
            openapi['x-tagGroups'] = [
                {
                    name: 'API',
                    tags: [...apiTags]
                },
                {
                    name: 'Models',
                    tags: tagNames
                }
            ];
        }
        return openapi;
    }
}
function buildOpenApi(extended = true) {
    const builder = new OpenApiBuilder(extended);
    return builder.build();
}
exports.buildOpenApi = buildOpenApi;
//# sourceMappingURL=openapi.js.map