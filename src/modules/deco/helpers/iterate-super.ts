import { ControllerClassMetadata } from '../definitions/controller-metadata.js';
import { ClassMetadata } from '../definitions/class-metadata.js';

export function iterateControllers(controllerClasses: Array<ControllerClassMetadata>, ctrl: ControllerClassMetadata, onControl: (ctrl: ControllerClassMetadata) => void): void {
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

export function iterateParameters(parameterTypes: Array<ClassMetadata>, argument: ClassMetadata, onParameter: (metadata: ClassMetadata) => void): void {
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
