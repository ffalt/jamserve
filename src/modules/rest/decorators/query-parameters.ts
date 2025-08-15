import { ReturnTypeFunction, ValidateOptions } from '../../deco/definitions/types.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseQueryParameters } from '../../deco/decorators/base-query-parameters.js';

export function QueryParameters(): ParameterDecorator;
export function QueryParameters(options: ValidateOptions): ParameterDecorator;
export function QueryParameters(parameterTypeFunction: ReturnTypeFunction, options?: ValidateOptions): ParameterDecorator;
export function QueryParameters(parameterTypeFunctionOrOptions?: ReturnTypeFunction | ValidateOptions, maybeOptions?: ValidateOptions): ParameterDecorator {
	return BaseQueryParameters(metadataStorage(), parameterTypeFunctionOrOptions, maybeOptions);
}
