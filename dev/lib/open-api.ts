import {ContentObject, MediaTypeObject, OpenAPIObject, ParameterObject, ResponseObject, SchemaObject} from '../../src/model/openapi-spec';
import {ApiCall} from './api-calls';
import {Definition, Definitions} from './json-schema';

export function collectSchema(p: Definition, definitions: Definitions, openapi: OpenAPIObject): void {
	if (p.$ref) {
		delete p.description;
		const proptype = p.$ref.split('/')[2];
		const pr = definitions[proptype];
		if (openapi.components && openapi.components.schemas && !openapi.components.schemas[proptype]) {
			openapi.components.schemas[proptype] = pr as SchemaObject;
			if (!pr) {
				console.error('Missing property type', proptype, p, pr);
			}
			if (pr && pr.properties) {
				for (const key of Object.keys(pr.properties)) {
					collectSchema(pr.properties[key], definitions, openapi);
				}
			}
		}
	} else if (p.items) {
		collectSchema(p.items, definitions, openapi);
	} else if (p.additionalProperties) {
		collectSchema(p.additionalProperties, definitions, openapi);
	} else if (p.properties) {
		for (const key of Object.keys(p.properties)) {
			collectSchema(p.properties[key], definitions, openapi);
		}
	}
}

export function collectParams(p: Definition, definitions: Definitions, inPart: string, openapi: OpenAPIObject): Array<ParameterObject> {
	if (!p.$ref) {
		console.error('no reference', p);
		return [];
	}
	const proptype = p.$ref.split('/')[2];
	p = definitions[proptype];
	if (!p.properties) {
		return [];
	}
	const result: Array<any> = [];
	for (const key of Object.keys(p.properties)) {
		const prop = {...p.properties[key]};
		const description = prop.description;
		delete prop.description;
		if (prop.$ref) {
			const ptype = prop.$ref.split('/')[2];
			if (openapi.components && openapi.components.schemas && !openapi.components.schemas[ptype]) {
				openapi.components.schemas[ptype] = definitions[ptype] as SchemaObject;
			}
		}
		result.push({
			in: inPart,
			name: key,
			schema: prop,
			description,
			required: (inPart === 'path') || ((p.required || []).includes(key))
		});
	}
	return result;
}

export async function listToObject<T, U, Y extends { [name: string]: U }>(list: Array<T>, transform: (item: T) => Promise<{ key: string; value: U }>, obj: Y): Promise<Y> {
	const result: { [name: string]: U } = obj;
	for (const item of list) {
		const {key, value} = await transform(item);
		result[key] = value;
	}
	return result as Y;
}

export async function buildOpenApiParameters(call: ApiCall, openapi: OpenAPIObject): Promise<Array<ParameterObject> | undefined> {
	let parameters: Array<ParameterObject> = [];
	if (call.paramSchema) {
		parameters = collectParams(call.paramSchema, call.definitions, 'query', openapi);
	}
	if (call.pathParamsSchema) {
		const pathParams = collectParams(call.pathParamsSchema, call.definitions, 'path', openapi);
		parameters = parameters.concat(pathParams);
	}
	return parameters.length > 0 ? parameters : undefined;
}

export async function buildBinaryResponse(binaryResult: Array<string>): Promise<ResponseObject> {
	return {
		description: 'binary data',
		content: await listToObject<string, MediaTypeObject, ContentObject>(binaryResult, async item => ({key: item, value: {schema: {type: 'string', format: 'binary'}}}), {})
	};
}
