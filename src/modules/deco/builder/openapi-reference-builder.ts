import { MethodMetadata } from '../definitions/method-metadata.js';
import { ControllerClassMetadata } from '../definitions/controller-metadata.js';
import { CustomPathParameterAliasRouteOptions, FieldOptions, TypeOptions, TypeValue } from '../definitions/types.js';
import {
	exampleID, Properties, Property, SCHEMA_ID, SCHEMA_JSON, Schemas,
	ParameterLocation, ParameterObject, ReferenceObject, SchemaObject, exampleIDInt
} from './openapi-helpers.js';
import { RestParameterMetadata, RestParametersMetadata } from '../definitions/parameter-metadata.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';
import { EnumMetadata } from '../definitions/enum-metadata.js';
import { ClassMetadata } from '../definitions/class-metadata.js';
import { getDefaultValue } from '../helpers/default-value.js';
import { iterateParameters } from '../helpers/iterate-super.js';

export class OpenApiReferenceBuilder {
	constructor(private readonly metadata: MetadataStorage) {
	}

	private static getEnumRef(enumInfo: EnumMetadata, schemas: Schemas): string {
		const name = enumInfo.name;
		schemas[name] ??= { type: 'string', enum: Object.values(enumInfo.enumObj) };
		return `#/components/schemas/${name}`;
	}

	private buildFieldSchema(type: TypeValue, typeOptions: FieldOptions & TypeOptions, schemas: Schemas): Property | undefined {
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

	private mapExample(typeOptions: FieldOptions & TypeOptions, schemas: Schemas): string | undefined {
		if (!typeOptions.isID) {
			return typeOptions.example === undefined ? undefined : typeOptions.example.toString();
		}
		const idSchemaType = (schemas.ID as SchemaObject).type;
		return idSchemaType === 'integer' ? exampleIDInt : exampleID;
	}

	private mapArgFields(mode: string, parameterType: ClassMetadata, parameters: Array<ParameterObject>, schemas: Schemas, hideParameters?: Array<string>) {
		const argumentInstance = new (parameterType.target as new () => Record<string, unknown>)();
		for (const field of parameterType.fields) {
			if (hideParameters?.includes(field.name)) {
				continue;
			}
			field.typeOptions.defaultValue = getDefaultValue(
				argumentInstance,
				field.typeOptions,
				field.name
			);
			const typeOptions: FieldOptions & TypeOptions = field.typeOptions;
			const o: ParameterObject = {
				in: mode as ParameterLocation,
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

	private collectParameter(
		parameter: RestParameterMetadata, parameters: Array<ParameterObject>,
		ctrl: ControllerClassMetadata | undefined, schemas: Schemas, hideParameters?: Array<string>
	): void {
		if (hideParameters?.includes(parameter.name)) {
			return;
		}
		const typeOptions: FieldOptions & TypeOptions = parameter.typeOptions;
		const o: ParameterObject = {
			in: parameter.mode as ParameterLocation,
			name: parameter.name,
			description: typeOptions.description,
			deprecated: typeOptions.deprecationReason || ctrl?.deprecationReason ? true : undefined,
			required: !parameter.typeOptions.nullable || parameter.mode === 'path',
			example: this.mapExample(typeOptions, schemas),
			schema: this.buildParameterSchema(parameter, schemas)
		};
		parameters.push(o);
	}

	private collectParameterObj(parameter: RestParametersMetadata, parameters: Array<ParameterObject>, schemas: Schemas, hideParameters?: Array<string>): void {
		const parameterType = this.metadata.parameterTypes.find(it => it.target === parameter.getType());
		if (!parameterType) {
			throw new Error(
				`The value used as a type of '@QueryParams' for '${parameter.propertyName}' of '${parameter.target.name}.${
					parameter.methodName}' is not a class decorated with '@ObjParamsType' decorator!`
			);
		}
		iterateParameters(this.metadata.parameterTypes, parameterType, argument => {
			this.mapArgFields(parameter.mode, argument, parameters, schemas, hideParameters);
		});
	}

	private buildRef(parameterType: ClassMetadata, schemas: Schemas, recursiveBuild: (classValue: TypeValue, name: string, schemas: Schemas) => string) {
		const argumentInstance = new (parameterType.target as new () => Record<string, unknown>)();
		const properties: Properties = {};
		const required: Array<string> = [];
		for (const field of parameterType.fields) {
			field.typeOptions.defaultValue = getDefaultValue(
				argumentInstance,
				field.typeOptions,
				field.name
			);
			const typeOptions = field.typeOptions;
			if (!typeOptions.nullable) {
				required.push(field.name);
			}
			const type = field.getType();
			let f: Property | undefined = this.buildFieldSchema(type, typeOptions, schemas);
			f ??= { $ref: recursiveBuild(type, parameterType.name, schemas) };
			properties[field.name] = typeOptions.array ? { type: 'array', items: f } : f;
		}
		schemas[parameterType.name] = {
			type: 'object',
			properties,
			required: required.length > 0 ? required : undefined
		};
		const superClass = Object.getPrototypeOf(parameterType.target);
		if (superClass.prototype !== undefined) {
			const allOf: Array<SchemaObject | ReferenceObject> = [{ $ref: recursiveBuild(superClass as TypeValue, parameterType.name, schemas) }];
			if (Object.keys(properties).length > 0) {
				allOf.push({
					properties,
					required: required.length > 0 ? required : undefined
				});
			}
			schemas[parameterType.name] = { allOf };
		}
	}

	getParamRef(parameterClass: TypeValue, _name: string, schemas: Schemas): string {
		const parameterType = this.metadata.parameterTypes.find(it => it.target === parameterClass);
		if (!parameterType) {
			return SCHEMA_JSON;
		}
		if (!schemas[parameterType.name]) {
			this.buildRef(parameterType, schemas, this.getParamRef.bind(this));
		}
		return `#/components/schemas/${parameterType.name}`;
	}

	getResultRef(resultClassValue: TypeValue, name: string, schemas: Schemas): string {
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

	buildParameters(method: MethodMetadata, ctrl: ControllerClassMetadata | undefined, schemas: Schemas, alias?: CustomPathParameterAliasRouteOptions): Array<ParameterObject> {
		const methodParameters = method.parameters;
		const parameters: Array<ParameterObject> = [];
		for (const methodParameter of methodParameters) {
			if (methodParameter.kind === 'args' && ['path', 'query'].includes(methodParameter.mode)) {
				this.collectParameterObj(methodParameter, parameters, schemas, alias?.hideParameters);
			} else if (methodParameter.kind === 'arg' && ['path', 'query'].includes(methodParameter.mode)) {
				this.collectParameter(methodParameter, parameters, ctrl, schemas, alias?.hideParameters);
			}
		}
		return parameters.sort((a, b) => {
			let result = 1;
			if (a.required === b.required) {
				result = 0;
			} else if (a.required) {
				result = -1;
			}
			if (result === 0) {
				return a.name.localeCompare(b.name);
			}
			return result;
		});
	}

	buildUploadSchema(parameter: RestParameterMetadata, _: Schemas): SchemaObject {
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

	buildParameterSchema(parameter: RestParameterMetadata, schemas: Schemas): SchemaObject | ReferenceObject {
		const typeOptions: FieldOptions & TypeOptions = parameter.typeOptions;
		let result: SchemaObject | ReferenceObject;
		if (typeOptions.isID) {
			result = { $ref: SCHEMA_ID };
		} else if (parameter.getType() === String) {
			result = { type: 'string' };
		} else if (parameter.getType() === Number) {
			result = { type: 'integer', default: typeOptions.defaultValue, minimum: typeOptions.min, maximum: typeOptions.max };
		} else if (parameter.getType() === Boolean) {
			result = { type: 'boolean', default: typeOptions.defaultValue };
		} else {
			const enumInfo = this.metadata.enumInfo(parameter.getType());
			if (enumInfo) {
				result = { $ref: OpenApiReferenceBuilder.getEnumRef(enumInfo, schemas) };
			} else {
				throw new Error(`Implement OpenApi collectParameter ${JSON.stringify(parameter)}`);
			}
		}
		if (typeOptions.array) {
			result = { type: 'array', items: result };
		}
		if (!(result as ReferenceObject).$ref) {
			(result as SchemaObject).description = parameter.description;
			(result as SchemaObject).deprecated = parameter.deprecationReason ? true : undefined;
		}
		return result;
	}
}
