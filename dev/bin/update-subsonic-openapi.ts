import {OpenAPIObject} from '../../src/model/openapi-spec';
import path from 'path';
import {getSubsonicApiCalls, IApiCall, transformTS2JSONScheme} from './utils';
import fse from 'fs-extra';

const version = '1.16.0';
const basePath = path.resolve('../../src/model/');
const destfile = path.resolve(basePath, 'subsonic-openapi.json');

async function run() {
	const data = await transformTS2JSONScheme(basePath, 'subsonic-rest-data', 'Subsonic.Response');
	data.definitions = data.definitions || {};
	data.definitions['Subsonic.ResponseStatus'] = {
		'enum': [
			'failed',
			'ok'
		],
		'type': 'string'
	};
	data.definitions['Subsonic.Version'] = {
		'enum': [version],
		'type': 'string'
	};
	const apicalls: Array<IApiCall> = await getSubsonicApiCalls(basePath);

	function fillResponse(p: any): any {
		const o = Object.assign({}, p);
		o.properties['status'] = {$ref: '#/definitions/Subsonic.ResponseStatus'};
		o.properties['error'] = {$ref: '#/definitions/Subsonic.Error'};
		o.properties['version'] = {$ref: '#/definitions/Subsonic.Version'};
		o.required = o.required.concat(['status', 'version']);
		collectSchema(o, data.definitions);
		return o;
	}

	function collectSchema(p: any, definitions: any) {
		if (p.$ref) {
			const proptype = p.$ref.split('/')[2];
			p = definitions[proptype];
			if (!p) {
				console.error('collectSchema: type ' + proptype + ' not found');
				return;
			}
			if (openapi.components && openapi.components.schemas && !openapi.components.schemas[proptype]) {
				openapi.components.schemas[proptype] = p;
				if (p.properties) {
					Object.keys(p.properties).forEach(key => {
						collectSchema(p.properties[key], definitions);
					});
				}
			}
		} else if (p.items) {
			collectSchema(p.items, definitions);
		} else if (p.properties) {
			Object.keys(p.properties).forEach(key => {
				collectSchema(p.properties[key], definitions);
			});
		} else if (!p.type) {
			console.error('unknown schema structure', p);
		}
	}

	function collectParams(p: any, definitions: any, inPart: string): Array<any> {
		const result: Array<any> = [];
		if (!p.$ref) {
			console.log(p);
		}
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

	const openapi: OpenAPIObject = {
		openapi: '3.0.0',
		info: {
			description: 'Api for Subsonic',
			version: version,
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
					'userAuth': [],
					'passwdAuth': [],
					'tokenAuth': [],
					'saltAuth': [],
					'versionAuth': [],
					'clientAuth': [],
					'formatAuth': []
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

	apicalls.forEach(call => {
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
			if (call.resultSchema) {
				success.content = {'application/json': {schema: fillResponse(call.resultSchema)}};
			} else {
				success.content = {'application/json': {schema: fillResponse({type: 'object', properties: {}, required: []})}};
			}
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
