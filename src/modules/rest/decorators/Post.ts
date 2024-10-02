import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { MethodOptions, ReturnTypeFunc } from '../definitions/types.js';
import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';

export function Post(route: string, returnTypeFuncOrOptions?: ReturnTypeFunc | MethodOptions, maybeOptions?: MethodOptions): MethodDecorator {
	const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
	return (prototype, methodName) => {
		if (!route) {
			throw new Error(`Must specify REST route for POST function ${String(methodName)}`);
		}
		const metadata = getMethodMetadata(prototype, methodName, route, returnTypeFunc, options);
		getMetadataStorage().collectPostHandlerMetadata(metadata);
	};
}
