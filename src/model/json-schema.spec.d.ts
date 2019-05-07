export declare type PrimitiveType = number | boolean | string | null;

export declare interface JSONSchemaDefinition {
	$ref?: string;
	$schema?: string;
	$id?: string;
	description?: string;
	examples?: Array<any>;
	allOf?: Array<JSONSchemaDefinition>;
	oneOf?: Array<JSONSchemaDefinition>;
	anyOf?: Array<JSONSchemaDefinition>;
	title?: string;
	type?: string | Array<string>;
	definitions?: {
		[key: string]: any;
	};
	format?: string;
	items?: JSONSchemaDefinition | Array<JSONSchemaDefinition>;
	minItems?: number;
	additionalItems?: {
		anyOf: Array<JSONSchemaDefinition>;
	} | JSONSchemaDefinition;
	enum?: Array<PrimitiveType> | Array<JSONSchemaDefinition>;
	default?: PrimitiveType | object;
	additionalProperties?: JSONSchemaDefinition | boolean;
	required?: Array<string>;
	propertyOrder?: Array<string>;
	properties?: {
		[key: string]: any;
	};
	defaultProperties?: Array<string>;
	patternProperties?: {
		[pattern: string]: JSONSchemaDefinition;
	};
	typeof?: 'function';
}
