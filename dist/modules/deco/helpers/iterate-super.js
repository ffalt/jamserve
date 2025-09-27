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
export function iterateParameters(parameterTypes, argument, onParameter) {
    onParameter(argument);
    let superClass = Object.getPrototypeOf(argument.target);
    while (superClass.prototype !== undefined) {
        const superParameterType = parameterTypes.find(it => it.target === superClass);
        if (superParameterType) {
            onParameter(superParameterType);
        }
        superClass = Object.getPrototypeOf(superClass);
    }
}
//# sourceMappingURL=iterate-super.js.map