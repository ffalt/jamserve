import {ReturnTypeFunc, ValidateOptions} from '../definitions/types';
import {getMetadataStorage} from '../metadata';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {getParamInfo} from '../helpers/params';
import {extractPropertyName} from '../helpers/extract-property-name';
import {SymbolKeysNotSupportedError} from 'type-graphql';

export function QueryParams(): ParameterDecorator;
export function QueryParams(options: ValidateOptions): ParameterDecorator;
export function QueryParams(
	paramTypeFunction: ReturnTypeFunc,
	options?: ValidateOptions,
): ParameterDecorator;
export function QueryParams(
	paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions,
	maybeOptions?: ValidateOptions,
): ParameterDecorator {
	const {options, returnTypeFunc} = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
	return (prototype, propertyKey, parameterIndex) => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'args',
			mode: 'query',
			propertyName: extractPropertyName(prototype, propertyKey, parameterIndex),
			...getParamInfo({prototype, propertyKey: propertyKey as string, parameterIndex, returnTypeFunc, options}),
		});
	};
}
