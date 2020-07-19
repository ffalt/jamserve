import {findType} from '../helpers/findType';
import {getMetadataStorage} from '../metadata';
import {getTypeDecoratorParams} from '../helpers/decorators';
import {FieldOptions, MethodAndPropDecorator, ReturnTypeFunc} from './types';
import {SymbolKeysNotSupportedError} from 'type-graphql';

export function ObjField(): MethodAndPropDecorator;
export function ObjField(options: FieldOptions): MethodAndPropDecorator;
export function ObjField(
	returnTypeFunction?: ReturnTypeFunc,
	options?: FieldOptions,
): MethodAndPropDecorator;
export function ObjField(
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
		const isResolver = Boolean(descriptor);
		const isResolverMethod = Boolean(descriptor && descriptor.value);

		const {getType, typeOptions} = findType({
			metadataKey: isResolverMethod ? 'design:returntype' : 'design:type',
			prototype,
			propertyKey,
			returnTypeFunc,
			typeOptions: opt,
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

		if (isResolver) {
			getMetadataStorage().collectFieldResolverMetadata({
				kind: 'internal',
				methodName: propertyKey,
				schemaName: opt.name || propertyKey,
				target: prototype.constructor
			});
		}
	};
}
