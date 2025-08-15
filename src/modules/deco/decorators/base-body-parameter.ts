import { SymbolKeysNotSupportedError } from 'type-graphql';
import { DecoratorTypeOptions, FieldOptions, ReturnTypeFunction, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { getParameterInfo } from '../helpers/parameters.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export type BodyParameterOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BaseBodyParameter(
	metadata: MetadataStorage,
	name: string,
	returnTypeFunctionOrOptions?: ReturnTypeFunction | BodyParameterOptions,
	maybeOptions?: BodyParameterOptions
): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex): void => {
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
			mode: 'body',
			propertyName: propertyKey,
			description: (options as BodyParameterOptions).description,
			example: (options as BodyParameterOptions).example,
			deprecationReason: (options as BodyParameterOptions).deprecationReason,
			...getParameterInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
