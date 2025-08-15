import { DecoratorTypeOptions, FieldOptions, ReturnTypeFunction, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { getParameterInfo } from '../helpers/parameters.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export type QueryParameterOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BaseQueryParameter(
	metadata: MetadataStorage,
	name: string,
	returnTypeFunctionOrOptions?: ReturnTypeFunction | QueryParameterOptions,
	maybeOptions?: QueryParameterOptions
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
			mode: 'query',
			propertyName: propertyKey,
			isID: (options as QueryParameterOptions).isID,
			description: (options as QueryParameterOptions).description,
			example: (options as QueryParameterOptions).example,
			deprecationReason: (options as QueryParameterOptions).deprecationReason,
			...getParameterInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
