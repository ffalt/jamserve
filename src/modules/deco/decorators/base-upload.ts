import { DecoratorTypeOptions, FieldOptions, ReturnTypeFunction, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { getParameterInfo } from '../helpers/parameters.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export type UploadOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BaseUpload(
	metadata: MetadataStorage,
	name: string,
	returnTypeFunctionOrOptions?: ReturnTypeFunction | UploadOptions,
	maybeOptions?: UploadOptions
): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex) => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		const { options, returnTypeFunc } = getTypeDecoratorParameters(
			returnTypeFunctionOrOptions,
			maybeOptions
		);
		metadata.parameters.push({
			kind: 'arg',
			name,
			mode: 'file',
			propertyName: propertyKey,
			description: (options as UploadOptions).description,
			example: (options as UploadOptions).example,
			deprecationReason: (options as UploadOptions).deprecationReason,
			...getParameterInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
