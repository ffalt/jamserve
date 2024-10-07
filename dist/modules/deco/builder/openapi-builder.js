import { Errors } from '../express/express-error.js';
import { SCHEMA_ID } from './openapi-helpers.js';
import { OpenApiRefBuilder } from './openapi-refs.js';
export class BaseOpenApiBuilder {
    constructor(metadata) {
        this.metadata = metadata;
        this.refsBuilder = new OpenApiRefBuilder(this.metadata);
    }
    fillErrorResponses(method, parameters, roles, responses) {
        if (parameters.length > 0) {
            responses['422'] = { description: Errors.invalidParameter };
            if (parameters.find(p => p.required)) {
                responses['400'] = { description: Errors.missingParameter };
            }
        }
        if (parameters.find(p => {
            return p.schema?.$ref === SCHEMA_ID || (p.schema?.items || {}).$ref === SCHEMA_ID;
        })) {
            responses['404'] = { description: Errors.itemNotFound };
        }
        if (roles.length > 0) {
            responses['401'] = { description: Errors.unauthorized };
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
                this.fillFormatResponses(type, method, schemas, responses);
            }
        }
        else {
            responses['200'] = { description: 'ok' };
        }
        this.fillErrorResponses(method, parameters, roles, responses);
        return responses;
    }
    fillXMLResponses(type, method, schemas, responses) {
        const content = {};
        let schema = { $ref: this.refsBuilder.getResultRef(type, method.methodName, schemas) };
        if (method.returnTypeOptions?.array) {
            schema = { type: 'array', items: schema };
        }
        content['application/xml'] = { schema };
        responses['200'] = { description: 'xml data', content };
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
    static getTags(p) {
        if (p.get) {
            return p.get.tags;
        }
        if (p.post) {
            return p.post.tags;
        }
        if (p.put) {
            return p.put.tags;
        }
        if (p.patch) {
            return p.patch.tags;
        }
        return undefined;
    }
    build(openapi, schemas) {
        this.buildPaths(schemas, openapi);
        openapi.components = { schemas, securitySchemes: openapi.components?.securitySchemes };
        return openapi;
    }
}
//# sourceMappingURL=openapi-builder.js.map