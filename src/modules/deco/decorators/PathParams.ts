import { ReturnTypeFunc, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { getParamInfo } from '../helpers/params.js';
import { extractPropertyName } from '../helpers/extract-property-name.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BasePathParams(
	metadata: MetadataStorage,
	paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions,
	maybeOptions?: ValidateOptions
): ParameterDecorator {
	const { options, returnTypeFunc } = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
	return (prototype, propertyKey, parameterIndex) => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		metadata.params.push({
			kind: 'args',
			mode: 'path',
			propertyName: extractPropertyName(prototype, propertyKey, parameterIndex),
			...getParamInfo({ prototype, propertyKey: propertyKey as string, parameterIndex, returnTypeFunc, options })
		});
	};
}
