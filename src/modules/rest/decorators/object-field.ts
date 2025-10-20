import { metadataStorage } from '../metadata/metadata-storage.js';
import { FieldOptions, MethodAndPropertyDecorator, ReturnTypeFunction } from '../../deco/definitions/types.js';
import { BaseObjField } from '../../deco/decorators/base-obj-field.js';

export function ObjectField(): MethodAndPropertyDecorator;
export function ObjectField(options: FieldOptions): MethodAndPropertyDecorator;
export function ObjectField(returnTypeFunction?: ReturnTypeFunction, options?: FieldOptions): MethodAndPropertyDecorator;
export function ObjectField(returnTypeFunctionOrOptions?: ReturnTypeFunction | FieldOptions, maybeOptions?: FieldOptions): MethodDecorator | PropertyDecorator {
	return BaseObjField(metadataStorage(), returnTypeFunctionOrOptions, maybeOptions);
}
