import {DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions} from './types';
import {getMetadataStorage} from '../metadata';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {getParamInfo} from '../helpers/params';

export type BodyParamOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BodyParam(name: string, options?: BodyParamOptions): ParameterDecorator;
export function BodyParam(
	name: string,
	returnTypeFunc: ReturnTypeFunc,
	options?: BodyParamOptions,
): ParameterDecorator;
export function BodyParam(
	name: string,
	returnTypeFuncOrOptions?: ReturnTypeFunc | BodyParamOptions,
	maybeOptions?: BodyParamOptions,
): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex): void => {
		const {options, returnTypeFunc} = getTypeDecoratorParams(
			returnTypeFuncOrOptions,
			maybeOptions,
		);
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'arg',
			name,
			mode: 'body',
			propertyName: String(propertyKey),
			description: (options as BodyParamOptions).description,
			example: (options as BodyParamOptions).example,
			deprecationReason: (options as BodyParamOptions).deprecationReason,
			...getParamInfo({prototype, propertyKey, parameterIndex, returnTypeFunc, options}),
		});
	};
}

