import {ControllerClassMetadata} from '../definitions/controller-metadata.js';
import {ClassMetadata} from '../definitions/class-metadata.js';

export function iterateControllers(controllerClasses: ControllerClassMetadata[], ctrl: ControllerClassMetadata, onControl: (ctrl: ControllerClassMetadata) => void): void {
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

export function iterateArguments(argumentTypes: ClassMetadata[], argument: ClassMetadata, onArgument: (argument: ClassMetadata) => void): void {
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
