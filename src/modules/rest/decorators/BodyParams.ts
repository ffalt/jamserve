import {getMetadataStorage} from '../metadata';
import {ReturnTypeFunc, ValidateOptions} from '../definitions/types';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {getParamInfo} from '../helpers/params';

export function BodyParams(): ParameterDecorator;
export function BodyParams(options: ValidateOptions): ParameterDecorator;
export function BodyParams(
	paramTypeFunction: ReturnTypeFunc,
	options?: ValidateOptions,
): ParameterDecorator;
export function BodyParams(
	paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions,
	maybeOptions?: ValidateOptions,
): ParameterDecorator {
	const {options, returnTypeFunc} = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
	return (prototype, propertyKey, parameterIndex): void => {
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'args',
			mode: 'body',
			propertyName: String(propertyKey),
			...getParamInfo({prototype, propertyKey, parameterIndex, returnTypeFunc, options}),
		});
	};
}
