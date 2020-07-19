import {ReturnTypeFunc, ValidateOptions} from './types';
import {getMetadataStorage} from '../metadata';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {getParamInfo} from '../helpers/params';
import {extractPropertyName} from '../helpers/extract-property-name';

export function PathParams(): ParameterDecorator;
export function PathParams(options: ValidateOptions): ParameterDecorator;
export function PathParams(
	paramTypeFunction: ReturnTypeFunc,
	options?: ValidateOptions,
): ParameterDecorator;

export function PathParams(
	paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions,
	maybeOptions?: ValidateOptions,
): ParameterDecorator {
	const {options, returnTypeFunc} = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
	return (prototype, propertyKey, parameterIndex) => {
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'args',
			mode: 'path',
			propertyName: extractPropertyName(prototype, propertyKey, parameterIndex),
			...getParamInfo({prototype, propertyKey, parameterIndex, returnTypeFunc, options}),
		});
	};
}
