import {FieldMetadata} from './field-metadata.js';

export interface ClassMetadata {
	name: string;
	target: Function;
	fields: FieldMetadata[];
	description?: string;
	isAbstract?: boolean;
}
