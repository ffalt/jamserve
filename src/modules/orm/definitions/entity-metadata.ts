import { PropertyMetadata } from './property-metadata.js';

export interface EntityMetadata {
	name: string;
	target: Function;
	fields: PropertyMetadata[];
	isAbstract?: boolean;
}
