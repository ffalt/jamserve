import { MethodOptions, ReturnTypeFunc } from '../definitions/types.js';
import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BaseAll(
	metadata: MetadataStorage,
	defaultFormat: string,
	routeOrReturnTypeFuncOrOptions?: string | ReturnTypeFunc | MethodOptions,
	returnTypeFuncOrOptions?: ReturnTypeFunc | MethodOptions,
	maybeOptions?: MethodOptions
): MethodDecorator {
	let route: string | undefined = undefined;
	if (typeof routeOrReturnTypeFuncOrOptions === 'string') {
		route = routeOrReturnTypeFuncOrOptions;
	} else {
		maybeOptions = returnTypeFuncOrOptions as MethodOptions;
		returnTypeFuncOrOptions = routeOrReturnTypeFuncOrOptions;
		route = undefined;
	}
	const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
	return (prototype, methodName) => {
		const mmd = getMethodMetadata(prototype, methodName, defaultFormat, route, returnTypeFunc, options);
		metadata.all.push(mmd);
	};
}
