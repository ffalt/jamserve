import { MappedByFunction, MethodAndPropertyDecorator, OneToManyFieldOptions, OneToManyFieldRelation, ReturnTypeFunction } from '../definitions/types.js';
import { registerRelation } from '../helpers/relation-register.js';

export function OneToMany<T>(
	returnTypeFunction: ReturnTypeFunction,
	mappedBy: MappedByFunction<T>,
	options?: OneToManyFieldOptions
): MethodAndPropertyDecorator;
export function OneToMany<T>(
	returnTypeFunction: ReturnTypeFunction,
	mappedBy: MappedByFunction<T>,
	options?: OneToManyFieldOptions
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options ?? {}) as OneToManyFieldRelation<T>;
		opt.relation = 'one2many';
		opt.mappedBy = mappedBy;
		registerRelation(prototype, propertyKey, returnTypeFunction, opt);
	};
}
