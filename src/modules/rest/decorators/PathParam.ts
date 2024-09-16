import {DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions} from '../definitions/types.js';
import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {getTypeDecoratorParams} from '../helpers/decorators.js';
import {getParamInfo} from '../helpers/params.js';
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
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
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

