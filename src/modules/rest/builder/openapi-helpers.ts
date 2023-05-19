import {ReferenceObject, SchemaObject} from 'openapi3-ts/oas30';

export const exampleID = 'c0ffeec0-ffee-c0ff-eec0-ffeec0ffeec0';
export type Schemas = { [schema: string]: SchemaObject | ReferenceObject };
export type Property = (SchemaObject | ReferenceObject);
export type Properties = { [propertyName: string]: (SchemaObject | ReferenceObject) };
export const SCHEMA_JSON = '#/components/schemas/JSON';
export const SCHEMA_ID = '#/components/schemas/ID';
export * from 'openapi3-ts/oas30';
