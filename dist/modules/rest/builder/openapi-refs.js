"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiRefBuilder = void 0;
const openapi_helpers_1 = require("./openapi-helpers");
const metadata_1 = require("../metadata");
const default_value_1 = require("../helpers/default-value");
const iterate_super_1 = require("../helpers/iterate-super");
class OpenApiRefBuilder {
    constructor(extended = true) {
        this.extended = extended;
        this.metadata = metadata_1.getMetadataStorage();
    }
    getEnumRef(enumInfo, schemas) {
        const name = enumInfo.name;
        if (!schemas[name]) {
            schemas[name] = { type: 'string', enum: Object.values(enumInfo.enumObj) };
        }
        return '#/components/schemas/' + name;
    }
    buildFieldSchema(type, typeOptions, schemas) {
        if (typeOptions.isID) {
            return { $ref: openapi_helpers_1.SCHEMA_ID };
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
            const enumInfo = this.metadata.enums.find(e => e.enumObj === type);
            if (enumInfo) {
                return { $ref: this.getEnumRef(enumInfo, schemas) };
            }
        }
        return;
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
                example: typeOptions.isID ? openapi_helpers_1.exampleID : typeOptions.example
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
            example: typeOptions.isID ? openapi_helpers_1.exampleID : typeOptions.example,
            schema: this.buildParameterSchema(param, schemas)
        };
        parameters.push(o);
    }
    collectParameterObj(param, parameters, schemas, hideParameters) {
        const argumentType = this.metadata.argumentTypes.find(it => it.target === param.getType());
        if (!argumentType) {
            throw new Error(`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
                `is not a class decorated with '@ObjParamsType' decorator!`);
        }
        iterate_super_1.iterateArguments(this.metadata, argumentType, argument => {
            this.mapArgFields(param.mode, argument, parameters, schemas, hideParameters);
        });
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
        const argumentType = this.metadata.argumentType(paramClass);
        if (!argumentType) {
            return openapi_helpers_1.SCHEMA_JSON;
        }
        if (!schemas[argumentType.name]) {
            this.buildRef(argumentType, schemas, this.getParamRef.bind(this));
        }
        return '#/components/schemas/' + argumentType.name;
    }
    getResultRef(resultClassValue, name, schemas) {
        const argumentType = this.metadata.resultType(resultClassValue);
        if (!argumentType) {
            if (resultClassValue === Object) {
                return openapi_helpers_1.SCHEMA_JSON;
            }
            throw new Error(`Missing ReturnType for method ${name}`);
        }
        if (!schemas[argumentType.name]) {
            this.buildRef(argumentType, schemas, this.getResultRef.bind(this));
        }
        return '#/components/schemas/' + argumentType.name;
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
    buildUploadSchema(param, schemas) {
        return {
            properties: {
                [param.name]: {
                    type: 'object',
                    description: param.description,
                    properties: {
                        type: { description: 'Mime Type', type: 'string' },
                        file: { description: 'Binary Data', type: 'string', format: 'binary' }
                    },
                    required: ['type', 'file']
                }
            }, required: [param.name], description: 'Binary Part'
        };
    }
    buildParameterSchema(param, schemas) {
        const typeOptions = param.typeOptions;
        let result;
        if (typeOptions.isID) {
            result = { $ref: openapi_helpers_1.SCHEMA_ID };
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
            const enumInfo = this.metadata.enums.find(e => e.enumObj === param.getType());
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
}
exports.OpenApiRefBuilder = OpenApiRefBuilder;
//# sourceMappingURL=openapi-refs.js.map