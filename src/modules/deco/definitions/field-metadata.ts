import { ParameterMetadata } from './parameter-metadata.js';
import { FieldOptions, TypeOptions, TypeValueThunk } from './types.js';

export interface FieldMetadata {
	target: Function;
	schemaName: string;
	name: string;
	getType: TypeValueThunk;
	typeOptions: FieldOptions & TypeOptions;
	description: string | undefined;
	deprecationReason: string | undefined;
	params?: Array<ParameterMetadata>;
	roles?: Array<string>;
	simple?: boolean;
}
