export function getTypeDecoratorParameters(returnTypeFunctionOrOptions, maybeOptions) {
    return typeof returnTypeFunctionOrOptions === 'function' ?
        { returnTypeFunc: returnTypeFunctionOrOptions, options: maybeOptions ?? {} } :
        { options: returnTypeFunctionOrOptions ?? {} };
}
export function getNameDecoratorParameters(nameOrOptions, maybeOptions) {
    return typeof nameOrOptions === 'string' ?
        { name: nameOrOptions, options: maybeOptions ?? {} } :
        { options: nameOrOptions ?? {} };
}
//# sourceMappingURL=decorators.js.map