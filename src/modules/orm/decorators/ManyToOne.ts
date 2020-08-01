import {ManyToOneFieldOptions, ManyToOneFieldRelation, MappedByFunc, MethodAndPropDecorator, ReturnTypeFunc} from '../definitions/types';
import {registerRelation} from '../helpers/relation-register';

export function ManyToOne<T>(
	returnTypeFunction: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: ManyToOneFieldOptions<T>
): MethodAndPropDecorator;
export function ManyToOne<T>(
	returnTypeFunc: ReturnTypeFunc,
	mappedBy: MappedByFunc<T>,
	options?: ManyToOneFieldOptions<T>
): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, descriptor) => {
		const opt = (options || {}) as ManyToOneFieldRelation<T>;
		opt.relation = 'many2one';
		opt.mappedBy = mappedBy;
		registerRelation<T>(prototype, propertyKey, returnTypeFunc, opt);
	};
}
