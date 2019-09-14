import fse from 'fs-extra';
import path from 'path';
import {OpenAPIObject} from '../../src/model/openapi-spec';
import {ApiCall, ApiCalls, getSubsonicApiCalls, run, transformTS2JSONScheme} from './utils';

function buildOpenApi(version: string): OpenAPIObject {
	return {
		openapi: '3.0.0',
		info: {
			description: 'Api for Subsonic',
			version,
			title: 'SubsonicApi'
		},
		servers: [{
			url: 'http://localhost:4040/rest/',
			description: 'A local Subsonic API'
		}],
		paths: {},
		security:
			[
				{
					userAuth: [],
					passwdAuth: [],
					tokenAuth: [],
					saltAuth: [],
					versionAuth: [],
					clientAuth: [],
					formatAuth: []
				}
			],
		components: {
			securitySchemes: {
				userAuth: {
					type: 'apiKey',
					in: 'query',
					name: 'u',
					description: 'The username.'
				},
				passwdAuth: {
					type: 'apiKey',
					in: 'query',
					name: 'p',
					description: 'The password, either in clear text or hex-encoded with a "enc:" prefix.'
				},
				tokenAuth: {
					type: 'apiKey',
					in: 'query',
					name: 't',
					description: 'The authentication token computed as md5(password + salt).'
				},
				saltAuth: {
					type: 'apiKey',
					in: 'query',
					name: 's',
					description: 'A random string ("salt") used as input for computing the password hash. See below for details.'
				},
				versionAuth: {
					type: 'apiKey',
					in: 'query',
					name: 'v',
					description: 'The protocol version implemented by the client'
				},
				clientAuth: {
					type: 'apiKey',
					in: 'query',
					name: 'c',
					description: 'A unique string identifying the client application.'
				},
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

function collectSchema(p: any, definitions: any, openapi: OpenAPIObject): void {
	if (p.$ref) {
		const proptype = p.$ref.split('/')[2];
		p = definitions[proptype];
		if (!p) {
			console.error(`collectSchema: type ${proptype} not found`);
			return;
		}
		if (openapi.components && openapi.components.schemas && !openapi.components.schemas[proptype]) {
			openapi.components.schemas[proptype] = p;
			if (p.properties) {
				Object.keys(p.properties).forEach(key => {
					collectSchema(p.properties[key], definitions, openapi);
				});
			}
		}
	} else if (p.items) {
		collectSchema(p.items, definitions, openapi);
	} else if (p.properties) {
		Object.keys(p.properties).forEach(key => {
			collectSchema(p.properties[key], definitions, openapi);
		});
	} else if (!p.type) {
		console.error('unknown schema structure', p);
	}
}

function collectParams(p: any, definitions: any, inPart: string, openapi: OpenAPIObject): Array<any> {
	const result: Array<any> = [];
	if (!p.$ref) {
		console.log(p);
	}
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

function fillResponse(p: any, definitions: any, openapi: OpenAPIObject): any {
	const o = {...p};
	o.properties.status = {$ref: '#/definitions/Subsonic.ResponseStatus'};
	o.properties.error = {$ref: '#/definitions/Subsonic.Error'};
	o.properties.version = {$ref: '#/definitions/Subsonic.Version'};
	o.required = o.required.concat(['status', 'version']);
	collectSchema(o, definitions, openapi);
	return o;
}

async function buildOpenApiPath(call: ApiCall, openapi: OpenAPIObject, usedIDs: Array<string>, definitions: any): Promise<void> {
	const cmd: any = {
		operationId: call.operationId,
		summary: call.description,
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
		success.content = {'application/json': {schema: fillResponse(call.resultSchema ? call.resultSchema : {type: 'object', properties: {}, required: []}, definitions, openapi)}};
		success.content['application/xml'] = success.content['application/json'];
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
			content: {
				'application/json': {schema: call.bodySchema}
			}
		};
	}
	const name = `/${call.name}`;
	openapi.paths[name] = openapi.paths[name] || {};
	(openapi.paths[name] as any)[call.method] = cmd;
}

async function build(): Promise<string> {
	const basePath = path.resolve('../../src/model/');
	const destfile = path.resolve(basePath, 'subsonic-openapi.json');
	const apicalls: ApiCalls = await getSubsonicApiCalls(basePath);
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
	const openapi: OpenAPIObject = buildOpenApi(apicalls.version);
	for (const call of apicalls.calls) {
		await buildOpenApiPath(call, openapi, [], data.definitions);
	}
	const oa = JSON.stringify(openapi, null, '\t').replace(/\/definitions/g, '/components/schemas');
	await fse.writeFile(destfile, oa);
	return destfile;
}

run(build);
