import { findType } from './find-type.js';
import { ReturnTypeFunction, TypeOptions, ValidateOptions } from '../definitions/types.js';
import { CommonParameterMetadata } from '../definitions/parameter-metadata.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';

export interface ParameterInfo {
	prototype: object;
	propertyKey: string | symbol | undefined;
	parameterIndex: number;
	argName?: string;
	returnTypeFunc?: ReturnTypeFunction;
	options?: TypeOptions & ValidateOptions;
}

export function getParameterInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options = {} }: ParameterInfo): CommonParameterMetadata {
	if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
		throw new SymbolKeysNotSupportedError();
	}

	const { getType, typeOptions } = findType({
		metadataKey: 'design:paramtypes',
		prototype,
		propertyKey,
		parameterIndex,
		returnTypeFunc,
		typeOptions: options
	});

	return {
		target: prototype.constructor,
		methodName: propertyKey,
		index: parameterIndex,
		getType,
		typeOptions,
		validate: options.validate
	};
}
