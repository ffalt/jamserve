import express from 'express';
import {ComponentsObject, OpenAPIObject, OperationObject, ParameterObject, RequestBodyObject, SchemaObject} from '../model/openapi-spec';
import {logger} from './logger';
import {jsonValidator, JSONValidator, validateJSON} from './validate-json';

const log = logger('CheckApiParameters');

class Validator {

	static validateBooleanParameter(query: any, param: { name: string; required?: boolean }, value: any): string | undefined {
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

	static validateNumberParameter(query: any, param: { name: string; required?: boolean }, value: any, schema: SchemaObject): string | undefined {
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

	static validateStringParameter(query: any, param: { name: string; required?: boolean }, value: any, schema: SchemaObject): string | undefined {
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

	static validateArrayParameter(query: any, param: { name: string; required?: boolean }, value: any, schema: SchemaObject): string | undefined {
		const items = (schema.items || {type: 'unknown'}) as SchemaObject;
		const listValues = ((Array.isArray(value) ? value : [value]) || []);
		if (param.required && listValues.length === 0) {
			return `Missing required parameter ${param.name}`;
		}
		query[param.name] = listValues;
		for (const listValue of listValues) {
			const result = Validator.validOAParameterValueBySchema({}, {name: param.name, required: true}, listValue, items);
			if (result) {
				return result;
			}
		}
	}

	static validateAnyOfParameter(query: any, param: { name: string; required?: boolean }, value: any, schema: SchemaObject): string | undefined {
		const results: Array<string> = [];
		for (const entry of (schema.anyOf || [])) {
			const res = Validator.validOAParameterValueBySchema(query, param, value, entry);
			if (!res) {
				return;
			}
			results.push(res);
		}
		return results.join('/');
	}

	static validOAParameterValueBySchema(query: any, param: { name: string; required?: boolean }, value: any, schema: SchemaObject): string | undefined {
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
		if (schema.anyOf) {
			return Validator.validateAnyOfParameter(query, param, value, schema);
		}
		// sanitize & check string parameter type
		switch (schema.type) {
			case 'boolean':
				return Validator.validateBooleanParameter(query, param, value);
			case 'string':
				return Validator.validateStringParameter(query, param, value, schema);
			case 'array':
				return Validator.validateArrayParameter(query, param, value, schema);
			case 'float':
			case 'long':
			case 'double':
			case 'number':
			case 'integer':
				return Validator.validateNumberParameter(query, param, value, schema);
			default:
				log.debug(`Unknown schema type ${JSON.stringify(schema)}`);
		}
	}

	static validOAParameter(query: any, param: ParameterObject, components: ComponentsObject): string | undefined {
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
		return Validator.validOAParameterValueBySchema(query, param, query[param.name], schema as SchemaObject);
	}

	static createJSONValidator(def: SchemaObject, components: ComponentsObject): JSONValidator {
		const specialSchema = {...def};
		specialSchema.components = components;
		return jsonValidator(specialSchema);
	}

	static async checkAORequestBody(cmd: OperationObject, body: any, components: ComponentsObject): Promise<void> {
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
			content.validator = Validator.createJSONValidator(schema, components);
		}
		const result = await validateJSON(body, content.validator);
		if (result.errors.length > 0) {
			// console.error(schema, body, result.errors);
			return Promise.reject(Error(JSON.stringify(result.errors)));
		}
	}

	static async checkAOParameters(cmd: OperationObject, req: express.Request, components: ComponentsObject): Promise<void> {
		if (!cmd.parameters) {
			return;
		}
		let error: string | undefined;
		cmd.parameters.find(param => {
			param = param as ParameterObject;
			if (param.in === 'query') {
				error = Validator.validOAParameter(req.query, param, components);
			} else if (param.in === 'path') {
				error = Validator.validOAParameter(req.params, param, components);
			} else if (param.in === 'header') {
				error = Validator.validOAParameter(req.headers, param, components);
			} else if (param.in === 'cookie') {
				error = Validator.validOAParameter(req.cookies, param, components);
			} else {
				log.info('Invalid/Unknown parameter spec', param);
			}
			return !!error;
		});
		if (error) {
			return Promise.reject(Error(error));
		}
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
		await Validator.checkAOParameters(cmd, req, openapi.components as ComponentsObject);
	} else {
		await Validator.checkAORequestBody(cmd, req.body, openapi.components as ComponentsObject);
	}
}
