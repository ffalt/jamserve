import { findType } from '../helpers/findType.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { FieldOptions, ReturnTypeFunc } from '../definitions/types.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BaseObjField(
	metadata: MetadataStorage,
	returnTypeFuncOrOptions?: ReturnTypeFunc | FieldOptions,
	maybeOptions?: FieldOptions
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		if (typeof propertyKey === 'symbol') {
			throw new SymbolKeysNotSupportedError();
		}
		const { options, returnTypeFunc } = getTypeDecoratorParams(
			returnTypeFuncOrOptions,
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
			schemaName: opt.name || propertyKey,
			getType,
			typeOptions,
			target: prototype.constructor,
			description: opt.description,
			deprecationReason: opt.deprecationReason
		});
	};
}
