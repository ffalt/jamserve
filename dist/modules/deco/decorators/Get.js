import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
export function BaseGet(metadata, routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions) {
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
        const mmd = getMethodMetadata(prototype, methodName, 'json', route, returnTypeFunc, options);
        metadata.gets.push(mmd);
    };
}
//# sourceMappingURL=Get.js.map