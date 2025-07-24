import { ReferenceObject, SchemaObject } from 'openapi3-ts/oas30';
export const exampleID = 'c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0';
export const exampleIDInt = '12345';
export type Schemas = Record<string, SchemaObject | ReferenceObject>;
export type Property = (SchemaObject | ReferenceObject);
export type Properties = Record<string, SchemaObject | ReferenceObject>;
export const SCHEMA_JSON = '#/components/schemas/JSON';
export const SCHEMA_ID = '#/components/schemas/ID';
export {
	RequestBodyObject, ResponsesObject, PathItemObject, ParameterLocation, PathsObject,
	OperationObject, ParameterObject, SchemaObject,
	ContentObject, ReferenceObject, OpenAPIObject
} from 'openapi3-ts/oas30';
