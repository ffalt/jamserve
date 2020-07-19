"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const metadata_1 = require("../metadata");
const method_metadata_1 = require("../helpers/method-metadata");
const decorators_1 = require("../helpers/decorators");
function Post(route, returnTypeFuncOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
    return (prototype, methodName) => {
        if (!route) {
            throw new Error(`Must specify REST route for POST function ${String(methodName)}`);
        }
        const metadata = method_metadata_1.getMethodMetadata(prototype, methodName, route, returnTypeFunc, options);
        metadata_1.getMetadataStorage().collectPostHandlerMetadata(metadata);
    };
}
exports.Post = Post;
//# sourceMappingURL=Post.js.map