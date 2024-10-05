import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { FieldOptions, MethodAndPropDecorator, ReturnTypeFunc } from '../../deco/definitions/types.js';
import { BaseObjField } from '../../deco/decorators/ObjField.js';

export function ObjField(): MethodAndPropDecorator;
export function ObjField(options: FieldOptions): MethodAndPropDecorator;
export function ObjField(returnTypeFunction?: ReturnTypeFunc, options?: FieldOptions,): MethodAndPropDecorator;
export function ObjField(returnTypeFuncOrOptions?: ReturnTypeFunc | FieldOptions, maybeOptions?: FieldOptions): MethodDecorator | PropertyDecorator {
	return BaseObjField(getMetadataStorage(), returnTypeFuncOrOptions, maybeOptions);
}
