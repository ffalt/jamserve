import {DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions} from '../definitions/types';
import {getMetadataStorage} from '../metadata';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {getParamInfo} from '../helpers/params';
import {SymbolKeysNotSupportedError} from 'type-graphql';

export type PathParamOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function PathParam(name: string, options?: PathParamOptions): ParameterDecorator;
export function PathParam(
	name: string,
	returnTypeFunc: ReturnTypeFunc,
	options?: PathParamOptions,
): ParameterDecorator;
export function PathParam(
	name: string,
	returnTypeFuncOrOptions?: ReturnTypeFunc | PathParamOptions,
	maybeOptions?: PathParamOptions,
): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex) => {
		if (typeof propertyKey === 'symbol' || typeof propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		const {options, returnTypeFunc} = getTypeDecoratorParams(
			returnTypeFuncOrOptions,
			maybeOptions,
		);
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'arg',
			name,
			mode: 'path',
			propertyName: String(propertyKey),
			description: (options as PathParamOptions).description,
			example: (options as PathParamOptions).example,
			deprecationReason: (options as PathParamOptions).deprecationReason,
			...getParamInfo({prototype, propertyKey: propertyKey as string, parameterIndex, returnTypeFunc, options}),
		});
	};
}

