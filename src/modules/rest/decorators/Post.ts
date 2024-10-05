import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { MethodOptions, ReturnTypeFunc } from '../../deco/definitions/types.js';
import { BasePost } from '../../deco/decorators/Post.js';

export function Post(route: string, returnTypeFuncOrOptions?: ReturnTypeFunc | MethodOptions, maybeOptions?: MethodOptions): MethodDecorator {
	return BasePost(getMetadataStorage(), route, returnTypeFuncOrOptions, maybeOptions);
}
