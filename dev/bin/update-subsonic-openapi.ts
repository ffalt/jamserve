import fse from 'fs-extra';
import path from 'path';
import {OpenAPIObject, OperationObject, PathItemObject, PathsObject, RequestBodyObject, ResponseObject, ResponsesObject, SchemaObject} from '../../src/model/openapi-spec';
import {ApiCall, ApiCalls, getSubsonicApiCalls} from '../lib/api-calls';
import {Definitions} from '../lib/json-schema';
import {buildBinaryResponse, buildOpenApiParameters, collectSchema, listToObject} from '../lib/open-api';
import {run} from '../lib/run';
import {transformTS2JSONScheme} from '../lib/ts2scheme';

function buildOpenApi(version: string): OpenAPIObject {
	return {
		openapi: '3.0.0',
		info: {
			description: 'Api for Subsonic', version, title: 'SubsonicApi'
		},
		servers: [{url: 'http://localhost:4040/rest/', description: 'A local Subsonic API'}],
		paths: {},
		security: [{userAuth: [], passwdAuth: [], tokenAuth: [], saltAuth: [], versionAuth: [], clientAuth: [], formatAuth: []}],
		components: {
			securitySchemes: {
				userAuth: {type: 'apiKey', in: 'query', name: 'u', description: 'The username.'},
				passwdAuth: {type: 'apiKey', in: 'query', name: 'p', description: 'The password, either in clear text or hex-encoded with a "enc:" prefix.'},
				tokenAuth: {type: 'apiKey', in: 'query', name: 't', description: 'The authentication token computed as md5(password + salt).'},
				saltAuth: {type: 'apiKey', in: 'query', name: 's', description: 'A random string ("salt") used as input for computing the password hash. See below for details.'},
				versionAuth: {type: 'apiKey', in: 'query', name: 'v', description: 'The protocol version implemented by the client'},
				clientAuth: {type: 'apiKey', in: 'query', name: 'c', description: 'A unique string identifying the client application.'},
				formatAuth: {
					type: 'apiKey',
					in: 'query',
					name: 'f',
					description: 'Request data to be returned in this format. Supported values are "xml", "json" and "jsonp". If using jsonp, specify name of javascript callback function using a callback parameter.'
				}
			},
			schemas: {}
		}
	};
}

function fillResponse(p: any, definitions: any, openapi: OpenAPIObject): any {
	const o = {...p};
	o.properties.status = {$ref: '#/definitions/Subsonic.ResponseStatus'};
	o.properties.error = {$ref: '#/definitions/Subsonic.Error'};
	o.properties.version = {$ref: '#/definitions/Subsonic.Version'};
	o.required = o.required.concat(['status', 'version']);
	collectSchema(o, definitions, openapi);
	return o;
}

async function buildResponse(call: ApiCall, openapi: OpenAPIObject, definitions: Definitions): Promise<ResponseObject> {
	const content = {schema: fillResponse(call.resultSchema ? call.resultSchema : {type: 'object', properties: {}, required: []}, definitions, openapi)};
	return {
		description: 'ok',
		content: {'application/json': content, 'application/xml': content}
	};
}

async function buildOpenApiResponse(call: ApiCall, openapi: OpenAPIObject, definitions: Definitions): Promise<ResponseObject> {
	return call.binaryResult ? buildBinaryResponse(call.binaryResult) : buildResponse(call, openapi, definitions);
}

async function buildOpenApiRequestBody(call: ApiCall, openapi: OpenAPIObject): Promise<RequestBodyObject | undefined> {
	if (!call.bodySchema || !call.bodySchema.$ref) {
		return;
	}
	collectSchema(call.bodySchema, call.definitions, openapi);
	const proptype = call.bodySchema.$ref.split('/')[2];
	const p = call.definitions[proptype];
	return {
		description: p.description,
		required: true,
		content: {
			'application/json': {schema: call.bodySchema as SchemaObject}
		}
	};
}

async function buildOpenApiPath(call: ApiCall, openapi: OpenAPIObject, definitions: Definitions): Promise<PathItemObject> {
	const cmd: OperationObject = {
		operationId: call.operationId,
		summary: call.description,
		tags: [call.tag],
		responses: {
			200: await buildOpenApiResponse(call, openapi, definitions)
		},
		parameters: await buildOpenApiParameters(call, openapi),
		security: call.isPublic ? [] : undefined,
		requestBody: await buildOpenApiRequestBody(call, openapi)
	};
	cmd.responses = await listToObject<{ code: number, text: string }, ResponseObject, ResponsesObject>(call.resultErrors,
		async item => ({key: item.code.toString(), value: {description: item.text}}),
		cmd.responses);
	const result: PathItemObject = {};
	result[call.method] = cmd;
	return result;
}

async function buildCalls(basePath: string, openapi: OpenAPIObject, apicalls: ApiCalls): Promise<void> {
	const data = await transformTS2JSONScheme(basePath, 'subsonic-rest-data', 'Subsonic.Response');
	data.definitions = data.definitions || {};
	data.definitions['Subsonic.ResponseStatus'] = {
		enum: ['failed', 'ok'],
		type: 'string'
	};
	data.definitions['Subsonic.Version'] = {
		enum: [apicalls.version],
		type: 'string'
	};
	openapi.paths = await listToObject<ApiCall, PathItemObject, PathsObject>(apicalls.calls, async call => ({
		key: `/${call.name}`,
		value: await buildOpenApiPath(call, openapi, data.definitions as Definitions)
	}), {});
}

async function build(): Promise<string> {
	const basePath = path.resolve('../../src/model/');
	const destfile = path.resolve(basePath, 'subsonic-openapi.json');
	const apicalls: ApiCalls = await getSubsonicApiCalls(basePath);
	const openapi: OpenAPIObject = buildOpenApi(apicalls.version);
	await buildCalls(basePath, openapi, apicalls);
	const oa = JSON.stringify(openapi, null, '\t').replace(/\/definitions/g, '/components/schemas');
	await fse.writeFile(destfile, oa);
	return destfile;
}

run(build);
