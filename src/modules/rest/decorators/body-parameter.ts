import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseBodyParameter, BodyParameterOptions } from '../../deco/decorators/base-body-parameter.js';
import { ReturnTypeFunction } from '../../deco/definitions/types.js';

export function BodyParameter(name: string, options?: BodyParameterOptions): ParameterDecorator;
export function BodyParameter(name: string, returnTypeFunction: ReturnTypeFunction, options?: BodyParameterOptions): ParameterDecorator;
export function BodyParameter(name: string, returnTypeFunctionOrOptions?: ReturnTypeFunction | BodyParameterOptions, maybeOptions?: BodyParameterOptions): ParameterDecorator {
	return BaseBodyParameter(metadataStorage(), name, returnTypeFunctionOrOptions, maybeOptions);
}
