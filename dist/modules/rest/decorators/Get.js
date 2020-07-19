"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = void 0;
const metadata_1 = require("../metadata");
const method_metadata_1 = require("../helpers/method-metadata");
const decorators_1 = require("../helpers/decorators");
function Get(routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions) {
    let route = undefined;
    if (typeof routeOrReturnTypeFuncOrOptions !== 'string') {
        maybeOptions = returnTypeFuncOrOptions;
        returnTypeFuncOrOptions = routeOrReturnTypeFuncOrOptions;
        route = undefined;
    }
    else {
        route = routeOrReturnTypeFuncOrOptions;
    }
    const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
    return (prototype, methodName) => {
        const metadata = method_metadata_1.getMethodMetadata(prototype, methodName, route, returnTypeFunc, options);
        metadata_1.getMetadataStorage().collectGetHandlerMetadata(metadata);
    };
}
exports.Get = Get;
//# sourceMappingURL=Get.js.map