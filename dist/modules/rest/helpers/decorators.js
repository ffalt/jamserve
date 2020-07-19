"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameDecoratorParams = exports.getTypeDecoratorParams = void 0;
function getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions) {
    if (typeof returnTypeFuncOrOptions === 'function') {
        return {
            returnTypeFunc: returnTypeFuncOrOptions,
            options: maybeOptions || {},
        };
    }
    else {
        return {
            options: returnTypeFuncOrOptions || {},
        };
    }
}
exports.getTypeDecoratorParams = getTypeDecoratorParams;
function getNameDecoratorParams(nameOrOptions, maybeOptions) {
    if (typeof nameOrOptions === 'string') {
        return {
            name: nameOrOptions,
            options: maybeOptions || {},
        };
    }
    else {
        return {
            options: nameOrOptions || {},
        };
    }
}
exports.getNameDecoratorParams = getNameDecoratorParams;
//# sourceMappingURL=decorators.js.map