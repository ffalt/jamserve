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
	return (prototype, propertyKey, descriptor) => {
		const opt = (options || {}) as OneToManyFieldRelation<T>;
		opt.relation = 'one2many';
		opt.mappedBy = mappedBy;
		registerRelation<T>(prototype, propertyKey, returnTypeFunc, opt);
	};
}
