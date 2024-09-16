import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
export function Post(route, returnTypeFuncOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
    return (prototype, methodName) => {
        if (!route) {
            throw new Error(`Must specify REST route for POST function ${String(methodName)}`);
        }
        const metadata = getMethodMetadata(prototype, methodName, route, returnTypeFunc, options);
        getMetadataStorage().collectPostHandlerMetadata(metadata);
    };
}
//# sourceMappingURL=Post.js.map