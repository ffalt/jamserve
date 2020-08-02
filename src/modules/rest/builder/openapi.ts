import {JAMAPI_URL_VERSION, JAMAPI_VERSION} from '../../engine/rest/version';
import {getMetadataStorage} from '../metadata';
import {RestParamMetadata, RestParamsMetadata} from '../definitions/param-metadata';
import {ClassMetadata} from '../definitions/class-metadata';
import {CustomPathParameterAliasRouteOptions, FieldOptions, TypeOptions, TypeValue, TypeValueThunk} from '../definitions/types';
import {getDefaultValue} from '../helpers/default-value';
import {ControllerClassMetadata} from '../definitions/controller-metadata';
import {EnumMetadata} from '../definitions/enum-metadata';
import {MethodMetadata} from '../definitions/method-metadata';
import {OpenAPIObject, OperationObject, ParameterLocation, ParameterObject, ReferenceObject, ResponsesObject, SchemaObject} from 'openapi3-ts';
import {Errors} from './express-error';
import {ContentObject, PathsObject, RequestBodyObject} from 'openapi3-ts/src/model/OpenApi';
import {v4} from 'uuid';

export const exampleID = v4();

type Schemas = { [schema: string]: SchemaObject | ReferenceObject };
type Property = (SchemaObject | ReferenceObject);
type Properties = { [propertyName: string]: (SchemaObject | ReferenceObject) };
const SCHEMA_JSON = '#/components/schemas/JSON';
const SCHEMA_ID = '#/components/schemas/ID';

class OpenApiBuilder {
	constructor(public extended: boolean = true) {
	}

	mapArgFields(mode: string, argumentType: ClassMetadata, parameters: Array<ParameterObject>, schemas: Schemas, hideParameters?: string[]) {
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
				example: typeOptions.isID ? exampleID : typeOptions.example
			};
			const type = field.getType();
			o.schema = this.buildFieldSchema(type, typeOptions, schemas);
			if (!o.schema) {
				throw new Error(`Unknown Argument Type, did you forget to register an enum? ${JSON.stringify(field)}`);
			}
			if (typeOptions.array) {
				o.schema = {type: 'array', items: o.schema};
			}
			parameters.push(o);
		});
	}

	buildFieldSchema(type: TypeValue, typeOptions: FieldOptions & TypeOptions, schemas: Schemas): Property | undefined {
		if (typeOptions.isID) {
			return {$ref: SCHEMA_ID};
		} else if (type === String) {
			return {type: 'string', default: typeOptions.defaultValue, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined};
		} else if (type === Number) {
			return {
				type: 'integer', default: typeOptions.defaultValue,
				minimum: typeOptions.min, maximum: typeOptions.max, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined
			};
		} else if (type === Boolean) {
			return {type: 'boolean', default: typeOptions.defaultValue, description: typeOptions.description, deprecated: typeOptions.deprecationReason ? true : undefined};
		} else {
			const enumInfo = getMetadataStorage().enums.find(e => e.enumObj === type);
			if (enumInfo) {
				return {$ref: this.getEnumRef(enumInfo, schemas)};
			}
		}
	}

	getResultRef(resultClassValue: TypeValue, name: string, schemas: Schemas): string {
		const argumentType = getMetadataStorage().resultType(resultClassValue);
		if (!argumentType) {
			if (resultClassValue === Object) {
				return SCHEMA_JSON;
			}
			throw new Error(`Missing ReturnType for method ${name}`);
		}
		if (!schemas[argumentType.name]) {
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
					f = {$ref: this.getResultRef(type, argumentType.name, schemas)};
				}
				properties[field.name] = typeOptions.array ? {type: 'array', items: f} : f;
			}
			schemas[argumentType.name] = {
				type: 'object',
				properties,
				required: required.length > 0 ? required : undefined
			};
			const superClass = Object.getPrototypeOf(argumentType.target);
			if (superClass.prototype !== undefined) {
				// const superArgumentType = getMetadataStorage().argumentTypes.find(it => it.target === superClass);
				schemas[argumentType.name] = {
					allOf: [
						{$ref: this.getResultRef(superClass, argumentType.name, schemas)},
						{
							properties,
							required: required.length > 0 ? required : undefined
						}
					]
				};
			}
		}
		return '#/components/schemas/' + argumentType.name;
	}

	getParamRef(paramClass: TypeValueThunk, schemas: Schemas): string {
		const argumentType = getMetadataStorage().argumentTypes.find(it => it.target === paramClass());
		if (!argumentType) {
			return SCHEMA_JSON;
		}
		if (!schemas[argumentType.name]) {
			const argumentInstance = new (argumentType.target as any)();
			const properties: Properties = {};
			const required: Array<string> = [];
			for (const field of argumentType.fields) {
				field.typeOptions.defaultValue = getDefaultValue(
					argumentInstance,
					field.typeOptions,
					field.name
				);
				const typeOptions: FieldOptions & TypeOptions = field.typeOptions;
				if (!typeOptions.nullable) {
					required.push(field.name);
				}
				const type = field.getType();
				let f: Property | undefined = this.buildFieldSchema(type, typeOptions, schemas);
				if (!f) {
					f = {$ref: this.getParamRef(field.getType, schemas)};
				}
				properties[field.name] = typeOptions.array ? {type: 'array', items: f} : f;
			}
			schemas[argumentType.name] = {
				type: 'object',
				properties,
				required: required.length > 0 ? required : undefined
			};
		}
		return '#/components/schemas/' + argumentType.name;
	}

	getEnumRef(enumInfo: EnumMetadata, schemas: Schemas): string {
		const name = enumInfo.name;
		if (!schemas[name]) {
			schemas[name] = {type: 'string', enum: Object.values(enumInfo.enumObj)};
		}
		return '#/components/schemas/' + name;
	}

	collectParameter(
		param: RestParamMetadata, parameters: Array<ParameterObject>,
		ctrl: ControllerClassMetadata, schemas: Schemas, hideParameters?: string[]
	): void {
		if (hideParameters && hideParameters.includes(param.name)) {
			return;
		}
		const typeOptions: FieldOptions & TypeOptions = param.typeOptions;
		const o: ParameterObject = {
			in: param.mode as ParameterLocation,
			name: param.name,
			description: typeOptions.description,
			deprecated: typeOptions.deprecationReason || ctrl.deprecationReason ? true : undefined,
			required: !param.typeOptions.nullable || param.mode === 'path',
			example: typeOptions.isID ? exampleID : typeOptions.example,
			schema: this.buildParameterSchema(param, schemas)
		};
		parameters.push(o);
	}

	collectParameterObj(param: RestParamsMetadata, parameters: Array<ParameterObject>, schemas: Schemas, hideParameters?: string[]): void {
		const argumentType = getMetadataStorage().argumentTypes.find(it => it.target === param.getType());
		if (!argumentType) {
			throw new Error(
				`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
				`is not a class decorated with '@ObjParamsType' decorator!`,
			);
		}
		let superClass = Object.getPrototypeOf(argumentType.target);
		while (superClass.prototype !== undefined) {
			const superArgumentType = getMetadataStorage().argumentTypes.find(it => it.target === superClass);
			if (superArgumentType) {
				this.mapArgFields(param.mode, superArgumentType, parameters, schemas, hideParameters);
			}
			superClass = Object.getPrototypeOf(superClass);
		}
		this.mapArgFields(param.mode, argumentType, parameters, schemas, hideParameters);
	}

	buildParameters(method: MethodMetadata, ctrl: ControllerClassMetadata, schemas: Schemas, alias?: CustomPathParameterAliasRouteOptions): Array<ParameterObject> {
		const params = method.params;
		const parameters: Array<ParameterObject> = [];
		for (const param of params) {
			if (param.kind === 'args' && ['path', 'query'].includes(param.mode)) {
				this.collectParameterObj(param, parameters, schemas, alias?.hideParameters);
			} else if (param.kind === 'arg' && ['path', 'query'].includes(param.mode)) {
				this.collectParameter(param, parameters, ctrl, schemas, alias?.hideParameters);
			}
		}
		return parameters;
	}

	fillErrorResponses(method: MethodMetadata, parameters: Array<ParameterObject>, roles: Array<string>, responses: ResponsesObject): void {
		if (parameters.length > 0) {
			responses['422'] = {description: Errors.invalidParameter};
			if (parameters.find(p => p.required)) {
				responses['400'] = {description: Errors.missingParameter};
			}
		}
		if (parameters.find(p => {
			return p.schema?.$ref === SCHEMA_ID || (p.schema as SchemaObject)?.items?.$ref === SCHEMA_ID;
		})) {
			responses['404'] = {description: Errors.itemNotFound};
		}
		if (roles.length > 0) {
			responses['401'] = {description: Errors.unauthorized};
		}
	}

	buildResponses(method: MethodMetadata, parameters: Array<ParameterObject>, roles: Array<string>, schemas: Schemas): ResponsesObject {
		const responses: ResponsesObject = {};
		if (method.binary) {
			const content: ContentObject = {};
			method.binary.forEach(mime => {
				content[mime] = {schema: {type: 'string', format: 'binary'}};
			});
			responses['200'] = {description: 'binary data', content};
		} else if (method.getReturnType && method.getReturnType()) {
			const content: ContentObject = {};
			const type = method.getReturnType();
			if (type === String) {
				const mimeTypes = (method.responseStringMimeTypes || ['text/plain']);
				mimeTypes.forEach(mime => {
					content[mime] = {schema: {type: 'string'}};
				});
				responses['200'] = {description: 'string data', content};
			} else {
				let schema: SchemaObject | ReferenceObject = {$ref: this.getResultRef(type, method.methodName, schemas)};
				if (method.returnTypeOptions?.array) {
					schema = {type: 'array', items: schema};
				}
				content['application/json'] = {schema};
				responses['200'] = {description: 'json data', content};
			}
		} else {
			responses['200'] = {description: 'ok'};
		}
		this.fillErrorResponses(method, parameters, roles, responses);
		return responses;
	}

	buildParameterSchema(param: RestParamMetadata, schemas: Schemas): SchemaObject {
		const typeOptions: FieldOptions & TypeOptions = param.typeOptions;
		let result: SchemaObject;
		if (typeOptions.isID) {
			result = {$ref: SCHEMA_ID};
		} else if (param.getType() === String) {
			result = {type: 'string'};
		} else if (param.getType() === Number) {
			result = {type: 'integer', default: typeOptions.defaultValue, minimum: typeOptions.min, maximum: typeOptions.max};
		} else if (param.getType() === Boolean) {
			result = {type: 'boolean', default: typeOptions.defaultValue};
		} else {
			const enumInfo = getMetadataStorage().enums.find(e => e.enumObj === param.getType());
			if (enumInfo) {
				result = {$ref: this.getEnumRef(enumInfo, schemas)};
			} else {
				throw new Error(`Implement OpenApi collectParameter ${JSON.stringify(param)}`);
			}
		}
		if (typeOptions.array) {
			result = {type: 'array', items: result};
		}
		if (this.extended || !result.$ref) {
			result.description = param.description;
			result.deprecated = param.deprecationReason ? true : undefined;
		}
		return result;
	}

	buildRequestBody(method: MethodMetadata, schemas: Schemas): RequestBodyObject | undefined {
		const params = method.params;
		const refs: Array<SchemaObject | ReferenceObject> = [];
		let isJson = true;
		for (const param of params) {
			if (param.kind === 'args' && param.mode === 'body') {
				refs.push({$ref: this.getParamRef(param.getType, schemas)});
			} else if (param.kind === 'arg' && param.mode === 'body') {
				const schema = this.buildParameterSchema(param, schemas);
				const properties: { [propertyName: string]: (SchemaObject | ReferenceObject) } = {};
				properties[param.name] = schema;
				refs.push({properties, description: param.description, required: [param.name]});
			} else if (param.kind === 'arg' && param.mode === 'file') {
				isJson = false;
				const properties: { [propertyName: string]: (SchemaObject | ReferenceObject) } = {};
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
				const upload: SchemaObject = {properties, required: [param.name], description: 'Binary Part'};
				refs.push(upload);
			}
		}
		if (refs.length > 0) {
			const result: RequestBodyObject = {
				required: true,
				content: {}
			};
			const schema = refs.length === 1 ? refs[0] : {allOf: refs};
			if (isJson) {
				result.content['application/json'] = {schema};
			} else {
				result.content['multipart/form-data'] = {schema};
			}
			return result;
		}
	}

	buildOpenApiMethod(method: MethodMetadata, ctrl: ControllerClassMetadata, schemas: Schemas, isPost: boolean, alias?: CustomPathParameterAliasRouteOptions): { path: string; o: OperationObject } {
		const parameters: Array<ParameterObject> = this.buildParameters(method, ctrl, schemas, alias);
		const path = (ctrl.route || '') + (alias?.route || method.route || '');
		const roles = method.roles || ctrl.roles || [];
		const o: OperationObject = {
			operationId: `${ctrl.name}.${method.methodName}${alias?.route || ''}`,
			summary: `${method.summary || method.description} ${alias?.name || ''}`.trim(),
			description: method.description,
			deprecated: method.deprecationReason || ctrl.deprecationReason ? true : undefined,
			tags: method.tags || ctrl.tags,
			parameters,
			requestBody: isPost ? this.buildRequestBody(method, schemas) : undefined,
			responses: this.buildResponses(method, parameters, roles, schemas),
			security: roles.length === 0 ? [] : [{cookieAuth: roles}, {bearerAuth: roles}]
		};
		return {path, o};
	}

	buildOpenApiBase(version: string): OpenAPIObject {
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
				variables: {version: {enum: [JAMAPI_URL_VERSION], default: JAMAPI_URL_VERSION}}
			}],
			tags: [],
			paths: {},
			components: {
				securitySchemes: {
					cookieAuth: {type: 'apiKey', in: 'cookie', name: 'jam.sid'},
					bearerAuth: {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}
				},
				schemas: {}
			},
			security: []
		};
	}

	buildOpenApiMethods(methods: Array<MethodMetadata>, ctrl: ControllerClassMetadata, schemas: Schemas, paths: PathsObject, isPost: boolean): void {
		for (const method of methods) {
			const {path, o} = this.buildOpenApiMethod(method, ctrl, schemas, isPost);
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

	build(): OpenAPIObject {
		const metadata = getMetadataStorage();
		const openapi: OpenAPIObject = this.buildOpenApiBase(JAMAPI_VERSION);
		const schemas = {
			'ID': {type: 'string', format: 'uuid'},
			'JSON': {type: 'object'}
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
				const superClassType = getMetadataStorage().controllerClasses.find(it => it.target === superClass);
				if (superClassType) {
					gets = gets.concat(metadata.gets.filter(g => g.controllerClassMetadata === superClassType));
					posts = posts.concat(metadata.posts.filter(g => g.controllerClassMetadata === superClassType));
				}
				superClass = Object.getPrototypeOf(superClass);
			}

			this.buildOpenApiMethods(gets, ctrl, schemas, openapi.paths, false);
			this.buildOpenApiMethods(posts, ctrl, schemas, openapi.paths, true);
		}
		openapi.components = {schemas, securitySchemes: openapi.components?.securitySchemes};
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

export function buildOpenApi(extended: boolean = true): OpenAPIObject {
	const builder = new OpenApiBuilder(extended);
	return builder.build();
}

