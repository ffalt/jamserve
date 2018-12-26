import {OpenAPIObject, OperationObject, ParameterObject, RequestBodyObject, SchemaObject} from '../model/openapi-spec';
import express from 'express';
import Logger from './logger';
import {Definition} from 'typescript-json-schema';
import {validate} from './validate-json';

const log = Logger('CheckApiParameters');

function validOAParameter(query: any, param: ParameterObject): string | null {
	if (!query) {
		return 'Missing parameter collection ' + param.name;
	}
	const schema = <SchemaObject> param.schema;
	let value = query[param.name];
	// set default values
	if (value === undefined) {
		if (schema && schema.default !== undefined) {
			query[param.name] = schema.default;
			value = schema.default;
		}
	}
	// check required
	if (value === undefined) {
		if (param.required) {
			return 'Missing required parameter ' + param.name;
		}
		return null;
	}
	// sanitize & check string parameter type
	if (schema.type === 'boolean') {
		if (['true', 'yes', '1'].indexOf(value.toString()) >= 0) {
			query[param.name] = true;
			value = true;
		} else if (['false', 'no', '0'].indexOf(value.toString()) >= 0) {
			query[param.name] = false;
			value = false;
		} else {
			return 'Invalid boolean parameter ' + param.name;
		}
		query[param.name] = value;
	} else if (['float', 'long', 'double', 'number', 'integer'].indexOf(schema.type || '') >= 0) {
		let num = Number(value.toString());
		if (isNaN(num)) {
			return 'Invalid number parameter ' + param.name;
		}
		if (schema.type === 'integer') {
			num = Math.floor(num);
		}
		if (schema.minimum !== undefined && schema.minimum > num) {
			return 'Invalid number parameter ' + param.name + '; minimum is ' + schema.minimum;
		}
		if (schema.maximum !== undefined && schema.maximum < num) {
			return 'Invalid number parameter ' + param.name + '; maximum is ' + schema.maximum;
		}
		query[param.name] = num;
	} else if (schema.type === 'string') {
		const s = value.toString().trim();
		// if (s.length === 0) {
		// 	return 'Empty string parameter ' + param.name;
		// }
		if (schema.enum) {
			if (schema.enum.indexOf(s) < 0) {
				return 'Invalid enum string parameter ' + param.name + ': ' + s;
			}
		}
		query[param.name] = s;
	} else if (schema.type === 'array') {
		const items = <SchemaObject>(schema.items || {type: 'unknown'});
		if (items.type === 'string') {
			const list = ((Array.isArray(value) ? value : [value]) || []).map(s => s.toString().trim());
			if (items.enum) {
				for (let i = 0; i < list.length; i++) {
					const s = list[i];
					if (items.enum.indexOf(s) < 0) {
						return 'Invalid enum string parameter ' + param.name + ': ' + s;
					}
				}
			}
			query[param.name] = list;
		} else if (['float', 'long', 'double', 'number', 'integer'].indexOf(items.type || '') >= 0) {
			const list = ((Array.isArray(value) ? value : [value]) || []).map(id => {
				let num = Number(id.toString());
				if (items.type === 'integer') {
					num = Math.floor(num);
				}
				return num;
			});
			for (let i = 0; i < list.length; i++) {
				const num = list[i];
				if (isNaN(num)) {
					return 'Invalid number array parameter ' + param.name;
				}
				if (items.minimum !== undefined && items.minimum > num) {
					return 'Invalid number array parameter ' + param.name + '; minimum is ' + items.minimum;
				}
				if (schema.maximum !== undefined && schema.maximum < num) {
					return 'Invalid number array parameter ' + items.name + '; maximum is ' + items.maximum;
				}
			}
			query[param.name] = list;
		} else {
			console.log('TODO: validOAParameter list type', schema, value);
		}
	}
	return null;
}

async function checkAORequestBody(cmd: OperationObject, apiSchema: any, body: any): Promise<void> {
	if (!cmd.requestBody || !(<RequestBodyObject>cmd.requestBody).content || !(<RequestBodyObject>cmd.requestBody).content['application/json']) {
		return;
	}
	if (!body) {
		return Promise.reject(Error('Missing Request Body'));
	}
	const schema = (<RequestBodyObject>cmd.requestBody).content['application/json'].schema;
	if (!schema || !schema.$ref) {
		return Promise.reject(Error('Unimplemented POST schema'));
	}
	const def = apiSchema.definitions[schema.$ref.split('/')[3]];
	if (!def) {
		return Promise.reject(Error('Unknown POST schema' + schema.$ref));
	}
	const result = await validate(body, def);
	if (result.errors.length > 0) {
		console.error(def, body, result.errors);
		return Promise.reject(Error(JSON.stringify(result.errors)));
	}
}

async function checkAOParameters(cmd: OperationObject, schema: Definition, req: express.Request): Promise<void> {
	if (!cmd.parameters) {
		return;
	}
	let error: string | null = null;
	cmd.parameters.find(param => {
		param = <ParameterObject>param;
		if (param.in === 'query') {
			error = validOAParameter(req.query, param);
		} else if (param.in === 'path') {
			error = validOAParameter(req.params, param);
		} else if (param.in === 'header') {
			error = validOAParameter(req.headers, param);
		} else if (param.in === 'cookie') {
			error = validOAParameter(req.cookies, param);
		} else {
			log.info('Invalid/Unknown parameter spec', param);
		}
		return !!error;
	});
	if (error) {
		return Promise.reject(Error(error));
	}
}

export async function checkOpenApiParameters(name: string, req: express.Request, openapi: OpenAPIObject, schema: Definition, forceMethod?: string): Promise<void> {
	const cmdPath = openapi.paths[name];
	if (!cmdPath) {
		log.info('cmd not found to validate', name);
		return;
	}
	const method = forceMethod || req.method.toLowerCase();
	const cmd = cmdPath[method];
	if (!cmd) {
		log.info('cmd method ' + req.method + ' not found to validate', req.path);
		return;
	}
	if (method === 'get') {
		await checkAOParameters(cmd, schema, req);
	} else {
		await checkAORequestBody(cmd, schema, req.body);
	}
}
