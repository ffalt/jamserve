import { metadataStorage } from '../metadata/metadata-storage.js';
import { ReturnTypeFunction, ValidateOptions } from '../../deco/definitions/types.js';
import { BaseQueryParameters } from '../../deco/decorators/base-query-parameters.js';

export function SubsonicParameters(): ParameterDecorator;
export function SubsonicParameters(options: ValidateOptions): ParameterDecorator;
export function SubsonicParameters(parameterTypeFunction: ReturnTypeFunction, options?: ValidateOptions): ParameterDecorator;
export function SubsonicParameters(parameterTypeFunctionOrOptions?: ReturnTypeFunction | ValidateOptions, maybeOptions?: ValidateOptions): ParameterDecorator {
	return BaseQueryParameters(metadataStorage(), parameterTypeFunctionOrOptions, maybeOptions);
}
