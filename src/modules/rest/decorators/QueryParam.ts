import {ReturnTypeFunc} from '../../deco/definitions/types.js';
import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {BaseQueryParam, QueryParamOptions} from '../../deco/decorators/QueryParam.js';

export function QueryParam(name: string, options?: QueryParamOptions): ParameterDecorator;
export function QueryParam(name: string, returnTypeFunc: ReturnTypeFunc, options?: QueryParamOptions): ParameterDecorator;
export function QueryParam(name: string, returnTypeFuncOrOptions?: ReturnTypeFunc | QueryParamOptions, maybeOptions?: QueryParamOptions): ParameterDecorator {
	return BaseQueryParam(getMetadataStorage(), name, returnTypeFuncOrOptions, maybeOptions);
}
