import { findType } from '../helpers/find-type.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { FieldOptions, ReturnTypeFunction } from '../definitions/types.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BaseObjField(
	metadata: MetadataStorage,
	returnTypeFunctionOrOptions?: ReturnTypeFunction | FieldOptions,
	maybeOptions?: FieldOptions
): MethodDecorator | PropertyDecorator {
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

		metadata.fields.push({
			name: propertyKey,
			schemaName: opt.name ?? propertyKey,
			getType,
			typeOptions,
			target: prototype.constructor,
			description: opt.description,
			deprecationReason: opt.deprecationReason
		});
	};
}
