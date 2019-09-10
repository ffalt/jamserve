import express from 'express';
import {OpenAPIObject, OperationObject, ParameterObject, RequestBodyObject, SchemaObject} from '../model/openapi-spec';
import Logger from './logger';
import {jsonValidator, JSONValidator, validateJSON} from './validate-json';

const log = Logger('CheckApiParameters');

function validOAParameterValueBySchema(query: any, param: { name: string, required?: boolean }, value: any, schema: SchemaObject): string | null {
	if (value === undefined || value === null) {
		if (schema && schema.default !== undefined) {
			query[param.name] = schema.default;
			value = schema.default;
		}
	}
	// check required?
	if (value === undefined || value === null) {
		if (param.required) {
			return 'Missing required parameter ' + param.name;
		}
		return null;
	}
	// sanitize & check string parameter type
	if (schema.type === 'boolean') {
		if (['true', 'yes', '1'].includes(value.toString())) {
			query[param.name] = true;
			value = true;
		} else if (['false', 'no', '0'].includes(value.toString())) {
			query[param.name] = false;
			value = false;
		} else {
			return 'Invalid boolean parameter ' + param.name;
		}
		query[param.name] = value;
	} else if (['float', 'long', 'double', 'number', 'integer'].includes(schema.type || '')) {
		const s = value.toString().trim();
		if (s.length === 0) {
			return 'Empty number parameter ' + param.name;
		}
		const num = Number(s);
		if (isNaN(num)) {
			return 'Invalid number parameter ' + param.name;
		}
		if (schema.type === 'integer' && !Number.isInteger(num)) {
			return 'Invalid integer parameter ' + param.name;
		}
		if (schema.minimum !== undefined && schema.minimum > num) {
			return 'Invalid number parameter ' + param.name + '; minimum is ' + schema.minimum;
		}
		if (schema.maximum !== undefined && schema.maximum < num) {
			return 'Invalid number parameter ' + param.name + '; maximum is ' + schema.maximum;
		}
		query[param.name] = num;
	} else if (schema.type === 'string') {
		if (typeof value !== 'string') {
			return 'Invalid string parameter ' + param.name;
		}
		const s = value.trim();
		if (s.length === 0) {
			return 'Empty string parameter ' + param.name;
		}
		if (schema.enum) {
			if (!schema.enum.includes(s)) {
				return 'Invalid enum string parameter ' + param.name + ': ' + s;
			}
		}
		query[param.name] = s;
	} else if (schema.type === 'array') {
		const items = (schema.items || {type: 'unknown'}) as SchemaObject;
		const listValues = ((Array.isArray(value) ? value : [value]) || []);
		if (param.required && listValues.length === 0) {
			return 'Missing required parameter ' + param.name;
		}
		for (const listValue of listValues) {
			const result = validOAParameterValueBySchema({}, {name: param.name, required: true}, listValue, items);
			if (result) {
				return result;
			}
		}
		query[param.name] = listValues;
	}
	return null;
}

function validOAParameter(query: any, param: ParameterObject): string | null {
	if (!query) {
		return 'Missing parameter collection ' + param.name;
	}
	return validOAParameterValueBySchema(query, param, query[param.name], param.schema as SchemaObject);
}

function createJSONValidator(def: any, apiSchema: any): JSONValidator {
	const specialSchema = {...def};
	specialSchema.definitions = apiSchema.definitions;
	return jsonValidator(specialSchema);
}

async function checkAORequestBody(cmd: OperationObject, body: any): Promise<void> {
	if (!cmd.requestBody || !(cmd.requestBody as RequestBodyObject).content || !(cmd.requestBody as RequestBodyObject).content['application/json']) {
		return;
	}
	if (!body) {
		return Promise.reject(Error('Missing Request Body'));
	}
	const content = (cmd.requestBody as RequestBodyObject).content['application/json'];
	if (!content) {
		return Promise.reject(Error('Unimplemented POST json schema'));
	}
	const schema = content.schema;
	if (!schema) {
		return Promise.reject(Error('Unimplemented POST schema'));
	}
	if (!content.validator) {
		content.validator = createJSONValidator(schema, {});
	}
	const result = await validateJSON(body, content.validator);
	if (result.errors.length > 0) {
		// console.error(schema, body, result.errors);
		return Promise.reject(Error(JSON.stringify(result.errors)));
	}
}

async function checkAOParameters(cmd: OperationObject, req: express.Request): Promise<void> {
	if (!cmd.parameters) {
		return;
	}
	let error: string | null = null;
	cmd.parameters.find(param => {
		param = param as ParameterObject;
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

export async function checkOpenApiParameters(name: string, req: express.Request, openapi: OpenAPIObject, forceMethod?: string): Promise<void> {
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
		await checkAOParameters(cmd, req);
	} else {
		await checkAORequestBody(cmd, req.body);
	}
}
