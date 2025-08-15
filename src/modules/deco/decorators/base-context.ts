import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BaseContext(metadata: MetadataStorage, propertyName?: string): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex): void => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		metadata.parameters.push({
			kind: 'context',
			target: prototype.constructor,
			methodName: propertyKey,
			index: parameterIndex,
			propertyName
		});
	};
}
