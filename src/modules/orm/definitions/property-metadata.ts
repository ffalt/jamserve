import { FieldOptions, TypeOptions, TypeValueThunk } from './types.js';
import { EntityMetadata } from './entity-metadata.js';

export interface PropertyMetadata {
	target: Function;
	name: string;
	getType: TypeValueThunk;
	isRelation?: boolean;
	linkedEntity?: EntityMetadata;
	typeOptions: FieldOptions & TypeOptions;
}
