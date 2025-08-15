import { ControllerClassMetadata } from './controller-metadata.js';
import { ParameterMetadata } from './parameter-metadata.js';
import { AuthOptions, BinaryOptions, CustomPathParameterOptions, TypeOptions, TypeValueThunk } from './types.js';

export interface MethodMetadata extends CustomPathParameterOptions, BinaryOptions, AuthOptions {
	methodName: string;
	schemaName: string;
	target: Function;
	controllerClassMetadata?: ControllerClassMetadata;
	parameters: Array<ParameterMetadata>;
	getReturnType?: TypeValueThunk;
	returnTypeOptions?: TypeOptions;
	responseStringMimeTypes?: Array<string>;
	route?: string;
	description?: string;
	summary?: string;
	deprecationReason?: string;
	defaultReturnTypeFormat?: string;
	example: any;
	tags?: Array<string>;
}
