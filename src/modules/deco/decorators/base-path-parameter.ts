import { DecoratorTypeOptions, FieldOptions, ReturnTypeFunction, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { getParameterInfo } from '../helpers/parameters.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export type PathParameterOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BasePathParameter(
	metadata: MetadataStorage,
	name: string,
	returnTypeFunctionOrOptions?: ReturnTypeFunction | PathParameterOptions,
	maybeOptions?: PathParameterOptions
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
			mode: 'path',
			propertyName: propertyKey,
			description: (options as PathParameterOptions).description,
			example: (options as PathParameterOptions).example,
			deprecationReason: (options as PathParameterOptions).deprecationReason,
			...getParameterInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
