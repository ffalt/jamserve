import { ReturnTypeFunc, ValidateOptions } from '../../deco/definitions/types.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseQueryParams } from '../../deco/decorators/QueryParams.js';

export function QueryParams(): ParameterDecorator;
export function QueryParams(options: ValidateOptions): ParameterDecorator;
export function QueryParams(paramTypeFunction: ReturnTypeFunc, options?: ValidateOptions): ParameterDecorator;
export function QueryParams(paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions, maybeOptions?: ValidateOptions): ParameterDecorator {
	return BaseQueryParams(getMetadataStorage(), paramTypeFnOrOptions, maybeOptions);
}
