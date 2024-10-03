import { ReturnTypeFunc, ValidateOptions } from '../../deco/definitions/types.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BasePathParams } from '../../deco/decorators/PathParams.js';

export function PathParams(): ParameterDecorator;
export function PathParams(options: ValidateOptions): ParameterDecorator;
export function PathParams(paramTypeFunction: ReturnTypeFunc, options?: ValidateOptions): ParameterDecorator;
export function PathParams(paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions, maybeOptions?: ValidateOptions): ParameterDecorator {
	return BasePathParams(getMetadataStorage(), paramTypeFnOrOptions, maybeOptions);
}
