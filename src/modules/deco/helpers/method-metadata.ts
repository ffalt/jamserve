import { findType } from './findType.js';
import { MethodOptions, ReturnTypeFunc } from '../definitions/types.js';
import { MethodMetadata } from '../definitions/method-metadata.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';

export function getMethodMetadata(prototype: object, propertyKey: string | symbol, route?: string, returnTypeFunc?: ReturnTypeFunc, options: MethodOptions = {}): MethodMetadata {
	if (typeof propertyKey === 'symbol') {
		throw new SymbolKeysNotSupportedError();
	}
	const methodName = propertyKey as keyof typeof prototype;
	let getReturnType = undefined;
	let returnTypeOptions = undefined;
	if (returnTypeFunc) {
		const { getType, typeOptions } = findType({
			metadataKey: 'design:returntype',
			prototype,
			propertyKey,
			returnTypeFunc,
			typeOptions: options
		});
		getReturnType = getType;
		returnTypeOptions = typeOptions;
	}
	return {
		methodName,
		route,
		getReturnType,
		returnTypeOptions,
		params: [],
		schemaName: options.name || methodName,
		target: prototype.constructor,
		description: options.description,
		summary: options.summary,
		roles: options.roles,
		customPathParameters: options.customPathParameters,
		aliasRoutes: options.aliasRoutes,
		binary: options.binary,
		responseStringMimeTypes: options.responseStringMimeTypes,
		example: options.example,
		tags: options.tags,
		deprecationReason: options.deprecationReason
	};
}
