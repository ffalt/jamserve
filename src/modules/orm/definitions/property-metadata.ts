import {FieldOptions, TypeOptions, TypeValueThunk} from './types';
import {EntityMetadata} from './entity-metadata';

export interface PropertyMetadata {
	target: Function;
	name: string;
	getType: TypeValueThunk;
	isRelation?: boolean;
	linkedEntity?: EntityMetadata;
	typeOptions: FieldOptions & TypeOptions;
}
