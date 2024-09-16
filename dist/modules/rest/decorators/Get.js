import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
export function Get(routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions) {
    let route = undefined;
    if (typeof routeOrReturnTypeFuncOrOptions !== 'string') {
        maybeOptions = returnTypeFuncOrOptions;
        returnTypeFuncOrOptions = routeOrReturnTypeFuncOrOptions;
        route = undefined;
    }
    else {
        route = routeOrReturnTypeFuncOrOptions;
    }
    const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
    return (prototype, methodName) => {
        const metadata = getMethodMetadata(prototype, methodName, route, returnTypeFunc, options);
        getMetadataStorage().collectGetHandlerMetadata(metadata);
    };
}
//# sourceMappingURL=Get.js.map