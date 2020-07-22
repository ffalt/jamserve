import {PropertyMetadata} from './property-metadata';

export interface EntityMetadata {
	name: string;
	target: Function;
	fields: PropertyMetadata[];
	isAbstract?: boolean;
}
