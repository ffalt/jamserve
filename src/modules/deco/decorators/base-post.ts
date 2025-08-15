import { MethodOptions, ReturnTypeFunction } from '../definitions/types.js';
import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BasePost(
	metadata: MetadataStorage,
	route: string,
	returnTypeFunctionOrOptions?: ReturnTypeFunction | MethodOptions,
	maybeOptions?: MethodOptions
): MethodDecorator {
	const { options, returnTypeFunc } = getTypeDecoratorParameters(returnTypeFunctionOrOptions, maybeOptions);
	return (prototype, methodName) => {
		if (!route) {
			throw new Error(`Must specify REST route for POST function ${String(methodName)}`);
		}
		const mmd = getMethodMetadata(prototype, methodName, 'json', route, returnTypeFunc, options);
		metadata.posts.push(mmd);
	};
}
