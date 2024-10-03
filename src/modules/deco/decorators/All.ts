import { MethodOptions, ReturnTypeFunc } from '../definitions/types.js';
import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BaseAll(
	metadata: MetadataStorage,
	routeOrReturnTypeFuncOrOptions?: string | ReturnTypeFunc | MethodOptions,
	returnTypeFuncOrOptions?: ReturnTypeFunc | MethodOptions,
	maybeOptions?: MethodOptions
): MethodDecorator {
	let route: string | undefined = undefined;
	if (typeof routeOrReturnTypeFuncOrOptions !== 'string') {
		maybeOptions = returnTypeFuncOrOptions as any;
		returnTypeFuncOrOptions = routeOrReturnTypeFuncOrOptions as any;
		route = undefined;
	} else {
		route = routeOrReturnTypeFuncOrOptions as string;
	}
	const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
	return (prototype, methodName) => {
		const mmd = getMethodMetadata(prototype, methodName, route, returnTypeFunc, options);
		metadata.all.push(mmd);
	};
}
