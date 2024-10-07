import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
export function BaseAll(metadata, defaultFormat, routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions) {
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
        const mmd = getMethodMetadata(prototype, methodName, defaultFormat, route, returnTypeFunc, options);
        metadata.all.push(mmd);
    };
}
//# sourceMappingURL=All.js.map