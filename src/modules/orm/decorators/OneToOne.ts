import {MappedByFunc, MethodAndPropDecorator, OneToOneFieldOptions, OneToOneFieldRelation, ReturnTypeFunc} from '../definitions/types';
import {registerRelation} from '../helpers/relation-register';

export function OneToOne<T>(
	returnTypeFunction: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: OneToOneFieldOptions<T>
): MethodAndPropDecorator;
export function OneToOne<T>(
	returnTypeFunc: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: OneToOneFieldOptions<T>,
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, descriptor) => {
		const opt = (options || {}) as OneToOneFieldRelation<T>;
		opt.relation = 'one2one';
		opt.mappedBy = mappedBy;
		registerRelation<T>(prototype, propertyKey, returnTypeFunc, opt);
	};
}
