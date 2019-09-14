import fse from 'fs-extra';
import path from 'path';
import {OpenAPIObject} from '../../src/model/openapi-spec';
import {ApiCall, ApiCalls, getJamApiCalls, run, transformTS2NamespaceJSONScheme} from './utils';

function buildOpenApi(version: string): OpenAPIObject {
	return {
		openapi: '3.0.0',
		info: {
			description: 'Api for JamServe',
			version,
			title: 'JamApi',
			license: {
				name: 'MIT'
			}
		},
		servers: [{
			url: 'http://localhost:4040/api/{version}/',
			description: 'A local JamServe API',
			variables: {
				version: {
					enum: ['v1'],
					default: 'v1'
				}
			}
		}],
		paths: {},
		components: {
			securitySchemes: {
				cookieAuth: {
					type: 'apiKey',
					in: 'cookie',
					name: 'jam.sid'
				},
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			},
			schemas: {}
		},
		security: [
			{cookieAuth: []},
			{bearerAuth: []}
		]
	};
}

function collectSchema(p: any, definitions: any, openapi: OpenAPIObject): void {
	if (p.$ref) {
		delete p.description;
		const proptype = p.$ref.split('/')[2];
		const pr = definitions[proptype];
		if (openapi.components && openapi.components.schemas && !openapi.components.schemas[proptype]) {
			openapi.components.schemas[proptype] = pr;
			if (!pr) {
				console.error('Missing property type', proptype, p, pr);
			}
			if (pr && pr.properties) {
				Object.keys(pr.properties).forEach(key => {
					collectSchema(pr.properties[key], definitions, openapi);
				});
			}
		}
	} else if (p.items) {
		collectSchema(p.items, definitions, openapi);
	} else if (p.additionalProperties) {
		collectSchema(p.additionalProperties, definitions, openapi);
	} else if (p.properties) {
		Object.keys(p.properties).forEach(key => {
			collectSchema(p.properties[key], definitions, openapi);
		});
	}
}

function collectParams(p: any, definitions: any, inPart: string, openapi: OpenAPIObject): Array<any> {
	const result: Array<any> = [];
	const proptype = p.$ref.split('/')[2];
	p = definitions[proptype];
	Object.keys(p.properties).forEach(key => {
		const prop = {...p.properties[key]};
		const description = prop.description;
		delete prop.description;
		if (prop.$ref) {
			const ptype = prop.$ref.split('/')[2];
			if (openapi.components && openapi.components.schemas && !openapi.components.schemas[ptype]) {
				openapi.components.schemas[ptype] = definitions[ptype];
			}
		}
		result.push({
			in: inPart,
			name: key,
			schema: prop,
			description,
			required: (inPart === 'path') || ((p.required || []).includes(key))
		});
	});
	return result;
}

async function buildOpenApiPath(call: ApiCall, openapi: OpenAPIObject, usedIDs: Array<string>, definitions: any): Promise<void> {
	let s = call.operationId;
	let nr = 1;
	while (usedIDs.includes(s)) {
		nr++;
		s = call.operationId + nr.toString();
	}
	usedIDs.push(s);
	const cmd: any = {
		operationId: s,
		description: call.description,
		tags: [call.tag],
		responses: {}
	};
	if (call.binaryResult) {
		const success: any = {description: 'binary data', content: {}};
		call.binaryResult.forEach(ct => {
			success.content[ct] = {
				schema: {
					type: 'string',
					format: 'binary'
				}
			};
		});
		cmd.responses['200'] = success;
	} else {
		const success: any = {description: 'ok'};
		if (call.name === 'login') {
			success.headers = {
				'Set-Cookie': {
					schema: {
						type: 'string',
						example: 'jam.sid=abcde12345; Path=/; HttpOnly'
					}
				}
			};
		}
		if (call.resultSchema) {
			collectSchema(call.resultSchema, definitions, openapi);
			if (call.resultSchema.$ref) {
				delete call.resultSchema.description;
			}
			success.content = {'application/json': {schema: call.resultSchema}};
		}
		cmd.responses['200'] = success;
	}
	if (call.isPublic) {
		cmd.security = [];
	}
	call.resultErrors.forEach(re => {
		cmd.responses[re.code.toString()] = {description: re.text};
	});
	if (call.paramSchema) {
		cmd.parameters = collectParams(call.paramSchema, call.definitions, 'query', openapi);
	}
	if (call.pathParamsSchema) {
		const parameters = collectParams(call.pathParamsSchema, call.definitions, 'path', openapi);
		cmd.parameters = (cmd.parameters || []).concat(parameters);
	}
	if (call.bodySchema) {
		collectSchema(call.bodySchema, call.definitions, openapi);
		const proptype = call.bodySchema.$ref.split('/')[2];
		const p = call.definitions[proptype];
		cmd.requestBody = {
			description: p.description,
			required: true,
			content: {}
		};
		if (call.upload) {
			cmd.requestBody.content = {
				'multipart/form-data': {
					schema: {
						allOf: [call.bodySchema, {
							properties: {
								image: {
									description: 'the image',
									type: 'object',
									properties: {
										type: {
											type: 'string'
										},
										file: {
											type: 'string',
											format: 'binary'
										}
									},
									required: ['type', 'file']
								}
							},
							required: ['image']
						}]
					}
				}
			};
		} else {
			cmd.requestBody.content = {'application/json': {schema: call.bodySchema}};
		}
	}
	openapi.paths['/' + call.name] = openapi.paths['/' + call.name] || {};
	(openapi.paths['/' + call.name] as any)[call.method] = cmd;
}

async function buildCalls(basePath: string, openapi: OpenAPIObject, apicalls: ApiCalls): Promise<void> {
	const data = await transformTS2NamespaceJSONScheme(basePath, 'jam-rest-data');
	const usedIDs: Array<string> = [];
	apicalls.calls.forEach(call => {
		buildOpenApiPath(call, openapi, usedIDs, data.definitions);
	});
}

async function build(): Promise<string> {
	const basePath = path.resolve('../../src/model/');
	const destfile = path.resolve(basePath, 'jam-openapi.json');
	const apicalls: ApiCalls = await getJamApiCalls(basePath);
	const openapi: OpenAPIObject = buildOpenApi(apicalls.version);
	await buildCalls(basePath, openapi, apicalls);
	const oa = JSON.stringify(openapi, null, '\t').replace(/\/definitions/g, '/components/schemas');
	await fse.writeFile(destfile, oa);
	return destfile;
}

run(build);
