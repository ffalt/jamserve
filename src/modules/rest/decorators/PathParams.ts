import {ReturnTypeFunc, ValidateOptions} from '../definitions/types';
import {getMetadataStorage} from '../metadata';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {getParamInfo} from '../helpers/params';
import {extractPropertyName} from '../helpers/extract-property-name';
import {SymbolKeysNotSupportedError} from 'type-graphql';

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
		if (typeof propertyKey === 'symbol' || typeof propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'args',
			mode: 'path',
			propertyName: extractPropertyName(prototype, propertyKey, parameterIndex),
			...getParamInfo({prototype, propertyKey: propertyKey as string, parameterIndex, returnTypeFunc, options}),
		});
	};
}
