import { ReturnTypeFunc, SchemaNameOptions } from '../definitions/types.js';

export interface TypeDecoratorParams<T> {
	options: Partial<T>;
	returnTypeFunc?: ReturnTypeFunc;
}

export function getTypeDecoratorParams<T extends object>(
	returnTypeFuncOrOptions: ReturnTypeFunc | T | undefined,
	maybeOptions: T | undefined
): TypeDecoratorParams<T> {
	return typeof returnTypeFuncOrOptions === 'function' ?
		{ returnTypeFunc: returnTypeFuncOrOptions, options: maybeOptions ?? {} } :
		{ options: returnTypeFuncOrOptions ?? {} };
}

export function getNameDecoratorParams<T extends SchemaNameOptions>(
	nameOrOptions: string | T | undefined,
	maybeOptions: T | undefined
): { name?: string; options: T } {
	return typeof nameOrOptions === 'string' ?
		{ name: nameOrOptions, options: maybeOptions ?? ({} as T) } :
		{ options: nameOrOptions ?? ({} as T) };
}
