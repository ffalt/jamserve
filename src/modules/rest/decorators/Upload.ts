import {DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions} from '../definitions/types';
import {getMetadataStorage} from '../metadata';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {getParamInfo} from '../helpers/params';

export type UploadOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function Upload(name: string, options?: UploadOptions): ParameterDecorator;
export function Upload(
	name: string,
	returnTypeFunc: ReturnTypeFunc,
	options?: UploadOptions,
): ParameterDecorator;
export function Upload(
	name: string,
	returnTypeFuncOrOptions?: ReturnTypeFunc | UploadOptions,
	maybeOptions?: UploadOptions,
): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex) => {
		const {options, returnTypeFunc} = getTypeDecoratorParams(
			returnTypeFuncOrOptions,
			maybeOptions,
		);
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'arg',
			name,
			mode: 'file',
			propertyName: String(propertyKey),
			description: (options as UploadOptions).description,
			example: (options as UploadOptions).example,
			deprecationReason: (options as UploadOptions).deprecationReason,
			...getParamInfo({prototype, propertyKey, parameterIndex, returnTypeFunc, options}),
		});
	};
}

