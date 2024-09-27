import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {MethodOptions, ReturnTypeFunc} from '../../deco/definitions/types.js';
import {BaseGet} from '../../deco/decorators/Get.js';

export function Get(routeOrReturnTypeFuncOrOptions?: string | ReturnTypeFunc | MethodOptions, returnTypeFuncOrOptions?: ReturnTypeFunc | MethodOptions, maybeOptions?: MethodOptions): MethodDecorator {
	return BaseGet(getMetadataStorage(), routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions);
}
