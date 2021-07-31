import { getMetadataStorage } from '../metadata';
import { getMethodMetadata } from '../helpers/method-metadata';
import { getTypeDecoratorParams } from '../helpers/decorators';
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