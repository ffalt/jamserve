import fse from 'fs-extra';
import path from 'path';
import {ContentObject, HeadersObject, OpenAPIObject, OperationObject, PathItemObject, PathsObject, RequestBodyObject, ResponseObject, ResponsesObject, SchemaObject} from '../../src/model/openapi-spec';
import {ApiCall, ApiCalls, getJamApiCalls} from '../lib/api-calls';
import {Definitions} from '../lib/json-schema';
import {buildBinaryResponse, buildOpenApiParameters, collectSchema, listToObject} from '../lib/open-api';
import {run} from '../lib/run';
import {transformTS2NamespaceJSONScheme} from '../lib/tsd2scheme';
import {JAMAPI_URL_VERSION} from '../../src/api/jam/version';

function buildOpenApi(version: string): OpenAPIObject {
	return {
		openapi: '3.0.0',
		info: {description: 'Api for JamServe', version, title: 'JamApi', license: {name: 'MIT'}},
		servers: [{
			url: 'http://localhost:4040/jam/{version}/',
			description: 'A local JamServe API',
			variables: {version: {enum: [JAMAPI_URL_VERSION], default: JAMAPI_URL_VERSION}}
		}],
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

function buildResultSchema(call: ApiCall, openapi: OpenAPIObject, definitions: Definitions): ContentObject | undefined {
	if (call.resultSchema) {
		collectSchema(call.resultSchema, definitions, openapi);
		if (call.resultSchema.$ref) {
			delete call.resultSchema.description;
		}
		return {'application/json': {schema: call.resultSchema as SchemaObject}};
	}
}

function buildResponseHeader(call: ApiCall): HeadersObject | undefined {
	return call.name !== 'login' ? undefined : {'Set-Cookie': {schema: {type: 'string', example: 'jam.sid=abcde12345; Path=/; HttpOnly'}}};
}

async function buildJSONResponse(call: ApiCall, openapi: OpenAPIObject, definitions: Definitions): Promise<ResponseObject> {
	return {
		description: 'ok',
		headers: buildResponseHeader(call),
		content: buildResultSchema(call, openapi, definitions)
	};
}

function buildOpenApiRequestBodyContent(call: ApiCall): ContentObject {
	if (call.upload) {
		return {
			'multipart/form-data': {
				schema: {
					allOf: [call.bodySchema as SchemaObject, {
						properties: {
							image: {
								description: 'the image',
								type: 'object',
								properties: {type: {type: 'string'}, file: {type: 'string', format: 'binary'}},
								required: ['type', 'file']
							}
						},
						required: ['image']
					}]
				}
			}
		};
	}
	return {'application/json': {schema: call.bodySchema as SchemaObject}};
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
		content: buildOpenApiRequestBodyContent(call)
	};
}

async function buildOpenApiResponse(call: ApiCall, openapi: OpenAPIObject, definitions: Definitions): Promise<ResponseObject> {
	return call.binaryResult ? buildBinaryResponse(call.binaryResult) : buildJSONResponse(call, openapi, definitions);
}

async function buildOpenApiPath(call: ApiCall, openapi: OpenAPIObject, definitions: Definitions): Promise<PathItemObject> {
	const cmd: OperationObject = {
		operationId: call.operationId,
		description: call.description,
		tags: [call.tag],
		responses: {
			200: await buildOpenApiResponse(call, openapi, definitions)
		},
		parameters: await buildOpenApiParameters(call, openapi),
		security: call.isPublic ? [] : undefined,
		requestBody: await buildOpenApiRequestBody(call, openapi)
	};
	cmd.responses = await listToObject<{ code: number; text: string }, ResponseObject, ResponsesObject>(call.resultErrors,
		async item => ({key: item.code.toString(), value: {description: item.text}}),
		cmd.responses);
	const result: PathItemObject = {};
	result[call.method] = cmd;
	return result;
}

async function buildCalls(basePath: string, openapi: OpenAPIObject, apicalls: ApiCalls): Promise<void> {
	const data = await transformTS2NamespaceJSONScheme(basePath, 'jam-rest-data');
	openapi.paths = await listToObject<ApiCall, PathItemObject, PathsObject>(apicalls.calls, async call => ({
		key: '/' + call.name,
		value: await buildOpenApiPath(call, openapi, data.definitions as Definitions)
	}), {});
}

function uniqifyOperationIDs(apicalls: ApiCalls): void {
	const usedIDs: Array<string> = [];
	for (const call of apicalls.calls) {
		let s = call.operationId;
		let nr = 1;
		while (usedIDs.includes(s)) {
			nr++;
			s = call.operationId + nr.toString();
		}
		call.operationId = s;
		usedIDs.push(s);
	}
}

async function build(): Promise<string> {
	const basePath = path.resolve('../../src/model/');
	const destfile = path.resolve(basePath, 'jam-openapi.json');
	const apicalls: ApiCalls = await getJamApiCalls(basePath);
	uniqifyOperationIDs(apicalls);
	const openapi: OpenAPIObject = buildOpenApi(apicalls.version);
	await buildCalls(basePath, openapi, apicalls);
	const oa = JSON.stringify(openapi, null, '\t').replace(/\/definitions/g, '/components/schemas');
	await fse.writeFile(destfile, oa);
	return destfile;
}

run(build);
