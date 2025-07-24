import { ParamMetadata } from './param-metadata.js';
import { FieldOptions, TypeOptions, TypeValueThunk } from './types.js';

export interface FieldMetadata {
	target: Function;
	schemaName: string;
	name: string;
	getType: TypeValueThunk;
	typeOptions: FieldOptions & TypeOptions;
	description: string | undefined;
	deprecationReason: string | undefined;
	params?: Array<ParamMetadata>;
	roles?: Array<string>;
	simple?: boolean;
}
