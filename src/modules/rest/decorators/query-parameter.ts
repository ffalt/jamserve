import { ReturnTypeFunction } from '../../deco/definitions/types.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseQueryParameter, QueryParameterOptions } from '../../deco/decorators/base-query-parameter.js';

export function QueryParameter(name: string, options?: QueryParameterOptions): ParameterDecorator;
export function QueryParameter(name: string, returnTypeFunction: ReturnTypeFunction, options?: QueryParameterOptions): ParameterDecorator;
export function QueryParameter(name: string, returnTypeFunctionOrOptions?: ReturnTypeFunction | QueryParameterOptions, maybeOptions?: QueryParameterOptions): ParameterDecorator {
	return BaseQueryParameter(metadataStorage(), name, returnTypeFunctionOrOptions, maybeOptions);
}
