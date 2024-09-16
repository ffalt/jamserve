import {findType} from '../helpers/findType.js';
import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {getTypeDecoratorParams} from '../helpers/decorators.js';
import {FieldOptions, MethodAndPropDecorator, ReturnTypeFunc} from '../definitions/types.js';
import {SymbolKeysNotSupportedError} from 'type-graphql';

export function Property(): MethodAndPropDecorator;
export function Property(options: FieldOptions): MethodAndPropDecorator;
export function Property(
	returnTypeFunction?: ReturnTypeFunc,
	options?: FieldOptions,
): MethodAndPropDecorator;
export function Property(
	returnTypeFuncOrOptions?: ReturnTypeFunc | FieldOptions,
	maybeOptions?: FieldOptions,
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		if (typeof propertyKey === 'symbol') {
			throw new SymbolKeysNotSupportedError();
		}
		const {options, returnTypeFunc} = getTypeDecoratorParams(
			returnTypeFuncOrOptions,
			maybeOptions
		);
		const opt = options as FieldOptions;
		const {getType, typeOptions} = findType({
			metadataKey: 'design:type',
			prototype,
			propertyKey,
			returnTypeFunc,
			typeOptions: opt,
		});
		getMetadataStorage().collectPropertyMetadata({
			name: propertyKey,
			getType,
			typeOptions,
			target: prototype.constructor
		});
	};
}
