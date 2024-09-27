import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {ReturnTypeFunc, ValidateOptions} from '../../deco/definitions/types.js';
import {BaseBodyParams} from '../../deco/decorators/BodyParams.js';

export function BodyParams(): ParameterDecorator;
export function BodyParams(options: ValidateOptions): ParameterDecorator;
export function BodyParams(paramTypeFunction: ReturnTypeFunc, options?: ValidateOptions): ParameterDecorator;
export function BodyParams(paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions, maybeOptions?: ValidateOptions): ParameterDecorator {
	return BaseBodyParams(getMetadataStorage(), paramTypeFnOrOptions, maybeOptions)
}
