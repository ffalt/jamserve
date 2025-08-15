import { ReturnTypeFunction, ValidateOptions } from '../../deco/definitions/types.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { BasePathParameters } from '../../deco/decorators/base-path-parameters.js';

export function PathParameters(): ParameterDecorator;
export function PathParameters(options: ValidateOptions): ParameterDecorator;
export function PathParameters(parameterTypeFunction: ReturnTypeFunction, options?: ValidateOptions): ParameterDecorator;
export function PathParameters(parameterTypeFunctionOrOptions?: ReturnTypeFunction | ValidateOptions, maybeOptions?: ValidateOptions): ParameterDecorator {
	return BasePathParameters(metadataStorage(), parameterTypeFunctionOrOptions, maybeOptions);
}
