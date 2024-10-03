import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { MethodMetadata } from '../../deco/definitions/method-metadata.js';
import { Schemas, OpenAPIObject, OperationObject, ParameterObject, PathsObject } from '../../deco/builder/openapi-helpers.js';
import { SUBSONIC_VERSION } from '../version.js';
import { BaseOpenApiBuilder } from '../../deco/builder/openapi-builder.js';
import { CustomPathParameterAliasRouteOptions } from '../../deco/definitions/types.js';

class OpenApiBuilder extends BaseOpenApiBuilder {
	protected buildOpenApiMethod(method: MethodMetadata, schemas: Schemas, isPost: boolean, alias?: CustomPathParameterAliasRouteOptions): { path: string; o: OperationObject } {
		const parameters: Array<ParameterObject> = this.refsBuilder.buildParameters(method, undefined, schemas, alias);
		const path = (alias?.route || method.route || '');
		const roles = method.roles || [];
		const o: OperationObject = {
			operationId: `${method.methodName}${alias?.route || ''}`,
			summary: `${method.summary || method.description} ${alias?.name || ''}`.trim(),
			description: method.description,
			deprecated: method.deprecationReason ? true : undefined,
			tags: method.tags,
			parameters,
			requestBody: isPost ? this.buildRequestBody(method, schemas) : undefined,
			responses: this.buildResponses(method, parameters, roles, schemas),
			security: roles.length === 0 ? [] : [{ cookieAuth: roles }, { bearerAuth: roles }]
		};
		return { path, o };
	}

	protected buildPaths(schemas: Schemas, openapi: OpenAPIObject): void {
		const paths: PathsObject = openapi.paths;
		const methods = this.metadata.all;
		for (const method of methods) {
			const isPost = false;
			const mode = isPost ? 'post' : 'get';
			const { path, o } = this.buildOpenApiMethod(method, schemas, isPost);
			paths[path] = paths[path] || {};
			paths[path][mode] = o;
			for (const alias of (method.aliasRoutes || [])) {
				const aliasMethod = this.buildOpenApiMethod(method, schemas, isPost, alias);
				paths[aliasMethod.path] = paths[aliasMethod.path] || {};
				paths[aliasMethod.path][mode] = aliasMethod.o;
			}
		}
	}
}

function buildOpenApiBase(version: string): OpenAPIObject {
	return {
		openapi: '3.0.0',
		info: {
			title: 'JamApi', description: 'Subsonic Api for JamServe', version,
			license: { name: 'MIT', url: 'https://raw.githubusercontent.com/ffalt/jamserve/main/LICENSE' }
		},
		servers: [{
			url: 'http://localhost:4040/rest/',
			description: 'A local JamServe Subsonic API'
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

export function buildSubsonicOpenApi(extended: boolean = true): OpenAPIObject {
	const builder = new OpenApiBuilder(extended, getMetadataStorage());
	const openapi: OpenAPIObject = buildOpenApiBase(SUBSONIC_VERSION);
	return builder.build(openapi, {});
}
