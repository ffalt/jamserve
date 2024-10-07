import { JAMAPI_URL_VERSION, JAMAPI_VERSION } from '../../engine/rest/version.js';
import { iterateControllers } from '../../deco/helpers/iterate-super.js';
import { BaseOpenApiBuilder } from '../../deco/builder/openapi-builder.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
class OpenApiBuilder extends BaseOpenApiBuilder {
    buildOpenApiMethod(method, ctrl, schemas, isPost, alias) {
        const parameters = this.refsBuilder.buildParameters(method, ctrl, schemas, alias);
        const path = (ctrl.route || '') + (alias?.route || method.route || '');
        const roles = method.roles || ctrl.roles || [];
        const o = {
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
    fillFormatResponses(type, method, schemas, responses) {
        this.fillJSONResponses(type, method, schemas, responses);
    }
    buildOpenApiMethods(methods, ctrl, schemas, paths, isPost) {
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
    buildControllers(schemas, openapi) {
        const controllers = this.metadata.controllerClasses.filter(c => !c.abstract).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        for (const ctrl of controllers) {
            let gets = [];
            let posts = [];
            iterateControllers(this.metadata.controllerClasses, ctrl, ctrlClass => {
                gets = gets.concat(this.metadata.gets.filter(g => g.controllerClassMetadata === ctrlClass));
                posts = posts.concat(this.metadata.posts.filter(g => g.controllerClassMetadata === ctrlClass));
            });
            this.buildOpenApiMethods(gets, ctrl, schemas, openapi.paths, false);
            this.buildOpenApiMethods(posts, ctrl, schemas, openapi.paths, true);
        }
    }
    buildPaths(schemas, openapi) {
        this.buildControllers(schemas, openapi);
    }
}
function buildOpenApiBase(version) {
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
export function buildOpenApi() {
    const builder = new OpenApiBuilder(getMetadataStorage());
    const openapi = buildOpenApiBase(JAMAPI_VERSION);
    const schemas = {
        ID: { type: 'string', format: 'uuid' },
        JSON: { type: 'object' }
    };
    return builder.build(openapi, schemas);
}
//# sourceMappingURL=openapi.js.map