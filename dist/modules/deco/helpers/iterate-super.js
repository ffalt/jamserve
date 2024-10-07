export function iterateControllers(controllerClasses, ctrl, onControl) {
    onControl(ctrl);
    let superClass = Object.getPrototypeOf(ctrl.target);
    while (superClass.prototype !== undefined) {
        const superClassType = controllerClasses.find(it => it.target === superClass);
        if (superClassType) {
            onControl(superClassType);
        }
        superClass = Object.getPrototypeOf(superClass);
    }
}
export function iterateArguments(argumentTypes, argument, onArgument) {
    onArgument(argument);
    let superClass = Object.getPrototypeOf(argument.target);
    while (superClass.prototype !== undefined) {
        const superArgumentType = argumentTypes.find(it => it.target === superClass);
        if (superArgumentType) {
            onArgument(superArgumentType);
        }
        superClass = Object.getPrototypeOf(superClass);
    }
}
//# sourceMappingURL=iterate-super.js.map