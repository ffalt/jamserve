import { findType } from '../helpers/find-type.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { FieldOptions, MethodAndPropertyDecorator, ReturnTypeFunction } from '../definitions/types.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';

export function Property(): MethodAndPropertyDecorator;
export function Property(options: FieldOptions): MethodAndPropertyDecorator;
export function Property(returnTypeFunction?: ReturnTypeFunction, options?: FieldOptions): MethodAndPropertyDecorator;
export function Property(returnTypeFunctionOrOptions?: ReturnTypeFunction | FieldOptions, maybeOptions?: FieldOptions): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		if (typeof propertyKey === 'symbol') {
			throw new SymbolKeysNotSupportedError();
		}
		const { options, returnTypeFunc } = getTypeDecoratorParameters(
			returnTypeFunctionOrOptions,
			maybeOptions
		);
		const opt = options as FieldOptions;
		const { getType, typeOptions } = findType({
			metadataKey: 'design:type',
			prototype,
			propertyKey,
			returnTypeFunc,
			typeOptions: opt
		});
		metadataStorage().fields.push({
			name: propertyKey,
			getType,
			typeOptions,
			target: prototype.constructor
		});
	};
}
