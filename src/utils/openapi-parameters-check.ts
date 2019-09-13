import express from 'express';
import {ComponentsObject, OpenAPIObject, OperationObject, ParameterObject, RequestBodyObject, SchemaObject} from '../model/openapi-spec';
import {logger} from './logger';
import {jsonValidator, JSONValidator, validateJSON} from './validate-json';

const log = logger('CheckApiParameters');

function validateBooleanParameter(query: any, param: { name: string, required?: boolean }, value: any): string | undefined {
	if (['true', 'yes', '1'].includes(value.toString())) {
		query[param.name] = true;
		value = true;
	} else if (['false', 'no', '0'].includes(value.toString())) {
		query[param.name] = false;
		value = false;
	} else {
		return `Invalid boolean parameter ${param.name}`;
	}
	query[param.name] = value;
}

function validateNumberParameter(query: any, param: { name: string, required?: boolean }, value: any, schema: SchemaObject): string | undefined {
	const s = value.toString().trim();
	if (s.length === 0) {
		return `Empty number parameter ${param.name}`;
	}
	const num = Number(s);
	if (isNaN(num)) {
		return `Invalid number parameter ${param.name}`;
	}
	query[param.name] = num;
	if (schema.type === 'integer' && !Number.isInteger(num)) {
		return `Invalid integer parameter ${param.name}`;
	}
	if (schema.minimum !== undefined && schema.minimum > num) {
		return `Invalid number parameter ${param.name}; minimum is ${schema.minimum}`;
	}
	if (schema.maximum !== undefined && schema.maximum < num) {
		return `Invalid number parameter ${param.name}; maximum is ${schema.maximum}`;
	}
}

function validateStringParameter(query: any, param: { name: string, required?: boolean }, value: any, schema: SchemaObject): string | undefined {
	if (typeof value !== 'string') {
		return `Invalid string parameter ${param.name}`;
	}
	const s = value.trim();
	query[param.name] = s;
	if (s.length === 0) {
		return `Empty string parameter ${param.name}`;
	}
	if (schema.enum) {
		if (!schema.enum.includes(s)) {
			return `Invalid enum string parameter ${param.name}: ${s}`;
		}
	}
}

function validateArrayParameter(query: any, param: { name: string, required?: boolean }, value: any, schema: SchemaObject): string | undefined {
	const items = (schema.items || {type: 'unknown'}) as SchemaObject;
	const listValues = ((Array.isArray(value) ? value : [value]) || []);
	if (param.required && listValues.length === 0) {
		return `Missing required parameter ${param.name}`;
	}
	query[param.name] = listValues;
	for (const listValue of listValues) {
		const result = validOAParameterValueBySchema({}, {name: param.name, required: true}, listValue, items);
		if (result) {
			return result;
		}
	}
}

function validOAParameterValueBySchema(query: any, param: { name: string, required?: boolean }, value: any, schema: SchemaObject): string | undefined {
	if (value === undefined || value === null) {
		if (schema && schema.default !== undefined) {
			query[param.name] = schema.default;
			value = schema.default;
		}
	}
	// check required?
	if (value === undefined || value === null) {
		if (param.required) {
			return `Missing required parameter ${param.name}`;
		}
		return;
	}
	// sanitize & check string parameter type
	switch (schema.type) {
		case 'boolean':
			return validateBooleanParameter(query, param, value);
		case 'string':
			return validateStringParameter(query, param, value, schema);
		case 'array':
			return validateArrayParameter(query, param, value, schema);
		case 'float':
		case 'long':
		case 'double':
		case 'number':
		case 'integer':
			return validateNumberParameter(query, param, value, schema);
		default:
			log.debug(`Unknown schema type ${schema.type}`);
	}
}

function validOAParameter(query: any, param: ParameterObject, components: ComponentsObject): string | undefined {
	if (!query) {
		return `Missing parameter collection ${param.name}`;
	}
	let schema = param.schema;
	if (schema && schema.$ref) {
		const name = schema.$ref.split('/').pop();
		if (!components.schemas) {
			throw new Error('Invalid Internal Server Data');
		}
		schema = components.schemas[name];
	}
	return validOAParameterValueBySchema(query, param, query[param.name], schema as SchemaObject);
}

function createJSONValidator(def: SchemaObject, components: ComponentsObject): JSONValidator {
	const specialSchema = {...def};
	specialSchema.components = components;
	return jsonValidator(specialSchema);
}

async function checkAORequestBody(cmd: OperationObject, body: any, components: ComponentsObject): Promise<void> {
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
		content.validator = createJSONValidator(schema, components);
	}
	const result = await validateJSON(body, content.validator);
	if (result.errors.length > 0) {
		// console.error(schema, body, result.errors);
		return Promise.reject(Error(JSON.stringify(result.errors)));
	}
}

async function checkAOParameters(cmd: OperationObject, req: express.Request, components: ComponentsObject): Promise<void> {
	if (!cmd.parameters) {
		return;
	}
	let error: string | undefined;
	cmd.parameters.find(param => {
		param = param as ParameterObject;
		if (param.in === 'query') {
			error = validOAParameter(req.query, param, components);
		} else if (param.in === 'path') {
			error = validOAParameter(req.params, param, components);
		} else if (param.in === 'header') {
			error = validOAParameter(req.headers, param, components);
		} else if (param.in === 'cookie') {
			error = validOAParameter(req.cookies, param, components);
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
		log.info(`cmd method ${req.method} not found to validate`, req.path);
		return;
	}
	if (method === 'get') {
		await checkAOParameters(cmd, req, openapi.components as ComponentsObject);
	} else {
		await checkAORequestBody(cmd, req.body, openapi.components as ComponentsObject);
	}
}
