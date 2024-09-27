import {ReturnTypeFunc} from '../../deco/definitions/types.js';
import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {BasePathParam, PathParamOptions} from '../../deco/decorators/PathParam.js';

export function PathParam(name: string, options?: PathParamOptions): ParameterDecorator;
export function PathParam(name: string, returnTypeFunc: ReturnTypeFunc, options?: PathParamOptions): ParameterDecorator;
export function PathParam(name: string, returnTypeFuncOrOptions?: ReturnTypeFunc | PathParamOptions, maybeOptions?: PathParamOptions): ParameterDecorator {
	return BasePathParam(getMetadataStorage(), name, returnTypeFuncOrOptions, maybeOptions)
}

