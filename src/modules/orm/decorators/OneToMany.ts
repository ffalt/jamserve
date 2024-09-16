import {MappedByFunc, MethodAndPropDecorator, OneToManyFieldOptions, OneToManyFieldRelation, ReturnTypeFunc} from '../definitions/types.js';
import {registerRelation} from '../helpers/relation-register.js';

export function OneToMany<T>(
	returnTypeFunction: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: OneToManyFieldOptions
): MethodAndPropDecorator;
export function OneToMany<T>(
	returnTypeFunc: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: OneToManyFieldOptions
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		const opt = (options || {}) as OneToManyFieldRelation<T>;
		opt.relation = 'one2many';
		opt.mappedBy = mappedBy;
		registerRelation(prototype, propertyKey, returnTypeFunc, opt);
	};
}
