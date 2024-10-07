import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { SUBSONIC_VERSION } from '../version.js';
import { BaseOpenApiBuilder } from '../../deco/builder/openapi-builder.js';
const security = [
    { UserAuth: [], PasswordAuth: [], VersionAuth: [], ClientAuth: [] },
    { UserAuth: [], SaltedPasswordAuth: [], SaltAuth: [], VersionAuth: [], ClientAuth: [] }
];
class OpenApiBuilder extends BaseOpenApiBuilder {
    buildOpenApiMethod(method, schemas, isPost, alias) {
        const parameters = this.refsBuilder.buildParameters(method, undefined, schemas, alias);
        const path = `${alias?.route || method.route || ''}`;
        const roles = method.roles || [];
        const o = {
            operationId: `${method.methodName}${alias?.route || ''}`,
            summary: `${method.summary || method.description} ${alias?.name || ''}`.trim(),
            description: method.description,
            deprecated: method.deprecationReason ? true : undefined,
            tags: method.tags || ['Unsorted'],
            parameters,
            requestBody: isPost ? this.buildRequestBody(method, schemas) : undefined,
            responses: this.buildResponses(method, parameters, roles, schemas),
            security
        };
        return { path, o };
    }
    fillFormatResponses(type, method, schemas, responses) {
        this.fillXMLResponses(type, method, schemas, responses);
    }
    buildPaths(schemas, openapi) {
        const paths = openapi.paths;
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
function buildOpenApiBase(version) {
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
export function buildSubsonicOpenApi() {
    const builder = new OpenApiBuilder(getMetadataStorage());
    const openapi = buildOpenApiBase(SUBSONIC_VERSION);
    const schemas = {
        ID: { type: 'integer' },
        JSON: { type: 'object' }
    };
    return builder.build(openapi, schemas);
}
//# sourceMappingURL=openapi.js.map