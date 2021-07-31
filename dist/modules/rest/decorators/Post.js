import { getMetadataStorage } from '../metadata';
import { getMethodMetadata } from '../helpers/method-metadata';
import { getTypeDecoratorParams } from '../helpers/decorators';
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