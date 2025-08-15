import { ManyToOneFieldOptions, ManyToOneFieldRelation, MappedByFunction, MethodAndPropertyDecorator, ReturnTypeFunction } from '../definitions/types.js';
import { registerRelation } from '../helpers/relation-register.js';

export function ManyToOne<T>(
	returnTypeFunction: ReturnTypeFunction,
	mappedBy: MappedByFunction<T>,
	options?: ManyToOneFieldOptions
): MethodAndPropertyDecorator;
export function ManyToOne<T>(
	returnTypeFunction: ReturnTypeFunction,
	mappedBy: MappedByFunction<T>,
	options?: ManyToOneFieldOptions
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options ?? {}) as ManyToOneFieldRelation<T>;
		opt.relation = 'many2one';
		opt.mappedBy = mappedBy;
		registerRelation(prototype, propertyKey, returnTypeFunction, opt);
	};
}
