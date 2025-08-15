import { ManyToManyFieldOptions, ManyToManyFieldRelation, MappedByFunction, MethodAndPropertyDecorator, ReturnTypeFunction } from '../definitions/types.js';
import { registerRelation } from '../helpers/relation-register.js';

export function ManyToMany<T>(
	returnTypeFunction: ReturnTypeFunction,
	mappedBy: MappedByFunction<T>,
	options?: ManyToManyFieldOptions,
): MethodAndPropertyDecorator;
export function ManyToMany<T>(
	returnTypeFunction: ReturnTypeFunction,
	mappedBy: MappedByFunction<T>,
	options?: ManyToManyFieldOptions
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options ?? {}) as ManyToManyFieldRelation<T>;
		opt.relation = 'many2many';
		opt.mappedBy = mappedBy;
		registerRelation(prototype, propertyKey, returnTypeFunction, opt);
	};
}
