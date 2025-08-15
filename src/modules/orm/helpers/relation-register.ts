import { findType } from './find-type.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { FieldOptions, ReturnTypeFunction } from '../definitions/types.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';

export function registerRelation(
	// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
	prototype: Object,
	propertyKey: string | symbol,
	returnTypeFunction: ReturnTypeFunction,
	opt: FieldOptions
): void {
	if (typeof propertyKey === 'symbol') {
		throw new SymbolKeysNotSupportedError();
	}
	const { getType, typeOptions } = findType({
		metadataKey: 'design:type',
		prototype,
		propertyKey,
		returnTypeFunc: returnTypeFunction,
		typeOptions: opt
	});
	metadataStorage().fields.push({
		name: propertyKey,
		getType,
		typeOptions,
		isRelation: true,
		target: prototype.constructor
	});
}
