import { metadataStorage } from '../metadata/metadata-storage.js';
import { ReturnTypeFunction, ValidateOptions } from '../../deco/definitions/types.js';
import { BaseBodyParameters } from '../../deco/decorators/base-body-parameters.js';

export function BodyParameters(): ParameterDecorator;
export function BodyParameters(options: ValidateOptions): ParameterDecorator;
export function BodyParameters(parameterTypeFunction: ReturnTypeFunction, options?: ValidateOptions): ParameterDecorator;
export function BodyParameters(parameterTypeFunctionOrOptions?: ReturnTypeFunction | ValidateOptions, maybeOptions?: ValidateOptions): ParameterDecorator {
	return BaseBodyParameters(metadataStorage(), parameterTypeFunctionOrOptions, maybeOptions);
}
