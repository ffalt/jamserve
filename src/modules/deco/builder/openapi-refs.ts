import { MethodMetadata } from '../definitions/method-metadata.js';
import { ControllerClassMetadata } from '../definitions/controller-metadata.js';
import { CustomPathParameterAliasRouteOptions, FieldOptions, TypeOptions, TypeValue } from '../definitions/types.js';
import {
	exampleID, Properties, Property, SCHEMA_ID, SCHEMA_JSON, Schemas,
	ParameterLocation, ParameterObject, ReferenceObject, SchemaObject, exampleIDInt
} from './openapi-helpers.js';
import { RestParamMetadata, RestParamsMetadata } from '../definitions/param-metadata.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';
import { EnumMetadata } from '../definitions/enum-metadata.js';
import { ClassMetadata } from '../definitions/class-metadata.js';
import { getDefaultValue } from '../helpers/default-value.js';
import { iterateArguments } from '../helpers/iterate-super.js';

export class OpenApiRefBuilder {
	constructor(public extended: boolean = true, private readonly metadata: MetadataStorage) {
	}

	private static getEnumRef(enumInfo: EnumMetadata, schemas: Schemas): string {
		const name = enumInfo.name;
		if (!schemas[name]) {
			schemas[name] = { type: 'string', enum: Object.values(enumInfo.enumObj) };
		}
		return '#/components/schemas/' + name;
	}

	private buildFieldSchema(type: TypeValue, typeOptions: FieldOptions & TypeOptions, schemas: Schemas): Property | undefined {
		if (typeOptions.isID) {
			return { $ref: SCHEMA_ID };
		} else if (type === String) {
			return { type: 'string', default: typeOptions.defaultValue, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined };
		} else if (type === Number) {
			return {
				type: 'integer', default: typeOptions.defaultValue,
				minimum: typeOptions.min, maximum: typeOptions.max, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined
			};
		} else if (type === Boolean) {
			return { type: 'boolean', default: typeOptions.defaultValue, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined };
		} else {
			const enumInfo = this.metadata.enums.find(e => e.enumObj === type);
			if (enumInfo) {
				return { $ref: OpenApiRefBuilder.getEnumRef(enumInfo, schemas) };
			}
		}
		return;
	}

	private mapExample(typeOptions: FieldOptions & TypeOptions, schemas: Schemas): string | undefined {
		return typeOptions.isID ? ((schemas['ID'] as SchemaObject).type === 'integer' ? exampleIDInt : exampleID) : typeOptions.example;
	}

	private mapArgFields(mode: string, argumentType: ClassMetadata, parameters: Array<ParameterObject>, schemas: Schemas, hideParameters?: string[]) {
		const argumentInstance = new (argumentType.target as any)();
		argumentType.fields!.forEach(field => {
			if (hideParameters && hideParameters.includes(field.name)) {
				return;
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
				throw new Error(`Unknown Argument Type, did you forget to register an enum? ${JSON.stringify(field)}`);
			}
			if (typeOptions.array) {
				o.schema = { type: 'array', items: o.schema };
			}
			parameters.push(o);
		});
	}

	private collectParameter(
		param: RestParamMetadata, parameters: Array<ParameterObject>,
		ctrl: ControllerClassMetadata | undefined, schemas: Schemas, hideParameters?: string[]
	): void {
		if (hideParameters && hideParameters.includes(param.name)) {
			return;
		}
		const typeOptions: FieldOptions & TypeOptions = param.typeOptions;
		const o: ParameterObject = {
			in: param.mode as ParameterLocation,
			name: param.name,
			description: typeOptions.description,
			deprecated: typeOptions.deprecationReason || ctrl?.deprecationReason ? true : undefined,
			required: !param.typeOptions.nullable || param.mode === 'path',
			example: this.mapExample(typeOptions, schemas),
			schema: this.buildParameterSchema(param, schemas)
		};
		parameters.push(o);
	}

	private collectParameterObj(param: RestParamsMetadata, parameters: Array<ParameterObject>, schemas: Schemas, hideParameters?: string[]): void {
		const argumentType = this.metadata.argumentTypes.find(it => it.target === param.getType());
		if (!argumentType) {
			throw new Error(
				`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
				`is not a class decorated with '@ObjParamsType' decorator!`
			);
		}
		iterateArguments(this.metadata.argumentTypes, argumentType, argument => {
			this.mapArgFields(param.mode, argument, parameters, schemas, hideParameters);
		});
	}

	private buildRef(argumentType: ClassMetadata, schemas: Schemas, recursiveBuild: (classValue: TypeValue, name: string, schemas: Schemas) => string) {
		const argumentInstance = new (argumentType.target as any)();
		const properties: Properties = {};
		const required: Array<string> = [];
		for (const field of argumentType.fields) {
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
			const allOf: (SchemaObject | ReferenceObject)[] = [{ $ref: recursiveBuild(superClass, argumentType.name, schemas) }];
			if (Object.keys(properties).length > 0) {
				allOf.push({
					properties,
					required: required.length > 0 ? required : undefined
				});
			}
			schemas[argumentType.name] = { allOf };
		}
	}

	getParamRef(paramClass: TypeValue, name: string, schemas: Schemas): string {
		const argumentType = this.metadata.argumentTypes.find(it => it.target === paramClass);
		if (!argumentType) {
			return SCHEMA_JSON;
		}
		if (!schemas[argumentType.name]) {
			this.buildRef(argumentType, schemas, this.getParamRef.bind(this));
		}
		return '#/components/schemas/' + argumentType.name;
	}

	getResultRef(resultClassValue: TypeValue, name: string, schemas: Schemas): string {
		const argumentType = this.metadata.resultTypes.find(it => it.target === resultClassValue);
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

	buildParameters(method: MethodMetadata, ctrl: ControllerClassMetadata | undefined, schemas: Schemas, alias?: CustomPathParameterAliasRouteOptions): Array<ParameterObject> {
		const params = method.params;
		const parameters: Array<ParameterObject> = [];
		for (const param of params) {
			if (param.kind === 'args' && ['path', 'query'].includes(param.mode)) {
				this.collectParameterObj(param, parameters, schemas, alias?.hideParameters);
			} else if (param.kind === 'arg' && ['path', 'query'].includes(param.mode)) {
				this.collectParameter(param, parameters, ctrl, schemas, alias?.hideParameters);
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

	buildUploadSchema(param: RestParamMetadata, _: Schemas): SchemaObject {
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

	buildParameterSchema(param: RestParamMetadata, schemas: Schemas): SchemaObject | ReferenceObject {
		const typeOptions: FieldOptions & TypeOptions = param.typeOptions;
		let result: SchemaObject | ReferenceObject;
		if (typeOptions.isID) {
			result = { $ref: SCHEMA_ID };
		} else if (param.getType() === String) {
			result = { type: 'string' };
		} else if (param.getType() === Number) {
			result = { type: 'integer', default: typeOptions.defaultValue, minimum: typeOptions.min, maximum: typeOptions.max };
		} else if (param.getType() === Boolean) {
			result = { type: 'boolean', default: typeOptions.defaultValue };
		} else {
			const enumInfo = this.metadata.enums.find(e => e.enumObj === param.getType());
			if (enumInfo) {
				result = { $ref: OpenApiRefBuilder.getEnumRef(enumInfo, schemas) };
			} else {
				throw new Error(`Implement OpenApi collectParameter ${JSON.stringify(param)}`);
			}
		}
		if (typeOptions.array) {
			result = { type: 'array', items: result };
		}
		if (this.extended || !(result as ReferenceObject).$ref) {
			(result as SchemaObject).description = param.description;
			(result as SchemaObject).deprecated = param.deprecationReason ? true : undefined;
		}
		return result;
	}
}
