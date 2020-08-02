import {ManyToManyFieldOptions, ManyToManyFieldRelation, MappedByFunc, MethodAndPropDecorator, ReturnTypeFunc} from '../definitions/types';
import {registerRelation} from '../helpers/relation-register';

export function ManyToMany<T>(
	returnTypeFunction: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: ManyToManyFieldOptions<T>,
): MethodAndPropDecorator;
export function ManyToMany<T>(
	returnTypeFunc: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: ManyToManyFieldOptions<T>,
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options || {}) as ManyToManyFieldRelation<T>;
		opt.relation = 'many2many';
		opt.mappedBy = mappedBy;
		registerRelation<T>(prototype, propertyKey, returnTypeFunc, opt);
	};
}
