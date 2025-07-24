import { FieldMetadata } from './field-metadata.js';

export interface ClassMetadata {
	name: string;
	target: Function;
	fields: Array<FieldMetadata>;
	description?: string;
	isAbstract?: boolean;
}
