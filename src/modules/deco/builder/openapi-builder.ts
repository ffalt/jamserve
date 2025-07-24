import { MethodMetadata } from '../definitions/method-metadata.js';
import { Errors } from '../express/express-error.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';
import {
	SCHEMA_ID, Schemas, ContentObject, OpenAPIObject, ParameterObject, ReferenceObject,
	ResponsesObject, RequestBodyObject, SchemaObject, PathItemObject
} from './openapi-helpers.js';
import { OpenApiRefBuilder } from './openapi-refs.js';
import { ClassType } from 'type-graphql';

type ErrorResponseType = ClassType<any> | Function | object | symbol;

export abstract class BaseOpenApiBuilder {
	refsBuilder: OpenApiRefBuilder;

	constructor(public metadata: MetadataStorage) {
		this.refsBuilder = new OpenApiRefBuilder(this.metadata);
	}

	protected fillErrorResponses(method: MethodMetadata, parameters: Array<ParameterObject>, roles: Array<string>, responses: ResponsesObject): void {
		if (parameters.length > 0) {
			responses['422'] = { description: Errors.invalidParameter };
			if (parameters.some(p => p.required)) {
				responses['400'] = { description: Errors.missingParameter };
			}
		}
		if (parameters.some(p => {
			return (p.schema as ReferenceObject)?.$ref === SCHEMA_ID || (((p.schema as SchemaObject)?.items || {}) as ReferenceObject).$ref === SCHEMA_ID;
		})) {
			responses['404'] = { description: Errors.itemNotFound };
		}
		if (roles.length > 0) {
			responses['401'] = { description: Errors.unauthorized };
		}
	}

	abstract fillFormatResponses(type: ErrorResponseType, method: MethodMetadata, schemas: Schemas, responses: ResponsesObject): void;

	protected buildResponses(method: MethodMetadata, parameters: Array<ParameterObject>, roles: Array<string>, schemas: Schemas): ResponsesObject {
		const responses: ResponsesObject = {};
		if (method.binary) {
			this.fillBinaryResponses(method.binary, responses);
		} else if (method.getReturnType?.()) {
			const type = method.getReturnType();
			if (type === String) {
				this.fillStringResponse(method, responses);
			} else {
				this.fillFormatResponses(type, method, schemas, responses);
			}
		} else {
			responses['200'] = { description: 'ok' };
		}
		this.fillErrorResponses(method, parameters, roles, responses);
		return responses;
	}

	protected fillXMLResponses(type: ClassType<any> | Function | object | symbol, method: MethodMetadata, schemas: Schemas, responses: ResponsesObject) {
		const content: ContentObject = {};
		let schema: SchemaObject | ReferenceObject = { $ref: this.refsBuilder.getResultRef(type, method.methodName, schemas) };
		if (method.returnTypeOptions?.array) {
			schema = { type: 'array', items: schema };
		}
		content['application/xml'] = { schema };
		responses['200'] = { description: 'xml data', content };
	}

	protected fillJSONResponses(type: ClassType<any> | Function | object | symbol, method: MethodMetadata, schemas: Schemas, responses: ResponsesObject) {
		const content: ContentObject = {};
		let schema: SchemaObject | ReferenceObject = { $ref: this.refsBuilder.getResultRef(type, method.methodName, schemas) };
		if (method.returnTypeOptions?.array) {
			schema = { type: 'array', items: schema };
		}
		content['application/json'] = { schema };
		responses['200'] = { description: 'json data', content };
	}

	protected fillStringResponse(method: MethodMetadata, responses: ResponsesObject): void {
		const content: ContentObject = {};
		const mimeTypes = (method.responseStringMimeTypes || ['text/plain']);
		for (const mime of mimeTypes) content[mime] = { schema: { type: 'string' } };
		responses['200'] = { description: 'string data', content };
	}

	protected fillBinaryResponses(binary: Array<string>, responses: ResponsesObject): void {
		const content: ContentObject = {};
		for (const mime of binary) content[mime] = { schema: { type: 'string', format: 'binary' } };
		responses['200'] = { description: 'binary data', content };
	}

	protected buildRequestBody(method: MethodMetadata, schemas: Schemas): RequestBodyObject | undefined {
		const params = method.params;
		const refs: Array<SchemaObject | ReferenceObject> = [];
		let isJson = true;
		for (const param of params) {
			if (param.kind === 'args' && param.mode === 'body') {
				refs.push({ $ref: this.refsBuilder.getParamRef(param.getType(), param.methodName, schemas) });
			} else if (param.kind === 'arg' && param.mode === 'body') {
				const schema = this.refsBuilder.buildParameterSchema(param, schemas);
				refs.push({ properties: { [param.name]: schema }, description: param.description, required: [param.name] });
			} else if (param.kind === 'arg' && param.mode === 'file') {
				isJson = false;
				refs.push(this.refsBuilder.buildUploadSchema(param, schemas));
			}
		}
		if (refs.length > 0) {
			return {
				required: true,
				content: { [isJson ? 'application/json' : 'multipart/form-data']: { schema: refs.length === 1 ? refs[0] : { allOf: refs } } }
			};
		}
		return;
	}

	protected static getTags(p: PathItemObject): Array<string> | undefined {
		if (p.get) {
			return p.get.tags;
		}
		if (p.post) {
			return p.post.tags;
		}
		if (p.put) {
			return p.put.tags;
		}
		if (p.patch) {
			return p.patch.tags;
		}
		return;
	}

	protected abstract buildPaths(schemas: Schemas, openapi: OpenAPIObject): void;

	build(openapi: OpenAPIObject, schemas: Schemas): OpenAPIObject {
		this.buildPaths(schemas, openapi);
		openapi.components = { schemas, securitySchemes: openapi.components?.securitySchemes };
		return openapi;
	}
}
