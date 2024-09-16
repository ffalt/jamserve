import {ParamMetadata} from './param-metadata.js';

export interface BaseControllerMetadata {
	methodName: string;
	schemaName: string;
	target: Function;
	controllerClassMetadata?: ControllerClassMetadata;
	params?: ParamMetadata[];
	roles?: string[];
}

export interface ControllerClassMetadata {
	target: Function;
	name: string;
	abstract?: boolean;
	description?: string;
	roles?: Array<string>;
	tags?: Array<string>;
	deprecationReason?: string;
	route: string;
}
