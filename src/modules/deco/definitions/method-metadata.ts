import {ControllerClassMetadata} from './controller-metadata.js';
import {ParamMetadata} from './param-metadata.js';
import {AuthOptions, BinaryOptions, CustomPathParameterOptions, TypeOptions, TypeValueThunk} from './types.js';

export interface MethodMetadata extends CustomPathParameterOptions, BinaryOptions, AuthOptions {
	methodName: string;
	schemaName: string;
	target: Function;
	controllerClassMetadata?: ControllerClassMetadata;
	params: ParamMetadata[];
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
