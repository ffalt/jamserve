import { metadataStorage } from '../metadata/metadata-storage.js';
import { MethodMetadata } from '../../deco/definitions/method-metadata.js';
import { Schemas, OpenAPIObject, OperationObject, ParameterObject, PathsObject, ResponsesObject } from '../../deco/builder/openapi-helpers.js';
import { SUBSONIC_VERSION } from '../version.js';
import { BaseOpenApiBuilder } from '../../deco/builder/openapi-builder.js';
import { CustomPathParameterAliasRouteOptions } from '../../deco/definitions/types.js';
import { SecurityRequirementObject } from 'openapi3-ts/oas30';

const security: Array<SecurityRequirementObject> = [
	{ UserAuth: [], PasswordAuth: [], VersionAuth: [], ClientAuth: [] },
	{ UserAuth: [], SaltedPasswordAuth: [], SaltAuth: [], VersionAuth: [], ClientAuth: [] }
];

class OpenApiBuilder extends BaseOpenApiBuilder {
	protected buildOpenApiMethod(method: MethodMetadata, schemas: Schemas, isPost: boolean, alias?: CustomPathParameterAliasRouteOptions): { path: string; o: OperationObject } {
		const parameters: Array<ParameterObject> = this.refsBuilder.buildParameters(method, undefined, schemas, alias);
		const path = alias?.route ?? method.route ?? '';
		const roles = method.roles ?? [];
		const o: OperationObject = {
			operationId: `${method.methodName}${alias?.route ?? ''}`,
			summary: `${method.summary ?? method.description} ${alias?.name ?? ''}`.trim(),
			description: method.description,
			deprecated: method.deprecationReason ? true : undefined,
			tags: method.tags ?? ['Unsorted'],
			parameters,
			requestBody: isPost ? this.buildRequestBody(method, schemas) : undefined,
			responses: this.buildResponses(method, parameters, roles, schemas),
			security
		};
		return { path, o };
	}

	fillFormatResponses(type: Function | object | symbol, method: MethodMetadata, schemas: Schemas, responses: ResponsesObject) {
		this.fillXMLResponses(type, method, schemas, responses);
	}

	protected buildPaths(schemas: Schemas, openapi: OpenAPIObject): void {
		const paths: PathsObject = openapi.paths;
		const methods = this.metadata.all;
		for (const method of methods) {
			const isPost = false;
			const mode = 'post';
			const { path, o } = this.buildOpenApiMethod(method, schemas, isPost);
			paths[path] = paths[path] ?? {};
			paths[path][mode] = o;
			for (const alias of (method.aliasRoutes ?? [])) {
				const aliasMethod = this.buildOpenApiMethod(method, schemas, isPost, alias);
				paths[aliasMethod.path] = paths[aliasMethod.path] ?? {};
				paths[aliasMethod.path][mode] = aliasMethod.o;
			}
		}
	}
}

function buildOpenApiBase(version: string): OpenAPIObject {
	return {
		openapi: '3.0.0',
		info: {
			title: 'SubsonicApi', description: 'Subsonic Api for JamServe', version
		},
		servers: [{
			url: 'http://localhost:4040/rest/',
			description: 'A local JamServe Subsonic API'
		}],
		tags: [],
		paths: {},
		components: {
			securitySchemes: {
				UserAuth: {
					type: 'apiKey',
					in: 'query',
					name: 'u',
					description: 'Username'
				},
				PasswordAuth: {
					type: 'apiKey',
					in: 'query',
					name: 'p',
					description: 'Password, either in clear text or hex-encoded with a "enc:" prefix.'
				},
				SaltedPasswordAuth: {
					type: 'apiKey',
					in: 'query',
					name: 't',
					description: 'Authentication token computed as md5(password + salt).'
				},
				SaltAuth: {
					type: 'apiKey',
					in: 'query',
					name: 's',
					description: 'A random string ("salt") used as input for computing the password hash.'
				},
				VersionAuth: {
					type: 'apiKey',
					in: 'query',
					name: 'v',
					description: 'The Subsonic protocol version implemented by the client.'
				},
				ClientAuth: {
					type: 'apiKey',
					in: 'query',
					name: 'c',
					description: 'A unique string identifying the client application.'
				}
			},
			schemas: {}
		},
		security
	};
}

// ApiKeyAuth: # arbitrary name for the security scheme
//
// type: apiKey
//
// in: header # can be "header", "query" or "cookie"
//
// name: X-API-KEY # name of the header, query parameter or cookie

export function buildSubsonicOpenApi(): OpenAPIObject {
	const builder = new OpenApiBuilder(metadataStorage());
	const openapi: OpenAPIObject = buildOpenApiBase(SUBSONIC_VERSION);
	const schemas: Schemas = {
		ID: { type: 'integer' },
		JSON: { type: 'object' }
	};
	return builder.build(openapi, schemas);
}
