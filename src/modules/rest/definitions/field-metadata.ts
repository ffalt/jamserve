import {ParamMetadata} from './param-metadata';
import {DirectiveMetadata} from './directive-metadata';
import {FieldOptions, TypeOptions, TypeValueThunk} from '../decorators/types';

export interface FieldMetadata {
	target: Function;
	schemaName: string;
	name: string;
	getType: TypeValueThunk;
	typeOptions: FieldOptions & TypeOptions;
	description: string | undefined;
	deprecationReason: string | undefined;
	params?: ParamMetadata[];
	roles?: string[];
	directives?: DirectiveMetadata[];
	simple?: boolean;
}
