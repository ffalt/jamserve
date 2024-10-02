import { MappedByFunc, MethodAndPropDecorator, OneToOneFieldOptions, OneToOneFieldRelation, ReturnTypeFunc } from '../definitions/types.js';
import { registerRelation } from '../helpers/relation-register.js';

export function OneToOne<T>(
	returnTypeFunction: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: OneToOneFieldOptions
): MethodAndPropDecorator;
export function OneToOne<T>(
	returnTypeFunc: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: OneToOneFieldOptions
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options || {}) as OneToOneFieldRelation<T>;
		opt.relation = 'one2one';
		opt.mappedBy = mappedBy;
		registerRelation(prototype, propertyKey, returnTypeFunc, opt);
	};
}
