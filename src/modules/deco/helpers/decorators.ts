import { DescriptionOptions, ReturnTypeFunction } from '../definitions/types.js';

export interface TypeDecoratorParameters<T> {
	options: Partial<T>;
	returnTypeFunc?: ReturnTypeFunction;
}

export function getTypeDecoratorParameters<T extends object>(
	returnTypeFunctionOrOptions: ReturnTypeFunction | T | undefined,
	maybeOptions: T | undefined
): TypeDecoratorParameters<T> {
	return typeof returnTypeFunctionOrOptions === 'function' ?
		{ returnTypeFunc: returnTypeFunctionOrOptions, options: maybeOptions ?? {} } :
		{ options: returnTypeFunctionOrOptions ?? {} };
}

export function getNameDecoratorParameters<T extends DescriptionOptions>(
	nameOrOptions: string | T | undefined,
	maybeOptions: T | undefined
): { name?: string; options: T } {
	return typeof nameOrOptions === 'string' ?
		{ name: nameOrOptions, options: maybeOptions ?? ({} as T) } :
		{ options: nameOrOptions ?? ({} as T) };
}
