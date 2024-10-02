import { DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions } from '../definitions/types.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { getParamInfo } from '../helpers/params.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';

export type UploadOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function Upload(name: string, options?: UploadOptions): ParameterDecorator;
export function Upload(name: string, returnTypeFunc: ReturnTypeFunc, options?: UploadOptions): ParameterDecorator;
export function Upload(name: string, returnTypeFuncOrOptions?: ReturnTypeFunc | UploadOptions, maybeOptions?: UploadOptions): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex) => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'arg',
			name,
			mode: 'file',
			propertyName: String(propertyKey),
			description: (options as UploadOptions).description,
			example: (options as UploadOptions).example,
			deprecationReason: (options as UploadOptions).deprecationReason,
			...getParamInfo({ prototype, propertyKey: propertyKey as string, parameterIndex, returnTypeFunc, options })
		});
	};
}
