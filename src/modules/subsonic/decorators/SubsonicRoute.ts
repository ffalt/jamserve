import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { MethodOptions, ReturnTypeFunc } from '../../deco/definitions/types.js';
import { BaseAll } from '../../deco/decorators/All.js';

export function SubsonicRoute(routeOrReturnTypeFuncOrOptions?: string | ReturnTypeFunc | MethodOptions, returnTypeFuncOrOptions?: ReturnTypeFunc | MethodOptions, maybeOptions?: MethodOptions): MethodDecorator {
	return BaseAll(getMetadataStorage(), 'xml/json', routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions);
}
