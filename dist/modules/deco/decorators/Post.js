import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
export function BasePost(metadata, route, returnTypeFuncOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
    return (prototype, methodName) => {
        if (!route) {
            throw new Error(`Must specify REST route for POST function ${String(methodName)}`);
        }
        const mmd = getMethodMetadata(prototype, methodName, 'json', route, returnTypeFunc, options);
        metadata.posts.push(mmd);
    };
}
//# sourceMappingURL=Post.js.map