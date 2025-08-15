import { metadataStorage } from '../metadata/metadata-storage.js';
import { MethodOptions, ReturnTypeFunction } from '../../deco/definitions/types.js';
import { BasePost } from '../../deco/decorators/base-post.js';

export function Post(route: string, returnTypeFunctionOrOptions?: ReturnTypeFunction | MethodOptions, maybeOptions?: MethodOptions): MethodDecorator {
	return BasePost(metadataStorage(), route, returnTypeFunctionOrOptions, maybeOptions);
}
