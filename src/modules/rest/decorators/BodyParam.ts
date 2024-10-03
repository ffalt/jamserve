import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {BaseBodyParam, BodyParamOptions} from '../../deco/decorators/BodyParam.js';
import {ReturnTypeFunc} from '../../deco/definitions/types.js';

export function BodyParam(name: string, options?: BodyParamOptions): ParameterDecorator;
export function BodyParam(name: string, returnTypeFunc: ReturnTypeFunc, options?: BodyParamOptions): ParameterDecorator;
export function BodyParam(name: string, returnTypeFuncOrOptions?: ReturnTypeFunc | BodyParamOptions, maybeOptions?: BodyParamOptions): ParameterDecorator {
	return BaseBodyParam(getMetadataStorage(), name, returnTypeFuncOrOptions, maybeOptions);
}
