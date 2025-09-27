import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
export function BaseGet(metadata, routeOrReturnTypeFunctionOrOptions, returnTypeFunctionOrOptions, maybeOptions) {
    let route = undefined;
    if (typeof routeOrReturnTypeFunctionOrOptions === 'string') {
        route = routeOrReturnTypeFunctionOrOptions;
    }
    else {
        maybeOptions = returnTypeFunctionOrOptions;
        returnTypeFunctionOrOptions = routeOrReturnTypeFunctionOrOptions;
        route = undefined;
    }
    const { options, returnTypeFunc } = getTypeDecoratorParameters(returnTypeFunctionOrOptions, maybeOptions);
    return (prototype, methodName) => {
        const mmd = getMethodMetadata(prototype, methodName, 'json', route, returnTypeFunc, options);
        metadata.gets.push(mmd);
    };
}
//# sourceMappingURL=base-get.js.map