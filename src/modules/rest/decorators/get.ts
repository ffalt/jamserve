import { metadataStorage } from '../metadata/metadata-storage.js';
import { MethodOptions, ReturnTypeFunction } from '../../deco/definitions/types.js';
import { BaseGet } from '../../deco/decorators/base-get.js';

export function Get(routeOrReturnTypeFunctionOrOptions?: string | ReturnTypeFunction | MethodOptions, returnTypeFunctionOrOptions?: ReturnTypeFunction | MethodOptions, maybeOptions?: MethodOptions): MethodDecorator {
	return BaseGet(metadataStorage(), routeOrReturnTypeFunctionOrOptions, returnTypeFunctionOrOptions, maybeOptions);
}
