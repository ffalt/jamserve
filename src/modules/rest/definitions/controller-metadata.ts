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

export interface FieldResolverMetadata extends BaseControllerMetadata {
	kind: 'internal' | 'external';
	description?: string;
	deprecationReason?: string;
	getType?: TypeValueThunk;
	typeOptions?: TypeOptions;
	getObjectType?: ClassTypeResolver;
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
