import { findType } from '../helpers/findType.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { FieldOptions, MethodAndPropDecorator, ReturnTypeFunc } from '../definitions/types.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';

export function ObjField(): MethodAndPropDecorator;
export function ObjField(options: FieldOptions): MethodAndPropDecorator;
export function ObjField(returnTypeFunction?: ReturnTypeFunc, options?: FieldOptions): MethodAndPropDecorator;
export function ObjField(returnTypeFuncOrOptions?: ReturnTypeFunc | FieldOptions, maybeOptions?: FieldOptions): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		if (typeof propertyKey === 'symbol') {
			throw new SymbolKeysNotSupportedError();
		}
		const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
		const opt = options as FieldOptions;

		const { getType, typeOptions } = findType({
			metadataKey: 'design:type',
			prototype,
			propertyKey,
			returnTypeFunc,
			typeOptions: opt
		});

		getMetadataStorage().collectClassFieldMetadata({
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
