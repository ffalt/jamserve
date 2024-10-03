import { MethodOptions, ReturnTypeFunc } from '../definitions/types.js';
import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BasePost(
	metadata: MetadataStorage,
	route: string,
	returnTypeFuncOrOptions?: ReturnTypeFunc | MethodOptions,
	maybeOptions?: MethodOptions
): MethodDecorator {
	const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
	return (prototype, methodName) => {
		if (!route) {
			throw new Error(`Must specify REST route for POST function ${String(methodName)}`);
		}
		const mmd = getMethodMetadata(prototype, methodName, route, returnTypeFunc, options);
		metadata.posts.push(mmd);
	};
}
