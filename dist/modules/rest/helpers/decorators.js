export function getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions) {
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
export function getNameDecoratorParams(nameOrOptions, maybeOptions) {
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
//# sourceMappingURL=decorators.js.map