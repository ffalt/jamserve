import {findType} from './findType';
import {getMetadataStorage} from '../metadata';
import {FieldOptions, ReturnTypeFunc} from '../definitions/types';
import {SymbolKeysNotSupportedError} from 'type-graphql';

export function registerRelation(
	// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
	prototype: Object,
	propertyKey: string | symbol,
	returnTypeFunc: ReturnTypeFunc,
	opt: FieldOptions
): void {
	if (typeof propertyKey === 'symbol') {
		throw new SymbolKeysNotSupportedError();
	}
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
		isRelation: true,
		target: prototype.constructor
	});
}
