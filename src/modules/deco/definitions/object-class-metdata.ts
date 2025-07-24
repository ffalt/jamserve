import { ClassMetadata } from './class-metadata.js';

export interface ResultClassMetadata extends ClassMetadata {
	interfaceClasses: Array<Function> | undefined;
}
