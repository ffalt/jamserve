import { exampleID, SCHEMA_ID, SCHEMA_JSON, exampleIDInt } from './openapi-helpers.js';
import { getDefaultValue } from '../helpers/default-value.js';
import { iterateParameters } from '../helpers/iterate-super.js';
export class OpenApiReferenceBuilder {
    constructor(metadata) {
        this.metadata = metadata;
    }
    static getEnumRef(enumInfo, schemas) {
        const name = enumInfo.name;
        schemas[name] ?? (schemas[name] = { type: 'string', enum: Object.values(enumInfo.enumObj) });
        return `#/components/schemas/${name}`;
    }
    buildFieldSchema(type, typeOptions, schemas) {
        if (typeOptions.isID) {
            return { $ref: SCHEMA_ID };
        }
        switch (type) {
            case String: {
                return { type: 'string', default: typeOptions.defaultValue, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined };
            }
            case Number: {
                return {
                    type: 'integer', default: typeOptions.defaultValue,
                    minimum: typeOptions.min, maximum: typeOptions.max, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined
                };
            }
            case Boolean: {
                return { type: 'boolean', default: typeOptions.defaultValue, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined };
            }
            default: {
                const enumInfo = this.metadata.enumInfo(type);
                if (enumInfo) {
                    return { $ref: OpenApiReferenceBuilder.getEnumRef(enumInfo, schemas) };
                }
            }
        }
        return;
    }
    mapExample(typeOptions, schemas) {
        if (!typeOptions.isID) {
            return typeOptions.example ?? undefined;
        }
        const idSchemaType = schemas.ID.type;
        return idSchemaType === 'integer' ? exampleIDInt : exampleID;
    }
    mapArgFields(mode, parameterType, parameters, schemas, hideParameters) {
        const argumentInstance = new parameterType.target();
        for (const field of parameterType.fields) {
            if (hideParameters?.includes(field.name)) {
                continue;
            }
            field.typeOptions.defaultValue = getDefaultValue(argumentInstance, field.typeOptions, field.name);
            const typeOptions = field.typeOptions;
            const o = {
                in: mode,
                name: field.name,
                description: field.description,
                deprecated: field.deprecationReason ? true : undefined,
                required: !typeOptions.nullable || mode === 'path',
                example: this.mapExample(typeOptions, schemas)
            };
            const type = field.getType();
            o.schema = this.buildFieldSchema(type, typeOptions, schemas);
            if (!o.schema) {
                throw new Error(`Unknown Parameter Type, did you forget to register an enum? ${JSON.stringify(field)}`);
            }
            if (typeOptions.array) {
                o.schema = { type: 'array', items: o.schema };
            }
            parameters.push(o);
        }
    }
    collectParameter(parameter, parameters, ctrl, schemas, hideParameters) {
        if (hideParameters?.includes(parameter.name)) {
            return;
        }
        const typeOptions = parameter.typeOptions;
        const o = {
            in: parameter.mode,
            name: parameter.name,
            description: typeOptions.description,
            deprecated: typeOptions.deprecationReason || ctrl?.deprecationReason ? true : undefined,
            required: !parameter.typeOptions.nullable || parameter.mode === 'path',
            example: this.mapExample(typeOptions, schemas),
            schema: this.buildParameterSchema(parameter, schemas)
        };
        parameters.push(o);
    }
    collectParameterObj(parameter, parameters, schemas, hideParameters) {
        const parameterType = this.metadata.parameterTypes.find(it => it.target === parameter.getType());
        if (!parameterType) {
            throw new Error(`The value used as a type of '@QueryParams' for '${parameter.propertyName}' of '${parameter.target.name}.${parameter.methodName}' is not a class decorated with '@ObjParamsType' decorator!`);
        }
        iterateParameters(this.metadata.parameterTypes, parameterType, argument => {
            this.mapArgFields(parameter.mode, argument, parameters, schemas, hideParameters);
        });
    }
    buildRef(parameterType, schemas, recursiveBuild) {
        const argumentInstance = new parameterType.target();
        const properties = {};
        const required = [];
        for (const field of parameterType.fields) {
            field.typeOptions.defaultValue = getDefaultValue(argumentInstance, field.typeOptions, field.name);
            const typeOptions = field.typeOptions;
            if (!typeOptions.nullable) {
                required.push(field.name);
            }
            const type = field.getType();
            let f = this.buildFieldSchema(type, typeOptions, schemas);
            f ?? (f = { $ref: recursiveBuild(type, parameterType.name, schemas) });
            properties[field.name] = typeOptions.array ? { type: 'array', items: f } : f;
        }
        schemas[parameterType.name] = {
            type: 'object',
            properties,
            required: required.length > 0 ? required : undefined
        };
        const superClass = Object.getPrototypeOf(parameterType.target);
        if (superClass.prototype !== undefined) {
            const allOf = [{ $ref: recursiveBuild(superClass, parameterType.name, schemas) }];
            if (Object.keys(properties).length > 0) {
                allOf.push({
                    properties,
                    required: required.length > 0 ? required : undefined
                });
            }
            schemas[parameterType.name] = { allOf };
        }
    }
    getParamRef(parameterClass, _name, schemas) {
        const parameterType = this.metadata.parameterTypes.find(it => it.target === parameterClass);
        if (!parameterType) {
            return SCHEMA_JSON;
        }
        if (!schemas[parameterType.name]) {
            this.buildRef(parameterType, schemas, this.getParamRef.bind(this));
        }
        return `#/components/schemas/${parameterType.name}`;
    }
    getResultRef(resultClassValue, name, schemas) {
        const parameterType = this.metadata.resultType(resultClassValue);
        if (!parameterType) {
            if (resultClassValue === Object) {
                return SCHEMA_JSON;
            }
            throw new Error(`Missing ReturnType for method ${name}`);
        }
        if (!schemas[parameterType.name]) {
            this.buildRef(parameterType, schemas, this.getResultRef.bind(this));
        }
        return `#/components/schemas/${parameterType.name}`;
    }
    buildParameters(method, ctrl, schemas, alias) {
        const methodParameters = method.parameters;
        const parameters = [];
        for (const methodParameter of methodParameters) {
            if (methodParameter.kind === 'args' && ['path', 'query'].includes(methodParameter.mode)) {
                this.collectParameterObj(methodParameter, parameters, schemas, alias?.hideParameters);
            }
            else if (methodParameter.kind === 'arg' && ['path', 'query'].includes(methodParameter.mode)) {
                this.collectParameter(methodParameter, parameters, ctrl, schemas, alias?.hideParameters);
            }
        }
        return parameters.sort((a, b) => {
            let result = 1;
            if (a.required === b.required) {
                result = 0;
            }
            else if (a.required) {
                result = -1;
            }
            if (result === 0) {
                return a.name.localeCompare(b.name);
            }
            return result;
        });
    }
    buildUploadSchema(parameter, _) {
        return {
            properties: {
                [parameter.name]: {
                    type: 'object',
                    description: parameter.description,
                    properties: {
                        type: { description: 'Mime Type', type: 'string' },
                        file: { description: 'Binary Data', type: 'string', format: 'binary' }
                    },
                    required: ['type', 'file']
                }
            }, required: [parameter.name], description: 'Binary Part'
        };
    }
    buildParameterSchema(parameter, schemas) {
        const typeOptions = parameter.typeOptions;
        let result;
        if (typeOptions.isID) {
            result = { $ref: SCHEMA_ID };
        }
        else if (parameter.getType() === String) {
            result = { type: 'string' };
        }
        else if (parameter.getType() === Number) {
            result = { type: 'integer', default: typeOptions.defaultValue, minimum: typeOptions.min, maximum: typeOptions.max };
        }
        else if (parameter.getType() === Boolean) {
            result = { type: 'boolean', default: typeOptions.defaultValue };
        }
        else {
            const enumInfo = this.metadata.enumInfo(parameter.getType());
            if (enumInfo) {
                result = { $ref: OpenApiReferenceBuilder.getEnumRef(enumInfo, schemas) };
            }
            else {
                throw new Error(`Implement OpenApi collectParameter ${JSON.stringify(parameter)}`);
            }
        }
        if (typeOptions.array) {
            result = { type: 'array', items: result };
        }
        if (!result.$ref) {
            result.description = parameter.description;
            result.deprecated = parameter.deprecationReason ? true : undefined;
        }
        return result;
    }
}
//# sourceMappingURL=openapi-reference-builder.js.map