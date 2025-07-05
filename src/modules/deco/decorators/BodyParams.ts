import { MetadataStorage } from '../definitions/metadata-storage.js';
import { ReturnTypeFunc, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { getParamInfo } from '../helpers/params.js';

export function BaseBodyParams(
	metadata: MetadataStorage,
	paramTypeFnOrOptions?: ReturnTypeFunc | ValidateOptions,
	maybeOptions?: ValidateOptions
): ParameterDecorator {
	const { options, returnTypeFunc } = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
	return (prototype, propertyKey, parameterIndex): void => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		metadata.params.push({
			kind: 'args',
			mode: 'body',
			propertyName: String(propertyKey),
			...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
