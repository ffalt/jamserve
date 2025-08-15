import { MetadataStorage } from '../definitions/metadata-storage.js';
import { ReturnTypeFunction, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { getParameterInfo } from '../helpers/parameters.js';

export function BaseBodyParameters(
	metadata: MetadataStorage,
	parameterTypeFunctionOrOptions?: ReturnTypeFunction | ValidateOptions,
	maybeOptions?: ValidateOptions
): ParameterDecorator {
	const { options, returnTypeFunc } = getTypeDecoratorParameters(parameterTypeFunctionOrOptions, maybeOptions);
	return (prototype, propertyKey, parameterIndex): void => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		metadata.parameters.push({
			kind: 'args',
			mode: 'body',
			propertyName: propertyKey,
			...getParameterInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
