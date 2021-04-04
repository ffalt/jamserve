"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterateArguments = exports.iterateControllers = void 0;
function iterateControllers(metadata, ctrl, onControl) {
    onControl(ctrl);
    let superClass = Object.getPrototypeOf(ctrl.target);
    while (superClass.prototype !== undefined) {
        const superClassType = metadata.controllerClasses.find(it => it.target === superClass);
        if (superClassType) {
            onControl(superClassType);
        }
        superClass = Object.getPrototypeOf(superClass);
    }
}
exports.iterateControllers = iterateControllers;
function iterateArguments(metadata, argument, onArgument) {
    onArgument(argument);
    let superClass = Object.getPrototypeOf(argument.target);
    while (superClass.prototype !== undefined) {
        const superArgumentType = metadata.argumentTypes.find(it => it.target === superClass);
        if (superArgumentType) {
            onArgument(superArgumentType);
        }
        superClass = Object.getPrototypeOf(superClass);
    }
}
exports.iterateArguments = iterateArguments;
//# sourceMappingURL=iterate-super.js.map