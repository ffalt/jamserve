import { ManyToManyFieldOptions, ManyToManyFieldRelation, MappedByFunc, MethodAndPropDecorator, ReturnTypeFunc } from '../definitions/types.js';
import { registerRelation } from '../helpers/relation-register.js';

export function ManyToMany<T>(
	returnTypeFunction: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: ManyToManyFieldOptions,
): MethodAndPropDecorator;
export function ManyToMany<T>(
	returnTypeFunc: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: ManyToManyFieldOptions
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options || {}) as ManyToManyFieldRelation<T>;
		opt.relation = 'many2many';
		opt.mappedBy = mappedBy;
		registerRelation(prototype, propertyKey, returnTypeFunc, opt);
	};
}
