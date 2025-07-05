import { DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { getParamInfo } from '../helpers/params.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export type UploadOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BaseUpload(
	metadata: MetadataStorage,
	name: string,
	returnTypeFuncOrOptions?: ReturnTypeFunc | UploadOptions,
	maybeOptions?: UploadOptions
): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex) => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		const { options, returnTypeFunc } = getTypeDecoratorParams(
			returnTypeFuncOrOptions,
			maybeOptions
		);
		metadata.params.push({
			kind: 'arg',
			name,
			mode: 'file',
			propertyName: String(propertyKey),
			description: (options as UploadOptions).description,
			example: (options as UploadOptions).example,
			deprecationReason: (options as UploadOptions).deprecationReason,
			...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
