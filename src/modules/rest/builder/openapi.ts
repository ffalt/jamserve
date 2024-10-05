import { JAMAPI_URL_VERSION, JAMAPI_VERSION } from '../../engine/rest/version.js';
import { MethodMetadata } from '../../deco/definitions/method-metadata.js';
import { iterateControllers } from '../../deco/helpers/iterate-super.js';
import { Schemas, OpenAPIObject, PathsObject, OperationObject, ParameterObject, ResponsesObject } from '../../deco/builder/openapi-helpers.js';
import { BaseOpenApiBuilder } from '../../deco/builder/openapi-builder.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { ControllerClassMetadata } from '../../deco/definitions/controller-metadata.js';
import { CustomPathParameterAliasRouteOptions } from '../../deco/definitions/types.js';
import { ClassType } from 'type-graphql';

class OpenApiBuilder extends BaseOpenApiBuilder {
	protected buildOpenApiMethod(method: MethodMetadata, ctrl: ControllerClassMetadata, schemas: Schemas, isPost: boolean, alias?: CustomPathParameterAliasRouteOptions): { path: string; o: OperationObject } {
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
			security: roles.length === 0 ? [] : [{ cookieAuth: roles }, { bearerAuth: roles }]
		};
		return { path, o };
	}

	fillFormatResponses(type: ClassType<any> | Function | object | symbol, method: MethodMetadata, schemas: Schemas, responses: ResponsesObject) {
		this.fillJSONResponses(type, method, schemas, responses);
	}

	protected buildOpenApiMethods(methods: Array<MethodMetadata>, ctrl: ControllerClassMetadata, schemas: Schemas, paths: PathsObject, isPost: boolean): void {
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

	protected buildControllers(schemas: Schemas, openapi: OpenAPIObject) {
		const controllers = this.metadata.controllerClasses.filter(c => !c.abstract).sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		for (const ctrl of controllers) {
			let gets: Array<MethodMetadata> = [];
			let posts: Array<MethodMetadata> = [];
			iterateControllers(this.metadata.controllerClasses, ctrl, ctrlClass => {
				gets = gets.concat(this.metadata.gets.filter(g => g.controllerClassMetadata === ctrlClass));
				posts = posts.concat(this.metadata.posts.filter(g => g.controllerClassMetadata === ctrlClass));
			});
			this.buildOpenApiMethods(gets, ctrl, schemas, openapi.paths, false);
			this.buildOpenApiMethods(posts, ctrl, schemas, openapi.paths, true);
		}
	}

	protected buildPaths(schemas: Schemas, openapi: OpenAPIObject): void {
		this.buildControllers(schemas, openapi);
	}
}

function buildOpenApiBase(version: string): OpenAPIObject {
	return {
		openapi: '3.0.0',
		info: {
			title: 'JamApi', description: 'Api for JamServe', version,
			license: { name: 'MIT', url: 'https://raw.githubusercontent.com/ffalt/jamserve/main/LICENSE' }
		},
		servers: [{
			url: 'http://localhost:4040/jam/{version}',
			description: 'A local JamServe API',
			variables: { version: { enum: [JAMAPI_URL_VERSION], default: JAMAPI_URL_VERSION } }
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

export function buildOpenApi(): OpenAPIObject {
	const builder = new OpenApiBuilder(getMetadataStorage());
	const openapi: OpenAPIObject = buildOpenApiBase(JAMAPI_VERSION);
	const schemas: Schemas = {
		ID: { type: 'string', format: 'uuid' },
		JSON: { type: 'object' }
	};
	return builder.build(openapi, schemas);
}
