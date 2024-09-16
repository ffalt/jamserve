import {ManyToOneFieldOptions, ManyToOneFieldRelation, MappedByFunc, MethodAndPropDecorator, ReturnTypeFunc} from '../definitions/types.js';
import {registerRelation} from '../helpers/relation-register.js';

export function ManyToOne<T>(
	returnTypeFunction: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: ManyToOneFieldOptions
): MethodAndPropDecorator;
export function ManyToOne<T>(
	returnTypeFunc: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: ManyToOneFieldOptions
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options || {}) as ManyToOneFieldRelation<T>;
		opt.relation = 'many2one';
		opt.mappedBy = mappedBy;
		registerRelation(prototype, propertyKey, returnTypeFunc, opt);
	};
}
