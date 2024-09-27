import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {ReturnTypeFunc, ValidateOptions} from '../../deco/definitions/types.js';
import {BaseQueryParams} from '../../deco/decorators/QueryParams.js';

export function SubsonicParams(): ParameterDecorator;
export function SubsonicParams(options: ValidateOptions): ParameterDecorator;
export function SubsonicParams(paramTypeFunction: ReturnTypeFunc, options?: ValidateOptions): ParameterDecorator;
export function SubsonicParams(paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions, maybeOptions?: ValidateOptions): ParameterDecorator {
	return BaseQueryParams(getMetadataStorage(), paramTypeFnOrOptions, maybeOptions);
}
