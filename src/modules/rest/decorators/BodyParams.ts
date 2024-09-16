import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {ReturnTypeFunc, ValidateOptions} from '../definitions/types.js';
import {getTypeDecoratorParams} from '../helpers/decorators.js';
import {getParamInfo} from '../helpers/params.js';
import {SymbolKeysNotSupportedError} from 'type-graphql';

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
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'args',
			mode: 'body',
			propertyName: String(propertyKey),
			...getParamInfo({prototype, propertyKey: propertyKey as string, parameterIndex, returnTypeFunc, options}),
		});
	};
}
