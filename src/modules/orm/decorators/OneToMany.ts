import {MappedByFunc, MethodAndPropDecorator, OneToManyFieldOptions, OneToManyFieldRelation, ReturnTypeFunc} from '../definitions/types';
import {registerRelation} from '../helpers/relation-register';

export function OneToMany<T>(
	returnTypeFunction: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: OneToManyFieldOptions<T>,
): MethodAndPropDecorator;
export function OneToMany<T>(
	returnTypeFunc: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: OneToManyFieldOptions<T>,
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options || {}) as OneToManyFieldRelation<T>;
		opt.relation = 'one2many';
		opt.mappedBy = mappedBy;
		registerRelation(prototype, propertyKey, returnTypeFunc, opt);
	};
}
