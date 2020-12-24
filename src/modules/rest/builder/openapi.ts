import {JAMAPI_URL_VERSION, JAMAPI_VERSION} from '../../engine/rest/version';
import {getMetadataStorage} from '../metadata';
import {CustomPathParameterAliasRouteOptions} from '../definitions/types';
import {ControllerClassMetadata} from '../definitions/controller-metadata';
import {MethodMetadata} from '../definitions/method-metadata';
import {OpenAPIObject, OperationObject, ParameterObject, ReferenceObject, ResponsesObject, SchemaObject} from 'openapi3-ts';
import {Errors} from './express-error';
import {ContentObject, PathsObject, RequestBodyObject} from 'openapi3-ts/src/model/OpenApi';
import {iterateControllers} from '../helpers/iterate-super';
import {MetadataStorage} from '../metadata/metadata-storage';
import {SCHEMA_ID, Schemas} from './openapi-helpers';
import {OpenApiRefBuilder} from './openapi-refs';
import {ClassType} from 'type-graphql';

class OpenApiBuilder {
	metadata: MetadataStorage;
	refsBuilder: OpenApiRefBuilder;

	constructor(public extended: boolean = true) {
		this.metadata = getMetadataStorage();
		this.refsBuilder = new OpenApiRefBuilder(extended);
	}

	private fillErrorResponses(method: MethodMetadata, parameters: Array<ParameterObject>, roles: Array<string>, responses: ResponsesObject): void {
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

	private buildResponses(method: MethodMetadata, parameters: Array<ParameterObject>, roles: Array<string>, schemas: Schemas): ResponsesObject {
		const responses: ResponsesObject = {};
		if (method.binary) {
			this.fillBinaryResponses(method.binary, responses);
		} else if (method.getReturnType && method.getReturnType()) {
			const type = method.getReturnType();
			if (type === String) {
				this.fillStringResponse(method, responses);
			} else {
				this.fillJSONResponses(type, method, schemas, responses);
			}
		} else {
			responses['200'] = {description: 'ok'};
		}
		this.fillErrorResponses(method, parameters, roles, responses);
		return responses;
	}

	private fillJSONResponses(type: ClassType<any> | Function | object | symbol, method: MethodMetadata, schemas: Schemas, responses: ResponsesObject) {
		const content: ContentObject = {};
		let schema: SchemaObject | ReferenceObject = {$ref: this.refsBuilder.getResultRef(type, method.methodName, schemas)};
		if (method.returnTypeOptions?.array) {
			schema = {type: 'array', items: schema};
		}
		content['application/json'] = {schema};
		responses['200'] = {description: 'json data', content};
	}

	private fillStringResponse(method: MethodMetadata, responses: ResponsesObject): void {
		const content: ContentObject = {};
		const mimeTypes = (method.responseStringMimeTypes || ['text/plain']);
		mimeTypes.forEach(mime => content[mime] = {schema: {type: 'string'}});
		responses['200'] = {description: 'string data', content};
	}

	private fillBinaryResponses(binary: Array<string>, responses: ResponsesObject): void {
		const content: ContentObject = {};
		binary.forEach(mime => content[mime] = {schema: {type: 'string', format: 'binary'}});
		responses['200'] = {description: 'binary data', content};
	}

	private buildRequestBody(method: MethodMetadata, schemas: Schemas): RequestBodyObject | undefined {
		const params = method.params;
		const refs: Array<SchemaObject | ReferenceObject> = [];
		let isJson = true;
		for (const param of params) {
			if (param.kind === 'args' && param.mode === 'body') {
				refs.push({$ref: this.refsBuilder.getParamRef(param.getType(), param.methodName, schemas)});
			} else if (param.kind === 'arg' && param.mode === 'body') {
				const schema = this.refsBuilder.buildParameterSchema(param, schemas);
				refs.push({properties: {[param.name]: schema}, description: param.description, required: [param.name]});
			} else if (param.kind === 'arg' && param.mode === 'file') {
				isJson = false;
				refs.push(this.refsBuilder.buildUploadSchema(param, schemas));
			}
		}
		if (refs.length > 0) {
			return {
				required: true,
				content: {[isJson ? 'application/json' : 'multipart/form-data']: {schema: refs.length === 1 ? refs[0] : {allOf: refs}}}
			};
		}
		return;
	}

	private buildOpenApiMethod(method: MethodMetadata, ctrl: ControllerClassMetadata, schemas: Schemas, isPost: boolean, alias?: CustomPathParameterAliasRouteOptions): { path: string; o: OperationObject } {
		const parameters: Array<ParameterObject> = this.refsBuilder.buildParameters(method, ctrl, schemas, alias);
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

	private buildOpenApiBase(version: string): OpenAPIObject {
		return {
			openapi: '3.0.0',
			info: {
				title: 'JamApi', description: 'Api for JamServe', version,
				license: {name: 'MIT', url: 'https://raw.githubusercontent.com/ffalt/jamserve/main/LICENSE'}
			},
			servers: [{
				url: 'http://localhost:4040/jam/{version}',
				description: 'A local JamServe API',
				variables: {version: {enum: [JAMAPI_URL_VERSION], default: JAMAPI_URL_VERSION}}
			}],
			tags: [], paths: {},
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

	private buildOpenApiMethods(methods: Array<MethodMetadata>, ctrl: ControllerClassMetadata, schemas: Schemas, paths: PathsObject, isPost: boolean): void {
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

	private buildExtensions(openapi: OpenAPIObject, schemas: Schemas) {
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
			{name: 'API', tags: [...apiTags]},
			{name: 'Models', tags: tagNames}
		];
	}

	private buildControllers(schemas: Schemas, openapi: OpenAPIObject) {
		const controllers = this.metadata.controllerClasses.filter(c => !c.abstract).sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		for (const ctrl of controllers) {
			let gets: Array<MethodMetadata> = [];
			let posts: Array<MethodMetadata> = [];
			iterateControllers(this.metadata, ctrl, (ctrlClass => {
				gets = gets.concat(this.metadata.gets.filter(g => g.controllerClassMetadata === ctrlClass));
				posts = posts.concat(this.metadata.posts.filter(g => g.controllerClassMetadata === ctrlClass));
			}));
			this.buildOpenApiMethods(gets, ctrl, schemas, openapi.paths, false);
			this.buildOpenApiMethods(posts, ctrl, schemas, openapi.paths, true);
		}
	}

	build(): OpenAPIObject {
		const openapi: OpenAPIObject = this.buildOpenApiBase(JAMAPI_VERSION);
		const schemas: Schemas = {
			'ID': {type: 'string', format: 'uuid'},
			'JSON': {type: 'object'}
		};
		this.buildControllers(schemas, openapi);
		openapi.components = {schemas, securitySchemes: openapi.components?.securitySchemes};
		if (this.extended) {
			this.buildExtensions(openapi, schemas);
		}
		return openapi;
	}

}

export function buildOpenApi(extended: boolean = true): OpenAPIObject {
	const builder = new OpenApiBuilder(extended);
	return builder.build();
}

