import { MappedByFunction, MethodAndPropertyDecorator, OneToOneFieldOptions, OneToOneFieldRelation, ReturnTypeFunction } from '../definitions/types.js';
import { registerRelation } from '../helpers/relation-register.js';

export function OneToOne<T>(
	returnTypeFunction: ReturnTypeFunction,
	mappedBy: MappedByFunction<T>,
	options?: OneToOneFieldOptions
): MethodAndPropertyDecorator;
export function OneToOne<T>(
	returnTypeFunction: ReturnTypeFunction,
	mappedBy: MappedByFunction<T>,
	options?: OneToOneFieldOptions
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options ?? {}) as OneToOneFieldRelation<T>;
		opt.relation = 'one2one';
		opt.mappedBy = mappedBy;
		registerRelation(prototype, propertyKey, returnTypeFunction, opt);
	};
}
