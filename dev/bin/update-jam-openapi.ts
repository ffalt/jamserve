import {OpenAPIObject} from '../../src/model/openapi';
import path from 'path';
import {getJamApiCalls, IApiCall, transformTS2JSONScheme, transformTS2NamespaceJSONScheme} from './utils';
import fse from 'fs-extra';

const version = '0.1.0';
const basePath = path.resolve('../../src/model/');
const destfile = path.resolve(basePath, 'jam-openapi-' + version + '.json');

async function run() {

	const openapi: OpenAPIObject = {
		openapi: '3.0.0',
		info: {
			description: 'Api for JamServe',
			version: version,
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
			{bearerAuth: []},
		]
	};

	function collectSchema(p: any, definitions: any) {
		if (p.$ref) {
			const proptype = p.$ref.split('/')[2];
			p = definitions[proptype];
			if (openapi.components && openapi.components.schemas && !openapi.components.schemas[proptype]) {
				openapi.components.schemas[proptype] = p;
				if (!p) {
					console.error('Missing property type', proptype);
				}
				if (p && p.properties) {
					Object.keys(p.properties).forEach(key => {
						collectSchema(p.properties[key], definitions);
					});
				}
			}
		} else if (p.items) {
			collectSchema(p.items, definitions);
		}
	}

	function collectParams(p: any, definitions: any, inPart: string): Array<any> {
		const result: Array<any> = [];
		const proptype = p.$ref.split('/')[2];
		p = definitions[proptype];
		Object.keys(p.properties).forEach(key => {
			const prop = Object.assign({}, p.properties[key]);
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
				required: (inPart === 'path') || ((p.required || []).indexOf(key) >= 0)
			});
		});
		return result;
	}

	const data = await transformTS2NamespaceJSONScheme(basePath, 'jam-rest-data-' + version);
	const apicalls: Array<IApiCall> = await getJamApiCalls(basePath);

	apicalls.forEach(call => {
		const cmd: any = {
			operationId: call.operationId,
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
				collectSchema(call.resultSchema, data.definitions);
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
			cmd.parameters = collectParams(call.paramSchema, call.definitions, 'query');
		}
		if (call.pathParamsSchema) {
			const parameters = collectParams(call.pathParamsSchema, call.definitions, 'path');
			cmd.parameters = (cmd.parameters || []).concat(parameters);
		}
		if (call.bodySchema) {
			collectSchema(call.bodySchema, call.definitions);
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
		openapi.paths['/' + call.name] = openapi.paths['/' + call.name] || {};
		(<any>openapi.paths['/' + call.name])[call.method] = cmd;
	});

	const oa = JSON.stringify(openapi, null, '\t').replace(/\/definitions/g, '/components/schemas');
	await fse.writeFile(destfile, oa);
}

run()
	.then(() => {
		console.log(destfile, 'written');
	})
	.catch(e => {
		console.error(e);
	});
