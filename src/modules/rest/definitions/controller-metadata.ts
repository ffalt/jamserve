import {ParamMetadata} from './param-metadata';
import {ClassTypeResolver, TypeOptions, TypeValueThunk} from './types';

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
