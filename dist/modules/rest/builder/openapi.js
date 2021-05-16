"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOpenApi = void 0;
const version_1 = require("../../engine/rest/version");
const metadata_1 = require("../metadata");
const express_error_1 = require("./express-error");
const iterate_super_1 = require("../helpers/iterate-super");
const openapi_helpers_1 = require("./openapi-helpers");
const openapi_refs_1 = require("./openapi-refs");
class OpenApiBuilder {
    constructor(extended = true) {
        this.extended = extended;
        this.metadata = metadata_1.getMetadataStorage();
        this.refsBuilder = new openapi_refs_1.OpenApiRefBuilder(extended);
    }
    fillErrorResponses(method, parameters, roles, responses) {
        if (parameters.length > 0) {
            responses['422'] = { description: express_error_1.Errors.invalidParameter };
            if (parameters.find(p => p.required)) {
                responses['400'] = { description: express_error_1.Errors.missingParameter };
            }
        }
        if (parameters.find(p => {
            return p.schema?.$ref === openapi_helpers_1.SCHEMA_ID || p.schema?.items?.$ref === openapi_helpers_1.SCHEMA_ID;
        })) {
            responses['404'] = { description: express_error_1.Errors.itemNotFound };
        }
        if (roles.length > 0) {
            responses['401'] = { description: express_error_1.Errors.unauthorized };
        }
    }
    buildResponses(method, parameters, roles, schemas) {
        const responses = {};
        if (method.binary) {
            this.fillBinaryResponses(method.binary, responses);
        }
        else if (method.getReturnType && method.getReturnType()) {
            const type = method.getReturnType();
            if (type === String) {
                this.fillStringResponse(method, responses);
            }
            else {
                this.fillJSONResponses(type, method, schemas, responses);
            }
        }
        else {
            responses['200'] = { description: 'ok' };
        }
        this.fillErrorResponses(method, parameters, roles, responses);
        return responses;
    }
    fillJSONResponses(type, method, schemas, responses) {
        const content = {};
        let schema = { $ref: this.refsBuilder.getResultRef(type, method.methodName, schemas) };
        if (method.returnTypeOptions?.array) {
            schema = { type: 'array', items: schema };
        }
        content['application/json'] = { schema };
        responses['200'] = { description: 'json data', content };
    }
    fillStringResponse(method, responses) {
        const content = {};
        const mimeTypes = (method.responseStringMimeTypes || ['text/plain']);
        mimeTypes.forEach(mime => content[mime] = { schema: { type: 'string' } });
        responses['200'] = { description: 'string data', content };
    }
    fillBinaryResponses(binary, responses) {
        const content = {};
        binary.forEach(mime => content[mime] = { schema: { type: 'string', format: 'binary' } });
        responses['200'] = { description: 'binary data', content };
    }
    buildRequestBody(method, schemas) {
        const params = method.params;
        const refs = [];
        let isJson = true;
        for (const param of params) {
            if (param.kind === 'args' && param.mode === 'body') {
                refs.push({ $ref: this.refsBuilder.getParamRef(param.getType(), param.methodName, schemas) });
            }
            else if (param.kind === 'arg' && param.mode === 'body') {
                const schema = this.refsBuilder.buildParameterSchema(param, schemas);
                refs.push({ properties: { [param.name]: schema }, description: param.description, required: [param.name] });
            }
            else if (param.kind === 'arg' && param.mode === 'file') {
                isJson = false;
                refs.push(this.refsBuilder.buildUploadSchema(param, schemas));
            }
        }
        if (refs.length > 0) {
            return {
                required: true,
                content: { [isJson ? 'application/json' : 'multipart/form-data']: { schema: refs.length === 1 ? refs[0] : { allOf: refs } } }
            };
        }
        return;
    }
    buildOpenApiMethod(method, ctrl, schemas, isPost, alias) {
        const parameters = this.refsBuilder.buildParameters(method, ctrl, schemas, alias);
        const path = (ctrl.route || '') + (alias?.route || method.route || '');
        const roles = method.roles || ctrl.roles || [];
        const o = {
            operationId: `${ctrl.name}.${method.methodName}${alias?.route || ''}`,
            summary: `${method.summary || method.description} ${alias?.name || ''}`.trim(),
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
                title: 'JamApi', description: 'Api for JamServe', version,
                license: { name: 'MIT', url: 'https://raw.githubusercontent.com/ffalt/jamserve/main/LICENSE' }
            },
            servers: [{
                    url: 'http://localhost:4040/jam/{version}',
                    description: 'A local JamServe API',
                    variables: { version: { enum: [version_1.JAMAPI_URL_VERSION], default: version_1.JAMAPI_URL_VERSION } }
                }],
            tags: [], paths: {},
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
    buildExtensions(openapi, schemas) {
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
            { name: 'API', tags: [...apiTags] },
            { name: 'Models', tags: tagNames }
        ];
    }
    buildControllers(schemas, openapi) {
        const controllers = this.metadata.controllerClasses.filter(c => !c.abstract).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        for (const ctrl of controllers) {
            let gets = [];
            let posts = [];
            iterate_super_1.iterateControllers(this.metadata, ctrl, (ctrlClass => {
                gets = gets.concat(this.metadata.gets.filter(g => g.controllerClassMetadata === ctrlClass));
                posts = posts.concat(this.metadata.posts.filter(g => g.controllerClassMetadata === ctrlClass));
            }));
            this.buildOpenApiMethods(gets, ctrl, schemas, openapi.paths, false);
            this.buildOpenApiMethods(posts, ctrl, schemas, openapi.paths, true);
        }
    }
    build() {
        const openapi = this.buildOpenApiBase(version_1.JAMAPI_VERSION);
        const schemas = {
            'ID': { type: 'string', format: 'uuid' },
            'JSON': { type: 'object' }
        };
        this.buildControllers(schemas, openapi);
        openapi.components = { schemas, securitySchemes: openapi.components?.securitySchemes };
        if (this.extended) {
            this.buildExtensions(openapi, schemas);
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