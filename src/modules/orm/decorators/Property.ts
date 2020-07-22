import {findType} from '../helpers/findType';
import {getMetadataStorage} from '../metadata';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {FieldOptions, MethodAndPropDecorator, ReturnTypeFunc} from '../definitions/types';
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
	return (prototype, propertyKey, descriptor) => {
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
