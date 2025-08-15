import { ReturnTypeFunction } from '../../deco/definitions/types.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { BasePathParameter, PathParameterOptions } from '../../deco/decorators/base-path-parameter.js';

export function PathParameter(name: string, options?: PathParameterOptions): ParameterDecorator;
export function PathParameter(name: string, returnTypeFunction: ReturnTypeFunction, options?: PathParameterOptions): ParameterDecorator;
export function PathParameter(name: string, returnTypeFunctionOrOptions?: ReturnTypeFunction | PathParameterOptions, maybeOptions?: PathParameterOptions): ParameterDecorator {
	return BasePathParameter(metadataStorage(), name, returnTypeFunctionOrOptions, maybeOptions);
}
