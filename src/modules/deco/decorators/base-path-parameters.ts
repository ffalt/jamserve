import { ReturnTypeFunction, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { getParameterInfo } from '../helpers/parameters.js';
import { extractPropertyName } from '../helpers/extract-property-name.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BasePathParameters(
	metadata: MetadataStorage,
	parameterTypeFunctionOrOptions?: ReturnTypeFunction | ValidateOptions,
	maybeOptions?: ValidateOptions
): ParameterDecorator {
	const { options, returnTypeFunc } = getTypeDecoratorParameters(parameterTypeFunctionOrOptions, maybeOptions);
	return (prototype, propertyKey, parameterIndex) => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		metadata.parameters.push({
			kind: 'args',
			mode: 'path',
			propertyName: extractPropertyName(prototype, propertyKey, parameterIndex),
			...getParameterInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
