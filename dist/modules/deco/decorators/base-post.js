import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
export function BasePost(metadata, route, returnTypeFunctionOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = getTypeDecoratorParameters(returnTypeFunctionOrOptions, maybeOptions);
    return (prototype, methodName) => {
        if (!route) {
            throw new Error(`Must specify REST route for POST function ${String(methodName)}`);
        }
        const mmd = getMethodMetadata(prototype, methodName, 'json', route, returnTypeFunc, options);
        metadata.posts.push(mmd);
    };
}
//# sourceMappingURL=base-post.js.map