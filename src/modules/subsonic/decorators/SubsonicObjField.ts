import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {FieldOptions, MethodAndPropDecorator, ReturnTypeFunc} from '../../deco/definitions/types.js';
import {BaseObjField} from '../../deco/decorators/ObjField.js';

export function SubsonicObjField(): MethodAndPropDecorator;
export function SubsonicObjField(options: FieldOptions): MethodAndPropDecorator;
export function SubsonicObjField(returnTypeFunction?: ReturnTypeFunc, options?: FieldOptions): MethodAndPropDecorator;
export function SubsonicObjField(returnTypeFuncOrOptions?: ReturnTypeFunc | FieldOptions, maybeOptions?: FieldOptions): MethodDecorator | PropertyDecorator {
	return BaseObjField(getMetadataStorage(), returnTypeFuncOrOptions, maybeOptions);
}
