import {getMetadataStorage} from '../metadata';
import {SymbolKeysNotSupportedError} from 'type-graphql';

export function Ctx(propertyName?: string): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex): void => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'context',
			target: prototype.constructor,
			methodName: propertyKey,
			index: parameterIndex,
			propertyName,
		});
	};
}
