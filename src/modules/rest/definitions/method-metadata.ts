import {ControllerClassMetadata} from './controller-metadata';
import {ParamMetadata} from './param-metadata';
import {DirectiveMetadata} from './directive-metadata';
import {AuthOptions, BinaryOptions, CustomPathParameterOptions, TypeOptions, TypeValueThunk} from '../decorators/types';

export interface MethodMetadata extends CustomPathParameterOptions, BinaryOptions, AuthOptions {
	methodName: string;
	schemaName: string;
	target: Function;
	controllerClassMetadata?: ControllerClassMetadata;
	params: ParamMetadata[];
	directives?: DirectiveMetadata[];
	getReturnType?: TypeValueThunk;
	returnTypeOptions?: TypeOptions;
	responseStringMimeTypes?: string[];
	route?: string;
	description?: string;
	summary?: string;
	deprecationReason?: string;
	example: any;
	tags?: string[];
}
