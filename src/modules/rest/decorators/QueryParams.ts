import {ReturnTypeFunc, ValidateOptions} from '../definitions/types.js';
import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {getTypeDecoratorParams} from '../helpers/decorators.js';
import {getParamInfo} from '../helpers/params.js';
import {extractPropertyName} from '../helpers/extract-property-name.js';
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
