import { metadataStorage } from '../metadata/metadata-storage.js';
import { MethodOptions, ReturnTypeFunction } from '../../deco/definitions/types.js';
import { BaseAll } from '../../deco/decorators/base-all.js';

export function SubsonicRoute(routeOrReturnTypeFunctionOrOptions?: string | ReturnTypeFunction | MethodOptions, returnTypeFunctionOrOptions?: ReturnTypeFunction | MethodOptions, maybeOptions?: MethodOptions): MethodDecorator {
	return BaseAll(metadataStorage(), 'xml/json', routeOrReturnTypeFunctionOrOptions, returnTypeFunctionOrOptions, maybeOptions);
}
