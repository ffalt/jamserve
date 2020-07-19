import {DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions} from './types';
import {getMetadataStorage} from '../metadata';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {getParamInfo} from '../helpers/params';

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
			...getParamInfo({prototype, propertyKey, parameterIndex, returnTypeFunc, options}),
		});
	};
}

