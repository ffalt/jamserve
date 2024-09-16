import {DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions} from '../definitions/types.js';
import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {getTypeDecoratorParams} from '../helpers/decorators.js';
import {getParamInfo} from '../helpers/params.js';
import {SymbolKeysNotSupportedError} from 'type-graphql';

export type QueryParamOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function QueryParam(name: string, options?: QueryParamOptions): ParameterDecorator;
export function QueryParam(
	name: string,
	returnTypeFunc: ReturnTypeFunc,
	options?: QueryParamOptions,
): ParameterDecorator;
export function QueryParam(
	name: string,
	returnTypeFuncOrOptions?: ReturnTypeFunc | QueryParamOptions,
	maybeOptions?: QueryParamOptions,
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
			mode: 'query',
			propertyName: String(propertyKey),
			isID: (options as QueryParamOptions).isID,
			description: (options as QueryParamOptions).description,
			example: (options as QueryParamOptions).example,
			deprecationReason: (options as QueryParamOptions).deprecationReason,
			...getParamInfo({prototype, propertyKey: propertyKey as string, parameterIndex, returnTypeFunc, options}),
		});
	};
}

