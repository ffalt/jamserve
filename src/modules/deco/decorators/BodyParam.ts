import { SymbolKeysNotSupportedError } from 'type-graphql';
import { DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { getParamInfo } from '../helpers/params.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export type BodyParamOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BaseBodyParam(
	metadata: MetadataStorage,
	name: string,
	returnTypeFuncOrOptions?: ReturnTypeFunc | BodyParamOptions,
	maybeOptions?: BodyParamOptions
): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex): void => {
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
			mode: 'body',
			propertyName: String(propertyKey),
			description: (options as BodyParamOptions).description,
			example: (options as BodyParamOptions).example,
			deprecationReason: (options as BodyParamOptions).deprecationReason,
			...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
