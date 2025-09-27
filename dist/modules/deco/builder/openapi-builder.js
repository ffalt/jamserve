import { Errors } from '../express/express-error.js';
import { SCHEMA_ID } from './openapi-helpers.js';
import { OpenApiReferenceBuilder } from './openapi-reference-builder.js';
export class BaseOpenApiBuilder {
    constructor(metadata) {
        this.metadata = metadata;
        this.refsBuilder = new OpenApiReferenceBuilder(this.metadata);
    }
    fillErrorResponses(_method, parameters, roles, responses) {
        if (parameters.length > 0) {
            responses['422'] = { description: Errors.invalidParameter };
            if (parameters.some(p => p.required)) {
                responses['400'] = { description: Errors.missingParameter };
            }
        }
        if (parameters.some(p => {
            return p.schema?.$ref === SCHEMA_ID || (p.schema?.items ?? {}).$ref === SCHEMA_ID;
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
        else if (method.getReturnType?.()) {
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
        const mimeTypes = (method.responseStringMimeTypes ?? ['text/plain']);
        for (const mime of mimeTypes)
            content[mime] = { schema: { type: 'string' } };
        responses['200'] = { description: 'string data', content };
    }
    fillBinaryResponses(binary, responses) {
        const content = {};
        for (const mime of binary)
            content[mime] = { schema: { type: 'string', format: 'binary' } };
        responses['200'] = { description: 'binary data', content };
    }
    buildRequestBody(method, schemas) {
        const parameters = method.parameters;
        const references = [];
        let isJson = true;
        for (const parameter of parameters) {
            if (parameter.kind === 'args' && parameter.mode === 'body') {
                references.push({ $ref: this.refsBuilder.getParamRef(parameter.getType(), parameter.methodName, schemas) });
            }
            else if (parameter.kind === 'arg' && parameter.mode === 'body') {
                const schema = this.refsBuilder.buildParameterSchema(parameter, schemas);
                references.push({ properties: { [parameter.name]: schema }, description: parameter.description, required: [parameter.name] });
            }
            else if (parameter.kind === 'arg' && parameter.mode === 'file') {
                isJson = false;
                references.push(this.refsBuilder.buildUploadSchema(parameter, schemas));
            }
        }
        if (references.length > 0) {
            return {
                required: true,
                content: { [isJson ? 'application/json' : 'multipart/form-data']: { schema: references.length === 1 ? references.at(0) : { allOf: references } } }
            };
        }
        return;
    }
    build(openapi, schemas) {
        this.buildPaths(schemas, openapi);
        openapi.components = { schemas: schemas, securitySchemes: openapi.components?.securitySchemes };
        return openapi;
    }
}
//# sourceMappingURL=openapi-builder.js.map