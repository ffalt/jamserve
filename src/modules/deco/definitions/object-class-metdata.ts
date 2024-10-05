import { ClassMetadata } from './class-metadata.js';

export interface ResultClassMetadata extends ClassMetadata {
	interfaceClasses: Function[] | undefined;
}
